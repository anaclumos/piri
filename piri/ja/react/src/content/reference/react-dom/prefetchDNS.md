---
title: prefetchDNS
canary: true
---

<Canary>

`prefetchDNS` 関数は現在、React の Canary および実験的なチャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

`prefetchDNS` を使用すると、リソースを読み込む予定のサーバーの IP を事前に調べることができます。

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

ホストを調べるには、`react-dom` から `prefetchDNS` 関数を呼び出します。

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[以下の例を参照してください。](#usage)

`prefetchDNS` 関数は、指定されたサーバーの IP アドレスを調べるべきであるというヒントをブラウザに提供します。ブラウザがそれを選択した場合、サーバーからのリソースの読み込みが速くなる可能性があります。

#### パラメータ {/*parameters*/}

* `href`: 文字列。接続したいサーバーの URL。

#### 戻り値 {/*returns*/}

`prefetchDNS` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じサーバーに対して `prefetchDNS` を複数回呼び出しても、単一の呼び出しと同じ効果があります。
* ブラウザでは、コンポーネントのレンダリング中、Effect 内、イベントハンドラ内など、どの状況でも `prefetchDNS` を呼び出すことができます。
* サーバーサイドレンダリングや Server Components のレンダリング時には、コンポーネントのレンダリング中またはコンポーネントのレンダリングから派生した非同期コンテキスト内で呼び出した場合にのみ `prefetchDNS` が効果を持ちます。それ以外の呼び出しは無視されます。
* 必要な特定のリソースがわかっている場合は、リソースをすぐに読み込み始める[他の関数](/reference/react-dom/#resource-preloading-apis)を呼び出すことができます。
* ウェブページ自体がホストされているサーバーを事前にフェッチしてもメリットはありません。ヒントが与えられる時点で既に調べられているためです。
* [`preconnect`](/reference/react-dom/preconnect) と比較して、`prefetchDNS` は多くのドメインに対して投機的に接続する場合に適しているかもしれません。この場合、事前接続のオーバーヘッドがメリットを上回る可能性があります。

---

## 使用法 {/*usage*/}

### レンダリング時の DNS プリフェッチ {/*prefetching-dns-when-rendering*/}

コンポーネントのレンダリング時に、その子がそのホストから外部リソースを読み込むことがわかっている場合は、`prefetchDNS` を呼び出します。

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### イベントハンドラ内での DNS プリフェッチ {/*prefetching-dns-in-an-event-handler*/}

外部リソースが必要となるページや状態に遷移する前に、イベントハンドラ内で `prefetchDNS` を呼び出します。これにより、新しいページや状態のレンダリング中に呼び出すよりも早くプロセスが開始されます。

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```