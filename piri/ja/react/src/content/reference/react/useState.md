---
title: useState
---

<Intro>

`useState`は、コンポーネントに[状態変数](/learn/state-a-components-memory)を追加できるReact Hookです。

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useState(initialState)` {/*usestate*/}

コンポーネントのトップレベルで`useState`を呼び出して、[状態変数](/learn/state-a-components-memory)を宣言します。

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

状態変数は[配列の分割代入](https://javascript.info/destructuring-assignment)を使用して`[something, setSomething]`のように命名するのが慣例です。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `initialState`: 状態を初期化するための値。任意の型の値を指定できますが、関数の場合は特別な動作があります。この引数は初回レンダリング後は無視されます。
  * `initialState`として関数を渡すと、それは_初期化関数_として扱われます。純粋で引数を取らず、任意の型の値を返す必要があります。Reactはコンポーネントの初期化時に初期化関数を呼び出し、その戻り値を初期状態として保存します。[以下の例を参照してください。](#avoiding-recreating-the-initial-state)

#### 戻り値 {/*returns*/}

`useState`は、正確に2つの値を持つ配列を返します：

1. 現在の状態。初回レンダリング時には、渡された`initialState`と一致します。
2. 状態を異なる値に更新し、再レンダリングをトリガーする[`set`関数](#setstate)。

#### 注意点 {/*caveats*/}

* `useState`はHookなので、**コンポーネントのトップレベル**または独自のHookでのみ呼び出すことができます。ループや条件内で呼び出すことはできません。その場合は、新しいコンポーネントを抽出し、状態をそこに移動します。
* ストリクトモードでは、Reactは**初期化関数を2回呼び出します**。これは[偶発的な不純物を見つけるのに役立ちます。](#my-initializer-or-updater-function-runs-twice) これは開発時のみの動作であり、本番環境には影響しません。初期化関数が純粋であれば、これにより動作が影響を受けることはありません。呼び出しの結果の一つは無視されます。

---

### `set`関数、例えば`setSomething(nextState)` {/*setstate*/}

`useState`によって返される`set`関数は、状態を異なる値に更新し、再レンダリングをトリガーします。次の状態を直接渡すか、前の状態から計算する関数を渡すことができます：

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### パラメータ {/*setstate-parameters*/}

* `nextState`: 状態を設定したい値。任意の型の値を指定できますが、関数の場合は特別な動作があります。
  * `nextState`として関数を渡すと、それは_更新関数_として扱われます。純粋で、保留中の状態を唯一の引数として取り、次の状態を返す必要があります。Reactは更新関数をキューに入れ、コンポーネントを再レンダリングします。次のレンダリング時に、Reactはすべてのキューに入れられた更新関数を前の状態に適用して次の状態を計算します。[以下の例を参照してください。](#updating-state-based-on-the-previous-state)

#### 戻り値 {/*setstate-returns*/}

`set`関数には戻り値はありません。

#### 注意点 {/*setstate-caveats*/}

* `set`関数は**次のレンダリングのためにのみ状態変数を更新します**。`set`関数を呼び出した後に状態変数を読み取ると、[まだ古い値](#ive-updated-the-state-but-logging-gives-me-the-old-value)が返されます。

* 提供された新しい値が現在の`state`と同一である場合、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較によって、Reactは**コンポーネントとその子の再レンダリングをスキップします**。これは最適化です。ただし、場合によってはReactが子をスキップする前にコンポーネントを呼び出す必要があるかもしれませんが、コードには影響しません。

* Reactは[状態更新をバッチ処理します。](/learn/queueing-a-series-of-state-updates) すべてのイベントハンドラが実行され、`set`関数が呼び出された後に画面を更新します。これにより、単一のイベント中に複数の再レンダリングが防止されます。まれに、例えばDOMにアクセスするために画面を早期に更新する必要がある場合は、[`flushSync`を使用できます。](/reference/react-dom/flushSync)

* レンダリング中に`set`関数を呼び出すことは、現在レンダリング中のコンポーネント内からのみ許可されます。Reactはその出力を破棄し、新しい状態で再度レンダリングを試みます。このパターンはまれにしか必要ありませんが、**以前のレンダリングからの情報を保存する**ために使用できます。[以下の例を参照してください。](#storing-information-from-previous-renders)

* ストリクトモードでは、Reactは**更新関数を2回呼び出します**。これは[偶発的な不純物を見つけるのに役立ちます。](#my-initializer-or-updater-function-runs-twice) これは開発時のみの動作であり、本番環境には影響しません。更新関数が純粋であれば、これにより動作が影響を受けることはありません。呼び出しの結果の一つは無視されます。

---

## 使用法 {/*usage*/}

### コンポーネントに状態を追加する {/*adding-state-to-a-component*/}

コンポーネントのトップレベルで`useState`を呼び出して、1つ以上の[状態変数](/learn/state-a-components-memory)を宣言します。

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

状態変数は[配列の分割代入](https://javascript.info/destructuring-assignment)を使用して`[something, setSomething]`のように命名するのが慣例です。

`useState`は正確に2つの項目を持つ配列を返します：

1. この状態変数の<CodeStep step={1}>現在の状態</CodeStep>。最初は提供された<CodeStep step={3}>初期状態</CodeStep>に設定されます。
2. それを他の値に変更するための<CodeStep step={2}>`set`関数</CodeStep>。インタラクションに応じて変更します。

画面上の内容を更新するには、次の状態を持つ`set`関数を呼び出します：

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

Reactは次の状態を保存し、新しい値でコンポーネントを再レンダリングし、UIを更新します。

<Pitfall>

`set`関数を呼び出しても、[**実行中のコードの現在の状態は**変更されません](#ive-updated-the-state-but-logging-gives-me-the-old-value)：

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // まだ "Taylor"!
}
```

