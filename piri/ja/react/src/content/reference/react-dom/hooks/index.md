---
title: 組み込みの React DOM フック
---

<Intro>

`react-dom`パッケージには、ウェブアプリケーション（ブラウザのDOM環境で実行される）でのみサポートされているHooksが含まれています。これらのHooksは、iOS、Android、またはWindowsアプリケーションのような非ブラウザ環境ではサポートされていません。ウェブブラウザ*および他の環境*でサポートされているHooksを探している場合は、[React Hooksページ](/reference/react)を参照してください。このページには、`react-dom`パッケージのすべてのHooksが一覧表示されています。

</Intro>

---

## フォームHooks {/*form-hooks*/}

<Canary>

フォームHooksは現在、Reactのcanaryおよび実験的チャンネルでのみ利用可能です。[Reactのリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)で詳しく学んでください。

</Canary>

*フォーム*は、情報を送信するためのインタラクティブなコントロールを作成することができます。コンポーネント内でフォームを管理するには、次のいずれかのHooksを使用します：

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)は、フォームのステータスに基づいてUIを更新することができます。

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```