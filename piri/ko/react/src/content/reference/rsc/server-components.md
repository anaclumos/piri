---
title: React 서버 컴포넌트
canary: true
---

<Intro>

서버 컴포넌트는 번들링 전에 미리 렌더링되는 새로운 유형의 컴포넌트로, 클라이언트 앱이나 SSR 서버와는 별도의 환경에서 실행됩니다.

</Intro>

이 별도의 환경이 React 서버 컴포넌트의 "서버"입니다. 서버 컴포넌트는 빌드 시 CI 서버에서 한 번 실행되거나, 웹 서버를 사용하여 각 요청마다 실행될 수 있습니다.

<InlineToc />

<Note>

#### 서버 컴포넌트 지원을 어떻게 구축하나요? {/*how-do-i-build-support-for-server-components*/}

React 19의 React 서버 컴포넌트는 안정적이며 주요 버전 간에 깨지지 않지만, React 서버 컴포넌트 번들러나 프레임워크를 구현하는 데 사용되는 기본 API는 semver를 따르지 않으며 React 19.x의 마이너 버전 간에 깨질 수 있습니다.

번들러나 프레임워크로서 React 서버 컴포넌트를 지원하려면 특정 React 버전에 고정하거나 Canary 릴리스를 사용하는 것을 권장합니다. 우리는 앞으로도 React 서버 컴포넌트를 구현하는 데 사용되는 API를 안정화하기 위해 번들러 및 프레임워크와 계속 협력할 것입니다.

</Note>

### 서버 없는 서버 컴포넌트 {/*server-components-without-a-server*/}
서버 컴포넌트는 파일 시스템에서 읽거나 정적 콘텐츠를 가져오기 위해 빌드 시 실행될 수 있으므로 웹 서버가 필요하지 않습니다. 예를 들어, 콘텐츠 관리 시스템에서 정적 데이터를 읽고 싶을 수 있습니다.

서버 컴포넌트가 없으면 클라이언트에서 Effect를 사용하여 정적 데이터를 가져오는 것이 일반적입니다:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: 첫 페이지 렌더링 후 로드됩니다.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

이 패턴은 사용자가 추가로 75K (gzipped)의 라이브러리를 다운로드하고 구문 분석해야 하며, 페이지가 로드된 후 데이터를 가져오기 위해 두 번째 요청을 기다려야 한다는 것을 의미합니다. 이는 페이지의 수명 동안 변경되지 않을 정적 콘텐츠를 렌더링하기 위해서입니다.

서버 컴포넌트를 사용하면 이러한 컴포넌트를 빌드 시 한 번 렌더링할 수 있습니다:

```js
import marked from 'marked'; // 번들에 포함되지 않음
import sanitizeHtml from 'sanitize-html'; // 번들에 포함되지 않음

async function Page({page}) {
  // NOTE: 앱이 빌드될 때 렌더링 중에 로드됩니다.
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

렌더링된 출력은 서버 사이드 렌더링(SSR)되어 HTML로 변환되고 CDN에 업로드될 수 있습니다. 앱이 로드되면 클라이언트는 원래 `Page` 컴포넌트나 마크다운을 렌더링하는 데 필요한 비싼 라이브러리를 보지 않습니다. 클라이언트는 렌더링된 출력만 보게 됩니다:

```js
<div><!-- html for markdown --></div>
```

이는 첫 페이지 로드 시 콘텐츠가 표시되며, 번들에 정적 콘텐츠를 렌더링하는 데 필요한 비싼 라이브러리가 포함되지 않음을 의미합니다.

<Note>

위의 서버 컴포넌트가 비동기 함수라는 것을 알 수 있습니다:

```js
async function Page({page}) {
  //...
}
```

비동기 컴포넌트는 렌더링 중에 `await`할 수 있는 서버 컴포넌트의 새로운 기능입니다.

아래의 [서버 컴포넌트를 사용한 비동기 컴포넌트](#async-components-with-server-components)를 참조하세요.

</Note>

### 서버가 있는 서버 컴포넌트 {/*server-components-with-a-server*/}
서버 컴포넌트는 페이지 요청 중에 웹 서버에서 실행될 수도 있으며, API를 구축하지 않고도 데이터 계층에 액세스할 수 있습니다. 이들은 애플리케이션이 번들링되기 전에 렌더링되며, 데이터와 JSX를 클라이언트 컴포넌트에 props로 전달할 수 있습니다.

서버 컴포넌트가 없으면 클라이언트에서 Effect를 사용하여 동적 데이터를 가져오는 것이 일반적입니다:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: 첫 렌더링 후 로드됩니다.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);
  
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: Note가 렌더링된 후 로드됩니다.
  // 이는 비싼 클라이언트-서버 워터폴을 유발합니다.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

서버 컴포넌트를 사용하면 데이터를 읽고 컴포넌트에서 렌더링할 수 있습니다:

```js
import db from './database';

