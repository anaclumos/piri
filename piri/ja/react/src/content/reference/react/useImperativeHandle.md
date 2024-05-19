---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle`は、[ref](/learn/manipulating-the-dom-with-refs)として公開されるハンドルをカスタマイズできるReact Hookです。

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

`useImperativeHandle`をコンポーネントのトップレベルで呼び出して、公開されるrefハンドルをカスタマイズします：

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `ref`: [`forwardRef`レンダーファンクション](/reference/react/forwardRef#render-function)から2番目の引数として受け取った`ref`。

* `createHandle`: 引数を取らず、公開したいrefハンドルを返す関数。このrefハンドルは任意の型を持つことができます。通常、公開したいメソッドを持つオブジェクトを返します。

* **オプション** `dependencies`: `createHandle`コード内で参照されるすべてのリアクティブ値のリスト。リアクティブ値にはprops、state、およびコンポーネント本体内で直接宣言されたすべての変数と関数が含まれます。リンターが[React用に設定されている](/learn/editor-setup#linting)場合、すべてのリアクティブ値が依存関係として正しく指定されていることを確認します。依存関係のリストは一定の項目数を持ち、`[dep1, dep2, dep3]`のようにインラインで記述される必要があります。Reactは[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較を使用して各依存関係を以前の値と比較します。再レンダリングによって依存関係の一部が変更された場合、またはこの引数を省略した場合、`createHandle`関数が再実行され、新しく作成されたハンドルがrefに割り当てられます。

#### 戻り値 {/*returns*/}

`useImperativeHandle`は`undefined`を返します。

---

## 使用法 {/*usage*/}

### 親コンポーネントにカスタムrefハンドルを公開する {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

デフォルトでは、コンポーネントは親コンポーネントにDOMノードを公開しません。例えば、`MyInput`の親コンポーネントが`<input>`DOMノードに[アクセスできるようにする](/learn/manipulating-the-dom-with-refs)には、[`forwardRef`](/reference/react/forwardRef)を使用してオプトインする必要があります：

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

上記のコードでは、[`MyInput`のrefは`<input>`DOMノードを受け取ります。](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) しかし、カスタム値を公開することもできます。公開されるハンドルをカスタマイズするには、コンポーネントのトップレベルで`useImperativeHandle`を呼び出します：

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input {...props} />;
});
```

上記のコードでは、`ref`はもはや`<input>`に転送されません。

例えば、`<input>`DOMノード全体を公開するのではなく、そのメソッドのうち2つ、`focus`と`scrollIntoView`を公開したいとします。これを行うには、実際のブラウザDOMを別のrefに保持し、`useImperativeHandle`を使用して親コンポーネントが呼び出したいメソッドのみを持つハンドルを公開します：

```js {7-14}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

これで、親コンポーネントが`MyInput`へのrefを取得すると、`focus`と`scrollIntoView`メソッドを呼び出すことができます。しかし、基礎となる`<input>`DOMノードへの完全なアクセスは持ちません。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // DOMノードが公開されていないため、これは動作しません：
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### 独自の命令的メソッドを公開する {/*exposing-your-own-imperative-methods*/}

命令的ハンドルを介して公開するメソッドは、DOMメソッドと正確に一致する必要はありません。例えば、この`Post`コンポーネントは命令的ハンドルを介して`scrollAndFocusAddComment`メソッドを公開します。これにより、親の`Page`はボタンをクリックしたときにコメントリストをスクロールし*かつ*入力フィールドにフォーカスを当てることができます：

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { forwardRef, useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});

export default Post;
```


```js src/CommentList.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CommentList = forwardRef(function CommentList(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export default CommentList;
```

```js src/AddComment.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Add comment..." ref={ref} />;
});

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**refsを過剰に使用しないでください。** refsは、ノードへのスクロール、ノードへのフォーカス、アニメーションのトリガー、テキストの選択など、propsとして表現できない*命令的*な動作にのみ使用するべきです。

**何かをpropsとして表現できる場合、refを使用すべきではありません。** 例えば、`Modal`コンポーネントから`{ open, close }`のような命令的ハンドルを公開する代わりに、`<Modal isOpen={isOpen} />`のように`isOpen`をpropsとして受け取る方が良いです。[Effects](/learn/synchronizing-with-effects)は、propsを介して命令的な動作を公開するのに役立ちます。

</Pitfall>