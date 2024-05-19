---
title: UI 설명
---

<Intro>

React는 사용자 인터페이스(UI)를 렌더링하기 위한 JavaScript 라이브러리입니다. UI는 버튼, 텍스트, 이미지와 같은 작은 단위로 구성됩니다. React는 이러한 단위를 재사용 가능하고 중첩 가능한 *컴포넌트*로 결합할 수 있게 해줍니다. 웹 사이트에서부터 전화 앱까지, 화면에 있는 모든 것은 컴포넌트로 분해될 수 있습니다. 이 장에서는 React 컴포넌트를 생성하고, 사용자 정의하고, 조건부로 표시하는 방법을 배울 것입니다.

</Intro>

<YouWillLearn isChapter={true}>

* [첫 번째 React 컴포넌트를 작성하는 방법](/learn/your-first-component)
* [다중 컴포넌트 파일을 생성하는 시기와 방법](/learn/importing-and-exporting-components)
* [JSX를 사용하여 JavaScript에 마크업을 추가하는 방법](/learn/writing-markup-with-jsx)
* [JSX에서 중괄호를 사용하여 컴포넌트에서 JavaScript 기능에 접근하는 방법](/learn/javascript-in-jsx-with-curly-braces)
* [props로 컴포넌트를 구성하는 방법](/learn/passing-props-to-a-component)
* [컴포넌트를 조건부로 렌더링하는 방법](/learn/conditional-rendering)
* [한 번에 여러 컴포넌트를 렌더링하는 방법](/learn/rendering-lists)
* [컴포넌트를 순수하게 유지하여 혼란스러운 버그를 피하는 방법](/learn/keeping-components-pure)
* [UI를 트리로 이해하는 것이 왜 유용한지](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## 첫 번째 컴포넌트 {/*your-first-component*/}

React 애플리케이션은 *컴포넌트*라고 불리는 고립된 UI 조각들로 구성됩니다. React 컴포넌트는 마크업을 추가할 수 있는 JavaScript 함수입니다. 컴포넌트는 버튼만큼 작을 수도 있고, 전체 페이지만큼 클 수도 있습니다. 다음은 세 개의 `Profile` 컴포넌트를 렌더링하는 `Gallery` 컴포넌트입니다:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

**[Your First Component](/learn/your-first-component)**를 읽고 React 컴포넌트를 선언하고 사용하는 방법을 배우세요.

</LearnMore>

## 컴포넌트 가져오기 및 내보내기 {/*importing-and-exporting-components*/}

하나의 파일에 여러 컴포넌트를 선언할 수 있지만, 큰 파일은 탐색하기 어려울 수 있습니다. 이를 해결하기 위해 컴포넌트를 별도의 파일로 *내보내고*, 다른 파일에서 그 컴포넌트를 *가져올* 수 있습니다:

<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

**[Importing and Exporting Components](/learn/importing-and-exporting-components)**를 읽고 컴포넌트를 별도의 파일로 분할하는 방법을 배우세요.

</LearnMore>

## JSX로 마크업 작성하기 {/*writing-markup-with-jsx*/}

각 React 컴포넌트는 브라우저에 렌더링되는 일부 마크업을 포함할 수 있는 JavaScript 함수입니다. React 컴포넌트는 그 마크업을 나타내기 위해 JSX라는 구문 확장을 사용합니다. JSX는 HTML과 매우 유사하지만, 조금 더 엄격하며 동적 정보를 표시할 수 있습니다.

기존 HTML 마크업을 React 컴포넌트에 붙여넣으면 항상 작동하지는 않습니다:

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

이와 같은 기존 HTML이 있다면, [변환기](https://transform.tools/html-to-jsx)를 사용하여 수정할 수 있습니다:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

**[Writing Markup with JSX](/learn/writing-markup-with-jsx)**를 읽고 유효한 JSX를 작성하는 방법을 배우세요.

</LearnMore>

## 중괄호를 사용한 JSX 내 JavaScript {/*javascript-in-jsx-with-curly-braces*/}

JSX를 사용하면 JavaScript 파일 내에 HTML과 유사한 마크업을 작성할 수 있어 렌더링 로직과 콘텐츠를 한 곳에 유지할 수 있습니다. 때로는 그 마크업 내에 약간의 JavaScript 로직을 추가하거나 동적 속성을 참조하고 싶을 때가 있습니다. 이 경우, JSX에서 중괄호를 사용하여 JavaScript로 "창을 열 수" 있습니다:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

**[JavaScript in JSX with Curly Braces](/learn/javascript-in-jsx-with-curly-braces)**를 읽고 JSX에서 JavaScript 데이터를 접근하는 방법을 배우세요.

</LearnMore>

## 컴포넌트에 props 전달하기 {/*passing-props-to-a-component*/}

React 컴포넌트는 *props*를 사용하여 서로 통신합니다. 모든 부모 컴포넌트는 자식 컴포넌트에 props를 전달하여 일부 정보를 전달할 수 있습니다. Props는 HTML 속성을 떠올리게 할 수 있지만, 객체, 배열, 함수, 심지어 JSX를 포함한 모든 JavaScript 값을 전달할 수 있습니다!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

**[Passing Props to a Component](/learn/passing-props-to-a-component)**를 읽고 props를 전달하고 읽는 방법을 배우세요.

</LearnMore>

## 조건부 렌더링 {/*conditional-rendering*/}

컴포넌트는 종종 다양한 조건에 따라 다른 것을 표시해야 합니다. React에서는 `if` 문, `&&`, `? :` 연산자와 같은 JavaScript 구문을 사용하여 JSX를 조건부로 렌더링할 수 있습니다.

이 예제에서는 JavaScript `&&` 연산자를 사용하여 체크 표시를 조건부로 렌더링합니다:

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

<LearnMore path="/learn/conditional-rendering">

**[Conditional Rendering](/learn/conditional-rendering)**를 읽고 다양한 방법으로 콘텐츠를 조건부로 렌더링하는 방법을 배우세요.

</LearnMore>

## 리스트 렌더링 {/*rendering-lists*/}

데이터 컬렉션에서 여러 유사한 컴포넌트를 표시하고 싶을 때가 많습니다. JavaScript의 `filter()`와 `map()`을 사용하여 데이터를 필터링하고 변환하여 React에서 컴포넌트 배열로 만들 수 있습니다.

각 배열 항목에 대해 `key`를 지정해야 합니다. 일반적으로 데이터베이스의 ID를 `key`로 사용하고 싶을 것입니다. 키는 리스트가 변경되더라도 React가 각 항목의 위치를 추적할 수 있게 해줍니다.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

**[Rendering Lists](/learn/rendering-lists)**를 읽고 컴포넌트 리스트를 렌더링하는 방법과 키를 선택하는 방법을 배우세요.

</LearnMore>

## 컴포넌트를 순수하게 유지하기 {/*keeping-components-pure*/}

일부 JavaScript 함수는 *순수*합니다. 순수 함수는:

* **자기 일만 합니다.** 호출되기 전에 존재했던 객체나 변수를 변경하지 않습니다.
* **같은 입력, 같은 출력.** 동일한 입력이 주어지면, 순수 함수는 항상 동일한 결과를 반환해야 합니다.

컴포넌트를 순수 함수로만 작성하면 코드베이스가 커질수록 당황스러운 버그와 예측할 수 없는 동작을 피할 수 있습니다. 다음은 순수하지 않은 컴포넌트의 예입니다:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

기존 변수를 수정하는 대신 props를 전달하여 이 컴포넌트를 순수하게 만들 수 있습니다:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

**[Keeping Components Pure](/learn/keeping-components-pure)**를 읽고 컴포넌트를 순수하고 예측 가능한 함수로 작성하는 방법을 배우세요.

</LearnMore>

## UI를 트리로 이해하기 {/*your-ui-as-a-tree*/}

React는 컴포넌트와 모듈 간의 관계를 모델링하기 위해 트리를 사용합니다.

React 렌더 트리는 컴포넌트 간의 부모와 자식 관계를 나타내는 표현입니다.

<Diagram name="generic_render_tree" height={250} width={500} alt="다섯 개의 노드가 있는 트리 그래프, 각 노드는 컴포넌트를 나타냅니다. 루트 노드는 트리 그래프의 맨 위에 위치하며 'Root Component'로 표시됩니다. 두 개의 화살표가 'Component A'와 'Component C'로 확장됩니다. 각 화살표는 'renders'로 표시됩니다. 'Component A'는 'Component B'로 표시된 노드로 가는 단일 'renders' 화살표를 가지고 있습니다. 'Component C'는 'Component D'로 표시된 노드로 가는 단일 'renders' 화살표를 가지고 있습니다.">

React 렌더 트리의 예.

</Diagram>

트리의 상단, 루트 컴포넌트 근처에 있는 컴포넌트는 최상위 컴포넌트로 간주됩니다. 자식 컴포넌트가 없는 컴포넌트는 리프 컴포넌트입니다. 이러한 컴포넌트의 분류는 데이터 흐름과 렌더링 성능을 이해하는 데 유용합니다.

JavaScript 모듈 간의 관계를 모델링하는 것도 애플리케이션을 이해하는 유용한 방법입니다. 이를 모듈 종속성 트리라고 합니다.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="다섯 개의 노드가 있는 트리그래프. 각 노드는 JavaScript 모듈을 나타냅니다. 맨 위의 노드는 'RootModule.js'로 표시됩니다. 세 개의 화살표가 'ModuleA.js', 'ModuleB.js', 'ModuleC.js'로 확장됩니다. 각 화살표는 'imports'로 표시됩니다. 'ModuleC.js' 노드는 'ModuleD.js'로 표시된 노드로 가는 단일 'imports' 화살표를 가지고 있습니다.">

모듈 종속성 트리의 예.

</Diagram>

종속성 트리는 빌드 도구가 클라이언트가 다운로드하고 렌더링할 모든 관련 JavaScript 코드를 번들로 묶는 데 자주 사용됩니다. 큰 번들 크기는 React 앱의 사용자 경험을 저하시킵니다. 모듈 종속성 트리를 이해하는 것은 이러한 문제를 디버그하는 데 유용합니다.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

**[Your UI as a Tree](/learn/understanding-your-ui-as-a-tree)**를 읽고 React 앱의 렌더 및 모듈 종속성 트리를 생성하는 방법과 사용자 경험 및 성능을 향상시키기 위한 유용한 정신 모델을 배우세요.

</LearnMore>

## 다음은 무엇인가요? {/*whats-next*/}

[Your First Component](/learn/your-first-component)로 이동하여 이 장을 페이지별로 읽기 시작하세요!

또는, 이미 이러한 주제에 익숙하다면 [Adding Interactivity](/learn/adding-interactivity)에 대해 읽어보세요.