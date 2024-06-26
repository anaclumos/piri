---
title: 특수 Props 경고
---

대부분의 JSX 요소의 props는 컴포넌트로 전달되지만, `ref`와 `key`라는 두 가지 특별한 props는 React에서 사용되므로 컴포넌트로 전달되지 않습니다.

예를 들어, 컴포넌트에서 `props.key`를 읽을 수 없습니다. 자식 컴포넌트 내에서 동일한 값을 접근해야 한다면, 다른 prop으로 전달해야 합니다 (예: `<ListItemWrapper key={result.id} id={result.id} />` 그리고 `props.id`를 읽습니다). 이것이 중복처럼 보일 수 있지만, React에 대한 힌트와 앱 로직을 분리하는 것이 중요합니다.