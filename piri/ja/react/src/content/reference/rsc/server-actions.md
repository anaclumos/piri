---
title: サーバーアクション
canary: true
---

<Intro>

Server Actionsは、Client Componentsがサーバーで実行される非同期関数を呼び出すことを可能にします。

</Intro>

<InlineToc />

<Note>

#### Server Actionsのサポートを構築するにはどうすればよいですか？ {/*how-do-i-build-support-for-server-actions*/}

React 19のServer Actionsは安定しており、メジャーバージョン間で壊れることはありませんが、React Server ComponentsバンドラーやフレームワークでServer Actionsを実装するために使用される基礎的なAPIはsemverに従わず、React 19.xのマイナーバージョン間で壊れる可能性があります。

バンドラーやフレームワークとしてServer Actionsをサポートするには、特定のReactバージョンに固定するか、Canaryリリースを使用することをお勧めします。将来的には、Server Actionsを実装するために使用されるAPIを安定させるために、バンドラーやフレームワークと協力し続けます。

</Note>

Server Actionが`"use server"`ディレクティブで定義されると、フレームワークは自動的にサーバー関数への参照を作成し、その参照をClient Componentに渡します。その関数がクライアントで呼び出されると、Reactはサーバーにリクエストを送信して関数を実行し、結果を返します。

Server ActionsはServer Componentsで作成され、Client Componentsにプロップとして渡すことができます。また、インポートしてClient Componentsで使用することもできます。

### Server ComponentからServer Actionを作成する {/*creating-a-server-action-from-a-server-component*/}

Server Componentsは`"use server"`ディレクティブでServer Actionsを定義できます：

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Action
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Reactが`EmptyNote` Server Componentをレンダリングすると、`createNoteAction`関数への参照を作成し、その参照を`Button` Client Componentに渡します。ボタンがクリックされると、Reactは提供された参照を使用して`createNoteAction`関数を実行するためにサーバーにリクエストを送信します：

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={onClick}>Create Empty Note</button>
}
```

詳細については、[`"use server"`](/reference/rsc/use-server)のドキュメントを参照してください。


### Client ComponentsからServer Actionsをインポートする {/*importing-server-actions-from-client-components*/}

Client Componentsは`"use server"`ディレクティブを使用するファイルからServer Actionsをインポートできます：

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

バンドラーが`EmptyNote` Client Componentをビルドすると、バンドル内の`createNoteAction`関数への参照を作成します。`button`がクリックされると、Reactは提供された参照を使用して`createNoteAction`関数を実行するためにサーバーにリクエストを送信します：

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  <button onClick={createNoteAction} />
}
```

詳細については、[`"use server"`](/reference/rsc/use-server)のドキュメントを参照してください。

### ActionsとServer Actionsの合成 {/*composing-server-actions-with-actions*/}

Server Actionsはクライアント上のActionsと合成できます：

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  )
}
```

これにより、クライアント上のActionでServer Actionの`isPending`状態にアクセスできます。

詳細については、[`<form>`の外でServer Actionを呼び出す](/reference/rsc/use-server#calling-a-server-action-outside-of-form)のドキュメントを参照してください。

### Server Actionsを使用したフォームアクション {/*form-actions-with-server-actions*/}

Server ActionsはReact 19の新しいフォーム機能と連携します。

フォームにServer Actionを渡して、フォームを自動的にサーバーに送信することができます：

```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

フォーム送信が成功すると、Reactは自動的にフォームをリセットします。`useActionState`を追加して、保留状態、最後の応答、またはプログレッシブエンハンスメントをサポートすることができます。

詳細については、[フォーム内のServer Actions](/reference/rsc/use-server#server-actions-in-forms)のドキュメントを参照してください。

### `useActionState`を使用したServer Actions {/*server-actions-with-use-action-state*/}

`useActionState`を使用して、アクションの保留状態と最後に返された応答にアクセスする一般的なケースでServer Actionsを合成できます：

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

Server Actionsで`useActionState`を使用する場合、Reactはハイドレーションが完了する前に入力されたフォーム送信を自動的に再生します。これにより、ユーザーはアプリがハイドレートされる前でもアプリと対話できます。

詳細については、[`useActionState`](/reference/react-dom/hooks/useFormState)のドキュメントを参照してください。

### `useActionState`を使用したプログレッシブエンハンスメント {/*progressive-enhancement-with-useactionstate*/}

Server Actionsは`useActionState`の第3引数を使用してプログレッシブエンハンスメントをサポートします。

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<CodeStep step={2}>permalink</CodeStep>が`useActionState`に提供されると、JavaScriptバンドルが読み込まれる前にフォームが送信された場合、Reactは提供されたURLにリダイレクトします。

詳細については、[`useActionState`](/reference/react-dom/hooks/useFormState)のドキュメントを参照してください。