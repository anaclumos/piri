---
title: レガシー React API
---

<Intro>

これらのAPIは `react` パッケージからエクスポートされていますが、新しく書かれたコードでの使用は推奨されていません。推奨される代替案については、リンクされた個々のAPIページを参照してください。

</Intro>

---

## レガシーAPI {/*legacy-apis*/}

* [`Children`](/reference/react/Children) は、`children` プロップとして受け取ったJSXを操作および変換することができます。[代替案を参照してください。](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) は、別の要素を出発点としてReact要素を作成することができます。[代替案を参照してください。](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) は、JavaScriptクラスとしてReactコンポーネントを定義することができます。[代替案を参照してください。](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) は、React要素を作成することができます。通常はJSXを使用します。
* [`createRef`](/reference/react/createRef) は、任意の値を含むことができるrefオブジェクトを作成します。[代替案を参照してください。](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) は、値がReact要素であるかどうかをチェックします。通常は[`cloneElement`](/reference/react/cloneElement)と一緒に使用されます。
* [`PureComponent`](/reference/react/PureComponent) は、[`Component`](/reference/react/Component) に似ていますが、同じプロップで再レンダリングをスキップします。[代替案を参照してください。](/reference/react/PureComponent#alternatives)


---

## 非推奨API {/*deprecated-apis*/}

<Deprecated>

これらのAPIは、将来のReactのメジャーバージョンで削除される予定です。

</Deprecated>

* [`createFactory`](/reference/react/createFactory) は、特定のタイプのReact要素を生成する関数を作成することができます。