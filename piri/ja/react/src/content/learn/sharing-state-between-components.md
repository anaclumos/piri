---
title: コンポーネント間での状態の共有
---

<Intro>

時々、2つのコンポーネントの状態を常に一緒に変えたいことがあります。そのためには、両方のコンポーネントから状態を削除し、最も近い共通の親に移動し、propsを介してそれらに渡します。これは*状態のリフトアップ*として知られており、Reactコードを書く際に最も一般的に行うことの1つです。

</Intro>

<YouWillLearn>

- 状態をリフトアップしてコンポーネント間で共有する方法
- 制御されたコンポーネントと制御されていないコンポーネントとは何か

</YouWillLearn>

## 例による状態のリフトアップ {/*lifting-state-up-by-example*/}

この例では、親の`Accordion`コンポーネントが2つの別々の`Panel`をレンダリングします：

* `Accordion`
  - `Panel`
  - `Panel`

各`Panel`コンポーネントには、その内容が表示されるかどうかを決定するブール値の`isActive`状態があります。

両方のパネルのShowボタンを押してください：

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

1つのパネルのボタンを押しても他のパネルには影響しないことに注意してください。これらは独立しています。

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

最初は、各`Panel`の`isActive`状態は`false`であるため、両方とも折りたたまれた状態で表示されます

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

どちらかの`Panel`のボタンをクリックすると、その`Panel`の`isActive`状態のみが更新されます

</Diagram>

</DiagramGroup>

**しかし、今度は一度に1つのパネルだけが展開されるように変更したいとしましょう。** このデザインでは、2番目のパネルを展開すると最初のパネルが折りたたまれるべきです。どうすればそれを実現できますか？

これらの2つのパネルを調整するためには、3つのステップで状態を親コンポーネントに「リフトアップ」する必要があります：

1. 子コンポーネントから状態を**削除**します。
2. 共通の親からハードコーディングされたデータを**渡します**。
3. 共通の親に状態を**追加**し、イベントハンドラと一緒にそれを渡します。

これにより、`Accordion`コンポーネントが両方の`Panel`を調整し、一度に1つだけ展開できるようになります。

### ステップ1: 子コンポーネントから状態を削除する {/*step-1-remove-state-from-the-child-components*/}

`Panel`の`isActive`の制御を親コンポーネントに渡します。これは、親コンポーネントが`isActive`をpropsとして`Panel`に渡すことを意味します。まず、`Panel`コンポーネントから**この行を削除**します：

```js
const [isActive, setIsActive] = useState(false);
```

そして、`isActive`を`Panel`のpropsリストに追加します：

```js
function Panel({ title, children, isActive }) {
```

これで、`Panel`の親コンポーネントが[propsとして渡すことによって](/learn/passing-props-to-a-component) `isActive`を*制御*できるようになります。逆に、`Panel`コンポーネントは`isActive`の値を*制御できなくなります*--それは親コンポーネント次第です！

### ステップ2: 共通の親からハードコーディングされたデータを渡す {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

状態をリフトアップするためには、調整したい*両方*の子コンポーネントの最も近い共通の親コンポーネントを見つける必要があります：

* `Accordion` *(最も近い共通の親)*
  - `Panel`
  - `Panel`

この例では、それは`Accordion`コンポーネントです。両方のパネルの上にあり、そのpropsを制御できるため、どのパネルが現在アクティブであるかの「真実の源」になります。`Accordion`コンポーネントが両方のパネルに`isActive`のハードコーディングされた値（例えば、`true`）を渡すようにします：

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`Accordion`コンポーネントのハードコーディングされた`isActive`値を編集して、画面上の結果を確認してください。

### ステップ3: 共通の親に状態を追加する {/*step-3-add-state-to-the-common-parent*/}

状態をリフトアップすると、保存している状態の性質が変わることがよくあります。

この場合、一度に1つのパネルだけがアクティブであるべきです。これは、`Accordion`共通の親コンポーネントが*どの*パネルがアクティブであるかを追跡する必要があることを意味します。`boolean`値の代わりに、状態変数としてアクティブな`Panel`のインデックスとして数値を使用できます：

```js
const [activeIndex, setActiveIndex] = useState(0);
```

`activeIndex`が`0`のとき、最初のパネルがアクティブであり、`1`のときは2番目のパネルがアクティブです。

