---
title: 리듀서로 상태 로직 추출하기
---

<Intro>

여러 이벤트 핸들러에 걸쳐 많은 상태 업데이트가 있는 컴포넌트는 압도적일 수 있습니다. 이러한 경우, 컴포넌트 외부의 단일 함수, 즉 _리듀서_ 라고 불리는 함수에서 모든 상태 업데이트 로직을 통합할 수 있습니다.

</Intro>

<YouWillLearn>

- 리듀서 함수가 무엇인지
- `useState`를 `useReducer`로 리팩터링하는 방법
- 리듀서를 언제 사용하는지
- 리듀서를 잘 작성하는 방법

</YouWillLearn>

## 리듀서로 상태 로직 통합하기 {/*consolidate-state-logic-with-a-reducer*/}

컴포넌트가 복잡해질수록 컴포넌트의 상태가 업데이트되는 다양한 방법을 한눈에 파악하기 어려워질 수 있습니다. 예를 들어, 아래의 `TaskApp` 컴포넌트는 상태에 `tasks` 배열을 보유하고 있으며, 작업을 추가, 제거 및 편집하기 위해 세 가지 다른 이벤트 핸들러를 사용합니다:

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

각 이벤트 핸들러는 상태를 업데이트하기 위해 `setTasks`를 호출합니다. 이 컴포넌트가 성장함에 따라 상태 로직이 여기저기 흩어지게 됩니다. 이 복잡성을 줄이고 모든 로직을 쉽게 접근할 수 있는 한 곳에 유지하려면, 상태 로직을 컴포넌트 외부의 단일 함수, **"리듀서"**로 이동할 수 있습니다.

리듀서는 상태를 처리하는 다른 방법입니다. `useState`에서 `useReducer`로 마이그레이션하는 방법은 세 단계로 이루어집니다:

1. 상태 설정에서 액션 디스패치로 **이동**합니다.
2. 리듀서 함수를 **작성**합니다.
3. 컴포넌트에서 리듀서를 **사용**합니다.

### 1단계: 상태 설정에서 액션 디스패치로 이동하기 {/*step-1-move-from-setting-state-to-dispatching-actions*/}

현재 이벤트 핸들러는 상태를 설정하여 _무엇을 할지_ 지정합니다:

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

모든 상태 설정 로직을 제거합니다. 남은 것은 세 가지 이벤트 핸들러입니다:

- 사용자가 "추가"를 누를 때 `handleAddTask(text)`가 호출됩니다.
- 사용자가 작업을 토글하거나 "저장"을 누를 때 `handleChangeTask(task)`가 호출됩니다.
- 사용자가 "삭제"를 누를 때 `handleDeleteTask(taskId)`가 호출됩니다.

리듀서를 사용하여 상태를 관리하는 것은 상태를 직접 설정하는 것과 약간 다릅니다. 상태를 설정하여 React에 "무엇을 할지" 말하는 대신, 이벤트 핸들러에서 "사용자가 방금 한 일"을 "액션"을 디스패치하여 지정합니다. (상태 업데이트 로직은 다른 곳에 있습니다!) 따라서 이벤트 핸들러를 통해 "tasks를 설정"하는 대신, "작업을 추가/변경/삭제"하는 액션을 디스패치합니다. 이는 사용자의 의도를 더 잘 설명합니다.

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

`dispatch`에 전달하는 객체를 "액션"이라고 합니다:

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "액션" 객체:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

이는 일반적인 JavaScript 객체입니다. 무엇을 넣을지는 여러분이 결정하지만, 일반적으로 _무슨 일이 일어났는지_에 대한 최소한의 정보를 포함해야 합니다. (나중에 `dispatch` 함수를 추가할 것입니다.)

<Note>

액션 객체는 어떤 형태든 가질 수 있습니다.

관례상, 무슨 일이 일어났는지 설명하는 문자열 `type`을 주고, 다른 필드에 추가 정보를 전달하는 것이 일반적입니다. `type`은 컴포넌트에 특정하므로, 이 예제에서는 `'added'` 또는 `'added_task'`가 모두 괜찮습니다. 무슨 일이 일어났는지 설명하는 이름을 선택하세요!

```js
dispatch({
  // 컴포넌트에 특정
  type: 'what_happened',
  // 다른 필드는 여기에
});
```

</Note>

### 2단계: 리듀서 함수 작성하기 {/*step-2-write-a-reducer-function*/}

