---
title: 트리로서 UI 이해하기
---

<Intro>

당신의 React 앱은 여러 컴포넌트가 서로 중첩되면서 형태를 갖추고 있습니다. React는 어떻게 당신의 앱의 컴포넌트 구조를 추적할까요?

React와 많은 다른 UI 라이브러리들은 UI를 트리로 모델링합니다. 앱을 트리로 생각하는 것은 컴포넌트 간의 관계를 이해하는 데 유용합니다. 이러한 이해는 성능 및 상태 관리와 같은 미래의 개념을 디버깅하는 데 도움이 될 것입니다.

</Intro>

<YouWillLearn>

* React가 컴포넌트 구조를 "보는" 방법
* 렌더 트리가 무엇이며 그것이 유용한 이유
* 모듈 종속성 트리가 무엇이며 그것이 유용한 이유

</YouWillLearn>

## 트리로서의 UI {/*your-ui-as-a-tree*/}

트리는 항목 간의 관계 모델이며 UI는 종종 트리 구조를 사용하여 표현됩니다. 예를 들어, 브라우저는 트리 구조를 사용하여 HTML([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction))과 CSS([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model))를 모델링합니다. 모바일 플랫폼도 트리를 사용하여 뷰 계층 구조를 나타냅니다.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="세 개의 섹션이 가로로 배열된 다이어그램. 첫 번째 섹션에는 'Component A', 'Component B', 'Component C'라는 레이블이 붙은 세 개의 직사각형이 세로로 쌓여 있습니다. 다음 패널로 전환하는 화살표 위에는 'React'라는 레이블이 붙은 React 로고가 있습니다. 중간 섹션에는 루트가 'A'로 레이블된 트리와 두 개의 자식 'B'와 'C'가 있습니다. 마지막 섹션은 'React DOM'이라는 레이블이 붙은 화살표로 전환되며, 브라우저의 와이어프레임이 있고, 8개의 노드로 구성된 트리가 있으며, 중간 섹션의 서브트리를 나타내는 하위 집합만 강조 표시되어 있습니다.">

React는 컴포넌트에서 UI 트리를 생성합니다. 이 예제에서 UI 트리는 DOM에 렌더링하는 데 사용됩니다.
</Diagram>

브라우저와 모바일 플랫폼처럼, React도 트리 구조를 사용하여 React 앱의 컴포넌트 간의 관계를 관리하고 모델링합니다. 이러한 트리는 데이터가 React 앱을 통해 어떻게 흐르는지 이해하고 렌더링 및 앱 크기를 최적화하는 데 유용한 도구입니다.

## 렌더 트리 {/*the-render-tree*/}

