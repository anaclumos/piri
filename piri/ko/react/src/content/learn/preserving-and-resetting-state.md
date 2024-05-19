---
title: 상태 보존 및 재설정
---

<Intro>

상태는 컴포넌트 간에 격리됩니다. React는 UI 트리에서의 위치를 기준으로 각 상태가 어떤 컴포넌트에 속하는지 추적합니다. 상태를 유지할 때와 재설정할 때를 제어할 수 있습니다.

</Intro>

<YouWillLearn>

* React가 상태를 유지하거나 재설정할 때
* React가 컴포넌트의 상태를 강제로 재설정하는 방법
* 키와 타입이 상태 유지 여부에 미치는 영향

</YouWillLearn>

## 상태는 렌더 트리의 위치에 연결됩니다 {/*state-is-tied-to-a-position-in-the-tree*/}

React는 UI의 컴포넌트 구조에 대해 [렌더 트리](learn/understanding-your-ui-as-a-tree#the-render-tree)를 빌드합니다.

컴포넌트에 상태를 부여할 때, 상태가 컴포넌트 내부에 "존재"한다고 생각할 수 있습니다. 하지만 상태는 실제로 React 내부에 저장됩니다. React는 각 상태를 렌더 트리에서 해당 컴포넌트가 위치한 곳과 연결합니다.

여기에는 하나의 `<Counter />` JSX 태그만 있지만, 두 개의 다른 위치에 렌더링됩니다:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

이것들이 트리로 어떻게 보이는지 확인해보세요:    

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="React 컴포넌트 트리의 다이어그램. 루트 노드는 'div'로 표시되며 두 개의 자식을 가지고 있습니다. 각 자식은 'Counter'로 표시되며 둘 다 값이 0인 'count' 상태 버블을 포함합니다.">

React 트리

</Diagram>

</DiagramGroup>

**이들은 각각 트리의 고유한 위치에 렌더링되기 때문에 두 개의 별도 카운터입니다.** React를 사용할 때 이러한 위치에 대해 생각할 필요는 없지만, 작동 방식을 이해하는 데 유용할 수 있습니다.

React에서는 화면의 각 컴포넌트가 완전히 격리된 상태를 가집니다. 예를 들어, 두 개의 `Counter` 컴포넌트를 나란히 렌더링하면 각각 독립적인 `score`와 `hover` 상태를 가집니다.

두 카운터를 클릭해보면 서로 영향을 주지 않는 것을 확인할 수 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

보시다시피, 하나의 카운터가 업데이트될 때 해당 컴포넌트의 상태만 업데이트됩니다:

<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="React 컴포넌트 트리의 다이어그램. 루트 노드는 'div'로 표시되며 두 개의 자식을 가지고 있습니다. 왼쪽 자식은 'Counter'로 표시되며 값이 0인 'count' 상태 버블을 포함합니다. 오른쪽 자식은 'Counter'로 표시되며 값이 1인 'count' 상태 버블을 포함합니다. 오른쪽 자식의 상태 버블은 값이 업데이트되었음을 나타내기 위해 노란색으로 강조 표시됩니다.">

상태 업데이트

</Diagram>

</DiagramGroup>

React는 동일한 위치에 동일한 컴포넌트를 렌더링하는 한 상태를 유지합니다. 이를 확인하려면 두 카운터를 모두 증가시키고, "두 번째 카운터 렌더링" 체크박스를 해제하여 두 번째 컴포넌트를 제거한 다음 다시 체크하여 추가해보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        두 번째 카운터 렌더링
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

두 번째 카운터를 렌더링하지 않으면 상태가 완전히 사라지는 것을 확인할 수 있습니다. 이는 React가 컴포넌트를 제거할 때 상태를 파괴하기 때문입니다.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="React 컴포넌트 트리의 다이어그램. 루트 노드는 'div'로 표시되며 두 개의 자식을 가지고 있습니다. 왼쪽 자식은 'Counter'로 표시되며 값이 0인 'count' 상태 버블을 포함합니다. 오른쪽 자식은 사라졌고, 그 자리에 노란색 'poof' 이미지가 있어 컴포넌트가 트리에서 삭제되었음을 강조합니다.">

컴포넌트 삭제

</Diagram>

</DiagramGroup>

"두 번째 카운터 렌더링"을 체크하면 두 번째 `Counter`와 그 상태가 처음부터 초기화되어 (`score = 0`) DOM에 추가됩니다.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="React 컴포넌트 트리의 다이어그램. 루트 노드는 'div'로 표시되며 두 개의 자식을 가지고 있습니다. 왼쪽 자식은 'Counter'로 표시되며 값이 0인 'count' 상태 버블을 포함합니다. 오른쪽 자식은 'Counter'로 표시되며 값이 0인 'count' 상태 버블을 포함합니다. 오른쪽 자식 노드 전체가 노란색으로 강조되어 트리에 방금 추가되었음을 나타냅니다.">

컴포넌트 추가

</Diagram>

</DiagramGroup>

**React는 UI 트리의 위치에서 렌더링되는 한 컴포넌트의 상태를 유지합니다.** 컴포넌트가 제거되거나 동일한 위치에 다른 컴포넌트가 렌더링되면 React는 상태를 폐기합니다.

## 동일한 위치의 동일한 컴포넌트는 상태를 유지합니다 {/*same-component-at-the-same-position-preserves-state*/}

이 예제에서는 두 개의 다른 `<Counter />` 태그가 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        화려한 스타일 사용
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크박스를 체크하거나 해제할 때 카운터 상태는 재설정되지 않습니다. `isFancy`가 `true`이든 `false`이든 항상 루트 `App` 컴포넌트에서 반환된 `div`의 첫 번째 자식으로 `<Counter />`가 있습니다:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="두 섹션이 화살표로 구분된 다이어그램. 각 섹션에는 'App'으로 표시된 부모가 있으며, 'isFancy' 상태 버블이 있습니다. 이 컴포넌트는 'div'로 표시된 하나의 자식을 가지고 있으며, 자식은 'isFancy' 속성을 포함한 속성 버블을 가지고 있습니다. 마지막 자식은 'Counter'로 표시되며, 두 다이어그램 모두에서 값이 3인 'count' 상태 버블을 포함합니다. 다이어그램의 왼쪽 섹션에서는 아무것도 강조 표시되지 않았고, isFancy 부모 상태 값은 false입니다. 다이어그램의 오른쪽 섹션에서는 isFancy 부모 상태 값이 true로 변경되어 노란색으로 강조 표시되었으며, 아래의 속성 버블도 isFancy 값이 true로 변경되어 노란색으로 강조 표시되었습니다.">

`App` 상태를 업데이트해도 `Counter`는 동일한 위치에 있기 때문에 재설정되지 않습니다

</Diagram>

</DiagramGroup>

React의 관점에서 동일한 위치에 있는 동일한 컴포넌트이므로 동일한 카운터입니다.

<Pitfall>

**React에게 중요한 것은 JSX 마크업이 아닌 UI 트리의 위치입니다!** 이 컴포넌트에는 `if` 내부와 외부에 다른 `<Counter />` JSX 태그가 있는 두 개의 `return` 절이 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => setIsFancy(e.target.checked)}
          />
          화려한 스타일 사용
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => setIsFancy(e.target.checked)}
          />
          화려한 스타일 사용
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크박스를 체크할 때 상태가 재설정될 것이라고 예상할 수 있지만, 그렇지 않습니다! 이는 **이 두 `<Counter />` 태그가 동일한 위치에 렌더링되기 때문입니다.** React는 함수 내 조건의 위치를 알지 못합니다. React가 "보는" 것은 반환된 트리입니다.

