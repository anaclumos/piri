---
title: experimental_taintObjectReference
---

<Wip>

**このAPIは実験的なものであり、まだ安定版のReactでは利用できません。**

最新の実験的なバージョンにReactパッケージをアップグレードすることで試すことができます：

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Reactの実験的なバージョンにはバグが含まれている可能性があります。プロダクション環境では使用しないでください。

このAPIはReact Server Components内でのみ利用可能です。

</Wip>


<Intro>

`taintObjectReference`を使用すると、特定のオブジェクトインスタンスが`user`オブジェクトのようなClient Componentに渡されるのを防ぐことができます。

```js
experimental_taintObjectReference(message, object);
```

キー、ハッシュ、トークンの渡しを防ぐには、[`taintUniqueValue`](/reference/react/experimental_taintUniqueValue)を参照してください。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

オブジェクトを`taintObjectReference`で呼び出すと、それがClientにそのまま渡されるべきではないものとしてReactに登録されます：

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'すべての環境変数をクライアントに渡さないでください。',
  process.env
);
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `message`: オブジェクトがClient Componentに渡された場合に表示したいメッセージ。このメッセージは、オブジェクトがClient Componentに渡された場合にスローされるエラーの一部として表示されます。

* `object`: 汚染するオブジェクト。関数やクラスインスタンスも`taintObjectReference`に`object`として渡すことができます。関数やクラスはすでにClient Componentsに渡されるのをブロックされていますが、Reactのデフォルトのエラーメッセージは`message`で定義したものに置き換えられます。Typed Arrayの特定のインスタンスが`taintObjectReference`に`object`として渡された場合、他のTyped Arrayのコピーは汚染されません。

#### 戻り値 {/*returns*/}

`experimental_taintObjectReference`は`undefined`を返します。

#### 注意点 {/*caveats*/}

- 汚染されたオブジェクトを再作成またはクローンすると、新しい汚染されていないオブジェクトが作成される可能性があります。例えば、汚染された`user`オブジェクトがある場合、`const userInfo = {name: user.name, ssn: user.ssn}`や`{...user}`は汚染されていない新しいオブジェクトを作成します。`taintObjectReference`は、オブジェクトが変更されずにClient Componentに渡される場合の単純なミスを防ぐだけです。

<Pitfall>

**セキュリティのために汚染だけに頼らないでください。** オブジェクトを汚染しても、すべての派生値の漏洩を防ぐことはできません。例えば、汚染されたオブジェクトのクローンは新しい汚染されていないオブジェクトを作成します。汚染されたオブジェクトからデータを使用する（例：`{secret: taintedObj.secret}`）と、新しい値やオブジェクトが作成され、それは汚染されていません。汚染は保護の一層に過ぎません。安全なアプリは複数の保護層、よく設計されたAPI、および分離パターンを持っています。

</Pitfall>

---

## 使用法 {/*usage*/}

### ユーザーデータが意図せずクライアントに到達するのを防ぐ {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Client Componentは、機密データを持つオブジェクトを受け入れるべきではありません。理想的には、データ取得関数は現在のユーザーがアクセスすべきでないデータを公開しないようにするべきです。リファクタリング中にミスが発生することがあります。これらのミスが後で発生するのを防ぐために、データAPIでユーザーオブジェクトを「汚染」することができます。

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'ユーザーオブジェクト全体をクライアントに渡さないでください。' +
      '代わりに、この使用ケースに必要な特定のプロパティを選んでください。',
    user,
  );
  return user;
}
```

これで誰かがこのオブジェクトをClient Componentに渡そうとすると、渡されたエラーメッセージと共にエラーがスローされます。

<DeepDive>

#### データ取得における漏洩防止 {/*protecting-against-leaks-in-data-fetching*/}

機密データにアクセスできるServer Components環境を実行している場合、オブジェクトをそのまま渡さないように注意する必要があります：

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // これはやらないでください
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

理想的には、`getUser`は現在のユーザーがアクセスすべきでないデータを公開しないようにするべきです。`user`オブジェクトをClient Componentに渡すのを防ぐために、ユーザーオブジェクトを「汚染」することができます：

```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'ユーザーオブジェクト全体をクライアントに渡さないでください。' +
      '代わりに、この使用ケースに必要な特定のプロパティを選んでください。',
    user,
  );
  return user;
}
```

これで誰かが`user`オブジェクトをClient Componentに渡そうとすると、渡されたエラーメッセージと共にエラーがスローされます。

</DeepDive>