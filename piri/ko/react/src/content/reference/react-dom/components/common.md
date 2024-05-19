---
title: 일반적인 컴포넌트 (예: <div>)
---

<Intro>

모든 내장 브라우저 컴포넌트는 [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)와 같은 공통 props와 이벤트를 지원합니다.

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### 공통 컴포넌트 (예: `<div>`) {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### Props {/*common-props*/}

이 특수한 React props는 모든 내장 컴포넌트에서 지원됩니다:

* `children`: React 노드 (요소, 문자열, 숫자, [포털,](/reference/react-dom/createPortal) `null`, `undefined` 및 불리언과 같은 빈 노드 또는 다른 React 노드의 배열). 컴포넌트 내부의 내용을 지정합니다. JSX를 사용할 때는 태그를 중첩하여 `<div><span /></div>`와 같이 `children` prop을 암시적으로 지정하는 경우가 많습니다.

* `dangerouslySetInnerHTML`: `{ __html: '<p>some html</p>' }` 형식의 객체로, 내부에 원시 HTML 문자열이 있습니다. DOM 노드의 [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) 속성을 덮어쓰고 전달된 HTML을 내부에 표시합니다. 이 속성은 매우 신중하게 사용해야 합니다! 내부 HTML이 신뢰할 수 없는 경우 (예: 사용자 데이터 기반) [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 취약점을 도입할 위험이 있습니다. [`dangerouslySetInnerHTML` 사용에 대해 더 읽어보세요.](#dangerously-setting-the-inner-html)

* `ref`: [`useRef`](/reference/react/useRef) 또는 [`createRef`](/reference/react/createRef)에서 가져온 ref 객체, [`ref` 콜백 함수,](#ref-callback) 또는 [레거시 refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)를 위한 문자열. 이 노드에 대한 DOM 요소로 ref가 채워집니다. [refs로 DOM 조작에 대해 더 읽어보세요.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: 불리언. `true`인 경우, `children`과 `contentEditable={true}`를 모두 가진 요소에 대해 React가 표시하는 경고를 억제합니다 (일반적으로 함께 작동하지 않음). `contentEditable` 콘텐츠를 수동으로 관리하는 텍스트 입력 라이브러리를 구축하는 경우 사용합니다.

* `suppressHydrationWarning`: 불리언. [서버 렌더링](/reference/react-dom/server)을 사용하는 경우, 서버와 클라이언트가 다른 콘텐츠를 렌더링할 때 경고가 표시됩니다. 일부 드문 경우 (예: 타임스탬프)에는 정확한 일치를 보장하는 것이 매우 어렵거나 불가능합니다. `suppressHydrationWarning`을 `true`로 설정하면 React는 해당 요소의 속성과 콘텐츠의 불일치에 대해 경고하지 않습니다. 이는 한 단계 깊이에서만 작동하며, 탈출구로 사용하도록 의도되었습니다. 과도하게 사용하지 마세요. [하이드레이션 오류 억제에 대해 읽어보세요.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: 예를 들어 `{ fontWeight: 'bold', margin: 20 }`와 같은 CSS 스타일이 포함된 객체. DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) 속성과 유사하게, CSS 속성 이름은 `camelCase`로 작성해야 합니다. 예를 들어 `fontWeight` 대신 `font-weight`를 사용합니다. 값을 문자열이나 숫자로 전달할 수 있습니다. 숫자를 전달하면, 예를 들어 `width: 100`인 경우 React는 자동으로 값에 `px`("픽셀")을 추가합니다. [단위 없는 속성](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57)이 아닌 경우에만 해당됩니다. 스타일 값을 미리 알 수 없는 동적 스타일에만 `style`을 사용하는 것이 좋습니다. 다른 경우에는 `className`으로 평범한 CSS 클래스를 적용하는 것이 더 효율적입니다. [`className`과 `style`에 대해 더 읽어보세요.](#applying-css-styles)

이 표준 DOM props도 모든 내장 컴포넌트에서 지원됩니다:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): 문자열. 요소에 대한 키보드 단축키를 지정합니다. [일반적으로 권장되지 않음.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA 속성은 이 요소에 대한 접근성 트리 정보를 지정할 수 있게 합니다. [ARIA 속성](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)에서 전체 참조를 확인하세요. React에서는 모든 ARIA 속성 이름이 HTML과 정확히 동일합니다.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): 문자열. 사용자 입력을 대문자로 변환할지 여부와 방법을 지정합니다.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): 문자열. 요소의 CSS 클래스 이름을 지정합니다. [CSS 스타일 적용에 대해 더 읽어보세요.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): 불리언. `true`인 경우, 브라우저는 사용자가 렌더링된 요소를 직접 편집할 수 있게 합니다. 이는 [Lexical](https://lexical.dev/)과 같은 리치 텍스트 입력 라이브러리를 구현하는 데 사용됩니다. React는 `contentEditable={true}`인 요소에 React children을 전달하려고 하면 경고합니다. 이는 사용자가 편집한 후 React가 해당 콘텐츠를 업데이트할 수 없기 때문입니다.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): 데이터 속성은 예를 들어 `data-fruit="banana"`와 같이 요소에 문자열 데이터를 첨부할 수 있게 합니다. React에서는 일반적으로 props나 state에서 데이터를 읽기 때문에 자주 사용되지 않습니다.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): `'ltr'` 또는 `'rtl'`. 요소의 텍스트 방향을 지정합니다.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): 불리언. 요소가 드래그 가능한지 여부를 지정합니다. [HTML 드래그 앤 드롭 API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)의 일부입니다.
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): 문자열. 가상 키보드에서 Enter 키에 대한 동작을 지정합니다.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): 문자열. [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) 및 [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)에 대해 [레이블을 일부 컨트롤과 연결](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for)할 수 있게 합니다. React는 표준 DOM 속성 이름(`htmlFor`)을 사용합니다.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): 불리언 또는 문자열. 요소가 숨겨져야 하는지 여부를 지정합니다.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): 문자열. 이 요소에 대한 고유 식별자를 지정합니다. 나중에 찾거나 다른 요소와 연결하는 데 사용할 수 있습니다. [`useId`](/reference/react/useId)로 생성하여 동일한 컴포넌트의 여러 인스턴스 간의 충돌을 피하세요.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): 문자열. 지정된 경우, 컴포넌트는 [커스텀 요소](/reference/react-dom/components#custom-html-elements)처럼 동작합니다.
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): 문자열. 어떤 종류의 키보드를 표시할지 지정합니다 (예: 텍스트, 숫자 또는 전화).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): 문자열. 구조화된 데이터 크롤러에 대해 요소가 나타내는 속성을 지정합니다.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): 문자열. 요소의 언어를 지정합니다.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): [`AnimationEvent` 핸들러](#animationevent-handler) 함수. CSS 애니메이션이 완료될 때 발생합니다.
* `onAnimationEndCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onAnimationEnd`의 버전입니다.
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): [`AnimationEvent` 핸들러](#animationevent-handler) 함수. CSS 애니메이션의 반복이 끝나고 다른 반복이 시작될 때 발생합니다.
* `onAnimationIterationCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onAnimationIteration`의 버전입니다.
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): [`AnimationEvent` 핸들러](#animationevent-handler) 함수. CSS 애니메이션이 시작될 때 발생합니다.
* `onAnimationStartCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onAnimationStart`의 버전입니다.
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 비주요 포인터 버튼이 클릭될 때 발생합니다.
* `onAuxClickCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onAuxClick`의 버전입니다.
* `onBeforeInput`: [`InputEvent` 핸들러](#inputevent-handler) 함수. 편집 가능한 요소의 값이 수정되기 전에 발생합니다. React는 아직 네이티브 [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) 이벤트를 사용하지 않으며, 대신 다른 이벤트를 사용하여 폴리필하려고 시도합니다.
* `onBeforeInputCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onBeforeInput`의 버전입니다.
* `onBlur`: [`FocusEvent` 핸들러](#focusevent-handler) 함수. 요소가 포커스를 잃을 때 발생합니다. 내장 브라우저 [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) 이벤트와 달리, React에서는 `onBlur` 이벤트가 버블링됩니다.
* `onBlurCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onBlur`의 버전입니다.
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터 장치의 주요 버튼이 클릭될 때 발생합니다.
* `onClickCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onClick`의 버전입니다.
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): [`CompositionEvent` 핸들러](#compositionevent-handler) 함수. [입력 방법 편집기](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)가 새로운 구성 세션을 시작할 때 발생합니다.
* `onCompositionStartCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCompositionStart`의 버전입니다.
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): [`CompositionEvent` 핸들러](#compositionevent-handler) 함수. [입력 방법 편집기](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)가 구성 세션을 완료하거나 취소할 때 발생합니다.
* `onCompositionEndCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCompositionEnd`의 버전입니다.
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): [`CompositionEvent` 핸들러](#compositionevent-handler) 함수. [입력 방법 편집기](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)가 새 문자를 받을 때 발생합니다.
* `onCompositionUpdateCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCompositionUpdate`의 버전입니다.
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 사용자가 컨텍스트 메뉴를 열려고 할 때 발생합니다.
* `onContextMenuCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onContextMenu`의 버전입니다.
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): [`ClipboardEvent` 핸들러](#clipboardevent-handler) 함수. 사용자가 무언가를 클립보드에 복사하려고 할 때 발생합니다.
* `onCopyCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCopy`의 버전입니다.
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): [`ClipboardEvent` 핸들러](#clipboardevent-handler) 함수. 사용자가 무언가를 클립보드에 잘라내려고 할 때 발생합니다.
* `onCutCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCut`의 버전입니다.
* `onDoubleClick`: [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 사용자가 두 번 클릭할 때 발생합니다. 브라우저 [`dblclick` 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)에 해당합니다.
* `onDoubleClickCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDoubleClick`의 버전입니다.
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 사용자가 무언가를 드래그하는 동안 발생합니다.
* `onDragCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDrag`의 버전입니다.
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 사용자가 무언가를 드래그하는 것을 멈출 때 발생합니다.
* `onDragEndCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDragEnd`의 버전입니다.
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 드래그된 콘텐츠가 유효한 드롭 대상에 들어갈 때 발생합니다.
* `onDragEnterCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDragEnter`의 버전입니다.
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 드래그된 콘텐츠가 유효한 드롭 대상 위로 드래그될 때 발생합니다. 드롭을 허용하려면 여기서 `e.preventDefault()`를 호출해야 합니다.
* `onDragOverCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDragOver`의 버전입니다.
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 사용자가 요소를 드래그하기 시작할 때 발생합니다.
* `onDragStartCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDragStart`의 버전입니다.
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 무언가가 유효한 드롭 대상에 드롭될 때 발생합니다.
* `onDropCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDrop`의 버전입니다.
* `onFocus`: [`FocusEvent` 핸들러](#focusevent-handler) 함수. 요소가 포커스를 받을 때 발생합니다. 내장 브라우저 [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) 이벤트와 달리, React에서는 `onFocus` 이벤트가 버블링됩니다.
* `onFocusCapture`:
[캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onFocus`의 버전입니다.
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 요소가 프로그래밍적으로 포인터를 캡처할 때 발생합니다.
* `onGotPointerCaptureCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onGotPointerCapture`의 버전입니다.
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): [`KeyboardEvent` 핸들러](#keyboardevent-handler) 함수. 키가 눌릴 때 발생합니다.
* `onKeyDownCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onKeyDown`의 버전입니다.
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): [`KeyboardEvent` 핸들러](#keyboardevent-handler) 함수. 사용되지 않음. 대신 `onKeyDown` 또는 `onBeforeInput`을 사용하세요.
* `onKeyPressCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onKeyPress`의 버전입니다.
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): [`KeyboardEvent` 핸들러](#keyboardevent-handler) 함수. 키가 놓일 때 발생합니다.
* `onKeyUpCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onKeyUp`의 버전입니다.
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 요소가 포인터 캡처를 중지할 때 발생합니다.
* `onLostPointerCaptureCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onLostPointerCapture`의 버전입니다.
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 눌릴 때 발생합니다.
* `onMouseDownCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onMouseDown`의 버전입니다.
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 요소 내부로 이동할 때 발생합니다. 캡처 단계가 없습니다. 대신, `onMouseLeave`와 `onMouseEnter`는 떠나는 요소에서 들어가는 요소로 전파됩니다.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 요소 외부로 이동할 때 발생합니다. 캡처 단계가 없습니다. 대신, `onMouseLeave`와 `onMouseEnter`는 떠나는 요소에서 들어가는 요소로 전파됩니다.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 좌표를 변경할 때 발생합니다.
* `onMouseMoveCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onMouseMove`의 버전입니다.
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 요소 외부로 이동하거나 자식 요소로 이동할 때 발생합니다.
* `onMouseOutCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onMouseOut`의 버전입니다.
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 놓일 때 발생합니다.
* `onMouseUpCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onMouseUp`의 버전입니다.
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 브라우저가 포인터 상호작용을 취소할 때 발생합니다.
* `onPointerCancelCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPointerCancel`의 버전입니다.
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 활성화될 때 발생합니다.
* `onPointerDownCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPointerDown`의 버전입니다.
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 요소 내부로 이동할 때 발생합니다. 캡처 단계가 없습니다. 대신, `onPointerLeave`와 `onPointerEnter`는 떠나는 요소에서 들어가는 요소로 전파됩니다.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 요소 외부로 이동할 때 발생합니다. 캡처 단계가 없습니다. 대신, `onPointerLeave`와 `onPointerEnter`는 떠나는 요소에서 들어가는 요소로 전파됩니다.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 좌표를 변경할 때 발생합니다.
* `onPointerMoveCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPointerMove`의 버전입니다.
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 요소 외부로 이동하거나 포인터 상호작용이 취소될 때 발생합니다. [다른 몇 가지 이유로도 발생합니다.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPointerOut`의 버전입니다.
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 더 이상 활성화되지 않을 때 발생합니다.
* `onPointerUpCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPointerUp`의 버전입니다.
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): [`ClipboardEvent` 핸들러](#clipboardevent-handler) 함수. 사용자가 클립보드에서 무언가를 붙여넣으려고 할 때 발생합니다.
* `onPasteCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPaste`의 버전입니다.
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): [`Event` 핸들러](#event-handler) 함수. 요소가 스크롤될 때 발생합니다. 이 이벤트는 버블링되지 않습니다.
* `onScrollCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onScroll`의 버전입니다.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` 핸들러](#event-handler) 함수. 편집 가능한 요소 내부의 선택이 변경된 후에 발생합니다. React는 `contentEditable={true}` 요소에 대해서도 `onSelect` 이벤트를 확장합니다. 또한, React는 빈 선택 및 편집 시에도 발생하도록 확장합니다 (편집이 선택에 영향을 미칠 수 있음).
* `onSelectCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onSelect`의 버전입니다.
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 브라우저가 터치 상호작용을 취소할 때 발생합니다.
* `onTouchCancelCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onTouchCancel`의 버전입니다.
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 하나 이상의 터치 포인트가 제거될 때 발생합니다.
* `onTouchEndCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onTouchEnd`의 버전입니다.
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 하나 이상의 터치 포인트가 이동할 때 발생합니다.
* `onTouchMoveCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onTouchMove`의 버전입니다.
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 하나 이상의 터치 포인트가 배치될 때 발생합니다.
* `onTouchStartCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onTouchStart`의 버전입니다.
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): [`TransitionEvent` 핸들러](#transitionevent-handler) 함수. CSS 전환이 완료될 때 발생합니다.
* `onTransitionEndCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onTransitionEnd`의 버전입니다.
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): [`WheelEvent` 핸들러](#wheelevent-handler) 함수. 사용자가 휠 버튼을 회전할 때 발생합니다.
* `onWheelCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onWheel`의 버전입니다.
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 문자열. 접근성 기술을 위해 요소 역할을 명시적으로 지정합니다.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 문자열. 섀도우 DOM을 사용할 때 슬롯 이름을 지정합니다. React에서는 일반적으로 JSX를 props로 전달하여 이와 동등한 패턴을 달성합니다. 예를 들어 `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): 불리언 또는 null. `true` 또는 `false`로 명시적으로 설정된 경우, 맞춤법 검사를 활성화하거나 비활성화합니다.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): 숫자. 기본 Tab 버튼 동작을 재정의합니다. [다른 값 사용을 피하세요.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): 문자열. 요소에 대한 툴팁 텍스트를 지정합니다.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'` 또는 `'no'`. `'no'`를 전달하면 요소 콘텐츠가 번역에서 제외됩니다.

또한, 예를 들어 `mycustomprop="someValue"`와 같이 사용자 정의 속성을 props로 전달할 수 있습니다. 이는 타사 라이브러리와 통합할 때 유용할 수 있습니다. 사용자 정의 속성 이름은 소문자여야 하며 `on`으로 시작해서는 안 됩니다. 값은 문자열로 변환됩니다. `null` 또는 `undefined`를 전달하면 사용자 정의 속성이 제거됩니다.

이 이벤트는 [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) 요소에만 발생합니다:

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): [`Event` 핸들러](#event-handler) 함수. 폼이 리셋될 때 발생합니다.
* `onResetCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onReset`의 버전입니다.
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): [`Event` 핸들러](#event-handler) 함수. 폼이 제출될 때 발생합니다.
* `onSubmitCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onSubmit`의 버전입니다.

이 이벤트는 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) 요소에만 발생합니다. 브라우저 이벤트와 달리, React에서는 버블링됩니다:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): [`Event` 핸들러](#event-handler) 함수. 사용자가 대화 상자를 닫으려고 할 때 발생합니다.
* `onCancelCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCancel`의 버전입니다.
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): [`Event` 핸들러](#event-handler) 함수. 대화 상자가 닫힐 때 발생합니다.
* `onCloseCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onClose`의 버전입니다.

이 이벤트는 [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) 요소에만 발생합니다. 브라우저 이벤트와 달리, React에서는 버블링됩니다:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): [`Event` 핸들러](#event-handler) 함수. 사용자가 세부 정보를 토글할 때 발생합니다.
* `onToggleCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onToggle`의 버전입니다.

이 이벤트는 [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) 및 [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag) 요소에만 발생합니다. 브라우저 이벤트와 달리, React에서는 버블링됩니다:

* `onLoad`: [`Event` 핸들러](#event-handler) 함수. 리소스가 로드될 때 발생합니다.
* `onLoadCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onLoad`의 버전입니다.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` 핸들러](#event-handler) 함수. 리소스를 로드할 수 없을 때 발생합니다.
* `onErrorCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onError`의 버전입니다.

이 이벤트는 [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) 및 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)와 같은 리소스에만 발생합니다. 브라우저 이벤트와 달리, React에서는 버블링됩니다:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): [`Event` 핸들러](#event-handler) 함수. 리소스가 완전히 로드되지 않았지만 오류로 인한 것이 아닐 때 발생합니다.
* `onAbortCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onAbort`의 버전입니다.
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): [`Event` 핸들러](#event-handler) 함수. 재생을 시작할 수 있을 만큼 데이터가 충분하지만 버퍼링 없이 끝까지 재생할 수 있을 만큼 충분하지 않을 때 발생합니다.
* `onCanPlayCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCanPlay`의 버전입니다.
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): [`Event` 핸들러](#event-handler) 함수. 버퍼링 없이 끝까지 재생할 수 있을 만큼 데이터가 충분할 때 발생합니다.
* `onCanPlayThroughCapture`: [
캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onCanPlayThrough`의 버전입니다.
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): [`Event` 핸들러](#event-handler) 함수. 미디어의 지속 시간이 업데이트될 때 발생합니다.
* `onDurationChangeCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onDurationChange`의 버전입니다.
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 비어 있을 때 발생합니다.
* `onEmptiedCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onEmptied`의 버전입니다.
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): [`Event` 핸들러](#event-handler) 함수. 브라우저가 암호화된 미디어를 만날 때 발생합니다.
* `onEncryptedCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onEncrypted`의 버전입니다.
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): [`Event` 핸들러](#event-handler) 함수. 재생이 중지되고 더 이상 재생할 것이 없을 때 발생합니다.
* `onEndedCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onEnded`의 버전입니다.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` 핸들러](#event-handler) 함수. 리소스를 로드할 수 없을 때 발생합니다.
* `onErrorCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onError`의 버전입니다.
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): [`Event` 핸들러](#event-handler) 함수. 현재 재생 프레임이 로드될 때 발생합니다.
* `onLoadedDataCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onLoadedData`의 버전입니다.
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): [`Event` 핸들러](#event-handler) 함수. 메타데이터가 로드될 때 발생합니다.
* `onLoadedMetadataCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onLoadedMetadata`의 버전입니다.
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): [`Event` 핸들러](#event-handler) 함수. 브라우저가 리소스를 로드하기 시작할 때 발생합니다.
* `onLoadStartCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onLoadStart`의 버전입니다.
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 일시 중지될 때 발생합니다.
* `onPauseCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPause`의 버전입니다.
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 더 이상 일시 중지되지 않을 때 발생합니다.
* `onPlayCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPlay`의 버전입니다.
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 시작되거나 다시 시작될 때 발생합니다.
* `onPlayingCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onPlaying`의 버전입니다.
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): [`Event` 핸들러](#event-handler) 함수. 리소스가 로드되는 동안 주기적으로 발생합니다.
* `onProgressCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onProgress`의 버전입니다.
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): [`Event` 핸들러](#event-handler) 함수. 재생 속도가 변경될 때 발생합니다.
* `onRateChangeCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onRateChange`의 버전입니다.
* `onResize`: [`Event` 핸들러](#event-handler) 함수. 비디오 크기가 변경될 때 발생합니다.
* `onResizeCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onResize`의 버전입니다.
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): [`Event` 핸들러](#event-handler) 함수. 탐색 작업이 완료될 때 발생합니다.
* `onSeekedCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onSeeked`의 버전입니다.
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): [`Event` 핸들러](#event-handler) 함수. 탐색 작업이 시작될 때 발생합니다.
* `onSeekingCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onSeeking`의 버전입니다.
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): [`Event` 핸들러](#event-handler) 함수. 브라우저가 데이터를 기다리고 있지만 계속 로드되지 않을 때 발생합니다.
* `onStalledCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onStalled`의 버전입니다.
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): [`Event` 핸들러](#event-handler) 함수. 리소스 로드가 일시 중지될 때 발생합니다.
* `onSuspendCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onSuspend`의 버전입니다.
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): [`Event` 핸들러](#event-handler) 함수. 현재 재생 시간이 업데이트될 때 발생합니다.
* `onTimeUpdateCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onTimeUpdate`의 버전입니다.
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): [`Event` 핸들러](#event-handler) 함수. 볼륨이 변경될 때 발생합니다.
* `onVolumeChangeCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onVolumeChange`의 버전입니다.
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): [`Event` 핸들러](#event-handler) 함수. 데이터 부족으로 인해 재생이 일시 중지될 때 발생합니다.
* `onWaitingCapture`: [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 `onWaiting`의 버전입니다.

#### 주의사항 {/*common-caveats*/}

- `children`과 `dangerouslySetInnerHTML`을 동시에 전달할 수 없습니다.
- 일부 이벤트 (예: `onAbort` 및 `onLoad`)는 브라우저에서 버블링되지 않지만 React에서는 버블링됩니다.

---

### `ref` 콜백 함수 {/*ref-callback*/}

[`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)에서 반환된 ref 객체 대신, `ref` 속성에 함수를 전달할 수 있습니다.

```js
<div ref={(node) => console.log(node)} />
```

[`ref` 콜백 사용 예제 보기.](#ref-callback)

`<div>` DOM 노드가 화면에 추가되면, React는 DOM `node`를 인수로 하여 `ref` 콜백을 호출합니다. 해당 `<div>` DOM 노드가 제거되면, React는 `null`을 인수로 하여 `ref` 콜백을 호출합니다.

React는 *다른* `ref` 콜백을 전달할 때마다 `ref` 콜백을 호출합니다. 위의 예제에서 `(node) => { ... }`는 매 렌더링마다 다른 함수입니다. 컴포넌트가 다시 렌더링될 때, *이전* 함수는 인수로 `null`을 전달받아 호출되고, *다음* 함수는 DOM 노드로 호출됩니다.

#### 매개변수 {/*ref-callback-parameters*/}

* `node`: DOM 노드 또는 `null`. ref가 첨부될 때 React는 DOM 노드를 전달하고, ref가 분리될 때 `null`을 전달합니다. 매 렌더링마다 동일한 함수 참조를 `ref` 콜백에 전달하지 않으면, 콜백은 컴포넌트의 매 렌더링 동안 일시적으로 분리되고 다시 첨부됩니다.

<Canary>

#### 반환값 {/*returns*/}

*  **선택적** `정리 함수`: ref가 분리될 때 React는 정리 함수를 호출합니다. ref 콜백에서 함수가 반환되지 않으면, ref가 분리될 때 React는 콜백을 다시 `null` 인수로 호출합니다.

```js

<div ref={(node) => {
  console.log(node);

  return () => {
    console.log('정리', node)
  }
}}>

```

#### 주의사항 {/*caveats*/}

* 엄격 모드가 켜져 있으면, React는 **첫 번째 실제 설정 전에 하나의 추가 개발 전용 설정+정리 사이클을 실행**합니다. 이는 설정 논리가 설정 논리를 "반영"하고 설정이 수행하는 작업을 중지하거나 취소하는지 확인하는 스트레스 테스트입니다. 이로 인해 문제가 발생하면 정리 함수를 구현하세요.
* *다른* `ref` 콜백을 전달할 때, React는 *이전* 콜백의 정리 함수를 호출합니다. 정리 함수가 정의되지 않은 경우, `ref` 콜백은 `null` 인수로 호출됩니다. *다음* 함수는 DOM 노드로 호출됩니다.

</Canary>

---

### React 이벤트 객체 {/*react-event-object*/}

이벤트 핸들러는 *React 이벤트 객체*를 받습니다. 이는 때때로 "합성 이벤트"라고도 합니다.

```js
<button onClick={e => {
  console.log(e); // React 이벤트 객체
}} />
```

이는 기본 DOM 이벤트와 동일한 표준을 따르지만 일부 브라우저 불일치를 수정합니다.

일부 React 이벤트는 브라우저의 네이티브 이벤트와 직접적으로 매핑되지 않습니다. 예를 들어 `onMouseLeave`에서 `e.nativeEvent`는 `mouseout` 이벤트를 가리킵니다. 특정 매핑은 공개 API의 일부가 아니며 향후 변경될 수 있습니다. 어떤 이유로든 기본 브라우저 이벤트가 필요하면 `e.nativeEvent`에서 읽으세요.

#### 속성 {/*react-event-object-properties*/}

React 이벤트 객체는 표준 [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) 속성을 구현합니다:

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): 불리언. 이벤트가 DOM을 통해 버블링되는지 여부를 반환합니다.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): 불리언. 이벤트를 취소할 수 있는지 여부를 반환합니다.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): DOM 노드. React 트리에서 현재 핸들러가 첨부된 노드를 반환합니다.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): 불리언. `preventDefault`가 호출되었는지 여부를 반환합니다.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): 숫자. 이벤트가 현재 어느 단계에 있는지 반환합니다.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): 불리언. 이벤트가 사용자가 시작한 것인지 여부를 반환합니다.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): DOM 노드. 이벤트가 발생한 노드를 반환합니다 (자식일 수 있음).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): 숫자. 이벤트가 발생한 시간을 반환합니다.