두 경우 모두 `App` 컴포넌트는 첫 번째 자식으로 `<Counter />`가 있는 `<div>`를 반환합니다. React에게는 이 두 카운터가 동일한 "주소"를 가지고 있습니다: 루트의 첫 번째 자식의 첫 번째 자식. 이는 로직을 어떻게 구성하든 이전과 다음 렌더링 간에 React가 이를 일치시키는 방식입니다.

</Pitfall>

## 동일한 위치의 다른 컴포넌트는 상태를 재설정합니다 {/*different-components-at-the-same-position-reset-state*/}

이 예제에서는 체크박스를 체크하면 `<Counter>`가 `<p>`로 대체됩니다:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>나중에 봐요!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        휴식하기
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

여기서는 동일한 위치에 _다른_ 컴포넌트 유형을 전환합니다. 처음에는 `<div>`의 첫 번째 자식이 `Counter`를 포함했습니다. 하지만 `p`로 교체하면 React는 `Counter`를 UI 트리에서 제거하고 상태를 파괴합니다.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="세 섹션이 화살표로 구분된 다이어그램. 첫 번째 섹션에는 'div'로 표시된 React 컴포넌트가 있으며, 'count' 상태 버블이 값 3인 'Counter' 자식이 있습니다. 중간 섹션에는 동일한
'div' 부모가 있지만, 자식 컴포넌트는 삭제되었으며, 노란색 'poof' 이미지로 표시됩니다. 세 번째 섹션에는 동일한 'div' 부모가 있으며, 이제 노란색으로 강조된 새로운 자식 'p'가 있습니다.">

