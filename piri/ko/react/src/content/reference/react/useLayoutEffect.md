---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect`는 성능에 악영향을 줄 수 있습니다. 가능하면 [`useEffect`](/reference/react/useEffect)를 선호하세요.

</Pitfall>

<Intro>

`useLayoutEffect`는 브라우저가 화면을 다시 그리기 전에 실행되는 [`useEffect`](/reference/react/useEffect)의 버전입니다.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## 참고자료 {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

브라우저가 화면을 다시 그리기 전에 레이아웃 측정을 수행하려면 `useLayoutEffect`를 호출하세요:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[아래에서 더 많은 예제를 보세요.](#usage)

#### 매개변수 {/*parameters*/}

* `setup`: Effect의 로직을 담고 있는 함수입니다. setup 함수는 선택적으로 *cleanup* 함수를 반환할 수도 있습니다. 컴포넌트가 DOM에 추가되기 전에 React는 setup 함수를 실행합니다. 종속성이 변경된 상태로 다시 렌더링될 때마다 React는 먼저 cleanup 함수를 (제공된 경우) 이전 값으로 실행한 다음 새로운 값으로 setup 함수를 실행합니다. 컴포넌트가 DOM에서 제거되기 전에 React는 cleanup 함수를 실행합니다.
 
* **선택적** `dependencies`: `setup` 코드 내에서 참조된 모든 반응형 값의 목록입니다. 반응형 값에는 props, state, 그리고 컴포넌트 본문 내에서 직접 선언된 모든 변수와 함수가 포함됩니다. 린터가 [React에 맞게 구성된 경우](/learn/editor-setup#linting), 모든 반응형 값이 종속성으로 올바르게 지정되었는지 확인합니다. 종속성 목록은 항목 수가 일정해야 하며 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 각 종속성을 이전 값과 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 비교합니다. 이 인수를 생략하면 Effect는 컴포넌트가 다시 렌더링될 때마다 다시 실행됩니다.

#### 반환값 {/*returns*/}

`useLayoutEffect`는 `undefined`를 반환합니다.

#### 주의사항 {/*caveats*/}

* `useLayoutEffect`는 Hook이므로 **컴포넌트의 최상위 레벨** 또는 자체 Hook에서만 호출할 수 있습니다. 루프나 조건문 내에서는 호출할 수 없습니다. 그런 경우에는 컴포넌트를 추출하고 Effect를 그곳으로 이동하세요.

* Strict Mode가 켜져 있으면 React는 **첫 번째 실제 setup 전에 개발 전용 setup+cleanup 사이클을 한 번 더 실행합니다.** 이는 cleanup 로직이 setup 로직을 "반영"하고 setup이 수행하는 작업을 중지하거나 취소하는지 확인하는 스트레스 테스트입니다. 이로 인해 문제가 발생하면 [cleanup 함수를 구현하세요.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* 종속성 중 일부가 컴포넌트 내에서 정의된 객체나 함수인 경우, **Effect가 필요 이상으로 자주 다시 실행될 위험이 있습니다.** 이를 해결하려면 불필요한 [객체](/reference/react/useEffect#removing-unnecessary-object-dependencies) 및 [함수](/reference/react/useEffect#removing-unnecessary-function-dependencies) 종속성을 제거하세요. 또한 [상태 업데이트를 추출](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect)하고 [비반응형 로직](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect)을 Effect 외부로 이동할 수 있습니다.

* Effect는 **클라이언트에서만 실행됩니다.** 서버 렌더링 중에는 실행되지 않습니다.

* `useLayoutEffect` 내부의 코드와 그로부터 예약된 모든 상태 업데이트는 **브라우저가 화면을 다시 그리는 것을 차단합니다.** 과도하게 사용하면 앱이 느려집니다. 가능하면 [`useEffect`](/reference/react/useEffect)를 선호하세요.

---

## 사용법 {/*usage*/}

### 브라우저가 화면을 다시 그리기 전에 레이아웃 측정 {/*measuring-layout-before-the-browser-repaints-the-screen*/}

대부분의 컴포넌트는 렌더링할 내용을 결정하기 위해 화면에서 자신의 위치와 크기를 알 필요가 없습니다. 단지 JSX를 반환할 뿐입니다. 그런 다음 브라우저가 *레이아웃* (위치와 크기)을 계산하고 화면을 다시 그립니다.

때로는 이것만으로는 충분하지 않습니다. 어떤 요소 위에 마우스를 올렸을 때 나타나는 툴팁을 상상해보세요. 공간이 충분하면 툴팁은 요소 위에 나타나야 하지만, 공간이 부족하면 아래에 나타나야 합니다. 툴팁을 올바른 최종 위치에 렌더링하려면 높이(즉, 위에 맞는지 여부)를 알아야 합니다.

이를 위해 두 번의 렌더링이 필요합니다:

1. 툴팁을 어디든지 렌더링합니다 (잘못된 위치라도).
2. 높이를 측정하고 툴팁을 어디에 배치할지 결정합니다.
3. 툴팁을 *다시* 올바른 위치에 렌더링합니다.

**이 모든 작업은 브라우저가 화면을 다시 그리기 전에 이루어져야 합니다.** 사용자가 툴팁이 움직이는 것을 보지 않도록 해야 합니다. `useLayoutEffect`를 호출하여 브라우저가 화면을 다시 그리기 전에 레이아웃 측정을 수행하세요:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // 아직 실제 높이를 모릅니다

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // 실제 높이를 알게 된 후 다시 렌더링합니다
  }, []);

  // ...아래 렌더링 로직에서 tooltipHeight를 사용합니다...
}
```

