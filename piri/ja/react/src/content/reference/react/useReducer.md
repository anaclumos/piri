---
title: useReducer
---

<Intro>

`useReducer`は、コンポーネントに[reducer](/learn/extracting-state-logic-into-a-reducer)を追加できるReact Hookです。

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

`useReducer`をコンポーネントのトップレベルで呼び出して、[reducer](/learn/extracting-state-logic-into-a-reducer)で状態を管理します。

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reducer`: 状態がどのように更新されるかを指定するreducer関数。純粋でなければならず、状態とアクションを引数として取り、次の状態を返す必要があります。状態とアクションは任意の型で構いません。
* `initialArg`: 初期状態が計算される値。任意の型の値で構いません。初期状態がどのように計算されるかは次の`init`引数に依存します。
* **オプション** `init`: 初期状態を返す初期化関数。指定されていない場合、初期状態は`initialArg`に設定されます。それ以外の場合、初期状態は`init(initialArg)`の呼び出し結果に設定されます。

#### 戻り値 {/*returns*/}

`useReducer`は、正確に2つの値を持つ配列を返します：

1. 現在の状態。最初のレンダー時には`init(initialArg)`または`initialArg`（`init`がない場合）に設定されます。
2. 状態を別の値に更新し、再レンダーをトリガーする[`dispatch`関数](#dispatch)。

#### 注意点 {/*caveats*/}

* `useReducer`はHookなので、**コンポーネントのトップレベル**または独自のHookでのみ呼び出すことができます。ループや条件内で呼び出すことはできません。その場合は、新しいコンポーネントを抽出し、状態をそこに移動してください。
* ストリクトモードでは、Reactは[偶発的な不純物を見つけるのを助けるために](#my-reducer-or-initializer-function-runs-twice)、**reducerと初期化関数を2回呼び出します**。これは開発時のみの動作であり、本番環境には影響しません。reducerと初期化関数が純粋であれば（そうであるべきですが）、これはロジックに影響を与えません。呼び出しの1つの結果は無視されます。

---

### `dispatch`関数 {/*dispatch*/}

`useReducer`によって返される`dispatch`関数は、状態を別の値に更新し、再レンダーをトリガーします。アクションを`dispatch`関数の唯一の引数として渡す必要があります：

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

Reactは、現在の`state`と`dispatch`に渡されたアクションを使用して提供された`reducer`関数を呼び出し、次の状態を設定します。

#### パラメータ {/*dispatch-parameters*/}

* `action`: ユーザーによって実行されたアクション。任意の型の値で構いません。慣例として、アクションは通常、`type`プロパティで識別されるオブジェクトであり、オプションで追加情報を持つ他のプロパティを含むことがあります。

#### 戻り値 {/*dispatch-returns*/}

`dispatch`関数には戻り値がありません。

#### 注意点 {/*setstate-caveats*/}

* `dispatch`関数は**次のレンダーのために状態変数を更新するだけ**です。`dispatch`関数を呼び出した後に状態変数を読み取ると、[画面に表示される前の古い値](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value)が返されます。

* 提供された新しい値が現在の`state`と同一である場合、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較によって、Reactは**コンポーネントとその子の再レンダーをスキップします**。これは最適化です。Reactは結果を無視する前にコンポーネントを呼び出す必要があるかもしれませんが、コードには影響しません。

* Reactは[状態更新をバッチ処理します。](/learn/queueing-a-series-of-state-updates) すべてのイベントハンドラが実行され、`set`関数が呼び出された後に画面を更新します。これにより、単一のイベント中に複数の再レンダーが防止されます。まれに、例えばDOMにアクセスするためにReactに画面を早期に更新させる必要がある場合は、[`flushSync`](/reference/react-dom/flushSync)を使用できます。

---

## 使用法 {/*usage*/}

### コンポーネントにreducerを追加する {/*adding-a-reducer-to-a-component*/}

`useReducer`をコンポーネントのトップレベルで呼び出して、[reducer](/learn/extracting-state-logic-into-a-reducer)で状態を管理します。

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer`は、正確に2つの項目を持つ配列を返します：

1. この状態変数の<CodeStep step={1}>現在の状態</CodeStep>。最初は提供された<CodeStep step={3}>初期状態</CodeStep>に設定されます。
2. それに応じて変更できる<CodeStep step={2}>`dispatch`関数</CodeStep>。

画面上の内容を更新するには、ユーザーの操作を表すオブジェクト（*アクション*と呼ばれる）を<CodeStep step={2}>`dispatch`</CodeStep>で呼び出します：

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

