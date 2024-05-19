---
title: 효과가 필요하지 않을 수도 있습니다
---

<Intro>

Effects는 React 패러다임에서 벗어나는 탈출구입니다. 이를 통해 React 외부로 "벗어나" 비-React 위젯, 네트워크 또는 브라우저 DOM과 같은 외부 시스템과 컴포넌트를 동기화할 수 있습니다. 외부 시스템이 관련되지 않은 경우(예: 일부 props 또는 상태가 변경될 때 컴포넌트의 상태를 업데이트하려는 경우) Effect가 필요하지 않습니다. 불필요한 Effects를 제거하면 코드가 더 쉽게 이해되고, 실행 속도가 빨라지며, 오류 발생 가능성이 줄어듭니다.

</Intro>

<YouWillLearn>

* 컴포넌트에서 불필요한 Effects를 제거하는 이유와 방법
* Effects 없이 비용이 많이 드는 계산을 캐시하는 방법
* Effects 없이 컴포넌트 상태를 재설정하고 조정하는 방법
* 이벤트 핸들러 간에 로직을 공유하는 방법
* 이벤트 핸들러로 이동해야 하는 로직
* 변경 사항에 대해 부모 컴포넌트에 알리는 방법

</YouWillLearn>

## 불필요한 Effects 제거 방법 {/*how-to-remove-unnecessary-effects*/}

Effects가 필요하지 않은 두 가지 일반적인 경우가 있습니다:

* **렌더링을 위해 데이터를 변환하는 데 Effects가 필요하지 않습니다.** 예를 들어, 목록을 표시하기 전에 필터링하려고 한다고 가정해 보겠습니다. 목록이 변경될 때 상태 변수를 업데이트하는 Effect를 작성하고 싶을 수 있습니다. 그러나 이는 비효율적입니다. 상태를 업데이트하면 React는 먼저 화면에 무엇이 표시되어야 하는지 계산하기 위해 컴포넌트 함수를 호출합니다. 그런 다음 React는 이러한 변경 사항을 DOM에 ["커밋"](/learn/render-and-commit)하여 화면을 업데이트합니다. 그런 다음 React는 Effects를 실행합니다. Effect가 *즉시* 상태를 업데이트하면 전체 프로세스가 처음부터 다시 시작됩니다! 불필요한 렌더링 패스를 피하려면 컴포넌트의 최상위 수준에서 모든 데이터를 변환하십시오. 이 코드는 props 또는 상태가 변경될 때 자동으로 다시 실행됩니다.
* **사용자 이벤트를 처리하는 데 Effects가 필요하지 않습니다.** 예를 들어, 사용자가 제품을 구매할 때 `/api/buy` POST 요청을 보내고 알림을 표시하려고 한다고 가정해 보겠습니다. 구매 버튼 클릭 이벤트 핸들러에서 무슨 일이 일어났는지 정확히 알 수 있습니다. Effect가 실행될 때는 사용자가 *무엇을* 했는지(예: 어떤 버튼을 클릭했는지) 알 수 없습니다. 이 때문에 일반적으로 해당 이벤트 핸들러에서 사용자 이벤트를 처리합니다.

외부 시스템과 [동기화](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)하려면 Effects가 필요합니다. 예를 들어, jQuery 위젯을 React 상태와 동기화하는 Effect를 작성할 수 있습니다. 또한 Effects를 사용하여 데이터를 가져올 수 있습니다. 예를 들어, 현재 검색 쿼리와 검색 결과를 동기화할 수 있습니다. 최신 [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)는 컴포넌트에서 직접 Effects를 작성하는 것보다 더 효율적인 내장 데이터 가져오기 메커니즘을 제공한다는 점을 기억하십시오.

올바른 직관을 얻기 위해 몇 가지 일반적인 구체적인 예를 살펴보겠습니다!

### props 또는 상태를 기반으로 상태 업데이트 {/*updating-state-based-on-props-or-state*/}

두 개의 상태 변수 `firstName`과 `lastName`이 있는 컴포넌트가 있다고 가정해 보겠습니다. 이들을 연결하여 `fullName`을 계산하고 싶습니다. 또한 `firstName` 또는 `lastName`이 변경될 때마다 `fullName`이 업데이트되기를 원합니다. 첫 번째 본능은 `fullName` 상태 변수를 추가하고 Effect에서 업데이트하는 것입니다:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 피해야 할 것: 중복 상태 및 불필요한 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

