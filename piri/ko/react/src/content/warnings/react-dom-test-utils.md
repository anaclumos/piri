---
title: react-dom/test-utils 사용 중단 경고
---

## ReactDOMTestUtils.act() 경고 {/*reactdomtestutilsact-warning*/}

`react-dom/test-utils`의 `act`는 `react`의 `act`로 대체되었습니다.

이전:

```js
import {act} from 'react-dom/test-utils';
```

이후:

```js
import {act} from 'react';
```

## 나머지 ReactDOMTestUtils API들 {/*rest-of-reactdomtestutils-apis*/}

`act`를 제외한 모든 API가 제거되었습니다.

React 팀은 현대적이고 잘 지원되는 테스트 경험을 위해 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)로 테스트를 마이그레이션할 것을 권장합니다.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument`는 `@testing-library/react`의 `render`로 대체할 수 있습니다.

이전:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

이후:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate`는 `@testing-library/react`의 `fireEvent`로 대체할 수 있습니다.

이전:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

이후:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

`fireEvent`는 요소에 실제 이벤트를 디스패치하며 단순히 이벤트 핸들러를 합성 호출하지 않는다는 점에 유의하세요.

### 제거된 모든 API 목록 {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

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