이것이 단계별로 작동하는 방식은 다음과 같습니다:

1. `Tooltip`이 초기 `tooltipHeight = 0`으로 렌더링됩니다 (따라서 툴팁이 잘못된 위치에 있을 수 있습니다).
2. React가 DOM에 배치하고 `useLayoutEffect`의 코드를 실행합니다.
3. `useLayoutEffect`가 툴팁 콘텐츠의 [높이를 측정](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)하고 즉시 다시 렌더링을 트리거합니다.
4. `Tooltip`이 실제 `tooltipHeight`로 다시 렌더링됩니다 (따라서 툴팁이 올바르게 위치합니다).
5. React가 DOM을 업데이트하고 브라우저가 최종적으로 툴팁을 표시합니다.

아래 버튼 위에 마우스를 올려 툴팁이 맞는지 여부에 따라 위치를 조정하는 것을 확인하세요:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            이 툴팁은 버튼 위에 맞지 않습니다.
            <br />
            그래서 아래에 표시됩니다!
          </div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 위)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 위에 맞지 않으므로 아래에 배치합니다.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

`Tooltip` 컴포넌트가 두 번의 패스를 통해 렌더링되어야 하지만 (처음에는 `tooltipHeight`가 `0`으로 초기화되고, 그 다음에는 실제 측정된 높이로), 최종 결과만 보입니다. 이 예제에서는 [`useEffect`](/reference/react/useEffect) 대신 `useLayoutEffect`가 필요한 이유입니다. 아래에서 차이점을 자세히 살펴보겠습니다.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect`는 브라우저가 다시 그리는 것을 차단합니다 {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React는 `useLayoutEffect` 내부의 코드와 그로부터 예약된 상태 업데이트가 **브라우저가 화면을 다시 그리기 전에 처리될 것**을 보장합니다. 이를 통해 툴팁을 렌더링하고, 측정하고, 다시 렌더링하여 사용자가 첫 번째 추가 렌더링을 눈치채지 못하게 할 수 있습니다. 즉, `useLayoutEffect`는 브라우저가 페인팅하는 것을 차단합니다.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            이 툴팁은 버튼 위에 맞지 않습니다.
            <br />
            그래서 아래에 표시됩니다!
          </div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 위)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 위에 맞지 않으므로 아래에 배치합니다.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect`는 브라우저를 차단하지 않습니다 {/*useeffect-does-not-block-the-browser*/}

여기 동일한 예제가 있지만 `useLayoutEffect` 대신 [`useEffect`](/reference/react/useEffect)를 사용합니다. 느린 장치에서는 툴팁이 "깜빡이는" 것을 볼 수 있으며, 초기 위치를 잠시 볼 수 있습니다.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            이 툴팁은 버튼 위에 맞지 않습니다.
            <br />
            그래서 아래에 표시됩니다!
          </div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 위)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
