---
title: 컴포넌트에 Props 전달하기
---

<Intro>

React 컴포넌트는 *props*를 사용하여 서로 통신합니다. 모든 부모 컴포넌트는 자식 컴포넌트에 props를 전달하여 일부 정보를 전달할 수 있습니다. Props는 HTML 속성을 떠올리게 할 수 있지만, 객체, 배열, 함수 등 모든 JavaScript 값을 통해 전달할 수 있습니다.

</Intro>

<YouWillLearn>

* 컴포넌트에 props를 전달하는 방법
* 컴포넌트에서 props를 읽는 방법
* props의 기본값을 지정하는 방법
* 컴포넌트에 일부 JSX를 전달하는 방법
* 시간이 지남에 따라 props가 어떻게 변하는지

</YouWillLearn>

## 익숙한 props {/*familiar-props*/}

Props는 JSX 태그에 전달하는 정보입니다. 예를 들어, `className`, `src`, `alt`, `width`, `height`는 `<img>`에 전달할 수 있는 props 중 일부입니다:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

ReactDOM은 [HTML 표준](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)을 준수하기 때문에 `<img>` 태그에 전달할 수 있는 props는 미리 정의되어 있습니다. 하지만 `<Avatar>`와 같은 *자신의* 컴포넌트에 어떤 props도 전달하여 커스터마이징할 수 있습니다. 방법은 다음과 같습니다!

## 컴포넌트에 props 전달하기 {/*passing-props-to-a-component*/}

이 코드에서 `Profile` 컴포넌트는 자식 컴포넌트인 `Avatar`에 props를 전달하지 않습니다:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

두 단계로 `Avatar`에 props를 전달할 수 있습니다.

### 1단계: 자식 컴포넌트에 props 전달하기 {/*step-1-pass-props-to-the-child-component*/}

먼저, `Avatar`에 일부 props를 전달합니다. 예를 들어, `person`(객체)과 `size`(숫자) 두 가지 props를 전달해 봅시다:

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

`person=` 뒤의 중괄호가 혼란스러울 경우, [단순히 객체](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)임을 기억하세요.

</Note>

이제 `Avatar` 컴포넌트 내부에서 이 props를 읽을 수 있습니다.

### 2단계: 자식 컴포넌트 내부에서 props 읽기 {/*step-2-read-props-inside-the-child-component*/}

`function Avatar` 바로 뒤에 `({`와 `})` 사이에 `person, size` 이름을 쉼표로 구분하여 나열하면 이 props를 읽을 수 있습니다. 이렇게 하면 변수처럼 `Avatar` 코드 내에서 사용할 수 있습니다.

```js
function Avatar({ person, size }) {
  // person과 size를 여기서 사용할 수 있습니다
}
```

렌더링을 위해 `person`과 `size` props를 사용하는 로직을 `Avatar`에 추가하면 완료됩니다.

이제 다양한 props로 `Avatar`를 여러 가지 방식으로 렌더링할 수 있습니다. 값을 조정해 보세요!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Props를 사용하면 부모와 자식 컴포넌트를 독립적으로 생각할 수 있습니다. 예를 들어, `Profile` 내에서 `person` 또는 `size` props를 변경해도 `Avatar`가 이를 사용하는 방법에 대해 생각할 필요가 없습니다. 마찬가지로, `Avatar`가 이러한 props를 사용하는 방법을 변경해도 `Profile`을 볼 필요가 없습니다.

Props는 "조정할 수 있는 손잡이"와 같습니다. 함수의 인수와 같은 역할을 합니다. 실제로 props는 컴포넌트의 유일한 인수입니다! React 컴포넌트 함수는 `props` 객체라는 단일 인수를 받습니다:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

일반적으로 전체 `props` 객체 자체가 필요하지 않으므로 개별 props로 구조 분해합니다.

<Pitfall>

**props 선언 시 `{`와 `}` 중괄호 쌍을 놓치지 마세요**:

```js
function Avatar({ person, size }) {
  // ...
}
```

이 구문은 ["구조 분해"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)라고 하며, 함수 매개변수에서 속성을 읽는 것과 동일합니다:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## props의 기본값 지정하기 {/*specifying-a-default-value-for-a-prop*/}

값이 지정되지 않았을 때 props에 기본값을 제공하려면, 구조 분해 시 매개변수 바로 뒤에 `=`와 기본값을 추가하면 됩니다:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

이제 `<Avatar person={...} />`가 `size` props 없이 렌더링되면, `size`는 `100`으로 설정됩니다.