Reactは現在の状態とアクションを<CodeStep step={4}>reducer関数</CodeStep>に渡します。reducerは次の状態を計算して返します。Reactはその次の状態を保存し、それでコンポーネントをレンダーし、UIを更新します。

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer`は[`useState`](/reference/react/useState)に非常に似ていますが、状態更新ロジックをイベントハンドラからコンポーネント外の単一の関数に移動できます。[`useState`と`useReducer`の選択について](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)の詳細を読む。

---

### reducer関数の作成 {/*writing-the-reducer-function*/}

reducer関数は次のように宣言されます：

```js
function reducer(state, action) {
  // ...
}
```

次に、次の状態を計算して返すコードを記述する必要があります。慣例として、[`switch`文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)として書くことが一般的です。`switch`の各`case`で、次の状態を計算して返します。

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

アクションは任意の形状を持つことができます。慣例として、アクションを識別する`type`プロパティを持つオブジェクトを渡すことが一般的です。reducerが次の状態を計算するために必要な最小限の情報を含むべきです。

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

アクションタイプ名はコンポーネントにローカルです。[各アクションは単一のインタラクションを記述しますが、それがデータの複数の変更につながる場合もあります。](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) 状態の形状は任意ですが、通常はオブジェクトまたは配列になります。

[状態ロジックをreducerに抽出する](/learn/extracting-state-logic-into-a-reducer)の詳細を読む。

<Pitfall>

状態は読み取り専用です。状態内のオブジェクトや配列を変更しないでください：

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 状態内のオブジェクトをこのように変更しないでください：
      state.age = state.age + 1;
      return state;
    }
```

代わりに、常にreducerから新しいオブジェクトを返します：

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ 代わりに新しいオブジェクトを返します
      return {
        ...state,
        age: state.age + 1
      };
    }
```

[状態内のオブジェクトの更新](/learn/updating-objects-in-state)と[状態内の配列の更新](/learn/updating-arrays-in-state)の詳細を読む。

</Pitfall>

<Recipes titleText="基本的なuseReducerの例" titleId="examples-basic">

#### フォーム（オブジェクト） {/*form-object*/}

この例では、reducerが`name`と`age`の2つのフィールドを持つ状態オブジェクトを管理します。

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Todoリスト（配列） {/*todo-list-array*/}

この例では、reducerがタスクの配列を管理します。配列は[変更せずに更新する必要があります。](/learn/updating-arrays-in-state)

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Immerを使った簡潔な更新ロジックの記述 {/*writing-concise-update-logic-with-immer*/}

配列やオブジェクトの更新が面倒に感じる場合は、[Immer](https://github.com/immer
js/use-immer#useimmerreducer)のようなライブラリを使用して、繰り返しのコードを減らすことができます。Immerを使用すると、オブジェクトを変更しているかのように簡潔なコードを書けますが、内部では不変の更新が行われます：

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
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

<Solution />

</Recipes>

---

### 初期状態の再作成を避ける {/*avoiding-recreating-the-initial-state*/}

Reactは初期状態を一度保存し、次のレンダーでは無視します。

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

`createInitialState(username)`の結果は初期レンダー時にのみ使用されますが、毎回のレンダーでこの関数を呼び出しています。これが大きな配列を作成したり、高価な計算を行ったりする場合、無駄になります。

これを解決するために、**初期化関数として**`useReducer`の第3引数に渡すことができます：

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

ここでは、`createInitialState`（関数自体）を渡しており、`createInitialState()`（呼び出し結果）を渡していません。これにより、初期状態は初期化後に再作成されません。

上記の例では、`createInitialState`は`username`引数を取ります。初期化関数が初期状態を計算するために情報を必要としない場合、`useReducer`の第2引数に`null`を渡すことができます。

<Recipes titleText="初期化関数を渡す場合と直接初期状態を渡す場合の違い" titleId="examples-initializer">

#### 初期化関数を渡す場合 {/*passing-the-initializer-function*/}

この例では、初期化関数を渡しているため、`createInitialState`関数は初期化時にのみ実行されます。入力に入力するなどの再レンダー時には実行されません。

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 直接初期状態を渡す場合 {/*passing-the-initial-state-directly*/}

この例では、初期化関数を渡して**いない**ため、`createInitialState`関数は入力に入力するなどの再レンダー時に毎回実行されます。動作に目に見える違いはありませんが、このコードは効率が悪いです。

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## トラブルシューティング {/*troubleshooting*/}

### アクションをディスパッチしましたが、ログには古い状態値が表示されます {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

`dispatch`関数を呼び出しても、実行中のコードの状態は変わりません：

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // 43で再レンダーをリクエスト
  console.log(state.age);  // まだ42！

  setTimeout(() => {
    console.log(state.age); // これも42！
  }, 5000);
}
```

