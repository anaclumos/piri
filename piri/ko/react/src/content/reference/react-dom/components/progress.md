---
title: <progress>
---

<Intro>

[내장 브라우저 `<progress>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)를 사용하면 진행 표시기를 렌더링할 수 있습니다.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<progress>` {/*progress*/}

진행 표시기를 표시하려면 [내장 브라우저 `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) 컴포넌트를 렌더링하세요.

```js
<progress value={0.5} />
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*props*/}

`<progress>`는 모든 [공통 요소 props](/reference/react-dom/components/common#props)를 지원합니다.

추가적으로, `<progress>`는 다음 props를 지원합니다:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): 숫자. 최대 `value`를 지정합니다. 기본값은 `1`입니다.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): `0`에서 `max` 사이의 숫자 또는 불확정 진행을 위한 `null`. 완료된 양을 지정합니다.

---

## 사용법 {/*usage*/}

### 진행 표시기 제어하기 {/*controlling-a-progress-indicator*/}

진행 표시기를 표시하려면 `<progress>` 컴포넌트를 렌더링하세요. 지정한 `max` 값 사이의 숫자 `value`를 전달할 수 있습니다. `max` 값을 전달하지 않으면 기본값으로 `1`이 사용됩니다.

작업이 진행 중이지 않다면 `value={null}`을 전달하여 진행 표시기를 불확정 상태로 만드세요.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>