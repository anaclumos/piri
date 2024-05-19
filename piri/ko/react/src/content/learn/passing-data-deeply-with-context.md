---
title: Context로 데이터 깊이 전달하기
---

<Intro>

일반적으로 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달할 때는 props를 사용합니다. 하지만 props를 통해 많은 컴포넌트를 거쳐야 하거나, 앱의 많은 컴포넌트가 동일한 정보를 필요로 할 때는 props를 전달하는 것이 번거롭고 불편할 수 있습니다. *Context*를 사용하면 부모 컴포넌트가 트리 아래의 어떤 컴포넌트에도 정보를 명시적으로 props를 통해 전달하지 않고도 사용할 수 있게 해줍니다.

</Intro>

<YouWillLearn>

- "prop drilling"이 무엇인지
- 반복적인 prop 전달을 context로 대체하는 방법
- context의 일반적인 사용 사례
- context의 일반적인 대안

</YouWillLearn>

## props 전달의 문제점 {/*the-problem-with-passing-props*/}

[props 전달](/learn/passing-props-to-a-component)은 데이터를 UI 트리를 통해 사용하는 컴포넌트로 명시적으로 전달하는 훌륭한 방법입니다.

하지만 props를 깊게 전달해야 하거나 많은 컴포넌트가 동일한 props를 필요로 할 때는 props 전달이 번거롭고 불편해질 수 있습니다. 가장 가까운 공통 조상이 데이터를 필요로 하는 컴포넌트와 멀리 떨어져 있을 수 있으며, 상태를 [상위로 올리는 것](/learn/sharing-state-between-components)은 "prop drilling"이라고 불리는 상황을 초래할 수 있습니다.

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="세 개의 컴포넌트 트리 다이어그램. 부모는 보라색으로 강조된 값을 나타내는 버블을 포함합니다. 값은 두 자식에게 내려가며, 두 자식 모두 보라색으로 강조됩니다.">

상태 올리기

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="열 개의 노드로 구성된 트리 다이어그램, 각 노드는 두 개 이하의 자식을 가집니다. 루트 노드는 보라색으로 강조된 값을 나타내는 버블을 포함합니다. 값은 두 자식에게 내려가며, 각 자식은 값을 전달하지만 포함하지 않습니다. 왼쪽 자식은 두 자식에게 값을 전달하며, 두 자식 모두 보라색으로 강조됩니다. 루트의 오른쪽 자식은 두 자식 중 오른쪽 자식에게 값을 전달하며, 그 자식은 단일 자식에게 값을 전달하고, 두 자식 모두 보라색으로 강조됩니다.">

prop drilling

</Diagram>

</DiagramGroup>

props를 전달하지 않고 트리의 필요한 컴포넌트로 데이터를 "텔레포트"할 수 있는 방법이 있다면 좋지 않을까요? React의 context 기능을 사용하면 가능합니다!

## Context: props 전달의 대안 {/*context-an-alternative-to-passing-props*/}

Context를 사용하면 부모 컴포넌트가 트리 아래의 모든 컴포넌트에 데이터를 제공할 수 있습니다. Context에는 다양한 사용 사례가 있습니다. 다음은 그 중 하나의 예입니다. 크기를 나타내는 `level`을 받는 `Heading` 컴포넌트를 고려해보세요:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

같은 `Section` 내에서 여러 제목이 항상 동일한 크기를 가지도록 하고 싶다고 가정해보세요:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

현재는 각 `<Heading>`에 `level` prop을 개별적으로 전달합니다:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

`level` prop을 `<Section>` 컴포넌트에 전달하고 `<Heading>`에서 제거할 수 있다면 좋을 것입니다. 이렇게 하면 동일한 섹션의 모든 제목이 동일한 크기를 가지도록 강제할 수 있습니다:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

하지만 `<Heading>` 컴포넌트가 가장 가까운 `<Section>`의 level을 어떻게 알 수 있을까요? **이는 자식이 트리 상단에서 데이터를 "요청"할 수 있는 방법이 필요합니다.**

props만으로는 할 수 없습니다. 여기서 context가 등장합니다. 세 단계로 수행합니다:

1. **Context를 생성합니다.** (heading level을 위한 것이므로 `LevelContext`라고 부를 수 있습니다.)
2. **데이터가 필요한 컴포넌트에서 context를 사용합니다.** (`Heading`은 `LevelContext`를 사용할 것입니다.)
3. **데이터를 지정하는 컴포넌트에서 context를 제공합니다.** (`Section`은 `LevelContext`를 제공할 것입니다.)

