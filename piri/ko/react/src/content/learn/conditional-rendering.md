---
title: 조건부 렌더링
---

<Intro>

컴포넌트는 종종 다양한 조건에 따라 다른 것을 표시해야 합니다. React에서는 `if` 문, `&&`, `? :` 연산자와 같은 JavaScript 구문을 사용하여 조건부로 JSX를 렌더링할 수 있습니다.

</Intro>

<YouWillLearn>

* 조건에 따라 다른 JSX를 반환하는 방법
* JSX의 일부를 조건부로 포함하거나 제외하는 방법
* React 코드베이스에서 자주 접하게 될 조건부 구문 단축키

</YouWillLearn>

## 조건부로 JSX 반환하기 {/*conditionally-returning-jsx*/}

여러 `Item`을 렌더링하는 `PackingList` 컴포넌트가 있고, 이 `Item`들은 포장되었는지 여부를 표시할 수 있다고 가정해 봅시다:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

일부 `Item` 컴포넌트의 `isPacked` prop이 `false` 대신 `true`로 설정된 것을 확인할 수 있습니다. `isPacked={true}`인 경우 포장된 항목에 체크 표시(✔)를 추가하고 싶습니다.

이를 [`if`/`else` 문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)으로 다음과 같이 작성할 수 있습니다:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

`isPacked` prop이 `true`인 경우 이 코드는 **다른 JSX 트리를 반환합니다.** 이 변경으로 인해 일부 항목에 끝에 체크 표시가 추가됩니다:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

각 경우에 반환되는 내용을 편집해 보고 결과가 어떻게 변하는지 확인해 보세요!

JavaScript의 `if` 및 `return` 문을 사용하여 분기 로직을 생성하는 방법을 주목하세요. React에서는 제어 흐름(조건 등)이 JavaScript에 의해 처리됩니다.

### `null`로 아무것도 반환하지 않기 {/*conditionally-returning-nothing-with-null*/}

어떤 상황에서는 아무것도 렌더링하지 않기를 원할 수 있습니다. 예를 들어, 포장된 항목을 전혀 표시하지 않으려는 경우가 있습니다. 컴포넌트는 반드시 무언가를 반환해야 합니다. 이 경우 `null`을 반환할 수 있습니다:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

`isPacked`가 true인 경우, 컴포넌트는 아무것도 반환하지 않고, `null`을 반환합니다. 그렇지 않으면 렌더링할 JSX를 반환합니다.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

실제로 컴포넌트에서 `null`을 반환하는 것은 일반적이지 않습니다. 이는 렌더링하려는 개발자를 놀라게 할 수 있기 때문입니다. 더 자주, 부모 컴포넌트의 JSX에서 컴포넌트를 조건부로 포함하거나 제외합니다. 이렇게 하는 방법을 알아봅시다!

## 조건부로 JSX 포함하기 {/*conditionally-including-jsx*/}

이전 예제에서는 컴포넌트가 반환할 JSX 트리를 제어했습니다. 렌더링 출력에서 일부 중복을 이미 눈치챘을 것입니다:

```js
<li className="item">{name} ✔</li>
```

는

```js
<li className="item">{name}</li>
```

와 매우 유사합니다.

두 조건부 분기는 `<li className="item">...</li>`를 반환합니다:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

이 중복은 해롭지 않지만, 코드 유지보수를 어렵게 만들 수 있습니다. `className`을 변경하고 싶다면 코드의 두 곳에서 변경해야 합니다! 이런 상황에서는 코드를 더 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)하게 만들기 위해 약간의 JSX를 조건부로 포함할 수 있습니다.

### 조건부 (삼항) 연산자 (`? :`) {/*conditional-ternary-operator--*/}