どちらの`Panel`の「Show」ボタンをクリックしても、`Accordion`のアクティブインデックスを変更する必要があります。`Panel`は`Accordion`内で定義されているため、直接`activeIndex`状態を設定することはできません。`Accordion`コンポーネントは、[イベントハンドラをpropsとして渡すことによって](/learn/responding-to-events#passing-event-handlers-as-props) `Panel`コンポーネントがその状態を変更できるように*明示的に許可*する必要があります：

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`Panel`内の`<button>`は、クリックイベントハンドラとして`onShow`プロップを使用します：

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

これで状態のリフトアップが完了しました！ 状態を共通の親コンポーネントに移動することで、2つのパネルを調整できるようになりました。アクティブなインデックスを使用することで、2つの「表示されている」フラグの代わりに、一度に1つのパネルだけがアクティブになるようにしました。そして、イベントハンドラを子に渡すことで、子が親の状態を変更できるようにしました。

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

最初は、`Accordion`の`activeIndex`が`0`であるため、最初の`Panel`が`isActive = true`を受け取ります

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

`Accordion`の`activeIndex`状態が`1`に変わると、2番目の`Panel`が`isActive = true`を受け取ります

</Diagram>

</DiagramGroup>

<DeepDive>

#### 制御されたコンポーネントと制御されていないコンポーネント {/*controlled-and-uncontrolled-components*/}

ローカル状態を持つコンポーネントを「制御されていない」と呼ぶことが一般的です。例えば、`isActive`状態変数を持つ元の`Panel`コンポーネントは、親がパネルがアクティブかどうかに影響を与えることができないため、制御されていません。

対照的に、重要な情報がローカル状態ではなくpropsによって駆動される場合、コンポーネントは「制御されている」と言うことができます。これにより、親コンポーネントがその動作を完全に指定できるようになります。`isActive`プロップを持つ最終的な`Panel`コンポーネントは、`Accordion`コンポーネントによって制御されています。

制御されていないコンポーネントは、親の中で使用するのが簡単です。なぜなら、設定が少なくて済むからです。しかし、これらを一緒に調整したい場合には柔軟性が低くなります。制御されたコンポーネントは最大限の柔軟性を持ちますが、親コンポーネントがpropsで完全に設定する必要があります。

実際には、「制御された」と「制御されていない」は厳密な技術用語ではありません--各コンポーネントは通常、ローカル状態とpropsの両方の混合を持っています。しかし、これはコンポーネントがどのように設計されているか、どのような機能を提供するかについて話すための有用な方法です。

コンポーネントを書くときには、その中のどの情報が（propsを介して）制御されるべきか、どの情報が（状態を介して）制御されないべきかを考慮してください。しかし、後で考えを変えてリファクタリングすることもできます。

</DeepDive>

## 各状態の単一の真実の源 {/*a-single-source-of-truth-for-each-state*/}

Reactアプリケーションでは、多くのコンポーネントが独自の状態を持ちます。いくつかの状態は、入力のようにツリーの下部に近いリーフコンポーネントに「住む」ことがあります。他の状態は、アプリの上部に近い場所に「住む」ことがあります。例えば、クライアントサイドのルーティングライブラリは通常、現在のルートをReactの状態に保存し、propsを介してそれを渡します！

**各ユニークな状態について、その状態を「所有」するコンポーネントを選択します。** この原則は、["単一の真実の源"](https://en.wikipedia.org/wiki/Single_source_of_truth)としても知られています。これは、すべての状態が1つの場所にあることを意味するのではなく、_各_状態について、その情報を保持する_特定の_コンポーネントがあることを意味します。共有状態をコンポーネント間で重複させるのではなく、共通の親に*リフトアップ*し、それを必要とする子に*渡します*。

アプリは作業を進めるうちに変わります。各状態が「住む」場所をまだ見つけている間に、状態を下に移動したり、再び上に移動したりすることは一般的です。これはすべてプロセスの一部です！

いくつかのコンポーネントを使って実際にどのように感じるかを確認するには、[Thinking in React](/learn/thinking-in-react)を読んでください。

<Recap>

* 2つのコンポーネントを調整したい場合は、その状態を共通の親に移動します。
* 次に、共通の親からpropsを介して情報を渡します。
* 最後に、イベントハンドラを渡して、子が親の状態を変更できるようにします。
* コンポーネントを「制御された」（propsによって駆動される）または「制御されていない」（状態によって駆動される）と考えることは有用です。

</Recap>

<Challenges>

#### 同期された入力 {/*synced-inputs*/}

これらの2つの入力は独立しています。編集すると、一方の入力が他方の入力と同じテキストで更新されるように同期させてください。

<Hint>

状態を親コンポーネントにリフトアップする必要があります。

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

`text`状態変数を親コンポーネントに移動し、`handleChange`ハンドラも一緒に移動します。次に、それらを両方の`Input`コンポーネントにpropsとして渡します。これにより、同期が保たれます。

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### リストのフィルタリング {/*filtering-a-list*/}

この例では、`SearchBar`にはテキスト入力を制御する`query`状態があります。親の`FilterableList`コンポーネントはアイテムの`List`を表示しますが、検索クエリを考慮していません。

`filterItems(foods, query)`関数を使用して、検索クエリに従ってリストをフィルタリングします。変更をテストするには、入力に「s」と入力して、リストが「Sushi」、「Shish kebab」、「Dim sum」に絞り込まれることを確認してください。

`filterItems`はすでに実装されており、インポートされているため、自分で書く必要はありません！

<Hint>

`query`状態と`handleChange`ハンドラを`SearchBar`から削除し、それらを`FilterableList`に移動します。次に、それらを`SearchBar`に`query`と`onChange`のpropsとして渡します。

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

`query`状態を`FilterableList`コンポーネントにリフトアップします。`filterItems(foods, query)`を呼び出してフィルタリングされたリストを取得し、それを`List`に渡します。これで、クエリ入力の変更がリストに反映されます：

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>