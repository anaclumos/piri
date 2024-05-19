---
title: JSX에서 중괄호를 사용한 JavaScript
---

<Intro>

JSX는 JavaScript 파일 내에서 HTML과 유사한 마크업을 작성할 수 있게 해주며, 렌더링 로직과 콘텐츠를 같은 위치에 유지합니다. 때로는 해당 마크업 내에서 약간의 JavaScript 로직을 추가하거나 동적 속성을 참조하고 싶을 때가 있습니다. 이 경우, JSX에서 중괄호를 사용하여 JavaScript로의 창을 열 수 있습니다.

</Intro>

<YouWillLearn>

* 따옴표가 있는 문자열을 전달하는 방법
* 중괄호를 사용하여 JSX 내부에서 JavaScript 변수를 참조하는 방법
* 중괄호를 사용하여 JSX 내부에서 JavaScript 함수를 호출하는 방법
* 중괄호를 사용하여 JSX 내부에서 JavaScript 객체를 사용하는 방법

</YouWillLearn>

## 따옴표가 있는 문자열 전달하기 {/*passing-strings-with-quotes*/}

JSX에 문자열 속성을 전달하려면, 단일 또는 이중 따옴표로 감쌉니다:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

여기서 `"https://i.imgur.com/7vQD0fPs.jpg"`와 `"Gregorio Y. Zara"`는 문자열로 전달되고 있습니다.

하지만 `src`나 `alt` 텍스트를 동적으로 지정하고 싶다면 어떻게 해야 할까요? **`"`와 `"`를 `{`와 `}`로 대체하여 JavaScript 값을 사용할 수 있습니다**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

`className="avatar"`는 이미지를 둥글게 만드는 `"avatar"` CSS 클래스 이름을 지정하는 반면, `src={avatar}`는 `avatar`라는 JavaScript 변수의 값을 읽습니다. 이는 중괄호가 마크업 내에서 JavaScript를 사용할 수 있게 해주기 때문입니다!

## 중괄호 사용하기: JavaScript 세계로의 창 {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX는 JavaScript를 작성하는 특별한 방법입니다. 이는 중괄호 `{ }`를 사용하여 JavaScript를 사용할 수 있음을 의미합니다. 아래 예제는 과학자의 이름을 `name`으로 선언한 다음, 중괄호를 사용하여 `<h1>` 내에 포함시킵니다:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

`name`의 값을 `'Gregorio Y. Zara'`에서 `'Hedy Lamarr'`로 변경해 보세요. 목록 제목이 어떻게 변하는지 확인해 보세요.

모든 JavaScript 표현식은 중괄호 사이에서 작동하며, `formatDate()`와 같은 함수 호출도 포함됩니다:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### 중괄호를 사용할 수 있는 위치 {/*where-to-use-curly-braces*/}

JSX 내부에서 중괄호를 사용할 수 있는 방법은 두 가지뿐입니다:

1. **텍스트로서** JSX 태그 내부에 직접: `<h1>{name}'s To Do List</h1>`는 작동하지만 `<{tag}>Gregorio Y. Zara's To Do List</{tag}>`는 작동하지 않습니다.
2. **속성으로서** `=` 기호 바로 뒤에: `src={avatar}`는 `avatar` 변수를 읽지만 `src="{avatar}"`는 문자열 `"{avatar}"`를 전달합니다.

## "이중 중괄호" 사용하기: JSX에서 CSS 및 기타 객체 {/*using-double-curlies-css-and-other-objects-in-jsx*/}

문자열, 숫자 및 기타 JavaScript 표현식 외에도 JSX에서 객체를 전달할 수 있습니다. 객체는 `{ name: "Hedy Lamarr", inventions: 5 }`와 같이 중괄호로 표시됩니다. 따라서 JSX에서 JS 객체를 전달하려면 객체를 또 다른 중괄호 쌍으로 감싸야 합니다: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

JSX에서 인라인 CSS 스타일과 함께 이를 볼 수 있습니다. React는 인라인 스타일을 사용할 필요는 없지만 (대부분의 경우 CSS 클래스가 잘 작동합니다), 인라인 스타일이 필요할 때 `style` 속성에 객체를 전달합니다:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

`backgroundColor`와 `color`의 값을 변경해 보세요.

이렇게 작성하면 중괄호 안에 JavaScript 객체가 정말로 보입니다:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

