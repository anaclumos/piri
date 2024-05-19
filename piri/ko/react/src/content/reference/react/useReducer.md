---
title: useReducer
---

<Intro>

`useReducer`는 컴포넌트에 [reducer](/learn/extracting-state-logic-into-a-reducer)를 추가할 수 있게 해주는 React Hook입니다.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

컴포넌트의 최상위 레벨에서 `useReducer`를 호출하여 [reducer](/learn/extracting-state-logic-into-a-reducer)로 상태를 관리합니다.

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reducer`: 상태가 업데이트되는 방식을 지정하는 reducer 함수입니다. 순수해야 하며, 상태와 액션을 인수로 받아 다음 상태를 반환해야 합니다. 상태와 액션은 어떤 타입이든 될 수 있습니다.
* `initialArg`: 초기 상태가 계산되는 값입니다. 어떤 타입이든 될 수 있습니다. 초기 상태가 이 값에서 어떻게 계산되는지는 다음 `init` 인수에 따라 다릅니다.
* **선택적** `init`: 초기 상태를 반환해야 하는 초기화 함수입니다. 지정되지 않으면 초기 상태는 `initialArg`로 설정됩니다. 그렇지 않으면 초기 상태는 `init(initialArg)` 호출 결과로 설정됩니다.

#### 반환값 {/*returns*/}

`useReducer`는 정확히 두 개의 값을 가진 배열을 반환합니다:

1. 현재 상태. 첫 번째 렌더링 시 `init(initialArg)` 또는 `initialArg`(만약 `init`이 없다면)로 설정됩니다.
2. 상태를 다른 값으로 업데이트하고 다시 렌더링을 트리거할 수 있는 [`dispatch` 함수](#dispatch).

#### 주의사항 {/*caveats*/}

* `useReducer`는 Hook이므로 **컴포넌트의 최상위 레벨** 또는 자체 Hook에서만 호출할 수 있습니다. 루프나 조건문 내에서 호출할 수 없습니다. 그런 경우에는 새 컴포넌트를 추출하고 상태를 그 안으로 이동하세요.
* Strict Mode에서는 React가 [우발적인 불순물을 찾기 위해](#my-reducer-or-initializer-function-runs-twice) **reducer와 초기화 함수를 두 번 호출**합니다. 이는 개발 전용 동작이며 프로덕션에는 영향을 미치지 않습니다. reducer와 초기화 함수가 순수하다면(그렇게 해야 합니다), 이는 논리에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.

---

### `dispatch` 함수 {/*dispatch*/}

`useReducer`가 반환하는 `dispatch` 함수는 상태를 다른 값으로 업데이트하고 다시 렌더링을 트리거할 수 있게 해줍니다. `dispatch` 함수에 액션을 유일한 인수로 전달해야 합니다:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React는 현재 `state`와 `dispatch`에 전달된 액션을 사용하여 제공된 `reducer` 함수를 호출한 결과로 다음 상태를 설정합니다.

#### 매개변수 {/*dispatch-parameters*/}

* `action`: 사용자가 수행한 액션입니다. 어떤 타입이든 될 수 있습니다. 관례적으로, 액션은 이를 식별하는 `type` 속성과 선택적으로 추가 정보를 가진 다른 속성을 포함하는 객체입니다.

#### 반환값 {/*dispatch-returns*/}

`dispatch` 함수는 반환값이 없습니다.

#### 주의사항 {/*setstate-caveats*/}

* `dispatch` 함수는 **다음 렌더링을 위한 상태 변수만 업데이트**합니다. `dispatch` 함수를 호출한 후 상태 변수를 읽으면 [여전히 이전 값](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value)을 얻습니다.

* 제공한 새 값이 현재 `state`와 동일한 경우, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교에 의해 React는 **컴포넌트와 자식의 다시 렌더링을 건너뜁니다.** 이는 최적화입니다. React는 여전히 결과를 무시하기 전에 컴포넌트를 호출해야 할 수도 있지만, 이는 코드에 영향을 미치지 않습니다.

* React는 [상태 업데이트를 일괄 처리합니다.](/learn/queueing-a-series-of-state-updates) 모든 이벤트 핸들러가 실행되고 `set` 함수가 호출된 후 화면을 **업데이트합니다.** 이는 단일 이벤트 동안 여러 번의 다시 렌더링을 방지합니다. 드물게 React가 화면을 더 일찍 업데이트하도록 강제해야 하는 경우, 예를 들어 DOM에 접근하기 위해 [`flushSync`](/reference/react-dom/flushSync)를 사용할 수 있습니다.

---

## 사용법 {/*usage*/}

### 컴포넌트에 reducer 추가하기 {/*adding-a-reducer-to-a-component*/}

컴포넌트의 최상위 레벨에서 `useReducer`를 호출하여 [reducer](/learn/extracting-state-logic-into-a-reducer)로 상태를 관리합니다.

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer`는 정확히 두 개의 항목을 가진 배열을 반환합니다:

1. 이 상태 변수의 <CodeStep step={1}>현재 상태</CodeStep>, 처음에는 제공한 <CodeStep step={3}>초기 상태</CodeStep>로 설정됩니다.
2. 상호작용에 응답하여 상태를 변경할 수 있는 <CodeStep step={2}>`dispatch` 함수</CodeStep>.

화면에 표시되는 내용을 업데이트하려면, 사용자가 수행한 작업을 나타내는 객체인 *액션*을 <CodeStep step={2}>`dispatch`</CodeStep>에 전달합니다:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React는 현재 상태와 액션을 <CodeStep step={4}>reducer 함수</CodeStep>에 전달합니다. reducer는 다음 상태를 계산하고 반환합니다. React는 그 다음 상태를 저장하고, 해당 상태로 컴포넌트를 렌더링하며, UI를 업데이트합니다.

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

`useReducer`는 [`useState`](/reference/react/useState)와 매우 유사하지만, 상태 업데이트 로직을 이벤트 핸들러에서 컴포넌트 외부의 단일 함수로 이동할 수 있게 해줍니다. [`useState`와 `useReducer` 사이의 선택에 대해 더 읽어보세요.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### reducer 함수 작성하기 {/*writing-the-reducer-function*/}

reducer 함수는 다음과 같이 선언됩니다:

```js
function reducer(state, action) {
  // ...
}
```

그런 다음 다음 상태를 계산하고 반환할 코드를 채워야 합니다. 관례적으로, [`switch` 문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)으로 작성하는 것이 일반적입니다. `switch`의 각 `case`에서 다음 상태를 계산하고 반환합니다.

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

액션은 어떤 형태든 될 수 있습니다. 관례적으로, 액션을 식별하는 `type` 속성을 가진 객체를 전달하는 것이 일반적입니다. reducer가 다음 상태를 계산하는 데 필요한 최소한의 정보를 포함해야 합니다.

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

액션 타입 이름은 컴포넌트에 로컬입니다. [각 액션은 단일 상호작용을 설명합니다, 비록 그것이 데이터의 여러 변경을 초래하더라도.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) 상태의 형태는 임의적이지만, 일반적으로 객체나 배열이 될 것입니다.

[reducer로 상태 로직 추출하기](/learn/extracting-state-logic-into-a-reducer)에 대해 더 읽어보세요.

<Pitfall>

상태는 읽기 전용입니다. 상태의 객체나 배열을 수정하지 마세요:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 상태의 객체를 이렇게 수정하지 마세요:
      state.age = state.age + 1;
      return state;
    }
```

대신, 항상 reducer에서 새로운 객체를 반환하세요:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ 대신, 새로운 객체를 반환하세요
      return {
        ...state,
        age: state.age + 1
      };
    }
```

[상태에서 객체 업데이트하기](/learn/updating-objects-in-state)와 [상태에서 배열 업데이트하기](/learn/updating-arrays-in-state)에 대해 더 읽어보세요.

</Pitfall>

<Recipes titleText="기본 useReducer 예제" titleId="examples-basic">

#### 폼 (객체) {/*form-object*/}

이 예제에서 reducer는 `name`과 `age` 두 필드를 가진 상태 객체를 관리합니다.

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

#### 할 일 목록 (배열) {/*todo-list-array*/}

