---
title: 렌더 및 커밋
---

<Intro>

화면에 컴포넌트가 표시되기 전에 React에 의해 렌더링되어야 합니다. 이 과정의 단계를 이해하면 코드가 어떻게 실행되는지 생각하고 그 동작을 설명하는 데 도움이 됩니다.

</Intro>

<YouWillLearn>

* React에서 렌더링이 무엇을 의미하는지
* 언제 그리고 왜 React가 컴포넌트를 렌더링하는지
* 화면에 컴포넌트를 표시하는 데 관련된 단계들
* 렌더링이 항상 DOM 업데이트를 생성하지 않는 이유

</YouWillLearn>

당신의 컴포넌트가 주방에서 재료로 맛있는 요리를 준비하는 요리사라고 상상해보세요. 이 시나리오에서 React는 고객의 요청을 받아 주문을 전달하는 웨이터입니다. UI를 요청하고 제공하는 이 과정은 세 단계로 이루어집니다:

1. 렌더링 **트리거** (손님의 주문을 주방에 전달)
2. 컴포넌트 **렌더링** (주방에서 주문 준비)
3. DOM에 **커밋** (주문을 테이블에 배치)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React가 레스토랑의 서버로서 사용자로부터 주문을 받아 컴포넌트 주방에 전달하는 모습." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="카드 요리사가 React에게 신선한 카드 컴포넌트를 주는 모습." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React가 테이블에 있는 사용자에게 카드를 전달하는 모습." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Step 1: Trigger a render {/*step-1-trigger-a-render*/}

컴포넌트가 렌더링되는 이유는 두 가지입니다:

1. 컴포넌트의 **초기 렌더링**입니다.
2. 컴포넌트(또는 그 조상 중 하나)의 **상태가 업데이트**되었습니다.

### Initial render {/*initial-render*/}

앱이 시작될 때 초기 렌더링을 트리거해야 합니다. 프레임워크와 샌드박스는 때때로 이 코드를 숨기지만, 이는 타겟 DOM 노드와 함께 [`createRoot`](/reference/react-dom/client/createRoot)를 호출하고, 그 후 컴포넌트와 함께 `render` 메서드를 호출하여 수행됩니다:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

`root.render()` 호출을 주석 처리하고 컴포넌트가 사라지는 것을 확인해보세요!

### Re-renders when state updates {/*re-renders-when-state-updates*/}

