---
title: useContext
---

<Intro>

`useContext`는 컴포넌트에서 [context](/learn/passing-data-deeply-with-context)를 읽고 구독할 수 있게 해주는 React Hook입니다.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

`useContext`를 컴포넌트의 최상위에서 호출하여 [context](/learn/passing-data-deeply-with-context)를 읽고 구독합니다.

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[아래 예제들을 참조하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `SomeContext`: [`createContext`](/reference/react/createContext)로 이전에 생성한 context입니다. context 자체는 정보를 보유하지 않으며, 제공하거나 컴포넌트에서 읽을 수 있는 정보의 종류를 나타냅니다.

#### 반환값 {/*returns*/}

`useContext`는 호출하는 컴포넌트에 대한 context 값을 반환합니다. 이는 트리에서 호출하는 컴포넌트 위에 있는 가장 가까운 `SomeContext.Provider`에 전달된 `value`로 결정됩니다. 해당 provider가 없으면 반환되는 값은 해당 context에 대해 [`createContext`](/reference/react/createContext)로 전달한 `defaultValue`가 됩니다. 반환되는 값은 항상 최신 상태입니다. React는 context가 변경되면 해당 context를 읽는 컴포넌트를 자동으로 다시 렌더링합니다.

#### 주의사항 {/*caveats*/}

* 컴포넌트에서 `useContext()` 호출은 *같은* 컴포넌트에서 반환된 provider에 의해 영향을 받지 않습니다. 해당 `useContext()` 호출을 하는 컴포넌트 *위에* 해당하는 `<Context.Provider>`가 있어야 합니다.
* React는 특정 context를 사용하는 모든 자식을 해당 provider에서 다른 `value`를 받을 때부터 **자동으로 다시 렌더링**합니다. 이전 값과 다음 값은 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교로 비교됩니다. [`memo`](/reference/react/memo)로 다시 렌더링을 건너뛰는 것은 자식이 새로운 context 값을 받는 것을 방지하지 않습니다.
* 빌드 시스템이 출력에서 중복 모듈을 생성하는 경우(심볼릭 링크로 인해 발생할 수 있음), 이는 context를 깨뜨릴 수 있습니다. context를 통해 무언가를 전달하는 것은 context를 제공하는 데 사용하는 `SomeContext`와 읽는 데 사용하는 `SomeContext`가 `===` 비교로 **정확히 같은 객체**일 때만 작동합니다.

---

## 사용법 {/*usage*/}


### 트리 깊숙이 데이터 전달하기 {/*passing-data-deeply-into-the-tree*/}

`useContext`를 컴포넌트의 최상위에서 호출하여 [context](/learn/passing-data-deeply-with-context)를 읽고 구독합니다.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext`는 <CodeStep step={2}>context 값</CodeStep>을 <CodeStep step={1}>context</CodeStep>에 대해 반환합니다. context 값을 결정하기 위해 React는 컴포넌트 트리를 검색하여 해당 context에 대한 **가장 가까운 context provider 위**를 찾습니다.

`Button`에 context를 전달하려면 해당 context provider로 `Button` 또는 부모 컴포넌트 중 하나를 감쌉니다:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... 버튼을 렌더링합니다 ...
}
```

provider와 `Button` 사이에 몇 개의 컴포넌트 레이어가 있는지는 중요하지 않습니다. `Form` 내부의 *어디서든* `Button`이 `useContext(ThemeContext)`를 호출하면 `"dark"` 값을 받게 됩니다.

<Pitfall>

`useContext()`는 항상 호출하는 컴포넌트 *위*의 가장 가까운 provider를 찾습니다. 위로 검색하며 `useContext()`를 호출하는 컴포넌트의 provider는 **고려하지 않습니다**.

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

### context를 통해 전달된 데이터 업데이트하기 {/*updating-data-passed-via-context*/}

종종 context가 시간이 지남에 따라 변경되기를 원할 것입니다. context를 업데이트하려면 [state](/reference/react/useState)와 결합합니다. 부모 컴포넌트에서 상태 변수를 선언하고 현재 상태를 provider에 <CodeStep step={2}>context 값</CodeStep>으로 전달합니다.

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

이제 provider 내부의 모든 `Button`은 현재 `theme` 값을 받게 됩니다. provider에 전달하는 `theme` 값을 업데이트하기 위해 `setTheme`을 호출하면 모든 `Button` 컴포넌트가 새로운 `'light'` 값으로 다시 렌더링됩니다.

<Recipes titleText="context 업데이트 예제" titleId="examples-basic">

#### context를 통해 값 업데이트하기 {/*updating-a-value-via-context*/}

이 예제에서 `MyApp` 컴포넌트는 상태 변수를 보유하고 있으며, 이는 `ThemeContext` provider에 전달됩니다. "Dark mode" 체크박스를 선택하면 상태가 업데이트됩니다. 제공된 값을 변경하면 해당 context를 사용하는 모든 컴포넌트가 다시 렌더링됩니다.

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

`value="dark"`는 `"dark"` 문자열을 전달하지만, `value={theme}`는 [JSX 중괄호](/learn/javascript-in-jsx-with-curly-braces)로 JavaScript `theme` 변수의 값을 전달합니다. 중괄호를 사용하면 문자열이 아닌 context 값을 전달할 수 있습니다.

<Solution />

#### context를 통해 객체 업데이트하기 {/*updating-an-object-via-context*/}

이 예제에서는 `currentUser` 상태 변수가 객체를 보유하고 있습니다. `{ currentUser, setCurrentUser }`를 단일 객체로 결합하고 `value={}` 내부의 context를 통해 전달합니다. 이를 통해 `LoginButton`과 같은 하위 컴포넌트는 `currentUser`와 `setCurrentUser`를 모두 읽고 필요할 때 `setCurrentUser`를 호출할 수 있습니다.

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

#### 여러 context 사용하기 {/*multiple-contexts*/}

이 예제에서는 두 개의 독립된 context가 있습니다. `ThemeContext`는 현재 테마를 제공하며, 이는 문자열입니다. `CurrentUserContext`는 현재 사용자를 나타내는 객체를 보유합니다.

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

#### provider를 컴포넌트로 추출하기 {/*extracting-providers-to-a-component*/}

앱이 커짐에 따라 앱의 루트에 가까운 곳에 context의 "피라미드"가 생기는 것이 예상됩니다. 이는 문제가 되지 않습니다. 그러나 중첩이 미적으로 마음에 들지 않는다면 provider를 단일 컴포넌트로 추출할 수 있습니다. 이 예제에서 `MyProviders`는 "배관"을 숨기고 필요한 provider 내부에 전달된 자식을 렌더링합니다. `theme` 및 `setTheme` 상태는 `MyApp` 자체에서 필요하므로 `MyApp`은 여전히 해당 상태를 소유합니다.

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

#### context와 reducer로 확장하기 {/*scaling-up-with-context-and-a-reducer*/}

더 큰 앱에서는 context를 [reducer](/reference/react/useReducer)와 결합하여 일부 상태와 관련된 로직을 컴포넌트에서 추출하는 것이 일반적입니다. 이 예제에서는 모든 "배선"이 `TasksContext.js`에 숨겨져 있으며, 여기에는 reducer와 두 개의 별도 context가 포함되어 있습니다.

이 예제에 대한 [전체 설명](/learn/scaling-up-with-reducer-and-context)을 읽어보세요.

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

### 기본값을 지정하기 {/*specifying-a-fallback-default-value*/}

React가 부모 트리에서 해당 <CodeStep step={1}>context</CodeStep>의 provider를 찾을 수 없는 경우, `useContext()`로 반환되는 context 값은 해당 context를 [생성할 때](/reference/react/createContext) 지정한 <CodeStep step={3}>기본값</CodeStep>과 동일합니다:

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

기본값은 **절대 변경되지 않습니다**. context를 업데이트하려면 [위에서 설명한 대로](#updating-data-passed-via-context) state와 함께 사용하세요.

종종 `null` 대신 더 의미 있는 값을 기본값으로 사용할 수 있습니다. 예를 들어:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

이렇게 하면 해당 provider 없이 일부 컴포넌트를 렌더링해도 깨지지 않습니다. 또한 테스트 환경에서 많은 provider를 설정하지 않고도 컴포넌트가 잘 작동하도록 도와줍니다.

아래 예제에서 "Toggle theme" 버튼은 **어떤 테마 context provider 외부**에 있기 때문에 항상 light입니다. 기본 테마를 `'dark'`로 편집해보세요.

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

### 트리의 일부에 대해 context 재정의하기 {/*overriding-context-for-a-part-of-the-tree*/}

다른 값으로 provider에 감싸서 트리의 일부에 대해 context를 재정의할 수 있습니다.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

필요한 만큼 provider를 중첩하고 재정의할 수 있습니다.

<Recipes titleText="context 재정의 예제">

#### 테마 재정의하기 {/*overriding-a-theme*/}

여기서 `Footer` 내부의 버튼은 외부 버튼과 다른 context 값(`"light"`)을 받습니다(`"dark"`).

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

#### 자동으로 중첩된 헤딩 {/*automatically-nested-headings*/}

context provider를 중첩할 때 정보를 "축적"할 수 있습니다. 이 예제에서 `Section` 컴포넌트는 섹션 중첩의 깊이를 지정하는 `LevelContext`를 추적합니다. 부모 섹션에서 `LevelContext`를 읽고, 자식에게 증가된 `LevelContext` 번호를 제공합니다. 결과적으로 `Heading` 컴포넌트는 몇 개의 `Section` 컴포넌트 내부에 중첩되어 있는지에 따라 자동으로 `<h1>`, `<h2>`, `<h3>`, ... 태그를 결정할 수 있습니다.

이 예제에 대한 [자세한 설명](/learn/passing-data-deeply-with-context)을 읽어보세요.

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
      return <h4>{children}</h4>;
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

### 객체와 함수를 전달할 때 다시 렌더링 최적화하기 {/*optimizing-re-renders-when-passing-objects-and-functions*/}

context를 통해 객체와 함수를 포함한 모든 값을 전달할 수 있습니다.

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

여기서 <CodeStep step={2}>context 값</CodeStep>은 두 개의 속성을 가진 JavaScript 객체이며, 그 중 하나는 함수입니다. `MyApp`이 다시 렌더링될 때마다(예: 경로 업데이트 시) 이는 *다른* 객체가 되어 *다른* 함수를 가리키므로, React는 `useContext(AuthContext)`를 호출하는 트리 깊숙한 모든 컴포넌트를 다시 렌더링해야 합니다.

작은 앱에서는 문제가 되지 않습니다. 그러나 기본 데이터인 `currentUser`가 변경되지 않은 경우 다시 렌더링할 필요가 없습니다. React가 이 사실을 활용할 수 있도록 `login` 함수를 [`useCallback`](/reference/react/useCallback)으로 감싸고 객체 생성을 [`useMemo`](/reference/react/useMemo)로 감쌉니다. 이는 성능 최적화입니다:

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
    <<AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

이 변경의 결과로, `MyApp`이 다시 렌더링되어도 `useContext(AuthContext)`를 호출하는 컴포넌트는 `currentUser`가 변경되지 않는 한 다시 렌더링되지 않습니다.

[`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) 및 [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)에 대해 더 읽어보세요.

---

## 문제 해결 {/*troubleshooting*/}

### 내 컴포넌트가 provider의 값을 인식하지 못합니다 {/*my-component-doesnt-see-the-value-from-my-provider*/}

이런 일이 발생할 수 있는 몇 가지 일반적인 방법이 있습니다:

1. `useContext()`를 호출하는 컴포넌트와 동일한 컴포넌트(또는 아래)에서 `<SomeContext.Provider>`를 렌더링하고 있습니다. `useContext()`를 호출하는 컴포넌트 *위에* `<SomeContext.Provider>`를 이동하세요.
2. `<SomeContext.Provider>`로 컴포넌트를 감싸는 것을 잊었거나, 생각했던 것과 다른 트리의 다른 부분에 넣었을 수 있습니다. [React DevTools](/learn/react-developer-tools)을 사용하여 계층 구조가 올바른지 확인하세요.
3. 빌드 도구의 문제로 인해 제공하는 컴포넌트에서 본 `SomeContext`와 읽는 컴포넌트에서 본 `SomeContext`가 두 개의 다른 객체가 되는 경우가 있습니다. 예를 들어 심볼릭 링크를 사용하는 경우 발생할 수 있습니다. 이를 확인하려면 `window.SomeContext1` 및 `window.SomeContext2`와 같은 전역 변수에 할당한 다음 콘솔에서 `window.SomeContext1 === window.SomeContext2`인지 확인하세요. 동일하지 않다면 빌드 도구 수준에서 해당 문제를 해결하세요.

### 기본값이 다른데도 context에서 항상 `undefined`를 받습니다 {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

트리에 `value`가 없는 provider가 있을 수 있습니다:

```js {1,2}
// 🚩 작동하지 않음: value prop 없음
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

`value`를 지정하지 않으면 `value={undefined}`를 전달하는 것과 같습니다.

또한 실수로 다른 prop 이름을 사용했을 수 있습니다:

```js {1,2}
// 🚩 작동하지 않음: prop 이름은 "value"여야 함
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

이 두 경우 모두 콘솔에서 React의 경고를 볼 수 있습니다. 이를 수정하려면 prop 이름을 `value`로 지정하세요:

```js {1,2}
// ✅ value prop 전달
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

[createContext(defaultValue) 호출](#specifying-a-fallback-default-value)에서 기본값은 **해당 provider가 전혀 없을 때만** 사용됩니다. 부모 트리에 `<SomeContext.Provider value={undefined}>` 컴포넌트가 있는 경우, `useContext(SomeContext)`를 호출하는 컴포넌트는 context 값으로 `undefined`를 받게 됩니다.