---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream`はReactツリーを[Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)にレンダリングします。

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

このAPIは[Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)に依存しています。Node.jsの場合は、代わりに[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)を使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

`renderToReadableStream`を呼び出して、ReactツリーをHTMLとして[Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)にレンダリングします。

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

クライアントでは、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出して、サーバー生成のHTMLをインタラクティブにします。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: HTMLにレンダリングしたいReactノード。例えば、`<App />`のようなJSX要素です。ドキュメント全体を表すことが期待されるため、`App`コンポーネントは`<html>`タグをレンダリングする必要があります。

* **オプション** `options`: ストリーミングオプションを含むオブジェクト。
  * **オプション** `bootstrapScriptContent`: 指定された場合、この文字列はインラインの`<script>`タグに配置されます。
  * **オプション** `bootstrapScripts`: ページに出力する`<script>`タグのURLの配列。これを使用して[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)を呼び出す`<script>`を含めます。クライアントでReactを実行したくない場合は省略します。
  * **オプション** `bootstrapModules`: `bootstrapScripts`と同様ですが、[`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)を出力します。
  * **オプション** `identifierPrefix`: [`useId`](/reference/react/useId)によって生成されたIDにReactが使用する文字列プレフィックス。同じページに複数のルートを使用する場合に競合を避けるために便利です。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)に渡されたプレフィックスと同じである必要があります。
  * **オプション** `namespaceURI`: ストリームのルート[名前空間URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris)を含む文字列。デフォルトは通常のHTMLです。SVGの場合は`'http://www.w3.org/2000/svg'`、MathMLの場合は`'http://www.w3.org/1998/Math/MathML'`を渡します。
  * **オプション** `nonce`: [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce)文字列で、[`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)のスクリプトを許可します。
  * **オプション** `onError`: サーバーエラーが発生するたびに発火するコールバック。[回復可能](#recovering-from-errors-outside-the-shell)な場合も[そうでない場合](#recovering-from-errors-inside-the-shell)も含まれます。デフォルトでは、これだけが`console.error`を呼び出します。これを上書きして[クラッシュレポートを記録](#logging-crashes-on-the-server)する場合は、必ず`console.error`も呼び出してください。また、[シェルが出力される前にステータスコードを調整](#setting-the-status-code)するためにも使用できます。
  * **オプション** `progressiveChunkSize`: チャンクのバイト数。[デフォルトのヒューリスティックについて詳しく読む](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)。
  * **オプション** `signal`: サーバーレンダリングを[中止](#aborting-server-rendering)し、クライアントで残りをレンダリングするための[中止シグナル](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。


#### 戻り値 {/*returns*/}

`renderToReadableStream`はPromiseを返します：

- [シェル](#specifying-what-goes-into-the-shell)のレンダリングが成功した場合、そのPromiseは[Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)に解決されます。
- シェルのレンダリングが失敗した場合、Promiseは拒否されます。[これを使用してフォールバックシェルを出力します。](#recovering-from-errors-inside-the-shell)

返されたストリームには追加のプロパティがあります：

* `allReady`: すべてのレンダリングが完了したときに解決されるPromise。これには[シェル](#specifying-what-goes-into-the-shell)とすべての追加[コンテンツ](#streaming-more-content-as-it-loads)が含まれます。クローラーや静的生成のために応答を返す前に`stream.allReady`を`await`できます。(#waiting-for-all-content-to-load-for-crawlers-and-static-generation) これを行うと、プログレッシブローディングは行われません。ストリームには最終的なHTMLが含まれます。

---

## 使用法 {/*usage*/}

### ReactツリーをHTMLとしてReadable Web Streamにレンダリングする {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

`renderToReadableStream`を呼び出して、ReactツリーをHTMLとして[Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)にレンダリングします：

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
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
  <!-- ... あなたのコンポーネントからのHTML ... -->
</html>
<script src="/main.js" async=""></script>
```

クライアントでは、ブートストラップスクリプトを使用して[ドキュメント全体を`hydrateRoot`でハイドレートします：](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

これにより、サーバー生成のHTMLにイベントリスナーがアタッチされ、インタラクティブになります。

<DeepDive>

#### ビルド出力からCSSおよびJSアセットパスを読み取る {/*reading-css-and-js-asset-paths-from-the-build-output*/}

最終的なアセットURL（JavaScriptやCSSファイルなど）は、ビルド後にハッシュ化されることがよくあります。例えば、`styles.css`の代わりに`styles.123456.css`になることがあります。静的アセットファイル名のハッシュ化は、同じアセットの異なるビルドごとに異なるファイル名を持つことを保証します。これは、静的アセットの長期キャッシュを安全に有効にするために役立ちます。特定の名前を持つファイルは内容が変更されることはありません。

しかし、ビルド後までアセットURLがわからない場合、それらをソースコードに含める方法はありません。例えば、先ほどのようにJSXに`"/styles.css"`をハードコーディングすることはできません。ソースコードからそれらを除外するために、ルートコンポーネントはプロップとして渡されたマップから実際のファイル名を読み取ることができます：

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

サーバーでは、`<App assetMap={assetMap} />`をレンダリングし、アセットURLを含む`assetMap`を渡します：

```js {1-5,8,9}
// このJSONをビルドツールから取得する必要があります。例えば、ビルド出力から読み取ります。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

サーバーが現在`<App assetMap={assetMap} />`をレンダリングしているため、クライアントでも`assetMap`を使用してレンダリングする必要があります。これにより、ハイドレーションエラーを回避できます。次のようにして、`assetMap`をシリアライズしてクライアントに渡すことができます：

```js {9-10}
// このJSONをビルドツールから取得する必要があります。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // 注意: このデータはユーザー生成ではないため、stringify()しても安全です。
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

上記の例では、`bootstrapScriptContent`オプションは、クライアントでグローバルな`window.assetMap`変数を設定する追加のインライン`<script>`タグを追加します。これにより、クライアントコードは同じ`assetMap`を読み取ることができます：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

クライアントとサーバーの両方が同じ`assetMap`プロップで`App`をレンダリングするため、ハイドレーションエラーは発生しません。

</DeepDive>

---

### コンテンツがロードされるときにストリーミングする {/*streaming-more-content-as-it-loads*/}

ストリーミングにより、サーバー上のすべてのデータがロードされる前にユーザーがコンテンツを見始めることができます。例えば、カバー、友達や写真のサイドバー、投稿のリストを表示するプロフィールページを考えてみましょう：

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

`<Posts />`のデータのロードに時間がかかると想像してください。理想的には、投稿を待たずにプロフィールページの残りのコンテンツをユーザーに表示したいです。これを行うには、[`<Suspense>`境界で`Posts`をラップします：](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

これにより、`Posts`がデータをロードする前にHTMLのストリーミングを開始するようにReactに指示します。Reactは最初にローディングフォールバック（`PostsGlimmer`）のHTMLを送信し、`Posts`がデータのロードを完了すると、残りのHTMLとローディングフォールバックをそのHTMLに置き換えるインライン`<script>`タグを送信します。ユーザーの視点からは、ページは最初に`PostsGlimmer`で表示され、後で`Posts`に置き換えられます。

さらに[`<Suspense>`境界をネスト](#revealing-nested-content-as-it-loads)して、より細かいローディングシーケンスを作成できます：

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

この例では、Reactはさらに早くページのストリーミングを開始できます。`ProfileLayout`と`ProfileCover`は、どの`<Suspense>`境界にもラップされていないため、最初にレンダリングを完了する必要があります。ただし、`Sidebar`、`Friends`、または`Photos`がデータをロードする必要がある場合、Reactは代わりに`BigSpinner`フォールバックのHTMLを送信します。その後、データが利用可能になると、より多くのコンテンツが次々に表示され、すべてが表示されるまで続きます。

ストリーミングは、React自体がブラウザでロードされるのを待つ必要はなく、アプリがインタラクティブになるのを待つ必要もありません。サーバーからのHTMLコンテンツは、任意の`<script>`タグがロードされる前に段階的に表示されます。

[ストリーミングHTMLの仕組みについて詳しく読む。](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Suspense対応のデータソースのみがSuspenseコンポーネントをアクティブにします。** これには以下が含まれます：

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/)や[Next.js](https://nextjs.org/docs/getting-started/react-essentials)などのSuspense対応フレームワークを使用したデータフェッチ
- [`lazy`](/reference/react/lazy)を使用したコンポーネントコードの遅延読み込み
- [`use`](/reference/react/use)を使用したPromiseの値の読み取り

Suspenseは、Effectやイベントハンドラ内でデータがフェッチされるときは検出しません。

上記の`Posts`コンポーネントでデータをロードする方法は、使用しているフレームワークによって異なります。Suspense対応のフレームワークを使用している場合、そのデータフェッチの詳細はそのドキュメントに記載されています。

意見の分かれるフレームワークを使用せずにSuspense対応のデータフェッチを行うことはまだサポートされていません。Suspense対応のデータソースを実装するための要件は不安定で文書化されていません。Suspense対応のデータソースを統合するための公式APIは、将来のReactバージョンでリリースされる予定です。

</Note>

---

### シェルに含まれるものを指定する {/*specifying-what-goes-into-the-shell*/}

アプリの`<Suspense>`境界の外側にある部分は*シェル*と呼ばれます：

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

これは、ユーザーが最初に見る可能性のあるロード状態を決定します：

```js {3-5,13}
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

アプリ全体をルートで`<Suspense>`境界にラップすると、シェルにはそのスピナーのみが含まれます。しかし、それはユーザーエクスペリエンスとしては快適ではありません。画面に大きなスピナーが表示されると、少し待って実際のレイアウトを見るよりも遅くてイライラする感じがします。このため、通常は`<Suspense>`境界を配置して、シェルが*最小限でありながら完全*に感じられるようにします。つまり、ページ全体のレイアウトのスケルトンのようなものです。

`renderToReadableStream`の非同期呼び出しは、シェル全体がレンダリングされるとすぐに`stream`に解決されます。通常は、その`stream`を作成して応答を返すことでストリーミングを開始します：

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

`stream`が返される時点で、ネストされた`<Suspense>`境界内のコンポーネントはまだデータをロードしているかもしれません。

---

### サーバーでのクラッシュをログに記録する {/*logging-crashes-on-the-server*/}

デフォルトでは、サーバー上のすべてのエラーはコンソールにログ記録されます。この動作を上書きしてクラッシュレポートをログに記録することができます：

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

カスタム`onError`実装を提供する場合は、上記のようにエラーをコンソールにログ記録することを忘れないでください。

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

これらのコンポーネントのレンダリング中にエラーが発生した場合、Reactはクライアントに送信する意味のあるHTMLを持っていません。`renderToReadableStream`呼び出しを`try...catch`でラップして、最終手段としてサーバーレンダリングに依存しないフォールバックHTMLを送信します：

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

シェルの生成中にエラーが発生した場合、`onError`と`catch`ブロックの両方が発火します。`onError`をエラーレポートに使用し、`catch`ブロックを使用してフォールバックHTMLドキュメントを送信します。フォールバックHTMLはエラーページである必要はありません。代わりに、クライアントのみでアプリをレンダリングする代替シェルを含めることができます。

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

`Posts`コンポーネントまたはその内部でエラーが発生した場合、Reactは[それを回復しようとします：](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. 最も近い`<Suspense>`境界（`PostsGlimmer`）のローディングフォールバックをHTMLに出力します。
2. サーバー上で`Posts`コンテンツのレンダリングを試みるのを「諦めます」。
3. JavaScriptコードがクライアントでロードされると、Reactはクライアントで`Posts`のレンダリングを再試行します。

クライアントで`Posts`のレンダリングを再試行しても失敗した場合、Reactはクライアントでエラーをスローします。レンダリング中にスローされたすべてのエラーと同様に、[最も近い親エラーバウンダリ](/reference/react/Component#static-getderivedstatefromerror)がエラーをユーザーにどのように表示するかを決定します。実際には、ユーザーはエラーが回復不可能であることが確実になるまでローディングインジケーターを見ます。

クライアントで`Posts`のレンダリングを再試行して成功した場合、サーバーからのローディングフォールバックはクライアントのレンダリング出力に置き換えられます。ユーザーはサーバーエラーがあったことを知りません。しかし、サーバーの`onError`コールバックとクライアントの[`onRecoverableError`](/reference/react-dom/client/hydrateRoot)コールバックは発火し、エラーについて通知を受けることができます。

---

### ステータスコードの設定 {/*setting-the-status-code*/}

ストリーミングにはトレードオフがあります。ユーザーがコンテンツを早く見ることができるように、できるだけ早くページのストリーミングを開始したいです。しかし、一度ストリーミングを開始すると、応答ステータスコードを設定することはできません。

アプリを[シェル](#specifying-what-goes-into-the-shell)と残りのコンテンツに分割することで、この問題の一部をすでに解決しています。シェルがエラーを起こした場合、`catch`ブロックが実行され、エラーステータスコードを設定できます。それ以外の場合、アプリがクライアントで回復する可能性があるため、「OK」を送信できます。

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

シェルの外側（つまり、`<Suspense>`境界内）のコンポーネントがエラーをスローした場合、Reactはレンダリングを停止しません。これは、`onError`コールバックが発火しますが、コードは`catch`ブロックに入ることなく実行を続けることを意味します。これは、Reactがクライアントでそのエラーから回復しようとするためです。[上記のように。](#recovering-from-errors-outside-the-shell)

ただし、エラーが発生したことを利用してステータスコードを設定することもできます：

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

これは、初期シェルコンテンツを生成している間に発生したシェル外のエラーのみをキャッチするため、包括的ではありません。特定のコンテンツにエラーが発生したかどうかを知ることが重要な場合は、それをシェルに移動することができます。

---

### 異なるエラーを異なる方法で処理する {/*handling-different-errors-in-different-ways*/}

[独自の`Error`サブクラスを作成](https://javascript.info/custom-errors)し、[`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)演算子を使用してどのエラーがスローされたかを確認できます。例えば、カスタム`NotFoundError`を定義し、コンポーネントからスローすることができます。その後、`onError`でエラーを保存し、エラータイプに応じて応答を返す前に異なることを行うことができます：

```js {2-3,5-15,22,28,33}
async function handler(request) {
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

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

シェルを出力してストリーミングを開始した後は、ステータスコードを変更できないことに注意してください。

---

### クローラーと静的生成のためにすべてのコンテンツがロードされるのを待つ {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

ストリーミングは、ユーザーがコンテンツを利用可能になるとすぐに見ることができるため、より良いユーザーエクスペリエンスを提供します。

ただし、クローラーがページを訪れる場合や、ビルド時にページを生成する場合は、すべてのコンテンツが最初にロードされてから最終的なHTML出力を生成し、段階的に表示するのではなく、すべてのコンテンツがロードされるのを待つことができます。

`stream.allReady` Promiseを待つことで、すべてのコンテンツがロードされるのを待つことができます：

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... depends on your bot detection strategy ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

通常の訪問者は段階的にロードされるコンテンツのストリームを受け取ります。クローラーは、すべてのデータがロードされた後に最終的なHTML出力を受け取ります。ただし、これはクローラーが*すべて*のデータを待つ必要があることも意味します。その一部はロードが遅いかエラーが発生する可能性があります。アプリによっては、クローラーにもシェルを送信することを選択できます。

---

### サーバーレンダリングの中止 {/*aborting-server-rendering*/}

タイムアウト後にサーバーレンダリングを「諦める」ことができます：

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

Reactは残りのローディングフォールバックをHTMLとしてフラッシュし、残りをクライアントでレンダリングしようとします。