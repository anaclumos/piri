---
title: 컴포넌트와 훅은 순수해야 합니다
---

<Intro>
순수 함수는 계산만 수행하고 그 외에는 아무것도 하지 않습니다. 이는 코드를 이해하고 디버그하기 쉽게 만들며, React가 자동으로 컴포넌트와 Hooks를 올바르게 최적화할 수 있게 합니다.
</Intro>

<Note>
이 참조 페이지는 고급 주제를 다루며 [컴포넌트를 순수하게 유지하기](/learn/keeping-components-pure) 페이지에서 다룬 개념에 익숙해야 합니다.
</Note>

<InlineToc />

### 순수성이 왜 중요한가요? {/*why-does-purity-matter*/}

React를 _React_답게 만드는 핵심 개념 중 하나는 _순수성_입니다. 순수한 컴포넌트나 훅은 다음과 같습니다:

* **멱등성** – 동일한 입력값(컴포넌트의 경우 props, state, context; 훅의 경우 인자)으로 실행할 때마다 [항상 동일한 결과를 얻습니다](/learn/keeping-components-pure#purity-components-as-formulas).
* **렌더링 시 부작용이 없음** – 부작용이 있는 코드는 [**렌더링과 별도로**](#how-does-react-run-your-code) 실행되어야 합니다. 예를 들어, 사용자가 UI와 상호작용하여 업데이트를 유발하는 [이벤트 핸들러](/learn/responding-to-events)나 렌더링 후 실행되는 [Effect](/reference/react/useEffect) 등이 있습니다.
* **비지역 값을 변경하지 않음**: 컴포넌트와 훅은 렌더링 시 [로컬에서 생성되지 않은 값을 절대 수정하지 않아야 합니다](#mutation).

렌더링이 순수하게 유지되면, React는 사용자가 먼저 볼 수 있는 업데이트의 우선순위를 이해할 수 있습니다. 이는 렌더링 순수성 덕분에 가능합니다: 컴포넌트가 [렌더링 시](#how-does-react-run-your-code) 부작용이 없기 때문에, React는 업데이트가 덜 중요한 컴포넌트의 렌더링을 일시 중지하고 나중에 필요할 때 다시 돌아올 수 있습니다.

구체적으로 말하면, 이는 렌더링 로직이 여러 번 실행될 수 있으며, React가 사용자에게 쾌적한 사용자 경험을 제공할 수 있게 합니다. 그러나 컴포넌트에 추적되지 않은 부작용이 있다면 – 예를 들어, [렌더링 중](#how-does-react-run-your-code) 전역 변수를 수정하는 것과 같은 – React가 렌더링 코드를 다시 실행할 때, 부작용이 원하지 않는 방식으로 트리거되어 예상치 못한 버그가 발생할 수 있습니다. 이는 사용자의 앱 경험을 저하시킬 수 있습니다. [컴포넌트를 순수하게 유지하기 페이지](/learn/keeping-components-pure#side-effects-unintended-consequences)에서 이 예를 볼 수 있습니다.

#### React는 코드를 어떻게 실행하나요? {/*how-does-react-run-your-code*/}

React는 선언적입니다: React에게 _무엇을_ 렌더링할지 말해주면, React는 사용자에게 _어떻게_ 최적으로 표시할지 알아냅니다. 이를 위해 React는 코드를 실행하는 몇 가지 단계가 있습니다. React를 잘 사용하기 위해 이 모든 단계를 알 필요는 없습니다. 하지만 높은 수준에서, _렌더링_에서 어떤 코드가 실행되는지, 그리고 그 외의 코드가 어디서 실행되는지 알아야 합니다.

_렌더링_은 UI의 다음 버전이 어떻게 보여야 하는지를 계산하는 것을 의미합니다. 렌더링 후, [Effects](/reference/react/useEffect)가 _플러시_ (즉, 더 이상 남아 있지 않을 때까지 실행)되고, 레이아웃에 영향을 미치는 경우 계산을 업데이트할 수 있습니다. React는 이 새로운 계산을 사용하여 이전 UI 버전을 생성하는 데 사용된 계산과 비교한 다음, 최신 버전으로 따라잡기 위해 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)에 필요한 최소한의 변경 사항만 _커밋_합니다.

<DeepDive>

#### 렌더링 중 코드가 실행되는지 확인하는 방법 {/*how-to-tell-if-code-runs-in-render*/}

코드가 렌더링 중에 실행되는지 빠르게 확인하는 방법은 코드가 어디에 있는지 확인하는 것입니다: 아래 예제와 같이 최상위 수준에 작성된 경우, 렌더링 중에 실행될 가능성이 큽니다.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // 렌더링 중에 생성됨
  // ...
}
```

이벤트 핸들러와 Effects는 렌더링 중에 실행되지 않습니다:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // 이 코드는 이벤트 핸들러에 있으므로 사용자가 이 코드를 트리거할 때만 실행됩니다.
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // 이 코드는 Effect 내부에 있으므로 렌더링 후에만 실행됩니다.
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## 컴포넌트와 훅은 멱등성을 가져야 합니다 {/*components-and-hooks-must-be-idempotent*/}

컴포넌트는 항상 입력값 – props, state, context –에 대해 동일한 출력을 반환해야 합니다. 이를 _멱등성_이라고 합니다. [멱등성](https://en.wikipedia.org/wiki/Idempotence)은 함수형 프로그래밍에서 대중화된 용어입니다. 이는 동일한 입력값으로 실행할 때마다 [항상 동일한 결과를 얻는다는](learn/keeping-components-pure) 아이디어를 의미합니다.

이는 _모든_ 코드가 [렌더링 중](#how-does-react-run-your-code) 실행될 때도 이 규칙을 유지하기 위해 멱등성을 가져야 한다는 것을 의미합니다. 예를 들어, 이 코드는 멱등성이 아니므로 (따라서 컴포넌트도 멱등성이 아닙니다):

```js {2}
function Clock() {
  const time = new Date(); // 🔴 나쁨: 항상 다른 결과를 반환합니다!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()`는 항상 현재 날짜를 반환하고 호출될 때마다 결과가 변경되므로 멱등성이 아닙니다. 위 컴포넌트를 렌더링하면 화면에 표시된 시간이 컴포넌트가 렌더링된 시간에 고정됩니다. 마찬가지로, `Math.random()`과 같은 함수도 멱등성이 아닙니다. 동일한 입력값으로 호출될 때마다 다른 결과를 반환하기 때문입니다.

이는 `new Date()`와 같은 비멱등성 함수를 _전혀_ 사용하지 말아야 한다는 의미는 아닙니다 – 단지 [렌더링 중](#how-does-react-run-your-code)에는 사용하지 말아야 한다는 것입니다. 이 경우, [Effect](/reference/react/useEffect)를 사용하여 최신 날짜를 이 컴포넌트에 _동기화_할 수 있습니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. 현재 날짜의 상태를 추적합니다. `useState`는 초기 상태로 초기화 함수를 받습니다.
  //    이 함수는 훅이 호출될 때 한 번만 실행되므로, 훅이 호출될 때의 현재 날짜만 처음에 설정됩니다.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. `setInterval`을 사용하여 매초마다 현재 날짜를 업데이트합니다.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ 좋음: 비멱등성 코드가 더 이상 렌더링 중에 실행되지 않습니다.
    }, 1000);
    // 3. `setInterval` 타이머가 누출되지 않도록 정리 함수를 반환합니다.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

비멱등성 `new Date()` 호출을 Effect로 감싸면, 그 계산이 [렌더링 외부](#how-does-react-run-your-code)로 이동합니다.

React와 외부 상태를 동기화할 필요가 없다면, 사용자 상호작용에 응답하여 업데이트해야 하는 경우 [이벤트 핸들러](/learn/responding-to-events)를 사용하는 것도 고려할 수 있습니다.

---

## 부작용은 렌더링 외부에서 실행되어야 합니다 {/*side-effects-must-run-outside-of-render*/}

[부작용](/learn/keeping-components-pure#side-effects-unintended-consequences)은 [렌더링 중](#how-does-react-run-your-code) 실행되지 않아야 합니다. React는 최상의 사용자 경험을 제공하기 위해 컴포넌트를 여러 번 렌더링할 수 있습니다.

<Note>
부작용은 Effect보다 넓은 용어입니다. Effect는 `useEffect`로 감싸진 코드를 의미하는 반면, 부작용은 호출자에게 값을 반환하는 것 외에 관찰 가능한 영향을 미치는 모든 코드를 의미합니다.

부작용은 일반적으로 [이벤트 핸들러](/learn/responding-to-events)나 Effect 내부에 작성됩니다. 하지만 절대 렌더링 중에는 작성되지 않습니다.
</Note>

렌더링은 순수하게 유지되어야 하지만, 부작용은 화면에 무언가를 표시하는 것과 같은 흥미로운 작업을 수행하기 위해 어느 시점에서는 필요합니다. 이 규칙의 핵심은 부작용이 [렌더링 중](#how-does-react-run-your-code) 실행되지 않아야 한다는 것입니다. React는 컴포넌트를 여러 번 렌더링할 수 있기 때문입니다. 대부분의 경우, 부작용을 처리하기 위해 [이벤트 핸들러](learn/responding-to-events)를 사용합니다. 이벤트 핸들러를 사용하면 이 코드가 렌더링 중에 실행될 필요가 없음을 React에 명시적으로 알리며, 렌더링을 순수하게 유지합니다. 모든 옵션을 다 사용해보고 – 마지막 수단으로만 – `useEffect`를 사용하여 부작용을 처리할 수 있습니다.

### 언제 변형이 허용되나요? {/*mutation*/}

#### 로컬 변형 {/*local-mutation*/}
부작용의 일반적인 예는 변형입니다. 이는 JavaScript에서 비-[원시](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) 값을 변경하는 것을 의미합니다. 일반적으로, 변형은 React에서 관용적이지 않지만, _로컬_ 변형은 전혀 문제가 없습니다:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ 좋음: 로컬에서 생성됨
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ 좋음: 로컬 변형은 괜찮습니다.
  }
  return <section>{items}</section>;
}
```

로컬 변형을 피하기 위해 코드를 비틀 필요는 없습니다. 간결함을 위해 [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)를 사용할 수도 있지만, 로컬 배열을 생성한 다음 [렌더링 중](#how-does-react-run-your-code) 항목을 푸시하는 것에는 문제가 없습니다.

비록 `items`를 변형하는 것처럼 보이지만, 중요한 점은 이 코드가 _로컬_에서만 그렇게 한다는 것입니다 – 변형은 컴포넌트가 다시 렌더링될 때 "기억"되지 않습니다. 즉, `items`는 컴포넌트가 존재하는 동안만 유지됩니다. `items`는 `<FriendList />`가 렌더링될 때마다 항상 _다시 생성_되므로, 컴포넌트는 항상 동일한 결과를 반환합니다.

반면, `items`가 컴포넌트 외부에서 생성되면, 이전 값을 유지하고 변경 사항을 기억합니다:

```js {1,7}
const items = []; // 🔴 나쁨: 컴포넌트 외부에서 생성됨
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 나쁨: 렌더링 외부에서 생성된 값을 변형함
  }
  return <section>{items}</section>;
}
```

`<FriendList />`가 다시 실행되면, 컴포넌트가 실행될 때마다 `friends`를 `items`에 계속 추가하여 중복된 결과가 여러 번 나타납니다. 이 버전의 `<FriendList />`는 [렌더링 중](#how-does-react-run-your-code) 관찰 가능한 부작용을 가지며 **규칙을 위반**합니다.

#### 지연 초기화 {/*lazy-initialization*/}

지연 초기화도 완전히 "순수"하지는 않지만 괜찮습니다:

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ 좋음: 다른 컴포넌트에 영향을 미치지 않는다면
  // 계속 렌더링...
}
```

#### DOM 변경 {/*changing-the-dom*/}

사용자에게 직접적으로 보이는 부작용은 React 컴포넌트의 렌더링 로직에서 허용되지 않습니다. 즉, 단순히 컴포넌트 함수를 호출하는 것만으로 화면에 변화를 일으켜서는 안 됩니다.

```js {2}
function ProductDetailPage({ product }) {
  document.window.title = product.title; // 🔴 나쁨: DOM을 변경함
}
```

렌더링 외부에서 `window.title`을 업데이트하는 원하는 결과를 얻는 한 가지 방법은 [컴포넌트를 `window`와 동기화하는 것](/learn/synchronizing-with-effects)입니다.

컴포넌트를 여러 번 호출하는 것이 안전하고 다른 컴포넌트의 렌더링에 영향을 미치지 않는 한, React는 그것이 엄격한 함수형 프로그래밍 의미에서 100% 순수한지 여부에 신경 쓰지 않습니다. [컴포넌트는 멱등성을 가져야 합니다](/reference/rules/components-and-hooks-must-be-pure).

---

## Props와 state는 불변입니다 {/*props-and-state-are-immutable*/}

컴포넌트의 props와 state는 [스냅샷](learn/state-as-a-snapshot)입니다. 이를 직접 변형하지 마세요. 대신 새로운 props를 전달하고, `useState`의 setter 함수를 사용하세요.

props와 state 값을 렌더링 후 업데이트되는 스냅샷으로 생각할 수 있습니다. 이 때문에 props나 state 변수를 직접 수정하지 않고, 새로운 props를 전달하거나 제공된 setter 함수를 사용하여 다음 번 컴포넌트가 렌더링될 때 state가 업데이트되어야 함을 React에 알려야 합니다.

### Props를 변형하지 마세요 {/*props*/}
Props는 불변입니다. 이를 변형하면 애플리케이션이 일관되지 않은 출력을 생성하게 되며, 이는 상황에 따라 작동할 수도 있고 작동하지 않을 수도 있기 때문에 디버그하기 어려울 수 있습니다.

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 나쁨: props를 직접 변형하지 마세요
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ 좋음: 대신 복사본을 만드세요
  return <Link url={url}>{item.title}</Link>;
}
```

### State를 변형하지 마세요 {/*state*/}
`useState`는 state 변수와 그 state를 업데이트하는 setter를 반환합니다.

```js
const [stateVariable, setter] = useState(0);
```

state 변수를 제자리에서 업데이트하는 대신, `useState`가 반환하는 setter 함수를 사용하여 업데이트해야 합니다. state 변수의 값을 변경해도 컴포넌트가 업데이트되지 않으므로, 사용자는 오래된 UI를 보게 됩니다. setter 함수를 사용하면 React에 state가 변경되었음을 알리고, UI를 업데이트하기 위해 다시 렌더링해야 함을 큐에 넣습니다.

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 나쁨: state를 직접 변형하지 마세요
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ 좋음: useState가 반환한 setter 함수를 사용하세요
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## 훅의 반환 값과 인자는 불변입니다 {/*return-values-and-arguments-to-hooks-are-immutable*/}

값이 훅에 전달되면, 이를 수정해서는 안 됩니다. JSX의 props처럼, 값은 훅에 전달될 때 불변이 됩니다.

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 나쁨: 훅 인자를 직접 변형하지 마세요
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ 좋음: 대신 복사본을 만드세요
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

React의 중요한 원칙 중 하나는 _로컬 추론_입니다: 컴포넌트나 훅이 무엇을 하는지 그 코드만 보고 이해할 수 있는 능력입니다. 훅은 호출될 때 "블랙 박스"처럼 취급되어야 합니다. 예를 들어, 커스텀 훅은 내부에서 값을 메모이제이션하기 위해 인자를 종속성으로 사용할 수 있습니다:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

훅의 인자를 변형하면, 커스텀 훅의 메모이제이션이 잘못되므로, 이를 피하는 것이 중요합니다.

```js {4}
style = useIconStyle(icon);         // `style`은 `icon`을 기반으로 메모이제이션됨
icon.enabled = false;               // 나쁨: 🔴 훅 인자를 직접 변형하지 마세요
style = useIconStyle(icon);         // 이전에 메모이제이션된 결과가 반환됨
```

```js {4}
style = useIconStyle(icon);         // `style`은 `icon`을 기반으로 메모이제이션됨
icon = { ...icon, enabled: false }; // 좋음: ✅ 대신 복사본을 만드세요
style = useIconStyle(icon);         // `style`의 새로운 값이 계산됨
```

마찬가지로, 훅의 반환 값을 수정하지 않는 것도 중요합니다. 반환 값이 메모이제이션되었을 수 있기 때문입니다.

---

## JSX에 전달된 후 값은 불변입니다 {/*values-are-immutable-after-being-passed-to-jsx*/}

값을 JSX에 사용한 후에는 이를 변형하지 마세요. 변형을 JSX가 생성되기 전에 이동하세요.

JSX를 표현식에서 사용할 때, React는 컴포넌트가 렌더링을 완료하기 전에 JSX를 미리 평가할 수 있습니다. 이는 값이 JSX에 전달된 후 변형하면, React가 컴포넌트의 출력을 업데이트할 줄 모르기 때문에 오래된 UI로 이어질 수 있습니다.

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 나쁨: styles는 이미 위의 JSX에서 사용되었습니다
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ 좋음: 새로운 값을 생성했습니다
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```