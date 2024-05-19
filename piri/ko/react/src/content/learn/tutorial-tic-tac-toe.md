---
title: 튜토리얼: 틱택토
---

<Intro>

이 튜토리얼 동안 작은 틱택토 게임을 만들 것입니다. 이 튜토리얼은 기존의 React 지식을 가정하지 않습니다. 튜토리얼에서 배우게 될 기술들은 모든 React 앱을 구축하는 데 기본이 되며, 이를 완전히 이해하면 React에 대한 깊은 이해를 얻게 될 것입니다.

</Intro>

<Note>

이 튜토리얼은 **직접 해보면서 배우기**를 선호하고 빠르게 무언가를 만들어보고 싶은 사람들을 위해 설계되었습니다. 각 개념을 단계별로 배우는 것을 선호한다면, [UI 설명하기](/learn/describing-the-ui)부터 시작하세요.

</Note>

튜토리얼은 여러 섹션으로 나뉩니다:

- [튜토리얼 설정](#setup-for-the-tutorial)에서는 튜토리얼을 따라가기 위한 **시작점**을 제공합니다.
- [개요](#overview)에서는 React의 **기본 사항**인 컴포넌트, props, 상태를 가르칩니다.
- [게임 완성하기](#completing-the-game)에서는 React 개발에서 **가장 일반적인 기술**을 가르칩니다.
- [시간 여행 추가하기](#adding-time-travel)에서는 React의 고유한 강점에 대한 **깊은 통찰**을 제공합니다.

### 무엇을 만들고 있나요? {/*what-are-you-building*/}

이 튜토리얼에서는 React로 인터랙티브한 틱택토 게임을 만들 것입니다.

완성된 모습은 다음과 같습니다:

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

코드가 아직 이해되지 않거나 코드의 문법이 익숙하지 않더라도 걱정하지 마세요! 이 튜토리얼의 목표는 React와 그 문법을 이해하는 데 도움을 주는 것입니다.

튜토리얼을 계속하기 전에 위의 틱택토 게임을 확인해보는 것을 추천합니다. 게임 보드 오른쪽에 번호가 매겨진 목록이 있는 것을 볼 수 있습니다. 이 목록은 게임에서 발생한 모든 이동의 기록을 제공하며, 게임이 진행됨에 따라 업데이트됩니다.

완성된 틱택토 게임을 가지고 놀아본 후, 계속 스크롤하세요. 이 튜토리얼에서는 더 간단한 템플릿으로 시작할 것입니다. 다음 단계는 게임을 만들기 시작할 수 있도록 설정하는 것입니다.

## 튜토리얼 설정 {/*setup-for-the-tutorial*/}

아래의 라이브 코드 편집기에서, 오른쪽 상단의 **Fork**를 클릭하여 CodeSandbox 웹사이트에서 새 탭으로 편집기를 엽니다. CodeSandbox는 브라우저에서 코드를 작성하고 사용자가 만든 앱을 미리 볼 수 있게 해줍니다. 새 탭에는 빈 사각형과 이 튜토리얼의 시작 코드가 표시되어야 합니다.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
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

<Note>

로컬 개발 환경을 사용하여 이 튜토리얼을 따를 수도 있습니다. 이를 위해서는 다음이 필요합니다:

1. [Node.js](https://nodejs.org/en/) 설치
1. 이전에 열었던 CodeSandbox 탭에서 왼쪽 상단 버튼을 눌러 메뉴를 열고, 메뉴에서 **Download Sandbox**를 선택하여 파일의 아카이브를 로컬로 다운로드
1. 아카이브를 압축 해제한 후, 터미널을 열고 압축 해제한 디렉토리로 이동 (`cd`)
1. `npm install`로 종속성 설치
1. `npm start`를 실행하여 로컬 서버를 시작하고 브라우저에서 실행 중인 코드를 확인

막히면, 이것이 여러분을 멈추게 하지 마세요! 대신 온라인으로 따라가고 나중에 로컬 설정을 다시 시도해보세요.

</Note>

## 개요 {/*overview*/}

이제 설정이 완료되었으니, React에 대한 개요를 살펴보겠습니다!

### 시작 코드 검사하기 {/*inspecting-the-starter-code*/}

CodeSandbox에서 세 가지 주요 섹션을 볼 수 있습니다:

![시작 코드가 있는 CodeSandbox](../images/tutorial/react-starter-code-codesandbox.png)

1. `App.js`, `index.js`, `styles.css`와 `public` 폴더와 같은 파일 목록이 있는 _파일_ 섹션
1. 선택한 파일의 소스 코드를 볼 수 있는 _코드 편집기_
1. 작성한 코드가 어떻게 표시될지 볼 수 있는 _브라우저_ 섹션

_파일_ 섹션에서 `App.js` 파일이 선택되어 있어야 합니다. _코드 편집기_의 해당 파일 내용은 다음과 같아야 합니다:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_브라우저_ 섹션에는 X가 있는 사각형이 표시되어야 합니다:

![x가 채워진 사각형](../images/tutorial/x-filled-square.png)

이제 시작 코드의 파일들을 살펴보겠습니다.

#### `App.js` {/*appjs*/}

`App.js`의 코드는 _컴포넌트_를 생성합니다. React에서 컴포넌트는 사용자 인터페이스의 일부를 나타내는 재사용 가능한 코드 조각입니다. 컴포넌트는 애플리케이션의 UI 요소를 렌더링, 관리 및 업데이트하는 데 사용됩니다. 컴포넌트의 각 줄을 살펴보겠습니다:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

첫 번째 줄은 `Square`라는 함수를 정의합니다. `export` JavaScript 키워드는 이 함수를 이 파일 외부에서 접근할 수 있게 합니다. `default` 키워드는 다른 파일이 이 코드를 사용할 때 이 함수가 이 파일의 주요 함수임을 나타냅니다.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

두 번째 줄은 버튼을 반환합니다. `return` JavaScript 키워드는 그 뒤에 오는 것이 함수 호출자에게 값으로 반환됨을 의미합니다. `<button>`은 *JSX 요소*입니다. JSX 요소는 JavaScript 코드와 HTML 태그의 조합으로, 표시하고자 하는 내용을 설명합니다. `className="square"`는 CSS가 버튼을 스타일링하는 방법을 알려주는 버튼 속성 또는 *prop*입니다. `X`는 버튼 내부에 표시되는 텍스트이며 `</button>`는 JSX 요소를 닫아 이후의 내용이 버튼 내부에 배치되지 않음을 나타냅니다.

#### `styles.css` {/*stylescss*/}

CodeSandbox의 _파일_ 섹션에서 `styles.css` 파일을 클릭하세요. 이 파일은 React 앱의 스타일을 정의합니다. 첫 두 _CSS 선택자_(`*`와 `body`)는 앱의 큰 부분의 스타일을 정의하며, `.square` 선택자는 `className` 속성이 `square`로 설정된 모든 컴포넌트의 스타일을 정의합니다. 코드에서는 `App.js` 파일의 `Square` 컴포넌트의 버튼과 일치합니다.

#### `index.js` {/*indexjs*/}

CodeSandbox의 _파일_ 섹션에서 `index.js` 파일을 클릭하세요. 이 파일은 튜토리얼 동안 편집하지 않지만, `App.js` 파일에서 생성한 컴포넌트와 웹 브라우저 간의 다리 역할을 합니다.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

1-5줄은 필요한 모든 부분을 가져옵니다:

* React
* 웹 브라우저와 통신하는 React의 라이브러리 (React DOM)
* 컴포넌트의 스타일
* `App.js`에서 생성한 컴포넌트

파일의 나머지 부분은 모든 부분을 결합하고 최종 결과물을 `public` 폴더의 `index.html`에 주입합니다.

### 보드 만들기 {/*building-the-board*/}

`App.js`로 돌아가 봅시다. 여기서 나머지 튜토리얼을 진행할 것입니다.

현재 보드는 단일 사각형이지만, 9개가 필요합니다! 사각형을 복사하여 두 개의 사각형을 만들려고 하면:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

다음과 같은 오류가 발생합니다:

<ConsoleBlock level="error">

/src/App.js: 인접한 JSX 요소는 둘러싸는 태그로 감싸야 합니다. JSX Fragment `<>...</>`를 사용하고 싶으신가요?

</ConsoleBlock>

React 컴포넌트는 단일 JSX 요소를 반환해야 하며, 두 개의 인접한 JSX 요소(두 개의 버튼)처럼 여러 개의 인접한 JSX 요소를 반환할 수 없습니다. 이를 해결하기 위해 *Fragments* (`<>`와 `</>`)를 사용하여 여러 개의 인접한 JSX 요소를 감쌀 수 있습니다:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

이제 다음과 같이 표시됩니다:

![두 개의 x가 채워진 사각형](../images/tutorial/two-x-filled-squares.png)

좋아요! 이제 몇 번 더 복사하여 9개의 사각형을 추가하면...

![한 줄에 9개의 x가 채워진 사각형](../images/tutorial/nine-x-filled-squares.png)

오, 안돼요! 사각형이 모두 한 줄에 있습니다. 보드에 필요한 그리드가 아닙니다. 이를 해결하려면 `div`로 사각형을 행으로 그룹화하고 몇 가지 CSS 클래스를 추가해야 합니다. 이와 함께 각 사각형이 어디에 표시되는지 확인하기 위해 각 사각형에 번호를 부여합니다.

`App.js` 파일에서 `Square` 컴포넌트를 다음과 같이 업데이트합니다:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css`에 정의된 CSS는 `className`이 `board-row`인 div를 스타일링합니다. 이제 컴포넌트를 행으로 그룹화하고 스타일이 지정된 `div`를 사용하여 틱택토 보드를 만들었습니다:

![숫자 1부터 9까지 채워진 틱택토 보드](../images/tutorial/number-filled-board.png)

하지만 이제 문제가 있습니다. `Square`라는 이름의 컴포넌트가 더 이상 사각형이 아닙니다. 이를 `Board`로 이름을 변경하여 수정합니다:

```js {1}
export default function Board() {
  //...
}
```

이 시점에서 코드는 다음과 같아야 합니다:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
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
  border: 1
px solid #999;
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

<Note>

Psssst... 이건 타이핑하기에 너무 많아요! 이 페이지에서 코드를 복사해도 괜찮습니다. 하지만 도전해보고 싶다면, 적어도 한 번 직접 타이핑한 코드만 복사하는 것을 추천합니다.

</Note>

### props를 통해 데이터 전달하기 {/*passing-data-through-props*/}

다음으로, 사용자가 사각형을 클릭할 때 사각형의 값을 비어 있는 상태에서 "X"로 변경하고 싶습니다. 지금까지 보드를 만든 방식으로는 사각형을 9번 복사하여 각 사각형마다 코드를 작성해야 합니다! 복사 붙여넣기 대신, React의 컴포넌트 아키텍처를 사용하여 중복된 코드를 피할 수 있는 재사용 가능한 컴포넌트를 만들 수 있습니다.

먼저, `Square` 컴포넌트의 첫 번째 사각형을 정의하는 줄 (`<button className="square">1</button>`)을 새 `Square` 컴포넌트로 복사합니다:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

그런 다음 `Board` 컴포넌트를 업데이트하여 JSX 구문을 사용하여 `Square` 컴포넌트를 렌더링합니다:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

브라우저의 `div`와 달리, 직접 만든 컴포넌트 `Board`와 `Square`는 대문자로 시작해야 합니다.

한 번 살펴보세요:

![1로 채워진 보드](../images/tutorial/board-filled-with-ones.png)

오, 안돼요! 이전에 있던 숫자 사각형을 잃어버렸습니다. 이제 각 사각형이 "1"이라고 표시됩니다. 이를 수정하기 위해 부모 컴포넌트(`Board`)에서 자식(`Square`)으로 각 사각형이 가져야 할 값을 전달하는 *props*를 사용합니다.

`Square` 컴포넌트를 업데이트하여 `Board`에서 전달할 `value` prop을 읽도록 합니다:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })`는 Square 컴포넌트가 `value`라는 prop을 받을 수 있음을 나타냅니다.

이제 `value`를 "1" 대신 각 사각형 내부에 표시하고자 합니다. 다음과 같이 시도해보세요:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

이건 원하는 결과가 아닙니다:

![value로 채워진 보드](../images/tutorial/board-filled-with-value.png)

변수 `value`를 표시하고 싶었지, "value"라는 단어를 표시하고 싶지 않았습니다. JSX에서 JavaScript로 "탈출"하려면 중괄호가 필요합니다. JSX에서 `value` 주위에 중괄호를 추가합니다:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

지금은 빈 보드가 표시되어야 합니다:

![빈 보드](../images/tutorial/empty-board.png)

이는 `Board` 컴포넌트가 아직 각 `Square` 컴포넌트에 `value` prop을 전달하지 않았기 때문입니다. 이를 수정하려면 `Board` 컴포넌트가 렌더링하는 각 `Square` 컴포넌트에 `value` prop을 추가합니다:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

이제 다시 숫자로 채워진 그리드가 표시되어야 합니다:

![숫자 1부터 9까지 채워진 틱택토 보드](../images/tutorial/number-filled-board.png)

업데이트된 코드는 다음과 같습니다:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
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

### 인터랙티브 컴포넌트 만들기 {/*making-an-interactive-component*/}

`Square` 컴포넌트를 클릭할 때 "X"로 채우도록 합시다. `Square` 내부에 `handleClick`이라는 함수를 선언합니다. 그런 다음, `Square`가 반환하는 버튼 JSX 요소의 props에 `onClick`을 추가합니다:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

이제 사각형을 클릭하면, CodeSandbox의 _브라우저_ 섹션 하단의 _콘솔_ 탭에 `"clicked!"`라는 로그가 표시되어야 합니다. 사각형을 여러 번 클릭하면 `"clicked!"`가 다시 로그됩니다. 동일한 메시지의 반복된 콘솔 로그는 콘솔에 더 많은 줄을 생성하지 않습니다. 대신, 첫 번째 `"clicked!"` 로그 옆에 증가하는 카운터가 표시됩니다.

<Note>

로컬 개발 환경을 사용하여 이 튜토리얼을 따르는 경우, 브라우저의 콘솔을 열어야 합니다. 예를 들어, Chrome 브라우저를 사용하는 경우, **Shift + Ctrl + J** (Windows/Linux) 또는 **Option + ⌘ + J** (macOS) 키보드 단축키로 콘솔을 볼 수 있습니다.

</Note>

다음 단계로, `Square` 컴포넌트가 클릭된 것을 "기억"하고 "X" 마크로 채우도록 합니다. 컴포넌트는 *상태*를 사용하여 무언가를 "기억"합니다.

React는 컴포넌트에서 호출할 수 있는 `useState`라는 특별한 함수를 제공하여 무언가를 "기억"할 수 있게 합니다. `Square`의 현재 값을 상태에 저장하고, `Square`가 클릭될 때 이를 변경합니다.

파일 상단에 `useState`를 가져옵니다. `Square` 컴포넌트에서 `value` prop을 제거합니다. 대신, `Square`의 시작 부분에 `useState`를 호출하는 새 줄을 추가합니다. 상태 변수 `value`를 반환하도록 합니다:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value`는 값을 저장하고 `setValue`는 값을 변경할 수 있는 함수입니다. `useState`에 전달된 `null`은 이 상태 변수의 초기 값으로 사용되므로, 여기서 `value`는 처음에 `null`과 같습니다.

이제 `Square` 컴포넌트는 더 이상 props를 받지 않으므로, `Board` 컴포넌트가 생성하는 9개의 `Square` 컴포넌트에서 `value` prop을 제거합니다:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

이제 `Square`를 클릭할 때 "X"를 표시하도록 변경합니다. `console.log("clicked!");` 이벤트 핸들러를 `setValue('X');`로 대체합니다. 이제 `Square` 컴포넌트는 다음과 같습니다:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

이 `set` 함수를 `onClick` 핸들러에서 호출함으로써, `<button>`이 클릭될 때마다 React가 해당 `Square`를 다시 렌더링하도록 지시합니다. 업데이트 후, `Square`의 `value`는 `'X'`가 되므로 게임 보드에 "X"가 표시됩니다. 사각형을 클릭하면 "X"가 표시됩니다:

![보드에 x 추가](../images/tutorial/tictac-adding-x-s.gif)

각 `Square`는 자체 상태를 가지고 있습니다: 각 `Square`에 저장된 `value`는 다른 `Square`와 완전히 독립적입니다. 컴포넌트에서 `set` 함수를 호출하면 React는 자식 컴포넌트도 자동으로 업데이트합니다.

위의 변경 사항을 적용한 후, 코드는 다음과 같습니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
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

### React Developer Tools {/*react-developer-tools*/}

React DevTools를 사용하면 React 컴포넌트의 props와 상태를 확인할 수 있습니다. CodeSandbox의 _브라우저_ 섹션 하단에서 React DevTools 탭을 찾을 수 있습니다:

![CodeSandbox의 React DevTools](../images/tutorial/codesandbox-devtools.png)

화면의 특정 컴포넌트를 검사하려면 React DevTools의 왼쪽 상단 버튼을 사용하세요:

![React DevTools로 페이지의 컴포넌트 선택](../images/tutorial/devtools-select.gif)

<Note>

로컬 개발 환경에서는 React DevTools가 [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) 브라우저 확장 프로그램으로 제공됩니다. 설치하면, React를 사용하는 사이트의 브라우저 개발자 도구에 *Components* 탭이 나타납니다.

</Note>

## 게임 완성하기 {/*completing-the-game*/}

이 시점에서 틱택토 게임의 기본 빌딩 블록을 모두 갖추었습니다. 이제 완전한 게임을 만들기 위해 "X"와 "O"를 번갈아 가며 보드에 놓고, 승자를 결정하는 방법이 필요합니다.

### 상태 올리기 {/*lifting-state-up*/}

현재 각 `Square` 컴포넌트는 게임 상태의 일부를 유지합니다. 틱택토 게임에서 승자를 확인하려면 `Board`가 9개의 `Square` 컴포넌트 각각의 상태를 알아야 합니다.

어떻게 접근할 수 있을까요? 처음에는 `Board`가 각 `Square`에게 해당 `Square`의 상태를 "물어봐야" 한다고 생각할 수 있습니다. 이 접근 방식은 React에서 기술적으로 가능하지만, 코드를 이해하기 어렵고, 버그가 발생하기 쉽고, 리팩토링하기 어렵기 때문에 권장하지 않습니다. 대신, 게임의 상태를 각 `Square`가 아닌 부모 `Board` 컴포넌트에 저장하는 것이 가장 좋습니다. `Board` 컴포넌트는 각 `Square`에게 props를 통해 무엇을 표시할지 알려줄 수 있습니다.

**여러 자식으로부터 데이터를 수집하거나 두 자식 컴포넌트가 서로 통신하도록 하려면, 부모 컴포넌트에 공유 상태를 선언합니다. 부모 컴포넌트는 그 상태를 다시 자식에게 props를 통해 전달할 수 있습니다. 이렇게 하면 자식 컴포넌트가 서로 및 부모와 동기화 상태를 유지할 수 있습니다.**

상태를 부모 컴포넌트로 올리는 것은 React 컴포넌트를 리팩토링할 때 일반적입니다.

이 기회를 이용해 시도해 봅시다. `Board` 컴포넌트가 9개의 `null`로 구성된 배열로 기본값을 설정하는 `squares`라는 상태 변수를 선언하도록 편집합니다:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)`은 9개의 요소가 있는 배열을 생성하고 각 요소를 `null`로 설정합니다. 이를 둘러싼 `useState()` 호출은 처음에 해당 배열로 설정된 `squares` 상태 변수를 선언합니다. 배열의 각 항목은 사각형의 값을 나타냅니다. 나중에 보드를 채울 때, `squares` 배열은 다음과 같이 보일 것입니다:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

이제 `Board` 컴포넌트는 렌더링하는 각 `Square` 컴포넌트에 `value` prop을 전달해야 합니다:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value
={squares[8]} />
      </div>
    </>
  );
}
```

다음으로, `Square` 컴포넌트를 편집하여 `Board` 컴포넌트에서 `value` prop을 받도록 합니다. 이를 위해 `Square` 컴포넌트의 `value` 상태 추적을 제거하고 버튼의 `onClick` prop을 제거합니다:

```js {1,2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

이 시점에서 빈 틱택토 보드가 표시되어야 합니다:

![빈 보드](../images/tutorial/empty-board.png)

그리고 코드는 다음과 같아야 합니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
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

각 `Square`는 이제 `Board` 컴포넌트에서 전달받은 `value` prop을 받게 됩니다. 이 값은 `'X'`, `'O'`, 또는 빈 사각형을 나타내는 `null`일 수 있습니다.

다음으로, `Square`가 클릭될 때 어떤 일이 발생하는지 변경해야 합니다. 이제 `Board` 컴포넌트가 어떤 사각형이 채워졌는지 유지합니다. `Square`가 `Board`의 상태를 업데이트할 수 있는 방법을 만들어야 합니다. 상태는 이를 정의한 컴포넌트에만 비공개이므로, `Square`에서 직접 `Board`의 상태를 업데이트할 수 없습니다.

대신, `Board` 컴포넌트에서 `Square` 컴포넌트로 함수를 전달하고, `Square`가 클릭될 때 그 함수를 호출하도록 합니다. 먼저 `Square` 컴포넌트가 클릭될 때 호출할 함수를 만듭니다. 이 함수를 `onSquareClick`이라고 부릅니다:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

다음으로, `Square` 컴포넌트의 props에 `onSquareClick` 함수를 추가합니다:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

이제 `onSquareClick` prop을 `Board` 컴포넌트의 `handleClick` 함수에 연결합니다. 첫 번째 `Square` 컴포넌트의 `onSquareClick` prop에 함수를 전달하여 `handleClick`을 호출합니다:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

마지막으로, `Board` 컴포넌트 내부에 `handleClick` 함수를 정의하여 보드의 상태를 유지하는 `squares` 배열을 업데이트합니다:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

`handleClick` 함수는 JavaScript `slice()` 배열 메서드를 사용하여 `squares` 배열의 복사본(`nextSquares`)을 만듭니다. 그런 다음, `handleClick`은 `nextSquares` 배열을 업데이트하여 첫 번째(`[0]` 인덱스) 사각형에 `X`를 추가합니다.

`setSquares` 함수를 호출하면 컴포넌트의 상태가 변경되었음을 React에 알립니다. 이는 `squares` 상태를 사용하는 컴포넌트(`Board`)와 자식 컴포넌트(`보드를 구성하는 `Square` 컴포넌트)를 다시 렌더링합니다.

<Note>

JavaScript는 [클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)를 지원하므로, 내부 함수(예: `handleClick`)는 외부 함수(예: `Board`)에 정의된 변수와 함수에 접근할 수 있습니다. `handleClick` 함수는 `Board` 함수 내부에 정의된 `squares` 상태를 읽고 `setSquares` 메서드를 호출할 수 있습니다.

</Note>

이제 보드의 왼쪽 상단 사각형에 X를 추가할 수 있습니다. 하지만 현재 `handleClick` 함수는 왼쪽 상단 사각형의 인덱스(`0`)를 하드코딩하여 업데이트합니다. `handleClick`이 모든 사각형을 업데이트할 수 있도록 업데이트합니다. `handleClick` 함수에 사각형의 인덱스를 받는 `i` 인수를 추가합니다:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

다음으로, `handleClick`에 `i`를 전달해야 합니다. JSX에서 직접 `handleClick(0)`을 설정하려고 하면 작동하지 않습니다:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

이것이 작동하지 않는 이유는 `handleClick(0)` 호출이 보드 컴포넌트의 렌더링의 일부가 되기 때문입니다. `handleClick(0)`은 `setSquares`를 호출하여 보드 컴포넌트의 상태를 변경하므로, 전체 보드 컴포넌트가 다시 렌더링됩니다. 하지만 이는 `handleClick(0)`을 다시 실행하게 되어 무한 루프가 발생합니다:

<ConsoleBlock level="error">

너무 많은 재렌더링. React는 무한 루프를 방지하기 위해 렌더링 횟수를 제한합니다.

</ConsoleBlock>

이전에는 왜 이런 문제가 발생하지 않았을까요?

`onSquareClick={handleClick}`을 전달할 때, `handleClick` 함수를 prop으로 전달하고 있었습니다. 호출하지 않았습니다! 하지만 이제 `handleClick` 함수를 바로 호출하고 있습니다--`handleClick(0)`의 괄호를 주목하세요--그래서 너무 일찍 실행됩니다. 사용자가 클릭할 때까지 `handleClick`을 호출하지 않기를 원합니다!

이를 해결하기 위해 `handleFirstSquareClick`이라는 함수를 만들어 `handleClick(0)`을 호출하고, `handleSecondSquareClick`이라는 함수를 만들어 `handleClick(1)`을 호출하는 등의 방법을 사용할 수 있습니다. 이러한 함수를 prop으로 전달하여 `onSquareClick={handleFirstSquareClick}`와 같이 사용할 수 있습니다. 이는 무한 루프를 해결할 것입니다.

하지만 9개의 다른 함수를 정의하고 각각에 이름을 지정하는 것은 너무 번거롭습니다. 대신 다음과 같이 합니다:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

새로운 `() =>` 구문을 주목하세요. 여기서 `() => handleClick(0)`은 *화살표 함수*로, 함수를 정의하는 더 짧은 방법입니다. 사각형이 클릭되면 `=>` "화살표" 뒤의 코드가 실행되어 `handleClick(0)`을 호출합니다.

이제 다른 8개의 사각형을 업데이트하여 `handleClick`을 호출하는 화살표 함수를 전달합니다. 각 `handleClick` 호출의 인수가 올바른 사각형의 인덱스와 일치하는지 확인합니다:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
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
};
```

이제 보드의 모든 사각형에 X를 추가할 수 있습니다:

![보드에 x 추가](../images/tutorial/tictac-adding-x-s.gif)

하지만 이번에는 모든 상태 관리를 `Board` 컴포넌트가 처리합니다!

코드는 다음과 같아야 합니다:

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

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
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

이제 상태 처리가 `Board` 컴포넌트에 있습니다. 부모 `Board` 컴포넌트는 자식 `Square` 컴포넌트에 props를 전달하여 올바르게 표시되도록 합니다. `Square`를 클릭하면 자식 `Square` 컴포넌트는 이제 부모 `Board` 컴포넌트에 보드의 상태를 업데이트하도록 요청합니다. `Board`의 상태가 변경되면 `Board` 컴포넌트와 모든 자식 `Square`가 자동으로 다시 렌더링됩니다. 모든 사각형의 상태를 `Board` 컴포넌트에 유지하면 나중에 승자를 결정할 수 있습니다.

사용자가 보드의 왼쪽 상단 사각형을 클릭하여 X를 추가할 때 어떤 일이 발생하는지 요약해 봅시다:

1. 왼쪽 상단 사각형을 클릭하면 `button`이 `Square`로부터 받은 `onClick` prop의 함수가 실행됩니다. `Square` 컴포넌트는 `Board`로부터 `onSquareClick` prop으로 그 함수를 받았습니다. `Board` 컴포넌트는 JSX에서 직접 그 함수를 정의했습니다. 이는 `handleClick`을 인수 `0`으로 호출합니다.
1. `handleClick`은 인수(`0`)를 사용하여 첫 번째 요소를 `null`에서 `X`로 업데이트합니다.
1. `Board` 컴포넌트의 `squares` 상태가 업데이트되었으므로, `Board`와 모든 자식이 다시 렌더링됩니다. 이는 인덱스 `0`의 `Square` 컴포넌트의 `value` prop이 `null`에서 `X`로 변경되도록 합니다.

결국 사용자는 클릭 후 왼쪽 상단 사각형이 비어 있는 상태에서 `X`로 변경된 것을 보게 됩니다.

<Note>

DOM `<button>` 요소의 `onClick` 속성은 React에게 특별한 의미를 가집니다. 이는 내장된 컴포넌트이기 때문입니다. `Square`와 같은 사용자 정의 컴포넌트의 경우, 이름 지정은 여러분에게 달려 있습니다. `Square`의 `onSquareClick` prop이나 `Board`의 `handleClick` 함수에 어떤 이름을 주어도 코드가 동일하게 작동합니다. React에서는 이벤트를 나타내는 props에 `onSomething` 이름을 사용하고, 이벤트를 처리하는 함수 정의에 `handleSomething`을 사용하는 것이 관례입니다.

</Note>

### 불변성이 중요한 이유 {/*why-immutability-is-important*/}

`handleClick`에서 `.slice()`를 호출하여 `squares` 배열의 복사본을 만드는 방법을 주목하세요. 이를 설명하기 위해 불변성과 불변성을 배우는 것이 중요한 이유를 논의해야 합니다.

데이터를 변경하는 데는 일반적으로 두 가지 접근 방식이 있습니다. 첫 번째 접근 방식은 데이터의 값을 직접 변경하여 _변경_하는 것입니다. 두 번째 접근 방식은 원하는 변경 사항이 있는 새 복사본으로 데이터를 대체하는 것입니다. `squares` 배열을 변경하는 경우는 다음과 같습니다:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// 이제 `squares`는 ["X", null, null, null, null, null, null, null, null]입니다.
```

그리고 `squares` 배열을 변경하지 않고 데이터를 변경하는 경우는 다음과 같습니다:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// 이제 `squares`는 변경되지 않았지만, `nextSquares`의 첫 번째 요소는 `null`이 아닌 'X'입니다.
```

결과는 동일하지만, 직접 데이터를 변경하지 않음으로써 여러 가지 이점을 얻을 수 있습니다.

불변성은 복잡한 기능을 구현하는 것을 훨씬 쉽게 만듭니다. 이 튜토리얼의 나중에 "시간 여행" 기능을 구현하여 게임의 역사를 검토하고 과거의 이동으로 "돌아갈" 수 있게 할 것입니다. 이 기능은 게임에만 국한되지 않습니다--일부 작업을 실행 취소하고 다시 실행할 수 있는 기능은 앱의 일반적인 요구 사항입니다. 직접 데이터 변경을 피하면 이전 버전의 데이터를 그대로 유지하고 나중에 다시 사용할 수 있습니다.

불변성에는 또 다른 이점이 있습니다. 기본적으로 부모 컴포넌트의 상태가 변경되면 모든 자식 컴포넌트가 자동으로 다시 렌더링됩니다. 이는 변경에 영향을 받지 않은 자식 컴포넌트도 포함됩니다. 다시 렌더링은 사용자에게 눈에 띄지 않지만(이를 적극적으로 피하려고 하지 마세요!), 성능상의 이유로 명
확실히 영향을 받지 않은 트리의 일부를 다시 렌더링하지 않으려 할 수 있습니다. 불변성은 컴포넌트가 데이터가 변경되었는지 여부를 비교하는 것을 매우 저렴하게 만듭니다. React가 컴포넌트를 언제 다시 렌더링할지 선택하는 방법에 대해 더 알고 싶다면 [memo API 참조](/reference/react/memo)를 확인하세요.

### 턴을 번갈아 가며 진행하기 {/*taking-turns*/}

이제 틱택토 게임의 주요 결함을 수정할 때입니다: "O"를 보드에 표시할 수 없습니다.

기본적으로 첫 번째 이동을 "X"로 설정합니다. 이를 추적하기 위해 `Board` 컴포넌트에 또 다른 상태를 추가합니다:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

각 플레이어가 이동할 때마다 `xIsNext`(불리언 값)가 전환되어 다음 플레이어가 누구인지 결정하고 게임의 상태가 저장됩니다. `Board`의 `handleClick` 함수를 업데이트하여 `xIsNext` 값을 전환합니다:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

이제 다른 사각형을 클릭할 때마다 `X`와 `O`가 번갈아 가며 표시됩니다!

하지만 문제가 있습니다. 동일한 사각형을 여러 번 클릭해 보세요:

![O가 X를 덮어씀](../images/tutorial/o-replaces-x.gif)

`X`가 `O`로 덮어씌워집니다! 이는 게임에 매우 흥미로운 변화를 추가할 수 있지만, 지금은 원래 규칙을 따르겠습니다.

사각형에 `X` 또는 `O`를 표시할 때 먼저 사각형에 이미 `X` 또는 `O` 값이 있는지 확인하지 않습니다. 이를 수정하려면 *일찍 반환*합니다. 사각형에 이미 `X` 또는 `O`가 있는지 확인합니다. 사각형이 이미 채워져 있으면 `handleClick` 함수에서 일찍 `return`합니다--보드 상태를 업데이트하기 전에.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

이제 빈 사각형에만 `X` 또는 `O`를 추가할 수 있습니다! 이 시점에서 코드는 다음과 같아야 합니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
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

### 승자 선언하기 {/*declaring-a-winner*/}

이제 플레이어가 턴을 번갈아 가며 진행할 수 있으므로, 게임이 끝났을 때와 더 이상 턴을 진행할 수 없을 때를 표시하고자 합니다. 이를 위해 `calculateWinner`라는 헬퍼 함수를 추가하여 9개의 사각형 배열을 받아 승자를 확인하고 적절하게 `'X'`, `'O'`, 또는 `null`을 반환합니다. `calculateWinner` 함수는 React에 특화된 것이 아니므로 너무 걱정하지 마세요:

```js src/App.js
export default function Board() {
  //...
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
    [2, 4, 6]
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

<Note>

`calculateWinner`를 `Board` 앞이나 뒤에 정의해도 상관없습니다. 매번 컴포넌트를 편집할 때 스크롤할 필요가 없도록 끝에 두겠습니다.

</Note>

`Board` 컴포넌트의 `handleClick` 함수에서 `calculateWinner(squares)`를 호출하여 플레이어가 승리했는지 확인합니다. 사용자가 이미 `X` 또는 `O`가 있는 사각형을 클릭했는지 확인할 때와 동시에 이 확인을 수행할 수 있습니다. 두 경우 모두 일찍 반환하고자 합니다:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

게임이 끝났을 때 플레이어에게 알리기 위해 "Winner: X" 또는 "Winner: O"와 같은 텍스트를 표시할 수 있습니다. 이를 위해 `Board` 컴포넌트에 `status` 섹션을 추가합니다. 게임이 끝났을 때 승자를 표시하고, 게임이 진행 중일 때는 다음 플레이어의 턴을 표시합니다:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

축하합니다! 이제 작동하는 틱택토 게임이 있습니다. 그리고 React의 기본 사항도 배웠습니다. 그래서 _여러분_이 진정한 승자입니다. 코드는 다음과 같습니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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

## 시간 여행 추가하기 {/*adding-time-travel*/}

마지막 연습으로, 게임의 이전 이동으로 "돌아갈" 수 있는 기능을 추가해 봅시다.

### 이동 기록 저장하기 {/*storing-a-history-of-moves*/}

`squares` 배열을 변경했다면, 시간 여행을 구현하는 것은 매우 어려웠을 것입니다.

하지만, 각 이동 후 `squares` 배열의 새 복사본을 만들고 이를 불변으로 취급했습니다. 이를 통해 모든 과거 버전의 `squares` 배열을 저장하고 이미 발생한 이동 간에 탐색할 수 있습니다.

이전 `squares` 배열을 `history`라는 또 다른 배열에 저장합니다. 이 배열은 새 상태 변수로 저장됩니다. `history` 배열은 첫 번째 이동부터 마지막 이동까지 모든 보드 상태를 나타내며 다음과 같은 모양을 가집니다:

```jsx
[
  // 첫 번째 이동 전
  [null, null, null, null, null, null, null, null, null],
  // 첫 번째 이동 후
  [null, null, null, null, 'X', null, null, null, null],
  // 두 번째 이동 후
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### 상태 올리기, 다시 {/*lifting-state-up-again*/}

이제 과거 이동 목록을 표시하는 새 최상위 컴포넌트 `Game`을 작성합니다. 여기서 `history` 상태를 배치하여 전체 게임 기록을 포함합니다.

`history` 상태를 `Game` 컴포넌트에 배치하면 `squares` 상태를 자식 `Board` 컴포넌트에서 제거할 수 있습니다. `Square` 컴포넌트에서 `Board`로 "상태를 올린" 것처럼, 이제 이를 최상위 `Game` 컴포넌트로 올립니다. 이를 통해 `Game` 컴포넌트가 `Board`의 데이터를 완전히 제어하고 `history`의 이전 턴을 렌더링하도록 `Board`에 지시할 수 있습니다.

먼저, `export default`와 함께 `Game` 컴포넌트를 추가합니다. `Board` 컴포넌트와 일부 마크업을 렌더링합니다:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

`function Board() {` 선언 앞의 `export default` 키워드를 제거하고 `function Game() {` 선언 앞에 추가합니다. 이는 `index.js` 파일에 `Board` 컴포넌트 대신 최상위 컴포넌트로 `Game` 컴포넌트를 사용하도록 지시합니다. `Game` 컴포넌트가 반환하는 추가 `div`는 나중에 보드에 추가할 게임 정보를 위한 공간을 만듭니다.

`Game` 컴포넌트에 다음 플레이어와 이동 기록을 추적하는 상태를 추가합니다:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

`[Array(9).fill(null)]`은 9개의 `null`이 있는 단일 항목 배열입니다.

현재 이동의 사각형을 렌더링하려면 `history`의 마지막 사각형 배열을 읽어야 합니다. 이를 위해 `useState`가 필요하지 않습니다--렌더링 중에 이를 계산할 충분한 정보가 있습니다:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

다음으로, `Game` 컴포넌트 내부에 `handlePlay` 함수를 만들어 `Board` 컴포넌트가 게임을 업데이트할 수 있도록 합니다. `xIsNext`, `currentSquares` 및 `handlePlay`를 props로 `Board` 컴포넌트에 전달합니다:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

`Board` 컴포넌트를 전달받은 props로 완전히 제어되도록 만듭니다. `Board` 컴포넌트를 `xIsNext`, `squares`, 및 플레이어가 이동할 때 업데이트된 사각형 배열을 `onPlay` 함수로 호출할 수 있는 새 `onPlay` 함수의 세 가지 props를 받도록 변경합니다. 그런 다음 `useState`를 호출하는 `Board` 함수의 첫 두 줄을 제거합니다:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
   
//...
  }
  // ...
}
```

이제 `Board` 컴포넌트의 `handleClick` 함수에서 `setSquares`와 `setXIsNext` 호출을 제거하고, 업데이트된 사각형 배열을 `onPlay` 함수로 전달하는 단일 호출로 대체합니다. 이를 통해 사용자가 사각형을 클릭할 때 `Game` 컴포넌트가 `Board`를 업데이트할 수 있습니다:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

이제 `Board` 컴포넌트는 `Game` 컴포넌트에서 전달받은 props에 의해 완전히 제어됩니다. 게임이 다시 작동하도록 `Game` 컴포넌트의 `handlePlay` 함수를 구현해야 합니다.

`handlePlay`가 호출될 때 무엇을 해야 할까요? `Board`는 업데이트된 배열로 `setSquares`를 호출했지만, 이제는 업데이트된 `squares` 배열을 `onPlay`로 전달합니다.

`handlePlay` 함수는 `Game`의 상태를 업데이트하여 다시 렌더링을 트리거해야 하지만, 더 이상 `setSquares` 함수를 호출할 수 없습니다--이제 `history` 상태 변수를 사용하여 이 정보를 저장합니다. `history`를 업데이트하여 업데이트된 `squares` 배열을 새 기록 항목으로 추가하고자 합니다. 또한 `xIsNext`를 전환해야 합니다.

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

여기서 `[...history, nextSquares]`는 `history`의 모든 항목 뒤에 `nextSquares`가 있는 새 배열을 만듭니다. (`...history` [*spread syntax*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)를 "history의 모든 항목을 나열"로 읽을 수 있습니다.)

예를 들어, `history`가 `[[null,null,null], ["X",null,null]]`이고 `nextSquares`가 `["X",null,"O"]`인 경우, 새 `[...history, nextSquares]` 배열은 `[[null,null,null], ["X",null,null], ["X",null,"O"]]`가 됩니다.

이 시점에서 상태를 `Game` 컴포넌트로 이동했으며, UI는 리팩토링 전과 동일하게 완전히 작동해야 합니다. 코드는 다음과 같아야 합니다:

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

### 과거 이동 표시하기 {/*showing-the-past-moves*/}

틱택토 게임의 기록을 저장하고 있으므로, 이제 플레이어에게 과거 이동 목록을 표시할 수 있습니다.

`<button>`과 같은 React 요소는 일반 JavaScript 객체입니다. 애플리케이션에서 이를 전달할 수 있습니다. React에서 여러 항목을 렌더링하려면 React 요소 배열을 사용할 수 있습니다.

이미 상태에 `history` 이동 배열이 있으므로, 이를 React 요소 배열로 변환해야 합니다. JavaScript에서 배열을 다른 배열로 변환하려면 [array `map` 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)를 사용할 수 있습니다:

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

`history`의 이동을 React 요소로 변환하여 화면에 버튼 목록을 표시하고, 과거 이동으로 "점프"할 수 있는 버튼 목록을 표시합니다. `Game` 컴포넌트에서 `history`를 `map`으로 변환합니다:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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
```

코드는 다음과 같아야 합니다. 개발자 도구 콘솔에 다음과 같은 오류가 표시되어야 합니다:

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>

다음 섹션에서 이 오류를 수정할 것입니다.

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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

`map`에 전달한 함수 내부에서 `history` 배열을 반복할 때, `squares` 인수는 `history`의 각 요소를 순회하고, `move` 인수는 각 배열 인덱스를 순회합니다: `0`, `1`, `2`, …. (대부분의 경우 실제 배열 요소가 필요하지만, 이동 목록을 렌더링하려면 인덱스만 필요합니다.)

틱택토 게임의 기록에서 각 이동에 대해, 버튼 `<button>`이 포함된 목록 항목 `<li>`를 생성합니다. 버튼에는 `jumpTo`라는 함수를 호출하는 `onClick` 핸들러가 있습니다(아직 구현하지 않았습니다).

현재는 게임에서 발생한 이동 목록과 개발자 도구 콘솔에 오류가 표시되어야 합니다. "key" 오류가 무엇을 의미하는지 논의해 봅시다.

### 키 선택하기 {/*picking-a-key*/}

목록을 렌더링할 때, React는 각 렌더링된 목록 항목에 대한 정보를 저장합니다. 목록을 업데이트할 때, React는 무엇이 변경되었는지 결정해야 합니다. 항목을 추가, 제거, 재정렬 또는 업데이트할 수 있습니다.

다음에서

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

다음으로 전환한다고 상상해 보세요:

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

업데이트된 카운트 외에도, 이를 읽는 사람은 Alexa와 Ben의 순서를 바꾸고 Claudia를 Alexa와 Ben 사이에 삽입했다고 말할 것입니다. 그러나 React는 컴퓨터 프로그램이므로 의도를 알지 못하므로 각 목록 항목을 형제 항목과 구별하기 위해 _key_ 속성을 지정해야 합니다. 데이터가 데이터베이스에서 온 경우, Alexa, Ben, Claudia의 데이터베이스 ID를 키로 사용할 수 있습니다.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

목록이 다시 렌더링될 때, React는 각 목록 항목의 키를 가져와 이전 목록 항목에서 일치하는 키를 검색합니다. 현재 목록에 이전에 존재하지 않았던 키가 있으면, React는 컴포넌트를 생성합니다. 현재 목록에 이전 목록에 존재했던 키가 없으면, React는 이전 컴포넌트를 삭제합니다. 두 키가 일치하면, 해당 컴포넌트가 이동됩니다.

키는 React에게 각 컴포넌트의 정체성을 알려주어, React가 다시 렌더링할 컴포넌트를 결정할 수 있게 합니다. 컴포넌트의 키가 변경되면, 컴포넌트는 삭제되고 새 상태로 다시 생성됩니다.

`key`는 React에서 특별하고 예약된 속성입니다. 요소가 생성될 때, React는 `key` 속성을 추출하여 반환된 요소에 직접 키를 저장합니다. `key`가 props로 전달되는 것처럼 보이지만, React는 자동으로 `key`를 사용하여 업데이트할 컴포넌트를 결정합니다. 컴포넌트가 부모가 지정한 `key`를
알아내는 방법은 없습니다.

**동적 목록을 빌드할 때 적절한 키를 할당하는 것이 강력히 권장됩니다.** 적절한 키가 없는 경우, 데이터를 재구조화하여 키를 얻는 것을 고려할 수 있습니다.

키가 지정되지 않으면, React는 오류를 보고하고 기본적으로 배열 인덱스를 키로 사용합니다. 배열 인덱스를 키로 사용하는 것은 목록 항목을 재정렬하거나 목록 항목을 삽입/제거할 때 문제가 됩니다. 명시적으로 `key={i}`를 전달하면 오류가 사라지지만, 배열 인덱스와 동일한 문제가 발생하므로 대부분의 경우 권장되지 않습니다.

키는 전역적으로 고유할 필요는 없으며, 컴포넌트와 그 형제들 사이에서만 고유하면 됩니다.

### 시간 여행 구현하기 {/*implementing-time-travel*/}

틱택토 게임의 기록에서 각 과거 이동에는 고유한 ID가 있습니다: 이는 이동의 순차 번호입니다. 이동은 절대 재정렬되거나 삭제되거나 중간에 삽입되지 않으므로, 이동 인덱스를 키로 사용하는 것이 안전합니다.

`Game` 함수에서 `<li key={move}>`로 키를 추가할 수 있으며, 렌더링된 게임을 다시 로드하면 React의 "key" 오류가 사라져야 합니다:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

`jumpTo`를 구현하기 전에, `Game` 컴포넌트가 사용자가 현재 보고 있는 단계를 추적하도록 해야 합니다. 이를 위해 `currentMove`라는 새 상태 변수를 정의하고 기본값을 `0`으로 설정합니다:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

다음으로, `Game` 내부의 `jumpTo` 함수를 업데이트하여 `currentMove`를 업데이트합니다. 또한 `currentMove`를 변경하는 숫자가 짝수인 경우 `xIsNext`를 `true`로 설정합니다.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

이제 사각형을 클릭할 때 호출되는 `Game`의 `handlePlay` 함수에 두 가지 변경 사항을 만듭니다.

- "시간을 되돌아가서" 새 이동을 하면, 그 시점까지의 기록만 유지하고자 합니다. `history`의 모든 항목(`...` spread syntax) 뒤에 `nextSquares`를 추가하는 대신, `history.slice(0, currentMove + 1)`의 모든 항목 뒤에 추가하여 이전 기록의 해당 부분만 유지합니다.
- 각 이동이 발생할 때마다 `currentMove`를 최신 기록 항목을 가리키도록 업데이트해야 합니다.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

마지막으로, 항상 마지막 이동을 렌더링하는 대신 현재 선택된 이동을 렌더링하도록 `Game` 컴포넌트를 수정합니다:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

게임의 기록에서 어떤 단계를 클릭하면, 틱택토 보드가 해당 단계가 발생한 후의 보드를 즉시 표시하도록 업데이트되어야 합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
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

### 최종 정리 {/*final-cleanup*/}

코드를 매우 자세히 살펴보면, `xIsNext === true`는 `currentMove`가 짝수일 때이고, `xIsNext === false`는 `currentMove`가 홀수일 때입니다. 즉, `currentMove`의 값을 알면 `xIsNext`가 무엇인지 항상 알 수 있습니다.

이 둘을 상태로 저장할 이유가 없습니다. 실제로, 중복 상태를 피하는 것이 좋습니다. 상태에 저장하는 것을 단순화하면 버그가 줄어들고 코드를 이해하기 쉬워집니다. `Game`을 변경하여 `xIsNext`를 별도의 상태 변수로 저장하지 않고 `currentMove`를 기반으로 계산합니다:

```js {4,11,15}
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
  // ...
}
```

이제 `xIsNext` 상태 선언이나 `setXIsNext` 호출이 필요하지 않습니다. 이제 `xIsNext`가 `currentMove`와 동기화되지 않을 가능성이 없습니다.

### 마무리 {/*wrapping-up*/}

축하합니다! 틱택토 게임을 만들었습니다:

- 틱택토를 플레이할 수 있습니다.
- 플레이어가 게임에서 승리했을 때를 표시합니다.
- 게임이 진행됨에 따라 게임의 기록을 저장합니다.
- 플레이어가 게임의 기록을 검토하고 게임 보드의 이전 버전을 볼 수 있습니다.

잘하셨습니다! 이제 React가 어떻게 작동하는지에 대해 상당히 이해하셨기를 바랍니다.

최종 결과를 여기에서 확인하세요:

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

추가 시간이 있거나 새로운 React 기술을 연습하고 싶다면, 틱택토 게임을 개선할 수 있는 몇 가지 아이디어가 있습니다. 난이도 순으로 나열했습니다:

1. 현재 이동에 대해서만 "You are at move #..."를 표시하고 버튼 대신 표시합니다.
1. `Board`를 다시 작성하여 하드코딩하지 않고 두 개의 루프를 사용하여 사각형을 만듭니다.
1. 이동을 오름차순 또는 내림차순으로 정렬할 수 있는 토글 버튼을 추가합니다.
1. 누군가 승리하면, 승리를 유도한 세 개의 사각형을 강조 표시합니다(아무도 승리하지 않으면 무승부에 대한 메시지를 표시합니다).
1. 이동 기록 목록에서 각 이동의 위치를 (행, 열) 형식으로 표시합니다.

이 튜토리얼을 통해 요소, 컴포넌트, props, 상태와 같은 React 개념을 다루었습니다. 이제 이러한 개념이 게임을 만들 때 어떻게 작동하는지 보았으므로, [Thinking in React](/learn/thinking-in-react)를 확인하여 앱의 UI를 만들 때 동일한 React 개념이 어떻게 작동하는지 확인하세요.