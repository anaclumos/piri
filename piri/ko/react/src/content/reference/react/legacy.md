---
title: 레거시 React API
---

<Intro>

이 API들은 `react` 패키지에서 내보내지지만, 새로 작성된 코드에서는 사용을 권장하지 않습니다. 권장되는 대안은 링크된 개별 API 페이지를 참조하세요.

</Intro>

---

## 레거시 API {/*legacy-apis*/}

* [`Children`](/reference/react/Children)는 `children` prop으로 받은 JSX를 조작하고 변환할 수 있게 해줍니다. [대안을 참조하세요.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement)는 다른 요소를 시작점으로 사용하여 React 요소를 생성할 수 있게 해줍니다. [대안을 참조하세요.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component)는 JavaScript 클래스로 React 컴포넌트를 정의할 수 있게 해줍니다. [대안을 참조하세요.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement)는 React 요소를 생성할 수 있게 해줍니다. 일반적으로 JSX를 대신 사용합니다.
* [`createRef`](/reference/react/createRef)는 임의의 값을 포함할 수 있는 ref 객체를 생성합니다. [대안을 참조하세요.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement)는 값이 React 요소인지 확인합니다. 일반적으로 [`cloneElement`](/reference/react/cloneElement)와 함께 사용됩니다.
* [`PureComponent`](/reference/react/PureComponent)는 [`Component`](/reference/react/Component)와 유사하지만 동일한 props로 재렌더링을 건너뜁니다. [대안을 참조하세요.](/reference/react/PureComponent#alternatives)


---

## 사용 중단된 API {/*deprecated-apis*/}

<Deprecated>

이 API들은 React의 향후 주요 버전에서 제거될 예정입니다.

</Deprecated>

* [`createFactory`](/reference/react/createFactory)는 특정 유형의 React 요소를 생성하는 함수를 만들 수 있게 해줍니다.