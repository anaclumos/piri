---
title: useState
---

<Intro>

`useState`는 컴포넌트에 [상태 변수](/learn/state-a-components-memory)를 추가할 수 있게 해주는 React Hook입니다.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useState(initialState)` {/*usestate*/}

컴포넌트의 최상위에서 `useState`를 호출하여 [상태 변수](/learn/state-a-components-memory)를 선언합니다.

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

상태 변수는 [배열 구조 분해](https://javascript.info/destructuring-assignment)를 사용하여 `[something, setSomething]`과 같이 이름을 짓는 것이 관례입니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `initialState`: 상태의 초기 값입니다. 어떤 타입의 값이든 될 수 있지만, 함수에 대해서는 특별한 동작이 있습니다. 이 인수는 초기 렌더링 이후에는 무시됩니다.
  * `initialState`로 함수를 전달하면, 그것은 _초기화 함수_로 취급됩니다. 이 함수는 순수해야 하며, 인수를 받지 않고, 어떤 타입의 값이든 반환해야 합니다. React는 컴포넌트를 초기화할 때 초기화 함수를 호출하고, 반환된 값을 초기 상태로 저장합니다. [아래 예제를 참조하세요.](#avoiding-recreating-the-initial-state)

#### 반환값 {/*returns*/}

`useState`는 정확히 두 개의 값을 가진 배열을 반환합니다:

1. 현재 상태. 첫 번째 렌더링 동안, 전달한 `initialState`와 일치합니다.
2. 상태를 다른 값으로 업데이트하고 다시 렌더링을 트리거할 수 있는 [`set` 함수](#setstate).

#### 주의사항 {/*caveats*/}

* `useState`는 Hook이므로 **컴포넌트의 최상위** 또는 자신만의 Hook에서만 호출할 수 있습니다. 루프나 조건문 안에서는 호출할 수 없습니다. 그런 경우에는 새로운 컴포넌트를 추출하고 상태를 그 안으로 이동하세요.
* Strict Mode에서는 React가 **초기화 함수를 두 번 호출**하여 [우연한 불순물을 찾는 데 도움을 줍니다.](#my-initializer-or-updater-function-runs-twice) 이는 개발 전용 동작이며, 프로덕션에는 영향을 미치지 않습니다. 초기화 함수가 순수하다면(그렇게 해야 합니다), 이는 동작에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.

---

### `set` 함수, 예를 들어 `setSomething(nextState)` {/*setstate*/}

`useState`가 반환하는 `set` 함수는 상태를 다른 값으로 업데이트하고 다시 렌더링을 트리거할 수 있게 해줍니다. 다음 상태를 직접 전달하거나 이전 상태에서 계산하는 함수를 전달할 수 있습니다:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### 매개변수 {/*setstate-parameters*/}

* `nextState`: 상태로 설정하고자 하는 값입니다. 어떤 타입의 값이든 될 수 있지만, 함수에 대해서는 특별한 동작이 있습니다.
  * `nextState`로 함수를 전달하면, 그것은 _업데이트 함수_로 취급됩니다. 이 함수는 순수해야 하며, 대기 중인 상태를 유일한 인수로 받아 다음 상태를 반환해야 합니다. React는 업데이트 함수를 큐에 넣고 컴포넌트를 다시 렌더링합니다. 다음 렌더링 동안, React는 모든 대기 중인 업데이트를 이전 상태에 적용하여 다음 상태를 계산합니다. [아래 예제를 참조하세요.](#updating-state-based-on-the-previous-state)

#### 반환값 {/*setstate-returns*/}

`set` 함수는 반환값이 없습니다.

#### 주의사항 {/*setstate-caveats*/}

* `set` 함수는 **다음 렌더링을 위한 상태 변수만 업데이트**합니다. `set` 함수를 호출한 후 상태 변수를 읽으면 [여전히 이전 값을 얻습니다](#ive-updated-the-state-but-logging-gives-me-the-old-value).

* 제공한 새 값이 현재 `state`와 동일한 경우, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교에 의해 결정되면, React는 **컴포넌트와 자식들을 다시 렌더링하지 않습니다.** 이는 최적화입니다. 일부 경우에는 React가 자식을 건너뛰기 전에 컴포넌트를 호출해야 할 수도 있지만, 이는 코드에 영향을 미치지 않습니다.

* React는 [상태 업데이트를 일괄 처리합니다.](/learn/queueing-a-series-of-state-updates) 모든 이벤트 핸들러가 실행되고 `set` 함수가 호출된 후에 화면을 업데이트합니다. 이는 단일 이벤트 동안 여러 번의 다시 렌더링을 방지합니다. 드물게 화면을 더 일찍 업데이트해야 하는 경우, 예를 들어 DOM에 접근하기 위해, [`flushSync`](/reference/react-dom/flushSync)를 사용할 수 있습니다.

* 렌더링 중에 `set` 함수를 호출하는 것은 현재 렌더링 중인 컴포넌트 내에서만 허용됩니다. React는 출력을 버리고 새로운 상태로 다시 렌더링을 시도합니다. 이 패턴은 드물게 필요하지만, **이전 렌더링의 정보를 저장**하는 데 사용할 수 있습니다. [아래 예제를 참조하세요.](#storing-information-from-previous-renders)

* Strict Mode에서는 React가 **업데이트 함수를 두 번 호출**하여 [우연한 불순물을 찾는 데 도움을 줍니다.](#my-initializer-or-updater-function-runs-twice) 이는 개발 전용 동작이며, 프로덕션에는 영향을 미치지 않습니다. 업데이트 함수가 순수하다면(그렇게 해야 합니다), 이는 동작에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.

---

## 사용법 {/*usage*/}

### 컴포넌트에 상태 추가하기 {/*adding-state-to-a-component*/}

컴포넌트의 최상위에서 `useState`를 호출하여 하나 이상의 [상태 변수](/learn/state-a-components-memory)를 선언합니다.

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

상태 변수는 [배열 구조 분해](https://javascript.info/destructuring-assignment)를 사용하여 `[something, setSomething]`과 같이 이름을 짓는 것이 관례입니다.

`useState`는 정확히 두 개의 항목이 있는 배열을 반환합니다:

1. 이 상태 변수의 <CodeStep step={1}>현재 상태</CodeStep>, 처음에는 제공한 <CodeStep step={3}>초기 상태</CodeStep>로 설정됩니다.
2. 상호작용에 응답하여 다른 값으로 변경할 수 있는 <CodeStep step={2}>`set` 함수</CodeStep>.

화면에 표시되는 내용을 업데이트하려면 `set` 함수를 다음 상태로 호출하세요:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React는 다음 상태를 저장하고, 새로운 값으로 컴포넌트를 다시 렌더링하며, UI를 업데이트합니다.

<Pitfall>

`set` 함수를 호출해도 [**이미 실행 중인 코드의 현재 상태는** 변경되지 않습니다](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // 여전히 "Taylor"!
}
```

