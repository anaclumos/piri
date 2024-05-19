---
title: 상태로 입력에 반응하기
---

<Intro>

React는 UI를 조작하는 선언적 방법을 제공합니다. UI의 개별 요소를 직접 조작하는 대신, 컴포넌트가 가질 수 있는 다양한 상태를 설명하고 사용자 입력에 따라 이들 상태 간 전환을 수행합니다. 이는 디자이너가 UI를 생각하는 방식과 유사합니다.

</Intro>

<YouWillLearn>

* 선언적 UI 프로그래밍이 명령형 UI 프로그래밍과 어떻게 다른지
* 컴포넌트가 가질 수 있는 다양한 시각적 상태를 나열하는 방법
* 코드에서 다양한 시각적 상태 간 전환을 트리거하는 방법

</YouWillLearn>

## 선언적 UI와 명령형 UI의 비교 {/*how-declarative-ui-compares-to-imperative*/}

UI 상호작용을 설계할 때, 아마도 사용자 행동에 따라 UI가 *변화*하는 방식을 생각할 것입니다. 사용자가 답변을 제출할 수 있는 폼을 생각해 보세요:

* 폼에 무언가를 입력하면 "제출" 버튼이 **활성화됩니다.**
* "제출"을 누르면 폼과 버튼이 **비활성화되고,** 스피너가 **나타납니다.**
* 네트워크 요청이 성공하면 폼이 **숨겨지고,** "감사합니다" 메시지가 **나타납니다.**
* 네트워크 요청이 실패하면 오류 메시지가 **나타나고,** 폼이 다시 **활성화됩니다.**

**명령형 프로그래밍**에서는 위의 내용이 상호작용을 구현하는 방식과 직접적으로 일치합니다. 발생한 상황에 따라 UI를 조작하는 정확한 지침을 작성해야 합니다. 이를 다른 방식으로 생각해 보세요: 차를 타고 옆에 앉아 있는 사람에게 어디로 가야 할지 한 턴씩 지시하는 것을 상상해 보세요.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png" alt="JavaScript를 대표하는 불안해 보이는 사람이 운전하는 차에서 승객이 운전자에게 복잡한 턴 바이 턴 내비게이션을 실행하라고 명령하는 모습." />

그들은 당신이 어디로 가고 싶은지 모르고, 단지 당신의 명령을 따릅니다. (그리고 지시가 잘못되면 잘못된 장소에 도착하게 됩니다!) 이를 *명령형*이라고 부르는 이유는 스피너에서 버튼까지 각 요소에 *어떻게* UI를 업데이트할지 컴퓨터에 "명령"해야 하기 때문입니다.

이 명령형 UI 프로그래밍의 예에서는 React 없이 폼을 구축합니다. 브라우저 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)만 사용합니다:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // 네트워크 요청을 보내는 것처럼 가장합니다.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('좋은 추측이지만 틀린 답변입니다. 다시 시도해 보세요!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>도시 퀴즈</h2>
  <p>
    두 대륙에 위치한 도시는 어디인가요?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>제출</button>
  <p id="loading" style="display: none">로딩 중...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">정답입니다!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

명령형으로 UI를 조작하는 것은 고립된 예제에서는 충분히 잘 작동하지만, 더 복잡한 시스템에서는 관리하기가 기하급수적으로 어려워집니다. 이와 같은 여러 폼이 있는 페이지를 업데이트하는 것을 상상해 보세요. 새로운 UI 요소나 상호작용을 추가하려면 기존 코드를 모두 신중하게 확인하여 버그를 도입하지 않았는지 확인해야 합니다 (예: 무언가를 보여주거나 숨기는 것을 잊는 경우).

React는 이 문제를 해결하기 위해 만들어졌습니다.

React에서는 UI를 직접 조작하지 않습니다. 즉, 컴포넌트를 직접 활성화, 비활성화, 표시 또는 숨기지 않습니다. 대신 **보여주고 싶은 것을 선언**하고, React가 UI를 업데이트하는 방법을 알아냅니다. 택시에 타서 운전자에게 어디로 가고 싶은지 말하는 것과 비슷합니다. 운전자가 당신을 그곳으로 데려가는 것이며, 당신이 고려하지 않은 지름길을 알고 있을 수도 있습니다!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="React가 운전하는 차에서 승객이 특정 장소로 데려다 달라고 요청하는 모습. React가 그 방법을 알아냅니다." />

## 선언적으로 UI를 생각하기 {/*thinking-about-ui-declaratively*/}

