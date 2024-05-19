---
title: flushSync
---

<Pitfall>

`flushSync`を使用することは稀であり、アプリのパフォーマンスに悪影響を与える可能性があります。

</Pitfall>

<Intro>

`flushSync`を使用すると、提供されたコールバック内の更新を同期的に強制的にフラッシュすることができます。これにより、DOMが即座に更新されることが保証されます。

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

`flushSync`を呼び出して、Reactに保留中の作業をフラッシュし、DOMを同期的に更新させます。

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

ほとんどの場合、`flushSync`は避けることができます。`flushSync`は最後の手段として使用してください。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `callback`: 関数。Reactはこのコールバックを即座に呼び出し、その中に含まれる更新を同期的にフラッシュします。また、保留中の更新やエフェクト、エフェクト内の更新もフラッシュする可能性があります。この`flushSync`呼び出しの結果として更新がサスペンドされた場合、フォールバックが再表示されることがあります。

#### 戻り値 {/*returns*/}

`flushSync`は`undefined`を返します。

#### 注意点 {/*caveats*/}

* `flushSync`はパフォーマンスに大きな悪影響を与える可能性があります。慎重に使用してください。
* `flushSync`は保留中のSuspense境界を強制的に`fallback`状態にする可能性があります。
* `flushSync`は保留中のエフェクトを実行し、それらに含まれる更新を同期的に適用することがあります。
* `flushSync`は、コールバック内の更新をフラッシュするために必要な場合、コールバック外の更新もフラッシュすることがあります。例えば、クリックからの保留中の更新がある場合、Reactはコールバック内の更新をフラッシュする前にそれらをフラッシュすることがあります。

---

## 使用法 {/*usage*/}

### サードパーティ統合のための更新のフラッシュ {/*flushing-updates-for-third-party-integrations*/}

ブラウザAPIやUIライブラリなどのサードパーティコードと統合する際には、Reactに更新をフラッシュさせる必要がある場合があります。`flushSync`を使用して、コールバック内の<CodeStep step={1}>状態更新</CodeStep>を同期的にフラッシュさせます：

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// この行までに、DOMが更新されます。
```

これにより、次のコード行が実行される時点で、Reactが既にDOMを更新していることが保証されます。

**`flushSync`を使用することは稀であり、頻繁に使用するとアプリのパフォーマンスに大きな悪影響を与える可能性があります。** アプリがReact APIのみを使用し、サードパーティライブラリと統合しない場合、`flushSync`は不要です。

しかし、ブラウザAPIのようなサードパーティコードと統合する場合には役立つことがあります。

一部のブラウザAPIは、コールバック内の結果がコールバックの終了時までに同期的にDOMに書き込まれることを期待しています。ほとんどの場合、Reactはこれを自動的に処理しますが、場合によっては同期的な更新を強制する必要があります。

例えば、ブラウザの`onbeforeprint` APIは、印刷ダイアログが開く直前にページを変更することを許可します。これは、印刷用にドキュメントをより良く表示するためのカスタム印刷スタイルを適用するのに役立ちます。以下の例では、`onbeforeprint`コールバック内で`flushSync`を使用して、Reactの状態を即座にDOMに「フラッシュ」します。これにより、印刷ダイアログが開く時点で`isPrinting`が「yes」と表示されます：

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

`flushSync`を使用しない場合、印刷ダイアログは`isPrinting`を「no」と表示します。これは、Reactが更新を非同期的にバッチ処理し、印刷ダイアログが状態が更新される前に表示されるためです。

<Pitfall>

`flushSync`はパフォーマンスに大きな悪影響を与える可能性があり、保留中のSuspense境界を予期せずフォールバック状態にすることがあります。

ほとんどの場合、`flushSync`は避けることができるため、最後の手段として使用してください。

</Pitfall>