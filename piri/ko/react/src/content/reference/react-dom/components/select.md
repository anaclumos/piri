---
title: <select>
---

<Intro>

[내장 브라우저 `<select>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)를 사용하면 옵션이 있는 선택 상자를 렌더링할 수 있습니다.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<select>` {/*select*/}

선택 상자를 표시하려면 [내장 브라우저 `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) 컴포넌트를 렌더링합니다.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<select>`는 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

`value` prop을 전달하여 [선택 상자를 제어](#controlling-a-select-box-with-a-state-variable)할 수 있습니다:

* `value`: 문자열 (또는 [`multiple={true}`](#enabling-multiple-selection)인 경우 문자열 배열). 선택된 옵션을 제어합니다. 모든 값 문자열은 `<select>` 내부에 중첩된 `<option>`의 `value`와 일치해야 합니다.

`value`를 전달할 때는 전달된 값을 업데이트하는 `onChange` 핸들러도 전달해야 합니다.

`<select>`가 제어되지 않는 경우 `defaultValue` prop을 대신 전달할 수 있습니다:

* `defaultValue`: 문자열 (또는 [`multiple={true}`](#enabling-multiple-selection)인 경우 문자열 배열). [초기 선택된 옵션을 지정합니다.](#providing-an-initially-selected-option)

이 `<select>` props는 제어되지 않는 선택 상자와 제어된 선택 상자 모두에 관련이 있습니다:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): 문자열. 가능한 [자동 완성 동작](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) 중 하나를 지정합니다.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): 불리언. `true`이면 React가 마운트 시 요소에 포커스를 맞춥니다.
* `children`: `<select>`는 [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), 및 [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) 컴포넌트를 자식으로 허용합니다. 허용된 컴포넌트를 결국 렌더링하는 한, 사용자 정의 컴포넌트를 전달할 수도 있습니다. `<option>` 태그를 렌더링하는 사용자 정의 컴포넌트를 전달하는 경우, 렌더링하는 각 `<option>`에는 `value`가 있어야 합니다.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): 불리언. `true`이면 선택 상자가 상호작용할 수 없으며 흐릿하게 나타납니다.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): 문자열. 이 선택 상자가 속한 `<form>`의 `id`를 지정합니다. 생략하면 가장 가까운 부모 폼입니다.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): 불리언. `true`이면 브라우저가 [다중 선택](#enabling-multiple-selection)을 허용합니다.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): 문자열. 이 선택 상자의 이름을 지정합니다. [폼과 함께 제출됩니다.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. [제어된 선택 상자](#controlling-a-select-box-with-a-state-variable)에 필요합니다. 사용자가 다른 옵션을 선택할 때 즉시 실행됩니다. 브라우저의 [`input` 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)처럼 동작합니다.
* `onChangeCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 `onChange`의 버전입니다.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 사용자가 값을 변경할 때 즉시 실행됩니다. 역사적인 이유로, React에서는 유사하게 동작하는 `onChange`를 사용하는 것이 관례입니다.
* `onInputCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 `onInput`의 버전입니다.
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 폼 제출 시 입력이 유효성 검사를 통과하지 못하면 실행됩니다. 내장된 `invalid` 이벤트와 달리, React의 `onInvalid` 이벤트는 버블링됩니다.
* `onInvalidCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 `onInvalid`의 버전입니다.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): 불리언. `true`이면 폼을 제출하기 위해 값이 제공되어야 합니다.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): 숫자. `multiple={true}` 선택 상자의 경우, 초기 표시 항목의 선호 개수를 지정합니다.

#### Caveats {/*caveats*/}

- HTML과 달리, `<option>`에 `selected` 속성을 전달하는 것은 지원되지 않습니다. 대신, 제어되지 않는 선택 상자에는 [`<select defaultValue>`](#providing-an-initially-selected-option)를, 제어된 선택 상자에는 [`<select value>`](#controlling-a-select-box-with-a-state-variable)를 사용하세요.
- 선택 상자가 `value` prop을 받으면 [제어된 것으로 간주됩니다.](#controlling-a-select-box-with-a-state-variable)
- 선택 상자는 동시에 제어되거나 제어되지 않을 수 없습니다.
- 선택 상자는 수명 동안 제어되거나 제어되지 않는 상태로 전환할 수 없습니다.
- 모든 제어된 선택 상자는 동기적으로 백업 값을 업데이트하는 `onChange` 이벤트 핸들러가 필요합니다.

---

## Usage {/*usage*/}

### Displaying a select box with options {/*displaying-a-select-box-with-options*/}

선택 상자를 표시하려면 `<select>` 내부에 `<option>` 컴포넌트 목록을 렌더링합니다. 각 `<option>`에 폼과 함께 제출할 데이터를 나타내는 `value`를 부여합니다.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### Providing a label for a select box {/*providing-a-label-for-a-select-box*/}

일반적으로, 모든 `<select>`를 [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) 태그 안에 배치합니다. 이는 브라우저에 이 레이블이 해당 선택 상자와 연관되어 있음을 알려줍니다. 사용자가 레이블을 클릭하면 브라우저는 자동으로 선택 상자에 포커스를 맞춥니다. 또한 접근성에 필수적입니다: 화면 읽기 프로그램은 사용자가 선택 상자에 포커스를 맞출 때 레이블 캡션을 발표합니다.

`<select>`를 `<label>` 안에 중첩할 수 없는 경우, 동일한 ID를 `<select id>`와 [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)에 전달하여 연관시킵니다. 여러 인스턴스 간의 충돌을 피하기 위해 [`useId`](/reference/react/useId)를 사용하여 이러한 ID를 생성합니다.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Providing an initially selected option {/*providing-an-initially-selected-option*/}

기본적으로 브라우저는 목록의 첫 번째 `<option>`을 선택합니다. 기본적으로 다른 옵션을 선택하려면 해당 `<option>`의 `value`를 `<select>` 요소에 `defaultValue`로 전달합니다.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

HTML과 달리, 개별 `<option>`에 `selected` 속성을 전달하는 것은 지원되지 않습니다.

</Pitfall>

---

### Enabling multiple selection {/*enabling-multiple-selection*/}

사용자가 여러 옵션을 선택할 수 있도록 하려면 `<select>`에 `multiple={true}`를 전달합니다. 이 경우, 초기 선택된 옵션을 선택하려면 `defaultValue`를 배열로 지정해야 합니다.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Reading the select box value when submitting a form {/*reading-the-select-box-value-when-submitting-a-form*/}

선택 상자 주위에 [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)를 추가하고 내부에 [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)를 추가합니다. 이는 `<form onSubmit>` 이벤트 핸들러를 호출합니다. 기본적으로 브라우저는 폼 데이터를 현재 URL로 보내고 페이지를 새로 고칩니다. `e.preventDefault()`를 호출하여 해당 동작을 재정의할 수 있습니다. [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)로 폼 데이터를 읽습니다.
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
    // 브라우저가 기본적으로 하는 것처럼 URL을 생성할 수 있습니다:
    console.log(new URLSearchParams(formData).toString());
    // 평범한 객체로 작업할 수 있습니다.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) 이는 다중 선택 값을 포함하지 않습니다
    // 또는 이름-값 쌍의 배열을 얻을 수 있습니다.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

`<select>`에 `name`을 지정하세요, 예를 들어 `<select name="selectedFruit" />`. 지정한 `name`은 폼 데이터의 키로 사용됩니다, 예를 들어 `{ selectedFruit: "orange" }`.

`<select multiple={true}>`를 사용하는 경우, 폼에서 읽은 [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)는 각 선택된 값을 별도의 이름-값 쌍으로 포함합니다. 위 예제의 콘솔 로그를 자세히 살펴보세요.

</Note>

<Pitfall>

기본적으로, *모든* `<button>`은 `<form>` 내에서 폼을 제출합니다. 이는 놀라울 수 있습니다! 사용자 정의 `Button` React 컴포넌트를 사용하는 경우, [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button)를 반환하는 것을 고려하세요. 그런 다음, 폼을 제출해야 하는 버튼에는 명시적으로 `<button type="submit">`을 사용하세요.

</Pitfall>

---

### Controlling a select box with a state variable {/*controlling-a-select-box-with-a-state-variable*/}

`<select />`와 같은 선택 상자는 *제어되지 않습니다.* [초기 선택된 값을 전달](#providing-an-initially-selected-option)하더라도, 예를 들어 `<select defaultValue="orange" />`, JSX는 초기 값만 지정하며 현재 값을 지정하지 않습니다.

**_제어된_ 선택 상자를 렌더링하려면 `value` prop을 전달하세요.** React는 선택 상자가 항상 전달된 `value`를 가지도록 강제합니다. 일반적으로 선택 상자를 제어하려면 [상태 변수](/reference/react/useState)를 선언합니다:

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // 상태 변수를 선언합니다...
  // ...
  return (
    <select
      value={selectedFruit} // ...선택 상자의 값을 상태 변수와 일치하도록 강제합니다...
      onChange={e => setSelectedFruit(e.target.value)} // ...그리고 변경 시 상태 변수를 업데이트합니다!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

이는 모든 선택에 대해 UI의 일부를 다시 렌더링하려는 경우 유용합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**`onChange` 없이 `value`를 전달하면 옵션을 선택할 수 없습니다.** 선택 상자를 제어하기 위해 `value`를 전달하면, 전달된 값을 항상 가지도록 강제합니다. 따라서 상태 변수를 `value`로 전달하지만 `onChange` 이벤트 핸들러에서 해당 상태 변수를 동기적으로 업데이트하지 않으면, React는 매번 키 입력 후 선택 상자를 지정된 `value`로 되돌립니다.

HTML과 달리, 개별`<option>`에 `selected` 속성을 전달하는 것은 지원되지 않습니다.

</Pitfall>