これは、*次の*レンダリングから`useState`が返すものにのみ影響します。

</Pitfall>

<Recipes titleText="基本的なuseStateの例" titleId="examples-basic">

#### カウンター（数値） {/*counter-number*/}

この例では、`count`状態変数が数値を保持します。ボタンをクリックすると、それがインクリメントされます。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### テキストフィールド（文字列） {/*text-field-string*/}

この例では、`text`状態変数が文字列を保持します。入力すると、`handleChange`がブラウザの入力DOM要素から最新の入力値を読み取り、`setText`を呼び出して状態を更新します。これにより、現在の`text`を下に表示できます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### チェックボックス（ブール値） {/*checkbox-boolean*/}

この例では、`liked`状態変数がブール値を保持します。入力をクリックすると、`setLiked`がブラウザのチェックボックス入力がチェックされているかどうかで`liked`状態変数を更新します。`liked`変数はチェックボックスの下にテキストをレンダリングするために使用されます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### フォーム（2つの変数） {/*form-two-variables*/}

同じコンポーネントで複数の状態変数を宣言できます。各状態変数は完全に独立しています。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 前の状態に基づいて状態を更新する {/*updating-state-based-on-the-previous-state*/}

例えば、`age`が`42`だとします。このハンドラは`setAge(age + 1)`を3回呼び出します：

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

