---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream`は、Reactツリーをパイプ可能な[Node.jsストリーム](https://nodejs.org/api/stream.html)にレンダリングします。

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

このAPIはNode.jsに特化しています。[Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)を持つ環境（Denoや最新のエッジランタイムなど）では、代わりに[`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)を使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

`renderToPipeableStream`を呼び出して、ReactツリーをHTMLとして[Node.jsストリーム](https://nodejs.org/api/stream.html#writable-streams)にレンダリングします。

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

クライアント側では、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出して、サーバー生成のHTMLをインタラクティブにします。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: HTMLにレンダリングしたいReactノード。例えば、`<App />`のようなJSX要素です。ドキュメント全体を表すことが期待されるため、`App`コンポーネントは`<html>`タグをレンダリングする必要があります。

* **オプション** `options`: ストリーミングオプションを含むオブジェクト。
  * **オプション** `bootstrapScriptContent`: 指定された場合、この文字列はインラインの`<script>`タグに配置されます。
  * **オプション** `bootstrapScripts`: ページに出力する`<script>`タグのURLの配列。これを使用して[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出す`<script>`を含めます。クライアントでReactを実行したくない場合は省略します。
  * **オプション** `bootstrapModules`: `bootstrapScripts`と同様ですが、[`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)を出力します。
  * **オプション** `identifierPrefix`: [`useId`](/reference/react/useId)によって生成されたIDにReactが使用する文字列プレフィックス。同じページに複数のルートを使用する場合の競合を避けるために便利です。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)に渡されたプレフィックスと同じである必要があります。
  * **オプション** `namespaceURI`: ストリームのルート[名前空間URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris)を含む文字列。デフォルトは通常のHTMLです。SVGの場合は`'http://www.w3.org/2000/svg'`、MathMLの場合は`'http://www.w3.org/1998/Math/MathML'`を渡します。
  * **オプション** `nonce`: [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce)文字列で、[`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)のスクリプトを許可します。
  * **オプション** `onAllReady`: [シェル](#specifying-what-goes-into-the-shell)とすべての追加[コンテンツ](#streaming-more-content-as-it-loads)を含む、すべてのレンダリングが完了したときに発火するコールバック。これを使用して[クローラーや静的生成](#waiting-for-all-content-to-load-for-crawlers-and-static-generation)の代わりに`onShellReady`を使用できます。ここでストリーミングを開始すると、プログレッシブローディングは行われません。ストリームには最終的なHTMLが含まれます。
  * **オプション** `onError`: サーバーエラーが発生したときに発火するコールバック。[回復可能](#recovering-from-errors-outside-the-shell)か[回復不可能](#recovering-from-errors-inside-the-shell)かに関わらず、デフォルトでは`console.error`を呼び出すだけです。これを上書きして[クラッシュレポートを記録](#logging-crashes-on-the-server)する場合は、必ず`console.error`も呼び出してください。また、シェルが出力される前に[ステータスコードを調整](#setting-the-status-code)するためにも使用できます。
  * **オプション** `onShellReady`: [初期シェル](#specifying-what-goes-into-the-shell)がレンダリングされた直後に発火するコールバック。ここで[ステータスコードを設定](#setting-the-status-code)し、`pipe`を呼び出してストリーミングを開始できます。Reactはシェルの後に追加のコンテンツを[ストリーミング](#streaming-more-content-as-it-loads)し、HTMLの読み込みフォールバックをコンテンツに置き換えるインライン`<script>`タグを送信します。
  * **オプション** `onShellError`: 初期シェルのレンダリング中にエラーが発生した場合に発火するコールバック。エラーを引数として受け取ります。ストリームからはまだバイトが出力されておらず、`onShellReady`や`onAllReady`も呼び出されないため、[フォールバックHTMLシェルを出力](#recovering-from-errors-inside-the-shell)できます。
  * **オプション** `progressiveChunkSize`: チャンクのバイト数。[デフォルトのヒューリスティックについて詳しく読む](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### 戻り値 {/*returns*/}

`renderToPipeableStream`は、2つのメソッドを持つオブジェクトを返します：

* `pipe`は、提供された[Writable Node.jsストリーム](https://nodejs.org/api/stream.html#writable-streams)にHTMLを出力します。ストリーミングを有効にしたい場合は`onShellReady`で`pipe`を呼び出し、クローラーや静的生成の場合は`onAllReady`で呼び出します。
* `abort`は、[サーバーレンダリングを中止](#aborting-server-rendering)し、残りをクライアントでレンダリングすることができます。

---

## 使用法 {/*usage*/}

### ReactツリーをHTMLとしてNode.jsストリームにレンダリングする {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

`renderToPipeableStream`を呼び出して、ReactツリーをHTMLとして[Node.jsストリーム](https://nodejs.org/api/stream.html#writable-streams)にレンダリングします：

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なります
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

<CodeStep step={1}>ルートコンポーネント</CodeStep>と一緒に、<CodeStep step={2}>ブートストラップ`<script>`パス</CodeStep>のリストを提供する必要があります。ルートコンポーネントは**ルート`<html>`タグを含むドキュメント全体**を返す必要があります。

例えば、次のようになります：

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Reactは[doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)と<CodeStep step={2}>ブートストラップ`<script>`タグ</CodeStep>を生成されたHTMLストリームに挿入します：

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... コンポーネントからのHTML ... -->
</html>
<script src="/main.js" async=""></script>
```

クライアント側では、ブートストラップスクリプトを使用して[ドキュメント全体を`hydrateRoot`でハイドレートします：](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

これにより、サーバー生成のHTMLにイベントリスナーがアタッチされ、インタラクティブになります。

<DeepDive>

#### ビルド出力からCSSおよびJSアセットパスを読み取る {/*reading-css-and-js-asset-paths-from-the-build-output*/}

最終的なアセットURL（JavaScriptやCSSファイルなど）は、ビルド後にハッシュ化されることがよくあります。例えば、`styles.css`の代わりに`styles.123456.css`になることがあります。静的アセットのファイル名をハッシュ化することで、同じアセットの異なるビルドごとに異なるファイル名が保証されます。これは、静的アセットの長期キャッシュを安全に有効にするために役立ちます。特定の名前のファイルは内容が変更されることはありません。

しかし、ビルド後までアセットURLがわからない場合、ソースコードにそれらを含める方法がありません。例えば、先ほどのようにJSXに`"/styles.css"`をハードコーディングすることはできません。ソースコードからそれらを除外するために、ルートコンポーネントはプロップとして渡されたマップから実際のファイル名を読み取ることができます：

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

サーバー側では、`<App assetMap={assetMap} />`をレンダリングし、アセットURLを含む`assetMap`を渡します：

```js {1-5,8,9}
// このJSONはビルドツールから取得する必要があります。例えば、ビルド出力から読み取ります。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

サーバーが`<App assetMap={assetMap} />`をレンダリングしているため、クライアントでも`assetMap`を使用してレンダリングする必要があります。これにより、ハイドレーションエラーを回避できます。`assetMap`をシリアライズしてクライアントに渡すことができます：

```js {9-10}
// このJSONはビルドツールから取得する必要があります。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // 注意: これはユーザー生成データではないため、stringify()しても安全です。
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

上記の例では、`bootstrapScriptContent`オプションは、クライアント側でグローバルな`window.assetMap`変数を設定する追加のインライン`<script>`タグを追加します。これにより、クライアントコードは同じ`assetMap`を読み取ることができます：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

クライアントとサーバーの両方が同じ`assetMap`プロップで`App`をレンダリングするため、ハイドレーションエラーは発生しません。

</DeepDive>

---

### コンテンツが読み込まれるときにストリーミングする {/*streaming-more-content-as-it-loads*/}

ストリーミングにより、すべてのデータがサーバーで読み込まれる前にユーザーがコンテンツを見始めることができます。例えば、カバー、友達や写真のサイドバー、投稿のリストを表示するプロフィールページを考えてみましょう：

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

`<Posts />`のデータの読み込みに時間がかかるとします。理想的には、投稿を待たずにプロフィールページの残りのコンテンツをユーザーに表示したいです。これを行うには、[`<Suspense>`境界で`Posts`をラップします：](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

これにより、`Posts`がデータを読み込む前にHTMLのストリーミングを開始するようにReactに指示します。Reactは最初に読み込みフォールバック（`PostsGlimmer`）のHTMLを送信し、`Posts`がデータの読み込みを完了すると、残りのHTMLとともに読み込みフォールバックをそのHTMLに置き換えるインライン`<script>`タグを送信します。ユーザーの視点からは、ページは最初に`PostsGlimmer`で表示され、後で`Posts`に置き換えられます。

さらに[`<Suspense>`境界をネスト](#revealing-nested-content-as-it-loads)して、より細かい読み込みシーケンスを作成できます：

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

この例では、Reactはさらに早くページのストリーミングを開始できます。`ProfileLayout`と`ProfileCover`だけが最初にレンダリングを完了する必要があります。これらは`<Suspense>`境界でラップされていないためです。しかし、`Sidebar`、`Friends`、または`Photos`がデータを読み込む必要がある場合、Reactは代わりに`BigSpinner`フォールバックのHTMLを送信します。その後、データが利用可能になると、より多くのコンテンツが次々に表示され、すべてが表示されるまで続きます。

ストリーミングは、React自体がブラウザで読み込まれるのを待つ必要はなく、アプリがインタラクティブになるのを待つ必要もありません。サーバーからのHTMLコンテンツは、任意の`<script>`タグが読み込まれる前に段階的に表示されます。

[ストリーミングHTMLの仕組みについて詳しく読む](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Suspense対応のデータソースのみがSuspenseコンポーネントをアクティブにします。** これには以下が含まれます：

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/)や[Next.js](https://nextjs.org/docs/getting-started/react-essentials)などのSuspense対応フレームワークを使用したデータフェッチ
- [`lazy`](/reference/react/lazy)を使用したコンポーネントコードの遅延読み込み
- [`use`](/reference/react/use)を使用したPromiseの値の読み取り

Suspenseは、Effectやイベントハンドラ内でデータがフェッチされる場合を検出しません。

上記の`Posts`コンポーネントでデータを読み込む方法は、使用しているフレームワークによって異なります。Suspense対応フレームワークを使用している場合、そのデータフェッチの詳細はフレームワークのドキュメントに記載されています。

意見の分かれるフレームワークを使用せずにSuspense対応のデータフェッチを行うことはまだサポートされていません。Suspense対応データソースを実装するための要件は不安定で未文書化です。Suspenseと統合するための公式APIは、将来のReactバージョンでリリースされる予定です。

</Note>

---

### シェルに含まれるものを指定する {/*specifying-what-goes-into-the-shell*/}

アプリの一部である`<Suspense>`境界の外側の部分は*シェル*と呼ばれます：

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

これは、ユーザーが最初に見る可能性のある最も早い読み込み状態を決定します：

```js {3-5,13}
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

アプリ全体をルートで`<Suspense>`境界にラップすると、シェルにはそのスピナーだけが含まれます。しかし、それはユーザーエクスペリエンスとしては快適ではありません。画面に大きなスピナーが表示されると、少し待って実際のレイアウトを見るよりも遅くて煩わしいと感じることがあります。したがって、通常は`<Suspense>`境界を配置して、シェルが*最小限で完全*に感じられるようにします。つまり、ページ全体のレイアウトのスケルトンのようなものです。

`onShellReady`コールバックは、シェル全体がレンダリングされたときに発火します。通常、この時点でストリーミングを開始します：

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

`onShellReady`が発火する時点で、ネストされた`<Suspense>`境界内のコンポーネントはまだデータを読み込んでいるかもしれません。

---

### サーバーでのクラッシュをログに記録する {/*logging-crashes-on-the-server*/}

デフォルトでは、サーバー上のすべてのエラーはコンソールにログ記録されます。この動作を上書きしてクラッシュレポートを記録することができます：

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

カスタム`onError`実装を提供する場合は、上記のようにエラーをコンソールにもログ記録することを忘れないでください。

---

### シェル内のエラーからの回復 {/*recovering-from-errors-inside-the-shell*/}

この例では、シェルには`ProfileLayout`、`ProfileCover`、および`PostsGlimmer`が含まれます：

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

これらのコンポーネントのレンダリング中にエラーが発生した場合、Reactはクライアントに送信する意味のあるHTMLを持っていません。`onShellError`を上書きして、最後の手段としてサーバーレンダリングに依存しないフォールバックHTMLを送信します：

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

シェルの生成中にエラーが発生した場合、`onError`と`onShellError`の両方が発火します。エラーレポートには`onError`を使用し、フォールバックHTMLドキュメントの送信には`onShellError`を使用します。フォールバックHTMLはエラーページである必要はありません。代わりに、クライアントのみでアプリをレンダリングする代替シェルを含めることができます。

---

### シェル外のエラーからの回復 {/*recovering-from-errors-outside-the-shell*/}

この例では、`<Posts />`コンポーネントは`<Suspense>`でラップされているため、シェルの一部ではありません：

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts`コンポーネントまたはその内部のどこかでエラーが発生した場合、Reactは[それを回復しようとします：](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. 最も近い`<Suspense>`境界（`PostsGlimmer`）の読み込みフォールバックをHTMLに出力します。
2. サーバー上で`Posts`コンテンツのレンダリングを試みるのを「諦めます」。
3. JavaScriptコードがクライアントで読み込まれると、Reactはクライアントで`Posts`のレンダリングを*再試行*します。

クライアントで`Posts`のレンダリングを再試行しても*失敗*した場合、Reactはクライアントでエラーをスローします。レンダリング中にスローされたすべてのエラーと同様に、[最も近い親エラーボーダリー](/reference/react/Component#static-getderivedstatefromerror)がエラーをユーザーにどのように表示するかを決定します。実際には、ユーザーはエラーが回復不可能であることが確実になるまで読み込みインジケーターを表示します。

クライアントで`Posts`のレンダリングを再試行して成功した場合、サーバーからの読み込みフォールバックはクライアントのレンダリング出力に置き換えられます。ユーザーはサーバーエラーがあったことに気づきません。しかし、サーバーの`onError`コールバックとクライアントの[`onRecoverableError`](/reference/react-dom/client/hydrateRoot)コールバックは発火し、エラーについて通知を受けることができます。

---

### ステータスコードの設定 {/*setting-the-status-code*/}

ストリーミングにはトレードオフがあります。ユーザーがコンテンツを早く見ることができるように、できるだけ早くページのストリーミングを開始したいです。しかし、一度ストリーミングを開始すると、レスポンスのステータスコードを設定することはできません。

アプリを[シェルとその他のコンテンツに分割](#specifying-what-goes-into-the-shell)することで、この問題の一部を解決しています。シェルがエラーを起こした場合、`onShellError`コールバックが発火し、エラーステータスコードを設定できます。それ以外の場合、アプリがクライアントで回復する可能性があるため、「OK」を送信できます。

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

シェルの*外側*のコンポーネント（つまり、`<Suspense>`境界内）のエラーが発生した場合、Reactはレンダリングを停止しません。これは、`onError`コールバックが発火しますが、`onShellError`ではなく`onShellReady`を受け取ることを意味します。これは、Reactがクライアントでそのエラーから回復しようとするためです。[上記のように。](#recovering-from-errors-outside-the-shell)

ただし、必要に応じて、何かがエラーを起こした事実を使用してステータスコードを設定できます：

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

これは、初期シェルコンテンツの生成中に発生したシェル外のエラーのみをキャッチするため、包括的ではありません。特定のコンテンツにエラーが発生したかどうかを知ることが重要な場合は、それをシェルに移動できます。

---

### 異なるエラーを異なる方法で処理する {/*handling-different-errors-in-different-ways*/}

[独自の`Error`サブクラスを作成](https://javascript.info/custom-errors)し、[`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)演算子を使用してどのエラーがスローされたかを確認できます。例えば、カスタム`NotFoundError`を定義し、コンポーネントからスローすることができます。その後、`onError`、`onShellReady`、および`onShellError`コールバックは、エラーの種類に応じて異なる処理を行うことができます：

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

一度シェルを出力してストリーミングを開始すると、ステータスコードを変更することはできないことに注意してください。

---

### クローラーや静的生成のためにすべてのコンテンツの読み込みを待つ {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

ストリーミングは、ユーザーがコンテンツを利用可能になるとすぐに見ることができるため、より良いユーザーエクスペリエンスを提供します。

しかし、クローラーがページを訪れる場合や、ビルド時にページを生成する場合、すべてのコンテンツが最初に読み込まれるのを待ってから最終的なHTML出力を生成し、段階的に表示するのではなく、最終的なHTML出力を生成したい場合があります。

`onAllReady`コールバックを使用して、すべてのコンテンツの読み込みを待つことができます：

```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

通常の訪問者は段階的に読み込まれるコンテンツのストリームを受け取ります。クローラーは、すべてのデータが読み込まれた後に最終的なHTML出力を受け取ります。しかし、これはクローラーが*すべて*のデータを待たなければならないことも意味します。その一部は読み込みが遅いかエラーが発生する可能性があります。アプリによっては、クローラーにもシェルを送信することを選択することができます。

---

### サーバーレンダリングの中止 {/*aborting-server-rendering*/}

タイムアウト後にサーバーレンダリングを「諦める」ことができます：

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

Reactは残りの読み込みフォールバックをHTMLとしてフラッシュし、残りをクライアントでレンダリングしようとします。