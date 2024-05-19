---
title: Refsを使ったDOMの操作
---

<Intro>

Reactは、レンダー出力に合わせて[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)を自動的に更新するため、コンポーネントがDOMを操作する必要はあまりありません。しかし、時にはReactが管理するDOM要素にアクセスする必要があるかもしれません。例えば、ノードにフォーカスを当てたり、スクロールしたり、そのサイズや位置を測定したりする場合です。Reactにはこれらの操作を行うための組み込みの方法はないため、DOMノードへの*ref*が必要です。

</Intro>

<YouWillLearn>

- `ref`属性を使用してReactが管理するDOMノードにアクセスする方法
- `ref` JSX属性が`useRef`フックとどのように関連しているか
- 他のコンポーネントのDOMノードにアクセスする方法
- Reactが管理するDOMを変更しても安全な場合

</YouWillLearn>

## ノードへのrefの取得 {/*getting-a-ref-to-the-node*/}

Reactが管理するDOMノードにアクセスするには、まず`useRef`フックをインポートします：

```js
import { useRef } from 'react';
```

次に、コンポーネント内でrefを宣言します：

```js
const myRef = useRef(null);
```

最後に、取得したいDOMノードのJSXタグに`ref`属性として渡します：

```js
<div ref={myRef}>
```

`useRef`フックは`current`という単一のプロパティを持つオブジェクトを返します。最初は`myRef.current`は`null`です。Reactがこの`<div>`のDOMノードを作成すると、Reactはこのノードへの参照を`myRef.current`に入れます。その後、このDOMノードに[イベントハンドラ](/learn/responding-to-events)からアクセスし、定義された組み込みの[ブラウザAPI](https://developer.mozilla.org/docs/Web/API/Element)を使用できます。

```js
// 任意のブラウザAPIを使用できます。例えば：
myRef.current.scrollIntoView();
```

### 例：テキスト入力にフォーカスを当てる {/*example-focusing-a-text-input*/}

この例では、ボタンをクリックすると入力にフォーカスが当たります：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        入力にフォーカスを当てる
      </button>
    </>
  );
}
```

</Sandpack>

これを実装するには：

1. `useRef`フックで`inputRef`を宣言します。
2. `<input ref={inputRef}>`として渡します。これにより、Reactはこの`<input>`のDOMノードを`inputRef.current`に入れます。
3. `handleClick`関数内で、`inputRef.current`から入力DOMノードを読み取り、`inputRef.current.focus()`で[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)を呼び出します。
4. `handleClick`イベントハンドラを`<button>`に`onClick`で渡します。

DOM操作はrefsの最も一般的な使用例ですが、`useRef`フックはタイマーIDなど、Reactの外部に他のものを保存するためにも使用できます。状態と同様に、refsはレンダー間で保持されます。refsは設定しても再レンダーをトリガーしない状態変数のようなものです。refsについては[Referencing Values with Refs.](/learn/referencing-values-with-refs)で詳しく説明しています。

### 例：要素にスクロールする {/*example-scrolling-to-an-element*/}

コンポーネント内に複数のrefを持つことができます。この例では、3つの画像のカルーセルがあります。各ボタンは対応するDOMノードに対してブラウザの[`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)メソッドを呼び出して画像を中央に配置します：

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### refコールバックを使用してrefのリストを管理する方法 {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

上記の例では、事前に定義された数のrefsがあります。しかし、リスト内の各アイテムにrefが必要で、どれだけの数があるか分からない場合もあります。このような場合、次のようなコードは**機能しません**：

```js
<ul>
  {items.map((item) => {
    // 機能しません！
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

これは、**フックはコンポーネントのトップレベルでのみ呼び出す必要がある**ためです。ループ内、条件内、または`map()`呼び出し内で`useRef`を呼び出すことはできません。

この問題を回避する1つの方法は、親要素に対して単一のrefを取得し、[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)のようなDOM操作メソッドを使用して、個々の子ノードを「見つける」ことです。しかし、これは脆弱であり、DOM構造が変更されると壊れる可能性があります。

別の解決策は、**`ref`属性に関数を渡すことです。** これは[`ref`コールバック](/reference/react-dom/components/common#ref-callback)と呼ばれます。Reactは、refを設定する時にDOMノードでrefコールバックを呼び出し、クリアする時には`null`で呼び出します。これにより、独自の配列や[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)を維持し、インデックスやIDで任意のrefにアクセスできます。

この例では、このアプローチを使用して長いリスト内の任意のノードにスクロールする方法を示します：

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 初回使用時にMapを初期化します。
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Tom</button>
        <button onClick={() => scrollToCat(catList[5])}>Maru</button>
        <button onClick={() => scrollToCat(catList[9])}>Jellylorum</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat, node);
                } else {
                  map.delete(cat);
                }
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  }
}
```

