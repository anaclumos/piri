---
title: Refs를 사용한 DOM 조작
---

<Intro>

React는 렌더링 결과에 맞춰 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)을 자동으로 업데이트하므로, 컴포넌트가 DOM을 조작할 필요가 거의 없습니다. 그러나 때로는 React가 관리하는 DOM 요소에 접근해야 할 때가 있습니다. 예를 들어, 노드에 포커스를 맞추거나, 스크롤하거나, 크기와 위치를 측정하는 경우입니다. React에는 이러한 작업을 수행하는 내장된 방법이 없으므로, DOM 노드에 대한 *ref*가 필요합니다.

</Intro>

<YouWillLearn>

- `ref` 속성을 사용하여 React가 관리하는 DOM 노드에 접근하는 방법
- `ref` JSX 속성이 `useRef` Hook과 어떻게 관련되는지
- 다른 컴포넌트의 DOM 노드에 접근하는 방법
- React가 관리하는 DOM을 수정해도 안전한 경우

</YouWillLearn>

## 노드에 ref 얻기 {/*getting-a-ref-to-the-node*/}

React가 관리하는 DOM 노드에 접근하려면 먼저 `useRef` Hook을 가져옵니다:

```js
import { useRef } from 'react';
```

그런 다음, 컴포넌트 내에서 ref를 선언합니다:

```js
const myRef = useRef(null);
```

마지막으로, DOM 노드를 얻고자 하는 JSX 태그에 `ref` 속성으로 전달합니다:

```js
<div ref={myRef}>
```

`useRef` Hook은 `current`라는 단일 속성을 가진 객체를 반환합니다. 초기에는 `myRef.current`가 `null`입니다. React가 이 `<div>`에 대한 DOM 노드를 생성하면, React는 이 노드에 대한 참조를 `myRef.current`에 넣습니다. 그런 다음 [이벤트 핸들러](/learn/responding-to-events)에서 이 DOM 노드에 접근하고, 정의된 [브라우저 API](https://developer.mozilla.org/docs/Web/API/Element)를 사용할 수 있습니다.

```js
// 예를 들어, 모든 브라우저 API를 사용할 수 있습니다:
myRef.current.scrollIntoView();
```

### 예제: 텍스트 입력에 포커스 맞추기 {/*example-focusing-a-text-input*/}

이 예제에서는 버튼을 클릭하면 입력란에 포커스가 맞춰집니다:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        입력란에 포커스 맞추기
      </button>
    </>
  );
}
```

</Sandpack>

이를 구현하려면:

1. `useRef` Hook으로 `inputRef`를 선언합니다.
2. `<input ref={inputRef}>`로 전달합니다. 이는 React에게 **이 `<input>`의 DOM 노드를 `inputRef.current`에 넣으라고 지시합니다.**
3. `handleClick` 함수에서 `inputRef.current`에서 입력 DOM 노드를 읽고 `inputRef.current.focus()`로 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출합니다.
4. `onClick`으로 `<button>`에 `handleClick` 이벤트 핸들러를 전달합니다.

DOM 조작은 ref의 가장 일반적인 사용 사례이지만, `useRef` Hook은 타이머 ID와 같은 React 외부의 다른 것을 저장하는 데에도 사용할 수 있습니다. 상태와 유사하게, ref는 렌더링 사이에 유지됩니다. ref는 설정할 때 다시 렌더링을 트리거하지 않는 상태 변수와 같습니다. [Referencing Values with Refs](/learn/referencing-values-with-refs)에서 ref에 대해 자세히 알아보세요.

### 예제: 요소로 스크롤하기 {/*example-scrolling-to-an-element*/}

컴포넌트에서 여러 개의 ref를 가질 수 있습니다. 이 예제에서는 세 개의 이미지로 구성된 캐러셀입니다. 각 버튼은 해당 DOM 노드에서 브라우저 [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) 메서드를 호출하여 이미지를 중앙에 배치합니다:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### ref 콜백을 사용하여 ref 목록 관리하기 {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

위의 예제에서는 미리 정의된 ref의 수가 있습니다. 그러나 때로는 목록의 각 항목에 대한 ref가 필요할 수 있으며, 몇 개가 있을지 모릅니다. 다음과 같은 코드는 **작동하지 않습니다**:

```js
<ul>
  {items.map((item) => {
    // 작동하지 않습니다!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

이는 **Hook은 컴포넌트의 최상위에서만 호출되어야 하기 때문입니다.** 루프, 조건문 또는 `map()` 호출 내에서 `useRef`를 호출할 수 없습니다.

이 문제를 해결하는 한 가지 방법은 부모 요소에 대한 단일 ref를 얻고, [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)과 같은 DOM 조작 메서드를 사용하여 개별 자식 노드를 "찾는" 것입니다. 그러나 이는 취약하며 DOM 구조가 변경되면 깨질 수 있습니다.

다른 해결책은 **`ref` 속성에 함수를 전달하는 것**입니다. 이를 [`ref` 콜백](/reference/react-dom/components/common#ref-callback)이라고 합니다. React는 ref를 설정할 때 DOM 노드로 ref 콜백을 호출하고, ref를 지울 때 `null`로 호출합니다. 이를 통해 자체 배열이나 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)을 유지하고, 인덱스나 ID로 ref에 접근할 수 있습니다.

이 예제는 이 접근 방식을 사용하여 긴 목록에서 임의의 노드로 스크롤하는 방법을 보여줍니다:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 첫 사용 시 Map 초기화
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Tom</button>
        <button onClick={() => scrollToCat(catList[5])}>Maru</button>
        <button onClick={() => scrollToCat(catList[9])}>Jellylorum</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat, node);
                } else {
                  map.delete(cat);
                }
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  }
}
```

</Sandpack>

이 예제에서 `itemsRef`는 단일 DOM 노드를 보유하지 않습니다. 대신, 항목 ID에서 DOM 노드로의 [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)을 보유합니다. ([Ref는 모든 값을 보유할 수 있습니다!](/learn/referencing-values-with-refs)) 각 목록 항목의 [`ref` 콜백](/reference/react-dom/components/common#ref-callback)은 Map을 업데이트합니다:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Map에 추가
      map.set(cat, node);
    } else {
      // Map에서 제거
      map.delete(cat);
    }
  }}
>
```

