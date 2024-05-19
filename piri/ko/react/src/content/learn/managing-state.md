---
title: 상태 관리
---

<Intro>

애플리케이션이 성장함에 따라 상태가 어떻게 조직되고 데이터가 컴포넌트 간에 어떻게 흐르는지에 대해 더 의도적으로 접근하는 것이 도움이 됩니다. 중복되거나 중복된 상태는 버그의 일반적인 원인입니다. 이 장에서는 상태를 잘 구조화하는 방법, 상태 업데이트 로직을 유지 관리 가능한 상태로 유지하는 방법, 그리고 먼 컴포넌트 간에 상태를 공유하는 방법을 배우게 됩니다.

</Intro>

<YouWillLearn isChapter={true}>

* [UI 변경을 상태 변경으로 생각하는 방법](/learn/reacting-to-input-with-state)
* [상태를 잘 구조화하는 방법](/learn/choosing-the-state-structure)
* [상태를 "상위로 올려서" 컴포넌트 간에 공유하는 방법](/learn/sharing-state-between-components)
* [상태가 유지되거나 초기화되는지 제어하는 방법](/learn/preserving-and-resetting-state)
* [복잡한 상태 로직을 함수로 통합하는 방법](/learn/extracting-state-logic-into-a-reducer)
* ["prop drilling" 없이 정보를 전달하는 방법](/learn/passing-data-deeply-with-context)
* [앱이 성장함에 따라 상태 관리를 확장하는 방법](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## 입력에 상태로 반응하기 {/*reacting-to-input-with-state*/}

React를 사용하면 코드에서 직접 UI를 수정하지 않습니다. 예를 들어, "버튼 비활성화", "버튼 활성화", "성공 메시지 표시"와 같은 명령을 작성하지 않습니다. 대신, 컴포넌트의 다양한 시각적 상태("초기 상태", "타이핑 상태", "성공 상태")에 대해 보고 싶은 UI를 설명하고, 사용자 입력에 따라 상태 변경을 트리거합니다. 이는 디자이너가 UI를 생각하는 방식과 유사합니다.

다음은 React를 사용하여 만든 퀴즈 폼입니다. `status` 상태 변수를 사용하여 제출 버튼을 활성화 또는 비활성화할지, 성공 메시지를 표시할지를 결정하는 방법을 주목하세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>정답입니다!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>도시 퀴즈</h2>
      <p>
        공기를 식수로 바꾸는 광고판이 있는 도시는 어디일까요?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          제출
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // 네트워크를 타격하는 것처럼 가장합니다.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('좋은 추측이지만 틀린 답입니다. 다시 시도해보세요!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

**[입력에 상태로 반응하기](/learn/reacting-to-input-with-state)**를 읽고 상태 중심의 사고방식으로 상호작용에 접근하는 방법을 배우세요.

</LearnMore>

## 상태 구조 선택하기 {/*choosing-the-state-structure*/}

상태를 잘 구조화하면 수정 및 디버그가 쉬운 컴포넌트와 버그의 지속적인 원인이 되는 컴포넌트의 차이를 만들 수 있습니다. 가장 중요한 원칙은 상태에 중복되거나 중복된 정보가 포함되지 않아야 한다는 것입니다. 불필요한 상태가 있으면 업데이트를 잊기 쉽고 버그를 도입할 수 있습니다!

예를 들어, 이 폼에는 **중복된** `fullName` 상태 변수가 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>체크인 해봅시다</h2>
      <label>
        이름:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        성:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        티켓은 다음 이름으로 발급됩니다: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

컴포넌트가 렌더링되는 동안 `fullName`을 계산하여 이를 제거하고 코드를 단순화할 수 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>체크인 해봅시다</h2>
      <label>
        이름:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        성:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        티켓은 다음 이름으로 발급됩니다: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

이것은 작은 변화처럼 보일 수 있지만, 많은 React 앱의 버그는 이렇게 수정됩니다.

<LearnMore path="/learn/choosing-the-state-structure">

**[상태 구조 선택하기](/learn/choosing-the-state-structure)**를 읽고 버그를 피하기 위해 상태 모양을 설계하는 방법을 배우세요.

</LearnMore>

## 컴포넌트 간 상태 공유하기 {/*sharing-state-between-components*/}

때로는 두 컴포넌트의 상태가 항상 함께 변경되기를 원할 때가 있습니다. 이를 위해 두 컴포넌트에서 상태를 제거하고, 가장 가까운 공통 부모로 이동한 다음 props를 통해 하위 컴포넌트에 전달합니다. 이를 "상태 올리기"라고 하며, React 코드를 작성할 때 가장 일반적으로 수행하는 작업 중 하나입니다.

이 예제에서는 한 번에 하나의 패널만 활성화되어야 합니다. 이를 달성하기 위해 각 개별 패널 내부에 활성 상태를 유지하는 대신, 부모 컴포넌트가 상태를 유지하고 자식에게 props를 지정합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>알마티, 카자흐스탄</h2>
      <Panel
        title="소개"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        인구 약 200만 명의 알마티는 카자흐스탄의 최대 도시입니다. 1929년부터 1997년까지는 수도였습니다.
      </Panel>
      <Panel
        title="어원"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        이름은 카자흐어로 "사과"를 의미하는 <span lang="kk-KZ">алма</span>에서 유래되었으며 종종 "사과가 가득한"으로 번역됩니다. 실제로 알마티 주변 지역은 사과의 조상지로 여겨지며, 야생 <i lang="la">Malus sieversii</i>는 현대 가정용 사과의 조상으로 간주됩니다.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          보기
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

**[컴포넌트 간 상태 공유하기](/learn/sharing-state-between-components)**를 읽고 상태를 올리고 컴포넌트를 동기화하는 방법을 배우세요.

</LearnMore>

## 상태 유지 및 초기화 {/*preserving-and-resetting-state*/}

컴포넌트를 다시 렌더링할 때, React는 트리의 어느 부분을 유지(및 업데이트)하고, 어느 부분을 폐기하거나 처음부터 다시 생성할지 결정해야 합니다. 대부분의 경우, React의 자동 동작은 충분히 잘 작동합니다. 기본적으로 React는 이전에 렌더링된 컴포넌트 트리와 "일치하는" 트리 부분을 유지합니다.

그러나 때로는 이것이 원하는 것이 아닐 수 있습니다. 이 채팅 앱에서는 메시지를 입력한 후 수신자를 변경해도 입력이 초기화되지 않습니다. 이는 사용자가 실수로 잘못된 사람에게 메시지를 보낼 수 있게 만듭니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React는 기본 동작을 재정의하고 다른 `key`를 전달하여 컴포넌트의 상태를 *강제로* 초기화할 수 있습니다. 예를 들어, `<Chat key={email} />`와 같이 합니다. 이는 수신자가 다르면 새로운 데이터(및 입력과 같은 UI)로 처음부터 다시 생성해야 하는 *다른* `Chat` 컴포넌트로 간주해야 한다고 React에 알립니다. 이제 수신자를 전환하면 입력 필드가 초기화됩니다--동일한 컴포넌트를 렌더링하더라도 말입니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

**[상태 유지 및 초기화](/learn/preserving-and-resetting-state)**를 읽고 상태의 수명과 이를 제어하는 방법을 배우세요.

</LearnMore>

## 상태 로직을 리듀서로 추출하기 {/*extracting-state-logic-into-a-reducer*/}

많은 이벤트 핸들러에 걸쳐 많은 상태 업데이트가 있는 컴포넌트는 압도적일 수 있습니다. 이러한 경우, 컴포넌트 외부의 단일 함수인 "리듀서"에 모든 상태 업데이트 로직을 통합할 수 있습니다. 이벤트 핸들러는 사용자 "액션"만 지정하므로 간결해집니다. 파일 하단의 리듀서 함수는 각 액션에 대한 상태 업데이트 방법을 지정합니다!

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>프라하 일정</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: '카프카 박물관 방문', done: true },
  { id: 1, text: '인형극 관람', done: false },
  { id: 2, text: '레논 벽 사진 찍기', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="할 일 추가"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>추가</button>
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
          저장
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          수정
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
        삭제
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

**[상태 로직을 리듀서로 추출하기](/learn/extracting-state-logic-into-a-reducer)**를 읽고 리듀서 함수에 로직을 통합하는 방법을 배우세요.

</LearnMore>

## 컨텍스트로 깊이 있는 데이터 전달하기 {/*passing-data-deeply-with-context*/}

일반적으로 부모 컴포넌트에서 자식 컴포넌트로 정보를 props를 통해 전달합니다. 그러나 많은 컴포넌트를 통해 어떤 props를 전달해야 하거나, 많은 컴포넌트가 동일한 정보를 필요로 할 때 props를 전달하는 것은 불편할 수 있습니다. 컨텍스트를 사용하면 부모 컴포넌트가 트리 아래의 모든 컴포넌트에 정보를 명시적으로 props를 통해 전달하지 않고도 사용할 수 있게 할 수 있습니다.

여기서 `Heading` 컴포넌트는 가장 가까운 `Section`에게 자신의 헤딩 레벨을 "묻습니다". 각 `Section`은 부모 `Section`에게 자신의 레벨을 묻고 1을 더하여 자신의 레벨을 추적합니다. 모든 `Section`은 props를 전달하지 않고도 아래의 모든 컴포넌트에 정보를 제공합니다--컨텍스트를 통해 그렇게 합니다.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>제목</Heading>
      <Section>
        <Heading>헤딩</Heading>
        <Heading>헤딩</Heading>
        <Heading>헤딩</Heading>
        <Section>
          <Heading>서브 헤딩</Heading>
          <Heading>서브 헤딩</Heading>
          <Heading>서브 헤딩</Heading>
          <Section>
            <Heading>서브 서브 헤딩</Heading>
            <Heading>서브 서브 헤딩</Heading>
            <Heading>서브 서브 헤딩</Heading>
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
      throw Error('Heading은 반드시 Section 안에 있어야 합니다!');
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
      throw Error('알 수 없는 레벨: ' + level);
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

<LearnMore path="/learn/passing-data-deeply-with-context">

**[컨텍스트로 깊이 있는 데이터 전달하기](/learn/passing-data-deeply-with-context)**를 읽고 props를 전달하는 대안으로 컨텍스트를 사용하는 방법을 배우세요.

</LearnMore>

## 리듀서와 컨텍스트로 확장하기 {/*scaling-up-with-reducer-and-context*/}

리듀서를 사용하면 컴포넌트의 상태 업데이트 로직을 통합할 수 있습니다. 컨텍스트를 사용하면 정보를 다른 컴포넌트 깊숙이 전달할 수 있습니다. 리듀서와 컨텍스트를 결합하여 복잡한 화면의 상태를 관리할 수 있습니다.

이 접근 방식에서는 복잡한 상태를 가진 부모 컴포넌트가 리듀서를 사용하여 상태를 관리합니다. 트리 깊숙이 있는 다른 컴포넌트는 컨텍스트를 통해 상태를 읽을 수 있습니다. 또한 상태를 업데이트하기 위해 액션을 디스패치할 수도 있습니다.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>교토에서의 하루</h1>
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
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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
  { id: 0, text: '철학자의 길', done: true },
  { id: 1, text: '사원 방문', done: false },
  { id: 2, text: '말차 마시기', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="할 일 추가"
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
      }}>추가</button>
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
          저장
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          수정
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
        삭제
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

**[리듀서와 컨텍스트로 확장하기](/learn/scaling-up-with-reducer-and-context)**를 읽고 성장하는 앱에서 상태 관리가 어떻게 확장되는지 배우세요.

</LearnMore>

## 다음은 무엇일까요? {/*whats-next*/}

[입력에 상태로 반응하기](/learn/reacting-to-input-with-state)로 이동하여 이 장을 페이지별로 읽기 시작하세요!

또는, 이미 이 주제에 익숙하다면 [탈출구](/learn/escape-hatches)에 대해 읽어보는 것은 어떨까요?