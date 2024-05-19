---
title: react-dom/test-utils 非推奨警告
---

## ReactDOMTestUtils.act() 警告 {/*reactdomtestutilsact-warning*/}

`react-dom/test-utils` の `act` は `react` の `act` に置き換えられました。

以前:

```js
import {act} from 'react-dom/test-utils';
```

以後:

```js
import {act} from 'react';
```

## 残りの ReactDOMTestUtils API {/*rest-of-reactdomtestutils-apis*/}

`act` を除くすべてのAPIは削除されました。

Reactチームは、モダンでサポートの充実したテスト体験のために、テストを [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) に移行することを推奨しています。

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument` は `@testing-library/react` の `render` に置き換えることができます。

以前:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

以後:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` は `@testing-library/react` の `fireEvent` に置き換えることができます。

以前:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

以後:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

`fireEvent` は要素上で実際のイベントをディスパッチし、単にイベントハンドラを合成的に呼び出すだけではないことに注意してください。

### 削除されたすべてのAPIのリスト {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`