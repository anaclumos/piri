---
title: memo
---

<Intro>

`memo`를 사용하면 props가 변경되지 않았을 때 컴포넌트의 재렌더링을 건너뛸 수 있습니다.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

컴포넌트를 `memo`로 감싸면 해당 컴포넌트의 *메모이제이션*된 버전을 얻을 수 있습니다. 이 메모이제이션된 컴포넌트는 부모 컴포넌트가 재렌더링될 때 props가 변경되지 않는 한 일반적으로 재렌더링되지 않습니다. 하지만 React는 여전히 재렌더링할 수 있습니다: 메모이제이션은 성능 최적화일 뿐, 보장은 아닙니다.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `Component`: 메모이제이션하려는 컴포넌트입니다. `memo`는 이 컴포넌트를 수정하지 않지만, 대신 새로운 메모이제이션된 컴포넌트를 반환합니다. 함수 및 [`forwardRef`](/reference/react/forwardRef) 컴포넌트를 포함한 모든 유효한 React 컴포넌트가 허용됩니다.

* **선택적** `arePropsEqual`: 두 개의 인수를 받는 함수입니다: 컴포넌트의 이전 props와 새로운 props입니다. 이전과 새로운 props가 동일한 경우 `true`를 반환해야 합니다: 즉, 컴포넌트가 새로운 props와 이전 props로 동일한 출력을 렌더링하고 동일한 방식으로 동작할 경우입니다. 그렇지 않으면 `false`를 반환해야 합니다. 일반적으로 이 함수를 지정하지 않습니다. 기본적으로 React는 각 props를 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 비교합니다.

#### 반환값 {/*returns*/}

`memo`는 새로운 React 컴포넌트를 반환합니다. 이 컴포넌트는 `memo`에 제공된 컴포넌트와 동일하게 동작하지만, 부모가 재렌더링될 때 props가 변경되지 않는 한 React는 항상 재렌더링하지 않습니다.

---

## 사용법 {/*usage*/}

### props가 변경되지 않았을 때 재렌더링 건너뛰기 {/*skipping-re-rendering-when-props-are-unchanged*/}

React는 일반적으로 부모가 재렌더링될 때마다 컴포넌트를 재렌더링합니다. `memo`를 사용하면 새로운 props가 이전 props와 동일한 한 부모가 재렌더링될 때 React가 재렌더링하지 않는 컴포넌트를 만들 수 있습니다. 이러한 컴포넌트를 *메모이제이션*되었다고 합니다.

컴포넌트를 메모이제이션하려면 `memo`로 감싸고 반환된 값을 원래 컴포넌트 대신 사용하세요:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

React 컴포넌트는 항상 [순수한 렌더링 로직](/learn/keeping-components-pure)을 가져야 합니다. 이는 props, state, context가 변경되지 않으면 동일한 출력을 반환해야 함을 의미합니다. `memo`를 사용하면 컴포넌트가 이 요구 사항을 준수한다고 React에 알리므로 props가 변경되지 않는 한 재렌더링할 필요가 없습니다. `memo`를 사용하더라도 컴포넌트의 자체 state가 변경되거나 사용하는 context가 변경되면 컴포넌트는 여전히 재렌더링됩니다.

이 예제에서 `Greeting` 컴포넌트는 `name`이 변경될 때마다 재렌더링되지만(이는 props 중 하나이기 때문), `address`가 변경될 때는 재렌더링되지 않습니다(이는 `Greeting`에 props로 전달되지 않기 때문입니다):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**`memo`는 성능 최적화로만 사용해야 합니다.** 코드가 `memo` 없이 작동하지 않는다면, 근본적인 문제를 찾아 먼저 해결하세요. 그런 다음 성능을 향상시키기 위해 `memo`를 추가할 수 있습니다.

</Note>

<DeepDive>

#### 모든 곳에 memo를 추가해야 할까요? {/*should-you-add-memo-everywhere*/}

앱이 이 사이트와 같고 대부분의 상호작용이 페이지나 섹션을 교체하는 것처럼 거친 경우, 메모이제이션은 일반적으로 불필요합니다. 반면, 앱이 드로잉 편집기와 같고 대부분의 상호작용이 도형을 이동하는 것처럼 세밀한 경우, 메모이제이션이 매우 유용할 수 있습니다.

