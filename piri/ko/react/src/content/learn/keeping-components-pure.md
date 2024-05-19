---
title: 컴포넌트를 순수하게 유지하기
---

<Intro>

일부 JavaScript 함수는 *순수*합니다. 순수 함수는 계산만 수행하고 그 외에는 아무것도 하지 않습니다. 컴포넌트를 순수 함수로만 작성하면 코드베이스가 커짐에 따라 발생할 수 있는 당황스러운 버그와 예측 불가능한 동작을 피할 수 있습니다. 이러한 이점을 얻으려면 몇 가지 규칙을 따라야 합니다.

</Intro>

<YouWillLearn>

* 순수성이 무엇이며 버그를 피하는 데 어떻게 도움이 되는지
* 렌더링 단계에서 변경 사항을 배제하여 컴포넌트를 순수하게 유지하는 방법
* 컴포넌트에서 실수를 찾기 위해 Strict Mode를 사용하는 방법

</YouWillLearn>

## 순수성: 공식으로서의 컴포넌트 {/*purity-components-as-formulas*/}

컴퓨터 과학(특히 함수형 프로그래밍 세계)에서 [순수 함수](https://wikipedia.org/wiki/Pure_function)는 다음과 같은 특성을 가진 함수입니다:

* **자기 일에만 신경 씁니다.** 호출되기 전에 존재했던 객체나 변수를 변경하지 않습니다.
* **같은 입력, 같은 출력.** 동일한 입력이 주어지면 순수 함수는 항상 동일한 결과를 반환해야 합니다.

수학 공식의 예를 이미 알고 있을 수 있습니다.

이 수학 공식을 고려해 보세요: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

만약 <Math><MathI>x</MathI> = 2</Math>라면 <Math><MathI>y</MathI> = 4</Math>입니다. 항상.

만약 <Math><MathI>x</MathI> = 3</Math>라면 <Math><MathI>y</MathI> = 6</Math>입니다. 항상.

만약 <Math><MathI>x</MathI> = 3</Math>라면, <MathI>y</MathI>는 <Math>9</Math>나 <Math>–1</Math> 또는 <Math>2.5</Math>가 되지 않습니다. 시간이나 주식 시장의 상태에 따라 달라지지 않습니다.

만약 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>이고 <Math><MathI>x</MathI> = 3</Math>라면, <MathI>y</MathI>는 _항상_ <Math>6</Math>입니다.

이것을 JavaScript 함수로 만들면 다음과 같습니다:

```js
function double(number) {
  return 2 * number;
}
```

위의 예에서 `double`은 **순수 함수**입니다. `3`을 전달하면 항상 `6`을 반환합니다.

React는 이 개념을 중심으로 설계되었습니다. **React는 여러분이 작성하는 모든 컴포넌트가 순수 함수라고 가정합니다.** 이는 동일한 입력이 주어지면 항상 동일한 JSX를 반환해야 함을 의미합니다:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>{drinkers} 컵의 물을 끓입니다.</li>
      <li>{drinkers} 스푼의 차와 {0.5 * drinkers} 스푼의 향신료를 추가합니다.</li>
      <li>{0.5 * drinkers} 컵의 우유를 끓이고 설탕을 맛에 맞게 추가합니다.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>향신료 차 레시피</h1>
      <h2>두 명분</h2>
      <Recipe drinkers={2} />
      <h2>모임용</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

`drinkers={2}`를 `Recipe`에 전달하면 항상 `2 컵의 물`을 포함하는 JSX를 반환합니다.

`drinkers={4}`를 전달하면 항상 `4 컵의 물`을 포함하는 JSX를 반환합니다.

수학 공식과 같습니다.

컴포넌트를 레시피로 생각할 수 있습니다: 레시피를 따르고 요리 과정에서 새로운 재료를 도입하지 않으면 항상 같은 요리를 얻을 수 있습니다. 그 "요리"는 컴포넌트가 React에 [렌더링](/learn/render-and-commit)하도록 제공하는 JSX입니다.

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="x 명분의 차 레시피: x 컵의 물을 끓이고, x 스푼의 차와 0.5x 스푼의 향신료를 추가하고, 0.5x 컵의 우유를 추가합니다." />

## 부작용: (의도하지 않은) 결과 {/*side-effects-unintended-consequences*/}

React의 렌더링 과정은 항상 순수해야 합니다. 컴포넌트는 JSX를 *반환*만 해야 하며, 렌더링 전에 존재했던 객체나 변수를 *변경*해서는 안 됩니다. 그렇게 하면 순수하지 않게 됩니다!

다음은 이 규칙을 어기는 컴포넌트입니다:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // 나쁨: 기존 변수를 변경하고 있습니다!
  guest = guest + 1;
  return <h2>손님 #{guest}의 차 컵</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

이 컴포넌트는 외부에 선언된 `guest` 변수를 읽고 쓰고 있습니다. 이는 **이 컴포넌트를 여러 번 호출하면 다른 JSX를 생성하게 됩니다!** 게다가 _다른_ 컴포넌트가 `guest`를 읽으면 렌더링 시점에 따라 다른 JSX를 생성하게 됩니다! 이는 예측할 수 없습니다.

수학 공식 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>로 돌아가면, 이제 <Math><MathI>x</MathI> = 2</Math>라 하더라도 <Math><MathI>y</MathI> = 4</Math>를 신뢰할 수 없습니다. 테스트가 실패할 수 있고, 사용자가 당황할 수 있으며, 비행기가 하늘에서 떨어질 수도 있습니다. 이는 혼란스러운 버그로 이어질 수 있습니다!

이 컴포넌트를 [`guest`를 prop으로 전달하여](/learn/passing-props-to-a-component) 수정할 수 있습니다:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>손님 #{guest}의 차 컵</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

이제 컴포넌트는 순수합니다. 반환되는 JSX는 오직 `guest` prop에만 의존합니다.

일반적으로 컴포넌트가 특정 순서로 렌더링될 것이라고 기대해서는 안 됩니다. <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>를 <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math> 전에 호출하든 후에 호출하든 상관없습니다: 두 공식은 서로 독립적으로 해결됩니다. 마찬가지로, 각 컴포넌트는 렌더링 중에 다른 컴포넌트와 조정하거나 의존하려고 하지 말고 "자기 일만" 해야 합니다. 렌더링은 학교 시험과 같습니다: 각 컴포넌트는 스스로 JSX를 계산해야 합니다!

<DeepDive>

#### StrictMode로 순수하지 않은 계산 감지하기 {/*detecting-impure-calculations-with-strict-mode*/}

아직 모두 사용해보지 않았을 수도 있지만, React에는 렌더링 중에 읽을 수 있는 세 가지 종류의 입력이 있습니다: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), 그리고 [context.](/learn/passing-data-deeply-with-context) 이 입력을 항상 읽기 전용으로 취급해야 합니다.

