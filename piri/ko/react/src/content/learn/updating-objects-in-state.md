---
title: 상태에서 객체 업데이트하기
---

<Intro>

상태는 객체를 포함한 모든 종류의 JavaScript 값을 가질 수 있습니다. 하지만 React 상태에서 보유한 객체를 직접 변경해서는 안 됩니다. 대신 객체를 업데이트하려면 새 객체를 만들거나 기존 객체를 복사한 다음, 그 복사본을 상태로 설정해야 합니다.

</Intro>

<YouWillLearn>

- React 상태에서 객체를 올바르게 업데이트하는 방법
- 중첩된 객체를 변경하지 않고 업데이트하는 방법
- 불변성이 무엇인지, 그리고 그것을 깨뜨리지 않는 방법
- Immer를 사용하여 객체 복사를 덜 반복적으로 만드는 방법

</YouWillLearn>

## 변형이란 무엇인가요? {/*whats-a-mutation*/}

상태에 모든 종류의 JavaScript 값을 저장할 수 있습니다.

```js
const [x, setX] = useState(0);
```

지금까지 숫자, 문자열, 불리언을 사용해 왔습니다. 이러한 종류의 JavaScript 값은 "불변"이며, 변경할 수 없거나 "읽기 전용"입니다. 값을 _교체_하여 다시 렌더링을 트리거할 수 있습니다:

```js
setX(5);
```

`x` 상태는 `0`에서 `5`로 변경되었지만, _숫자 `0` 자체_는 변경되지 않았습니다. JavaScript에서 숫자, 문자열, 불리언과 같은 기본 값은 변경할 수 없습니다.

이제 상태에 있는 객체를 고려해 보세요:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

기술적으로는 _객체 자체의_ 내용을 변경할 수 있습니다. **이것을 변형이라고 합니다:**

```js
position.x = 5;
```

그러나 React 상태의 객체는 기술적으로 변경 가능하지만, 숫자, 불리언, 문자열처럼 **불변인 것처럼** 취급해야 합니다. 객체를 변경하는 대신 항상 객체를 교체해야 합니다.

## 상태를 읽기 전용으로 취급하기 {/*treat-state-as-read-only*/}

다시 말해, 상태에 넣는 모든 JavaScript 객체를 **읽기 전용으로** 취급해야 합니다.

이 예제는 현재 포인터 위치를 나타내기 위해 상태에 객체를 보유합니다. 빨간 점은 미리보기 영역 위로 커서를 이동하거나 터치할 때 이동해야 합니다. 하지만 점은 초기 위치에 머물러 있습니다:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

문제는 이 코드 부분에 있습니다.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

이 코드는 [이전 렌더링](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)에서 `position`에 할당된 객체를 수정합니다. 하지만 상태 설정 함수를 사용하지 않으면 React는 객체가 변경되었는지 알 수 없습니다. 따라서 React는 아무런 반응을 하지 않습니다. 마치 식사를 마친 후 주문을 변경하려는 것과 같습니다. 상태를 변형하는 것이 일부 경우에는 작동할 수 있지만, 우리는 그것을 권장하지 않습니다. 렌더링에서 접근할 수 있는 상태 값을 읽기 전용으로 취급해야 합니다.