다음에 JSX에서 `{{`와 `}}`를 볼 때, 이는 JSX 중괄호 안에 객체가 있다는 것뿐임을 기억하세요!

<Pitfall>

인라인 `style` 속성은 camelCase로 작성됩니다. 예를 들어, HTML `<ul style="background-color: black">`는 컴포넌트에서 `<ul style={{ backgroundColor: 'black' }}>`로 작성됩니다.

</Pitfall>

## JavaScript 객체와 중괄호로 더 재미있게 놀기 {/*more-fun-with-javascript-objects-and-curly-braces*/}

여러 표현식을 하나의 객체로 이동하고, JSX 내부의 중괄호에서 참조할 수 있습니다:

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

이 예제에서 `person` JavaScript 객체는 `name` 문자열과 `theme` 객체를 포함합니다:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

컴포넌트는 `person`의 값을 다음과 같이 사용할 수 있습니다:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX는 JavaScript를 사용하여 데이터를 구성하고 로직을 처리할 수 있기 때문에 템플릿 언어로서 매우 최소화되어 있습니다.

<Recap>

이제 JSX에 대해 거의 모든 것을 알게 되었습니다:

* 따옴표 안의 JSX 속성은 문자열로 전달됩니다.
* 중괄호는 JavaScript 로직과 변수를 마크업에 가져올 수 있게 해줍니다.
* 중괄호는 JSX 태그 내용 내부 또는 속성의 `=` 바로 뒤에서 작동합니다.
* `{{`와 `}}`는 특별한 구문이 아닙니다: 이는 JSX 중괄호 안에 있는 JavaScript 객체입니다.

</Recap>

<Challenges>

#### 실수 수정하기 {/*fix-the-mistake*/}

이 코드는 `Objects are not valid as a React child`라는 오류와 함께 충돌합니다:

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
      <h1>{person}'s Todos</h1>
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

문제를 찾을 수 있나요?

<Hint>중괄호 안에 있는 내용을 확인하세요. 올바른 것을 넣고 있나요?</Hint>

<Solution>

이 예제는 마크업에 *객체 자체*를 렌더링하려고 하기 때문에 발생합니다: `<h1>{person}'s Todos</h1>`는 전체 `person` 객체를 렌더링하려고 합니다! 텍스트 콘텐츠로 원시 객체를 포함하면 React는 이를 표시하는 방법을 알 수 없기 때문에 오류가 발생합니다.

이를 수정하려면 `<h1>{person}'s Todos</h1>`를 `<h1>{person.name}'s Todos</h1>`로 교체하세요:

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

</Solution>

#### 정보를 객체로 추출하기 {/*extract-information-into-an-object*/}

이미지 URL을 `person` 객체로 추출하세요.

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

<Solution>

이미지 URL을 `person.imageUrl`이라는 속성으로 이동하고, 중괄호를 사용하여 `<img>` 태그에서 읽습니다:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
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
        src={person.imageUrl}
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

</Solution>

#### JSX 중괄호 안에 표현식 작성하기 {/*write-an-expression-inside-jsx-curly-braces*/}

아래 객체에서 전체 이미지 URL은 네 부분으로 나뉩니다: 기본 URL, `imageId`, `imageSize`, 파일 확장자.

이미지 URL은 기본 URL(항상 `'https://i.imgur.com/'`), `imageId`(`'7vQD0fP'`), `imageSize`(`'s'`), 파일 확장자(항상 `'.jpg'`)를 결합하여 만들어야 합니다. 그러나 `<img>` 태그가 `src`를 지정하는 방법에 문제가 있습니다.

수정할 수 있나요?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
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
.avatar { border-radius: 50%; }
```

</Sandpack>

`imageSize`의 값을 `'b'`로 변경해 보세요. 수정 후 이미지가 크기 조정되는지 확인하세요.

<Solution>

이를 `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`로 작성할 수 있습니다.

1. `{`는 JavaScript 표현식을 엽니다
2. `baseUrl + person.imageId + person.imageSize + '.jpg'`는 올바른 URL 문자열을 생성합니다
3. `}`는 JavaScript 표현식을 닫습니다

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
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
.avatar { border-radius: 50%; }
```

</Sandpack>

이 표현식을 `getImageUrl`과 같은 별도의 함수로 이동할 수도 있습니다:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={getImageUrl(person)}
        alt={person.name}
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

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

변수와 함수는 마크업을 간단하게 유지하는 데 도움이 됩니다!

</Solution>

</Challenges>