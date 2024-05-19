---
title: unmountComponentAtNode
---

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。

React 18では、`unmountComponentAtNode`は[`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)に置き換えられました。

</Deprecated>

<Intro>

`unmountComponentAtNode`は、マウントされたReactコンポーネントをDOMから削除します。

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

`unmountComponentAtNode`を呼び出して、マウントされたReactコンポーネントをDOMから削除し、そのイベントハンドラと状態をクリーンアップします。

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `domNode`: [DOM要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。Reactはこの要素からマウントされたReactコンポーネントを削除します。

#### 戻り値 {/*returns*/}

`unmountComponentAtNode`は、コンポーネントがアンマウントされた場合は`true`を、そうでない場合は`false`を返します。

---

## 使用法 {/*usage*/}

`unmountComponentAtNode`を呼び出して、<CodeStep step={1}>マウントされたReactコンポーネント</CodeStep>を<CodeStep step={2}>ブラウザのDOMノード</CodeStep>から削除し、そのイベントハンドラと状態をクリーンアップします。

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### ReactアプリをDOM要素から削除する {/*removing-a-react-app-from-a-dom-element*/}

時折、既存のページやReactで完全に書かれていないページにReactを「振りかける」ことがあるかもしれません。その場合、Reactアプリを「停止」し、レンダリングされたDOMノードからすべてのUI、状態、およびリスナーを削除する必要があります。

この例では、「Render React App」をクリックするとReactアプリがレンダリングされます。「Unmount React App」をクリックしてそれを破棄します：

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- これはReactアプリのノードです -->
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