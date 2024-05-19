---
title: useTransition
---

<Intro>

`useTransition`는 UI를 차단하지 않고 상태를 업데이트할 수 있게 해주는 React Hook입니다.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## 참고자료 {/*reference*/}

### `useTransition()` {/*usetransition*/}

`useTransition`을 컴포넌트의 최상위 레벨에서 호출하여 일부 상태 업데이트를 전환으로 표시합니다.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[아래 예시를 더 보세요.](#usage)

#### 매개변수 {/*parameters*/}

`useTransition`은 매개변수를 받지 않습니다.

#### 반환값 {/*returns*/}

`useTransition`은 정확히 두 개의 항목이 있는 배열을 반환합니다:

1. 대기 중인 전환이 있는지 여부를 알려주는 `isPending` 플래그.
2. 상태 업데이트를 전환으로 표시할 수 있게 해주는 [`startTransition` 함수](#starttransition).

---

### `startTransition` 함수 {/*starttransition*/}

`useTransition`이 반환하는 `startTransition` 함수는 상태 업데이트를 전환으로 표시할 수 있게 해줍니다.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### 매개변수 {/*starttransition-parameters*/}

* `scope`: 하나 이상의 [`set` 함수](/reference/react/useState#setstate)를 호출하여 일부 상태를 업데이트하는 함수입니다. React는 매개변수 없이 `scope`를 즉시 호출하고 `scope` 함수 호출 중에 동기적으로 예약된 모든 상태 업데이트를 전환으로 표시합니다. 이들은 [비차단](#marking-a-state-update-as-a-non-blocking-transition)되고 [원치 않는 로딩 표시기를 표시하지 않습니다.](#preventing-unwanted-loading-indicators)

#### 반환값 {/*starttransition-returns*/}

`startTransition`은 아무것도 반환하지 않습니다.

#### 주의사항 {/*starttransition-caveats*/}

* `useTransition`은 Hook이므로 컴포넌트나 커스텀 Hook 내부에서만 호출할 수 있습니다. 다른 곳(예: 데이터 라이브러리)에서 전환을 시작해야 하는 경우, 독립형 [`startTransition`](/reference/react/startTransition)을 대신 호출하세요.

* 상태의 `set` 함수에 접근할 수 있는 경우에만 업데이트를 전환으로 래핑할 수 있습니다. 일부 prop이나 커스텀 Hook 값에 응답하여 전환을 시작하려면 [`useDeferredValue`](/reference/react/useDeferredValue)를 대신 사용해 보세요.

* `startTransition`에 전달하는 함수는 동기적이어야 합니다. React는 이 함수를 즉시 실행하여 실행 중에 발생하는 모든 상태 업데이트를 전환으로 표시합니다. 나중에 더 많은 상태 업데이트를 수행하려고 하면(예: 타임아웃에서) 전환으로 표시되지 않습니다.

* 전환으로 표시된 상태 업데이트는 다른 상태 업데이트에 의해 중단됩니다. 예를 들어, 전환 중에 차트 컴포넌트를 업데이트하지만 차트가 다시 렌더링되는 중에 입력을 시작하면 React는 입력 업데이트를 처리한 후 차트 컴포넌트의 렌더링 작업을 다시 시작합니다.

* 전환 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.

* 여러 전환이 진행 중인 경우, React는 현재 이를 함께 배치합니다. 이는 향후 릴리스에서 제거될 가능성이 있는 제한 사항입니다.

---

## 사용법 {/*usage*/}

### 상태 업데이트를 비차단 전환으로 표시하기 {/*marking-a-state-update-as-a-non-blocking-transition*/}

`useTransition`을 컴포넌트의 최상위 레벨에서 호출하여 상태 업데이트를 비차단 *전환*으로 표시합니다.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition`은 정확히 두 개의 항목이 있는 배열을 반환합니다:

1. 대기 중인 전환이 있는지 여부를 알려주는 <CodeStep step={1}>`isPending` 플래그</CodeStep>.
2. 상태 업데이트를 전환으로 표시할 수 있게 해주는 <CodeStep step={2}>`startTransition` 함수</CodeStep>.

그런 다음 상태 업데이트를 다음과 같이 전환으로 표시할 수 있습니다:

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

전환을 사용하면 느린 장치에서도 사용자 인터페이스 업데이트를 응답성 있게 유지할 수 있습니다.

전환을 사용하면 다시 렌더링 중에도 UI가 응답성을 유지합니다. 예를 들어, 사용자가 탭을 클릭한 후 마음을 바꿔 다른 탭을 클릭하면 첫 번째 다시 렌더링이 완료될 때까지 기다리지 않고도 그렇게 할 수 있습니다.

<Recipes titleText="useTransition과 일반 상태 업데이트의 차이점" titleId="examples">

#### 전환에서 현재 탭 업데이트하기 {/*updating-the-current-tab-in-a-transition*/}

이 예제에서 "Posts" 탭은 **인위적으로 느리게** 설정되어 렌더링하는 데 최소 1초가 걸립니다.

"Posts"를 클릭한 후 즉시 "Contact"를 클릭하세요. 이렇게 하면 "Posts"의 느린 렌더링이 중단됩니다. "Contact" 탭이 즉시 표시됩니다. 이 상태 업데이트는 전환으로 표시되었기 때문에 느린 다시 렌더링이 사용자 인터페이스를 멈추지 않았습니다.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### 전환 없이 현재 탭 업데이트하기 {/*updating-the-current-tab-without-a-transition*/}

이 예제에서 "Posts" 탭도 **인위적으로 느리게** 설정되어 렌더링하는 데 최소 1초가 걸립니다. 이전 예제와 달리 이 상태 업데이트는 **전환이 아닙니다.**

"Posts"를 클릭한 후 즉시 "Contact"를 클릭하세요. 앱이 느린 탭을 렌더링하는 동안 멈추고 UI가 응답하지 않게 됩니다. 이 상태 업데이트는 전환이 아니므로 느린 다시 렌더링이 사용자 인터페이스를 멈추게 했습니다.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 전환에서 부모 컴포넌트 업데이트하기 {/*updating-the-parent-component-in-a-transition*/}

`useTransition` 호출에서 부모 컴포넌트의 상태를 업데이트할 수도 있습니다. 예를 들어, 이 `TabButton` 컴포넌트는 `onClick` 로직을 전환으로 래핑합니다:

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

부모 컴포넌트가 `onClick` 이벤트 핸들러 내부에서 상태를 업데이트하기 때문에, 그 상태 업데이트는 전환으로 표시됩니다. 따라서 이전 예제와 마찬가지로 "Posts"를 클릭한 후 즉시 "Contact"를 클릭할 수 있습니다. 선택된 탭을 업데이트하는 것이 전환으로 표시되므로 사용자 상호작용을 차단하지 않습니다.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### 전환 중 대기 상태 표시하기 {/*displaying-a-pending-visual-state-during-the-transition*/}

`useTransition`이 반환하는 `isPending` 불리언 값을 사용하여 전환이 진행 중임을 사용자에게 알릴 수 있습니다. 예를 들어, 탭 버튼에 특별한 "대기 중" 시각적 상태를 추가할 수 있습니다:

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

이제 "Posts"를 클릭하면 탭 버튼 자체가 즉시 업데이트되어 더 응답성이 좋아집니다:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts
'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### 원치 않는 로딩 표시기 방지하기 {/*preventing-unwanted-loading-indicators*/}

이 예제에서 `PostsTab` 컴포넌트는 [Suspense를 지원하는](/reference/react/Suspense) 데이터 소스를 사용하여 일부 데이터를 가져옵니다. "Posts" 탭을 클릭하면 `PostsTab` 컴포넌트가 *중단*되어 가장 가까운 로딩 대체 요소가 나타납니다:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

탭 컨테이너 전체를 숨겨 로딩 표시기를 표시하는 것은 사용자 경험을 해치게 됩니다. `TabButton`에 `useTransition`을 추가하면 대신 탭 버튼에 대기 상태를 표시할 수 있습니다.

"Posts"를 클릭해도 더 이상 탭 컨테이너 전체가 스피너로 대체되지 않습니다:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact')}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[전환을 Suspense와 함께 사용하는 방법에 대해 더 읽어보세요.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

전환은 이미 표시된 콘텐츠(예: 탭 컨테이너)를 숨기지 않기 위해 충분히 "기다립니다". Posts 탭에 [중첩된 `<Suspense>` 경계가 있는 경우,](/reference/react/Suspense#revealing-nested-content-as-it-loads) 전환은 이를 "기다리지" 않습니다.

</Note>

---

### Suspense를 지원하는 라우터 구축하기 {/*building-a-suspense-enabled-router*/}

React 프레임워크나 라우터를 구축하는 경우, 페이지 탐색을 전환으로 표시하는 것이 좋습니다.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

이것은 두 가지 이유로 권장됩니다:

- [전환은 중단 가능](#marking-a-state-update-as-a-non-blocking-transition)하므로 사용자가 다시 렌더링이 완료될 때까지 기다리지 않고 클릭할 수 있습니다.
- [전환은 원치 않는 로딩 표시기를 방지](#preventing-unwanted-loading-indicators)하므로 탐색 시 사용자가 갑작스러운 점프를 피할 수 있습니다.

여기 전환을 사용하여 탐색을 위한 작은 간단한 라우터 예제가 있습니다.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, likeRelay 또는 Next.js와 같은 Suspense와 통합된 프레임워크를 시도해 보세요.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// 이 데모를 실행하기 위한 버그 해결 방법입니다.
// TODO: 버그가 수정되면 실제 구현으로 교체하세요.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[Suspense를 지원하는](/reference/react/Suspense) 라우터는 기본적으로 탐색 업데이트를 전환으로 래핑할 것으로 예상됩니다.

</Note>

---

### 오류 경계로 사용자에게 오류 표시하기 {/*displaying-an-error-to-users-with-error-boundary*/}

<Canary>

useTransition에 대한 오류 경계는 현재 React의 카나리아 및 실험 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

`startTransition`에 전달된 함수가 오류를 발생시키면 [오류 경계](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 사용하여 사용자에게 오류를 표시할 수 있습니다. 오류 경계를 사용하려면 `useTransition`을 호출하는 컴포넌트를 오류 경계로 래핑하세요. `startTransition`에 전달된 함수가 오류를 발생시키면 오류 경계의 대체 요소가 표시됩니다.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // 오류 경계를 보여주기 위한 데모용
  if (comment == null) {
    throw new Error("예제 오류: 오류 경계를 트리거하기 위해 발생한 오류");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // 의도적으로 댓글을 전달하지 않음
          // 오류가 발생하도록 함
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
// TODO: 안정적인 React 릴리스에서
// use Hook이 포함되면 canary 대신
// stable에서 가져오도록 업데이트하세요.
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: 이 예제를 사용하여
// Codesandbox Server Component
// 데모 환경을 사용하도록 업데이트하세요.
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## 문제 해결 {/*troubleshooting*/}

### 전환에서 입력을 업데이트할 수 없음 {/*updating-an-input-in-a-transition-doesnt-work*/}

전환을 사용하여 입력을 제어하는 상태 변수를 사용할 수 없습니다:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ 전환을 사용하여 제어된 입력 상태를 업데이트할 수 없음
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

이는 전환이 비차단적이지만 변경 이벤트에 대한 응답으로 입력을 업데이트하는 것은 동기적으로 이루어져야 하기 때문입니다. 입력에 대한 응답으로 전환을 실행하려면 두 가지 옵션이 있습니다:

1. 두 개의 별도 상태 변수를 선언할 수 있습니다: 하나는 입력 상태(항상 동기적으로 업데이트됨)를 위한 것이고, 다른 하나는 전환에서 업데이트할 것입니다. 이를 통해 동기 상태를 사용하여 입력을 제어하고 전환 상태 변수를 나머지 렌더링 로직에 전달할 수 있습니다.
2. 또는 하나의 상태 변수를 사용하고 [`useDeferredValue`](/reference/react/useDeferredValue)를 추가하여 실제 값보다 "뒤처지게" 할 수 있습니다. 이는 새로운 값에 자동으로 "따라잡기" 위해 비차단적 다시 렌더링을 트리거합니다.

---

### React가 내 상태 업데이트를 전환으로 처리하지 않음 {/*react-doesnt-treat-my-state-update-as-a-transition*/}

상태 업데이트를 전환으로 래핑할 때, 그것이 `startTransition` 호출 *동안* 발생하는지 확인하세요:

```js
startTransition(() => {
  // ✅ startTransition 호출 동안 상태 설정
  setPage('/about');
});
```

`startTransition`에 전달하는 함수는 동기적이어야 합니다.

다음과 같이 업데이트를 전환으로 표시할 수 없습니다:

```js
startTransition(() => {
  // ❌ startTransition 호출 후 상태 설정
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

대신 이렇게 할 수 있습니다:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ startTransition 호출 동안 상태 설정
    setPage('/about');
  });
}, 1000);
```

마찬가지로 다음과 같이 업데이트를 전환으로 표시할 수 없습니다:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ startTransition 호출 후 상태 설정
  setPage('/about');
});
```

그러나 대신 이렇게 할 수 있습니다:

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ startTransition 호출 동안 상태 설정
  setPage('/about');
});
```

---

### 컴포넌트 외부에서 `useTransition`을 호출하고 싶음 {/*i-want-to-call-usetransition-from-outside-a-component*/}

`useTransition`은 Hook이기 때문에 컴포넌트 외부에서 호출할 수 없습니다. 이 경우 독립형 [`startTransition`](/reference/react/startTransition) 메서드를 대신 사용하세요. 이는 동일한 방식으로 작동하지만 `isPending` 표시기를 제공하지 않습니다.

---

### `startTransition`에 전달한 함수가 즉시 실행됨 {/*the-function-i-pass-to-starttransition-executes-immediately*/}

이 코드를 실행하면 1, 2, 3이 출력됩니다:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**1, 2, 3이 출력되는 것이 정상입니다.** `startTransition`에 전달한 함수는 지연되지 않습니다. 브라우저의 `setTimeout`과 달리 콜백을 나중에 실행하지 않습니다. React는 함수를 즉시 실행하지만 실행 중에 예약된 모든 상태 업데이트를 전환으로 표시합니다. 다음과 같이 작동한다고 상상할 수 있습니다:

```js
// React가 작동하는 방식의 단순화된 버전

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... 전환 상태 업데이트 예약 ...
  } else {
    // ... 긴급 상태 업데이트 예약 ...
  }
}
```