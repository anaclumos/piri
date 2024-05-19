---
title: React 18へのアップグレード方法
author: Rick Hanlon
date: 2022/03/08
description: リリース投稿で共有したように、React 18は新しいコンカレントレンダラーによって強化された機能を導入し、既存のアプリケーションに対して段階的な採用戦略を取っています。この投稿では、React 18へのアップグレード手順を案内します。
---

2022年3月8日 [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

[リリース投稿](/blog/2022/03/29/react-v18)で共有したように、React 18は新しい並行レンダラーによって強化された機能を導入し、既存のアプリケーションに対して段階的な採用戦略を取っています。この投稿では、React 18へのアップグレード手順を案内します。

React 18へのアップグレード中に発生した問題を[報告してください](https://github.com/facebook/react/issues/new/choose)。

</Intro>

<Note>

React Nativeユーザー向けに、React 18は将来のReact Nativeバージョンで提供されます。これは、React 18がこのブログ投稿で紹介された新機能を活用するために新しいReact Nativeアーキテクチャに依存しているためです。詳細については、[React Conf基調講演](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)をご覧ください。

</Note>

---

## インストール {/*installing*/}

最新バージョンのReactをインストールするには:

```bash
npm install react react-dom
```

または、yarnを使用している場合:

```bash
yarn add react react-dom
```

## クライアントレンダリングAPIの更新 {/*updates-to-client-rendering-apis*/}

React 18を最初にインストールすると、コンソールに警告が表示されます:

<ConsoleBlock level="error">

ReactDOM.renderはReact 18ではサポートされていません。代わりにcreateRootを使用してください。新しいAPIに切り替えるまで、アプリはReact 17を実行しているかのように動作します。詳細はこちら: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18は、ルートを管理するためのより良いエルゴノミクスを提供する新しいルートAPIを導入します。新しいルートAPIは、新しい並行レンダラーも有効にし、並行機能をオプトインすることができます。

```js
// Before
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
```

`unmountComponentAtNode`も`root.unmount`に変更しました:

```js
// Before
unmountComponentAtNode(container);

// After
root.unmount();
```

また、renderのコールバックも削除しました。これは、通常、Suspenseを使用する場合に期待される結果をもたらさないためです:

```js
// Before
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// After
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

古いrenderコールバックAPIの一対一の置き換えはありません。使用ケースによります。詳細については、[createRootでrenderを置き換える](https://github.com/reactwg/react-18/discussions/5)作業グループの投稿をご覧ください。

</Note>

最後に、アプリがサーバーサイドレンダリングとハイドレーションを使用している場合、`hydrate`を`hydrateRoot`にアップグレードしてください:

```js
// Before
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// After
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Unlike with createRoot, you don't need a separate root.render() call here.
```

詳細については、[こちらの作業グループのディスカッション](https://github.com/reactwg/react-18/discussions/5)をご覧ください。

<Note>

**アップグレード後にアプリが動作しない場合は、`<StrictMode>`でラップされているかどうかを確認してください。** [Strict ModeはReact 18でより厳格になりました](#updates-to-strict-mode)、開発モードで追加された新しいチェックに対してすべてのコンポーネントが耐性があるわけではありません。Strict Modeを削除するとアプリが修正される場合は、アップグレード中に削除し、問題を修正した後に（ツリーの一部または全体で）再度追加することができます。

</Note>

## サーバーレンダリングAPIの更新 {/*updates-to-server-rendering-apis*/}

このリリースでは、`react-dom/server` APIを刷新し、サーバー上でのSuspenseとストリーミングSSRを完全にサポートします。これらの変更の一環として、サーバー上でのインクリメンタルSuspenseストリーミングをサポートしない古いNodeストリーミングAPIを非推奨にします。

このAPIを使用すると、次の警告が表示されます:

* `renderToNodeStream`: **非推奨 ⛔️️**

代わりに、Node環境でのストリーミングには次を使用してください:
* `renderToPipeableStream`: **新しい ✨**

また、DenoやCloudflare workersなどの最新のエッジランタイム環境でSuspenseを使用したストリーミングSSRをサポートする新しいAPIも導入しています:
* `renderToReadableStream`: **新しい ✨**

次のAPIは引き続き動作しますが、Suspenseのサポートは限定的です:
* `renderToString`: **限定的** ⚠️
* `renderToStaticMarkup`: **限定的** ⚠️

最後に、このAPIはメールのレンダリングに引き続き使用できます:
* `renderToStaticNodeStream`

サーバーレンダリングAPIの変更についての詳細は、[サーバーでのReact 18へのアップグレード](https://github.com/reactwg/react-18/discussions/22)作業グループの投稿、[新しいSuspense SSRアーキテクチャの詳細](https://github.com/reactwg/react-18/discussions/37)、および[Shaundai Person](https://twitter.com/shaundai)の[React Conf 2021でのストリーミングサーバーレンダリングに関する講演](https://www.youtube.com/watch?v=pj5N-Khihgc)をご覧ください。

## TypeScript定義の更新 {/*updates-to-typescript-definitions*/}

プロジェクトでTypeScriptを使用している場合、`@types/react`および`@types/react-dom`の依存関係を最新バージョンに更新する必要があります。新しい型はより安全で、以前は型チェッカーによって無視されていた問題を検出します。最も顕著な変更は、`children`プロップがプロップを定義する際に明示的にリストされる必要があることです。例えば:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

型のみの変更の完全なリストについては、[React 18 typings pull request](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210)をご覧ください。ライブラリの型での修正例へのリンクがあり、コードをどのように調整するかを見ることができます。新しいより安全な型にアプリケーションコードを迅速に移行するために、[自動移行スクリプト](https://github.com/eps1lon/types-react-codemod)を使用することができます。

型にバグを見つけた場合は、DefinitelyTypedリポジトリで[問題を報告してください](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package)。

## 自動バッチ処理 {/*automatic-batching*/}

React 18は、デフォルトでより多くのバッチ処理を行うことで、パフォーマンスの向上を提供します。バッチ処理とは、複数の状態更新を1つの再レンダリングにグループ化してパフォーマンスを向上させることです。React 18以前では、Reactイベントハンドラ内でのみ更新がバッチ処理されていました。Promise、setTimeout、ネイティブイベントハンドラ、またはその他のイベント内の更新は、デフォルトでReactではバッチ処理されませんでした:

```js
// React 18以前では、Reactイベントのみがバッチ処理されていました

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Reactは最後に一度だけ再レンダリングします（これがバッチ処理です！）
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Reactは2回レンダリングします。各状態更新ごとに1回（バッチ処理なし）
}, 1000);
```

React 18の`createRoot`を使用すると、すべての更新が自動的にバッチ処理されるようになります。これにより、タイムアウト、Promise、ネイティブイベントハンドラ、またはその他のイベント内の更新が、Reactイベント内の更新と同じようにバッチ処理されます:

```js
// React 18以降では、タイムアウト、Promise、
// ネイティブイベントハンドラ、またはその他のイベント内の更新がバッチ処理されます。

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Reactは最後に一度だけ再レンダリングします（これがバッチ処理です！）
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Reactは最後に一度だけ再レンダリングします（これがバッチ処理です！）
}, 1000);
```

これは破壊的な変更ですが、レンダリングの作業が減り、アプリケーションのパフォーマンスが向上すると期待しています。自動バッチ処理をオプトアウトするには、`flushSync`を使用できます:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // Reactはこの時点でDOMを更新しました
  flushSync(() => {
    setFlag(f => !f);
  });
  // Reactはこの時点でDOMを更新しました
}
```

