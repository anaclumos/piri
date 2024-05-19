---
title: React サーバーコンポーネント
canary: true
---

<Intro>

Server Componentsは、クライアントアプリやSSRサーバーとは別の環境で、バンドル前に事前にレンダリングされる新しいタイプのコンポーネントです。

</Intro>

この別の環境がReact Server Componentsの「サーバー」です。Server Componentsは、CIサーバーでビルド時に一度実行することも、ウェブサーバーを使用して各リクエストごとに実行することもできます。

<InlineToc />

<Note>

#### Server Componentsのサポートを構築するにはどうすればよいですか？ {/*how-do-i-build-support-for-server-components*/}

React 19のReact Server Componentsは安定しており、メジャーバージョン間で壊れることはありませんが、React Server Componentsバンドラーやフレームワークを実装するために使用される基盤となるAPIはsemverに従わず、React 19.xのマイナーバージョン間で壊れる可能性があります。

バンドラーやフレームワークとしてReact Server Componentsをサポートするには、特定のReactバージョンに固定するか、Canaryリリースを使用することをお勧めします。将来的には、React Server Componentsを実装するために使用されるAPIを安定させるために、バンドラーやフレームワークと協力を続けます。

</Note>

### サーバーなしのServer Components {/*server-components-without-a-server*/}
Server Componentsは、ビルド時にファイルシステムから読み取ったり、静的コンテンツをフェッチしたりするため、ウェブサーバーは必要ありません。例えば、コンテンツ管理システムから静的データを読み取ることが考えられます。

Server Componentsがない場合、Effectを使用してクライアントで静的データをフェッチするのが一般的です：
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: 最初のページレンダリング後に読み込みます。
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

このパターンでは、ユーザーは追加の75K（gzipped）のライブラリをダウンロードして解析する必要があり、ページが読み込まれた後にデータをフェッチするための2回目のリクエストを待つ必要があります。これは、ページの寿命中に変更されない静的コンテンツをレンダリングするためだけです。

Server Componentsを使用すると、これらのコンポーネントをビルド時に一度レンダリングできます：

```js
import marked from 'marked'; // バンドルに含まれません
import sanitizeHtml from 'sanitize-html'; // バンドルに含まれません

async function Page({page}) {
  // NOTE: アプリがビルドされるときにレンダリング中に読み込みます。
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

レンダリングされた出力は、サーバーサイドレンダリング（SSR）でHTMLに変換され、CDNにアップロードできます。アプリが読み込まれると、クライアントは元の`Page`コンポーネントやマークダウンをレンダリングするための高価なライブラリを見ません。クライアントはレンダリングされた出力のみを見ます：

```js
<div><!-- html for markdown --></div>
```

これにより、コンテンツは最初のページ読み込み時に表示され、バンドルには静的コンテンツをレンダリングするための高価なライブラリが含まれません。

<Note>

上記のServer Componentが非同期関数であることに気付くかもしれません：

```js
async function Page({page}) {
  //...
}
```

非同期コンポーネントは、レンダリング中に`await`を使用できるServer Componentsの新機能です。

詳細は、以下の[Server Componentsを使用した非同期コンポーネント](#async-components-with-server-components)を参照してください。

</Note>

### サーバーを使用したServer Components {/*server-components-with-a-server*/}
Server Componentsは、ページのリクエスト中にウェブサーバー上で実行することもでき、APIを構築することなくデータレイヤーにアクセスできます。これらはアプリケーションがバンドルされる前にレンダリングされ、データとJSXをプロップとしてクライアントコンポーネントに渡すことができます。

Server Componentsがない場合、Effectを使用してクライアントで動的データをフェッチするのが一般的です：

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: 最初のレンダリング後に読み込みます。
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
  // NOTE: Noteがレンダリングされた後に読み込みます。
  // 高価なクライアントサーバーのウォーターフォールを引き起こします。
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

Server Componentsを使用すると、データを読み取り、コンポーネント内でレンダリングできます：

```js
import db from './database';

async function Note({id}) {
  // NOTE: レンダリング中に読み込みます。
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: Noteの後に読み込みますが、
  // データが共存している場合は高速です。
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

バンドラーはデータ、レンダリングされたServer Components、および動的なClient Componentsをバンドルに結合します。オプションで、そのバンドルをサーバーサイドレンダリング（SSR）してページの初期HTMLを作成できます。ページが読み込まれると、ブラウザは元の`Note`および`Author`コンポーネントを見ず、レンダリングされた出力のみがクライアントに送信されます：

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 Beta is...</p>
</div>
```

Server Componentsは、サーバーから再フェッチすることで動的にすることができ、データにアクセスして再度レンダリングできます。この新しいアプリケーションアーキテクチャは、サーバー中心のマルチページアプリのシンプルな「リクエスト/レスポンス」メンタルモデルと、クライアント中心のシングルページアプリのシームレスなインタラクティビティを組み合わせ、両方の利点を提供します。

### Server Componentsにインタラクティビティを追加する {/*adding-interactivity-to-server-components*/}

Server Componentsはブラウザに送信されないため、`useState`のようなインタラクティブなAPIを使用することはできません。Server Componentsにインタラクティビティを追加するには、`"use client"`ディレクティブを使用してClient Componentと組み合わせます。

<Note>

#### Server Componentsにはディレクティブがありません。 {/*there-is-no-directive-for-server-components*/}

Server Componentsは`"use server"`で示されるという誤解が一般的ですが、Server Componentsにはディレクティブはありません。`"use server"`ディレクティブはServer Actionsに使用されます。

詳細については、[Directives](/reference/rsc/directives)のドキュメントを参照してください。

</Note>

次の例では、`Notes` Server Componentが状態を使用して`expanded`状態を切り替える`Expandable` Client Componentをインポートしています：
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

これは、最初に`Notes`をServer Componentとしてレンダリングし、その後バンドラーにClient Component`Expandable`のバンドルを作成するよう指示することで機能します。ブラウザでは、Client ComponentsはServer Componentsの出力をプロップとして受け取ります：

```js
<head>
  <!-- Client Componentsのバンドル -->
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

### Server Componentsを使用した非同期コンポーネント {/*async-components-with-server-components*/}

Server Componentsは、async/awaitを使用してコンポーネントを書く新しい方法を導入します。非同期コンポーネントで`await`すると、Reactはサスペンドし、プロミスが解決されるまでレンダリングを再開しません。これは、サーバー/クライアントの境界を越えて機能し、Suspenseのストリーミングサポートを提供します。

サーバーでプロミスを作成し、クライアントでそれをawaitすることもできます：

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Server Componentをサスペンドします。
  const note = await db.notes.get(id);
  
  // NOTE: awaitされません。ここで開始し、クライアントでawaitします。
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
  // NOTE: これはサーバーからのプロミスを再開します。
  // データが利用可能になるまでサスペンドします。
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

`note`の内容はページをレンダリングするための重要なデータであるため、サーバーでawaitします。コメントはフォールドの下にあり、優先度が低いため、サーバーでプロミスを開始し、クライアントで`use` APIを使用して待機します。これにより、クライアントでサスペンドされ、`note`の内容がレンダリングされるのをブロックしません。

非同期コンポーネントは[クライアントではサポートされていない](#why-cant-i-use-async-components-on-the-client)ため、プロミスを`use`でawaitします。