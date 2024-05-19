---
title: useCallback
---

<Intro>

`useCallback`は、再レンダリング間で関数定義をキャッシュするためのReact Hookです。

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

`useCallback`をコンポーネントのトップレベルで呼び出して、再レンダリング間で関数定義をキャッシュします：

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `fn`: キャッシュしたい関数の値。任意の引数を取り、任意の値を返すことができます。Reactは初回レンダリング時に関数を返します（呼び出しません）。次回のレンダリング時には、`dependencies`が前回のレンダリングから変更されていない場合、同じ関数を返します。そうでない場合、現在のレンダリングで渡された関数を返し、後で再利用できるように保存します。Reactは関数を呼び出しません。関数はあなたに返されるので、いつ呼び出すか、呼び出すかどうかを決定できます。

* `dependencies`: `fn`コード内で参照されるすべてのリアクティブな値のリスト。リアクティブな値には、props、state、およびコンポーネント本体内で直接宣言されたすべての変数と関数が含まれます。リンターが[React用に設定されている場合](/learn/editor-setup#linting)、すべてのリアクティブな値が依存関係として正しく指定されていることを確認します。依存関係のリストは一定の項目数を持ち、`[dep1, dep2, dep3]`のようにインラインで書かれる必要があります。Reactは[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較アルゴリズムを使用して、各依存関係を前の値と比較します。

#### 戻り値 {/*returns*/}

初回レンダリング時に、`useCallback`は渡された`fn`関数を返します。

次回以降のレンダリング時には、依存関係が変更されていない場合、前回のレンダリングから既に保存されている`fn`関数を返します。そうでない場合、現在のレンダリングで渡された`fn`関数を返します。

#### 注意点 {/*caveats*/}

* `useCallback`はHookなので、**コンポーネントのトップレベル**または独自のHooksでのみ呼び出すことができます。ループや条件内で呼び出すことはできません。その場合は、新しいコンポーネントを抽出し、状態をそこに移動します。
* Reactは**特定の理由がない限り、キャッシュされた関数を破棄しません。** 例えば、開発中にコンポーネントのファイルを編集すると、Reactはキャッシュを破棄します。開発中および本番環境の両方で、初回マウント中にコンポーネントがサスペンドすると、Reactはキャッシュを破棄します。将来的には、Reactがキャッシュを破棄する機能を追加する可能性があります。例えば、Reactが仮想リストの組み込みサポートを追加する場合、仮想テーブルのビューポートからスクロールアウトするアイテムのキャッシュを破棄することが理にかなっています。これは、`useCallback`をパフォーマンス最適化として使用する場合の期待に一致するはずです。そうでない場合は、[状態変数](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead)や[ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)がより適切かもしれません。

---

## 使用法 {/*usage*/}

### コンポーネントの再レンダリングをスキップする {/*skipping-re-rendering-of-components*/}

レンダリングパフォーマンスを最適化する際、子コンポーネントに渡す関数をキャッシュする必要がある場合があります。まず、その方法の構文を見てから、どのような場合に役立つかを見てみましょう。

コンポーネントの再レンダリング間で関数をキャッシュするには、その定義を`useCallback` Hookでラップします：

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback`に渡すものは2つあります：

1. 再レンダリング間でキャッシュしたい関数定義。
2. 関数内で使用されるコンポーネント内のすべての値を含む<CodeStep step={2}>依存関係のリスト</CodeStep>。

初回レンダリング時に、`useCallback`から返される<CodeStep step={3}>関数</CodeStep>は、渡された関数です。

次回以降のレンダリング時には、Reactは<CodeStep step={2}>依存関係</CodeStep>を前回のレンダリング時に渡された依存関係と比較します。依存関係が変更されていない場合（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)で比較）、`useCallback`は前回と同じ関数を返します。そうでない場合、`useCallback`は*今回*のレンダリングで渡された関数を返します。

言い換えれば、`useCallback`は依存関係が変更されるまで、再レンダリング間で関数をキャッシュします。

**これが役立つ場合を例を通して見てみましょう。**

`ProductPage`から`ShippingForm`コンポーネントに`handleSubmit`関数を渡しているとします：

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme`プロップを切り替えるとアプリが一瞬フリーズすることに気づきましたが、JSXから`<ShippingForm />`を削除すると、速く感じます。これは、`ShippingForm`コンポーネントの最適化を試みる価値があることを示しています。

**デフォルトでは、コンポーネントが再レンダリングされると、Reactはその子コンポーネントを再帰的に再レンダリングします。** これが、`ProductPage`が異なる`theme`で再レンダリングされると、`ShippingForm`コンポーネントも再レンダリングされる理由です。これは、再レンダリングに多くの計算を必要としないコンポーネントには問題ありません。しかし、再レンダリングが遅いことを確認した場合、[`memo`](/reference/react/memo)でラップして、プロップが前回と同じ場合に再レンダリングをスキップするように`ShippingForm`に指示できます：

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**この変更により、`ShippingForm`はすべてのプロップが前回と同じ場合に再レンダリングをスキップします。** ここで関数のキャッシュが重要になります！`useCallback`なしで`handleSubmit`を定義したとしましょう：

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // テーマが変更されるたびに、これは異なる関数になります...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... したがって、ShippingFormのプロップは決して同じにならず、毎回再レンダリングされます */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**JavaScriptでは、`function () {}`や`() => {}`は常に_異なる_関数を作成します。** これは、`{}`オブジェクトリテラルが常に新しいオブジェクトを作成するのと同様です。通常、これは問題になりませんが、`ShippingForm`のプロップが決して同じにならないことを意味し、[`memo`](/reference/react/memo)最適化が機能しません。ここで`useCallback`が役立ちます：

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 再レンダリング間で関数をキャッシュするようにReactに指示します...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...これらの依存関係が変更されない限り...

  return (
    <div className={theme}>
      {/* ...ShippingFormは同じプロップを受け取り、再レンダリングをスキップできます */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**`handleSubmit`を`useCallback`でラップすることで、再レンダリング間で同じ関数であることを保証します**（依存関係が変更されるまで）。特定の理由がない限り、関数を`useCallback`でラップする必要はありません。この例では、[`memo`](/reference/react/memo)でラップされたコンポーネントに渡すために行っています。これにより、再レンダリングをスキップできます。他の理由で`useCallback`が必要な場合もあり、このページでさらに説明されています。

<Note>

**`useCallback`はパフォーマンス最適化としてのみ使用するべきです。** それなしでコードが動作しない場合は、根本的な問題を見つけて修正してください。その後、`useCallback`を追加することができます。

</Note>

<DeepDive>

#### useCallbackはuseMemoとどう関係しているのか？ {/*how-is-usecallback-related-to-usememo*/}

[`useMemo`](/reference/react/useMemo)と`useCallback`は、子コンポーネントを最適化しようとする際によく一緒に見られます。これらは、渡すものを[メモ化](https://en.wikipedia.org/wiki/Memoization)（つまり、キャッシュ）するのに役立ちます：

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // 関数を呼び出し、その結果をキャッシュします
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // 関数自体をキャッシュします
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

違いは、*何を*キャッシュするかにあります：

* **[`useMemo`](/reference/react/useMemo)は関数を呼び出した結果をキャッシュします。** この例では、`computeRequirements(product)`を呼び出した結果をキャッシュし、`product`が変更されない限り変更しません。これにより、`requirements`オブジェクトを渡しても`ShippingForm`を不必要に再レンダリングしないようにします。必要に応じて、Reactはレンダリング中に渡された関数を呼び出して結果を計算します。
* **`useCallback`は関数自体をキャッシュします。** `useMemo`とは異なり、提供された関数を呼び出しません。代わりに、提供された関数をキャッシュし、`productId`や`referrer`が変更されない限り`handleSubmit`自体が変更されないようにします。これにより、`handleSubmit`関数を渡しても`ShippingForm`を不必要に再レンダリングしないようにします。コードはユーザーがフォームを送信するまで実行されません。

[`useMemo`](/reference/react/useMemo)に慣れている場合は、`useCallback`を次のように考えると役立つかもしれません：

```js
// 簡略化された実装（React内部）
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[`useMemo`と`useCallback`の違いについて詳しく読む。](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### useCallbackをどこにでも追加すべきか？ {/*should-you-add-usecallback-everywhere*/}

あなたのアプリがこのサイトのようであり、ほとんどのインタラクションが粗い（ページやセクション全体を置き換えるような）場合、メモ化は通常不要です。一方、アプリが描画エディタのようであり、ほとんどのインタラクションが細かい（形状を移動するような）場合、メモ化が非常に役立つかもしれません。

`useCallback`で関数をキャッシュすることは、いくつかのケースでのみ価値があります：

- [`memo`](/reference/react/memo)でラップされたコンポーネントにプロップとして渡す場合。値が変更されていない場合に再レンダリングをスキップしたい。メモ化により、依存関係が変更された場合にのみコンポーネントが再レンダリングされます。
- 渡す関数が後で他のHookの依存関係として使用される場合。例えば、他の`useCallback`でラップされた関数がそれに依存している場合や、[`useEffect`](/reference/react/useEffect)からこの関数に依存している場合。

他のケースでは、関数を`useCallback`でラップすることに利点はありません。それを行うことに大きな害もないため、一部のチームは個々のケースを考えずにできるだけ多くのメモ化を選択します。欠点は、コードが読みづらくなることです。また、すべてのメモ化が効果的であるわけではありません。「常に新しい」単一の値がメモ化を破るのに十分です。

`useCallback`は関数の*作成*を防ぐわけではないことに注意してください。常に関数を作成しています（それで問題ありません！）が、Reactはそれを無視し、何も変更されていない場合はキャッシュされた関数を返します。

**実際には、いくつかの原則に従うことで多くのメモ化を不要にすることができます：**

1. コンポーネントが他のコンポーネントを視覚的にラップする場合、[JSXを子として受け入れる](/learn/passing-props-to-a-component#passing-jsx-as-children)ようにします。これにより、ラッパーコンポーネントが独自の状態を更新する場合、Reactはその子が再レンダリングする必要がないことを認識します。
1. ローカル状態を優先し、[状態を必要以上に上げない](/learn/sharing-state-between-components)ようにします。フォームやアイテムがホバーされているかどうかなどの一時的な状態をツリーのトップやグローバル状態ライブラリに保持しないでください。
1. [レンダリングロジックを純粋に保つ](/learn/keeping-components-pure)ようにします。コンポーネントの再レンダリングが問題を引き起こしたり、目に見える視覚的なアーティファクトを生成する場合、それはコンポーネントのバグです！バグを修正し、メモ化を追加するのではなく、バグを修正してください。
1. [状態を更新する不要なエフェクトを避ける](/learn/you-might-not-need-an-effect)ようにします。Reactアプリのほとんどのパフォーマンス
問題は、エフェクトからの更新チェーンが原因でコンポーネントが何度もレンダリングされることです。
1. [エフェクトから不要な依存関係を削除する](/learn/removing-effect-dependencies)ようにします。例えば、メモ化の代わりに、オブジェクトや関数をエフェクト内またはコンポーネント外に移動する方が簡単な場合が多いです。

特定のインタラクションがまだ遅いと感じる場合は、[React Developer Toolsプロファイラー](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)を使用して、メモ化が最も効果的なコンポーネントを確認し、必要に応じてメモ化を追加します。これらの原則は、コンポーネントをデバッグしやすく理解しやすくするため、いずれにしても従うのが良いです。長期的には、[メモ化を自動的に行う](https://www.youtube.com/watch?v=lGEMwh32soc)研究を進めており、これを一度に解決することを目指しています。

</DeepDive>

<Recipes titleText="useCallbackと直接関数を宣言することの違い" titleId="examples-rerendering">

#### `useCallback`と`memo`で再レンダリングをスキップする {/*skipping-re-rendering-with-usecallback-and-memo*/}

この例では、`ShippingForm`コンポーネントが**人工的に遅く**されているため、レンダリングしているReactコンポーネントが本当に遅い場合に何が起こるかを確認できます。カウンターをインクリメントし、テーマを切り替えてみてください。

カウンターをインクリメントすると遅く感じるのは、遅くされた`ShippingForm`が再レンダリングされるためです。これは予想通りで、カウンターが変更されたため、ユーザーの新しい選択を画面に反映する必要があります。

次に、テーマを切り替えてみてください。**`useCallback`と[`memo`](/reference/react/memo)のおかげで、人工的な遅延にもかかわらず速いです！** `ShippingForm`は、`handleSubmit`関数が変更されていないため、再レンダリングをスキップしました。`handleSubmit`関数が変更されなかったのは、`productId`と`referrer`（`useCallback`の依存関係）が前回のレンダリングから変更されていないためです。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // リクエストを送信することを想像してください...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[人工的に遅い] <ShippingForm />をレンダリングしています');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 500ms間何もしないことで非常に遅いコードをエミュレートします
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>注意: <code>ShippingForm</code>は人工的に遅くされています！</b></p>
      <label>
        アイテムの数:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        ストリート:
        <input name="street" />
      </label>
      <label>
        市:
        <input name="city" />
      </label>
      <label>
        郵便番号:
        <input name="zipCode" />
      </label>
      <button type="submit">送信</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 常にコンポーネントを再レンダリングする {/*always-re-rendering-a-component*/}

この例では、`ShippingForm`の実装も**人工的に遅く**されているため、レンダリングしているReactコンポーネントが本当に遅い場合に何が起こるかを確認できます。カウンターをインクリメントし、テーマを切り替えてみてください。

前の例とは異なり、テーマの切り替えも遅くなります！これは、**このバージョンには`useCallback`呼び出しがないため、** `handleSubmit`が常に新しい関数であり、遅くされた`ShippingForm`コンポーネントが再レンダリングをスキップできないためです。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // リクエストを送信することを想像してください...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[人工的に遅い] <ShippingForm />をレンダリングしています');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 500ms間何もしないことで非常に遅いコードをエミュレートします
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        アイテムの数:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        ストリート:
        <input name="street" />
      </label>
      <label>
        市:
        <input name="city" />
      </label>
      <label>
        郵便番号:
        <input name="zipCode" />
      </label>
      <button type="submit">送信</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


しかし、ここでは**人工的な遅延を取り除いた**同じコードです。`useCallback`の欠如が目立つかどうかを確認してください。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // リクエストを送信することを想像してください...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('<ShippingForm />をレンダリングしています');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        アイテムの数:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        ストリート:
        <input name="street" />
      </label>
      <label>
        市:
        <input name="city" />
      </label>
      <label>
        郵便番号:
        <input name="zipCode" />
      </label>
      <button type="submit">送信</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


多くの場合、メモ化なしのコードでも問題なく動作します。インタラクションが十分に速い場合、メモ化は必要ありません。

Reactを本番モードで実行し、[React Developer Tools](/learn/react-developer-tools)を無効にし、アプリのユーザーが使用するデバイスに似たデバイスを使用して、実際にアプリを遅くしているものを現実的に把握することを忘れないでください。

<Solution />

</Recipes>

---

### メモ化されたコールバックから状態を更新する {/*updating-state-from-a-memoized-callback*/}

時々、メモ化されたコールバックから前の状態に基づいて状態を更新する必要があるかもしれません。

この`handleAddTodo`関数は、次の`todos`を計算するために`todos`を依存関係として指定しています：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

通常、メモ化された関数は依存関係をできるだけ少なくしたいものです。次の状態を計算するために状態を読み取る場合、[アップデータ関数](/reference/react/useState#updating-state-based-on-the-previous-state)を渡すことでその依存関係を削除できます：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ todos依存関係は不要
  // ...
```

ここでは、`todos`を依存関係にする代わりに、Reactに状態を更新する方法（`todos => [...todos, newTodo]`）を指示しています。[アップデータ関数について詳しく読む。](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### エフェクトが頻繁に発火するのを防ぐ {/*preventing-an-effect-from-firing-too-often*/}

時々、[エフェクト](/learn/synchronizing-with-effects)内から関数を呼び出したい場合があります：

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

これには問題があります。[すべてのリアクティブな値はエフェクトの依存関係として宣言する必要があります。](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) しかし、`createOptions`を依存関係として宣言すると、エフェクトがチャットルームに再接続し続けることになります：

```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 問題: この依存関係は毎回のレンダリングで変わります
  // ...
```

これを解決するために、エフェクト内から呼び出す必要がある関数を`useCallback`でラップできます：

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomIdが変更されたときのみ変更されます

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ createOptionsが変更されたときのみ変更されます
  // ...
```

これにより、`roomId`が同じであれば、`createOptions`関数が再レンダリング間で同じであることが保証されます。**しかし、関数依存関係の必要性を取り除く方がさらに良いです。** 関数をエフェクト内に移動します：

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallbackや関数依存関係は不要です！
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomIdが変更されたときのみ変更されます
  // ...
```

これでコードがシンプルになり、`useCallback`が不要になります。[エフェクトの依存関係を削除する方法について詳しく読む。](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### カスタムHookの最適化 {/*optimizing-a-custom-hook*/}

[カスタムHook](/learn/reusing-logic-with-custom-hooks)を作成する場合、返す関数を`useCallback`でラップすることをお勧めします：

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

これにより、Hookの消費者が必要に応じて自分のコードを最適化できるようになります。

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントがレンダリングされるたびに、`useCallback`が異なる関数を返す {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

依存関係配列を第二引数として指定したことを確認してください！

依存関係配列を忘れると、`useCallback`は毎回新しい関数を返します：

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 毎回新しい関数を返します：依存関係配列がありません
  // ...
```

これは、依存関係配列を第二引数として渡した修正版です：

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ 不必要に新しい関数を返しません
  // ...
```

これでも問題が解決しない場合、少なくとも1つの依存関係が前回のレンダリングから異なることが原因です。この問題をデバッグするには、依存関係を手動でコンソールにログ出力します：

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

次に、コンソールで異なるレンダリングからの配列を右クリックし、「グローバル変数として保存」を選択します。最初の配列が`temp1`として保存され、2番目の配列が`temp2`として保存されたと仮定します。次に、ブラウザのコンソールを使用して、各依存関係が両方の配列間で同じかどうかを確認できます：

```js
Object.is(temp1[0], temp2[0]); // 配列間で最初の依存関係が同じかどうか？
Object.is(temp1[1], temp2[1]); // 配列間で2番目の依存関係が同じかどうか？
Object.is(temp1[2], temp2[2]); // ... すべての依存関係について同様に ...
```

メモ化を破っている依存関係を見つけたら、それを削除するか、[それもメモ化します。](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### ループ内で各リストアイテムに対して`useCallback`を呼び出す必要があるが、それは許可されていない {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart`コンポーネントが[`memo`](/reference/react/memo)でラップされているとします。`ReportList`コンポーネントが再レンダリングされるときに、リスト内のすべての`Chart`の再レンダリングをスキップしたいとします。しかし、ループ内で`useCallback`を呼び出すことはできません：

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 ループ内でuseCallbackを呼び出すことはできません：
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

代わりに、個々のアイテム用のコンポーネントを抽出し、`useCallback`をそこに置きます：

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ トップレベルでuseCallbackを呼び出します：
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

または、最後のスニペットで`useCallback`を削除し、代わりに`Report`自体を[`memo`](/reference/react/memo)でラップすることもできます。`item`プロップが変更されない場合、`Report`は再レンダリングをスキップし、`Chart`も再レンダリングをスキップします：

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```