컴포넌트의 주요 기능 중 하나는 다른 컴포넌트로 구성할 수 있는 능력입니다. 컴포넌트를 [중첩](/learn/your-first-component#nesting-and-organizing-components)할 때, 우리는 부모와 자식 컴포넌트의 개념을 가지게 되며, 각 부모 컴포넌트는 다른 컴포넌트의 자식일 수 있습니다.

React 앱을 렌더링할 때, 우리는 이 관계를 렌더 트리라고 하는 트리로 모델링할 수 있습니다.

다음은 영감을 주는 인용문을 렌더링하는 React 앱입니다.

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
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

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

```js src/quotes.js
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

<Diagram name="render_tree" height={250} width={500} alt="다섯 개의 노드가 있는 트리 그래프. 각 노드는 컴포넌트를 나타냅니다. 트리의 루트는 App이며, 두 개의 화살표가 'InspirationGenerator'와 'FancyText'로 확장됩니다. 화살표에는 'renders'라는 단어가 적혀 있습니다. 'InspirationGenerator' 노드에는 'FancyText'와 'Copyright' 노드로 향하는 두 개의 화살표가 있습니다.">

React는 렌더된 컴포넌트로 구성된 *렌더 트리*, 즉 UI 트리를 생성합니다.

</Diagram>

예제 앱에서 위의 렌더 트리를 구성할 수 있습니다.

트리는 각 컴포넌트를 나타내는 노드로 구성됩니다. `App`, `FancyText`, `Copyright` 등은 모두 트리의 노드입니다.

React 렌더 트리의 루트 노드는 앱의 [루트 컴포넌트](/learn/importing-and-exporting-components#the-root-component-file)입니다. 이 경우, 루트 컴포넌트는 `App`이며 React가 처음 렌더링하는 컴포넌트입니다. 트리의 각 화살표는 부모 컴포넌트에서 자식 컴포넌트로 향합니다.

<DeepDive>

#### 렌더 트리에서 HTML 태그는 어디에 있나요? {/*where-are-the-html-elements-in-the-render-tree*/}

위의 렌더 트리에서 각 컴포넌트가 렌더링하는 HTML 태그에 대한 언급이 없다는 것을 알 수 있습니다. 이는 렌더 트리가 React [컴포넌트](learn/your-first-component#components-ui-building-blocks)로만 구성되어 있기 때문입니다.

React는 UI 프레임워크로서 플랫폼에 구애받지 않습니다. react.dev에서는 HTML 마크업을 UI 기본 요소로 사용하는 웹에 렌더링하는 예제를 보여줍니다. 그러나 React 앱은 모바일 또는 데스크탑 플랫폼에 렌더링될 수도 있으며, 이는 [UIView](https://developer.apple.com/documentation/uikit/uiview) 또는 [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0)와 같은 다른 UI 기본 요소를 사용할 수 있습니다.

이러한 플랫폼 UI 기본 요소는 React의 일부가 아닙니다. React 렌더 트리는 앱이 어떤 플랫폼에 렌더링되든 상관없이 React 앱에 대한 통찰력을 제공할 수 있습니다.

</DeepDive>

렌더 트리는 React 애플리케이션의 단일 렌더 패스를 나타냅니다. [조건부 렌더링](/learn/conditional-rendering)을 통해 부모 컴포넌트는 전달된 데이터에 따라 다른 자식을 렌더링할 수 있습니다.

앱을 업데이트하여 영감을 주는 인용문 또는 색상을 조건부로 렌더링할 수 있습니다.

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

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

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
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
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
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="여섯 개의 노드가 있는 트리 그래프. 트리의 최상위 노드는 'App'으로 레이블되어 있으며, 두 개의 화살표가 'InspirationGenerator'와 'FancyText'로 확장됩니다. 화살표는 실선이며 'renders'라는 단어가 적혀 있습니다. 'InspirationGenerator' 노드에는 세 개의 화살표가 있습니다. 'FancyText'와 'Color' 노드로 향하는 화살표는 점선이며 'renders?'라는 레이블이 붙어 있습니다. 마지막 화살표는 'Copyright' 노드로 향하며 실선이고 'renders'라는 레이블이 붙어 있습니다.">

조건부 렌더링을 통해, 다른 렌더링 동안 렌더 트리는 다른 컴포넌트를 렌더링할 수 있습니다.

</Diagram>

이 예제에서 `inspiration.type`에 따라 `<FancyText>` 또는 `<Color>`를 렌더링할 수 있습니다. 렌더 트리는 각 렌더 패스마다 다를 수 있습니다.

렌더 트리가 렌더 패스마다 다를 수 있지만, 이러한 트리는 일반적으로 React 앱에서 *최상위* 및 *리프 컴포넌트*가 무엇인지 식별하는 데 유용합니다. 최상위 컴포넌트는 루트 컴포넌트에 가장 가까운 컴포넌트로, 그 아래의 모든 컴포넌트의 렌더링 성능에 영향을 미치며 종종 가장 복잡합니다. 리프 컴포넌트는 트리의 하단에 있으며 자식 컴포넌트가 없고 자주 다시 렌더링됩니다.

이러한 컴포넌트 범주를 식별하는 것은 앱의 데이터 흐름과 성능을 이해하는 데 유용합니다.

## 모듈 종속성 트리 {/*the-module-dependency-tree*/}

React 앱에서 트리로 모델링할 수 있는 또 다른 관계는 앱의 모듈 종속성입니다. 컴포넌트와 로직을 별도의 파일로 [분리](/learn/importing-and-exporting-components#exporting-and-importing-a-component)할 때, 우리는 컴포넌트, 함수 또는 상수를 내보낼 수 있는 [JS 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)을 생성합니다.

모듈 종속성 트리의 각 노드는 모듈이며 각 가지는 해당 모듈의 `import` 문을 나타냅니다.

이전의 Inspirations 앱을 사용하면 모듈 종속성 트리, 또는 간단히 종속성 트리를 만들 수 있습니다.

<Diagram name="module_dependency_tree" height={250} width={658} alt="일곱 개의 노드가 있는 트리 그래프. 각 노드는 모듈 이름으로 레이블이 붙어 있습니다. 트리의 최상위 노드는 'App.js'로 레이블되어 있습니다. 세 개의 화살표가 'InspirationGenerator.js', 'FancyText.js' 및 'Copyright.js' 모듈로 확장되며 화살표에는 'imports'라는 레이블이 붙어 있습니다. 'InspirationGenerator.js' 노드에서 세 개의 화살표가 'FancyText.js', 'Color.js' 및 'inspirations.js' 모듈로 확장됩니다. 화살표에는 'imports'라는 레이블이 붙어 있습니다.">

Inspirations 앱의 모듈 종속성 트리.

</Diagram>

트리의 루트 노드는 루트 모듈, 즉 엔트리 포인트 파일로 알려져 있습니다. 이는 종종 루트 컴포넌트를 포함하는 모듈입니다.

같은 앱의 렌더 트리와 비교할 때, 유사한 구조가 있지만 몇 가지 주목할 만한 차이점이 있습니다:

* 트리를 구성하는 노드는 컴포넌트가 아닌 모듈을 나타냅니다.
* `inspirations.js`와 같은 비컴포넌트 모듈도 이 트리에 나타납니다. 렌더 트리는 컴포넌트만 포함합니다.
* `Copyright.js`는 `App.js` 아래에 나타나지만, 렌더 트리에서는 `Copyright` 컴포넌트가 `InspirationGenerator`의 자식으로 나타납니다. 이는 `InspirationGenerator`가 JSX를 [children props](/learn/passing-props-to-a-component#passing-jsx-as-children)로 받아들이기 때문에 `Copyright`를 자식 컴포넌트로 렌더링하지만 모듈을 가져오지는 않기 때문입니다.

종속성 트리는 React 앱을 실행하는 데 필요한 모듈을 결정하는 데 유용합니다. 프로덕션용 React 앱을 빌드할 때, 일반적으로 클라이언트에 제공할 모든 필요한 JavaScript를 번들링하는 빌드 단계가 있습니다. 이를 담당하는 도구를 [번들러](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem)라고 하며, 번들러는 종속성 트리를 사용하여 포함할 모듈을 결정합니다.

앱이 커짐에 따라 번들 크기도 커지는 경우가 많습니다. 큰 번들 크기는 클라이언트가 다운로드하고 실행하는 데 비용이 많이 듭니다. 큰 번들 크기는 UI가 그려지는 시간을 지연시킬 수 있습니다. 앱의 종속성 트리를 파악하면 이러한 문제를 디버깅하는 데 도움이 될 수 있습니다.

[comment]: <> (조건부 import에 대한 심층 분석도 추가해야 할까요)

<Recap>

* 트리는 엔티티 간의 관계를 나타내는 일반적인 방법입니다. UI를 모델링하는 데 자주 사용됩니다.
* 렌더 트리는 단일 렌더링 동안 React 컴포넌트 간의 중첩 관계를 나타냅니다.
* 조건부 렌더링을 통해 렌더 트리는 다른 렌더링 동안 변경될 수 있습니다. 다른 prop 값으로 컴포넌트는 다른 자식 컴포넌트를 렌더링할 수 있습니다.
* 렌더 트리는 최상위 및 리프 컴포넌트가 무엇인지 식별하는 데 도움이 됩니다. 최상위 컴포넌트는 그 아래의 모든 컴포넌트의 렌더링 성능에 영향을 미치며 리프 컴포넌트는 자주 다시 렌더링됩니다. 이를 식별하는 것은 렌더링 성능을 이해하고 디버깅하는 데 유용합니다.
* 종속성 트리는 React 앱의 모듈 종속성을 나타냅니다.
* 종속성 트리는 빌드 도구가 앱을 제공하기 위해 필요한 코드를 번들링하는 데 사용됩니다.
* 종속성 트리는 페인트 시간을 지연시키는 큰 번들 크기를 디버깅하고 번들링할 코드를 최적화할 기회를 노출하는 데 유용합니다.

</Recap>

[TODO]: <> (도전 과제 추가)