사용자 입력에 응답하여 *무언가를 변경*하려면 변수를 쓰는 대신 [state를 설정](/learn/state-a-components-memory)해야 합니다. 컴포넌트가 렌더링되는 동안 기존 변수나 객체를 변경해서는 안 됩니다.

React는 개발 중에 각 컴포넌트의 함수를 두 번 호출하는 "Strict Mode"를 제공합니다. **Strict Mode는 컴포넌트 함수를 두 번 호출하여 이러한 규칙을 어기는 컴포넌트를 찾는 데 도움을 줍니다.**

원래 예제가 "손님 #2", "손님 #4", "손님 #6"을 표시한 이유를 주목하세요. 원래 함수는 순수하지 않았기 때문에 두 번 호출하면 문제가 발생했습니다. 하지만 수정된 순수 버전은 함수가 매번 두 번 호출되더라도 작동합니다. **순수 함수는 계산만 하기 때문에 두 번 호출해도 아무것도 변경되지 않습니다**--마치 `double(2)`를 두 번 호출해도 반환되는 값이 변경되지 않고, <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>를 두 번 해결해도 <MathI>y</MathI>가 변경되지 않는 것과 같습니다. 동일한 입력, 동일한 출력. 항상.

Strict Mode는 프로덕션에서는 아무런 영향을 미치지 않으므로 사용자에게 앱이 느려지지 않습니다. Strict Mode를 사용하려면 루트 컴포넌트를 `<React.StrictMode>`로 감싸면 됩니다. 일부 프레임워크는 기본적으로 이를 수행합니다.

</DeepDive>

### 로컬 변이: 컴포넌트의 작은 비밀 {/*local-mutation-your-components-little-secret*/}

위의 예에서 문제는 컴포넌트가 렌더링 중에 *기존* 변수를 변경했다는 것입니다. 이를 **"변이"**라고 하여 조금 더 무섭게 들리게 합니다. 순수 함수는 함수의 범위 외부의 변수나 호출 전에 생성된 객체를 변이시키지 않습니다. 그렇게 하면 순수하지 않게 됩니다!

그러나, **렌더링 중에 *방금* 생성한 변수와 객체를 변경하는 것은 완전히 괜찮습니다.** 이 예제에서는 `[]` 배열을 생성하고 이를 `cups` 변수에 할당한 다음 `push`하여 12개의 컵을 추가합니다:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>손님 #{guest}의 차 컵</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

