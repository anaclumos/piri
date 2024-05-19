---
title: サーバー React DOM API
---

<Intro>

`react-dom/server` APIは、サーバー上でReactコンポーネントをHTMLにレンダリングすることを可能にします。これらのAPIは、アプリのトップレベルで初期HTMLを生成するためにのみサーバー上で使用されます。[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)がこれらを呼び出すことがあります。ほとんどのコンポーネントはこれらをインポートしたり使用したりする必要はありません。

</Intro>

---

## Node.js Streams用のサーバーAPI {/*server-apis-for-nodejs-streams*/}

これらのメソッドは、[Node.js Streams:](https://nodejs.org/api/stream.html)がある環境でのみ利用可能です。

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) は、Reactツリーをパイプ可能な[Node.js Stream](https://nodejs.org/api/stream.html)にレンダリングします。
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) は、非インタラクティブなReactツリーを[Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)にレンダリングします。

---

## Web Streams用のサーバーAPI {/*server-apis-for-web-streams*/}

これらのメソッドは、ブラウザ、Deno、および一部の最新のエッジランタイムを含む[Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)がある環境でのみ利用可能です。

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) は、Reactツリーを[Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)にレンダリングします。

---

## ストリーミングをサポートしない環境用のサーバーAPI {/*server-apis-for-non-streaming-environments*/}

これらのメソッドは、ストリームをサポートしない環境で使用できます。

* [`renderToString`](/reference/react-dom/server/renderToString) は、Reactツリーを文字列にレンダリングします。
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) は、非インタラクティブなReactツリーを文字列にレンダリングします。

これらは、ストリーミングAPIと比較して機能が制限されています。

---

## 廃止予定のサーバーAPI {/*deprecated-server-apis*/}

<Deprecated>

これらのAPIは、将来のReactのメジャーバージョンで削除される予定です。

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) は、Reactツリーを[Node.js Readable stream](https://nodejs.org/api/stream.html#readable-streams)にレンダリングします。（廃止予定）