기본값은 `size` props가 없거나 `size={undefined}`를 전달할 때만 사용됩니다. 하지만 `size={null}` 또는 `size={0}`를 전달하면 기본값이 **사용되지 않습니다**.

## JSX 스프레드 구문으로 props 전달하기 {/*forwarding-props-with-the-jsx-spread-syntax*/}

때로는 props를 전달하는 것이 매우 반복적일 수 있습니다:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

반복적인 코드에는 문제가 없으며, 더 읽기 쉬울 수 있습니다. 하지만 때로는 간결함을 중요시할 수 있습니다. 일부 컴포넌트는 `Profile`이 `Avatar`와 함께 하는 것처럼 모든 props를 자식에게 전달합니다. props를 직접 사용하지 않기 때문에 더 간결한 "스프레드" 구문을 사용하는 것이 합리적일 수 있습니다:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

이렇게 하면 `Profile`의 모든 props가 `Avatar`로 전달됩니다.

**스프레드 구문을 절제하여 사용하세요.** 모든 컴포넌트에서 사용하고 있다면, 뭔가 잘못된 것입니다. 종종 이는 컴포넌트를 분할하고 자식을 JSX로 전달해야 함을 나타냅니다. 다음에 더 자세히 알아보겠습니다!

## JSX를 자식으로 전달하기 {/*passing-jsx-as-children*/}

내장된 브라우저 태그를 중첩하는 것은 일반적입니다:

```js
<div>
  <img />
</div>
```

때로는 자신의 컴포넌트를 동일한 방식으로 중첩하고 싶을 것입니다:

```js
<Card>
  <Avatar />
</Card>
```

JSX 태그 내부에 콘텐츠를 중첩하면 부모 컴포넌트는 `children`이라는 props로 해당 콘텐츠를 받습니다. 예를 들어, 아래의 `Card` 컴포넌트는 `children` props로 설정된 `<Avatar />`를 받아 래퍼 div에 렌더링합니다:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

`<Card>` 내부의 `<Avatar>`를 텍스트로 교체하여 `Card` 컴포넌트가 중첩된 모든 콘텐츠를 래핑할 수 있는지 확인해 보세요. 내부에 무엇이 렌더링되는지 "알 필요"가 없습니다. 이 유연한 패턴은 많은 곳에서 볼 수 있습니다.

`children` props가 있는 컴포넌트를 부모 컴포넌트가 임의의 JSX로 "채울 수 있는" "구멍"이 있는 것으로 생각할 수 있습니다. `children` props는 종종 시각적 래퍼(패널, 그리드 등)에 사용됩니다.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='텍스트와 아바타 같은 "children" 조각을 위한 슬롯이 있는 퍼즐 같은 Card 타일' />

## 시간이 지남에 따라 props가 어떻게 변하는지 {/*how-props-change-over-time*/}

아래의 `Clock` 컴포넌트는 부모 컴포넌트로부터 두 가지 props를 받습니다: `color`와 `time`. (부모 컴포넌트의 코드는 [state](/learn/state-a-components-memory)를 사용하므로 생략되었습니다. 이는 아직 다루지 않을 것입니다.)

아래의 선택 상자에서 색상을 변경해 보세요:

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        색상 선택:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

이 예제는 **컴포넌트가 시간이 지남에 따라 다른 props를 받을 수 있음을** 보여줍니다. Props는 항상 정적이지 않습니다! 여기서 `time` props는 매초마다 변경되며, `color` props는 다른 색상을 선택할 때 변경됩니다. Props는 특정 시점의 컴포넌트 데이터를 반영합니다.

