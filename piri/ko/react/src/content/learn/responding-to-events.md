---
title: 이벤트에 응답하기
---

<Intro>

React는 JSX에 *이벤트 핸들러*를 추가할 수 있게 해줍니다. 이벤트 핸들러는 클릭, 호버링, 폼 입력 포커싱 등과 같은 상호작용에 응답하여 트리거되는 사용자 정의 함수입니다.

</Intro>

<YouWillLearn>

* 이벤트 핸들러를 작성하는 다양한 방법
* 부모 컴포넌트에서 이벤트 처리 로직을 전달하는 방법
* 이벤트가 전파되는 방식과 이를 중지하는 방법

</YouWillLearn>

## 이벤트 핸들러 추가하기 {/*adding-event-handlers*/}

이벤트 핸들러를 추가하려면 먼저 함수를 정의한 다음 해당 JSX 태그에 [prop으로 전달](/learn/passing-props-to-a-component)합니다. 예를 들어, 여기에 아직 아무것도 하지 않는 버튼이 있습니다:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

사용자가 클릭할 때 메시지를 표시하려면 다음 세 단계를 따르세요:

1. `Button` 컴포넌트 *내부에* `handleClick`이라는 함수를 선언합니다.
2. 해당 함수 내부에 로직을 구현합니다 (`alert`를 사용하여 메시지를 표시).
3. `<button>` JSX에 `onClick={handleClick}`를 추가합니다.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

`handleClick` 함수를 정의한 다음 [prop으로 전달](/learn/passing-props-to-a-component)하여 `<button>`에 전달했습니다. `handleClick`은 **이벤트 핸들러**입니다. 이벤트 핸들러 함수는:

* 보통 컴포넌트 *내부에* 정의됩니다.
* `handle`로 시작하고 이벤트 이름이 뒤따르는 이름을 가집니다.

관례상, 이벤트 핸들러는 `handle` 뒤에 이벤트 이름을 붙여서 명명하는 것이 일반적입니다. `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` 등을 자주 볼 수 있습니다.

또한, JSX에서 인라인으로 이벤트 핸들러를 정의할 수도 있습니다:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

또는, 화살표 함수를 사용하여 더 간결하게 작성할 수 있습니다:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

이 모든 스타일은 동일합니다. 인라인 이벤트 핸들러는 짧은 함수에 편리합니다.

<Pitfall>

이벤트 핸들러에 전달되는 함수는 호출되지 않고 전달되어야 합니다. 예를 들어:

| 함수를 전달 (올바름)               | 함수를 호출 (잘못됨)               |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

차이는 미묘합니다. 첫 번째 예에서는 `handleClick` 함수가 `onClick` 이벤트 핸들러로 전달됩니다. 이는 React에게 사용자가 버튼을 클릭할 때만 함수를 호출하도록 지시합니다.

두 번째 예에서는 `handleClick()` 끝의 `()`가 [렌더링](/learn/render-and-commit) 중에 함수를 *즉시* 실행합니다. 이는 [JSX `{`와 `}`](/learn/javascript-in-jsx-with-curly-braces) 내부의 JavaScript가 즉시 실행되기 때문입니다.

인라인으로 코드를 작성할 때도 동일한 문제가 발생합니다:

| 함수를 전달 (올바름)                     | 함수를 호출 (잘못됨)                |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

이와 같이 인라인 코드를 전달하면 클릭 시 실행되지 않고 컴포넌트가 렌더링될 때마다 실행됩니다:

```jsx
// 이 alert는 컴포넌트가 렌더링될 때 실행되며, 클릭 시 실행되지 않습니다!
<button onClick={alert('You clicked me!')}>
```

이벤트 핸들러를 인라인으로 정의하려면 다음과 같이 익명 함수로 감싸세요:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

이렇게 하면 매번 렌더링 시 코드를 실행하는 대신 나중에 호출할 함수를 생성합니다.

두 경우 모두 전달해야 하는 것은 함수입니다:

* `<button onClick={handleClick}>`는 `handleClick` 함수를 전달합니다.
* `<button onClick={() => alert('...')}>`는 `() => alert('...')` 함수를 전달합니다.

