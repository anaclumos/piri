---
title: React로 사고하기
---

<Intro>

React는 당신이 보는 디자인과 당신이 만드는 앱에 대한 생각을 바꿀 수 있습니다. React로 사용자 인터페이스를 구축할 때, 먼저 *컴포넌트*라고 불리는 조각으로 나눌 것입니다. 그런 다음 각 컴포넌트의 다양한 시각적 상태를 설명할 것입니다. 마지막으로, 데이터를 통해 컴포넌트를 연결할 것입니다. 이 튜토리얼에서는 React로 검색 가능한 제품 데이터 테이블을 구축하는 사고 과정을 안내할 것입니다.

</Intro>

## 목업에서 시작하기 {/*start-with-the-mockup*/}

디자이너로부터 JSON API와 목업을 이미 가지고 있다고 상상해보세요.

JSON API는 다음과 같은 데이터를 반환합니다:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

목업은 다음과 같습니다:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

React에서 UI를 구현하려면 보통 동일한 다섯 단계를 따릅니다.

## 단계 1: UI를 컴포넌트 계층 구조로 나누기 {/*step-1-break-the-ui-into-a-component-hierarchy*/}

목업에서 모든 컴포넌트와 하위 컴포넌트 주위에 상자를 그리며 이름을 붙이는 것부터 시작하세요. 디자이너와 함께 작업하는 경우, 그들은 이미 디자인 도구에서 이러한 컴포넌트에 이름을 붙였을 수 있습니다. 그들에게 물어보세요!

배경에 따라 디자인을 컴포넌트로 나누는 방법을 다르게 생각할 수 있습니다:

