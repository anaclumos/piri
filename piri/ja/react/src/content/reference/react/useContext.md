---
title: useContext
---

<Intro>

`useContext`は、コンポーネントから[コンテキスト](/learn/passing-data-deeply-with-context)を読み取り、購読するためのReact Hookです。

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

`useContext`をコンポーネントのトップレベルで呼び出して、[コンテキスト](/learn/passing-data-deeply-with-context)を読み取り、購読します。

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `SomeContext`: [`createContext`](/reference/react/createContext)で以前に作成したコンテキスト。コンテキスト自体は情報を保持せず、コンポーネントから提供または読み取ることができる情報の種類を表します。

#### 戻り値 {/*returns*/}

`useContext`は、呼び出し元コンポーネントのコンテキスト値を返します。これは、ツリー内の呼び出し元コンポーネントの上にある最も近い`SomeContext.Provider`に渡された`value`として決定されます。そのようなプロバイダーがない場合、返される値はそのコンテキストに対して[`createContext`](/reference/react/createContext)に渡した`defaultValue`になります。返される値は常に最新です。Reactは、コンテキストが変更された場合、コンテキストを読み取るコンポーネントを自動的に再レンダリングします。

#### 注意点 {/*caveats*/}

* コンポーネント内の`useContext()`呼び出しは、*同じ*コンポーネントから返されるプロバイダーの影響を受けません。対応する`<Context.Provider>`は、`useContext()`呼び出しを行うコンポーネントの*上に*ある必要があります。
* Reactは、特定のコンテキストを使用するすべての子コンポーネントを、異なる`value`を受け取るプロバイダーから自動的に再レンダリングします。前の値と次の値は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較で比較されます。[`memo`](/reference/react/memo)を使用して再レンダリングをスキップしても、新しいコンテキスト値を受け取る子コンポーネントの再レンダリングは防げません。
* ビルドシステムが出力に重複したモジュールを生成する場合（シンボリックリンクで発生することがあります）、これがコンテキストを壊す可能性があります。コンテキストを介して何かを渡すには、コンテキストを提供するために使用する`SomeContext`とそれを読み取るために使用する`SomeContext`が***完全に*同じオブジェクト**である必要があります。これは`===`比較で決定されます。

---

## 使用法 {/*usage*/}


### ツリーにデータを深く渡す {/*passing-data-deeply-into-the-tree*/}

