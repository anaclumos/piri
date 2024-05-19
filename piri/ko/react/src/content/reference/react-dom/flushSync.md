---
title: flushSync
---

<Pitfall>

`flushSync`를 사용하는 것은 드물며, 앱의 성능에 악영향을 줄 수 있습니다.

</Pitfall>

<Intro>

`flushSync`는 제공된 콜백 내부의 모든 업데이트를 동기적으로 플러시하도록 React에 강제할 수 있습니다. 이를 통해 DOM이 즉시 업데이트되도록 보장합니다.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

`flushSync`를 호출하여 React가 보류 중인 작업을 플러시하고 DOM을 동기적으로 업데이트하도록 강제합니다.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

대부분의 경우, `flushSync`는 피할 수 있습니다. `flushSync`는 최후의 수단으로 사용하세요.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `callback`: 함수입니다. React는 이 콜백을 즉시 호출하고 그 안에 포함된 모든 업데이트를 동기적으로 플러시합니다. 또한 보류 중인 업데이트나 Effects, 또는 Effects 내부의 업데이트를 플러시할 수 있습니다. 이 `flushSync` 호출로 인해 업데이트가 일시 중단되면, 폴백이 다시 표시될 수 있습니다.

#### 반환값 {/*returns*/}

`flushSync`는 `undefined`를 반환합니다.

#### 주의사항 {/*caveats*/}

* `flushSync`는 성능에 심각한 악영향을 줄 수 있습니다. 신중하게 사용하세요.
* `flushSync`는 보류 중인 Suspense 경계를 강제로 `fallback` 상태로 표시할 수 있습니다.
* `flushSync`는 보류 중인 Effects를 실행하고 반환하기 전에 그 안에 포함된 모든 업데이트를 동기적으로 적용할 수 있습니다.
* `flushSync`는 콜백 내부의 업데이트를 플러시하기 위해 필요한 경우 콜백 외부의 업데이트를 플러시할 수 있습니다. 예를 들어, 클릭으로 인한 보류 중인 업데이트가 있는 경우, React는 콜백 내부의 업데이트를 플러시하기 전에 이를 플러시할 수 있습니다.

---

## 사용법 {/*usage*/}

### 서드파티 통합을 위한 업데이트 플러시 {/*flushing-updates-for-third-party-integrations*/}

브라우저 API나 UI 라이브러리와 같은 서드파티 코드와 통합할 때, React가 업데이트를 플러시하도록 강제해야 할 수 있습니다. `flushSync`를 사용하여 콜백 내부의 <CodeStep step={1}>상태 업데이트</CodeStep>를 동기적으로 플러시하도록 React에 강제하세요:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// 이 줄까지는 DOM이 업데이트됩니다.
```

이를 통해 다음 코드 줄이 실행될 때까지 React가 이미 DOM을 업데이트했음을 보장합니다.

**`flushSync`를 사용하는 것은 드물며, 자주 사용하면 앱의 성능에 심각한 악영향을 줄 수 있습니다.** 앱이 React API만 사용하고 서드파티 라이브러리와 통합하지 않는 경우, `flushSync`는 불필요합니다.

그러나 브라우저 API와 같은 서드파티 코드와 통합할 때 유용할 수 있습니다.

일부 브라우저 API는 콜백 내부의 결과가 콜백이 끝날 때까지 DOM에 동기적으로 기록되기를 기대합니다. 대부분의 경우, React는 이를 자동으로 처리합니다. 그러나 일부 경우에는 동기 업데이트를 강제해야 할 수 있습니다.

예를 들어, 브라우저 `onbeforeprint` API는 인쇄 대화 상자가 열리기 직전에 페이지를 변경할 수 있게 합니다. 이는 문서가 인쇄에 더 잘 표시되도록 사용자 정의 인쇄 스타일을 적용하는 데 유용합니다. 아래 예제에서는 `onbeforeprint` 콜백 내부에서 `flushSync`를 사용하여 React 상태를 DOM에 즉시 "플러시"합니다. 그런 다음 인쇄 대화 상자가 열릴 때 `isPrinting`이 "yes"로 표시됩니다:

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

`flushSync` 없이 인쇄 대화 상자는 `isPrinting`을 "no"로 표시합니다. 이는 React가 업데이트를 비동기적으로 배치하고 인쇄 대화 상자가 상태가 업데이트되기 전에 표시되기 때문입니다.

<Pitfall>

`flushSync`는 성능에 심각한 악영향을 줄 수 있으며, 보류 중인 Suspense 경계를 예기치 않게 폴백 상태로 강제할 수 있습니다.

대부분의 경우, `flushSync`는 피할 수 있으므로 최후의 수단으로 사용하세요.

</Pitfall>