`````js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 위에 맞지 않으므로 아래에 배치합니다.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

이 버그를 재현하기 쉽게 하기 위해, 이 버전은 렌더링 중에 인위적인 지연을 추가합니다. React는 `useEffect` 내부의 상태 업데이트를 처리하기 전에 브라우저가 화면을 페인팅하도록 허용합니다. 그 결과, 툴팁이 깜빡입니다:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            이 툴팁은 버튼 위에 맞지 않습니다.
            <br />
            그래서 아래에 표시됩니다!
          </div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 위)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>이 툴팁은 버튼 위에 맞습니다</div>
        }
      >
        나에게 마우스를 올려보세요 (툴팁 아래)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // 이 코드는 렌더링을 인위적으로 느리게 만듭니다
  let now = performance.now();
  while (performance.now() - now < 100) {
    // 잠시 동안 아무것도 하지 않습니다...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 위에 맞지 않으므로 아래에 배치합니다.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

이 예제를 `useLayoutEffect`로 수정하고 렌더링이 느려져도 페인팅을 차단하는지 확인하세요.

<Solution />

</Recipes>

<Note>

두 번의 패스로 렌더링하고 브라우저를 차단하는 것은 성능에 악영향을 줍니다. 가능하면 이를 피하세요.

</Note>

---

## 문제 해결 {/*troubleshooting*/}

### 오류가 발생합니다: "`useLayoutEffect`는 서버에서 아무것도 하지 않습니다" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

`useLayoutEffect`의 목적은 컴포넌트가 렌더링을 위해 레이아웃 정보를 사용할 수 있도록 하는 것입니다:

1. 초기 콘텐츠를 렌더링합니다.
2. *브라우저가 화면을 다시 그리기 전에* 레이아웃을 측정합니다.
3. 읽은 레이아웃 정보를 사용하여 최종 콘텐츠를 렌더링합니다.

당신이나 프레임워크가 [서버 렌더링](/reference/react-dom/server)을 사용하는 경우, React 앱은 초기 렌더링을 위해 서버에서 HTML로 렌더링됩니다. 이를 통해 JavaScript 코드가 로드되기 전에 초기 HTML을 표시할 수 있습니다.

문제는 서버에는 레이아웃 정보가 없다는 것입니다.

[이전 예제](#measuring-layout-before-the-browser-repaints-the-screen)에서 `Tooltip` 컴포넌트의 `useLayoutEffect` 호출은 콘텐츠 높이에 따라 올바르게 위치하도록 합니다 (콘텐츠 높이에 따라 위나 아래에 위치). 초기 서버 HTML의 일부로 `Tooltip`을 렌더링하려고 하면, 이를 결정할 수 없습니다. 서버에는 아직 레이아웃이 없기 때문입니다! 따라서 서버에서 렌더링하더라도, JavaScript가 로드되고 실행된 후 위치가 "점프"할 것입니다.

일반적으로 레이아웃 정보에 의존하는 컴포넌트는 서버에서 렌더링할 필요가 없습니다. 예를 들어, 초기 렌더링 중에 `Tooltip`을 표시하는 것은 의미가 없을 것입니다. 이는 클라이언트 상호작용에 의해 트리거됩니다.

그러나 이 문제에 직면한 경우, 몇 가지 다른 옵션이 있습니다:

- `useLayoutEffect`를 [`useEffect`](/reference/react/useEffect)로 대체하세요. 이는 React에게 페인팅을 차단하지 않고 초기 렌더링 결과를 표시해도 괜찮다고 알립니다 (원래 HTML이 Effect가 실행되기 전에 표시될 수 있기 때문입니다).

- 또는, [컴포넌트를 클라이언트 전용으로 표시하세요.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) 이는 React에게 서버 렌더링 중에 가장 가까운 [`<Suspense>`](/reference/react/Suspense) 경계까지의 콘텐츠를 로딩 대체물 (예: 스피너 또는 글리머)로 대체하도록 지시합니다.

- 또는, 하이드레이션 후에만 `useLayoutEffect`를 사용하는 컴포넌트를 렌더링할 수 있습니다. `false`로 초기화된 boolean `isMounted` 상태를 유지하고, `useEffect` 호출 내에서 이를 `true`로 설정합니다. 그런 다음 렌더링 로직은 `return isMounted ? <RealContent /> : <FallbackContent />`와 같이 될 수 있습니다. 서버와 하이드레이션 중에는 `useLayoutEffect`를 호출하지 않는 `FallbackContent`를 보게 됩니다. 그런 다음 React는 이를 클라이언트에서만 실행되는 `RealContent`로 대체할 수 있으며, `useLayoutEffect` 호출을 포함할 수 있습니다.

- 외부 데이터 저장소와 컴포넌트를 동기화하고 레이아웃 측정과는 다른 이유로 `useLayoutEffect`에 의존하는 경우, [서버 렌더링을 지원하는](/reference/react/useSyncExternalStore#adding-support-for-server-rendering) [`useSyncExternalStore`](/reference/react/useSyncExternalStore)를 고려하세요.