`useContext`をコンポーネントのトップレベルで呼び出して、[コンテキスト](/learn/passing-data-deeply-with-context)を読み取り、購読します。

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext`は、渡された<CodeStep step={2}>コンテキスト値</CodeStep>を返します。Reactはコンポーネントツリーを検索し、その特定のコンテキストに対して**最も近いコンテキストプロバイダー**を見つけます。

コンテキストを`Button`に渡すには、対応するコンテキストプロバイダーでそれまたはその親コンポーネントのいずれかをラップします：

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

プロバイダーと`Button`の間にいくつのコンポーネントレイヤーがあっても関係ありません。`Form`内の*どこにでも*ある`Button`が`useContext(ThemeContext)`を呼び出すと、値として`"dark"`を受け取ります。

<Pitfall>

`useContext()`は常にそれを呼び出すコンポーネントの*上にある*最も近いプロバイダーを探します。上向きに検索し、`useContext()`を呼び出しているコンポーネント内のプロバイダーは**考慮しません**。

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### コンテキストを介して渡されるデータの更新 {/*updating-data-passed-via-context*/}

多くの場合、コンテキストは時間とともに変化します。コンテキストを更新するには、[state](/reference/react/useState)と組み合わせます。親コンポーネントで状態変数を宣言し、現在の状態をプロバイダーに<CodeStep step={2}>コンテキスト値</CodeStep>として渡します。

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

これで、プロバイダー内の任意の`Button`は現在の`theme`値を受け取ります。プロバイダーに渡す`theme`値を更新するために`setTheme`を呼び出すと、すべての`Button`コンポーネントが新しい`'light'`値で再レンダリングされます。

<Recipes titleText="コンテキストの更新例" titleId="examples-basic">

#### コンテキストを介して値を更新する {/*updating-a-value-via-context*/}

この例では、`MyApp`コンポーネントが状態変数を保持し、それを`ThemeContext`プロバイダーに渡します。「ダークモード」チェックボックスをオンにすると状態が更新されます。提供される値が変更されると、そのコンテキストを使用するすべてのコンポーネントが再レンダリングされます。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

`value="dark"`は`"dark"`文字列を渡しますが、`value={theme}`はJavaScriptの`theme`変数の値を[JSXの中括弧](/learn/javascript-in-jsx-with-curly-braces)で渡します。中括弧を使用すると、文字列以外のコンテキスト値も渡すことができます。

<Solution />

#### コンテキストを介してオブジェクトを更新する {/*updating-an-object-via-context*/}

この例では、`currentUser`状態変数がオブジェクトを保持します。`{ currentUser, setCurrentUser }`を1つのオブジェクトにまとめ、`value={}`内のコンテキストを通じて渡します。これにより、`LoginButton`のような任意のコンポーネントが`currentUser`と`setCurrentUser`の両方を読み取り、必要に応じて`setCurrentUser`を呼び出すことができます。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### 複数のコンテキスト {/*multiple-contexts*/}

この例では、2つの独立したコンテキストがあります。`ThemeContext`は現在のテーマ（文字列）を提供し、`CurrentUserContext`は現在のユーザーを表すオブジェクトを保持します。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### プロバイダーをコンポーネントに抽出する {/*extracting-providers-to-a-component*/}

アプリが成長するにつれて、アプリのルートに近い場所にコンテキストの「ピラミッド」ができることが予想されます。これは問題ありませんが、見た目が気に入らない場合は、プロバイダーを1つのコンポーネントに抽出できます。この例では、`MyProviders`が「配管」を隠し、必要なプロバイダー内で渡された子コンポーネントをレンダリングします。`
MyApp`自体で`theme`と`setTheme`の状態が必要なので、`MyApp`はその状態の一部を所有し続けます。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### コンテキストとリデューサーを使用してスケールアップする {/*scaling-up-with-context-and-a-reducer*/}

大規模なアプリでは、[リデューサー](/reference/react/useReducer)とコンテキストを組み合わせて、コンポーネントの外にある状態に関連するロジックを抽出することが一般的です。この例では、すべての「配線」が`TasksContext.js`に隠されており、リデューサーと2つの別々のコンテキストが含まれています。

この例の[完全なウォークスルー](/learn/scaling-up-with-reducer-and-context)を読むことができます。

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### フォールバックのデフォルト値を指定する {/*specifying-a-fallback-default-value*/}

Reactが親ツリー内のその特定の<CodeStep step={1}>コンテキスト</CodeStep>のプロバイダーを見つけられない場合、`useContext()`によって返されるコンテキスト値は、[そのコンテキストを作成したとき](/reference/react/createContext)に指定した<CodeStep step={3}>デフォルト値</CodeStep>と等しくなります：

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

デフォルト値は**決して変わりません**。コンテキストを更新したい場合は、[上記のように](/updating-data-passed-via-context)状態と一緒に使用します。

多くの場合、`null`の代わりに、デフォルトとして使用できるより意味のある値があります。例えば：

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

このようにすると、対応するプロバイダーなしで誤ってコンポーネントをレンダリングしても壊れません。また、テスト環境で多くのプロバイダーを設定せずにコンポーネントがうまく動作するのにも役立ちます。

以下の例では、「Toggle theme」ボタンは常にライトです。なぜなら、それは**どのテーマコンテキストプロバイダーの外側**にあり、デフォルトのコンテキストテーマ値が`'light'`だからです。デフォルトのテーマを`'dark'`に編集してみてください。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### ツリーの一部のコンテキストをオーバーライドする {/*overriding-context-for-a-part-of-the-tree*/}

ツリーの一部のコンテキストをオーバーライドするには、その部分を異なる値のプロバイダーでラップします。

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

必要に応じて、プロバイダーをネストしてオーバーライドできます。

<Recipes titleText="コンテキストのオーバーライド例">

#### テーマのオーバーライド {/*overriding-a-theme*/}

ここでは、`Footer`内のボタンは外側のボタンとは異なるコンテキスト値（`"light"`）を受け取ります（`"dark"`）。

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 自動的にネストされた見出し {/*automatically-nested-headings*/}

コンテキストプロバイダーをネストするときに情報を「蓄積」できます。この例では、`Section`コンポーネントがセクションのネストの深さを指定する`LevelContext`を追跡します。親セクションから`LevelContext`を読み取り、子に`LevelContext`番号を1増やして提供します。その結果、`Heading`コンポーネントは、いくつの`Section`コンポーネント内にネストされているかに基づいて、どの`<h1>`、`<h2>`、`<h3>`、...タグを使用するかを自動的に決定できます。

この例の[詳細なウォークスルー](/learn/passing-data-deeply-with-context)を読むことができます。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### オブジェクトや関数を渡す際の再レンダリングの最適化 {/*optimizing-re-renders-when-passing-objects-and-functions*/}

コンテキストを介して任意の値を渡すことができます。オブジェクトや関数も含まれます。

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

ここで、<CodeStep step={2}>コンテキスト値</CodeStep>は2つのプロパティを持つJavaScriptオブジェクトで、そのうちの1つは関数です。`MyApp`が再レンダリングされるたびに（例えば、ルートの更新時）、これは*異なる*オブジェクトであり、*異なる*関数を指すため、Reactは`useContext(AuthContext)`を呼び出すツリーの深い部分のすべてのコンポーネントも再レンダリングする必要があります。

小規模なアプリでは、これは問題になりません。しかし、基礎データ（例えば`currentUser`）が変更されていない場合、再レンダリングする必要はありません。この事実を活用するために、`login`関数を[`useCallback`](/reference/react/useCallback)でラップし、オブジェクトの作成を[`useMemo`](/reference/react/useMemo)でラップすることができます。これはパフォーマンスの最適化です：

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

この変更の結果、`MyApp`が再レンダリングされても、`useContext(AuthContext)`を呼び出すコンポーネントは`currentUser`が変更されない限り再レンダリングされません。

[`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components)と[`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)について詳しく読むことができます。

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントがプロバイダーの値を認識しない {/*my-component-doesnt-see-the-value-from-my-provider*/}

これが発生する一般的な方法はいくつかあります：

1. `<SomeContext.Provider>`を`useContext()`を呼び出しているコンポーネントと同じコンポーネント（またはそれ以下）でレンダリングしています。`<SomeContext.Provider>`を*上に移動して*、`useContext()`を呼び出しているコンポーネントの外側に配置します。
2. `<SomeContext.Provider>`でコンポーネントをラップするのを忘れたか、思っていたのとは異なる部分に配置した可能性があります。[React DevTools](/learn/react-developer-tools)を使用して階層が正しいかどうかを確認してください。
3. ビルドツールの問題で、提供するコンポーネントから見た`SomeContext`と読み取るコンポーネントから見た`SomeContext`が異なるオブジェクトになっている可能性があります。これは、シンボリックリンクを使用している場合などに発生することがあります。これを確認するには、`window.SomeContext1`と`window.SomeContext2`のようにグローバルに割り当て、コンソールで`window.SomeContext1 === window.SomeContext2`かどうかを確認します。同じでない場合は、ビルドツールレベルでその問題を修正します。

### デフォルト値が異なるのに、常にコンテキストから`undefined`を取得する {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

ツリー内に`value`のないプロバイダーがある可能性があります：

```js {1,2}
// 🚩 動作しません: valueプロップがありません
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

`value`を指定し忘れると、`value={undefined}`を渡すのと同じです。

また、誤って異なるプロップ名を使用した可能性もあります：

```js {1,2}
// 🚩 動作しません: プロップは"value"と呼ばれるべきです
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

これらの両方の場合、コンソールにReactからの警告が表示されるはずです。これを修正するには、プロップを`value`と呼びます：

```js {1,2}
// ✅ valueプロップを渡す
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

[`createContext(defaultValue)`呼び出し](/specifying-a-fallback-default-value)からの[デフォルト値](#specifying-a-fallback-default-value)は、**対応するプロバイダーが全くない場合にのみ**使用されます。親ツリーのどこかに`<SomeContext.Provider value={undefined}>`コンポーネントがある場合、`useContext(SomeContext)`を呼び出すコンポーネントはコンテキスト値として`undefined`を受け取ります。