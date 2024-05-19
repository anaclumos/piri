---
title: 제로 번들 크기 React 서버 컴포넌트 소개
author: Dan Abramov, Lauren Tan, Joseph Savona, and Sebastian Markbage
date: 2020/12/21
description: 2020년은 긴 한 해였습니다. 연말이 다가오면서 우리는 zero-bundle-size React Server Components에 대한 우리의 연구에 대한 특별한 휴일 업데이트를 공유하고자 합니다.
---

2020년 12월 21일 [Dan Abramov](https://twitter.com/dan_abramov), [Lauren Tan](https://twitter.com/potetotes), [Joseph Savona](https://twitter.com/en_JS), 그리고 [Sebastian Markbåge](https://twitter.com/sebmarkbage)

---

<Intro>

2020년은 긴 한 해였습니다. 연말이 다가오면서, 우리는 제로 번들 사이즈 **React Server Components**에 대한 우리의 연구에 대한 특별한 휴일 업데이트를 공유하고자 합니다.

</Intro>

---

React Server Components를 소개하기 위해, 우리는 발표와 데모를 준비했습니다. 원하시면, 휴일 동안 또는 새해에 일이 다시 시작될 때 확인해 보실 수 있습니다.

<YouTubeIframe src="https://www.youtube.com/embed/TQQPAU21ZUw" />

**React Server Components는 여전히 연구 및 개발 중입니다.** 우리는 투명성의 정신으로 이 작업을 공유하고 React 커뮤니티의 초기 피드백을 받기 위해 이 작업을 공유합니다. 충분한 시간이 있을 것이니, **지금 당장 따라잡아야 한다고 느끼지 않으셔도 됩니다!**

확인해보고 싶으시다면, 다음 순서를 추천드립니다:

1. **발표를 시청**하여 React Server Components에 대해 배우고 데모를 확인하세요.

2. **[데모를 클론](http://github.com/reactjs/server-components-demo)**하여 컴퓨터에서 React Server Components를 사용해 보세요.

3. **[RFC 읽기 (끝에 FAQ 포함)](https://github.com/reactjs/rfcs/pull/188)**를 통해 더 깊은 기술적 분석을 하고 피드백을 제공하세요.

우리는 RFC나 [@reactjs](https://twitter.com/reactjs) 트위터 핸들에 대한 답글에서 여러분의 의견을 듣기를 기대합니다. 즐거운 휴일 보내시고, 안전하게 지내시고, 내년에 뵙겠습니다!