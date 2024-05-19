---
title: 유효하지 않은 ARIA 속성 경고
---

이 경고는 Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [명세서](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)에 존재하지 않는 `aria-*` 속성을 가진 DOM 요소를 렌더링하려고 할 때 발생합니다.

1. 유효한 속성을 사용하고 있다고 생각되면 철자를 주의 깊게 확인하십시오. `aria-labelledby`와 `aria-activedescendant`는 자주 철자가 틀립니다.

2. `aria-role`을 작성했다면, `role`을 의미했을 수 있습니다.

3. 그렇지 않으면, 최신 버전의 React DOM을 사용하고 ARIA 명세서에 나열된 유효한 속성 이름을 사용하고 있음을 확인한 경우, [버그를 보고](https://github.com/facebook/react/issues/new/choose)해 주십시오.