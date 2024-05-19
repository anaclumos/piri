---
title: Installation
---

<Intro>

React는 처음부터 점진적인 도입을 위해 설계되었습니다. 필요한 만큼만 React를 사용할 수 있습니다. React를 맛보기로 사용해보거나, HTML 페이지에 약간의 상호작용을 추가하거나, 복잡한 React 기반 앱을 시작하고자 할 때, 이 섹션은 시작하는 데 도움을 줄 것입니다.

</Intro>

<YouWillLearn isChapter={true}>

* [새로운 React 프로젝트 시작하기](/learn/start-a-new-react-project)
* [기존 프로젝트에 React 추가하기](/learn/add-react-to-an-existing-project)
* [에디터 설정하기](/learn/editor-setup)
* [React Developer Tools 설치하기](/learn/react-developer-tools)

</YouWillLearn>

## React 시도해보기 {/*try-react*/}

React를 사용해보는 데 아무것도 설치할 필요가 없습니다. 이 샌드박스를 편집해보세요!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

직접 편집하거나 오른쪽 상단의 "Fork" 버튼을 눌러 새 탭에서 열 수 있습니다.

React 문서의 대부분의 페이지에는 이와 같은 샌드박스가 포함되어 있습니다. React 문서 외에도 React를 지원하는 많은 온라인 샌드박스가 있습니다: 예를 들어, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), 또는 [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### 로컬에서 React 시도해보기 {/*try-react-locally*/}

컴퓨터에서 로컬로 React를 시도하려면, [이 HTML 페이지를 다운로드하세요.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) 에디터와 브라우저에서 열어보세요!

## 새로운 React 프로젝트 시작하기 {/*start-a-new-react-project*/}

앱이나 웹사이트를 완전히 React로 구축하려면, [새로운 React 프로젝트를 시작하세요.](/learn/start-a-new-react-project)

## 기존 프로젝트에 React 추가하기 {/*add-react-to-an-existing-project*/}

기존 앱이나 웹사이트에서 React를 사용해보고 싶다면, [기존 프로젝트에 React를 추가하세요.](/learn/add-react-to-an-existing-project)

## 다음 단계 {/*next-steps*/}

가장 중요한 React 개념을 안내하는 [빠른 시작](/learn) 가이드를 확인하세요.