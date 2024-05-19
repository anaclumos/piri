---
title: react-test-renderer 사용 중단 경고
---

## ReactTestRenderer.create() 경고 {/*reacttestrenderercreate-warning*/}

react-test-renderer는 더 이상 사용되지 않습니다. ReactTestRenderer.create() 또는 ReactShallowRender.render()를 호출할 때마다 경고가 발생합니다. react-test-renderer 패키지는 NPM에서 계속 사용할 수 있지만 유지 관리되지 않으며 새로운 React 기능이나 React 내부 변경 사항과 함께 작동하지 않을 수 있습니다.

React 팀은 현대적이고 잘 지원되는 테스트 경험을 위해 테스트를 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) 또는 [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started)로 마이그레이션할 것을 권장합니다.


## new ShallowRenderer() 경고 {/*new-shallowrenderer-warning*/}

react-test-renderer 패키지는 더 이상 `react-test-renderer/shallow`에서 얕은 렌더러를 내보내지 않습니다. 이는 이전에 별도로 추출된 패키지인 `react-shallow-renderer`의 단순한 재패키징이었습니다. 따라서 얕은 렌더러를 계속 사용하려면 직접 설치하여 동일한 방식으로 사용할 수 있습니다. [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer)를 참조하십시오.