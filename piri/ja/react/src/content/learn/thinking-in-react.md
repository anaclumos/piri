---
title: React の考え方
---

<Intro>

Reactは、あなたが見るデザインや作成するアプリについての考え方を変えることができます。Reactでユーザーインターフェースを構築する際、まずそれを*コンポーネント*と呼ばれる部分に分割します。次に、各コンポーネントの異なる視覚状態を記述します。最後に、データがコンポーネント間を流れるようにコンポーネントを接続します。このチュートリアルでは、Reactを使って検索可能な製品データテーブルを構築する思考プロセスを案内します。

</Intro>

## モックアップから始める {/*start-with-the-mockup*/}

すでにJSON APIとデザイナーからのモックアップがあると想像してください。

JSON APIは次のようなデータを返します：

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

モックアップは次のようになります：

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

ReactでUIを実装するには、通常、同じ5つのステップに従います。

## ステップ1: UIをコンポーネント階層に分割する {/*step-1-break-the-ui-into-a-component-hierarchy*/}

まず、モックアップのすべてのコンポーネントとサブコンポーネントの周りにボックスを描き、それらに名前を付けます。デザイナーと一緒に作業している場合、彼らがデザインツールでこれらのコンポーネントにすでに名前を付けているかもしれません。彼らに尋ねてみてください！

バックグラウンドによって、デザインをコンポーネントに分割する方法を異なる方法で考えることができます：