이를 통해 나중에 Map에서 개별 DOM 노드를 읽을 수 있습니다.

<Canary>

이 예제는 `ref` 콜백 정리 함수로 Map을 관리하는 또 다른 접근 방식을 보여줍니다.

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Map에 추가
    map.set(cat, node);

    return () => {
      // Map에서 제거
      map.delete(cat);
    };
  }}
>
```

</Canary>

</DeepDive>

## 다른 컴포넌트의 DOM 노드에 접근하기 {/*accessing-another-components-dom-nodes*/}

브라우저 요소를 출력하는 내장 컴포넌트에 ref를 설정하면 `<input />`과 같은 경우, React는 해당 ref의 `current` 속성을 해당 DOM 노드(브라우저의 실제 `<input />` 등)로 설정합니다.

그러나 **자신의** 컴포넌트에 ref를 설정하려고 하면, 예를 들어 `<MyInput />`과 같은 경우, 기본적으로 `null`을 받게 됩니다. 다음 예제는 이를 보여줍니다. 버튼을 클릭해도 입력란에 포커스가 맞춰지지 않는 것을 확인하세요:

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        입력란에 포커스 맞추기
      </button>
    </>
  );
}
```

</Sandpack>

문제를 인식할 수 있도록 React는 콘솔에 오류도 출력합니다:

<ConsoleBlock level="error">

경고: 함수 컴포넌트에 ref를 줄 수 없습니다. 이 ref에 접근하려고 하면 실패합니다. React.forwardRef()를 사용하려고 했습니까?

</ConsoleBlock>

이는 기본적으로 React가 다른 컴포넌트의 DOM 노드에 접근하지 못하게 하기 때문입니다. 자식 컴포넌트의 DOM 노드에도 접근할 수 없습니다! 이는 의도적입니다. Ref는 드물게 사용해야 하는 탈출구입니다. _다른_ 컴포넌트의 DOM 노드를 수동으로 조작하면 코드가 더 취약해집니다.

대신, DOM 노드를 노출하려는 컴포넌트는 해당 동작에 **옵트인**해야 합니다. 컴포넌트는 ref를 자식 중 하나에 "전달"한다고 지정할 수 있습니다. `MyInput`이 `forwardRef` API를 사용하는 방법은 다음과 같습니다:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

작동 방식은 다음과 같습니다:

