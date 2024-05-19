---
title: 컴포넌트 간 상태 공유
---

<Intro>

때때로 두 컴포넌트의 상태가 항상 함께 변경되기를 원할 때가 있습니다. 이를 위해 두 컴포넌트에서 상태를 제거하고, 가장 가까운 공통 부모로 이동한 다음 props를 통해 그들에게 전달합니다. 이것을 *상태 올리기*라고 하며, React 코드를 작성할 때 가장 일반적으로 수행하는 작업 중 하나입니다.

</Intro>

<YouWillLearn>

- 상태를 올려서 컴포넌트 간에 상태를 공유하는 방법
- 제어 컴포넌트와 비제어 컴포넌트란 무엇인가

</YouWillLearn>

## 예제로 상태 올리기 {/*lifting-state-up-by-example*/}

이 예제에서 부모 `Accordion` 컴포넌트는 두 개의 별도 `Panel`을 렌더링합니다:

* `Accordion`
  - `Panel`
  - `Panel`

각 `Panel` 컴포넌트는 내용이 보이는지 여부를 결정하는 boolean `isActive` 상태를 가지고 있습니다.

두 패널의 Show 버튼을 누르세요:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

한 패널의 버튼을 누르는 것이 다른 패널에 영향을 미치지 않는 것을 주목하세요--그들은 독립적입니다.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

처음에는 각 `Panel`의 `isActive` 상태가 `false`이므로 둘 다 접혀 있습니다

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

어느 `Panel`의 버튼을 클릭하더라도 그 `Panel`의 `isActive` 상태만 업데이트됩니다

</Diagram>

</DiagramGroup>

**하지만 이제 한 번에 하나의 패널만 확장되도록 변경하고 싶다고 가정해 봅시다.** 이 디자인에서는 두 번째 패널을 확장하면 첫 번째 패널이 접혀야 합니다. 어떻게 할 수 있을까요?

이 두 패널을 조정하려면 세 단계로 상태를 부모 컴포넌트로 "올려야" 합니다:

1. **자식 컴포넌트에서** 상태를 제거합니다.
2. **공통 부모로부터** 하드코딩된 데이터를 전달합니다.
3. **공통 부모에** 상태를 추가하고 이벤트 핸들러와 함께 전달합니다.

이렇게 하면 `Accordion` 컴포넌트가 두 `Panel`을 조정하고 한 번에 하나만 확장할 수 있습니다.

### 1단계: 자식 컴포넌트에서 상태 제거하기 {/*step-1-remove-state-from-the-child-components*/}

`Panel`의 `isActive`를 부모 컴포넌트가 제어하도록 합니다. 이는 부모 컴포넌트가 `isActive`를 props로 `Panel`에 전달한다는 것을 의미합니다. 먼저 `Panel` 컴포넌트에서 **이 줄을 제거**합니다:

```js
const [isActive, setIsActive] = useState(false);
```

그리고 대신 `isActive`를 `Panel`의 props 목록에 추가합니다:

```js
function Panel({ title, children, isActive }) {
```

이제 `Panel`의 부모 컴포넌트는 [props로 전달하여](/learn/passing-props-to-a-component) `isActive`를 *제어*할 수 있습니다. 반대로, 이제 `Panel` 컴포넌트는 `isActive`의 값을 *제어할 수 없습니다*--이제 부모 컴포넌트에 달려 있습니다!

### 2단계: 공통 부모로부터 하드코딩된 데이터 전달하기 {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

상태를 올리려면 조정하려는 *두* 자식 컴포넌트의 가장 가까운 공통 부모 컴포넌트를 찾아야 합니다:

* `Accordion` *(가장 가까운 공통 부모)*
  - `Panel`
  - `Panel`

이 예제에서는 `Accordion` 컴포넌트입니다. 두 패널 위에 있으며 그들의 props를 제어할 수 있기 때문에 현재 활성화된 패널의 "진실의 원천"이 됩니다. `Accordion` 컴포넌트가 두 패널에 `isActive`의 하드코딩된 값을 전달하도록 합니다 (예: `true`):

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`Accordion` 컴포넌트에서 하드코딩된 `isActive` 값을 편집하고 화면에서 결과를 확인해 보세요.

