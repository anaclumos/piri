---
title: preconnect
canary: true
---

<Canary>

`preconnect` 関数は現在、React の Canary および実験的なチャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

`preconnect` を使用すると、リソースを読み込むことが予想されるサーバーに事前に接続することができます。

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

ホストに事前接続するには、`react-dom` から `preconnect` 関数を呼び出します。

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[以下の例を参照してください。](#usage)

`preconnect` 関数は、指定されたサーバーへの接続を開くべきであるというヒントをブラウザに提供します。ブラウザがそれを選択した場合、そのサーバーからのリソースの読み込みが速くなる可能性があります。

#### パラメータ {/*parameters*/}

* `href`: 文字列。接続したいサーバーの URL。

#### 戻り値 {/*returns*/}

`preconnect` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じサーバーに対する `preconnect` の複数回の呼び出しは、単一の呼び出しと同じ効果があります。
* ブラウザでは、コンポーネントのレンダリング中、Effect 内、イベントハンドラ内など、どの状況でも `preconnect` を呼び出すことができます。
* サーバーサイドレンダリングや Server Components のレンダリング時には、コンポーネントのレンダリング中またはコンポーネントのレンダリングから派生した非同期コンテキストで呼び出した場合にのみ `preconnect` が効果を発揮します。それ以外の呼び出しは無視されます。
* 必要な特定のリソースがわかっている場合は、リソースをすぐに読み込み始める[他の関数](/reference/react-dom/#resource-preloading-apis)を呼び出すことができます。
* ウェブページ自体がホストされているのと同じサーバーに事前接続しても、ヒントが与えられる時点ですでに接続されているため、利点はありません。

---

## 使用法 {/*usage*/}

### レンダリング時の事前接続 {/*preconnecting-when-rendering*/}

子コンポーネントがそのホストから外部リソースを読み込むことがわかっている場合、コンポーネントのレンダリング時に `preconnect` を呼び出します。

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### イベントハンドラ内での事前接続 {/*preconnecting-in-an-event-handler*/}

外部リソースが必要になるページや状態に遷移する前に、イベントハンドラ内で `preconnect` を呼び出します。これにより、新しいページや状態のレンダリング中に呼び出すよりも早くプロセスが開始されます。

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```