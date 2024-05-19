---
title: lazy
---

<Intro>

`lazy`를 사용하면 컴포넌트의 코드를 처음 렌더링될 때까지 로딩을 지연시킬 수 있습니다.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `lazy(load)` {/*lazy*/}

`lazy`를 컴포넌트 외부에서 호출하여 지연 로딩되는 React 컴포넌트를 선언합니다:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `load`: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 다른 *thenable* (Promise와 유사한 `then` 메서드를 가진 객체)을 반환하는 함수입니다. React는 반환된 컴포넌트를 처음 렌더링하려고 시도할 때까지 `load`를 호출하지 않습니다. React가 처음으로 `load`를 호출한 후, 이를 해결할 때까지 기다린 다음, 해결된 값의 `.default`를 React 컴포넌트로 렌더링합니다. 반환된 Promise와 Promise의 해결된 값은 모두 캐시되므로 React는 `load`를 한 번 이상 호출하지 않습니다. Promise가 거부되면 React는 가장 가까운 Error Boundary가 처리할 수 있도록 거부 이유를 `throw`합니다.

#### 반환값 {/*returns*/}

`lazy`는 트리에서 렌더링할 수 있는 React 컴포넌트를 반환합니다. 지연 컴포넌트의 코드가 아직 로드되지 않은 경우, 이를 렌더링하려고 하면 *suspend*됩니다. 로딩 중에 로딩 표시기를 표시하려면 [`<Suspense>`](/reference/react/Suspense)를 사용하세요.

---

### `load` 함수 {/*load*/}

#### 매개변수 {/*load-parameters*/}

`load`는 매개변수를 받지 않습니다.

#### 반환값 {/*load-returns*/}

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 `then` 메서드를 가진 다른 *thenable*을 반환해야 합니다. 이는 결국 `.default` 속성이 유효한 React 컴포넌트 타입(예: 함수, [`memo`](/reference/react/memo), 또는 [`forwardRef`](/reference/react/forwardRef) 컴포넌트)인 객체로 해결되어야 합니다.

---

## 사용법 {/*usage*/}

### Suspense를 사용한 컴포넌트 지연 로딩 {/*suspense-for-code-splitting*/}

일반적으로, 정적 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 선언을 사용하여 컴포넌트를 가져옵니다:

```js
import MarkdownPreview from './MarkdownPreview.js';
```

이 컴포넌트의 코드를 처음 렌더링될 때까지 로딩을 지연시키려면, 이 import를 다음과 같이 변경하세요:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

이 코드는 [동적 `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)에 의존하며, 이는 번들러나 프레임워크의 지원이 필요할 수 있습니다. 이 패턴을 사용하려면 가져오는 지연 컴포넌트가 `default`로 내보내졌는지 확인해야 합니다.

이제 컴포넌트의 코드가 필요할 때 로드되므로, 로딩 중에 무엇을 표시할지 지정해야 합니다. 이를 위해 지연 컴포넌트나 그 부모 중 하나를 [`<Suspense>`](/reference/react/Suspense) 경계로 감쌀 수 있습니다:

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

이 예제에서, `MarkdownPreview`의 코드는 렌더링을 시도할 때까지 로드되지 않습니다. `MarkdownPreview`가 아직 로드되지 않은 경우, `Loading`이 대신 표시됩니다. 체크박스를 선택해보세요:

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// 로딩 상태를 볼 수 있도록 고정된 지연을 추가합니다
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
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

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

이 데모는 인위적인 지연과 함께 로드됩니다. 다음 번에 체크박스를 선택 해제하고 다시 선택하면 `Preview`가 캐시되므로 로딩 상태가 나타나지 않습니다. 로딩 상태를 다시 보려면 샌드박스에서 "Reset"을 클릭하세요.

[로딩 상태 관리에 대해 더 알아보기](/reference/react/Suspense)

---

## 문제 해결 {/*troubleshooting*/}

### `lazy` 컴포넌트의 상태가 예상치 않게 리셋됩니다 {/*my-lazy-components-state-gets-reset-unexpectedly*/}

다른 컴포넌트 *내부*에 `lazy` 컴포넌트를 선언하지 마세요:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 나쁨: 이로 인해 모든 상태가 다시 렌더링될 때 리셋됩니다
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

대신, 항상 모듈의 최상위 레벨에서 선언하세요:

```js {3-4}
import { lazy } from 'react';

// ✅ 좋음: 지연 컴포넌트를 컴포넌트 외부에서 선언합니다
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```