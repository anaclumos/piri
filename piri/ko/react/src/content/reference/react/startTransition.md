---
title: startTransition
---

<Intro>

`startTransition`를 사용하면 UI를 차단하지 않고 상태를 업데이트할 수 있습니다.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

`startTransition` 함수는 상태 업데이트를 Transition으로 표시할 수 있게 해줍니다.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `scope`: 하나 이상의 [`set` 함수](/reference/react/useState#setstate)를 호출하여 일부 상태를 업데이트하는 함수입니다. React는 인수 없이 `scope`를 즉시 호출하고, `scope` 함수 호출 중에 동기적으로 예약된 모든 상태 업데이트를 Transition으로 표시합니다. 이들은 [비차단](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)되고 [원치 않는 로딩 표시기를 표시하지 않습니다.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### 반환값 {/*returns*/}

`startTransition`은 아무것도 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* `startTransition`은 Transition이 진행 중인지 추적할 방법을 제공하지 않습니다. Transition이 진행 중일 때 대기 표시기를 표시하려면 [`useTransition`](/reference/react/useTransition)을 대신 사용해야 합니다.

* 상태의 `set` 함수에 접근할 수 있는 경우에만 업데이트를 Transition으로 래핑할 수 있습니다. prop이나 커스텀 Hook 반환 값에 응답하여 Transition을 시작하려면 [`useDeferredValue`](/reference/react/useDeferredValue)를 대신 사용해 보세요.

* `startTransition`에 전달하는 함수는 동기적이어야 합니다. React는 이 함수를 즉시 실행하여 실행 중에 발생하는 모든 상태 업데이트를 Transition으로 표시합니다. 나중에 (예: 타임아웃에서) 더 많은 상태 업데이트를 수행하려고 하면 Transition으로 표시되지 않습니다.

* Transition으로 표시된 상태 업데이트는 다른 상태 업데이트에 의해 중단됩니다. 예를 들어, Transition 내에서 차트 컴포넌트를 업데이트한 후 입력 중에 차트가 다시 렌더링되는 동안 입력을 시작하면 React는 입력 상태 업데이트를 처리한 후 차트 컴포넌트의 렌더링 작업을 다시 시작합니다.

* Transition 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.

* 여러 Transition이 동시에 진행 중인 경우, React는 현재 이를 함께 배치합니다. 이는 향후 릴리스에서 제거될 가능성이 있는 제한 사항입니다.

---

## 사용법 {/*usage*/}

### 상태 업데이트를 비차단 Transition으로 표시하기 {/*marking-a-state-update-as-a-non-blocking-transition*/}

`startTransition` 호출로 상태 업데이트를 *Transition*으로 표시할 수 있습니다:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transition을 사용하면 느린 장치에서도 사용자 인터페이스 업데이트를 응답성 있게 유지할 수 있습니다.

Transition을 사용하면 다시 렌더링 중에도 UI가 응답성을 유지합니다. 예를 들어, 사용자가 탭을 클릭한 후 마음을 바꿔 다른 탭을 클릭하면 첫 번째 다시 렌더링이 완료될 때까지 기다리지 않고도 그렇게 할 수 있습니다.

<Note>

`startTransition`은 [`useTransition`](/reference/react/useTransition)과 매우 유사하지만, Transition이 진행 중인지 추적하는 `isPending` 플래그를 제공하지 않습니다. `useTransition`을 사용할 수 없는 경우 `startTransition`을 호출할 수 있습니다. 예를 들어, `startTransition`은 데이터 라이브러리와 같은 컴포넌트 외부에서도 작동합니다.

[Transition에 대해 배우고 `useTransition` 페이지에서 예제를 확인하세요.](/reference/react/useTransition)

</Note>