詳細については、[自動バッチ処理の詳細](https://github.com/reactwg/react-18/discussions/21)をご覧ください。

## ライブラリ向けの新しいAPI {/*new-apis-for-libraries*/}

React 18作業グループでは、ライブラリメンテナと協力して、スタイルや外部ストアなどの特定の使用ケースに対応するために、並行レンダリングをサポートするために必要な新しいAPIを作成しました。React 18をサポートするために、いくつかのライブラリは次のAPIのいずれかに切り替える必要があるかもしれません:

* `useSyncExternalStore`は、外部ストアが更新を同期的に強制することで並行読み取りをサポートする新しいフックです。この新しいAPIは、React外部の状態と統合するライブラリに推奨されます。詳細については、[useSyncExternalStore概要投稿](https://github.com/reactwg/react-18/discussions/70)および[useSyncExternalStore APIの詳細](https://github.com/reactwg/react-18/discussions/86)をご覧ください。
* `useInsertionEffect`は、CSS-in-JSライブラリがレンダリング中にスタイルを挿入するパフォーマンス問題に対処するための新しいフックです。すでにCSS-in-JSライブラリを構築していない限り、これを使用することはないと予想しています。このフックは、DOMが変更された後、レイアウト効果が新しいレイアウトを読み取る前に実行されます。これはReact 17およびそれ以前のバージョンですでに存在する問題を解決しますが、React 18では並行レンダリング中にReactがブラウザに譲歩し、レイアウトを再計算する機会を与えるため、さらに重要です。詳細については、[ライブラリアップグレードガイド `<style>`](https://github.com/reactwg/react-18/discussions/110)をご覧ください。

React 18はまた、`startTransition`、`useDeferredValue`、`useId`などの並行レンダリング用の新しいAPIも導入しており、[リリース投稿](/blog/2022/03/29/react-v18)で詳しく紹介しています。

## Strict Modeの更新 {/*updates-to-strict-mode*/}

将来的には、Reactが状態を保持しながらUIのセクションを追加および削除できる機能を追加したいと考えています。例えば、ユーザーが画面からタブを外して戻ったときに、Reactはすぐに前の画面を表示できるようにする必要があります。これを行うために、Reactは以前と同じコンポーネント状態を使用してツリーをアンマウントおよびリマウントします。

この機能は、Reactにデフォルトでより良いパフォーマンスを提供しますが、エフェクトが複数回マウントおよび破棄されることに耐性があるコンポーネントが必要です。ほとんどのエフェクトは変更なしで動作しますが、一部のエフェクトは一度だけマウントまたは破棄されることを前提としています。

これらの問題を表面化させるために、React 18はStrict Modeに新しい開発専用チェックを導入します。この新しいチェックは、コンポーネントが初めてマウントされるたびに、すべてのコンポーネントを自動的にアンマウントおよびリマウントし、2回目のマウント時に以前の状態を復元します。

この変更前は、Reactはコンポーネントをマウントし、エフェクトを作成していました:

```
* Reactはコンポーネントをマウントします。
    * レイアウトエフェクトが作成されます。
    * エフェクトが作成されます。
```

React 18のStrict Modeでは、Reactは開発モードでコンポーネントのアンマウントとリマウントをシミュレートします:

```
* Reactはコンポーネントをマウントします。
    * レイアウトエフェクトが作成されます。
    * エフェクトが作成されます。
* Reactはコンポーネントのアンマウントをシミュレートします。
    * レイアウトエフェクトが破棄されます。
    * エフェクトが破棄されます。
* Reactは以前の状態でコンポーネントのマウントをシミュレートします。
    * レイアウトエフェクトのセットアップコードが実行されます。
    * エフェクトのセットアップコードが実行されます。
```

詳細については、[StrictModeに再利用可能な状態を追加する](https://github.com/reactwg/react-18/discussions/19)および[エフェクトで再利用可能な状態をサポートする方法](https://github.com/reactwg/react-18/discussions/18)作業グループの投稿をご覧ください。

## テスト環境の設定 {/*configuring-your-testing-environment*/}

テストを`createRoot`を使用するように最初に更新すると、テストコンソールに次の警告が表示される場合があります:

<ConsoleBlock level="error">

現在のテスト環境はact(...)をサポートするように設定されていません

</ConsoleBlock>

これを修正するには、テストを実行する前に`globalThis.IS_REACT_ACT_ENVIRONMENT`を`true`に設定します:

```js
// テストセットアップファイルで
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

このフラグの目的は、Reactがユニットテストのような環境で実行されていることを知らせることです。`act`で更新をラップするのを忘れた場合、Reactは役立つ警告をログに記録します。

また、フラグを`false`に設定して、`act`が不要であることをReactに知らせることもできます。これは、完全なブラウザ環境をシミュレートするエンドツーエンドテストに役立ちます。

最終的には、テストライブラリが自動的にこれを設定することを期待しています。例えば、[次のバージョンのReact Testing LibraryはReact 18をサポートしています](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936)追加の設定なしで。

[actテストAPIおよび関連する変更に関する詳細](https://github.com/reactwg/react-18/discussions/102)は、作業グループで利用可能です。

## Internet Explorerのサポート終了 {/*dropping-support-for-internet-explorer*/}

このリリースでは、ReactはInternet Explorerのサポートを終了します。これは、[2022年6月15日にサポートが終了する](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge)ためです。React 18で導入された新機能は、IEでは適切にポリフィルできないマイクロタスクなどの最新のブラウザ機能を使用して構築されています。

Internet Explorerをサポートする必要がある場合は、React 17を使用することをお勧めします。

## 非推奨 {/*deprecations*/}

* `react-dom`: `ReactDOM.render`は非推奨です。使用すると警告が表示され、アプリはReact 17モードで実行されます。
* `react-dom`: `ReactDOM.hydrate`は非推奨です。使用すると警告が表示され、アプリはReact 17モードで実行されます。
* `react-dom`: `ReactDOM.unmountComponentAtNode`は非推奨です。
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer`は非推奨です。
* `react-dom/server`: `ReactDOMServer.renderToNodeStream`は非推奨です。

## その他の破壊的変更 {/*other-breaking-changes*/}

* **一貫したuseEffectのタイミング**: Reactは、クリックやキー押下イベントなどの離散的なユーザー入力イベント中にトリガーされた更新の場合、常に同期的にエフェクト関数をフラッシュします。以前は、この動作は常に予測可能または一貫していませんでした。
* **厳格なハイドレーションエラー**: 欠落または余分なテキストコンテンツによるハイドレーションの不一致は、警告ではなくエラーとして扱われるようになりました。Reactは、サーバーマークアップに一致させるためにクライアントでノードを挿入または削除して「修正」しようとすることはなく、ツリー内の最も近い`<Suspense>`境界までクライアントレンダリングに戻ります。これにより、ハイドレートされたツリーが一貫性を保ち、ハイドレーションの不一致によって引き起こされる可能性のあるプライバシーおよびセキュリティの問題を回避します。
* **Suspenseツリーは常に一貫しています**: コンポーネントがツリーに完全に追加される前にサスペンドすると、Reactはコンポーネントを不完全な状態でツリーに追加したり、そのエフェクトを発火させたりしません。代わりに、Reactは新しいツリーを完全に破棄し、非同期操作が完了するのを待ってから、最初から再度レンダリングを試みます。Reactは再試行を並行してレンダリングし、ブラウザをブロックしません。
* **Suspenseを使用したレイアウトエフェクト**: ツリーが再サスペンドしてフォールバックに戻ると、Reactはレイアウトエフェクトをクリーンアップし、境界内のコンテンツが再表示されると再作成します。これにより、Suspenseを使用する際にコンポーネントライブラリがレイアウトを正しく測定できない問題が修正されます。
* **新しいJS環境要件**: Reactは、`Promise`、`Symbol`、および`Object.assign`などの最新のブラウザ機能に依存するようになりました。Internet Explorerなどの古いブラウザやデバイスをサポートする場合、これらの機能をネイティブに提供しないか、非準拠の実装を持つ場合は、バンドルされたアプリケーションにグローバルポリフィルを含めることを検討してください。

## その他の注目すべき変更 {/*other-notable-changes*/}

### React {/*react*/}

* **コンポーネントは`undefined`をレンダリングできます**: コンポーネントから`undefined`を返すと警告が表示されなくなりました。これにより、コンポーネントツリーの途中で許可される値と一貫性が保たれます。JSXの前に`return`文を忘れるなどのミスを防ぐためにリンターを使用することをお勧めします。
* **テストで`act`警告がオプトインになりました**: エンドツーエンドテストを実行している場合、`act`警告は不要です。ユニットテストでのみ有用で有益なため、[オプトイン](https://github.com/reactwg/react-18/discussions/102)メカニズムを導入しました。
* **アンマウントされたコンポーネントでの`setState`に関する警告がなくなりました**: 以前は、アンマウントされたコンポーネントで`setState`を呼び出すとメモリリークの警告が表示されていました。この警告はサブスクリプションのために追加されましたが、主に状態設定が問題ないシナリオで発生し、回避策がコードを悪化させることが多かったです。この警告を[削除しました](https://github.com/facebook/react/pull/22114)。
* **コンソールログの抑制がなくなりました**: Strict Modeを使用すると、Reactは予期しない副作用を見つけるために各コンポーネントを2回レンダリングします。React 17では、ログを読みやすくするために2回目のレンダリングのコンソールログを抑制していました。この抑制が混乱を招くという[コミュニティのフィードバック](https://github.com/facebook/react/issues/21783)に応じて、抑制を削除しました。代わりに、React DevToolsがインストールされている場合、2回目のログのレンダリングは灰色で表示され、完全に抑制するオプション（デフォルトではオフ）が表示されます。
* **メモリ使用量の改善**: Reactはアンマウント時により多くの内部フィールドをクリーンアップし、アプリケーションコードに存在する可能性のある未修正のメモリリークの影響を軽減します。

### React DOM Server {/*react-dom-server*/}

* **`renderToString`**: サーバーでサスペンドするとエラーが発生しなくなります。代わりに、最も近い`<Suspense>`境界のフォールバックHTMLを出力し、クライアントで同じコンテンツのレンダリングを再試行します。それでも、`renderToPipeableStream`や`renderToReadableStream`などのストリーミングAPIに切り替えることをお勧めします。
* **`renderToStaticMarkup`**: サーバーでサスペンドするとエラーが発生しなくなります。代わりに、最も近い`<Suspense>`境界のフォールバックHTMLを出力します。

## 変更履歴 {/*changelog*/}

[完全な変更履歴はこちら](https://github.com/facebook/react/blob/main/CHANGELOG.md)をご覧ください。