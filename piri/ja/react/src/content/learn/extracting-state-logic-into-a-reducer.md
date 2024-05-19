---
title: Reducer に状態ロジックを抽出する
---

<Intro>

多くのイベントハンドラーにわたって多くの状態更新があるコンポーネントは圧倒されることがあります。このような場合、コンポーネントの外部にすべての状態更新ロジックを統合し、_reducer_と呼ばれる単一の関数にまとめることができます。

</Intro>

<YouWillLearn>

- reducer関数とは何か
- `useState`を`useReducer`にリファクタリングする方法
- reducerを使用するタイミング
- 良いreducerの書き方

</YouWillLearn>

## reducerで状態ロジックを統合する {/*consolidate-state-logic-with-a-reducer*/}

コンポーネントが複雑になるにつれて、コンポーネントの状態がどのように更新されるかを一目で把握するのが難しくなることがあります。例えば、以下の`TaskApp`コンポーネントは状態に`tasks`の配列を保持し、タスクを追加、削除、編集するために3つの異なるイベントハンドラーを使用しています：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

各イベントハンドラーは状態を更新するために`setTasks`を呼び出します。このコンポーネントが成長するにつれて、状態ロジックが散在する量も増えます。この複雑さを減らし、すべてのロジックを簡単にアクセスできる場所にまとめるために、その状態ロジックをコンポーネントの外部にある単一の関数、**「reducer」と呼ばれる関数**に移動することができます。

Reducersは状態を処理するための異なる方法です。`useState`から`useReducer`に移行するには、3つのステップがあります：

1. 状態設定からアクションのディスパッチに**移行**する。
2. reducer関数を**書く**。
3. コンポーネントからreducerを**使用**する。

### ステップ1: 状態設定からアクションのディスパッチに移行する {/*step-1-move-from-setting-state-to-dispatching-actions*/}

現在のイベントハンドラーは状態を設定することで_何をするか_を指定しています：

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

すべての状態設定ロジックを削除します。残るのは3つのイベントハンドラーです：

- `handleAddTask(text)`はユーザーが「追加」を押したときに呼び出されます。
- `handleChangeTask(task)`はユーザーがタスクを切り替えたり「保存」を押したときに呼び出されます。
- `handleDeleteTask(taskId)`はユーザーが「削除」を押したときに呼び出されます。

Reducersを使用して状態を管理する方法は、直接状態を設定する方法とは少し異なります。状態を設定することでReactに「何をするか」を伝える代わりに、イベントハンドラーから「アクション」をディスパッチすることで「ユーザーが何をしたか」を指定します。（状態更新ロジックは他の場所に存在します！）したがって、イベントハンドラーを介して「tasksを設定する」代わりに、「タスクを追加/変更/削除した」アクションをディスパッチします。これはユーザーの意図をより具体的に表現します。

```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

`dispatch`に渡すオブジェクトは「アクション」と呼ばれます：

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action"オブジェクト:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

これは通常のJavaScriptオブジェクトです。何を入れるかはあなた次第ですが、一般的には_何が起こったか_についての最小限の情報を含むべきです。（`dispatch`関数自体は後のステップで追加します。）

<Note>

アクションオブジェクトは任意の形状を持つことができます。

慣例として、何が起こったかを説明する文字列`type`を与え、他のフィールドに追加情報を渡すのが一般的です。`type`はコンポーネントに特有のもので、この例では`'added'`または`'added_task'`のどちらでも構いません。何が起こったかを示す名前を選びましょう！

```js
dispatch({
  // コンポーネントに特有
  type: 'what_happened',
  // 他のフィールドはここに
});
```

</Note>

### ステップ2: reducer関数を書く {/*step-2-write-a-reducer-function*/}

reducer関数は状態ロジックを置く場所です。現在の状態とアクションオブジェクトの2つの引数を取り、次の状態を返します：

```js
function yourReducer(state, action) {
  // Reactが設定する次の状態を返す
}
```

Reactはreducerから返されたものを状態として設定します。

この例でイベントハンドラーから状態設定ロジックをreducer関数に移動するには、次の手順を実行します：

1. 現在の状態（`tasks`）を最初の引数として宣言します。
2. `action`オブジェクトを2番目の引数として宣言します。
3. reducerから_次の_状態を返します（Reactがその状態を設定します）。

以下はすべての状態設定ロジックをreducer関数に移行したものです：

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

reducer関数は状態（`tasks`）を引数として取るため、**コンポーネントの外部に宣言することができます。** これによりインデントレベルが減少し、コードが読みやすくなることがあります。

<Note>

上記のコードはif/else文を使用していますが、reducer内で[switch文](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch)を使用するのが慣例です。結果は同じですが、switch文の方が一目で読みやすいことがあります。

このドキュメントの残りの部分では次のように使用します：

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

各`case`ブロックを`{`と`}`の中括弧で囲むことをお勧めします。これにより、異なる`case`内で宣言された変数が互いに衝突しないようになります。また、`case`は通常`return`で終わるべきです。`return`を忘れると、コードは次の`case`に「フォールスルー」し、ミスにつながることがあります！

switch文に慣れていない場合は、if/elseを使用するのも完全に問題ありません。

</Note>

<DeepDive>

#### なぜreducersはこのように呼ばれるのか？ {/*why-are-reducers-called-this-way*/}

Reducersはコンポーネント内のコード量を「減らす」ことができますが、実際には配列に対して行うことができる[`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)操作にちなんで名付けられています。

