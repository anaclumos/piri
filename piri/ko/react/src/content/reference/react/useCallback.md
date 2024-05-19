---
title: useCallback
---

<Intro>

`useCallback`는 리렌더링 사이에 함수 정의를 캐시할 수 있게 해주는 React Hook입니다.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

리렌더링 사이에 함수 정의를 캐시하기 위해 컴포넌트의 최상위 레벨에서 `useCallback`을 호출하세요:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `fn`: 캐시하고자 하는 함수 값입니다. 이 함수는 어떤 인수도 받을 수 있고, 어떤 값도 반환할 수 있습니다. React는 초기 렌더링 동안 함수 호출 없이 함수 자체를 반환합니다. 이후 렌더링에서는 `dependencies`가 마지막 렌더링 이후 변경되지 않았다면 동일한 함수를 반환합니다. 그렇지 않으면 현재 렌더링 중에 전달된 함수를 반환하고, 나중에 재사용할 수 있도록 저장합니다. React는 함수를 호출하지 않습니다. 함수는 언제 호출할지 결정할 수 있도록 반환됩니다.

* `dependencies`: `fn` 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 그리고 컴포넌트 본문 내에서 직접 선언된 모든 변수와 함수가 포함됩니다. 린터가 [React에 맞게 구성된 경우](/learn/editor-setup#linting), 모든 반응형 값이 올바르게 종속성으로 지정되었는지 확인합니다. 종속성 목록은 일정한 항목 수를 가져야 하며 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교 알고리즘을 사용하여 각 종속성을 이전 값과 비교합니다.

#### 반환값 {/*returns*/}

초기 렌더링 시, `useCallback`은 전달된 `fn` 함수를 반환합니다.

이후 렌더링 동안, 종속성이 변경되지 않았다면 이전 렌더링에서 저장된 `fn` 함수를 반환하거나, 현재 렌더링 중에 전달된 `fn` 함수를 반환합니다.

#### 주의사항 {/*caveats*/}

* `useCallback`은 Hook이므로 **컴포넌트의 최상위 레벨** 또는 자체 Hook에서만 호출할 수 있습니다. 루프나 조건문 내에서는 호출할 수 없습니다. 그런 경우, 새로운 컴포넌트를 추출하고 상태를 그 안으로 이동하세요.
* React는 **특정 이유가 없는 한 캐시된 함수를 버리지 않습니다.** 예를 들어, 개발 중에는 컴포넌트 파일을 편집할 때 캐시를 버립니다. 개발 및 프로덕션 모두에서 초기 마운트 중에 컴포넌트가 일시 중단되면 캐시를 버립니다. 미래에는 캐시를 버리는 기능을 활용하는 더 많은 기능이 추가될 수 있습니다. 예를 들어, React가 가상화된 리스트에 대한 내장 지원을 추가하면, 가상화된 테이블 뷰포트에서 스크롤 아웃된 항목에 대해 캐시를 버리는 것이 합리적일 것입니다. 이는 `useCallback`을 성능 최적화로 사용하는 경우 기대에 부합해야 합니다. 그렇지 않으면 [상태 변수](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead)나 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)가 더 적합할 수 있습니다.

---

## 사용법 {/*usage*/}

### 컴포넌트의 리렌더링 건너뛰기 {/*skipping-re-rendering-of-components*/}

렌더링 성능을 최적화할 때, 자식 컴포넌트에 전달하는 함수를 캐시해야 할 때가 있습니다. 먼저 이를 수행하는 구문을 살펴보고, 그런 경우가 언제 유용한지 알아보겠습니다.

