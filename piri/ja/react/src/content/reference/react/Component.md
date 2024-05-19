---
title: Component
---

<Pitfall>

コンポーネントをクラスではなく関数として定義することをお勧めします。[移行方法を参照してください。](#alternatives)

</Pitfall>

<Intro>

`Component`は、[JavaScriptクラス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)として定義されたReactコンポーネントの基本クラスです。クラスコンポーネントはReactによってサポートされていますが、新しいコードでは使用しないことをお勧めします。

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

## リファレンス {/*reference*/}

### `Component` {/*component*/}

Reactコンポーネントをクラスとして定義するには、組み込みの`Component`クラスを拡張し、[`render`メソッド](#render)を定義します。

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`render`メソッドのみが必須で、他のメソッドはオプションです。

[以下の例を参照してください。](#usage)

---

### `context` {/*context*/}

クラスコンポーネントの[コンテキスト](/learn/passing-data-deeply-with-context)は`this.context`として利用できます。これは、[`static contextType`](#static-contexttype)（モダン）または[`static contextTypes`](#static-contexttypes)（非推奨）を使用して受け取りたいコンテキストを指定した場合にのみ利用可能です。

クラスコンポーネントは一度に一つのコンテキストしか読み取ることができません。

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

クラスコンポーネントで`this.context`を読み取ることは、関数コンポーネントで[`useContext`](/reference/react/useContext)を使用することと同等です。

[移行方法を参照してください。](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

クラスコンポーネントに渡されたpropsは`this.props`として利用できます。

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

クラスコンポーネントで`this.props`を読み取ることは、関数コンポーネントで[propsを宣言する](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component)ことと同等です。

[移行方法を参照してください。](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。[代わりに`createRef`を使用してください。](/reference/react/createRef)

</Deprecated>

このコンポーネントの[レガシー文字列refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)にアクセスできます。

---

### `state` {/*state*/}

クラスコンポーネントのstateは`this.state`として利用できます。`state`フィールドはオブジェクトでなければなりません。stateを直接変更しないでください。stateを変更したい場合は、新しいstateを持つ`setState`を呼び出してください。

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

クラスコンポーネントで`state`を定義することは、関数コンポーネントで[`useState`](/reference/react/useState)を呼び出すことと同等です。

[移行方法を参照してください。](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[コンストラクタ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)は、クラスコンポーネントが*マウント*（画面に追加）される前に実行されます。通常、コンストラクタはReactで2つの目的のためにのみ使用されます。stateを宣言し、クラスメソッドをクラスインスタンスに[バインド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)することができます。

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

モダンなJavaScript構文を使用する場合、コンストラクタはほとんど必要ありません。代わりに、[パブリッククラスフィールド構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)を使用して上記のコードを再記述できます。これはモダンなブラウザや[Babel](https://babeljs.io/)のようなツールでサポートされています。

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

コンストラクタには副作用やサブスクリプションを含めないでください。

#### パラメータ {/*constructor-parameters*/}

* `props`: コンポーネントの初期props。

#### 戻り値 {/*constructor-returns*/}

`constructor`は何も返すべきではありません。

#### 注意点 {/*constructor-caveats*/}

* コンストラクタ内で副作用やサブスクリプションを実行しないでください。代わりに[`componentDidMount`](#componentdidmount)を使用してください。

* コンストラクタ内では、他のステートメントの前に`super(props)`を呼び出す必要があります。これを行わないと、コンストラクタが実行されている間、`this.props`は`undefined`になり、混乱やバグの原因となります。

* コンストラクタは[`this.state`](#state)を直接割り当てる唯一の場所です。他のすべてのメソッドでは、代わりに[`this.setState()`](#setstate)を使用する必要があります。コンストラクタ内で`setState`を呼び出さないでください。

* [サーバーレンダリング](/reference/react-dom/server)を使用する場合、コンストラクタはサーバー上でも実行され、その後[`render`](#render)メソッドが続きます。ただし、`componentDidMount`や`componentWillUnmount`のようなライフサイクルメソッドはサーバー上では実行されません。

* [Strict Mode](/reference/react/StrictMode)がオンの場合、開発中にReactは`constructor`を2回呼び出し、そのうちの1つのインスタンスを破棄します。これにより、`constructor`から移動する必要がある偶発的な副作用に気付くことができます。

<Note>

関数コンポーネントには`constructor`の正確な対応物はありません。関数コンポーネントでstateを宣言するには、[`useState`](/reference/react/useState)を呼び出します。初期stateの再計算を避けるために、[`useState`に関数を渡します。](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

`componentDidCatch`を定義すると、子コンポーネント（遠い子コンポーネントを含む）がレンダリング中にエラーをスローしたときにReactがそれを呼び出します。これにより、エラーをエラーレポートサービスにログすることができます。

通常、これは[`static getDerivedStateFromError`](#static-getderivedstatefromerror)と一緒に使用され、エラーに応じてstateを更新し、ユーザーにエラーメッセージを表示することができます。これらのメソッドを持つコンポーネントは*エラーバウンダリ*と呼ばれます。

[例を参照してください。](#catching-rendering-errors-with-an-error-boundary)

#### パラメータ {/*componentdidcatch-parameters*/}

* `error`: スローされたエラー。実際には、通常[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)のインスタンスですが、JavaScriptは任意の値（文字列や`null`を含む）を[`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)できるため、これは保証されません。

* `info`: エラーに関する追加情報を含むオブジェクト。その`componentStack`フィールドには、エラーをスローしたコンポーネント、およびその親コンポーネントの名前とソース位置を含むスタックトレースが含まれます。プロダクションでは、コンポーネント名は縮小されます。プロダクションエラーレポートを設定すると、通常のJavaScriptエラースタックと同様に、ソースマップを使用してコンポーネントスタックをデコードできます。

#### 戻り値 {/*componentdidcatch-returns*/}

`componentDidCatch`は何も返すべきではありません。

#### 注意点 {/*componentdidcatch-caveats*/}

* 過去には、UIを更新してフォールバックエラーメッセージを表示するために`componentDidCatch`内で`setState`を呼び出すことが一般的でした。これは[`static getDerivedStateFromError`](#static-getderivedstatefromerror)を定義することに置き換えられました。

* Reactのプロダクションビルドと開発ビルドは、`componentDidCatch`がエラーを処理する方法がわずかに異なります。開発では、エラーは`window`にバブルアップし、`window.onerror`や`window.addEventListener('error', callback)`が`componentDidCatch`によってキャッチされたエラーをインターセプトします。プロダクションでは、エラーはバブルアップしないため、祖先のエラーハンドラは`componentDidCatch`によって明示的にキャッチされなかったエラーのみを受け取ります。

<Note>

関数コンポーネントにはまだ`componentDidCatch`の直接的な対応物はありません。クラスコンポーネントを作成したくない場合は、上記のような単一の`ErrorBoundary`コンポーネントを作成し、アプリ全体で使用してください。あるいは、[`react-error-boundary`](https://github.com/bvaughn/react-error-boundary)パッケージを使用することもできます。

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

`componentDidMount`メソッドを定義すると、コンポーネントが画面に追加されたときにReactがそれを呼び出します。これは、データフェッチングを開始したり、サブスクリプションを設定したり、DOMノードを操作したりする一般的な場所です。

`componentDidMount`を実装する場合、バグを避けるために他のライフサイクルメソッドも実装する必要があります。例えば、`componentDidMount`がstateやpropsを読み取る場合、[`componentDidUpdate`](#componentdidupdate)を実装してそれらの変更を処理し、[`componentWillUnmount`](#componentwillunmount)を実装して`componentDidMount`が行っていたことをクリーンアップする必要があります。

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

[他の例を参照してください。](#adding-lifecycle-methods-to-a-class-component)

#### パラメータ {/*componentdidmount-parameters*/}

`componentDidMount`はパラメータを取りません。

#### 戻り値 {/*componentdidmount-returns*/}

`componentDidMount`は何も返すべきではありません。

#### 注意点 {/*componentdidmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode)がオンの場合、開発中にReactは`componentDidMount`を呼び出し、すぐに[`componentWillUnmount`](#componentwillunmount)を呼び出し、その後再び`componentDidMount`を呼び出します。これにより、`componentWillUnmount`を実装し忘れた場合や、そのロジックが`componentDidMount`の動作を完全に「ミラー」していない場合に気付くことができます。

- `componentDidMount`内で[`setState`](#setstate)をすぐに呼び出すことはできますが、可能な限り避けるのが最善です。これは追加のレンダリングをトリガーしますが、ブラウザが画面を更新する前に発生します。これにより、この場合[`render`](#render)が2回呼び出されることが保証されますが、ユーザーは中間状態を見ません。このパターンはしばしばパフォーマンスの問題を引き起こしますが、モーダルやツールチップのように、DOMノードのサイズや位置に依存するものをレンダリングする前にDOMノードを測定する必要がある場合には必要です。

<Note>

多くのユースケースでは、クラスコンポーネントで`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`を一緒に定義することは、関数コンポーネントで[`useEffect`](/reference/react/useEffect)を呼び出すことと同等です。コードをブラウザのペイント前に実行することが重要な場合には、[`useLayoutEffect`](/reference/react/useLayoutEffect)がより近い対応物です。

[移行方法を参照してください。](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

`componentDidUpdate`メソッドを定義すると、更新されたpropsやstateで再レンダリングされた直後にReactがそれを呼び出します。このメソッドは初回レンダリングには呼び出されません。

更新後にDOMを操作するために使用できます。また、ネットワークリクエストを行う一般的な場所でもありますが、現在のpropsを以前のpropsと比較する必要があります（例えば、propsが変更されていない場合はネットワークリクエストが不要です）。通常、[`componentDidMount`](#componentdidmount)や[`componentWillUnmount`](#componentwillunmount)と一緒に使用します。

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

[他の例を参照してください。](#adding-lifecycle-methods-to-a-class-component)

#### パラメータ {/*componentdidupdate-parameters*/}

* `prevProps`: 更新前のprops。`prevProps`を[`this.props`](#props)と比較して何が変わったかを判断します。

* `prevState`: 更新前のstate。`prevState`を[`this.state`](#state)と比較して何が変わったかを判断します。

* `snapshot`: [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)を実装している場合、`snapshot`にはそのメソッドから返された値が含まれます。それ以外の場合は`undefined`になります。

#### 戻り値 {/*componentdidupdate-returns*/}

`componentDidUpdate`は何も返すべきではありません。

#### 注意点 {/*componentdidupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)が定義されていて`false`を返す場合、`component
DidUpdate`は呼び出されません。

- `componentDidUpdate`内のロジックは通常、`this.props`と`prevProps`、および`this.state`と`prevState`を比較する条件でラップされるべきです。そうしないと、無限ループを作成するリスクがあります。

- `componentDidUpdate`内で[`setState`](#setstate)をすぐに呼び出すことはできますが、可能な限り避けるのが最善です。これは追加のレンダリングをトリガーしますが、ブラウザが画面を更新する前に発生します。これにより、この場合[`render`](#render)が2回呼び出されることが保証されますが、ユーザーは中間状態を見ません。このパターンはしばしばパフォーマンスの問題を引き起こしますが、モーダルやツールチップのように、DOMノードのサイズや位置に依存するものをレンダリングする前にDOMノードを測定する必要がある場合には必要です。

<Note>

多くのユースケースでは、クラスコンポーネントで`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`を一緒に定義することは、関数コンポーネントで[`useEffect`](/reference/react/useEffect)を呼び出すことと同等です。コードをブラウザのペイント前に実行することが重要な場合には、[`useLayoutEffect`](/reference/react/useLayoutEffect)がより近い対応物です。

[移行方法を参照してください。](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

このAPIは`componentWillMount`から[`UNSAFE_componentWillMount`](#unsafe_componentwillmount)に名前が変更されました。古い名前は非推奨です。将来のReactのメジャーバージョンでは、新しい名前のみが機能します。

[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)を実行して、コンポーネントを自動的に更新してください。

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

このAPIは`componentWillReceiveProps`から[`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)に名前が変更されました。古い名前は非推奨です。将来のReactのメジャーバージョンでは、新しい名前のみが機能します。

[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)を実行して、コンポーネントを自動的に更新してください。

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

このAPIは`componentWillUpdate`から[`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)に名前が変更されました。古い名前は非推奨です。将来のReactのメジャーバージョンでは、新しい名前のみが機能します。

[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)を実行して、コンポーネントを自動的に更新してください。

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

`componentWillUnmount`メソッドを定義すると、コンポーネントが画面から削除される前にReactがそれを呼び出します。これは、データフェッチングをキャンセルしたり、サブスクリプションを削除したりする一般的な場所です。

`componentWillUnmount`内のロジックは[`componentDidMount`](#componentdidmount)内のロジックを「ミラー」するべきです。例えば、`componentDidMount`がサブスクリプションを設定する場合、`componentWillUnmount`はそのサブスクリプションをクリーンアップするべきです。`componentWillUnmount`内のクリーンアップロジックがpropsやstateを読み取る場合、通常は[`componentDidUpdate`](#componentdidupdate)を実装して、古いpropsやstateに対応するリソース（サブスクリプションなど）をクリーンアップする必要があります。

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

[他の例を参照してください。](#adding-lifecycle-methods-to-a-class-component)

#### パラメータ {/*componentwillunmount-parameters*/}

`componentWillUnmount`はパラメータを取りません。

#### 戻り値 {/*componentwillunmount-returns*/}

`componentWillUnmount`は何も返すべきではありません。

#### 注意点 {/*componentwillunmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode)がオンの場合、開発中にReactは[`componentDidMount`](#componentdidmount)を呼び出し、すぐに`componentWillUnmount`を呼び出し、その後再び`componentDidMount`を呼び出します。これにより、`componentWillUnmount`を実装し忘れた場合や、そのロジックが`componentDidMount`の動作を完全に「ミラー」していない場合に気付くことができます。

<Note>

多くのユースケースでは、クラスコンポーネントで`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`を一緒に定義することは、関数コンポーネントで[`useEffect`](/reference/react/useEffect)を呼び出すことと同等です。コードをブラウザのペイント前に実行することが重要な場合には、[`useLayoutEffect`](/reference/react/useLayoutEffect)がより近い対応物です。

[移行方法を参照してください。](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

コンポーネントの再レンダリングを強制します。

通常、これは必要ありません。コンポーネントの[`render`](#render)メソッドが[`this.props`](#props)、[`this.state`](#state)、または[`this.context`](#context)からのみ読み取る場合、コンポーネントやその親の中で[`setState`](#setstate)を呼び出すと自動的に再レンダリングされます。ただし、コンポーネントの`render`メソッドが外部データソースから直接読み取る場合、そのデータソースが変更されたときにユーザーインターフェースを更新するようにReactに指示する必要があります。これが`forceUpdate`の役割です。

`forceUpdate`の使用を避け、`render`内で`this.props`と`this.state`からのみ読み取るようにしてください。

#### パラメータ {/*forceupdate-parameters*/}

* **オプション** `callback`: 指定された場合、Reactは更新がコミットされた後に提供された`callback`を呼び出します。

#### 戻り値 {/*forceupdate-returns*/}

`forceUpdate`は何も返すべきではありません。

#### 注意点 {/*forceupdate-caveats*/}

- `forceUpdate`を呼び出すと、Reactは[`shouldComponentUpdate`](#shouldcomponentupdate)を呼び出さずに再レンダリングします。

<Note>

外部データソースを読み取り、その変更に応じてクラスコンポーネントを再レンダリングするために`forceUpdate`を使用することは、関数コンポーネントで[`useSyncExternalStore`](/reference/react/useSyncExternalStore)を使用することに置き換えられました。

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。[代わりに`Context.Provider`を使用してください。](/reference/react/createContext#provider)

</Deprecated>

このコンポーネントが提供する[レガシーコンテキスト](https://reactjs.org/docs/legacy-context.html)の値を指定できます。

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

`getSnapshotBeforeUpdate`を実装すると、ReactはDOMを更新する直前にそれを呼び出します。これにより、DOMから情報（例：スクロール位置）をキャプチャすることができます。このライフサイクルメソッドが返す値は、[`componentDidUpdate`](#componentdidupdate)にパラメータとして渡されます。

例えば、更新中にスクロール位置を保持する必要があるチャットスレッドのようなUIで使用できます。

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // リストに新しいアイテムを追加していますか？
    // スクロール位置をキャプチャして、後で調整できるようにします。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // スナップショット値がある場合、新しいアイテムが追加されました。
    // これらの新しいアイテムが古いアイテムを視界から押し出さないようにスクロールを調整します。
    // （スナップショットはgetSnapshotBeforeUpdateから返された値です）
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

上記の例では、`getSnapshotBeforeUpdate`内で`scrollHeight`プロパティを直接読み取ることが重要です。[`render`](#render)、[`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)、または[`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)内で読み取るのは安全ではありません。これらのメソッドが呼び出されてからReactがDOMを更新するまでの間に時間差がある可能性があるためです。

#### パラメータ {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: 更新前のprops。`prevProps`を[`this.props`](#props)と比較して何が変わったかを判断します。

* `prevState`: 更新前のstate。`prevState`を[`this.state`](#state)と比較して何が変わったかを判断します。

#### 戻り値 {/*getsnapshotbeforeupdate-returns*/}

スナップショット値として任意の型の値を返すか、`null`を返すべきです。返された値は[`componentDidUpdate`](#componentdidupdate)の第3引数として渡されます。

#### 注意点 {/*getsnapshotbeforeupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)が定義されていて`false`を返す場合、`getSnapshotBeforeUpdate`は呼び出されません。

<Note>

現時点では、関数コンポーネントには`getSnapshotBeforeUpdate`の対応物はありません。このユースケースは非常にまれですが、必要な場合はクラスコンポーネントを作成する必要があります。

</Note>

---

### `render()` {/*render*/}

`render`メソッドはクラスコンポーネントで唯一必須のメソッドです。

`render`メソッドは画面に表示したい内容を指定する必要があります。例えば：

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Reactは任意のタイミングで`render`を呼び出す可能性があるため、特定のタイミングで実行されると仮定しないでください。通常、`render`メソッドは[JSX](/learn/writing-markup-with-jsx)の一部を返すべきですが、いくつかの[他の戻り値の型](#render-returns)（文字列など）もサポートされています。返されるJSXを計算するために、`render`メソッドは[`this.props`](#props)、[`this.state`](#state)、および[`this.context`](#context)を読み取ることができます。

`render`メソッドは純粋関数として記述するべきです。つまり、props、state、およびcontextが同じであれば同じ結果を返すべきです。また、副作用（サブスクリプションの設定など）やブラウザAPIとのやり取りを含めるべきではありません。副作用はイベントハンドラや[`componentDidMount`](#componentdidmount)のようなメソッドで発生するべきです。

#### パラメータ {/*render-parameters*/}

`render`はパラメータを取りません。

#### 戻り値 {/*render-returns*/}

`render`は有効なReactノードを返すことができます。これには、`<div />`のようなReact要素、文字列、数値、[ポータル](/reference/react-dom/createPortal)、空のノード（`null`、`undefined`、`true`、および`false`）、およびReactノードの配列が含まれます。

#### 注意点 {/*render-caveats*/}

- `render`はprops、state、およびcontextの純粋関数として記述するべきです。副作用を含めるべきではありません。

- [`shouldComponentUpdate`](#shouldcomponentupdate)が定義されていて`false`を返す場合、`render`は呼び出されません。

- [Strict Mode](/reference/react/StrictMode)がオンの場合、Reactは開発中に`render`を2回呼び出し、そのうちの1つの結果を破棄します。これにより、`render`メソッドから移動する必要がある偶発的な副作用に気付くことができます。

- `render`呼び出しとその後の[`componentDidMount`](#componentdidmount)または[`componentDidUpdate`](#componentdidupdate)呼び出しの間には一対一の対応関係はありません。Reactが有益と判断した場合、一部の`render`呼び出し結果を破棄することがあります。

---

### `setState(nextState, callback?)` {/*setstate*/}

Reactコンポーネントのstateを更新するために`setState`を呼び出します。

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

`setState`はコンポーネントのstateへの変更をキューに入れます。これにより、Reactはこのコンポーネントとその子コンポーネントが新しいstateで再レンダリングされる必要があることを認識します。これは、インタラクションに応じてユーザーインターフェースを更新する主な方法です。

<Pitfall>

`setState`を呼び出しても、現在実行中のコード内の現在のstateは変更されません。

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // まだ "Taylor"!
}
```

これは、*次の*レンダリングから`this.state`が返す値に影響を与えるだけです。

</Pitfall>

`setState`に関数を渡すこともできます。これにより、前のstateに基づいてstateを更新できます。

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

これを行う必要はありませんが、同じイベント中にstateを複数回更新したい場合に便利です。

#### パラメータ {/*setstate-parameters*/}

* `nextState`: オブジェクトまたは関数。
  * `nextState`としてオブジェクトを渡すと、それは`this.state`にシャローにマージされます。
  * `nextState`として関数を渡すと、それは_アップデータ関数_として扱われます。それは純粋でなければならず、保留中のstateとpropsを引数として取り、`this.state`にシャローにマージされるオブジェクトを返す必要があります。
Reactはアップデータ関数をキューに入れ、コンポーネントを再レンダリングします。次のレンダリング中に、Reactはすべてのキューに入れられたアップデータを前のstateに適用して次のstateを計算します。

* **オプション** `callback`: 指定された場合、Reactは更新がコミットされた後に提供された`callback`を呼び出します。

#### 戻り値 {/*setstate-returns*/}

`setState`は何も返すべきではありません。

#### 注意点 {/*setstate-caveats*/}

- `setState`を*リクエスト*と考え、コンポーネントを即座に更新するコマンドとは考えないでください。複数のコンポーネントがイベントに応じてstateを更新する場合、Reactはそれらの更新をバッチ処理し、イベントの最後に一度に再レンダリングします。特定のstate更新を同期的に適用する必要がある場合は、[`flushSync`](/reference/react-dom/flushSync)でラップすることができますが、これはパフォーマンスに悪影響を与える可能性があります。

- `setState`は`this.state`を即座に更新しません。これにより、`setState`を呼び出した直後に`this.state`を読み取ることが潜在的な落とし穴となります。代わりに、[`componentDidUpdate`](#componentdidupdate)またはsetStateの`callback`引数を使用してください。これらは更新が適用された後に確実に発火します。前のstateに基づいてstateを設定する必要がある場合は、上記のように`nextState`に関数を渡すことができます。

<Note>

クラスコンポーネントで`setState`を呼び出すことは、関数コンポーネントで[`set`関数](/reference/react/useState#setstate)を呼び出すことと同等です。

[移行方法を参照してください。](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

`shouldComponentUpdate`を定義すると、Reactは再レンダリングをスキップできるかどうかを判断するためにそれを呼び出します。

手動で書くことに自信がある場合は、`this.props`と`nextProps`、および`this.state`と`nextState`を比較し、更新が不要であることをReactに伝えるために`false`を返すことができます。

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
      // 何も変わっていないので、再レンダリングは不要
      return false;
    }
    return true;
  }

  // ...
}

```

Reactは新しいpropsやstateを受け取るときにレンダリング前に`shouldComponentUpdate`を呼び出します。デフォルトは`true`です。このメソッドは初回レンダリングや[`forceUpdate`](#forceupdate)が使用された場合には呼び出されません。

#### パラメータ {/*shouldcomponentupdate-parameters*/}

- `nextProps`: コンポーネントが次にレンダリングするprops。`nextProps`を[`this.props`](#props)と比較して何が変わったかを判断します。
- `nextState`: コンポーネントが次にレンダリングするstate。`nextState`を[`this.state`](#state)と比較して何が変わったかを判断します。
- `nextContext`: コンポーネントが次にレンダリングするcontext。`nextContext`を[`this.context`](#context)と比較して何が変わったかを判断します。これは[`static contextType`](#static-contexttype)（モダン）または[`static contextTypes`](#static-contexttypes)（レガシー）を指定した場合にのみ利用可能です。

#### 戻り値 {/*shouldcomponentupdate-returns*/}

コンポーネントを再レンダリングしたい場合は`true`を返します。これはデフォルトの動作です。

再レンダリングをスキップできることをReactに伝えるために`false`を返します。

#### 注意点 {/*shouldcomponentupdate-caveats*/}

- このメソッドは*パフォーマンス最適化*のためにのみ存在します。コンポーネントがこれなしで壊れる場合は、まずそれを修正してください。

- `shouldComponentUpdate`を手動で書く代わりに[`PureComponent`](/reference/react/PureComponent)を使用することを検討してください。`PureComponent`はpropsとstateをシャローに比較し、必要な更新をスキップする可能性を減らします。

- `shouldComponentUpdate`で深い等価性チェックや`JSON.stringify`の使用は推奨しません。これはパフォーマンスを予測不可能にし、各propsやstateのデータ構造に依存します。最良の場合、アプリケーションに数秒の遅延を引き起こすリスクがあり、最悪の場合、アプリケーションをクラッシュさせるリスクがあります。

- `false`を返すことは、*子コンポーネント*がそのstateの変更に応じて再レンダリングされるのを防ぎません。

- `false`を返すことは、コンポーネントが再レンダリングされないことを*保証*するものではありません。Reactは戻り値をヒントとして使用しますが、他の理由でコンポーネントを再レンダリングすることが理にかなっている場合は、それを選択することがあります。

<Note>

クラスコンポーネントを`shouldComponentUpdate`で最適化することは、関数コンポーネントを[`memo`](/reference/react/memo)で最適化することと同等です。関数コンポーネントは[`useMemo`](/reference/react/useMemo)を使用してより細かい最適化も提供します。

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

`UNSAFE_componentWillMount`を定義すると、Reactは[`constructor`](#constructor)の直後にそれを呼び出します。これは歴史的な理由でのみ存在し、新しいコードでは使用すべきではありません。代わりに以下の代替手段を使用してください。

- stateを初期化するには、クラスフィールドとして[`state`](#state)を宣言するか、[`constructor`](#constructor)内で`this.state`を設定します。
- 副作用を実行するかサブスクリプションを設定する必要がある場合は、代わりに[`componentDidMount`](#componentdidmount)にそのロジックを移動します。

[非安全なライフサイクルからの移行例を参照してください。](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### パラメータ {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount`はパラメータを取りません。

#### 戻り値 {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount`は何も返すべきではありません。

#### 注意点 {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount`は、コンポーネントが[`static getDerivedStateFromProps`](#static-getderivedstatefromprops)または[`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)を実装している場合には呼び出されません。

- 名前に反して、`UNSAFE_componentWillMount`はコンポーネントが*マウントされる*ことを保証しません。アプリが[`Suspense`](/reference/react/Suspense)のようなモダンなReact機能を使用している場合、レンダリング試行が中断されると（例えば、子コンポーネントのコードがまだロードされていないため）、Reactは進行中のツリーを破棄し、次の試行中にコンポーネントを最初から構築しようとします。このため、このメソッドは「非安全」です。マウントに依存するコード（サブスクリプションの追加など）は[`componentDidMount`](#componentdidmount)に移動する必要があります。

- `UNSAFE_componentWillMount`は[サーバーレンダリング](/reference/react-dom/server)中に実行される唯一のライフサイクルメソッドです。実際には[`constructor`](#constructor)と同じなので、このタイプのロジックには`constructor`を使用するべきです。

<Note>

クラスコンポーネントで`UNSAFE_componentWillMount`内で[`setState`](#setstate)を呼び出してstateを初期化することは、関数コンポーネントで[`useState`](/reference/react/useState)の初期stateとしてそのstateを渡すことと同等です。

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

`UNSAFE_componentWillReceiveProps`を定義すると、コンポーネントが新しいpropsを受け取るときにReactがそれを呼び出します。これは歴史的な理由でのみ存在し、新しいコードでは使用すべきではありません。代わりに以下の代替手段を使用してください。

- propsの変更に応じて**副作用を実行**する必要がある場合（例えば、データをフェッチする、アニメーションを実行する、サブスクリプションを再初期化する）、そのロジックを[`componentDidUpdate`](#componentdidupdate)に移動します。
- propsの変更時に**一部のデータの再計算を避ける**必要がある場合、[メモ化ヘルパー](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)を使用します。
- propsの変更時に**一部のstateを「リセット」**する必要がある場合、コンポーネントを[完全に制御された](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)または[キー付きで完全に非制御](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)にすることを検討します。
- propsの変更時に**一部のstateを「調整」**する必要がある場合、レンダリング中にpropsだけからすべての必要な情報を計算できるかどうかを確認します。できない場合は、代わりに[`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops)を使用します。

[非安全なライフサイクルからの移行例を参照してください。](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### パラメータ {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: 親コンポーネントから受け取る次のprops。`nextProps`を[`this.props`](#props)と比較して何が変わったかを判断します。
- `nextContext`: 最も近いプロバイダーから受け取る次のcontext。`nextContext`を[`this.context`](#context)と比較して何が変わったかを判断します。これは[`static contextType`](#static-contexttype)（モダン）または[`static contextTypes`](#static-contexttypes)（レガシー）を指定した場合にのみ利用可能です。

#### 戻り値 {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps`は何も返すべきではありません。

#### 注意点 {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps`は、コンポーネントが[`static getDerivedStateFromProps`](#static-getderivedstatefromprops)または[`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)を実装している場合には呼び出されません。

- 名前に反して、`UNSAFE_componentWillReceiveProps`はコンポーネントがそのpropsを*受け取る*ことを保証しません。アプリが[`Suspense`](/reference/react/Suspense)のようなモダンなReact機能を使用している場合、レンダリング試行が中断されると（例えば、子コンポーネントのコードがまだロードされていないため）、Reactは進行中のツリーを破棄し、次の試行中にコンポーネントを最初から構築しようとします。このため、このメソッドは「非安全」です。コミットされた更新のみに実行されるべきコード（サブスクリプションのリセットなど）は[`componentDidUpdate`](#componentdidupdate)に移動する必要があります。

- `UNSAFE_componentWillReceiveProps`は、コンポーネントが前回受け取ったpropsと*異なる*propsを受け取ったことを意味しません。`nextProps`と`this.props`を比較して何が変わったかを自分で確認する必要があります。

- Reactはマウント中に初期propsで`UNSAFE_componentWillReceiveProps`を呼び出しません。通常、親が再レンダリングを引き起こす場合にのみこのメソッドが呼び出されます。例えば、[`setState`](#setstate)を呼び出しても、同じコンポーネント内では通常`UNSAFE_componentWillReceiveProps`をトリガーしません。

<Note>

クラスコンポーネントで`UNSAFE_componentWillReceiveProps`内で[`setState`](#setstate)を呼び出してstateを「調整」することは、関数コンポーネントで[`useState`の`set`関数をレンダリング中に呼び出す](/reference/react/useState#storing-information-from-previous-renders)ことと同等です。

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}

`UNSAFE_componentWillUpdate`を定義すると、Reactは新しいpropsやstateでレンダリングする前にそれを呼び出します。これは歴史的な理由でのみ存在し、新しいコードでは使用すべきではありません。代わりに以下の代替手段を使用してください。

- propsやstateの変更に応じて副作用を実行する必要がある場合（例えば、データをフェッチする、アニメーションを実行する、サブスクリプションを再初期化する）、そのロジックを[`componentDidUpdate`](#componentdidupdate)に移動します。
- DOMから情報を読み取る必要がある場合（例えば、現在のスクロール位置を保存するため）、[`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)内で読み取ります。

[非安全なライフサイクルからの移行例を参照してください。](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### パラメータ {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: コンポーネントが次にレンダリングするprops。`nextProps`を[`this.props`](#props)と比較して何が変わったかを判断します。
- `nextState`: コンポーネントが次にレンダリングするstate。`nextState`を[`this.state`](#state)と比較して何が変わったかを判断します。

#### 戻り値 {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate`は何も返すべきではありません。

#### 注意点 {/*unsafe_componentwillupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)が定義されていて`false`を返す場合、`UNSAFE_componentWillUpdate`は呼び出されません。

- `UNSAFE_componentWillUpdate`は、コンポーネントが[`static getDerivedStateFromProps`](#static-getderivedstatefromprops)または[`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)を実装している場合には呼び出されません。

- `componentWillUpdate`中に[`setState`](#setstate)（または`setState`が呼び出されるメソッド、例えばReduxアクションのディスパッチ）を呼び出すことはサポートされていません。

- 名前に反して、`UNSAFE_componentWillUpdate`はコンポーネントが*更新される*ことを保証しません。アプリが[`Suspense`](/reference/react/Suspense)のようなモダンなReact機能を使用している場合、レンダリング試行が中断されると（例えば、子コンポーネントのコードがまだロードされていないため）、Reactは進行中のツリーを破棄し、次の試行中にコンポーネントを最初から構築しようとします。このため、このメソッドは「非安全」です。コミットされた更新のみに実行されるべきコード（サブスクリプ
ションのリセットなど）は[`componentDidUpdate`](#componentdidupdate)に移動する必要があります。

- `UNSAFE_componentWillUpdate`は、コンポーネントが前回受け取ったpropsやstateと*異なる*propsやstateを受け取ったことを意味しません。`nextProps`と`this.props`、および`nextState`と`this.state`を比較して何が変わったかを自分で確認する必要があります。

- Reactはマウント中に初期propsやstateで`UNSAFE_componentWillUpdate`を呼び出しません。

<Note>

関数コンポーネントには`UNSAFE_componentWillUpdate`の直接的な対応物はありません。

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。[代わりに`static contextType`を使用してください。](#static-contexttype)

</Deprecated>

このコンポーネントが提供する[レガシーコンテキスト](https://reactjs.org/docs/legacy-context.html)の型を指定できます。

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

このAPIは将来のReactのメジャーバージョンで削除されます。[代わりに`static contextType`を使用してください。](#static-contexttype)

</Deprecated>

このコンポーネントが消費する[レガシーコンテキスト](https://reactjs.org/docs/legacy-context.html)の型を指定できます。

---

### `static contextType` {/*static-contexttype*/}

クラスコンポーネントから[`this.context`](#context-instance-field)を読み取りたい場合、読み取る必要があるコンテキストを指定する必要があります。`static contextType`として指定するコンテキストは、以前に[`createContext`](#createContext)によって作成された値でなければなりません。

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

クラスコンポーネントで`this.context`を読み取ることは、関数コンポーネントで[`useContext`](/reference/react/useContext)を使用することと同等です。

[移行方法を参照してください。](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

クラスのデフォルトpropsを設定するために`static defaultProps`を定義できます。これらは`undefined`および欠落しているpropsに対して使用されますが、`null`のpropsには使用されません。

例えば、`color`プロップがデフォルトで`'blue'`になるように定義する方法は次のとおりです。

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

`color`プロップが提供されていないか`undefined`の場合、それはデフォルトで`'blue'`に設定されます。

```js
<>
  {/* this.props.colorは "blue" */}
  <Button />

  {/* this.props.colorは "blue" */}
  <Button color={undefined} />

  {/* this.props.colorは null */}
  <Button color={null} />

  {/* this.props.colorは "red" */}
  <Button color="red" />
</>
```

<Note>

クラスコンポーネントで`defaultProps`を定義することは、関数コンポーネントで[デフォルト値を指定する](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop)ことと同等です。

</Note>

---

### `static propTypes` {/*static-proptypes*/}

[`prop-types`](https://www.npmjs.com/package/prop-types)ライブラリと一緒に`static propTypes`を定義して、コンポーネントが受け入れるpropsの型を宣言できます。これらの型はレンダリング中および開発時にのみチェックされます。

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

ランタイムでのプロップ型チェックの代わりに[TypeScript](https://www.typescriptlang.org/)を使用することをお勧めします。

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

`static getDerivedStateFromError`を定義すると、子コンポーネント（遠い子コンポーネントを含む）がレンダリング中にエラーをスローしたときにReactがそれを呼び出します。これにより、UIをクリアする代わりにエラーメッセージを表示することができます。

通常、これは[`componentDidCatch`](#componentdidcatch)と一緒に使用され、エラーレポートを分析サービスに送信することができます。これらのメソッドを持つコンポーネントは*エラーバウンダリ*と呼ばれます。

[例を参照してください。](#catching-rendering-errors-with-an-error-boundary)

#### パラメータ {/*static-getderivedstatefromerror-parameters*/}

* `error`: スローされたエラー。実際には、通常[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)のインスタンスですが、JavaScriptは任意の値（文字列や`null`を含む）を[`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)できるため、これは保証されません。

#### 戻り値 {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError`は、エラーメッセージを表示するためのstateを返すべきです。

#### 注意点 {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError`は純粋関数であるべきです。副作用を実行したい場合（例えば、分析サービスを呼び出すため）、[`componentDidCatch`](#componentdidcatch)も実装する必要があります。

<Note>

関数コンポーネントにはまだ`static getDerivedStateFromError`の直接的な対応物はありません。クラスコンポーネントを作成したくない場合は、上記のような単一の`ErrorBoundary`コンポーネントを作成し、アプリ全体で使用してください。あるいは、[`react-error-boundary`](https://github.com/bvaughn/react-error-boundary)パッケージを使用することもできます。

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

`static getDerivedStateFromProps`を定義すると、Reactは[`render`](#render)を呼び出す直前にそれを呼び出します。これは初回マウント時およびその後の更新時に呼び出されます。stateを更新するためのオブジェクトを返すか、何も更新しない場合は`null`を返すべきです。

このメソッドは、stateが時間の経過とともにpropsの変更に依存する[まれなユースケース](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)のために存在します。例えば、この`Form`コンポーネントは`userID`プロップが変更されたときに`email` stateをリセットします。

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 現在のユーザーが変更されるたびに、
    // そのユーザーに関連するstateの部分をリセットします。
    // このシンプルな例では、それはemailだけです。
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

このパターンでは、propsの以前の値（`userID`など）をstate（`prevUserID`など）に保持する必要があることに注意してください。

<Pitfall>

stateを導出することは冗長なコードを生み出し、コンポーネントの考え方を難しくします。[よりシンプルな代替手段に慣れていることを確認してください。](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- propsの変更に応じて**副作用を実行**する必要がある場合（例えば、データをフェッチする、アニメーションを実行する）、[`componentDidUpdate`](#componentdidupdate)メソッドを使用します。
- propsの変更時に**一部のデータを再計算**したい場合、[メモ化ヘルパーを使用します。](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- propsの変更時に**一部のstateを「リセット」**したい場合、コンポーネントを[完全に制御された](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)または[キー付きで完全に非制御](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)にすることを検討します。

</Pitfall>

#### パラメータ {/*static-getderivedstatefromprops-parameters*/}

- `props`: コンポーネントが次にレンダリングするprops。
- `state`: コンポーネントが次にレンダリングするstate。

#### 戻り値 {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps`はstateを更新するためのオブジェクトを返すか、何も更新しない場合は`null`を返すべきです。

#### 注意点 {/*static-getderivedstatefromprops-caveats*/}

- このメソッドは*すべての*レンダリングで発火します。これは[`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)とは異なり、親が再レンダリングを引き起こす場合にのみ発火し、ローカルの`setState`の結果としては発火しません。

- このメソッドはコンポーネントインスタンスにアクセスできません。`static getDerivedStateFromProps`と他のクラスメソッドの間でコードを再利用したい場合は、コンポーネントのpropsとstateの純粋関数をクラス定義の外に抽出することができます。

<Note>

クラスコンポーネントで`static getDerivedStateFromProps`を実装することは、関数コンポーネントで[`useState`の`set`関数をレンダリング中に呼び出す](/reference/react/useState#storing-information-from-previous-renders)ことと同等です。

</Note>

---

## 使用例 {/*usage*/}

### クラスコンポーネントの定義 {/*defining-a-class-component*/}

Reactコンポーネントをクラスとして定義するには、組み込みの`Component`クラスを拡張し、[`render`メソッド](#render)を定義します。

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Reactは画面に表示する内容を決定するために[`render`](#render)メソッドを呼び出します。通常、`render`メソッドから[JSX](/learn/writing-markup-with-jsx)を返します。`render`メソッドは[純粋関数](https://en.wikipedia.org/wiki/Pure_function)として記述するべきです。つまり、JSXを計算するだけです。

[関数コンポーネント](/learn/your-first-component#defining-a-component)と同様に、クラスコンポーネントも親コンポーネントから[propsを受け取る](/learn/your-first-component#defining-a-component)ことができます。ただし、propsを読み取る構文は異なります。例えば、親コンポーネントが`<Greeting name="Taylor" />`をレンダリングする場合、`this.props`から`name`プロップを読み取ることができます。

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

Hooks（`use`で始まる関数、例えば[`useState`](/reference/react/useState)）はクラスコンポーネント内ではサポートされていないことに注意してください。

<Pitfall>

コンポーネントをクラスではなく関数として定義することをお勧めします。[移行方法を参照してください。](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### クラスコンポーネントにstateを追加する {/*adding-state-to-a-class-component*/}

クラスに[state](/learn/state-a-components-memory)を追加するには、[`state`](#state)というプロパティにオブジェクトを割り当てます。stateを更新するには、[`this.setState`](#setstate)を呼び出します。

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

コンポーネントをクラスではなく関数として定義することをお勧めします。[移行方法を参照してください。](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### クラスコンポーネントにライフサイクルメソッドを追加する {/*adding-lifecycle-methods-to-a-class-component*/}

クラスに定義できる特別なメソッドがいくつかあります。

[`componentDidMount`](#componentdidmount)メソッドを定義すると、コンポーネントが画面に追加されたときにReactがそれを呼び出します。Reactは、propsやstateが変更されたためにコンポーネントが再レンダリングされた後に[`componentDidUpdate`](#componentdidupdate)を呼び出します。Reactは、コンポーネントが画面から削除された後に[`componentWillUnmount`](#componentwillunmount)を呼び出します。

`componentDidMount`を実装する場合、バグを避けるために通常はすべてのライフサイクルメソッドを実装する必要があります。例えば、`componentDidMount`がstateやpropsを読み取る場合、`componentDidUpdate`を実装してそれらの変更を処理し、`componentWillUnmount`を実装して`componentDidMount`が行っていたことをクリーンアップする必要があります。

例えば、この`ChatRoom`コンポーネントはpropsとstateに同期したチャット接続を保持します。

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
import { Component
 from 'react';
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
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

開発中に[Strict Mode](/reference/react/StrictMode)がオンの場合、Reactは`componentDidMount`を呼び出し、すぐに`componentWillUnmount`を呼び出し、その後再び`componentDidMount`を呼び出します。これにより、`componentWillUnmount`を実装し忘れた場合や、そのロジックが`componentDidMount`の動作を完全に「ミラー」していない場合に気付くことができます。

<Pitfall>

コンポーネントをクラスではなく関数として定義することをお勧めします。[移行方法を参照してください。](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### エラーバウンダリでレンダリングエラーをキャッチする {/*catching-rendering-errors-with-an-error-boundary*/}

デフォルトでは、アプリケーションがレンダリング中にエラーをスローすると、ReactはそのUIを画面から削除します。これを防ぐために、UIの一部を*エラーバウンダリ*でラップすることができます。エラーバウンダリは、クラッシュした部分の代わりにフォールバックUI（例えば、エラーメッセージ）を表示する特別なコンポーネントです。

エラーバウンダリコンポーネントを実装するには、エラーに応じてstateを更新し、ユーザーにエラーメッセージを表示するための[`static getDerivedStateFromError`](#static-getderivedstatefromerror)を提供する必要があります。また、オプションで[`componentDidCatch`](#componentdidcatch)を実装して、エラーを分析サービスにログするなどの追加ロジックを追加することもできます。

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 次のレンダリングでフォールバックUIを表示するようにstateを更新します。
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 例 "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 任意のカスタムフォールバックUIをレンダリングできます
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

次に、コンポーネントツリーの一部をそれでラップします。

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

`Profile`またはその子コンポーネントがエラーをスローすると、`ErrorBoundary`はそのエラーを「キャッチ」し、提供されたエラーメッセージを含むフォールバックUIを表示し、エラーレポートをエラーレポートサービスに送信します。

すべてのコンポーネントを個別のエラーバウンダリでラップする必要はありません。エラーバウンダリの[粒度](https://www.brandondail.com/posts/fault-tolerance-react)を考えるとき、エラーメッセージを表示するのが理にかなっている場所を考慮してください。例えば、メッセージングアプリでは、会話リストの周りにエラーバウンダリを配置するのが理にかなっています。また、個々のメッセージの周りにもエラーバウンダリを配置するのが理にかなっています。ただし、すべてのアバターの周りにバウンダリを配置するのは理にかなっていません。

<Note>

現在、関数コンポーネントとしてエラーバウンダリを書く方法はありません。ただし、エラーバウンダリクラスを自分で書く必要はありません。例えば、[`react-error-boundary`](https://github.com/bvaughn/react-error-boundary)を使用することができます。

</Note>

---

## 代替手段 {/*alternatives*/}

### シンプルなコンポーネントをクラスから関数に移行する {/*migrating-a-simple-component-from-a-class-to-a-function*/}

通常、[コンポーネントを関数として定義します](/learn/your-first-component#defining-a-component)。

例えば、この`Greeting`クラスコンポーネントを関数に変換する場合を考えてみましょう。

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

`Greeting`という関数を定義します。ここに`render`関数の本体を移動します。

```js
function Greeting() {
  // ... renderメソッドからコードをここに移動します ...
}
```

`this.props.name`の代わりに、[分割代入構文](/learn/passing-props-to-a-component)を使用して`name`プロップを定義し、直接読み取ります。

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

完全な例は次のとおりです。

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

### stateを持つコンポーネントをクラスから関数に移行する {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

この`Counter`クラスコンポーネントを関数に変換する場合を考えてみましょう。

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

まず、必要な[state変数](/reference/react/useState#adding-state-to-a-component)を持つ関数を宣言します。

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

次に、イベントハンドラを変換します。

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

最後に、`this`で始まるすべての参照を、コンポーネント内で定義した変数や関数に置き換えます。例えば、`this.state.age`を`age`に置き換え、`this.handleNameChange`を`handleNameChange`に置き換えます。

完全に変換されたコンポーネントは次のとおりです。

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

### ライフサイクルメソッドを持つコンポーネントをクラスから関数に移行する {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

ライフサイクルメソッドを持つこの`ChatRoom`クラスコンポーネントを関数に変換する場合を考えてみましょう。

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
  // 実際の実装ではサーバーに接続します
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

まず、[`componentWillUnmount`](#componentwillunmount)が[`componentDidMount`](#componentdidmount)の逆の動作をすることを確認します。上記の例では、`componentDidMount`が設定する接続を切断します。このようなロジックが欠けている場合は、最初にそれを追加します。

次に、[`componentDidUpdate`](#componentdidupdate)メソッドが`componentDidMount`で使用しているすべてのpropsやstateの変更を処理することを確認します。上記の例では、`componentDidMount`は`setupConnection`を呼び出し、`this.state.serverUrl`と`this.props.roomId`を読み取ります。このため、`componentDidUpdate`は`this.state.serverUrl`と`this.props.roomId`が変更されたかどうかを確認し、変更された場合は接続をリセットします。`componentDidUpdate`ロジックが欠けているか、関連するすべてのpropsやstateの変更を処理していない場合は、最初にそれを修正します。

上記の例では、ライフサイクルメソッド内のロジックはコンポーネントをReactの外部システム（チャットサーバー）に接続します。コンポーネントを外部システムに接続するには、このロジックを単一のEffectとして記述します。

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

この[`useEffect`](/reference/react/useEffect)呼び出しは、上記のライフサイクルメソッドのロジックと同等です。ライフサイクルメソッドが複数の無関係なことを行っている場合は、それらを複数の独立したEffectに分割します。完全な例は次のとおりです。

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
  // 実際の実装ではサーバーに接続します  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
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

コンポーネントが外部システムと同期しない場合、[Effectが不要な場合があります。](/learn/you-might-not-need-an-effect)

</Note>

---

### コンテキストを持つコンポーネントをクラスから関数に移行する {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

この例では、`Panel`と`Button`クラスコンポーネントが[`this.context`](#context)から[コンテキスト](/learn/passing-data-deeply-with-context)を読み取ります。

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

関数コンポーネントに変換する際には、[`useContext`](/reference/react/useContext)呼び出しで`this.context`を置き換えます。

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