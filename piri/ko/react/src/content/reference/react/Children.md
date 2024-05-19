---
title: Children
---

<Pitfall>

`Children`를 사용하는 것은 드물며 취약한 코드를 초래할 수 있습니다. [일반적인 대안을 참조하세요.](#alternatives)

</Pitfall>

<Intro>

`Children`를 사용하면 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)으로 받은 JSX를 조작하고 변환할 수 있습니다.

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `Children.count(children)` {/*children-count*/}

`Children.count(children)`를 호출하여 `children` 데이터 구조 내의 자식 수를 셉니다.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[아래에서 더 많은 예제를 참조하세요.](#counting-children)

#### Parameters {/*children-count-parameters*/}

* `children`: 컴포넌트가 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.

#### Returns {/*children-count-returns*/}

이 `children` 내의 노드 수.

#### Caveats {/*children-count-caveats*/}

- 빈 노드(`null`, `undefined`, 그리고 Boolean), 문자열, 숫자, 그리고 [React elements](/reference/react/createElement)는 개별 노드로 간주됩니다. 배열은 개별 노드로 간주되지 않지만, 그 자식들은 개별 노드로 간주됩니다. **탐색은 React elements보다 깊게 가지 않습니다:** 렌더링되지 않으며, 그 자식들도 탐색되지 않습니다. [Fragments](/reference/react/Fragment)는 탐색되지 않습니다.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

`Children.forEach(children, fn, thisArg?)`를 호출하여 `children` 데이터 구조 내의 각 자식에 대해 코드를 실행합니다.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[아래에서 더 많은 예제를 참조하세요.](#running-some-code-for-each-child)

#### Parameters {/*children-foreach-parameters*/}

* `children`: 컴포넌트가 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.
* `fn`: 각 자식에 대해 실행할 함수, [배열 `forEach` 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 콜백과 유사합니다. 첫 번째 인수로 자식을, 두 번째 인수로 인덱스를 받습니다. 인덱스는 `0`에서 시작하여 각 호출마다 증가합니다.
* **optional** `thisArg`: `fn` 함수가 호출될 때의 [`this` 값](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). 생략하면 `undefined`입니다.

#### Returns {/*children-foreach-returns*/}

`Children.forEach`는 `undefined`를 반환합니다.

#### Caveats {/*children-foreach-caveats*/}

- 빈 노드(`null`, `undefined`, 그리고 Boolean), 문자열, 숫자, 그리고 [React elements](/reference/react/createElement)는 개별 노드로 간주됩니다. 배열은 개별 노드로 간주되지 않지만, 그 자식들은 개별 노드로 간주됩니다. **탐색은 React elements보다 깊게 가지 않습니다:** 렌더링되지 않으며, 그 자식들도 탐색되지 않습니다. [Fragments](/reference/react/Fragment)는 탐색되지 않습니다.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

`Children.map(children, fn, thisArg?)`를 호출하여 `children` 데이터 구조 내의 각 자식을 매핑하거나 변환합니다.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[아래에서 더 많은 예제를 참조하세요.](#transforming-children)

#### Parameters {/*children-map-parameters*/}

* `children`: 컴포넌트가 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.
* `fn`: 매핑 함수, [배열 `map` 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 콜백과 유사합니다. 첫 번째 인수로 자식을, 두 번째 인수로 인덱스를 받습니다. 인덱스는 `0`에서 시작하여 각 호출마다 증가합니다. 이 함수에서 React 노드를 반환해야 합니다. 이는 빈 노드(`null`, `undefined`, 또는 Boolean), 문자열, 숫자, React element, 또는 다른 React 노드의 배열일 수 있습니다.
* **optional** `thisArg`: `fn` 함수가 호출될 때의 [`this` 값](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). 생략하면 `undefined`입니다.

#### Returns {/*children-map-returns*/}

`children`이 `null` 또는 `undefined`인 경우, 동일한 값을 반환합니다.

그렇지 않으면, `fn` 함수에서 반환한 노드로 구성된 평면 배열을 반환합니다. 반환된 배열에는 `null`과 `undefined`를 제외한 모든 노드가 포함됩니다.

#### Caveats {/*children-map-caveats*/}

- 빈 노드(`null`, `undefined`, 그리고 Boolean), 문자열, 숫자, 그리고 [React elements](/reference/react/createElement)는 개별 노드로 간주됩니다. 배열은 개별 노드로 간주되지 않지만, 그 자식들은 개별 노드로 간주됩니다. **탐색은 React elements보다 깊게 가지 않습니다:** 렌더링되지 않으며, 그 자식들도 탐색되지 않습니다. [Fragments](/reference/react/Fragment)는 탐색되지 않습니다.

- `fn`에서 키가 있는 요소나 요소 배열을 반환하면, **반환된 요소의 키는 `children`의 해당 원래 항목의 키와 자동으로 결합됩니다.** `fn`에서 배열로 여러 요소를 반환할 때, 그 키는 서로 간에만 고유하면 됩니다.

---

### `Children.only(children)` {/*children-only*/}

`Children.only(children)`를 호출하여 `children`이 단일 React 요소를 나타내는지 확인합니다.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parameters {/*children-only-parameters*/}

* `children`: 컴포넌트가 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.

#### Returns {/*children-only-returns*/}

`children`이 [유효한 요소](/reference/react/isValidElement)인 경우, 해당 요소를 반환합니다.

그렇지 않으면, 오류를 발생시킵니다.

#### Caveats {/*children-only-caveats*/}

- 이 메서드는 **항상 `children`으로 배열(예: `Children.map`의 반환 값)을 전달하면 오류를 발생시킵니다.** 즉, `children`이 단일 React 요소인지, 단일 요소가 있는 배열인지 확인합니다.

---

### `Children.toArray(children)` {/*children-toarray*/}

`Children.toArray(children)`를 호출하여 `children` 데이터 구조를 배열로 만듭니다.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parameters {/*children-toarray-parameters*/}

* `children`: 컴포넌트가 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.

#### Returns {/*children-toarray-returns*/}

`children`의 요소로 구성된 평면 배열을 반환합니다.

#### Caveats {/*children-toarray-caveats*/}

- 빈 노드(`null`, `undefined`, 그리고 Boolean)는 반환된 배열에서 생략됩니다. **반환된 요소의 키는 원래 요소의 키와 중첩 수준 및 위치에서 계산됩니다.** 이는 배열을 평면화해도 동작에 변화가 없도록 보장합니다.

---

## Usage {/*usage*/}

### Transforming children {/*transforming-children*/}

컴포넌트가 [받은 `children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)으로 JSX를 변환하려면 `Children.map`을 호출하세요:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

위 예제에서, `RowList`는 받은 각 자식을 `<div className="Row">` 컨테이너로 감쌉니다. 예를 들어, 부모 컴포넌트가 `RowList`에 `children` prop으로 세 개의 `<p>` 태그를 전달한다고 가정해봅시다:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

그러면, 위의 `RowList` 구현으로 최종 렌더링 결과는 다음과 같이 보일 것입니다:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map`은 [배열을 `map()`으로 변환하는 것과](/learn/rendering-lists) 유사합니다. 차이점은 `children` 데이터 구조가 *불투명*하다는 것입니다. 이는 때때로 배열일지라도, 배열이나 다른 특정 데이터 유형이라고 가정해서는 안 된다는 것을 의미합니다. 변환이 필요할 때는 `Children.map`을 사용해야 합니다.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Why is the children prop not always an array? {/*why-is-the-children-prop-not-always-an-array*/}

React에서 `children` prop은 *불투명*한 데이터 구조로 간주됩니다. 이는 구조에 의존해서는 안 된다는 것을 의미합니다. 자식을 변환, 필터링 또는 계산하려면 `Children` 메서드를 사용해야 합니다.

실제로 `children` 데이터 구조는 종종 내부적으로 배열로 표현됩니다. 그러나 단일 자식만 있는 경우, React는 불필요한 메모리 오버헤드를 피하기 위해 추가 배열을 생성하지 않습니다. `Children` 메서드를 사용하여 `children` prop을 직접 조사하지 않으면, React가 데이터 구조를 실제로 구현하는 방식을 변경하더라도 코드가 깨지지 않습니다.

`children`이 배열일 때도 `Children.map`은 유용한 특별한 동작을 합니다. 예를 들어, `Children.map`은 반환된 요소의 [키](/learn/rendering-lists#keeping-list-items-in-order-with-key)를 전달된 `children`의 키와 결합합니다. 이는 원래 JSX 자식이 위의 예제처럼 래핑되더라도 키를 "잃지" 않도록 보장합니다.

</DeepDive>

<Pitfall>

`children` 데이터 구조는 **JSX로 전달된 컴포넌트의 렌더링 결과를 포함하지 않습니다.** 아래 예제에서, `RowList`가 받은 `children`은 세 개가 아닌 두 개의 항목만 포함합니다:

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

이 때문에 이 예제에서는 두 개의 행 래퍼만 생성됩니다:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**내부 컴포넌트의 렌더링 결과를 조작할 때 가져오는 방법은 없습니다** `<MoreRows />`와 같은. 이 때문에 [대안 솔루션을 사용하는 것이 보통 더 좋습니다.](#alternatives)

</Pitfall>

---

### Running some code for each child {/*running-some-code-for-each-child*/}

`Children.forEach`를 호출하여 `children` 데이터 구조 내의 각 자식을 반복합니다. 반환 값이 없으며, [배열 `forEach` 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)와 유사합니다. 이를 사용하여 사용자 정의 로직을 실행하거나 자체 배열을 구성할 수 있습니다.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // 마지막 구분자를 제거합니다
  return result;
}
```

</Sandpack>

<Pitfall>

앞서 언급했듯이, `children`을 조작할 때 내부 컴포넌트의 렌더링 결과를 가져오는 방법은 없습니다. 이 때문에 [대안 솔루션을 사용하는 것이 보통 더 좋습니다.](#alternatives)

</Pitfall>

---

### Counting children {/*counting-children*/}

`Children.count(children)`를 호출하여 자식 수를 계산합니다.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

앞서 언급했듯이, `children`을 조작할 때 내부 컴포넌트의 렌더링 결과를 가져오는 방법은 없습니다. 이 때문에 [대안 솔루션을 사용하는 것이 보통 더 좋습니다.](#alternatives)

</Pitfall>

---

### Converting children to an array {/*converting-children-to-an-array*/}

`Children.toArray(children)`를 호출하여 `children` 데이터 구조를 일반 JavaScript 배열로 변환합니다. 이를 통해 [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), 또는 [`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)와 같은 내장 배열 메서드를 사용하여 배열을 조작할 수 있습니다.

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

앞서 언급했듯이, `children`을 조작할 때 내부 컴포넌트의 렌더링 결과를 가져오는 방법은 없습니다. 이 때문에 [대안 솔루션을 사용하는 것이 보통 더 좋습니다.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

<Note>

이 섹션에서는 다음과 같이 가져오는 `Children` API(대문자 `C`)의 대안을 설명합니다:

```js
import { Children } from 'react';
```

[소문자 `c`로 `children` prop을 사용하는 것](/learn/passing-props-to-a-component#passing-jsx-as-children)과 혼동하지 마세요. 이는 좋고 권장됩니다.

</Note>

### Exposing multiple components {/*exposing-multiple-components*/}

`Children` 메서드를 사용하여 자식을 조작하는 것은 종종 취약한 코드를 초래합니다. JSX에서 컴포넌트에 자식을 전달할 때, 개별 자식을 조작하거나 변환할 것으로 기대하지 않습니다.

가능한 경우, `Children` 메서드 사용을 피하세요. 예를 들어, `RowList`의 각 자식을 `<div className="Row">`로 감싸고 싶다면, `Row` 컴포넌트를 내보내고 각 행을 수동으로 감싸세요:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`Children.map`을 사용하는 것과 달리, 이 접근 방식은 각 자식을 자동으로 감싸지 않습니다. **그러나 이 접근 방식은 [이전의 `Children.map` 예제](#transforming-children)와 비교하여 중요한 이점이 있습니다.** 더 많은 컴포넌트를 추출해도 작동합니다. 예를 들어, `MoreRows` 컴포넌트를 추출해도 여전히 작동합니다:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`Children.map`을 사용하면 `<MoreRows />`를 단일 자식(및 단일 행)으로 "보기" 때문에 작동하지 않습니다.

---

### Accepting an array of objects as a prop {/*accepting-an-array-of-objects-as-a-prop*/}

명시적으로 배열을 prop으로 전달할 수도 있습니다. 예를 들어, 이 `RowList`는 `rows` 배열을 prop으로 받습니다:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`rows`는 일반 JavaScript 배열이므로, `RowList` 컴포넌트는 내장 배열 메서드인 [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)을 사용할 수 있습니다.

이 패턴은 자식과 함께 구조화된 데이터를 전달하고자 할 때 특히 유용합니다. 아래 예제에서, `TabSwitcher` 컴포넌트는 `tabs` prop으로 객체 배열을 받습니다:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

JSX로 자식을 전달하는 것과 달리, 이 접근 방식은 각 항목과 함께 `header`와 같은 추가 데이터를 연결할 수 있습니다. `tabs`를 직접 작업하고 배열이기 때문에 `Children` 메서드가 필요하지 않습니다.

---

### Calling a render prop to customize rendering {/*calling-a-render-prop-to-customize-rendering*/}

각 항목에 대해 JSX를 생성하는 대신, JSX를 반환하는 함수를 전달하고 필요할 때 해당 함수를 호출할 수 있습니다. 이 예제에서, `App` 컴포넌트는 `renderContent` 함수를 `TabSwitcher` 컴포넌트에 전달합니다. `TabSwitcher` 컴포넌트는 선택된 탭에 대해서만 `renderContent`를 호출합니다:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

`renderContent`와 같은 prop은 *렌더 prop*이라고 불리며, 이는 사용자 인터페이스의 일부를 렌더링하는 방법을 지정하는 prop입니다. 그러나 특별한 것은 없습니다: 이는 단순히 함수인 일반 prop입니다.

렌더 props는 함수이므로 정보를 전달할 수 있습니다. 예를 들어, 이 `RowList` 컴포넌트는 각 행의 `id`와 `index`를 `renderRow` 렌더 prop에 전달하며, `index`를 사용하여 짝수 행을 강조 표시합니다:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

이는 부모와 자식 컴포넌트가 자식을 조작하지 않고 협력할 수 있는 또 다른 예입니다.

---

## Troubleshooting {/*troubleshooting*/}

### I pass a custom component, but the `Children` methods don't show its render result {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

다음과 같이 `RowList`에 두 자식을 전달한다고 가정해봅시다:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

`RowList` 내부에서 `Children.count(children)`을 호출하면 `2`가 반환됩니다. `MoreRows`가 10개의 다른 항목을 렌더링하더라도, 또는 `null`을 반환하더라도, `Children.count(children)`은 여전히 `2`입니다. `RowList`의 관점에서, 받은 JSX만 "보입니다". `MoreRows` 컴포넌트의 내부는 "보이지" 않습니다.

이 제한으로 인해 컴포넌트를 추출하기가 어렵습니다. 이 때문에 `Children`을 사용하는 것보다 [대안](#alternatives)을 사용하는 것이 좋습니다.