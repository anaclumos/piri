---
title: 알 수 없는 Prop 경고
---

알 수 없는 속성 경고는 React가 합법적인 DOM 속성/프로퍼티로 인식하지 않는 속성을 가진 DOM 요소를 렌더링하려고 할 때 발생합니다. DOM 요소에 불필요한 속성이 떠다니지 않도록 해야 합니다.

이 경고가 나타날 수 있는 몇 가지 가능한 이유는 다음과 같습니다:

1. `{...props}` 또는 `cloneElement(element, props)`를 사용하고 있습니까? 속성을 자식 컴포넌트에 복사할 때, 부모 컴포넌트에만 의도된 속성을 실수로 전달하지 않도록 해야 합니다. 이 문제에 대한 일반적인 해결책은 아래를 참조하십시오.

2. 네이티브 DOM 노드에서 비표준 DOM 속성을 사용하고 있을 수 있습니다. 표준 DOM 요소에 사용자 정의 데이터를 첨부하려는 경우, [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes)에 설명된 대로 사용자 정의 데이터 속성을 사용하는 것을 고려하십시오.

3. React가 아직 지정한 속성을 인식하지 못합니다. 이는 향후 React 버전에서 수정될 가능성이 높습니다. 속성 이름을 소문자로 작성하면 경고 없이 전달할 수 있습니다.

4. 대문자가 아닌 React 컴포넌트를 사용하고 있습니다. 예를 들어 `<myButton />`입니다. React는 이를 DOM 태그로 해석합니다. React JSX 변환은 사용자 정의 컴포넌트와 DOM 태그를 구분하기 위해 대소문자 규칙을 사용합니다. 자신의 React 컴포넌트에는 PascalCase를 사용하십시오. 예를 들어, `<myButton />` 대신 `<MyButton />`을 작성하십시오.

---

`{...props}`와 같은 속성을 전달하여 이 경고가 발생하는 경우, 부모 컴포넌트는 부모 컴포넌트에만 의도된 속성을 "소비"하고 자식 컴포넌트에 의도되지 않은 속성을 전달하지 않아야 합니다. 예:

**나쁨:** 예상치 못한 `layout` 속성이 `div` 태그로 전달됩니다.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // 나쁨! "layout"이 <div>가 이해하는 속성이 아님을 확실히 알고 있기 때문입니다.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // 나쁨! "layout"이 <div>가 이해하는 속성이 아님을 확실히 알고 있기 때문입니다.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**좋음:** 펼침 문법을 사용하여 props에서 변수를 꺼내고 나머지 props를 변수에 넣을 수 있습니다.

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

**좋음:** 또한 props를 새 객체에 할당하고 사용 중인 키를 새 객체에서 삭제할 수 있습니다. 원래 `this.props` 객체에서 props를 삭제하지 않도록 주의하십시오. 이 객체는 불변으로 간주되어야 합니다.

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