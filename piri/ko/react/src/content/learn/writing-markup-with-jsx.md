---
title: JSX로 마크업 작성하기
---

<Intro>

*JSX*는 JavaScript 파일 내에서 HTML과 유사한 마크업을 작성할 수 있게 해주는 JavaScript의 문법 확장입니다. 컴포넌트를 작성하는 다른 방법들도 있지만, 대부분의 React 개발자들은 JSX의 간결함을 선호하며, 대부분의 코드베이스에서 이를 사용합니다.

</Intro>

<YouWillLearn>

* React가 마크업과 렌더링 로직을 혼합하는 이유
* JSX가 HTML과 다른 점
* JSX로 정보를 표시하는 방법

</YouWillLearn>

## JSX: 마크업을 JavaScript에 넣기 {/*jsx-putting-markup-into-javascript*/}

웹은 HTML, CSS, JavaScript로 구축되었습니다. 오랜 기간 동안 웹 개발자들은 콘텐츠를 HTML에, 디자인을 CSS에, 로직을 JavaScript에—종종 별도의 파일에—저장했습니다! 콘텐츠는 HTML 내에 마크업되었고, 페이지의 로직은 JavaScript에 별도로 존재했습니다:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="보라색 배경의 HTML 마크업과 두 개의 자식 태그(p와 form)를 가진 div. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="노란색 배경의 세 개의 JavaScript 핸들러: onSubmit, onLogin, onClick.">

JavaScript

</Diagram>

</DiagramGroup>

하지만 웹이 점점 더 인터랙티브해지면서 로직이 콘텐츠를 결정하는 경우가 많아졌습니다. JavaScript가 HTML을 담당하게 된 것입니다! 이것이 **React에서 렌더링 로직과 마크업이 같은 장소—컴포넌트—에 함께 존재하는 이유입니다.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="이전 예제의 HTML과 JavaScript가 혼합된 React 컴포넌트. 함수 이름은 Sidebar이며, 노란색으로 강조된 isLoggedIn 함수를 호출합니다. 보라색으로 강조된 함수 내부에는 이전의 p 태그와 다음 다이어그램에서 참조된 Form 태그가 중첩되어 있습니다.">

`Sidebar.js` React 컴포넌트

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="이전 예제의 HTML과 JavaScript가 혼합된 React 컴포넌트. 함수 이름은 Form이며, 두 개의 핸들러 onClick과 onSubmit이 노란색으로 강조되어 있습니다. 핸들러 다음에는 보라색으로 강조된 HTML이 있습니다. HTML에는 onClick 속성이 있는 form 요소와 중첩된 input 요소가 포함되어 있습니다.">

`Form.js` React 컴포넌트

</Diagram>

</DiagramGroup>

버튼의 렌더링 로직과 마크업을 함께 유지하면 매번 수정할 때마다 서로 동기화 상태를 유지할 수 있습니다. 반대로, 버튼의 마크업과 사이드바의 마크업처럼 관련이 없는 세부 사항은 서로 격리되어 있어, 각각을 독립적으로 변경하는 것이 더 안전합니다.

각 React 컴포넌트는 React가 브라우저에 렌더링하는 일부 마크업을 포함할 수 있는 JavaScript 함수입니다. React 컴포넌트는 그 마크업을 나타내기 위해 JSX라는 문법 확장을 사용합니다. JSX는 HTML과 매우 유사하지만, 조금 더 엄격하고 동적 정보를 표시할 수 있습니다. 이를 이해하는 가장 좋은 방법은 일부 HTML 마크업을 JSX 마크업으로 변환하는 것입니다.

<Note>

JSX와 React는 별개의 것입니다. 종종 함께 사용되지만, [독립적으로 사용할 수 있습니다](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform). JSX는 문법 확장이고, React는 JavaScript 라이브러리입니다.

</Note>

## HTML을 JSX로 변환하기 {/*converting-html-to-jsx*/}

유효한 HTML이 있다고 가정해 봅시다:

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

그리고 이를 컴포넌트에 넣고 싶습니다:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

그대로 복사해서 붙여넣으면 작동하지 않습니다:


<Sandpack>