* **プログラミング**--新しい関数やオブジェクトを作成するかどうかを決定するための同じ技術を使用します。1つの技術は[単一責任の原則](https://en.wikipedia.org/wiki/Single_responsibility_principle)であり、理想的にはコンポーネントは1つのことだけを行うべきです。成長した場合は、より小さなサブコンポーネントに分解する必要があります。
* **CSS**--クラスセレクタを作成するものを考慮します。（ただし、コンポーネントは少し粒度が粗いです。）
* **デザイン**--デザインのレイヤーをどのように整理するかを考慮します。

JSONがよく構造化されている場合、それがUIのコンポーネント構造に自然にマッピングされることがよくあります。これは、UIとデータモデルが同じ情報アーキテクチャ、つまり同じ形状を持っていることが多いためです。UIをコンポーネントに分割し、各コンポーネントがデータモデルの1つの部分に一致するようにします。

この画面には5つのコンポーネントがあります：

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable`（グレー）はアプリ全体を含みます。
2. `SearchBar`（青）はユーザー入力を受け取ります。
3. `ProductTable`（ラベンダー）はリストを表示し、ユーザー入力に従ってフィルタリングします。
4. `ProductCategoryRow`（緑）は各カテゴリの見出しを表示します。
5. `ProductRow`（黄色）は各製品の行を表示します。

</CodeDiagram>

</FullWidth>

`ProductTable`（ラベンダー）を見ると、テーブルヘッダー（「Name」と「Price」ラベルを含む）が独自のコンポーネントではないことがわかります。これは好みの問題であり、どちらの方法でも行けます。この例では、`ProductTable`のリスト内に表示されるため、`ProductTable`の一部です。ただし、このヘッダーが複雑になる場合（例：ソートを追加する場合）、独自の`ProductTableHeader`コンポーネントに移動できます。

モックアップのコンポーネントを特定したら、それらを階層に配置します。モックアップ内の別のコンポーネント内に表示されるコンポーネントは、階層内の子として表示されるべきです：

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## ステップ2: Reactで静的バージョンを構築する {/*step-2-build-a-static-version-in-react*/}

コンポーネント階層ができたら、アプリを実装する時です。最も簡単なアプローチは、データモデルからUIをレンダリングするバージョンを構築することです... まだインタラクティブにはしません！静的バージョンを最初に構築し、後でインタラクティブ性を追加する方が簡単なことがよくあります。静的バージョンを構築するには多くのタイピングが必要ですが、考える必要はありません。しかし、インタラクティブ性を追加するには多くの考えが必要で、タイピングはあまり必要ありません。

データモデルをレンダリングするアプリの静的バージョンを構築するには、他のコンポーネントを再利用し、[props](/learn/passing-props-to-a-component)を使用してデータを渡す[コンポーネント](/learn/your-first-component)を構築します。Propsは親から子にデータを渡す方法です。（[state](/learn/state-a-components-memory)の概念に慣れている場合、この静的バージョンを構築するためにstateをまったく使用しないでください。Stateはインタラクティブ性、つまり時間とともに変化するデータのためにのみ予約されています。これはアプリの静的バージョンなので、必要ありません。）

「トップダウン」で構築するか、「ボトムアップ」で構築するかのどちらかです。シンプルな例では、通常、トップダウンの方が簡単で、大規模なプロジェクトではボトムアップの方が簡単です。

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

（このコードが難しそうに見える場合は、まず[クイックスタート](/learn/)を通過してください！）

コンポーネントを構築した後、データモデルをレンダリングする再利用可能なコンポーネントのライブラリができます。これは静的なアプリなので、コンポーネントはJSXを返すだけです。階層のトップにあるコンポーネント（`FilterableProductTable`）は、データモデルをpropとして受け取ります。これは_一方向データフロー_と呼ばれ、データがトップレベルのコンポーネントからツリーの下部にあるコンポーネントに流れるためです。

<Pitfall>

この時点では、state値を使用しないでください。それは次のステップのためです！

</Pitfall>

## ステップ3: UI stateの最小かつ完全な表現を見つける {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

UIをインタラクティブにするには、ユーザーが基礎となるデータモデルを変更できるようにする必要があります。これには*state*を使用します。

stateをアプリが記憶する必要がある最小の変更可能なデータセットと考えてください。stateを構造化するための最も重要な原則は、[DRY（Don't Repeat Yourself）](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)を保つことです。アプリケーションが必要とするstateの絶対最小表現を見つけ、他のすべてをオンデマンドで計算します。たとえば、買い物リストを作成している場合、アイテムをstateの配列として保存できます。リスト内のアイテム数も表示したい場合は、アイテム数を別のstate値として保存しないでください。代わりに、配列の長さを読み取ります。

この例のアプリケーションのすべてのデータの部分を考えてみましょう：

1. 元の製品リスト
2. ユーザーが入力した検索テキスト
3. チェックボックスの値
4. フィルタリングされた製品リスト

これらのうち、どれがstateですか？stateでないものを特定します：

* **時間が経っても変わらない**ですか？そうであれば、それはstateではありません。
* **親からpropsとして渡されますか**？そうであれば、それはstateではありません。
* **既存のstateやpropsに基づいて計算できますか**？そうであれば、それは*絶対に*stateではありません！

残っているものがおそらくstateです。

もう一度それらを1つずつ見てみましょう：

1. 元の製品リストは**propsとして渡されるので、stateではありません。**
2. 検索テキストは時間とともに変化し、何からも計算できないため、stateのようです。
3. チェックボックスの値は時間とともに変化し、何からも計算できないため、stateのようです。
4. フィルタリングされた製品リストは**stateではありません。**元の製品リストを取得し、検索テキストとチェックボックスの値に従ってフィルタリングすることで計算できます。

つまり、検索テキストとチェックボックスの値だけがstateです！よくできました！

<DeepDive>

#### Props vs State {/*props-vs-state*/}

Reactには2種類の「モデル」データがあります：propsとstate。これらは非常に異なります：

* [**Props**は関数に渡す引数のようなものです。](/learn/passing-props-to-a-component) 親コンポーネントが子コンポーネントにデータを渡し、その外観をカスタマイズできます。たとえば、`Form`は`Button`に`color` propを渡すことができます。
* [**State**はコンポーネントのメモリのようなものです。](/learn/state-a-components-memory) コンポーネントが情報を追跡し、インタラクションに応じてそれを変更できるようにします。たとえば、`Button`は`isHovered` stateを追跡するかもしれません。

Propsとstateは異なりますが、一緒に機能します。親コンポーネントはしばしばstateに情報を保持し（変更できるようにするため）、それを子コンポーネントのpropsとして*渡します*。最初の読みでは違いがまだ曖昧に感じるかもしれません。実際に練習することで本当に理解できるようになります！

</DeepDive>

## ステップ4: stateがどこにあるべきかを特定する {/*step-4-identify-where-your-state-should-live*/}

アプリの最小のstateデータを特定した後、そのstateを変更する責任があるコンポーネント、つまりstateを*所有する*コンポーネントを特定する必要があります。Reactは一方向データフローを使用し、データを親から子コンポーネントに渡します。このコンポーネントがどのstateを所有するべきかがすぐには明らかでないかもしれません。この概念に慣れていない場合、これは難しいかもしれませんが、次の手順に従うことで解決できます！

アプリケーションの各stateについて：

1. そのstateに基づいて何かをレンダリングする*すべての*コンポーネントを特定します。
2. それらすべての上位にある最も近い共通の親コンポーネントを見つけます。
3. stateがどこにあるべきかを決定します：
    1. 多くの場合、stateを共通の親に直接置くことができます。
    2. stateを共通の親の上にあるコンポーネントに置くこともできます。
    3. stateを所有するのに適したコンポーネントが見つからない場合は、stateを保持するための新しいコンポーネントを作成し、共通の親コンポーネントの上の階層に追加します。

前のステップで、このアプリケーションには2つのstateがあることがわかりました：検索入力テキストとチェックボックスの値。この例では、常に一緒に表示されるため、同じ場所に置くのが理にかなっています。

では、それらの戦略を実行してみましょう：

1. **stateを使用するコンポーネントを特定する：**
    * `ProductTable`はそのstate（検索テキストとチェックボックスの値）に基づいて製品リストをフィルタリングする必要があります。
    * `SearchBar`はそのstate（検索テキストとチェックボックスの値）を表示する必要があります。
1. **共通の親を見つける：** 両方のコンポーネントが共有する最初の親コンポーネントは`FilterableProductTable`です。
2. **stateがどこにあるべきかを決定する：** フィルターテキストとチェックされたstate値を`FilterableProductTable`に保持します。

したがって、state値は`FilterableProductTable`に存在します。

[`useState()`フック](/reference/react/useState)を使用してコンポーネントにstateを追加します。フックはReactに「フック」する特別な関数です。`FilterableProductTable`の上部に2つのstate変数を追加し、それらの初期stateを指定します：

```js
function Filter```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

次に、`filterText`と`inStockOnly`を`ProductTable`と`SearchBar`にpropsとして渡します：

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

これでアプリケーションの動作が見えてきます。以下のサンドボックスコードで`useState('')`の初期値を`useState('fruit')`に編集してみてください。検索入力テキストとテーブルの両方が更新されるのがわかります：

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

フォームの編集がまだ機能しないことに注意してください。上記のサンドボックスには、その理由を説明するコンソールエラーがあります：

<ConsoleBlock level="error">

`value`プロップを`onChange`ハンドラなしでフォームフィールドに提供しました。これにより、読み取り専用フィールドがレンダリングされます。

</ConsoleBlock>

上記のサンドボックスでは、`ProductTable`と`SearchBar`が`filterText`と`inStockOnly`プロップを読み取り、テーブル、入力、およびチェックボックスをレンダリングします。たとえば、`SearchBar`が入力値をどのように設定するかは次のとおりです：

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

ただし、ユーザーのアクション（入力など）に応答するコードはまだ追加されていません。これが最終ステップです。

## ステップ5: 逆方向のデータフローを追加する {/*step-5-add-inverse-data-flow*/}

現在、アプリはpropsとstateが階層を下って流れることで正しくレンダリングされています。しかし、ユーザー入力に応じてstateを変更するには、データが逆方向に流れる必要があります：階層の深いところにあるフォームコンポーネントが`FilterableProductTable`のstateを更新する必要があります。

Reactはこのデータフローを明示的にしますが、双方向データバインディングよりも少し多くのタイピングが必要です。上記の例で入力を試みたり、チェックボックスをチェックしたりすると、Reactが入力を無視するのがわかります。これは意図的なものです。`<input value={filterText} />`と書くことで、`input`の`value`プロップが常に`FilterableProductTable`から渡された`filterText` stateと等しくなるように設定しました。`filterText` stateが設定されない限り、入力は変更されません。

ユーザーがフォーム入力を変更するたびに、stateがそれらの変更を反映するようにしたいです。stateは`FilterableProductTable`によって所有されているため、`setFilterText`と`setInStockOnly`を呼び出せるのはそれだけです。`SearchBar`が`FilterableProductTable`のstateを更新できるようにするには、これらの関数を`SearchBar`に渡す必要があります：

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar`内で、`onChange`イベントハンドラを追加し、それらから親のstateを設定します：

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

これでアプリケーションが完全に動作します！

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

イベントの処理とstateの更新については、[インタラクティブ性の追加](/learn/adding-interactivity)セクションで詳しく学ぶことができます。

## ここからどこへ行くか {/*where-to-go-from-here*/}

これは、Reactでコンポーネントやアプリケーションを構築する方法についての非常に簡単な紹介でした。今すぐ[Reactプロジェクトを開始](/learn/installation)するか、このチュートリアルで使用されたすべての構文について[さらに深く掘り下げる](/learn/describing-the-ui)ことができます。