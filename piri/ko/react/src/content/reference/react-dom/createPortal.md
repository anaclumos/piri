---
title: createPortal
---

<Intro>

`createPortal`을 사용하면 일부 자식을 DOM의 다른 부분에 렌더링할 수 있습니다.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

포털을 생성하려면 `createPortal`을 호출하고 일부 JSX와 렌더링할 DOM 노드를 전달합니다:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>이 자식은 부모 div에 배치됩니다.</p>
  {createPortal(
    <p>이 자식은 문서 본문에 배치됩니다.</p>,
    document.body
  )}
</div>
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

포털은 DOM 노드의 물리적 배치만 변경합니다. 그 외의 모든 면에서 포털에 렌더링된 JSX는 이를 렌더링하는 React 컴포넌트의 자식 노드로 작동합니다. 예를 들어, 자식은 부모 트리가 제공하는 컨텍스트에 접근할 수 있으며, 이벤트는 React 트리에 따라 자식에서 부모로 전파됩니다.

#### 매개변수 {/*parameters*/}

* `children`: React로 렌더링할 수 있는 모든 것, 예를 들어 JSX 조각 (예: `<div />` 또는 `<SomeComponent />`), [Fragment](/reference/react/Fragment) (`<>...</>`), 문자열 또는 숫자, 또는 이들의 배열.

* `domNode`: `document.getElementById()`가 반환하는 것과 같은 일부 DOM 노드. 노드는 이미 존재해야 합니다. 업데이트 중에 다른 DOM 노드를 전달하면 포털 내용이 다시 생성됩니다.

* **선택적** `key`: 포털의 [key](/learn/rendering-lists/#keeping-list-items-in-order-with-key)로 사용될 고유한 문자열 또는 숫자.

#### 반환값 {/*returns*/}

`createPortal`은 JSX에 포함되거나 React 컴포넌트에서 반환될 수 있는 React 노드를 반환합니다. React가 렌더링 출력에서 이를 만나면 제공된 `children`을 제공된 `domNode` 안에 배치합니다.

#### 주의사항 {/*caveats*/}

* 포털의 이벤트는 DOM 트리가 아닌 React 트리에 따라 전파됩니다. 예를 들어, 포털 내부를 클릭하고 포털이 `<div onClick>`으로 감싸져 있으면 해당 `onClick` 핸들러가 실행됩니다. 이로 인해 문제가 발생하면 포털 내부에서 이벤트 전파를 중지하거나 포털 자체를 React 트리 상위로 이동하세요.

---

## 사용법 {/*usage*/}

### DOM의 다른 부분에 렌더링하기 {/*rendering-to-a-different-part-of-the-dom*/}

*포털*을 사용하면 컴포넌트의 일부 자식을 DOM의 다른 위치에 렌더링할 수 있습니다. 이를 통해 컴포넌트의 일부가 포함된 컨테이너에서 "탈출"할 수 있습니다. 예를 들어, 컴포넌트는 모달 대화 상자나 툴팁을 표시할 수 있으며, 이는 페이지의 나머지 부분 위에 나타납니다.

포털을 생성하려면 <CodeStep step={1}>일부 JSX</CodeStep>와 <CodeStep step={2}>렌더링할 DOM 노드</CodeStep>를 사용하여 `createPortal`의 결과를 렌더링합니다:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>이 자식은 부모 div에 배치됩니다.</p>
      {createPortal(
        <p>이 자식은 문서 본문에 배치됩니다.</p>,
        document.body
      )}
    </div>
  );
}
```

React는 <CodeStep step={1}>전달된 JSX</CodeStep>의 DOM 노드를 <CodeStep step={2}>제공된 DOM 노드</CodeStep> 안에 배치합니다.

포털이 없으면 두 번째 `<p>`는 부모 `<div>` 안에 배치되겠지만, 포털은 이를 [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)로 "텔레포트"했습니다:

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>이 자식은 부모 div에 배치됩니다.</p>
      {createPortal(
        <p>이 자식은 문서 본문에 배치됩니다.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

두 번째 단락이 테두리가 있는 부모 `<div>` 외부에 시각적으로 나타나는 것을 확인하세요. 개발자 도구로 DOM 구조를 검사하면 두 번째 `<p>`가 `<body>`에 직접 배치된 것을 볼 수 있습니다:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>이 자식은 부모 div에 배치됩니다.</p>
      </div>
    ...
  </div>
  <p>이 자식은 문서 본문에 배치됩니다.</p>
</body>
```