컴포넌트의 리렌더링 사이에 함수를 캐시하려면, 함수 정의를 `useCallback` Hook으로 감싸세요:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback`에 두 가지를 전달해야 합니다:

1. 리렌더링 사이에 캐시하고자 하는 함수 정의.
2. 함수 내에서 사용되는 컴포넌트의 모든 값을 포함하는 <CodeStep step={2}>종속성 목록</CodeStep>.

초기 렌더링 시, `useCallback`에서 <CodeStep step={3}>반환된 함수</CodeStep>는 전달된 함수입니다.

이후 렌더링 시, React는 <CodeStep step={2}>종속성</CodeStep>을 이전 렌더링 시 전달된 종속성과 비교합니다. 종속성 중 어느 것도 변경되지 않았다면 (`Object.is`로 비교), `useCallback`은 이전과 동일한 함수를 반환합니다. 그렇지 않으면, `useCallback`은 *이번* 렌더링에서 전달된 함수를 반환합니다.

즉, `useCallback`은 종속성이 변경될 때까지 리렌더링 사이에 함수를 캐시합니다.

**이것이 유용한 경우를 예제로 살펴보겠습니다.**

`ProductPage`에서 `ShippingForm` 컴포넌트로 `handleSubmit` 함수를 전달한다고 가정해봅시다:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme` prop을 토글할 때 앱이 잠시 멈추는 것을 발견했지만, JSX에서 `<ShippingForm />`을 제거하면 빠르게 느껴집니다. 이는 `ShippingForm` 컴포넌트를 최적화할 가치가 있음을 알려줍니다.

