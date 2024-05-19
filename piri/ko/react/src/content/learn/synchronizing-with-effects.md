---
title: 효과와 동기화하기
---

<Intro>

일부 컴포넌트는 외부 시스템과 동기화가 필요합니다. 예를 들어, React 상태에 따라 비-React 컴포넌트를 제어하거나, 서버 연결을 설정하거나, 컴포넌트가 화면에 나타날 때 분석 로그를 보내고 싶을 수 있습니다. *Effects*를 사용하면 렌더링 후에 코드를 실행하여 컴포넌트를 React 외부의 시스템과 동기화할 수 있습니다.

</Intro>

<YouWillLearn>

- Effects가 무엇인지
- Effects가 이벤트와 어떻게 다른지
- 컴포넌트에서 Effect를 선언하는 방법
- 불필요하게 Effect를 다시 실행하지 않는 방법
- 개발 중에 Effects가 두 번 실행되는 이유와 이를 해결하는 방법

</YouWillLearn>

## Effects란 무엇이며 이벤트와 어떻게 다른가요? {/*what-are-effects-and-how-are-they-different-from-events*/}

Effects에 대해 알아보기 전에, React 컴포넌트 내부의 두 가지 유형의 로직에 대해 알아야 합니다:

- **렌더링 코드** ([UI 설명하기](/learn/describing-the-ui)에서 소개됨)는 컴포넌트의 최상위 레벨에 위치합니다. 여기서 props와 상태를 받아 변환하고 화면에 표시할 JSX를 반환합니다. [렌더링 코드는 순수해야 합니다.](/learn/keeping-components-pure) 수학 공식처럼 결과를 _계산_만 해야 하며, 다른 작업을 해서는 안 됩니다.

- **이벤트 핸들러** ([상호작용 추가하기](/learn/adding-interactivity)에서 소개됨)는 컴포넌트 내부에 중첩된 함수로, 계산만 하는 것이 아니라 실제로 작업을 수행합니다. 이벤트 핸들러는 입력 필드를 업데이트하거나, 제품을 구매하기 위해 HTTP POST 요청을 제출하거나, 사용자를 다른 화면으로 이동시킬 수 있습니다. 이벤트 핸들러는 특정 사용자 동작(예: 버튼 클릭 또는 타이핑)으로 인해 프로그램의 상태를 변경하는 ["부작용"](https://en.wikipedia.org/wiki/Side_effect_(computer_science))을 포함합니다.

때로는 이것만으로는 충분하지 않습니다. 화면에 표시될 때마다 채팅 서버에 연결해야 하는 `ChatRoom` 컴포넌트를 생각해 보세요. 서버에 연결하는 것은 순수 계산이 아니므로(부작용이므로) 렌더링 중에 발생할 수 없습니다. 그러나 `ChatRoom`이 표시되는 특정 이벤트(예: 클릭)는 없습니다.

***Effects*는 특정 이벤트가 아닌 렌더링 자체로 인해 발생하는 부작용을 지정할 수 있게 해줍니다.** 채팅에서 메시지를 보내는 것은 사용자가 특정 버튼을 클릭하여 직접 발생시키는 *이벤트*입니다. 그러나 서버 연결을 설정하는 것은 컴포넌트가 나타나게 한 상호작용에 관계없이 발생해야 하므로 *Effect*입니다. Effects는 화면 업데이트 후 [커밋](/learn/render-and-commit) 끝에 실행됩니다. 이는 React 컴포넌트를 네트워크나 서드파티 라이브러리와 같은 외부 시스템과 동기화하기에 좋은 시점입니다.

<Note>

여기와 이후의 텍스트에서 대문자로 시작하는 "Effect"는 위에서 설명한 React 특정 정의, 즉 렌더링으로 인해 발생하는 부작용을 의미합니다. 더 넓은 프로그래밍 개념을 언급할 때는 "부작용"이라고 말할 것입니다.

</Note>


## Effect가 필요하지 않을 수도 있습니다 {/*you-might-not-need-an-effect*/}

**컴포넌트에 Effects를 추가하는 것을 서두르지 마세요.** Effects는 일반적으로 React 코드에서 벗어나 일부 *외부* 시스템과 동기화하는 데 사용된다는 점을 기억하세요. 여기에는 브라우저 API, 서드파티 위젯, 네트워크 등이 포함됩니다. Effect가 단지 다른 상태에 따라 일부 상태를 조정하는 것이라면, [Effect가 필요하지 않을 수도 있습니다.](/learn/you-might-not-need-an-effect)

## Effect 작성 방법 {/*how-to-write-an-effect*/}

Effect를 작성하려면 다음 세 단계를 따르세요:

1. **Effect 선언.** 기본적으로, Effect는 모든 [커밋](/learn/render-and-commit) 후에 실행됩니다.
2. **Effect 의존성 지정.** 대부분의 Effects는 모든 렌더링 후가 아닌 *필요할 때만* 다시 실행되어야 합니다. 예를 들어, 페이드 인 애니메이션은 컴포넌트가 나타날 때만 트리거되어야 합니다. 채팅방에 연결하고 연결을 끊는 것은 컴포넌트가 나타나고 사라질 때 또는 채팅방이 변경될 때만 발생해야 합니다. *의존성*을 지정하여 이를 제어하는 방법을 배우게 될 것입니다.
3. **필요한 경우 정리 추가.** 일부 Effects는 수행 중인 작업을 중지하거나 취소하거나 정리하는 방법을 지정해야 합니다. 예를 들어, "연결"에는 "연결 끊기", "구독"에는 "구독 취소", "가져오기"에는 "취소" 또는 "무시"가 필요합니다. *정리 함수*를 반환하여 이를 수행하는 방법을 배우게 될 것입니다.

각 단계를 자세히 살펴보겠습니다.

### 1단계: Effect 선언 {/*step-1-declare-an-effect*/}

컴포넌트에서 Effect를 선언하려면 React에서 [`useEffect` Hook](/reference/react/useEffect)을 가져옵니다:

```js
import { useEffect } from 'react';
```

그런 다음, 컴포넌트의 최상위 레벨에서 호출하고 Effect 내부에 코드를 넣습니다:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // 여기에 있는 코드는 *모든* 렌더링 후에 실행됩니다.
  });
  return <div />;
}
```

컴포넌트가 렌더링될 때마다 React는 화면을 업데이트하고 *그 후에* `useEffect` 내부의 코드를 실행합니다. 즉, **`useEffect`는 해당 렌더링이 화면에 반영될 때까지 코드 실행을 "지연"시킵니다.**

Effect를 사용하여 외부 시스템과 동기화하는 방법을 살펴보겠습니다. `<VideoPlayer>` React 컴포넌트를 고려해 보세요. `isPlaying` prop을 전달하여 재생 중인지 일시 중지 중인지 제어할 수 있으면 좋을 것입니다:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

사용자 정의 `VideoPlayer` 컴포넌트는 내장된 브라우저 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) 태그를 렌더링합니다:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: isPlaying으로 무언가를 해야 합니다.
  return <video src={src} />;
}
```