만약 `cups` 변수나 `[]` 배열이 `TeaGathering` 함수 외부에서 생성되었다면, 이는 큰 문제가 될 것입니다! 배열에 항목을 추가하여 *기존* 객체를 변경하고 있기 때문입니다.

그러나, `TeaGathering` 내부에서 *같은 렌더링 중에* 생성했기 때문에 괜찮습니다. `TeaGathering` 외부의 코드는 이 일이 일어났다는 것을 절대 알지 못할 것입니다. 이를 **"로컬 변이"**라고 하며, 이는 컴포넌트의 작은 비밀과 같습니다.

## 부작용을 일으킬 수 있는 곳 {/*where-you-_can_-cause-side-effects*/}

함수형 프로그래밍은 순수성에 크게 의존하지만, 어느 시점에서는 _무언가_가 변경되어야 합니다. 그것이 프로그래밍의 요점입니다! 이러한 변경 사항—화면 업데이트, 애니메이션 시작, 데이터 변경—을 **부작용**이라고 합니다. 이는 렌더링 중이 아닌 _"부수적으로"_ 발생하는 일들입니다.

React에서는 **부작용이 보통 [이벤트 핸들러](/learn/responding-to-events) 안에 있어야 합니다.** 이벤트 핸들러는 버튼 클릭과 같은 작업을 수행할 때 React가 실행하는 함수입니다. 이벤트 핸들러는 컴포넌트 *내부*에 정의되지만, 렌더링 *중에* 실행되지 않습니다! **따라서 이벤트 핸들러는 순수할 필요가 없습니다.**

모든 다른 옵션을 다 사용해보고도 부작용에 적합한 이벤트 핸들러를 찾을 수 없다면, 컴포넌트에서 [`useEffect`](/reference/react/useEffect) 호출을 통해 반환된 JSX에 부착할 수 있습니다. 이는 렌더링 후에 부작용이 허용될 때 실행하도록 React에 지시합니다. **그러나, 이 접근 방식은 최후의 수단이어야 합니다.**

가능한 한 렌더링만으로 로직을 표현하려고 노력하세요. 이 방법이 얼마나 멀리 갈 수 있는지 놀라실 겁니다!

<DeepDive>

#### React가 순수성을 중요하게 생각하는 이유는 무엇일까요? {/*why-does-react-care-about-purity*/}

순수 함수를 작성하는 것은 약간의 습관과 규율이 필요합니다. 하지만 이는 놀라운 기회를 열어줍니다:

* 컴포넌트가 다른 환경에서 실행될 수 있습니다—예를 들어, 서버에서! 동일한 입력에 대해 동일한 결과를 반환하므로, 하나의 컴포넌트가 많은 사용자 요청을 처리할 수 있습니다.
* 입력이 변경되지 않은 컴포넌트의 렌더링을 [건너뛰어](/reference/react/memo) 성능을 향상시킬 수 있습니다. 이는 순수 함수가 항상 동일한 결과를 반환하므로 캐시해도 안전하기 때문입니다.
* 깊은 컴포넌트 트리를 렌더링하는 중간에 일부 데이터가 변경되면, React는 오래된 렌더링을 완료하는 데 시간을 낭비하지 않고 렌더링을 다시 시작할 수 있습니다. 순수성은 언제든지 계산을 중단해도 안전하게 만듭니다.

우리가 구축하는 모든 새로운 React 기능은 순수성을 활용합니다. 데이터 가져오기부터 애니메이션, 성능까지, 컴포넌트를 순수하게 유지하면 React 패러다임의 힘을 발휘할 수 있습니다.

</DeepDive>

<Recap>

* 컴포넌트는 순수해야 하며, 이는 다음을 의미합니다:
  * **자기 일에만 신경 씁니다.** 렌더링 전에 존재했던 객체나 변수를 변경해서는 안 됩니다.
  * **같은 입력, 같은 출력.** 동일한 입력이 주어지면 컴포넌트는 항상 동일한 JSX를 반환해야 합니다.
* 렌더링은 언제든지 발생할 수 있으므로 컴포넌트는 서로의 렌더링 순서에 의존해서는 안 됩니다.
* 컴포넌트가 렌더링에 사용하는 입력을 변이시키지 않아야 합니다. 여기에는 props, state, context가 포함됩니다. 화면을 업데이트하려면 기존 객체를 변이시키는 대신 ["state를 설정"](/learn/state-a-components-memory)하세요.
* 컴포넌트의 로직을 반환하는 JSX로 표현하려고 노력하세요. "무언가를 변경"해야 할 때는 보통 이벤트 핸들러에서 수행하고, 최후의 수단으로 `useEffect`를 사용할 수 있습니다.
* 순수 함수를 작성하는 데는 약간의 연습이 필요하지만, 이는 React 패러다임의 힘을 발휘할 수 있게 합니다.