JavaScript에는 조건부 표현식을 작성하기 위한 간결한 구문이 있습니다 -- [조건부 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 또는 "삼항 연산자".

이렇게 하는 대신:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

이렇게 작성할 수 있습니다:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

이를 *"만약 `isPacked`가 true라면 (`?`) `name + ' ✔'`을 렌더링하고, 그렇지 않으면 (`:`) `name`을 렌더링한다"*라고 읽을 수 있습니다.

<DeepDive>

#### 이 두 예제는 완전히 동일한가요? {/*are-these-two-examples-fully-equivalent*/}

객체 지향 프로그래밍 배경을 가지고 있다면, 위의 두 예제가 미묘하게 다를 수 있다고 가정할 수 있습니다. 하나는 `<li>`의 두 가지 다른 "인스턴스"를 생성할 수 있기 때문입니다. 그러나 JSX 요소는 "인스턴스"가 아닙니다. 내부 상태를 가지지 않으며 실제 DOM 노드도 아닙니다. 그들은 가벼운 설명, 즉 청사진과 같습니다. 따라서 이 두 예제는 실제로 *완전히 동일합니다.* [상태 유지 및 재설정](/learn/preserving-and-resetting-state)은 이것이 어떻게 작동하는지 자세히 설명합니다.

</DeepDive>

이제 완료된 항목의 텍스트를 `<del>`과 같은 다른 HTML 태그로 감싸서 취소선을 추가하고 싶다고 가정해 봅시다. 각 경우에 더 많은 줄 바꿈과 괄호를 추가하여 더 많은 JSX를 중첩하기 쉽게 만들 수 있습니다:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

이 스타일은 간단한 조건에 잘 작동하지만, 적당히 사용하세요. 너무 많은 중첩된 조건부 마크업으로 인해 컴포넌트가 지저분해지면, 자식 컴포넌트를 추출하여 정리하는 것을 고려하세요. React에서는 마크업이 코드의 일부이므로 변수와 함수와 같은 도구를 사용하여 복잡한 표현식을 정리할 수 있습니다.

### 논리 AND 연산자 (`&&`) {/*logical-and-operator-*/}

또 다른 일반적인 단축키는 [JavaScript 논리 AND (`&&`) 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.)입니다. React 컴포넌트 내부에서, 조건이 true일 때 일부 JSX를 렌더링하고, **그렇지 않으면 아무것도 렌더링하지 않으려는 경우** 자주 사용됩니다. `&&`를 사용하여 `isPacked`가 `true`인 경우에만 체크 표시를 조건부로 렌더링할 수 있습니다:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

이를 *"만약 `isPacked`라면 (`&&`) 체크 표시를 렌더링하고, 그렇지 않으면 아무것도 렌더링하지 않는다"*라고 읽을 수 있습니다.

다음은 실제 예입니다:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScript && 표현식](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)은 왼쪽이 `true`인 경우 오른쪽 값(우리의 경우 체크 표시)을 반환합니다. 그러나 조건이 `false`인 경우 전체 표현식은 `false`가 됩니다. React는 `false`를 `null`이나 `undefined`와 마찬가지로 JSX 트리에서 "구멍"으로 간주하고, 그 자리에 아무것도 렌더링하지 않습니다.

<Pitfall>

**`&&`의 왼쪽에 숫자를 두지 마세요.**

조건을 테스트하기 위해 JavaScript는 왼쪽을 자동으로 boolean으로 변환합니다. 그러나 왼쪽이 `0`인 경우 전체 표현식은 그 값(`0`)을 가지며, React는 아무것도 렌더링하지 않는 대신 `0`을 렌더링합니다.

예를 들어, `messageCount && <p>New messages</p>`와 같은 코드를 작성하는 것은 흔한 실수입니다. `messageCount`가 `0`일 때 아무것도 렌더링하지 않는다고 가정하기 쉽지만, 실제로는 `0` 자체를 렌더링합니다!

이를 수정하려면 왼쪽을 boolean으로 만드세요: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### JSX를 변수에 조건부로 할당하기 {/*conditionally-assigning-jsx-to-a-variable*/}

단축키가 일반 코드를 작성하는 데 방해가 될 때는 `if` 문과 변수를 사용해 보세요. [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)로 정의된 변수를 재할당할 수 있으므로, 표시하려는 기본 내용을 이름으로 시작하세요:

```js
let itemContent = name;
```

`isPacked`가 `true`인 경우 `itemContent`에 JSX 표현식을 재할당하기 위해 `if` 문을 사용하세요:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[중괄호는 "JavaScript로의 창"을 엽니다.](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) 중괄호를 사용하여 변수에 저장된 표현식을 JSX 트리 내에 중첩하여 포함하세요:

