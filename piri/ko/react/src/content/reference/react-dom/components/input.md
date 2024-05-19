---
title: <input>
---

<Intro>

[내장 브라우저 `<input>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)를 사용하면 다양한 종류의 폼 입력을 렌더링할 수 있습니다.

```js
<input />
```

</Intro>

<InlineToc />

---

## 참고자료 {/*reference*/}

### `<input>` {/*input*/}

입력을 표시하려면 [내장 브라우저 `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) 컴포넌트를 렌더링하세요.

```js
<input name="myInput" />
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<input>`은 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

<Canary>

React의 `formAction` prop에 대한 확장은 현재 React의 Canary 및 실험 채널에서만 사용할 수 있습니다. React의 안정적인 릴리스에서는 `formAction`이 [내장 브라우저 HTML 컴포넌트](/reference/react-dom/components#all-html-components)로만 작동합니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 문자열 또는 함수. `type="submit"` 및 `type="image"`에 대해 부모 `<form action>`을 재정의합니다. URL이 `action`에 전달되면 폼은 표준 HTML 폼처럼 동작합니다. 함수가 `formAction`에 전달되면 함수가 폼 제출을 처리합니다. [`<form action>`](/reference/react-dom/components/form#props)을 참조하세요.

다음 props 중 하나를 전달하여 [입력을 제어할 수 있습니다](#controlling-an-input-with-a-state-variable):

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): 불리언. 체크박스 입력 또는 라디오 버튼의 경우 선택 여부를 제어합니다.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): 문자열. 텍스트 입력의 경우 텍스트를 제어합니다. (라디오 버튼의 경우 폼 데이터를 지정합니다.)

이들 중 하나를 전달할 때는 전달된 값을 업데이트하는 `onChange` 핸들러도 전달해야 합니다.

