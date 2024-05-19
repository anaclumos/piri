---
title: render
---

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다.

React 18에서는 `render`가 [`createRoot`](/reference/react-dom/client/createRoot)로 대체되었습니다. React 18에서 `render`를 사용하면 앱이 React 17에서 실행되는 것처럼 동작할 것이라는 경고가 표시됩니다. 자세한 내용은 [여기](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)에서 확인하세요.

</Deprecated>

<Intro>

`render`는 [JSX](/learn/writing-markup-with-jsx) ("React 노드")의 일부를 브라우저 DOM 노드에 렌더링합니다.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

`render`를 호출하여 React 컴포넌트를 브라우저 DOM 요소 안에 표시합니다.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React는 `domNode`에 `<App />`을 표시하고, 그 안의 DOM 관리를 맡습니다.

React로 완전히 구축된 앱은 일반적으로 루트 컴포넌트와 함께 하나의 `render` 호출만 가집니다. 페이지의 일부에 React를 사용하는 경우 필요한 만큼 많은 `render` 호출을 가질 수 있습니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: 표시하려는 *React 노드*. 일반적으로 `<App />`과 같은 JSX 조각이지만, [`createElement()`](/reference/react/createElement)로 생성된 React 요소, 문자열, 숫자, `null`, 또는 `undefined`를 전달할 수도 있습니다.

* `domNode`: [DOM 요소.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React는 이 DOM 요소 안에 전달된 `reactNode`를 표시합니다. 이 시점부터 React는 `domNode` 안의 DOM을 관리하고 React 트리가 변경될 때 업데이트합니다.

* **optional** `callback`: 함수. 전달된 경우, React는 컴포넌트가 DOM에 배치된 후 이 함수를 호출합니다.

#### Returns {/*returns*/}

`render`는 일반적으로 `null`을 반환합니다. 그러나 전달된 `reactNode`가 *클래스 컴포넌트*인 경우 해당 컴포넌트의 인스턴스를 반환합니다.

#### Caveats {/*caveats*/}

* React 18에서는 `render`가 [`createRoot`](/reference/react-dom/client/createRoot)로 대체되었습니다. React 18 이상에서는 `createRoot`를 사용하세요.

* 처음 `render`를 호출할 때, React는 React 컴포넌트를 렌더링하기 전에 `domNode` 안의 기존 HTML 콘텐츠를 모두 지웁니다. `domNode`에 서버나 빌드 중에 생성된 HTML이 포함된 경우, 기존 HTML에 이벤트 핸들러를 연결하는 [`hydrate()`](/reference/react-dom/hydrate)를 대신 사용하세요.

* 동일한 `domNode`에 대해 `render`를 여러 번 호출하면 React는 전달된 최신 JSX를 반영하도록 DOM을 업데이트합니다. React는 이전에 렌더링된 트리와 ["매칭하여"](/learn/preserving-and-resetting-state) DOM의 어느 부분을 재사용할 수 있고 어느 부분을 다시 생성해야 하는지 결정합니다. 동일한 `domNode`에 대해 다시 `render`를 호출하는 것은 루트 컴포넌트에서 [`set` 함수](/reference/react/useState#setstate)를 호출하는 것과 유사합니다: React는 불필요한 DOM 업데이트를 피합니다.

* 앱이 완전히 React로 구축된 경우, 앱에서 하나의 `render` 호출만 있을 가능성이 큽니다. (프레임워크를 사용하는 경우, 프레임워크가 이 호출을 대신할 수 있습니다.) 컴포넌트의 자식이 아닌 DOM 트리의 다른 부분에 JSX 조각을 렌더링하려면 (예: 모달이나 툴팁) `render` 대신 [`createPortal`](/reference/react-dom/createPortal)을 사용하세요.

---

## Usage {/*usage*/}

`render`를 호출하여 <CodeStep step={1}>React 컴포넌트</CodeStep>를 <CodeStep step={2}>브라우저 DOM 노드</CodeStep> 안에 표시합니다.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### Rendering the root component {/*rendering-the-root-component*/}

React로 완전히 구축된 앱에서는 **일반적으로 시작 시 한 번만** "루트" 컴포넌트를 렌더링합니다.

<Sandpack>

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

일반적으로 `render`를 다시 호출하거나 더 많은 곳에서 호출할 필요는 없습니다. 이 시점부터 React는 애플리케이션의 DOM을 관리합니다. UI를 업데이트하려면 컴포넌트가 [상태를 사용](/reference/react/useState)할 것입니다.

---

### Rendering multiple roots {/*rendering-multiple-roots*/}

페이지가 [완전히 React로 구축되지 않은 경우](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), React가 관리하는 UI의 최상위 조각마다 `render`를 호출합니다.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

[`unmountComponentAtNode()`](/reference/react-dom/unmountComponentAtNode)로 렌더링된 트리를 제거할 수 있습니다.

---

### Updating the rendered tree {/*updating-the-rendered-tree*/}

동일한 DOM 노드에서 `render`를 여러 번 호출할 수 있습니다. 컴포넌트 트리 구조가 이전에 렌더링된 것과 일치하는 한, React는 [상태를 유지](/learn/preserving-and-resetting-state)합니다. 입력란에 입력할 수 있는 것을 확인해보세요. 이는 매 초마다 반복되는 `render` 호출의 업데이트가 파괴적이지 않음을 의미합니다:

<Sandpack>

```js src/index.js active
import { render } from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

`render`를 여러 번 호출하는 것은 드문 일입니다. 일반적으로 컴포넌트 내부에서 [상태를 업데이트](/reference/react/useState)할 것입니다.