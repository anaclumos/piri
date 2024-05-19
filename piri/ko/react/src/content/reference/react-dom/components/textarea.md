---
title: <textarea>
---

<Intro>

[내장 브라우저 `<textarea>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)를 사용하면 여러 줄의 텍스트 입력을 렌더링할 수 있습니다.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<textarea>` {/*textarea*/}

텍스트 영역을 표시하려면 [내장 브라우저 `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) 컴포넌트를 렌더링하세요.

```js
<textarea name="postContent" />
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<textarea>`는 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

`value` prop을 전달하여 [텍스트 영역을 제어](#controlling-a-text-area-with-a-state-variable)할 수 있습니다:

* `value`: 문자열. 텍스트 영역 내부의 텍스트를 제어합니다.

`value`를 전달할 때는 전달된 값을 업데이트하는 `onChange` 핸들러도 전달해야 합니다.

`<textarea>`가 제어되지 않는 경우 `defaultValue` prop을 대신 전달할 수 있습니다:

* `defaultValue`: 문자열. 텍스트 영역의 [초기 값](#providing-an-initial-value-for-a-text-area)을 지정합니다.

이 `<textarea>` props는 제어되지 않는 텍스트 영역과 제어되는 텍스트 영역 모두에 관련이 있습니다:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): `'on'` 또는 `'off'`. 자동 완성 동작을 지정합니다.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): 불리언. `true`이면 React가 마운트 시 요소에 포커스를 맞춥니다.
* `children`: `<textarea>`는 자식을 허용하지 않습니다. 초기 값을 설정하려면 `defaultValue`를 사용하세요.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): 숫자. 평균 문자 너비로 기본 너비를 지정합니다. 기본값은 `20`입니다.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): 불리언. `true`이면 입력이 상호작용할 수 없으며 흐리게 표시됩니다.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): 문자열. 이 입력이 속한 `<form>`의 `id`를 지정합니다. 생략하면 가장 가까운 부모 폼입니다.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): 숫자. 텍스트의 최대 길이를 지정합니다.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): 숫자. 텍스트의 최소 길이를 지정합니다.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 문자열. 이 입력의 이름을 지정합니다. [폼과 함께 제출됩니다.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. [제어된 텍스트 영역](#controlling-a-text-area-with-a-state-variable)에 필요합니다. 사용자가 입력 값을 변경할 때마다 즉시 실행됩니다(예: 모든 키 입력 시 실행). 브라우저의 [`input` 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)처럼 동작합니다.
* `onChangeCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onChange` 버전입니다.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 사용자가 값을 변경할 때 즉시 실행됩니다. 역사적인 이유로 React에서는 `onChange`를 사용하는 것이 관례이며, 이는 유사하게 동작합니다.
* `onInputCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onInput` 버전입니다.
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 폼 제출 시 입력이 유효성 검사를 통과하지 못하면 실행됩니다. 내장된 `invalid` 이벤트와 달리 React의 `onInvalid` 이벤트는 버블링됩니다.
* `onInvalidCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onInvalid` 버전입니다.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. `<textarea>` 내부의 선택이 변경된 후 실행됩니다. React는 `onSelect` 이벤트를 확장하여 빈 선택 및 편집 시에도 실행되도록 합니다(편집은 선택에 영향을 미칠 수 있습니다).
* `onSelectCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onSelect` 버전입니다.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): 문자열. 텍스트 영역 값이 비어 있을 때 흐리게 표시됩니다.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): 불리언. `true`이면 사용자가 텍스트 영역을 편집할 수 없습니다.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): 불리언. `true`이면 폼을 제출하기 위해 값이 제공되어야 합니다.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): 숫자. 평균 문자 높이로 기본 높이를 지정합니다. 기본값은 `2`입니다.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): `'hard'`, `'soft'`, 또는 `'off'`. 폼 제출 시 텍스트가 어떻게 줄 바꿈될지 지정합니다.

#### 주의사항 {/*caveats*/}

- `<textarea>something</textarea>`와 같이 자식을 전달하는 것은 허용되지 않습니다. [초기 내용에는 `defaultValue`를 사용하세요.](#providing-an-initial-value-for-a-text-area)
- 텍스트 영역이 문자열 `value` prop을 받으면 [제어된 것으로 간주됩니다.](#controlling-a-text-area-with-a-state-variable)
- 텍스트 영역은 동시에 제어되고 제어되지 않을 수 없습니다.
- 텍스트 영역은 수명 동안 제어되거나 제어되지 않는 상태를 전환할 수 없습니다.
- 모든 제어된 텍스트 영역에는 백업 값을 동기적으로 업데이트하는 `onChange` 이벤트 핸들러가 필요합니다.

---

## 사용법 {/*usage*/}

### 텍스트 영역 표시하기 {/*displaying-a-text-area*/}

텍스트 영역을 표시하려면 `<textarea>`를 렌더링하세요. [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) 및 [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) 속성으로 기본 크기를 지정할 수 있지만, 기본적으로 사용자는 크기를 조정할 수 있습니다. 크기 조정을 비활성화하려면 CSS에서 `resize: none`을 지정할 수 있습니다.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      글을 작성하세요:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### 텍스트 영역에 라벨 제공하기 {/*providing-a-label-for-a-text-area*/}

일반적으로 모든 `<textarea>`를 [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) 태그 안에 배치합니다. 이는 브라우저에 이 라벨이 해당 텍스트 영역과 연관되어 있음을 알려줍니다. 사용자가 라벨을 클릭하면 브라우저는 텍스트 영역에 포커스를 맞춥니다. 또한 접근성에도 필수적입니다: 화면 읽기 프로그램은 사용자가 텍스트 영역에 포커스를 맞출 때 라벨 캡션을 알립니다.

`<textarea>`를 `<label>` 안에 중첩할 수 없는 경우, 동일한 ID를 `<textarea id>`와 [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)에 전달하여 연관시킵니다. 한 컴포넌트의 인스턴스 간 충돌을 피하기 위해 [`useId`](/reference/react/useId)로 이러한 ID를 생성합니다.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        글을 작성하세요:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### 텍스트 영역에 초기 값 제공하기 {/*providing-an-initial-value-for-a-text-area*/}

텍스트 영역에 초기 값을 지정할 수 있습니다. `defaultValue` 문자열로 전달하세요.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      글을 수정하세요:
      <textarea
        name="postContent"
        defaultValue="어제 자전거 타는 것을 정말 즐겼어요!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

HTML과 달리 `<textarea>Some content</textarea>`와 같이 초기 텍스트를 전달하는 것은 지원되지 않습니다.

</Pitfall>

---

### 폼 제출 시 텍스트 영역 값 읽기 {/*reading-the-text-area-value-when-submitting-a-form*/}

텍스트 영역 주위에 [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)를 추가하고 내부에 [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)를 넣습니다. 이는 `<form onSubmit>` 이벤트 핸들러를 호출합니다. 기본적으로 브라우저는 폼 데이터를 현재 URL로 보내고 페이지를 새로 고칩니다. `e.preventDefault()`를 호출하여 이 동작을 재정의할 수 있습니다. [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)로 폼 데이터를 읽습니다.
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // 브라우저가 페이지를 새로 고치는 것을 방지합니다
    e.preventDefault();

    // 폼 데이터를 읽습니다
    const form = e.target;
    const formData = new FormData(form);

    // 폼 데이터를 fetch 본문으로 직접 전달할 수 있습니다:
    fetch('/some-api', { method: form.method, body: formData });

    // 또는 평범한 객체로 작업할 수 있습니다:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        글 제목: <input name="postTitle" defaultValue="자전거 타기" />
      </label>
      <label>
        글을 수정하세요:
        <textarea
          name="postContent"
          defaultValue="어제 자전거 타는 것을 정말 즐겼어요!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">수정 초기화</button>
      <button type="submit">글 저장</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

`<textarea>`에 `name`을 지정하세요, 예를 들어 `<textarea name="postContent" />`. 지정한 `name`은 폼 데이터의 키로 사용됩니다, 예를 들어 `{ postContent: "Your post" }`.

</Note>

<Pitfall>

기본적으로 *모든* `<button>`은 `<form>` 내에서 폼을 제출합니다. 이는 놀라울 수 있습니다! 자체 커스텀 `Button` React 컴포넌트가 있는 경우, `<button>` 대신 [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button)를 반환하는 것을 고려하세요. 그런 다음, 폼을 제출해야 하는 버튼에는 `<button type="submit">`을 명시적으로 사용하세요.

</Pitfall>

---

### 상태 변수로 텍스트 영역 제어하기 {/*controlling-a-text-area-with-a-state-variable*/}

`<textarea />`와 같은 텍스트 영역은 *제어되지 않습니다.* [초기 값을 전달](#providing-an-initial-value-for-a-text-area)하더라도 `<textarea defaultValue="Initial text" />`, JSX는 초기 값만 지정하며 현재 값을 지정하지 않습니다.

**_제어된_ 텍스트 영역을 렌더링하려면 `value` prop을 전달하세요.** React는 전달한 `value`를 항상 텍스트 영역에 강제합니다. 일반적으로 텍스트 영역을 제어하려면 [상태 변수](/reference/react/useState)를 선언합니다:

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // 상태 변수를 선언합니다...
  // ...
  return (
    <textarea
      value={postContent} // ...상태 변수와 일치하도록 입력 값을 강제합니다...
      onChange={e => setPostContent(e.target.value)} // ...그리고 편집 시 상태 변수를 업데이트합니다!
    />
  );
}
```

이것은 모든 키 입력에 반응하여 UI의 일부를 다시 렌더링하려는 경우 유용합니다.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        마크다운을 입력하세요:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**`onChange` 없이 `value`를 전달하면 텍스트 영역에 입력할 수 없습니다.** `value`를 전달하여 텍스트 영역을 제어하면 전달한 값을 항상 강제합니다. 따라서 상태 변수를 `value`로 전달하지만 `onChange` 이벤트 핸들러에서 해당 상태 변수를 동기적으로 업데이트하지 않으면 React는 모든 키 입력 후 텍스트 영역을 지정한 `value`로 되돌립니다.

</Pitfall>

---

## 문제 해결 {/*troubleshooting*/}

### 텍스트 영역에 입력할 때 업데이트되지 않습니다 {/*my-text-area-doesnt-update-when-i-type-into-it*/}

`value`가 있지만 `onChange`가 없는 텍스트 영역을 렌더링하면 콘솔에 오류가 표시됩니다:

```js
// 🔴 버그: onChange 핸들러가 없는 제어된 텍스트 영역
<textarea value={something} />
```

<ConsoleBlock level="error">

`onChange` 핸들러 없이 폼 필드에 `value` prop을 제공했습니다. 이는 읽기 전용 필드를 렌더링합니다. 필드가 변경 가능해야 한다면 `defaultValue`를 사용하세요. 그렇지 않으면 `onChange` 또는 `readOnly`를 설정하세요.

</ConsoleBlock>

오류 메시지에서 제안하는 것처럼, [*초기* 값을 지정](#providing-an-initial-value-for-a-text-area)하려는 경우 `defaultValue`를 전달하세요:

```js
// ✅ 좋음: 초기 값이 있는 제어되지 않는 텍스트 영역
<textarea defaultValue={something} />
```

이 텍스트 영역을 [상태 변수로 제어](#controlling-a-text-area-with-a-state-variable)하려는 경우 `onChange` 핸들러를 지정하세요:

```js
// ✅ 좋음: onChange가 있는 제어된 텍스트 영역
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

값이 의도적으로 읽기 전용인 경우, 오류를 억제하기 위해 `readOnly` prop을 추가하세요:

```js
// ✅ 좋음: onChange 없이 읽기 전용 제어된 텍스트 영역
<textarea value={something} readOnly={true} />
```

---

### 텍스트 영역 커서가 매번 키 입력마다 시작 부분으로 이동합니다 {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

[텍스트 영역을 제어](#controlling-a-text-area-with-a-state-variable)하는 경우, `onChange` 중에 DOM의 텍스트 영역 값을 상태 변수로 업데이트해야 합니다.

`e.target.value`가 아닌 다른 값으로 업데이트할 수 없습니다:

```js
function handleChange(e) {
  // 🔴 버그: e.target.value가 아닌 다른 값으로 입력을 업데이트
  setFirstName(e.target.value.toUpperCase());
}
```

비동기적으로 업데이트할 수도 없습니다:

```js
function handleChange(e) {
  // 🔴 버그: 입력을 비동기적으로 업데이트
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

코드를 수정하려면 `e.target.value`로 동기적으로 업데이트하세요:

```js
function handleChange(e) {
  // ✅ e.target.value로 제어된 입력을 동기적으로 업데이트
  setFirstName(e.target.value);
}
```

이것이 문제를 해결하지 못하면, 텍스트 영역이 매 키 입력마다 DOM에서 제거되고 다시 추가될 가능성이 있습니다. 이는 텍스트 영역 또는 부모 중 하나가 항상 다른 `key` 속성을 받거나, 컴포넌트 정의를 중첩하는 경우(React에서는 허용되지 않으며 "내부" 컴포넌트가 매 렌더링마다 다시 마운트됨) 발생할 수 있습니다.

---

### "컴포넌트가 제어되지 않는 입력을 제어된 입력으로 변경하고 있습니다"라는 오류가 발생합니다 {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

컴포넌트에 `value`를 제공하는 경우, 수명 동안 문자열로 유지되어야 합니다.

처음에 `value={undefined}`를 전달하고 나중에 `value="some string"`을 전달할 수 없습니다. React는 컴포넌트를 제어되지 않는 상태로 유지할지 제어된 상태로 유지할지 알 수 없기 때문입니다. 제어된 컴포넌트는 항상 문자열 `value`를 받아야 하며, `null` 또는 `undefined`는 안 됩니다.

`value`가 API 또는 상태 변수에서 오는 경우, `null` 또는 `undefined`로 초기화될 수 있습니다. 이 경우, 초기에는 빈 문자열(`''`)로 설정하거나 `value={someValue ?? ''}`를 전달하여 `value`가 문자열임을 보장하세요.