---
title: 状態管理
---

<Intro>

アプリケーションが成長するにつれて、状態の整理方法やコンポーネント間のデータの流れについて意図的に考えることが役立ちます。冗長または重複した状態はバグの一般的な原因です。この章では、状態をうまく構造化する方法、状態更新ロジックを維持可能に保つ方法、および遠く離れたコンポーネント間で状態を共有する方法を学びます。

</Intro>

<YouWillLearn isChapter={true}>

* [UIの変更を状態の変更として考える方法](/learn/reacting-to-input-with-state)
* [状態をうまく構造化する方法](/learn/choosing-the-state-structure)
* [状態を「リフトアップ」してコンポーネント間で共有する方法](/learn/sharing-state-between-components)
* [状態が保持されるかリセットされるかを制御する方法](/learn/preserving-and-resetting-state)
* [複雑な状態ロジックを関数に統合する方法](/learn/extracting-state-logic-into-a-reducer)
* [「プロップドリリング」なしで情報を渡す方法](/learn/passing-data-deeply-with-context)
* [アプリが成長するにつれて状態管理をスケールする方法](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## 状態を使って入力に反応する {/*reacting-to-input-with-state*/}

Reactでは、コードから直接UIを変更することはありません。たとえば、「ボタンを無効にする」、「ボタンを有効にする」、「成功メッセージを表示する」などのコマンドを書くことはありません。代わりに、コンポーネントのさまざまな視覚状態（「初期状態」、「入力中の状態」、「成功状態」）に対して見たいUIを記述し、ユーザー入力に応じて状態変更をトリガーします。これはデザイナーがUIを考える方法に似ています。

ここにReactを使用して構築されたクイズフォームがあります。`status`状態変数を使用して、送信ボタンを有効または無効にするか、成功メッセージを表示するかを決定する方法に注目してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
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
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
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
          Submit
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
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
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

**[状態を使って入力に反応する](/learn/reacting-to-input-with-state)**を読んで、状態駆動のマインドセットでインタラクションに取り組む方法を学びましょう。

</LearnMore>

## 状態構造の選択 {/*choosing-the-state-structure*/}

状態をうまく構造化することで、修正やデバッグがしやすいコンポーネントと、常にバグの原因となるコンポーネントの違いが生まれます。最も重要な原則は、状態に冗長または重複した情報を含めないことです。不要な状態があると、更新を忘れやすくなり、バグが発生しやすくなります！

たとえば、このフォームには**冗長な**`fullName`状態変数があります：

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
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

これを削除し、コンポーネントのレンダリング中に`fullName`を計算することでコードを簡素化できます：

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
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

これは小さな変更のように見えるかもしれませんが、Reactアプリの多くのバグはこのように修正されます。

<LearnMore path="/learn/choosing-the-state-structure">

**[状態構造の選択](/learn/choosing-the-state-structure)**を読んで、バグを避けるための状態形状の設計方法を学びましょう。

</LearnMore>

## コンポーネント間で状態を共有する {/*sharing-state-between-components*/}

時々、2つのコンポーネントの状態を常に一緒に変更したいことがあります。そのためには、両方のコンポーネントから状態を削除し、最も近い共通の親に移動し、プロップスを介してそれらに渡します。これは「状態のリフトアップ」として知られており、Reactコードを書く際に最も一般的に行うことの1つです。

この例では、一度に1つのパネルのみがアクティブである必要があります。これを達成するために、各個別のパネル内でアクティブな状態を保持するのではなく、親コンポーネントが状態を保持し、子コンポーネントにプロップスを指定します。

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
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
          Show
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

**[コンポーネント間で状態を共有する](/learn/sharing-state-between-components)**を読んで、状態をリフトアップし、コンポーネントを同期させる方法を学びましょう。

</LearnMore>

## 状態の保持とリセット {/*preserving-and-resetting-state*/}

コンポーネントを再レンダリングする際、Reactはツリーのどの部分を保持（および更新）し、どの部分を破棄または最初から再作成するかを決定する必要があります。ほとんどの場合、Reactの自動動作は十分に機能します。デフォルトでは、Reactは以前にレンダリングされたコンポーネントツリーと「一致する」ツリーの部分を保持します。

しかし、時にはこれが望ましくない場合もあります。このチャットアプリでは、メッセージを入力してから受信者を切り替えても入力がリセットされません。これにより、ユーザーが誤ってメッセージを間違った人に送信する可能性があります：

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

Reactでは、デフォルトの動作を上書きし、異なる`key`を渡すことでコンポーネントの状態をリセットするように*強制*することができます。例えば、`<Chat key={email} />`のようにします。これにより、受信者が異なる場合、それは新しいデータ（および入力などのUI）で最初から再作成する必要がある*異なる*`Chat`コンポーネントと見なされます。これで、受信者を切り替えると入力フィールドがリセットされます—同じコンポーネントをレンダリングしているにもかかわらず。

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

**[状態の保持とリセット](/learn/preserving-and-resetting-state)**を読んで、状態のライフタイムとその制御方法を学びましょう。

</LearnMore>

## 状態ロジックをリデューサーに抽出する {/*extracting-state-logic-into-a-reducer*/}

多くのイベントハンドラーにわたって多くの状態更新があるコンポーネントは圧倒されることがあります。このような場合、コンポーネントの外部にある単一の関数である「リデューサー」にすべての状態更新ロジックを統合できます。イベントハンドラーはユーザーの「アクション」を指定するだけで簡潔になります。ファイルの下部で、リデューサー関数は各アクションに応じて状態をどのように更新するかを指定します！

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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

**[状態ロジックをリデューサーに抽出する](/learn/extracting-state-logic-into-a-reducer)**を読んで、リデューサー関数にロジックを統合する方法を学びましょう。

</LearnMore>

## コンテキストを使ってデータを深く渡す {/*passing-data-deeply-with-context*/}

通常、親コンポーネントから子コンポーネントに情報をプロップスを介して渡します。しかし、多くのコンポーネントに同じ情報を渡す必要がある場合や、いくつかのコンポーネントを通じてプロップスを渡すのが不便になる場合があります。コンテキストを使用すると、親コンポーネントがツリーの下のどのコンポーネントにも情報を提供できるようになります—どれだけ深くても—プロップスを明示的に渡すことなく。

ここでは、`Heading`コンポーネントが最も近い`Section`にレベルを「尋ねる」ことで見出しレベルを決定します。各`Section`は親`Section`にレベルを尋ね、それに1を加えることで自分のレベルを追跡します。各`Section`はプロップスを渡すことなく、コンテキストを通じて自分の下のすべてのコンポーネントに情報を提供します。

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

<LearnMore path="/learn/passing-data-deeply-with-context">

**[コンテキストを使ってデータを深く渡す](/learn/passing-data-deeply-with-context)**を読んで、プロップスを渡す代わりにコンテキストを使用する方法を学びましょう。

</LearnMore>

## リデューサーとコンテキストでスケールアップする {/*scaling-up-with-reducer-and-context*/}

リデューサーを使用すると、コンポーネントの状態更新ロジックを統合できます。コンテキストを使用すると、情報を他のコンポーネントに深く渡すことができます。リデューサーとコンテキストを組み合わせて、複雑な画面の状態を管理できます。

このアプローチでは、複雑な状態を持つ親コンポーネントがリデューサーでそれを管理します。ツリーのどこにでもある他のコンポーネントは、コンテキストを介してその状態を読み取ることができます。また、その状態を更新するためのアクションをディスパッチすることもできます。

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
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

**[リデューサーとコンテキストでスケールアップする](/learn/scaling-up-with-reducer-and-context)**を読んで、成長するアプリでの状態管理のスケール方法を学びましょう。

</LearnMore>

## 次は何ですか？ {/*whats-next*/}

[状態を使って入力に反応する](/learn/reacting-to-input-with-state)に進んで、この章をページごとに読み始めましょう！

または、これらのトピックにすでに精通している場合は、[エスケープハッチ](/learn/escape-hatches)について読んでみてください。