---
title: React 19 ベータ版アップグレードガイド
author: Ricky Hanlon
date: 2024/04/25
description: React 19に追加された改善にはいくつかの重大な変更が必要ですが、アップグレードをできるだけスムーズにするために取り組んできましたので、ほとんどのアプリに影響を与えることはないと考えています。この投稿では、ライブラリをReact 19ベータ版にアップグレードする手順を案内します。
---

2024年4月25日 [Ricky Hanlon](https://twitter.com/rickhanlonii) による

---

<Note>

このベータリリースは、ライブラリがReact 19に備えるためのものです。アプリ開発者は18.3.0にアップグレードし、ライブラリと協力してフィードバックに基づいて変更を行う間、React 19の安定版を待つべきです。

</Note>


<Intro>

React 19に追加された改善にはいくつかの破壊的変更が必要ですが、アップグレードをできるだけスムーズにするために努力しており、ほとんどのアプリに影響を与えることはないと予想しています。

アップグレードを容易にするために、今日はReact 18.3も公開しています。

</Intro>

<Note>

#### React 18.3も公開されました {/*react-18-3*/}

React 19へのアップグレードを容易にするために、18.2と同一ですが、非推奨APIの警告やReact 19に必要な他の変更を追加した`react@18.3`リリースを公開しました。

React 19にアップグレードする前に、まずReact 18.3にアップグレードして、問題を特定することをお勧めします。

18.3の変更点のリストについては、[リリースノート](https://github.com/facebook/react/blob/main/CHANGELOG.md)を参照してください。

</Note>

この投稿では、ライブラリをReact 19ベータにアップグレードする手順を案内します：

- [インストール](#installing)
- [破壊的変更](#breaking-changes)
- [新しい非推奨](#new-deprecations)
- [注目すべき変更](#notable-changes)
- [TypeScriptの変更](#typescript-changes)
- [変更ログ](#changelog)

React 19のテストを手伝いたい場合は、このアップグレードガイドの手順に従い、遭遇した問題を[報告](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D)してください。React 19ベータに追加された新機能のリストについては、[React 19リリース投稿](/blog/2024/04/25/react-19)を参照してください。

---
## インストール {/*installing*/}

<Note>

#### 新しいJSXトランスフォームが必要です {/*new-jsx-transform-is-now-required*/}

2020年にバンドルサイズを改善し、ReactをインポートせずにJSXを使用できるようにするために[新しいJSXトランスフォーム](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)を導入しました。React 19では、プロップとしてのrefの使用やJSXの速度改善など、新しいトランスフォームが必要な追加の改善を行っています。

新しいトランスフォームが有効でない場合、次の警告が表示されます：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

アプリ（またはその依存関係の1つ）が古いJSXトランスフォームを使用しています。より高速なパフォーマンスのために最新のJSXトランスフォームに更新してください：https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>

ほとんどのアプリはすでにトランスフォームが有効になっているため、影響を受けないと予想しています。手動でのアップグレード手順については、[発表投稿](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)を参照してください。

</Note>

最新バージョンのReactとReact DOMをインストールするには：

```bash
npm install react@beta react-dom@beta
```

TypeScriptを使用している場合は、型も更新する必要があります。React 19が安定版としてリリースされると、通常通り`@types/react`と`@types/react-dom`から型をインストールできます。ベータ期間中は、型が異なるパッケージで提供されており、`package.json`で強制する必要があります：

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  },
  "overrides": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  }
}
```

最も一般的な置換のためのcodemodも含めています。以下の[TypeScriptの変更](#typescript-changes)を参照してください。


## 破壊的変更 {/*breaking-changes*/}

### レンダリング中のエラーは再スローされません {/*errors-in-render-are-not-re-thrown*/}

以前のバージョンのReactでは、レンダリング中にスローされたエラーはキャッチされて再スローされました。DEVでは、`console.error`にもログを記録し、エラーログが重複する結果となりました。

React 19では、重複を減らすためにエラーの処理方法を[改善](/blog/2024/04/25/react-19#error-handling)し、再スローしないようにしました：

- **キャッチされないエラー**：エラーバウンダリによってキャッチされないエラーは`window.reportError`に報告されます。
- **キャッチされたエラー**：エラーバウンダリによってキャッチされたエラーは`console.error`に報告されます。

この変更はほとんどのアプリに影響を与えないはずですが、プロダクションエラーレポートがエラーの再スローに依存している場合は、エラーハンドリングを更新する必要があるかもしれません。これをサポートするために、カスタムエラーハンドリングのための新しいメソッドを`createRoot`と`hydrateRoot`に追加しました：

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... エラーレポートをログ
  },
  onCaughtError: (error, errorInfo) => {
    // ... エラーレポートをログ
  }
});
```

詳細については、[`createRoot`](https://react.dev/reference/react-dom/client/createRoot)と[`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)のドキュメントを参照してください。


### 非推奨のReact APIの削除 {/*removed-deprecated-react-apis*/}

#### 削除された: 関数の`propTypes`と`defaultProps` {/*removed-proptypes-and-defaultprops*/}
`PropTypes`は[2017年4月（v15.5.0）](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings)に非推奨となりました。

React 19では、Reactパッケージから`propType`チェックを削除し、それらを使用しても無視されます。`propTypes`を使用している場合は、TypeScriptや他の型チェックソリューションに移行することをお勧めします。

また、関数コンポーネントの`defaultProps`をES6のデフォルトパラメータに置き換えています。クラスコンポーネントはES6の代替手段がないため、`defaultProps`を引き続きサポートします。

```js
// 以前
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// 以後
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

#### 削除された: `contextTypes`と`getChildContext`を使用したレガシーコンテキスト {/*removed-removing-legacy-context*/}

レガシーコンテキストは[2018年10月（v16.6.0）](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html)に非推奨となりました。

レガシーコンテキストはクラスコンポーネントでのみ使用可能で、`contextTypes`と`getChildContext`APIを使用していましたが、見逃しやすい微妙なバグのために`contextType`に置き換えられました。React 19では、Reactを少し小さく、速くするためにレガシーコンテキストを削除しています。

クラスコンポーネントでレガシーコンテキストをまだ使用している場合は、新しい`contextType`APIに移行する必要があります：

```js {5-11,19-21}
// 以前
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// 以後
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### 削除された: 文字列リファレンス {/*removed-string-refs*/}
文字列リファレンスは[2018年3月（v16.3.0）](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html)に非推奨となりました。

クラスコンポーネントは、[複数の欠点](https://github.com/facebook/react/issues/1373)のためにリファレンスコールバックに置き換えられる前に文字列リファレンスをサポートしていました。React 19では、Reactをシンプルで理解しやすくするために文字列リファレンスを削除しています。

クラスコンポーネントでまだ文字列リファレンスを使用している場合は、リファレンスコールバックに移行する必要があります：

```js {4,8}
// 以前
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// 以後
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

移行を支援するために、文字列リファレンスを`ref`コールバックに自動的に置き換える[react-codemod](https://github.com/reactjs/react-codemod/#string-refs)を公開します。このPRをフォローして、試してみてください。[このPR](https://github.com/reactjs/react-codemod/pull/309)をフォローして、試してみてください。

</Note>

#### 削除された: モジュールパターンファクトリー {/*removed-module-pattern-factories*/}
モジュールパターンファクトリーは[2019年8月（v16.9.0）](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories)に非推奨となりました。

このパターンはほとんど使用されておらず、サポートすることでReactがわずかに大きく、遅くなります。React 19では、モジュールパターンファクトリーのサポートを削除し、通常の関数に移行する必要があります：

```js
// 以前
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// 以後
function FactoryComponent() {
  return <div />;
}
```

#### 削除された: `React.createFactory` {/*removed-createfactory*/}
`createFactory`は[2020年2月（v16.13.0）](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory)に非推奨となりました。

`createFactory`の使用は、JSXの広範なサポートが普及する前に一般的でしたが、今日ではほとんど使用されておらず、JSXに置き換えることができます。React 19では、`createFactory`を削除し、JSXに移行する必要があります：

```js
// 以前
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// 以後
const button = <button />;
```

#### 削除された: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

React 18では、`react-test-renderer/shallow`を[react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer)を再エクスポートするように更新しました。React 19では、`react-test-render/shallow`を削除し、パッケージを直接インストールすることを推奨します：

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### シャローレンダリングの再考をお願いします {/*please-reconsider-shallow-rendering*/}

シャローレンダリングはReactの内部に依存しており、将来のアップグレードを妨げる可能性があります。テストを[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)または[@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started)に移行することをお勧めします。

</Note>

### 非推奨のReact DOM APIの削除 {/*removed-deprecated-react-dom-apis*/}

#### 削除された: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

`act`を`react-dom/test-utils`から`react`パッケージに移動しました：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act`は`React.act`に置き換えられました。`react-dom/test-utils`ではなく`react`から`act`をインポートしてください。詳細についてはhttps://react.dev/warnings/react-dom-test-utilsを参照してください。

</ConsoleLogLine>

</ConsoleBlockMulti>

この警告を修正するには、`react`から`act`をインポートします：

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

他のすべての`test-utils`関数は削除されました。これらのユーティリティは一般的ではなく、コンポーネントやReactの低レベルの実装詳細に依存するのが容易すぎました。React 19では、これらの関数は呼び出されるとエラーを返し、将来のバージョンでエクスポートが削除されます。

代替案については[警告ページ](https://react.dev/warnings/react-dom-test-utils)を参照してください。

#### 削除された: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render`は[2022年3月（v18.0.0）](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)に非推奨となりました。React 19では、`ReactDOM.render`を削除し、[`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot)を使用する必要があります：

```js
// 以前
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// 以後
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 削除された: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate`は[2022年3月（v18.0.0）](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)に非推奨となりました。React 19では、`ReactDOM.hydrate`を削除し、[`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)を使用する必要があります：

```js
// 以前
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// 以後
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById
('root'), <App />);
```

#### 削除された: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode`は[2022年3月（v18.0.0）](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)に非推奨となりました。React 19では、`root.unmount()`を使用する必要があります。

```js
// 以前
unmountComponentAtNode(document.getElementById('root'));

// 以後
root.unmount();
```

詳細については、[`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount)および[`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount)の`root.unmount()`を参照してください。

#### 削除された: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}
`ReactDOM.findDOMNode`は[2018年10月（v16.6.0）](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode)に非推奨となりました。

`findDOMNode`は、実行が遅く、リファクタリングに脆弱で、最初の子のみを返し、抽象レベルを壊すため（詳細は[こちら](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)を参照）、削除されます。`ReactDOM.findDOMNode`を[DOMリファレンス](/learn/manipulating-the-dom-with-refs)に置き換えることができます：

```js
// 以前
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
// 以後
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## 新しい非推奨 {/*new-deprecations*/}

### 非推奨: `element.ref` {/*deprecated-element-ref*/}

React 19は[`ref`をプロップとしてサポート](/blog/2024/04/25/react-19#ref-as-a-prop)しているため、`element.props.ref`の代わりに`element.ref`を非推奨としています。

`element.ref`にアクセスすると警告が表示されます：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

element.refへのアクセスはサポートされなくなりました。refは通常のプロップになりました。将来のリリースでJSX要素タイプから削除されます。

</ConsoleLogLine>

</ConsoleBlockMulti>

### 非推奨: `react-test-renderer` {/*deprecated-react-test-renderer*/}

`react-test-renderer`は独自のレンダラー環境を実装しており、ユーザーが使用する環境と一致せず、実装の詳細をテストすることを促進し、Reactの内部の内省に依存しているため、非推奨としています。

テストレンダラーは、[React Testing Library](https://testing-library.com)のようなより実行可能なテスト戦略が利用可能になる前に作成されました。現在では、モダンなテストライブラリの使用を推奨しています。

React 19では、`react-test-renderer`が非推奨警告をログに記録し、同時レンダリングに切り替わりました。テストを[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)または[@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started)に移行することをお勧めします。

## 注目すべき変更 {/*notable-changes*/}

### StrictModeの変更 {/*strict-mode-improvements*/}

React 19には、Strict Modeに対するいくつかの修正と改善が含まれています。

開発中にStrict Modeで二重レンダリングする際、`useMemo`と`useCallback`は最初のレンダリングからメモ化された結果を再利用します。すでにStrict Modeに対応しているコンポーネントは、動作の違いに気付かないはずです。

すべてのStrict Modeの動作と同様に、これらの機能は開発中にコンポーネントのバグを積極的に表面化させ、プロダクションに出荷する前に修正できるように設計されています。たとえば、開発中にStrict Modeは初期マウント時にrefコールバック関数を二重に呼び出し、マウントされたコンポーネントがSuspenseフォールバックに置き換えられた場合に何が起こるかをシミュレートします。

### UMDビルドの削除 {/*umd-builds-removed*/}

UMDは、ビルドステップなしでReactを読み込む便利な方法として広く使用されていました。現在では、HTMLドキュメントでモジュールをスクリプトとして読み込むためのモダンな代替手段があります。React 19からは、テストとリリースプロセスの複雑さを減らすためにUMDビルドを生成しません。

React 19をスクリプトタグで読み込むには、[esm.sh](https://esm.sh/)のようなESMベースのCDNを使用することをお勧めします。

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### Reactの内部に依存するライブラリはアップグレードを妨げる可能性があります {/*libraries-depending-on-react-internals-may-block-upgrades*/}

このリリースには、`SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`のような内部を使用しないようにというお願いを無視するライブラリに影響を与える可能性のあるReact内部の変更が含まれています。これらの変更はReact 19の改善を実現するために必要であり、ガイドラインに従うライブラリには影響を与えません。

[バージョン管理ポリシー](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change)に基づき、これらの更新は破壊的変更としてリストされておらず、アップグレード方法のドキュメントも含まれていません。推奨されるのは、内部に依存するコードを削除することです。

内部使用の影響を反映するために、`SECRET_INTERNALS`のサフィックスを次のように変更しました：

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

将来的には、内部へのアクセスをより積極的にブロックし、使用を抑制し、ユーザーがアップグレードを妨げられないようにします。

## TypeScriptの変更 {/*typescript-changes*/}

### 非推奨のTypeScript型の削除 {/*removed-deprecated-typescript-types*/}

React 19で削除されたAPIに基づいてTypeScriptの型をクリーンアップしました。削除された型の一部はより関連性のあるパッケージに移動され、他の型はReactの動作を説明するために必要なくなりました。

<Note>
ほとんどの型関連の破壊的変更を移行するために[`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/)を公開しました：

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

`element.props`への多くの不正なアクセスがある場合は、次の追加のcodemodを実行できます：

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

サポートされている置換のリストについては、[`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/)を参照してください。codemodが不足していると感じた場合は、[React 19 codemodsの不足リスト](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement)で追跡できます。

### `ref`のクリーンアップが必要 {/*ref-cleanup-required*/}

_この変更は、[`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)として`react-19`codemodプリセットに含まれています。_

refクリーンアップ関数の導入により、refコールバックから他のものを返すことはTypeScriptによって拒否されます。修正は通常、暗黙の戻り値の使用を停止することです：

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

元のコードは`HTMLDivElement`のインスタンスを返し、TypeScriptはこれがクリーンアップ関数であるかどうかを判断できませんでした。

### `useRef`は引数を必要とします {/*useref-requires-argument*/}

_この変更は、[`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)として`react-19`codemodプリセットに含まれています。_

TypeScriptとReactの動作に関する長年の不満は`useRef`でした。型を変更して`useRef`が引数を必要とするようにしました。これにより、型シグネチャが大幅に簡素化されます。これで`createContext`のように動作します。

```ts
// @ts-expect-error: 引数が必要ですが、見つかりませんでした
useRef();
// パス
useRef(undefined);
// @ts-expect-error: 引数が必要ですが、見つかりませんでした
createContext();
// パス
createContext(undefined);
```

これにより、すべてのrefが可変になります。`null`で初期化したためにrefを変更できない問題は発生しません：

```ts
const ref = useRef<number>(null);

// 'current'に代入できません。読み取り専用プロパティです
ref.current = 1;
```

`MutableRef`は、`useRef`が常に返す単一の`RefObject`型に置き換えられました：

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef`には、`useRef<T>(null)`の便利なオーバーロードがあり、自動的に`RefObject<T | null>`を返します。`useRef`の引数が必要なため、`useRef(undefined)`の便利なオーバーロードが追加され、自動的に`RefObject<T | undefined>`を返します。

この変更に関する以前の議論については、[[RFC] Make all refs mutable](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772)を参照してください。

### `ReactElement` TypeScript型の変更 {/*changes-to-the-reactelement-typescript-type*/}

_この変更は[`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props) codemodに含まれています。_

React要素の`props`は、要素が`ReactElement`として型付けされている場合、`any`の代わりに`unknown`をデフォルトとするようになりました。これは、型引数を`ReactElement`に渡す場合には影響しません：

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

しかし、デフォルトに依存していた場合は、`unknown`を処理する必要があります：

```ts
type Example = ReactElement["props"];
//   ^? 以前は'any'、現在は'unknown'
```

多くのレガシーコードが要素のプロップの不正なアクセスに依存している場合にのみ必要です。要素の内省はエスケープハッチとしてのみ存在し、不正なプロップアクセスを明示的に`any`で示すべきです。

### TypeScriptのJSX名前空間 {/*the-jsx-namespace-in-typescript*/}
この変更は[`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)として`react-19`codemodプリセットに含まれています。

長年の要望は、グローバルな`JSX`名前空間を`React.JSX`に置き換えることでした。これにより、グローバル型の汚染が防止され、JSXを活用する異なるUIライブラリ間の競合が防止されます。

JSX名前空間のモジュール拡張を`declare module "...."`でラップする必要があります：

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

正確なモジュール指定子は、`tsconfig.json`の`compilerOptions`で指定したJSXランタイムに依存します：

- `"jsx": "react-jsx"`の場合は`react/jsx-runtime`。
- `"jsx": "react-jsxdev"`の場合は`react/jsx-dev-runtime`。
- `"jsx": "react"`および`"jsx": "preserve"`の場合は`react`。

### `useReducer`の型推論の改善 {/*better-usereducer-typings*/}

`useReducer`は[@mfp22](https://github.com/mfp22)のおかげで型推論が改善されました。

しかし、これにより、`useReducer`が完全なリデューサー型を型パラメータとして受け入れず、代わりに状態とアクション型の両方が必要になるという破壊的変更が必要でした。

新しいベストプラクティスは、`useReducer`に型引数を渡さないことです。
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
これは、状態とアクションを明示的に型付けする必要があるエッジケースでは機能しない場合がありますが、アクションをタプルで渡すことで明示的に型付けできます：
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
リデューサーをインラインで定義する場合は、関数パラメータに注釈を付けることをお勧めします：
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
これは、`useReducer`呼び出しの外にリデューサーを移動する場合にも同様です：

```ts
const reducer = (state: State, action: Action) => state;
```

## 変更ログ {/*changelog*/}

### その他の破壊的変更 {/*other-breaking-changes*/}

- **react-dom**: src/hrefのjavascript URLに対するエラー [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: `onRecoverableError`から`errorInfo.digest`を削除 [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: `unstable_flushControlled`を削除 [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: `unstable_createEventHandle`を削除 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_renderSubtreeIntoContainer`を削除 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_runWithPrioirty`を削除 [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: `react-is`から非推奨メソッドを削除 [28224](https://github.com/facebook/react/pull/28224)

### その他の注目すべき変更 {/*other-notable-changes*/}

- **react**: 同期、デフォルト、および連続レーンのバッチ処理 [#25700](https://github.com/facebook/react/pull/25700)
- **react**: サスペンドされたコンポーネントの兄弟を事前レンダリングしない [#26380](https://github.com/facebook/react/pull/26380)
- **react**: レンダーフェーズの更新による無限更新ループを検出 [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: popstateのトランジションが同期的に [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: SSR中のレイアウト効果警告を削除 [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: src/hrefに空の文字列を設定しないように警告（アンカータグを除く） [#28124](https://github.com/facebook/react/pull/28124)

React 19の安定版リリースとともに、完全な変更ログを公開します。

---

[Andrew Clark](https://twitter.com/acdlite)、[Eli White](https://twitter.com/Eli_White)、[Jack Pope](https://github.com/jackpope)、[Jan Kassens](https://github.com/kassens)、[Josh Story](https://twitter.com/joshcstory)、[Matt Carroll](https://twitter.com/mattcarrollcode)、[Noah Lemen](https://twitter.com/noahlemen)、[Sophie Alpert](https://twitter.com/sophiebits)、および[Sebastian Silbermann](https://twitter.com/sebsilbermann)に、この投稿のレビューと編集を感謝します。