추가로, React 이벤트 객체는 다음 속성을 제공합니다:

* `nativeEvent`: DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). 원래 브라우저 이벤트 객체입니다.

#### 메서드 {/*react-event-object-methods*/}

React 이벤트 객체는 표준 [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) 메서드를 구현합니다:

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): 이벤트에 대한 기본 브라우저 동작을 방지합니다.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): React 트리를 통해 이벤트 전파를 중지합니다.

추가로, React 이벤트 객체는 다음 메서드를 제공합니다:

* `isDefaultPrevented()`: `preventDefault`가 호출되었는지 여부를 나타내는 불리언 값을 반환합니다.
* `isPropagationStopped()`: `stopPropagation`이 호출되었는지 여부를 나타내는 불리언 값을 반환합니다.
* `persist()`: React DOM에서는 사용되지 않습니다. React Native에서는 이벤트의 속성을 읽기 위해 이를 호출합니다.
* `isPersistent()`: React DOM에서는 사용되지 않습니다. React Native에서는 `persist`가 호출되었는지 여부를 반환합니다.

#### 주의사항 {/*react-event-object-caveats*/}

* `currentTarget`, `eventPhase`, `target` 및 `type`의 값은 React 코드가 예상하는 값을 반영합니다. 내부적으로 React는 루트에 이벤트 핸들러를 첨부하지만 이는 React 이벤트 객체에 반영되지 않습니다. 예를 들어, `e.currentTarget`은 기본 `e.nativeEvent.currentTarget`과 동일하지 않을 수 있습니다. 폴리필된 이벤트의 경우, `e.type` (React 이벤트 유형)은 `e.nativeEvent.type` (기본 유형)과 다를 수 있습니다.

