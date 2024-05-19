---
title: 共通コンポーネント（例：<div>）
---

<Intro>

すべての組み込みブラウザコンポーネント（例えば [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)）は、いくつかの共通のプロップとイベントをサポートしています。

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### 共通コンポーネント（例：`<div>`） {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[以下の例を参照してください。](#usage)

#### プロップス {/*common-props*/}

これらの特別なReactプロップスは、すべての組み込みコンポーネントでサポートされています：

* `children`: Reactノード（要素、文字列、数値、[ポータル、](/reference/react-dom/createPortal) `null`、`undefined`、ブール値のような空のノード、または他のReactノードの配列）。コンポーネント内の内容を指定します。JSXを使用する場合、通常はタグをネストすることで`children`プロップを暗黙的に指定します（例：`<div><span /></div>`）。

* `dangerouslySetInnerHTML`: `{ __html: '<p>some html</p>' }`の形式のオブジェクトで、生のHTML文字列が含まれています。DOMノードの[`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)プロパティを上書きし、渡されたHTMLを内部に表示します。これは非常に注意して使用する必要があります！内部のHTMLが信頼できない場合（例えば、ユーザーデータに基づいている場合）、[XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)脆弱性を引き起こすリスクがあります。[`dangerouslySetInnerHTML`の使用について詳しく読む。](#dangerously-setting-the-inner-html)

* `ref`: [`useRef`](/reference/react/useRef)または[`createRef`](/reference/react/createRef)からのrefオブジェクト、または[`ref`コールバック関数](#ref-callback)、または[レガシーref](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)のための文字列。あなたのrefはこのノードのDOM要素で満たされます。[refを使用してDOMを操作する方法について詳しく読む。](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: ブール値。`true`の場合、`children`と`contentEditable={true}`の両方を持つ要素に対してReactが表示する警告を抑制します（通常は一緒に機能しません）。`contentEditable`の内容を手動で管理するテキスト入力ライブラリを構築している場合に使用します。

* `suppressHydrationWarning`: ブール値。[サーバーレンダリング](/reference/react-dom/server)を使用する場合、通常はサーバーとクライアントが異なる内容をレンダリングすると警告が表示されます。いくつかの稀なケース（例えばタイムスタンプ）では、正確な一致を保証することが非常に難しいか不可能です。`suppressHydrationWarning`を`true`に設定すると、Reactはその要素の属性と内容の不一致について警告しません。これは一段階深くのみ機能し、エスケープハッチとして使用することを意図しています。過度に使用しないでください。[ハイドレーションエラーの抑制について詳しく読む。](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: 例えば`{ fontWeight: 'bold', margin: 20 }`のようなCSSスタイルを持つオブジェクト。DOMの[`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)プロパティと同様に、CSSプロパティ名は`camelCase`で書く必要があります（例：`fontWeight`ではなく`font-weight`）。値として文字列または数値を渡すことができます。数値を渡す場合、例えば`width: 100`のように、Reactは自動的に値に`px`（「ピクセル」）を追加しますが、[単位なしのプロパティ](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57)の場合は除きます。`style`は事前にスタイル値がわからない動的スタイルにのみ使用することをお勧めします。他の場合では、`className`でプレーンなCSSクラスを適用する方が効率的です。[`className`と`style`について詳しく読む。](#applying-css-styles)

これらの標準DOMプロップスもすべての組み込みコンポーネントでサポートされています：

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): 文字列。要素のキーボードショートカットを指定します。[一般的には推奨されません。](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA属性は、この要素のアクセシビリティツリー情報を指定します。完全なリファレンスについては[ARIA属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)を参照してください。Reactでは、すべてのARIA属性名はHTMLと同じです。
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): 文字列。ユーザー入力をどのように大文字にするかを指定します。
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): 文字列。要素のCSSクラス名を指定します。[CSSスタイルの適用について詳しく読む。](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): ブール値。`true`の場合、ブラウザはユーザーがレンダリングされた要素を直接編集できるようにします。これは[Lexical](https://lexical.dev/)のようなリッチテキスト入力ライブラリを実装するために使用されます。Reactは`contentEditable={true}`の要素にReactの子要素を渡そうとすると警告します。なぜなら、ユーザーが編集した後にReactがその内容を更新できないからです。
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): データ属性は、例えば`data-fruit="banana"`のように、要素に文字列データを添付することを可能にします。Reactでは、通常はプロップスや状態からデータを読み取るため、一般的には使用されません。
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): `'ltr'`または`'rtl'`。要素のテキスト方向を指定します。
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): ブール値。要素がドラッグ可能かどうかを指定します。[HTMLドラッグアンドドロップAPI](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)の一部です。
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): 文字列。仮想キーボードのEnterキーに対してどのアクションを提示するかを指定します。
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): 文字列。[`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)および[`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)のために、[ラベルをコントロールに関連付ける](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for)ことを可能にします。Reactは標準のDOMプロパティ名（`htmlFor`）を使用します。
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): ブール値または文字列。要素を非表示にするかどうかを指定します。
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): 文字列。この要素の一意の識別子を指定します。後で見つけたり、他の要素と接続したりするために使用されます。[`useId`](/reference/react/useId)を使用して、同じコンポーネントの複数のインスタンス間での衝突を避けるために生成します。
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): 文字列。指定された場合、コンポーネントは[カスタム要素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)のように振る舞います。
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): 文字列。どの種類のキーボードを表示するかを指定します（例：テキスト、数値、電話）。
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): 文字列。構造化データクローラーのために要素が表すプロパティを指定します。
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): 文字列。要素の言語を指定します。
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): [`AnimationEvent`ハンドラー](#animationevent-handler)関数。CSSアニメーションが完了したときに発火します。
* `onAnimationEndCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onAnimationEnd`のバージョン。
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): [`AnimationEvent`ハンドラー](#animationevent-handler)関数。CSSアニメーションの反復が終了し、次の反復が始まるときに発火します。
* `onAnimationIterationCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onAnimationIteration`のバージョン。
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): [`AnimationEvent`ハンドラー](#animationevent-handler)関数。CSSアニメーションが開始されたときに発火します。
* `onAnimationStartCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onAnimationStart`のバージョン。
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。非プライマリポインタボタンがクリックされたときに発火します。
* `onAuxClickCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onAuxClick`のバージョン。
* `onBeforeInput`: [`InputEvent`ハンドラー](#inputevent-handler)関数。編集可能な要素の値が変更される前に発火します。Reactはまだネイティブの[`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event)イベントを使用しておらず、他のイベントを使用してポリフィルしようとします。
* `onBeforeInputCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onBeforeInput`のバージョン。
* `onBlur`: [`FocusEvent`ハンドラー](#focusevent-handler)関数。要素がフォーカスを失ったときに発火します。組み込みのブラウザ[`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event)イベントとは異なり、Reactでは`onBlur`イベントがバブルします。
* `onBlurCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onBlur`のバージョン。
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ポインティングデバイスのプライマリボタンがクリックされたときに発火します。
* `onClickCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onClick`のバージョン。
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): [`CompositionEvent`ハンドラー](#compositionevent-handler)関数。[入力メソッドエディタ](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)が新しいコンポジションセッションを開始したときに発火します。
* `onCompositionStartCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCompositionStart`のバージョン。
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): [`CompositionEvent`ハンドラー](#compositionevent-handler)関数。[入力メソッドエディタ](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)がコンポジションセッションを完了またはキャンセルしたときに発火します。
* `onCompositionEndCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCompositionEnd`のバージョン。
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): [`CompositionEvent`ハンドラー](#compositionevent-handler)関数。[入力メソッドエディタ](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)が新しい文字を受け取ったときに発火します。
* `onCompositionUpdateCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCompositionUpdate`のバージョン。
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ユーザーがコンテキストメニューを開こうとしたときに発火します。
* `onContextMenuCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onContextMenu`のバージョン。
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): [`ClipboardEvent`ハンドラー](#clipboardevent-handler)関数。ユーザーが何かをクリップボードにコピーしようとしたときに発火します。
* `onCopyCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCopy`のバージョン。
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): [`ClipboardEvent`ハンドラー](#clipboardevent-handler)関数。ユーザーが何かをクリップボードにカットしようとしたときに発火します。
* `onCutCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCut`のバージョン。
* `onDoubleClick`: [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ユーザーが2回クリックしたときに発火します。ブラウザの[`dblclick`イベント](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)に対応します。
* `onDoubleClickCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDoubleClick`のバージョン。
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): [`DragEvent`ハンドラー](#dragevent-handler)関数。ユーザーが何かをドラッグしている間に発火します。
* `onDragCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDrag`のバージョン。
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): [`DragEvent`ハンドラー](#dragevent-handler)関数。ユーザーが何かをドラッグするのをやめたときに発火します。
* `onDragEndCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDragEnd`のバージョン。
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): [`DragEvent`ハンドラー](#dragevent-handler)関
数。ドラッグされたコンテンツが有効なドロップターゲットに入ったときに発火します。
* `onDragEnterCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDragEnter`のバージョン。
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): [`DragEvent`ハンドラー](#dragevent-handler)関数。ドラッグされたコンテンツが有効なドロップターゲット上にドラッグされている間に発火します。ドロップを許可するには、ここで`e.preventDefault()`を呼び出す必要があります。
* `onDragOverCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDragOver`のバージョン。
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): [`DragEvent`ハンドラー](#dragevent-handler)関数。ユーザーが要素をドラッグし始めたときに発火します。
* `onDragStartCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDragStart`のバージョン。
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): [`DragEvent`ハンドラー](#dragevent-handler)関数。何かが有効なドロップターゲットにドロップされたときに発火します。
* `onDropCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDrop`のバージョン。
* `onFocus`: [`FocusEvent`ハンドラー](#focusevent-handler)関数。要素がフォーカスを受けたときに発火します。組み込みのブラウザ[`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event)イベントとは異なり、Reactでは`onFocus`イベントがバブルします。
* `onFocusCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onFocus`のバージョン。
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。要素がプログラム的にポインタをキャプチャしたときに発火します。
* `onGotPointerCaptureCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onGotPointerCapture`のバージョン。
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): [`KeyboardEvent`ハンドラー](#keyboardevent-handler)関数。キーが押されたときに発火します。
* `onKeyDownCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onKeyDown`のバージョン。
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): [`KeyboardEvent`ハンドラー](#keyboardevent-handler)関数。廃止予定。代わりに`onKeyDown`または`onBeforeInput`を使用してください。
* `onKeyPressCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onKeyPress`のバージョン。
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): [`KeyboardEvent`ハンドラー](#keyboardevent-handler)関数。キーが離されたときに発火します。
* `onKeyUpCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onKeyUp`のバージョン。
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。要素がポインタのキャプチャを停止したときに発火します。
* `onLostPointerCaptureCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onLostPointerCapture`のバージョン。
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ポインタが押されたときに発火します。
* `onMouseDownCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onMouseDown`のバージョン。
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ポインタが要素内に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onMouseLeave`と`onMouseEnter`は、離れる要素から入る要素へと伝播します。
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ポインタが要素外に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onMouseLeave`と`onMouseEnter`は、離れる要素から入る要素へと伝播します。
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ポインタが座標を変更したときに発火します。
* `onMouseMoveCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onMouseMove`のバージョン。
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ポインタが要素外に移動したとき、または子要素に移動したときに発火します。
* `onMouseOutCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onMouseOut`のバージョン。
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): [`MouseEvent`ハンドラー](#mouseevent-handler)関数。ポインタが離されたときに発火します。
* `onMouseUpCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onMouseUp`のバージョン。
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。ブラウザがポインタの操作をキャンセルしたときに発火します。
* `onPointerCancelCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPointerCancel`のバージョン。
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。ポインタがアクティブになったときに発火します。
* `onPointerDownCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPointerDown`のバージョン。
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。ポインタが要素内に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onPointerLeave`と`onPointerEnter`は、離れる要素から入る要素へと伝播します。
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。ポインタが要素外に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onPointerLeave`と`onPointerEnter`は、離れる要素から入る要素へと伝播します。
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。ポインタが座標を変更したときに発火します。
* `onPointerMoveCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPointerMove`のバージョン。
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。ポインタが要素外に移動したとき、ポインタ操作がキャンセルされたとき、[その他の理由](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)で発火します。
* `onPointerOutCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPointerOut`のバージョン。
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): [`PointerEvent`ハンドラー](#pointerevent-handler)関数。ポインタがアクティブでなくなったときに発火します。
* `onPointerUpCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPointerUp`のバージョン。
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): [`ClipboardEvent`ハンドラー](#clipboardevent-handler)関数。ユーザーがクリップボードから何かを貼り付けようとしたときに発火します。
* `onPasteCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPaste`のバージョン。
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): [`Event`ハンドラー](#event-handler)関数。要素がスクロールされたときに発火します。このイベントはバブルしません。
* `onScrollCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onScroll`のバージョン。
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event`ハンドラー](#event-handler)関数。編集可能な要素内の選択が変更された後に発火します。Reactは`contentEditable={true}`の要素にも`onSelect`イベントを拡張します。さらに、Reactは空の選択や編集（選択に影響を与える可能性がある）にも発火します。
* `onSelectCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onSelect`のバージョン。
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): [`TouchEvent`ハンドラー](#touchevent-handler)関数。ブラウザがタッチ操作をキャンセルしたときに発火します。
* `onTouchCancelCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onTouchCancel`のバージョン。
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): [`TouchEvent`ハンドラー](#touchevent-handler)関数。1つ以上のタッチポイントが削除されたときに発火します。
* `onTouchEndCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onTouchEnd`のバージョン。
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): [`TouchEvent`ハンドラー](#touchevent-handler)関数。1つ以上のタッチポイントが移動したときに発火します。
* `onTouchMoveCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onTouchMove`のバージョン。
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): [`TouchEvent`ハンドラー](#touchevent-handler)関数。1つ以上のタッチポイントが配置されたときに発火します。
* `onTouchStartCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onTouchStart`のバージョン。
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): [`TransitionEvent`ハンドラー](#transitionevent-handler)関数。CSSトランジションが完了したときに発火します。
* `onTransitionEndCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onTransitionEnd`のバージョン。
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): [`WheelEvent`ハンドラー](#wheelevent-handler)関数。ユーザーがホイールボタンを回転させたときに発火します。
* `onWheelCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onWheel`のバージョン。
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 文字列。支援技術のために要素の役割を明示的に指定します。
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 文字列。シャドウDOMを使用する場合のスロット名を指定します。Reactでは、通常、JSXをプロップとして渡すことで同等のパターンが実現されます（例：`<Layout left={<Sidebar />} right={<Content />} />`）。
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): ブール値またはnull。明示的に`true`または`false`に設定された場合、スペルチェックを有効または無効にします。
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): 数値。デフォルトのタブボタンの動作を上書きします。[`-1`および`0`以外の値の使用は避けてください。](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): 文字列。要素のツールチップテキストを指定します。
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'`または`'no'`。`'no'`を渡すと、要素の内容が翻訳から除外されます。

カスタム属性もプロップとして渡すことができます。例えば`mycustomprop="someValue"`のように。これはサードパーティライブラリと統合する際に便利です。カスタム属性名は小文字で始まり、`on`で始まってはいけません。値は文字列に変換されます。`null`または`undefined`を渡すと、カスタム属性は削除されます。

これらのイベントは[`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)要素に対してのみ発火します：

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): [`Event`ハンドラー](#event-handler)関数。フォームがリセットされたときに発火します。
* `onResetCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onReset`のバージョン。
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): [`Event`ハンドラー](#event-handler)関数。フォームが送信されたときに発火します。
* `onSubmitCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onSubmit`のバージョン。

これらのイベントは[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)要素に対してのみ発火します。ブラウザイベントとは異なり、Reactではバブルします：

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): [`Event`ハンドラー](#event-handler)関数。ユーザーがダイアログを閉じようとしたときに発火します。

* `onCancelCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCancel`のバージョン。
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): [`Event`ハンドラー](#event-handler)関数。ダイアログが閉じられたときに発火します。
* `onCloseCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onClose`のバージョン。

これらのイベントは[`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)要素に対してのみ発火します。ブラウザイベントとは異なり、Reactではバブルします：

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): [`Event`ハンドラー](#event-handler)関数。ユーザーが詳細を切り替えたときに発火します。
* `onToggleCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onToggle`のバージョン。

これらのイベントは[`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)、[`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)、[`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object)、[`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed)、[`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)、および[SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag)要素に対して発火します。ブラウザイベントとは異なり、Reactではバブルします：

* `onLoad`: [`Event`ハンドラー](#event-handler)関数。リソースが読み込まれたときに発火します。
* `onLoadCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onLoad`のバージョン。
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event`ハンドラー](#event-handler)関数。リソースが読み込まれなかったときに発火します。
* `onErrorCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onError`のバージョン。

これらのイベントは[`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)や[`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)のようなリソースに対して発火します。ブラウザイベントとは異なり、Reactではバブルします：

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): [`Event`ハンドラー](#event-handler)関数。リソースが完全に読み込まれなかったときに発火しますが、エラーによるものではありません。
* `onAbortCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onAbort`のバージョン。
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): [`Event`ハンドラー](#event-handler)関数。再生を開始するのに十分なデータがあるが、バッファリングなしで最後まで再生するのに十分ではないときに発火します。
* `onCanPlayCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCanPlay`のバージョン。
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): [`Event`ハンドラー](#event-handler)関数。バッファリングなしで最後まで再生するのに十分なデータがあるときに発火します。
* `onCanPlayThroughCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onCanPlayThrough`のバージョン。
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): [`Event`ハンドラー](#event-handler)関数。メディアの再生時間が更新されたときに発火します。
* `onDurationChangeCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onDurationChange`のバージョン。
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): [`Event`ハンドラー](#event-handler)関数。メディアが空になったときに発火します。
* `onEmptiedCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onEmptied`のバージョン。
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): [`Event`ハンドラー](#event-handler)関数。ブラウザが暗号化されたメディアに遭遇したときに発火します。
* `onEncryptedCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onEncrypted`のバージョン。
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): [`Event`ハンドラー](#event-handler)関数。再生が停止したときに発火します。
* `onEndedCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onEnded`のバージョン。
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event`ハンドラー](#event-handler)関数。リソースが読み込まれなかったときに発火します。
* `onErrorCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onError`のバージョン。
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): [`Event`ハンドラー](#event-handler)関数。現在の再生フレームが読み込まれたときに発火します。
* `onLoadedDataCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onLoadedData`のバージョン。
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): [`Event`ハンドラー](#event-handler)関数。メタデータが読み込まれたときに発火します。
* `onLoadedMetadataCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onLoadedMetadata`のバージョン。
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): [`Event`ハンドラー](#event-handler)関数。ブラウザがリソースの読み込みを開始したときに発火します。
* `onLoadStartCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onLoadStart`のバージョン。
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): [`Event`ハンドラー](#event-handler)関数。メディアが一時停止されたときに発火します。
* `onPauseCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPause`のバージョン。
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): [`Event`ハンドラー](#event-handler)関数。メディアが一時停止されなくなったときに発火します。
* `onPlayCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPlay`のバージョン。
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): [`Event`ハンドラー](#event-handler)関数。メディアが再生を開始または再開したときに発火します。
* `onPlayingCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onPlaying`のバージョン。
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): [`Event`ハンドラー](#event-handler)関数。リソースが読み込まれている間に定期的に発火します。
* `onProgressCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onProgress`のバージョン。
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): [`Event`ハンドラー](#event-handler)関数。再生速度が変更されたときに発火します。
* `onRateChangeCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onRateChange`のバージョン。
* `onResize`: [`Event`ハンドラー](#event-handler)関数。ビデオのサイズが変更されたときに発火します。
* `onResizeCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onResize`のバージョン。
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): [`Event`ハンドラー](#event-handler)関数。シーク操作が完了したときに発火します。
* `onSeekedCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onSeeked`のバージョン。
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): [`Event`ハンドラー](#event-handler)関数。シーク操作が開始されたときに発火します。
* `onSeekingCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onSeeking`のバージョン。
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): [`Event`ハンドラー](#event-handler)関数。ブラウザがデータを待っているが、読み込みが続かないときに発火します。
* `onStalledCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onStalled`のバージョン。
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): [`Event`ハンドラー](#event-handler)関数。リソースの読み込みが一時停止されたときに発火します。
* `onSuspendCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onSuspend`のバージョン。
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): [`Event`ハンドラー](#event-handler)関数。現在の再生時間が更新されたときに発火します。
* `onTimeUpdateCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onTimeUpdate`のバージョン。
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): [`Event`ハンドラー](#event-handler)関数。音量が変更されたときに発火します。
* `onVolumeChangeCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onVolumeChange`のバージョン。
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): [`Event`ハンドラー](#event-handler)関数。データの一時的な不足により再生が停止したときに発火します。
* `onWaitingCapture`: [キャプチャフェーズ](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase)で発火する`onWaiting`のバージョン。

#### 注意点 {/*common-caveats*/}

- `children`と`dangerouslySetInnerHTML`を同時に渡すことはできません。
- 一部のイベント（例えば`onAbort`や`onLoad`）はブラウザではバブルしませんが、Reactではバブルします。

---

### `ref`コールバック関数 {/*ref-callback*/}

[`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)から返されるrefオブジェクトの代わりに、`ref`属性に関数を渡すことができます。

```js
<div ref={(node) => console.log(node)} />
```

[`ref`コールバックの使用例を参照してください。](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

`<div>` DOMノードが画面に追加されると、ReactはDOM `node`を引数として`ref`コールバックを呼び出します。その`<div>` DOMノードが削除されると、Reactは`null`を引数として`ref`コールバックを呼び出します。

Reactは、異なる`ref`コールバックを渡すたびに`ref`コールバックを呼び出します。上記の例では、`(node) => { ... }`は毎回異なる関数です。コンポーネントが再レンダリングされると、*前の*関数は引数として`null`を受け取り、*次の*関数はDOMノードを受け取ります。

#### パラメータ {/*ref-callback-parameters*/}

* `node`: DOMノードまたは`null`。refがアタッチされると、ReactはDOMノードを渡し、refがデタッチされると`null`を渡します。毎回同じ関数参照を`ref`コールバックに渡さない限り、コールバックはコンポーネントの再レンダリング中に一時的にデタッチされ、再アタッチされます。

<Canary>

#### 戻り値 {/*returns*/}

*  **オプション** `クリーンアップ関数`: refがデタッチされると、Reactはクリーンアップ関数を呼び出します。refコールバックが関数を返さない場合、Reactはrefがデタッチされるときに再度コールバックを`null`を引数として呼び出します。

```js

<div ref={(node) => {
  console.log(node);

  return () => {
    console.log('クリーンアップ', node)
  }
}}>

```

#### 注意点 {/*caveats*/}

* ストリクトモードがオンの場合、Reactは**最初の実際のセットアップの前に1回の開発専用のセットアップ+クリーンアップサイクルを実行します**。これは、クリーンアップロジックがセットアップロジックを「ミラーリング」し、セットアップが行っていることを停止または元に戻すことを確認するためのストレステストです。これが問題を引き起こす場合、クリーンアップ関数を実装してください。
* 異なる`ref`コールバックを渡すと、Reactは*前の*コールバックのクリーンアップ関数を呼び出します。クリーンアップ関数が定義されていない場合、`ref`コールバックは引数として`null`を受け取ります。*次の*関数はDOMノードを受け取ります。

</Canary>

---

### Reactイベントオブジェクト {/*react-event-object*/}

イベントハンドラーは*Reactイベントオブジェクト*を受け取ります。これは「合成イベント」とも呼ばれることがあります。

```js
<button onClick={e => {
  console.log(e); // Reactイベントオブジェクト
}} />
```

これは基礎となるDOMイベントと同じ標準に準拠していますが、いくつかのブラウザの不一致を修正しています。

一部のReactイベントはブラウザのネイティブイベントに直接マッピングされません。例えば、`onMouseLeave`では、`e.nativeEvent`は`mouseout`イベントを指します。特定のマッピングは公開APIの一部ではなく、将来的に変更される可能性があります。何らかの理由で基礎となるブラウザイベントが必要な場合は、`e.nativeEvent`から読み取ってください。

#### プロパティ {/*react-event-object-properties*/}

Reactイベントオブジェクトは、標準
の[`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)プロパティの一部を実装しています：

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): ブール値。イベントがDOMを通じてバブルするかどうかを返します。
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): ブール値。イベントがキャンセル可能かどうかを返します。
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): DOMノード。Reactツリー内で現在のハンドラーがアタッチされているノードを返します。
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): ブール値。`preventDefault`が呼び出されたかどうかを返します。
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): 数値。イベントが現在どのフェーズにあるかを返します。
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): ブール値。イベントがユーザーによって開始されたかどうかを返します。
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): DOMノード。イベントが発生したノードを返します（これは遠い子要素である可能性があります）。
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): 数値。イベントが発生した時間を返します。

さらに、Reactイベントオブジェクトはこれらのプロパティを提供します：

* `nativeEvent`: DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)。元のブラウザイベントオブジェクト。

#### メソッド {/*react-event-object-methods*/}

Reactイベントオブジェクトは、標準の[`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)メソッドの一部を実装しています：

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): イベントのデフォルトのブラウザアクションを防ぎます。
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Reactツリーを通じてイベントの伝播を停止します。

さらに、Reactイベントオブジェクトはこれらのメソッドを提供します：

* `isDefaultPrevented()`: `preventDefault`が呼び出されたかどうかを示すブール値を返します。
* `isPropagationStopped()`: `stopPropagation`が呼び出されたかどうかを示すブール値を返します。
* `persist()`: React DOMでは使用されません。React Nativeでは、イベントのプロパティを読み取るためにこれを呼び出します。
* `isPersistent()`: React DOMでは使用されません。React Nativeでは、`persist`が呼び出されたかどうかを返します。

#### 注意点 {/*react-event-object-caveats*/}

* `currentTarget`、`eventPhase`、`target`、および`type`の値は、Reactコードが期待する値を反映しています。内部的には、Reactはルートでイベントハンドラーをアタッチしますが、これはReactイベントオブジェクトには反映されません。例えば、`e.currentTarget`は基礎となる`e.nativeEvent.currentTarget`と同じではない場合があります。ポリフィルされたイベントでは、`e.type`（Reactイベントタイプ）は`e.nativeEvent.type`（基礎となるタイプ）と異なる場合があります。

---

### `AnimationEvent`ハンドラー関数 {/*animationevent-handler*/}

[CSSアニメーション](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)イベントのためのイベントハンドラータイプ。

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### パラメータ {/*animationevent-handler-parameters*/}

* `e`: これらの追加の[`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent`ハンドラー関数 {/*clipboadevent-handler*/}

[クリップボードAPI](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)イベントのためのイベントハンドラータイプ。

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### パラメータ {/*clipboadevent-handler-parameters*/}

* `e`: これらの追加の[`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent`ハンドラー関数 {/*compositionevent-handler*/}

[入力メソッドエディタ（IME）](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)イベントのためのイベントハンドラータイプ。

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### パラメータ {/*compositionevent-handler-parameters*/}

* `e`: これらの追加の[`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent`ハンドラー関数 {/*dragevent-handler*/}

[HTMLドラッグアンドドロップAPI](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)イベントのためのイベントハンドラータイプ。

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    ドラッグソース
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    ドロップターゲット
  </div>
</>
```

#### パラメータ {/*dragevent-handler-parameters*/}

* `e`: これらの追加の[`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  また、継承された[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)プロパティも含まれます：

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承された[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティも含まれます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent`ハンドラー関数 {/*focusevent-handler*/}

フォーカスイベントのためのイベントハンドラータイプ。

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[例を参照してください。](#handling-focus-events)

#### パラメータ {/*focusevent-handler-parameters*/}

* `e`: これらの追加の[`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  また、継承された[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティも含まれます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event`ハンドラー関数 {/*event-handler*/}

汎用イベントのためのイベントハンドラータイプ。

#### パラメータ {/*event-handler-parameters*/}

* `e`: 追加のプロパティを持たない[Reactイベントオブジェクト](#react-event-object)。

---

### `InputEvent`ハンドラー関数 {/*inputevent-handler*/}

`onBeforeInput`イベントのためのイベントハンドラータイプ。

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### パラメータ {/*inputevent-handler-parameters*/}

* `e`: これらの追加の[`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent`ハンドラー関数 {/*keyboardevent-handler*/}

キーボードイベントのためのイベントハンドラータイプ。

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[例を参照してください。](#handling-keyboard-events)

#### パラメータ {/*keyboardevent-handler-parameters*/}

* `e`: これらの追加の[`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  また、継承された[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティも含まれます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent`ハンドラー関数 {/*mouseevent-handler*/}

マウスイベントのためのイベントハンドラータイプ。

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[例を参照してください。](#handling-mouse-events)

#### パラメータ {/*mouseevent-handler-parameters*/}

* `e`: これらの追加の[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承された[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティも含まれます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent`ハンドラー関数 {/*pointerevent-handler*/}

[ポインタイベント](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)のためのイベントハンドラータイプ。

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[例を参照してください。](#handling-pointer-events)

#### パラメータ {/*pointerevent-handler-parameters*/}

* `e`: これらの追加の[`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer
.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  また、継承された[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)プロパティも含まれます：

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承された[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティも含まれます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent`ハンドラー関数 {/*touchevent-handler*/}

[タッチイベント](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)のためのイベントハンドラータイプ。

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### パラメータ {/*touchevent-handler-parameters*/}

* `e`: これらの追加の[`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  また、継承された[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティも含まれます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent`ハンドラー関数 {/*transitionevent-handler*/}

CSSトランジションイベントのためのイベントハンドラータイプ。

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### パラメータ {/*transitionevent-handler-parameters*/}

* `e`: これらの追加の[`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent`ハンドラー関数 {/*uievent-handler*/}

汎用UIイベントのためのイベントハンドラータイプ。

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### パラメータ {/*uievent-handler-parameters*/}

* `e`: これらの追加の[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent`ハンドラー関数 {/*wheelevent-handler*/}

`onWheel`イベントのためのイベントハンドラータイプ。

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### パラメータ {/*wheelevent-handler-parameters*/}

* `e`: これらの追加の[`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)プロパティを持つ[Reactイベントオブジェクト](#react-event-object):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  また、継承された[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)プロパティも含まれます：

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承された[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)プロパティも含まれます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## 使用法 {/*usage*/}

### CSSスタイルの適用 {/*applying-css-styles*/}

Reactでは、[`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)を使用してCSSクラスを指定します。これはHTMLの`class`属性と同様に機能します：

```js
<img className="avatar" />
```

次に、別のCSSファイルでそのためのCSSルールを書きます：

```css
/* あなたのCSS内 */
.avatar {
  border-radius: 50%;
}
```

ReactはCSSファイルの追加方法を規定していません。最も簡単な場合、HTMLに[`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)タグを追加します。ビルドツールやフレームワークを使用している場合、そのドキュメントを参照してプロジェクトにCSSファイルを追加する方法を学んでください。

時々、スタイル値はデータに依存します。`style`属性を使用して動的にスタイルを渡します：

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

上記の例では、`style={{}}`は特別な構文ではなく、`style={ }` [JSX中括弧](https://reactjs.org/docs/introducing-jsx.html#embedding-expressions-in-jsx)内の通常の`{}`オブジェクトです。スタイルがJavaScript変数に依存する場合にのみ`style`属性を使用することをお勧めします。

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### 複数のCSSクラスを条件付きで適用する方法 {/*how-to-apply-multiple-css-classes-conditionally*/}

CSSクラスを条件付きで適用するには、JavaScriptを使用して`className`文字列を生成する必要があります。

例えば、`className={'row ' + (isSelected ? 'selected': '')}`は、`isSelected`が`true`かどうかに応じて`className="row"`または`className="row selected"`を生成します。

これをより読みやすくするために、[`classnames`](https://github.com/JedWatson/classnames)のような小さなヘルパーライブラリを使用できます：

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

複数の条件付きクラスがある場合には特に便利です：

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### refを使用してDOMノードを操作する {/*manipulating-a-dom-node-with-a-ref*/}

時々、JSX内のタグに関連付けられたブラウザのDOMノードを取得する必要があります。例えば、ボタンがクリックされたときに`<input>`にフォーカスを当てたい場合、ブラウザの`<input>` DOMノードに[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)を呼び出す必要があります。

タグのブラウザDOMノードを取得するには、[refを宣言し](/reference/react/useRef)、そのタグに`ref`属性として渡します：

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

Reactは、`inputRef.current`にDOMノードをレンダリング後に格納します。

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
        フォーカスを入力
      </button>
    </>
  );
}
```

</Sandpack>

[refを使用してDOMを操作する方法について詳しく読む](/learn/manipulating-the-dom-with-refs)および[さらに多くの例を確認する](/reference/react/useRef#examples-dom)

より高度な使用例のために、`ref`属性は[コールバック関数](#ref-callback)も受け入れます。

---

### 内部HTMLを危険に設定する {/*dangerously-setting-the-inner-html*/}

生のHTML文字列を要素に渡すことができます：

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**これは危険です。基礎となるDOMの[`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)プロパティと同様に、極めて注意して使用する必要があります！マークアップが完全に信頼できるソースから来ていない限り、この方法で[XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)脆弱性を導入するのは簡単です。**

例えば、MarkdownをHTMLに変換するMarkdownライブラリを使用し、そのパーサーにバグがなく、ユーザーが自分の入力のみを表示する場合、次のように結果のHTMLを表示できます：

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        マークダウンを入力してください：
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // これは出力HTMLが同じユーザーに表示され、
  // このMarkdownパーサーにバグがないと信頼しているため、唯一安全です。
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

`{__html}`オブジェクトは、HTMLが生成される場所にできるだけ近い場所で作成する必要があります。上記の例では、`renderMarkdownToHTML`関数内で行っています。これにより、コード内で使用されるすべての生のHTMLが明示的にマークされ、HTMLを含むと予想される変数のみが`dangerouslySetInnerHTML`に渡されることが保証されます。`<div dangerouslySetInnerHTML={{__html: markup}} />`のようにインラインでオブジェクトを作成することは推奨されません。

任意のHTMLをレンダリングすることがなぜ危険なのかを理解するために、上記のコードを次のように置き換えてみてください：

```js {1-4,7,8}
const post = {
  // この内容がデータベースに保存されていると想像してください。
  content: `<img src="" onerror='alert("あなたはハッキングされました")'>`
};

export default function MarkdownPreview() {
  // 🔴 セキュリティホール：信頼できない入力をdangerouslySetInnerHTMLに渡す
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTMLに埋め込まれたコードが実行されます。ハッカーはこのセキュリティホールを利用してユーザー情報を盗んだり、ユーザーの代わりにアクションを実行したりすることができます。**`dangerouslySetInnerHTML`は信頼できるデータとサニタイズされたデータにのみ使用してください。**

---

### マウスイベントの処理 {/*handling-mouse-events*/}

この例は、いくつかの一般的な[マウスイベント](#mouseevent-handler)とそれらが発火するタイミングを示しています。

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (親)')}
      onMouseLeave={e => console.log('onMouseLeave (親)')}
    >
      <button
        onClick={e => console.log('onClick (最初のボタン)')}
        onMouseDown={e => console.log('onMouseDown (最初のボタン)')}
        onMouseEnter={e => console.log('onMouseEnter (最初のボタン)')}
        onMouseLeave={e => console.log('onMouseLeave (最初のボタン)')}
        onMouseOver={e => console.log('onMouseOver (最初のボタン)')}
        onMouseUp={e => console.log('onMouseUp (最初のボタン)')}
      >
        最初のボタン
      </button>
      <button
        onClick={e => console.log('onClick (2番目のボタン)')}
        onMouseDown={e => console.log('onMouseDown (2番目のボタン)')}
        onMouseEnter={e => console.log('onMouseEnter (2番目のボタン)')}
        onMouseLeave={e => console.log('onMouseLeave (2番目のボタン)')}
        onMouseOver={e => console.log('onMouseOver (2番目のボタン)')}
        onMouseUp={e => console.log('onMouseUp (2番目のボタン)')}
      >
        2番目のボタン
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### ポインタイベントの処理 {/*handling-pointer-events*/}

この例は、いくつかの一般的な[ポインタイベント](#pointerevent-handler)とそれらが発火するタイミングを示しています。

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (親)')}
      onPointerLeave={e => console.log('onPointerLeave (親)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (最初の子)')}
        onPointerEnter={e => console.log('onPointerEnter (最初の子)')}
        onPointerLeave={e => console.log('onPointerLeave (最初の子)')}
        onPointerMove={e => console.log('onPointerMove (最初の子)')}
        onPointerUp={e => console.log('onPointerUp (最初の子)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        最初の子
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (2番目の子)')}
        onPointerEnter={e => console.log('onPointerEnter (2番目の子)')}
        onPointerLeave={e => console.log('onPointerLeave (2番目の子)')}
        onPointerMove={e => console.log('onPointerMove (2番目の子)')}
        onPointerUp={e => console.log('onPointerUp (2番目の子)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        2番目の子
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### フォーカスイベントの処理 {/*handling-focus-events*/}

Reactでは、[フォーカスイベント](#focusevent-handler)はバブルします。`currentTarget`と`relatedTarget`を使用して、フォーカスまたはブラーイベントが親要素の外部から発生したかどうかを区別できます。この例は、子要素にフォーカスが当たった場合、親要素にフォーカスが当たった場合、およびフォーカスがサブツリー全体に入ったり出たりする場合を検出する方法を示しています。

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('親にフォーカス');
        } else {
          console.log('子にフォーカス', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // 子間でフォーカスを切り替えるときにはトリガーされません
          console.log('親にフォーカスが入りました');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('親のフォーカスが外れました');
        } else {
          console.log('子のフォーカスが外れました', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // 子間でフォーカスを切り替えるときにはトリガーされません
          console.log('親からフォーカスが外れました');
        }
      }}
    >
      <label>
        名前：
        <input name="firstName" />
      </label>
      <label>
        苗字：
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### キーボードイベントの処理 {/*handling-keyboard-events*/}

この例は、いくつかの一般的な[キーボードイベント](#keyboardevent-handler)とそれらが発火するタイミングを示しています。

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      名前：
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>