`reduce()`操作は、配列を取り、多くの値から単一の値を「蓄積」することができます：

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

`reduce`に渡す関数は「reducer」として知られています。それは_これまでの結果_と_現在の項目_を取り、_次の結果_を返します。Reactのreducersは同じアイデアの例です：それらは_これまでの状態_と_アクション_を取り、_次の状態_を返します。このようにして、時間の経過とともにアクションを状態に蓄積します。

`initialState`と`actions`の配列を使用して、reducer関数を渡すことで最終状態を計算するために`reduce()`メソッドを使用することもできます：

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

自分でこれを行う必要はほとんどありませんが、これはReactが行うことに似ています！

</DeepDive>

### ステップ3: コンポーネントからreducerを使用する {/*step-3-use-the-reducer-from-your-component*/}

最後に、`tasksReducer`をコンポーネントに接続する必要があります。Reactから`useReducer`フックをインポートします：

```js
import { useReducer } from 'react';
```

次に、`useState`を次のように置き換えることができます：

```js
const [tasks, setTasks] = useState(initialTasks);
```

`useReducer`を次のように使用します：

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer`フックは`useState`に似ています—初期状態を渡す必要があり、状態値と状態を設定する方法（この場合はdispatch関数）を返します。しかし、少し異なります。

`useReducer`フックは2つの引数を取ります：

1. reducer関数
2. 初期状態

そして、次のものを返します：

1. 状態値
2. dispatch関数（ユーザーアクションをreducerに「ディスパッチ」するため）

これで完全に接続されました！ここでは、reducerはコンポーネントファイルの下部に宣言されています：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text:
action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

コンポーネントのロジックは、このように関心事を分離すると読みやすくなることがあります。イベントハンドラーはアクションをディスパッチすることで_何が起こったか_を指定し、reducer関数はそれに応じて_状態がどのように更新されるか_を決定します。

## `useState`と`useReducer`の比較 {/*comparing-usestate-and-usereducer*/}

Reducersには欠点もあります！以下はそれらを比較するいくつかの方法です：

- **コードサイズ:** 一般的に、`useState`を使用すると、最初に書くコードが少なくて済みます。`useReducer`を使用すると、reducer関数とディスパッチアクションの両方を書く必要があります。しかし、多くのイベントハンドラーが同様の方法で状態を変更する場合、`useReducer`はコードを削減するのに役立ちます。
- **可読性:** 状態更新が単純な場合、`useState`は非常に読みやすいです。複雑になると、コンポーネントのコードが膨らみ、スキャンしにくくなります。この場合、`useReducer`は更新ロジックの_方法_をイベントハンドラーの_何が起こったか_からきれいに分離することができます。
- **デバッグ:** `useState`でバグが発生した場合、状態がどこで間違って設定されたのか、なぜそうなったのかを特定するのが難しいことがあります。`useReducer`を使用すると、reducerにコンソールログを追加して、すべての状態更新とそれがなぜ発生したのか（どの`action`によるものか）を確認できます。各`action`が正しい場合、ミスはreducerロジック自体にあることがわかります。しかし、`useState`よりも多くのコードをステップスルーする必要があります。
- **テスト:** reducerはコンポーネントに依存しない純粋な関数です。これにより、エクスポートして分離してテストすることができます。一般的には、コンポーネントをより現実的な環境でテストするのが最善ですが、複雑な状態更新ロジックの場合、特定の初期状態とアクションに対してreducerが特定の状態を返すことを確認するのに役立ちます。
- **個人的な好み:** 一部の人々はreducersが好きですが、他の人々はそうではありません。それは問題ありません。好みの問題です。`useState`と`useReducer`を相互に変換することは常に可能です：それらは等価です！

特定のコンポーネントで不正な状態更新によるバグが頻繁に発生し、そのコードにより多くの構造を導入したい場合、reducerの使用をお勧めします。すべてにreducersを使用する必要はありません：自由に組み合わせて使用してください！同じコンポーネントで`useState`と`useReducer`を使用することもできます。

## 良いreducerの書き方 {/*writing-reducers-well*/}

reducerを書くときに次の2つのヒントを覚えておいてください：

- **Reducersは純粋でなければなりません。** [状態更新関数](/learn/queueing-a-series-of-state-updates)と同様に、reducersはレンダリング中に実行されます！（アクションは次のレンダリングまでキューに入れられます。）これは、reducersが[純粋でなければならない](/learn/keeping-components-pure)ことを意味します—同じ入力は常に同じ出力をもたらします。リクエストを送信したり、タイムアウトをスケジュールしたり、任意の副作用（コンポーネント外のものに影響を与える操作）を実行したりしてはいけません。オブジェクトや配列を[ミューテーションなしで更新](/learn/updating-objects-in-state)する必要があります。
- **各アクションは、データに複数の変更があっても、単一のユーザーインタラクションを記述します。** 例えば、reducerで管理されている5つのフィールドを持つフォームでユーザーが「リセット」を押した場合、5つの個別の`set_field`アクションではなく、1つの`reset_form`アクションをディスパッチする方が理にかなっています。reducerで各アクションをログに記録する場合、そのログはどのインタラクションやレスポンスがどの順序で発生したかを再構築するのに十分明確であるべきです。これはデバッグに役立ちます！

## Immerを使用して簡潔なreducerを書く {/*writing-concise-reducers-with-immer*/}

通常の状態で[オブジェクトを更新する](/learn/updating-objects-in-state#write-concise-update-logic-with-immer)や[配列を更新する](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)のと同様に、Immerライブラリを使用してreducerをより簡潔にすることができます。ここでは、[`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer)を使用して、`push`や`arr[i] =`の代入で状態をミューテートできます：

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Reducersは純粋でなければならないため、状態をミューテートしてはいけません。しかし、Immerはミューテートが安全な特別な`draft`オブジェクトを提供します。内部的には、Immerは`draft`に加えた変更を反映した状態のコピーを作成します。これが、`useImmerReducer`で管理されるreducersが最初の引数をミューテートでき、状態を返す必要がない理由です。