1. `<MyInput ref={inputRef} />`는 React에게 해당 DOM 노드를 `inputRef.current`에 넣으라고 지시합니다. 그러나 이는 `MyInput` 컴포넌트가 해당 동작에 옵트인해야 합니다. 기본적으로는 그렇지 않습니다.
2. `MyInput` 컴포넌트는 `forwardRef`를 사용하여 선언됩니다. **이것은 위에서 전달된 `inputRef`를 두 번째 `ref` 인수로 받도록 옵트인합니다**. 이는 `props` 다음에 선언됩니다.
3. `MyInput` 자체는 받은 `ref`를 내부의 `<input>`에 전달합니다.

이제 버튼을 클릭하여 입력란에 포커스를 맞추는 것이 작동합니다:

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        입력란에 포커스 맞추기
      </button>
    </>
  );
}
```

</Sandpack>

디자인 시스템에서는 버튼, 입력란 등과 같은 저수준 컴포넌트가 ref를 DOM 노드로 전달하는 것이 일반적인 패턴입니다. 반면, 폼, 목록 또는 페이지 섹션과 같은 고수준 컴포넌트는 DOM 구조에 대한 의존성을 피하기 위해 DOM 노드를 노출하지 않는 것이 일반적입니다.

<DeepDive>

#### 명령형 핸들로 API의 일부 노출하기 {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

위의 예제에서 `MyInput`은 원래 DOM 입력 요소를 노출합니다. 이는 부모 컴포넌트가 `focus()`를 호출할 수 있게 합니다. 그러나 이는 부모 컴포넌트가 CSS 스타일을 변경하는 등 다른 작업도 할 수 있게 합니다. 드문 경우이지만 노출된 기능을 제한하고 싶을 수 있습니다. 이를 `useImperativeHandle`로 할 수 있습니다:

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // focus만 노출하고 다른 것은 노출하지 않음
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        입력란에 포커스 맞추기
      </button>
    </>
  );
}
```

</Sandpack>

여기서 `MyInput` 내부의 `realInputRef`는 실제 입력 DOM 노드를 보유합니다. 그러나 `useImperativeHandle`은 React에게 부모 컴포넌트에 ref 값으로 제공할 특별한 객체를 제공하도록 지시합니다. 따라서 `Form` 컴포넌트 내부의 `inputRef.current`는 `focus` 메서드만 갖게 됩니다. 이 경우, ref "핸들"은 DOM 노드가 아니라 `useImperativeHandle` 호출 내부에서 생성한 사용자 정의 객체입니다.

</DeepDive>

## React가 ref를 첨부하는 시점 {/*when-react-attaches-the-refs*/}

React에서는 모든 업데이트가 [두 단계](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)로 나뉩니다:

* **렌더링 동안**, React는 화면에 무엇이 있어야 하는지 알아내기 위해 컴포넌트를 호출합니다.
* **커밋 동안**, React는 DOM에 변경 사항을 적용합니다.