</Sandpack>

この例では、`itemsRef`は単一のDOMノードを保持しません。代わりに、アイテムIDからDOMノードへの[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)を保持します。（[Refsは任意の値を保持できます！](/learn/referencing-values-with-refs)）各リストアイテムの[`ref`コールバック](/reference/react-dom/components/common#ref-callback)は、Mapを更新する役割を果たします：

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Mapに追加
      map.set(cat, node);
    } else {
      // Mapから削除
      map.delete(cat);
    }
  }}
>
```

これにより、後でMapから個々のDOMノードを読み取ることができます。

<Canary>

この例では、`ref`コールバックのクリーンアップ関数を使用してMapを管理する別のアプローチを示します。

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Mapに追加
    map.set(cat, node);

    return () => {
      // Mapから削除
      map.delete(cat);
    };
  }}
>
```

</Canary>

</DeepDive>

## 他のコンポーネントのDOMノードにアクセスする {/*accessing-another-components-dom-nodes*/}

ブラウザ要素を出力する組み込みコンポーネントにrefを付けると、Reactはそのrefの`current`プロパティを対応するDOMノード（ブラウザ内の実際の`<input />`など）に設定します。

しかし、**自分自身の**コンポーネントにrefを付けようとすると、デフォルトでは`null`になります。以下の例でそれを示します。ボタンをクリックしても入力にフォーカスが当たらないことに注意してください：

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        入力にフォーカスを当てる
      </button>
    </>
  );
}
```

</Sandpack>

問題に気づきやすくするために、Reactはコンソールにエラーも表示します：

<ConsoleBlock level="error">

警告：関数コンポーネントにrefsを与えることはできません。このrefにアクセスしようとすると失敗します。React.forwardRef()を使用するつもりでしたか？

</ConsoleBlock>

これは、デフォルトではReactが他のコンポーネントのDOMノードにアクセスすることを許可しないためです。自分の子供であっても！これは意図的なものです。refsは慎重に使用すべきエスケープハッチです。_他の_コンポーネントのDOMノードを手動で操作することは、コードをさらに脆弱にします。

代わりに、DOMノードを公開したいコンポーネントは、その動作に**オプトイン**する必要があります。コンポーネントは、refをその子供の1つに「転送」することを指定できます。ここでは、`MyInput`が`forwardRef` APIを使用する方法を示します：

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

これがどのように機能するか：

1. `<MyInput ref={inputRef} />`は、対応するDOMノードを`inputRef.current`に入れるようにReactに指示します。しかし、これは`MyInput`コンポーネントがオプトインするかどうかに依存します。デフォルトではそうではありません。
2. `MyInput`コンポーネントは`forwardRef`を使用して宣言されています。**これにより、上記の`inputRef`を第2の`ref`引数として受け取ることにオプトインします**。これは`props`の後に宣言されます。
3. `MyInput`自体は、受け取った`ref`を内部の`<input>`に渡します。

これで、ボタンをクリックして入力にフォーカスを当てることができます：

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        入力にフォーカスを当てる
      </button>
    </>
  );
}
```

</Sandpack>

デザインシステムでは、ボタンや入力などの低レベルのコンポーネントがそのrefをDOMノードに転送することが一般的なパターンです。一方、フォーム、リスト、ページセクションなどの高レベルのコンポーネントは、DOMノードを公開しないことで、DOM構造への偶発的な依存を避けることがよくあります。

<DeepDive>

#### 命令的ハンドルでAPIのサブセットを公開する {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

