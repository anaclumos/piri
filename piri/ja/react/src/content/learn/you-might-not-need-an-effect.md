---
title: エフェクトは必要ないかもしれません
---

<Intro>

エフェクトはReactのパラダイムからの脱出口です。これにより、Reactの外に「ステップアウト」して、非Reactウィジェット、ネットワーク、またはブラウザのDOMなどの外部システムとコンポーネントを同期させることができます。外部システムが関与していない場合（例えば、いくつかのpropsやstateが変わったときにコンポーネントのstateを更新したい場合）、エフェクトは必要ありません。不要なエフェクトを削除することで、コードが追いやすくなり、実行速度が速くなり、エラーが少なくなります。

</Intro>

<YouWillLearn>

* コンポーネントから不要なエフェクトを削除する理由と方法
* エフェクトを使わずに高価な計算をキャッシュする方法
* エフェクトを使わずにコンポーネントのstateをリセットおよび調整する方法
* イベントハンドラ間でロジックを共有する方法
* どのロジックをイベントハンドラに移動すべきか
* 親コンポーネントに変更を通知する方法

</YouWillLearn>

## 不要なエフェクトを削除する方法 {/*how-to-remove-unnecessary-effects*/}

エフェクトが不要な一般的なケースは2つあります：

* **レンダリングのためにデータを変換するためにエフェクトは不要です。** 例えば、リストを表示する前にフィルタリングしたいとします。この場合、リストが変更されたときにstate変数を更新するエフェクトを書きたくなるかもしれません。しかし、これは非効率的です。stateを更新すると、Reactはまずコンポーネント関数を呼び出して画面に表示する内容を計算します。その後、Reactはこれらの変更をDOMに「コミット」し、画面を更新します。そしてReactはエフェクトを実行します。エフェクトがstateを即座に更新する場合、全プロセスが最初から再開されます！不要なレンダリングパスを避けるために、すべてのデータをコンポーネントのトップレベルで変換します。このコードはpropsやstateが変更されるたびに自動的に再実行されます。
* **ユーザーイベントを処理するためにエフェクトは不要です。** 例えば、ユーザーが製品を購入したときに`/api/buy` POSTリクエストを送信し、通知を表示したいとします。購入ボタンのクリックイベントハンドラでは、何が起こったかを正確に知っています。エフェクトが実行される時点では、ユーザーが何をしたか（例えば、どのボタンがクリックされたか）を知ることはできません。これが、通常、ユーザーイベントを対応するイベントハンドラで処理する理由です。

外部システムと[同期する](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)ためにはエフェクトが必要です。例えば、jQueryウィジェットをReactのstateと同期させるエフェクトを書くことができます。また、エフェクトを使用してデータを取得することもできます。例えば、現在の検索クエリと検索結果を同期させることができます。最新の[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)は、コンポーネント内でエフェクトを直接書くよりも効率的な組み込みのデータ取得メカニズムを提供していることを覚えておいてください。

正しい直感を得るために、いくつかの一般的な具体例を見てみましょう！

### propsやstateに基づいてstateを更新する {/*updating-state-based-on-props-or-state*/}

例えば、`firstName`と`lastName`という2つのstate変数を持つコンポーネントがあるとします。これらを連結して`fullName`を計算したいとします。さらに、`firstName`や`lastName`が変更されるたびに`fullName`を更新したいとします。最初の直感では、`fullName`というstate変数を追加し、エフェクトで更新することを考えるかもしれません：

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 避けるべき: 冗長なstateと不要なエフェクト
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

