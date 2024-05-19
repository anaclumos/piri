---
title: react.dev 소개
author: Dan Abramov and Rachel Nabors
date: 2023/03/16
description: 오늘 우리는 React와 그 문서의 새로운 홈인 react.dev를 출시하게 되어 매우 기쁩니다. 이 게시물에서는 새로운 사이트를 소개하고자 합니다.
---

2023년 3월 16일 [Dan Abramov](https://twitter.com/dan_abramov)와 [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Intro>

오늘 우리는 [react.dev](https://react.dev)를 출시하게 되어 매우 기쁩니다. 이는 React와 그 문서의 새로운 집입니다. 이 글에서는 새로운 사이트를 소개하고자 합니다.

</Intro>

---

## 요약 {/*tldr*/}

* 새로운 React 사이트 ([react.dev](https://react.dev))는 함수 컴포넌트와 Hooks를 사용한 현대적인 React를 가르칩니다.
* 다이어그램, 일러스트레이션, 도전 과제, 그리고 600개 이상의 새로운 인터랙티브 예제를 포함했습니다.
* 이전 React 문서 사이트는 이제 [legacy.reactjs.org](https://legacy.reactjs.org)로 이동했습니다.

## 새로운 사이트, 새로운 도메인, 새로운 홈페이지 {/*new-site-new-domain-new-homepage*/}

먼저, 약간의 정리 작업이 필요합니다.

새로운 문서의 출시를 기념하고, 더 중요한 것은 오래된 콘텐츠와 새로운 콘텐츠를 명확히 구분하기 위해, 우리는 더 짧은 [react.dev](https://react.dev) 도메인으로 이동했습니다. 이전 [reactjs.org](https://reactjs.org) 도메인은 이제 이곳으로 리디렉션됩니다.

이전 React 문서는 이제 [legacy.reactjs.org](https://legacy.reactjs.org)에 보관됩니다. 기존의 모든 링크는 자동으로 이곳으로 리디렉션되어 "웹을 깨뜨리지" 않도록 하겠지만, 레거시 사이트는 더 이상 많은 업데이트를 받지 않을 것입니다.

믿기 어렵겠지만, React는 곧 10년이 됩니다. 자바스크립트 연도로는 거의 한 세기와 같습니다! 우리는 [React 홈페이지를 새롭게 단장](https://react.dev)하여 오늘날 왜 React가 사용자 인터페이스를 만드는 데 훌륭한 방법인지 반영하고, 시작 가이드를 업데이트하여 현대적인 React 기반 프레임워크를 더 두드러지게 언급했습니다.

아직 새로운 홈페이지를 보지 않았다면, 꼭 확인해 보세요!

## Hooks를 사용한 현대적인 React에 올인하기 {/*going-all-in-on-modern-react-with-hooks*/}

2018년에 React Hooks를 출시했을 때, Hooks 문서는 독자가 클래스 컴포넌트에 익숙하다는 가정을 했습니다. 이는 커뮤니티가 Hooks를 매우 빠르게 채택하는 데 도움이 되었지만, 시간이 지나면서 오래된 문서는 새로운 독자들에게 적합하지 않았습니다. 새로운 독자들은 React를 두 번 배워야 했습니다: 한 번은 클래스 컴포넌트로, 그리고 다시 한 번은 Hooks로.

**새로운 문서는 처음부터 Hooks로 React를 가르칩니다.** 문서는 두 개의 주요 섹션으로 나뉩니다:

* **[React 배우기](/learn)**는 처음부터 React를 가르치는 자기 주도형 코스입니다.
* **[API 참조](/reference)**는 모든 React API의 세부 사항과 사용 예제를 제공합니다.

각 섹션에서 무엇을 찾을 수 있는지 자세히 살펴보겠습니다.

<Note>

아직 Hook 기반의 대체물이 없는 몇 가지 드문 클래스 컴포넌트 사용 사례가 있습니다. 클래스 컴포넌트는 여전히 지원되며, 새로운 사이트의 [레거시 API](/reference/react/legacy) 섹션에 문서화되어 있습니다.

</Note>

## 빠른 시작 {/*quick-start*/}

Learn 섹션은 [빠른 시작](/learn) 페이지로 시작합니다. 이는 React의 짧은 소개 투어입니다. 컴포넌트, props, state와 같은 개념의 문법을 소개하지만, 사용 방법에 대한 자세한 설명은 하지 않습니다.

직접 해보면서 배우는 것을 좋아한다면, 다음으로 [틱택토 튜토리얼](/learn/tutorial-tic-tac-toe)을 확인해 보시길 권장합니다. 이는 React로 작은 게임을 만드는 과정을 안내하며, 매일 사용할 기술을 가르칩니다. 다음은 여러분이 만들게 될 것입니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

우리는 또한 [Thinking in React](/learn/thinking-in-react)를 강조하고 싶습니다. 이는 많은 사람들에게 React를 "이해"하게 만든 튜토리얼입니다. **이 두 가지 클래식 튜토리얼을 함수 컴포넌트와 Hooks를 사용하도록 업데이트했습니다,** 그래서 그것들은 새 것처럼 좋습니다.

<Note>

위의 예제는 *샌드박스*입니다. 우리는 사이트 전체에 600개 이상의 샌드박스를 추가했습니다! 모든 샌드박스를 편집할 수 있으며, 오른쪽 상단의 "Fork"를 눌러 별도의 탭에서 열 수 있습니다. 샌드박스를 사용하면 React API를 빠르게 실험하고, 아이디어를 탐구하며, 이해도를 확인할 수 있습니다.

</Note>

## 단계별로 React 배우기 {/*learn-react-step-by-step*/}

우리는 전 세계 모든 사람이 스스로 무료로 React를 배울 수 있는 동등한 기회를 갖기를 바랍니다.

이 때문에 Learn 섹션은 챕터로 나뉜 자기 주도형 코스로 구성되어 있습니다. 첫 두 챕터는 React의 기본을 설명합니다. React를 처음 접하거나 기억을 새로 고치고 싶다면 여기서 시작하세요:

- **[UI 설명하기](/learn/describing-the-ui)**는 컴포넌트를 사용하여 정보를 표시하는 방법을 가르칩니다.
- **[상호작용 추가하기](/learn/adding-interactivity)**는 사용자 입력에 반응하여 화면을 업데이트하는 방법을 가르칩니다.

다음 두 챕터는 더 고급이며, 더 까다로운 부분에 대한 깊은 통찰력을 제공합니다:

- **[상태 관리하기](/learn/managing-state)**는 앱이 복잡해짐에 따라 로직을 조직하는 방법을 가르칩니다.
- **[탈출구](/learn/escape-hatches)**는 React를 "벗어나는" 방법과 언제 그렇게 하는 것이 가장 합리적인지 가르칩니다.

각 챕터는 여러 관련 페이지로 구성되어 있습니다. 대부분의 페이지는 특정 기술이나 기법을 가르칩니다—예를 들어, [JSX로 마크업 작성하기](/learn/writing-markup-with-jsx), [상태에서 객체 업데이트하기](/learn/updating-objects-in-state), 또는 [컴포넌트 간 상태 공유하기](/learn/sharing-state-between-components). 일부 페이지는 아이디어를 설명하는 데 중점을 둡니다—예를 들어, [렌더와 커밋](/learn/render-and-commit), 또는 [스냅샷으로서의 상태](/learn/state-as-a-snapshot). 그리고 몇 가지는 [Effect가 필요하지 않을 수도 있습니다](/learn/you-might-not-need-an-effect)와 같이 우리가 수년간 배운 내용을 바탕으로 제안을 공유합니다.

이 챕터들을 순서대로 읽을 필요는 없습니다. 누가 그럴 시간이 있겠습니까?! 하지만 그렇게 할 수도 있습니다. Learn 섹션의 페이지는 이전 페이지에서 소개된 개념에만 의존합니다. 책처럼 읽고 싶다면, 그렇게 하세요!

### 도전 과제로 이해도 확인하기 {/*check-your-understanding-with-challenges*/}

Learn 섹션의 대부분의 페이지는 이해도를 확인하기 위한 몇 가지 도전 과제로 끝납니다. 예를 들어, [조건부 렌더링](/learn/conditional-rendering#challenges) 페이지의 몇 가지 도전 과제는 다음과 같습니다.

지금 당장 해결할 필요는 없습니다! 정말 원하지 않는 한.

<Challenges noTitle={true}>

#### `? :`로 불완전한 항목에 아이콘 표시하기 {/*show-an-icon-for-incomplete-items-with--*/}

조건 연산자(`cond ? a : b`)를 사용하여 `isPacked`가 `true`가 아닌 경우 ❌를 렌더링하세요.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&`로 항목 중요도 표시하기 {/*show-the-item-importance-with-*/}

이 예제에서 각 `Item`은 숫자 `importance` prop을 받습니다. `&&` 연산자를 사용하여 중요도가 0이 아닌 항목에만 이탤릭체로 "_(Importance: X)_"를 렌더링하세요. 항목 목록은 다음과 같이 보여야 합니다:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

두 레이블 사이에 공백을 추가하는 것을 잊지 마세요!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

이렇게 하면 됩니다:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance > 0 && ...` 대신 `importance && ...`를 사용하면 `importance`가 `0`일 때 `0`이 결과로 렌더링되지 않도록 해야 합니다!

이 솔루션에서는 이름과 중요도 레이블 사이에 공백을 삽입하기 위해 두 개의 별도 조건을 사용합니다. 대안으로는 선행 공백이 있는 Fragment를 사용할 수 있습니다: `importance > 0 && <> <i>...</i></>` 또는 `<i>` 내부에 공백을 추가할 수 있습니다: `importance > 0 && <i> ...</i>`.

</Solution>

</Challenges>

왼쪽 하단 모서리에 있는 "Show solution" 버튼을 주목하세요. 자신을 확인하고 싶을 때 유용합니다!

### 다이어그램과 일러스트레이션으로 직관 쌓기 {/*build-an-intuition-with-diagrams-and-illustrations*/}

코드와 단어만으로 설명할 수 없는 것을 설명할 때, 우리는 직관을 제공하는 데 도움이 되는 다이어그램을 추가했습니다. 예를 들어, [상태 유지 및 재설정](/learn/preserving-and-resetting-state)에서 가져온 다이어그램 중 하나입니다:

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="세 섹션이 있는 다이어그램, 각 섹션 사이에 화살표가 있습니다. 첫 번째 섹션에는 'div'로 표시된 React 컴포넌트가 있으며, 단일 자식 'section'이 있고, 'Counter'로 표시된 단일 자식이 있으며, 'count'라는 값이 3인 상태 버블이 있습니다. 중간 섹션에는 동일한 'div' 부모가 있지만, 자식 컴포넌트가 삭제되었음을 나타내는 노란색 'proof' 이미지가 있습니다. 세 번째 섹션에는 동일한 'div' 부모가 다시 있으며, 이제 노란색으로 강조된 새로운 자식 'div'가 있으며, 'count'라는 값이 0인 상태 버블이 있는'Counter'가 있습니다.">

`section`이 `div`로 변경되면, `section`이 삭제되고 새로운 `div`가 추가됩니다.

</Diagram>

문서 전체에서 몇 가지 일러스트레이션도 볼 수 있습니다—여기 [브라우저가 화면을 그리는](/learn/render-and-commit#epilogue-browser-paint) 일러스트레이션 중 하나가 있습니다:

<Illustration alt="브라우저가 '카드 요소가 있는 정물화'를 그리는 모습." src="/images/docs/illustrations/i_browser-paint.png" />

우리는 이 묘사가 100% 과학적으로 정확하다는 것을 브라우저 벤더와 확인했습니다.

## 새로운, 상세한 API 참조 {/*a-new-detailed-api-reference*/}

[API 참조](/reference/react)에서 모든 React API는 이제 전용 페이지를 가지고 있습니다. 여기에는 모든 종류의 API가 포함됩니다:

- [`useState`](/reference/react/useState)와 같은 내장 Hooks.
- [`<Suspense>`](/reference/react/Suspense)와 같은 내장 컴포넌트.
- [`<input>`](/reference/react-dom/components/input)와 같은 내장 브라우저 컴포넌트.
- [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream)과 같은 프레임워크 지향 API.
- [`memo`](/reference/react/memo)와 같은 기타 React API.

모든 API 페이지는 최소한 두 개의 세그먼트로 나뉘어 있습니다: *참조*와 *사용법*.

[참조](/reference/react/useState#reference)는 인수와 반환 값을 나열하여 공식 API 서명을 설명합니다. 이는 간결하지만, 해당 API에 익숙하지 않다면 다소 추상적으로 느껴질 수 있습니다. 이는 API가 무엇을 하는지 설명하지만, 어떻게 사용하는지는 설명하지 않습니다.

[사용법](/reference/react/useState#usage)은 이 API를 실제로 왜 그리고 어떻게 사용하는지 보여줍니다. 이는 동료나 친구가 설명할 것처럼 보여줍니다. 이는 **React 팀이 각 API를 사용하도록 의도한 표준 시나리오를 보여줍니다.** 우리는 색상 코드가 있는 스니펫, 다양한 API를 함께 사용하는 예제, 그리고 복사하여 붙여넣을 수 있는 레시피를 추가했습니다:

<Recipes titleText="기본 useState 예제" titleId="examples-basic">

#### 카운터 (숫자) {/*counter-number*/}

이 예제에서 `count` 상태 변수는 숫자를 보유합니다. 버튼을 클릭하면 증가합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### 텍스트 필드 (문자열) {/*text-field-string*/}

이 예제에서 `text` 상태 변수는 문자열을 보유합니다. 입력할 때, `handleChange`는 브라우저 입력 DOM 요소에서 최신 입력 값을 읽고, `setText`를 호출하여 상태를 업데이트합니다. 이를 통해 현재 `text`를 아래에 표시할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 체크박스 (불리언) {/*checkbox-boolean*/}

이 예제에서 `liked` 상태 변수는 불리언을 보유합니다. 입력을 클릭하면, `setLiked`는 브라우저 체크박스 입력이 체크되었는지 여부로 `liked` 상태 변수를 업데이트합니다. `liked` 변수는 체크박스 아래의 텍스트를 렌더링하는 데 사용됩니다.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 폼 (두 개의 변수) {/*form-two-variables*/}

하나의 컴포넌트에서 두 개 이상의 상태 변수를 선언할 수 있습니다. 각 상태 변수는 완전히 독립적입니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

일부 API 페이지에는 [문제 해결](/reference/react/useEffect#troubleshooting) (일반적인 문제에 대한) 및 [대안](/reference/react-dom/findDOMNode#alternatives) (사용 중단된 API에 대한)도 포함되어 있습니다.

우리는 이 접근 방식이 API 참조를 인수를 찾는 방법뿐만 아니라 주어진 API로 할 수 있는 모든 다양한 작업과 다른 API와의 연결을 볼 수 있는 방법으로 유용하게 만들기를 바랍니다.

## 다음은 무엇인가요? {/*whats-next*/}

이것으로 우리의 작은 투어를 마칩니다! 새로운 웹사이트를 둘러보고, 좋아하는 것과 싫어하는 것을 확인하고, [이슈 트래커](https://github.com/reactjs/react.dev/issues)에서 피드백을 계속 보내주세요.

이 프로젝트가 출시되기까지 오랜 시간이 걸렸다는 것을 인정합니다. 우리는 React 커뮤니티가 자격이 있는 높은 품질 기준을 유지하고자 했습니다. 이 문서를 작성하고 모든 예제를 만드는 동안, 우리는 몇 가지 설명에서 실수를 발견하고, React에서 버그를 발견했으며, React 디자인에서 해결해야 할 간격을 발견했습니다. 우리는 새로운 문서가 앞으로 React 자체를 더 높은 기준으로 유지하는 데 도움이 되기를 바랍니다.

우리는 웹사이트의 콘텐츠와 기능을 확장하라는 많은 요청을 들었습니다. 예를 들어:

- 모든 예제에 대한 TypeScript 버전 제공;
- 업데이트된 성능, 테스트 및 접근성 가이드 작성;
- React Server Components를 지원하는 프레임워크와 독립적으로 문서화;
- 새로운 문서를 번역하기 위해 국제 커뮤니티와 협력;
- 새로운 웹사이트에 누락된 기능 추가 (예: 이 블로그에 대한 RSS).

이제 [react.dev](https://react.dev/)가 출시되었으므로, 우리는 타사 React 교육 자료를 "따라잡는" 것에서 새로운 정보 추가 및 새로운 웹사이트 개선으로 초점을 전환할 수 있을 것입니다.

React를 배우기에 이보다 더 좋은 시기는 없다고 생각합니다.

## 누가 이 작업을 했나요? {/*who-worked-on-this*/}

React 팀에서 [Rachel Nabors](https://twitter.com/rachelnabors)는 프로젝트를 이끌었고 (그리고 일러스트레이션을 제공했습니다), [Dan Abramov](https://twitter.com/dan_abramov)는 커리큘럼을 설계했습니다. 그들은 대부분의 콘텐츠를 함께 공동 저술했습니다.

물론, 이처럼 큰 프로젝트는 고립된 상태에서 이루어지지 않습니다. 우리는 감사해야 할 많은 사람들이 있습니다!

[Sylwia Vargas](https://twitter.com/SylwiaVargas)는 우리의 예제를 "foo/bar/baz"와 고양이를 넘어 과학자, 예술가, 전 세계의 도시를 특징으로 하도록 개편했습니다. [Maggie Appleton](https://twitter.com/Mappletons)은 우리의 낙서를 명확한 다이어그램 시스템으로 바꾸었습니다.

추가 글 기여에 대해 [David McCabe](https://twitter.com/mcc_abe), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), 그리고 [Matt Carroll](https://twitter.com/mattcarrollcode)에게 감사드립니다. 또한 [Natalia Tepluhina](https://twitter.com/n_tepluhina)와 [Sebastian Markbåge](https://twitter.com/sebmarkbage)에게 그들의 아이디어와 피드백에 대해 감사드립니다.

사이트 디자인에 대해 [Dan Lebowitz](https://twitter.com/lebo)에게, 샌드박스 디자인에 대해 [Razvan Gradinar](https://dribbble.com/GradinarRazvan)에게 감사드립니다.

개발 측면에서는, 프로토타입 개발에 대해 [Jared Palmer](https://twitter.com/jaredpalmer)에게 감사드립니다. UI 개발 지원에 대해 [Dane Grant](https://twitter.com/danecando)와 [Dustin Goodman](https://twitter.com/dustinsgoodman)에게 감사드립니다. 샌드박스 통합 작업에 대해 [Ives van Hoorne](https://twitter.com/CompuIves), [Alex Moldovan](https://twitter.com/alexnmoldovan), [Jasper De Moor](https://twitter.com/JasperDeMoor), 그리고 [Danilo Woznica](https://twitter.com/danilowoz)에게 감사드립니다. 색상과 세부 사항을 다듬는 작업에 대해 [Rick Hanlon](https://twitter.com/rickhanlonii)에게 감사드립니다. 사이트에 새로운 기능을 추가하고 유지 관리하는 데 도움을 준 [Harish Kumar](https://www.strek.in/)와 [Luna Ruan](https://twitter.com/lunaruan)에게 감사드립니다.

알파 및 베타 테스트 프로그램에 자발적으로 참여해 주신 분들께 큰 감사를 드립니다. 여러분의 열정과 귀중한 피드백이 이 문서를 형성하는 데 도움이 되었습니다. React Conf 2021에서 React 문서를 사용한 경험에 대해 발표한 베타 테스터 [Debbie O'Brien](https://twitter.com/debs_obrien)에게 특별히 감사드립니다.

마지막으로, 이 노력을 영감으로 삼아 주신 React 커뮤니티에 감사드립니다. 여러분이 이 일을 하는 이유이며, 새로운 문서가 여러분이 원하는 모든 사용자 인터페이스를 만들 수 있도록 돕기를 바랍니다.