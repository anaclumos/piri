---
title: 'use client'
titleForTitleTag: 'use client' directive
canary: true
---

<Canary>

`'use client'`는 [React Server Components를 사용하는 경우](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)나 이와 호환되는 라이브러리를 빌드하는 경우에만 필요합니다.
</Canary>


<Intro>

`'use client'`는 클라이언트에서 실행되는 코드를 표시할 수 있게 해줍니다.

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `'use client'` {/*use-client*/}

파일 상단에 `'use client'`를 추가하여 모듈과 그 전이적 종속성을 클라이언트 코드로 표시합니다.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Server Component에서 `'use client'`로 표시된 파일을 가져올 때, [호환되는 번들러](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)는 모듈 가져오기를 서버 실행 코드와 클라이언트 실행 코드 간의 경계로 처리합니다.

`RichTextEditor`의 종속성인 `formatDate`와 `Button`은 모듈에 `'use client'` 지시문이 포함되어 있는지 여부에 관계없이 클라이언트에서 평가됩니다. 단일 모듈은 서버 코드에서 가져올 때 서버에서 평가되고 클라이언트 코드에서 가져올 때 클라이언트에서 평가될 수 있습니다.

#### 주의사항 {/*caveats*/}

* `'use client'`는 파일의 맨 처음, 모든 import나 다른 코드 위에 있어야 합니다(주석은 괜찮습니다). 단일 또는 이중 따옴표로 작성해야 하며, 백틱은 사용할 수 없습니다.
* `'use client'` 모듈이 다른 클라이언트 렌더링 모듈에서 가져올 때, 지시문은 아무런 효과가 없습니다.
* 컴포넌트 모듈에 `'use client'` 지시문이 포함된 경우, 해당 컴포넌트의 사용은 클라이언트 컴포넌트로 보장됩니다. 그러나 컴포넌트가 `'use client'` 지시문이 없어도 클라이언트에서 평가될 수 있습니다.
	* 컴포넌트 사용은 모듈에 `'use client'` 지시문이 포함되어 있거나 `'use client'` 지시문이 포함된 모듈의 전이적 종속성일 때 클라이언트 컴포넌트로 간주됩니다. 그렇지 않으면 서버 컴포넌트입니다.
