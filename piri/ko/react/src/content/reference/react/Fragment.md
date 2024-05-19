---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, 종종 `<>...</>` 구문을 통해 사용되며, 요소들을 래퍼 노드 없이 그룹화할 수 있게 해줍니다.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<Fragment>` {/*fragment*/}

단일 요소가 필요한 상황에서 요소들을 그룹화하려면 `<Fragment>`로 감싸세요. `Fragment`로 요소들을 그룹화하는 것은 결과 DOM에 아무런 영향을 미치지 않습니다; 요소들이 그룹화되지 않은 것과 동일합니다. 빈 JSX 태그 `<></>`는 대부분의 경우 `<Fragment></Fragment>`의 축약형입니다.

#### Props {/*props*/}

- **선택적** `key`: 명시적으로 `<Fragment>` 구문으로 선언된 Fragments는 [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)를 가질 수 있습니다.

#### 주의사항 {/*caveats*/}

- `key`를 Fragment에 전달하려면 `<>...</>` 구문을 사용할 수 없습니다. `'react'`에서 `Fragment`를 명시적으로 가져와서 `<Fragment key={yourKey}>...</Fragment>`로 렌더링해야 합니다.

- React는 `<><Child /></>`에서 `[<Child />]`로 또는 그 반대로 렌더링할 때, 또는 `<><Child /></>`에서 `<Child />`로 또는 그 반대로 렌더링할 때 [상태를 리셋하지 않습니다.](/learn/preserving-and-resetting-state) 이는 단일 레벨 깊이에서만 작동합니다: 예를 들어, `<><><Child /></></>`에서 `<Child />`로 전환할 때 상태가 리셋됩니다. 정확한 의미는 [여기](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)에서 확인하세요.

---

## 사용법 {/*usage*/}

### 여러 요소 반환하기 {/*returning-multiple-elements*/}

`Fragment` 또는 동등한 `<>...</>` 구문을 사용하여 여러 요소를 함께 그룹화하세요. 단일 요소가 들어갈 수 있는 모든 곳에 여러 요소를 넣을 수 있습니다. 예를 들어, 컴포넌트는 하나의 요소만 반환할 수 있지만, Fragment를 사용하여 여러 요소를 그룹화한 다음 그룹으로 반환할 수 있습니다:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments는 요소들을 다른 컨테이너(예: DOM 요소)로 감싸는 것과 달리 레이아웃이나 스타일에 영향을 주지 않기 때문에 유용합니다. 이 예제를 브라우저 도구로 검사하면 모든 `<h1>` 및 `<article>` DOM 노드가 래퍼 없이 형제로 나타나는 것을 볼 수 있습니다:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### 특수 구문 없이 Fragment 작성하기 {/*how-to-write-a-fragment-without-the-special-syntax*/}

위 예제는 React에서 `Fragment`를 가져오는 것과 동일합니다:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

보통은 [Fragment에 `key`를 전달해야 하는 경우](#rendering-a-list-of-fragments)가 아니면 이 방법이 필요하지 않습니다.

</DeepDive>

---

### 여러 요소를 변수에 할당하기 {/*assigning-multiple-elements-to-a-variable*/}

다른 요소와 마찬가지로 Fragment 요소를 변수에 할당하거나 props로 전달할 수 있습니다:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### 텍스트와 함께 요소 그룹화하기 {/*grouping-elements-with-text*/}

`Fragment`를 사용하여 텍스트와 컴포넌트를 함께 그룹화할 수 있습니다:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Fragment 목록 렌더링하기 {/*rendering-a-list-of-fragments*/}

여기서는 `<></>` 구문 대신 `Fragment`를 명시적으로 작성해야 하는 상황입니다. [반복문에서 여러 요소를 렌더링할 때](/learn/rendering-lists), 각 요소에 `key`를 할당해야 합니다. 반복문 내의 요소들이 Fragments인 경우, `key` 속성을 제공하기 위해 일반 JSX 요소 구문을 사용해야 합니다:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

DOM을 검사하여 Fragment 자식들 주위에 래퍼 요소가 없는지 확인할 수 있습니다:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>