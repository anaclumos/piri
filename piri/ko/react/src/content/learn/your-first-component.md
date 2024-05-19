---
title: 당신의 첫 번째 컴포넌트
---

<Intro>

*컴포넌트*는 React의 핵심 개념 중 하나입니다. 컴포넌트는 사용자 인터페이스(UI)를 구축하는 기초가 되므로, React 여정을 시작하기에 완벽한 장소입니다!

</Intro>

<YouWillLearn>

* 컴포넌트란 무엇인가
* 컴포넌트가 React 애플리케이션에서 어떤 역할을 하는가
* 첫 번째 React 컴포넌트를 작성하는 방법

</YouWillLearn>

## 컴포넌트: UI 구성 요소 {/*components-ui-building-blocks*/}

웹에서 HTML은 `<h1>` 및 `<li>`와 같은 내장 태그 세트를 사용하여 풍부한 구조화된 문서를 만들 수 있게 해줍니다:

```html
<article>
  <h1>내 첫 번째 컴포넌트</h1>
  <ol>
    <li>컴포넌트: UI 구성 요소</li>
    <li>컴포넌트 정의하기</li>
    <li>컴포넌트 사용하기</li>
  </ol>
</article>
```

이 마크업은 이 기사 `<article>`, 그 제목 `<h1>`, 그리고 순서가 있는 목록 `<ol>`로 된 (요약된) 목차를 나타냅니다. 이러한 마크업은 스타일을 위한 CSS 및 상호작용을 위한 JavaScript와 결합되어 웹에서 보는 모든 사이드바, 아바타, 모달, 드롭다운—모든 UI 조각의 뒤에 있습니다.

React는 마크업, CSS 및 JavaScript를 사용자 정의 "컴포넌트"로 결합할 수 있게 해줍니다. **앱을 위한 재사용 가능한 UI 요소입니다.** 위에서 본 목차 코드는 모든 페이지에 렌더링할 수 있는 `<TableOfContents />` 컴포넌트로 변환될 수 있습니다. 내부적으로는 여전히 `<article>`, `<h1>` 등과 같은 동일한 HTML 태그를 사용합니다.

HTML 태그와 마찬가지로 컴포넌트를 구성하고, 순서를 정하고, 중첩하여 전체 페이지를 디자인할 수 있습니다. 예를 들어, 여러분이 읽고 있는 문서 페이지는 React 컴포넌트로 구성되어 있습니다:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

