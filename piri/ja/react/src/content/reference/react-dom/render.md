---
title: render
---

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。

React 18では、`render`は[`createRoot`](/reference/react-dom/client/createRoot)に置き換えられました。React 18で`render`を使用すると、アプリがReact 17を実行しているかのように動作するという警告が表示されます。詳細は[こちら](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)をご覧ください。

</Deprecated>

<Intro>

`render`は[JSX](/learn/writing-markup-with-jsx)（「Reactノード」）の一部をブラウザのDOMノードにレンダリングします。

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

`render`を呼び出して、ReactコンポーネントをブラウザのDOM要素内に表示します。

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

Reactは`domNode`に`<App />`を表示し、その内部のDOMの管理を引き継ぎます。

Reactで完全に構築されたアプリは通常、ルートコンポーネントで1回だけ`render`を呼び出します。ページの一部にReactを使用する場合は、必要に応じて複数の`render`呼び出しを行うことができます。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: 表示したい*Reactノード*。通常は`<App />`のようなJSXの一部ですが、[`createElement()`](/reference/react/createElement)で構築されたReact要素、文字列、数値、`null`、または`undefined`を渡すこともできます。

* `domNode`: [DOM要素。](https://developer.mozilla.org/en-US/docs/Web/API/Element) ReactはこのDOM要素内に渡された`reactNode`を表示します。この時点から、Reactは`domNode`内のDOMを管理し、Reactツリーが変更されると更新します。

* **オプション** `callback`: 関数。渡された場合、ReactはコンポーネントがDOMに配置された後にこの関数を呼び出します。

#### 戻り値 {/*returns*/}

`render`は通常`null`を返します。ただし、渡された`reactNode`が*クラスコンポーネント*の場合、そのコンポーネントのインスタンスを返します。

#### 注意点 {/*caveats*/}

* React 18では、`render`は[`createRoot`](/reference/react-dom/client/createRoot)に置き換えられました。React 18以降では`createRoot`を使用してください。

* 最初に`render`を呼び出すと、Reactは`domNode`内の既存のHTMLコンテンツをすべてクリアしてからReactコンポーネントをレンダリングします。`domNode`にサーバーまたはビルド中にReactによって生成されたHTMLが含まれている場合は、既存のHTMLにイベントハンドラをアタッチする[`hydrate()`](/reference/react-dom/hydrate)を使用してください。

* 同じ`domNode`に対して複数回`render`を呼び出すと、Reactは最新のJSXを反映するために必要なDOMの更新を行います。Reactは以前にレンダリングされたツリーと「一致させる」ことによって、どの部分のDOMを再利用し、どの部分を再作成する必要があるかを決定します。同じ`domNode`に再度`render`を呼び出すことは、ルートコンポーネントの[`set`関数](/reference/react/useState#setstate)を呼び出すのと似ています：Reactは不要なDOM更新を避けます。

* アプリが完全にReactで構築されている場合、アプリ内で`render`呼び出しは1回だけになることが多いです。（フレームワークを使用している場合、この呼び出しはフレームワークが行うかもしれません。）コンポーネントの子ではないDOMツリーの別の部分にJSXの一部をレンダリングしたい場合（例えば、モーダルやツールチップ）、`render`の代わりに[`createPortal`](/reference/react-dom/createPortal)を使用してください。

---

## 使用法 {/*usage*/}

`render`を呼び出して、<CodeStep step={1}>Reactコンポーネント</CodeStep>を<CodeStep step={2}>ブラウザのDOMノード</CodeStep>内に表示します。

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### ルートコンポーネントのレンダリング {/*rendering-the-root-component*/}

Reactで完全に構築されたアプリでは、**通常は起動時に1回だけ**これを行い、「ルート」コンポーネントをレンダリングします。

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

通常、再度`render`を呼び出したり、他の場所で呼び出す必要はありません。この時点から、ReactはアプリケーションのDOMを管理します。UIを更新するには、コンポーネント内で[状態を使用します。](/reference/react/useState)

---

### 複数のルートのレンダリング {/*rendering-multiple-roots*/}

ページが[完全にReactで構築されていない](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)場合、Reactによって管理されるUIのトップレベルの部分ごとに`render`を呼び出します。

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>この段落はReactによってレンダリングされていません（index.htmlを開いて確認してください）。</p>
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
      <h2>コメント</h2>
      <Comment text="こんにちは！" author="Sophie" />
      <Comment text="元気ですか？" author="Sunil" />
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

レンダリングされたツリーは[`unmountComponentAtNode()`](/reference/react-dom/unmountComponentAtNode)で破棄できます。

---

### レンダリングされたツリーの更新 {/*updating-the-rendered-tree*/}

同じDOMノードに対して複数回`render`を呼び出すことができます。コンポーネントツリーの構造が以前にレンダリングされたものと一致している限り、Reactは[状態を保持します。](/learn/preserving-and-resetting-state) 入力フィールドに入力できることに注目してください。これは、毎秒繰り返される`render`呼び出しの更新が破壊的でないことを意味します：

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
      <h1>こんにちは、世界！ {counter}</h1>
      <input placeholder="ここに何か入力してください" />
    </>
  );
}
```

</Sandpack>

複数回`render`を呼び出すことは一般的ではありません。通常は、コンポーネント内で[状態を更新](/reference/react/useState)します。