리듀서 함수는 상태 로직을 넣을 곳입니다. 현재 상태와 액션 객체 두 가지 인수를 받아 다음 상태를 반환합니다:

```js
function yourReducer(state, action) {
  // React가 설정할 다음 상태를 반환
}
```

React는 리듀서에서 반환된 값을 상태로 설정합니다.

이 예제에서 이벤트 핸들러의 상태 설정 로직을 리듀서 함수로 이동하려면:

1. 현재 상태(`tasks`)를 첫 번째 인수로 선언합니다.
2. `action` 객체를 두 번째 인수로 선언합니다.
3. 리듀서에서 _다음_ 상태를 반환합니다 (React가 상태로 설정할 값).

다음은 모든 상태 설정 로직을 리듀서 함수로 마이그레이션한 것입니다:

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

리듀서 함수는 상태(`tasks`)를 인수로 받기 때문에 **컴포넌트 외부에 선언할 수 있습니다.** 이는 들여쓰기 수준을 줄이고 코드를 더 읽기 쉽게 만들 수 있습니다.

<Note>

위 코드는 if/else 문을 사용하지만, 리듀서 내부에서는 [switch 문](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch)을 사용하는 것이 관례입니다. 결과는 동일하지만, switch 문을 한눈에 읽기 더 쉬울 수 있습니다.

이 문서의 나머지 부분에서는 다음과 같이 switch 문을 사용할 것입니다:

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

각 `case` 블록을 `{`와 `}` 중괄호로 감싸는 것을 권장합니다. 이렇게 하면 다른 `case`에서 선언된 변수가 서로 충돌하지 않습니다. 또한, `case`는 일반적으로 `return`으로 끝나야 합니다. `return`을 잊으면 코드가 다음 `case`로 "떨어질" 수 있어 실수로 이어질 수 있습니다!

switch 문에 익숙하지 않다면, if/else를 사용하는 것도 완전히 괜찮습니다.

</Note>

<DeepDive>

#### 리듀서는 왜 이렇게 불리나요? {/*why-are-reducers-called-this-way*/}