`memo`로 최적화하는 것은 컴포넌트가 동일한 props로 자주 재렌더링되고, 그 재렌더링 로직이 비용이 많이 드는 경우에만 가치가 있습니다. 컴포넌트가 재렌더링될 때 지연이 느껴지지 않는다면 `memo`는 불필요합니다. `memo`는 컴포넌트에 전달된 props가 *항상 다를* 경우 완전히 쓸모가 없습니다. 예를 들어, 렌더링 중에 정의된 객체나 일반 함수를 전달하는 경우입니다. 이 때문에 `memo`와 함께 [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) 및 [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)을 자주 사용해야 합니다.

다른 경우에 컴포넌트를 `memo`로 감싸는 것은 이점이 없습니다. 그렇게 하는 데 큰 해가 없기 때문에 일부 팀은 개별 사례를 생각하지 않고 가능한 한 많이 메모이제이션하기로 선택합니다. 이 접근 방식의 단점은 코드가 덜 읽기 쉬워진다는 것입니다. 또한, 모든 메모이제이션이 효과적인 것은 아닙니다: "항상 새로운" 단일 값은 전체 컴포넌트의 메모이제이션을 깨뜨리기에 충분합니다.

**실제로, 몇 가지 원칙을 따르면 많은 메모이제이션이 불필요해질 수 있습니다:**

