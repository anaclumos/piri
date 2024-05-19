---
title: unmountComponentAtNode
---

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다.

React 18에서는 `unmountComponentAtNode`가 [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)로 대체되었습니다.

</Deprecated>

<Intro>

`unmountComponentAtNode`는 DOM에서 마운트된 React 컴포넌트를 제거합니다.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

`unmountComponentAtNode`를 호출하여 DOM에서 마운트된 React 컴포넌트를 제거하고, 해당 컴포넌트의 이벤트 핸들러와 상태를 정리합니다.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: [DOM 요소.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React는 이 요소에서 마운트된 React 컴포넌트를 제거합니다.

#### Returns {/*returns*/}

`unmountComponentAtNode`는 컴포넌트가 언마운트되면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

---

## Usage {/*usage*/}

`unmountComponentAtNode`를 호출하여 <CodeStep step={1}>마운트된 React 컴포넌트</CodeStep>를 <CodeStep step={2}>브라우저 DOM 노드</CodeStep>에서 제거하고, 해당 컴포넌트의 이벤트 핸들러와 상태를 정리합니다.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### DOM 요소에서 React 앱 제거하기 {/*removing-a-react-app-from-a-dom-element*/}

때때로 기존 페이지나 React로 완전히 작성되지 않은 페이지에 React를 "뿌리고" 싶을 때가 있습니다. 이러한 경우, React 앱을 "중지"하여 렌더링된 DOM 노드에서 모든 UI, 상태 및 리스너를 제거해야 할 수도 있습니다.

이 예제에서는 "Render React App"을 클릭하면 React 앱이 렌더링됩니다. "Unmount React App"을 클릭하여 이를 제거합니다:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>