上記の例では、`MyInput`は元のDOM入力要素を公開しています。これにより、親コンポーネントはそれに対して`focus()`を呼び出すことができます。しかし、これにより、親コンポーネントは他の操作も行うことができます。例えば、CSSスタイルを変更することです。まれに、公開する機能を制限したい場合があります。これを`useImperativeHandle`で行うことができます：

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // フォーカスのみを公開し、他のものは公開しない
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        入力にフォーカスを当てる
      </button>
    </>
  );
}
```

</Sandpack>

ここで、`MyInput`内の`realInputRef`は実際の入力
DOMノードを保持します。しかし、`useImperativeHandle`は、親コンポーネントに対してrefの値として独自の特別なオブジェクトを提供するようにReactに指示します。したがって、`Form`コンポーネント内の`inputRef.current`は`focus`メソッドのみを持ちます。この場合、ref「ハンドル」はDOMノードではなく、`useImperativeHandle`呼び出し内で作成したカスタムオブジェクトです。

</DeepDive>

## Reactがrefsをアタッチするタイミング {/*when-react-attaches-the-refs*/}

Reactでは、すべての更新は[2つのフェーズ](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)に分かれています：

* **レンダー中**、Reactはコンポーネントを呼び出して画面に表示する内容を決定します。
* **コミット中**、ReactはDOMに変更を適用します。

一般的に、レンダリング中にrefsにアクセスすることは[避けるべきです](/learn/referencing-values-with-refs#best-practices-for-refs)。これはDOMノードを保持するrefsにも当てはまります。最初のレンダー中は、DOMノードはまだ作成されていないため、`ref.current`は`null`になります。また、更新のレンダリング中は、DOMノードはまだ更新されていません。したがって、それらを読み取るには早すぎます。

Reactはコミット中に`ref.current`を設定します。DOMを更新する前に、Reactは影響を受ける`ref.current`の値を`null`に設定します。DOMを更新した後、Reactはそれらを対応するDOMノードにすぐに設定します。

**通常、イベントハンドラからrefsにアクセスします。** refを使用して何かを行いたいが、特定のイベントがない場合は、エフェクトが必要になるかもしれません。次のページでエフェクトについて説明します。

<DeepDive>

#### flushSyncで状態更新を同期的にフラッシュする {/*flushing-state-updates-synchronously-with-flush-sync*/}

次のコードを考えてみてください。これは新しいtodoを追加し、リストの最後の子に画面をスクロールします。なぜか、常に最後に追加されたtodoの*直前*のtodoにスクロールされることに注意してください：

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        追加
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

問題は次の2行にあります：

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

Reactでは、[状態更新はキューに入れられます。](/learn/queueing-a-series-of-state-updates) 通常、これは望ましい動作です。しかし、ここでは問題を引き起こします。なぜなら、`setTodos`はDOMを即座に更新しないからです。したがって、リストを最後の要素にスクロールする時点で、todoはまだ追加されていません。これが、スクロールが常に1つ前のアイテムに「遅れる」理由です。

この問題を解決するには、ReactにDOMを同期的に更新（「フラッシュ」）するように強制することができます。これを行うには、`react-dom`から`flushSync`をインポートし、**状態更新を**`flushSync`呼び出しにラップします：

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

これにより、`flushSync`でラップされたコードが実行された直後にReactがDOMを同期的に更新するように指示されます。その結果、最後のtodoがスクロールする時点で既にDOMに存在するようになります：

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        追加
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## refsを使用したDOM操作のベストプラクティス {/*best-practices-for-dom-manipulation-with-refs*/}

Refsはエスケープハッチです。Reactの外に「ステップアウト」する必要がある場合にのみ使用するべきです。これには、フォーカスの管理、スクロール位置の管理、Reactが公開していないブラウザAPIの呼び出しなどが含まれます。

フォーカスやスクロールなどの非破壊的なアクションに限定すれば、問題は発生しないはずです。しかし、DOMを手動で**変更**しようとすると、Reactが行っている変更と競合するリスクがあります。

この問題を説明するために、ウェルカムメッセージと2つのボタンを含む例を示します。最初のボタンは[条件付きレンダリング](/learn/conditional-rendering)と[状態](/learn/state-a-components-memory)を使用してその存在を切り替えます。これは通常Reactで行う方法です。2つ目のボタンは[`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)を使用して、Reactの制御外で強制的に削除します。