```js
<li className="item">
  {itemContent}
</li>
```

이 스타일은 가장 장황하지만, 가장 유연합니다. 다음은 실제 예입니다:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

이전과 마찬가지로, 이는 텍스트뿐만 아니라 임의의 JSX에도 적용됩니다:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

JavaScript에 익숙하지 않다면, 이러한 다양한 스타일이 처음에는 압도적으로 느껴질 수 있습니다. 그러나 이를 배우면 모든 JavaScript 코드를 읽고 쓸 수 있게 될 것입니다 -- React 컴포넌트뿐만 아니라! 시작할 때는 선호하는 스타일을 선택하고, 다른 스타일이 어떻게 작동하는지 잊어버리면 이 참조를 다시 참조하세요.

<Recap>

* React에서는 JavaScript로 분기 로직을 제어합니다.
* `if` 문을 사용하여 조건부로 JSX 표현식을 반환할 수 있습니다.
* 변수를 사용하여 조건부로 일부 JSX를 저장한 다음 중괄호를 사용하여 다른 JSX 내부에 포함할 수 있습니다.
* JSX에서 `{cond ? <A /> : <B />}`는 *"만약 `cond`라면 `<A />`를 렌더링하고, 그렇지 않으면 `<B />`를 렌더링한다"*를 의미합니다.
* JSX에서 `{cond && <A />}`는 *"만약 `cond`라면 `<A />`를 렌더링하고, 그렇지 않으면 아무것도 렌더링하지 않는다"*를 의미합니다.
* 단축키는 일반적이지만, 일반 `if`를 선호하는 경우 사용하지 않아도 됩니다.

</Recap>

<Challenges>

#### `? :`로 불완전한 항목에 아이콘 표시하기 {/*show-an-icon-for-incomplete-items-with--*/}

조건부 연산자 (`cond ? a : b`)를 사용하여 `isPacked`가 `true`가 아닌 경우 ❌를 렌더링하세요.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with agolden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&`로 항목 중요도 표시하기 {/*show-the-item-importance-with-*/}

이 예제에서는 각 `Item`이 숫자 `importance` prop을 받습니다. `&&` 연산자를 사용하여 중요도가 0이 아닌 항목에 대해 이탤릭체로 "_(Importance: X)_"를 렌더링하세요. 항목 목록은 다음과 같이 보여야 합니다:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

두 레이블 사이에 공백을 추가하는 것을 잊지 마세요!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

이렇게 하면 됩니다:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance > 0 && ...` 대신 `importance && ...`를 사용하지 않도록 주의하세요. `importance`가 `0`인 경우 `0`이 결과로 렌더링되지 않도록 해야 합니다!

이 솔루션에서는 이름과 중요도 레이블 사이에 공백을 삽입하기 위해 두 개의 별도 조건을 사용합니다. 대안으로는 공백이 포함된 Fragment를 사용할 수 있습니다: `importance > 0 && <> <i>...</i></>` 또는 `<i>` 내부에 공백을 추가할 수 있습니다: `importance > 0 && <i> ...</i>`.

</Solution>

#### 일련의 `? :`를 `if`와 변수로 리팩터링하기 {/*refactor-a-series-of---to-if-and-variables*/}

이 `Drink` 컴포넌트는 `name` prop이 `"tea"`인지 `"coffee"`인지에 따라 다른 정보를 표시하기 위해 일련의 `? :` 조건을 사용합니다. 문제는 각 음료에 대한 정보가 여러 조건에 걸쳐 분산되어 있다는 것입니다. 이 코드를 세 개의 `? :` 조건 대신 단일 `if` 문을 사용하도록 리팩터링하세요.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

코드를 `if`로 리팩터링한 후, 더 간단하게 만들 수 있는 방법이 있는지 생각해 보세요.

<Solution>

여러 가지 방법이 있을 수 있지만, 다음은 하나의 시작점입니다:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

여기서는 각 음료에 대한 정보가 여러 조건에 분산되지 않고 함께 그룹화되어 있습니다. 이는 나중에 더 많은 음료를 추가하기 쉽게 만듭니다.

또 다른 솔루션은 조건을 제거하고 정보를 객체로 이동하는 것입니다:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>