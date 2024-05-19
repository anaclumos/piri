---
title: useMemo
---

<Intro>

`useMemo`는 리렌더링 사이에 계산 결과를 캐시할 수 있게 해주는 React Hook입니다.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

리렌더링 사이에 계산을 캐시하기 위해 컴포넌트의 최상위 레벨에서 `useMemo`를 호출하세요:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `calculateValue`: 캐시하고자 하는 값을 계산하는 함수입니다. 이 함수는 순수해야 하며, 인수를 받지 않고, 어떤 타입의 값이든 반환할 수 있습니다. React는 초기 렌더링 시 이 함수를 호출합니다. 이후 렌더링 시, `dependencies`가 마지막 렌더링 이후 변경되지 않았다면 React는 동일한 값을 다시 반환합니다. 그렇지 않으면 `calculateValue`를 호출하고 그 결과를 반환하며, 나중에 재사용할 수 있도록 저장합니다.

* `dependencies`: `calculateValue` 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 그리고 컴포넌트 본문 내에서 직접 선언된 모든 변수와 함수가 포함됩니다. 린터가 [React에 맞게 구성](/learn/editor-setup#linting)되어 있다면, 모든 반응형 값이 올바르게 의존성으로 지정되었는지 확인할 것입니다. 의존성 목록은 항목 수가 일정해야 하며 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 각 의존성을 이전 값과 비교합니다.

#### 반환값 {/*returns*/}

초기 렌더링 시, `useMemo`는 인수 없이 `calculateValue`를 호출한 결과를 반환합니다.

이후 렌더링 시, `useMemo`는 이미 저장된 값을 반환하거나 (의존성이 변경되지 않은 경우) `calculateValue`를 다시 호출하고 그 결과를 반환합니다.

#### 주의사항 {/*caveats*/}

* `useMemo`는 Hook이므로 **컴포넌트의 최상위 레벨**이나 자신만의 Hook에서만 호출할 수 있습니다. 루프나 조건문 내에서는 호출할 수 없습니다. 그런 경우에는 새로운 컴포넌트를 추출하고 상태를 그 안으로 이동시키세요.
* Strict Mode에서는 React가 [우연한 불순물을 찾는 데 도움을 주기 위해](#my-calculation-runs-twice-on-every-re-render) **계산 함수를 두 번 호출**합니다. 이는 개발 전용 동작이며 프로덕션에는 영향을 미치지 않습니다. 계산 함수가 순수하다면 (그렇게 되어야 합니다), 이는 논리에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.
* React는 **특정 이유가 없는 한 캐시된 값을 버리지 않습니다.** 예를 들어, 개발 중에는 컴포넌트 파일을 편집할 때 캐시를 버립니다. 개발 및 프로덕션 모두에서, 초기 마운트 중에 컴포넌트가 일시 중단되면 React는 캐시를 버립니다. 미래에는 캐시를 버리는 것을 활용하는 더 많은 기능이 추가될 수 있습니다. 예를 들어, React가 가상화된 리스트에 대한 내장 지원을 추가하면, 가상화된 테이블 뷰포트에서 스크롤 아웃된 항목에 대해 캐시를 버리는 것이 합리적일 것입니다. 이는 `useMemo`를 성능 최적화로만 사용하는 경우 문제가 되지 않습니다. 그렇지 않으면 [상태 변수](/reference/react/useState#avoiding-recreating-the-initial-state)나 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)가 더 적절할 수 있습니다.

<Note>

이와 같은 반환값 캐싱은 [*메모이제이션*](https://en.wikipedia.org/wiki/Memoization)이라고도 하며, 이 Hook이 `useMemo`라고 불리는 이유입니다.

</Note>

---

## 사용법 {/*usage*/}

### 비용이 많이 드는 재계산 건너뛰기 {/*skipping-expensive-recalculations*/}

리렌더링 사이에 계산을 캐시하려면, 컴포넌트의 최상위 레벨에서 `useMemo` 호출로 감싸세요:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo`에 두 가지를 전달해야 합니다:

1. 인수를 받지 않고, 계산하고자 하는 것을 반환하는 <CodeStep step={1}>계산 함수</CodeStep>입니다.
2. 계산 내에서 사용되는 컴포넌트 내의 모든 값을 포함하는 <CodeStep step={2}>의존성 목록</CodeStep>입니다.

초기 렌더링 시, `useMemo`에서 얻는 <CodeStep step={3}>값</CodeStep>은 <CodeStep step={1}>계산</CodeStep>을 호출한 결과입니다.

이후 모든 렌더링 시, React는 <CodeStep step={2}>의존성</CodeStep>을 마지막 렌더링 시 전달된 의존성과 비교합니다. 의존성 중 어느 것도 변경되지 않았다면 (`Object.is`로 비교), `useMemo`는 이전에 계산된 값을 반환합니다. 그렇지 않으면 React는 계산을 다시 실행하고 새로운 값을 반환합니다.

즉, `useMemo`는 의존성이 변경될 때까지 리렌더링 사이에 계산 결과를 캐시합니다.

**이것이 유용한 경우를 예제로 살펴보겠습니다.**

기본적으로, React는 리렌더링 시 컴포넌트의 전체 본문을 다시 실행합니다. 예를 들어, 이 `TodoList`가 상태를 업데이트하거나 부모로부터 새로운 props를 받으면, `filterTodos` 함수가 다시 실행됩니다:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

대부분의 경우, 이는 문제가 되지 않습니다. 대부분의 계산은 매우 빠르기 때문입니다. 그러나 큰 배열을 필터링하거나 변환하거나, 비용이 많이 드는 계산을 수행하는 경우, 데이터가 변경되지 않았다면 다시 수행하는 것을 건너뛰고 싶을 수 있습니다. `todos`와 `tab`이 마지막 렌더링 시와 동일하다면, 이전에 계산된 `visibleTodos`를 재사용할 수 있도록 `useMemo`로 계산을 감싸는 것이 좋습니다.

이러한 유형의 캐싱을 *[메모이제이션](https://en.wikipedia.org/wiki/Memoization)*이라고 합니다.

<Note>

**성능 최적화로만 `useMemo`에 의존해야 합니다.** 코드가 `useMemo` 없이 작동하지 않는다면, 근본적인 문제를 찾아 먼저 해결하세요. 그런 다음 성능을 개선하기 위해 `useMemo`를 추가할 수 있습니다.

</Note>

<DeepDive>

#### 계산이 비용이 많이 드는지 확인하는 방법 {/*how-to-tell-if-a-calculation-is-expensive*/}

일반적으로, 수천 개의 객체를 생성하거나 반복하지 않는 한 비용이 많이 들지 않습니다. 더 확신을 얻고 싶다면, 코드의 일부에서 소요된 시간을 측정하기 위해 콘솔 로그를 추가할 수 있습니다:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

측정하려는 상호작용을 수행하세요 (예: 입력에 타이핑). 그런 다음 콘솔에서 `filter array: 0.15ms`와 같은 로그를 볼 수 있습니다. 전체 기록된 시간이 상당한 양 (예: `1ms` 이상)으로 합산된다면, 해당 계산을 메모이제이션하는 것이 의미가 있을 수 있습니다. 실험으로, 계산을 `useMemo`로 감싸서 해당 상호작용에 대한 전체 기록된 시간이 감소했는지 확인할 수 있습니다:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // todos와 tab이 변경되지 않은 경우 건너뜁니다
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo`는 *첫 번째* 렌더링을 더 빠르게 만들지 않습니다. 업데이트 시 불필요한 작업을 건너뛰는 데 도움이 됩니다.

사용자의 기기가 여러분의 기기보다 느릴 가능성이 높으므로 인위적인 지연을 통해 성능을 테스트하는 것이 좋습니다. 예를 들어, Chrome은 이를 위한 [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 옵션을 제공합니다.

또한, 개발 중에 성능을 측정하는 것은 가장 정확한 결과를 제공하지 않습니다. (예를 들어, [Strict Mode](/reference/react/StrictMode)가 켜져 있으면 각 컴포넌트가 한 번이 아닌 두 번 렌더링됩니다.) 가장 정확한 타이밍을 얻으려면 프로덕션용으로 앱을 빌드하고 사용자의 기기와 유사한 기기에서 테스트하세요.

</DeepDive>

<DeepDive>

#### 모든 곳에 useMemo를 추가해야 할까요? {/*should-you-add-usememo-everywhere*/}

여러분의 앱이 이 사이트와 같고 대부분의 상호작용이 페이지나 섹션을 교체하는 것과 같은 경우, 메모이제이션은 보통 불필요합니다. 반면, 앱이 드로잉 에디터와 같고 대부분의 상호작용이 도형을 이동하는 것과 같은 경우, 메모이제이션이 매우 유용할 수 있습니다.

`useMemo`로 최적화하는 것은 몇 가지 경우에만 가치가 있습니다:

- `useMemo`에 넣는 계산이 눈에 띄게 느리고, 의존성이 거의 변경되지 않는 경우.
- [`memo`](/reference/react/memo)로 래핑된 컴포넌트에 prop으로 전달하는 경우. 값이 변경되지 않은 경우 리렌더링을 건너뛰고 싶습니다. 메모이제이션을 통해 의존성이 동일하지 않은 경우에만 컴포넌트가 리렌더링됩니다.
- 전달하는 값이 나중에 다른 Hook의 의존성으로 사용되는 경우. 예를 들어, 다른 `useMemo` 계산 값이 이에 의존할 수 있습니다. 또는 [`useEffect`](/reference/react/useEffect)에서 이 값을 의존성으로 사용할 수 있습니다.

다른 경우에는 계산을 `useMemo`로 감싸는 것이 이점이 없습니다. 그렇게 하는 데 큰 해가 없으므로, 일부 팀은 개별 사례를 고려하지 않고 가능한 한 많이 메모이제이션하기로 선택합니다. 이 접근 방식의 단점은 코드가 덜 읽기 쉬워진다는 것입니다. 또한, 모든 메모이제이션이 효과적인 것은 아닙니다: "항상 새로운" 단일 값이 전체 컴포넌트의 메모이제이션을 깨뜨리기에 충분합니다.

**실제로, 몇 가지 원칙을 따르면 많은 메모이제이션이 불필요해질 수 있습니다:**

1. 컴포넌트가 다른 컴포넌트를 시각적으로 래핑할 때, [JSX를 자식으로 받도록](/learn/passing-props-to-a-component#passing-jsx-as-children) 하세요. 이렇게 하면 래퍼 컴포넌트가 자신의 상태를 업데이트할 때, React는 자식이 리렌더링될 필요가 없다는 것을 알 수 있습니다.
1. 로컬 상태를 선호하고 상태를 [필요 이상으로 올리지 마세요](/learn/sharing-state-between-components). 예를 들어, 트리의 최상위 또는 전역 상태 라이브러리에 양식과 항목이 호버된 상태와 같은 일시적인 상태를 유지하지 마세요.
1. [렌더링 로직을 순수하게 유지하세요.](/learn/keeping-components-pure) 컴포넌트를 리렌더링하는 것이 문제를 일으키거나 눈에 띄는 시각적 아티팩트를 생성하는 경우, 이는 컴포넌트의 버그입니다! 메모이제이션을 추가하는 대신 버그를 수정하세요.
1. 상태를 업데이트하는 [불필요한 Effects를 피하세요.](/learn/you-might-not-need-an-effect) React 앱의 대부분의 성능 문제는 컴포넌트를 반복적으로 렌더링하게 하는 Effects의 업데이트 체인에서 발생합니다.
1. Effects에서 [불필요한 의존성을 제거하세요.](/learn/removing-effect-dependencies) 예를 들어, 메모이제이션 대신 일부 객체나 함수를 Effect 내부 또는 컴포넌트 외부로 이동하는 것이 더 간단할 수 있습니다.

특정 상호작용이 여전히 느리게 느껴진다면, [React Developer Tools 프로파일러](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용하여 메모이제이션이 가장 유용한 컴포넌트를 확인하고 필요한 곳에 메모이제이션을 추가하세요. 이러한 원칙은 컴포넌트를 디버그하고 이해하기 쉽게 만드므로, 어떤 경우에도 따르는 것이 좋습니다. 장기적으로, 우리는 [자동으로 세밀한 메모이제이션을 수행하는](https://www.youtube.com/watch?v=lGEMwh32soc) 연구를 진행 중입니다.

</DeepDive>

<Recipes titleText="useMemo와 값을 직접 계산하는 것의 차이" titleId="examples-recalculation">

#### `useMemo`로 재계산 건너뛰기 {/*skipping-recalculation-with-usememo*/}

이 예제에서, `filterTodos` 구현은 **인위적으로 느리게** 되어 있어 렌더링 중에 호출하는 JavaScript 함수가 실제로 느린 경우에 어떤 일이 발생하는지 확인할 수 있습니다. 탭을 전환하고 테마를 토글해 보세요.

탭을 전환하는 것은 느리게 느껴집니다. 이는 느려진 `filterTodos`가 다시 실행되기 때문입니다. 이는 예상된 것입니다. `tab`이 변경되었기 때문에 전체 계산이 다시 실행되어야 합니다. (왜 두 번 실행되는지 궁금하다면, [여기](#my-calculation-runs-twice-on-every-re-render)에서 설명합니다.)

테마를 토글해 보세요. **`useMemo` 덕분에 인위적인 지연에도 불구하고 빠릅니다!** 느린 `filterTodos` 호출이 건너뛰어졌습니다. `useMemo`에 의존성으로 전달한 `todos`와 `tab`이 마지막 렌더링 이후 변경되지 않았기 때문입니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

#### 항상 값을 재
계산하기 {/*always-recalculating-a-value*/}

이 예제에서, `filterTodos` 구현은 **인위적으로 느리게** 되어 있어 렌더링 중에 호출하는 JavaScript 함수가 실제로 느린 경우에 어떤 일이 발생하는지 확인할 수 있습니다. 탭을 전환하고 테마를 토글해 보세요.

이전 예제와 달리, 이제 테마를 토글하는 것도 느립니다! 이는 **이 버전에서는 `useMemo` 호출이 없기 때문**에, 인위적으로 느려진 `filterTodos`가 매번 리렌더링 시 호출되기 때문입니다. `theme`만 변경된 경우에도 호출됩니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() to setTab('active')}>
        Active
      </button>
      <button onClick={() to setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

그러나, **인위적인 지연이 제거된 동일한 코드**입니다. `useMemo`가 없는 것이 눈에 띄는지 아닌지 확인해 보세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() to setTab('all')}>
        All
      </button>
      <button onClick={() to setTab('active')}>
        Active
      </button>
      <button onClick={() to setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

종종, 메모이제이션 없이도 코드가 잘 작동합니다. 상호작용이 충분히 빠르다면, 메모이제이션이 필요하지 않을 수 있습니다.

`utils.js`에서 할 일 항목의 수를 늘려보고 동작이 어떻게 변하는지 확인할 수 있습니다. 이 특정 계산은 처음부터 매우 비용이 많이 들지 않았지만, 할 일 항목의 수가 크게 증가하면 대부분의 오버헤드는 필터링보다는 리렌더링에 있을 것입니다. 아래에서 `useMemo`로 리렌더링을 최적화하는 방법을 계속 읽어보세요.

<Solution />

</Recipes>

---

### 컴포넌트의 리렌더링 건너뛰기 {/*skipping-re-rendering-of-components*/}

일부 경우, `useMemo`는 자식 컴포넌트의 리렌더링 성능을 최적화하는 데도 도움이 될 수 있습니다. 이를 설명하기 위해, `TodoList` 컴포넌트가 `visibleTodos`를 자식 `List` 컴포넌트에 prop으로 전달한다고 가정해 보겠습니다:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

`theme` prop을 토글할 때 앱이 잠시 멈추는 것을 발견했지만, JSX에서 `<List />`를 제거하면 빠르게 느껴집니다. 이는 `List` 컴포넌트를 최적화할 가치가 있다는 신호입니다.

**기본적으로, 컴포넌트가 리렌더링되면 React는 모든 자식을 재귀적으로 리렌더링합니다.** 이 때문에 `TodoList`가 다른 `theme`으로 리렌더링될 때, `List` 컴포넌트도 리렌더링됩니다. 이는 리렌더링에 많은 계산이 필요하지 않은 컴포넌트에는 괜찮습니다. 그러나 리렌더링이 느리다고 확인된 경우, [`memo`](/reference/react/memo)로 래핑하여 props가 마지막 렌더링과 동일할 때 리렌더링을 건너뛰도록 `List`에 지시할 수 있습니다:

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**이 변경으로, `List`는 모든 props가 마지막 렌더링과 동일할 때 리렌더링을 건너뜁니다.** 이는 계산을 캐싱하는 것이 중요한 이유입니다! `useMemo` 없이 `visibleTodos`를 계산했다고 가정해 보겠습니다:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // 테마가 변경될 때마다, 이는 다른 배열이 됩니다...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... 따라서 List의 props는 절대 동일하지 않으며, 매번 리렌더링됩니다 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**위 예제에서, `filterTodos` 함수는 항상 *다른* 배열을 생성합니다,** `{}` 객체 리터럴이 항상 새로운 객체를 생성하는 것과 유사합니다. 일반적으로 이는 문제가 되지 않지만, 이는 `List` props가 절대 동일하지 않음을 의미하며, [`memo`](/reference/react/memo) 최적화가 작동하지 않습니다. 이때 `useMemo`가 유용합니다:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // 리렌더링 사이에 계산을 캐시하도록 React에 지시합니다...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...이 의존성이 변경되지 않는 한...
  );
  return (
    <div className={theme}>
      {/* ...List는 동일한 props를 받아 리렌더링을 건너뛸 수 있습니다 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**`visibleTodos` 계산을 `useMemo`로 감싸면, 리렌더링 사이에 *동일한* 값을 가지게 됩니다** (의존성이 변경될 때까지). 특정 이유가 없는 한 계산을 `useMemo`로 감쌀 필요는 없습니다. 이 예제에서는 [`memo`](/reference/react/memo)로 래핑된 컴포넌트에 전달하기 때문에 이를 사용합니다. 이 페이지에서 설명된 몇 가지 다른 이유도 있습니다.

<DeepDive>

#### 개별 JSX 노드 메모이제이션 {/*memoizing-individual-jsx-nodes*/}

[`memo`](/reference/react/memo)로 `List`를 래핑하는 대신, `<List />` JSX 노드 자체를 `useMemo`로 래핑할 수 있습니다:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

동작은 동일합니다. `visibleTodos`가 변경되지 않았다면, `List`는 리렌더링되지 않습니다.

`<List items={visibleTodos} />`와 같은 JSX 노드는 `{ type: List, props: { items: visibleTodos } }`와 같은 객체입니다. 이 객체를 생성하는 것은 매우 저렴하지만, React는 그 내용이 이전과 동일한지 여부를 알 수 없습니다. 이 때문에 기본적으로 React는 `List` 컴포넌트를 리렌더링합니다.

그러나 React가 이전 렌더링과 동일한 JSX를 보면, 컴포넌트를 리렌더링하지 않습니다. 이는 JSX 노드가 [불변](https://en.wikipedia.org/wiki/Immutable_object)하기 때문입니다. JSX 노드 객체는 시간이 지나도 변경되지 않으므로, React는 리렌더링을 건너뛰어도 안전하다는 것을 알고 있습니다. 그러나 이를 위해서는 노드가 실제로 동일한 객체여야 하며, 코드에서 동일하게 보이는 것만으로는 충분하지 않습니다. 이 예제에서 `useMemo`가 하는 일이 바로 이것입니다.

JSX 노드를 수동으로 `useMemo`로 래핑하는 것은 편리하지 않습니다. 예를 들어, 조건부로 이를 수행할 수 없습니다. 일반적으로 컴포넌트를 [`memo`](/reference/react/memo)로 래핑하는 이유입니다.

</DeepDive>

<Recipes titleText="리렌더링 건너뛰기와 항상 리렌더링의 차이" titleId="examples-rerendering">

#### `useMemo`와 `memo`로 리렌더링 건너뛰기 {/*skipping-re-rendering-with-usememo-and-memo*/}

이 예제에서, `List` 컴포넌트는 **인위적으로 느리게** 되어 있어 렌더링 중에 React 컴포넌트를 실제로 느리게 렌더링하는 경우에 어떤 일이 발생하는지 확인할 수 있습니다. 탭을 전환하고 테마를 토글해 보세요.

탭을 전환하는 것은 느리게 느껴집니다. 이는 느려진 `List`가 다시 렌더링되기 때문입니다. 이는 예상된 것입니다. `tab`이 변경되었기 때문에 사용자의 새로운 선택을 화면에 반영해야 합니다.

다음으로, 테마를 토글해 보세요. **`useMemo`와 [`memo`](/reference/react/memo) 덕분에 인위적인 지연에도 불구하고 빠릅니다!** `List`는 `visibleTodos` 배열이 마지막 렌더링 이후 변경되지 않았기 때문에 리렌더링을 건너뛰었습니다. `visibleTodos` 배열이 변경되지 않은 이유는 `useMemo`에 의존성으로 전달한 `todos`와 `tab`이 마지막 렌더링 이후 변경되지 않았기 때문입니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() to setTab('all')}>
        All
      </button>
      <button onClick={() to setTab('active')}>
        Active
      </button>
      <button onClick={() to setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

이 예제에서, `List` 구현은 **인위적으로 느리게** 되어 있어 렌더링 중에 React 컴포넌트를 실제로 느리게 렌더링하는 경우에 어떤 일이 발생하는지 확인할 수 있습니다. 탭을 전환하고 테마를 토글해 보세요.

이전 예제와 달리, 이제 테마를 토글하는 것도 느립니다! 이는 **이 버전에서는 `useMemo` 호출이 없기 때문**에, `visibleTodos`가 항상 다른 배열이 되어 느려진 `List` 컴포넌트가 리렌더링을 건너뛸 수 없습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();


export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

그러나, **인위적인 지연이 제거된 동일한 코드**입니다. `useMemo`가 없는 것이 눈에 띄는지 아닌지 확인해 보세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
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

종종, 메모이제이션 없이도 코드가 잘 작동합니다. 상호작용이 충분히 빠르다면, 메모이제이션이 필요하지 않을 수 있습니다.

React를 프로덕션 모드로 실행하고, [React Developer Tools](/learn/react-developer-tools)를 비활성화하고, 사용자의 기기와 유사한 기기를 사용하여 실제로 앱을 느리게 만드는 것이 무엇인지 현실적으로 파악하는 것이 좋습니다.

<Solution />

</Recipes>

---

### 다른 Hook의 의존성을 메모이제이션하기 {/*memoizing-a-dependency-of-another-hook*/}

컴포넌트 본문에서 직접 생성된 객체에 의존하는 계산이 있다고 가정해 보겠습니다:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 주의: 컴포넌트 본문에서 생성된 객체에 대한 의존성
  // ...
```

이와 같은 객체에 의존하는 것은 메모이제이션의 의미를 무색하게 만듭니다. 컴포넌트가 리렌더링될 때, 컴포넌트 본문 내부의 모든 코드가 다시 실행됩니다. **`searchOptions` 객체를 생성하는 코드 줄도 매번 다시 실행됩니다.** `searchOptions`가 `useMemo` 호출의 의존성이기 때문에, 매번 다르므로 React는 의존성이 다르다는 것을 알고 `searchItems`를 매번 다시 계산합니다.

이를 해결하려면, `searchOptions` 객체 자체를 의존성으로 전달하기 전에 메모이제이션할 수 있습니다:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ text가 변경될 때만 변경됩니다

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ allItems 또는 searchOptions가 변경될 때만 변경됩니다
  // ...
```

위 예제에서, `text`가 변경되지 않았다면 `searchOptions` 객체도 변경되지 않습니다. 그러나 더 나은 해결책은 `searchOptions` 객체 선언을 `useMemo` 계산 함수 내부로 이동하는 것입니다:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ allItems 또는 text가 변경될 때만 변경됩니다
  // ...
```

이제 계산은 `text`에 직접 의존합니다 (이는 문자열이므로 "우연히" 다르게 될 수 없습니다).

---

### 함수를 메모이제이션하기 {/*memoizing-a-function*/}

`Form` 컴포넌트가 [`memo`](/reference/react/memo)로 래핑되어 있다고 가정해 보겠습니다. 이를 prop으로 함수로 전달하고자 합니다:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

`function() {}` 및 `() => {}`와 같은 함수 선언 및 표현식은 매번 리렌더링 시 *다른* 함수를 생성합니다. 자체적으로 새로운 함수를 생성하는 것은 문제가 아닙니다. 이는 피해야 할 것이 아닙니다! 그러나 `Form` 컴포넌트가 메모이제이션된 경우, props가 변경되지 않았을 때 리렌더링을 건너뛰고자 할 것입니다. 항상 *다른* prop은 메모이제이션의 의미를 무색하게 만듭니다.

함수를 `useMemo`로 메모이제이션하려면, 계산 함수가 다른 함수를 반환해야 합니다:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

이것은 번거로워 보입니다! **함수를 메모이제이션하는 것은 일반적이므로 React에는 이를 위한 내장 Hook이 있습니다. `useMemo` 대신 [`useCallback`](/reference/react/useCallback)으로 함수를 래핑하여** 중첩된 함수를 작성하지 않아도 됩니다:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

위 두 예제는 완전히 동일합니다. `useCallback`의 유일한 이점은 내부에 중첩된 함수를 작성하지 않아도 된다는 것입니다. 다른 기능은 없습니다. [`useCallback`에 대해 더 읽어보세요.](/reference/react/useCallback)

---

## 문제 해결 {/*troubleshooting*/}

### 내 계산이 매 리렌더링 시 두 번 실행됩니다 {/*my-calculation-runs-twice-on-every-re-render*/}

[Strict Mode](/reference/react/StrictMode)에서는 React가 일부 함수를 한 번이 아닌 두 번 호출합니다:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // 이 컴포넌트 함수는 매 렌더링 시 두 번 실행됩니다.

  const visibleTodos = useMemo(() => {
    // 이 계산은 의존성이 변경되면 두 번 실행됩니다.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

이는 예상된 것이며 코드를 깨뜨리지 않아야 합니다.

이 **개발 전용** 동작은 [컴포넌트를 순수하게 유지하는 데](#keeping-components-pure) 도움이 됩니다. React는 호출 중 하나의 결과를 사용하고, 다른 호출의 결과는 무시합니다. 컴포넌트와 계산 함수가 순수한 한, 이는 논리에 영향을 미치지 않습니다. 그러나 실수로 불순한 경우, 이를 발견하고 수정하는 데 도움이 됩니다.

예를 들어, 이 불순한 계산 함수는 prop으로 받은 배열을 변형합니다:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 실수: prop을 변형하고 있습니다
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React가 함수를 두 번 호출하므로, 할 일이 두 번 추가된 것을 알 수 있습니다. 계산은 기존 객체를 변경해서는 안 되지만, 계산 중에 생성된 *새로운* 객체는 변경해도 괜찮습니다. 예를 들어, `filterTodos` 함수가 항상 *다른* 배열을 반환하는 경우, 해당 배열을 변경할 수 있습니다:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ 올바름: 계산 중에 생성된 객체를 변형하고 있습니다
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

순수성을 유지하는 것에 대해 더 알아보려면 [컴포넌트를 순수하게 유지하기](/learn/keeping-components-pure)를 읽어보세요.

또한, [객체 업데이트](/learn/updating-objects-in-state) 및 [배열 업데이트](/learn/updating-arrays-in-state)를 변형 없이 수행하는 가이드를 확인하세요.

---

### `useMemo` 호출이 객체를 반환해야 하지만 undefined를 반환합니다 {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

이 코드는 작동하지 않습니다:

```js {1-2,5}
  // 🔴 화살표 함수에서 객체를 반환할 수 없습니다
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

JavaScript에서 `() => {`는 화살표 함수 본문을 시작하므로 `{` 중괄호는 객체의 일부가 아닙니다. 이 때문에 객체를 반환하지 않으며, 실수를 초래합니다. `({` 및 `})`와 같이 괄호를 추가하여 이를 수정할 수 있습니다:

```js {1-2,5}
  // 이는 작동하지만, 누군가가 괄호를 제거하면 쉽게 다시 깨질 수 있습니다
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

그러나, 이는 여전히 혼란스럽고 누군가가 괄호를 제거하여 쉽게 깨질 수 있습니다.

이 실수를 피하려면, 명시적으로 `return` 문을 작성하세요:

```js {1-3,6-7}
  // ✅ 이는 작동하며 명시적입니다
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### 내 컴포넌트가 렌더링될 때마다 `useMemo`의 계산이 다시 실행됩니다 {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

의존성 배열을 두 번째 인수로 지정했는지 확인하세요!

의존성 배열을 잊으면, `useMemo`는 매번 계산을 다시 실행합니다:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 의존성 배열이 없으므로 매번 다시 계산합니다
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

의존성 배열을 두 번째 인수로 전달한 수정된 버전입니다:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ 불필요한 재계산을 하지 않습니다
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

이것이 도움이 되지 않는다면, 문제는 의존성 중 하나가 이전 렌더링과 다르다는 것입니다. 의존성을 수동으로 콘솔에 기록하여 이 문제를 디버그할 수 있습니다:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

다른 렌더링에서 배열을 마우스 오른쪽 버튼으로 클릭하고 "전역 변수로 저장"을 선택할 수 있습니다. 첫 번째 배열이 `temp1`로 저장되고 두 번째 배열이 `temp2`로 저장되었다고 가정하면, 브라우저 콘솔을 사용하여 각 의존성이 동일한지 확인할 수 있습니다:

```js
Object.is(temp1[0], temp2[0]); // 배열 간 첫 번째 의존성이 동일한가요?
Object.is(temp1[1], temp2[1]); // 배열 간 두 번째 의존성이 동일한가요?
Object.is(temp1[2], temp2[2]); // ... 모든 의존성에 대해 계속 ...
```

메모이제이션을 깨뜨리는 의존성을 찾으면, 이를 제거하거나 [또한 메모이제이션](#memoizing-a-dependency-of-another-hook)할 방법을 찾으세요.

---

### 루프에서 각 리스트 항목에 대해 `useMemo`를 호출해야 하지만, 이는 허용되지 않습니다 {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` 컴포넌트가 [`memo`](/reference/react/memo)로 래핑되어 있다고 가정해 보겠습니다. `ReportList` 컴포넌트가 리렌더링될 때 모든 `Chart`의 리렌더링을 건너뛰고자 합니다. 그러나 루프에서 `useMemo`를 호출할 수 없습니다:

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 루프에서 useMemo를 이렇게 호출할 수 없습니다:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chartdata={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

대신, 각 항목에 대한 컴포넌트를 추출하고 개별 항목에 대한 데이터를 메모이제이션하세요:

```js {5,12-18}
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
  // ✅ 최상위 레벨에서 useMemo를 호출하세요:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

또는, `useMemo`를 제거하고 대신 `Report` 자체를 [`memo`](/reference/react/memo)로 래핑할 수 있습니다. `item` prop이 변경되지 않으면, `Report`는 리렌더링을 건너뛰고, 따라서 `Chart`도 리렌더링을 건너뛰게 됩니다:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
