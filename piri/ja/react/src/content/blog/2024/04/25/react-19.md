---
title: React 19 ベータ
author: The React Team
date: 2024/04/25
description: React 19 ベータ版が npm で利用可能になりました！この投稿では、React 19 の新機能の概要と、それらをどのように採用できるかについて説明します。
---

2024年4月25日 [The React Team](/community/team)

---

<Note>

このベータリリースは、ライブラリがReact 19に備えるためのものです。アプリ開発者は18.3.0にアップグレードし、ライブラリと協力してフィードバックに基づいて変更を行う間、React 19の安定版を待つべきです。

</Note>

<Intro>

React 19 Betaがnpmで利用可能になりました！

</Intro>

[React 19 Beta Upgrade Guide](/blog/2024/04/25/react-19-upgrade-guide)では、アプリをReact 19 Betaにアップグレードするためのステップバイステップの手順を共有しました。この投稿では、React 19の新機能の概要と、それらをどのように採用できるかを説明します。

- [React 19の新機能](#whats-new-in-react-19)
- [React 19の改善点](#improvements-in-react-19)
- [アップグレード方法](#how-to-upgrade)

破壊的変更のリストについては、[Upgrade Guide](/blog/2024/04/25/react-19-upgrade-guide)を参照してください。

---

## React 19の新機能 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

Reactアプリで一般的なユースケースは、データの変更を行い、それに応じて状態を更新することです。例えば、ユーザーが名前を変更するためにフォームを送信すると、APIリクエストを行い、その応答を処理します。以前は、保留状態、エラー、楽観的更新、順次リクエストを手動で処理する必要がありました。

例えば、`useState`で保留状態とエラー状態を処理することができます：

```js
// Actionsの前
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

React 19では、非同期関数をトランジションで使用して、保留状態、エラー、フォーム、および楽観的更新を自動的に処理するサポートを追加しています。

例えば、`useTransition`を使用して保留状態を自動的に処理することができます：

```js
// Actionsの保留状態を使用
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

非同期トランジションは即座に`isPending`状態をtrueに設定し、非同期リクエストを行い、トランジション後に`isPending`をfalseに切り替えます。これにより、データが変更されている間も現在のUIを応答性とインタラクティブに保つことができます。

<Note>

#### 慣例として、非同期トランジションを使用する関数は「Actions」と呼ばれます。 {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Actionsはデータの送信を自動的に管理します：

- **保留状態**: Actionsはリクエストの開始時に保留状態を提供し、最終的な状態更新がコミットされると自動的にリセットされます。
- **楽観的更新**: Actionsは新しい[`useOptimistic`](#new-hook-optimistic-updates)フックをサポートしており、リクエストが送信されている間にユーザーに即時フィードバックを表示できます。
- **エラー処理**: Actionsはエラー処理を提供し、リクエストが失敗した場合にエラーバウンダリを表示し、楽観的更新を元の値に自動的に戻します。
- **フォーム**: `<form>`要素は`action`および`formAction`プロップに関数を渡すことをサポートします。`action`プロップに関数を渡すと、デフォルトでActionsを使用し、送信後にフォームを自動的にリセットします。

</Note>

Actionsの上に構築されたReact 19は、楽観的更新を管理するための[`useOptimistic`](#new-hook-optimistic-updates)と、Actionsの一般的なケースを処理するための新しいフック[`React.useActionState`](#new-hook-useactionstate)を導入します。`react-dom`では、フォームを自動的に管理するための[`<form>` Actions](#form-actions)と、フォーム内のActionsの一般的なケースをサポートする[`useFormStatus`](#new-hook-useformstatus)を追加しています。

React 19では、上記の例を次のように簡略化できます：

```js
// <form> ActionsとuseActionStateを使用
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

次のセクションでは、React 19の新しいAction機能の各機能を詳しく説明します。

### 新しいフック: `useActionState` {/*new-hook-useactionstate*/}

Actionsの一般的なケースを簡単にするために、新しいフック`useActionState`を追加しました：

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // アクションの結果を返すことができます。
      // ここでは、エラーのみを返します。
      return error;
    }

    // 成功を処理
    return null;
  },
  null,
);
```

`useActionState`は関数（「Action」）を受け取り、呼び出すためのラップされたActionを返します。これはActionsが合成されるために機能します。ラップされたActionが呼び出されると、`useActionState`はActionの最後の結果を`data`として返し、Actionの保留状態を`pending`として返します。

<Note>

`React.useActionState`は以前のCanaryリリースでは`ReactDOM.useFormState`と呼ばれていましたが、名前が変更され、`useFormState`は非推奨となりました。

詳細は[#28491](https://github.com/facebook/react/pull/28491)を参照してください。

</Note>

詳細については、[`useActionState`](/reference/react/useActionState)のドキュメントを参照してください。

### React DOM: `<form>` Actions {/*form-actions*/}

Actionsは`react-dom`の新しい`<form>`機能と統合されています。`<form>`、`<input>`、および`<button>`要素の`action`および`formAction`プロップに関数を渡すサポートを追加し、Actionsでフォームを自動的に送信します：

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

`<form>` Actionが成功すると、Reactは非制御コンポーネントのフォームを自動的にリセットします。`<form>`を手動でリセットする必要がある場合は、新しい`requestFormReset` React DOM APIを呼び出すことができます。

詳細については、`react-dom`の[`<form>`](/reference/react-dom/components/form)、[`<input>`](/reference/react-dom/components/input)、および`<button>`のドキュメントを参照してください。

### React DOM: 新しいフック: `useFormStatus` {/*new-hook-useformstatus*/}

デザインシステムでは、デザインコンポーネントがプロップをコンポーネントに渡さずに`<form>`の情報にアクセスする必要があることがよくあります。これはContextを介して行うことができますが、一般的なケースを簡単にするために、新しいフック`useFormStatus`を追加しました：

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus`は、フォームがContextプロバイダーであるかのように親`<form>`のステータスを読み取ります。

詳細については、`react-dom`の[`useFormStatus`](/reference/react-dom/hooks/useFormStatus)のドキュメントを参照してください。

### 新しいフック: `useOptimistic` {/*new-hook-optimistic-updates*/}

データ変更を行う際に、非同期リクエストが進行中である間に最終状態を楽観的に表示することは一般的なUIパターンです。React 19では、これを簡単にするために新しいフック`useOptimistic`を追加しています：

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

`useOptimistic`フックは、`updateName`リクエストが進行中である間に即座に`optimisticName`をレンダリングします。更新が完了またはエラーになると、Reactは自動的に`currentName`の値に戻ります。

詳細については、[`useOptimistic`](/reference/react/useOptimistic)のドキュメントを参照してください。

### 新しいAPI: `use` {/*new-feature-use*/}

React 19では、レンダリング中にリソースを読み取るための新しいAPI`use`を導入しています。

例えば、`use`を使用してプロミスを読み取ることができ、Reactはプロミスが解決されるまでサスペンドします：

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use`はプロミスが解決されるまでサスペンドします。
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Commentsで`use`がサスペンドすると、
  // このサスペンスバウンダリが表示されます。
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use`はレンダリング中に作成されたプロミスをサポートしていません。 {/*use-does-not-support-promises-created-in-render*/}

レンダリング中に作成されたプロミスを`use`に渡そうとすると、Reactは警告を表示します：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

コンポーネントがキャッシュされていないプロミスによってサスペンドされました。クライアントコンポーネントまたはフック内でプロミスを作成することは、サスペンス互換のライブラリまたはフレームワークを介してのみサポートされています。

</ConsoleLogLine>

</ConsoleBlockMulti>

修正するには、プロミスをキャッシュするサスペンス対応のライブラリまたはフレームワークからプロミスを渡す必要があります。将来的には、レンダリング中にプロミスをキャッシュするのを容易にする機能を提供する予定です。

</Note>

また、`use`を使用してコンテキストを読み取ることもでき、早期リターン後など条件付きでコンテキストを読み取ることができます：

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // 早期リターンのため、useContextでは機能しません。
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

`use` APIはフックと同様にレンダリング中にのみ呼び出すことができます。フックとは異なり、`use`は条件付きで呼び出すことができます。将来的には、`use`を使用してレンダリング中にリソースを消費するための方法をさらにサポートする予定です。

詳細については、[`use`](/reference/react/use)のドキュメントを参照してください。

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Componentsは、クライアントアプリケーションやSSRサーバーとは別の環境で、バンドル前にコンポーネントを事前にレンダリングする新しいオプションです。この別の環境がReact Server Componentsの「サーバー」です。Server Componentsは、CIサーバーでビルド時に一度実行することも、Webサーバーを使用して各リクエストごとに実行することもできます。

React 19には、CanaryチャンネルからのすべてのReact Server Components機能が含まれています。これにより、Server Componentsを提供するライブラリは、`react-server` [エクスポート条件](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports)を使用して、[フルスタックReactアーキテクチャ](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision)をサポートするフレームワークでReact 19をピア依存関係としてターゲットにすることができます。

<Note>

#### Server Componentsのサポートを構築するにはどうすればよいですか？ {/*how-do-i-build-support-for-server-components*/}

React 19のReact Server Componentsは安定しており、メジャーバージョン間で壊れることはありませんが、React Server Componentsバンドラーやフレームワークを実装するために使用される基盤となるAPIはsemverに従わず、React 19.xのマイナーバージョン間で壊れる可能性があります。

React Server Componentsをバンドラーやフレームワークとしてサポートするには、特定のReactバージョンにピン留めするか、Canaryリリースを使用することをお勧めします。将来的には、React Server Componentsを実装するために使用されるAPIを安定させるために、バンドラーやフレームワークと協力し続けます。

</Note>

詳細については、[React Server Components](/reference/rsc/server-components)のドキュメントを参照してください。

### Server Actions {/*server-actions*/}

Server Actionsは、クライアントコンポーネントがサーバー上で実行される非同期関数を呼び出すことを可能にします。

Server Actionが`"use server"`ディレクティブで定義されると、フレームワークは自動的にサーバー関数への参照を作成し、その参照をクライアントコンポーネントに渡します。その関数がクライアントで呼び出されると、Reactはサーバーにリクエストを送信して関数を実行し、その結果を返します。

<Note>

#### Server Componentsにはディレクティブはありません。 {/*there-is-no-directive-for-server-components*/}

Server Componentsは`"use
server"`で示されるという誤解がありますが、Server Componentsにはディレクティブはありません。`"use server"`ディレクティブはServer Actionsに使用されます。

詳細については、[Directives](/reference/rsc/directives)のドキュメントを参照してください。

</Note>

Server ActionsはServer Componentsで作成され、クライアントコンポーネントにプロップとして渡すことができます。また、インポートしてクライアントコンポーネントで使用することもできます。

詳細については、[React Server Actions](/reference/rsc/server-actions)のドキュメントを参照してください。

## React 19の改善点 {/*improvements-in-react-19*/}

### `ref`をプロップとして使用 {/*ref-as-a-prop*/}

React 19から、関数コンポーネントで`ref`をプロップとしてアクセスできるようになりました：

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

新しい関数コンポーネントは`forwardRef`を必要としなくなり、コンポーネントを自動的に更新するためのコーデモッドを公開する予定です。将来的には`forwardRef`を非推奨にし、削除する予定です。

<Note>

クラスに渡された`refs`は、コンポーネントインスタンスを参照するため、プロップとして渡されません。

</Note>

### ハイドレーションエラーの差分 {/*diffs-for-hydration-errors*/}

`react-dom`のハイドレーションエラーのエラーレポートも改善しました。例えば、DEVでミスマッチに関する情報なしに複数のエラーをログに記録する代わりに：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

警告: テキストコンテンツが一致しませんでした。サーバー: "Server" クライアント: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

警告: ハイドレーション中にエラーが発生しました。サーバーHTMLはクライアントコンテンツに置き換えられました \<div\>。

</ConsoleLogLine>

<ConsoleLogLine level="error">

警告: テキストコンテンツが一致しませんでした。サーバー: "Server" クライアント: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

警告: ハイドレーション中にエラーが発生しました。サーバーHTMLはクライアントコンテンツに置き換えられました \<div\>。

</ConsoleLogLine>

<ConsoleLogLine level="error">

未捕捉エラー: テキストコンテンツがサーバーレンダリングされたHTMLと一致しません。
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

現在は、ミスマッチの差分を含む単一のメッセージをログに記録します：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

未捕捉エラー: ハイドレーションに失敗しました。サーバーレンダリングされたHTMLがクライアントと一致しなかったため、このツリーはクライアントで再生成されます。これは、SSRされたクライアントコンポーネントが次のような場合に発生する可能性があります:{'\n'}
\- サーバー/クライアントブランチ `if (typeof window !== 'undefined')`。
\- `Date.now()`や`Math.random()`などの変数入力が毎回異なる場合。
\- サーバーと一致しないユーザーのロケールでの日付フォーマット。
\- HTMLと一緒にスナップショットを送信せずに外部の変更データ。
\- 無効なHTMLタグのネスト。{'\n'}
また、クライアントにReactが読み込まれる前にHTMLを変更するブラウザ拡張機能がインストールされている場合にも発生する可能性があります。{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>`をプロバイダーとして使用 {/*context-as-a-provider*/}

React 19では、`<Context.Provider>`の代わりに`<Context>`をプロバイダーとしてレンダリングできます：

```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

新しいコンテキストプロバイダーは`<Context>`を使用でき、既存のプロバイダーを変換するためのコーデモッドを公開する予定です。将来的には`<Context.Provider>`を非推奨にする予定です。

### `ref`のクリーンアップ関数 {/*cleanup-functions-for-refs*/}

`ref`コールバックからクリーンアップ関数を返すことをサポートしました：

```js {7-9}
<input
  ref={(ref) => {
    // refが作成されました

    // 新機能: 要素がDOMから削除されたときに
    // refをリセットするクリーンアップ関数を返します。
    return () => {
      // refのクリーンアップ
    };
  }}
/>
```

コンポーネントがアンマウントされると、Reactは`ref`コールバックから返されたクリーンアップ関数を呼び出します。これはDOMの`ref`、クラスコンポーネントへの`ref`、および`useImperativeHandle`に対して機能します。

<Note>

以前は、Reactはコンポーネントをアンマウントする際に`ref`関数を`null`で呼び出していました。`ref`がクリーンアップ関数を返す場合、Reactはこのステップをスキップします。

将来的には、コンポーネントをアンマウントする際に`ref`を`null`で呼び出すことを非推奨にする予定です。

</Note>

`ref`コールバックからクリーンアップ関数以外のものを返すことは、TypeScriptによって拒否されるようになりました。修正は通常、暗黙の戻り値を使用しないことです。例えば：

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

元のコードは`HTMLDivElement`のインスタンスを返しており、TypeScriptはこれがクリーンアップ関数であるべきかどうかを判断できませんでした。

このパターンをコーデモッドで変換することができます：[no-implicit-ref-callback-return](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)。

### `useDeferredValue`の初期値 {/*use-deferred-value-initial-value*/}

`useDeferredValue`に`initialValue`オプションを追加しました：

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // 初期レンダリング時の値は''です。
  // その後、deferredValueで再レンダリングがスケジュールされます。
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
```

<CodeStep step={2}>initialValue</CodeStep>が提供されると、`useDeferredValue`はコンポーネントの初期レンダリング時にそれを`value`として返し、<CodeStep step={1}>deferredValue</CodeStep>を返すバックグラウンドで再レンダリングをスケジュールします。

詳細については、[`useDeferredValue`](/reference/react/useDeferredValue)のドキュメントを参照してください。

### ドキュメントメタデータのサポート {/*support-for-metadata-tags*/}

HTMLでは、`<title>`、`<link>`、および`<meta>`などのドキュメントメタデータタグは、ドキュメントの`<head>`セクションに配置するために予約されています。Reactでは、アプリに適したメタデータを決定するコンポーネントが、`<head>`をレンダリングする場所から非常に遠い場合や、Reactが`<head>`をまったくレンダリングしない場合があります。以前は、これらの要素をエフェクトで手動で挿入するか、[`react-helmet`](https://github.com/nfl/react-helmet)のようなライブラリを使用して、Reactアプリケーションをサーバーレンダリングする際に慎重に取り扱う必要がありました。

React 19では、コンポーネント内でドキュメントメタデータタグをネイティブにレンダリングするサポートを追加しています：

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

Reactがこのコンポーネントをレンダリングすると、`<title>`、`<link>`、および`<meta>`タグを検出し、それらをドキュメントの`<head>`セクションに自動的に移動します。これらのメタデータタグをネイティブにサポートすることで、クライアントのみのアプリ、ストリーミングSSR、およびServer Componentsで動作することを保証できます。

<Note>

#### メタデータライブラリが必要な場合があります {/*you-may-still-want-a-metadata-library*/}

シンプルなユースケースでは、タグとしてドキュメントメタデータをレンダリングすることが適しているかもしれませんが、ライブラリは現在のルートに基づいて一般的なメタデータを特定のメタデータで上書きするなど、より強力な機能を提供できます。これらの機能により、フレームワークや[`react-helmet`](https://github.com/nfl/react-helmet)のようなライブラリがメタデータタグをサポートしやすくなります。

</Note>

詳細については、[`<title>`](/reference/react-dom/components/title)、[`<link>`](/reference/react-dom/components/link)、および[`<meta>`](/reference/react-dom/components/meta)のドキュメントを参照してください。

### スタイルシートのサポート {/*support-for-stylesheets*/}

スタイルシート、外部リンクされたもの（`<link rel="stylesheet" href="...">`）およびインラインのもの（`<style>...</style>`）は、スタイルの優先順位ルールのためにDOM内で慎重に配置する必要があります。コンポーネント内での構成可能性を考慮したスタイルシート機能を構築することは難しいため、ユーザーはスタイルを依存するコンポーネントから遠く離れた場所にロードするか、複雑さをカプセル化するスタイルライブラリを使用することがよくあります。

React 19では、この複雑さに対処し、クライアントの同時レンダリングおよびサーバーのストリーミングレンダリングとの統合をさらに深めるために、スタイルシートの組み込みサポートを提供しています。スタイルシートの`precedence`をReactに伝えると、ReactはDOM内のスタイルシートの挿入順序を管理し、そのスタイルシート（外部の場合）がスタイルルールに依存するコンテンツを表示する前にロードされることを保証します。

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- fooとbarの間に挿入されます
    </div>
  )
}
```

サーバーサイドレンダリング中にReactはスタイルシートを`<head>`に含め、ブラウザがロードするまでペイントしないことを保証します。ストリーミングを開始した後にスタイルシートが遅れて発見された場合、Reactはそのスタイルシートをクライアントの`<head>`に挿入し、そのスタイルシートに依存するサスペンスバウンダリのコンテンツを表示する前にロードされることを保証します。

クライアントサイドレンダリング中にReactは新しくレンダリングされたスタイルシートがロードされるのを待ってからレンダリングをコミットします。このコンポーネントをアプリケーション内の複数の場所からレンダリングする場合、Reactはドキュメント内にスタイルシートを一度だけ含めます：

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // DOM内に重複するスタイルシートリンクは含まれません
  </>
}
```

スタイルシートを手動でロードすることに慣れているユーザーにとって、これらのスタイルシートを依存するコンポーネントの近くに配置する機会があり、より良いローカルな推論を可能にし、実際に依存するスタイルシートのみをロードすることを容易にします。

スタイルライブラリおよびバンドラーとのスタイル統合もこの新機能を採用できるため、スタイルシートを直接レンダリングしない場合でも、ツールがこの機能を使用するようにアップグレードされると恩恵を受けることができます。

詳細については、[`<link>`](/reference/react-dom/components/link)および[`<style>`](/reference/react-dom/components/style)のドキュメントを参照してください。

### 非同期スクリプトのサポート {/*support-for-async-scripts*/}

HTMLでは、通常のスクリプト（`<script src="...">`）および遅延スクリプト（`<script defer="" src="...">`）はドキュメント順にロードされるため、コンポーネントツリーの深い場所でこれらのスクリプトをレンダリングするのは難しいです。しかし、非同期スクリプト（`<script async="" src="...">`）は任意の順序でロードされます。

React 19では、非同期スクリプトのサポートを強化し、コンポーネントツリー内の任意の場所でレンダリングできるようにし、スクリプトインスタンスの再配置や重複管理を行う必要がありません。

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // DOM内に重複するスクリプトは含まれません
    </body>
  </html>
}
```

すべてのレンダリング環境で、非同期スクリプトは重複しないようにされ、複数の異なるコンポーネントによってレンダリングされても、Reactはスクリプトを一度だけロードおよび実行します。

サーバーサイドレンダリングでは、非同期スクリプトは`<head>`に含まれ、スタイルシート、フォント、および画像プリロードなどのペイントをブロックするより重要なリソースの後に優先されます。

詳細については、[`<script>`](/reference/react-dom/components/script)のドキュメントを参照してください。

### リソースのプリロードサポート {/*support-for-preloading-resources*/}

初期ドキュメントのロードおよびクライアントサイドの更新時に、ブラウザにロードする必要があるリソースをできるだけ早く通知することは、ページのパフォーマンスに劇的な影響を与える可能性があります。

React 19には、ブラウザリソースのロードおよびプリロードを容易にするための新しいAPIが多数含まれています。

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // このスクリプトを積極的にロードおよび実行します
  preload('https://.../path/to/font.woff', { as: 'font' }) // このフォントをプリロードします
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // このスタイルシートをプリロードします
  prefetchDNS('https://...') // このホストから実際にリクエストを行わない場合
  preconnect('https://...') // リクエストを行うが、何をリクエストするかは不明な場合
}
```
```html
<!-- 上記は次のDOM/HTMLを生成します -->
<html>
  <head>
    <!-- リンク/スクリプトは、呼び出し順ではなく、早期ロードの有用性によって優先されます -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

これらのAPIは、スタイルシートのロードから追加リソースの発見を移動することで、初期ページロードを最適化するために使用できます。また、予想されるナビゲーションで使用されるリソースのリストをプリフェッチし、クリックやホバー時にそれらのリソースを積極的にプリロードすることで、クライアントの更新を高速化することもできます。

詳細については、[Resource Preloading APIs](/reference/react-dom#resource-preloading-apis)を参照してください。

### サードパーティスクリプトおよび拡張機能との互換性 {/*compatibility-with-third-party-scripts-and-extensions*/}

サードパーティスクリプトおよびブラウザ拡張機能を考慮してハイドレーションを改善しました。

ハイドレーション中に、クライアントでレンダリングされた要素がサーバーからのHTMLに見つかった要素と一致しない場合、Reactはクライアントの再レンダリングを強制してコンテンツを修正します。以前は、サードパーティスクリプトやブラウザ拡張機能によって挿入された要素があると、ミスマッチエラーが発生し、クライアントレンダリングがトリガーされました。

React 19では、`<head>`および`<body>`内の予期しないタグはスキップされ、ミスマッチエラーを回避します。関連しないハイドレーションミスマッチのためにReactがドキュメント全体を再レンダリングする必要がある場合、サードパーティスクリプトやブラウザ拡張機能によって挿入されたスタイルシートはそのまま残されます。

### エラーレポートの改善 {/*error-handling*/}

React 19では、重複を削除し、キャッチされたエラーおよび未キャッチのエラーを処理するためのオプションを提供するためにエラーハンドリングを改善しました。例えば、エラーバウンダリでキャッチされたレンダリング中のエラーが発生した場合、以前はReactはエラーを2回スローし（最初は元のエラー、次に自動回復に失敗した後）、エラーが発生した場所に関する情報を`console.error`で呼び出していました。

これにより、キャッチされたエラーごとに3つのエラーが発生しました：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

未捕捉エラー: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

未捕捉エラー: hit<span className="ms-2 text-gray-30">{'    <--'} 重複</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

上記のエラーはThrowsコンポーネントで発生しました:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
Reactは提供されたエラーバウンダリを使用してこのコンポーネントツリーを最初から再作成しようとします、ErrorBoundary。

</ConsoleLogLine>

</ConsoleBlockMulti>

React 19では、すべてのエラー情報を含む単一のエラーをログに記録します：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

エラー: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
上記のエラーはThrowsコンポーネントで発生しました:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
Reactは提供されたエラーバウンダリを使用してこのコンポーネントツリーを最初から再作成しようとします、ErrorBoundary。
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

さらに、`onRecoverableError`を補完するために2つの新しいルートオプションを追加しました：

- `onCaughtError`: エラーバウンダリでReactがエラーをキャッチしたときに呼び出されます。
- `onUncaughtError`: エラーがスローされ、エラーバウンダリでキャッチされなかったときに呼び出されます。
- `onRecoverableError`: エラーがスローされ、自動的に回復されたときに呼び出されます。

詳細および例については、[`createRoot`](/reference/react-dom/client/createRoot)および[`hydrateRoot`](/reference/react-dom/client/hydrateRoot)のドキュメントを参照してください。

### カスタム要素のサポート {/*support-for-custom-elements*/}

React 19はカスタム要素の完全なサポートを追加し、[Custom Elements Everywhere](https://custom-elements-everywhere.com/)のすべてのテストに合格しています。

過去のバージョンでは、Reactでカスタム要素を使用するのは難しかったです。なぜなら、Reactは認識されないプロップを属性として扱い、プロパティとしてではなかったからです。React 19では、クライアントおよびSSR中に機能するプロパティのサポートを追加しました。以下の戦略を使用します：

- **サーバーサイドレンダリング**: カスタム要素に渡されたプロップは、その型が`string`、`number`などのプリミティブ値である場合、または値が`true`である場合、属性としてレンダリングされます。`object`、`symbol`、`function`などの非プリミティブ型のプロップや値が`false`であるプロップは省略されます。
- **クライアントサイドレンダリング**: カスタム要素インスタンスのプロパティに一致するプロップはプロパティとして割り当てられ、それ以外は属性として割り当てられます。

カスタム要素のサポートの設計および実装を推進してくれた[Joey Arhar](https://github.com/josepharhar)に感謝します。

#### アップグレード方法 {/*how-to-upgrade*/}
ステップバイステップの手順および破壊的変更と注目すべき変更の完全なリストについては、[React 19 Upgrade Guide](/blog/2024/04/25/react-19-upgrade-guide)を参照してください。