프로젝트가 커짐에 따라 이미 작성한 컴포넌트를 재사용하여 많은 디자인을 구성할 수 있음을 알게 되어 개발 속도가 빨라집니다. 위의 목차는 `<TableOfContents />`를 사용하여 모든 화면에 추가할 수 있습니다! [Chakra UI](https://chakra-ui.com/) 및 [Material UI](https://material-ui.com/)와 같은 React 오픈 소스 커뮤니티에서 공유하는 수천 개의 컴포넌트를 사용하여 프로젝트를 빠르게 시작할 수도 있습니다.

## 컴포넌트 정의하기 {/*defining-a-component*/}

전통적으로 웹 페이지를 만들 때 웹 개발자는 콘텐츠를 마크업한 다음 JavaScript를 추가하여 상호작용을 추가했습니다. 이는 웹에서 상호작용이 필수적이지 않을 때는 훌륭하게 작동했습니다. 이제는 많은 사이트와 모든 앱에서 상호작용이 기대됩니다. React는 여전히 동일한 기술을 사용하면서 상호작용을 우선시합니다: **React 컴포넌트는 마크업을 _뿌릴 수 있는_ JavaScript 함수입니다.** 다음은 그 예입니다 (아래 예제를 편집할 수 있습니다):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

그리고 컴포넌트를 만드는 방법은 다음과 같습니다:

### 1단계: 컴포넌트 내보내기 {/*step-1-export-the-component*/}

`export default` 접두사는 [표준 JavaScript 문법](https://developer.mozilla.org/docs/web/javascript/reference/statements/export)입니다 (React에만 국한되지 않음). 이를 통해 파일의 주요 함수를 표시하여 나중에 다른 파일에서 가져올 수 있습니다. (가져오기 관련 내용은 [컴포넌트 가져오기 및 내보내기](/learn/importing-and-exporting-components)에서 더 알아보세요!)

### 2단계: 함수 정의하기 {/*step-2-define-the-function*/}

`function Profile() { }`로 `Profile`이라는 이름의 JavaScript 함수를 정의합니다.

<Pitfall>

React 컴포넌트는 일반 JavaScript 함수이지만, **이름이 대문자로 시작해야 합니다** 그렇지 않으면 작동하지 않습니다!

</Pitfall>

### 3단계: 마크업 추가하기 {/*step-3-add-markup*/}

컴포넌트는 `src` 및 `alt` 속성이 있는 `<img />` 태그를 반환합니다. `<img />`는 HTML처럼 작성되었지만 실제로는 JavaScript입니다! 이 문법은 [JSX](/learn/writing-markup-with-jsx)라고 하며, JavaScript 내에 마크업을 포함할 수 있게 해줍니다.

반환문은 다음과 같이 한 줄로 작성할 수 있습니다:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

하지만 반환 키워드와 같은 줄에 마크업이 없으면 괄호로 감싸야 합니다:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

괄호가 없으면 `return` 이후의 모든 코드는 [무시됩니다](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## 컴포넌트 사용하기 {/*using-a-component*/}

이제 `Profile` 컴포넌트를 정의했으므로 다른 컴포넌트 내에 중첩할 수 있습니다. 예를 들어, 여러 `Profile` 컴포넌트를 사용하는 `Gallery` 컴포넌트를 내보낼 수 있습니다:

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
      <h1>놀라운 과학자들</h1>
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

### 브라우저가 보는 것 {/*what-the-browser-sees*/}

대소문자의 차이를 주목하세요:

* `<section>`은 소문자이므로 React는 우리가 HTML 태그를 참조하고 있음을 압니다.
* `<Profile />`은 대문자 `P`로 시작하므로 React는 우리가 `Profile`이라는 컴포넌트를 사용하고자 함을 압니다.

그리고 `Profile`은 더 많은 HTML을 포함합니다: `<img />`. 결국, 브라우저는 다음과 같이 보입니다:

```html
<section>
  <h1>놀라운 과학자들</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### 컴포넌트 중첩 및 구성하기 {/*nesting-and-organizing-components*/}

컴포넌트는 일반 JavaScript 함수이므로 동일한 파일에 여러 컴포넌트를 유지할 수 있습니다. 컴포넌트가 상대적으로 작거나 서로 밀접하게 관련되어 있을 때 편리합니다. 이 파일이 복잡해지면 `Profile`을 별도의 파일로 이동할 수 있습니다. [가져오기 페이지](/learn/importing-and-exporting-components)에서 곧 이를 배우게 될 것입니다.

`Profile` 컴포넌트가 `Gallery` 내에 렌더링되므로—심지어 여러 번!—`Gallery`가 **부모 컴포넌트**이며 각 `Profile`을 "자식"으로 렌더링한다고 할 수 있습니다. 이것이 React의 마법 중 하나입니다: 컴포넌트를 한 번 정의하고 원하는 만큼 여러 장소에서 사용할 수 있습니다.

<Pitfall>

컴포넌트는 다른 컴포넌트를 렌더링할 수 있지만, **절대 정의를 중첩해서는 안 됩니다:**

```js {2-5}
export default function Gallery() {
  // 🔴 컴포넌트를 다른 컴포넌트 내에 정의하지 마세요!
  function Profile() {
    // ...
  }
  // ...
}
```

위의 코드 조각은 [매우 느리고 버그를 유발합니다.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) 대신, 모든 컴포넌트를 최상위 수준에서 정의하세요:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ 컴포넌트를 최상위 수준에서 선언하세요
function Profile() {
  // ...
}
```

자식 컴포넌트가 부모로부터 데이터를 필요로 할 때는 정의를 중첩하는 대신 [props로 전달하세요](/learn/passing-props-to-a-component).

</Pitfall>

<DeepDive>

#### 컴포넌트의 연속 {/*components-all-the-way-down*/}

여러분의 React 애플리케이션은 "루트" 컴포넌트에서 시작됩니다. 일반적으로 새 프로젝트를 시작할 때 자동으로 생성됩니다. 예를 들어, [CodeSandbox](https://codesandbox.io/)를 사용하거나 [Next.js](https://nextjs.org/) 프레임워크를 사용하는 경우, 루트 컴포넌트는 `pages/index.js`에 정의됩니다. 이 예제들에서 여러분은 루트 컴포넌트를 내보내고 있었습니다.

대부분의 React 앱은 컴포넌트를 계속 사용합니다. 이는 버튼과 같은 재사용 가능한 조각뿐만 아니라 사이드바, 목록, 궁극적으로는 전체 페이지와 같은 더 큰 조각에도 컴포넌트를 사용할 것임을 의미합니다! 컴포넌트는 일부만 한 번 사용되더라도 UI 코드와 마크업을 구성하는 편리한 방법입니다.

[React 기반 프레임워크](/learn/start-a-new-react-project)는 이를 한 단계 더 나아갑니다. 빈 HTML 파일을 사용하고 React가 JavaScript로 페이지 관리를 "인수"하게 하는 대신, React 컴포넌트에서 HTML을 자동으로 생성합니다. 이를 통해 JavaScript 코드가 로드되기 전에 앱이 일부 콘텐츠를 표시할 수 있습니다.

여전히 많은 웹사이트는 기존 HTML 페이지에 [상호작용을 추가하기 위해 React를 사용합니다.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) 이들은 전체 페이지에 대한 단일 루트 컴포넌트 대신 여러 루트 컴포넌트를 가집니다. 필요한 만큼—또는 적게—React를 사용할 수 있습니다.

</DeepDive>

<Recap>

방금 React의 첫 맛을 보았습니다! 주요 포인트를 요약해 봅시다.

* React는 앱을 위한 **재사용 가능한 UI 요소인 컴포넌트**를 만들 수 있게 해줍니다.
* React 앱에서는 모든 UI 조각이 컴포넌트입니다.
* React 컴포넌트는 일반 JavaScript 함수이지만:

  1. 이름이 항상 대문자로 시작합니다.
  2. JSX 마크업을 반환합니다.

</Recap>

<Challenges>

#### 컴포넌트 내보내기 {/*export-the-component*/}

이 샌드박스는 루트 컴포넌트가 내보내지지 않아서 작동하지 않습니다:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

해결책을 보기 전에 직접 고쳐보세요!

<Solution>

함수 정의 앞에 `export default`를 추가하세요:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

`export`만 작성하는 것으로는 이 예제를 고칠 수 없는 이유가 궁금할 수 있습니다. `export`와 `export default`의 차이점은 [컴포넌트 가져오기 및 내보내기](/learn/importing-and-exporting-components)에서 배울 수 있습니다.

</Solution>

#### 반환문 고치기 {/*fix-the-return-statement*/}

이 `return` 문에 뭔가 잘못되었습니다. 고칠 수 있나요?

<Hint>

이 문제를 고치려고 할 때 "Unexpected token" 오류가 발생할 수 있습니다. 이 경우, 세미콜론이 닫는 괄호 *뒤에* 나타나는지 확인하세요. `return ( )` 내부에 세미콜론을 남겨두면 오류가 발생합니다.

</Hint>

<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

이 컴포넌트를 다음과 같이 반환문을 한 줄로 이동하여 고칠 수 있습니다:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

또는 반환된 JSX 마크업을 `return` 바로 뒤에 여는 괄호로 감싸서 고칠 수 있습니다:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### 실수 찾기 {/*spot-the-mistake*/}

`Profile` 컴포넌트가 선언되고 사용되는 방식에 뭔가 잘못되었습니다. 실수를 찾을 수 있나요? (React가 컴포넌트와 일반 HTML 태그를 구분하는 방법을 기억해 보세요!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>놀라운 과학자들</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React 컴포넌트 이름은 대문자로 시작해야 합니다.

`function profile()`을 `function Profile()`로 변경하고, 모든 `<profile />`을 `<Profile />`로 변경하세요:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>놀라운 과학자들</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### 나만의 컴포넌트 {/*your-own-component*/}

처음부터 컴포넌트를 작성하세요. 유효한 이름을 아무거나 지정하고 마크업을 반환할 수 있습니다. 아이디어가 떠오르지 않으면 `<h1>잘했어요!</h1>`를 표시하는 `Congratulations` 컴포넌트를 작성할 수 있습니다. 내보내는 것을 잊지 마세요!

<Sandpack>

```js
// 아래에 컴포넌트를 작성하세요!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>잘했어요!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>