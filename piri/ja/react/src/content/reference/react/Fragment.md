---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`は、`<>...</>`構文を通じてよく使用され、ラッパーノードなしで要素をグループ化することができます。

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<Fragment>` {/*fragment*/}

単一の要素が必要な状況で要素をグループ化するために`<Fragment>`で要素をラップします。`Fragment`で要素をグループ化しても、結果のDOMには影響がありません。要素がグループ化されていない場合と同じです。空のJSXタグ`<></>`は、ほとんどの場合`<Fragment></Fragment>`の省略形です。

#### Props {/*props*/}

- **オプション** `key`: 明示的な`<Fragment>`構文で宣言されたフラグメントには[キー](/learn/rendering-lists#keeping-list-items-in-order-with-key)を持たせることができます。

#### 注意点 {/*caveats*/}

- `key`をフラグメントに渡したい場合、`<>...</>`構文を使用することはできません。`'react'`から`Fragment`を明示的にインポートし、`<Fragment key={yourKey}>...</Fragment>`をレンダリングする必要があります。

- `<><Child /></>`から`[<Child />]`またはその逆、または`<><Child /></>`から`<Child />`およびその逆にレンダリングを変更しても、Reactは[状態をリセット](/learn/preserving-and-resetting-state)しません。これは単一レベルの深さでのみ機能します。例えば、`<><><Child /></></>`から`<Child />`に変更すると状態がリセットされます。正確なセマンティクスについては[こちら](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)を参照してください。

---

## 使用法 {/*usage*/}

### 複数の要素を返す {/*returning-multiple-elements*/}

複数の要素をグループ化するために`Fragment`または同等の`<>...</>`構文を使用します。単一の要素が必要な場所に複数の要素を配置するために使用できます。例えば、コンポーネントは1つの要素しか返せませんが、フラグメントを使用することで複数の要素をグループ化し、それらをグループとして返すことができます。

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

フラグメントは、他のコンテナ（DOM要素など）で要素をラップする場合とは異なり、レイアウトやスタイルに影響を与えないため便利です。この例をブラウザツールで検査すると、すべての`<h1>`および`<article>`DOMノードがラッパーなしで兄弟要素として表示されることがわかります。

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

#### 特殊な構文を使わずにフラグメントを書く方法 {/*how-to-write-a-fragment-without-the-special-syntax*/}

上記の例は、Reactから`Fragment`をインポートすることと同等です。

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

通常、これを必要とすることはありませんが、[フラグメントに`key`を渡す必要がある場合](#rendering-a-list-of-fragments)には必要です。

</DeepDive>

---

### 複数の要素を変数に割り当てる {/*assigning-multiple-elements-to-a-variable*/}

他の要素と同様に、フラグメント要素を変数に割り当てたり、propsとして渡したりすることができます。

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

### テキストと要素をグループ化する {/*grouping-elements-with-text*/}

`Fragment`を使用して、テキストとコンポーネントをグループ化することができます。

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

### フラグメントのリストをレンダリングする {/*rendering-a-list-of-fragments*/}

ここでは、`<>...</>`構文を使用する代わりに`Fragment`を明示的に記述する必要がある状況です。ループ内で[複数の要素をレンダリングする](/learn/rendering-lists)場合、各要素に`key`を割り当てる必要があります。ループ内の要素がフラグメントである場合、`key`属性を提供するために通常のJSX要素構文を使用する必要があります。

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

フラグメントの子要素の周りにラッパー要素がないことを確認するためにDOMを検査できます。

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