### 3단계: 공통 부모에 상태 추가하기 {/*step-3-add-state-to-the-common-parent*/}

상태를 올리면 종종 저장하는 상태의 성격이 바뀝니다.

이 경우, 한 번에 하나의 패널만 활성화되어야 합니다. 이는 `Accordion` 공통 부모 컴포넌트가 *어느* 패널이 활성화되어 있는지를 추적해야 함을 의미합니다. `boolean` 값 대신, 상태 변수로 활성 `Panel`의 인덱스를 나타내는 숫자를 사용할 수 있습니다:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

`activeIndex`가 `0`일 때 첫 번째 패널이 활성화되고, `1`일 때 두 번째 패널이 활성화됩니다.

어느 `Panel`의 "Show" 버튼을 클릭하면 `Accordion`의 활성 인덱스를 변경해야 합니다. `Panel`은 `Accordion` 내부에 정의된 `activeIndex` 상태를 직접 설정할 수 없습니다. `Accordion` 컴포넌트는 [이벤트 핸들러를 props로 전달하여](/learn/responding-to-events#passing-event-handlers-as-props) `Panel` 컴포넌트가 상태를 변경할 수 있도록 *명시적으로 허용*해야 합니다:

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

이제 `Panel` 내부의 `<button>`은 클릭 이벤트 핸들러로 `onShow` props를 사용합니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

이로써 상태 올리기가 완료되었습니다! 상태를 공통 부모 컴포넌트로 이동하면 두 패널을 조정할 수 있습니다. 두 "보여짐" 플래그 대신 활성 인덱스를 사용하면 한 번에 하나의 패널만 활성화됩니다. 그리고 이벤트 핸들러를 자식에게 전달하면 자식이 부모의 상태를 변경할 수 있습니다.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

처음에는 `Accordion`의 `activeIndex`가 `0`이므로 첫 번째 `Panel`이 `isActive = true`를 받습니다

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

`Accordion`의 `activeIndex` 상태가 `1`로 변경되면 두 번째 `Panel`이 대신 `isActive = true`를 받습니다

</Diagram>

</DiagramGroup>

<DeepDive>

#### 제어 컴포넌트와 비제어 컴포넌트 {/*controlled-and-uncontrolled-components*/}

일부 로컬 상태를 가진 컴포넌트를 "비제어"라고 부르는 것이 일반적입니다. 예를 들어, `isActive` 상태 변수를 가진 원래의 `Panel` 컴포넌트는 비제어 컴포넌트입니다. 왜냐하면 부모가 패널이 활성화되었는지 여부에 영향을 미칠 수 없기 때문입니다.

반대로, 중요한 정보가 로컬 상태가 아닌 props에 의해 구동되는 컴포넌트를 "제어"된다고 할 수 있습니다. 이렇게 하면 부모 컴포넌트가 그 동작을 완전히 지정할 수 있습니다. `isActive` props를 가진 최종 `Panel` 컴포넌트는 `Accordion` 컴포넌트에 의해 제어됩니다.

비제어 컴포넌트는 부모 내에서 사용하기 더 쉽습니다. 왜냐하면 설정이 덜 필요하기 때문입니다. 하지만 함께 조정하려고 할 때는 덜 유연합니다. 제어 컴포넌트는 최대한 유연하지만, 부모 컴포넌트가 props로 완전히 설정해야 합니다.

실제로 "제어"와 "비제어"는 엄격한 기술 용어가 아닙니다--각 컴포넌트는 일반적으로 로컬 상태와 props의 혼합을 가지고 있습니다. 그러나 이것은 컴포넌트가 어떻게 설계되었는지와 어떤 기능을 제공하는지에 대해 이야기하는 유용한 방법입니다.

컴포넌트를 작성할 때, 그 안의 어떤 정보가 제어되어야 하는지(props를 통해)와 어떤 정보가 비제어되어야 하는지(state를 통해)를 고려하세요. 하지만 언제든지 마음을 바꾸고 나중에 리팩터링할 수 있습니다.

</DeepDive>

## 각 상태에 대한 단일 진실의 원천 {/*a-single-source-of-truth-for-each-state*/}

React 애플리케이션에서는 많은 컴포넌트가 자체 상태를 가질 것입니다. 일부 상태는 입력과 같은 리프 컴포넌트(트리의 하단에 있는 컴포넌트) 근처에 "살" 수 있습니다. 다른 상태는 앱의 상단에 더 가까이 "살" 수 있습니다. 예를 들어, 클라이언트 측 라우팅 라이브러리도 일반적으로 현재 경로를 React 상태에 저장하고 props로 전달하여 구현됩니다!

**각 고유한 상태 조각에 대해, 그 상태를 "소유"하는 컴포넌트를 선택할 것입니다.** 이 원칙은 ["단일 진실의 원천"](https://en.wikipedia.org/wiki/Single_source_of_truth)으로도 알려져 있습니다. 이는 모든 상태가 한 곳에 있어야 한다는 의미는 아닙니다--하지만 _각_ 상태 조각에 대해, 그 정보를 보유하는 _특정_ 컴포넌트가 있다는 것을 의미합니다. 공유 상태를 컴포넌트 간에 중복하지 말고, *공통 부모로 올리고*, 필요한 자식에게 *전달*하세요.

앱을 작업하면서 변경될 것입니다. 각 상태 조각이 "사는" 위치를 아직 파악하지 못한 동안 상태를 아래로 또는 다시 위로 이동하는 것이 일반적입니다. 이것은 모두 과정의 일부입니다!

몇 가지 더 많은 컴포넌트와 함께 실제로 어떤 느낌인지 보려면 [Thinking in React](/learn/thinking-in-react)를 읽어보세요.

<Recap>

* 두 컴포넌트를 조정하려면, 상태를 공통 부모로 이동하세요.
* 그런 다음 공통 부모로부터 props를 통해 정보를 전달하세요.
* 마지막으로, 자식이 부모의 상태를 변경할 수 있도록 이벤트 핸들러를 전달하세요.
* 컴포넌트를 "제어"(props에 의해 구동) 또는 "비제어"(state에 의해 구동)로 간주하는 것이 유용합니다.

</Recap>

<Challenges>

#### 동기화된 입력 {/*synced-inputs*/}

이 두 입력은 독립적입니다. 입력 중 하나를 편집하면 동일한 텍스트로 다른 입력이 업데이트되도록 만드세요.

<Hint>

상태를 부모 컴포넌트로 올려야 합니다.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

`text` 상태 변수를 부모 컴포넌트로 이동하고 `handleChange` 핸들러도 함께 이동합니다. 그런 다음 이를 두 `Input` 컴포넌트에 props로 전달합니다. 이렇게 하면 동기화됩니다.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### 목록 필터링 {/*filtering-a-list*/}

이 예제에서 `SearchBar`는 텍스트 입력을 제어하는 자체 `query` 상태를 가지고 있습니다. 부모 `FilterableList` 컴포넌트는 항목의 `List`를 표시하지만 검색 쿼리를 고려하지 않습니다.

`filterItems(foods, query)` 함수를 사용하여 검색 쿼리에 따라 목록을 필터링하세요. 변경 사항을 테스트하려면 입력에 "s"를 입력하여 목록이 "Sushi", "Shish kebab", "Dim sum"으로 필터링되는지 확인하세요.

`filterItems`는 이미 구현되어 있고 가져오기 때문에 직접 작성할 필요는 없습니다!

<Hint>

`query` 상태와 `handleChange` 핸들러를 `SearchBar`에서 제거하고 `FilterableList`로 이동해야 합니다. 그런 다음 이를 `query` 및 `onChange` props로 `SearchBar`에 전달하세요.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

`query` 상태를 `FilterableList` 컴포넌트로 올립니다. `filterItems(foods, query)`를 호출하여 필터링된 목록을 가져오고 이를 `List`에 전달합니다. 이제 쿼리 입력을 변경하면 목록에 반영됩니다:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>