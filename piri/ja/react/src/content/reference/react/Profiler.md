---
title: <Profiler>
---

<Intro>

`<Profiler>`を使用すると、Reactツリーのレンダリングパフォーマンスをプログラムで測定できます。

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<Profiler>` {/*profiler*/}

コンポーネントツリーを`<Profiler>`でラップして、そのレンダリングパフォーマンスを測定します。

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### プロパティ {/*props*/}

* `id`: 測定しているUIの部分を識別する文字列。
* `onRender`: プロファイルされたツリー内のコンポーネントが更新されるたびにReactが呼び出す[`onRender`コールバック](#onrender-callback)。レンダリングされた内容と所要時間に関する情報を受け取ります。

#### 注意点 {/*caveats*/}

* プロファイリングには追加のオーバーヘッドが発生するため、**デフォルトでは本番ビルドで無効になっています。** 本番プロファイリングを有効にするには、プロファイリングが有効になっている[特別な本番ビルドを有効にする必要があります。](https://fb.me/react-profiling)

---

### `onRender`コールバック {/*onrender-callback*/}

Reactはレンダリングされた内容に関する情報を持って`onRender`コールバックを呼び出します。

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // レンダリング時間を集計またはログに記録...
}
```

#### パラメータ {/*onrender-parameters*/}

* `id`: コミットされたばかりの`<Profiler>`ツリーの文字列`id`プロパティ。複数のプロファイラを使用している場合、どの部分のツリーがコミットされたかを識別できます。
* `phase`: `"mount"`、`"update"`または`"nested-update"`。ツリーが初めてマウントされたのか、プロパティ、状態、またはHooksの変更によって再レンダリングされたのかを知ることができます。
* `actualDuration`: 現在の更新のために`<Profiler>`とその子孫をレンダリングするのに費やされたミリ秒数。この値は、サブツリーがメモ化をどれだけうまく利用しているかを示します（例：[`memo`](/reference/react/memo)および[`useMemo`](/reference/react/useMemo)）。理想的には、この値は初回マウント後に大幅に減少するはずです。多くの子孫は特定のプロパティが変更された場合にのみ再レンダリングが必要です。
* `baseDuration`: 最適化なしで`<Profiler>`サブツリー全体を再レンダリングするのにかかる時間をミリ秒単位で推定したもの。これはツリー内の各コンポーネントの最新のレンダリング時間を合計することで計算されます。この値は、レンダリングの最悪のコスト（例：初回マウントやメモ化なしのツリー）を推定します。`actualDuration`と比較して、メモ化が機能しているかどうかを確認します。
* `startTime`: Reactが現在の更新のレンダリングを開始したときの数値タイムスタンプ。
* `commitTime`: Reactが現在の更新をコミットしたときの数値タイムスタンプ。この値はコミット内のすべてのプロファイラ間で共有され、必要に応じてグループ化できます。

---

## 使用法 {/*usage*/}

### レンダリングパフォーマンスをプログラムで測定する {/*measuring-rendering-performance-programmatically*/}

`<Profiler>`コンポーネントをReactツリーの周りにラップして、そのレンダリングパフォーマンスを測定します。

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

これには2つのプロパティが必要です：`id`（文字列）と`onRender`コールバック（関数）。Reactはツリー内のコンポーネントが更新を「コミット」するたびにこれを呼び出します。

<Pitfall>

プロファイリングには追加のオーバーヘッドが発生するため、**デフォルトでは本番ビルドで無効になっています。** 本番プロファイリングを有効にするには、プロファイリングが有効になっている[特別な本番ビルドを有効にする必要があります。](https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>`を使用すると、プログラムで測定値を収集できます。インタラクティブなプロファイラを探している場合は、[React Developer Tools](/learn/react-developer-tools)のプロファイラタブを試してください。これはブラウザ拡張機能として同様の機能を提供します。

</Note>

---

### アプリケーションの異なる部分を測定する {/*measuring-different-parts-of-the-application*/}

複数の`<Profiler>`コンポーネントを使用して、アプリケーションの異なる部分を測定できます：

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

また、`<Profiler>`コンポーネントをネストすることもできます：

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

`<Profiler>`は軽量なコンポーネントですが、必要な場合にのみ使用するべきです。各使用はアプリケーションにいくらかのCPUおよびメモリのオーバーヘッドを追加します。

---