`Counter`가 `p`로 변경될 때, `Counter`는 삭제되고 `p`가 추가됩니다

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="세 섹션이 화살표로 구분된 다이어그램. 첫 번째 섹션에는 'p'로 표시된 React 컴포넌트가 있습니다. 중간 섹션에는 동일한 'div' 부모가 있지만, 자식 컴포넌트는 삭제되었으며, 노란색 'poof' 이미지로 표시됩니다. 세 번째 섹션에는 동일한 'div' 부모가 있으며, 이제 노란색으로 강조된 새로운 자식 'Counter'가 있으며, 'count' 상태 버블이 값 0으로 설정되어 있습니다.">

다시 전환할 때, `p`는 삭제되고 `Counter`가 추가됩니다

</Diagram>

</DiagramGroup>

또한, **동일한 위치에 다른 컴포넌트를 렌더링할 때, 해당 하위 트리의 상태가 재설정됩니다.** 이를 확인하려면 카운터를 증가시키고 체크박스를 체크해보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        화려한 스타일 사용
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크박스를 클릭하면 카운터 상태가 재설정됩니다. 비록 `Counter`를 렌더링하지만, `div`의 첫 번째 자식이 `div`에서 `section`으로 변경됩니다. 자식 `div`가 DOM에서 제거되면 그 아래의 전체 트리(포함된 `Counter`와 그 상태 포함)가 파괴됩니다.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="세 섹션이 화살표로 구분된 다이어그램. 첫 번째 섹션에는 'div'로 표시된 React 컴포넌트가 있으며, 'section' 자식이 있으며, 'count' 상태 버블이 값 3인 'Counter' 자식이 있습니다. 중간 섹션에는 동일한 'div' 부모가 있지만, 자식 컴포넌트는 삭제되었으며, 노란색 'poof' 이미지로 표시됩니다. 세 번째 섹션에는 동일한 'div' 부모가 있으며, 이제 노란색으로 강조된 새로운 자식 'div'가 있으며, 'count' 상태 버블이 값 0으로 설정된 새로운 자식 'Counter'가 있습니다.">

`section`이 `div`로 변경될 때, `section`은 삭제되고 새로운 `div`가 추가됩니다

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="세 섹션이 화살표로 구분된 다이어그램. 첫 번째 섹션에는 'div'로 표시된 React 컴포넌트가 있으며, 'div' 자식이 있으며, 'count' 상태 버블이 값 0인 'Counter' 자식이 있습니다. 중간 섹션에는 동일한 'div' 부모가 있지만, 자식 컴포넌트는 삭제되었으며, 노란색 'poof' 이미지로 표시됩니다. 세 번째 섹션에는 동일한 'div' 부모가 있으며, 이제 노란색으로 강조된 새로운 자식 'section'이 있으며, 'count' 상태 버블이 값 0으로 설정된 새로운 자식 'Counter'가 있습니다.">