Context를 사용하면 부모 컴포넌트가--심지어 먼 부모 컴포넌트도!--트리 내부의 모든 컴포넌트에 데이터를 제공할 수 있습니다.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="세 개의 컴포넌트 트리 다이어그램. 부모는 주황색으로 강조된 값을 나타내는 버블을 포함하며, 두 자식에게 주황색으로 강조된 값을 투영합니다.">

가까운 자식에서 context 사용

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="열 개의 노드로 구성된 트리 다이어그램, 각 노드는 두 개 이하의 자식을 가집니다. 루트 부모 노드는 주황색으로 강조된 값을 나타내는 버블을 포함합니다. 값은 트리의 네 개의 잎과 하나의 중간 컴포넌트에 직접 투영되며, 모두 주황색으로 강조됩니다. 다른 중간 컴포넌트는 강조되지 않습니다.">

먼 자식에서 context 사용

</Diagram>

</DiagramGroup>

### 1단계: Context 생성 {/*step-1-create-the-context*/}

먼저 context를 생성해야 합니다. **파일에서 내보내야** 컴포넌트가 사용할 수 있습니다:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`createContext`의 유일한 인수는 _기본_ 값입니다. 여기서 `1`은 가장 큰 제목 레벨을 나타내지만, 어떤 종류의 값(심지어 객체)도 전달할 수 있습니다. 기본 값의 중요성은 다음 단계에서 볼 수 있습니다.

### 2단계: Context 사용 {/*step-2-use-the-context*/}

React에서 `useContext` Hook과 context를 가져옵니다:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

현재 `Heading` 컴포넌트는 props에서 `level`을 읽습니다:

```js
export default function Heading({ level, children }) {
  // ...
}
```