**기본적으로, 컴포넌트가 리렌더링되면 React는 모든 자식을 재귀적으로 리렌더링합니다.** 그래서 `ProductPage`가 다른 `theme`으로 리렌더링될 때, `ShippingForm` 컴포넌트도 *리렌더링*됩니다. 이는 리렌더링에 많은 계산이 필요하지 않은 컴포넌트에는 문제가 없습니다. 그러나 리렌더링이 느리다고 확인된 경우, [`memo`](/reference/react/memo)로 감싸서 `ShippingForm`이 props가 이전 렌더링과 동일할 때 리렌더링을 건너뛰도록 할 수 있습니다:

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**이 변경으로, `ShippingForm`은 모든 props가 이전 렌더링과 *동일*할 경우 리렌더링을 건너뜁니다.** 이때 함수 캐싱이 중요해집니다! `useCallback` 없이 `handleSubmit`을 정의했다고 가정해봅시다:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 테마가 변경될 때마다, 이는 다른 함수가 됩니다...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... 그래서 ShippingForm의 props는 절대 동일하지 않으며, 매번 리렌더링됩니다 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**JavaScript에서 `function () {}` 또는 `() => {}`는 항상 _다른_ 함수를 생성합니다,** `{}` 객체 리터럴이 항상 새로운 객체를 생성하는 것과 유사합니다. 일반적으로 이는 문제가 되지 않지만, `ShippingForm` props가 절대 동일하지 않게 되어 [`memo`](/reference/react/memo) 최적화가 작동하지 않습니다. 이때 `useCallback`이 유용합니다:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 리렌더링 사이에 함수를 캐시하도록 React에 지시합니다...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...이 종속성이 변경되지 않는 한...

  return (
    <div className={theme}>
      {/* ...ShippingForm은 동일한 props를 받아 리렌더링을 건너뛸 수 있습니다 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**`handleSubmit`을 `useCallback`으로 감싸면, 리렌더링 사이에 동일한 함수가 됩니다** (종속성이 변경될 때까지). 특정 이유가 없다면 `useCallback`으로 함수를 감쌀 필요는 없습니다. 이 예제에서는 [`memo`](/reference/react/memo)로 감싼 컴포넌트에 전달하기 때문에 리렌더링을 건너뛰게 하기 위해 사용합니다. 이 페이지에서 설명된 다른 이유로 `useCallback`이 필요할 수 있습니다.

<Note>

**성능 최적화로서만 `useCallback`에 의존해야 합니다.** 코드가 `useCallback` 없이 작동하지 않는다면, 근본적인 문제를 찾아 먼저 해결하세요. 그런 다음 `useCallback`을 다시 추가할 수 있습니다.

</Note>

<DeepDive>

#### useCallback과 useMemo의 관계는 무엇인가요? {/*how-is-usecallback-related-to-usememo*/}

[`useMemo`](/reference/react/useMemo)와 `useCallback`을 함께 사용하는 경우가 많습니다. 둘 다 자식 컴포넌트를 최적화하려 할 때 유용합니다. 전달하는 것을 [메모이제이션](https://en.wikipedia.org/wiki/Memoization) (즉, 캐시)할 수 있게 해줍니다:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // 함수를 호출하고 결과를 캐시합니다
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // 함수 자체를 캐시합니다
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

차이점은 *무엇을* 캐시할 수 있게 해주는지에 있습니다:

* **[`useMemo`](/reference/react/useMemo)는 함수 호출 결과를 캐시합니다.** 이 예제에서는 `computeRequirements(product)` 호출 결과를 캐시하여 `product`가 변경되지 않는 한 변경되지 않습니다. 이를 통해 `requirements` 객체를 불필요한 리렌더링 없이 전달할 수 있습니다. 필요할 때 React는 렌더링 중에 전달된 함수를 호출하여 결과를 계산합니다.
* **`useCallback`은 함수 자체를 캐시합니다.** `useMemo`와 달리 제공된 함수를 호출하지 않습니다. 대신, 제공된 함수를 캐시하여 `productId`나 `referrer`가 변경되지 않는 한 `handleSubmit` 자체가 변경되지 않도록 합니다. 이를 통해 `handleSubmit` 함수를 불필요한 리렌더링 없이 전달할 수 있습니다. 사용자가 폼을 제출할 때까지 코드는 실행되지 않습니다.

[`useMemo`](/reference/react/useMemo)를 이미 알고 있다면, `useCallback`을 다음과 같이 생각할 수 있습니다:

```js
// 간단한 구현 (React 내부)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[`useMemo`와 `useCallback`의 차이점에 대해 더 읽어보세요.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### useCallback을 모든 곳에 추가해야 하나요? {/*should-you-add-usecallback-everywhere*/}

앱이 이 사이트와 같고 대부분의 상호작용이 페이지나 섹션을 교체하는 것처럼 거친 경우, 메모이제이션은 보통 불필요합니다. 반면, 앱이 도형을 이동하는 것처럼 세밀한 상호작용이 많은 드로잉 에디터와 같다면, 메모이제이션이 매우 유용할 수 있습니다.

`useCallback`으로 함수를 캐시하는 것은 몇 가지 경우에만 가치가 있습니다:

- [`memo`](/reference/react/memo)로 감싼 컴포넌트에 prop으로 전달합니다. 값이 변경되지 않은 경우 리렌더링을 건너뛰고 싶습니다. 메모이제이션을 통해 종속성이 변경된 경우에만 컴포넌트가 리렌더링됩니다.
- 전달하는 함수가 나중에 어떤 Hook의 종속성으로 사용됩니다. 예를 들어, 다른 `useCallback`으로 감싼 함수가 이를 종속성으로 사용하거나, [`useEffect`](/reference/react/useEffect)에서 이 함수에 의존합니다.

다른 경우에는 `useCallback`으로 함수를 감싸는 것이 이점이 없습니다. 그렇게 해도 큰 해가 되지는 않으므로, 일부 팀은 개별 사례를 생각하지 않고 가능한 한 많이 메모이제이션을 선택합니다. 단점은 코드가 덜 읽기 쉬워진다는 것입니다. 또한, 모든 메모이제이션이 효과적인 것은 아닙니다: "항상 새로운" 단일 값이 전체 컴포넌트의 메모이제이션을 깨뜨리기에 충분합니다.

`useCallback`은 *함수 생성*을 방지하지 않습니다. 항상 함수를 생성하고 (괜찮습니다!), React는 변경 사항이 없으면 캐시된 함수를 반환합니다.

**실제로, 몇 가지 원칙을 따르면 많은 메모이제이션이 불필요해질 수 있습니다:**

1. 컴포넌트가 다른 컴포넌트를 시각적으로 감쌀 때, [JSX를 자식으로 받도록](/learn/passing-props-to-a-component#passing-jsx-as-children) 하세요. 그러면 래퍼 컴포넌트가 자체 상태를 업데이트할 때, React는 자식이 리렌더링할 필요가 없음을 알게 됩니다.
1. 로컬 상태를 선호하고 [상태를 필요 이상으로 올리지](/learn/sharing-state-between-components) 마세요. 폼과 항목이 호버된 상태와 같은 일시적인 상태를 트리의 최상위나 전역 상태 라이브러리에 유지하지 마세요.
1. [렌더링 로직을 순수하게 유지하세요.](/learn/keeping-components-pure) 컴포넌트 리렌더링이 문제를 일으키거나 눈에 띄는 시각적 아티팩트를 생성하면, 이는 컴포넌트의 버그입니다! 메모이제이션을 추가하는 대신 버그를 수정하세요.
1. [상태를 업데이트하는 불필요한 Effects를 피하세요.](/learn/you-might-not-need-an-effect) 대부분의 React 앱 성능 문제는 Effects에서 시작된 업데이트 체인으로 인해 컴포넌트가 반복적으로 렌더링되는 경우입니다.
1. [Effects에서 불필요한 종속성을 제거하세요.](/learn/removing-effect-dependencies) 예를 들어, 메모이제이션 대신 객체나 함수를 Effect 내부 또는 컴포넌트 외부로 이동하는 것이 더 간단할 수 있습니다.

특정 상호작용이 여전히 느리게 느껴진다면, [React Developer Tools 프로파일러](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용하여 메모이제이션이 가장 효과적인 컴포넌트를 확인하고 필요한 곳에 메모이제이션을 추가하세요. 이러한 원칙은 컴포넌트를 디버그하고 이해하기 쉽게 만드므로, 어떤 경우에도 따르는 것이 좋습니다. 장기적으로는 [메모이제이션을 자동으로 수행하는](https://www.youtube.com/watch?v=lGEMwh32soc) 연구를 진행 중입니다.

</DeepDive>

<Recipes titleText="useCallback과 직접 함수 선언의 차이" titleId="examples-rerendering">

#### useCallback과 memo로 리렌더링 건너뛰기 {/*skipping-re-rendering-with-usecallback-and-memo*/}

이 예제에서는 `ShippingForm` 컴포넌트가 **인위적으로 느려지도록** 설정되어 있습니다. React 컴포넌트를 렌더링할 때 실제로 느린 경우 어떤 일이 발생하는지 확인할 수 있습니다. 카운터를 증가시키고 테마를 토글해보세요.

카운터를 증가시키는 것은 느리게 느껴집니다. 이는 느려진 `ShippingForm`이 리렌더링되기 때문입니다. 이는 카운터가 변경되었기 때문에 예상된 것입니다. 사용자의 새로운 선택을 화면에 반영해야 합니다.

다음으로 테마를 토글해보세요. **`useCallback`과 [`memo`](/reference/react/memo) 덕분에 인위적인 느려짐에도 불구하고 빠릅니다!** `ShippingForm`은 `handleSubmit` 함수가 변경되지 않았기 때문에 리렌더링을 건너뛰었습니다. `handleSubmit` 함수는 `productId`와 `referrer` (`use
Callback` 종속성)가 마지막 렌더링 이후 변경되지 않았기 때문에 변경되지 않았습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        다크 모드
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 요청을 보내는 것을 상상해보세요...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[인위적으로 느림] <ShippingForm /> 렌더링');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 500ms 동안 아무것도 하지 않음, 매우 느린 코드를 에뮬레이트
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>참고: <code>ShippingForm</code>은 인위적으로 느려졌습니다!</b></p>
      <label>
        항목 수:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        거리:
        <input name="street" />
      </label>
      <label>
        도시:
        <input name="city" />
      </label>
      <label>
        우편번호:
        <input name="zipCode" />
      </label>
      <button type="submit">제출</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 항상 컴포넌트를 리렌더링하기 {/*always-re-rendering-a-component*/}

이 예제에서도 `ShippingForm` 구현이 **인위적으로 느려졌습니다**. React 컴포넌트를 렌더링할 때 실제로 느린 경우 어떤 일이 발생하는지 확인할 수 있습니다. 카운터를 증가시키고 테마를 토글해보세요.

이전 예제와 달리, 테마를 토글하는 것도 이제 느립니다! 이는 **이 버전에서는 `useCallback` 호출이 없기 때문입니다,** 그래서 `handleSubmit`은 항상 새로운 함수가 되고, 느려진 `ShippingForm` 컴포넌트는 리렌더링을 건너뛸 수 없습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        다크 모드
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 요청을 보내는 것을 상상해보세요...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[인위적으로 느림] <ShippingForm /> 렌더링');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 500ms 동안 아무것도 하지 않음, 매우 느린 코드를 에뮬레이트
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        항목 수:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        거리:
        <input name="street" />
      </label>
      <label>
        도시:
        <input name="city" />
      </label>
      <label>
        우편번호:
        <input name="zipCode" />
      </label>
      <button type="submit">제출</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


그러나, 인위적인 느려짐을 제거한 동일한 코드입니다. `useCallback`의 부재가 눈에 띄는지 아닌지 확인해보세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        다크 모드
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 요청을 보내는 것을 상상해보세요...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('<ShippingForm /> 렌더링');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        항목 수:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        거리:
        <input name="street" />
      </label>
      <label>
        도시:
        <input name="city" />
      </label>
      <label>
        우편번호:
        <input name="zipCode" />
      </label>
      <button type="submit">제출</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


종종 메모이제이션 없이도 코드가 잘 작동합니다. 상호작용이 충분히 빠르다면 메모이제이션이 필요하지 않습니다.

React를 프로덕션 모드에서 실행하고, [React Developer Tools](/learn/react-developer-tools)를 비활성화하고, 앱 사용자의 장치와 유사한 장치를 사용하여 실제로 앱을 느리게 만드는 것이 무엇인지 현실적으로 파악해야 합니다.

<Solution />

</Recipes>

---

### 메모이제이션된 콜백에서 상태 업데이트 {/*updating-state-from-a-memoized-callback*/}

때때로, 메모이제이션된 콜백에서 이전 상태를 기반으로 상태를 업데이트해야 할 수 있습니다.

이 `handleAddTodo` 함수는 `todos`를 종속성으로 지정합니다. 왜냐하면 다음 todos를 계산하기 위해 사용하기 때문입니다:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

메모이제이션된 함수는 가능한 한 적은 종속성을 가지는 것이 좋습니다. 이전 상태를 읽어 다음 상태를 계산할 때, [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 전달하여 해당 종속성을 제거할 수 있습니다:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ todos 종속성이 필요하지 않습니다
  // ...
```

여기서는 `todos`를 종속성으로 만들고 내부에서 읽는 대신, 상태를 *어떻게* 업데이트할지에 대한 지침 (`todos => [...todos, newTodo]`)을 React에 전달합니다. [업데이터 함수에 대해 더 읽어보세요.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Effect가 너무 자주 실행되는 것을 방지하기 {/*preventing-an-effect-from-firing-too-often*/}

때때로, [Effect](/learn/synchronizing-with-effects) 내부에서 함수를 호출하고 싶을 수 있습니다:

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

이것은 문제를 만듭니다. [모든 반응형 값은 Effect의 종속성으로 선언되어야 합니다.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) 그러나, `createOptions`를 종속성으로 선언하면, Effect가 채팅방에 계속 재연결되게 됩니다:

```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 문제: 이 종속성은 매 렌더링마다 변경됩니다
  // ...
```

이를 해결하려면, Effect 내부에서 호출해야 하는 함수를 `useCallback`으로 감쌀 수 있습니다:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomId가 변경될 때만 변경됩니다

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ createOptions가 변경될 때만 변경됩니다
  // ...
```

이렇게 하면 `roomId`가 동일한 경우 `createOptions` 함수가 리렌더링 사이에 동일하게 유지됩니다. **그러나 함수 종속성을 제거하는 것이 더 좋습니다.** 함수를 Effect 내부로 이동하세요:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallback이나 함수 종속성이 필요 없습니다!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId가 변경될 때만 변경됩니다
  // ...
```

이제 코드는 더 간단해졌고 `useCallback`이 필요하지 않습니다. [Effect 종속성 제거에 대해 더 알아보세요.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### 커스텀 Hook 최적화하기 {/*optimizing-a-custom-hook*/}

[커스텀 Hook을 작성할 때,](/learn/reusing-logic-with-custom-hooks) 반환하는 모든 함수를 `useCallback`으로 감싸는 것이 좋습니다:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

이렇게 하면 Hook의 소비자가 필요할 때 자신의 코드를 최적화할 수 있습니다.

---

## 문제 해결 {/*troubleshooting*/}

### 컴포넌트가 렌더링될 때마다, `useCallback`이 다른 함수를 반환합니다 {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

종속성 배열을 두 번째 인수로 지정했는지 확인하세요!

종속성 배열을 잊으면, `useCallback`은 매번 새로운 함수를 반환합니다:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 종속성 배열이 없으면 매번 새로운 함수를 반환합니다
  // ...
```

이것은 종속성 배열을 두 번째 인수로 전달한 수정된 버전입니다:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ 불필요하게 새로운 함수를 반환하지 않습니다
  // ...
```

이것이 도움이 되지 않는다면, 문제는 종속성 중 하나 이상이 이전 렌더링과 다르기 때문입니다. 종속성을 수동으로 콘솔에 로깅하여 이 문제를 디버그할 수 있습니다:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

다른 렌더링의 배열을 콘솔에서 오른쪽 클릭하고 "전역 변수로 저장"을 선택할 수 있습니다. 첫 번째 배열이 `temp1`로 저장되고 두 번째 배열이 `temp2`로 저장되었다고 가정하면, 브라우저 콘솔을 사용하여 두 배열의 각 종속성이 동일한지 확인할 수 있습니다:

```js
Object.is(temp1[0], temp2[0]); // 두 배열의 첫 번째 종속성이 동일한가요?
Object.is(temp1[1], temp2[1]); // 두 번째 종속성이 동일한가요?
Object.is(temp1[2], temp2[2]); // ... 모든 종속성에 대해 계속확인하세요 ...
```

종속성 중 어느 것이 메모이제이션을 깨뜨리는지 찾으면, 이를 제거하거나 [종속성도 메모이제이션](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)하세요.

---

### 루프에서 각 리스트 항목에 대해 useCallback을 호출해야 하지만, 이는 허용되지 않습니다 {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` 컴포넌트가 [`memo`](/reference/react/memo)로 감싸져 있다고 가정해봅시다. `ReportList` 컴포넌트가 리렌더링될 때 모든 `Chart`의 리렌더링을 건너뛰고 싶습니다. 그러나, 루프에서 `useCallback`을 호출할 수 없습니다:

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 이렇게 루프에서 useCallback을 호출할 수 없습니다:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

대신, 개별 항목에 대한 컴포넌트를 추출하고, `useCallback`을 그곳에 넣으세요:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ 최상위 레벨에서 useCallback을 호출하세요:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

또는, 마지막 코드 조각에서 `useCallback`을 제거하고 대신 `Report` 자체를 [`memo`](/reference/react/memo)로 감쌀 수 있습니다. `item` prop이 변경되지 않으면, `Report`는 리렌더링을 건너뛰고, 따라서 `Chart`도 리렌더링을 건너뛸 수 있습니다:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```