위에서 폼을 명령형으로 구현하는 방법을 보았습니다. React에서 생각하는 방법을 더 잘 이해하기 위해, 아래에서 이 UI를 React로 다시 구현하는 과정을 살펴보겠습니다:

1. 컴포넌트의 다양한 시각적 상태를 **식별**합니다.
2. 상태 변화를 **트리거**하는 요소를 결정합니다.
3. `useState`를 사용하여 메모리에 상태를 **표현**합니다.
4. 필수적이지 않은 상태 변수를 **제거**합니다.
5. 이벤트 핸들러를 연결하여 상태를 설정합니다.

### 1단계: 컴포넌트의 다양한 시각적 상태 식별하기 {/*step-1-identify-your-components-different-visual-states*/}

컴퓨터 과학에서는 ["상태 기계"](https://en.wikipedia.org/wiki/Finite-state_machine)가 여러 "상태" 중 하나에 있다고 말할 수 있습니다. 디자이너와 함께 작업하는 경우, 다양한 "시각적 상태"에 대한 목업을 본 적이 있을 것입니다. React는 디자인과 컴퓨터 과학의 교차점에 위치하므로, 이 두 가지 아이디어가 영감의 원천이 됩니다.

먼저, 사용자가 볼 수 있는 UI의 다양한 "상태"를 시각화해야 합니다:

* **빈 상태**: 폼에 비활성화된 "제출" 버튼이 있습니다.
* **입력 중**: 폼에 활성화된 "제출" 버튼이 있습니다.
* **제출 중**: 폼이 완전히 비활성화됩니다. 스피너가 표시됩니다.
* **성공**: 폼 대신 "감사합니다" 메시지가 표시됩니다.
* **오류**: 입력 중 상태와 동일하지만 추가 오류 메시지가 있습니다.

디자이너처럼, 논리를 추가하기 전에 다양한 상태에 대한 "목업"을 만들고 싶을 것입니다. 예를 들어, 여기서는 폼의 시각적 부분만을 위한 목업입니다. 이 목업은 기본값이 `'empty'`인 `status`라는 prop에 의해 제어됩니다:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>정답입니다!</h1>
  }
  return (
    <>
      <h2>도시 퀴즈</h2>
      <p>
        공기를 식수로 바꾸는 광고판이 있는 도시는 어디인가요?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          제출
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

그 prop의 이름은 무엇이든 상관없습니다. 이름은 중요하지 않습니다. `status = 'empty'`를 `status = 'success'`로 편집하여 성공 메시지가 나타나는지 확인해 보세요. 목업을 사용하면 논리를 연결하기 전에 UI를 빠르게 반복할 수 있습니다. 여기서는 여전히 `status` prop에 의해 "제어"되는 동일한 컴포넌트의 더 완성된 프로토타입입니다:

<Sandpack>

```js
export default function Form({
  // 'submitting', 'error', 'success'로 시도해 보세요:
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>정답입니다!</h1>
  }
  return (
    <>
      <h2>도시 퀴즈</h2>
      <p>
        공기를 식수로 바꾸는 광고판이 있는 도시는 어디인가요?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          제출
        </button>
        {status === 'error' &&
          <p className="Error">
            좋은 추측이지만 틀린 답변입니다. 다시 시도해 보세요!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### 여러 시각적 상태를 한 번에 표시하기 {/*displaying-many-visual-states-at-once*/}

컴포넌트에 많은 시각적 상태가 있는 경우, 한 페이지에 모두 표시하는 것이 편리할 수 있습니다:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>폼 ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>정답입니다!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        제출
      </button>
      {status === 'error' &&
        <p className="Error">
          좋은 추측이지만 틀린 답변입니다. 다시 시도해 보세요!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

이와 같은 페이지는 종종 "라이브 스타일 가이드" 또는 "스토리북"이라고 불립니다.

</DeepDive>

### 2단계: 상태 변화를 트리거하는 요소 결정하기 {/*step-2-determine-what-triggers-those-state-changes*/}

상태 업데이트는 두 가지 종류의 입력에 응답하여 트리거할 수 있습니다:

* **인간 입력,** 예를 들어 버튼 클릭, 필드 입력, 링크 탐색.
* **컴퓨터 입력,** 예를 들어 네트워크 응답 도착, 타임아웃 완료, 이미지 로드.

<IllustrationBlock>
  <Illustration caption="인간 입력" alt="손가락." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="컴퓨터 입력" alt="1과 0." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

두 경우 모두, **UI를 업데이트하려면 [상태 변수](/learn/state-a-components-memory#anatomy-of-usestate)를 설정해야 합니다.** 개발 중인 폼의 경우, 몇 가지 다른 입력에 응답하여 상태를 변경해야 합니다:

* **텍스트 입력 변경** (인간)은 텍스트 상자가 비어 있는지 여부에 따라 *빈 상태*에서 *입력 중* 상태로 또는 그 반대로 전환해야 합니다.
* **제출 버튼 클릭** (인간)은 *제출 중* 상태로 전환해야 합니다.
* **성공적인 네트워크 응답** (컴퓨터)은 *성공* 상태로 전환해야 합니다.
* **실패한 네트워크 응답** (컴퓨터)은 일치하는 오류 메시지와 함께 *오류* 상태로 전환해야 합니다.

<Note>

인간 입력은 종종 [이벤트 핸들러](/learn/responding-to-events)를 필요로 한다는 점에 유의하세요!

</Note>

이 흐름을 시각화하는 데 도움이 되도록, 각 상태를 라벨이 붙은 원으로 그리고, 두 상태 간의 변화를 화살표로 표시해 보세요. 이 방법으로 많은 흐름을 스케치하고 구현 전에 버그를 해결할 수 있습니다.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="왼쪽에서 오른쪽으로 이동하는 5개의 노드가 있는 흐름도. 'empty'로 라벨이 붙은 첫 번째 노드는 'start typing'으로 라벨이 붙은 엣지를 통해 'typing'으로 라벨이 붙은 노드와 연결됩니다. 그 노드는 'press submit'으로 라벨이 붙은 엣지를 통해 'submitting'으로 라벨이 붙은 노드와 연결되며, 그 노드는 두 개의 엣지를 가집니다. 왼쪽 엣지는 'network error'로 라벨이 붙어 'error'로 라벨이 붙은 노드와 연결됩니다. 오른쪽 엣지는 'network success'로 라벨이 붙어 'success'로 라벨이 붙은 노드와 연결됩니다.">

폼 상태

</Diagram>

</DiagramGroup>

### 3단계: `useState`로 메모리에 상태 표현하기 {/*step-3-represent-the-state-in-memory-with-usestate*/}

다음으로, 컴포넌트의 시각적 상태를 [`useState`](/reference/react/useState)로 메모리에 표현해야 합니다. 단순함이 핵심입니다: 각 상태는 "움직이는 부분"이며, **"움직이는 부분"을 가능한 한 적게 유지하고 싶습니다.** 더 많은 복잡성은 더 많은 버그로 이어집니다!

반드시 있어야 하는 상태부터 시작하세요. 예를 들어, 입력에 대한 `answer`와 마지막 오류를 저장하기 위한 `error`가 필요합니다:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

그런 다음, 표시하려는 시각적 상태를 나타내는 상태 변수가 필요합니다. 이를 메모리에 표현하는 방법은 여러 가지가 있을 수 있으므로, 실험해 보아야 합니다.

즉시 최선의 방법을 생각해내기 어렵다면, 모든 가능한 시각적 상태가 포함되도록 충분한 상태를 추가하는 것부터 시작하세요:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

첫 번째 아이디어가 최선이 아닐 가능성이 높지만, 괜찮습니다. 상태를 리팩토링하는 것도 과정의 일부입니다!

### 4단계: 필수적이지 않은 상태 변수 제거하기 {/*step-4-remove-any-non-essential-state-variables*/}

상태 내용의 중복을 피하고 필수적인 것만 추적하고 싶습니다. 상태 구조를 리팩토링하는 데 약간의 시간을 투자하면 컴포넌트를 이해하기 쉽게 만들고, 중복을 줄이며, 의도하지 않은 의미를 피할 수 있습니다. 목표는 **메모리의 상태가 사용자가 보고 싶어하는 유효한 UI를 나타내지 않는 경우를 방지하는 것입니다.** (예를 들어, 오류 메시지를 표시하고 입력을 동시에 비활성화하면 사용자가 오류를 수정할 수 없습니다!)

상태 변수에 대해 다음과 같은 질문을 할 수 있습니다:

* **이 상태가 모순을 일으키나요?** 예를 들어, `isTyping`과 `isSubmitting`은 동시에 `true`일 수 없습니다. 모순은 상태가 충분히 제한되지 않았음을 의미합니다. 두 개의 불리언 조합은 네 가지 가능성이 있지만, 그 중 세 가지만 유효한 상태에 해당합니다. "불가능한" 상태를 제거하려면 이를 `'typing'`, `'submitting'`, 또는 `'success'` 중 하나여야 하는 `status`로 결합할 수 있습니다.
*
**같은 정보가 이미 다른 상태 변수에 있나요?** 또 다른 모순: `isEmpty`와 `isTyping`은 동시에 `true`일 수 없습니다. 이를 별도의 상태 변수로 만들면, 이들이 동기화되지 않아 버그가 발생할 위험이 있습니다. 다행히도 `isEmpty`를 제거하고 대신 `answer.length === 0`을 확인할 수 있습니다.
* **다른 상태 변수의 반전에서 동일한 정보를 얻을 수 있나요?** `isError`는 필요하지 않습니다. 대신 `error !== null`을 확인할 수 있습니다.

이 정리를 거친 후, 3개의 *필수적인* 상태 변수만 남게 됩니다 (7개에서 줄어듦):

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', 또는 'success'
```

이 상태 변수들이 필수적인 이유는, 이들 중 하나라도 제거하면 기능이 깨지기 때문입니다.

<DeepDive>

#### 리듀서를 사용하여 "불가능한" 상태 제거하기 {/*eliminating-impossible-states-with-a-reducer*/}

이 세 가지 변수는 이 폼의 상태를 나타내기에 충분합니다. 그러나 여전히 완전히 이해되지 않는 중간 상태가 있습니다. 예를 들어, `status`가 `'success'`일 때 `error`가 null이 아닌 것은 말이 되지 않습니다. 상태를 더 정확하게 모델링하려면 [리듀서로 추출할 수 있습니다.](/learn/extracting-state-logic-into-a-reducer) 리듀서는 여러 상태 변수를 단일 객체로 통합하고 관련된 모든 논리를 통합할 수 있게 해줍니다!

</DeepDive>

### 5단계: 이벤트 핸들러를 연결하여 상태 설정하기 {/*step-5-connect-the-event-handlers-to-set-state*/}

마지막으로, 상태를 업데이트하는 이벤트 핸들러를 만듭니다. 아래는 모든 이벤트 핸들러가 연결된 최종 폼입니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>정답입니다!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>도시 퀴즈</h2>
      <p>
        공기를 식수로 바꾸는 광고판이 있는 도시는 어디인가요?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          제출
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // 네트워크 요청을 보내는 것처럼 가장합니다.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('좋은 추측이지만 틀린 답변입니다. 다시 시도해 보세요!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

이 코드는 원래의 명령형 예제보다 길지만, 훨씬 덜 취약합니다. 모든 상호작용을 상태 변경으로 표현하면, 나중에 새로운 시각적 상태를 도입해도 기존 상태를 깨뜨리지 않습니다. 또한 각 상태에서 무엇을 표시할지 변경해도 상호작용 논리를 변경할 필요가 없습니다.

<Recap>

* 선언적 프로그래밍은 UI를 미세 관리하는 것(명령형) 대신 각 시각적 상태에 대한 UI를 설명하는 것을 의미합니다.
* 컴포넌트를 개발할 때:
  1. 모든 시각적 상태를 식별합니다.
  2. 상태 변화를 위한 인간 및 컴퓨터 트리거를 결정합니다.
  3. `useState`로 상태를 모델링합니다.
  4. 버그와 모순을 피하기 위해 필수적이지 않은 상태를 제거합니다.
  5. 이벤트 핸들러를 연결하여 상태를 설정합니다.

</Recap>

<Challenges>

#### CSS 클래스 추가 및 제거 {/*add-and-remove-a-css-class*/}

사진을 클릭하면 외부 `<div>`에서 `background--active` CSS 클래스를 *제거*하고, `<img>`에 `picture--active` 클래스를 *추가*하도록 만드세요. 배경을 다시 클릭하면 원래의 CSS 클래스를 복원해야 합니다.

시각적으로, 사진을 클릭하면 보라색 배경이 제거되고 사진 테두리가 강조 표시됩니다. 사진 외부를 클릭하면 배경이 강조 표시되지만 사진 테두리 강조 표시가 제거됩니다.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="인도네시아 캄풍 펠랑이의 무지개 집들"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

이 컴포넌트는 두 가지 시각적 상태를 가지고 있습니다: 이미지가 활성화된 상태와 비활성화된 상태:

* 이미지가 활성화된 상태에서는 CSS 클래스가 `background`와 `picture picture--active`입니다.
* 이미지가 비활성화된 상태에서는 CSS 클래스가 `background background--active`와 `picture`입니다.

이미지가 활성화되었는지 여부를 기억하기 위해 단일 불리언 상태 변수가 충분합니다. 원래의 작업은 CSS 클래스를 제거하거나 추가하는 것이었습니다. 그러나 React에서는 UI 요소를 *조작*하는 대신 *보여주고 싶은 것*을 *설명*해야 합니다. 따라서 현재 상태를 기반으로 두 CSS 클래스를 계산해야 합니다. 또한 [전파를 중지](/learn/responding-to-events#stopping-propagation)하여 이미지를 클릭해도 배경 클릭으로 등록되지 않도록 해야 합니다.

이미지를 클릭한 후 외부를 클릭하여 이 버전이 작동하는지 확인하세요:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="인도네시아 캄풍 펠랑이의 무지개 집들"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

또는 두 개의 별도 JSX 조각을 반환할 수도 있습니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="인도네시아 캄풍 펠랑이의 무지개 집들"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="인도네시아 캄풍 펠랑이의 무지개 집들"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

유사한 JSX 트리가 두 경우 모두 반환된다면, 이를 단일 JSX 조각으로 작성하는 것이 더 좋습니다.

</Solution>

#### 프로필 편집기 {/*profile-editor*/}

여기 plain JavaScript와 DOM으로 구현된 작은 폼이 있습니다. 그 동작을 이해하기 위해 플레이해 보세요:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    이름:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    성:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">프로필 편집</button>
  <p><i id="helloText">안녕하세요, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

이 폼은 두 가지 모드 간에 전환됩니다: 편집 모드에서는 입력 필드를 볼 수 있고, 보기 모드에서는 결과만 볼 수 있습니다. 버튼 레이블은 현재 모드에 따라 "편집"과 "저장" 사이를 전환합니다. 입력 필드를 변경하면 하단의 환영 메시지가 실시간으로 업데이트됩니다.

아래의 샌드박스에서 React로 다시 구현하는 것이 과제입니다. 편의를 위해 마크업은 이미 JSX로 변환되었지만, 원래와 같이 입력 필드를 표시하고 숨기도록 만들어야 합니다.

또한 하단의 텍스트도 업데이트되도록 해야 합니다!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        이름:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        성:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        프로필 편집
      </button>
      <p><i>안녕하세요, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

입력 값을 저장하기 위해 두 개의 상태 변수 `firstName`과 `lastName`이 필요합니다. 또한 입력 필드를 표시할지 여부를 저장하는 `isEditing` 상태 변수가 필요합니다. `fullName` 변수는 필요하지 않습니다. 왜냐하면 `firstName`과 `lastName`에서 항상 전체 이름을 계산할 수 있기 때문입니다.

마지막으로, `isEditing`에 따라 입력 필드를 표시하거나 숨기기 위해 [조건부 렌더링](/learn/conditional-rendering)을 사용해야 합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        이름:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        성:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? '저장' : '편집'} 프로필
      </button>
      <p><i>안녕하세요, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

이 솔루션을 원래의 명령형 코드와 비교해 보세요. 어떻게 다른가요?

</Solution>

#### React 없이 명령형 솔루션 리팩토링하기 {/*refactor-the-imperative-solution-without-react*/}

다음은 이전 과제에서 명령형으로 작성된 원래의 샌드박스입니다:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementBy```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    이름:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    성:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">프로필 편집</button>
  <p><i id="helloText">안녕하세요, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

React가 존재하지 않는다고 상상해 보세요. 이 코드를 리팩토링하여 논리를 덜 취약하게 만들고 React 버전과 유사하게 만들 수 있나요? 상태가 명시적이라면 어떻게 보일까요?

어디서부터 시작해야 할지 고민된다면, 아래의 스텁은 대부분의 구조를 이미 갖추고 있습니다. 여기서 시작하여 `updateDOM` 함수의 누락된 논리를 채워보세요. (필요한 경우 원래 코드를 참조하세요.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: 입력 필드 표시, 텍스트 숨기기
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: 입력 필드 숨기기, 텍스트 표시
  }
  // TODO: 텍스트 레이블 업데이트
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    이름:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    성:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">프로필 편집</button>
  <p><i id="helloText">안녕하세요, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

누락된 논리에는 입력 필드와 콘텐츠의 표시를 전환하고, 레이블을 업데이트하는 것이 포함되었습니다:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    이름:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    성:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">프로필 편집</button>
  <p><i id="helloText">안녕하세요, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

당신이 작성한 `updateDOM` 함수는 상태를 설정할 때 React가 내부적으로 수행하는 작업을 보여줍니다. (그러나 React는 마지막으로 설정된 이후 변경되지 않은 속성에 대해서는 DOM을 건드리지 않습니다.)

</Solution>

</Challenges>