이것은 필요 이상으로 복잡합니다. 또한 비효율적입니다: `fullName`의 오래된 값으로 전체 렌더링 패스를 수행한 다음 업데이트된 값으로 즉시 다시 렌더링합니다. 상태 변수와 Effect를 제거하십시오:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 좋음: 렌더링 중에 계산됨
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**기존 props 또는 상태에서 계산할 수 있는 경우, [상태에 넣지 마십시오.](/learn/choosing-the-state-structure#avoid-redundant-state) 대신 렌더링 중에 계산하십시오.** 이렇게 하면 코드가 더 빨라지고(추가 "연쇄" 업데이트를 피함), 더 간단해지며(코드가 줄어듦), 오류 발생 가능성이 줄어듭니다(다른 상태 변수 간의 동기화 문제를 피함). 이 접근 방식이 새롭게 느껴진다면, [React 사고하기](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)에서 상태에 무엇을 넣어야 하는지 설명합니다.

### 비용이 많이 드는 계산 캐시하기 {/*caching-expensive-calculations*/}

이 컴포넌트는 props로 받은 `todos`를 `filter` prop에 따라 필터링하여 `visibleTodos`를 계산합니다. 결과를 상태에 저장하고 Effect에서 업데이트하고 싶을 수 있습니다:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 피해야 할 것: 중복 상태 및 불필요한 Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

앞의 예와 마찬가지로 이것은 불필요하고 비효율적입니다. 먼저 상태와 Effect를 제거하십시오:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ getFilteredTodos()가 느리지 않다면 괜찮습니다.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

일반적으로 이 코드는 괜찮습니다! 그러나 `getFilteredTodos()`가 느리거나 `todos`가 많을 수 있습니다. 이 경우 `newTodo`와 같은 관련 없는 상태 변수가 변경되었을 때 `getFilteredTodos()`를 다시 계산하고 싶지 않습니다.

비용이 많이 드는 계산을 [`useMemo`](/reference/react/useMemo) Hook으로 래핑하여 캐시할 수 있습니다:

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ todos 또는 filter가 변경되지 않는 한 다시 실행되지 않음
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

또는 한 줄로 작성된 경우:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ todos 또는 filter가 변경되지 않는 한 getFilteredTodos()를 다시 실행하지 않음
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**이것은 `todos` 또는 `filter`가 변경되지 않는 한 내부 함수가 다시 실행되지 않기를 원한다고 React에 알립니다.** React는 초기 렌더링 동안 `getFilteredTodos()`의 반환 값을 기억합니다. 다음 렌더링 동안 `todos` 또는 `filter`가 다른지 확인합니다. 마지막과 동일하면 `useMemo`는 저장된 마지막 결과를 반환합니다. 그러나 다르면 React는 내부 함수를 다시 호출하고(그리고 그 결과를 저장합니다).

[`useMemo`](/reference/react/useMemo)로 래핑한 함수는 렌더링 중에 실행되므로 [순수 계산](/learn/keeping-components-pure)에만 작동합니다.

<DeepDive>

#### 계산이 비용이 많이 드는지 확인하는 방법? {/*how-to-tell-if-a-calculation-is-expensive*/}

일반적으로 수천 개의 객체를 생성하거나 반복하지 않는 한 비용이 많이 들지 않을 가능성이 큽니다. 더 확신을 얻고 싶다면 코드 조각에서 소요된 시간을 측정하기 위해 콘솔 로그를 추가할 수 있습니다:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

측정하려는 상호작용을 수행하십시오(예: 입력에 입력하기). 그런 다음 콘솔에서 `filter array: 0.15ms`와 같은 로그를 볼 수 있습니다. 전체 기록된 시간이 상당한 양(예: `1ms` 이상)으로 합산되면 해당 계산을 메모이제이션하는 것이 좋습니다. 실험으로 계산을 `useMemo`로 래핑하여 해당 상호작용에 대한 총 기록된 시간이 감소했는지 확인할 수 있습니다:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // todos와 filter가 변경되지 않은 경우 건너뜀
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo`는 *첫 번째* 렌더링을 더 빠르게 만들지 않습니다. 업데이트 시 불필요한 작업을 건너뛰는 데만 도움이 됩니다.

사용자의 기계가 아마도 사용자보다 더 빠르기 때문에 인위적인 지연을 통해 성능을 테스트하는 것이 좋습니다. 예를 들어, Chrome은 이를 위한 [CPU 제한](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 옵션을 제공합니다.

또한 개발 중 성능을 측정하는 것은 가장 정확한 결과를 제공하지 않습니다. (예를 들어, [Strict Mode](/reference/react/StrictMode)가 켜져 있으면 각 컴포넌트가 한 번이 아닌 두 번 렌더링됩니다.) 가장 정확한 타이밍을 얻으려면 앱을 프로덕션용으로 빌드하고 사용자가 사용하는 장치에서 테스트하십시오.

</DeepDive>

### prop이 변경될 때 모든 상태 재설정 {/*resetting-all-state-when-a-prop-changes*/}

이 `ProfilePage` 컴포넌트는 `userId` prop을 받습니다. 페이지에는 댓글 입력란이 있으며, `comment` 상태 변수를 사용하여 값을 유지합니다. 어느 날, 한 프로필에서 다른 프로필로 이동할 때 `comment` 상태가 재설정되지 않는 문제를 발견합니다. 결과적으로 잘못된 사용자의 프로필에 댓글을 실수로 게시하기 쉽습니다. 이 문제를 해결하려면 `userId`가 변경될 때마다 `comment` 상태 변수를 지우고 싶습니다:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 피해야 할 것: Effect에서 prop 변경 시 상태 재설정
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

이것은 비효율적입니다. `ProfilePage`와 그 자식들은 먼저 오래된 값으로 렌더링되고, 그런 다음 다시 렌더링됩니다. 또한 `ProfilePage` 내부에 상태가 있는 *모든* 컴포넌트에서 이를 수행해야 하기 때문에 복잡합니다. 예를 들어, 댓글 UI가 중첩된 경우 중첩된 댓글 상태도 지우고 싶을 것입니다.

대신 각 사용자의 프로필이 개념적으로 _다른_ 프로필임을 React에 알리고 명시적인 키를 부여할 수 있습니다. 컴포넌트를 두 개로 나누고 외부 컴포넌트에서 내부 컴포넌트로 `key` 속성을 전달하십시오:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ 이 아래의 모든 상태는 키 변경 시 자동으로 재설정됩니다.
  const [comment, setComment] = useState('');
  // ...
}
```

일반적으로 React는 동일한 위치에 동일한 컴포넌트를 렌더링할 때 상태를 유지합니다. **`userId`를 `Profile` 컴포넌트에 `key`로 전달함으로써, React에게 다른 `userId`를 가진 두 개의 `Profile` 컴포넌트를 상태를 공유하지 않는 두 개의 다른 컴포넌트로 취급하도록 요청하는 것입니다.** 키(여기서는 `userId`로 설정됨)가 변경될 때마다 React는 `Profile` 컴포넌트와 그 자식 컴포넌트의 상태를 재설정하고 DOM을 다시 생성합니다. 이제 프로필 간에 탐색할 때 `comment` 필드가 자동으로 지워집니다.

이 예에서 외부 `ProfilePage` 컴포넌트만 프로젝트의 다른 파일에 내보내지고 표시된다는 점에 유의하십시오. `ProfilePage`를 렌더링하는 컴포넌트는 `key`를 전달할 필요가 없습니다: `userId`를 일반 prop으로 전달합니다. `ProfilePage`가 내부 `Profile` 컴포넌트에 `key`로 전달하는 것은 구현 세부 사항입니다.

### prop이 변경될 때 일부 상태 조정 {/*adjusting-some-state-when-a-prop-changes*/}

때때로 prop 변경 시 상태의 일부를 재설정하거나 조정하고 싶을 수 있습니다.

이 `List` 컴포넌트는 `items`라는 prop으로 항목 목록을 받고, `selection` 상태 변수에 선택된 항목을 유지합니다. `items` prop이 다른 배열을 받을 때 `selection`을 `null`로 재설정하려고 합니다:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 피해야 할 것: Effect에서 prop 변경 시 상태 조정
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

이것도 이상적이지 않습니다. `items`가 변경될 때마다 `List`와 그 자식 컴포넌트는 먼저 오래된 `selection` 값으로 렌더링됩니다. 그런 다음 React는 DOM을 업데이트하고 Effects를 실행합니다. 마지막으로 `setSelection(null)` 호출은 `List`와 그 자식 컴포넌트를 다시 렌더링하여 이 전체 프로세스를 다시 시작합니다.

Effect를 삭제하십시오. 대신 렌더링 중에 상태를 직접 조정하십시오:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 더 나은 방법: 렌더링 중에 상태 조정
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[이전 렌더링의 정보 저장](/reference/react/useState#storing-information-from-previous-renders)은 이해하기 어려울 수 있지만, Effect에서 동일한 상태를 업데이트하는 것보다 낫습니다. 위의 예에서 `setSelection`은 렌더링 중에 직접 호출됩니다. React는 `return` 문으로 종료된 직후 `List`를 *즉시* 다시 렌더링합니다. React는 아직 `List` 자식들을 렌더링하거나 DOM을 업데이트하지 않았으므로 `List` 자식들이 오래된 `selection` 값을 렌더링하는 것을 건너뛸 수 있습니다.

렌더링 중에 컴포넌트를 업데이트하면 React는 반환된 JSX를 버리고 즉시 렌더링을 다시 시도합니다. 매우 느린 연쇄 재시도를 피하기 위해 React는 렌더링 중에 *동일한* 컴포넌트의 상태만 업데이트할 수 있도록 합니다. 렌더링 중에 다른 컴포넌트의 상태를 업데이트하면 오류가 발생합니다. `items !== prevItems`와 같은 조건은 루프를 피하기 위해 필요합니다. 이렇게 상태를 조정할 수 있지만, DOM 변경 또는 타임아웃 설정과 같은 다른 부작용은 이벤트 핸들러 또는 Effects에 남겨두어 [컴포넌트를 순수하게 유지](/learn/keeping-components-pure)해야 합니다.

**이 패턴이 Effect보다 더 효율적이지만, 대부분의 컴포넌트는 이 패턴이 필요하지 않습니다.** 어떻게 하든지 간에, props 또는 다른 상태를 기반으로 상태를 조정하는 것은 데이터 흐름을 이해하고 디버그하기 어렵게 만듭니다. 항상 [키로 모든 상태를 재설정할 수 있는지](#resetting-all-state-when-a-prop-changes) 또는 [렌더링 중에 모든 것을 계산할 수 있는지](#updating-state-based-on-props-or-state) 확인하십시오. 예를 들어, 선택된 *항목*을 저장하고(및 재설정) 대신 선택된 *항목 ID*를 저장할 수 있습니다:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState
(null);
  // ✅ 최선: 렌더링 중에 모든 것을 계산
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

이제 상태를 "조정"할 필요가 없습니다. 선택된 ID를 가진 항목이 목록에 있으면 선택된 상태로 유지됩니다. 그렇지 않으면 렌더링 중에 계산된 `selection`은 일치하는 항목이 없기 때문에 `null`이 됩니다. 이 동작은 다르지만, 대부분의 `items` 변경이 선택을 유지하기 때문에 더 나은 동작일 수 있습니다.

### 이벤트 핸들러 간에 로직 공유하기 {/*sharing-logic-between-event-handlers*/}

제품 페이지에 두 개의 버튼(구매 및 체크아웃)이 있다고 가정해 보겠습니다. 두 버튼 모두 해당 제품을 구매할 수 있습니다. 사용자가 제품을 장바구니에 넣을 때 알림을 표시하고 싶습니다. 두 버튼의 클릭 핸들러에서 `showNotification()`을 호출하는 것이 반복적으로 느껴질 수 있으므로 이 로직을 Effect에 넣고 싶을 수 있습니다:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 피해야 할 것: 이벤트별 로직을 Effect 내부에 넣기
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`${product.name}이(가) 장바구니에 추가되었습니다!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

이 Effect는 불필요합니다. 또한 버그를 유발할 가능성이 큽니다. 예를 들어, 앱이 페이지를 새로 고침할 때 장바구니를 "기억"한다고 가정해 보겠습니다. 제품을 한 번 장바구니에 추가하고 페이지를 새로 고침하면 알림이 다시 나타납니다. 해당 제품의 페이지를 새로 고칠 때마다 계속 나타납니다. 이는 페이지 로드 시 `product.isInCart`가 이미 `true`이기 때문에 위의 Effect가 `showNotification()`을 호출하기 때문입니다.

**코드가 Effect에 있어야 하는지 이벤트 핸들러에 있어야 하는지 확실하지 않은 경우, 이 코드가 실행되어야 하는 *이유*를 자문해 보십시오. 컴포넌트가 사용자에게 표시되었기 때문에 실행되어야 하는 코드에만 Effects를 사용하십시오.** 이 예에서는 알림이 표시되어야 하는 이유가 사용자가 *버튼을 눌렀기 때문*이지 페이지가 표시되었기 때문이 아닙니다! Effect를 삭제하고 공유 로직을 두 이벤트 핸들러에서 호출되는 함수에 넣으십시오:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ 좋음: 이벤트별 로직이 이벤트 핸들러에서 호출됨
  function buyProduct() {
    addToCart(product);
    showNotification(`${product.name}이(가) 장바구니에 추가되었습니다!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

이렇게 하면 불필요한 Effect가 제거되고 버그가 수정됩니다.

### POST 요청 보내기 {/*sending-a-post-request*/}

이 `Form` 컴포넌트는 두 가지 종류의 POST 요청을 보냅니다. 마운트될 때 분석 이벤트를 보냅니다. 양식을 작성하고 제출 버튼을 클릭하면 `/api/register` 엔드포인트에 POST 요청을 보냅니다:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 좋음: 이 로직은 컴포넌트가 표시되었기 때문에 실행되어야 합니다.
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 피해야 할 것: 이벤트별 로직을 Effect 내부에 넣기
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

앞의 예와 동일한 기준을 적용해 보겠습니다.

분석 POST 요청은 Effect에 남아 있어야 합니다. 이는 양식이 표시되었기 때문에 분석 이벤트를 보내야 하기 때문입니다. (개발 중에는 두 번 실행되지만, [여기](/learn/synchronizing-with-effects#sending-analytics)에서 이를 처리하는 방법을 참조하십시오.)

그러나 `/api/register` POST 요청은 양식이 *표시되었기* 때문에 발생하는 것이 아닙니다. 특정 순간에만 요청을 보내고 싶습니다: 사용자가 버튼을 눌렀을 때. 특정 상호작용에서만 발생해야 합니다. 두 번째 Effect를 삭제하고 해당 POST 요청을 이벤트 핸들러로 이동하십시오:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 좋음: 이 로직은 컴포넌트가 표시되었기 때문에 실행됩니다.
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ 좋음: 이벤트별 로직이 이벤트 핸들러에 있습니다.
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

로직을 이벤트 핸들러에 넣을지 Effect에 넣을지 선택할 때, 사용자의 관점에서 *어떤 종류의 로직*인지가 주요 질문입니다. 이 로직이 특정 상호작용에 의해 발생하는 경우, 이벤트 핸들러에 유지하십시오. 사용자가 컴포넌트를 화면에서 *보았기* 때문에 발생하는 경우, Effect에 유지하십시오.

### 계산 체인 {/*chains-of-computations*/}

때때로 각 상태를 다른 상태에 따라 조정하는 Effect 체인을 작성하고 싶을 수 있습니다:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 피해야 할 것: 서로를 트리거하기 위해 상태를 조정하는 Effect 체인
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

이 코드에는 두 가지 문제가 있습니다.

하나는 매우 비효율적이라는 것입니다: 체인에서 각 `set` 호출 사이에 컴포넌트(및 자식들)가 다시 렌더링되어야 합니다. 위의 예에서 최악의 경우(`setCard` → 렌더링 → `setGoldCardCount` → 렌더링 → `setRound` → 렌더링 → `setIsGameOver` → 렌더링) 트리 아래의 세 번의 불필요한 다시 렌더링이 발생합니다.

느리지 않더라도 코드가 발전함에 따라 작성한 "체인"이 새로운 요구 사항에 맞지 않는 경우가 발생할 것입니다. 게임 이동의 역사를 단계별로 볼 수 있는 방법을 추가한다고 상상해 보십시오. 각 상태 변수를 과거의 값으로 업데이트하여 수행할 것입니다. 그러나 `card` 상태를 과거의 값으로 설정하면 Effect 체인이 다시 트리거되어 표시하는 데이터가 변경됩니다. 이러한 코드는 종종 경직되고 취약합니다.

이 경우 렌더링 중에 계산할 수 있는 것을 계산하고 이벤트 핸들러에서 상태를 조정하는 것이 좋습니다:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ 렌더링 중에 계산할 수 있는 것을 계산
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ 이벤트 핸들러에서 모든 다음 상태를 계산
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

이것은 훨씬 더 효율적입니다. 또한 게임 역사를 볼 수 있는 방법을 구현하면 이제 Effect 체인을 트리거하지 않고 각 상태 변수를 과거의 이동으로 설정할 수 있습니다. 여러 이벤트 핸들러 간에 로직을 재사용해야 하는 경우, [함수를 추출](#sharing-logic-between-event-handlers)하고 해당 핸들러에서 호출할 수 있습니다.

이벤트 핸들러 내부에서 [상태는 스냅샷처럼 동작](/learn/state-as-a-snapshot)한다는 점을 기억하십시오. 예를 들어, `setRound(round + 1)`을 호출한 후에도 `round` 변수는 사용자가 버튼을 클릭한 시점의 값을 반영합니다. 계산에 다음 값을 사용해야 하는 경우, `const nextRound = round + 1`과 같이 수동으로 정의하십시오.

일부 경우에는 이벤트 핸들러에서 직접 다음 상태를 계산할 수 없습니다. 예를 들어, 이전 드롭다운의 선택된 값에 따라 다음 드롭다운의 옵션이 달라지는 여러 드롭다운이 있는 양식을 상상해 보십시오. 그런 경우, 네트워크와 동기화하기 때문에 Effect 체인이 적절합니다.

### 애플리케이션 초기화 {/*initializing-the-application*/}

일부 로직은 앱이 로드될 때 한 번만 실행되어야 합니다.

최상위 컴포넌트의 Effect에 넣고 싶을 수 있습니다:

```js {2-6}
function App() {
  // 🔴 피해야 할 것: 한 번만 실행되어야 하는 로직이 있는 Effects
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

그러나 개발 중에 [두 번 실행된다는 것을](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) 빠르게 발견할 것입니다. 이는 문제를 일으킬 수 있습니다. 예를 들어, 함수가 두 번 호출되도록 설계되지 않은 경우 인증 토큰을 무효화할 수 있습니다. 일반적으로 컴포넌트는 다시 마운트되는 것에 대해 탄력적이어야 합니다. 여기에는 최상위 `App` 컴포넌트도 포함됩니다.

실제로 프로덕션에서 다시 마운트되지 않을 수 있지만, 모든 컴포넌트에서 동일한 제약을 따르는 것은 코드 이동 및 재사용을 더 쉽게 만듭니다. *앱 로드당 한 번* 실행되어야 하는 로직이 *컴포넌트 마운트당 한 번* 실행되어야 하는 로직이 아니라면, 이미 실행되었는지 추적하기 위해 최상위 변수를 추가하십시오:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ 앱 로드당 한 번만 실행됨
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

또는 모듈 초기화 중에 앱이 렌더링되기 전에 실행할 수 있습니다:

```js {1,5}
if (typeof window !== 'undefined') { // 브라우저에서 실행 중인지 확인합니다.
   // ✅ 앱 로드당 한 번만 실행됨
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

최상위 코드가 컴포넌트가 가져올 때 한 번 실행됩니다. 렌더링되지 않더라도. 임의의 컴포넌트를 가져올 때 느려지거나 놀라운 동작을 피하기 위해 이 패턴을 과도하게 사용하지 마십시오. 앱 전체 초기화 로직을 `App.js`와 같은 루트 컴포넌트 모듈이나 애플리케이션의 진입점에 유지하십시오.

### 상태 변경에 대해 부모 컴포넌트에 알리기 {/*notifying-parent-components-about-state-changes*/}

`isOn` 상태가 `true` 또는 `false`일 수 있는 내부 `isOn` 상태를 가진 `Toggle` 컴포넌트를 작성한다고 가정해 보겠습니다. 클릭하거나 드래그하여 토글할 수 있는 몇 가지 방법이 있습니다. `Toggle` 내부 상태가 변경될 때마다 부모 컴포넌트에 알리고 싶습니다. 그래서 `onChange` 이벤트를 노출하고 Effect에서 호출합니다:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 피해야 할 것: onChange 핸들러가 너무 늦게 실행됨
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

앞서와 마찬가지로, 이것은 이상적이지 않습니다. `Toggle`은 먼저 상태를 업데이트하고, React는 화면을 업데이트합니다. 그런 다음 React는 Effect를 실행하여 부모 컴포넌트에서 전달된 `onChange` 함수를 호출합니다. 이제 부모 컴포넌트는 자신의 상태를 업데이트하여 또 다른 렌더링 패스를 시작합니다. 한 번에 모든 작업을 수행하는 것이 좋습니다.

Effect를 삭제하고 이벤트 핸들러 내에서 *두* 컴포넌트의 상태를 업데이트하십시오:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ 좋음: 이벤트를 발생시킨 동안 모든 업데이트 수행
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

이 접근 방식에서는 `Toggle` 컴포넌트와 부모 컴포넌트가 이벤트 동안 상태를 업데이트합니다. React는 [다른 컴포넌트의 업데이트를 일괄 처리](/learn/queueing-a-series-of-state-updates)하므로 렌더링 패스는 한 번만 발생합니다.

상태를 완전히 제거하고 부모 컴포넌트에서 `isOn`을 받는 것도 가능합니다:

```js {1,2}
// ✅ 또한 좋음: 컴포넌트가 부모에 의해 완전히 제어됨
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["상태 올리기"](/learn/sharing-state-between-components)를 통해 부모 컴포넌트가 자신의 상태를 토글하여 `Toggle`을 완전히 제어할 수 있습니다. 이는 부모 컴포넌트가 더 많은 로직을 포함해야 함을 의미하지만, 전체적으로 걱정할 상태가 줄어듭니다. 서로 다른 컴포넌트의 두 상태 변수를 동기화하려고 할 때마다 상태를 올리는 것을 고려하십시오!

### 부모에게 데이터 전달하기 {/*passing-data-to-the-parent*/}

이 `Child` 컴포넌트는 일부 데이터를 가져온 다음 Effect에서 `Parent` 컴포넌트에 전달합니다:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 피해야 할 것: Effect에서 부모에게 데이터 전달
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

React에서는 데이터가 부모 컴포넌트에서 자식 컴포넌트로 흐릅니다. 화면에 잘못된 것이 보이면, 정보가 어디에서 왔는지 추적할 수 있습니다. 잘못된 prop을 전달하거나 잘못된 상태를 가진 컴포넌트를 찾을 때까지 컴포넌트 체인을 따라 올라갑니다. 자식 컴포넌트가 Effect에서 부모 컴포넌트의 상태를 업데이트하면 데이터 흐
름을 추적하기가 매우 어려워집니다. 자식 컴포넌트와 부모 컴포넌트가 동일한 데이터를 필요로 하는 경우, 부모 컴포넌트가 해당 데이터를 가져오고 *자식에게 전달*하도록 하십시오:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ 좋음: 자식에게 데이터를 전달
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

이것은 더 간단하고 데이터 흐름을 예측 가능하게 유지합니다: 데이터는 부모에서 자식으로 흐릅니다.

### 외부 스토어 구독 {/*subscribing-to-an-external-store*/}

때때로 컴포넌트는 React 상태 외부의 일부 데이터에 구독해야 할 수 있습니다. 이 데이터는 서드파티 라이브러리 또는 내장 브라우저 API에서 올 수 있습니다. 이 데이터는 React의 인식 없이 변경될 수 있으므로, 수동으로 컴포넌트를 구독해야 합니다. 이는 종종 Effect로 수행됩니다. 예를 들어:

```js {2-17}
function useOnlineStatus() {
  // 이상적이지 않음: Effect에서 수동 스토어 구독
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

여기서 컴포넌트는 외부 데이터 스토어(이 경우 브라우저 `navigator.onLine` API)에 구독합니다. 이 API는 서버에 존재하지 않으므로(따라서 초기 HTML에는 사용할 수 없음), 초기 상태는 `true`로 설정됩니다. 브라우저에서 해당 데이터 스토어의 값이 변경될 때마다 컴포넌트는 상태를 업데이트합니다.

이것은 일반적으로 Effect를 사용하여 수행되지만, React에는 외부 스토어에 구독하기 위한 목적에 맞는 Hook이 있습니다. Effect를 삭제하고 [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 호출로 대체하십시오:

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ 좋음: 내장 Hook으로 외부 스토어에 구독
  return useSyncExternalStore(
    subscribe, // 동일한 함수를 전달하는 한 React는 다시 구독하지 않습니다.
    () => navigator.onLine, // 클라이언트에서 값을 얻는 방법
    () => true // 서버에서 값을 얻는 방법
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

이 접근 방식은 Effect로 가변 데이터를 React 상태와 수동으로 동기화하는 것보다 오류가 적습니다. 일반적으로 `useOnlineStatus()`와 같은 커스텀 Hook을 작성하여 개별 컴포넌트에서 이 코드를 반복할 필요가 없도록 합니다. [React 컴포넌트에서 외부 스토어에 구독하는 방법에 대해 자세히 알아보십시오.](/reference/react/useSyncExternalStore)

### 데이터 가져오기 {/*fetching-data*/}

많은 앱이 데이터를 가져오기 위해 Effects를 사용합니다. 데이터 가져오기 Effect를 다음과 같이 작성하는 것이 일반적입니다:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 피해야 할 것: 정리 로직 없이 데이터 가져오기
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

이 데이터를 이벤트 핸들러로 이동할 필요는 없습니다.

이전 예제에서 로직을 이벤트 핸들러에 넣어야 했던 것과 모순처럼 보일 수 있습니다! 그러나 *타이핑 이벤트*가 데이터를 가져오는 주된 이유가 아니라는 점을 고려하십시오. 검색 입력은 종종 URL에서 미리 채워지며, 사용자는 입력을 건드리지 않고 뒤로 및 앞으로 탐색할 수 있습니다.

`page`와 `query`가 어디에서 왔는지는 중요하지 않습니다. 이 컴포넌트가 표시되는 동안, 현재 `page`와 `query`에 대한 데이터를 네트워크에서 가져와 `results`를 [동기화](/learn/synchronizing-with-effects)하고 싶습니다. 이것이 Effect인 이유입니다.

그러나 위의 코드에는 버그가 있습니다. "hello"를 빠르게 입력한다고 상상해 보십시오. 그러면 `query`는 "h", "he", "hel", "hell", "hello"로 변경됩니다. 이는 별도의 fetch를 시작하지만, 응답이 도착하는 순서에 대한 보장은 없습니다. 예를 들어, "hell" 응답이 "hello" 응답 *후에* 도착할 수 있습니다. 마지막으로 `setResults()`를 호출하므로 잘못된 검색 결과를 표시하게 됩니다. 이를 "경쟁 조건"(race condition)이라고 합니다: 두 개의 다른 요청이 서로 "경쟁"하여 예상과 다른 순서로 도착했습니다.

**경쟁 조건을 해결하려면 정리 함수를 추가하여 오래된 응답을 무시해야 합니다:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

이렇게 하면 Effect가 데이터를 가져올 때 마지막으로 요청된 응답을 제외한 모든 응답이 무시됩니다.

경쟁 조건을 처리하는 것만이 데이터 가져오기를 구현하는 데 어려운 점은 아닙니다. 응답을 캐시하여(사용자가 뒤로 클릭하면 이전 화면이 즉시 표시되도록), 서버에서 데이터를 가져오는 방법(초기 서버 렌더링된 HTML이 스피너 대신 가져온 콘텐츠를 포함하도록), 네트워크 워터폴을 피하는 방법(모든 부모가 기다리지 않고 자식이 데이터를 가져올 수 있도록)도 고려해야 할 수 있습니다.

**이 문제는 React뿐만 아니라 모든 UI 라이브러리에 적용됩니다. 이를 해결하는 것은 간단하지 않기 때문에 최신 [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)는 Effect에서 데이터를 가져오는 것보다 더 효율적인 내장 데이터 가져오기 메커니즘을 제공합니다.**

프레임워크를 사용하지 않거나(또는 자체적으로 구축하지 않으려는 경우) Effect에서 데이터를 가져오는 것을 더 편리하게 만들고 싶다면, 다음 예제와 같이 커스텀 Hook으로 가져오기 로직을 추출하는 것을 고려하십시오:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

오류 처리 로직을 추가하고 콘텐츠가 로드 중인지 추적하는 로직도 추가하고 싶을 것입니다. 이러한 Hook을 직접 작성하거나 React 생태계에서 이미 사용 가능한 솔루션 중 하나를 사용할 수 있습니다. **이것만으로는 프레임워크의 내장 데이터 가져오기 메커니즘을 사용하는 것만큼 효율적이지 않지만, 커스텀 Hook으로 데이터 가져오기 로직을 이동하면 나중에 효율적인 데이터 가져오기 전략을 채택하기가 더 쉬워집니다.**

일반적으로, Effect를 작성해야 할 때마다, `useData`와 같은 더 선언적이고 목적에 맞는 API를 가진 커스텀 Hook으로 기능을 추출할 수 있는지 주의하십시오. 컴포넌트에서 원시 `useEffect` 호출이 적을수록 애플리케이션을 유지 관리하기가 더 쉬워질 것입니다.

<Recap>

- 렌더링 중에 무언가를 계산할 수 있다면, Effect가 필요하지 않습니다.
- 비용이 많이 드는 계산을 캐시하려면 `useEffect` 대신 `useMemo`를 추가하십시오.
- 전체 컴포넌트 트리의 상태를 재설정하려면 다른 `key`를 전달하십시오.
- prop 변경에 응답하여 특정 상태를 재설정하려면 렌더링 중에 설정하십시오.
- 컴포넌트가 *표시되었기* 때문에 실행되는 코드는 Effects에 있어야 하고, 나머지는 이벤트에 있어야 합니다.
- 여러 컴포넌트의 상태를 업데이트해야 하는 경우, 단일 이벤트 동안 업데이트하는 것이 좋습니다.
- 서로 다른 컴포넌트의 상태 변수를 동기화하려고 할 때마다 상태를 올리는 것을 고려하십시오.
- Effect로 데이터를 가져올 수 있지만, 경쟁 조건을 피하기 위해 정리를 구현해야 합니다.

</Recap>

<Challenges>

#### Effects 없이 데이터 변환 {/*transform-data-without-effects*/}

아래의 `TodoList`는 할 일 목록을 표시합니다. "활성 할 일만 표시" 체크박스를 선택하면 완료된 할 일이 목록에 표시되지 않습니다. 표시되는 할 일과 상관없이, 푸터는 아직 완료되지 않은 할 일의 수를 표시합니다.

모든 불필요한 상태와 Effects를 제거하여 이 컴포넌트를 단순화하십시오.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

렌더링 중에 무언가를 계산할 수 있다면, 상태나 이를 업데이트하는 Effect가 필요하지 않습니다.

</Hint>

<Solution>

이 예제에서 필수적인 상태는 두 가지뿐입니다: `todos` 목록과 체크박스가 선택되었는지를 나타내는 `showActive` 상태 변수입니다. 나머지 상태 변수는 [중복](/learn/choosing-the-state-structure#avoid-redundant-state)이며, 대신 렌더링 중에 계산할 수 있습니다. 여기에는 푸터도 포함되며, 이를 주변 JSX로 직접 이동할 수 있습니다.

결과는 다음과 같아야 합니다:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Effects 없이 계산 캐시하기 {/*cache-a-calculation-without-effects*/}

이 예제에서는 할 일을 필터링하는 작업이 `getVisibleTodos()`라는 별도의 함수로 추출되었습니다. 이 함수에는 호출될 때마다 로그를 출력하는 `console.log()` 호출이 포함되어 있습니다. "활성 할 일만 표시"를 토글하면 `getVisibleTodos()`가 다시 실행됩니다. 이는 표시할 할 일이 변경되기 때문에 예상된 것입니다.

당신의 과제는 `TodoList` 컴포넌트에서 `visibleTodos` 목록을 다시 계산하는 Effect를 제거하는 것입니다. 그러나 `getVisibleTodos()`가 다시 실행되지 않도록(따라서 로그가 출력되지 않도록) 해야 합니다.

<Hint>

하나의 해결책은 `useMemo` 호출을 추가하여 표시할 할 일을 캐시하는 것입니다. 또 다른 덜 명백한 해결책도 있습니다.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos()가 ${++calls}번 호출되었습니다`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block;}
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

상태 변수와 Effect를 제거하고, 대신 `getVisibleTodos()` 호출 결과를 캐시하기 위해 `useMemo` 호출을 추가하십시오:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos()가 ${++calls}번 호출되었습니다`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

이 변경으로 `getVisibleTodos()`는 `todos` 또는 `showActive`가 변경되지 않는 한 호출되지 않습니다. 입력에 입력하는 것은 `text` 상태 변수만 변경하므로 `getVisibleTodos()` 호출을 트리거하지 않습니다.

또한 `useMemo`가 필요 없는 또 다른 해결책도 있습니다. `text` 상태 변수가 할 일 목록에 영향을 미칠 수 없으므로, `NewTodo` 폼을 별도의 컴포넌트로 추출하고 `text` 상태 변수를 내부로 이동할 수 있습니다:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos()가 ${++calls}번 호출되었습니다`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

이 접근 방식도 요구 사항을 충족합니다. 입력에 입력할 때 `text` 상태 변수만 업데이트됩니다. `text` 상태 변수가 자식 `NewTodo` 컴포넌트에 있으므로 부모 `TodoList` 컴포넌트는 다시 렌더링되지 않습니다. 이 때문에 `getVisibleTodos()`는 입력할 때 호출되지 않습니다. (다른 이유로 `TodoList`가 다시 렌더링되면 여전히 호출됩니다.)

</Solution>

#### Effects 없이 상태 재설정 {/*reset-state-without-effects*/}

이 `EditContact` 컴포넌트는 `savedContact` prop으로 `{ id, name, email }` 형식의 연락처 객체를 받습니다. 이름과 이메일 입력 필드를 편집해 보십시오. 저장을 누르면 양식 위의 연락처 버튼이 편집된 이름으로 업데이트됩니다. 재설정을 누르면 양식의 모든 대기 중인 변경 사항이 취소됩니다. 이 UI를 사용해 보면서 익숙해지십시오.

상단의 버튼으로 연락처를 선택하면 양식이 해당 연락처의 세부 정보로 재설정됩니다. 이는 `EditContact.js` 내부의 Effect로 수행됩니다. 이 Effect를 제거하십시오. `savedContact.id`가 변경될 때 양식을 재설정하는 다른 방법을 찾으십시오.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

`savedContact.id`가 다를 때 React에게 `EditContact` 양식이 개념적으로 _다른 연락처의 양식_이며 상태를 유지하지 않아야 한다고 알릴 수 있는 방법이 있으면 좋을 것입니다. 그런 방법이 기억나십니까?

</Hint>

<Solution>

`EditContact` 컴포넌트를 두 개로 나누십시오. 모든 양식 상태를 내부 `EditForm` 컴포넌트로 이동하십시오. 외부 `EditContact` 컴포넌트를 내보내고, `savedContact.id`를 내부 `EditForm` 컴포넌트에 `key`로 전달하십시오. 결과적으로, 내부 `EditForm` 컴포넌트는 다른 연락처를 선택할 때마다 모든 양식 상태를 재설정하고 DOM을 다시 생성합니다.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Effects 없이 양식 제출하기 {/*submit-a-form-without-effects*/}

이 `Form` 컴포넌트는 친구에게 메시지를 보낼 수 있게 합니다. 양식을 제출하면 `showForm` 상태 변수가 `false`로 설정됩니다. 이는 `sendMessage(message)`를 호출하는 Effect를 트리거하여 메시지를 보냅니다(콘솔에서 확인할 수 있습니다). 메시지가 전송된 후 "감사합니다" 대화 상자가 표시되며, "채팅 열기" 버튼을 클릭하면 다시 양식으로 돌아갈 수 있습니다.

사용자가 너무 많은 메시지를 보내고 있습니다. 채팅을 조금 더 어렵게 만들기 위해, 양식 대신 먼저 "감사합니다" 대화 상자를 표시하기로 결정했습니다. `showForm` 상태 변수를 `true` 대신 `false`로 초기화하십시오. 이 변경을 하자마자 콘솔에 빈 메시지가 전송되었다는 메시지가 표시됩니다. 이 논리에는 뭔가 잘못되었습니다!

이 문제의 근본 원인은 무엇입니까? 그리고 어떻게 해결할 수 있습니까?

<Hint>

메시지는 사용자가 "감사합니다" 대화 상자를 보았기 때문에 전송되어야 합니까? 아니면 그 반대입니까?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` 상태 변수는 양식 또는 "감사합니다" 대화 상자를 표시할지 여부를 결정합니다. 그러나 메시지를 보내는 이유는 "감사합니다" 대화 상자가 *표시되었기* 때문이 아닙니다. 메시지를 보내는 이유는 사용자가 *양식을 제출했기* 때문입니다. 오해의 소지가 있는 Effect를 삭제하고 `sendMessage` 호출을 `handleSubmit` 이벤트 핸들러로 이동하십시오:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

이 버전에서는 *양식을 제출하는 것*만이 메시지를 보내는 원인이 됩니다. `showForm`이 처음에 `true` 또는 `false`로 설정되었는지에 관계없이 동일하게 작동합니다. (이를 `false`로 설정하고 추가 콘솔 메시지가 없는지 확인하십시오.)

</Solution>

</Challenges>