「setStateで切り替え」を数回押してみてください。メッセージが消えたり再表示されたりするはずです。その後、「DOMから削除」を押します。これにより、強制的に削除されます。最後に、「setStateで切り替え」を押します：

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        setStateで切り替え
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        DOMから削除
      </button>
      {show && <p ref={ref}>こんにちは、世界</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

DOM要素を手動で削除した後、`setState`を使用して再表示しようとするとクラッシュします。これは、DOMを変更したため、Reactがそれを正しく管理する方法がわからなくなるからです。

**Reactが管理するDOMノードを変更しないでください。** Reactが管理する要素に対して子要素を変更、追加、または削除すると、視覚的な結果が一貫しなくなったり、上記のようにクラッシュする可能性があります。

しかし、これが全くできないというわけではありません。注意が必要です。**Reactが更新する理由がないDOMの部分を安全に変更できます。** 例えば、JSXで常に空の`<div>`がある場合、Reactはその子リストに触れる理由がありません。したがって、そこに手動で要素を追加または削除することは安全です。

<Recap>

- Refsは一般的な概念ですが、最も頻繁に使用するのはDOM要素を保持するためです。
- `<div ref={myRef}>`を渡すことで、ReactにDOMノードを`myRef.current`に入れるように指示します。
- 通常、フォーカス、スクロール、またはDOM要素の測定などの非破壊的なアクションにrefsを使用します。
- コンポーネントはデフォルトでそのDOMノードを公開しません。`forwardRef`を使用して第2の`ref`引数を特定のノードに渡すことで、DOMノードを公開することにオプトインできます。
- Reactが管理するDOMノードを変更しないでください。
- Reactが管理するDOMノードを変更する場合は、Reactが更新する理由がない部分を変更してください。

</Recap>

<Challenges>

#### ビデオの再生と一時停止 {/*play-and-pause-the-video*/}

この例では、ボタンが状態変数を切り替えて再生状態と一時停止状態を切り替えます。しかし、実際にビデオを再生または一時停止するには、状態を切り替えるだけでは不十分です。`<video>`のDOM要素に対して[`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)と[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)を呼び出す必要があります。これにrefを追加し、ボタンを機能させます。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? '一時停止' : '再生'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

追加のチャレンジとして、ユーザーがビデオを右クリックして組み込みのブラウザメディアコントロールを使用して再生した場合でも、「再生」ボタンがビデオの再生状態と同期するようにします。これを行うには、ビデオの`onPlay`と`onPause`をリッスンする必要があります。

<Solution>

refを宣言し、それを`<video>`要素に渡します。その後、次の状態に応じてイベントハンドラ内で`ref.current.play()`と`ref.current.pause()`を呼び出します。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? '一時停止' : '再生'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

組み込みのブラウザコントロールを処理するために、`<video>`要素に`onPlay`と`onPause`ハンドラを追加し、それらから`setIsPlaying`を呼び出すことができます。これにより、ユーザーがブラウザコントロールを使用してビデオを再生した場合でも、状態が適切に調整されます。

</Solution>

#### 検索フィールドにフォーカスを当てる {/*focus-the-search-field*/}

「検索」ボタンをクリックすると、フィールドにフォーカスが当たるようにします。

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>検索</button>
      </nav>
      <input
        placeholder="何かお探しですか？"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

入力にrefを追加し、DOMノードに対して`focus()`を呼び出してフォーカスを当てます：

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          検索
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="何かお探しですか？"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### 画像カルーセルのスクロール {/*scrolling-an-image-carousel*/}

この画像カルーセルには、アクティブな画像を切り替える「次へ」ボタンがあります。クリックするとギャラリーがアクティブな画像に水平スクロールするようにします。アクティブな画像のDOMノードに対して[`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)を呼び出す必要があります：

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

この演習では、すべての画像にrefを持つ必要はありません。現在アクティブな画像またはリスト自体にrefを持つだけで十分です。スクロールする*前に*DOMが更新されるように`flushSync`を使用します。

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          次へ
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

`selectedRef`を宣言し、それを現在の画像に条件付きで渡します：

```js
<li ref={index === i ? selectedRef : null}>
```

`index === i`の場合、つまり画像が選択されている場合、`<li>`は`selectedRef`を受け取ります。Reactは`selectedRef.current`が常に正しいDOMノードを指すようにします。

`flushSync`呼び出しは、スクロールする前にReactがDOMを更新することを強制するために必要です。そうしないと、`selectedRef.current`は常に以前に選択されたアイテムを指すことになります。

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          次へ
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### 別々のコンポーネントで検索フィールドにフォーカスを当てる {/*focus-the-search-field-with-separate-components*/}

「検索」ボタンをクリックすると、フィールドにフォーカスが当たるようにします。各コンポーネントは別々のファイルに定義されており、移動させるべきではありません。どのようにしてそれらを接続しますか？

<Hint>

`SearchInput`のような自分のコンポーネントからDOMノードを公開するには、`forwardRef`が必要です。

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      検索
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="何かお探しですか？"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

`SearchButton`に`onClick`プロップを追加し、`SearchButton`がそれをブラウザの`<button>`に渡すようにします。また、`<SearchInput>`にrefを渡し、それを実際の`<input>`に転送してそれを埋めます。最後に、クリックハンドラでそのrefに格納されたDOMノードに対して`focus`を呼び出します。

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      検索
    </button>
  );
}
```

```js src/SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="何かお探しですか？"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>