<Recap>

- `useState`から`useReducer`に変換するには：
  1. イベントハンドラーからアクションをディスパッチする。
  2. 状態とアクションに対して次の状態を返すreducer関数を書く。
  3. `useState`を`useReducer`に置き換える。
- Reducersは少し多くのコードを書く必要がありますが、デバッグやテストに役立ちます。
- Reducersは純粋でなければなりません。
- 各アクションは単一のユーザーインタラクションを記述します。
- ミューテーションスタイルでreducersを書きたい場合はImmerを使用します。

</Recap>

<Challenges>

#### イベントハンドラーからアクションをディスパッチする {/*dispatch-actions-from-event-handlers*/}

現在、`ContactList.js`と`Chat.js`のイベントハンドラーには`// TODO`コメントがあります。これが、入力に文字を入力しても機能せず、ボタンをクリックしても選択された受信者が変更されない理由です。

これらの2つの`// TODO`を対応するアクションを`dispatch`するコードに置き換えます。アクションの期待される形状とタイプを確認するには、`messengerReducer.js`のreducerを確認してください。reducerはすでに書かれているので、変更する必要はありません。`ContactList.js`と`Chat.js`でアクションをディスパッチするだけです。

<Hint>

`dispatch`関数はこれらのコンポーネントの両方でプロップとして渡されているため、すでに利用可能です。したがって、対応するアクションオブジェクトで`dispatch`を呼び出す必要があります。

アクションオブジェクトの形状を確認するには、reducerを見て、どの`action`フィールドが期待されているかを確認できます。例えば、reducerの`changed_selection`ケースは次のように見えます：

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

これは、アクションオブジェクトに`type: 'changed_selection'`が必要であることを意味します。また、`action.contactId`が使用されているので、アクションに`contactId`プロパティを含める必要があります。

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
       
))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

