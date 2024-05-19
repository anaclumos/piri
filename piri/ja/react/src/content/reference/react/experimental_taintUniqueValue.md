---
title: experimental_taintUniqueValue
---

<Wip>

**このAPIは実験的なものであり、まだ安定版のReactでは利用できません。**

Reactパッケージを最新の実験的バージョンにアップグレードすることで試すことができます：

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

実験的なバージョンのReactにはバグが含まれている可能性があります。プロダクション環境では使用しないでください。

このAPIは[React Server Components](/reference/rsc/use-client)内でのみ利用可能です。

</Wip>


<Intro>

`taintUniqueValue`は、パスワード、キー、トークンなどのユニークな値がClient Componentsに渡されるのを防ぐことができます。

```js
taintUniqueValue(errMessage, lifetime, value)
```

機密データを含むオブジェクトの渡しを防ぐには、[`taintObjectReference`](/reference/react/experimental_taintObjectReference)を参照してください。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

パスワード、トークン、キー、またはハッシュを`taintUniqueValue`で呼び出し、それをReactにクライアントにそのまま渡してはいけないものとして登録します：

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  '秘密のキーをクライアントに渡さないでください。',
  process,
  process.env.SECRET_KEY
);
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `message`: `value`がClient Componentに渡された場合に表示したいメッセージ。このメッセージは、`value`がClient Componentに渡された場合にスローされるエラーの一部として表示されます。

* `lifetime`: `value`が汚染される期間を示すオブジェクト。`value`はこのオブジェクトが存在する限り、どのClient Componentにも送信されません。例えば、`globalThis`を渡すと、アプリの存続期間中ずっと値がブロックされます。`lifetime`は通常、`value`を含むプロパティを持つオブジェクトです。

* `value`: 文字列、bigint、またはTypedArray。`value`は暗号トークン、秘密鍵、ハッシュ、または長いパスワードのような高エントロピーのユニークな文字列またはバイト列でなければなりません。`value`はどのClient Componentにも送信されないようにブロックされます。

#### 戻り値 {/*returns*/}

`experimental_taintUniqueValue`は`undefined`を返します。

#### 注意点 {/*caveats*/}

* 汚染された値から新しい値を導出すると、汚染保護が損なわれる可能性があります。汚染された値を大文字に変換したり、汚染された文字列値を大きな文字列に連結したり、汚染された値をbase64に変換したり、汚染された値の部分文字列を返したりするなどの変換によって作成された新しい値は、明示的に`taintUniqueValue`を呼び出さない限り汚染されません。
* PINコードや電話番号のような低エントロピーの値を保護するために`taintUniqueValue`を使用しないでください。リクエスト内の任意の値が攻撃者によって制御されている場合、秘密のすべての可能な値を列挙することでどの値が汚染されているかを推測できる可能性があります。

---

## 使用法 {/*usage*/}

### トークンがClient Componentsに渡されるのを防ぐ {/*prevent-a-token-from-being-passed-to-client-components*/}

パスワード、セッショントークン、その他のユニークな値などの機密情報が誤ってClient Componentsに渡されないようにするために、`taintUniqueValue`関数は保護層を提供します。値が汚染されると、それをClient Componentに渡そうとするとエラーが発生します。

`lifetime`引数は、値が汚染されたままでいる期間を定義します。無期限に汚染されたままであるべき値には、[`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)や`process`のようなオブジェクトが`lifetime`引数として使用できます。これらのオブジェクトはアプリの実行期間全体にわたって存続します。

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'ユーザーパスワードをクライアントに渡さないでください。',
  globalThis,
  process.env.SECRET_KEY
);
```

汚染された値の寿命がオブジェクトに関連している場合、`lifetime`は値をカプセル化するオブジェクトであるべきです。これにより、カプセル化オブジェクトの寿命中、汚染された値が保護されます。

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'ユーザーセッショントークンをクライアントに渡さないでください。',
    user,
    user.session.token
  );
  return user;
}
```

この例では、`user`オブジェクトが`lifetime`引数として機能します。このオブジェクトがグローバルキャッシュに保存されたり、別のリクエストでアクセス可能になったりすると、セッショントークンは汚染されたままになります。

<Pitfall>

**汚染だけに頼らないでください。** 汚染された値から新しい値を作成することは、汚染保護を無効にする可能性があります。例えば、汚染された文字列を大文字に変換して新しい値を作成することは、新しい値を汚染しません。

```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'パスワードをクライアントに渡さないでください。',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword`は汚染されていません
```

この例では、定数`password`が汚染されています。その後、`password`を使用して`toUpperCase`メソッドを呼び出して新しい値`uppercasePassword`を作成します。新しく作成された`uppercasePassword`は汚染されていません。

汚染された値から新しい値を導出する他の方法（例えば、文字列に連結する、base64に変換する、部分文字列を返すなど）も同様に汚染されていない値を作成します。

汚染は、秘密の値をクライアントに明示的に渡すような単純なミスを防ぐためのものです。Reactの外部でグローバルストアを使用するなど、`taintUniqueValue`の呼び出しにミスがあると、汚染された値が汚染されなくなる可能性があります。汚染は保護の一層に過ぎません。安全なアプリは、複数の保護層、よく設計されたAPI、および分離パターンを持つ必要があります。

</Pitfall>

<DeepDive>

#### `server-only`と`taintUniqueValue`を使用して秘密を漏らさないようにする {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

プライベートキーやパスワード（例えばデータベースパスワード）にアクセスできるServer Components環境を実行している場合、それをClient Componentに渡さないように注意する必要があります。

```js
export async function Dashboard(props) {
  // これはしないでください
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

この例では、秘密のAPIトークンがクライアントに漏れてしまいます。このAPIトークンが、この特定のユーザーがアクセスすべきでないデータにアクセスするために使用できる場合、データ漏洩につながる可能性があります。

[comment]: <> (TODO: `server-only`のドキュメントが書かれたらリンクを追加)

理想的には、このような秘密は、サーバー上の信頼できるデータユーティリティによってのみインポートされる単一のヘルパーファイルに抽象化されます。このヘルパーは[`server-only`](https://www.npmjs.com/package/server-only)でタグ付けされて、クライアントでこのファイルがインポートされないようにすることもできます。

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

リファクタリング中にミスが発生することもあり、すべての同僚がこれを知っているわけではないかもしれません。
このようなミスが将来的に発生しないように、実際のパスワードを「汚染」することができます：

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'APIトークンパスワードをクライアントに渡さないでください。 ' +
    '代わりにすべてのフェッチをサーバーで行ってください。'
  process,
  process.env.API_PASSWORD
);
```

これで誰かがこのパスワードをClient Componentに渡そうとしたり、Server Actionでクライアントに送信しようとしたりすると、`taintUniqueValue`を呼び出したときに定義したメッセージとともにエラーがスローされます。

</DeepDive>

---