```js
export default function TodoList() {
  return (
    // 이건 제대로 작동하지 않습니다!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

이는 JSX가 HTML보다 더 엄격하고 몇 가지 규칙이 더 있기 때문입니다! 위의 오류 메시지를 읽으면 마크업을 수정하는 방법을 안내해 줄 것입니다. 또는 아래 가이드를 따라갈 수도 있습니다.

<Note>

대부분의 경우, React의 화면 오류 메시지가 문제의 위치를 찾는 데 도움을 줄 것입니다. 막히면 한 번 읽어보세요!

</Note>

## JSX의 규칙 {/*the-rules-of-jsx*/}

### 1. 단일 루트 요소 반환 {/*1-return-a-single-root-element*/}

컴포넌트에서 여러 요소를 반환하려면 **단일 부모 태그로 감싸야 합니다.**

예를 들어, `<div>`를 사용할 수 있습니다:

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

마크업에 추가적인 `<div>`를 추가하고 싶지 않다면, `<>`와 `</>`를 대신 사용할 수 있습니다:

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

이 빈 태그는 *[Fragment](/reference/react/Fragment)*라고 불립니다. Fragment는 브라우저 HTML 트리에 아무런 흔적을 남기지 않고 그룹화할 수 있게 해줍니다.

<DeepDive>

#### 왜 여러 JSX 태그를 감싸야 하나요? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX는 HTML처럼 보이지만, 내부적으로는 평범한 JavaScript 객체로 변환됩니다. 함수에서 두 개의 객체를 배열로 감싸지 않고 반환할 수 없습니다. 이것이 두 개의 JSX 태그를 다른 태그나 Fragment로 감싸지 않고 반환할 수 없는 이유를 설명합니다.

</DeepDive>

### 2. 모든 태그를 닫기 {/*2-close-all-the-tags*/}

JSX는 태그를 명시적으로 닫아야 합니다: `<img>`와 같은 자기 닫기 태그는 `<img />`가 되어야 하고, `<li>oranges`와 같은 감싸는 태그는 `<li>oranges</li>`로 작성되어야 합니다.

이것이 Hedy Lamarr의 이미지와 목록 항목이 닫힌 모습입니다:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase <s>모든</s> 대부분의 것들! {/*3-camelcase-salls-most-of-the-things*/}

JSX는 JavaScript로 변환되며, JSX에 작성된 속성은 JavaScript 객체의 키가 됩니다. 자신의 컴포넌트에서 이러한 속성을 변수로 읽고 싶을 때가 많습니다. 하지만 JavaScript에는 변수 이름에 대한 제한이 있습니다. 예를 들어, 이름에 대시를 포함할 수 없거나 `class`와 같은 예약어가 될 수 없습니다.

이 때문에 React에서는 많은 HTML 및 SVG 속성이 camelCase로 작성됩니다. 예를 들어, `stroke-width` 대신 `strokeWidth`를 사용합니다. `class`는 예약어이기 때문에, React에서는 `className`을 사용합니다. 이는 [해당 DOM 속성](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)의 이름을 따서 명명되었습니다:

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

이러한 속성들은 [DOM 컴포넌트 props 목록에서 모두 찾을 수 있습니다.](/reference/react-dom/components/common) 잘못 작성해도 걱정하지 마세요—React는 [브라우저 콘솔](https://developer.mozilla.org/docs/Tools/Browser_Console)에 가능한 수정 사항을 포함한 메시지를 출력할 것입니다.

<Pitfall>

역사적인 이유로, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) 및 [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) 속성은 대시를 사용하여 HTML처럼 작성됩니다.

</Pitfall>

### 프로 팁: JSX 변환기 사용하기 {/*pro-tip-use-a-jsx-converter*/}

기존 마크업의 모든 속성을 변환하는 것은 번거로울 수 있습니다! 기존 HTML 및 SVG를 JSX로 변환하는 [변환기](https://transform.tools/html-to-jsx)를 사용하는 것을 권장합니다. 변환기는 실무에서 매우 유용하지만, 직접 JSX를 편안하게 작성할 수 있도록 이해하는 것이 좋습니다.

여기 최종 결과가 있습니다:

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
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

이제 JSX가 존재하는 이유와 컴포넌트에서 사용하는 방법을 알게 되었습니다:

* React 컴포넌트는 렌더링 로직과 마크업을 함께 그룹화합니다. 이는 관련이 있기 때문입니다.
* JSX는 HTML과 유사하지만 몇 가지 차이점이 있습니다. 필요하다면 [변환기](https://transform.tools/html-to-jsx)를 사용할 수 있습니다.
* 오류 메시지는 종종 마크업을 수정하는 올바른 방향을 가리킵니다.

</Recap>

<Challenges>

#### HTML을 JSX로 변환하기 {/*convert-some-html-to-jsx*/}

이 HTML이 컴포넌트에 붙여졌지만, 유효한 JSX가 아닙니다. 이를 수정하세요:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

직접 하거나 변환기를 사용하는 것은 여러분의 선택입니다!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>