しかし、1回クリックした後、`age`は`45`ではなく`43`にしかなりません！これは、`set`関数を呼び出しても[実行中のコードの`age`状態変数を更新しない](#updating-state-based-on-the-previous-state)ためです。したがって、各`setAge(age + 1)`呼び出しは`setAge(43)`になります。

この問題を解決するために、次の状態の代わりに**更新関数**を`setAge`に渡すことができます：

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

ここで、`a => a + 1`は更新関数です。<CodeStep step={1}>保留中の状態</CodeStep>を取り、それから<CodeStep step={2}>次の状態</CodeStep>を計算します。

Reactは更新関数を[キューに入れます。](/learn/queueing-a-series-of-state-updates) 次のレンダリング時に、それらを同じ順序で呼び出します：

1. `a => a + 1`は保留中の状態として`42`を受け取り、次の状態として`43`を返します。
1. `a => a + 1`は保留中の状態として`43`を受け取り、次の状態として`44`を返します。
1. `a => a + 1`は保留中の状態として`44`を受け取り、次の状態として`45`を返します。

他にキューに入れられた更新はないため、Reactは最終的に`45`を現在の状態として保存します。

慣例として、保留中の状態引数を状態変数名の最初の文字で命名することが一般的です。例えば、`age`の場合は`a`です。しかし、`prevAge`など、より明確だと思う名前を付けることもできます。

Reactは開発中に[更新関数を2回呼び出す](#my-initializer-or-updater-function-runs-twice)ことがあります。これは、それらが[純粋であることを確認するためです。](/learn/keeping-components-pure)

<DeepDive>

#### 更新関数を使用するのが常に推奨されるのか？ {/*is-using-an-updater-always-preferred*/}

前の状態から計算される状態を設定する場合、常に`setAge(a => a + 1)`のようにコードを書くことを推奨する意見があります。これには害はありませんが、常に必要というわけではありません。

ほとんどの場合、これら2つのアプローチの間に違いはありません。Reactは常に意図的なユーザーアクション（クリックなど）に対して、次のクリックの前に`age`状態変数が更新されることを保証します。したがって、イベントハンドラの開始時に「古い」`age`を見るリスクはありません。

ただし、同じイベント内で複数の更新を行う場合、更新関数は役立ちます。また、状態変数自体にアクセスするのが不便な場合（再レンダリングの最適化時にこれに遭遇することがあります）にも役立ちます。

一貫性を重視し、やや冗長な構文を気にしない場合、前の状態から計算される状態を設定する場合は常に更新関数を書くのが合理的です。別の状態変数の前の状態から計算される場合、それらを1つのオブジェクトにまとめて[リデューサーを使用する](#use-a-reducer)ことを検討するかもしれません。

</DeepDive>

<Recipes titleText="更新関数を渡す場合と次の状態を直接渡す場合の違い" titleId="examples-updater">

#### 更新関数を渡す場合 {/*passing-the-updater-function*/}

この例では、更新関数を渡しているため、"+3"ボタンが機能
します。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### 次の状態を直接渡す場合 {/*passing-the-next-state-directly*/}

この例では**更新関数を渡していない**ため、"+3"ボタンは**意図した通りに動作しません**。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 状態内のオブジェクトと配列の更新 {/*updating-objects-and-arrays-in-state*/}

状態にオブジェクトや配列を入れることができます。Reactでは状態は読み取り専用と見なされるため、**既存のオブジェクトを*変更*するのではなく、*置き換える*必要があります**。例えば、状態に`form`オブジェクトがある場合、それを変更しないでください：

```js
// 🚩 状態内のオブジェクトをこのように変更しないでください：
form.firstName = 'Taylor';
```

代わりに、新しいオブジェクトを作成して全体を置き換えます：

```js
// ✅ 新しいオブジェクトで状態を置き換えます
setForm({
  ...form,
  firstName: 'Taylor'
});
```

[状態内のオブジェクトの更新](/learn/updating-objects-in-state)および[状態内の配列の更新](/learn/updating-arrays-in-state)について詳しく学んでください。

<Recipes titleText="状態内のオブジェクトと配列の例" titleId="examples-objects">

#### フォーム（オブジェクト） {/*form-object*/}

この例では、`form`状態変数がオブジェクトを保持します。各入力には、次の状態の全体を`setForm`で呼び出す変更ハンドラがあります。`{ ...form }`スプレッド構文は、状態オブジェクトが変更されるのではなく置き換えられることを保証します。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### フォーム（ネストされたオブジェクト） {/*form-nested-object*/}

この例では、状態がよりネストされています。ネストされた状態を更新する場合、更新するオブジェクトのコピーを作成する必要があり、上位のオブジェクトも同様です。詳しくは[ネストされたオブジェクトの更新](/learn/updating-objects-in-state#updating-a-nested-object)を参照してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### リスト（配列） {/*list-array*/}

この例では、`todos`状態変数が配列を保持します。各ボタンハンドラは、その配列の次のバージョンを持つ`setTodos`を呼び出します。`[...todos]`スプレッド構文、`todos.map()`および`todos.filter()`は、状態配列が変更されるのではなく置き換えられることを保証します。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

#### Immerを使用して簡潔な更新ロジックを書く {/*writing-concise-update-logic-with-immer*/}

配列やオブジェクトの更新が面倒に感じる場合、[Immer](https://github.com/immerjs/use-immer)のようなライブラリを使用して繰り返しのコードを減らすことができます。Immerを使用すると、オブジェクトを変更するかのように簡潔なコードを書けますが、内部では不変の更新を行います：

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
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

<Solution />

</Recipes>

---

### 初期状態の再作成を避ける {/*avoiding-recreating-the-initial-state*/}

Reactは初期状態を一度保存し、次のレンダリングでは無視します。

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

`createInitialTodos()`の結果は初回レンダリング時にのみ使用されますが、毎回レンダリング時にこの関数を呼び出しています。これが大きな配列を作成したり、計算が高価な場合は無駄になります。

これを解決するために、**初期化関数**として`useState`に渡すことができます：

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

ここでは、`createInitialTodos`（関数自体）を渡しており、`createInitialTodos()`（呼び出し結果）ではありません。関数を`useState`に渡すと、Reactは初期化時にのみそれを呼び出します。

Reactは開発中に[初期化関数を2回呼び出す](#my-initializer-or-updater-function-runs-twice)ことがあります。これは、それらが[純粋であることを確認するためです。](/learn/keeping-components-pure)

<Recipes titleText="初期化関数を渡す場合と初期状態を直接渡す場合の違い" titleId="examples-initializer">

#### 初期化関数を渡す場合 {/*passing-the-initializer-function*/}

この例では、初期化関数を渡しているため、`createInitialTodos`関数は初期化時にのみ実行されます。入力に入力するときなど、コンポーネントが再レンダリングされるときには実行されません。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
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

#### 初期状態を直接渡す場合 {/*passing-the-initial-state-directly*/}

この例では**初期化関数を渡していない**ため、`createInitialTodos`関数は毎回レンダリング時に実行されます。入力に入力するときなど、コンポーネントが再レンダリングされるときにも実行されます。動作に目に見える違いはありませんが、このコードは効率が悪いです。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
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

### キーを使用して状態をリセットする {/*resetting-state-with-a-key*/}

リストを[レンダリングする](/learn/rendering-lists)際に`key`属性に遭遇することがよくあります。しかし、それには別の目的もあります。

**異なる`key`をコンポーネントに渡すことで、コンポーネントの状態をリセットする**ことができます。この例では、リセットボタンが`version`状態変数を変更し、それを`Form`に`key`として渡します。`key`が変更されると、Reactは`Form`コンポーネント（およびそのすべての子）を最初から再作成するため、その状態がリセットされます。

状態の[保持とリセット](/learn/preserving-and-resetting-state)について詳しく学んでください。

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### 前のレンダリングからの情報を保存する {/*storing-information-from-previous-renders*/}

通常、イベントハンドラで状態を更新します。しかし、まれにレンダリングに応じて状態を調整したい場合があります。例えば、プロップが変更されたときに状態変数を変更したい場合です。

ほとんどの場合、これを行う必要はありません：

* **必要な値が現在のプロップや他の状態から完全に計算できる場合、[その冗長な状態を完全に削除します。](/learn/choosing-the-state-structure#avoid-redundant-state)** 計算が頻繁に行われることを心配している場合、[`useMemo` Hook](/reference/react/useMemo)が役立ちます。
* コンポーネントツリー全体の状態をリセットしたい場合、[コンポーネントに異なる`key`を渡します。](#resetting-state-with-a-key)
* 可能であれば、すべての関連する状態をイベントハンドラで更新します。

これらのいずれも当てはまらないまれな場合には、レンダリングされた値に基づいて状態を更新するために、コンポーネントがレンダリングされている間に`set`関数を呼び出すパターンを使用できます。

以下はその例です。この`CountLabel`コンポーネントは、渡された`count`プロップを表示します：

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

カウンターが*増加したか減少したか*を表示したいとします。`count`プロップはこれを教えてくれません。前の値を追跡する必要があります。`prevCount`状態変数を追加してそれを追跡します。`trend`という別の状態変数を追加して、カウントが増加したか減少したかを保持します。`prevCount`と`count`を比較し、それらが等しくない場合、`prevCount`と`trend`の両方を更新します。これで、現在のカウントプロップと*前回のレンダリングからの変化*を表示できます。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

レンダリング中に`set`関数を呼び出す場合、それは`prevCount !== count`のような条件内でなければならず、その条件内に`setPrevCount(count)`のような呼び出しがなければなりません。そうしないと、コンポーネントはループで再レンダリングされ続け、クラッシュするまで続きます。また、*現在レンダリング中の*コンポーネントの状態のみをこのように更新できます。レンダリング中に*他の*コンポーネントの`set`関数を呼び出すことはエラーです。最後に、`set`呼び出しは依然として[状態を変更せずに更新する](#updating-objects-and-arrays-in-state)必要があります。これは、[純粋関数の他のルールを破る](#keeping-components-pure)ことを意味しません。

このパターンは理解しにくく、通常は避けた方が良いです。しかし、エフェクトで状態を更新するよりは良いです。レンダリング中に`set`関数を呼び出すと、コンポーネントが`return`ステートメントで終了した直後、子をレンダリングする前にそのコンポーネントを再レンダリングします。この方法では、子が2回レンダリングされる必要はありません。コンポーネント関数の残りの部分は依然として実行されます（結果は破棄されます）。条件がすべてのHook呼び出しの下にある場合、早期にレンダリングを再開するために早期`return;`を追加することができます。

---

## トラブルシューティング {/*troubleshooting*/}

### 状態を更新しましたが、ログには古い値が表示されます {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

`set`関数を呼び出しても**実行中のコードの状態は変更されません**：

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // 1で再レンダリングをリクエスト
  console.log(count);  // まだ0！

  setTimeout(() => {
    console.log(count); // これも0！
  }, 5000);
}
```

これは[状態がスナップショットのように動作する](/learn/state-as-a-snapshot)ためです。状態を更新すると、新しい状態値で再レンダリングがリクエストされますが、すでに実行中のイベントハンドラ内の`count` JavaScript変数には影響しません。

次の状態を使用する必要がある場合は、`set`関数に渡す前に変数に保存できます：

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### 状態を更新しましたが、画面が更新されません {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

Reactは**次の状態が前の状態と等しい場合、更新を無視します**。これは[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較によって決定されます。これは通常、状態内のオブジェクトや配列を直接変更した場合に発生します：

```js
obj.x = 10;  // 🚩 間違い：既存のオブジェクトを変更
setObj(obj); // 🚩 何も起こりません
```

既存の`obj`オブジェクトを変更し、それを`setObj`に渡したため、Reactは更新を無視しました。これを修正するには、常に状態内のオブジェクトや配列を*変更する*のではなく、*置き換える*ことを確認する必要があります：

```js
// ✅ 正しい：新しいオブジェクトを作成
setObj({
  ...obj,
  x: 10
});
```

---

### エラーが発生しました：「再レンダリングが多すぎます」 {/*im-getting-an-error-too-many-re-renders*/}

「再レンダリングが多すぎます。Reactは無限ループを防ぐためにレンダリングの回数を制限します。」というエラーが発生することがあります。通常、これはレンダリング中に無条件に状態を設定しているため、コンポーネントがループに入ることを意味します：レンダリング、状態を設定（これがレンダリングを引き起こす）、レンダリング、状態を設定（これがレンダリングを引き起こす）、など。非常に頻繁に、これはイベントハンドラを指定する際のミスによって引き起こされます：

```js {1-2}
// 🚩 間違い：レンダリング中にハンドラを呼び出します
return <button onClick={handleClick()}>Click me</button>

// ✅ 正しい：イベントハンドラを渡します
return <button onClick={handleClick}>Click me</button>

// ✅ 正しい：インライン関数を渡します
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

このエラーの原因が見つからない場合、コンソールのエラーの横にある矢印をクリックして、エラーの原因となっている特定の`set`関数呼び出しを見つけるためにJavaScriptスタックを確認してください。

---

### 初期化関数や更新関数が2回実行されます {/*my-initializer-or-updater-function-runs-twice*/}

[ストリクトモード](/reference/react/StrictMode)では、Reactはいくつかの関数を1回ではなく2回呼び出します：

```js {2,5-6,11-12}
function TodoList() {
  // このコンポーネント関数は、各レンダリングで2回実行されます。

  const [todos, setTodos] = useState(() => {
    // この初期化関数は、初期化時に2回実行されます。
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // この更新関数は、各クリックで2回実行されます。
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

これは予期された動作であり、コードを壊すことはありません。

この**開発時のみ**の動作は、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)のに役立ちます。Reactは呼び出しの結果の1つを使用し、もう1つの結果を無視します。コンポーネント、初期化関数、および更新関数が純粋である限り、これによりロジックが影響を受けることはありません。ただし、偶然に不純である場合、これによりミスに気付くことができます。

例えば、この不純な更新関数は状態内の配列を変更します：

```js {2,3}
setTodos(prevTodos => {
  // 🚩 ミス：状態を変更しています
  prevTodos.push(createTodo());
});
```

Reactが更新関数を2回呼び出すため、todoが2回追加されたことがわかり、ミスがあることがわかります。この例では、[配列を変更するのではなく置き換える](#updating-objects-and-arrays-in-state)ことでミスを修正できます：

```js {2,3}
setTodos(prevTodos => {
  // ✅ 正しい：新しい状態で置き換えます
  return [...prevTodos, createTodo()];
});
```

この更新関数が純粋であるため、追加で呼び出しても動作に違いはありません。これが、Reactが2回呼び出すことでミスを見つけるのに役立つ理由です。**コンポーネント、初期化関数、および更新関数のみが純粋である必要があります。** イベントハンドラは純粋である必要はないため、Reactはイベントハンドラを2回呼び出すことはありません。

[コンポーネントを純粋に保つ](/learn/keeping-components-pure)について詳しく学んでください。

---

### 状態に関数を設定しようとしていますが、代わりに呼び出されます {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

次のように状態に関数を設定することはできません：

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

関数を渡しているため、Reactは`someFunction`が[初期化関数](#avoiding-recreating-the-initial-state)であり、`someOtherFunction`が[更新関数](#updating-state-based-on-the-previous-state)であると仮定し、それらを呼び出して結果を保存しようとします。実際に*関数を保存する*には、両方の場合に`() =>`を前に付ける必要があります。そうすれば、Reactは渡された関数を保存します。

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
