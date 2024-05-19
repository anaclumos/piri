---
title: 不明なプロップの警告
---

不明なプロップ警告は、Reactが合法なDOM属性/プロパティとして認識しないプロップを持つDOM要素をレンダリングしようとした場合に発生します。DOM要素に不要なプロップが含まれていないことを確認する必要があります。

この警告が表示される可能性がある理由はいくつかあります：

1. `{...props}`や`cloneElement(element, props)`を使用していますか？プロップを子コンポーネントにコピーする際、親コンポーネントのみに意図されたプロップを誤って転送していないことを確認してください。この問題の一般的な修正方法については以下を参照してください。

2. ネイティブDOMノードに非標準のDOM属性を使用している場合、カスタムデータを表現するためかもしれません。標準のDOM要素にカスタムデータを添付しようとしている場合、[MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes)で説明されているようにカスタムデータ属性を使用することを検討してください。

3. Reactが指定した属性をまだ認識していない場合があります。これは将来のReactのバージョンで修正される可能性があります。属性名を小文字で書くと、警告なしで渡すことができます。

4. 大文字を使用せずにReactコンポーネントを使用している場合、例えば`<myButton />`。ReactはこれをDOMタグとして解釈します。これは、React JSX変換がユーザー定義コンポーネントとDOMタグを区別するために大文字と小文字の区別を使用するためです。自分のReactコンポーネントにはPascalCaseを使用してください。例えば、`<myButton />`の代わりに`<MyButton />`と書きます。

---

`{...props}`のようなプロップを渡すためにこの警告が表示される場合、親コンポーネントは親コンポーネントに意図されたプロップを「消費」し、子コンポーネントに意図されていないプロップを消費する必要があります。例：

**悪い例:** 予期しない`layout`プロップが`div`タグに転送されます。

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // 悪い例! なぜなら、"layout"が<div>が理解するプロップではないことが確実だからです。
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // 悪い例! なぜなら、"layout"が<div>が理解するプロップではないことが確実だからです。
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**良い例:** スプレッド構文を使用してプロップから変数を取り出し、残りのプロップを変数に入れることができます。

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**良い例:** プロップを新しいオブジェクトに割り当て、使用しているキーを新しいオブジェクトから削除することもできます。元の`this.props`オブジェクトからプロップを削除しないように注意してください。このオブジェクトは不変と見なされるべきです。

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```