---

### `AnimationEvent` 핸들러 함수 {/*animationevent-handler*/}

[CSS 애니메이션](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### 매개변수 {/*animationevent-handler-parameters*/}

* `e`: 다음 추가 [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` 핸들러 함수 {/*clipboadevent-handler*/}

[클립보드 API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### 매개변수 {/*clipboadevent-handler-parameters*/}

* `e`: 다음 추가 [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` 핸들러 함수 {/*compositionevent-handler*/}

[입력 방법 편집기 (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### 매개변수 {/*compositionevent-handler-parameters*/}

* `e`: 다음 추가 [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` 핸들러 함수 {/*dragevent-handler*/}

[HTML 드래그 앤 드롭 API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('
onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    드래그 소스
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    드롭 대상
  </div>
</>
```

#### 매개변수 {/*dragevent-handler-parameters*/}

* `e`: 다음 추가 [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  또한 상속된 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성을 포함합니다:

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

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 포함합니다:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` 핸들러 함수 {/*focusevent-handler*/}

포커스 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[예제 보기.](#handling-focus-events)

#### 매개변수 {/*focusevent-handler-parameters*/}

* `e`: 다음 추가 [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 포함합니다:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` 핸들러 함수 {/*event-handler*/}

일반 이벤트에 대한 이벤트 핸들러 유형입니다.

#### 매개변수 {/*event-handler-parameters*/}

* `e`: 추가 속성이 없는 [React 이벤트 객체](#react-event-object).

---

### `InputEvent` 핸들러 함수 {/*inputevent-handler*/}

`onBeforeInput` 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### 매개변수 {/*inputevent-handler-parameters*/}

* `e`: 다음 추가 [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` 핸들러 함수 {/*keyboardevent-handler*/}

키보드 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[예제 보기.](#handling-keyboard-events)

#### 매개변수 {/*keyboardevent-handler-parameters*/}

* `e`: 다음 추가 [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
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

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 포함합니다:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` 핸들러 함수 {/*mouseevent-handler*/}

마우스 이벤트에 대한 이벤트 핸들러 유형입니다.

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

[예제 보기.](#handling-mouse-events)

#### 매개변수 {/*mouseevent-handler-parameters*/}

* `e`: 다음 추가 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
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

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 포함합니다:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` 핸들러 함수 {/*pointerevent-handler*/}

[포인터 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[예제 보기.](#handling-pointer-events)

#### 매개변수 {/*pointerevent-handler-parameters*/}

* `e`: 다음 추가 [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  또한 상속된 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성을 포함합니다:

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

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 포함합니다:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` 핸들러 함수 {/*touchevent-handler*/}

[터치 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### 매개변수 {/*touchevent-handler-parameters*/}

* `e`: 다음 추가 [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 포함합니다:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` 핸들러 함수 {/*transitionevent-handler*/}

CSS 전환 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### 매개변수 {/*transitionevent-handler-parameters*/}

* `e`: 다음 추가 [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` 핸들러 함수 {/*uievent-handler*/}

일반 UI 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### 매개변수 {/*uievent-handler-parameters*/}

* `e`: 다음 추가 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` 핸들러 함수 {/*wheelevent-handler*/}

`onWheel` 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### 매개변수 {/*wheelevent-handler-parameters*/}

* `e`: 다음 추가 [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) 속성이 있는 [React 이벤트 객체](#react-event-object):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)

  또한 상속된 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성을 포함합니다:

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

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 포함합니다:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## 사용법 {/*usage*/}

### CSS 스타일 적용하기 {/*applying-css-styles*/}

React에서는 [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)으로 CSS 클래스를 지정합니다. 이는 HTML의 `class` 속성과 동일하게 작동합니다:

```js
<img className="avatar" />
```

그런 다음 별도의 CSS 파일에 CSS 규칙을 작성합니다:

```css
/* CSS 파일에서 */
.avatar {
  border-radius: 50%;
}
```

React는 CSS 파일을 추가하는 방법을 규정하지 않습니다. 가장 간단한 경우, HTML에 [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) 태그를 추가합니다. 빌드 도구나 프레임워크를 사용하는 경우, 프로젝트에 CSS 파일을 추가하는 방법에 대해 해당 문서를 참조하세요.

때로는 스타일 값이 데이터에 따라 달라집니다. `style` 속성을 사용하여 동적으로 스타일을 전달하세요:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

위의 예제에서 `style={{}}`는 특별한 구문이 아니라, `style={ }` [JSX 중괄호](/learn/javascript-in-jsx-with-curly-braces) 내부의 일반 `{}` 객체입니다. 스타일이 JavaScript 변수에 의존하는 경우에만 `style` 속성을 사용하는 것이 좋습니다.

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

#### 여러 CSS 클래스를 조건부로 적용하는 방법 {/*how-to-apply-multiple-css-classes-conditionally*/}

CSS 클래스를 조건부로 적용하려면, JavaScript를 사용하여 `className` 문자열을 직접 생성해야 합니다.

예를 들어, `className={'row ' + (isSelected ? 'selected': '')}`는 `isSelected`가 `true`인지 여부에 따라 `className="row"` 또는 `className="row selected"`를 생성합니다.

이를 더 읽기 쉽게 만들기 위해 [`classnames`](https://github.com/JedWatson/classnames)와 같은 작은 도우미 라이브러리를 사용할 수 있습니다:

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

여러 조건부 클래스를 가지고 있는 경우 특히 편리합니다:

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

### ref로 DOM 노드 조작하기 {/*manipulating-a-dom-node-with-a-ref*/}

때로는 JSX의 태그와 연결된 브라우저 DOM 노드를 얻어야 할 때가 있습니다. 예를 들어, 버튼이 클릭될 때 `<input>`에 포커스를 맞추려면 브라우저 `<input>` DOM 노드에서 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출해야 합니다.

태그에 대한 브라우저 DOM 노드를 얻으려면, [ref를 선언](/reference/react/useRef)하고 해당 태그에 `ref` 속성으로 전달하세요:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React는 화면에 렌더링된 후 `inputRef.current`에 DOM 노드를 넣습니다.

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
        입력란에 포커스
      </button>
    </>
  );
}
```

</Sandpack>

[refs로 DOM 조작에 대해 더 읽어보세요](/learn/manipulating-the-dom-with-refs) 및 [더 많은 예제 확인](/reference/react/useRef#examples-dom).

더 고급 사용 사례의 경우, `ref` 속성은 [콜백 함수](#ref-callback)도 허용합니다.

---

### 내부 HTML을 위험하게 설정하기 {/*dangerously-setting-the-inner-html*/}

다음과 같이 원시 HTML 문자열을 요소에 전달할 수 있습니다:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**이것은 위험합니다. 기본 DOM [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) 속성과 마찬가지로, 극도로 신중하게 사용해야 합니다! 마크업이 완전히 신뢰할 수 있는 출처에서 오는 것이 아니라면, 이를 통해 [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 취약점을 도입하는 것은 매우 간단합니다.**

예를 들어, Markdown을 HTML로 변환하는 Markdown 라이브러리를 사용하는 경우, 해당 파서에 버그가 없고 사용자가 자신의 입력만 볼 수 있다고 신뢰하는 경우, 다음과 같이 결과 HTML을 표시할 수 있습니다:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        마크다운 입력:
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
  // 이것은 HTML 출력이 동일한 사용자에게 표시되고,
  // 이 Markdown 파서에 버그가 없다고 신뢰하기 때문에 안전합니다.
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

`{__html}` 객체는 HTML이 생성되는 위치에 최대한 가깝게 생성해야 합니다. 위의 예제에서는 `renderMarkdownToHTML` 함수에서 이를 수행합니다. 이는 코드에서 사용되는 모든 원시 HTML이 명시적으로 표시되도록 하고, HTML이 포함될 것으로 예상되는 변수만 `dangerouslySetInnerHTML`에 전달되도록 보장합니다. `<div dangerouslySetInnerHTML={{__html: markup}} />`와 같이 객체를 인라인으로 생성하는 것은 권장되지 않습니다.

임의의 HTML을 렌더링하는 것이 왜 위험한지 보려면, 위의 코드를 다음과 같이 변경하세요:

```js {1-4,7,8}
const post = {
  // 이 콘텐츠가 데이터베이스에 저장되어 있다고 가정합니다.
  content: `<img src="" onerror='alert("해킹당했습니다")'>`
};

export default function MarkdownPreview() {
  // 🔴 보안 문제: 신뢰할 수 없는 입력을 dangerouslySetInnerHTML에 전달
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML에 포함된 코드는 실행됩니다. 해커는 이 보안 문제를 사용하여 사용자 정보를 훔치거나 사용자의 이름으로 작업을 수행할 수 있습니다. **`dangerouslySetInnerHTML`은 신뢰할 수 있고 정제된 데이터와 함께만 사용하세요.**

---

### 마우스 이벤트 처리하기 {/*handling-mouse-events*/}

이 예제는 몇 가지 일반적인 [마우스 이벤트](#mouseevent-handler)와 발생 시점을 보여줍니다.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (부모)')}
      onMouseLeave={e => console.log('onMouseLeave (부모)')}
    >
      <button
        onClick={e => console.log('onClick (첫 번째 버튼)')}
        onMouseDown={e => console.log('onMouseDown (첫 번째 버튼)')}
        onMouseEnter={e => console.log('onMouseEnter (첫 번째 버튼)')}
        onMouseLeave={e => console.log('onMouseLeave (첫 번째 버튼)')}
        onMouseOver={e => console.log('onMouseOver (첫 번째 버튼)')}
        onMouseUp={e => console.log('onMouseUp (첫 번째 버튼)')}
      >
        첫 번째 버튼
      </button>
      <button
        onClick={e => console.log('onClick (두 번째 버튼)')}
        onMouseDown={e => console.log('onMouseDown (두 번째 버튼)')}
        onMouseEnter={e => console.log('onMouseEnter (두 번째 버튼)')}
        onMouseLeave={e => console.log('onMouseLeave (두 번째 버튼)')}
        onMouseOver={e => console.log('onMouseOver (두 번째 버튼)')}
        onMouseUp={e => console.log('onMouseUp (두 번째 버튼)')}
      >
        두 번째 버튼
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

### 포인터 이벤트 처리하기 {/*handling-pointer-events*/}

이 예제는 몇 가지 일반적인 [포인터 이벤트](#pointerevent-handler)와 발생 시점을 보여줍니다.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (부모)')}
      onPointerLeave={e => console.log('onPointerLeave (부모)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (첫 번째 자식)')}
        onPointerEnter={e => console.log('onPointerEnter (첫 번째 자식)')}
        onPointerLeave={e => console.log('onPointerLeave (첫 번째 자식)')}
        onPointerMove={e => console.log('onPointerMove (첫 번째 자식)')}
        onPointerUp={e => console.log('onPointerUp (첫 번째 자식)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        첫 번째 자식
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (두 번째 자식)')}
        onPointerEnter={e => console.log('onPointerEnter (두 번째 자식)')}
        onPointerLeave={e => console.log('onPointerLeave (두 번째 자식)')}
        onPointerMove={e => console.log('onPointerMove (두 번째 자식)')}
        onPointerUp={e => console.log('onPointerUp (두 번째 자식)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        두 번째 자식
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

### 포커스 이벤트 처리하기 {/*handling-focus-events*/}

React에서는 [포커스 이벤트](#focusevent-handler)가 버블링됩니다. `currentTarget`과 `relatedTarget`을 사용하여 포커스 또는 블러링 이벤트가 부모 요소 외부에서 발생했는지 구분할 수 있습니다. 이 예제는 자식에 포커스, 부모 요소에 포커스, 전체 하위 트리에 포커스가 들어오거나 나가는 것을 감지하는 방법을 보여줍니다.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('부모에 포커스');
        } else {
          console.log('자식에 포커스', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // 자식 간 포커스 전환 시에는 트리거되지 않음
          console.log('부모에 포커스 진입');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('부모에서 포커스 해제');
        } else {
          console.log('자식에서 포커스 해제', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // 자식 간 포커스 전환 시에는 트리거되지 않음
          console.log('부모에서 포커스 이탈');
        }
      }}
    >
      <label>
        이름:
        <input name="firstName" />
      </label>
      <label>
        성:
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

### 키보드 이벤트 처리하기 {/*handling-keyboard-events*/}

이 예제는 몇 가지 일반적인 [키보드 이벤트](#keyboardevent-handler)와 발생 시점을 보여줍니다.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      이름:
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