async function Note({id}) {
  // NOTE: 렌더링 중에 로드됩니다.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: Note 후에 로드되지만,
  // 데이터가 함께 위치하면 빠릅니다.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

번들러는 데이터를 결합하고, 렌더링된 서버 컴포넌트와 동적 클라이언트 컴포넌트를 번들로 결합합니다. 선택적으로, 그 번들은 서버 사이드 렌더링(SSR)되어 페이지의 초기 HTML을 생성할 수 있습니다. 페이지가 로드되면 브라우저는 원래 `Note`와 `Author` 컴포넌트를 보지 않고, 렌더링된 출력만 클라이언트에 전송됩니다:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 Beta is...</p>
</div>
```

서버 컴포넌트는 서버에서 다시 가져와 동적으로 만들 수 있으며, 여기서 데이터를 액세스하고 다시 렌더링할 수 있습니다. 이 새로운 애플리케이션 아키텍처는 서버 중심의 멀티 페이지 앱의 간단한 "요청/응답" 정신 모델과 클라이언트 중심의 싱글 페이지 앱의 원활한 상호 작용을 결합하여 두 세계의 장점을 제공합니다.

### 서버 컴포넌트에 상호작용 추가하기 {/*adding-interactivity-to-server-components*/}

서버 컴포넌트는 브라우저로 전송되지 않으므로 `useState`와 같은 상호작용 API를 사용할 수 없습니다. 서버 컴포넌트에 상호작용을 추가하려면 `"use client"` 지시어를 사용하여 클라이언트 컴포넌트와 함께 구성할 수 있습니다.

<Note>

#### 서버 컴포넌트에 대한 지시어는 없습니다. {/*there-is-no-directive-for-server-components*/}

서버 컴포넌트는 `"use server"`로 표시된다는 일반적인 오해가 있지만, 서버 컴포넌트에 대한 지시어는 없습니다. `"use server"` 지시어는 서버 액션에 사용됩니다.

자세한 내용은 [지시어](/reference/rsc/directives) 문서를 참조하세요.

</Note>

다음 예제에서 `Notes` 서버 컴포넌트는 상태를 사용하여 `expanded` 상태를 토글하는 `Expandable` 클라이언트 컴포넌트를 가져옵니다:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

이것은 먼저 `Notes`를 서버 컴포넌트로 렌더링한 다음 번들러에게 클라이언트 컴포넌트 `Expandable`의 번들을 생성하도록 지시함으로써 작동합니다. 브라우저에서 클라이언트 컴포넌트는 서버 컴포넌트의 출력을 props로 전달받습니다:

```js
<head>
  <!-- 클라이언트 컴포넌트용 번들 -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div> 
</body>
```

### 서버 컴포넌트를 사용한 비동기 컴포넌트 {/*async-components-with-server-components*/}

서버 컴포넌트는 async/await를 사용하여 컴포넌트를 작성하는 새로운 방법을 도입합니다. 비동기 컴포넌트에서 `await`할 때, React는 일시 중지하고 약속이 해결될 때까지 기다린 후 렌더링을 재개합니다. 이는 스트리밍 지원을 통해 서버/클라이언트 경계를 넘어 작동합니다.

서버에서 약속을 생성하고 클라이언트에서 기다릴 수도 있습니다:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // 서버 컴포넌트를 일시 중지합니다.
  const note = await db.notes.get(id);
  
  // NOTE: 기다리지 않으며, 여기서 시작하고 클라이언트에서 기다립니다. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: 이것은 서버에서 약속을 재개합니다.
  // 데이터가 사용 가능할 때까지 일시 중지됩니다.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

`note` 콘텐츠는 페이지 렌더링에 중요한 데이터이므로 서버에서 `await`합니다. 댓글은 접혀 있고 우선순위가 낮기 때문에 서버에서 약속을 시작하고 클라이언트에서 `use` API로 기다립니다. 이는 클라이언트에서 일시 중지되며, `note` 콘텐츠가 렌더링되는 것을 차단하지 않습니다.

비동기 컴포넌트는 [클라이언트에서 지원되지 않기 때문에](#why-cant-i-use-async-components-on-the-client), `use`로 약속을 기다립니다.