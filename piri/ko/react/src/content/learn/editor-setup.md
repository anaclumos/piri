---
title: 에디터 설정
---

<Intro>

적절하게 구성된 에디터는 코드를 더 읽기 쉽게 하고 더 빠르게 작성할 수 있게 해줍니다. 심지어 코드를 작성하는 동안 버그를 잡아내는 데도 도움이 될 수 있습니다! 에디터를 처음 설정하거나 현재 사용 중인 에디터를 조정하려는 경우, 몇 가지 추천 사항이 있습니다.

</Intro>

<YouWillLearn>

* 가장 인기 있는 에디터가 무엇인지
* 코드를 자동으로 포맷하는 방법

</YouWillLearn>

## Your editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/)는 오늘날 가장 인기 있는 에디터 중 하나입니다. 확장 프로그램의 대규모 마켓플레이스를 가지고 있으며 GitHub과 같은 인기 있는 서비스와 잘 통합됩니다. 아래 나열된 대부분의 기능은 VS Code에 확장 프로그램으로 추가할 수 있어 매우 구성 가능하게 만듭니다!

React 커뮤니티에서 사용되는 다른 인기 있는 텍스트 에디터는 다음과 같습니다:

* [WebStorm](https://www.jetbrains.com/webstorm/)은 JavaScript를 위해 특별히 설계된 통합 개발 환경입니다.
* [Sublime Text](https://www.sublimetext.com/)는 JSX와 TypeScript를 지원하며, [문법 강조](https://stackoverflow.com/a/70960574/458193) 및 자동 완성 기능이 내장되어 있습니다.
* [Vim](https://www.vim.org/)은 모든 종류의 텍스트를 효율적으로 생성하고 변경할 수 있도록 설계된 고도로 구성 가능한 텍스트 에디터입니다. 대부분의 UNIX 시스템과 Apple OS X에는 "vi"로 포함되어 있습니다.

## Recommended text editor features {/*recommended-text-editor-features*/}

일부 에디터는 이러한 기능이 내장되어 있지만, 다른 에디터는 확장 프로그램을 추가해야 할 수도 있습니다. 선택한 에디터가 어떤 지원을 제공하는지 확인하여 확실히 하세요!

### Linting {/*linting*/}

코드 린터는 코드를 작성하는 동안 문제를 찾아내어 조기에 수정할 수 있도록 도와줍니다. [ESLint](https://eslint.org/)는 JavaScript를 위한 인기 있는 오픈 소스 린터입니다.

* [React를 위한 권장 구성으로 ESLint 설치](https://www.npmjs.com/package/eslint-config-react-app) (반드시 [Node를 설치했는지 확인하세요!](https://nodejs.org/en/download/current/))
* [공식 확장 프로그램으로 VSCode에 ESLint 통합](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**프로젝트에 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) 규칙을 모두 활성화했는지 확인하세요.** 이 규칙들은 필수적이며 가장 심각한 버그를 조기에 잡아냅니다. 권장되는 [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) 프리셋에는 이미 포함되어 있습니다.

### Formatting {/*formatting*/}

다른 기여자와 코드를 공유할 때 마지막으로 하고 싶은 일은 [탭 대 스페이스](https://www.google.com/search?q=tabs+vs+spaces)에 대한 논쟁에 빠지는 것입니다! 다행히도 [Prettier](https://prettier.io/)는 미리 설정된 구성 가능한 규칙에 따라 코드를 재포맷하여 코드를 정리해줍니다. Prettier를 실행하면 모든 탭이 스페이스로 변환되고, 들여쓰기, 따옴표 등도 구성에 맞게 변경됩니다. 이상적인 설정에서는 파일을 저장할 때 Prettier가 실행되어 빠르게 이러한 수정을 해줍니다.

다음 단계를 따라 [VSCode에 Prettier 확장 프로그램을 설치](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)할 수 있습니다:

1. VS Code 실행
2. 빠른 열기 사용 (Ctrl/Cmd+P 누르기)
3. `ext install esbenp.prettier-vscode` 붙여넣기
4. Enter 누르기

#### Formatting on save {/*formatting-on-save*/}

이상적으로는 저장할 때마다 코드를 포맷해야 합니다. VS Code에는 이를 위한 설정이 있습니다!

1. VS Code에서 `CTRL/CMD + SHIFT + P`를 누릅니다.
2. "settings" 입력
3. Enter 누르기
4. 검색창에 "format on save" 입력
5. "format on save" 옵션이 체크되어 있는지 확인하세요!

> ESLint 프리셋에 포맷팅 규칙이 있는 경우, Prettier와 충돌할 수 있습니다. ESLint가 논리적 오류만 잡도록 [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)를 사용하여 ESLint 프리셋의 모든 포맷팅 규칙을 비활성화하는 것을 권장합니다. 풀 리퀘스트가 병합되기 전에 파일이 포맷되었는지 확인하려면, 연속 통합을 위해 [`prettier --check`](https://prettier.io/docs/en/cli.html#--check)를 사용하세요.