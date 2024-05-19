---
title: 리스트 렌더링
---

<Intro>

데이터 컬렉션에서 여러 유사한 컴포넌트를 자주 표시하고 싶을 것입니다. [JavaScript 배열 메서드](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#)를 사용하여 데이터 배열을 조작할 수 있습니다. 이 페이지에서는 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)와 [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map)를 React와 함께 사용하여 데이터 배열을 필터링하고 변환하여 컴포넌트 배열로 만드는 방법을 배웁니다.

</Intro>

<YouWillLearn>

* JavaScript의 `map()`을 사용하여 배열에서 컴포넌트를 렌더링하는 방법
* JavaScript의 `filter()`를 사용하여 특정 컴포넌트만 렌더링하는 방법
* React 키를 언제, 왜 사용하는지

</YouWillLearn>

## 배열에서 데이터 렌더링하기 {/*rendering-data-from-arrays*/}

콘텐츠 목록이 있다고 가정해 봅시다.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

이 목록 항목들 간의 유일한 차이점은 그들의 내용, 즉 데이터입니다. 인터페이스를 구축할 때 다른 데이터를 사용하여 동일한 컴포넌트의 여러 인스턴스를 표시해야 하는 경우가 자주 있습니다: 댓글 목록에서 프로필 이미지 갤러리까지. 이러한 상황에서는 JavaScript 객체와 배열에 데이터를 저장하고 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 및 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)와 같은 메서드를 사용하여 컴포넌트 목록을 렌더링할 수 있습니다.

다음은 배열에서 항목 목록을 생성하는 간단한 예입니다:

1. 데이터를 배열로 **이동**합니다:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. `people` 멤버를 JSX 노드의 새 배열인 `listItems`로 **매핑**합니다:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. 컴포넌트에서 `<ul>`로 감싸진 `listItems`를 **반환**합니다:

```js
return <ul>{listItems}</ul>;
```

결과는 다음과 같습니다:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

위의 샌드박스가 콘솔 오류를 표시하는 것을 확인하세요:

<ConsoleBlock level="error">

경고: 목록의 각 자식은 고유한 "key" prop을 가져야 합니다.

</ConsoleBlock>

이 페이지의 뒷부분에서 이 오류를 수정하는 방법을 배울 것입니다. 그 전에 데이터에 구조를 추가해 봅시다.

## 항목 배열 필터링하기 {/*filtering-arrays-of-items*/}

이 데이터를 더 구조화할 수 있습니다.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

직업이 `'chemist'`인 사람들만 표시하는 방법이 필요하다고 가정해 봅시다. JavaScript의 `filter()` 메서드를 사용하여 해당 사람들만 반환할 수 있습니다. 이 메서드는 항목 배열을 가져와 "테스트" (true 또는 false를 반환하는 함수)를 통과시키고, 테스트를 통과한 항목(즉, true를 반환한 항목)만 포함된 새 배열을 반환합니다.

`profession`이 `'chemist'`인 항목만 원합니다. 이 "테스트" 함수는 `(person) => person.profession === 'chemist'`와 같습니다. 다음은 이를 조합하는 방법입니다:

1. `person.profession === 'chemist'`로 필터링하여 `people`에서 `filter()`를 호출하여 "chemist" 사람들만 포함된 새 배열 `chemists`를 **생성**합니다:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. 이제 `chemists`를 **매핑**합니다:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
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
```

3. 마지막으로, 컴포넌트에서 `listItems`를 **반환**합니다:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
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
  return <ul>{listItems}</ul>;
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

화살표 함수는 `=>` 바로 뒤의 표현식을 암시적으로 반환하므로 `return` 문이 필요하지 않습니다:

```js
const listItems = chemists.map(person =>
  <li>...</li> // 암시적 반환!
);
```

그러나, **`=>` 뒤에 `{` 중괄호가 있는 경우 `return`을 명시적으로 작성해야 합니다!**

```js
const listItems = chemists.map(person => { // 중괄호
  return <li>...</li>;
});
```

`=> {`를 포함하는 화살표 함수는 ["블록 본문"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)을 가진다고 합니다. 이는 여러 줄의 코드를 작성할 수 있게 해주지만, `return` 문을 직접 작성해야 합니다. 이를 잊으면 아무것도 반환되지 않습니다!

</Pitfall>

## `key`로 목록 항목 순서 유지하기 {/*keeping-list-items-in-order-with-key*/}

위의 모든 샌드박스가 콘솔에 오류를 표시하는 것을 확인하세요:

<ConsoleBlock level="error">

경고: 목록의 각 자식은 고유한 "key" prop을 가져야 합니다.

</ConsoleBlock>

각 배열 항목에 `key`를 부여해야 합니다 -- 배열의 다른 항목들 사이에서 고유하게 식별할 수 있는 문자열 또는 숫자입니다:

```js
<li key={person.id}>...</li>
```

<Note>

JSX 요소가 `map()` 호출 내부에 직접 있을 때는 항상 키가 필요합니다!

</Note>

키는 React에게 각 배열 항목이 어떤 컴포넌트에 해당하는지 알려주어 나중에 일치시킬 수 있도록 합니다. 이는 배열 항목이 이동(예: 정렬로 인해), 삽입되거나 삭제될 수 있는 경우 중요해집니다. 잘 선택된 `key`는 React가 정확히 무슨 일이 일어났는지 추론하고 DOM 트리에 올바른 업데이트를 수행하는 데 도움이 됩니다.

키를 즉석에서 생성하는 대신 데이터에 포함시켜야 합니다:

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // JSX에서 키로 사용됨
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // JSX에서 키로 사용됨
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // JSX에서 키로 사용됨
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // JSX에서 키로 사용됨
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // JSX에서 키로 사용됨
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### 각 목록 항목에 대해 여러 DOM 노드 표시하기 {/*displaying-several-dom-nodes-for-each-list-item*/}

각 항목이 하나가 아닌 여러 DOM 노드를 렌더링해야 할 때는 어떻게 해야 할까요?

짧은 [`<>...</>` Fragment](/reference/react/Fragment) 구문은 키를 전달할 수 없으므로, 단일 `<div>`로 그룹화하거나, 약간 더 길고 [더 명시적인 `<Fragment>` 구문을 사용해야 합니다:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragment는 DOM에서 사라지므로, 이는 `<h1>`, `<p>`, `<h1>`, `<p>` 등의 평면 목록을 생성합니다.

</DeepDive>

### `key`를 어디서 얻을 수 있나요? {/*where-to-get-your-key*/}

데이터의 출처에 따라 키의 출처가 다릅니다:

* **데이터베이스에서 가져온 데이터:** 데이터가 데이터베이스에서 오는 경우, 고유한 데이터베이스 키/ID를 사용할 수 있습니다.
* **로컬에서 생성된 데이터:** 데이터가 로컬에서 생성되고 유지되는 경우(예: 노트 작성 앱의 노트), 항목을 생성할 때 증가하는 카운터, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) 또는 [`uuid`](https://www.npmjs.com/package/uuid)와 같은 패키지를 사용할 수 있습니다.

### 키의 규칙 {/*rules-of-keys*/}

* **키는 형제들 사이에서 고유해야 합니다.** 그러나, _다른_ 배열의 JSX 노드에 대해 동일한 키를 사용하는 것은 괜찮습니다.
* **키는 변경되지 않아야 합니다** 그렇지 않으면 목적을 잃게 됩니다! 렌더링 중에 키를 생성하지 마세요.

### React가 키를 필요로 하는 이유는 무엇인가요? {/*why-does-react-need-keys*/}

데스크탑의 파일에 이름이 없다고 상상해 보세요. 대신, 순서로 파일을 참조해야 합니다 -- 첫 번째 파일, 두 번째 파일 등. 익숙해질 수는 있지만, 파일을 삭제하면 혼란스러워질 것입니다. 두 번째 파일이 첫 번째 파일이 되고, 세 번째 파일이 두 번째 파일이 되는 식입니다.

폴더의 파일 이름과 배열의 JSX 키는 유사한 목적을 제공합니다. 형제들 사이에서 항목을 고유하게 식별할 수 있게 해줍니다. 잘 선택된 키는 배열 내 위치보다 더 많은 정보를 제공합니다. _위치_가 재정렬로 인해 변경되더라도, `key`는 React가 항목을 전체 수명 동안 식별할 수 있게 합니다.

<Pitfall>

배열의 항목 인덱스를 키로 사용하고 싶은 유혹을 느낄 수 있습니다. 사실, 키를 지정하지 않으면 React가 인덱스를 키로 사용합니다. 그러나 항목이 삽입, 삭제되거나 배열이 재정렬되면 렌더링 순서가 시간이 지남에 따라 변경됩니다. 인덱스를 키로 사용하는 것은 종종 미묘하고 혼란스러운 버그를 초래합니다.

마찬가지로, `key={Math.random()}`과 같이 키를 즉석에서 생성하지 마세요. 이는 렌더링 간에 키가 절대 일치하지 않게 하여 모든 컴포넌트와 DOM이 매번 재생성되게 합니다. 이는 느릴 뿐만 아니라 목록 항목 내의 사용자 입력을 잃게 됩니다. 대신, 데이터 기반의 안정적인 ID를 사용하세요.

컴포넌트는 `key`를 prop으로 받지 않습니다. 이는 React 자체에서 힌트로만 사용됩니다. 컴포넌트가 ID를 필요로 하는 경우, 별도의 prop으로 전달해야 합니다: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

이 페이지에서 배운 내용:

* 데이터를 컴포넌트에서 데이터 구조(배열 및 객체)로 이동하는 방법.
* JavaScript의 `map()`을 사용하여 유사한 컴포넌트 세트를 생성하는 방법.
* JavaScript의 `filter()`를 사용하여 필터링된 항목 배열을 생성하는 방법.
* React가 각 컴포넌트를 추적할 수 있도록 컬렉션의 각 컴포넌트에 `key`를 설정하는 이유와 방법.

</Recap>

<Challenges>

#### 목록을 두 개로 나누기 {/*splitting-a-list-in-two*/}

이 예제는 모든 사람의 목록을 보여줍니다.

이를 변경하여 **Chemists**와 **Everyone Else**라는 두 개의 별도 목록을 차례로 표시하세요. 이전과 같이, `
person.profession === 'chemist'`인지 확인하여 사람이 화학자인지 여부를 결정할 수 있습니다.

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

`filter()`를 두 번 사용하여 두 개의 별도 배열을 생성한 다음, 두 배열 모두를 `map`할 수 있습니다:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

이 솔루션에서는 `map` 호출이 부모 `<ul>` 요소에 직접 인라인으로 배치되었지만, 더 읽기 쉽게 하기 위해 변수로 도입할 수도 있습니다.

렌더링된 목록 간에 중복이 여전히 약간 있습니다. 반복적인 부분을 `<ListSection>` 컴포넌트로 추출할 수 있습니다:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

매우 주의 깊은 독자는 두 개의 `filter` 호출로 각 사람의 직업을 두 번 확인한다는 것을 알 수 있습니다. 속성 확인은 매우 빠르므로 이 예제에서는 괜찮습니다. 논리가 더 복잡하다면, `filter` 호출을 수동으로 배열을 구성하고 각 사람을 한 번만 확인하는 루프로 대체할 수 있습니다.

사실, `people`이 변경되지 않는다면 이 코드를 컴포넌트 외부로 이동할 수 있습니다. React의 관점에서 중요한 것은 최종적으로 JSX 노드 배열을 제공하는 것입니다. 배열을 생성하는 방법은 중요하지 않습니다:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### 하나의 컴포넌트에서 중첩된 목록 {/*nested-lists-in-one-component*/}

이 배열에서 레시피 목록을 만드세요! 배열의 각 레시피에 대해 이름을 `<h2>`로 표시하고 재료를 `<ul>`에 나열하세요.

<Hint>

이는 두 개의 다른 `map` 호출을 중첩해야 합니다.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

다음은 이를 수행하는 한 가지 방법입니다:

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

각 `recipes`는 이미 `id` 필드를 포함하고 있으므로, 외부 루프는 이를 `key`로 사용합니다. 재료를 순회할 때 사용할 수 있는 ID는 없습니다. 그러나 동일한 재료가 동일한 레시피 내에서 두 번 나열되지 않는다고 가정하는 것이 합리적이므로 이름을 `key`로 사용할 수 있습니다. 대안으로, 데이터 구조를 변경하여 ID를 추가하거나 인덱스를 `key`로 사용할 수 있습니다(재료를 안전하게 재정렬할 수 없다는 경고와 함께).

</Solution>

#### 목록 항목 컴포넌트 추출하기 {/*extracting-a-list-item-component*/}

이 `RecipeList` 컴포넌트는 두 개의 중첩된 `map` 호출을 포함하고 있습니다. 이를 단순화하기 위해 `id`, `name`, `ingredients` props를 받는 `Recipe` 컴포넌트를 추출하세요. 외부 `key`를 어디에 배치하고 그 이유는 무엇인가요?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

외부 `map`에서 JSX를 새 `Recipe` 컴포넌트로 복사하여 붙여넣고 해당 JSX를 반환할 수 있습니다. 그런 다음 `recipe.name`을 `name`으로, `recipe.id`를 `id`로 변경하고 이를 `Recipe`에 props로 전달합니다:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

여기서 `<Recipe {...recipe} key={recipe.id} />`는 "모든 `recipe` 객체의 속성을 `Recipe` 컴포넌트에 props로 전달"하는 구문 단축키입니다. 각 props를 명시적으로 작성할 수도 있습니다: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**`key`는 `Recipe` 자체에 지정되며, `Recipe`에서 반환된 루트 `<div>`에 지정되지 않습니다.** 이는 이 `key`가 주변 배열의 컨텍스트 내에서 직접 필요하기 때문입니다. 이전에는 `<div>` 배열이 있었기 때문에 각 `<div>`에 `key`가 필요했지만, 이제는 `<Recipe>` 배열이 있습니다. 즉, 컴포넌트를 추출할 때, 복사하여 붙여넣은 JSX 외부에 `key`를 남겨두는 것을 잊지 마세요.

</Solution>

#### 구분 기호가 있는 목록 {/*list-with-a-separator*/}

이 예제는 Tachibana Hokushi의 유명한 하이쿠를 각 줄을 `<p>` 태그로 감싸서 렌더링합니다. 각 단락 사이에 `<hr />` 구분 기호를 삽입하는 것이 과제입니다. 결과 구조는 다음과 같아야 합니다:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

하이쿠는 세 줄만 포함하지만, 솔루션은 어떤 줄 수에도 작동해야 합니다. `<hr />` 요소는 `<p>` 요소 사이에만 나타나며, 시작이나 끝에는 나타나지 않습니다!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(이것은 시의 줄이 재정렬되지 않기 때문에 인덱스를 키로 사용하는 것이 허용되는 드문 경우입니다.)

<Hint>

`map`을 수동 루프로 변환하거나 Fragment를 사용해야 합니다.

</Hint>

<Solution>

수동 루프를 작성하여 `<hr />`와 `<p>...</p>`를 출력 배열에 삽입할 수 있습니다:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // 출력 배열을 채웁니다
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // 첫 번째 <hr />를 제거합니다
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

원래 줄 인덱스를 `key`로 사용하는 것은 더 이상 작동하지 않습니다. 왜냐하면 각 구분 기호와 단락이 이제 동일한 배열에 있기 때문입니다. 그러나 접미사를 사용하여 각 항목에 고유한 키를 부여할 수 있습니다, 예를 들어 `key={i + '-text'}`.

대안으로, `<hr />`와 `<p>...</p>`를 포함하는 Fragment 컬렉션을 렌더링할 수 있습니다. 그러나 `<>...</>` 축약 구문은 키를 전달할 수 없으므로 `<Fragment>`를 명시적으로 작성해야 합니다:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

기억하세요, Fragments (종종 `<> </>`로 작성됨)는 추가 `<div>` 없이 JSX 노드를 그룹화할 수 있게 해줍니다!

</Solution>

</Challenges>