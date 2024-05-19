---
title: startTransition
---

<Intro>

`startTransition`を使用すると、UIをブロックせずに状態を更新できます。

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

`startTransition`関数を使用すると、状態更新をトランジションとしてマークできます。

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `scope`: 1つ以上の[`set`関数](/reference/react/useState#setstate)を呼び出して状態を更新する関数。Reactは引数なしで`scope`を直ちに呼び出し、`scope`関数呼び出し中に同期的にスケジュールされたすべての状態更新をトランジションとしてマークします。これらは[非ブロッキング](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)であり、[不要なローディングインジケーターを表示しません。](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### 戻り値 {/*returns*/}

`startTransition`は何も返しません。

#### 注意点 {/*caveats*/}

* `startTransition`はトランジションが保留中かどうかを追跡する方法を提供しません。トランジションが進行中である間に保留インジケーターを表示するには、代わりに[`useTransition`](/reference/react/useTransition)を使用する必要があります。

* 状態の`set`関数にアクセスできる場合にのみ、更新をトランジションにラップできます。プロップやカスタムフックの戻り値に応じてトランジションを開始したい場合は、代わりに[`useDeferredValue`](/reference/react/useDeferredValue)を試してください。

* `startTransition`に渡す関数は同期的でなければなりません。Reactはこの関数を直ちに実行し、その実行中に発生するすべての状態更新をトランジションとしてマークします。後で（例えばタイムアウト内で）さらに状態更新を行おうとすると、それらはトランジションとしてマークされません。

* トランジションとしてマークされた状態更新は、他の状態更新によって中断されます。例えば、トランジション内でチャートコンポーネントを更新している最中に、入力フィールドに文字を入力し始めると、Reactは入力状態の更新を処理した後にチャートコンポーネントのレンダリング作業を再開します。

* トランジション更新はテキスト入力を制御するために使用できません。

* 複数のトランジションが進行中の場合、Reactは現在それらを一緒にバッチ処理します。これは将来のリリースで削除される可能性が高い制限です。

---

## 使用法 {/*usage*/}

### 状態更新を非ブロッキングトランジションとしてマークする {/*marking-a-state-update-as-a-non-blocking-transition*/}

状態更新を*トランジション*としてマークするには、`startTransition`呼び出しでラップします：

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

トランジションを使用すると、遅いデバイスでもユーザーインターフェースの更新をレスポンシブに保つことができます。

トランジションを使用すると、再レンダリングの途中でもUIがレスポンシブに保たれます。例えば、ユーザーがタブをクリックした後に気が変わって別のタブをクリックしても、最初の再レンダリングが完了するのを待たずにそれを行うことができます。

<Note>

`startTransition`は[`useTransition`](/reference/react/useTransition)と非常に似ていますが、トランジションが進行中かどうかを追跡するための`isPending`フラグを提供しません。`useTransition`が利用できない場合に`startTransition`を呼び出すことができます。例えば、`startTransition`はデータライブラリなどのコンポーネント外でも動作します。

[トランジションについて学び、`useTransition`ページで例を参照してください。](/reference/react/useTransition)

</Note>