</Recap>

<Challenges>

#### 고장난 시계 고치기 {/*fix-a-broken-clock*/}

이 컴포넌트는 자정부터 오전 6시까지 `<h1>`의 CSS 클래스를 `"night"`로 설정하고, 그 외의 시간에는 `"day"`로 설정하려고 합니다. 그러나 작동하지 않습니다. 이 컴포넌트를 고칠 수 있나요?

컴퓨터의 시간대를 일시적으로 변경하여 솔루션이 작동하는지 확인할 수 있습니다. 현재 시간이 자정부터 오전 6시 사이일 때, 시계는 반전된 색상을 가져야 합니다!

<Hint>

렌더링은 *계산*입니다. "무언가를 하려고" 하지 말고 동일한 아이디어를 다르게 표현할 수 있나요?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

이 컴포넌트를 `className`을 계산하고 렌더링 출력에 포함시켜 수정할 수 있습니다:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

이 예제에서 부작용(DOM 수정)은 전혀 필요하지 않았습니다. JSX만 반환하면 되었습니다.

</Solution>

#### 고장난 프로필 고치기 {/*fix-a-broken-profile*/}

두 개의 `Profile` 컴포넌트가 서로 다른 데이터로 나란히 렌더링됩니다. 첫 번째 프로필에서 "Collapse"를 누른 다음 "Expand"를 누르면 두 프로필 모두 동일한 사람을 표시하는 것을 알 수 있습니다. 이것은 버그입니다.

버그의 원인을 찾아 수정하세요.

<Hint>

버그가 있는 코드는 `Profile.js`에 있습니다. 위에서 아래까지 모두 읽어보세요!

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

문제는 `Profile` 컴포넌트가 `currentPerson`이라는 기존 변수에 쓰고, `Header`와 `Avatar` 컴포넌트가 이를 읽는다는 것입니다. 이는 *세 컴포넌트 모두* 순수하지 않고 예측하기 어렵게 만듭니다.

버그를 수정하려면 `currentPerson` 변수를 제거하세요. 대신 모든 정보를 `Profile`에서 `Header`와 `Avatar`로 props를 통해 전달하세요. 두 컴포넌트에 `person` prop을 추가하고 이를 전달해야 합니다.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

React는 컴포넌트 함수가 특정 순서로 실행될 것을 보장하지 않으므로 변수를 설정하여 통신할 수 없습니다. 모든 통신은 props를 통해 이루어져야 합니다.

</Solution>

#### 고장난 스토리 트레이 고치기 {/*fix-a-broken-story-tray*/}

회사의 CEO가 온라인 시계 앱에 "스토리"를 추가해달라고 요청했습니다. "Create Story" 자리 표시자를 추가하여 `stories` 배열의 끝에 하나의 가짜 스토리를 추가했습니다. 그러나 "Create Story"가 여러 번 나타납니다. 문제를 해결하세요.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

시계가 업데이트될 때마다 "Create Story"가 *두 번* 추가되는 것을 주목하세요. 이는 렌더링 중에 변이가 발생했다는 힌트입니다--Strict Mode는 이러한 문제를 더 눈에 띄게 하기 위해 컴포넌트를 두 번 호출합니다.

`StoryTray` 함수는 순수하지 않습니다. 받은 `stories` 배열(prop!)에 `push`를 호출하여 `StoryTray`가 렌더링되기 전에 생성된 객체를 변이시키고 있습니다. 이는 버그가 발생하고 예측하기 어렵게 만듭니다.

가장 간단한 해결책은 배열을 전혀 건드리지 않고 "Create Story"를 별도로 렌더링하는 것입니다:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

또는, 항목을 추가하기 전에 _새로운_ 배열을 생성(기존 배열을 복사)할 수 있습니다:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // 배열을 복사하세요!
  let storiesToDisplay = stories.slice();

  // 원래 배열에 영향을 미치지 않습니다:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

이렇게 하면 변이가 로컬로 유지되고 렌더링 함수가 순수해집니다. 그러나 여전히 주의해야 합니다: 예를 들어, 배열의 기존 항목을 변경하려고 하면 해당 항목도 복제해야 합니다.

배열에 대한 어떤 작업이 배열을 변이시키고, 어떤 작업이 변이시키지 않는지 기억하는 것이 유용합니다. 예를 들어, `push`, `pop`, `reverse`, `sort`는 원래 배열을 변이시키지만, `slice`, `filter`, `map`은 새로운 배열을 생성합니다.

</Solution>

</Challenges>