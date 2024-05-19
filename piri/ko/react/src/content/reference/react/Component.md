---
title: Component
---

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 권장합니다. [마이그레이션 방법을 참조하세요.](#alternatives)

</Pitfall>

<Intro>

`Component`는 [JavaScript 클래스](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)로 정의된 React 컴포넌트의 기본 클래스입니다. 클래스 컴포넌트는 여전히 React에서 지원되지만, 새로운 코드에서는 사용을 권장하지 않습니다.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `Component` {/*component*/}

React 컴포넌트를 클래스로 정의하려면, 내장된 `Component` 클래스를 확장하고 [`render` 메서드를 정의합니다:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`render` 메서드만 필수이며, 다른 메서드는 선택 사항입니다.

[아래에서 더 많은 예제를 참조하세요.](#usage)

---

### `context` {/*context*/}

클래스 컴포넌트의 [context](/learn/passing-data-deeply-with-context)는 `this.context`로 사용할 수 있습니다. 이는 [`static contextType`](#static-contexttype) (현대적) 또는 [`static contextTypes`](#static-contexttypes) (폐기 예정)을 사용하여 *어떤* 컨텍스트를 받을지 지정한 경우에만 사용할 수 있습니다.

클래스 컴포넌트는 한 번에 하나의 컨텍스트만 읽을 수 있습니다.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

클래스 컴포넌트에서 `this.context`를 읽는 것은 함수 컴포넌트에서 [`useContext`](/reference/react/useContext)를 사용하는 것과 동일합니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

클래스 컴포넌트에 전달된 props는 `this.props`로 사용할 수 있습니다.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

클래스 컴포넌트에서 `this.props`를 읽는 것은 함수 컴포넌트에서 [props를 선언하는 것](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component)과 동일합니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다. [대신 `createRef`를 사용하세요.](/reference/react/createRef)

</Deprecated>

이 컴포넌트에 대한 [레거시 문자열 refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)에 접근할 수 있게 해줍니다.

---

### `state` {/*state*/}

클래스 컴포넌트의 상태는 `this.state`로 사용할 수 있습니다. `state` 필드는 객체여야 합니다. 상태를 직접 변경하지 마세요. 상태를 변경하려면 새로운 상태로 `setState`를 호출하세요.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

클래스 컴포넌트에서 `state`를 정의하는 것은 함수 컴포넌트에서 [`useState`](/reference/react/useState)를 호출하는 것과 동일합니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)는 클래스 컴포넌트가 *마운트*되기 전에 실행됩니다. 일반적으로, constructor는 React에서 두 가지 목적으로만 사용됩니다. 상태를 선언하고 클래스 메서드를 클래스 인스턴스에 바인딩하는 것입니다:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

현대 JavaScript 문법을 사용하면, constructor는 거의 필요하지 않습니다. 대신, [공개 클래스 필드 문법](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)을 사용하여 위의 코드를 다시 작성할 수 있습니다. 이 문법은 현대 브라우저와 [Babel](https://babeljs.io/)과 같은 도구에서 지원됩니다:

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

constructor는 부작용이나 구독을 포함해서는 안 됩니다.

#### Parameters {/*constructor-parameters*/}

* `props`: 컴포넌트의 초기 props.

#### Returns {/*constructor-returns*/}

`constructor`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*constructor-caveats*/}

* constructor에서 부작용이나 구독을 실행하지 마세요. 대신 [`componentDidMount`](#componentdidmount)를 사용하세요.

* constructor 내부에서 다른 문장보다 먼저 `super(props)`를 호출해야 합니다. 그렇지 않으면, constructor가 실행되는 동안 `this.props`가 `undefined`가 되어 혼란을 초래하고 버그를 유발할 수 있습니다.

* constructor는 [`this.state`](#state)를 직접 할당할 수 있는 유일한 장소입니다. 다른 모든 메서드에서는 [`this.setState()`](#setstate)를 사용해야 합니다. constructor에서 `setState`를 호출하지 마세요.

* [서버 렌더링](/reference/react-dom/server)을 사용할 때, constructor는 서버에서도 실행되며, 그 다음에 [`render`](#render) 메서드가 실행됩니다. 그러나 `componentDidMount`나 `componentWillUnmount`와 같은 생명주기 메서드는 서버에서 실행되지 않습니다.

* [Strict Mode](/reference/react/StrictMode)가 켜져 있으면, 개발 환경에서 React는 constructor를 두 번 호출하고 인스턴스 중 하나를 버립니다. 이는 `constructor`에 부작용이 있는지 확인하고 이를 `constructor` 외부로 이동해야 함을 알리는 데 도움이 됩니다.

<Note>

함수 컴포넌트에는 `constructor`에 대한 정확한 대응이 없습니다. 함수 컴포넌트에서 상태를 선언하려면 [`useState`](/reference/react/useState)를 호출하세요. 초기 상태를 다시 계산하지 않으려면, [함수에 `useState`를 전달하세요.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

`componentDidCatch`를 정의하면, 자식 컴포넌트(원거리 자식 포함)가 렌더링 중에 오류를 발생시킬 때 React가 이를 호출합니다. 이를 통해 프로덕션에서 오류 보고 서비스에 해당 오류를 기록할 수 있습니다.

일반적으로, 이는 상태를 업데이트하고 사용자에게 오류 메시지를 표시할 수 있는 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)와 함께 사용됩니다. 이러한 메서드를 가진 컴포넌트를 *오류 경계*라고 합니다.

[예제를 참조하세요.](#catching-rendering-errors-with-an-error-boundary)

#### Parameters {/*componentdidcatch-parameters*/}

* `error`: 발생한 오류. 실제로는 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 인스턴스인 경우가 많지만, JavaScript는 문자열이나 `null`과 같은 값을 [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)할 수 있기 때문에 보장되지 않습니다.

* `info`: 오류에 대한 추가 정보를 포함하는 객체입니다. `componentStack` 필드는 오류를 발생시킨 컴포넌트와 모든 부모 컴포넌트의 이름 및 소스 위치가 포함된 스택 추적을 포함합니다. 프로덕션에서는 컴포넌트 이름이 축약됩니다. 프로덕션 오류 보고를 설정하면, 일반 JavaScript 오류 스택에 대해 소스 맵을 사용하여 컴포넌트 스택을 디코딩할 수 있습니다.

#### Returns {/*componentdidcatch-returns*/}

`componentDidCatch`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*componentdidcatch-caveats*/}

* 과거에는 `componentDidCatch` 내부에서 `setState`를 호출하여 UI를 업데이트하고 대체 오류 메시지를 표시하는 것이 일반적이었습니다. 이는 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)를 정의하는 것으로 대체되었습니다.

* React의 프로덕션 및 개발 빌드는 `componentDidCatch`가 오류를 처리하는 방식에 약간의 차이가 있습니다. 개발 환경에서는 오류가 `window`로 버블링되므로, `window.onerror` 또는 `window.addEventListener('error', callback)`이 `componentDidCatch`에 의해 잡힌 오류를 가로챌 수 있습니다. 반면, 프로덕션에서는 오류가 버블링되지 않으므로, 상위 오류 핸들러는 `componentDidCatch`에 의해 명시적으로 잡히지 않은 오류만 받게 됩니다.

<Note>

함수 컴포넌트에는 아직 `componentDidCatch`에 대한 직접적인 대응이 없습니다. 클래스 컴포넌트를 만들지 않으려면, 위와 같은 단일 `ErrorBoundary` 컴포넌트를 작성하여 앱 전체에서 사용할 수 있습니다. 또는 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 패키지를 사용할 수 있습니다.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

`componentDidMount` 메서드를 정의하면, 컴포넌트가 화면에 추가 *(마운트)*될 때 React가 이를 호출합니다. 이는 데이터 가져오기, 구독 설정 또는 DOM 노드 조작을 시작하는 일반적인 장소입니다.

`componentDidMount`를 구현하면, 버그를 피하기 위해 다른 생명주기 메서드를 구현해야 할 때가 많습니다. 예를 들어, `componentDidMount`가 일부 상태나 props를 읽는 경우, 해당 변경 사항을 처리하기 위해 [`componentDidUpdate`](#componentdidupdate)를 구현해야 하며, `componentDidMount`가 수행한 작업을 정리하기 위해 [`componentWillUnmount`](#componentwillunmount)를 구현해야 합니다.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[더 많은 예제를 참조하세요.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentdidmount-parameters*/}

`componentDidMount`는 매개변수를 받지 않습니다.

#### Returns {/*componentdidmount-returns*/}

`componentDidMount`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*componentdidmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode)가 켜져 있으면, 개발 환경에서 React는 `componentDidMount`를 호출한 다음, 즉시 [`componentWillUnmount`](#componentwillunmount)를 호출하고, 다시 `componentDidMount`를 호출합니다. 이는 `componentWillUnmount`를 구현하지 않았거나, `componentDidMount`가 수행한 작업을 완전히 "반영"하지 않는 경우 이를 알리는 데 도움이 됩니다.

- `componentDidMount`에서 [`setState`](#setstate)를 즉시 호출할 수 있지만, 가능한 한 피하는 것이 좋습니다. 이는 추가 렌더링을 트리거하지만, 브라우저가 화면을 업데이트하기 전에 발생합니다. 이는 이 경우 [`render`](#render)가 두 번 호출되더라도 사용자가 중간 상태를 보지 않도록 보장합니다. 이 패턴은 종종 성능 문제를 일으키므로 주의해서 사용해야 합니다. 대부분의 경우, 초기 상태를 [`constructor`](#constructor)에서 할당할 수 있어야 합니다. 그러나 모달 및 툴팁과 같이 DOM 노드를 측정한 후 크기나 위치에 따라 무언가를 렌더링해야 하는 경우에는 필요할 수 있습니다.

<Note>

클래스 컴포넌트에서 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`를 함께 정의하는 것은 함수 컴포넌트에서 [`useEffect`](/reference/react/useEffect)를 호출하는 것과 동일합니다. 코드가 브라우저 페인트 전에 실행되는 것이 중요한 드문 경우에는 [`useLayoutEffect`](/reference/react/useLayoutEffect)가 더 가까운 대응입니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

`componentDidUpdate` 메서드를 정의하면, 컴포넌트가 업데이트된 props나 상태로 다시 렌더링된 직후에 React가 이를 호출합니다. 이 메서드는 초기 렌더링에는 호출되지 않습니다.

업데이트 후 DOM을 조작하는 데 사용할 수 있습니다. 또한, 현재 props를 이전 props와 비교하여 네트워크 요청이 필요하지 않은 경우 네트워크 요청을 수행하는 일반적인 장소입니다. 일반적으로, [`componentDidMount`](#componentdidmount) 및 [`componentWillUnmount`](#componentwillunmount)와 함께 사용됩니다.

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[더 많은 예제를 참조하세요.](#adding-lifecycle-methods-to-a-class-component)


#### Parameters {/*componentdidupdate-parameters*/}

* `prevProps`: 업데이트 전의 props. `prevProps`를 [`this.props`](#props)와 비교하여 무엇이 변경되었는지 확인합니다.

* `prevState`: 업데이트 전의 상태. `prevState`를 [`this.state`](#state)와 비교하여 무엇이 변경되었는지 확인합니다.

* `snapshot`: [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현한 경우, `snapshot`은 해당 메서드에서 반환한 값을 포함합니다. 그렇지 않으면 `undefined`입니다.

#### Returns {/*componentdidupdate-returns*/}

`componentDidUpdate`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*componentdidupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의되어 있고 `false`를 반환하면 `componentDidUpdate`는 호출되지 않습니다.

- `componentDidUpdate` 내부의 로직은 일반적으로 `this.props`와 `prevProps`, `this.state`와 `prevState`를 비교하는 조건문으로 감싸야 합니다. 그렇지 않으면 무한 루프를 생성할 위험이 있습니다.

- `componentDidUpdate`에서 [`setState`](#setstate)를 즉시 호출할 수 있지만, 가능한 한 피하는 것이 좋습니다. 이는 추가 렌더링을 트리거하지만, 브라우저가 화면을 업데이트하기 전에 발생합니다. 이는 이 경우 [`render`](#render)가 두 번 호출되더라도 사용자가 중간 상태를 보지 않도록 보장합니다. 이 패턴은 종종 성능 문제를 일으키지만, 모달 및 툴팁과 같이 DOM 노드를 측정한 후 크기나 위치에 따라 무언가를 렌더링해야 하는 드문 경우에는 필요할 수 있습니다.

<Note>

클래스 컴포넌트에서 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`를 함께 정의하는 것은 함수 컴포넌트에서 [`useEffect`](/reference/react/useEffect)를 호출하는 것과 동일합니다. 코드가 브라우저 페인트 전에 실행되는 것이 중요한 드문 경우에는 [`useLayoutEffect`](/reference/react/useLayoutEffect)가 더 가까운 대응입니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

이 API는 `componentWillMount`에서 [`UNSAFE_componentWillMount`](#unsafe_componentwillmount)로 이름이 변경되었습니다. 이전 이름은 폐기되었습니다. React의 향후 주요 버전에서는 새 이름만 작동합니다.

[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 실행하여 컴포넌트를 자동으로 업데이트하세요.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

이 API는 `componentWillReceiveProps`에서 [`UNSAFE_component
WillReceiveProps`](#unsafe_componentwillreceiveprops)로 이름이 변경되었습니다. 이전 이름은 폐기되었습니다. React의 향후 주요 버전에서는 새 이름만 작동합니다.

[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 실행하여 컴포넌트를 자동으로 업데이트하세요.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

이 API는 `componentWillUpdate`에서 [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)로 이름이 변경되었습니다. 이전 이름은 폐기되었습니다. React의 향후 주요 버전에서는 새 이름만 작동합니다.

[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 실행하여 컴포넌트를 자동으로 업데이트하세요.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

`componentWillUnmount` 메서드를 정의하면, 컴포넌트가 화면에서 제거 *(언마운트)*되기 전에 React가 이를 호출합니다. 이는 데이터 가져오기를 취소하거나 구독을 제거하는 일반적인 장소입니다.

`componentWillUnmount` 내부의 로직은 [`componentDidMount`](#componentdidmount) 내부의 로직을 "반영"해야 합니다. 예를 들어, `componentDidMount`가 구독을 설정하면, `componentWillUnmount`는 해당 구독을 정리해야 합니다. `componentWillUnmount`의 정리 로직이 일부 props나 상태를 읽는 경우, 일반적으로 [`componentDidUpdate`](#componentdidupdate)를 구현하여 이전 props와 상태에 해당하는 리소스(예: 구독)를 정리해야 합니다.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[더 많은 예제를 참조하세요.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentwillunmount-parameters*/}

`componentWillUnmount`는 매개변수를 받지 않습니다.

#### Returns {/*componentwillunmount-returns*/}

`componentWillUnmount`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*componentwillunmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode)가 켜져 있으면, 개발 환경에서 React는 [`componentDidMount`](#componentdidmount)를 호출한 다음, 즉시 `componentWillUnmount`를 호출하고, 다시 `componentDidMount`를 호출합니다. 이는 `componentWillUnmount`를 구현하지 않았거나, `componentDidMount`가 수행한 작업을 완전히 "반영"하지 않는 경우 이를 알리는 데 도움이 됩니다.

<Note>

클래스 컴포넌트에서 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`를 함께 정의하는 것은 함수 컴포넌트에서 [`useEffect`](/reference/react/useEffect)를 호출하는 것과 동일합니다. 코드가 브라우저 페인트 전에 실행되는 것이 중요한 드문 경우에는 [`useLayoutEffect`](/reference/react/useLayoutEffect)가 더 가까운 대응입니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

컴포넌트를 강제로 다시 렌더링합니다.

일반적으로, 이는 필요하지 않습니다. 컴포넌트의 [`render`](#render) 메서드가 [`this.props`](#props), [`this.state`](#state), 또는 [`this.context`](#context)에서만 읽는 경우, 컴포넌트나 부모 컴포넌트에서 [`setState`](#setstate)를 호출하면 자동으로 다시 렌더링됩니다. 그러나 컴포넌트의 `render` 메서드가 외부 데이터 소스에서 직접 읽는 경우, 해당 데이터 소스가 변경될 때 사용자 인터페이스를 업데이트하도록 React에 알려야 합니다. `forceUpdate`는 이를 수행할 수 있게 해줍니다.

`forceUpdate`의 모든 사용을 피하고 `render`에서 `this.props`와 `this.state`만 읽도록 하세요.

#### Parameters {/*forceupdate-parameters*/}

* **optional** `callback` 지정된 경우, React는 업데이트가 커밋된 후 제공된 `callback`을 호출합니다.

#### Returns {/*forceupdate-returns*/}

`forceUpdate`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*forceupdate-caveats*/}

- `forceUpdate`를 호출하면, React는 [`shouldComponentUpdate`](#shouldcomponentupdate)를 호출하지 않고 다시 렌더링합니다.

<Note>

외부 데이터 소스를 읽고 `forceUpdate`로 클래스 컴포넌트를 다시 렌더링하는 것은 함수 컴포넌트에서 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)로 대체되었습니다.

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다. [대신 `Context.Provider`를 사용하세요.](/reference/react/createContext#provider)

</Deprecated>

이 컴포넌트가 제공하는 [레거시 컨텍스트](https://reactjs.org/docs/legacy-context.html)의 값을 지정할 수 있게 해줍니다.

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

`getSnapshotBeforeUpdate`를 구현하면, React가 DOM을 업데이트하기 직전에 이를 호출합니다. 이를 통해 컴포넌트가 DOM에서 일부 정보를 캡처할 수 있습니다(예: 스크롤 위치). 이 생명주기 메서드에서 반환된 값은 [`componentDidUpdate`](#componentdidupdate) 메서드의 매개변수로 전달됩니다.

예를 들어, 업데이트 중에 스크롤 위치를 유지해야 하는 채팅 스레드와 같은 UI에서 이를 사용할 수 있습니다:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 목록에 새 항목을 추가하고 있습니까?
    // 스크롤 위치를 캡처하여 나중에 스크롤을 조정할 수 있습니다.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 스냅샷 값이 있는 경우, 새 항목을 추가한 것입니다.
    // 이러한 새 항목이 이전 항목을 뷰에서 밀어내지 않도록 스크롤을 조정합니다.
    // (여기서 snapshot은 getSnapshotBeforeUpdate에서 반환된 값입니다)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

위 예제에서, `getSnapshotBeforeUpdate`에서 `scrollHeight` 속성을 직접 읽는 것이 중요합니다. 이는 [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), 또는 [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)에서 읽는 것이 안전하지 않습니다. 이러한 메서드가 호출된 후 React가 DOM을 업데이트하기까지 잠재적인 시간 차이가 있기 때문입니다.

#### Parameters {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: 업데이트 전의 props. `prevProps`를 [`this.props`](#props)와 비교하여 무엇이 변경되었는지 확인합니다.

* `prevState`: 업데이트 전의 상태. `prevState`를 [`this.state`](#state)와 비교하여 무엇이 변경되었는지 확인합니다.

#### Returns {/*getsnapshotbeforeupdate-returns*/}

스냅샷 값으로 원하는 모든 유형의 값을 반환하거나 `null`을 반환해야 합니다. 반환된 값은 [`componentDidUpdate`](#componentdidupdate)의 세 번째 인수로 전달됩니다.

#### Caveats {/*getsnapshotbeforeupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의되어 있고 `false`를 반환하면 `getSnapshotBeforeUpdate`는 호출되지 않습니다.

<Note>

현재, 함수 컴포넌트에는 `getSnapshotBeforeUpdate`에 대한 대응이 없습니다. 이 사용 사례는 매우 드물지만, 필요하다면 클래스 컴포넌트를 작성해야 합니다.

</Note>

---

### `render()` {/*render*/}

`render` 메서드는 클래스 컴포넌트에서 유일하게 필수적인 메서드입니다.

`render` 메서드는 화면에 표시할 내용을 지정해야 합니다. 예를 들어:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React는 언제든지 `render`를 호출할 수 있으므로 특정 시간에 실행된다고 가정해서는 안 됩니다. 일반적으로, `render` 메서드는 [JSX](/learn/writing-markup-with-jsx)의 일부를 반환해야 하지만, 몇 가지 [다른 반환 유형](#render-returns)도 지원됩니다(예: 문자열). 반환된 JSX를 계산하기 위해, `render` 메서드는 [`this.props`](#props), [`this.state`](#state), 및 [`this.context`](#context)를 읽을 수 있습니다.

`render` 메서드는 순수 함수로 작성해야 합니다. 즉, props, state, 및 context가 동일하면 동일한 결과를 반환해야 합니다. 또한, 부작용(예: 구독 설정)이나 브라우저 API와의 상호작용을 포함해서는 안 됩니다. 부작용은 이벤트 핸들러나 [`componentDidMount`](#componentdidmount)와 같은 메서드에서 발생해야 합니다.

#### Parameters {/*render-parameters*/}

`render`는 매개변수를 받지 않습니다.

#### Returns {/*render-returns*/}

`render`는 유효한 React 노드를 반환할 수 있습니다. 여기에는 `<div />`와 같은 React 요소, 문자열, 숫자, [포털](/reference/react-dom/createPortal), 빈 노드(`null`, `undefined`, `true`, 및 `false`), 및 React 노드 배열이 포함됩니다.

#### Caveats {/*render-caveats*/}

- `render`는 props, state, 및 context의 순수 함수로 작성해야 합니다. 부작용이 있어서는 안 됩니다.

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의되어 있고 `false`를 반환하면 `render`는 호출되지 않습니다.

- [Strict Mode](/reference/react/StrictMode)가 켜져 있으면, React는 개발 환경에서 `render`를 두 번 호출하고 결과 중 하나를 버립니다. 이는 `render` 메서드에서 부작용이 발생하는지 확인하고 이를 `render` 메서드 외부로 이동해야 함을 알리는 데 도움이 됩니다.

- `render` 호출과 후속 [`componentDidMount`](#componentdidmount) 또는 [`componentDidUpdate`](#componentdidupdate) 호출 간에 일대일 대응이 없습니다. 일부 `render` 호출 결과는 React가 유익하다고 판단할 때 버릴 수 있습니다.

---

### `setState(nextState, callback?)` {/*setstate*/}

React 컴포넌트의 상태를 업데이트하려면 `setState`를 호출하세요.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState`는 컴포넌트 상태에 대한 변경 사항을 대기열에 추가합니다. 이는 React에 이 컴포넌트와 자식 컴포넌트가 새로운 상태로 다시 렌더링되어야 함을 알립니다. 이는 상호작용에 대한 응답으로 사용자 인터페이스를 업데이트하는 주요 방법입니다.

<Pitfall>

`setState`를 호출해도 이미 실행 중인 코드의 현재 상태는 변경되지 **않습니다**:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // 여전히 "Taylor"!
}
```

이는 *다음* 렌더링부터 `this.state`가 반환하는 값에만 영향을 미칩니다.

</Pitfall>

또한, `setState`에 함수를 전달할 수 있습니다. 이를 통해 이전 상태를 기반으로 상태를 업데이트할 수 있습니다:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

이렇게 할 필요는 없지만, 동일한 이벤트 동안 상태를 여러 번 업데이트하려는 경우 유용합니다.

#### Parameters {/*setstate-parameters*/}

* `nextState`: 객체 또는 함수.
  * `nextState`로 객체를 전달하면, 이는 `this.state`에 얕게 병합됩니다.
  * `nextState`로 함수를 전달하면, 이는 _업데이터 함수_로 처리됩니다. 이는 순수해야 하며, 대기 중인 상태와 props를 인수로 받아야 하며, `this.state`에 얕게 병합할 객체를 반환해야 합니다. React는 업데이터 함수를 대기열에 넣고 컴포넌트를 다시 렌더링합니다. 다음 렌더링 동안, React는 모든 대기 중인 업데이터를 이전 상태에 적용하여 다음 상태를 계산합니다.

* **optional** `callback`: 지정된 경우, React는 업데이트가 커밋된 후 제공된 `callback`을 호출합니다.

#### Returns {/*setstate-returns*/}

`setState`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*setstate-caveats*/}

- `setState`를 *요청*으로 생각하고 컴포넌트를 즉시 업데이트하는 명령으로 생각하지 마세요. 여러 컴포넌트가 이벤트에 응답하여 상태를 업데이트하면, React는 업데이트를 일괄 처리하고 이벤트가 끝날 때 한 번에 다시 렌더링합니다. 특정 상태 업데이트를 동기적으로 적용해야 하는 드문 경우에는 [`flushSync`](/reference/react-dom/flushSync)로 감쌀 수 있지만, 이는 성능에 영향을 미칠 수 있습니다.

- `setState`는 `this.state`를 즉시 업데이트하지 않습니다. 이는 `setState`를 호출한 직후 `this.state`를 읽는 것이 잠재적인 함정이 될 수 있습니다. 대신, [`componentDidUpdate`](#componentdidupdate) 또는 setState `callback` 인수를 사용하세요. 둘 다 업데이트가 적용된 후에 실행되는 것이 보장됩니다. 이전 상태를 기반으로 상태를 설정해야 하는 경우, 위에서 설명한 대로 `nextState`에 함수를 전달할 수 있습니다.

<Note>

클래스 컴포넌트에서 `setState`를 호출하는 것은 함수 컴포넌트에서 [`set` 함수](/reference/react/useState#setstate)를 호출하는 것과 유사합니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

`shouldComponentUpdate`를 정의하면, React는 다시 렌더링을 건너뛸 수 있는지 여부를 결정하기 위해 이를 호출합니다.

직접 작성하고 싶다면, `this.props`와 `nextProps`, `this.state`와 `nextState`를 비교하고 `false`를 반환하여 React에 업데이트를 건너뛸 수 있음을 알릴 수 있습니다.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // 변경된 사항이 없으므로 다시 렌더링이 불필요합니다.
      return false;
    }
    return true;
  }

  // ...
}

```

React는 새로운 props나 상태를 받을 때 렌더링 전에 `shouldComponentUpdate`를 호출합니다. 기본값은 `true`입니다. 이 메서드는 초기 렌더링이나 [`forceUpdate`](#forceupdate)가 사용될 때 호출되지 않습니다.

#### Parameters {/*shouldcomponentupdate-parameters*/}

- `nextProps`: 컴포넌트가 렌더링할 다음 props. `nextProps`를 [`this.props`](#props)와 비교하여 무엇이 변경되었는지 확인합니다.
- `nextState`: 컴포넌트가 렌더링할 다음 상태. `nextState`를 [`this.state`](#props)와 비교하여 무엇이 변경되었는지 확인합니다.
- `nextContext`: 컴포넌트가 렌더링할 다음 컨텍스트. `nextContext`를 [`this.context`](#context)와 비교하여 무엇이 변경되었는지 확인합니다. 이는 [`static contextType`](#static-contexttype) (현대적) 또는 [`static contextTypes`](#static-contexttypes) (레거시)을 지정한 경우에만 사용할 수 있습니다.

#### Returns {/*shouldcomponentupdate-returns*/}

컴포넌트를 다시 렌더링하려면 `true`를 반환하세요. 이는 기본 동작입니다.

렌더링을 건너뛸 수 있음을 React에 알리려면 `false`를 반환하세요.

#### Caveats {/*shouldcomponent
update-caveats*/}

- 이 메서드는 *오직* 성능 최적화를 위해 존재합니다. 컴포넌트가 이 메서드 없이 작동하지 않는다면, 먼저 그 문제를 해결하세요.

- `shouldComponentUpdate`를 직접 작성하는 대신 [`PureComponent`](/reference/react/PureComponent)를 사용하는 것을 고려하세요. `PureComponent`는 props와 state를 얕게 비교하며, 필요한 업데이트를 건너뛰는 실수를 줄여줍니다.

- `shouldComponentUpdate`에서 깊은 동등성 검사나 `JSON.stringify`를 사용하는 것을 권장하지 않습니다. 이는 성능을 예측할 수 없게 만들고, 모든 props와 state의 데이터 구조에 의존하게 만듭니다. 최상의 경우, 애플리케이션에 몇 초간의 지연을 초래할 수 있으며, 최악의 경우 애플리케이션을 충돌시킬 수 있습니다.

- `false`를 반환해도 *자식 컴포넌트*가 *자신의* 상태가 변경될 때 다시 렌더링되는 것을 막지 않습니다.

- `false`를 반환해도 컴포넌트가 다시 렌더링되지 않을 것이라는 *보장은 없습니다*. React는 반환 값을 힌트로 사용하지만, 다른 이유로 컴포넌트를 다시 렌더링하는 것이 합리적일 때 여전히 선택할 수 있습니다.

<Note>

클래스 컴포넌트에서 `shouldComponentUpdate`로 최적화하는 것은 함수 컴포넌트에서 [`memo`](/reference/react/memo)로 최적화하는 것과 유사합니다. 함수 컴포넌트는 또한 [`useMemo`](/reference/react/useMemo)로 더 세밀한 최적화를 제공합니다.

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

`UNSAFE_componentWillMount`를 정의하면, React는 [`constructor`](#constructor) 직후 이를 호출합니다. 이는 역사적인 이유로만 존재하며, 새로운 코드에서는 사용하지 않아야 합니다. 대신, 다음 대안을 사용하세요:

- 상태를 초기화하려면, [`state`](#state)를 클래스 필드로 선언하거나 [`constructor`](#constructor) 내부에서 `this.state`를 설정하세요.
- 부작용을 실행하거나 구독을 설정해야 하는 경우, 해당 로직을 [`componentDidMount`](#componentdidmount)로 이동하세요.

[안전하지 않은 생명주기 메서드에서 마이그레이션하는 예제를 참조하세요.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameters {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount`는 매개변수를 받지 않습니다.

#### Returns {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount`는 컴포넌트가 [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) 또는 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현한 경우 호출되지 않습니다.

- 이름과는 달리, `UNSAFE_componentWillMount`는 컴포넌트가 *마운트*될 것이라는 보장을 제공하지 않습니다. 예를 들어, 자식 컴포넌트의 코드가 아직 로드되지 않았기 때문에 렌더링 시도가 중단되면, React는 진행 중인 트리를 버리고 다음 시도 중에 컴포넌트를 처음부터 다시 구성하려고 시도합니다. 이는 이 메서드가 "안전하지 않은" 이유입니다. 마운팅에 의존하는 코드(예: 구독 추가)는 [`componentDidMount`](#componentdidmount)로 이동해야 합니다.

- `UNSAFE_componentWillMount`는 [서버 렌더링](/reference/react-dom/server) 중에 실행되는 유일한 생명주기 메서드입니다. 모든 실용적인 목적을 위해, 이는 [`constructor`](#constructor)와 동일하므로, 이 유형의 로직에는 `constructor`를 사용해야 합니다.

<Note>

클래스 컴포넌트에서 `UNSAFE_componentWillMount` 내부에서 상태를 초기화하기 위해 `setState`를 호출하는 것은 함수 컴포넌트에서 [`useState`](/reference/react/useState)의 초기 상태로 해당 상태를 전달하는 것과 동일합니다.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

`UNSAFE_componentWillReceiveProps`를 정의하면, 컴포넌트가 새로운 props를 받을 때 React가 이를 호출합니다. 이는 역사적인 이유로만 존재하며, 새로운 코드에서는 사용하지 않아야 합니다. 대신, 다음 대안을 사용하세요:

- **부작용을 실행해야 하는 경우** (예: 데이터 가져오기, 애니메이션 실행, 구독 재설정), 해당 로직을 [`componentDidUpdate`](#componentdidupdate)로 이동하세요.
- **props가 변경될 때만 일부 데이터를 다시 계산해야 하는 경우**, [메모이제이션 도우미](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)를 사용하세요.
- **props가 변경될 때 일부 상태를 "재설정"해야 하는 경우**, 컴포넌트를 [완전히 제어된](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 또는 [키가 있는 완전히 제어되지 않은](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 컴포넌트로 만드세요.
- **props가 변경될 때 일부 상태를 "조정"해야 하는 경우**, 렌더링 중에 props만으로 필요한 모든 정보를 계산할 수 있는지 확인하세요. 그렇지 않으면, [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops)를 사용하세요.

[안전하지 않은 생명주기 메서드에서 마이그레이션하는 예제를 참조하세요.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Parameters {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: 컴포넌트가 부모 컴포넌트로부터 받을 다음 props. `nextProps`를 [`this.props`](#props)와 비교하여 무엇이 변경되었는지 확인합니다.
- `nextContext`: 가장 가까운 제공자로부터 받을 다음 컨텍스트. `nextContext`를 [`this.context`](#context)와 비교하여 무엇이 변경되었는지 확인합니다. 이는 [`static contextType`](#static-contexttype) (현대적) 또는 [`static contextTypes`](#static-contexttypes) (레거시)을 지정한 경우에만 사용할 수 있습니다.

#### Returns {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps`는 컴포넌트가 [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) 또는 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현한 경우 호출되지 않습니다.

- 이름과는 달리, `UNSAFE_componentWillReceiveProps`는 컴포넌트가 해당 props를 *받을 것이라는* 보장을 제공하지 않습니다. 예를 들어, 자식 컴포넌트의 코드가 아직 로드되지 않았기 때문에 렌더링 시도가 중단되면, React는 진행 중인 트리를 버리고 다음 시도 중에 컴포넌트를 처음부터 다시 구성하려고 시도합니다. 다음 렌더링 시도 시, props가 다를 수 있습니다. 이는 이 메서드가 "안전하지 않은" 이유입니다. 커밋된 업데이트에만 실행되어야 하는 코드는 [`componentDidUpdate`](#componentdidupdate)로 이동해야 합니다.

- `UNSAFE_componentWillReceiveProps`는 컴포넌트가 *이전과 다른* props를 받았다는 의미가 아닙니다. `nextProps`와 `this.props`를 비교하여 무엇이 변경되었는지 확인해야 합니다.

- React는 마운팅 중에 초기 props로 `UNSAFE_componentWillReceiveProps`를 호출하지 않습니다. 이 메서드는 컴포넌트의 props가 업데이트될 때만 호출됩니다. 예를 들어, [`setState`](#setstate)를 호출해도 일반적으로 동일한 컴포넌트 내부에서 `UNSAFE_componentWillReceiveProps`를 트리거하지 않습니다.

<Note>

클래스 컴포넌트에서 `UNSAFE_componentWillReceiveProps` 내부에서 상태를 "조정"하기 위해 `setState`를 호출하는 것은 함수 컴포넌트에서 [렌더링 중에 `useState`의 `set` 함수를 호출하는 것](/reference/react/useState#storing-information-from-previous-renders)과 동일합니다.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}

`UNSAFE_componentWillUpdate`를 정의하면, React는 새로운 props나 상태로 렌더링하기 전에 이를 호출합니다. 이는 역사적인 이유로만 존재하며, 새로운 코드에서는 사용하지 않아야 합니다. 대신, 다음 대안을 사용하세요:

- props나 상태 변경에 응답하여 부작용을 실행해야 하는 경우 (예: 데이터 가져오기, 애니메이션 실행, 구독 재설정), 해당 로직을 [`componentDidUpdate`](#componentdidupdate)로 이동하세요.
- DOM에서 일부 정보를 읽어야 하는 경우 (예: 현재 스크롤 위치를 저장하기 위해), 나중에 [`componentDidUpdate`](#componentdidupdate)에서 사용할 수 있도록 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)에서 읽으세요.

[안전하지 않은 생명주기 메서드에서 마이그레이션하는 예제를 참조하세요.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameters {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: 컴포넌트가 렌더링할 다음 props. `nextProps`를 [`this.props`](#props)와 비교하여 무엇이 변경되었는지 확인합니다.
- `nextState`: 컴포넌트가 렌더링할 다음 상태. `nextState`를 [`this.state`](#state)와 비교하여 무엇이 변경되었는지 확인합니다.

#### Returns {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate`는 아무것도 반환하지 않아야 합니다.

#### Caveats {/*unsafe_componentwillupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의되어 있고 `false`를 반환하면 `UNSAFE_componentWillUpdate`는 호출되지 않습니다.

- `UNSAFE_componentWillUpdate`는 컴포넌트가 [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) 또는 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현한 경우 호출되지 않습니다.

- `componentWillUpdate` 동안 [`setState`](#setstate)를 호출하는 것은 지원되지 않습니다 (또는 `setState`를 호출하는 메서드, 예: Redux 액션 디스패치).

- 이름과는 달리, `UNSAFE_componentWillUpdate`는 컴포넌트가 *업데이트될 것이라는* 보장을 제공하지 않습니다. 예를 들어, 자식 컴포넌트의 코드가 아직 로드되지 않았기 때문에 렌더링 시도가 중단되면, React는 진행 중인 트리를 버리고 다음 시도 중에 컴포넌트를 처음부터 다시 구성하려고 시도합니다. 다음 렌더링 시도 시, props와 상태가 다를 수 있습니다. 이는 이 메서드가 "안전하지 않은" 이유입니다. 커밋된 업데이트에만 실행되어야 하는 코드는 [`componentDidUpdate`](#componentdidupdate)로 이동해야 합니다.

- `UNSAFE_componentWillUpdate`는 컴포넌트가 *이전과 다른* props나 상태를 받았다는 의미가 아닙니다. `nextProps`와 `this.props`, `nextState`와 `this.state`를 비교하여 무엇이 변경되었는지 확인해야 합니다.

- React는 마운팅 중에 초기 props와 상태로 `UNSAFE_componentWillUpdate`를 호출하지 않습니다.

<Note>

함수 컴포넌트에는 `UNSAFE_componentWillUpdate`에 대한 직접적인 대응이 없습니다.

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다. [대신 `static contextType`을 사용하세요.](#static-contexttype)

</Deprecated>

이 컴포넌트가 제공하는 [레거시 컨텍스트](https://reactjs.org/docs/legacy-context.html)의 유형을 지정할 수 있게 해줍니다.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다. [대신 `static contextType`을 사용하세요.](#static-contexttype)

</Deprecated>

이 컴포넌트가 소비하는 [레거시 컨텍스트](https://reactjs.org/docs/legacy-context.html)의 유형을 지정할 수 있게 해줍니다.

---

### `static contextType` {/*static-contexttype*/}

클래스 컴포넌트에서 [`this.context`](#context-instance-field)를 읽으려면, 읽어야 할 컨텍스트를 지정해야 합니다. `static contextType`으로 지정한 컨텍스트는 [`createContext`](/reference/react/createContext)로 이전에 생성된 값이어야 합니다.

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

클래스 컴포넌트에서 `this.context`를 읽는 것은 함수 컴포넌트에서 [`useContext`](/reference/react/useContext)를 사용하는 것과 동일합니다.

[마이그레이션 방법을 참조하세요.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

클래스의 기본 props를 설정하려면 `static defaultProps`를 정의할 수 있습니다. 이는 `undefined` 및 누락된 props에 대해 사용되지만, `null` props에는 사용되지 않습니다.

예를 들어, `color` prop이 기본적으로 `'blue'`로 설정되도록 정의하는 방법은 다음과 같습니다:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

`color` prop이 제공되지 않거나 `undefined`인 경우, 기본적으로 `'blue'`로 설정됩니다:

```js
<>
  {/* this.props.color는 "blue"입니다 */}
  <Button />

  {/* this.props.color는 "blue"입니다 */}
  <Button color={undefined} />

  {/* this.props.color는 null입니다 */}
  <Button color={null} />

  {/* this.props.color는 "red"입니다 */}
  <Button color="red" />
</>
```

<Note>

클래스 컴포넌트에서 `defaultProps`를 정의하는 것은 함수 컴포넌트에서 [기본 값을 사용하는 것](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop)과 유사합니다.

</Note>

---

### `static propTypes` {/*static-proptypes*/}

[`prop-types`](https://www.npmjs.com/package/prop-types) 라이브러리와 함께 `static propTypes`를 정의하여 컴포넌트가 수락하는 props의 유형을 선언할 수 있습니다. 이러한 유형은 렌더링 중에만 확인되며, 개발 환경에서만 확인됩니다.

```js
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
```

<Note>

런타임에 props 유형을 확인하는 대신 [TypeScript](https://www.typescriptlang.org/)를 사용하는 것을 권장합니다.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

`static getDerivedStateFromError`를 정의하면, 자식 컴포넌트(원거리 자식 포함)가 렌더링 중에 오류를 발생시킬 때 React가 이를 호출합니다. 이를 통해 UI를 지우는 대신 오류 메시지를 표시할 수 있습니다.

일반적으로, 이는 오류 보고 서비스를 호출할 수 있는 [`componentDidCatch`](#componentdidcatch)와 함께 사용됩니다. 이러한 메서드를 가진 컴포넌트를 *오류 경계*라고 합니다.

[예제를 참조하세요.](#catching-rendering-errors-with-an-error-boundary)

#### Parameters {/*static-getderivedstatefromerror-parameters*/}

* `error`: 발생한 오류. 실제로는 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 인스턴스인 경우가 많지만, JavaScript는 문자열이나 `null`과 같은 값을 [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)할 수 있기 때문에 보장되지 않습니다.

#### Returns {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError`는 오류 메시지를 표시하도록 컴포넌트에 지시하는 상태를 반환해야 합니다.

#### Caveats {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError`는 순수 함수여야 합니다. 부작용을 수행하려면 (예: 분석 서비스 호출), [`componentDidCatch`](#componentdidcatch)를 구현해야 합니다.

<Note>

함수 컴포넌트에는 아직 `static getDerivedStateFromError`에 대한 직접적인 대응이 없습니다. 클래스 컴포넌트를 만들지 않으려면, 위와 같은 단일 `Error
Boundary` 컴포넌트를 작성하여 앱 전체에서 사용할 수 있습니다. 또는 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 패키지를 사용할 수 있습니다.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

`static getDerivedStateFromProps`를 정의하면, React는 [`render`](#render)를 호출하기 직전에 이를 호출합니다. 이는 초기 마운트와 후속 업데이트 모두에서 호출됩니다. 상태를 업데이트하려면 객체를 반환하고, 아무것도 업데이트하지 않으려면 `null`을 반환해야 합니다.

이 메서드는 상태가 시간에 따라 props의 변경에 의존하는 [드문 사용 사례](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)를 위해 존재합니다. 예를 들어, 이 `Form` 컴포넌트는 `userID` prop이 변경될 때 `email` 상태를 재설정합니다:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 현재 사용자가 변경될 때마다,
    // 해당 사용자와 관련된 상태의 일부를 재설정합니다.
    // 이 간단한 예제에서는 이메일만 해당됩니다.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

이 패턴은 상태에서 이전 값(예: `userID`)을 유지해야 합니다(예: `prevUserID`).

<Pitfall>

상태를 유도하는 것은 코드가 장황해지고 컴포넌트를 이해하기 어렵게 만듭니다. [더 간단한 대안을 숙지하세요:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- **부작용을 실행해야 하는 경우** (예: 데이터 가져오기, 애니메이션 실행) props 변경에 응답하여 [`componentDidUpdate`](#componentdidupdate) 메서드를 사용하세요.
- **props가 변경될 때만 일부 데이터를 다시 계산하려는 경우**, [메모이제이션 도우미를 사용하세요.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- **props가 변경될 때 일부 상태를 "재설정"하려는 경우**, 컴포넌트를 [완전히 제어된](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 또는 [키가 있는 완전히 제어되지 않은](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 컴포넌트로 만드세요.

</Pitfall>

#### Parameters {/*static-getderivedstatefromprops-parameters*/}

- `props`: 컴포넌트가 렌더링할 다음 props.
- `state`: 컴포넌트가 렌더링할 다음 상태.

#### Returns {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps`는 상태를 업데이트하기 위한 객체를 반환하거나, 아무것도 업데이트하지 않으려면 `null`을 반환해야 합니다.

#### Caveats {/*static-getderivedstatefromprops-caveats*/}

- 이 메서드는 *모든* 렌더링에서 실행됩니다. 이는 [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)와 다릅니다. 후자는 부모가 다시 렌더링할 때만 실행되며, 로컬 `setState`의 결과로는 실행되지 않습니다.

- 이 메서드는 컴포넌트 인스턴스에 접근할 수 없습니다. 원한다면, `static getDerivedStateFromProps`와 다른 클래스 메서드 간에 코드를 재사용하기 위해 컴포넌트 props와 상태의 순수 함수를 클래스 정의 외부로 추출할 수 있습니다.

<Note>

클래스 컴포넌트에서 `static getDerivedStateFromProps`를 구현하는 것은 함수 컴포넌트에서 [렌더링 중에 `useState`의 `set` 함수를 호출하는 것](/reference/react/useState#storing-information-from-previous-renders)과 동일합니다.

</Note>

---

## Usage {/*usage*/}

### Defining a class component {/*defining-a-class-component*/}

React 컴포넌트를 클래스로 정의하려면, 내장된 `Component` 클래스를 확장하고 [`render` 메서드를 정의합니다:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React는 화면에 표시할 내용을 결정할 때마다 [`render`](#render) 메서드를 호출합니다. 일반적으로, `render` 메서드에서 [JSX](/learn/writing-markup-with-jsx)를 반환합니다. `render` 메서드는 [순수 함수](https://en.wikipedia.org/wiki/Pure_function)로 작성해야 합니다. 즉, JSX만 계산해야 합니다.

[함수 컴포넌트](/learn/your-first-component#defining-a-component)와 유사하게, 클래스 컴포넌트는 부모 컴포넌트로부터 [props를 통해 정보를 받을 수 있습니다](/learn/your-first-component#defining-a-component). 그러나 props를 읽는 구문은 다릅니다. 예를 들어, 부모 컴포넌트가 `<Greeting name="Taylor" />`를 렌더링하면, `this.props`에서 `name` prop을 읽을 수 있습니다. 예를 들어, `this.props.name`과 같이 읽습니다:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Hooks(`use`로 시작하는 함수, 예: [`useState`](/reference/react/useState))는 클래스 컴포넌트 내에서 지원되지 않습니다.

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 권장합니다. [마이그레이션 방법을 참조하세요.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Adding state to a class component {/*adding-state-to-a-class-component*/}

클래스에 [상태](/learn/state-a-components-memory)를 추가하려면, [`state`](#state)라는 속성에 객체를 할당하세요. 상태를 업데이트하려면 [`this.setState`](#setstate)를 호출하세요.

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 권장합니다. [마이그레이션 방법을 참조하세요.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Adding lifecycle methods to a class component {/*adding-lifecycle-methods-to-a-class-component*/}

클래스에 정의할 수 있는 몇 가지 특별한 메서드가 있습니다.

[`componentDidMount`](#componentdidmount) 메서드를 정의하면, 컴포넌트가 화면에 추가 *(마운트)*될 때 React가 이를 호출합니다. 컴포넌트가 변경된 props나 상태로 다시 렌더링된 후, React는 [`componentDidUpdate`](#componentdidupdate)를 호출합니다. 컴포넌트가 화면에서 제거 *(언마운트)*된 후, React는 [`componentWillUnmount`](#componentwillunmount)를 호출합니다.

`componentDidMount`를 구현하면, 버그를 피하기 위해 세 가지 생명주기 메서드를 모두 구현해야 할 때가 많습니다. 예를 들어, `componentDidMount`가 일부 상태나 props를 읽는 경우, 해당 변경 사항을 처리하기 위해 `componentDidUpdate`를 구현해야 하며, `componentDidMount`가 수행한 작업을 정리하기 위해 `componentWillUnmount`를 구현해야 합니다.

예를 들어, 이 `ChatRoom` 컴포넌트는 props와 상태와 동기화된 채팅 연결을 유지합니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결됩니다.
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

개발 환경에서 [Strict Mode](/reference/react/StrictMode)가 켜져 있으면, React는 `componentDidMount`를 호출한 다음, 즉시 `componentWillUnmount`를 호출하고, 다시 `componentDidMount`를 호출합니다. 이는 `componentWillUnmount`를 구현하지 않았거나, `componentDidMount`가 수행한 작업을 완전히 "반영"하지 않는 경우 이를 알리는 데 도움이 됩니다.

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 권장합니다. [마이그레이션 방법을 참조하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Catching rendering errors with an error boundary {/*catching-rendering-errors-with-an-error-boundary*/}

기본적으로, 애플리케이션이 렌더링 중에 오류를 발생시키면, React는 UI를 화면에서 제거합니다. 이를 방지하려면, UI의 일부를 *오류 경계*로 감쌀 수 있습니다. 오류 경계는 오류가 발생한 부분 대신 대체 UI를 표시할 수 있는 특별한 컴포넌트입니다. 예를 들어, 오류 메시지를 표시할 수 있습니다.

오류 경계 컴포넌트를 구현하려면, 오류에 응답하여 상태를 업데이트하고 사용자에게 오류 메시지를 표시할 수 있는 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)를 제공해야 합니다. 또한, 선택적으로 [`componentDidCatch`](#componentdidcatch)를 구현하여 오류를 분석 서비스에 기록하는 등의 추가 로직을 추가할 수 있습니다.

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 상태를 업데이트하여 다음 렌더링에서 대체 UI를 표시합니다.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 예제 "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 사용자 정의 대체 UI를 렌더링할 수 있습니다.
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

그런 다음, 컴포넌트 트리의 일부를 오류 경계로 감쌀 수 있습니다:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

`Profile` 또는 자식 컴포넌트가 오류를 발생시키면, `ErrorBoundary`는 해당 오류를 "잡고", 제공된 오류 메시지로 대체 UI를 표시하며, 프로덕션 오류 보고 서비스에 오류 보고서를 보냅니다.

모든 컴포넌트를 별도의 오류 경계로 감쌀 필요는 없습니다. [오류 경계의 세분성](https://www.brandondail.com/posts/fault-tolerance-react)을 고려할 때, 오류 메시지를 표시하는 것이 합리적인 위치를 고려하세요. 예를 들어, 메시징 앱에서는 대화 목록 주위에 오류 경계를 배치하는 것이 합리적입니다. 또한, 개별 메시지 주위에 오류 경계를 배치하는 것도 합리적입니다. 그러나 모든 아바타 주위에 경계를 배치하는 것은 합리적이지 않습니다.

<Note>

현재, 함수 컴포넌트로 오류 경계를 작성하는 방법은 없습니다. 그러나 오류 경계 클래스를 직접 작성할 필요는 없습니다. 예를 들어, [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary)를 사용할 수 있습니다.

</Note>

---

## Alternatives {/*alternatives*/}

### Migrating a simple component from a class to a function {/*migrating-a-simple-component-from-a-class-to-a-function*/}

일반적으로, [컴포넌트를 함수로 정의합니다](/learn/your-first-component#defining-a-component).

예를 들어, 이 `Greeting` 클래스 컴포넌트를 함수로 변환한다고 가정해 봅시다:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

`Greeting`이라는 함수를 정의합니다. 여기에서 `render` 함수의 본문을 이동합니다.

```js
function Greeting() {
  // ... render 메서드의 코드를 여기로 이동합니다 ...
}
```

`this.props.name` 대신, [구조 분해 구문](/learn/passing-props-to-a-component)을 사용하여 `name` prop을 정의하고 직접 읽습니다:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

다음은 완전히 변환된 예제입니다:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrating a component with state from a class to a function {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

이 `Counter` 클래스 컴포넌트를 함수로 변환한다고 가정해 봅시다:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

먼저 필요한 [상태 변수](/reference/react/useState#adding-state-to-a-component)를 선언하여 함수를 정의합니다:

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

다음으로, 이벤트 핸들러를 변환합니다:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

마지막으로, `this`로 시작하는 모든 참조를 컴포넌트에서 정의한 변수와 함수로 교체합니다. 예를 들어, `this.state.age`를 `age`로 교체하고, `this.handleNameChange`를 `handleNameChange`로 교체합니다.

다음은 완전히 변환된 컴포넌트입니다:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrating a component with lifecycle methods from a class to a function {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

이 `ChatRoom` 클래스 컴포넌트를 생명주기 메서드와 함께 함수로 변환한다고 가정해 봅시다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결됩니다.
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

먼저, [`componentWillUnmount`](#componentwillunmount)가 [`componentDidMount`](#componentdidmount)의 반대 작업을 수행하는지 확인합니다. 위 예제에서는 `componentDidMount`가 설정한 연결을 해제합니다. 이러한 로직이 누락된 경우, 먼저 추가합니다.

다음으로, [`componentDidUpdate`](#componentdidupdate) 메서드가 `componentDidMount`에서 사용하는 모든 props와 상태의 변경 사항을 처리하는지 확인합니다. 위 예제에서는 `componentDidMount`가 `setupConnection`을 호출하여 `this.state.serverUrl`과 `this.props.roomId`를 읽습니다. 따라서 `componentDidUpdate`는 `this.state.serverUrl`과 `this.props.roomId`가 변경되었는지 확인하고, 변경된 경우 연결을 재설정합니다. `componentDidUpdate` 로직이 누락되었거나 모든 관련 props와 상태의 변경 사항을 처리하지 않는 경우, 먼저 수정합니다.

위 예제에서, 생명주기 메서드 내부의 로직은 컴포넌트를 React 외부 시스템(채팅 서버)에 연결합니다. 컴포넌트를 외부 시스템에 연결하려면, [이 로직을 단일 Effect로 설명합니다:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

이 [`useEffect`](/reference/react/useEffect) 호출은 위의 생명주기 메서드의 로직과 동일합니다. 생명주기 메서드가 여러 가지 관련 없는 작업을 수행하는 경우, [이를 여러 개의 독립적인 Effect로 분할합니다.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) 다음은 완전히 변환된 예제입니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 서버에 실제로 연결됩니다.
  return {
    connect() {
      console.log('✅ "' + roomId + '" 방에 ' + serverUrl + '에 연결 중...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" 방에서 ' + serverUrl + ' 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

컴포넌트가 외부 시스템과 동기화되지 않는 경우, [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrating a component with context from a class to a function {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

이 예제에서, `Panel` 및 `Button` 클래스 컴포넌트는 [`this.context`](#context)에서 [컨텍스트](/learn/passing-data-deeply-with-context)를 읽습니다:

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

함수 컴포넌트로 변환할 때, [`useContext`](/reference/react/useContext) 호출로 `this.context`를 교체합니다:

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>