그러나 props는 [불변](https://en.wikipedia.org/wiki/Immutable_object)입니다. 이는 컴퓨터 과학 용어로 "변경할 수 없음"을 의미합니다. 컴포넌트가 props를 변경해야 할 때(예: 사용자 상호작용이나 새로운 데이터에 응답하여), 부모 컴포넌트에 _다른 props_를 전달하도록 "요청"해야 합니다. 이전 props는 버려지고, 결국 JavaScript 엔진이 메모리를 회수합니다.

**props를 "변경"하려고 하지 마세요.** 사용자 입력에 응답해야 할 때(예: 선택한 색상을 변경할 때), [State: A Component's Memory](/learn/state-a-components-memory)에서 배울 수 있는 "상태 설정"이 필요합니다.

<Recap>

* props를 전달하려면 HTML 속성과 마찬가지로 JSX에 추가하세요.
* props를 읽으려면 `function Avatar({ person, size })` 구조 분해 구문을 사용하세요.
* `size = 100`과 같이 기본값을 지정할 수 있으며, 이는 누락된 props와 `undefined` props에 사용됩니다.
* `<Avatar {...props} />` JSX 스프레드 구문으로 모든 props를 전달할 수 있지만, 과용하지 마세요!
* `<Card><Avatar /></Card>`와 같은 중첩된 JSX는 `Card` 컴포넌트의 `children` props로 나타납니다.
* Props는 시간의 스냅샷입니다: 모든 렌더링은 새로운 버전의 props를 받습니다.
* props를 변경할 수 없습니다. 상호작용이 필요할 때는 상태를 설정해야 합니다.

</Recap>



<Challenges>

#### 컴포넌트 추출하기 {/*extract-a-component*/}

이 `Gallery` 컴포넌트는 두 프로필에 대해 매우 유사한 마크업을 포함하고 있습니다. 중복을 줄이기 위해 `Profile` 컴포넌트를 추출하세요. 전달할 props를 선택해야 합니다.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

한 과학자의 마크업을 추출하는 것부터 시작하세요. 그런 다음 두 번째 예제에서 일치하지 않는 부분을 찾아 props로 구성 가능하게 만드세요.

</Hint>

<Solution>

이 솔루션에서 `Profile` 컴포넌트는 여러 props를 받습니다: `imageId`(문자열), `name`(문자열), `profession`(문자열), `awards`(문자열 배열), `discovery`(문자열), `imageSize`(숫자).

`imageSize` props는 기본값이 있기 때문에 컴포넌트에 전달하지 않습니다.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

`awards`가 배열인 경우 `awardCount` props가 필요 없다는 점에 유의하세요. 그런 다음 `awards.length`를 사용하여 수상 횟수를 셀 수 있습니다. props는 배열을 포함한 모든 값을 가질 수 있다는 점을 기억하세요!

이 페이지의 이전 예제와 더 유사한 또 다른 솔루션은 사람에 대한 모든 정보를 단일 객체에 그룹화하고 해당 객체를 하나의 props로 전달하는 것입니다:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

구문은 약간 다르지만 JavaScript 객체의 속성을 설명하는 것과 JSX 속성의 컬렉션을 설명하는 것의 차이 때문에, 이 예제들은 대부분 동등하며, 어느 접근법이든 선택할 수 있습니다.

</Solution>

#### props에 따라 이미지 크기 조정하기 {/*adjust-the-image-size-based-on-a-prop*/}

이 예제에서 `Avatar`는 숫자 `size` props를 받아 `<img>`의 너비와 높이를 결정합니다. 이 예제에서 `size` props는 `40`으로 설정되어 있습니다. 그러나 이미지를 새 탭에서 열면 이미지 자체가 더 크다는 것을 알 수 있습니다(`160` 픽셀). 실제 이미지 크기는 요청하는 썸네일 크기에 따라 결정됩니다.

`size` props에 따라 가장 가까운 이미지 크기를 요청하도록 `Avatar` 컴포넌트를 변경하세요. 구체적으로, `size`가 `90` 미만이면 `getImageUrl` 함수에 `'b'`("big") 대신 `'s'`("small")을 전달하세요. `size` props의 다른 값을 사용하여 아바타를 렌더링하고 이미지를 새 탭에서 열어 변경 사항이 작동하는지 확인하세요.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

다음과 같이 할 수 있습니다:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

고해상도 화면을 위해 [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)를 고려하여 더 선명한 이미지를 표시할 수도 있습니다:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Props를 사용하면 `Avatar` 컴포넌트 내부에 이러한 로직을 캡슐화하고(필요한 경우 나중에 변경할 수 있음) 모든 사람이 이미지가 요청되고 크기가 조정되는 방법에 대해 생각하지 않고 `<Avatar>` 컴포넌트를 사용할 수 있습니다.

</Solution>

#### `children` props로 JSX 전달하기 {/*passing-jsx-in-a-children-prop*/}

아래의 마크업에서 `Card` 컴포넌트를 추출하고, `children` props를 사용하여 다른 JSX를 전달하세요:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

컴포넌트 태그 내부에 넣은 모든 JSX는 해당 컴포넌트의 `children` props로 전달됩니다.

</Hint>

<Solution>

다음과 같이 두 곳에서 `Card` 컴포넌트를 사용할 수 있습니다:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

모든 `Card`에 항상 제목이 있어야 한다면 `title`을 별도의 props로 만들 수도 있습니다:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>