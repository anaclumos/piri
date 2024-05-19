---
title: 'use client'
titleForTitleTag: 'use client' directive
canary: true
---

<Canary>

`'use client'`は、[React Server Componentsを使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。
</Canary>


<Intro>

`'use client'`は、どのコードがクライアントで実行されるかをマークするためのものです。

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `'use client'` {/*use-client*/}

ファイルの先頭に`'use client'`を追加して、そのモジュールとその推移的依存関係をクライアントコードとしてマークします。

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

`'use client'`でマークされたファイルがServer Componentからインポートされると、[互換性のあるバンドラー](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)は、そのモジュールのインポートをサーバー実行コードとクライアント実行コードの境界として扱います。

`RichTextEditor`の依存関係として、`formatDate`と`Button`もそのモジュールに`'use client'`ディレクティブが含まれているかどうかに関係なく、クライアントで評価されます。単一のモジュールは、サーバーコードからインポートされた場合にはサーバーで評価され、クライアントコードからインポートされた場合にはクライアントで評価されることに注意してください。

#### 注意点 {/*caveats*/}

* `'use client'`はファイルの非常に先頭に、インポートや他のコードの上に配置する必要があります（コメントはOKです）。シングルクォートまたはダブルクォートで書かれなければならず、バックティックは使用できません。
* `'use client'`モジュールが他のクライアントレンダリングされたモジュールからインポートされた場合、このディレクティブは効果を持ちません。
* コンポーネントモジュールに`'use client'`ディレクティブが含まれている場合、そのコンポーネントの使用はクライアントコンポーネントであることが保証されます。ただし、コンポーネントが`'use client'`ディレクティブを持っていなくても、クライアントで評価されることがあります。
	* コンポーネントの使用は、`'use client'`ディレクティブを持つモジュールで定義されている場合、または`'use client'`ディレクティブを含むモジュールの推移的依存関係である場合にクライアントコンポーネントと見なされます。それ以外の場合はサーバーコンポーネントです。
* クライアント評価用にマークされたコードはコンポーネントに限定されません。クライアントモジュールのサブツリーの一部であるすべてのコードがクライアントに送信され、実行されます。
* サーバー評価モジュールが`'use client'`モジュールから値をインポートする場合、その値はReactコンポーネントまたは[サポートされているシリアライズ可能なプロップ値](#passing-props-from-server-to-client-components)でなければならず、クライアントコンポーネントに渡されます。それ以外の使用ケースでは例外がスローされます。

### `'use client'`がクライアントコードをマークする方法 {/*how-use-client-marks-client-code*/}

Reactアプリでは、コンポーネントはしばしば別々のファイルや[モジュール](/learn/importing-and-exporting-components#exporting-and-importing-a-component)に分割されます。

React Server Componentsを使用するアプリでは、アプリはデフォルトでサーバーレンダリングされます。`'use client'`は[モジュール依存ツリー](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree)にサーバークライアントの境界を導入し、クライアントモジュールのサブツリーを効果的に作成します。

これをよりよく説明するために、次のReact Server Componentsアプリを考えてみましょう。

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

この例のアプリのモジュール依存ツリーでは、`InspirationGenerator.js`の`'use client'`ディレクティブがそのモジュールとそのすべての推移的依存関係をクライアントモジュールとしてマークしています。`InspirationGenerator.js`から始まるサブツリーは、クライアントモジュールとしてマークされています。

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'`は、React Server Componentsアプリのモジュール依存ツリーを分割し、`InspirationGenerator.js`とそのすべての依存関係をクライアントレンダリングとしてマークします。
</Diagram>

レンダリング中、フレームワークはルートコンポーネントをサーバーレンダリングし、[レンダーツリー](/learn/understanding-your-ui-as-a-tree#the-render-tree)を通じて続行し、クライアントマークされたコードからインポートされたコードの評価をオプトアウトします。

サーバーレンダリングされた部分のレンダーツリーはクライアントに送信されます。クライアントはクライアントコードをダウンロードし、ツリーの残りの部分のレンダリングを完了します。

<Diagram name="use_client_render_tree" height={250} width={500} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">
React Server Componentsアプリのレンダーツリー。`InspirationGenerator`とその子コンポーネント`FancyText`は、クライアントマークされたコードからエクスポートされたコンポーネントであり、クライアントコンポーネントと見なされます。
</Diagram>

次の定義を導入します：

* **クライアントコンポーネント**は、クライアントでレンダリングされるレンダーツリー内のコンポーネントです。
* **サーバーコンポーネント**は、サーバーでレンダリングされるレンダーツリー内のコンポーネントです。

例のアプリを通して、`App`、`FancyText`、`Copyright`はすべてサーバーレンダリングされ、サーバーコンポーネントと見なされます。`InspirationGenerator.js`とその推移的依存関係がクライアントコードとしてマークされているため、`InspirationGenerator`コンポーネントとその子コンポーネント`FancyText`はクライアントコンポーネントです。

<DeepDive>
#### `FancyText`はどのようにしてサーバーコンポーネントとクライアントコンポーネントの両方になるのか？ {/*how-is-fancytext-both-a-server-and-a-client-component*/}

上記の定義によれば、`FancyText`コンポーネントはサーバーコンポーネントとクライアントコンポーネントの両方です。どうしてそうなるのでしょうか？

まず、「コンポーネント」という用語が非常に正確ではないことを明確にしましょう。ここでは「コンポーネント」を理解するための2つの方法を示します：

1. 「コンポーネント」は**コンポーネント定義**を指すことがあります。ほとんどの場合、これは関数です。

```js
// これはコンポーネントの定義です
function MyComponent() {
  return <p>My Component</p>
}
```

2. 「コンポーネント」は、その定義の**コンポーネント使用**を指すこともあります。
```js
import MyComponent from './MyComponent';

function App() {
  // これはコンポーネントの使用です
  return <MyComponent />;
}
```

多くの場合、概念を説明する際にはこの不正確さは重要ではありませんが、この場合は重要です。

サーバーコンポーネントまたはクライアントコンポーネントについて話すとき、私たちはコンポーネントの使用について話しています。

* コンポーネントが`'use client'`ディレクティブを持つモジュールで定義されている場合、またはクライアントコンポーネントでインポートされて呼び出される場合、そのコンポーネントの使用はクライアントコンポーネントです。
* それ以外の場合、そのコンポーネントの使用はサーバーコンポーネントです。


<Diagram name="use_client_render_tree" height={150} width={450} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">レンダーツリーはコンポーネントの使用を示します。</Diagram>

`FancyText`に戻ると、コンポーネント定義には`'use client'`ディレクティブが含まれておらず、2つの使用があります。

`App`の子としての`FancyText`の使用は、その使用をサーバーコンポーネントとしてマークします。`FancyText`が`InspirationGenerator`の下でインポートされて呼び出されると、その`FancyText`の使用は`InspirationGenerator`が`'use client'`ディレクティブを含んでいるため、クライアントコンポーネントです。

これは、`FancyText`のコンポーネント定義がサーバーで評価されると同時に、クライアントコンポーネントの使用をレンダリングするためにクライアントによってダウンロードされることを意味します。

</DeepDive>

<DeepDive>

#### なぜ`Copyright`はサーバーコンポーネントなのか？ {/*why-is-copyright-a-server-component*/}

`Copyright`がクライアントコンポーネント`InspirationGenerator`の子としてレンダリングされるため、サーバーコンポーネントであることに驚くかもしれません。

`'use client'`は、レンダーツリーではなく、_モジュール依存ツリー_上のサーバーとクライアントコードの境界を定義することを思い出してください。

<Diagram name="use_client_module_dependency" height={200} width={500} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'`は、モジュール依存ツリー上のサーバーとクライアントコードの境界を定義します。
</Diagram>

モジュール依存ツリーでは、`App.js`が`Copyright`を`Copyright.js`モジュールからインポートして呼び出していることがわかります。`Copyright.js`には`'use client'`ディレクティブが含まれていないため、そのコンポーネントの使用はサーバーでレンダリングされます。`App`はルートコンポーネントであるため、サーバーでレンダリングされます。

クライアントコンポーネントは、JSXをプロップとして渡すことができるため、サーバーコンポーネントをレンダリングできます。この場合、`InspirationGenerator`は[children](/learn/passing-props-to-a-component#passing-jsx-as-children)として`Copyright`を受け取ります。しかし、`InspirationGenerator`モジュールは`Copyright`モジュールを直接インポートしたり、コンポーネントを呼び出したりすることはありません。すべては`App`によって行われます。実際、`Copyright`コンポーネントは`InspirationGenerator`がレンダリングを開始する前に完全に実行されます。

親子のレンダー関係が同じレンダー環境を保証しないことを覚えておいてください。

</DeepDive>

### `'use client'`をいつ使用するか {/*when-to-use-use-client*/}

`'use client'`を使用すると、コンポーネントがクライアントコンポーネントであるかどうかを決定できます。サーバーコンポーネントがデフォルトであるため、クライアントレンダリングとしてマークする必要がある場合を判断するために、サーバーコンポーネントの利点と制限の概要を示します。

簡単のために、サーバーコンポーネントについて話しますが、同じ原則はサーバーで実行されるアプリ内のすべてのコードに適用されます。

#### サーバーコンポーネントの利点 {/*advantages*/}
* サーバーコンポーネントは、クライアントに送信され実行されるコードの量を減らすことができます。クライアントモジュールのみがクライアントによってバンドルされ、評価されます。
* サーバーコンポーネントはサーバー上で実行されることの利点を享受します。ローカルファイルシステムにアクセスでき、データフェッチやネットワークリクエストのレイテンシが低い場合があります。

#### サーバーコンポーネントの制限 {/*limitations*/}
* サーバーコンポーネントは、イベントハンドラがクライアントによって登録およびトリガーされる必要があるため、インタラクションをサポートできません。
	* たとえば、`onClick`のようなイベントハンドラはクライアントコンポーネントでのみ定義できます。
* サーバーコンポーネントはほとんどのフックを使用できません。
	* サーバーコンポーネントがレンダリングされると、その出力はクライアントがレンダリングするコンポーネントのリストに過ぎません。サーバーコンポーネントはレンダリング後にメモリに保持されず、独自の状態を持つことができません。

### サーバーコンポーネントが返すシリアライズ可能な型 {/*serializable-types*/}

他のReactアプリと同様に、親コンポーネントは子コンポーネントにデータを渡します。異なる環境でレンダリングされるため、サーバーコンポーネントからクライアントコンポーネントにデータを渡すには追加の考慮が必要です。

サーバーコンポーネントからクライアントコンポーネントに渡されるプロップ値はシリアライズ可能でなければなりません。

シリアライズ可能なプロップには以下が含まれます：
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
* プレーンな[オブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)：[オブジェクト初期化子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)で作成されたもので、シリアライズ可能なプロパティを持つもの
* [Server Actions](/reference/rsc/use-server)である関数
* クライアントまたはサーバーコンポーネントの要素（JSX）
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

特に、以下はサポートされていません：
* クライアントマークされたモジュールからエクスポートされていない関数や[`'use server'`](/reference/rsc/use-server)でマークされていない関数
* [クラス](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 任意のクラスのインスタンスであるオブジェクト（上記のビルトインを除く）や[nullプロトタイプ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)を持つオブジェクト
* グローバルに登録されていないシンボル、例：`Symbol('my new symbol')`

## 使用法 {/*usage*/}

### インタラクティブ性と状態を持つ構築 {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

`Counter`は`useState`フックと値をインクリメントまたはデクリメントするためのイベントハンドラの両方を必要とするため、このコンポーネントはクライアントコンポーネントでなければならず、上部に`'use client'`ディレクティブが必要です。

対照的に、インタラクションなしでUIをレンダリングするコンポーネントはクライアントコンポーネントである必要はありません。

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

たとえば、`Counter`の親コンポーネントである`CounterContainer`はインタラクティブではなく、状態を使用しないため、`'use client'`を必要としません。さらに、`CounterContainer`はローカルファイルシステムから読み取るため、サーバーコンポーネントでなければなりません。これはサーバーコンポーネントでのみ可能です。

また、サーバーまたはクライアント専用の機能を使用しないコンポーネントもあり、どこでレンダリングされるかに関係なく動作します。前の例では、`FancyText`がそのようなコンポーネントの一例です。

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

この場合、`'use client'`ディレクティブを追加しないため、`FancyText`の_出力_（依存関係を含むソースコードではなく）がサーバーコンポーネントから参照されたときにブラウザに送信されます。前のInspirationsアプリの例で示したように、`FancyText`はインポートされて使用される場所に応じてサーバーコンポーネントまたはクライアントコンポーネントの両方として使用されます。

しかし、`FancyText`のHTML出力がそのソースコード（依存関係を含む）に比べて大きい場合、常にクライアントコンポーネントとして強制する方が効率的かもしれません。長いSVGパス文字列を返すコンポーネントは、クライアントコンポーネントとして強制する方が効率的な場合の一例です。

### クライアントAPIの使用 {/*using-client-apis*/}

Reactアプリは、Webストレージ、オーディオおよびビデオの操作、デバイスハードウェアなどのクライアント固有のAPIを使用することがあります。

この例では、コンポーネントは[`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)要素を操作するために[DOM API](https://developer.mozilla.org/en-US/docs/Glossary/DOM)を使用しています。これらのAPIはブラウザでのみ利用可能であるため、クライアントコンポーネントとしてマークする必要があります。

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### サードパーティライブラリの使用 {/*using-third-party-libraries*/}

Reactアプリでは、一般的なUIパターンやロジックを処理するためにサードパーティライブラリを活用することがよくあります。

これらのライブラリは、コンポーネントフックやクライアントAPIに依存している場合があります。次のReact APIのいずれかを使用するサードパーティコンポーネントは、クライアントで実行する必要があります：
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks)および[`react-dom`](/reference/react-dom/hooks)フック、[`use`](/reference/react/use)および[`useId`](/reference/react/useId)を除く
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* クライアントAPIを使用する場合、例：DOM挿入やネイティブプラットフォームビュー

これらのライブラリがReact Server Componentsと互換性があるように更新されている場合、それらはすでに独自の`'use client'`マーカーを含んでおり、サーバーコンポーネントから直接使用できます。ライブラリが更新されていない場合や、クライアントでのみ指定できるイベントハンドラのようなプロップが必要な場合、サードパーティクライアントコンポーネントとサーバーコンポーネントの間に独自のクライアントコンポーネントファイルを追加する必要があるかもしれません。

[TODO]: <> (トラブルシューティング - 使用例が必要)