これは必要以上に複雑です。また、非効率的です：`fullName`の古い値で全レンダリングパスを実行し、その後すぐに更新された値で再レンダリングします。state変数とエフェクトを削除します：

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 良い: レンダリング中に計算される
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**既存のpropsやstateから計算できるものは、[stateに入れないでください。](/learn/choosing-the-state-structure#avoid-redundant-state) 代わりに、レンダリング中に計算します。** これにより、コードが速くなり（余分な「カスケード」更新を避ける）、シンプルになり（コードが減り）、エラーが少なくなります（異なるstate変数が同期しなくなるバグを避ける）。このアプローチが新しいと感じる場合は、[Thinking in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)がstateに何を入れるべきかを説明しています。

### 高価な計算のキャッシュ {/*caching-expensive-calculations*/}

このコンポーネントは、propsで受け取った`todos`を`filter`プロップに従ってフィルタリングすることで`visibleTodos`を計算します。結果をstateに保存し、エフェクトから更新したくなるかもしれません：

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 避けるべき: 冗長なstateと不要なエフェクト
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

前の例と同様に、これは不要で非効率的です。まず、stateとエフェクトを削除します：

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ getFilteredTodos()が遅くない場合はこれで問題ありません。
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

通常、このコードで問題ありません。しかし、`getFilteredTodos()`が遅い場合や`todos`が多い場合、`newTodo`のような無関係なstate変数が変更されたときに`getFilteredTodos()`を再計算したくないでしょう。

高価な計算をキャッシュ（または["メモ化"](https://en.wikipedia.org/wiki/Memoization)）するには、[`useMemo`](/reference/react/useMemo)フックでラップします：

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ todosまたはfilterが変更されない限り再実行されません
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

または、1行で書くと：

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ todosまたはfilterが変更されない限りgetFilteredTodos()は再実行されません
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**これは、`todos`または`filter`が変更されない限り、内部関数を再実行しないようにReactに指示します。** Reactは初回レンダリング時に`getFilteredTodos()`の戻り値を記憶します。次のレンダリング時には、`todos`や`filter`が異なるかどうかを確認します。前回と同じであれば、`useMemo`は最後に保存した結果を返します。しかし、異なる場合は、Reactは内部関数を再度呼び出し、その結果を保存します。

[`useMemo`](/reference/react/useMemo)でラップした関数はレンダリング中に実行されるため、これは[純粋な計算](/learn/keeping-components-pure)にのみ適用されます。

<DeepDive>

#### 計算が高価かどうかを判断する方法 {/*how-to-tell-if-a-calculation-is-expensive*/}

一般的に、数千のオブジェクトを作成またはループしていない限り、高価ではない可能性が高いです。自信を持ちたい場合は、コードの一部に費やされた時間を測定するためにコンソールログを追加できます：

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

測定したい操作を実行します（例えば、入力に入力する）。その後、コンソールに`filter array: 0.15ms`のようなログが表示されます。全体のログ時間が（例えば、`1ms`以上）に達する場合、その計算をメモ化することが理にかなっているかもしれません。実験として、その計算を`useMemo`でラップして、その操作の合計ログ時間が減少したかどうかを確認できます：

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // todosとfilterが変更されていない場合はスキップされます
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo`は*最初の*レンダリングを速くすることはありません。更新時の不要な作業をスキップするのに役立ちます。

あなたのマシンはユーザーのマシンよりも速い可能性が高いので、人工的な遅延を使用してパフォーマンスをテストするのが良いアイデアです。例えば、Chromeは[CPUスロットリング](https://developer.chrome.com/blog/new-in-devtools-61/#throttling)オプションを提供しています。

また、開発中のパフォーマンスを測定しても最も正確な結果は得られません（例えば、[Strict Mode](/reference/react/StrictMode)がオンの場合、各コンポーネントは一度ではなく二度レンダリングされます）。最も正確なタイミングを得るためには、アプリをプロダクション用にビルドし、ユーザーと同じようなデバイスでテストします。

</DeepDive>

### プロップが変更されたときにすべてのstateをリセットする {/*resetting-all-state-when-a-prop-changes*/}

この`ProfilePage`コンポーネントは`userId`プロップを受け取ります。ページにはコメント入力が含まれており、その値を保持するために`comment` state変数を使用します。ある日、問題に気付きます：あるプロフィールから別のプロフィールに移動すると、`comment` stateがリセットされません。その結果、誤って別のユーザーのプロフィールにコメントを投稿するのが簡単になります。この問題を修正するために、`userId`が変更されるたびに`comment` state変数をクリアしたいとします：

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 避けるべき: プロップ変更時にエフェクトでstateをリセットする
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

これは非効率的です。`ProfilePage`とその子コンポーネントはまず古い値でレンダリングされ、その後再レンダリングされます。また、`ProfilePage`内にstateを持つ*すべての*コンポーネントでこれを行う必要があるため、複雑です。例えば、コメントUIがネストされている場合、ネストされたコメントstateもクリアしたいでしょう。

代わりに、各ユーザーのプロフィールが概念的に_異なる_プロフィールであることをReactに伝えるために、明示的なキーを与えることができます。コンポーネントを2つに分割し、外部コンポーネントから内部コンポーネントに`key`属性を渡します：

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ これと以下の他のstateはキー変更時に自動的にリセットされます
  const [comment, setComment] = useState('');
  // ...
}
```

通常、Reactは同じコンポーネントが同じ場所にレンダリングされるとstateを保持します。**`userId`を`Profile`コンポーネントにキーとして渡すことで、異なる`userId`を持つ2つの`Profile`コンポーネントを、stateを共有しない異なるコンポーネントとして扱うようにReactに指示しています。** キー（`userId`に設定したもの）が変更されるたびに、Reactは`Profile`コンポーネントとそのすべての子コンポーネントのDOMを再作成し、[stateをリセット](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)します。これで、プロフィール間を移動するときにコメントフィールドが自動的にクリアされます。

この例では、外部`ProfilePage`コンポーネントのみがエクスポートされ、プロジェクト内の他のファイルから見えるようになっています。`ProfilePage`をレンダリングするコンポーネントは、キーを渡す必要はありません：`userId`を通常のプロップとして渡します。`ProfilePage`が内部`Profile`コンポーネントにキーとして渡すのは実装の詳細です。

### プロップが変更されたときに一部のstateを調整する {/*adjusting-some-state-when-a-prop-changes*/}

時々、プロップの変更時にstateの一部をリセットまたは調整したいことがありますが、すべてではありません。

この`List`コンポーネントは`items`というプロップを受け取り、`selection` state変数に選択されたアイテムを保持します。`items`プロップが異なる配列を受け取るたびに`selection`を`null`にリセットしたいとします：

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 避けるべき: プロップ変更時にエフェクトでstateを調整する
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

これも理想的ではありません。`items`が変更されるたびに、`List`とその子コンポーネントは最初に古い`selection`値でレンダリングされます。その後、ReactはDOMを更新し、エフェクトを実行します。最後に、`setSelection(null)`呼び出しが`List`とその子コンポーネントを再レンダリングし、このプロセス全体を再開します。

エフェクトを削除し、代わりにレンダリング中にstateを直接調整します：

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // より良い: レンダリング中にstateを調整する
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[前のレンダリングからの情報を保存する](/reference/react/useState#storing-information-from-previous-renders)ことは理解しにくいかもしれませんが、エフェクトで同じstateを更新
するよりも良いです。上記の例では、`setSelection`はレンダリング中に直接呼び出されます。Reactは`return`文で終了した直後に`List`を再レンダリングします。Reactはまだ`List`の子コンポーネントをレンダリングしていないか、DOMを更新していないため、`List`の子コンポーネントが古い`selection`値をレンダリングするのをスキップできます。

レンダリング中にコンポーネントを更新すると、Reactは返されたJSXを破棄し、すぐにレンダリングを再試行します。非常に遅いカスケード再試行を避けるために、Reactはレンダリング中に*同じ*コンポーネントのstateのみを更新することを許可します。レンダリング中に別のコンポーネントのstateを更新すると、エラーが表示されます。`items !== prevItems`のような条件はループを避けるために必要です。このようにstateを調整することはできますが、他の副作用（DOMの変更やタイムアウトの設定など）はイベントハンドラやエフェクトに残して[コンポーネントを純粋に保つ](/learn/keeping-components-pure)べきです。

**このパターンはエフェクトよりも効率的ですが、ほとんどのコンポーネントには必要ありません。** どのように行うにしても、プロップや他のstateに基づいてstateを調整することは、データフローを理解しにくくし、デバッグしにくくします。常に、[キーで全stateをリセットできるか](#resetting-all-state-when-a-prop-changes)または[レンダリング中にすべてを計算できるか](#updating-state-based-on-props-or-state)を確認してください。例えば、選択された*アイテム*を保存してリセットする代わりに、選択された*アイテムID*を保存できます：

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ 最良: レンダリング中にすべてを計算する
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

これでstateを「調整」する必要はまったくありません。選択されたIDを持つアイテムがリストにある場合、それは選択されたままです。ない場合、レンダリング中に計算された`selection`は一致するアイテムが見つからなかったため`null`になります。この動作は異なりますが、`items`のほとんどの変更が選択を保持するため、より良いと言えます。

### イベントハンドラ間でロジックを共有する {/*sharing-logic-between-event-handlers*/}

例えば、製品ページに2つのボタン（購入とチェックアウト）があり、どちらもその製品を購入できるとします。ユーザーが製品をカートに入れるたびに通知を表示したいとします。両方のボタンのクリックハンドラで`showNotification()`を呼び出すのは繰り返しのように感じるため、このロジックをエフェクトに配置したくなるかもしれません：

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 避けるべき: イベント固有のロジックをエフェクト内に配置する
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

このエフェクトは不要です。また、バグを引き起こす可能性が高いです。例えば、アプリがページのリロード間でショッピングカートを「記憶」する場合、製品を一度カートに追加してページをリフレッシュすると、通知が再び表示されます。その製品のページをリフレッシュするたびに通知が表示され続けます。これは、ページの読み込み時に`product.isInCart`がすでに`true`であるため、上記のエフェクトが`showNotification()`を呼び出すためです。

**コードをエフェクトに置くべきかイベントハンドラに置くべきか迷ったときは、このコードが実行される*理由*を自問してください。エフェクトはコンポーネントがユーザーに表示された*ために*実行されるべきコードのみに使用します。** この例では、通知はユーザーが*ボタンを押した*ために表示されるべきです。ページが表示されたためではありません！エフェクトを削除し、共有ロジックを両方のイベントハンドラから呼び出される関数に入れます：

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ 良い: イベント固有のロジックはイベントハンドラから呼び出される
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

これにより、不要なエフェクトが削除され、バグが修正されます。

### POSTリクエストの送信 {/*sending-a-post-request*/}

この`Form`コンポーネントは2種類のPOSTリクエストを送信します。マウント時にアナリティクスイベントを送信します。フォームに入力して送信ボタンをクリックすると、`/api/register`エンドポイントにPOSTリクエストが送信されます：

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 良い: このロジックはコンポーネントが表示されたために実行されるべき
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 避けるべき: イベント固有のロジックをエフェクト内に配置する
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

前の例と同じ基準を適用します。

アナリティクスのPOSTリクエストはエフェクトに残すべきです。これは、フォームが表示された*ために*アナリティクスイベントを送信する理由があるからです。（開発中に2回発火しますが、[こちら](/learn/synchronizing-with-effects#sending-analytics)を参照してください。）

しかし、`/api/register`のPOSTリクエストはフォームが*表示された*ために発生するものではありません。特定の瞬間にのみリクエストを送信したいのです：ユーザーがボタンを押したときです。それは*その特定のインタラクション*でのみ発生するべきです。2つ目のエフェクトを削除し、そのPOSTリクエストをイベントハンドラに移動します：

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 良い: このロジックはコンポーネントが表示されたために実行される
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ 良い: イベント固有のロジックはイベントハンドラにある
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

ロジックをイベントハンドラに置くべきかエフェクトに置くべきかを選択する際の主な質問は、ユーザーの視点から見た*どのようなロジック*であるかです。このロジックが特定のインタラクションによって引き起こされる場合は、イベントハンドラに保持します。ユーザーがコンポーネントを画面で*見た*ために引き起こされる場合は、エフェクトに保持します。

### 計算の連鎖 {/*chains-of-computations*/}

時々、エフェクトを連鎖させて、他のstateに基づいてstateの一部を調整することを考えるかもしれません：

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 避けるべき: stateを調整するためにエフェクトを連鎖させる
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

このコードには2つの問題があります。

1つ目の問題は非常に非効率的であることです：コンポーネント（およびその子）は、連鎖の各`set`呼び出しの間に再レンダリングする必要があります。上記の例では、最悪の場合（`setCard` → レンダリング → `setGoldCardCount` → レンダリング → `setRound` → レンダリング → `setIsGameOver` → レンダリング）で、ツリーの3つの不要な再レンダリングがあります。

遅くないとしても、コードが進化するにつれて、書いた「連鎖」が新しい要件に合わないケースに遭遇します。ゲームの履歴をステップスルーする方法を追加することを想像してください。各state変数を過去の値に更新することで行います。しかし、`card` stateを過去の値に設定すると、エフェクトの連鎖が再びトリガーされ、表示しているデータが変更されます。このようなコードはしばしば堅固で脆弱です。

この場合、レンダリング中に計算できるものを計算し、イベントハンドラでstateを調整する方が良いです：

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ レンダリング中に計算できるものを計算する
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ イベントハンドラで次のstateをすべて計算する
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

これははるかに効率的です。また、ゲーム履歴を表示する方法を実装する場合、エフェクトの連鎖をトリガーせずに各state変数を過去のムーブに設定できるようになります。複数のイベントハンドラ間でロジックを再利用する必要がある場合は、[関数を抽出](#sharing-logic-between-event-handlers)してそれらのハンドラから呼び出すことができます。

イベントハンドラ内では、[stateはスナップショットのように動作する](/learn/state-as-a-snapshot)ことを覚えておいてください。例えば、`setRound(round + 1)`を呼び出した後でも、`round`変数はユーザーがボタンをクリックした時点の値を反映します。計算に次の値を使用する必要がある場合は、`const nextRound = round + 1`のように手動で定義します。

場合によっては、イベントハンドラ内で次のstateを直接計算できないことがあります。例えば、次のドロップダウンのオプションが前のドロップダウンの選択値に依存する複数のドロップダウンを持つフォームを想像してください。その場合、ネットワークと同期しているため、エフェクトの連鎖が適切です。

### アプリケーションの初期化 {/*initializing-the-application*/}

アプリがロードされたときに一度だけ実行されるべきロジックがあります。

トップレベルのコンポーネントにエフェクトを配置したくなるかもしれません：

```js {2-6}
function App() {
  // 🔴 避けるべき: 一度だけ実行されるべきロジックを持つエフェクト
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

しかし、すぐに[開発中に2回実行される](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)ことに気付くでしょう。これにより問題が発生する可能性があります。例えば、関数が2回呼び出されるように設計されていないため、認証トークンが無効になるかもしれません。一般的に、コンポーネントは再マウントに対して堅牢であるべきです。これにはトップレベルの`App`コンポーネントも含まれます。

実際にはプロダクションで再マウントされることはないかもしれませんが、すべてのコンポーネントで同じ制約を守ることで、コードの移動や再利用が容易になります。*アプリのロードごとに一度だけ*実行されるべきロジックがある場合は、すでに実行されたかどうかを追跡するトップレベルの変数を追加します：

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ アプリのロードごとに一度だけ実行される
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

また、アプリがレンダリングされる前にモジュールの初期化中に実行することもできます：

```js {1,5}
if (typeof window !== 'undefined') { // ブラウザで実行されているかどうかを確認します。
   // ✅ アプリのロードごとに一度だけ実行される
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

トップレベルのコードはコンポーネントがインポートされたときに一度実行されます。たとえレンダリングされなくてもです。任意のコンポーネントをインポートするときに遅延や驚くべき動作を避けるために、このパターンを過度に使用しないでください。アプリ全体の初期化ロジックは`App.js`のようなルートコンポーネントモジュールやアプリケーションのエントリーポイントに限定してください。

### 親コンポーネントにstateの変更を通知する {/*notifying-parent-components-about-state-changes*/}

例えば、内部`isOn` stateを持つ`Toggle`コンポーネントがあり、`true`または`false`のいずれかになります。トグルする方法はいくつかあります（クリックやドラッグ）。`Toggle`の内部stateが変更されるたびに親コンポーネントに通知したいので、`onChange`イベントを公開し、エフェクトから呼び出します：

```js {4-7}
function Toggle({ onChange }) {
  const [isOn,
setIsOn] = useState(false);

  // 🔴 避けるべき: onChangeハンドラが遅れて実行される
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

前述のように、これは理想的ではありません。`Toggle`は最初にstateを更新し、Reactは画面を更新します。その後、Reactはエフェクトを実行し、親コンポーネントから渡された`onChange`関数を呼び出します。これで親コンポーネントは自身のstateを更新し、もう一度レンダリングパスを開始します。すべてを一度に行う方が良いでしょう。

エフェクトを削除し、イベントハンドラ内で*両方のコンポーネントのstateを更新*します：

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ 良い: イベントが引き起こしたすべての更新を実行する
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

このアプローチでは、`Toggle`コンポーネントとその親コンポーネントの両方がイベント中にstateを更新します。Reactは異なるコンポーネントからの更新を[バッチ処理](/learn/queueing-a-series-of-state-updates)するため、レンダリングパスは1回だけになります。

また、stateを完全に削除し、親コンポーネントから`isOn`を受け取ることもできます：

```js {1,2}
// ✅ これも良い: コンポーネントは親によって完全に制御される
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["stateのリフトアップ"](/learn/sharing-state-between-components)により、親コンポーネントが自身のstateをトグルすることで`Toggle`を完全に制御できます。これにより、親コンポーネントはより多くのロジックを含むことになりますが、全体的に心配するstateが少なくなります。異なるコンポーネントで2つの異なるstate変数を同期しようとするたびに、stateのリフトアップを検討してください！

### 親にデータを渡す {/*passing-data-to-the-parent*/}

この`Child`コンポーネントはデータを取得し、そのデータをエフェクトで`Parent`コンポーネントに渡します：

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 避けるべき: エフェクトで親にデータを渡す
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

Reactでは、データは親コンポーネントから子コンポーネントに流れます。画面に何か問題がある場合、情報がどこから来ているのかを追跡するために、コンポーネントチェーンを上にたどって、どのコンポーネントが間違ったプロップを渡しているか、または間違ったstateを持っているかを見つけることができます。子コンポーネントがエフェクトで親コンポーネントのstateを更新すると、データフローが非常に追跡しにくくなります。子コンポーネントと親コンポーネントの両方が同じデータを必要とする場合、親コンポーネントがそのデータを取得し、*下に渡す*ようにします：

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ 良い: データを子に渡す
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

これはシンプルで、データフローを予測可能に保ちます：データは親から子に流れます。

### 外部ストアへのサブスクライブ {/*subscribing-to-an-external-store*/}

時々、コンポーネントはReactのstateの外部のデータにサブスクライブする必要があります。このデータはサードパーティライブラリや組み込みのブラウザAPIからのものかもしれません。このデータはReactの知識なしに変更される可能性があるため、コンポーネントを手動でサブスクライブする必要があります。これはエフェクトでよく行われます。例えば：

```js {2-17}
function useOnlineStatus() {
  // 理想的ではない: エフェクトでの手動ストアサブスクライブ
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

ここでは、コンポーネントは外部データストア（この場合はブラウザの`navigator.onLine` API）にサブスクライブしています。このAPIはサーバー上には存在しないため（初期HTMLには使用できません）、最初はstateが`true`に設定されています。ブラウザでそのデータストアの値が変更されるたびに、コンポーネントはstateを更新します。

エフェクトを使用するのが一般的ですが、Reactには外部ストアにサブスクライブするための専用のフックがあり、そちらの方が推奨されます。エフェクトを削除し、[`useSyncExternalStore`](/reference/react/useSyncExternalStore)の呼び出しに置き換えます：

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ 良い: 組み込みフックで外部ストアにサブスクライブする
  return useSyncExternalStore(
    subscribe, // 同じ関数を渡す限り、Reactは再サブスクライブしません
    () => navigator.onLine, // クライアントで値を取得する方法
    () => true // サーバーで値を取得する方法
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

このアプローチは、エフェクトでミュータブルデータをReact stateに手動で同期するよりもエラーが少ないです。通常、上記の`useOnlineStatus()`のようなカスタムフックを書いて、個々のコンポーネントでこのコードを繰り返す必要がないようにします。[Reactコンポーネントから外部ストアにサブスクライブする方法について詳しく読む。](/reference/react/useSyncExternalStore)

### データの取得 {/*fetching-data*/}

多くのアプリはデータ取得を開始するためにエフェクトを使用します。データ取得エフェクトを書くことは非常に一般的です：

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 避けるべき: クリーンアップロジックのないデータ取得
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

このデータ取得をイベントハンドラに移動する必要は*ありません*。

これは以前の例と矛盾しているように見えるかもしれませんが、考えてみてください。*タイピングイベント*が取得の主な理由ではありません。検索入力はURLから事前に入力されることが多く、ユーザーは入力に触れずに戻るや進むをナビゲートするかもしれません。

`page`や`query`がどこから来るかは関係ありません。このコンポーネントが表示されている間、現在の`page`と`query`のデータをネットワークから取得して`results`を[同期](/learn/synchronizing-with-effects)させたいのです。これがエフェクトである理由です。

しかし、上記のコードにはバグがあります。例えば、`"hello"`と速く入力するとします。すると、`query`は`"h"`、`"he"`、`"hel"`、`"hell"`、`"hello"`に変わります。これにより、別々の取得が開始されますが、応答が到着する順序については保証がありません。例えば、`"hell"`の応答が`"hello"`の応答*後*に到着するかもしれません。最後に`setResults()`を呼び出すため、間違った検索結果が表示されます。これは["競合状態"](https://en.wikipedia.org/wiki/Race_condition)と呼ばれます：2つの異なるリクエストが「競争」し、予想外の順序で到着しました。

**競合状態を修正するには、クリーンアップ関数を追加して古い応答を無視する必要があります：**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

これにより、エフェクトがデータを取得するとき、最後にリクエストされたもの以外のすべての応答が無視されることが保証されます。

競合状態の処理はデータ取得の実装の難しさの一部に過ぎません。応答をキャッシュする方法（ユーザーが戻るをクリックしたときに前の画面がすぐに表示されるようにする）、サーバーでデータを取得する方法（初期サーバーレンダリングされたHTMLがスピナーではなく取得されたコンテンツを含むようにする）、ネットワークウォーターフォールを避ける方法（子がすべての親を待たずにデータを取得できるようにする）なども考慮する必要があります。

**これらの問題はReactに限らず、どのUIライブラリにも適用されます。これらを解決するのは簡単ではないため、最新の[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)はエフェクトでデータを取得するよりも効率的な組み込みのデータ取得メカニズムを提供しています。**

フレームワークを使用していない（または独自のものを構築したくない）場合でも、エフェクトからのデータ取得をより使いやすくするために、次の例のようにカスタムフックに取得ロジックを抽出することを検討してください：

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

エラーハンドリングやコンテンツがロード中かどうかを追跡するロジックも追加したいでしょう。このようなフックを自分で構築することもできますし、Reactエコシステムで既に利用可能な多くのソリューションの1つを使用することもできます。**これだけではフレームワークの組み込みデータ取得メカニズムを使用するほど効率的ではありませんが、カスタムフックにデータ取得ロジックを移動することで、後で効率的なデータ取得戦略を採用しやすくなります。**

一般的に、エフェクトを書く必要がある場合は、`useData`のようなより宣言的で目的に特化したAPIを持つカスタムフックに機能を抽出できるかどうかを常に注意してください。コンポーネント内の生の`useEffect`呼び出しが少ないほど、アプリケーションの保守が容易になります。

<Recap>

- レンダリング中に何かを計算できる場合、エフェクトは不要です。
- 高価な計算をキャッシュするには、`useEffect`の代わりに`useMemo`を追加します。
- コンポーネントツリー全体のstateをリセットするには、異なる`key`を渡します。
- プロップの変更に応じて特定のstateをリセットするには、レンダリング中に設定します。
- コンポーネントが*表示された*ために実行されるコードはエフェクトに、残りはイベントに置きます。
- 複数のコンポーネントのstateを更新する必要がある場合、単一のイベント中に行う方が良いです。
- 異なるコンポーネントのstate変数を同期しようとするたびに、stateのリフトアップを検討してください。
- エフェクトでデータを取得できますが、競合状態を避けるためにクリーンアップを実装する必要があります。

</Recap>

<Challenges>

#### エフェクトなしでデータを変換する {/*transform-data-without-effects*/}

以下の`TodoList`は、todoのリストを表示します。「アクティブなtodoのみを表示」チェックボックスがオンになっている場合、完了したtodoはリストに表示されません。表示されているtodoに関係なく、フッターにはまだ完了していないtodoの数が表示されます。

このコンポーネントを簡素化し、すべての不要なstateとエフェクトを削除してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd
(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

レンダリング中に何かを計算できる場合、stateやそれを更新するエフェクトは不要です。

</Hint>

<Solution>

この例では、`todos`のリストとチェックボックスがオンかどうかを表す`showActive` state変数の2つの重要なstateだけが必要です。他のすべてのstate変数は[冗長](/learn/choosing-the-state-structure#avoid-redundant-state)であり、代わりにレンダリング中に計算できます。これには、周囲のJSXに直接移動できる`footer`も含まれます。

最終的な結果は次のようになります：

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### エフェクトなしで計算をキャッシュする {/*cache-a-calculation-without-effects*/}

この例では、todoをフィルタリングする関数`getVisibleTodos()`が別に抽出されています。この関数には`console.log()`呼び出しが含まれており、呼び出されたときに気付くことができます。「アクティブなtodoのみを表示」を切り替えると、`getVisibleTodos()`が再実行されることに気付くでしょう。これは、表示されるtodoが切り替えられるため、予想される動作です。

あなたのタスクは、`TodoList`コンポーネント内で`visibleTodos`リストを再計算するエフェクトを削除することです。ただし、入力に入力するときに`getVisibleTodos()`が再実行されないようにする必要があります。

<Hint>

1つの解決策は、`useMemo`呼び出しを追加して表示されるtodoをキャッシュすることです。もう1つの、あまり明白でない解決策もあります。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

state変数とエフェクトを削除し、代わりに`getVisibleTodos()`の呼び出し結果をキャッシュするために`useMemo`呼び出しを追加します：

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

この変更により、`getVisibleTodos()`は`todos`または`showActive`が変更された場合にのみ呼び出されます。入力に入力することは`text` state変数のみを変更するため、`getVisibleTodos()`の呼び出しをトリガーしません。

`useMemo`を使用しない別の解決策もあります。`text` state変数がtodoリストに影響を与えることはないため、`NewTodo`フォームを別のコンポーネントに抽出し、その中に`text` state変数を移動します：

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

このアプローチも要件を満たしています。入力に入力すると、`text` state変数のみが更新されます。`text` state変数は子コンポーネント`NewTodo`内にあるため、親コンポーネント`TodoList`は再レンダリングされません。これが`getVisibleTodos()`が入力時に呼び出されない理由です。（他の理由で`TodoList`が再レンダリングされる場合は、`getVisibleTodos()`が呼び出されます。）

</Solution>

#### エフェクトなしでstateをリセットする {/*reset-state-without-effects*/}

この`EditContact`コンポーネントは`{ id, name, email }`の形をした`savedContact`プロップを受け取ります。名前とメールの入力フィールドを編集してみてください。保存ボタンを押すと、フォームの上の連絡先ボタンが編集された名前に更新されます。リセットボタンを押すと、フォーム内の保留中の変更が破棄されます。このUIを操作してみてください。

上部のボタンで連絡先を選択すると、フォームがその連絡先の詳細を反映するようにリセットされます。これは`EditContact.js`内のエフェクトで行われています。このエフェクトを削除してください。`savedContact.id`が変更されたときにフォームをリセットする別の方法を見つけてください。

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

`savedContact.id`が異なる場合、`EditContact`フォームは概念的に_異なる連絡先のフォーム_であり、stateを保持しないべきであることをReactに伝える方法があれば良いのですが。そんな方法を覚えていますか？

</Hint>

<Solution>

`EditContact`コンポーネントを2つに分割します。すべてのフォームstateを内部の`EditForm`コンポーネントに移動します。外部の`EditContact`コンポーネントをエクスポートし、`savedContact.id`を内部の`EditForm`コンポーネントに`key`として渡します。その結果、内部の`EditForm`コンポーネントは異なる連絡先が選択されるたびにすべてのフォームstateをリセットし、DOMを再作成します。

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### エフェクトなしでフォームを送信する {/*submit-a-form-without-effects*/}

この`Form`コンポーネントは、友人にメッセージを送信することができます。フォームを送信すると、`showForm` state変数が`false`に設定されます。これにより、`sendMessage(message)`を呼び出すエフェクトがトリガーされ、メッセージが送信されます（コンソールで確認できます）。メッセージが送信された後、「ありがとう」ダイアログが表示され、「チャットを開く」ボタンをクリックするとフォームに戻ることができます。

アプリのユーザーがメッセージを送りすぎているため、チャットを少し難しくすることにしました。最初に「ありがとう」ダイアログを表示し、フォームを表示するのは後にします。`showForm` state変数を`true`ではなく`false`に初期化するように変更してください。この変更を行うと、コンソールに空のメッセージが送信されたことが表示されます。このロジックには何か問題があります！

この問題の根本原因は何ですか？そして、どうすれば修正できますか？

<Hint>

メッセージはユーザーが「ありがとう」ダイアログを見た*ために*送信されるべきですか？それともその逆ですか？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` state変数はフォームまたは「ありがとう」ダイアログを表示するかどうかを決定します。しかし、メッセージを送信するのは「ありがとう」ダイアログが*表示された*ためではありません。ユーザーが*フォームを送信した*ためにメッセージを送信したいのです。誤解を招くエフェクトを削除し、`sendMessage`呼び出しを`handleSubmit`イベントハンドラ内に移動します：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

このバージョンでは、*フォームを送信する*（イベント）ことだけがメッセージを送信する原因となります。`showForm`が最初に`true`または`false`に設定されているかどうかに関係なく、同様に機能します。（`false`に設定して、余分なコンソールメッセージが表示されないことを確認してください。）

</Solution>

</Challenges>