포털은 DOM 노드의 물리적 배치만 변경합니다. 그 외의 모든 면에서 포털에 렌더링된 JSX는 이를 렌더링하는 React 컴포넌트의 자식 노드로 작동합니다. 예를 들어, 자식은 부모 트리가 제공하는 컨텍스트에 접근할 수 있으며, 이벤트는 여전히 React 트리에 따라 자식에서 부모로 전파됩니다.

---

### 포털을 사용하여 모달 대화 상자 렌더링하기 {/*rendering-a-modal-dialog-with-a-portal*/}

포털을 사용하여 페이지의 나머지 부분 위에 떠 있는 모달 대화 상자를 만들 수 있습니다. 이는 대화 상자를 호출하는 컴포넌트가 `overflow: hidden` 또는 대화 상자에 영향을 미치는 다른 스타일이 있는 컨테이너 안에 있더라도 가능합니다.

이 예제에서 두 컨테이너는 모달 대화 상자를 방해하는 스타일을 가지고 있지만, 포털에 렌더링된 모달은 영향을 받지 않습니다. 이는 DOM에서 모달이 부모 JSX 요소 내에 포함되지 않기 때문입니다.

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
        포털 없이 모달 표시
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
        포털을 사용하여 모달 표시
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
      <div>저는 모달 대화 상자입니다</div>
      <button onClick={onClose}>닫기</button>
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

포털을 사용할 때 앱이 접근 가능하도록 하는 것이 중요합니다. 예를 들어, 사용자가 포털 안팎으로 자연스럽게 포커스를 이동할 수 있도록 키보드 포커스를 관리해야 할 수도 있습니다.

모달을 만들 때 [WAI-ARIA 모달 작성 관행](https://www.w3.org/WAI/ARIA/apg/#dialog_modal)을 따르세요. 커뮤니티 패키지를 사용하는 경우, 해당 패키지가 접근 가능하고 이러한 지침을 따르는지 확인하세요.

</Pitfall>

---

### 비-React 서버 마크업에 React 컴포넌트 렌더링하기 {/*rendering-react-components-into-non-react-server-markup*/}

포털은 React 루트가 React로 빌드되지 않은 정적 또는 서버 렌더링된 페이지의 일부일 때 유용할 수 있습니다. 예를 들어, 페이지가 Rails와 같은 서버 프레임워크로 빌드된 경우, 사이드바와 같은 정적 영역 내에서 상호작용 영역을 만들 수 있습니다. [여러 개의 별도 React 루트](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)를 사용하는 것과 비교하여, 포털을 사용하면 앱을 단일 React 트리로 취급할 수 있으며, 상태를 공유하면서도 DOM의 다른 부분에 렌더링할 수 있습니다.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>내 하이브리드 앱에 오신 것을 환영합니다</h1>
    <div class="parent">
      <div class="sidebar">
        이것은 서버 비-React 마크업입니다
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
  return <p>이 부분은 React에 의해 렌더링됩니다</p>;
}

function SidebarContent() {
  return <p>이 부분도 React에 의해 렌더링됩니다!</p>;
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

### 비-React DOM 노드에 React 컴포넌트 렌더링하기 {/*rendering-react-components-into-non-react-dom-nodes*/}

포털을 사용하여 React 외부에서 관리되는 DOM 노드의 콘텐츠를 관리할 수도 있습니다. 예를 들어, 비-React 지도 위젯과 통합하고 팝업 안에 React 콘텐츠를 렌더링하려는 경우, 렌더링할 DOM 노드를 저장할 `popupContainer` 상태 변수를 선언합니다:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

서드파티 위젯을 생성할 때, 위젯이 반환하는 DOM 노드를 저장하여 해당 노드에 렌더링할 수 있도록 합니다:

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

이렇게 하면 `popupContainer`가 사용 가능해지면 `createPortal`을 사용하여 React 콘텐츠를 렌더링할 수 있습니다:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>React에서 인사드립니다!</p>,
      popupContainer
    )}
  </div>
);
```

여기에서 완전한 예제를 확인할 수 있습니다:

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
        <p>React에서 인사드립니다!</p>,
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