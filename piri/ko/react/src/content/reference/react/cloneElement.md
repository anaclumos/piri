---
title: cloneElement
---

<Pitfall>

`cloneElement`를 사용하는 것은 드물며 취약한 코드를 초래할 수 있습니다. [일반적인 대안을 참조하세요.](#alternatives)

</Pitfall>

<Intro>

`cloneElement`를 사용하면 다른 요소를 시작점으로 하여 새로운 React 요소를 만들 수 있습니다.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

`cloneElement`를 호출하여 `element`를 기반으로 하지만 다른 `props`와 `children`을 가진 React 요소를 만듭니다:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[아래에서 더 많은 예제를 참조하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `element`: `element` 인수는 유효한 React 요소여야 합니다. 예를 들어, JSX 노드 `<Something />`, [`createElement`](/reference/react/createElement) 호출 결과, 또는 다른 `cloneElement` 호출 결과일 수 있습니다.

* `props`: `props` 인수는 객체 또는 `null`이어야 합니다. `null`을 전달하면 복제된 요소는 원래 `element.props`를 모두 유지합니다. 그렇지 않으면 `props` 객체의 모든 prop에 대해 반환된 요소는 `element.props`의 값보다 `props`의 값을 "선호"합니다. 나머지 props는 원래 `element.props`에서 채워집니다. `props.key` 또는 `props.ref`를 전달하면 원래 값을 대체합니다.

* **선택적** `...children`: 0개 이상의 자식 노드. React 요소, 문자열, 숫자, [포털](/reference/react-dom/createPortal), 빈 노드(`null`, `undefined`, `true`, `false`), React 노드 배열 등 모든 React 노드가 될 수 있습니다. `...children` 인수를 전달하지 않으면 원래 `element.props.children`이 유지됩니다.

#### 반환값 {/*returns*/}

`cloneElement`는 몇 가지 속성이 있는 React 요소 객체를 반환합니다:

* `type`: `element.type`과 동일합니다.
* `props`: `element.props`와 전달된 `props`를 얕게 병합한 결과입니다.
* `ref`: 원래 `element.ref`, `props.ref`로 재정의되지 않은 경우.
* `key`: 원래 `element.key`, `props.key`로 재정의되지 않은 경우.

일반적으로 요소를 컴포넌트에서 반환하거나 다른 요소의 자식으로 만듭니다. 요소의 속성을 읽을 수 있지만, 생성된 후에는 모든 요소를 불투명하게 취급하고 렌더링만 하는 것이 좋습니다.

#### 주의사항 {/*caveats*/}

* 요소를 복제해도 **원래 요소는 수정되지 않습니다.**

* **모든 자식이 정적으로 알려진 경우에만 `cloneElement`에 자식을 여러 인수로 전달해야 합니다.** 예: `cloneElement(element, null, child1, child2, child3)`. 자식이 동적이면 전체 배열을 세 번째 인수로 전달하세요: `cloneElement(element, null, listItems)`. 이렇게 하면 React가 동적 목록에 대해 [누락된 `key`에 대해 경고합니다](/learn/rendering-lists#keeping-list-items-in-order-with-key). 정적 목록의 경우 재정렬되지 않기 때문에 필요하지 않습니다.

* `cloneElement`는 데이터 흐름을 추적하기 어렵게 만드므로 **[대안](#alternatives)을 시도하세요.**

---

## 사용법 {/*usage*/}

### 요소의 props 재정의 {/*overriding-props-of-an-element*/}

일부 <CodeStep step={1}>React 요소</CodeStep>의 props를 재정의하려면 `cloneElement`에 <CodeStep step={2}>재정의하려는 props</CodeStep>와 함께 전달하세요:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

여기서, 결과 <CodeStep step={3}>복제된 요소</CodeStep>는 `<Row title="Cabbage" isHighlighted={true} />`가 됩니다.

**언제 유용한지 예제를 통해 살펴보겠습니다.**

`List` 컴포넌트가 [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children)을 선택 가능한 행 목록으로 렌더링하고, 선택된 행을 변경하는 "Next" 버튼을 가진다고 가정해보겠습니다. `List` 컴포넌트는 선택된 `Row`를 다르게 렌더링해야 하므로, 받은 모든 `<Row>` 자식을 복제하고 추가 `isHighlighted: true` 또는 `isHighlighted: false` prop을 추가합니다:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

`List`가 받은 원래 JSX가 다음과 같다고 가정해보겠습니다:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

자식을 복제함으로써 `List`는 내부의 모든 `Row`에 추가 정보를 전달할 수 있습니다. 결과는 다음과 같습니다:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

"Next" 버튼을 누르면 `List`의 상태가 업데이트되고 다른 행이 강조 표시되는 것을 확인하세요:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

요약하자면, `List`는 받은 `<Row />` 요소를 복제하고 추가 prop을 추가했습니다.

<Pitfall>

자식을 복제하면 앱의 데이터 흐름을 파악하기 어렵습니다. [대안](#alternatives)을 시도해보세요.

</Pitfall>

---

## 대안 {/*alternatives*/}

### 렌더 prop으로 데이터 전달 {/*passing-data-with-a-render-prop*/}

`cloneElement` 대신 *렌더 prop*인 `renderItem`을 수락하는 것을 고려해보세요. 여기서 `List`는 prop으로 `renderItem`을 받습니다. `List`는 각 항목에 대해 `renderItem`을 호출하고 `isHighlighted`를 인수로 전달합니다:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

`renderItem` prop은 "렌더 prop"이라고 불리는데, 이는 무언가를 렌더링하는 방법을 지정하는 prop이기 때문입니다. 예를 들어, 주어진 `isHighlighted` 값을 가진 `<Row>`를 렌더링하는 `renderItem` 구현을 전달할 수 있습니다:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

결과는 `cloneElement`와 동일합니다:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

그러나 `isHighlighted` 값이 어디에서 오는지 명확하게 추적할 수 있습니다.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

이 패턴은 `cloneElement`보다 더 명확하기 때문에 선호됩니다.

---

### 컨텍스트를 통해 데이터 전달 {/*passing-data-through-context*/}

`cloneElement`의 또 다른 대안은 [컨텍스트를 통해 데이터를 전달하는 것입니다.](/learn/passing-data-deeply-with-context)

예를 들어, [`createContext`](/reference/react/createContext)를 호출하여 `HighlightContext`를 정의할 수 있습니다:

```js
export const HighlightContext = createContext(false);
```

`List` 컴포넌트는 렌더링하는 각 항목을 `HighlightContext` 제공자로 감쌀 수 있습니다:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

이 접근 방식에서는 `Row`가 `isHighlighted` prop을 받을 필요가 없습니다. 대신, 컨텍스트를 읽습니다:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

이렇게 하면 호출하는 컴포넌트가 `<Row>`에 `isHighlighted`를 전달할 필요가 없습니다:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

대신, `List`와 `Row`는 컨텍스트를 통해 강조 표시 로직을 조정합니다.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[컨텍스트를 통해 데이터 전달에 대해 자세히 알아보세요.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### 커스텀 Hook으로 로직 추출 {/*extracting-logic-into-a-custom-hook*/}

시도해볼 수 있는 또 다른 접근 방식은 "비시각적" 로직을 자체 Hook으로 추출하고, Hook에서 반환된 정보를 사용하여 무엇을 렌더링할지 결정하는 것입니다. 예를 들어, 다음과 같은 `useList` 커스텀 Hook을 작성할 수 있습니다:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

그런 다음 다음과 같이 사용할 수 있습니다:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

데이터 흐름은 명확하지만 상태는 `useList` 커스텀 Hook 내부에 있으며, 이를 통해 어떤 컴포넌트에서도 사용할 수 있습니다:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

이 접근 방식은 특히 다른 컴포넌트 간에 이 로직을 재사용하려는 경우 유용합니다.