これは[状態がスナップショットのように動作する](/learn/state-as-a-snapshot)ためです。状態の更新は新しい状態値での再レンダーをリクエストしますが、既に実行中のイベントハンドラ内の`state` JavaScript変数には影響しません。

次の状態値を推測する必要がある場合は、reducerを自分で呼び出して手動で計算できます：

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### アクションをディスパッチしましたが、画面が更新されません {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

Reactは、次の状態が前の状態と等しい場合、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較によって**更新を無視します**。これは通常、状態内のオブジェクトや配列を直接変更した場合に発生します：

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 間違い：既存のオブジェクトを変更
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 間違い：既存のオブジェクトを変更
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

既存の`state`オブジェクトを変更して返したため、Reactは更新を無視しました。これを修正するには、常に状態内のオブジェクトや配列を変更するのではなく、[状態内のオブジェクトを更新する](/learn/updating-objects-in-state)および[状態内の配列を更新する](/learn/updating-arrays-in-state)ようにしてください：

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ 正しい：新しいオブジェクトを作成
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ 正しい：新しいオブジェクトを作成
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### reducerの状態の一部がディスパッチ後に未定義になります {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

新しい状態を返すときに、各`case`ブランチが**既存のすべてのフィールドをコピー**していることを確認してください：

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // これを忘れないでください！
        age: state.age + 1
      };
    }
    // ...
```

上記の`...state`がないと、返される次の状態には`age`フィールドしか含まれず、他のフィールドは含まれません。

---

### reducerの状態全体がディスパッチ後に未定義になります {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

状態が予期せず`undefined`になる場合、`case`の1つで状態を`return`するのを忘れているか、アクションタイプが`case`文のいずれとも一致していない可能性があります。原因を見つけるために、`switch`の外でエラーをスローします：

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

また、TypeScriptのような静的型チェッカーを使用して、このようなミスを検出することもできます。

---

### エラーが発生しました：「レンダーが多すぎます」 {/*im-getting-an-error-too-many-re-renders*/}

次のようなエラーが発生することがあります：`Too many re-renders. React limits the number of renders to prevent an infinite loop.` これは通常、レンダー中に無条件にアクションをディスパッチしているため、コンポーネントがループに入ることを意味します：レンダー、ディスパッチ（レンダーを引き起こす）、レンダー、ディスパッチ（レンダーを引き起こす）、など。非常に頻繁に、これはイベントハンドラの指定ミスによって引き起こされます：

```js {1-2}
// 🚩 間違い：レンダー中にハンドラを呼び出す
return <button onClick={handleClick()}>Click me</button>

// ✅ 正しい：イベントハンドラを渡す
return <button onClick={handleClick}>Click me</button>

// ✅ 正しい：インライン関数を渡す
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

このエラーの原因が見つからない場合は、コンソールのエラーの横にある矢印をクリックして、エラーの原因となる特定の`dispatch`関数呼び出しを見つけるためにJavaScriptスタックを確認してください。

---

### reducerまたは初期化関数が2回実行されます {/*my-reducer-or-initializer-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode)では、Reactはreducerおよび初期化関数を2回呼び出します。これによりコードが壊れることはありません。

この**開発時のみ**の動作は、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)のに役立ちます。Reactは呼び出しの1つの結果を使用し、もう1つの結果を無視します。コンポーネント、初期化関数、およびreducer関数が純粋である限り、ロジックに影響を与えることはありません。ただし、偶然に不純である場合、この動作はミスを見つけるのに役立ちます。

例えば、この不純なreducer関数は状態内の配列を変更します：

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 ミス：状態を変更
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Reactがreducer関数を2回呼び出すため、todoが2回追加されたことがわかり、ミスがあることがわかります。この例では、[配列を変更するのではなく置き換える](/learn/updating-arrays-in-state#adding-to-an-array)ことでミスを修正できます：

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ 正しい：新しい状態で置き換え
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

このreducer関数が純粋であるため、余分に呼び出しても動作に違いはありません。これが、Reactが2回呼び出すことでミスを見つけるのに役立つ理由です。**純粋である必要があるのはコンポーネント、初期化関数、およびreducer関数だけです。** イベントハンドラは純粋である必要はないため、Reactはイベントハンドラを2回呼び出すことはありません。

[コンポーネントを純粋に保つ](/learn/keeping-components-pure)の詳細を読む。