이 예제에서 reducer는 작업 배열을 관리합니다. 배열은 [변경 없이 업데이트되어야 합니다.](/learn/updating-arrays-in-state)

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

#### Immer로 간결한 업데이트 로직 작성하기 {/*writing-concise-update-logic-with-immer*/}

배열과 객체를 변경 없이 업데이트하는 것이 번거롭게 느껴진다면, [Immer](https://github.com/immerjs/use-immer#useimmerreducer)와 같은 라이브러리를 사용하여 반복적인 코드를 줄일 수 있습니다. Immer는 객체를 변경하는 것처럼 간결한 코드를 작성할 수 있게 해주지만, 내부적으로는 불변 업데이트를 수행합니다:

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

### 초기 상태 재생성을 피하기 {/*avoiding-recreating-the-initial-state*/}

React는 초기 상태를 한 번 저장하고 다음 렌더링에서는 무시합니다.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

비록 `createInitialState(username)`의 결과는 초기 렌더링에만 사용되지만, 여전히 매 렌더링마다 이 함수를 호출하고 있습니다. 이는 큰 배열을 생성하거나 비용이 많이 드는 계산을 수행하는 경우 낭비가 될 수 있습니다.

이를 해결하기 위해, **세 번째 인수로 _초기화 함수_**를 `useReducer`에 전달할 수 있습니다:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

여기서 `createInitialState`를 전달하고 있으며, 이는 *함수 자체*이지 `createInitialState()`를 호출한 결과가 아닙니다. 이렇게 하면 초기 상태가 초기화 후 다시 생성되지 않습니다.

위 예제에서 `createInitialState`는 `username` 인수를 받습니다. 초기 상태를 계산하는 데 정보가 필요하지 않은 경우, `useReducer`의 두 번째 인수로 `null`을 전달할 수 있습니다.

<Recipes titleText="초기화 함수를 전달하는 것과 초기 상태를 직접 전달하는 것의 차이점" titleId="examples-initializer">

#### 초기화 함수 전달하기 {/*passing-the-initializer-function*/}

이 예제는 초기화 함수를 전달하므로, `createInitialState` 함수는 초기화 중에만 실행됩니다. 컴포넌트가 다시 렌더링될 때, 예를 들어 입력란에 입력할 때는 실행되지 않습니다.

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

#### 초기 상태 직접 전달하기 {/*passing-the-initial-state-directly*/}

이 예제는 **초기화 함수**를 전달하지 않으므로, `createInitialState` 함수는 매 렌더링마다 실행됩니다. 예를 들어 입력란에 입력할 때도 실행됩니다. 동작에는 차이가 없지만, 이 코드는 덜 효율적입니다.

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

## 문제 해결 {/*troubleshooting*/}

### 액션을 디스패치했지만 로그에 이전 상태 값이 나옵니다 {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

`dispatch` 함수를 호출해도 **실행 중인 코드에서 상태가 변경되지 않습니다**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // 43으로 다시 렌더링 요청
  console.log(state.age);  // 여전히 42!

  setTimeout(() => {
    console.log(state.age); // 여전히 42!
  }, 5000);
}
```

이는 [상태가 스냅샷처럼 동작하기 때문입니다.](/learn/state-as-a-snapshot) 상태를 업데이트하면 새로운 상태 값으로 다시 렌더링을 요청하지만, 이미 실행 중인 이벤트 핸들러의 `state` JavaScript 변수에는 영향을 미치지 않습니다.

다음 상태 값을 추측해야 하는 경우, reducer를 직접 호출하여 수동으로 계산할 수 있습니다:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### 액션을 디스패치했지만 화면이 업데이트되지 않습니다 {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React는 **다음 상태가 이전 상태와 동일한 경우 업데이트를 무시합니다,** 이는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교에 의해 결정됩니다. 이는 일반적으로 상태에서 객체나 배열을 직접 변경할 때 발생합니다:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 잘못된 예: 기존 객체를 변경
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 잘못된 예: 기존 객체를 변경
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

기존 `state` 객체를 변경하고 반환했기 때문에 React는 업데이트를 무시했습니다. 이를 수정하려면 항상 상태에서 [객체를 업데이트](/learn/updating-objects-in-state)하고 [배열을 업데이트](/learn/updating-arrays-in-state)해야 합니다:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ 올바른 예: 새로운 객체 생성
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ 올바른 예: 새로운 객체 생성
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

### 디스패치 후 reducer 상태의 일부가 undefined가 됩니다 {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

새 상태를 반환할 때마다 **기존 필드를 모두 복사**해야 합니다:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // 이 부분을 잊지 마세요!
        age: state.age + 1
      };
    }
    // ...
```