reducerのコードから、アクションは次のように見えることがわかります：

```js
// ユーザーが「Alice」を押したとき
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// ユーザーが「Hello!」と入力したとき
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

対応するメッセージをディスパッチするように更新された例は次のとおりです：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### メッセージ送信時に入力をクリアする {/*clear-the-input-on-sending-a-message*/}

現在、「送信」を押しても何も起こりません。「送信」ボタンにイベントハンドラーを追加して、次のことを行います：

1. 受信者のメールアドレスとメッセージを表示する`alert`を表示します。
2. メッセージ入力をクリアします。

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

「送信」ボタンのイベントハンドラーでこれを行う方法はいくつかあります。一つのアプローチは、アラートを表示し、その後空の`message`で`edited_message`アクションをディスパッチすることです：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

これは機能し、「送信」を押すと入力がクリアされます。

しかし、_ユーザーの視点から見ると_、メッセージを送信することはフィールドを編集することとは異なるアクションです。それを反映するために、新しいアクション`sent_message`を作成し、reducerで別々に処理することができます：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

結果としての動作は同じです。しかし、アクションタイプは理想的には「ユーザーが何をしたか」を記述するべきであり、「状態をどのように変更したいか」ではありません。これにより、後で機能を追加するのが容易になります。

どちらの解決策でも、アラートをreducer内に配置しないことが重要です。reducerは純粋な関数であるべきであり、次の状態を計算するだけです。何かを「行う」べきではなく、ユーザーにメッセージを表示することも含まれます。それはイベントハンドラーで行うべきです。（このようなミスをキャッチするために、ReactはStrict Modeでreducerを複数回呼び出します。reducerにアラートを配置すると、2回発生するのはこのためです。）

</Solution>

#### タブ間の切り替え時に入力値を復元する {/*restore-input-values-when-switching-between-tabs*/}

この例では、異なる受信者に切り替えると常にテキスト入力がクリアされます：

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // 入力をクリア
  };
```

これは、複数の受信者間で単一のメッセージドラフトを共有したくないためです。しかし、アプリが各連絡先のドラフトを「記憶」し、連絡先を切り替えたときにそれを復元する方が良いでしょう。

あなたのタスクは、状態の構造を変更して、各連絡先ごとに別々のメッセージドラフトを記憶するようにすることです。reducer、初期状態、およびコンポーネントにいくつかの変更を加える必要があります。

<Hint>

状態を次のように構造化できます：

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // contactId = 0のドラフト
    1: 'Hello, Alice', // contactId = 1のドラフト
  },
};
```

`[key]: value` [計算プロパティ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)構文を使用して`messages`オブジェクトを更新できます：

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```jssrc/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

reducerを更新して、各連絡先ごとに別々のメッセージドラフトを保存および更新する必要があります：

```js
// 入力が編集されたとき
case 'edited_message': {
  return {
    // 他の状態（選択など）を保持
    ...state,
    messages: {
      // 他の連絡先のメッセージを保持
      ...state.messages,
      // しかし、選択された連絡先のメッセージを変更
      [state.selectedId]: action.message
    }
  };
}
```

また、現在選択されている連絡先のメッセージを読み取るために`Messenger`コンポーネントを更新します：

```js
const message = state.messages[state.selectedId];
```

完全な解決策は次のとおりです：

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

特に、異なる動作を実装するためにイベントハンドラーを変更する必要はありませんでした。reducerがなければ、状態を更新するすべてのイベントハンドラーを変更する必要があったでしょう。

</Solution>

#### `useReducer`をゼロから実装する {/*implement-usereducer-from-scratch*/}

前の例では、Reactから`useReducer`フックをインポートしました。今回は、_`useReducer`フック自体を実装します！_ 以下は開始するためのスタブです。10行以内のコードで済むはずです。

変更をテストするには、入力に文字を入力したり、連絡先を選択したりしてみてください。

<Hint>

実装の詳細なスケッチは次のとおりです：

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

reducer関数は現在の状態とアクションオブジェクトの2つの引数を取り、次の状態を返すことを思い出してください。`dispatch`の実装はそれをどうすべきでしょうか？

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

アクションをディスパッチすることは、現在の状態とアクションを持つreducerを呼び出し、その結果を次の状態として保存することです。これがコードでの見た目です：

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

ほとんどの場合、重要ではありませんが、より正確な実装は次のようになります：

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

これは、ディスパッチされたアクションが次のレンダリングまでキューに入れられるためです。[状態更新関数と同様に。](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>