그러나 브라우저 `<video>` 태그에는 `isPlaying` prop이 없습니다. 이를 제어하는 유일한 방법은 DOM 요소에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) 메서드를 수동으로 호출하는 것입니다. **현재 비디오가 재생 중이어야 하는지 여부를 나타내는 `isPlaying` prop의 값을 `play()` 및 `pause()`와 같은 호출과 동기화해야 합니다.**

먼저 `<video>` DOM 노드에 [ref를 가져와야 합니다](/learn/manipulating-the-dom-with-refs).

렌더링 중에 `play()` 또는 `pause()`를 호출하려고 할 수 있지만, 이는 올바르지 않습니다:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // 렌더링 중에 이것을 호출하는 것은 허용되지 않습니다.
  } else {
    ref.current.pause(); // 또한, 이것은 충돌합니다.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

이 코드가 올바르지 않은 이유는 렌더링 중에 DOM 노드로 무언가를 하려고 하기 때문입니다. React에서는 [렌더링이 순수한 계산](/learn/keeping-components-pure)이어야 하며, DOM을 수정하는 것과 같은 부작용을 포함해서는 안 됩니다.

게다가, `VideoPlayer`가 처음 호출될 때, DOM이 아직 존재하지 않습니다! 아직 반환할 JSX가 무엇인지 React가 알기 전까지는 호출할 DOM 노드가 없습니다.

여기서 해결책은 **부작용을 `useEffect`로 감싸서 렌더링 계산에서 벗어나게 하는 것입니다:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM 업데이트를 Effect로 감싸면 React가 먼저 화면을 업데이트할 수 있습니다. 그런 다음 Effect가 실행됩니다.

`VideoPlayer` 컴포넌트가 렌더링될 때(처음이든 다시 렌더링되든) 몇 가지 일이 발생합니다. 먼저, React는 화면을 업데이트하여 `<video>` 태그가 올바른 props와 함께 DOM에 있는지 확인합니다. 그런 다음 React는 Effect를 실행합니다. 마지막으로, Effect는 `isPlaying` 값에 따라 `play()` 또는 `pause()`를 호출합니다.

재생/일시 정지 버튼을 여러 번 눌러 비디오 플레이어가 `isPlaying` 값과 동기화되는지 확인하세요:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

이 예제에서, React 상태와 동기화한 "외부 시스템"은 브라우저 미디어 API였습니다. 유사한 접근 방식을 사용하여 선언적 React 컴포넌트로 레거시 비-React 코드(예: jQuery 플러그인)를 감쌀 수 있습니다.

비디오 플레이어를 제어하는 것은 실제로 훨씬 더 복잡합니다. `play()` 호출이 실패할 수 있고, 사용자가 내장된 브라우저 컨트롤을 사용하여 재생하거나 일시 중지할 수 있습니다. 이 예제는 매우 단순화되고 불완전합니다.

<Pitfall>

기본적으로, Effects는 *모든* 렌더링 후에 실행됩니다. 이로 인해 다음과 같은 코드가 **무한 루프를 생성합니다:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effects는 렌더링의 *결과*로 실행됩니다. 상태 설정은 *렌더링을 트리거*합니다. Effect에서 즉시 상태를 설정하는 것은 전원 콘센트를 자체적으로 연결하는 것과 같습니다. Effect가 실행되고, 상태를 설정하며, 이는 다시 렌더링을 트리거하고, 이는 다시 Effect를 실행하며, 상태를 다시 설정하고, 이는 또 다른 렌더링을 트리거하는 식입니다.

Effects는 일반적으로 컴포넌트를 *외부* 시스템과 동기화해야 합니다. 외부 시스템이 없고 단지 다른 상태에 따라 일부 상태를 조정하려는 경우, [Effect가 필요하지 않을 수도 있습니다.](/learn/you-might-not-need-an-effect)

</Pitfall>

### 2단계: Effect 의존성 지정 {/*step-2-specify-the-effect-dependencies*/}

기본적으로, Effects는 *모든* 렌더링 후에 실행됩니다. 종종, 이것은 **원하는 것이 아닙니다:**

- 때로는 느립니다. 외부 시스템과 동기화하는 것은 항상 즉각적이지 않으므로 필요하지 않은 경우 이를 건너뛰고 싶을 수 있습니다. 예를 들어, 모든 키 입력마다 채팅 서버에 다시 연결하고 싶지 않습니다.
- 때로는 잘못된 것입니다. 예를 들어, 모든 키 입력마다 컴포넌트 페이드 인 애니메이션을 트리거하고 싶지 않습니다. 애니메이션은 컴포넌트가 처음 나타날 때만 실행되어야 합니다.

문제를 설명하기 위해, 이전 예제에 몇 가지 `console.log` 호출과 부모 컴포넌트의 상태를 업데이트하는 텍스트 입력을 추가했습니다. 타이핑이 Effect를 다시 실행하게 하는 것을 확인하세요:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

React에게 **불필요하게 Effect를 다시 실행하지 않도록** 두 번째 인수로 *의존성* 배열을 지정할 수 있습니다. 위 예제의 14번째 줄에 빈 `[]` 배열을 추가하여 시작하세요:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

`React Hook useEffect has a missing dependency: 'isPlaying'`라는 오류가 표시될 것입니다:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // 이것은 오류를 발생시킵니다.

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

문제는 Effect 내부의 코드가 무엇을 할지 결정하기 위해 `isPlaying` prop에 *의존*하지만, 이 의존성이 명시적으로 선언되지 않았다는 것입니다. 이 문제를 해결하려면 의존성 배열에 `isPlaying`을 추가하세요:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // 여기에 사용됩니다...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...따라서 여기에 선언해야 합니다!
```

이제 모든 의존성이 선언되었으므로 오류가 없습니다. 의존성 배열에 `[isPlaying]`을 지정하면 React는 `isPlaying`이 이전 렌더링 동안과 동일한 경우 Effect를 다시 실행하지 않도록 지시합니다. 이 변경으로, 입력에 타이핑하는 것은 Effect를 다시 실행하지 않지만, 재생/일시 정지 버튼을 누르는 것은 다시 실행합니다:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');

      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

의존성 배열에는 여러 의존성이 포함될 수 있습니다. React는 *모든* 의존성이 이전 렌더링 동안과 정확히 동일한 값을 가지고 있는 경우에만 Effect를 다시 실행하지 않습니다. React는 의존성 값을 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 비교합니다. 자세한 내용은 [`useEffect` 참조](/reference/react/useEffect#reference)를 참조하세요.

**의존성을 "선택"할 수는 없습니다.** 지정한 의존성이 Effect 내부의 코드에 따라 React가 예상하는 것과 일치하지 않으면 린트 오류가 발생합니다. 이는 코드의 많은 버그를 잡는 데 도움이 됩니다. 일부 코드를 다시 실행하지 않으려면, [*Effect 코드 자체를 편집하여* 해당 의존성이 "필요하지 않도록" 만드세요.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

의존성 배열이 없는 경우와 *빈* `[]` 의존성 배열이 있는 경우의 동작은 다릅니다:

```js {3,7,11}
useEffect(() => {
  // 이 코드는 모든 렌더링 후에 실행됩니다.
});

useEffect(() => {
  // 이 코드는 마운트 시(컴포넌트가 나타날 때)만 실행됩니다.
}, []);

useEffect(() => {
  // 이 코드는 마운트 시 *및* a 또는 b가 마지막 렌더링 이후 변경된 경우에 실행됩니다.
}, [a, b]);
```

다음 단계에서 "마운트"가 무엇을 의미하는지 자세히 살펴보겠습니다.

</Pitfall>

<DeepDive>

#### 왜 ref는 의존성 배열에서 생략되었나요? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

이 Effect는 `ref`와 `isPlaying`을 *모두* 사용하지만, 의존성으로는 `isPlaying`만 선언되었습니다:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

이는 `ref` 객체가 *안정적인 정체성*을 가지고 있기 때문입니다: React는 [항상 동일한 객체를 제공할 것임을 보장합니다](/reference/react/useRef#returns). 이는 절대 변경되지 않으므로, 자체적으로 Effect를 다시 실행하게 만들지 않습니다. 따라서 포함 여부는 중요하지 않습니다. 포함하는 것도 괜찮습니다:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

[`set` 함수들](/reference/react/useState#setstate)도 안정적인 정체성을 가지고 있으므로, 종종 의존성에서 생략되는 것을 볼 수 있습니다. 린터가 의존성을 생략해도 오류가 발생하지 않으면, 생략해도 안전합니다.

항상 안정적인 의존성을 생략하는 것은 린터가 객체가 안정적이라는 것을 "볼 수 있을 때"만 작동합니다. 예를 들어, `ref`가 부모 컴포넌트에서 전달되었다면, 의존성 배열에 지정해야 합니다. 그러나 이는 좋은 일입니다. 부모 컴포넌트가 항상 동일한 ref를 전달하는지, 조건부로 여러 ref 중 하나를 전달하는지 알 수 없기 때문입니다. 따라서 Effect는 전달된 ref에 따라 달라집니다.

</DeepDive>

### 3단계: 필요한 경우 정리 추가 {/*step-3-add-cleanup-if-needed*/}

다른 예를 고려해 보겠습니다. 화면에 나타날 때 채팅 서버에 연결해야 하는 `ChatRoom` 컴포넌트를 작성하고 있습니다. `connect()` 및 `disconnect()` 메서드를 제공하는 `createConnection()` API가 주어졌습니다. 컴포넌트가 사용자에게 표시되는 동안 연결 상태를 유지하려면 어떻게 해야 할까요?

Effect 로직을 작성하는 것부터 시작하세요:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

모든 재렌더링 후에 채팅에 연결하는 것은 느릴 수 있으므로, 의존성 배열을 추가합니다:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effect 내부의 코드는 어떤 props나 상태도 사용하지 않으므로, 의존성 배열은 `[]`(비어 있음)입니다. 이는 React에게 이 코드를 컴포넌트가 "마운트"될 때, 즉 화면에 처음 나타날 때만 실행하도록 지시합니다.**

이 코드를 실행해 보겠습니다:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 실제 구현은 실제로 서버에 연결할 것입니다.
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

이 Effect는 마운트 시에만 실행되므로, 콘솔에 `"✅ Connecting..."`이 한 번만 출력될 것으로 예상할 수 있습니다. **그러나 콘솔을 확인하면 `"✅ Connecting..."`이 두 번 출력됩니다. 왜 이런 일이 발생할까요?**

`ChatRoom` 컴포넌트가 여러 화면이 있는 더 큰 앱의 일부라고 상상해 보세요. 사용자가 `ChatRoom` 페이지에서 여정을 시작합니다. 컴포넌트가 마운트되고 `connection.connect()`를 호출합니다. 그런 다음 사용자가 다른 화면으로 이동한다고 상상해 보세요. 예를 들어, 설정 페이지로 이동합니다. `ChatRoom` 컴포넌트가 언마운트됩니다. 마지막으로, 사용자가 뒤로 버튼을 클릭하여 `ChatRoom`이 다시 마운트됩니다. 이는 두 번째 연결을 설정하지만, 첫 번째 연결은 절대 해제되지 않았습니다! 사용자가 앱을 탐색할 때 연결이 계속 쌓이게 됩니다.

이러한 버그는 광범위한 수동 테스트 없이는 쉽게 놓칠 수 있습니다. 이를 빠르게 발견할 수 있도록, 개발 중에 React는 초기 마운트 직후 모든 컴포넌트를 한 번 다시 마운트합니다.

`"✅ Connecting..."` 로그가 두 번 표시되는 것은 실제 문제를 알아차리는 데 도움이 됩니다: 코드가 컴포넌트가 언마운트될 때 연결을 닫지 않습니다.

이 문제를 해결하려면 Effect에서 *정리 함수*를 반환합니다:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React는 Effect가 다시 실행되기 전에 매번 정리 함수를 호출하며, 컴포넌트가 언마운트될 때(제거될 때) 한 번 더 호출합니다. 정리 함수가 구현된 경우 어떤 일이 발생하는지 확인해 보겠습니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 실제 구현은 실제로 서버에 연결할 것입니다.
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

이제 개발 중에는 세 개의 콘솔 로그가 표시됩니다:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**이것은 개발 중에 올바른 동작입니다.** 컴포넌트를 다시 마운트함으로써, React는 탐색 후 다시 돌아오는 것이 코드를 깨뜨리지 않음을 확인합니다. 연결을 끊고 다시 연결하는 것은 정확히 발생해야 하는 일입니다! 정리를 잘 구현하면, 한 번 실행되는 것과 개발 중에 실행, 정리, 다시 실행되는 것 사이에 사용자에게 보이는 차이가 없어야 합니다. React는 개발 중에 코드의 버그를 찾기 위해 추가적인 연결/해제 호출 쌍을 실행합니다. 이는 정상입니다. 이를 없애려고 하지 마세요!

**프로덕션에서는 `"✅ Connecting..."`이 한 번만 출력됩니다.** 컴포넌트를 다시 마운트하는 것은 개발 중에만 발생하여 정리가 필요한 Effects를 찾는 데 도움이 됩니다. [Strict Mode](/reference/react/StrictMode)를 끄면 개발 동작을 선택하지 않을 수 있지만, 켜두는 것을 권장합니다. 이는 위와 같은 많은 버그를 찾는 데 도움이 됩니다.

## 개발 중에 Effect가 두 번 실행되는 문제를 처리하는 방법? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React는 개발 중에 버그를 찾기 위해 컴포넌트를 의도적으로 다시 마운트합니다. **올바른 질문은 "Effect를 한 번만 실행하는 방법"이 아니라 "Effect가 다시 마운트된 후에도 작동하도록 수정하는 방법"입니다.**

대부분의 경우, 정리 함수를 구현하는 것이 답입니다. 정리 함수는 Effect가 수행한 작업을 중지하거나 취소해야 합니다. 사용자에게는 Effect가 한 번 실행되는 것(프로덕션에서처럼)과 _설정 → 정리 → 설정_ 시퀀스(개발 중에 볼 수 있는 것) 사이에 차이가 없어야 합니다.

작성할 대부분의 Effects는 아래의 일반적인 패턴 중 하나에 맞을 것입니다.

<Pitfall>

#### Effect 실행을 방지하기 위해 refs를 사용하지 마세요 {/*dont-use-refs-to-prevent-effects-from-firing*/}

개발 중에 Effect가 두 번 실행되는 것을 방지하기 위한 일반적인 함정은 `ref`를 사용하여 Effect가 한 번만 실행되도록 하는 것입니다. 예를 들어, 위의 버그를 `useRef`로 "수정"할 수 있습니다:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 이것은 버그를 수정하지 않습니다!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

이렇게 하면 개발 중에 `"✅ Connecting..."`이 한 번만 표시되지만, 버그는 수정되지 않습니다.

사용자가 다른 페이지로 이동하면 연결이 여전히 닫히지 않으며, 다시 돌아오면 새 연결이 생성됩니다. 사용자가 앱을 탐색할 때 연결이 계속 쌓이게 됩니다. 이는 "수정" 전과 동일합니다.

버그를 수정하려면, Effect를 한 번만 실행하는 것만으로는 충분하지 않습니다. Effect가 다시 마운트된 후에도 작동해야 하므로, 연결을 정리해야 합니다.

아래 예제에서 일반적인 패턴을 처리하는 방법을 확인하세요.

</Pitfall>

### 비-React 위젯 제어 {/*controlling-non-react-widgets*/}

때로는 React로 작성되지 않은 UI 위젯을 추가해야 할 때가 있습니다. 예를 들어, 페이지에 지도 컴포넌트를 추가한다고 가정해 보겠습니다. 이 컴포넌트에는 `setZoomLevel()` 메서드가 있으며, React 코드의 `zoomLevel` 상태 변수와 동기화하고 싶습니다. Effect는 다음과 유사하게 보일 것입니다:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

이 경우 정리가 필요하지 않습니다. 개발 중에 React는 Effect를 두 번 호출하지만, 동일한 값으로 `setZoomLevel`을 두 번 호출하는 것은 아무런 영향을 미치지 않습니다. 약간 느릴 수 있지만, 프로덕션에서는 불필요하게 다시 마운트되지 않기 때문에 중요하지 않습니다.

일부 API는 연속으로 두 번 호출할 수 없습니다. 예를 들어, 내장된 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) 요소의 [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) 메서드는 두 번 호출하면 예외를 발생시킵니다. 정리 함수를 구현하고 다이얼로그를 닫도록 만드세요:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

개발 중에는 Effect가 `showModal()`을 호출한 다음 즉시 `close()`를 호출하고 다시 `showModal()`을 호출합니다. 이는 프로덕션에서 `showModal()`을 한 번 호출하는 것과 동일한 사용자 가시적 동작을 가집니다.

### 이벤트 구독 {/*subscribing-to-events*/}

Effect가 무언가를 구독하는 경우, 정리 함수는 구독을 취소해야 합니다:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

개발 중에는 Effect가 `addEventListener()`를 호출한 다음 즉시 `removeEventListener()`를 호출하고 동일한 핸들러로 다시 `addEventListener()`를 호출합니다. 따라서 한 번에 하나의 활성 구독만 존재합니다. 이는 프로덕션에서 `addEventListener()`를 한 번 호출하는 것과 동일한 사용자 가시적 동작을 가집니다.

### 애니메이션 트리거 {/*triggering-animations*/}

Effect가 무언가를 애니메이션화하는 경우, 정리 함수는 애니메이션을 초기 값으로 재설정해야 합니다:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // 애니메이션 트리거
  return () => {
    node.style.opacity = 0; // 초기 값으로 재설정
  };
}, []);
```

개발 중에는 불투명도가 `1`로 설정된 다음 `0`으로 설정되고 다시 `1`로 설정됩니다. 이는 프로덕션에서 직접 `1`로 설정하는 것과 동일한 사용자 가시적 동작을 가집니다. 트윈을 지원하는 서드파티 애니메이션 라이브러리를 사용하는 경우, 정리 함수는 타임라인을 초기 상태로 재설정해야 합니다.

### 데이터 가져오기 {/*fetching-data*/}

Effect가 무언가를 가져오는 경우, 정리 함수는 [가져오기를 중단](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)하거나 결과를 무시해야 합니다:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

이미 발생한 네트워크 요청을 "취소"할 수는 없지만, 정리 함수는 더 이상 관련이 없는 가져오기가 애플리케이션에 계속 영향을 미치지 않도록 해야 합니다. `userId`가 `'Alice'`에서 `'Bob'`으로 변경되면, 정리는 `'Alice'` 응답이 `'Bob'` 이후에 도착하더라도 무시되도록 보장합니다.

**개발 중에는 네트워크 탭에서 두 개의 가져오기를 볼 수 있습니다.** 이는 잘못된 것이 아닙니다. 위의 접근 방식으로, 첫 번째 Effect는 즉시 정리되므로 `ignore` 변수의 복사본이 `true`로 설정됩니다. 따라서 추가 요청이 있더라도 상태에 영향을 미치지 않습니다.

**프로덕션에서는 하나의 요청만 있을 것입니다.** 개발 중에 두 번째 요청이 신경 쓰인다면, 요청을 중복 제거하고 응답을 컴포넌트 간에 캐시하는 솔루션을 사용하는 것이 가장 좋습니다:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

이는 개발 경험을 개선할 뿐만 아니라 애플리케이션을 더 빠르게 느끼게 합니다. 예를 들어, 사용자가 뒤로 버튼을 누르면 일부 데이터를 다시 로드할 필요가 없기 때문에 캐시됩니다. 직접 캐시를 구축하거나 Effects에서 수동으로 가져오는 것에 대한 많은 대안을 사용할 수 있습니다.

<DeepDive>

#### 데이터 가져오기에 대한 좋은 대안은 무엇인가요? {/*what-are-good-al
ternatives-to-data-fetching-in-effects*/}