위의 `...state`가 없으면, 반환된 다음 상태는 `age` 필드만 포함하고 다른 것은 포함하지 않습니다.

---

### 디스패치 후 reducer 상태 전체가 undefined가 됩니다 {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

상태가 예상치 않게 `undefined`가 되는 경우, 케이스 중 하나에서 상태를 `return`하는 것을 잊었거나, 액션 타입이 `case` 문과 일치하지 않는 경우일 가능성이 큽니다. 원인을 찾기 위해 `switch` 외부에서 오류를 던지세요:

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

또한 TypeScript와 같은 정적 타입 검사기를 사용하여 이러한 실수를 잡을 수 있습니다.

---

### "Too many re-renders" 오류가 발생합니다 {/*im-getting-an-error-too-many-re-renders*/}

`Too many re-renders. React limits the number of renders to prevent an infinite loop.`라는 오류가 발생할 수 있습니다. 일반적으로 이는 *렌더링 중* 무조건적으로 액션을 디스패치하고 있어, 컴포넌트가 루프에 빠지기 때문입니다: 렌더링, 디스패치(렌더링을 유발), 렌더링, 디스패치(렌더링을 유발), 등등. 이는 이벤트 핸들러를 지정하는 데 실수가 있는 경우가 많습니다:

```js {1-2}
// 🚩 잘못된 예: 렌더링 중 핸들러 호출
return <button onClick={handleClick()}>Click me</button>

// ✅ 올바른 예: 이벤트 핸들러 전달
return <button onClick={handleClick}>Click me</button>

// ✅ 올바른 예: 인라인 함수 전달
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

이 오류의 원인을 찾을 수 없는 경우, 콘솔의 오류 옆에 있는 화살표를 클릭하고 JavaScript 스택을 살펴보아 오류를 일으킨 특정 `dispatch` 함수 호출을 찾으세요.

---

### reducer 또는 초기화 함수가 두 번 실행됩니다 {/*my-reducer-or-initializer-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode)에서는 React가 reducer와 초기화 함수를 두 번 호출합니다. 이는 코드에 영향을 미치지 않아야 합니다.

이 **개발 전용** 동작은 [컴포넌트를 순수하게 유지하는 데](#keeping-components-pure) 도움이 됩니다. React는 호출 중 하나의 결과를 사용하고, 다른 호출의 결과는 무시합니다. 컴포넌트, 초기화 함수, reducer 함수가 순수한 한, 이는 논리에 영향을 미치지 않습니다. 그러나 실수로 불순한 경우, 이를 통해 실수를 발견할 수 있습니다.

예를 들어, 이 불순한 reducer 함수는 상태의 배열을 변경합니다:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 실수: 상태 변경
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

React가 reducer 함수를 두 번 호출하기 때문에, 할 일이 두 번 추가된 것을 볼 수 있어 실수가 있음을 알 수 있습니다. 이 예제에서는 [배열을 변경하는 대신 교체하여](#adding-to-an-array) 실수를 수정할 수 있습니다:

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ 올바른 예: 새로운 상태로 교체
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

이제 이 reducer 함수가 순수해졌기 때문에, 추가 호출이 동작에 차이를 만들지 않습니다. React가 두 번 호출하는 이유는 실수를 찾는 데 도움이 되기 때문입니다. **컴포넌트, 초기화 함수, reducer 함수만 순수해야 합니다.** 이벤트 핸들러는 순수할 필요가 없으므로, React는 이벤트 핸들러를 두 번 호출하지 않습니다.

[컴포넌트를 순수하게 유지하기](/learn/keeping-components-pure)에 대해 더 읽어보세요.