이 경우 실제로 [다시 렌더링을 트리거하려면](/learn/state-as-a-snapshot#setting-state-triggers-renders) **새 *객체*를 생성하고 상태 설정 함수에 전달하세요:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition`을 사용하면 React에게 다음을 알립니다:

* `position`을 이 새 객체로 교체하세요
* 그리고 이 컴포넌트를 다시 렌더링하세요

이제 빨간 점이 미리보기 영역 위로 커서를 이동하거나 터치할 때 포인터를 따라가는 것을 확인하세요:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### 로컬 변형은 괜찮습니다 {/*local-mutation-is-fine*/}

이 코드는 상태에 있는 *기존* 객체를 수정하기 때문에 문제가 됩니다:

```js
position.x = e.clientX;
position.y = e.clientY;
```

하지만 이 코드는 **전혀 문제 없습니다**. 방금 *생성한* 새 객체를 변형하기 때문입니다:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

사실, 이것은 다음과 완전히 동일합니다:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

변형은 상태에 이미 있는 *기존* 객체를 변경할 때만 문제가 됩니다. 방금 생성한 객체를 변형하는 것은 괜찮습니다. 왜냐하면 *아직 다른 코드가 그것을 참조하지 않기 때문입니다.* 변경해도 그것에 의존하는 다른 것에 영향을 미치지 않습니다. 이것을 "로컬 변형"이라고 합니다. 렌더링 [중에도 로컬 변형을 할 수 있습니다.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) 매우 편리하고 완전히 괜찮습니다!

</DeepDive>  

## 스프레드 문법으로 객체 복사하기 {/*copying-objects-with-the-spread-syntax*/}

이전 예제에서 `position` 객체는 항상 현재 커서 위치에서 새로 생성됩니다. 하지만 종종 새 객체를 생성할 때 *기존* 데이터를 포함하고 싶을 때가 있습니다. 예를 들어, 양식의 *하나의* 필드만 업데이트하고 나머지 필드의 이전 값을 유지하고 싶을 수 있습니다.

이 입력 필드는 `onChange` 핸들러가 상태를 변형하기 때문에 작동하지 않습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

예를 들어, 이 줄은 이전 렌더링에서 상태를 변형합니다:

```js
person.firstName = e.target.value;
```

원하는 동작을 얻기 위한 신뢰할 수 있는 방법은 새 객체를 생성하고 `setPerson`에 전달하는 것입니다. 하지만 여기서는 필드 중 하나만 변경되었기 때문에 **기존 데이터를 새 객체에 복사**하고 싶습니다:

```js
setPerson({
  firstName: e.target.value, // 입력에서 새 이름
  lastName: person.lastName,
  email: person.email
});
```

모든 속성을 개별적으로 복사할 필요가 없도록 `...` [객체 스프레드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) 문법을 사용할 수 있습니다.

```js
setPerson({
  ...person, // 이전 필드 복사
  firstName: e.target.value // 하지만 이 필드는 덮어쓰기
});
```

이제 양식이 작동합니다!

각 입력 필드에 대해 별도의 상태 변수를 선언하지 않았다는 점에 주목하세요. 큰 양식의 경우 모든 데이터를 객체에 그룹화하는 것이 매우 편리합니다. 단, 올바르게 업데이트하는 한!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`...` 스프레드 문법은 "얕은 복사"입니다. 즉, 한 단계 깊이만 복사합니다. 이는 빠르지만, 중첩된 속성을 업데이트하려면 여러 번 사용해야 합니다.

<DeepDive>

#### 여러 필드에 대해 단일 이벤트 핸들러 사용하기 {/*using-a-single-event-handler-for-multiple-fields*/}

객체 정의 내부에서 `[` 및 `]` 괄호를 사용하여 동적 이름을 가진 속성을 지정할 수도 있습니다. 다음은 세 개의 다른 핸들러 대신 단일 이벤트 핸들러를 사용하는 동일한 예제입니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

여기서 `e.target.name`은 `<input>` DOM 요소에 부여된 `name` 속성을 참조합니다.

</DeepDive>

## 중첩된 객체 업데이트하기 {/*updating-a-nested-object*/}

다음과 같은 중첩된 객체 구조를 고려해 보세요:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

`person.artwork.city`를 업데이트하려면 변형으로 어떻게 하는지 명확합니다:

```js
person.artwork.city = 'New Delhi';
```

하지만 React에서는 상태를 불변으로 취급합니다! `city`를 변경하려면 먼저 이전 데이터로 미리 채워진 새 `artwork` 객체를 생성한 다음, 새 `artwork`를 가리키는 새 `person` 객체를 생성해야 합니다:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

또는, 단일 함수 호출로 작성하면:

```js
setPerson({
  ...person, // 다른 필드 복사
  artwork: { // 하지만 artwork는 교체
    ...person.artwork, // 동일한 것으로
    city: 'New Delhi' // 하지만 New Delhi로!
  }
});
```

이것은 다소 장황하지만 많은 경우에 잘 작동합니다:

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

<DeepDive>

#### 객체는 실제로 중첩되지 않습니다 {/*objects-are-not-really-nested*/}

이와 같은 객체는 코드에서 "중첩된" 것처럼 보입니다:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

그러나 "중첩"은 객체가 어떻게 동작하는지를 생각하는 부정확한 방법입니다. 코드가 실행될 때 "중첩된" 객체라는 것은 없습니다. 실제로는 두 개의 다른 객체를 보고 있는 것입니다:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` 객체는 `obj2` "안에" 있지 않습니다. 예를 들어, `obj3`도 `obj1`을 "가리킬" 수
있습니다:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

만약 `obj3.artwork.city`를 변형하면, 이는 `obj2.artwork.city`와 `obj1.city` 모두에 영향을 미칩니다. 이는 `obj3.artwork`, `obj2.artwork`, 그리고 `obj1`이 동일한 객체이기 때문입니다. 객체를 "중첩된" 것으로 생각하면 이를 이해하기 어렵습니다. 대신, 객체는 속성으로 서로를 "가리키는" 별개의 객체입니다.

</DeepDive>  

### Immer로 간결한 업데이트 로직 작성하기 {/*write-concise-update-logic-with-immer*/}

상태가 깊게 중첩된 경우, [이를 평탄화하는 것](/learn/choosing-the-state-structure#avoid-deeply-nested-state)을 고려할 수 있습니다. 하지만 상태 구조를 변경하고 싶지 않다면, 중첩된 스프레드 문법에 대한 지름길을 선호할 수 있습니다. [Immer](https://github.com/immerjs/use-immer)는 편리하지만 변형하는 문법을 사용하여 코드를 작성할 수 있게 해주며, 복사본을 생성하는 작업을 대신 처리해주는 인기 있는 라이브러리입니다. Immer를 사용하면 작성하는 코드는 "규칙을 어기고" 객체를 변형하는 것처럼 보입니다:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

하지만 일반적인 변형과 달리, 이는 과거 상태를 덮어쓰지 않습니다!

<DeepDive>

#### Immer는 어떻게 작동하나요? {/*how-does-immer-work*/}

Immer가 제공하는 `draft`는 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)라는 특별한 유형의 객체로, 사용자가 수행하는 작업을 "기록"합니다. 이 때문에 원하는 만큼 자유롭게 변형할 수 있습니다! 내부적으로 Immer는 `draft`의 어떤 부분이 변경되었는지 파악하고, 편집 내용을 포함하는 완전히 새로운 객체를 생성합니다.

</DeepDive>

Immer를 사용해 보세요:

1. `npm install use-immer`를 실행하여 Immer를 종속성으로 추가합니다.
2. 그런 다음 `import { useState } from 'react'`를 `import { useImmer } from 'use-immer'`로 교체합니다.

다음은 위의 예제를 Immer로 변환한 것입니다:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

이벤트 핸들러가 훨씬 간결해진 것을 확인하세요. `useState`와 `useImmer`를 단일 컴포넌트에서 원하는 만큼 혼합하여 사용할 수 있습니다. Immer는 상태에 중첩이 있는 경우 업데이트 핸들러를 간결하게 유지하고, 객체 복사로 인해 반복적인 코드를 줄이는 훌륭한 방법입니다.

<DeepDive>

#### React에서 상태 변형이 권장되지 않는 이유는 무엇인가요? {/*why-is-mutating-state-not-recommended-in-react*/}

몇 가지 이유가 있습니다:

* **디버깅:** `console.log`를 사용하고 상태를 변형하지 않으면, 과거 로그가 최신 상태 변경으로 덮어쓰이지 않습니다. 따라서 렌더링 간 상태가 어떻게 변경되었는지 명확하게 볼 수 있습니다.
* **최적화:** 일반적인 React [최적화 전략](/reference/react/memo)은 이전 props나 상태가 다음 것과 동일한 경우 작업을 건너뛰는 데 의존합니다. 상태를 절대 변형하지 않으면 변경 사항이 있는지 확인하는 것이 매우 빠릅니다. `prevObj === obj`인 경우, 내부에서 아무것도 변경되지 않았음을 확신할 수 있습니다.
* **새로운 기능:** 우리가 개발 중인 새로운 React 기능은 상태를 [스냅샷처럼](/learn/state-as-a-snapshot) 취급하는 것에 의존합니다. 과거 상태 버전을 변형하면 새로운 기능을 사용할 수 없을 수 있습니다.
* **요구 사항 변경:** Undo/Redo 구현, 변경 내역 표시, 사용자가 양식을 이전 값으로 재설정할 수 있도록 하는 등의 일부 애플리케이션 기능은 아무것도 변형되지 않을 때 더 쉽게 수행할 수 있습니다. 이는 메모리에 과거 상태 복사본을 유지하고 적절할 때 재사용할 수 있기 때문입니다. 변형 접근 방식으로 시작하면 나중에 이러한 기능을 추가하기 어려울 수 있습니다.
* **간단한 구현:** React는 변형에 의존하지 않기 때문에 객체에 대해 특별한 작업을 할 필요가 없습니다. 속성을 가로채거나 항상 Proxy로 감싸거나 다른 "반응형" 솔루션처럼 초기화 시 추가 작업을 할 필요가 없습니다. 이는 또한 React가 성능이나 정확성 문제 없이 상태에 어떤 객체든 넣을 수 있게 하는 이유입니다.

실제로 React에서 상태를 변형해도 "문제가 없는" 경우가 많지만, 우리는 이 접근 방식을 염두에 두고 개발된 새로운 React 기능을 사용할 수 있도록 그렇게 하지 않는 것을 강력히 권장합니다. 미래의 기여자와 아마도 미래의 자신이 감사할 것입니다!

</DeepDive>

<Recap>

* React에서 모든 상태를 불변으로 취급하세요.
* 상태에 객체를 저장할 때, 객체를 변형하면 렌더링이 트리거되지 않으며 이전 렌더링 "스냅샷"의 상태가 변경됩니다.
* 객체를 변형하는 대신, 객체의 *새* 버전을 생성하고 상태로 설정하여 다시 렌더링을 트리거하세요.
* `{...obj, something: 'newValue'}` 객체 스프레드 문법을 사용하여 객체 복사본을 생성할 수 있습니다.
* 스프레드 문법은 얕은 복사입니다: 한 단계 깊이만 복사합니다.
* 중첩된 객체를 업데이트하려면 업데이트하는 위치에서부터 모든 복사본을 생성해야 합니다.
* 반복적인 복사 코드를 줄이기 위해 Immer를 사용하세요.

</Recap>

<Challenges>

#### 잘못된 상태 업데이트 수정하기 {/*fix-incorrect-state-updates*/}

이 양식에는 몇 가지 버그가 있습니다. 점수를 증가시키는 버튼을 몇 번 클릭하세요. 점수가 증가하지 않는 것을 확인하세요. 그런 다음 이름을 편집하고, 점수가 갑자기 변경된 것을 확인하세요. 마지막으로 성을 편집하고, 점수가 완전히 사라진 것을 확인하세요.

이 모든 버그를 수정하는 것이 과제입니다. 버그를 수정할 때마다 각 버그가 발생하는 이유를 설명하세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

다음은 두 가지 버그가 모두 수정된 버전입니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`handlePlusClick`의 문제는 `player` 객체를 변형했다는 것입니다. 그 결과, React는 다시 렌더링할 이유를 알지 못했고, 화면의 점수를 업데이트하지 않았습니다. 그래서 이름을 편집했을 때, 상태가 업데이트되어 다시 렌더링이 트리거되었고, 화면의 점수도 업데이트되었습니다.

`handleLastNameChange`의 문제는 기존 `...player` 필드를 새 객체에 복사하지 않았다는 것입니다. 그래서 성을 편집한 후 점수가 사라졌습니다.

</Solution>

#### 변형을 찾아 수정하기 {/*find-and-fix-the-mutation*/}

정적 배경에 드래그 가능한 상자가 있습니다. 선택 입력을 사용하여 상자의 색상을 변경할 수 있습니다.

하지만 버그가 있습니다. 상자를 먼저 이동한 다음 색상을 변경하면 배경(움직이지 않아야 하는)이 상자 위치로 "점프"합니다. 하지만 이는 발생해서는 안 됩니다: `Background`의 `position` prop은 `{ x: 0, y: 0 }`인 `initialPosition`으로 설정되어 있습니다. 왜 색상 변경 후 배경이 움직이나요?

버그를 찾아 수정하세요.

<Hint>

예상치 못한 것이 변경되면 변형이 있습니다. `App.js`에서 변형을 찾아 수정하세요.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

문제는 `handleMove` 내부의 변형에 있었습니다. 이는 `shape.position`을 변형했지만, 이는 `initialPosition`이 가리키는 동일한 객체입니다. 그래서 모양과 배경이 모두 이동합니다. (이는 변형이기 때문에 화면에 반영되지 않지만, 색상 변경과 같은 관련 없는 업데이트가 다시 렌더링을 트리거할 때까지 화면에 반영되지 않습니다.)

해결책은 `handleMove`에서 변형을 제거하고, 스프레드 문법을 사용하여 모양을 복사하는 것입니다. `+=`는 변형이므로, 이를 일반 `+` 연산으로 다시 작성해야 합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Immer로 객체 업데이트하기 {/*update-an-object-with-immer*/}

이전 챌린지에서와 동일한 버그가 있는 예제입니다. 이번에는 Immer를 사용하여 변형을 수정하세요. 편의를 위해 `useImmer`가 이미 가져와져 있으므로, `shape` 상태 변수를 사용하도록 변경해야 합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

다음은 Immer로 다시 작성된 솔루션입니다. 이벤트 핸들러가 변형 방식으로 작성되었지만, 버그가 발생하지 않습니다. 이는 내부적으로 Immer가 기존 객체를 절대 변형하지 않기 때문입니다.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>