* **프로그래밍**--새로운 함수나 객체를 생성할지 결정하는 데 사용하는 동일한 기술을 사용하세요. 한 가지 기술은 [단일 책임 원칙](https://en.wikipedia.org/wiki/Single_responsibility_principle)으로, 컴포넌트는 이상적으로 하나의 일만 해야 합니다. 만약 그것이 커지면, 더 작은 하위 컴포넌트로 분해해야 합니다.
* **CSS**--클래스 선택자를 만들 것들을 고려하세요. (그러나 컴포넌트는 조금 덜 세분화됩니다.)
* **디자인**--디자인의 레이어를 어떻게 구성할지 고려하세요.

JSON이 잘 구조화되어 있다면, UI의 컴포넌트 구조에 자연스럽게 매핑되는 경우가 많습니다. 이는 UI와 데이터 모델이 종종 동일한 정보 아키텍처, 즉 동일한 형태를 가지기 때문입니다. UI를 컴포넌트로 분리하고, 각 컴포넌트가 데이터 모델의 한 조각과 일치하도록 하세요.

이 화면에는 다섯 개의 컴포넌트가 있습니다:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (회색)은 전체 앱을 포함합니다.
2. `SearchBar` (파란색)은 사용자 입력을 받습니다.
3. `ProductTable` (라벤더색)은 사용자 입력에 따라 목록을 표시하고 필터링합니다.
4. `ProductCategoryRow` (녹색)은 각 카테고리의 헤딩을 표시합니다.
5. `ProductRow` (노란색)은 각 제품에 대한 행을 표시합니다.

</CodeDiagram>

</FullWidth>

`ProductTable` (라벤더색)을 보면, 테이블 헤더(“Name”과 “Price” 레이블을 포함)는 자체 컴포넌트가 아닙니다. 이는 선호도의 문제이며, 어느 쪽으로든 갈 수 있습니다. 이 예제에서는 `ProductTable`의 목록 안에 나타나기 때문에 `ProductTable`의 일부입니다. 그러나 이 헤더가 복잡해지면(예: 정렬을 추가하는 경우), 이를 별도의 `ProductTableHeader` 컴포넌트로 이동할 수 있습니다.

이제 목업에서 컴포넌트를 식별했으므로, 이를 계층 구조로 배열하세요. 목업에서 다른 컴포넌트 내에 나타나는 컴포넌트는 계층 구조에서 자식으로 나타나야 합니다:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## 단계 2: React에서 정적 버전 만들기 {/*step-2-build-a-static-version-in-react*/}

이제 컴포넌트 계층 구조를 가지고 있으므로, 앱을 구현할 차례입니다. 가장 간단한 접근 방식은 데이터 모델에서 UI를 렌더링하는 버전을 구축하는 것입니다. 아직 상호작용을 추가하지 마세요! 정적 버전을 먼저 구축하고 나중에 상호작용을 추가하는 것이 종종 더 쉽습니다. 정적 버전을 구축하는 것은 많은 타이핑이 필요하지만 생각할 필요는 없습니다. 반면 상호작용을 추가하는 것은 많은 생각이 필요하지만 타이핑은 많지 않습니다.

데이터 모델을 렌더링하는 앱의 정적 버전을 구축하려면, 다른 컴포넌트를 재사용하고 [props를 사용하여](/learn/passing-props-to-a-component) 데이터를 전달하는 [컴포넌트](/learn/your-first-component)를 구축하고 싶을 것입니다. Props는 부모에서 자식으로 데이터를 전달하는 방법입니다. (만약 [state](/learn/state-a-components-memory) 개념에 익숙하다면, 이 정적 버전을 구축할 때 state를 전혀 사용하지 마세요. State는 상호작용, 즉 시간이 지남에 따라 변하는 데이터에만 예약되어 있습니다. 이것은 앱의 정적 버전이므로 필요하지 않습니다.)

계층 구조에서 상위 컴포넌트(`FilterableProductTable`)를 구축하는 것부터 시작하여 "상향식"으로 구축하거나 하위 컴포넌트(`ProductRow`)부터 작업하는 "하향식"으로 구축할 수 있습니다. 더 간단한 예제에서는 상향식이 더 쉽고, 더 큰 프로젝트에서는 하향식이 더 쉽습니다.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(이 코드가 겁나 보인다면, [빠른 시작](/learn/)을 먼저 진행하세요!)

컴포넌트를 구축한 후에는 데이터 모델을 렌더링하는 재사용 가능한 컴포넌트 라이브러리를 갖게 됩니다. 이것은 정적 앱이기 때문에 컴포넌트는 JSX만 반환할 것입니다. 계층 구조의 최상위 컴포넌트(`FilterableProductTable`)는 데이터 모델을 prop으로 받을 것입니다. 이것은 _단방향 데이터 흐름_이라고 하며, 데이터가 최상위 컴포넌트에서 트리의 하단에 있는 컴포넌트로 흐르기 때문입니다.

<Pitfall>

이 시점에서는 state 값을 사용하지 않아야 합니다. 이는 다음 단계에서 다룰 것입니다!

</Pitfall>

## 단계 3: UI 상태의 최소하지만 완전한 표현 찾기 {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

UI를 상호작용 가능하게 만들려면 사용자가 기본 데이터 모델을 변경할 수 있도록 해야 합니다. 이를 위해 *state*를 사용할 것입니다.

State를 앱이 기억해야 하는 최소한의 변경 데이터로 생각하세요. 상태를 구조화하는 가장 중요한 원칙은 [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)를 유지하는 것입니다. 애플리케이션에 필요한 상태의 절대 최소 표현을 찾아내고 나머지는 필요할 때마다 계산하세요. 예를 들어, 쇼핑 목록을 작성하는 경우, 항목을 state의 배열로 저장할 수 있습니다. 목록의 항목 수를 표시하려면, 항목 수를 또 다른 state 값으로 저장하지 말고 배열의 길이를 읽으세요.

이 예제 애플리케이션의 모든 데이터 조각을 생각해보세요:

1. 원래의 제품 목록
2. 사용자가 입력한 검색 텍스트
3. 체크박스의 값
4. 필터링된 제품 목록

이 중 어떤 것이 state일까요? state가 아닌 것을 식별하세요:

* 시간이 지나도 **변하지 않나요**? 그렇다면 state가 아닙니다.
* **부모로부터 props로 전달**되나요? 그렇다면 state가 아닙니다.
* **기존 state나 props를 기반으로 계산할 수 있나요**? 그렇다면 *확실히* state가 아닙니다!

남은 것은 아마도 state일 것입니다.

다시 하나씩 살펴봅시다:

1. 원래의 제품 목록은 **props로 전달되므로 state가 아닙니다.**
2. 검색 텍스트는 시간이 지남에 따라 변경되며 아무것도 기반으로 계산할 수 없으므로 state인 것 같습니다.
3. 체크박스의 값은 시간이 지남에 따라 변경되며 아무것도 기반으로 계산할 수 없으므로 state인 것 같습니다.
4. 필터링된 제품 목록은 **원래의 제품 목록을 가져와 검색 텍스트와 체크박스 값을 기준으로 필터링하여 계산할 수 있으므로 state가 아닙니다.**

이것은 검색 텍스트와 체크박스 값만 state라는 것을 의미합니다! 잘 했습니다!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

React에는 두 가지 유형의 "모델" 데이터가 있습니다: props와 state. 이 둘은 매우 다릅니다:

* [**Props**는 함수에 전달하는 인수와 같습니다.](/learn/passing-props-to-a-component) 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하고 외관을 사용자 정의할 수 있게 합니다. 예를 들어, `Form`은 `Button`에 `color` prop을 전달할 수 있습니다.
* [**State**는 컴포넌트의 메모리와 같습니다.](/learn/state-a-components-memory) 컴포넌트가 일부 정보를 추적하고 상호작용에 응답하여 변경할 수 있게 합니다. 예를 들어, `Button`은 `isHovered` state를 추적할 수 있습니다.

Props와 state는 다르지만 함께 작동합니다. 부모 컴포넌트는 종종 일부 정보를 state에 유지하고(변경할 수 있도록) *자식 컴포넌트에 props로 전달*합니다. 처음 읽을 때는 차이가 모호하게 느껴질 수 있습니다. 연습을 통해 확실히 이해할 수 있습니다!

</DeepDive>

## 단계 4: 상태가 있어야 할 위치 식별하기 {/*step-4-identify-where-your-state-should-live*/}

앱의 최소 상태 데이터를 식별한 후, 이 상태를 변경할 책임이 있는 컴포넌트, 즉 상태를 *소유*하는 컴포넌트를 식별해야 합니다. 기억하세요: React는 단방향 데이터 흐름을 사용하여 데이터를 부모 컴포넌트에서 자식 컴포넌트로 전달합니다. 어떤 컴포넌트가 어떤 상태를 소유해야 하는지 즉시 명확하지 않을 수 있습니다. 이 개념에 익숙하지 않다면 어려울 수 있지만, 다음 단계를 따르면 해결할 수 있습니다!

애플리케이션의 각 상태 조각에 대해:

1. 해당 상태를 기반으로 무언가를 렌더링하는 *모든* 컴포넌트를 식별하세요.
2. 계층 구조에서 모든 컴포넌트 위에 있는 가장 가까운 공통 부모 컴포넌트를 찾으세요.
3. 상태가 어디에 있어야 하는지 결정하세요:
    1. 종종 상태를 공통 부모에 직접 넣을 수 있습니다.
    2. 상태를 공통 부모 위의 일부 컴포넌트에 넣을 수도 있습니다.
    3. 상태를 소유할 적절한 컴포넌트를 찾을 수 없다면, 상태를 보유하기 위한 새 컴포넌트를 생성하고 공통 부모 컴포넌트 위의 계층 구조에 추가하세요.

이전 단계에서 이 애플리케이션의 두 가지 상태 조각을 찾았습니다: 검색 입력 텍스트와 체크박스 값. 이 예제에서는 항상 함께 나타나므로 동일한 위치에 넣는 것이 합리적입니다.

이제 이를 위한 전략을 실행해 봅시다:

1. **상태를 사용하는 컴포넌트 식별:**
    * `ProductTable`은 해당 상태(검색 텍스트와 체크박스 값)를 기반으로 제품 목록을 필터링해야 합니다.
    * `SearchBar`는 해당 상태(검색 텍스트와 체크박스 값)를 표시해야 합니다.
1. **공통 부모 찾기:** 두 컴포넌트가 공유하는 첫 번째 부모 컴포넌트는 `FilterableProductTable`입니다.
2. **상태가 어디에 있어야 하는지 결정:** 필터 텍스트와 체크된 상태 값을 `FilterableProductTable`에 유지할 것입니다.

따라서 상태 값은 `FilterableProductTable`에 있을 것입니다.

[`useState()` Hook](/reference/react/useState)을 사용하여 컴포넌트에 상태를 추가하세요. Hook은 React에 "연결"할 수 있게 해주는 특별한 함수입니다. `FilterableProductTable`의 상단에 두 개의 상태 변수를 추가하고 초기 상태를 지정하세요:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

그런 다음 `filterText`와 `inStockOnly`를 `ProductTable`과 `SearchBar`에 props로 전달하세요:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

이제 애플리케이션이 어떻게 동작할지 볼 수 있습니다. 아래 샌드박스 코드에서 `useState('')`의 초기 값을 `useState('fruit')`로 편집하세요. 검색 입력 텍스트와 테이블이 업데이트되는 것을 볼 수 있습니다:

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

입력 양식을 편집하는 것이 아직 작동하지 않는 것을 주목하세요. 위의 샌드박스에는 그 이유를 설명하는 콘솔 오류가 있습니다:

<ConsoleBlock level="error">

\`value\` prop을 \`onChange\` 핸들러 없이 폼 필드에 제공했습니다. 이는 읽기 전용 필드를 렌더링합니다.

</ConsoleBlock>

위의 샌드박스에서 `ProductTable`과 `SearchBar`는 `filterText`와 `inStockOnly` props를 읽어 테이블, 입력 및 체크박스를 렌더링합니다. 예를 들어, `SearchBar`가 입력 값을 채우는 방법은 다음과 같습니다:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

그러나 아직 사용자의 동작(예: 타이핑)에 응답하는 코드를 추가하지 않았습니다. 이것이 마지막 단계가 될 것입니다.

## 단계 5: 역방향 데이터 흐름 추가하기 {/*step-5-add-inverse-data-flow*/}

현재 앱은 props와 state가 계층 구조를 따라 아래로 흐르면서 올바르게 렌더링됩니다. 그러나 사용자 입력에 따라 상태를 변경하려면 데이터가 반대 방향으로 흐르도록 지원해야 합니다: 계층 구조 깊숙이 있는 폼 컴포넌트가 `FilterableProductTable`의 상태를 업데이트해야 합니다.

React는 이 데이터 흐름을 명시적으로 만듭니다. 그러나 양방향 데이터 바인딩보다 약간 더 많은 타이핑이 필요합니다. 위의 예제에서 입력하거나 체크박스를 선택하려고 하면 React가 입력을 무시하는 것을 볼 수 있습니다. 이는 의도적입니다. `<input value={filterText} />`를 작성함으로써, 입력의 `value` prop을 항상 `FilterableProductTable`에서 전달된 `filterText` 상태와 동일하게 설정했습니다. `filterText` 상태가 설정되지 않으므로 입력이 변경되지 않습니다.

사용자가 폼 입력을 변경할 때마다 상태가 이러한 변경 사항을 반영하도록 만들고 싶습니다. 상태는 `FilterableProductTable`에 의해 소유되므로, `setFilterText`와 `setInStockOnly`를 호출할 수 있는 것은 `FilterableProductTable`뿐입니다. `SearchBar`가 `FilterableProductTable`의 상태를 업데이트할 수 있도록 하려면, 이러한 함수를 `SearchBar`에 전달해야 합니다:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar` 내부에서 `onChange` 이벤트 핸들러를 추가하고 그들로부터 부모 상태를 설정할 것입니다:

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

이제 애플리케이션이 완전히 작동합니다!

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

이벤트 처리 및 상태 업데이트에 대해 자세히 알아보려면 [상호작용 추가](/learn/adding-interactivity) 섹션을 참조하세요.

## 여기서 어디로 갈까요 {/*where-to-go-from-here*/}

이것은 React로 컴포넌트와 애플리케이션을 구축하는 방법에 대한 매우 간략한 소개였습니다. 지금 바로 [React 프로젝트를 시작](/learn/installation)하거나 이 튜토리얼에서 사용된 모든 구문에 대해 [더 깊이 파고들기](/learn/describing-the-ui) 할 수 있습니다.