다시 전환할 때, `div`는 삭제되고 새로운 `section`이 추가됩니다

</Diagram>

</DiagramGroup>

일반적으로, **재렌더링 간에 상태를 유지하려면 트리 구조가 일치해야 합니다.** 구조가 다르면 상태가 파괴됩니다. React는 컴포넌트를 트리에서 제거할 때 상태를 파괴하기 때문입니다.

<Pitfall>

이것이 컴포넌트 함수 정의를 중첩하지 말아야 하는 이유입니다.

여기서 `MyTextField` 컴포넌트 함수는 `MyComponent` 내부에 정의되어 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>클릭 {counter} 번</button>
    </>
  );
}
```

</Sandpack>

버튼을 클릭할 때마다 입력 상태가 사라집니다! 이는 `MyComponent`의 각 렌더링에 대해 *다른* `MyTextField` 함수가 생성되기 때문입니다. 동일한 위치에 *다른* 컴포넌트를 렌더링하고 있으므로 React는 모든 하위 상태를 재설정합니다. 이는 버그와 성능 문제를 초래합니다. 이 문제를 피하려면 **항상 최상위 수준에서 컴포넌트 함수를 선언하고 정의를 중첩하지 마세요.**

</Pitfall>

## 동일한 위치에서 상태 재설정 {/*resetting-state-at-the-same-position*/}

기본적으로 React는 동일한 위치에 있는 동안 컴포넌트의 상태를 유지합니다. 일반적으로 이는 원하는 동작이므로 기본 동작으로 적합합니다. 하지만 때로는 컴포넌트의 상태를 재설정하고 싶을 때가 있습니다. 각 턴 동안 두 플레이어가 점수를 기록할 수 있는 이 앱을 고려해보세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        다음 플레이어!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}의 점수: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

현재 플레이어를 변경할 때 점수가 유지됩니다. 두 `Counter`는 동일한 위치에 나타나므로 React는 이를 *동일한* `Counter`로 간주하고 `person` 속성만 변경합니다.

하지만 개념적으로 이 앱에서는 두 개의 별도 카운터여야 합니다. UI에서 동일한 위치에 나타날 수 있지만, 하나는 Taylor의 카운터이고 다른 하나는 Sarah의 카운터입니다.

전환할 때 상태를 재설정하는 두 가지 방법이 있습니다:

1. 다른 위치에 컴포넌트를 렌더링하기
2. `key`를 사용하여 각 컴포넌트에 명시적인 ID 부여하기

### 옵션 1: 다른 위치에 컴포넌트 렌더링하기 {/*option-1-rendering-a-component-in-different-positions*/}

이 두 `Counter`가 독립적이기를 원한다면, 두 개의 다른 위치에 렌더링할 수 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        다음 플레이어!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}의 점수: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* 처음에는 `isPlayerA`가 `true`입니다. 따라서 첫 번째 위치에는 `Counter` 상태가 있고, 두 번째 위치는 비어 있습니다.
* "다음 플레이어" 버튼을 클릭하면 첫 번째 위치는 비워지지만 두 번째 위치에는 `Counter`가 있습니다.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="React 컴포넌트 트리의 다이어그램. 부모는 'Scoreboard'로 표시되며, 'isPlayerA' 상태 버블이 'true' 값을 가집니다. 왼쪽에 배치된 유일한 자식은 'Counter'로 표시되며, 'count' 상태 버블이 값 0을 가집니다. 왼쪽 자식 전체가 노란색으로 강조되어 추가되었음을 나타냅니다.">

초기 상태

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="React 컴포넌트 트리의 다이어그램. 부모는 'Scoreboard'로 표시되며, 'isPlayerA' 상태 버블이 'false' 값을 가집니다. 상태 버블은 노란색으로 강조되어 변경되었음을 나타냅니다. 왼쪽 자식은 노란색 'poof' 이미지로 대체되어 삭제되었음을 나타내며, 오른쪽에는 노란색으로 강조된 새로운 자식이 있습니다. 새로운 자식은 'Counter'로 표시되며, 'count' 상태 버블이 값 0을 가집니다.">

"다음" 클릭

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="React 컴포넌트 트리의 다이어그램. 부모는 'Scoreboard'로 표시되며, 'isPlayerA' 상태 버블이 'true' 값을 가집니다. 상태 버블은 노란색으로 강조되어 변경되었음을 나타냅니다. 왼쪽에는 노란색으로 강조된 새로운 자식이 있습니다. 새로운 자식은 'Counter'로 표시되며, 'count' 상태 버블이 값 0을 가집니다. 오른쪽 자식은 노란색 'poof' 이미지로 대체되어 삭제되었음을 나타냅니다.">

다시 "다음" 클릭

</Diagram>

</DiagramGroup>

각 `Counter`의 상태는 DOM에서 제거될 때마다 파괴됩니다. 이것이 버튼을 클릭할 때마다 상태가 재설정되는 이유입니다.

이 솔루션은 동일한 위치에 렌더링되는 독립적인 컴포넌트가 몇 개만 있을 때 편리합니다. 이 예제에서는 두 개만 있으므로 JSX에서 둘 다 별도로 렌더링하는 것이 번거롭지 않습니다.

### 옵션 2: 키를 사용하여 상태 재설정하기 {/*option-2-resetting-state-with-a-key*/}

컴포넌트의 상태를 재설정하는 또 다른, 더 일반적인 방법이 있습니다.

[리스트를 렌더링할 때](/learn/rendering-lists#keeping-list-items-in-order-with-key) `key`를 본 적이 있을 것입니다. 키는 리스트에만 국한되지 않습니다! 키를 사용하여 React가 모든 컴포넌트를 구별할 수 있습니다. 기본적으로 React는 부모 내의 순서("첫 번째 카운터", "두 번째 카운터")를 사용하여 컴포넌트를 구분합니다. 하지만 키를 사용하면 React에게 이것이 단순히 *첫 번째* 카운터나 *두 번째* 카운터가 아니라 특정 카운터임을 알릴 수 있습니다. 예를 들어, *Taylor의* 카운터입니다. 이렇게 하면 React는 트리 어디에 나타나든 *Taylor의* 카운터를 인식할 수 있습니다!

이 예제에서는 두 `<Counter />`가 동일한 위치에 나타나도 상태를 공유하지 않습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        다음 플레이어!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}의 점수: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        하나 추가
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Taylor와 Sarah 사이를 전환할 때 상태가 유지되지 않습니다. 이는 **각각 다른 `key`를 부여했기 때문입니다:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

`key`를 지정하면 React는 순서 대신 `key` 자체를 위치의 일부로 사용합니다. 이 때문에 JSX에서 동일한 위치에 렌더링해도 React는 이를 두 개의 다른 카운터로 인식하여 상태를 공유하지 않습니다. 카운터가 화면에 나타날 때마다 상태가 생성됩니다. 제거될 때마다 상태가 파괴됩니다. 전환할 때마다 상태가 계속 재설정됩니다.

<Note>

키는 전역적으로 고유하지 않다는 점을 기억하세요. 부모 내에서만 위치를 지정합니다.

</Note>

### 키를 사용하여 폼 재설정하기 {/*resetting-a-form-with-a-key*/}

키를 사용하여 상태를 재설정하는 것은 폼을 다룰 때 특히 유용합니다.

이 채팅 앱에서 `<Chat>` 컴포넌트는 텍스트 입력 상태를 포함합니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

입력란에 무언가를 입력한 후 "Alice" 또는 "Bob"을 선택해보세요. 입력 상태가 유지되는 것을 확인할 수 있습니다. 이는 `<Chat>`이 트리의 동일한 위치에 렌더링되기 때문입니다.

**많은 앱에서는 이것이 원하는 동작일 수 있지만, 채팅 앱에서는 그렇지 않습니다!** 사용자가 실수로 클릭하여 잘못된 사람에게 메시지를 보내지 않도록 해야 합니다. 이를 해결하려면 `key`를 추가하세요:

```js
<Chat key={to.id} contact={to} />
```

이렇게 하면 다른 수신자를 선택할 때마다 `Chat` 컴포넌트가 처음부터 다시 생성되며, 그 아래의 모든 상태도 초기화됩니다. React는 DOM 요소도 재생성합니다.

이제 수신자를 전환할 때마다 텍스트 필드가 항상 초기화됩니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### 제거된 컴포넌트의 상태 유지하기 {/*preserving-state-for-removed-components*/}

실제 채팅 앱에서는 사용자가 이전 수신자를 다시 선택할 때 입력 상태를 복구하고 싶을 것입니다. 보이지 않는 컴포넌트의 상태를 "살려두는" 몇 가지 방법이 있습니다:

- 모든 채팅을 렌더링하고 CSS로 나머지를 숨길 수 있습니다. 채팅이 트리에서 제거되지 않으므로 로컬 상태가 유지됩니다. 이 솔루션은 간단한 UI에 적합합니다. 하지만 숨겨진 트리가 크고 많은 DOM 노드를 포함하면 매우 느려질 수 있습니다.
- 상태를 [상위로 올려서](/learn/sharing-state-between-components) 각 수신자의 보류 중인 메시지를 부모 컴포넌트에 저장할 수 있습니다. 이렇게 하면 자식 컴포넌트가 제거되더라도 중요한 정보는 부모가 유지합니다. 이것이 가장 일반적인 솔루션입니다.
- React 상태 외에 다른 소스를 사용할 수도 있습니다. 예를 들어, 사용자가 페이지를 실수로 닫아도 메시지 초안이 유지되기를 원할 수 있습니다. 이를 구현하려면 `Chat` 컴포넌트가 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)에서 상태를 초기화하고 초안을 저장하도록 할 수 있습니다.

어떤 전략을 선택하든, Alice와의 채팅은 Bob과의 채팅과 개념적으로 다르므로 현재 수신자에 따라 `<Chat>` 트리에 `key`를 부여하는 것이 합리적입니다.

</DeepDive>

<Recap>

- React는 동일한 위치에 동일한 컴포넌트를 렌더링하는 한 상태를 유지합니다.
- 상태는 JSX 태그에 저장되지 않습니다. 상태는 JSX를 배치한 트리 위치와 연결됩니다.
- 다른 키를 부여하여 하위 트리의 상태를 재설정할 수 있습니다.
- 컴포넌트 정의를 중첩하지 마세요. 그렇지 않으면 상태가 의도치 않게 재설정됩니다.

</Recap>

<Challenges>

#### 사라지는 입력 텍스트 수정하기 {/*fix-disappearing-input-text*/}

이 예제는 버튼을 누르면 메시지를 표시합니다. 그러나 버튼을 누르면 입력도 의도치 않게 재설정됩니다. 왜 이런 일이 발생할까요? 버튼을 눌러도 입력 텍스트가 재설정되지 않도록 수정하세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>힌트: 당신이 좋아하는 도시?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>힌트 숨기기</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>힌트 보기</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

문제는 `Form`이 다른 위치에 렌더링된다는 것입니다. `if` 분기에서는 `div`의 두 번째 자식이지만, `else` 분기에서는 첫 번째 자식입니다. 따라서 각 위치의 컴포넌트 유형이 변경됩니다. 첫 번째 위치는 `p`와 `Form` 사이를 변경하고, 두 번째 위치는 `Form`과 `button` 사이를 변경합니다. React는 컴포넌트 유형이 변경될 때마다 상태를 재설정합니다.

가장 쉬운 해결책은 분기를 통합하여 `Form`이 항상 동일한 위치에 렌더링되도록 하는 것입니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export