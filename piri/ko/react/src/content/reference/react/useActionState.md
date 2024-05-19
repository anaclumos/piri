---
title: useActionState
canary: true
---

<Canary>

`useActionState` 훅은 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. [릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels). 또한, `useActionState`의 모든 혜택을 누리기 위해서는 [React Server Components](/reference/rsc/use-client)를 지원하는 프레임워크를 사용해야 합니다.

</Canary>

<Note>

이전 React Canary 버전에서는 이 API가 React DOM의 일부였으며 `useFormState`라고 불렸습니다.

</Note>

<Intro>

`useActionState`는 폼 액션의 결과를 기반으로 상태를 업데이트할 수 있게 해주는 훅입니다.

```js
const [state, formAction] = useActionState(fn, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

`useActionState`를 컴포넌트의 최상위 레벨에서 호출하여 [폼 액션이 호출될 때](/reference/react-dom/components/form) 업데이트되는 컴포넌트 상태를 생성합니다. `useActionState`에 기존 폼 액션 함수와 초기 상태를 전달하면, 폼에서 사용할 새로운 액션과 최신 폼 상태를 반환합니다. 최신 폼 상태는 제공한 함수에도 전달됩니다.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

폼 상태는 폼이 마지막으로 제출되었을 때 액션이 반환한 값입니다. 폼이 아직 제출되지 않은 경우, 전달한 초기 상태입니다.

서버 액션과 함께 사용하면, `useActionState`는 폼 제출로 인한 서버의 응답을 하이드레이션이 완료되기 전에도 표시할 수 있게 해줍니다.

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Parameters {/*parameters*/}

* `fn`: 폼이 제출되거나 버튼이 눌렸을 때 호출될 함수입니다. 함수가 호출될 때, 폼의 이전 상태(처음에는 전달한 `initialState`, 이후에는 이전 반환 값)를 첫 번째 인수로 받고, 그 다음으로 폼 액션이 일반적으로 받는 인수를 받습니다.
* `initialState`: 상태를 처음에 설정하고자 하는 값입니다. 직렬화 가능한 값이어야 합니다. 이 인수는 액션이 처음 호출된 후에는 무시됩니다.
* **optional** `permalink`: 이 폼이 수정하는 고유한 페이지 URL을 포함하는 문자열입니다. 동적 콘텐츠(예: 피드)가 있는 페이지에서 점진적 향상과 함께 사용됩니다: `fn`이 [서버 액션](/reference/rsc/use-server)이고 JavaScript 번들이 로드되기 전에 폼이 제출되면, 브라우저는 현재 페이지의 URL 대신 지정된 permalink URL로 이동합니다. 동일한 폼 컴포넌트(동일한 액션 `fn` 및 `permalink` 포함)가 대상 페이지에 렌더링되도록 하여 React가 상태를 전달하는 방법을 알 수 있도록 합니다. 폼이 하이드레이션된 후에는 이 매개변수가 영향을 미치지 않습니다.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Returns {/*returns*/}

`useActionState`는 정확히 두 개의 값을 가진 배열을 반환합니다:

1. 현재 상태. 첫 번째 렌더링 동안, 전달한 `initialState`와 일치합니다. 액션이 호출된 후에는 액션이 반환한 값과 일치합니다.
2. 폼 컴포넌트의 `action` prop 또는 폼 내의 `button` 컴포넌트에 `formAction` prop으로 전달할 수 있는 새로운 액션.

#### Caveats {/*caveats*/}

* React Server Components를 지원하는 프레임워크와 함께 사용하면, `useActionState`는 클라이언트에서 JavaScript가 실행되기 전에 폼을 인터랙티브하게 만들 수 있습니다. Server Components 없이 사용하면, 컴포넌트 로컬 상태와 동일합니다.
* `useActionState`에 전달된 함수는 첫 번째 인수로 이전 또는 초기 상태를 받습니다. 이는 `useActionState`를 사용하지 않고 폼 액션으로 직접 사용했을 때와 서명이 다릅니다.

---

## Usage {/*usage*/}

### Using information returned by a form action {/*using-information-returned-by-a-form-action*/}

`useActionState`를 컴포넌트의 최상위 레벨에서 호출하여 폼이 마지막으로 제출되었을 때 액션의 반환 값을 액세스합니다.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState`는 정확히 두 개의 항목을 가진 배열을 반환합니다:

1. 폼의 <CodeStep step={1}>현재 상태</CodeStep>. 처음에는 제공한 <CodeStep step={4}>초기 상태</CodeStep>와 일치하며, 폼이 제출된 후에는 제공한 <CodeStep step={3}>액션</CodeStep>의 반환 값과 일치합니다.
2. `<form>`에 `action` prop으로 전달할 <CodeStep step={2}>새로운 액션</CodeStep>.

폼이 제출되면, 제공한 <CodeStep step={3}>액션</CodeStep> 함수가 호출됩니다. 그 반환 값은 폼의 새로운 <CodeStep step={1}>현재 상태</CodeStep>가 됩니다.

제공한 <CodeStep step={3}>액션</CodeStep>은 또한 폼의 <CodeStep step={1}>현재 상태</CodeStep>를 첫 번째 인수로 받습니다. 폼이 처음 제출될 때는 제공한 <CodeStep step={4}>초기 상태</CodeStep>가 되며, 이후 제출 시에는 마지막으로 액션이 호출되었을 때의 반환 값이 됩니다. 나머지 인수는 `useActionState`를 사용하지 않았을 때와 동일합니다.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="폼 제출 후 정보 표시" titleId="display-information-after-submitting-a-form">

#### Display form errors {/*display-form-errors*/}

서버 액션에서 반환된 오류 메시지나 토스트와 같은 메시지를 표시하려면, `useActionState` 호출로 액션을 래핑하세요.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

#### Display structured information after submitting a form {/*display-structured-information-after-submitting-a-form*/}

서버 액션의 반환 값은 직렬화 가능한 모든 값이 될 수 있습니다. 예를 들어, 액션이 성공했는지 여부를 나타내는 부울 값, 오류 메시지 또는 업데이트된 정보를 포함하는 객체일 수 있습니다.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

</Recipes>

## Troubleshooting {/*troubleshooting*/}

### My action can no longer read the submitted form data {/*my-action-can-no-longer-read-the-submitted-form-data*/}

`useActionState`로 액션을 래핑하면, 첫 번째 인수로 추가 인수를 받습니다. 제출된 폼 데이터는 일반적으로 첫 번째 인수였지만, 이제는 두 번째 인수가 됩니다. 추가된 첫 번째 인수는 폼의 현재 상태입니다.

```js
function action(currentState, formData) {
  // ...
}
```