1. 컴포넌트가 시각적으로 다른 컴포넌트를 감쌀 때, [JSX를 자식으로 받아들이도록](/learn/passing-props-to-a-component#passing-jsx-as-children) 하세요. 이렇게 하면 래퍼 컴포넌트가 자체 state를 업데이트할 때 React는 자식이 재렌더링될 필요가 없다는 것을 알 수 있습니다.
1. 로컬 state를 선호하고 [state를 필요 이상으로 올리지](/learn/sharing-state-between-components) 마세요. 예를 들어, 트리의 맨 위나 전역 상태 라이브러리에 양식과 항목이 호버된 상태와 같은 일시적인 상태를 유지하지 마세요.
1. [렌더링 로직을 순수하게 유지하세요.](/learn/keeping-components-pure) 컴포넌트를 재렌더링할 때 문제가 발생하거나 눈에 띄는 시각적 아티팩트가 발생하면, 이는 컴포넌트의 버그입니다! 메모이제이션을 추가하는 대신 버그를 수정하세요.
1. [상태를 업데이트하는 불필요한 Effects를 피하세요.](/learn/you-might-not-need-an-effect) React 앱의 대부분의 성능 문제는 Effects에서 시작된 업데이트 체인으로 인해 컴포넌트가 반복해서 렌더링되는 경우입니다.
1. [Effects에서 불필요한 종속성을 제거하려고 노력하세요.](/learn/removing-effect-dependencies) 예를 들어, 메모이제이션 대신 일부 객체나 함수를 Effect 내부 또는 컴포넌트 외부로 이동하는 것이 더 간단할 수 있습니다.

특정 상호작용이 여전히 느리게 느껴진다면, [React Developer Tools 프로파일러](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용하여 메모이제이션이 가장 유용한 컴포넌트를 확인하고 필요한 곳에 메모이제이션을 추가하세요. 이러한 원칙은 컴포넌트를 디버그하고 이해하기 쉽게 만드므로, 어떤 경우에도 따르는 것이 좋습니다. 장기적으로는 [자동으로 세밀한 메모이제이션을 수행하는 연구](https://www.youtube.com/watch?v=lGEMwh32soc)를 통해 이 문제를 한 번에 해결하려고 합니다.

</DeepDive>

---

### state를 사용하여 메모이제이션된 컴포넌트 업데이트하기 {/*updating-a-memoized-component-using-state*/}

컴포넌트가 메모이제이션되었더라도 자체 state가 변경되면 여전히 재렌더링됩니다. 메모이제이션은 부모로부터 전달된 props와 관련이 있습니다.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

state 변수를 현재 값으로 설정하면 React는 `memo` 없이도 컴포넌트의 재렌더링을 건너뜁니다. 컴포넌트 함수가 한 번 더 호출되는 것을 볼 수 있지만, 결과는 무시됩니다.

---

### context를 사용하여 메모이제이션된 컴포넌트 업데이트하기 {/*updating-a-memoized-component-using-a-context*/}

컴포넌트가 메모이제이션되었더라도 사용하는 context가 변경되면 여전히 재렌더링됩니다. 메모이제이션은 부모로부터 전달된 props와 관련이 있습니다.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

context의 일부가 변경될 때만 컴포넌트를 재렌더링하려면, 컴포넌트를 두 개로 나누세요. 외부 컴포넌트에서 context에서 필요한 것을 읽고, 이를 props로 메모이제이션된 자식에게 전달하세요.

---

### props 변경 최소화하기 {/*minimizing-props-changes*/}

`memo`를 사용할 때, 컴포넌트는 모든 props가 이전과 *얕게 동일하지* 않을 때마다 재렌더링됩니다. 이는 React가 각 props를 이전 값과 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 비교한다는 것을 의미합니다. `Object.is(3, 3)`는 `true`이지만, `Object.is({}, {})`는 `false`입니다.

`memo`를 최대한 활용하려면 props 변경을 최소화하세요. 예를 들어, props가 객체인 경우, 부모 컴포넌트가 매번 해당 객체를 다시 생성하지 않도록 [`useMemo`](/reference/react/useMemo)를 사용하세요:

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

props 변경을 최소화하는 더 나은 방법은 컴포넌트가 props에서 필요한 최소한의 정보를 수락하도록 하는 것입니다. 예를 들어, 전체 객체 대신 개별 값을 수락할 수 있습니다:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

개별 값도 때로는 덜 자주 변경되는 값으로 투영될 수 있습니다. 예를 들어, 여기서는 컴포넌트가 값 자체가 아닌 값의 존재를 나타내는 boolean을 수락합니다:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

메모이제이션된 컴포넌트에 함수를 전달해야 할 때는, 해당 함수를 컴포넌트 외부에 선언하여 절대 변경되지 않도록 하거나, [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)을 사용하여 재렌더링 간에 정의를 캐시하세요.

---

### 사용자 정의 비교 함수 지정하기 {/*specifying-a-custom-comparison-function*/}

드물게 메모이제이션된 컴포넌트의 props 변경을 최소화하는 것이 불가능할 수 있습니다. 이 경우, React가 얕은 동등성을 사용하는 대신 이전과 새로운 props를 비교하는 사용자 정의 비교 함수를 제공할 수 있습니다. 이 함수는 `memo`의 두 번째 인수로 전달됩니다. 이 함수는 새로운 props가 이전 props와 동일한 출력을 생성할 경우에만 `true`를 반환해야 하며, 그렇지 않으면 `false`를 반환해야 합니다.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

이렇게 할 경우, 브라우저 개발자 도구의 성능 패널을 사용하여 비교 함수가 컴포넌트를 재렌더링하는 것보다 실제로 더 빠른지 확인하세요. 놀랄 수도 있습니다.

성능 측정을 할 때 React가 프로덕션 모드에서 실행되고 있는지 확인하세요.

<Pitfall>

사용자 정의 `arePropsEqual` 구현을 제공하는 경우, **모든 props, 특히 함수를 비교해야 합니다.** 함수는 종종 부모 컴포넌트의 props와 state를 [클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)로 가집니다. `oldProps.onClick !== newProps.onClick`일 때 `true`를 반환하면, 컴포넌트는 이전 렌더링의 props와 state를 `onClick` 핸들러 내부에서 계속 "보게" 되어 매우 혼란스러운 버그가 발생할 수 있습니다.

**데이터 구조의 깊이가 제한된 경우가 아닌 한, `arePropsEqual` 내부에서 깊은 동등성 검사를 수행하지 마세요.** 깊은 동등성 검사는 매우 느려질 수 있으며, 누군가가 나중에 데이터 구조를 변경하면 앱이 몇 초 동안 멈출 수 있습니다.

</Pitfall---

## 문제 해결 {/*troubleshooting*/}
### 내 컴포넌트가 객체, 배열 또는 함수인 props로 인해 재렌더링됩니다 {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React는 얕은 동등성으로 이전과 새로운 props를 비교합니다: 즉, 각 새로운 props가 이전 props와 참조적으로 동일한지 여부를 고려합니다. 부모가 재렌더링될 때마다 새로운 객체나 배열을 생성하면, 개별 요소가 동일하더라도 React는 여전히 변경된 것으로 간주합니다. 마찬가지로, 부모 컴포넌트를 렌더링할 때 새로운 함수를 생성하면, 함수 정의가 동일하더라도 React는 변경된 것으로 간주합니다. 이를 피하려면, [부모 컴포넌트에서 props를 단순화하거나 메모이제이션](/#minimizing-props-changes)하세요.