대신 `level` prop을 제거하고 방금 가져온 `LevelContext`에서 값을 읽습니다:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext`는 Hook입니다. `useState`와 `useReducer`처럼, Hook은 React 컴포넌트 내부에서만 바로 호출할 수 있습니다(루프나 조건문 내부에서는 호출할 수 없습니다). **`useContext`는 React에게 `Heading` 컴포넌트가 `LevelContext`를 읽고 싶다고 알려줍니다.**

이제 `Heading` 컴포넌트에 `level` prop이 없으므로 더 이상 JSX에서 `Heading`에 level prop을 전달할 필요가 없습니다:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

JSX를 업데이트하여 `Section`이 대신 level을 받도록 합니다:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

다음은 작동시키려던 마크업입니다:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

이 예제는 아직 제대로 작동하지 않습니다! 모든 제목이 동일한 크기를 가지는 이유는 **context를 *사용*하고 있지만, 아직 *제공*하지 않았기 때문입니다.** React는 어디서 가져와야 할지 모릅니다!

context를 제공하지 않으면 React는 이전 단계에서 지정한 기본 값을 사용합니다. 이 예제에서는 `createContext`의 인수로 `1`을 지정했으므로 `useContext(LevelContext)`는 `1`을 반환하여 모든 제목을 `<h1>`로 설정합니다. 각 `Section`이 자체 context를 제공하도록 하여 이 문제를 해결해봅시다.

### 3단계: Context 제공 {/*step-3-provide-the-context*/}

`Section` 컴포넌트는 현재 자식을 렌더링합니다:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**자식을 context 제공자로 감싸서** `LevelContext`를 제공합니다:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

이는 React에게 "이 `<Section>` 내부의 어떤 컴포넌트가 `LevelContext`를 요청하면 이 `level`을 제공하라"고 말합니다. 컴포넌트는 UI 트리 상단의 가장 가까운 `<LevelContext.Provider>` 값을 사용합니다.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1
{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

이것은 원래 코드와 동일한 결과를 제공하지만, 각 `Heading` 컴포넌트에 `level` prop을 전달할 필요가 없습니다! 대신, `Heading`은 가장 가까운 `Section`에서 `level`을 "알아냅니다":

1. `level` prop을 `<Section>`에 전달합니다.
2. `Section`은 자식을 `<LevelContext.Provider value={level}>`로 감쌉니다.
3. `Heading`은 `useContext(LevelContext)`를 사용하여 가장 가까운 `LevelContext` 값을 요청합니다.

## 동일한 컴포넌트에서 context 사용 및 제공하기 {/*using-and-providing-context-from-the-same-component*/}

현재는 여전히 각 섹션의 `level`을 수동으로 지정해야 합니다:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

context를 사용하면 상위 컴포넌트에서 정보를 읽을 수 있으므로, 각 `Section`은 상위 `Section`에서 `level`을 읽고 자동으로 `level + 1`을 전달할 수 있습니다. 다음은 이를 수행하는 방법입니다:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

이 변경으로 인해 `<Section>`이나 `<Heading>`에 `level` prop을 전달할 필요가 없습니다:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

이제 `Heading`과 `Section` 모두 `LevelContext`를 읽어 자신이 얼마나 "깊은지"를 파악합니다. 그리고 `Section`은 자식을 `LevelContext`로 감싸서 그 안에 있는 모든 것이 더 "깊은" 레벨에 있음을 지정합니다.

<Note>

이 예제는 중첩된 컴포넌트가 context를 재정의할 수 있는 방법을 시각적으로 보여주기 위해 제목 레벨을 사용합니다. 하지만 context는 다른 많은 사용 사례에도 유용합니다. 전체 하위 트리에 필요한 모든 정보를 전달할 수 있습니다: 현재 색상 테마, 현재 로그인한 사용자 등.

</Note>

## Context는 중간 컴포넌트를 통해 전달됩니다 {/*context-passes-through-intermediate-components*/}

context를 제공하는 컴포넌트와 사용하는 컴포넌트 사이에 원하는 만큼 많은 컴포넌트를 삽입할 수 있습니다. 여기에는 `<div>`와 같은 내장 컴포넌트와 직접 만든 컴포넌트가 포함됩니다.

이 예제에서는 동일한 `Post` 컴포넌트(점선 테두리)가 두 가지 다른 중첩 수준에서 렌더링됩니다. 그 안의 `<Heading>`이 가장 가까운 `<Section>`에서 자동으로 level을 가져오는 것을 확인하세요:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

이를 위해 특별히 한 것은 없습니다. `Section`은 내부 트리에 context를 지정하므로, 어디에 `<Heading>`을 삽입하든 올바른 크기를 가집니다. 위의 샌드박스에서 시도해보세요!

**Context를 사용하면 컴포넌트가 "주변 환경에 적응"하여 _어디에_ (또는 다른 말로 _어떤 context에서_) 렌더링되는지에 따라 다르게 표시할 수 있습니다.**

context의 작동 방식은 [CSS 속성 상속](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance)을 떠올리게 할 수 있습니다. CSS에서는 `<div>`에 `color: blue`를 지정하면, 중간에 `color: green`으로 재정의되지 않는 한, 얼마나 깊이 있든 상관없이 모든 DOM 노드가 그 색상을 상속받습니다. 마찬가지로, React에서는 위에서 오는 context를 재정의하는 유일한 방법은 자식을 다른 값으로 context 제공자로 감싸는 것입니다.

CSS에서는 `color`와 `background-color`와 같은 다른 속성이 서로를 재정의하지 않습니다. 모든 `<div>`의 `color`를 빨간색으로 설정해도 `background-color`에는 영향을 미치지 않습니다. 마찬가지로, **다른 React context는 서로를 재정의하지 않습니다.** `createContext()`로 만든 각 context는 다른 context와 완전히 별개이며, *특정* context를 사용하는 컴포넌트와 제공하는 컴포넌트를 연결합니다. 하나의 컴포넌트는 여러 다른 context를 문제없이 사용할 수 있습니다.

## context를 사용하기 전에 {/*before-you-use-context*/}

context는 사용하기 매우 유혹적입니다! 그러나 이는 과도하게 사용할 가능성도 있다는 것을 의미합니다. **몇 개의 props를 여러 레벨 깊이로 전달해야 한다고 해서 그 정보를 context에 넣어야 한다는 의미는 아닙니다.**

context를 사용하기 전에 고려해야 할 몇 가지 대안이 있습니다:

1. **[props를 전달하는 것](/learn/passing-props-to-a-component)부터 시작하세요.** 컴포넌트가 간단하지 않다면, 여러 컴포넌트를 통해 여러 개의 props를 전달하는 것은 드문 일이 아닙니다. 이는 번거로울 수 있지만, 어떤 컴포넌트가 어떤 데이터를 사용하는지 매우 명확하게 만듭니다! 코드를 유지 관리하는 사람은 props로 데이터 흐름을 명시적으로 만든 것에 감사할 것입니다.
2. **컴포넌트를 추출하고 [JSX를 `children`으로 전달](/learn/passing-props-to-a-component#passing-jsx-as-children)하세요.** 데이터를 사용하지 않고 단지 전달하는 중간 컴포넌트를 통해 많은 레이어를 거쳐 데이터를 전달하는 경우, 이는 종종 중간에 일부 컴포넌트를 추출하는 것을 잊었음을 의미합니다. 예를 들어, `posts`와 같은 데이터 props를 직접 사용하지 않는 시각적 컴포넌트에 전달하는 경우, `<Layout posts={posts} />` 대신 `Layout`이 `children`을 prop으로 받아 `<Layout><Posts posts={posts} /></Layout>`을 렌더링하도록 만드세요. 이는 데이터를 지정하는 컴포넌트와 필요한 컴포넌트 사이의 레이어 수를 줄입니다.

이 두 가지 접근 방식이 잘 작동하지 않는다면, context를 고려하세요.

## context의 사용 사례 {/*use-cases-for-context*/}

* **테마:** 앱이 사용자에게 외관을 변경할 수 있는 기능(예: 다크 모드)을 제공하는 경우, 앱 상단에 context 제공자를 두고 시각적 외관을 조정해야 하는 컴포넌트에서 해당 context를 사용할 수 있습니다.
* **현재 계정:** 많은 컴포넌트가 현재 로그인한 사용자를 알아야 할 수 있습니다. context에 넣으면 트리 어디에서나 읽기 편리합니다. 일부 앱은 여러 계정을 동시에 운영할 수 있도록 합니다(예: 다른 사용자로 댓글을 남기기). 이러한 경우, UI의 일부를 다른 현재 계정 값으로 중첩된 제공자로 감싸는 것이 편리할 수 있습니다.
* **라우팅:** 대부분의 라우팅 솔루션은 현재 경로를 유지하기 위해 내부적으로 context를 사용합니다. 이것이 모든 링크가 활성 상태인지 여부를 "알 수 있는" 이유입니다. 자체 라우터를 구축하는 경우, context를 사용할 수 있습니다.
* **상태 관리:** 앱이 커지면 앱 상단에 더 많은 상태가 생길 수 있습니다. 아래의 많은 먼 컴포넌트가 이를 변경하고자 할 수 있습니다. 복잡한 상태를 관리하고 먼 컴포넌트에 너무 많은 번거로움 없이 전달하기 위해 [reducer와 context를 함께 사용하는 것](/learn/scaling-up-with-reducer-and-context)이 일반적입니다.

context는 정적 값에만 국한되지 않습니다. 다음 렌더링에서 다른 값을 전달하면 React는 아래의 모든 컴포넌트를 업데이트합니다! 이 때문에 context는 종종 상태와 결합하여 사용됩니다.

일반적으로, 트리의 다른 부분에 있는 먼 컴포넌트가 정보를 필요로 하는 경우, context가 도움이 될 것이라는 좋은 신호입니다.

<Recap>

* context는 컴포넌트가 트리 아래의 모든 컴포넌트에 정보를 제공할 수 있게 합니다.
* context를 전달하려면:
  1. `export const MyContext = createContext(defaultValue)`로 생성하고 내보냅니다.
  2. `useContext(MyContext)` Hook을 사용하여 자식 컴포넌트에서 읽습니다.
  3. 부모에서 `<MyContext.Provider value={...}>`로 자식을 감싸서 제공합니다.
* context는 중간 컴포넌트를 통해 전달됩니다.
* context를 사용하면 컴포넌트가 "주변 환경에 적응"할 수 있습니다.
* context를 사용하기 전에 props를 전달하거나 JSX를 `children`으로 전달해보세요.

</Recap>

<Challenges>

#### prop drilling을 context로 대체하기 {/*replace-prop-drilling-with-context*/}

이 예제에서는 체크박스를 토글하면 각 `<PlaceImage>`에 전달되는 `imageSize` prop이 변경됩니다. 체크박스 상태는 최상위 `App` 컴포넌트에 유지되지만, 각 `<PlaceImage>`는 이를 인식해야 합니다.

현재 `App`은 `imageSize`를 `List`에 전달하고, `List`는 각 `Place`에 전달하며, `Place`는 `PlaceImage`에 전달합니다. `imageSize` prop을 제거하고 대신 `App` 컴포넌트에서 직접 `PlaceImage`로 전달합니다.

`Context.js`에서 context를 선언할 수 있습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are몇 가지 이론이 있는데, 그 중 하나는 파란색이 모기를 쫓아내거나 하늘과 천국을 상징한다는 것입니다.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: '2009년에 이 마을은 집을 페인트칠하고 전시회와 예술 설치물을 특징으로 하는 문화 허브로 변모했습니다.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

`imageSize` prop을 모든 컴포넌트에서 제거합니다.

`Context.js`에서 `ImageSizeContext`를 생성하고 내보냅니다. 그런 다음 `List`를 `<ImageSizeContext.Provider value={imageSize}>`로 감싸서 값을 전달하고, `PlaceImage`에서 `useContext(ImageSizeContext)`를 사용하여 읽습니다:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: '몇 가지 이론이 있는데, 그 중 하나는 파란색이 모기를 쫓아내거나 하늘과 천국을 상징한다는 것입니다.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: '2009년에 이 마을은 집을 페인트칠하고 전시회와 예술 설치물을 특징으로 하는 문화 허브로 변모했습니다.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

중간 컴포넌트에서 더 이상 `imageSize`를 전달할 필요가 없다는 점에 주목하세요.

</Solution>

</Challenges>