Effects 내부에서 `fetch` 호출을 작성하는 것은 [데이터를 가져오는 인기 있는 방법](https://www.robinwieruch.de/react-hooks-fetch-data)입니다. 특히 완전히 클라이언트 측 앱에서 그렇습니다. 그러나 이는 매우 수동적인 접근 방식이며 상당한 단점이 있습니다:

- **Effects는 서버에서 실행되지 않습니다.** 이는 초기 서버 렌더링된 HTML이 데이터 없이 로딩 상태만 포함하게 된다는 것을 의미합니다. 클라이언트 컴퓨터는 모든 JavaScript를 다운로드하고 앱을 렌더링한 후에야 데이터를 로드해야 한다는 것을 알게 됩니다. 이는 매우 비효율적입니다.
- **Effects 내부에서 직접 가져오기는 "네트워크 워터폴"을 쉽게 만듭니다.** 부모 컴포넌트를 렌더링하고, 데이터를 가져오고, 자식 컴포넌트를 렌더링한 후, 자식 컴포넌트가 데이터를 가져오기 시작합니다. 네트워크가 매우 빠르지 않다면, 이는 모든 데이터를 병렬로 가져오는 것보다 훨씬 느립니다.
- **Effects 내부에서 직접 가져오기는 데이터를 미리 로드하거나 캐시하지 않습니다.** 예를 들어, 컴포넌트가 언마운트되고 다시 마운트되면 데이터를 다시 가져와야 합니다.
- **매우 비효율적입니다.** 경쟁 조건과 같은 버그가 없는 방식으로 `fetch` 호출을 작성할 때 상당한 보일러플레이트 코드가 필요합니다.

이러한 단점은 React에만 국한된 것이 아닙니다. 이는 어떤 라이브러리로든 마운트 시 데이터를 가져오는 것에 적용됩니다. 라우팅과 마찬가지로, 데이터 가져오기는 잘 수행하기가 쉽지 않으므로 다음 접근 방식을 권장합니다:

- **[프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)를 사용하는 경우, 내장된 데이터 가져오기 메커니즘을 사용하세요.** 현대 React 프레임워크는 효율적이고 위의 단점을 겪지 않는 통합 데이터 가져오기 메커니즘을 가지고 있습니다.
- **그렇지 않으면, 클라이언트 측 캐시를 사용하거나 구축하는 것을 고려하세요.** 인기 있는 오픈 소스 솔루션으로는 [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview)가 있습니다. 직접 솔루션을 구축할 수도 있으며, 이 경우 Effects를 내부적으로 사용하지만 요청 중복 제거, 응답 캐싱, 네트워크 워터폴 방지(데이터 미리 로드 또는 데이터 요구 사항을 라우트로 올리기) 논리를 추가합니다.

이러한 접근 방식이 맞지 않는 경우, Effects 내부에서 직접 데이터를 계속 가져올 수 있습니다.

</DeepDive>

### 분석 로그 보내기 {/*sending-analytics*/}

페이지 방문 시 분석 이벤트를 보내는 다음 코드를 고려해 보세요:

```js
useEffect(() => {
  logVisit(url); // POST 요청을 보냅니다.
}, [url]);
```

개발 중에는 `logVisit`이 URL마다 두 번 호출되므로 이를 수정하려고 할 수 있습니다. **이 코드를 그대로 유지하는 것을 권장합니다.** 이전 예제와 마찬가지로, 한 번 실행되는 것과 두 번 실행되는 것 사이에 *사용자 가시적* 동작 차이가 없습니다. 실용적인 관점에서, `logVisit`은 개발 중에 아무것도 하지 않아야 합니다. 개발 머신의 로그가 프로덕션 메트릭을 왜곡하지 않기 때문입니다. 컴포넌트 파일을 저장할 때마다 다시 마운트되므로 개발 중에 추가 방문 로그가 기록됩니다.

**프로덕션에서는 중복 방문 로그가 없습니다.**

분석 이벤트를 디버그하려면, 앱을 스테이징 환경(프로덕션 모드로 실행됨)에 배포하거나 [Strict Mode](/reference/react/StrictMode)와 그 개발 전용 재마운트 검사를 일시적으로 선택 해제할 수 있습니다. 또한, 분석을 Effects 대신 라우트 변경 이벤트 핸들러에서 보낼 수 있습니다. 더 정확한 분석을 위해 [교차 관찰자](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 사용하여 어떤 컴포넌트가 뷰포트에 있고 얼마나 오래 보이는지 추적할 수 있습니다.

### Effect가 아닌 것: 애플리케이션 초기화 {/*not-an-effect-initializing-the-application*/}

일부 로직은 애플리케이션이 시작될 때 한 번만 실행되어야 합니다. 이를 컴포넌트 외부에 배치할 수 있습니다:

```js {2-3}
if (typeof window !== 'undefined') { // 브라우저에서 실행 중인지 확인합니다.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

이렇게 하면 브라우저가 페이지를 로드한 후에만 이러한 로직이 한 번 실행되도록 보장합니다.

### Effect가 아닌 것: 제품 구매 {/*not-an-effect-buying-a-product*/}

때로는 정리 함수를 작성하더라도 Effect가 두 번 실행되는 것의 사용자 가시적 결과를 방지할 수 없는 경우가 있습니다. 예를 들어, Effect가 제품을 구매하는 것과 같은 POST 요청을 보내는 경우:

```js {2-3}
useEffect(() => {
  // 🔴 잘못된 예: 이 Effect는 개발 중에 두 번 실행되어 코드에 문제가 발생합니다.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

제품을 두 번 구매하고 싶지 않습니다. 그러나 이것이 Effect에 이 로직을 넣지 말아야 하는 이유입니다. 사용자가 다른 페이지로 이동한 후 뒤로 버튼을 누르면 어떻게 될까요? Effect가 다시 실행됩니다. 사용자가 *페이지를 방문할 때* 제품을 구매하는 것이 아니라, *구매 버튼을 클릭할 때* 제품을 구매하고 싶습니다.

구매는 렌더링으로 인해 발생하는 것이 아니라 특정 상호작용으로 인해 발생합니다. 이는 사용자가 구매 버튼을 클릭할 때만 실행되어야 합니다. **Effect를 삭제하고 구매 버튼 이벤트 핸들러로 `/api/buy` 요청을 이동하세요:**

```js {2-3}
  function handleClick() {
    // ✅ 구매는 특정 상호작용으로 인해 발생하는 이벤트입니다.
    fetch('/api/buy', { method: 'POST' });
  }
```

**이는 재마운트가 애플리케이션의 논리를 깨뜨리는 경우, 이는 기존 버그를 드러내는 경우가 많다는 것을 보여줍니다.** 사용자의 관점에서, 페이지를 방문하는 것은 페이지를 방문하고, 링크를 클릭하고, 다시 페이지를 보기 위해 뒤로 버튼을 누르는 것과 다르지 않아야 합니다. React는 개발 중에 컴포넌트를 한 번 다시 마운트하여 컴포넌트가 이 원칙을 준수하는지 확인합니다.

## 모든 것을 종합하여 {/*putting-it-all-together*/}

이 플레이그라운드는 Effects가 실제로 어떻게 작동하는지 "느낌"을 얻는 데 도움이 될 수 있습니다.

이 예제는 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)을 사용하여 Effect가 실행된 후 3초 후에 입력 텍스트와 함께 콘솔 로그를 예약합니다. 정리 함수는 대기 중인 타임아웃을 취소합니다. "컴포넌트 마운트"를 눌러 시작하세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

처음에는 `Schedule "a" log`, `Cancel "a" log`, `Schedule "a" log`라는 세 개의 로그가 표시됩니다. 3초 후에는 `a`라는 로그도 표시됩니다. 앞서 배운 것처럼, 추가적인 예약/취소 쌍은 React가 개발 중에 컴포넌트를 다시 마운트하여 정리를 잘 구현했는지 확인하기 때문입니다.

이제 입력을 `abc`로 편집하세요. 충분히 빠르게 입력하면, `Schedule "ab" log`가 즉시 `Cancel "ab" log`와 `Schedule "abc" log`로 이어지는 것을 볼 수 있습니다. **React는 항상 이전 렌더링의 Effect를 다음 렌더링의 Effect 전에 정리합니다.** 따라서 입력을 빠르게 입력해도 한 번에 하나의 타임아웃만 예약됩니다. 입력을 몇 번 편집하고 콘솔을 보면서 Effects가 어떻게 정리되는지 감을 잡아보세요.

입력에 무언가를 입력한 다음 즉시 "컴포넌트 언마운트"를 누르세요. 언마운트가 마지막 렌더링의 Effect를 정리하는 것을 확인하세요. 여기서는 마지막 타임아웃을 지우기 전에 실행됩니다.

마지막으로, 위의 컴포넌트를 편집하고 정리 함수를 주석 처리하여 타임아웃이 취소되지 않도록 하세요. `abcde`를 빠르게 입력해 보세요. 3초 후에 어떤 일이 일어날지 예상해 보세요. 타임아웃 내부의 `console.log(text)`가 *최신* `text`를 출력하고 다섯 개의 `abcde` 로그를 생성할까요? 직관을 확인하기 위해 시도해 보세요!

3초 후에는 `a`, `ab`, `abc`, `abcd`, `abcde` 순서로 로그가 표시되어야 합니다. **각 Effect는 해당 렌더링의 `text` 값을 "캡처"합니다.** 상태가 변경되었더라도, `text = 'ab'`인 렌더링의 Effect는 항상 `'ab'`를 봅니다. 즉, 각 렌더링의 Effects는 서로 격리됩니다. 이 작동 방식이 궁금하다면, [클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)에 대해 읽어보세요.

<DeepDive>

#### 각 렌더링에는 자체 Effects가 있습니다 {/*each-render-has-its-own-effects*/}

`useEffect`를 렌더링 출력에 "행동을 부착"하는 것으로 생각할 수 있습니다. 이 Effect를 고려해 보세요:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

사용자가 앱을 탐색할 때 정확히 어떤 일이 발생하는지 살펴보겠습니다.

#### 초기 렌더링 {/*initial-render*/}

사용자가 `<ChatRoom roomId="general" />`를 방문합니다. `roomId`를 `'general'`로 [정신적으로 대체](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)해 보겠습니다:

```js
  // 첫 번째 렌더링의 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effect도 렌더링 출력의 일부입니다.** 첫 번째 렌더링의 Effect는 다음과 같습니다:

```js
  // 첫 번째 렌더링의 Effect (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 첫 번째 렌더링의 의존성 (roomId = "general")
  ['general']
```

React는 이 Effect를 실행하여 `'general'` 채팅방에 연결합니다.

#### 동일한 의존성으로 다시 렌더링 {/*re-render-with-same-dependencies*/}

`<ChatRoom roomId="general" />`가 다시 렌더링된다고 가정해 보겠습니다. JSX 출력은 동일합니다:

```js
  // 두 번째 렌더링의 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React는 렌더링 출력이 변경되지 않았음을 확인하고, DOM을 업데이트하지 않습니다.

두 번째 렌더링의 Effect는 다음과 같습니다:

```js
  // 두 번째 렌더링의 Effect (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 두 번째 렌더링의 의존성 (roomId = "general")
  ['general']
```

React는 두 번째 렌더링의 `['general']`과 첫 번째 렌더링의 `['general']`을 비교합니다. **모든 의존성이 동일하므로, React는 두 번째 렌더링의 Effect를 *무시*합니다.** 이는 호출되지 않습니다.

#### 다른 의존성으로 다시 렌더링 {/*re-render-with-different-dependencies*/}

그런 다음, 사용자가 `<ChatRoom roomId="travel" />`를 방문합니다. 이번에는 컴포넌트가 다른 JSX를 반환합니다:

```js
  // 세 번째 렌더링의 JSX (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React는 DOM을 업데이트하여 `"Welcome to general"`을 `"Welcome to travel"`로 변경합니다.

세 번째 렌더링의 Effect는 다음과 같습니다:

```js
  // 세 번째 렌더링의 Effect (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // 세 번째 렌더링의 의존성 (roomId = "travel")
  ['travel']
```

React는 세 번째 렌더링의 `['travel']`과 두 번째 렌더링의 `['general']`을 비교합니다. 하나의 의존성이 다릅니다: `Object.is('travel', 'general')`은 `false`입니다. Effect는 건너뛸 수 없습니다.

**React는 세 번째 렌더링의 Effect를 적용하기 전에, *실행된* 마지막 Effect를 정리해야 합니다.** 두 번째 렌더링의 Effect는 건너뛰었으므로, React는 첫 번째 렌더링의 Effect를 정리해야 합니다. 첫 번째 렌더링으로 돌아가면, 정리가 `createConnection('general')`로 생성된 연결에서 `disconnect()`를 호출한다는 것을 알 수 있습니다. 이는 앱을 `'general'` 채팅방에서 연결 해제합니다.

그 후, React는 세 번째 렌더링의 Effect를 실행합니다. 이는 `'travel'` 채팅방에 연결합니다.

#### 언마운트 {/*unmount*/}

마지막으로, 사용자가 다른 페이지로 이동하여 `ChatRoom` 컴포넌트가 언마운트됩니다. React는 마지막 Effect의 정리 함수를 실행합니다. 마지막 Effect는 세 번째 렌더링에서 나왔습니다. 세 번째 렌더링의 정리는 `createConnection('travel')` 연결을 파괴합니다. 따라서 앱은 `'travel'` 방에서 연결 해제됩니다.

#### 개발 전용 동작 {/*development-only-behaviors*/}

[Strict Mode](/reference/react/StrictMode)가 켜져 있으면, React는 마운트 후 한 번 컴포넌트를 다시 마운트합니다(상태와 DOM은 유지됩니다). 이는 [정리가 필요한 Effects를 찾는 데 도움이 됩니다](#step-3-add-cleanup-if-needed) 및 경쟁 조건과 같은 버그를 조기에 노출합니다. 추가로, 개발 중에 파일을 저장할 때마다 Effects를 다시 마운트합니다. 이 두 가지 동작은 개발 전용입니다.

</DeepDive>

<Recap>

- 이벤트와 달리, Effects는 특정 상호작용이 아닌 렌더링 자체로 인해 발생합니다.
- Effects는 컴포넌트를 일부 외부 시스템(서드파티 API, 네트워크 등)과 동기화할 수 있게 해줍니다.
- 기본적으로, Effects는 모든 렌더링 후에 실행됩니다(초기 렌더링 포함).
- React는 모든 의존성이 이전 렌더링 동안과 동일한 값을 가지고 있는 경우 Effect를 건너뜁니다.
- 의존성을 "선택"할 수 없습니다. 의존성은 Effect 내부의 코드에 의해 결정됩니다.
- 빈 의존성 배열(`[]`)은 컴포넌트가 "마운트"되는 것, 즉 화면에 추가되는 것에 해당합니다.
- Strict Mode에서는 React가 컴포넌트를 두 번 마운트합니다(개발 중에만!). 이는 Effects를 스트레스 테스트합니다.
- Effect가 재마운트로 인해 깨지는 경우, 정리 함수를 구현해야 합니다.
- React는 Effect가 다음 번 실행되기 전에, 그리고 언마운트 시 정리 함수를 호출합니다.

</Recap>

<Challenges>

#### 필드에 포커스 맞추기 {/*focus-a-field-on-mount*/}

이 예제에서, 폼은 `<MyInput />` 컴포넌트를 렌더링합니다.

입력의 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) 메서드를 사용하여 `MyInput`이 화면에 나타날 때 자동으로 포커스를 맞추도록 하세요. 이미 주석 처리된 구현이 있지만,
완전히 작동하지 않습니다. 왜 작동하지 않는지 파악하고 수정하세요. (`autoFocus` 속성에 익숙하다면, 그것이 존재하지 않는다고 가정하세요: 동일한 기능을 처음부터 다시 구현하고 있습니다.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: 이 부분이 완전히 작동하지 않습니다. 수정하세요.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

솔루션이 작동하는지 확인하려면 "Show form"을 눌러 입력이 포커스를 받는지(강조 표시되고 커서가 내부에 배치되는지) 확인하세요. "Hide form"을 누른 다음 다시 "Show form"을 누르세요. 입력이 다시 강조 표시되는지 확인하세요.

`MyInput`은 *모든* 렌더링 후가 아닌 마운트 시에만 포커스를 맞춰야 합니다. 동작이 올바른지 확인하려면 "Show form"을 누른 다음 "Make it uppercase" 체크박스를 반복해서 누르세요. 체크박스를 클릭해도 위의 입력에 포커스가 맞춰지지 않아야 합니다.

<Solution>

렌더링 중에 `ref.current.focus()`를 호출하는 것은 *부작용*이기 때문에 잘못된 것입니다. 부작용은 이벤트 핸들러 내부에 배치하거나 `useEffect`로 선언해야 합니다. 이 경우, 부작용은 특정 상호작용이 아닌 컴포넌트가 나타나는 것에 의해 *발생*하므로, Effect에 넣는 것이 합리적입니다.

실수를 수정하려면 `ref.current.focus()` 호출을 Effect 선언으로 감싸세요. 그런 다음, 이 Effect가 모든 렌더링 후가 아닌 마운트 시에만 실행되도록 하려면 빈 `[]` 의존성을 추가하세요.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 조건부로 필드에 포커스 맞추기 {/*focus-a-field-conditionally*/}

이 폼은 두 개의 `<MyInput />` 컴포넌트를 렌더링합니다.

"Show form"을 누르면 두 번째 필드가 자동으로 포커스를 받는 것을 확인할 수 있습니다. 이는 두 개의 `<MyInput />` 컴포넌트가 내부의 필드에 포커스를 맞추려고 하기 때문입니다. 두 입력 필드에 대해 `focus()`를 연속으로 호출하면, 항상 마지막 것이 "이깁니다".

첫 번째 필드에 포커스를 맞추고 싶다고 가정해 보겠습니다. 첫 번째 `MyInput` 컴포넌트는 이제 `true`로 설정된 boolean `shouldFocus` prop을 받습니다. `MyInput`이 받은 `shouldFocus` prop이 `true`인 경우에만 `focus()`가 호출되도록 로직을 변경하세요.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: shouldFocus가 true인 경우에만 focus()를 호출하세요.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

솔루션을 확인하려면 "Show form"과 "Hide form"을 반복해서 누르세요. 폼이 나타날 때마다 *첫 번째* 입력만 포커스를 받아야 합니다. 이는 부모 컴포넌트가 첫 번째 입력을 `shouldFocus={true}`로, 두 번째 입력을 `shouldFocus={false}`로 렌더링하기 때문입니다. 또한 두 입력이 여전히 작동하고 두 입력 모두에 타이핑할 수 있는지 확인하세요.

<Hint>

Effect를 조건부로 선언할 수는 없지만, Effect 내부에 조건부 로직을 포함할 수 있습니다.

</Hint>

<Solution>

조건부 로직을 Effect 내부에 넣으세요. Effect 내부에서 `shouldFocus`를 사용하고 있으므로, 이를 의존성으로 지정해야 합니다. (이는 일부 입력의 `shouldFocus`가 `false`에서 `true`로 변경되면, 마운트 후 포커스를 맞추게 됩니다.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 두 번 실행되는 간격 수정 {/*fix-an-interval-that-fires-twice*/}

이 `Counter` 컴포넌트는 매초마다 증가하는 카운터를 표시합니다. 마운트 시, [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)을 호출합니다. 이는 `onTick`을 매초마다 실행하게 합니다. `onTick` 함수는 카운터를 증가시킵니다.

그러나 매초마다 한 번씩 증가하는 대신, 두 번 증가합니다. 왜 그런지 찾아내고 수정하세요.

<Hint>

`setInterval`은 간격 ID를 반환하며, 이를 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)에 전달하여 간격을 중지할 수 있습니다.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

[Strict Mode](/reference/react/StrictMode)가 켜져 있으면(이 사이트의 샌드박스처럼), React는 개발 중에 각 컴포넌트를 한 번 다시 마운트합니다. 이는 간격이 두 번 설정되게 하며, 이로 인해 매초마다 카운터가 두 번 증가합니다.

그러나 React의 동작이 *버그의 원인*은 아닙니다: 버그는 이미 코드에 존재합니다. React의 동작은 버그를 더 눈에 띄게 만듭니다. 실제 원인은 이 Effect가 프로세스를 시작하지만 이를 정리할 방법을 제공하지 않는다는 것입니다.

이 코드를 수정하려면, `setInterval`이 반환한 간격 ID를 저장하고, [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)을 사용하여 정리 함수를 구현하세요:

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

개발 중에는 React가 여전히 컴포넌트를 한 번 다시 마운트하여 정리를 잘 구현했는지 확인합니다. 따라서 `setInterval` 호출이 `clearInterval`에 의해 즉시 정리되고 다시 `setInterval`이 호출됩니다. 프로덕션에서는 `setInterval` 호출이 한 번만 발생합니다. 두 경우 모두 사용자 가시적 동작은 동일합니다: 카운터는 매초 한 번씩 증가합니다.

</Solution>

#### Effect 내부에서 가져오기 수정 {/*fix-fetching-inside-an-effect*/}

이 컴포넌트는 선택된 사람의 전기를 표시합니다. 마운트 시 및 `person`이 변경될 때마다 비동기 함수 `fetchBio(person)`을 호출하여 전기를 로드합니다. 이 비동기 함수는 결국 문자열로 해결되는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환합니다. 가져오기가 완료되면, `setBio`를 호출하여 선택 상자 아래에 해당 문자열을 표시합니다.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

이 코드에는 버그가 있습니다. "Alice"를 선택한 다음 "Bob"을 선택하고 즉시 "Taylor"를 선택하세요. 충분히 빠르게 수행하면, Taylor가 선택되었지만 아래 단락에 "This is Bob's bio."라고 표시되는 버그를 확인할 수 있습니다.

이것이 발생하는 이유는 무엇일까요? 이 Effect 내부에서 버그를 수정하세요.

<Hint>

Effect가 비동기적으로 무언가를 가져오는 경우, 일반적으로 정리가 필요합니다.

</Hint>

<Solution>

버그를 트리거하려면 다음 순서로 일이 발생해야 합니다:

- `'Bob'`을 선택하면 `fetchBio('Bob')`이 트리거됩니다.
- `'Taylor'`를 선택하면 `fetchBio('Taylor')`이 트리거됩니다.
- **`'Taylor'`를 가져오는 것이 `'Bob'`을 가져오는 것보다 *먼저* 완료됩니다.**
- `'Taylor'` 렌더링의 Effect가 `setBio('This is Taylor’s bio')`를 호출합니다.
- `'Bob'`을 가져오는 것이 완료됩니다.
- `'Bob'` 렌더링의 Effect가 `setBio('This is Bob’s bio')`를 호출합니다.

이것이 Taylor가 선택되었음에도 불구하고 Bob의 전기를 보는 이유입니다. 이러한 버그는 [경쟁 조건](https://en.wikipedia.org/wiki/Race_condition)이라고 불리며, 두 개의 비동기 작업이 서로 "경쟁"하여 예상치 못한 순서로 도착할 수 있습니다.

이 경쟁 조건을 수정하려면 정리 함수를 추가하세요:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
   const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

각 렌더링의 Effect는 자체 `ignore` 변수를 가집니다. 초기에는 `ignore` 변수가 `false`로 설정됩니다. 그러나 Effect가 정리되면(예: 다른 사람을 선택할 때), 해당 Effect의 `ignore` 변수가 `true`로 설정됩니다. 따라서 요청이 완료되는 순서에 상관없이, 마지막 사람의 Effect만 `ignore`이 `false`로 설정되어 `setBio(result)`를 호출합니다. 이전 Effect는 정리되었으므로 `if (!ignore)` 체크가 `setBio` 호출을 방지합니다:

- `'Bob'`을 선택하면 `fetchBio('Bob')`이 트리거됩니다.
- `'Taylor'`를 선택하면 `fetchBio('Taylor')`이 트리거되고, 이전(Bob의) Effect를 정리합니다.
- `'Taylor'`를 가져오는 것이 `'Bob'`을 가져오는 것보다 *먼저* 완료됩니다.
- `'Taylor'` 렌더링의 Effect가 `setBio('This is Taylor’s bio')`를 호출합니다.
- `'Bob'`을 가져오는 것이 완료됩니다.
- `'Bob'` 렌더링의 Effect는 `ignore` 플래그가 `true`로 설정되었기 때문에 아무것도 하지 않습니다.

API 호출의 결과를 무시하는 것 외에도, [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)를 사용하여 더 이상 필요하지 않은 요청을 취소할 수도 있습니다. 그러나 이것만으로는 경쟁 조건을 방지하기에 충분하지 않습니다. 더 많은 비동기 단계가 fetch 이후에 체인될 수 있으므로, 명시적인 플래그인 `ignore`을 사용하는 것이 이 유형의 문제를 해결하는 가장 신뢰할 수 있는 방법입니다.

</Solution>

</Challenges>