이는 *다음* 렌더링부터 `useState`가 반환하는 값에만 영향을 미칩니다.

</Pitfall>

<Recipes titleText="기본 useState 예제" titleId="examples-basic">

#### 카운터 (숫자) {/*counter-number*/}

이 예제에서 `count` 상태 변수는 숫자를 저장합니다. 버튼을 클릭하면 값이 증가합니다.

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

#### 텍스트 필드 (문자열) {/*text-field-string*/}

이 예제에서 `text` 상태 변수는 문자열을 저장합니다. 입력할 때, `handleChange`는 브라우저 입력 DOM 요소에서 최신 입력 값을 읽고, `setText`를 호출하여 상태를 업데이트합니다. 이를 통해 현재 `text`를 아래에 표시할 수 있습니다.

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

#### 체크박스 (불리언) {/*checkbox-boolean*/}

이 예제에서 `liked` 상태 변수는 불리언 값을 저장합니다. 입력을 클릭하면, `setLiked`는 브라우저 체크박스 입력이 체크되었는지 여부로 `liked` 상태 변수를 업데이트합니다. `liked` 변수는 체크박스 아래의 텍스트를 렌더링하는 데 사용됩니다.

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

#### 폼 (두 개의 변수) {/*form-two-variables*/}

같은 컴포넌트에서 둘 이상의 상태 변수를 선언할 수 있습니다. 각 상태 변수는 완전히 독립적입니다.

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