* 클라이언트 평가를 위해 표시된 코드는 컴포넌트에 국한되지 않습니다. 클라이언트 모듈 서브 트리의 모든 코드는 클라이언트로 전송되어 실행됩니다.
* 서버 평가 모듈이 `'use client'` 모듈에서 값을 가져올 때, 값은 React 컴포넌트이거나 [지원되는 직렬화 가능한 prop 값](#passing-props-from-server-to-client-components)이어야 클라이언트 컴포넌트로 전달될 수 있습니다. 다른 사용 사례는 예외를 발생시킵니다.

### `'use client'`가 클라이언트 코드를 표시하는 방법 {/*how-use-client-marks-client-code*/}

React 앱에서 컴포넌트는 종종 별도의 파일 또는 [모듈](/learn/importing-and-exporting-components#exporting-and-importing-a-component)로 분할됩니다.

React Server Components를 사용하는 앱의 경우 기본적으로 서버에서 렌더링됩니다. `'use client'`는 [모듈 종속성 트리](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree)에서 서버-클라이언트 경계를 도입하여 클라이언트 모듈의 서브 트리를 효과적으로 생성합니다.

이를 더 잘 설명하기 위해 다음 React Server Components 앱을 고려해 보겠습니다.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

이 예제 앱의 모듈 종속성 트리에서 `InspirationGenerator.js`의 `'use client'` 지시문은 해당 모듈과 모든 전이적 종속성을 클라이언트 모듈로 표시합니다. 이제 `InspirationGenerator.js`에서 시작하는 서브 트리는 클라이언트 모듈로 표시됩니다.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'`는 React Server Components 앱의 모듈 종속성 트리를 분할하여 `InspirationGenerator.js`와 그 모든 종속성을 클라이언트 렌더링으로 표시합니다.
</Diagram>

렌더링 중에 프레임워크는 루트 컴포넌트를 서버에서 렌더링하고 [렌더 트리](/learn/understanding-your-ui-as-a-tree#the-render-tree)를 계속 진행하며 클라이언트로 표시된 코드에서 가져온 코드를 평가하지 않습니다.

서버에서 렌더링된 렌더 트리의 부분은 클라이언트로 전송됩니다. 클라이언트는 클라이언트 코드가 다운로드된 상태에서 나머지 트리의 렌더링을 완료합니다.

<Diagram name="use_client_render_tree" height={250} width={500} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">
React Server Components 앱의 렌더 트리. `InspirationGenerator`와 그 자식 컴포넌트 `FancyText`는 클라이언트로 표시된 코드에서 내보낸 컴포넌트로 클라이언트 컴포넌트로 간주됩니다.
</Diagram>

다음 정의를 소개합니다:

* **클라이언트 컴포넌트**는 렌더 트리에서 클라이언트에서 렌더링되는 컴포넌트입니다.
* **서버 컴포넌트**는 렌더 트리에서 서버에서 렌더링되는 컴포넌트입니다.

예제 앱을 통해 `App`, `FancyText` 및 `Copyright`는 모두 서버에서 렌더링되며 서버 컴포넌트로 간주됩니다. `InspirationGenerator.js`와 그 전이적 종속성이 클라이언트 코드로 표시되므로 `InspirationGenerator` 컴포넌트와 그 자식 컴포넌트 `FancyText`는 클라이언트 컴포넌트입니다.

<DeepDive>
#### `FancyText`가 어떻게 서버와 클라이언트 컴포넌트가 될 수 있나요? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

위의 정의에 따르면, `FancyText` 컴포넌트는 서버와 클라이언트 컴포넌트 모두입니다. 어떻게 그럴 수 있을까요?

먼저, "컴포넌트"라는 용어가 매우 정확하지 않다는 점을 명확히 합시다. 여기 두 가지 "컴포넌트"를 이해하는 방법이 있습니다:

1. "컴포넌트"는 **컴포넌트 정의**를 의미할 수 있습니다. 대부분의 경우 이는 함수일 것입니다.

```js
// 이것은 컴포넌트 정의입니다
function MyComponent() {
  return <p>My Component</p>
}
```

2. "컴포넌트"는 컴포넌트 정의의 **컴포넌트 사용**을 의미할 수도 있습니다.
```js
import MyComponent from './MyComponent';

function App() {
  // 이것은 컴포넌트 사용입니다
  return <MyComponent />;
}
```

종종 이러한 부정확성은 개념을 설명할 때 중요하지 않지만, 이 경우에는 중요합니다.

서버 또는 클라이언트 컴포넌트에 대해 이야기할 때, 우리는 컴포넌트 사용을 의미합니다.

* 컴포넌트가 `'use client'` 지시문이 있는 모듈에서 정의되었거나 클라이언트 컴포넌트에서 가져와 호출된 경우, 해당 컴포넌트 사용은 클라이언트 컴포넌트입니다.
* 그렇지 않으면, 컴포넌트 사용은 서버 컴포넌트입니다.


<Diagram name="use_client_render_tree" height={150} width={450} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">렌더 트리는 컴포넌트 사용을 설명합니다.</Diagram>

`FancyText`에 대한 질문으로 돌아가서, 컴포넌트 정의에는 `'use client'` 지시문이 없으며 두 가지 사용이 있습니다.

`App`의 자식으로서 `FancyText`의 사용은 서버 컴포넌트로 표시됩니다. `FancyText`가 `InspirationGenerator` 아래에서 가져와 호출될 때, `InspirationGenerator`에 `'use client'` 지시문이 포함되어 있으므로 `FancyText`의 사용은 클라이언트 컴포넌트입니다.

이는 `FancyText`의 컴포넌트 정의가 서버에서 평가되고 클라이언트에서 클라이언트 컴포넌트 사용을 렌더링하기 위해 다운로드된다는 것을 의미합니다.

</DeepDive>

<DeepDive>

#### 왜 `Copyright`는 서버 컴포넌트인가요? {/*why-is-copyright-a-server-component*/}

`Copyright`가 클라이언트 컴포넌트 `InspirationGenerator`의 자식으로 렌더링되기 때문에, 서버 컴포넌트라는 사실에 놀랄 수 있습니다.

`'use client'`는 _모듈 종속성 트리_에서 서버와 클라이언트 코드 간의 경계를 정의합니다, 렌더 트리가 아닙니다.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'`는 모듈 종속성 트리에서 서버와 클라이언트 코드 간의 경계를 정의합니다.
</Diagram>

모듈 종속성 트리에서 `App.js`가 `Copyright`를 `Copyright.js` 모듈에서 가져와 호출하는 것을 볼 수 있습니다. `Copyright.js`에 `'use client'` 지시문이 포함되어 있지 않으므로 컴포넌트 사용은 서버에서 렌더링됩니다. `App`은 루트 컴포넌트이므로 서버에서 렌더링됩니다.

클라이언트 컴포넌트는 JSX를 props로 전달할 수 있기 때문에 서버 컴포넌트를 렌더링할 수 있습니다. 이 경우, `InspirationGenerator`는 [children](/learn/passing-props-to-a-component#passing-jsx-as-children)으로 `Copyright`를 받습니다. 그러나 `InspirationGenerator` 모듈은 `Copyright` 모듈을 직접 가져오거나 컴포넌트를 호출하지 않습니다. 모든 것은 `App`에 의해 수행됩니다. 실제로 `Copyright` 컴포넌트는 `InspirationGenerator`가 렌더링을 시작하기 전에 완전히 실행됩니다.

부모-자식 렌더 관계가 동일한 렌더 환경을 보장하지 않는다는 점을 기억하세요.

</DeepDive>

### `'use client'`를 언제 사용해야 하나요? {/*when-to-use-use-client*/}

`'use client'`를 사용하면 컴포넌트가 클라이언트 컴포넌트인지 결정할 수 있습니다. 서버 컴포넌트가 기본값이므로, 클라이언트 렌더링이 필요한 경우를 결정하기 위해 서버 컴포넌트의 장점과 제한 사항을 간략히 살펴보겠습니다.

간단히 말해, 서버 컴포넌트에 대해 이야기하지만, 동일한 원칙이 서버에서 실행되는 앱의 모든 코드에 적용됩니다.

#### 서버 컴포넌트의 장점 {/*advantages*/}
* 서버 컴포넌트는 클라이언트가 전송하고 실행하는 코드의 양을 줄일 수 있습니다. 클라이언트 모듈만 클라이언트에 의해 번들되고 평가됩니다.
* 서버 컴포넌트는 서버에서 실행되는 이점을 누릴 수 있습니다. 로컬 파일 시스템에 접근할 수 있으며 데이터 가져오기 및 네트워크 요청에 대한 지연 시간이 낮을 수 있습니다.

#### 서버 컴포넌트의 제한 사항 {/*limitations*/}
* 서버 컴포넌트는 상호작용을 지원할 수 없습니다. 이벤트 핸들러는 클라이언트에 의해 등록되고 트리거되어야 합니다.
	* 예를 들어, `onClick`과 같은 이벤트 핸들러는 클라이언트 컴포넌트에서만 정의될 수 있습니다.
* 서버 컴포넌트는 대부분의 Hooks를 사용할 수 없습니다.
	* 서버 컴포넌트가 렌더링될 때, 그 출력은 클라이언트가 렌더링할 컴포넌트 목록에 불과합니다. 서버 컴포넌트는 렌더링 후 메모리에 남아 있지 않으며 자체 상태를 가질 수 없습니다.

### 서버 컴포넌트가 반환하는 직렬화 가능한 타입 {/*serializable-types*/}

모든 React 앱에서와 같이, 부모 컴포넌트는 자식 컴포넌트에 데이터를 전달합니다. 서로 다른 환경에서 렌더링되므로, 서버 컴포넌트에서 클라이언트 컴포넌트로 데이터를 전달할 때는 추가적인 고려가 필요합니다.

서버 컴포넌트에서 클라이언트 컴포넌트로 전달되는 prop 값은 직렬화 가능해야 합니다.

직렬화 가능한 props에는 다음이 포함됩니다:
* 원시 타입
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)를 통해 전역 Symbol 레지스트리에 등록된 심볼만 해당
* 직렬화 가능한 값을 포함하는 반복 가능한 객체
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 및 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [객체](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): [객체 초기화자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)로 생성된 직렬화 가능한 속성을 가진 객체
* [서버 액션](/reference/rsc/use-server)인 함수
* 클라이언트 또는 서버 컴포넌트 요소(JSX)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

특히, 다음은 지원되지 않습니다:
* [함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)로 클라이언트 표시 모듈에서 내보내지 않거나 [`'use server'`](/reference/rsc/use-server)로 표시되지 않은 함수
* [클래스](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 모든 클래스의 인스턴스인 객체(언급된 내장 객체 제외) 또는 [null 프로토타입](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)을 가진 객체
* 전역적으로 등록되지 않은 심볼, 예: `Symbol('my new symbol')`


## 사용법 {/*usage*/}

### 상호작용 및 상태를 사용한 빌드 {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

`Counter`는 `useState` Hook과 값을 증가 또는 감소시키기 위한 이벤트 핸들러가 필요하므로, 이 컴포넌트는 클라이언트 컴포넌트여야 하며 상단에 `'use client'` 지시문이 필요합니다.

반면, 상호작용 없이 UI를 렌더링하는 컴포넌트는 클라이언트 컴포넌트가 필요하지 않습니다.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

예를 들어, `Counter`의 부모 컴포넌트인 `CounterContainer`는 상호작용이 필요 없고 상태를 사용하지 않으므로 `'use client'`가 필요하지 않습니다. 또한, `CounterContainer`는 서버에서 로컬 파일 시스템을 읽기 때문에 서버 컴포넌트여야 합니다. 이는 서버 컴포넌트에서만 가능합니다.

서버 또는 클라이언트 전용 기능을 사용하지 않는 컴포넌트도 있으며, 어디에서 렌더링되는지에 대해 무관할 수 있습니다. 앞서 예제에서 `FancyText`가 그런 컴포넌트 중 하나입니다.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

이 경우, `'use client'` 지시문을 추가하지 않으면 `FancyText`의 _출력_이 서버 컴포넌트에서 참조될 때 브라우저로 전송됩니다. 앞서 영감 앱 예제에서 보여준 것처럼, `FancyText`는 가져오고 사용되는 위치에 따라 서버 또는 클라이언트 컴포넌트로 사용됩니다.

하지만 `FancyText`의 HTML 출력이 소스 코드(종속성 포함)에 비해 크다면, 항상 클라이언트 컴포넌트로 강제하는 것이 더 효율적일 수 있습니다. 긴 SVG 경로 문자열을 반환하는 컴포넌트는 클라이언트 컴포넌트로 강제하는 것이 더 효율적일 수 있는 한 가지 경우입니다.

### 클라이언트 API 사용 {/*using-client-apis*/}

React 앱은 웹 스토리지, 오디오 및 비디오 조작, 장치 하드웨어와 같은 클라이언트 전용 API를 사용할 수 있습니다. [기타](https://developer.mozilla.org/en-US/docs/Web/API) API도 있습니다.

이 예제에서 컴포넌트는 [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 요소를 조작하기 위해 [DOM API](https://developer.mozilla.org/en-US/docs/Glossary/DOM)를 사용합니다. 이러한 API는 브라우저에서만 사용할 수 있으므로 클라이언트 컴포넌트로 표시해야 합니다.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### 서드파티 라이브러리 사용 {/*using-third-party-libraries*/}

React 앱에서 공통 UI 패턴이나 로직을 처리하기 위해 서드파티 라이브러리를 자주 활용합니다.

이러한 라이브러리는 컴포넌트 Hooks 또는 클라이언트 API에 의존할 수 있습니다. 다음 React API를 사용하는 서드파티 컴포넌트는 클라이언트에서 실행되어야 합니다:
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) 및 [`react-dom`](/reference/react-dom/hooks) Hooks, [`use`](/reference/react/use) 및 [`useId`](/reference/react/useId) 제외
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* 클라이언트 API를 사용하는 경우, 예: DOM 삽입 또는 네이티브 플랫폼 뷰

이러한 라이브러리가 React Server Components와 호환되도록 업데이트된 경우, 이미 `'use client'` 마커를 포함하고 있어 서버 컴포넌트에서 직접 사용할 수 있습니다. 라이브러리가 업데이트되지 않았거나 클라이언트에서만 지정할 수 있는 이벤트 핸들러와 같은 props가 필요한 경우, 서드파티 클라이언트 컴포넌트와 서버 컴포넌트 사이에 자체 클라이언트 컴포넌트 파일을 추가해야 할 수 있습니다.

[TODO]: <> (문제 해결 - 사용 사례 필요)