리듀서가 컴포넌트 내부의 코드 양을 "줄일" 수 있지만, 실제로는 배열에서 수행할 수 있는 [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 연산에서 이름이 유래되었습니다.

`reduce()` 연산은 배열을 가져와 여러 값 중 하나로 "누적"할 수 있게 합니다:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

`reduce`에 전달하는 함수는 "리듀서"로 알려져 있습니다. 이는 _지금까지의 결과_와 _현재 항목_을 받아 _다음 결과_를 반환합니다. React 리듀서는 동일한 아이디어의 예입니다: _지금까지의 상태_와 _액션_을 받아 _다음 상태_를 반환합니다. 이렇게 해서 시간이 지남에 따라 액션을 상태로 누적합니다.

`initialState`와 `actions` 배열을 사용하여 리듀서 함수를 전달하여 최종 상태를 계산할 수도 있습니다:

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

직접 할 필요는 없지만, React가 하는 것과 유사합니다!

</DeepDive>

### 3단계: 컴포넌트에서 리듀서 사용하기 {/*step-3-use-the-reducer-from-your-component*/}

마지막으로, `tasksReducer`를 컴포넌트에 연결해야 합니다. React에서 `useReducer` 훅을 가져옵니다:

```js
import { useReducer } from 'react';
```

그런 다음 `useState`를 다음과 같이 대체할 수 있습니다:

```js
const [tasks, setTasks] = useState(initialTasks);
```

`useReducer`로 다음과 같이 대체합니다:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` 훅은 `useState`와 유사합니다. 초기 상태를 전달해야 하며 상태 값과 상태를 설정하는 방법(이 경우 디스패치 함수)을 반환합니다. 하지만 약간 다릅니다.

`useReducer` 훅은 두 가지 인수를 받습니다:

1. 리듀서 함수
2. 초기 상태

그리고 다음을 반환합니다:

1. 상태 값
2. 디스패치 함수 (사용자 액션을 리듀서로 "디스패치"하기 위해)

이제 완전히 연결되었습니다! 여기서 리듀서는 컴포넌트 파일의 하단에 선언됩니다:

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

원한다면 리듀서를 다른 파일로 이동할 수도 있습니다:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

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

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
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

관심사를 이렇게 분리하면 컴포넌트 로직을 더 읽기 쉽게 만들 수 있습니다. 이제 이벤트 핸들러는 액션을 디스패치하여 _무슨 일이 일어났는지_ 만 지정하고, 리듀서 함수는 이에 대한 _상태 업데이트 방법_을 결정합니다.

## `useState`와 `useReducer` 비교하기 {/*comparing-usestate-and-usereducer*/}

리듀서는 단점이 없지 않습니다! 다음은 몇 가지 비교 방법입니다:

- **코드 크기:** 일반적으로 `useState`를 사용하면 초기 코드 작성이 더 적습니다. `useReducer`를 사용하면 리듀서 함수와 디스패치 액션을 모두 작성해야 합니다. 그러나 많은 이벤트 핸들러가 유사한 방식으로 상태를 수정하는 경우 `useReducer`는 코드 양을 줄이는 데 도움이 될 수 있습니다.
- **가독성:** 상태 업데이트가 간단할 때 `useState`는 읽기 매우 쉽습니다. 복잡해지면 컴포넌트의 코드가 부풀어 오르고 스캔하기 어려워질 수 있습니다. 이 경우 `useReducer`를 사용하면 업데이트 로직의 _방법_을 이벤트 핸들러의 _무슨 일이 일어났는지_와 깔끔하게 분리할 수 있습니다.
- **디버깅:** `useState`를 사용할 때 버그가 발생하면 상태가 잘못 설정된 _위치_와 _이유_를 파악하기 어려울 수 있습니다. `useReducer`를 사용하면 리듀서에 콘솔 로그를 추가하여 모든 상태 업데이트와 _이유_ (어떤 `액션` 때문인지)를 볼 수 있습니다. 각 `액션`이 올바르면 리듀서 로직 자체에 실수가 있다는 것을 알 수 있습니다. 그러나 `useState`보다 더 많은 코드를 거쳐야 합니다.
- **테스트:** 리듀서는 컴포넌트에 의존하지 않는 순수 함수입니다. 이는 리듀서를 내보내고 별도로 테스트할 수 있음을 의미합니다. 일반적으로 컴포넌트를 더 현실적인 환경에서 테스트하는 것이 좋지만, 복잡한 상태 업데이트 로직의 경우 특정 초기 상태와 액션에 대해 리듀서가 특정 상태를 반환하는지 확인하는 것이 유용할 수 있습니다.
- **개인 취향:** 일부 사람들은 리듀서를 좋아하고, 다른 사람들은 그렇지 않습니다. 괜찮습니다. 이는 취향의 문제입니다. `useState`와 `useReducer`를 상호 변환할 수 있습니다: 둘은 동등합니다!

어떤 컴포넌트에서 잘못된 상태 업데이트로 인해 자주 버그가 발생하고 코드에 더 많은 구조를 도입하고 싶다면 리듀서를 사용하는 것이 좋습니다. 모든 것에 리듀서를 사용할 필요는 없습니다: 자유롭게 혼합하여 사용하세요! 동일한 컴포넌트에서 `useState`와 `useReducer`를 함께 사용할 수도 있습니다.

## 리듀서를 잘 작성하기 {/*writing-reducers-well*/}

리듀서를 작성할 때 다음 두 가지 팁을 염두에 두세요:

- **리듀서는 순수해야 합니다.** [상태 업데이트 함수](/learn/queueing-a-series-of-state-updates)와 유사하게, 리듀서는 렌더링 중에 실행됩니다! (액션은 다음 렌더링까지 대기열에 추가됩니다.) 이는 리듀서가 [순수해야 함](/learn/keeping-components-pure)을 의미합니다—동일한 입력이 항상 동일한 출력을 생성해야 합니다. 요청을 보내거나, 타임아웃을 예약하거나, 부수 효과(컴포넌트 외부에 영향을 미치는 작업)를 수행해서는 안 됩니다. [객체](/learn/updating-objects-in-state) 및 [배열](/learn/updating-arrays-in-state)을 변경 없이 업데이트해야 합니다.
- **각 액션은 단일 사용자 상호작용을 설명해야 합니다, 데이터에 여러 변경이 발생하더라도.** 예를 들어, 리듀서로 관리되는 다섯 개 필드가 있는 폼에서 사용자가 "재설정"을 누르면, 다섯 개의 별도 `set_field` 액션보다는 하나의 `reset_form` 액션을 디스패치하는 것이 더 합리적입니다. 리듀서에서 모든 액션을 기록하면, 그 기록은 어떤 상호작용이나 응답이 어떤 순서로 발생했는지 재구성할 수 있을 만큼 명확해야 합니다. 이는 디버깅에 도움이 됩니다!

## Immer로 간결한 리듀서 작성하기 {/*writing-concise-reducers-with-immer*/}

일반 상태에서 [객체 업데이트](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) 및 [배열 업데이트](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)와 마찬가지로, Immer 라이브러리를 사용하여 리듀서를 더 간결하게 만들 수 있습니다. 여기서 [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer)를 사용하면 `push` 또는 `arr[i] =` 할당으로 상태를 변경할 수 있습니다:

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

리듀서는 순수해야 하므로 상태를 변경해서는 안 됩니다. 하지만 Immer는 안전하게 변경할 수 있는 특별한 `draft` 객체를 제공합니다. 내부적으로 Immer는 `draft`에 가한 변경 사항으로 상태의 복사본을 생성합니다. 이 때문에 `useImmerReducer`로 관리되는 리듀서는 첫 번째 인수를 변경할 수 있으며 상태를 반환할 필요가 없습니다.

<Recap>

- `useState`에서 `useReducer`로 변환하려면:
  1. 이벤트 핸들러에서 액션을 디스패치합니다.
  2. 주어진 상태와 액션에 대해 다음 상태를 반환하는 리듀서 함수를 작성합니다.
  3. `useState`를 `useReducer`로 대체합니다.
- 리듀서는 더 많은 코드를 작성해야 하지만 디버깅과 테스트에 도움이 됩니다.
- 리듀서는 순수해야 합니다.
- 각 액션은 단일 사용자 상호작용을 설명합니다.
- 리듀서를 변경 스타일로 작성하려면 Immer를 사용하세요.

</Recap>

<Challenges>

#### 이벤트 핸들러에서 액션 디스패치하기 {/*dispatch-actions-from-event-handlers*/}

현재, `ContactList.js`와 `Chat.js`의 이벤트 핸들러에는 `// TODO` 주석이 있습니다. 이 때문에 입력에 타이핑해도 작동하지 않으며, 버튼을 클릭해도 선택된 수신자가 변경되지 않습니다.

이 두 `// TODO`를 해당 액션을 `dispatch`하는 코드로 대체하세요. 예상되는 액션의 형태와 유형을 확인하려면 `messengerReducer.js`의 리듀서를 확인하세요. 리듀서는 이미 작성되어 있으므로 변경할 필요가 없습니다. `ContactList.js`와 `Chat.js`에서 액션을 디스패치하기만 하면 됩니다.

<Hint>

`dispatch` 함수는 이미 이 두 컴포넌트에서 prop으로 전달되었기 때문에 사용할 수 있습니다. 따라서 해당 액션 객체로 `dispatch`를 호출해야 합니다.

액션 객체의 형태를 확인하려면 리듀서를 확인하고 어떤 `action` 필드를 기대하는지 확인할 수 있습니다. 예를 들어, 리듀서의 `changed_selection` 케이스는 다음과 같습니다:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

이는 액션 객체에 `type: 'changed_selection'`이 있어야 함을 의미합니다. 또한 `action.contactId`가 사용되는 것을 볼 수 있으므로 액션에 `contactId` 속성을 포함해야 합니다.

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

리듀서 코드를 통해 액션이 다음과 같아야 함을 알 수 있습니다:

```js
// 사용자가 "Alice"를 누를 때
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// 사용자가 "Hello!"를 입력할 때
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

다음은 해당 메시지를 디스패치하도록 업데이트된 예제입니다:

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

#### 메시지 전송 시 입력값 지우기 {/*clear-the-input-on-sending-a-message*/}

현재, "Send" 버튼을 누르면 아무 일도 일어나지 않습니다. "Send" 버튼에 이벤트 핸들러를 추가하여 다음을 수행하세요:

1. 수신자의 이메일과 메시지를 포함한 `alert`를 표시합니다.
2. 메시지 입력을 지웁니다.

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

"Send" 버튼 이벤트 핸들러에서 몇 가지 방법으로 이를 수행할 수 있습니다. 한 가지 접근 방식은 알림을 표시한 다음 빈 `message`로 `edited_message` 액션을 디스패치하는 것입니다:

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

이렇게 하면 "Send"를 누를 때 입력이 지워집니다.

그러나 _사용자의 관점에서_, 메시지를 보내는 것은 필드를 편집하는 것과 다른 액션입니다. 이를 반영하기 위해 `sent_message`라는 _새로운_ 액션을 생성하고 리듀서에서 별도로 처리할 수 있습니다:

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

결과적인 동작은 동일합니다. 그러나 액션 유형은 "상태를 어떻게 변경할지"보다는 "사용자가 무엇을 했는지"를 설명해야 합니다. 이렇게 하면 나중에 더 많은 기능을 추가하기가 더 쉬워집니다.

어느 솔루션이든, 리듀서 내부에 `alert`를 배치하지 않는 것이 중요합니다. 리듀서는 순수 함수여야 하며, 다음 상태를 계산하는 것 외에는 아무것도 하지 않아야 합니다. 사용자에게 메시지를 표시하는 것도 포함됩니다. 이는 이벤트 핸들러에서 발생해야 합니다. (이와 같은 실수를 잡기 위해, React는 Strict Mode에서 리듀서를 여러 번 호출합니다. 따라서 리듀서에 알림을 넣으면 두 번 실행됩니다.)

</Solution>

#### 탭 간 전환 시 입력값 복원하기 {/*restore-input-values-when-switching-between-tabs*/}

이 예제에서는 다른 수신자로 전환할 때마다 텍스트 입력이 항상 지워집니다:

```js
case 'changed_selection': {
  return{
    ...state,
    selectedId: action.contactId,
    message: '' // 입력을 지웁니다
  };
```

이는 여러 수신자 간에 단일 메시지 초안을 공유하지 않기 때문입니다. 하지만 앱이 각 연락처에 대해 초안을 "기억"하고 연락처를 전환할 때 이를 복원하는 것이 더 좋습니다.

여러분의 과제는 상태 구조를 변경하여 각 연락처에 대해 별도의 메시지 초안을 기억하도록 하는 것입니다. 리듀서, 초기 상태 및 컴포넌트에 몇 가지 변경을 해야 합니다.

<Hint>

상태를 다음과 같이 구조화할 수 있습니다:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // contactId = 0에 대한 초안
    1: 'Hello, Alice', // contactId = 1에 대한 초안
  },
};
```

[key]: value [계산된 속성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) 구문을 사용하여 `messages` 객체를 업데이트할 수 있습니다:

```js
{
  ...state.messages,
  [id]: message
}
```

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

각 연락처에 대해 별도의 메시지 초안을 저장하고 업데이트하도록 리듀서를 업데이트해야 합니다:

```js
// 입력이 편집될 때
case 'edited_message': {
  return {
    // 선택과 같은 다른 상태 유지
    ...state,
    messages: {
      // 다른 연락처의 메시지 유지
      ...state.messages,
      // 선택된 연락처의 메시지 변경
      [state.selectedId]: action.message
    }
  };
}
```

또한 `Messenger` 컴포넌트를 업데이트하여 현재 선택된 연락처의 메시지를 읽도록 해야 합니다:

```js
const message = state.messages[state.selectedId];
```

다음은 전체 솔루션입니다:

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

특히, 이 다른 동작을 구현하기 위해 이벤트 핸들러를 변경할 필요가 없었습니다. 리듀서가 없었다면 상태를 업데이트하는 모든 이벤트 핸들러를 변경해야 했을 것입니다.

</Solution>

#### `useReducer`를 처음부터 구현하기 {/*implement-usereducer-from-scratch*/}

이전 예제에서는 React에서 `useReducer` 훅을 가져왔습니다. 이번에는 _`useReducer` 훅 자체를 구현할 것입니다!_ 시작할 수 있는 스텁이 있습니다. 10줄 이하의 코드로 구현할 수 있습니다.

변경 사항을 테스트하려면 입력에 타이핑하거나 연락처를 선택해 보세요.

<Hint>

구현의 더 자세한 스케치는 다음과 같습니다:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

리듀서 함수는 현재 상태와 액션 객체 두 가지 인수를 받아 다음 상태를 반환합니다. `dispatch` 구현이 이를 어떻게 처리해야 할까요?

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

액션을 디스패치하면 리듀서가 현재 상태와 액션을 받아 다음 상태를 반환하고 이를 다음 상태로 저장합니다. 다음은 코드로 표현한 것입니다:

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

대부분의 경우에는 중요하지 않지만, 약간 더 정확한 구현은 다음과 같습니다:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

이는 디스패치된 액션이 [상태 업데이트 함수](/learn/queueing-a-series-of-state-updates)와 유사하게 다음 렌더링까지 대기열에 추가되기 때문입니다.

</Solution>

</Challenges>