### 이전 상태를 기반으로 상태 업데이트하기 {/*updating-state-based-on-the-previous-state*/}

`age`가 `42`라고 가정해 봅시다. 이 핸들러는 `setAge(age + 1)`을 세 번 호출합니다:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

그러나 한 번 클릭 후, `age`는 `45`가 아닌 `43`이 됩니다! 이는 `set` 함수를 호출해도 [이미 실행 중인 코드에서](#ive-updated-the-state-but-logging-gives-me-the-old-value) `age` 상태 변수를 업데이트하지 않기 때문입니다. 따라서 각 `setAge(age + 1)` 호출은 `setAge(43)`이 됩니다.

이 문제를 해결하려면, **다음 상태 대신 *업데이트 함수*를** `setAge`에 전달할 수 있습니다:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

여기서 `a => a + 1`은 업데이트 함수입니다. 이는 <CodeStep step={1}>대기 중인 상태</CodeStep>를 받아 <CodeStep step={2}>다음 상태</CodeStep>를 계산합니다.

React는 업데이트 함수를 [큐에 넣습니다.](/learn/queueing-a-series-of-state-updates) 그런 다음, 다음 렌더링 동안 동일한 순서로 호출합니다:

1. `a => a + 1`은 대기 중인 상태로 `42`를 받고 다음 상태로 `43`을 반환합니다.
1. `a => a + 1`은 대기 중인 상태로 `43`을 받고 다음 상태로 `44`를 반환합니다.
1. `a => a + 1`은 대기 중인 상태로 `44`를 받고 다음 상태로 `45`를 반환합니다.

다른 대기 중인 업데이트가 없으므로 React는 최종적으로 `45`를 현재 상태로 저장합니다.

관례적으로, 대기 중인 상태 인수는 상태 변수 이름의 첫 글자로 명명하는 것이 일반적입니다. 예를 들어, `age`의 경우 `a`로 명명합니다. 그러나 `prevAge` 또는 더 명확하다고 생각되는 다른 이름으로도 부를 수 있습니다.

React는 개발 중에 [업데이트 함수를 두 번 호출](#my-initializer-or-updater-function-runs-twice)하여 [순수함을 확인합니다.](/learn/keeping-components-pure)

<DeepDive>

#### 항상 업데이트 함수를 사용하는 것이 좋을까요? {/*is-using-an-updater-always-preferred*/}

이전 상태에서 계산된 상태를 설정할 때 항상 `setAge(a => a + 1)`와 같은 코드를 작성하라는 권장 사항을 들을 수 있습니다. 이는 해가 되지 않지만, 항상 필요한 것은 아닙니다.

대부분의 경우, 이 두 접근 방식 사이에는 차이가 없습니다. React는 항상 클릭과 같은 의도적인 사용자 동작에 대해 `age` 상태 변수가 다음 클릭 전에 업데이트되도록 보장합니다. 이는 이벤트 핸들러의 시작 부분에서 "오래된" `age`를 볼 위험이 없음을 의미합니다.

그러나 동일한 이벤트 내에서 여러 업데이트를 수행하는 경우, 업데이트 함수가 유용할 수 있습니다. 상태 변수를 직접 접근하는 것이 불편한 경우(렌더링 최적화 시 발생할 수 있음)에도 유용합니다.

일관성을 선호하고 약간 더 장황한 구문을 선호하지 않는다면, 이전 상태에서 계산된 상태를 설정할 때 항상 업데이트 함수를 작성하는 것이 합리적입니다. 다른 상태 변수의 이전 상태에서 계산된 경우, 하나의 객체로 결합하고 [리듀서를 사용하는 것이 좋습니다.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="업데이트 함수를 전달하는 것과 다음 상태를 직접 전달하는 것의 차이" titleId="examples-updater">

#### 업데이트 함수 전달하기 {/*passing-the-updater-function*/}

이 예제는 업데이트 함수를 전달하므로 "+3" 버튼이 작동합니다.

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

#### 다음 상태를 직접 전달하기 {/*passing-the-next-state-directly*/}

이 예제는 **업데이트 함수를 전달하지 않으므로**, "+3" 버튼이 **의도한 대로 작동하지 않습니다**.

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
h1 { display: block; margin: 10px;
```

</Sandpack>

<Solution />

</Recipes>

---

### 상태에서 객체와 배열 업데이트하기 {/*updating-objects-and-arrays-in-state*/}

상태에 객체와 배열을 넣을 수 있습니다. React에서는 상태가 읽기 전용으로 간주되므로 **기존 객체를 *변경*하는 대신 *교체*해야 합니다**. 예를 들어, 상태에 `form` 객체가 있는 경우, 이를 변경하지 마세요:

```js
// 🚩 상태의 객체를 이렇게 변경하지 마세요:
form.firstName = 'Taylor';
```

대신, 새 객체를 생성하여 전체 객체를 교체하세요:

```js
// ✅ 새 객체로 상태를 교체하세요
setForm({
  ...form,
  firstName: 'Taylor'
});
```

[상태에서 객체 업데이트하기](/learn/updating-objects-in-state)와 [상태에서 배열 업데이트하기](/learn/updating-arrays-in-state)에 대해 더 알아보세요.

<Recipes titleText="상태에서 객체와 배열의 예제" titleId="examples-objects">

#### 폼 (객체) {/*form-object*/}

이 예제에서 `form` 상태 변수는 객체를 저장합니다. 각 입력에는 전체 폼의 다음 상태로 `setForm`을 호출하는 변경 핸들러가 있습니다. `{ ...form }` 스프레드 구문은 상태 객체가 변경되지 않고 교체되도록 보장합니다.

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

#### 폼 (중첩된 객체) {/*form-nested-object*/}

이 예제에서 상태는 더 중첩되어 있습니다. 중첩된 상태를 업데이트할 때는 업데이트하는 객체의 복사본뿐만 아니라 상위에 있는 모든 객체의 복사본도 생성해야 합니다. [중첩된 객체 업데이트하기](/learn/updating-objects-in-state#updating-a-nested-object)에 대해 더 알아보세요.

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

#### 리스트 (배열) {/*list-array*/}

이 예제에서 `todos` 상태 변수는 배열을 저장합니다. 각 버튼 핸들러는 배열의 다음 버전으로 `setTodos`를 호출합니다. `[...todos]` 스프레드 구문, `todos.map()` 및 `todos.filter()`는 상태 배열이 변경되지 않고 교체되도록 보장합니다.

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

#### Immer로 간결한 업데이트 로직 작성하기 {/*writing-concise-update-logic-with-immer*/}

배열과 객체를 변경하지 않고 업데이트하는 것이 번거롭게 느껴진다면, [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복적인 코드를 줄일 수 있습니다. Immer를 사용하면 객체를 변경하는 것처럼 간결한 코드를 작성할 수 있지만, 내부적으로는 불변 업데이트를 수행합니다:

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

### 초기 상태를 다시 생성하지 않기 {/*avoiding-recreating-the-initial-state*/}

React는 초기 상태를 한 번 저장하고 다음 렌더링에서는 무시합니다.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

`createInitialTodos()`의 결과는 초기 렌더링에만 사용되지만, 여전히 매 렌더링마다 이 함수를 호출하고 있습니다. 이는 큰 배열을 생성하거나 비용이 많이 드는 계산을 수행하는 경우 낭비가 될 수 있습니다.

이를 해결하려면, **초기화 함수로** `useState`에 전달할 수 있습니다:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

여기서 `createInitialTodos`는 *함수 자체*를 전달하는 것이지, `createInitialTodos()`를 호출한 결과를 전달하는 것이 아닙니다. 함수를 `useState`에 전달하면, React는 초기화 시에만 이를 호출합니다.

React는 개발 중에 [초기화 함수를 두 번 호출](#my-initializer-or-updater-function-runs-twice)하여 [순수함을 확인합니다.](/learn/keeping-components-pure)

<Recipes titleText="초기화 함수를 전달하는 것과 초기 상태를 직접 전달하는 것의 차이" titleId="examples-initializer">

#### 초기화 함수 전달하기 {/*passing-the-initializer-function*/}

이 예제는 초기화 함수를 전달하므로, `createInitialTodos` 함수는 초기화 시에만 실행됩니다. 입력에 입력할 때는 실행되지 않습니다.

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

#### 초기 상태를 직접 전달하기 {/*passing-the-initial-state-directly*/}

이 예제는 **초기화 함수를 전달하지 않으므로**, `createInitialTodos` 함수는 매 렌더링마다 실행됩니다. 입력에 입력할 때도 실행됩니다. 동작에는 차이가 없지만, 이 코드는 덜 효율적입니다.

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

### 키로 상태 초기화하기 {/*resetting-state-with-a-key*/}

리스트를 [렌더링할 때](/learn/rendering-lists) `key` 속성을 자주 사용하게 됩니다. 그러나, 이는 또 다른 목적도 가지고 있습니다.

**다른 `key`를 컴포넌트에 전달하여 컴포넌트의 상태를 초기화할 수 있습니다.** 이 예제에서, Reset 버튼은 `version` 상태 변수를 변경합니다. 이를 `Form`에 `key`로 전달합니다. `key`가 변경되면, React는 `Form` 컴포넌트(및 모든 자식)를 처음부터 다시 생성하므로, 상태가 초기화됩니다.

[상태 유지 및 초기화](/learn/preserving-and-resetting-state)에 대해 더 알아보세요.

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

### 이전 렌더링의 정보 저장하기 {/*storing-information-from-previous-renders*/}

일반적으로 이벤트 핸들러에서 상태를 업데이트합니다. 그러나 드물게 렌더링에 응답하여 상태를 조정해야 할 때가 있습니다. 예를 들어, prop이 변경될 때 상태 변수를 변경하고 싶을 수 있습니다.

대부분의 경우, 이것이 필요하지 않습니다:

* **현재 prop 또는 다른 상태에서 완전히 계산할 수 있는 값이라면, [그 중복 상태를 완전히 제거하세요.](/learn/choosing-the-state-structure#avoid-redundant-state)** 너무 자주 다시 계산하는 것이 걱정된다면, [`useMemo` Hook](/reference/react/useMemo)이 도움이 될 수 있습니다.
* 전체 컴포넌트 트리의 상태를 초기화하려면, [컴포넌트에 다른 `key`를 전달하세요.](#resetting-state-with-a-key)
* 가능하다면, 이벤트 핸들러에서 모든 관련 상태를 업데이트하세요.

이 중 어느 것도 적용되지 않는 드문 경우에는, 렌더링된 값에 따라 상태를 업데이트하는 패턴을 사용할 수있습니다. 이는 컴포넌트가 렌더링되는 동안 `set` 함수를 호출하여 수행할 수 있습니다.

다음은 예제입니다. 이 `CountLabel` 컴포넌트는 전달된 `count` prop을 표시합니다:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

카운터가 *증가했는지 감소했는지*를 표시하고 싶다고 가정해 봅시다. `count` prop은 이를 알려주지 않으므로, 이전 값을 추적해야 합니다. `prevCount` 상태 변수를 추가하여 이를 추적합니다. `trend`라는 또 다른 상태 변수를 추가하여 카운터가 증가했는지 감소했는지를 저장합니다. `prevCount`와 `count`를 비교하고, 다르면 `prevCount`와 `trend`를 업데이트합니다. 이제 현재 `count` prop과 *마지막 렌더링 이후 어떻게 변경되었는지*를 모두 표시할 수 있습니다.

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

렌더링 중에 `set` 함수를 호출할 때는 `prevCount !== count`와 같은 조건 내에 있어야 하며, 조건 내에 `setPrevCount(count)`와 같은 호출이 있어야 합니다. 그렇지 않으면, 컴포넌트가 무한 루프에 빠져 충돌할 때까지 다시 렌더링됩니다. 또한, 이렇게 할 때는 *현재 렌더링 중인* 컴포넌트의 상태만 업데이트할 수 있습니다. 렌더링 중에 *다른* 컴포넌트의 `set` 함수를 호출하는 것은 오류입니다. 마지막으로, `set` 호출은 여전히 [상태를 변경하지 않고 업데이트](#updating-objects-and-arrays-in-state)해야 합니다. 이는 [순수 함수의 규칙](#keeping-components-pure)을 깨뜨릴 수 없다는 것을 의미합니다.

이 패턴은 이해하기 어려울 수 있으며, 일반적으로 피하는 것이 좋습니다. 그러나 이는 상태를 효과에서 업데이트하는 것보다 낫습니다. 렌더링 중에 `set` 함수를 호출하면, React는 컴포넌트가 `return` 문으로 종료된 직후, 자식을 렌더링하기 전에 해당 컴포넌트를 즉시 다시 렌더링합니다. 이렇게 하면 자식이 두 번 렌더링될 필요가 없습니다. 컴포넌트 함수의 나머지 부분은 여전히 실행되지만(결과는 버려집니다). 조건이 모든 Hook 호출 아래에 있다면, 렌더링을 더 일찍 다시 시작하기 위해 초기 `return;`을 추가할 수 있습니다.

---

## 문제 해결 {/*troubleshooting*/}

### 상태를 업데이트했지만, 로그에 이전 값이 표시됩니다 {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

`set` 함수를 호출해도 **실행 중인 코드의 상태는 변경되지 않습니다**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // 1로 다시 렌더링 요청
  console.log(count);  // 여전히 0!

  setTimeout(() => {
    console.log(count); // 여전히 0!
  }, 5000);
}
```

이는 [상태가 스냅샷처럼 동작하기 때문입니다.](/learn/state-as-a-snapshot) 상태를 업데이트하면 새로운 상태 값으로 다시 렌더링을 요청하지만, 이미 실행 중인 이벤트 핸들러의 `count` JavaScript 변수에는 영향을 미치지 않습니다.

다음 상태를 사용해야 하는 경우, `set` 함수에 전달하기 전에 변수를 저장할 수 있습니다:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### 상태를 업데이트했지만, 화면이 업데이트되지 않습니다 {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React는 **다음 상태가 이전 상태와 동일한 경우 업데이트를 무시합니다.** 이는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교에 의해 결정됩니다. 이는 보통 객체나 배열을 직접 변경할 때 발생합니다:

```js
obj.x = 10;  // 🚩 잘못된 방법: 기존 객체 변경
setObj(obj); // 🚩 아무 일도 일어나지 않음
```

기존 `obj` 객체를 변경하고 이를 `setObj`에 전달했기 때문에, React는 업데이트를 무시했습니다. 이를 해결하려면, 항상 상태에서 객체와 배열을 [_변경_하는 대신 _교체_](#updating-objects-and-arrays-in-state)해야 합니다:

```js
// ✅ 올바른 방법: 새 객체 생성
setObj({
  ...obj,
  x: 10
});
```

---

### "Too many re-renders" 오류가 발생합니다 {/*im-getting-an-error-too-many-re-renders*/}

`Too many re-renders. React limits the number of renders to prevent an infinite loop.`라는 오류가 발생할 수 있습니다. 일반적으로 이는 렌더링 중에 무조건 상태를 설정하여 컴포넌트가 루프에 빠지는 경우입니다: 렌더링, 상태 설정(렌더링을 유발), 렌더링, 상태 설정(렌더링을 유발) 등. 이는 이벤트 핸들러를 지정하는 데 실수가 있을 때 자주 발생합니다:

```js {1-2}
// 🚩 잘못된 방법: 렌더링 중에 핸들러 호출
return <button onClick={handleClick()}>Click me</button>

// ✅ 올바른 방법: 이벤트 핸들러 전달
return <button onClick={handleClick}>Click me</button>

// ✅ 올바른 방법: 인라인 함수 전달
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

이 오류의 원인을 찾을 수 없는 경우, 콘솔의 오류 옆에 있는 화살표를 클릭하고 JavaScript 스택을 살펴보아 오류를 일으킨 특정 `set` 함수 호출을 찾으세요.

---

### 초기화 함수나 업데이트 함수가 두 번 실행됩니다 {/*my-initializer-or-updater-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode)에서는 React가 일부 함수를 한 번이 아닌 두 번 호출합니다:

```js {2,5-6,11-12}
function TodoList() {
  // 이 컴포넌트 함수는 매 렌더링마다 두 번 실행됩니다.

  const [todos, setTodos] = useState(() => {
    // 이 초기화 함수는 초기화 시에 두 번 실행됩니다.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // 이 업데이트 함수는 매 클릭마다 두 번 실행됩니다.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

이는 예상된 동작이며, 코드를 깨뜨리지 않아야 합니다.

이 **개발 전용** 동작은 [컴포넌트를 순수하게 유지하는 데](#keeping-components-pure) 도움이 됩니다. React는 호출 중 하나의 결과를 사용하고, 다른 호출의 결과는 무시합니다. 컴포넌트, 초기화 함수, 업데이트 함수가 순수하다면, 이는 논리에 영향을 미치지 않습니다. 그러나 실수로 불순한 경우, 이를 발견하는 데 도움이 됩니다.

예를 들어, 이 불순한 업데이트 함수는 상태의 배열을 변경합니다:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 실수: 상태 변경
  prevTodos.push(createTodo());
});
```

React가 업데이트 함수를 두 번 호출하기 때문에, 할 일이 두 번 추가된 것을 볼 수 있어 실수가 있음을 알 수 있습니다. 이 예제에서는 [배열을 변경하는 대신 교체](#updating-objects-and-arrays-in-state)하여 실수를 수정할 수 있습니다:

```js {2,3}
setTodos(prevTodos => {
  // ✅ 올바른 방법: 새 상태로 교체
  return [...prevTodos, createTodo()];
});
```

이제 이 업데이트 함수가 순수하므로, 추가 호출이 동작에 차이를 만들지 않습니다. React가 두 번 호출하는 것은 실수를 찾는 데 도움이 됩니다. **컴포넌트, 초기화 함수, 업데이트 함수만 순수해야 합니다.** 이벤트 핸들러는 순수할 필요가 없으므로, React는 이벤트 핸들러를 두 번 호출하지 않습니다.

[컴포넌트를 순수하게 유지하기](/learn/keeping-components-pure)에 대해 더 알아보세요.

---

### 상태로 함수를 설정하려고 하지만, 대신 호출됩니다 {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

다음과 같이 상태에 함수를 넣을 수 없습니다:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

함수를 전달하기 때문에, React는 `someFunction`을 [초기화 함수](#avoiding-recreating-the-initial-state)로, `someOtherFunction`을 [업데이트 함수](#updating-state-based-on-the-previous-state)로 간주하여 호출하고 결과를 저장하려고 합니다. 실제로 *함수를 저장*하려면, 두 경우 모두 `() =>`를 앞에 붙여야 합니다. 그러면 React는 전달한 함수를 저장합니다.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```