이 `<input>` props는 비제어 입력에만 관련이 있습니다:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): 불리언. `type="checkbox"` 및 `type="radio"` 입력의 [초기 값](#providing-an-initial-value-for-an-input)을 지정합니다.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): 문자열. 텍스트 입력의 [초기 값](#providing-an-initial-value-for-an-input)을 지정합니다.

이 `<input>` props는 비제어 및 제어 입력 모두에 관련이 있습니다:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): 문자열. `type="file"` 입력에서 허용되는 파일 형식을 지정합니다.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): 문자열. `type="image"` 입력의 대체 이미지 텍스트를 지정합니다.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): 문자열. `type="file"` 입력에서 캡처되는 미디어(마이크, 비디오 또는 카메라)를 지정합니다.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): 문자열. 가능한 [자동 완성 동작](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) 중 하나를 지정합니다.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): 불리언. `true`인 경우, React는 마운트 시 요소에 포커스를 맞춥니다.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): 문자열. 요소의 방향성을 위한 폼 필드 이름을 지정합니다.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): 불리언. `true`인 경우, 입력은 상호작용할 수 없으며 흐릿하게 표시됩니다.
* `children`: `<input>`은 자식을 허용하지 않습니다.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): 문자열. 이 입력이 속한 `<form>`의 `id`를 지정합니다. 생략된 경우 가장 가까운 부모 폼입니다.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 문자열. `type="submit"` 및 `type="image"`에 대해 부모 `<form action>`을 재정의합니다.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): 문자열. `type="submit"` 및 `type="image"`에 대해 부모 `<form enctype>`을 재정의합니다.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): 문자열. `type="submit"` 및 `type="image"`에 대해 부모 `<form method>`을 재정의합니다.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): 문자열. `type="submit"` 및 `type="image"`에 대해 부모 `<form noValidate>`을 재정의합니다.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): 문자열. `type="submit"` 및 `type="image"`에 대해 부모 `<form target>`을 재정의합니다.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): 문자열. `type="image"` 입력의 이미지 높이를 지정합니다.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): 문자열. 자동 완성 옵션이 있는 `<datalist>`의 `id`를 지정합니다.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): 숫자. 숫자 및 날짜 시간 입력의 최대 값을 지정합니다.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): 숫자. 텍스트 및 기타 입력의 최대 길이를 지정합니다.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): 숫자. 숫자 및 날짜 시간 입력의 최소 값을 지정합니다.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): 숫자. 텍스트 및 기타 입력의 최소 길이를 지정합니다.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): 불리언. `<type="file"` 및 `type="email"`에 대해 여러 값을 허용할지 여부를 지정합니다.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 문자열. [폼과 함께 제출되는](#reading-the-input-values-when-submitting-a-form) 이 입력의 이름을 지정합니다.
* `onChange`: [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. [제어된 입력](#controlling-an-input-with-a-state-variable)에 필요합니다. 사용자가 입력 값을 변경할 때마다(예: 키 입력 시마다) 즉시 실행됩니다. 브라우저의 [`input` 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)처럼 동작합니다.
* `onChangeCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onChange`의 버전입니다.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 사용자가 값을 변경할 때마다 즉시 실행됩니다. 역사적인 이유로, React에서는 `onChange`를 사용하는 것이 관례이며, 이는 유사하게 동작합니다.
* `onInputCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onInput`의 버전입니다.
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 폼 제출 시 입력이 유효성 검사를 통과하지 못하면 실행됩니다. 내장된 `invalid` 이벤트와 달리, React의 `onInvalid` 이벤트는 버블링됩니다.
* `onInvalidCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onInvalid`의 버전입니다.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. `<input>` 내부의 선택이 변경된 후 실행됩니다. React는 빈 선택 및 편집 시에도 `onSelect` 이벤트가 실행되도록 확장합니다.
* `onSelectCapture`: [캡처 단계](#capture-phase-events)에서 실행되는 `onSelect`의 버전입니다.
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): 문자열. `value`가 일치해야 하는 패턴을 지정합니다.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): 문자열. 입력 값이 비어 있을 때 흐릿한 색상으로 표시됩니다.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): 불리언. `true`인 경우, 사용자가 입력을 편집할 수 없습니다.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): 불리언. `true`인 경우, 폼을 제출하려면 값을 제공해야 합니다.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): 숫자. 너비를 설정하는 것과 유사하지만, 단위는 컨트롤에 따라 다릅니다.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): 문자열. `type="image"` 입력의 이미지 소스를 지정합니다.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): 양수 또는 `'any'` 문자열. 유효한 값 사이의 거리를 지정합니다.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): 문자열. [입력 유형](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) 중 하나입니다.
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): 문자열. `type="image"` 입력의 이미지 너비를 지정합니다.

#### 주의사항 {/*caveats*/}

