---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle`는 [ref](/learn/manipulating-the-dom-with-refs)로 노출되는 핸들을 사용자 정의할 수 있게 해주는 React Hook입니다.

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

`useImperativeHandle`를 컴포넌트의 최상위에서 호출하여 노출되는 ref 핸들을 사용자 정의합니다:

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

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `ref`: [`forwardRef` 렌더 함수](/reference/react/forwardRef#render-function)에서 두 번째 인수로 받은 `ref`.

* `createHandle`: 인수를 받지 않고 노출하려는 ref 핸들을 반환하는 함수입니다. 그 ref 핸들은 어떤 타입이든 될 수 있습니다. 일반적으로 노출하려는 메서드가 포함된 객체를 반환합니다.

* **선택적** `dependencies`: `createHandle` 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 그리고 컴포넌트 본문 내에서 직접 선언된 모든 변수와 함수가 포함됩니다. 린터가 [React에 맞게 구성된 경우](/learn/editor-setup#linting), 모든 반응형 값이 올바르게 종속성으로 지정되었는지 확인합니다. 종속성 목록은 항목 수가 일정해야 하며 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 각 종속성을 이전 값과 비교합니다. 리렌더링으로 인해 일부 종속성이 변경되었거나 이 인수를 생략한 경우, `createHandle` 함수가 다시 실행되고 새로 생성된 핸들이 ref에 할당됩니다.

#### 반환값 {/*returns*/}

`useImperativeHandle`은 `undefined`를 반환합니다.

---

## 사용법 {/*usage*/}

### 부모 컴포넌트에 커스텀 ref 핸들 노출하기 {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

기본적으로 컴포넌트는 부모 컴포넌트에 자신의 DOM 노드를 노출하지 않습니다. 예를 들어, `MyInput`의 부모 컴포넌트가 `<input>` DOM 노드에 [접근할 수 있도록](/learn/manipulating-the-dom-with-refs) 하려면 [`forwardRef`](/reference/react/forwardRef)를 사용해야 합니다:

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

위 코드로 [`MyInput`에 대한 ref는 `<input>` DOM 노드를 받게 됩니다.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) 그러나, 커스텀 값을 노출할 수도 있습니다. 노출되는 핸들을 사용자 정의하려면, 컴포넌트의 최상위에서 `useImperativeHandle`을 호출하세요:

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

위 코드에서 `ref`는 더 이상 `<input>`에 전달되지 않습니다.

예를 들어, 전체 `<input>` DOM 노드를 노출하지 않고 두 가지 메서드인 `focus`와 `scrollIntoView`만 노출하려는 경우, 실제 브라우저 DOM을 별도의 ref에 유지합니다. 그런 다음 `useImperativeHandle`을 사용하여 부모 컴포넌트가 호출할 메서드만 포함된 핸들을 노출합니다:

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

이제 부모 컴포넌트가 `MyInput`에 대한 ref를 얻으면, `focus`와 `scrollIntoView` 메서드를 호출할 수 있습니다. 그러나 기본 `<input>` DOM 노드에 대한 전체 접근 권한은 없습니다.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // DOM 노드가 노출되지 않기 때문에 작동하지 않습니다:
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

### 사용자 정의 명령형 메서드 노출하기 {/*exposing-your-own-imperative-methods*/}

명령형 핸들을 통해 노출하는 메서드는 DOM 메서드와 정확히 일치할 필요가 없습니다. 예를 들어, 이 `Post` 컴포넌트는 명령형 핸들을 통해 `scrollAndFocusAddComment` 메서드를 노출합니다. 이를 통해 부모 `Page`는 버튼을 클릭할 때 댓글 목록을 스크롤하고 *입력 필드를* 포커스할 수 있습니다:

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

**refs를 과도하게 사용하지 마세요.** *명령형* 동작을 표현할 수 없는 경우에만 refs를 사용해야 합니다: 예를 들어, 노드로 스크롤하기, 노드에 포커스하기, 애니메이션 트리거하기, 텍스트 선택하기 등.

**props로 표현할 수 있는 경우, ref를 사용하지 마세요.** 예를 들어, `Modal` 컴포넌트에서 `{ open, close }`와 같은 명령형 핸들을 노출하는 대신, `<Modal isOpen={isOpen} />`와 같이 `isOpen`을 props로 받는 것이 좋습니다. [Effects](/learn/synchronizing-with-effects)는 props를 통해 명령형 동작을 노출하는 데 도움이 될 수 있습니다.

</Pitfall>