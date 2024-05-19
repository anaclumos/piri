---
title: React DOM API
---

<Intro>

`react-dom`パッケージには、ウェブアプリケーション（ブラウザのDOM環境で実行される）でのみサポートされるメソッドが含まれています。これらはReact Nativeではサポートされていません。

</Intro>

---

## APIs {/*apis*/}

これらのAPIはコンポーネントからインポートして使用できますが、使用頻度は低いです：

* [`createPortal`](/reference/react-dom/createPortal)は、子コンポーネントをDOMツリーの別の部分にレンダリングすることができます。
* [`flushSync`](/reference/react-dom/flushSync)は、Reactに状態更新を強制的にフラッシュさせ、DOMを同期的に更新させることができます。

## リソースプリロードAPI {/*resource-preloading-apis*/}

これらのAPIは、スクリプト、スタイルシート、フォントなどのリソースを事前にロードすることでアプリを高速化するために使用できます。例えば、リソースが使用される別のページに移動する前にロードする場合などです。

[Reactベースのフレームワーク](/learn/start-a-new-react-project)は、リソースのロードを自動的に処理することが多いため、これらのAPIを自分で呼び出す必要がないかもしれません。詳細はフレームワークのドキュメントを参照してください。

* [`prefetchDNS`](/reference/react-dom/prefetchDNS)は、接続する予定のDNSドメイン名のIPアドレスを事前に取得することができます。
* [`preconnect`](/reference/react-dom/preconnect)は、リソースを要求する予定のサーバーに事前に接続することができます。どのリソースが必要かまだわからない場合でも接続できます。
* [`preload`](/reference/react-dom/preload)は、使用する予定のスタイルシート、フォント、画像、または外部スクリプトを事前に取得することができます。
* [`preloadModule`](/reference/react-dom/preloadModule)は、使用する予定のESMモジュールを事前に取得することができます。
* [`preinit`](/reference/react-dom/preinit)は、外部スクリプトを取得して評価するか、スタイルシートを取得して挿入することができます。
* [`preinitModule`](/reference/react-dom/preinitModule)は、ESMモジュールを取得して評価することができます。

---

## エントリーポイント {/*entry-points*/}

`react-dom`パッケージは、2つの追加エントリーポイントを提供します：

* [`react-dom/client`](/reference/react-dom/client)は、クライアント（ブラウザ）でReactコンポーネントをレンダリングするためのAPIを含んでいます。
* [`react-dom/server`](/reference/react-dom/server)は、サーバーでReactコンポーネントをレンダリングするためのAPIを含んでいます。

---

## 廃止予定のAPI {/*deprecated-apis*/}

<Deprecated>

これらのAPIは、将来のReactのメジャーバージョンで削除される予定です。

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode)は、クラスコンポーネントインスタンスに対応する最も近いDOMノードを見つけます。
* [`hydrate`](/reference/react-dom/hydrate)は、サーバーHTMLから作成されたツリーをDOMにマウントします。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)に置き換えられました。
* [`render`](/reference/react-dom/render)は、ツリーをDOMにマウントします。[`createRoot`](/reference/react-dom/client/createRoot)に置き換えられました。
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode)は、ツリーをDOMからアンマウントします。[`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)に置き換えられました。