일반적으로, 렌더링 중에 ref에 접근하지 [않는 것이 좋습니다](/learn/referencing-values-with-refs#best-practices-for-refs). 이는 DOM 노드를 보유한 ref에도 해당됩니다. 첫 번째 렌더링 동안
에는 DOM 노드가 아직 생성되지 않았으므로 `ref.current`는 `null`입니다. 업데이트 렌더링 동안에는 DOM 노드가 아직 업데이트되지 않았습니다. 따라서 이를 읽기에는 너무 이릅니다.

React는 커밋 중에 `ref.current`를 설정합니다. DOM을 업데이트하기 전에 React는 영향을 받는 `ref.current` 값을 `null`로 설정합니다. DOM을 업데이트한 후, React는 즉시 이를 해당 DOM 노드로 설정합니다.

**일반적으로, 이벤트 핸들러에서 ref에 접근하게 됩니다.** ref로 무언가를 하고 싶지만 특정 이벤트가 없는 경우, Effect가 필요할 수 있습니다. 다음 페이지에서 Effect에 대해 논의할 것입니다.

<DeepDive>

#### flushSync로 상태 업데이트를 동기적으로 플러시하기 {/*flushing-state-updates-synchronously-with-flush-sync*/}

다음과 같은 코드를 고려해 보세요. 이 코드는 새로운 할 일을 추가하고 목록의 마지막 자식으로 화면을 스크롤합니다. 어떤 이유로 항상 마지막으로 추가된 할 일 바로 전에 있는 할 일로 스크롤됩니다:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        추가
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: '할 일 #' + (i + 1)
  });
}
```

</Sandpack>

문제는 이 두 줄에 있습니다:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React에서는 [상태 업데이트가 큐에 저장됩니다.](/learn/queueing-a-series-of-state-updates) 일반적으로 이는 원하는 동작입니다. 그러나 여기서는 `setTodos`가 DOM을 즉시 업데이트하지 않기 때문에 문제가 발생합니다. 따라서 목록을 마지막 요소로 스크롤할 때, 할 일이 아직 추가되지 않았습니다. 이로 인해 스크롤이 항상 한 항목씩 "뒤처집니다".

이 문제를 해결하려면 React가 DOM을 동기적으로 업데이트하도록 강제할 수 있습니다. 이를 위해 `react-dom`에서 `flushSync`를 가져오고 **상태 업데이트를 `flushSync` 호출로 래핑**합니다:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

이렇게 하면 `flushSync`로 래핑된 코드가 실행된 직후 React가 DOM을 동기적으로 업데이트하도록 지시합니다. 결과적으로 마지막 할 일이 스크롤하려고 할 때 이미 DOM에 있게 됩니다:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        추가
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: '할 일 #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## ref를 사용한 DOM 조작의 모범 사례 {/*best-practices-for-dom-manipulation-with-refs*/}

Ref는 탈출구입니다. "React 외부로 나가야 할 때"만 사용해야 합니다. 일반적인 예로는 포커스 관리, 스크롤 위치 관리 또는 React가 노출하지 않는 브라우저 API 호출이 있습니다.

포커싱 및 스크롤링과 같은 비파괴적인 작업에만 집중하면 문제가 발생하지 않습니다. 그러나 DOM을 수동으로 **수정**하려고 하면 React가 수행하는 변경 사항과 충돌할 위험이 있습니다.

이 문제를 설명하기 위해, 이 예제에는 환영 메시지와 두 개의 버튼이 포함되어 있습니다. 첫 번째 버튼은 [조건부 렌더링](/learn/conditional-rendering) 및 [상태](/learn/state-a-components-memory)를 사용하여 메시지의 존재를 토글합니다. 두 번째 버튼은 [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)를 사용하여 React의 제어 외부에서 강제로 제거합니다.

"setState로 토글"을 몇 번 눌러보세요. 메시지가 사라졌다가 다시 나타나야 합니다. 그런 다음 "DOM에서 제거"를 누릅니다. 이는 강제로 제거합니다. 마지막으로 "setState로 토글"을 누릅니다:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        setState로 토글
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        DOM에서 제거
      </button>
      {show && <p ref={ref}>안녕하세요</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

DOM 요소를 수동으로 제거한 후, `setState`를 사용하여 다시 표시하려고 하면 충돌이 발생합니다. 이는 DOM을 변경했기 때문에 React가 이를 올바르게 관리하는 방법을 알지 못하기 때문입니다.

**React가 관리하는 DOM 노드를 변경하지 마세요.** React가 관리하는 요소의 자식을 수정, 추가 또는 제거하면 위와 같은 일관성 없는 시각적 결과나 충돌이 발생할 수 있습니다.

그러나 이는 전혀 할 수 없다는 의미는 아닙니다. 주의가 필요합니다. **React가 업데이트할 이유가 없는 DOM 부분을 안전하게 수정할 수 있습니다.** 예를 들어, JSX에서 항상 비어 있는 `<div>`가 있다면, React는 자식 목록을 건드릴 이유가 없습니다. 따라서 수동으로 요소를 추가하거나 제거하는 것이 안전합니다.

<Recap>

- Ref는 일반적인 개념이지만, 대부분 DOM 요소를 보유하는 데 사용됩니다.
- `<div ref={myRef}>`를 전달하여 React에게 DOM 노드를 `myRef.current`에 넣으라고 지시합니다.
- 일반적으로 포커싱, 스크롤링 또는 DOM 요소 측정과 같은 비파괴적인 작업에 ref를 사용합니다.
- 컴포넌트는 기본적으로 DOM 노드를 노출하지 않습니다. `forwardRef`를 사용하고 두 번째 `ref` 인수를 특정 노드로 전달하여 DOM 노드를 노출하도록 옵트인할 수 있습니다.
- React가 관리하는 DOM 노드를 변경하지 마세요.
- React가 관리하는 DOM 노드를 수정하는 경우, React가 업데이트할 이유가 없는 부분을 수정하세요.

</Recap>

<Challenges>

#### 비디오 재생 및 일시 정지 {/*play-and-pause-the-video*/}

이 예제에서 버튼은 재생 및 일시 정지 상태를 전환하는 상태 변수를 토글합니다. 그러나 실제로 비디오를 재생하거나 일시 정지하려면 상태를 토글하는 것만으로는 충분하지 않습니다. `<video>` DOM 요소에 대해 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)를 호출해야 합니다. ref를 추가하고 버튼을 작동시키세요.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? '일시 정지' : '재생'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

추가 도전 과제로, 사용자가 비디오를 마우스 오른쪽 버튼으로 클릭하고 내장된 브라우저 미디어 컨트롤을 사용하여 재생하더라도 "재생" 버튼이 비디오 재생 여부와 동기화되도록 유지하세요. 이를 위해 비디오에서 `onPlay` 및 `onPause`를 듣고 싶을 것입니다.

<Solution>

ref를 선언하고 `<video>` 요소에 전달합니다. 그런 다음 이벤트 핸들러에서 다음 상태에 따라 `ref.current.play()` 및 `ref.current.pause()`를 호출합니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? '일시 정지' : '재생'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

내장된 브라우저 컨트롤을 처리하려면, `<video>` 요소에 `onPlay` 및 `onPause` 핸들러를 추가하고 `setIsPlaying`을 호출합니다. 이렇게 하면 사용자가 브라우저 컨트롤을 사용하여 비디오를 재생하더라도 상태가 적절히 조정됩니다.

</Solution>

#### 검색 필드에 포커스 맞추기 {/*focus-the-search-field*/}

"검색" 버튼을 클릭하면 필드에 포커스가 맞춰지도록 만드세요.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>검색</button>
      </nav>
      <input
        placeholder="무엇을 찾고 있나요?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

입력란에 ref를 추가하고, DOM 노드에 포커스를 맞추기 위해 `focus()`를 호출합니다:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          검색
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="무엇을 찾고 있나요?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### 이미지 캐러셀 스크롤하기 {/*scrolling-an-image-carousel*/}

이 이미지 캐러셀에는 활성 이미지를 전환하는 "다음" 버튼이 있습니다. 클릭 시 갤러리가 활성 이미지로 수평 스크롤되도록 만드세요. 활성 이미지의 DOM 노드에서 [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)를 호출하고 싶을 것입니다:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

이 연습을 위해 모든 이미지에 ref를 가질 필요는 없습니다. 현재 활성 이미지나 목록 자체에 ref를 가지는 것으로 충분합니다. `flushSync`를 사용하여 스크롤하기 전에 DOM이 업데이트되도록 보장하세요.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          다음
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    '활성화' :
                    ''
                }
                src={cat.imageUrl}
                alt={'고양이 #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

`selectedRef`를 선언하고, 현재 이미지에만 조건부로 전달합니다:

```js
<li ref={index === i ? selectedRef : null}>
```

`index === i`일 때, 즉 이미지가 선택된 경우, `<li>`는 `selectedRef`를 받습니다. React는 `selectedRef.current`가 항상 올바른 DOM 노드를 가리키도록 보장합니다.

`flushSync` 호출은 React가 스크롤하기 전에 DOM을 업데이트하도록 강제하기 위해 필요합니다. 그렇지 않으면 `selectedRef.current`는 항상 이전에 선택된 항목을 가리키게 됩니다.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          다음
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    '활성화'
                    : ''
                }
                src={cat.imageUrl}
                alt={'고양이 #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### 별도의 컴포넌트로 검색 필드에 포커스 맞추기 {/*focus-the-search-field-with-separate-components*/}

"검색" 버튼을 클릭하면 필드에 포커스가 맞춰지도록 만드세요. 각 컴포넌트는 별도의 파일에 정의되어 있으며, 이동하지 않아야 합니다. 어떻게 연결할 수 있을까요?

<Hint>

`SearchInput`과 같은 자신의 컴포넌트에서 DOM 노드를 노출하도록 옵트인하려면 `forwardRef`가 필요합니다.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      검색
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="무엇을 찾고 있나요?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

`SearchButton`에 `onClick` prop을 추가하고, `SearchButton`이 이를 브라우저 `<button>`에 전달하도록 만듭니다. 또한 ref를 `<SearchInput>`에 전달하고, 이를 실제 `<input>`에 전달하여 채웁니다. 마지막으로, 클릭 핸들러에서 해당 ref에 저장된 DOM 노드에 `focus`를 호출합니다.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      검색
    </button>
  );
}
```

```js src/SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="무엇을 찾고 있나요?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>