- 체크박스는 `value`(또는 `defaultValue`)가 아닌 `checked`(또는 `defaultChecked`)가 필요합니다.
- 텍스트 입력이 문자열 `value` prop을 받으면 [제어된 것으로 간주됩니다.](#controlling-an-input-with-a-state-variable)
- 체크박스 또는 라디오 버튼이 불리언 `checked` prop을 받으면 [제어된 것으로 간주됩니다.](#controlling-an-input-with-a-state-variable)
- 입력은 동시에 제어되고 비제어될 수 없습니다.
- 입력은 생애 동안 제어되거나 비제어되는 상태를 전환할 수 없습니다.
- 모든 제어된 입력에는 동기적으로 백업 값을 업데이트하는 `onChange` 이벤트 핸들러가 필요합니다.

---

## 사용법 {/*usage*/}

### 다양한 유형의 입력 표시하기 {/*displaying-inputs-of-different-types*/}

입력을 표시하려면 `<input>` 컴포넌트를 렌더링하세요. 기본적으로 텍스트 입력이 됩니다. 체크박스를 위해 `type="checkbox"`를, 라디오 버튼을 위해 `type="radio"`를 전달할 수 있습니다. [또는 다른 입력 유형 중 하나를 전달할 수 있습니다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### 입력에 라벨 제공하기 {/*providing-a-label-for-an-input*/}

일반적으로, 모든 `<input>`을 [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) 태그 안에 배치합니다. 이는 브라우저에 이 라벨이 해당 입력과 연관되어 있음을 알려줍니다. 사용자가 라벨을 클릭하면 브라우저는 자동으로 입력에 포커스를 맞춥니다. 또한 접근성에도 필수적입니다: 화면 읽기 프로그램은 사용자가 연관된 입력에 포커스를 맞출 때 라벨 캡션을 발표합니다.

`<input>`을 `<label>` 안에 중첩할 수 없는 경우, 동일한 ID를 `<input id>`와 [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)에 전달하여 연관시킵니다. 여러 인스턴스 간의 충돌을 피하기 위해 [`useId`](/reference/react/useId)를 사용하여 이러한 ID를 생성합니다.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### 입력에 초기 값 제공하기 {/*providing-an-initial-value-for-an-input*/}

원하는 경우, 모든 입력에 초기 값을 지정할 수 있습니다. 텍스트 입력의 경우 `defaultValue` 문자열로 전달합니다. 체크박스와 라디오 버튼은 대신 `defaultChecked` 불리언으로 초기 값을 지정해야 합니다.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### 폼 제출 시 입력 값을 읽기 {/*reading-the-input-values-when-submitting-a-form*/}

입력 주위에 [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)를 추가하고 내부에 [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)를 넣습니다. 이는 `<form onSubmit>` 이벤트 핸들러를 호출합니다. 기본적으로 브라우저는 폼 데이터를 현재 URL로 보내고 페이지를 새로 고칩니다. `e.preventDefault()`를 호출하여 이 동작을 재정의할 수 있습니다. [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)로 폼 데이터를 읽습니다.
<Sandpack>

```js
export default function MyForm() {
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
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button      <button type="submit">Submit form</button>
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

모든 `<input>`에 `name`을 지정하세요, 예를 들어 `<input name="firstName" defaultValue="Taylor" />`. 지정한 `name`은 폼 데이터의 키로 사용됩니다, 예를 들어 `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

기본적으로, *모든* `<button>`이 `<form>` 안에 있으면 폼을 제출합니다. 이는 놀라울 수 있습니다! 자체 커스텀 `Button` React 컴포넌트가 있는 경우, `<button>` 대신 [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button)를 반환하는 것을 고려하세요. 그런 다음, 폼을 제출해야 하는 버튼에는 명시적으로 `<button type="submit">`을 사용하세요.

</Pitfall>

---

### 상태 변수로 입력 제어하기 {/*controlling-an-input-with-a-state-variable*/}

`<input />`과 같은 입력은 *비제어*입니다. [초기 값을 전달](#providing-an-initial-value-for-an-input)하더라도 `<input defaultValue="Initial text" />`, JSX는 초기 값만 지정합니다. 현재 값을 제어하지 않습니다.

**_제어된_ 입력을 렌더링하려면, `value` prop을 전달하세요 (또는 체크박스와 라디오의 경우 `checked`).** React는 전달한 `value`를 항상 입력에 강제합니다. 일반적으로, 이는 [상태 변수](/reference/react/useState)를 선언하여 수행합니다:

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // 상태 변수를 선언합니다...
  // ...
  return (
    <input
      value={firstName} // ...입력의 값을 상태 변수와 일치하도록 강제합니다...
      onChange={e => setFirstName(e.target.value)} // ...그리고 모든 편집 시 상태 변수를 업데이트합니다!
    />
  );
}
```

제어된 입력은 상태가 필요한 경우 유용합니다--예를 들어, 모든 편집 시 UI를 다시 렌더링하려는 경우:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

입력 상태를 조정하는 여러 방법을 제공하려는 경우에도 유용합니다 (예를 들어, 버튼을 클릭하여):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

제어된 컴포넌트에 전달하는 `value`는 `undefined` 또는 `null`이 아니어야 합니다. 초기 값이 비어 있어야 하는 경우 (예: `firstName` 필드), 상태 변수를 빈 문자열 (`''`)로 초기화하세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**`onChange` 없이 `value`를 전달하면 입력에 타이핑할 수 없습니다.** 입력을 제어하여 일부 `value`를 전달하면, 전달한 값을 항상 입력에 강제합니다. 따라서 상태 변수를 `value`로 전달하지만 `onChange` 이벤트 핸들러에서 해당 상태 변수를 동기적으로 업데이트하지 않으면, React는 모든 키 입력 후 입력을 지정한 `value`로 되돌립니다.

</Pitfall>

---

### 모든 키 입력 시 다시 렌더링 최적화하기 {/*optimizing-re-rendering-on-every-keystroke*/}

제어된 입력을 사용할 때, 모든 키 입력 시 상태를 설정합니다. 상태를 포함하는 컴포넌트가 큰 트리를 다시 렌더링하면 느려질 수 있습니다. 다시 렌더링 성능을 최적화하는 몇 가지 방법이 있습니다.

예를 들어, 모든 키 입력 시 모든 페이지 콘텐츠를 다시 렌더링하는 폼으로 시작한다고 가정해 보겠습니다:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

`<PageContent />`가 입력 상태에 의존하지 않으므로, 입력 상태를 별도의 컴포넌트로 이동할 수 있습니다:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

이제 `SignupForm`만 모든 키 입력 시 다시 렌더링되므로 성능이 크게 향상됩니다.

다시 렌더링을 피할 수 없는 경우 (예: `PageContent`가 검색 입력 값에 의존하는 경우), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui)를 사용하여 큰 다시 렌더링 중에도 제어된 입력을 반응형으로 유지할 수 있습니다.

---

## 문제 해결 {/*troubleshooting*/}

### 텍스트 입력이 타이핑할 때 업데이트되지 않습니다 {/*my-text-input-doesnt-update-when-i-type-into-it*/}

`value`가 있지만 `onChange`가 없는 입력을 렌더링하면 콘솔에 오류가 표시됩니다:

```js
// 🔴 버그: onChange 핸들러가 없는 제어된 텍스트 입력
<input value={something} />
```

<ConsoleBlock level="error">

`onChange` 핸들러 없이 폼 필드에 `value` prop을 제공했습니다. 이는 읽기 전용 필드를 렌더링합니다. 필드가 변경 가능해야 하는 경우 `defaultValue`를 사용하세요. 그렇지 않으면 `onChange` 또는 `readOnly`를 설정하세요.

</ConsoleBlock>

오류 메시지가 제안하는 것처럼, [*초기* 값을 지정](#providing-an-initial-value-for-an-input)하려는 경우 `defaultValue`를 전달하세요:

```js
// ✅ 좋음: 초기 값이 있는 비제어 입력
<input defaultValue={something} />
```

[상태 변수로 이 입력을 제어](#controlling-an-input-with-a-state-variable)하려는 경우, `onChange` 핸들러를 지정하세요:

```js
// ✅ 좋음: onChange가 있는 제어된 입력
<input value={something} onChange={e => setSomething(e.target.value)} />
```

값이 의도적으로 읽기 전용인 경우, 오류를 억제하기 위해 `readOnly` prop을 추가하세요:

```js
// ✅ 좋음: onChange 없이 읽기 전용 제어된 입력
<input value={something} readOnly={true} />
```

---

### 체크박스가 클릭할 때 업데이트되지 않습니다 {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

`checked`가 있지만 `onChange`가 없는 체크박스를 렌더링하면 콘솔에 오류가 표시됩니다:

```js
// 🔴 버그: onChange 핸들러가 없는 제어된 체크박스
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

`onChange` 핸들러 없이 폼 필드에 `checked` prop을 제공했습니다. 이는 읽기 전용 필드를 렌더링합니다. 필드가 변경 가능해야 하는 경우 `defaultChecked`를 사용하세요. 그렇지 않으면 `onChange` 또는 `readOnly`를 설정하세요.

</ConsoleBlock>

오류 메시지가 제안하는 것처럼, [*초기* 값을 지정](#providing-an-initial-value-for-an-input)하려는 경우 `defaultChecked`를 전달하세요:

```js
// ✅ 좋음: 초기 값이 있는 비제어 체크박스
<input type="checkbox" defaultChecked={something} />
```

[상태 변수로 이 체크박스를 제어](#controlling-an-input-with-a-state-variable)하려는 경우, `onChange` 핸들러를 지정하세요:

```js
// ✅ 좋음: onChange가 있는 제어된 체크박스
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

체크박스의 경우 `e.target.value`가 아닌 `e.target.checked`를 읽어야 합니다.

</Pitfall>

체크박스가 의도적으로 읽기 전용인 경우, 오류를 억제하기 위해 `readOnly` prop을 추가하세요:

```js
// ✅ 좋음: onChange 없이 읽기 전용 제어된 입력
<input type="checkbox" checked={something} readOnly={true} />
```

---

### 입력 커서가 모든 키 입력 시 처음으로 이동합니다 {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

[입력을 제어](#controlling-an-input-with-a-state-variable)하는 경우, `onChange` 중에 DOM에서 입력의 값으로 상태 변수를 업데이트해야 합니다.

`e.target.value` (또는 체크박스의 경우 `e.target.checked`)가 아닌 다른 값으로 업데이트할 수 없습니다:

```js
function handleChange(e) {
  // 🔴 버그: e.target.value가 아닌 다른 값으로 입력을 업데이트
  setFirstName(e.target.value.toUpperCase());
}
```

비동기적으로 업데이트할 수도 없습니다:

```js
function handleChange(e) {
  // 🔴 버그: 비동기적으로 입력을 업데이트
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

코드를 수정하려면, `e.target.value`로 동기적으로 업데이트하세요:

```js
function handleChange(e) {
  // ✅ e.target.value로 제어된 입력을 동기적으로 업데이트
  setFirstName(e.target.value);
}
```

이것이 문제를 해결하지 않으면, 입력이 모든 키 입력 시 DOM에서 제거되고 다시 추가될 가능성이 있습니다. 이는 입력 또는 부모 중 하나가 항상 다른 `key` 속성을 받거나, 컴포넌트 함수 정의를 중첩하는 경우 (지원되지 않으며 "내부" 컴포넌트가 항상 다른 트리로 간주됨) 상태를 [리셋하는 경우](/learn/preserving-and-resetting-state) 발생할 수 있습니다.

---

### 오류가 발생합니다: "컴포넌트가 비제어 입력을 제어된 입력으로 변경하고 있습니다" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

컴포넌트에 `value`를 제공하는 경우, 생애 동안 문자열로 유지되어야 합니다.

처음에 `value={undefined}`를 전달하고 나중에 `value="some string"`을 전달할 수 없습니다. React는 컴포넌트를 비제어로 유지할지 제어할지 알 수 없기 때문입니다. 제어된 컴포넌트는 항상 문자열 `value`를 받아야 하며, `null` 또는 `undefined`가 아닙니다.

`value`가 API 또는 상태 변수에서 오는 경우, `null` 또는 `undefined`로 초기화될 수 있습니다. 이 경우, 초기에는 빈 문자열 (`''`)로 설정하거나 `value={someValue ?? ''}`를 전달하여 `value`가 문자열임을 보장하세요.

마찬가지로, 체크박스에 `checked`를 전달하는 경우, 항상 불리언이어야 합니다.