컴포넌트가 초기 렌더링된 후에는 [`set` 함수](/reference/react/useState#setstate)를 사용하여 상태를 업데이트함으로써 추가 렌더링을 트리거할 수 있습니다. 컴포넌트의 상태를 업데이트하면 자동으로 렌더링이 큐에 추가됩니다. (이것은 레스토랑 손님이 첫 주문 후에 차, 디저트 등 다양한 것을 주문하는 것과 비슷합니다. 이는 그들의 갈증이나 배고픔 상태에 따라 달라집니다.)

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React가 레스토랑의 서버로서 사용자에게 카드 UI를 제공하는 모습. 사용자는 검은색 카드가 아닌 분홍색 카드를 원한다고 표현합니다!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React가 컴포넌트 주방으로 돌아가 카드 요리사에게 분홍색 카드가 필요하다고 말하는 모습." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="카드 요리사가 React에게 분홍색 카드를 주는 모습." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Step 2: React renders your components {/*step-2-react-renders-your-components*/}

렌더링을 트리거한 후, React는 화면에 무엇을 표시할지 결정하기 위해 컴포넌트를 호출합니다. **"렌더링"은 React가 컴포넌트를 호출하는 것입니다.**

* **초기 렌더링 시,** React는 루트 컴포넌트를 호출합니다.
* **후속 렌더링 시,** React는 상태 업데이트로 인해 렌더링이 트리거된 함수 컴포넌트를 호출합니다.

이 과정은 재귀적입니다: 업데이트된 컴포넌트가 다른 컴포넌트를 반환하면, React는 _그_ 컴포넌트를 다음으로 렌더링하고, 그 컴포넌트도 무언가를 반환하면 _그_ 컴포넌트를 다음으로 렌더링합니다. 이 과정은 더 이상 중첩된 컴포넌트가 없고 React가 화면에 무엇을 표시해야 할지 정확히 알 때까지 계속됩니다.

다음 예제에서 React는 `Gallery()`와 `Image()`를 여러 번 호출할 것입니다:

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **초기 렌더링 동안,** React는 `<section>`, `<h1>`, 그리고 세 개의 `<img>` 태그에 대한 [DOM 노드를 생성](https://developer.mozilla.org/docs/Web/API/Document/createElement)할 것입니다.
* **재렌더링 동안,** React는 이전 렌더링 이후로 속성 중 어떤 것이 변경되었는지 계산할 것입니다. 그 정보로 아무것도 하지 않으며, 다음 단계인 커밋 단계까지 기다립니다.

<Pitfall>

렌더링은 항상 [순수 계산](/learn/keeping-components-pure)이어야 합니다:

* **동일한 입력, 동일한 출력.** 동일한 입력이 주어지면, 컴포넌트는 항상 동일한 JSX를 반환해야 합니다. (누군가가 토마토가 들어간 샐러드를 주문하면, 양파가 들어간 샐러드를 받아서는 안 됩니다!)
* **자기 일에만 신경 씁니다.** 렌더링 전에 존재했던 객체나 변수를 변경해서는 안 됩니다. (한 주문이 다른 사람의 주문을 변경해서는 안 됩니다.)

그렇지 않으면 코드베이스가 복잡해짐에 따라 혼란스러운 버그와 예측할 수 없는 동작이 발생할 수 있습니다. "Strict Mode"에서 개발할 때, React는 각 컴포넌트의 함수를 두 번 호출하여 순수하지 않은 함수로 인한 실수를 발견할 수 있습니다.

</Pitfall>

<DeepDive>

#### 성능 최적화 {/*optimizing-performance*/}

업데이트된 컴포넌트 내에 중첩된 모든 컴포넌트를 렌더링하는 기본 동작은 트리에서 매우 높은 위치에 있는 컴포넌트의 경우 성능에 최적화되지 않습니다. 성능 문제에 직면하면, [성능 최적화](https://reactjs.org/docs/optimizing-performance.html) 섹션에서 설명된 여러 가지 선택적 방법을 사용할 수 있습니다. **조기 최적화는 하지 마세요!**

</DeepDive>

## Step 3: React commits changes to the DOM {/*step-3-react-commits-changes-to-the-dom*/}

컴포넌트를 렌더링(호출)한 후, React는 DOM을 수정합니다.

* **초기 렌더링의 경우,** React는 [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API를 사용하여 생성된 모든 DOM 노드를 화면에 표시합니다.
* **재렌더링의 경우,** React는 DOM을 최신 렌더링 출력과 일치시키기 위해 최소한의 필요한 작업(렌더링 중 계산된)을 적용합니다.

**React는 렌더링 간에 차이가 있을 때만 DOM 노드를 변경합니다.** 예를 들어, 부모로부터 전달된 다른 props로 매초 재렌더링되는 컴포넌트가 있습니다. `<input>`에 텍스트를 추가하고 `value`를 업데이트할 수 있지만, 컴포넌트가 재렌더링될 때 텍스트가 사라지지 않는 것을 확인해보세요:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
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
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

이것은 마지막 단계에서 React가 새로운 `time`으로 `<h1>`의 내용만 업데이트하기 때문에 작동합니다. React는 `<input>`이 이전과 동일한 위치에 나타나는 것을 보고 `<input>`이나 그 `value`를 건드리지 않습니다!
## Epilogue: Browser paint {/*epilogue-browser-paint*/}

렌더링이 완료되고 React가 DOM을 업데이트한 후, 브라우저는 화면을 다시 그립니다. 이 과정은 "브라우저 렌더링"으로 알려져 있지만, 문서 전체에서 혼동을 피하기 위해 "페인팅"이라고 부르겠습니다.

<Illustration alt="브라우저가 '카드 요소가 있는 정물화'를 그리는 모습." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* React 앱의 모든 화면 업데이트는 세 단계로 이루어집니다:
  1. 트리거
  2. 렌더
  3. 커밋
* Strict Mode를 사용하여 컴포넌트의 실수를 찾을 수 있습니다
* 렌더링 결과가 이전과 동일하면 React는 DOM을 건드리지 않습니다

</Recap>