---
title: クライアント React DOM API
---

<Intro>

`react-dom/client` APIは、クライアント（ブラウザ内）でReactコンポーネントをレンダリングすることを可能にします。これらのAPIは通常、アプリのトップレベルで使用され、Reactツリーを初期化します。[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)がこれらを呼び出すこともあります。ほとんどのコンポーネントはこれらをインポートしたり使用したりする必要はありません。

</Intro>

---

## クライアントAPI {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot)は、ブラウザのDOMノード内にReactコンポーネントを表示するためのルートを作成します。
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)は、以前に[`react-dom/server`](/reference/react-dom/server)によって生成されたHTMLコンテンツを持つブラウザのDOMノード内にReactコンポーネントを表示します。

---

## ブラウザサポート {/*browser-support*/}

Reactは、Internet Explorer 9以上を含むすべての一般的なブラウザをサポートしています。IE 9やIE 10などの古いブラウザにはいくつかのポリフィルが必要です。