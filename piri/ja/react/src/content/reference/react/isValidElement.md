---
title: isValidElement
---

<Intro>

`isValidElement`は、値がReact要素かどうかをチェックします。

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

`isValidElement(value)`を呼び出して、`value`がReact要素かどうかを確認します。

```js
import { isValidElement, createElement } from 'react';

// ✅ React要素
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ React要素ではない
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `value`: チェックしたい`value`。任意の型の値を指定できます。

#### 戻り値 {/*returns*/}

`isValidElement`は、`value`がReact要素であれば`true`を返します。それ以外の場合は`false`を返します。

#### 注意点 {/*caveats*/}

* **[JSXタグ](/learn/writing-markup-with-jsx)および[`createElement`](/reference/react/createElement)によって返されるオブジェクトのみがReact要素と見なされます。** 例えば、`42`のような数値は有効なReact *ノード*（コンポーネントから返すことができます）が、有効なReact要素ではありません。[`createPortal`](/reference/react-dom/createPortal)で作成された配列やポータルもReact要素とは見なされません。

---

## 使用法 {/*usage*/}

### 何かがReact要素かどうかを確認する {/*checking-if-something-is-a-react-element*/}

`isValidElement`を呼び出して、ある値が*React要素*かどうかを確認します。

React要素は次の通りです：

- [JSXタグ](/learn/writing-markup-with-jsx)を書いて生成された値
- [`createElement`](/reference/react/createElement)を呼び出して生成された値

React要素の場合、`isValidElement`は`true`を返します：

```js
import { isValidElement, createElement } from 'react';

// ✅ JSXタグはReact要素です
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ createElementによって返される値はReact要素です
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

文字列、数値、任意のオブジェクトや配列など、他の値はReact要素ではありません。

それらの場合、`isValidElement`は`false`を返します：

```js
// ❌ これらは*React要素ではありません*
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

`isValidElement`が必要になることは非常に稀です。主に、他のAPIが*要素のみ*を受け入れる場合（例えば[`cloneElement`](/reference/react/cloneElement)のように）に、引数がReact要素でない場合にエラーを回避するために役立ちます。

特定の理由がない限り、`isValidElement`チェックを追加する必要はないでしょう。

<DeepDive>

#### React要素とReactノード {/*react-elements-vs-react-nodes*/}

コンポーネントを書くとき、任意の種類の*Reactノード*を返すことができます：

```js
function MyComponent() {
  // ... 任意のReactノードを返すことができます ...
}
```

Reactノードには次のものが含まれます：

- `<div />`や`createElement('div')`のように作成されたReact要素
- [`createPortal`](/reference/react-dom/createPortal)で作成されたポータル
- 文字列
- 数値
- `true`、`false`、`null`、または`undefined`（表示されません）
- 他のReactノードの配列

**`isValidElement`は引数が*React要素*かどうかをチェックします。Reactノードかどうかではありません。** 例えば、`42`は有効なReact要素ではありません。しかし、それは完全に有効なReactノードです：

```js
function MyComponent() {
  return 42; // コンポーネントから数値を返すことは問題ありません
}
```

このため、何かがレンダリング可能かどうかを確認するために`isValidElement`を使用すべきではありません。

</DeepDive>