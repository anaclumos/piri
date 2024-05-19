---
title: 'use server'
titleForTitleTag: 'use server' directive
canary: true
---

<Canary>

`'use server'`は、[React Server Componentsを使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それに対応するライブラリを構築している場合にのみ必要です。

</Canary>


<Intro>

`'use server'`は、クライアント側のコードから呼び出せるサーバー側の関数をマークします。

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `'use server'` {/*use-server*/}

非同期関数の本体の先頭に`'use server'`を追加して、クライアントから呼び出せる関数としてマークします。これらの関数を_サーバーアクション_と呼びます。

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

クライアントでサーバーアクションを呼び出すと、渡された引数のシリアライズされたコピーを含むネットワークリクエストがサーバーに送信されます。サーバーアクションが値を返す場合、その値はシリアライズされてクライアントに返されます。

個々の関数に`'use server'`をマークする代わりに、ファイルの先頭にディレクティブを追加して、そのファイル内のすべてのエクスポートをサーバーアクションとしてマークし、クライアントコードでインポートして使用することができます。

#### 注意点 {/*caveats*/}
* `'use server'`は、関数またはモジュールの非常に先頭に配置する必要があります。他のコード（インポートを含む）の上に配置してください（ディレクティブの上のコメントはOKです）。シングルクォートまたはダブルクォートで記述する必要があり、バックティックは使用できません。
* `'use server'`はサーバー側のファイルでのみ使用できます。結果として得られるサーバーアクションは、プロップスを通じてクライアントコンポーネントに渡すことができます。シリアライズのサポートされている[型](#serializable-parameters-and-return-values)を参照してください。
* [クライアントコード](/reference/rsc/use-client)からサーバーアクションをインポートするには、モジュールレベルでディレクティブを使用する必要があります。
* 基本的にネットワーク呼び出しは常に非同期であるため、`'use server'`は非同期関数でのみ使用できます。
* サーバーアクションの引数は信頼できない入力として扱い、すべての変更を認証してください。[セキュリティの考慮事項](#security)を参照してください。
* サーバーアクションは、サーバー側の状態を更新するための変更に設計されています。データフェッチには推奨されません。したがって、サーバーアクションを実装するフレームワークは通常、一度に1つのアクションを処理し、返り値をキャッシュする方法はありません。

### セキュリティの考慮事項 {/*security*/}

サーバーアクションの引数は完全にクライアントによって制御されます。セキュリティのために、常に信頼できない入力として扱い、適切に引数を検証およびエスケープしてください。

サーバーアクションでは、ログインしているユーザーがそのアクションを実行する権限があることを確認してください。

<Wip>

サーバーアクションから機密データを送信しないようにするために、クライアントコードに一意の値やオブジェクトを渡すことを防ぐ実験的な汚染APIがあります。

[experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue)および[experimental_taintObjectReference](/reference/react/experimental_taintObjectReference)を参照してください。

</Wip>

### シリアライズ可能な引数と返り値 {/*serializable-parameters-and-return-values*/}

クライアントコードがネットワークを介してサーバーアクションを呼び出すため、渡される引数はシリアライズ可能である必要があります。

サーバーアクションの引数としてサポートされている型は次のとおりです：

* プリミティブ
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)、[`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)を介してグローバルシンボルレジストリに登録されたシンボルのみ
* シリアライズ可能な値を含むイテラブル
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)および[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)インスタンス
* シリアライズ可能なプロパティを持つプレーン[オブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)：[オブジェクト初期化子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)で作成されたもの
* サーバーアクションである関数
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

特に、次のものはサポートされていません：
* React要素、または[JSX](/learn/writing-markup-with-jsx)
* 関数、コンポーネント関数やサーバーアクションでない他の関数を含む
* [クラス](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 任意のクラスのインスタンスであるオブジェクト（上記の組み込み以外）や[nullプロトタイプ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)を持つオブジェクト

サポートされているシリアライズ可能な返り値は、境界クライアントコンポーネントの[シリアライズ可能なプロップス](/reference/rsc/use-client#passing-props-from-server-to-client-components)と同じです。


## 使用法 {/*usage*/}

### フォームでのサーバーアクション {/*server-actions-in-forms*/}

サーバーアクションの最も一般的な使用例は、データを変更するサーバー関数を呼び出すことです。ブラウザでは、[HTMLフォーム要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)は、ユーザーが変更を送信するための伝統的なアプローチです。React Server Componentsでは、Reactは[フォーム](/reference/react-dom/components/form)でのサーバーアクションのためのファーストクラスサポートを導入します。

以下は、ユーザーがユーザー名をリクエストできるフォームです。

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

この例では、`requestUsername`は`<form>`に渡されたサーバーアクションです。ユーザーがこのフォームを送信すると、サーバー関数`requestUsername`へのネットワークリクエストが行われます。フォームでサーバーアクションを呼び出すと、Reactはフォームの<CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep>をサーバーアクションの最初の引数として提供します。

サーバーアクションをフォームの`action`に渡すことで、Reactはフォームを[プログレッシブエンハンスメント](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)できます。これは、JavaScriptバンドルが読み込まれる前にフォームを送信できることを意味します。

#### フォームでの返り値の処理 {/*handling-return-values*/}

ユーザー名リクエストフォームでは、ユーザー名が利用できない可能性があります。`requestUsername`は失敗したかどうかを教えてくれるべきです。

プログレッシブエンハンスメントをサポートしながら、サーバーアクションの結果に基づいてUIを更新するには、[`useActionState`](/reference/react/useActionState)を使用します。

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

ほとんどのHooksと同様に、`useActionState`は<CodeStep step={1}>[クライアントコード](/reference/rsc/use-client)</CodeStep>でのみ呼び出すことができることに注意してください。

### `<form>`の外でサーバーアクションを呼び出す {/*calling-a-server-action-outside-of-form*/}

サーバーアクションはサーバーエンドポイントとして公開され、クライアントコードのどこからでも呼び出すことができます。

[フォーム](/reference/react-dom/components/form)の外でサーバーアクションを使用する場合、サーバーアクションを[トランジション](/reference/react/useTransition)で呼び出します。これにより、ローディングインジケーターを表示したり、[楽観的な状態更新](/reference/react/useOptimistic)を表示したり、予期しないエラーを処理したりできます。フォームは自動的にサーバーアクションをトランジションでラップします。

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

サーバーアクションの返り値を読み取るには、返されたプロミスを`await`する必要があります。