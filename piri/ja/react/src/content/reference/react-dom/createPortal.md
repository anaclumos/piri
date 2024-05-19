---
title: createPortal
---

<Intro>

`createPortal`を使用すると、子要素をDOMの別の部分にレンダリングできます。

```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

ポータルを作成するには、いくつかのJSXと、それがレンダリングされるべきDOMノードを渡して`createPortal`を呼び出します。

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>この子要素は親のdivに配置されます。</p>
  {createPortal(
    <p>この子要素はドキュメントのbodyに配置されます。</p>,
    document.body
  )}
</div>
```

[以下の例を参照してください。](#usage)

ポータルはDOMノードの物理的な配置のみを変更します。それ以外の点では、ポータルにレンダリングされたJSXは、それをレンダリングするReactコンポーネントの子ノードとして動作します。例えば、子要素は親ツリーによって提供されるコンテキストにアクセスでき、イベントはReactツリーに従って子から親へとバブルアップします。

#### パラメータ {/*parameters*/}

* `children`: Reactでレンダリングできるものなら何でも、例えば一片のJSX（例：`<div />`や`<SomeComponent />`）、[Fragment](/reference/react/Fragment)（`<>...</>`）、文字列や数値、またはそれらの配列。

* `domNode`: `document.getElementById()`などで返されるDOMノード。ノードは既に存在している必要があります。更新時に異なるDOMノードを渡すと、ポータルの内容が再作成されます。

* **オプション** `key`: ポータルの[キー](/learn/rendering-lists/#keeping-list-items-in-order-with-key)として使用される一意の文字列または数値。

#### 戻り値 {/*returns*/}

`createPortal`は、JSXに含めたり、Reactコンポーネントから返したりできるReactノードを返します。Reactがレンダリング出力でそれに遭遇すると、提供された`children`を提供された`domNode`内に配置します。

#### 注意点 {/*caveats*/}

* ポータルからのイベントはDOMツリーではなくReactツリーに従って伝播します。例えば、ポータル内をクリックし、ポータルが`<div onClick>`でラップされている場合、その`onClick`ハンドラが発火します。これが問題を引き起こす場合、ポータル内からイベントの伝播を停止するか、ポータル自体をReactツリーの上位に移動します。

---

## 使用法 {/*usage*/}

### DOMの別の部分にレンダリングする {/*rendering-to-a-different-part-of-the-dom*/}

*ポータル*を使用すると、コンポーネントの一部の子要素をDOMの別の場所にレンダリングできます。これにより、コンポーネントの一部がどのコンテナに入っていても「脱出」することができます。例えば、コンポーネントはモーダルダイアログやツールチップを表示し、ページの残りの部分の上部および外部に表示することができます。

ポータルを作成するには、<CodeStep step={1}>いくつかのJSX</CodeStep>と<CodeStep step={2}>それが配置されるべきDOMノード</CodeStep>を使用して`createPortal`の結果をレンダリングします。

```js [[1, 8, "<p>この子要素はドキュメントのbodyに配置されます。</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>この子要素は親のdivに配置されます。</p>
      {createPortal(
        <p>この子要素はドキュメントのbodyに配置されます。</p>,
        document.body
      )}
    </div>
  );
}
```

Reactは<CodeStep step={1}>渡されたJSX</CodeStep>のDOMノードを<CodeStep step={2}>提供されたDOMノード</CodeStep>内に配置します。

ポータルがなければ、2番目の`<p>`は親の`<div>`内に配置されますが、ポータルはそれを[`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)に「テレポート」しました。

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>この子要素は親のdivに配置されます。</p>
      {createPortal(
        <p>この子要素はドキュメントのbodyに配置されます。</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

2番目の段落が境界線のある親の`<div>`の外に視覚的に表示されることに注意してください。開発者ツールでDOM構造を検査すると、2番目の`<p>`が直接`<body>`に配置されたことがわかります。

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>この子要素は親のdivに配置されます。</p>
      </div>
    ...
  </div>
  <p>この子要素はドキュメントのbodyに配置されます。</p>
</body>
```

ポータルはDOMノードの物理的な配置のみを変更します。それ以外の点では、ポータルにレンダリングされたJSXは、それをレンダリングするReactコンポーネントの子ノードとして動作します。例えば、子要素は親ツリーによって提供されるコンテキストにアクセスでき、イベントはReactツリーに従って子から親へとバブルアップします。

---

### ポータルを使用してモーダルダイアログをレンダリングする {/*rendering-a-modal-dialog-with-a-portal*/}

ポータルを使用して、ページの残りの部分の上に浮かぶモーダルダイアログを作成できます。たとえダイアログを呼び出すコンポーネントが`overflow: hidden`やその他のスタイルを持つコンテナ内にあっても、影響を受けません。

この例では、2つのコンテナにモーダルダイアログを妨げるスタイルがありますが、ポータルにレンダリングされたものは影響を受けません。なぜなら、DOM内でモーダルが親のJSX要素内に含まれていないからです。

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        ポータルなしでモーダルを表示
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        ポータルを使用してモーダルを表示
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>私はモーダルダイアログです</div>
      <button onClick={onClose}>閉じる</button>
    </div>
  );
}
```

```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

ポータルを使用する際には、アプリがアクセシブルであることを確認することが重要です。例えば、ユーザーがポータル内外に自然にフォーカスを移動できるようにキーボードフォーカスを管理する必要があるかもしれません。

モーダルを作成する際には、[WAI-ARIAモーダル作成プラクティス](https://www.w3.org/WAI/ARIA/apg/#dialog_modal)に従ってください。コミュニティパッケージを使用する場合、それがアクセシブルであり、これらのガイドラインに従っていることを確認してください。

</Pitfall>

---

### 非ReactサーバーマークアップにReactコンポーネントをレンダリングする {/*rendering-react-components-into-non-react-server-markup*/}

ポータルは、ReactルートがReactで構築されていない静的またはサーバーレンダリングされたページの一部である場合に便利です。例えば、ページがRailsのようなサーバーフレームワークで構築されている場合、サイドバーなどの静的エリア内にインタラクティブなエリアを作成できます。複数の[別々のReactルート](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)を持つ場合と比較して、ポータルを使用すると、アプリを単一のReactツリーとして扱い、状態を共有しながらも異なる部分にレンダリングできます。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        これはサーバーの非Reactマークアップです
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>この部分はReactによってレンダリングされます</p>;
}

function SidebarContent() {
  return <p>この部分もReactによってレンダリングされます！</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### 非React DOMノードにReactコンポーネントをレンダリングする {/*rendering-react-components-into-non-react-dom-nodes*/}

ポータルを使用して、Reactの外部で管理されているDOMノードの内容を管理することもできます。例えば、非Reactの地図ウィジェットと統合し、ポップアップ内にReactコンテンツをレンダリングしたい場合です。これを行うには、レンダリングするDOMノードを格納するための`popupContainer`状態変数を宣言します。

```js
const [popupContainer, setPopupContainer] = useState(null);
```

サードパーティのウィジェットを作成する際に、ウィジェットによって返されるDOMノードを格納し、それにレンダリングできるようにします。

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

これにより、`popupContainer`が利用可能になったら、`createPortal`を使用してReactコンテンツをレンダリングできます。

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Reactからこんにちは！</p>,
      popupContainer
    )}
  </div>
);
```

ここに、試してみることができる完全な例があります。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Reactからこんにちは！</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>