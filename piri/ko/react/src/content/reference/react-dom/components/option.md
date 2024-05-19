---
title: <option>
---

<Intro>

[내장 브라우저 `<option>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option)는 [`<select>`](/reference/react-dom/components/select) 박스 안에 옵션을 렌더링할 수 있게 해줍니다.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<option>` {/*option*/}

[내장 브라우저 `<option>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option)는 [`<select>`](/reference/react-dom/components/select) 박스 안에 옵션을 렌더링할 수 있게 해줍니다.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<option>`은 모든 [공통 엘리먼트 props](/reference/react-dom/components/common#props)를 지원합니다.

추가적으로, `<option>`은 다음 props를 지원합니다:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): 불리언 값입니다. `true`인 경우, 옵션은 선택할 수 없으며 흐리게 표시됩니다.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): 문자열입니다. 옵션의 의미를 지정합니다. 지정하지 않으면 옵션 내부의 텍스트가 사용됩니다.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): 이 옵션이 선택된 경우 [폼에서 부모 `<select>`를 제출할 때 사용되는 값](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form)입니다.

#### 주의사항 {/*caveats*/}

* React는 `<option>`의 `selected` 속성을 지원하지 않습니다. 대신, 이 옵션의 `value`를 부모 [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option)로 전달하여 비제어 선택 박스를 만들거나, [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable)로 전달하여 제어된 선택 박스를 만드세요.

---

## 사용법 {/*usage*/}

### 옵션이 있는 선택 박스 표시하기 {/*displaying-a-select-box-with-options*/}

선택 박스를 표시하려면 `<option>` 컴포넌트 목록이 포함된 `<select>`를 렌더링하세요. 각 `<option>`에 폼과 함께 제출될 데이터를 나타내는 `value`를 부여하세요.

[옵션 목록이 포함된 `<select>`를 표시하는 방법에 대해 더 읽어보세요.](/reference/react-dom/components/select)

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