[화살표 함수에 대해 더 읽어보세요.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### 이벤트 핸들러에서 props 읽기 {/*reading-props-in-event-handlers*/}

이벤트 핸들러는 컴포넌트 내부에 선언되기 때문에 컴포넌트의 props에 접근할 수 있습니다. 여기에 클릭 시 `message` prop과 함께 alert를 표시하는 버튼이 있습니다:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

이렇게 하면 두 버튼이 다른 메시지를 표시할 수 있습니다. 전달된 메시지를 변경해 보세요.

### 이벤트 핸들러를 props로 전달하기 {/*passing-event-handlers-as-props*/}

종종 부모 컴포넌트가 자식의 이벤트 핸들러를 지정하고 싶을 때가 있습니다. 예를 들어, `Button` 컴포넌트를 사용하는 위치에 따라 다른 함수를 실행하고 싶을 수 있습니다. 예를 들어, 하나는 영화를 재생하고 다른 하나는 이미지를 업로드합니다.

이를 위해, 부모 컴포넌트에서 받은 prop을 이벤트 핸들러로 전달합니다:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

여기서 `Toolbar` 컴포넌트는 `PlayButton`과 `UploadButton`을 렌더링합니다:

- `PlayButton`은 `handlePlayClick`을 `Button` 내부의 `onClick` prop으로 전달합니다.
- `UploadButton`은 `() => alert('Uploading!')`을 `Button` 내부의 `onClick` prop으로 전달합니다.

마지막으로, `Button` 컴포넌트는 `onClick`이라는 prop을 받아서 내장된 브라우저 `<button>`에 `onClick={onClick}`으로 전달합니다. 이는 React에게 클릭 시 전달된 함수를 호출하도록 지시합니다.

[디자인 시스템](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)을 사용하는 경우, 버튼과 같은 컴포넌트는 스타일링을 포함하지만 동작을 지정하지 않는 것이 일반적입니다. 대신, `PlayButton`과 `UploadButton`과 같은 컴포넌트가 이벤트 핸들러를 전달합니다.

### 이벤트 핸들러 props 명명하기 {/*naming-event-handler-props*/}

`<button>` 및 `<div>`와 같은 내장 컴포넌트는 `onClick`과 같은 [브라우저 이벤트 이름](/reference/react-dom/components/common#common-props)만 지원합니다. 그러나 자신만의 컴포넌트를 만들 때는 이벤트 핸들러 props의 이름을 원하는 대로 지정할 수 있습니다.

관례상, 이벤트 핸들러 props는 `on`으로 시작하고 대문자로 시작하는 것이 좋습니다.

예를 들어, `Button` 컴포넌트의 `onClick` prop은 `onSmash`라고 불릴 수 있습니다:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

이 예제에서 `<button onClick={onSmash}>`는 브라우저 `<button>`(소문자)이 여전히 `onClick`이라는 prop을 필요로 하지만, 사용자 정의 `Button` 컴포넌트가 받는 prop 이름은 여러분이 결정할 수 있음을 보여줍니다!

컴포넌트가 여러 상호작용을 지원하는 경우, 앱별 개념에 맞게 이벤트 핸들러 props를 명명할 수 있습니다. 예를 들어, 이 `Toolbar` 컴포넌트는 `onPlayMovie`와 `onUploadImage` 이벤트 핸들러를 받습니다:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

`App` 컴포넌트는 `Toolbar`가 `onPlayMovie` 또는 `onUploadImage`를 어떻게 처리할지 알 필요가 없습니다. 이는 `Toolbar`의 구현 세부 사항입니다. 여기서 `Toolbar`는 이를 `Button`의 `onClick` 핸들러로 전달하지만, 나중에 키보드 단축키로도 트리거할 수 있습니다. `onPlayMovie`와 같은 앱별 상호작용 이름으로 props를 명명하면 나중에 사용 방법을 변경할 수 있는 유연성을 제공합니다.

<Note>

이벤트 핸들러에 적절한 HTML 태그를 사용해야 합니다. 예를 들어, 클릭을 처리하려면 [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)를 사용하고 `<div onClick={handleClick}>`를 사용하지 마세요. 실제 브라우저 `<button>`을 사용하면 키보드 탐색과 같은 내장 브라우저 동작을 사용할 수 있습니다. 버튼의 기본 브라우저 스타일이 마음에 들지 않고 링크나 다른 UI 요소처럼 보이게 만들고 싶다면 CSS로 이를 구현할 수 있습니다. [접근 가능한 마크업 작성에 대해 더 알아보세요.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

</Note>

## 이벤트 전파 {/*event-propagation*/}

이벤트 핸들러는 컴포넌트가 가질 수 있는 모든 자식의 이벤트도 잡아냅니다. 이벤트가 트리 위로 "버블링" 또는 "전파"된다고 말합니다: 이벤트가 발생한 곳에서 시작하여 트리 위로 올라갑니다.

이 `<div>`는 두 개의 버튼을 포함합니다. `<div>`와 각 버튼 모두 자체 `onClick` 핸들러를 가지고 있습니다. 버튼을 클릭하면 어떤 핸들러가 실행될 것 같습니까?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

버튼을 클릭하면 해당 버튼의 `onClick`이 먼저 실행되고, 그 다음 부모 `<div>`의 `onClick`이 실행됩니다. 따라서 두 개의 메시지가 나타납니다. 툴바 자체를 클릭하면 부모 `<div>`의 `onClick`만 실행됩니다.

<Pitfall>

React에서는 `onScroll`을 제외한 모든 이벤트가 전파됩니다. `onScroll`은 첨부된 JSX 태그에서만 작동합니다.

</Pitfall>

### 전파 중지하기 {/*stopping-propagation*/}

이벤트 핸들러는 **이벤트 객체**를 유일한 인수로 받습니다. 관례상, 이는 보통 "event"의 약자인 `e`라고 불립니다. 이 객체를 사용하여 이벤트에 대한 정보를 읽을 수 있습니다.

이 이벤트 객체를 사용하여 전파를 중지할 수도 있습니다. 이벤트가 부모 컴포넌트에 도달하지 않도록 하려면 `e.stopPropagation()`을 호출해야 합니다. 다음 `Button` 컴포넌트가 이를 수행합니다:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

버튼을 클릭하면:

1. React는 `<button>`에 전달된 `onClick` 핸들러를 호출합니다.
2. `Button`에서 정의된 해당 핸들러는 다음을 수행합니다:
   * `e.stopPropagation()`을 호출하여 이벤트가 더 이상 전파되지 않도록 합니다.
   * `Toolbar` 컴포넌트에서 전달된 prop인 `onClick` 함수를 호출합니다.
3. `Toolbar` 컴포넌트에서 정의된 해당 함수는 버튼의 자체 alert를 표시합니다.
4. 전파가 중지되었기 때문에 부모 `<div>`의 `onClick` 핸들러는 실행되지 않습니다.

`e.stopPropagation()`의 결과로, 이제 버튼을 클릭하면 두 개의 alert(버튼과 부모 툴바 `<div>`에서 발생하는 alert) 대신 단일 alert만 표시됩니다. 버튼을 클릭하는 것은 주변 툴바를 클릭하는 것과 같지 않으므로, 이 UI에서는 전파를 중지하는 것이 합리적입니다.

<DeepDive>

#### 캡처 단계 이벤트 {/*capture-phase-events*/}

드물게, 전파를 중지한 이벤트도 자식 요소의 모든 이벤트를 잡아야 할 때가 있습니다. 예를 들어, 전파 논리와 상관없이 모든 클릭을 분석에 기록하고 싶을 수 있습니다. 이를 위해 이벤트 이름 끝에 `Capture`를 추가합니다:

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

각 이벤트는 세 단계로 전파됩니다:

1. 아래로 이동하여 모든 `onClickCapture` 핸들러를 호출합니다.
2. 클릭된 요소의 `onClick` 핸들러를 실행합니다.
3. 위로 이동하여 모든 `onClick` 핸들러를 호출합니다.

캡처 이벤트는 라우터나 분석과 같은 코드에 유용하지만, 앱 코드에서는 거의 사용하지 않을 것입니다.

</DeepDive>

### 전파의 대안으로 핸들러 전달하기 {/*passing-handlers-as-alternative-to-propagation*/}

이 클릭 핸들러가 한 줄의 코드를 실행한 *후* 부모가 전달한 `onClick` prop을 호출하는 방식을 주목하세요:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

이 핸들러에 더 많은 코드를 추가한 후 부모 `onClick` 이벤트 핸들러를 호출할 수도 있습니다. 이 패턴은 전파에 대한 *대안*을 제공합니다. 자식 컴포넌트가 이벤트를 처리하면서도 부모 컴포넌트가 추가 동작을 지정할 수 있게 합니다. 전파와 달리 자동으로 실행되지 않습니다. 그러나 이 패턴의 장점은 어떤 이벤트의 결과로 실행되는 전체 코드 체인을 명확하게 따라갈 수 있다는 점입니다.

전파에 의존하고 어떤 핸들러가 실행되고 왜 실행되는지 추적하기 어려운 경우, 대신 이 접근 방식을 시도해 보세요.

### 기본 동작 방지하기 {/*preventing-default-behavior*/}

일부 브라우저 이벤트는 기본 동작이있습니다. 예를 들어, `<form>` 제출 이벤트는 내부의 버튼이 클릭될 때 기본적으로 전체 페이지를 다시 로드합니다:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

이렇게 하지 않도록 하려면 이벤트 객체에서 `e.preventDefault()`를 호출하세요:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

`e.stopPropagation()`과 `e.preventDefault()`를 혼동하지 마세요. 둘 다 유용하지만 관련이 없습니다:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)은 상위 태그에 첨부된 이벤트 핸들러가 실행되지 않도록 합니다.
* [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault)는 몇 가지 이벤트에 대한 기본 브라우저 동작을 방지합니다.

## 이벤트 핸들러가 부작용을 가질 수 있나요? {/*can-event-handlers-have-side-effects*/}

물론입니다! 이벤트 핸들러는 부작용을 처리하기에 가장 좋은 장소입니다.

렌더링 함수와 달리, 이벤트 핸들러는 [순수할](/learn/keeping-components-pure) 필요가 없으므로, 무언가를 *변경*하기에 좋은 장소입니다. 예를 들어, 입력 값이 변경되거나 버튼을 눌러 목록을 변경하는 등의 작업을 할 수 있습니다. 그러나 정보를 변경하려면 먼저 이를 저장할 방법이 필요합니다. React에서는 이를 [상태, 컴포넌트의 메모리](/learn/state-a-components-memory)를 사용하여 수행합니다. 다음 페이지에서 이에 대해 자세히 배울 것입니다.

<Recap>

* `<button>`과 같은 요소에 함수를 prop으로 전달하여 이벤트를 처리할 수 있습니다.
* 이벤트 핸들러는 호출되지 않고 **전달**되어야 합니다! `onClick={handleClick}`, `onClick={handleClick()}`가 아닙니다.
* 이벤트 핸들러 함수를 별도로 또는 인라인으로 정의할 수 있습니다.
* 이벤트 핸들러는 컴포넌트 내부에 정의되므로 props에 접근할 수 있습니다.
* 부모에서 이벤트 핸들러를 선언하고 자식에게 prop으로 전달할 수 있습니다.
* 애플리케이션별 이름으로 자체 이벤트 핸들러 props를 정의할 수 있습니다.
* 이벤트는 위로 전파됩니다. 첫 번째 인수에서 `e.stopPropagation()`을 호출하여 이를 방지할 수 있습니다.
* 이벤트에는 원치 않는 기본 브라우저 동작이 있을 수 있습니다. 이를 방지하려면 `e.preventDefault()`를 호출하세요.
* 자식 핸들러에서 이벤트 핸들러 prop을 명시적으로 호출하는 것은 전파에 대한 좋은 대안입니다.

</Recap>

<Challenges>

#### 이벤트 핸들러 수정하기 {/*fix-an-event-handler*/}

이 버튼을 클릭하면 페이지 배경이 흰색과 검은색 사이에서 전환되어야 합니다. 그러나 클릭해도 아무 일도 일어나지 않습니다. 문제를 해결하세요. (`handleClick` 내부의 로직은 신경 쓰지 마세요. 그 부분은 괜찮습니다.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

문제는 `<button onClick={handleClick()}>`가 `handleClick` 함수를 렌더링 중에 _호출_하는 대신 _전달_한다는 점입니다. `()` 호출을 제거하여 `<button onClick={handleClick}>`로 변경하면 문제가 해결됩니다:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

또는, 호출을 다른 함수로 감싸서 `<button onClick={() => handleClick()}>`로 작성할 수도 있습니다:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### 이벤트 연결하기 {/*wire-up-the-events*/}

이 `ColorSwitch` 컴포넌트는 버튼을 렌더링합니다. 버튼을 클릭하면 페이지 색상이 변경되어야 합니다. 버튼을 클릭하면 색상이 변경되도록 `onChangeColor` 이벤트 핸들러 prop에 연결하세요.

이 작업을 완료한 후, 버튼을 클릭하면 페이지 클릭 카운터도 증가하는 것을 확인하세요. 부모 컴포넌트를 작성한 동료는 `onChangeColor`가 카운터를 증가시키지 않는다고 주장합니다. 무엇이 문제일 수 있을까요? 버튼을 클릭하면 색상만 변경되고 카운터는 증가하지 않도록 수정하세요.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

먼저, `<button onClick={onChangeColor}>`와 같이 이벤트 핸들러를 추가해야 합니다.

그러나, 이는 카운터 증가 문제를 도입합니다. 동료가 주장한 대로 `onChangeColor`가 이를 수행하지 않는다면, 문제는 이 이벤트가 위로 전파되고, 상위 핸들러가 이를 수행한다는 것입니다. 이 문제를 해결하려면 전파를 중지해야 합니다. 그러나 `onChangeColor`를 호출하는 것을 잊지 마세요.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>