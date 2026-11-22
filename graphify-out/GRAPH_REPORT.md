# Graph Report - HealthBridge-web-main  (2026-11-22)

## Corpus Check
- 71 files · ~73,542 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .css 2, (none) 1)

## Summary
- 138 nodes · 331 edges · 9 communities (7 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Build Config & DevDependencies
- App Shell, Auth, Routing & Core Contexts
- Chat, Symptoms, Home & Utilities
- UI Components: Navbar, Payments, Homepage
- Production Dependencies
- Video Calling (Stream SDK)
- Audio Calling (Stream SDK)
- Vercel Deployment Config

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 29 edges
2. `react` - 24 edges
3. `App()` - 20 edges
4. `react-router-dom` - 18 edges
5. `react-hot-toast` - 14 edges
6. `useChat()` - 9 edges
7. `@stream-io/video-react-sdk` - 7 edges
8. `ChatPage()` - 7 edges
9. `getChatId()` - 7 edges
10. `Home()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `ChatPage()` --calls--> `formatDate()`  [EXTRACTED]
  src/components/ChatPage.jsx → util/formatDate.js
- `ChatPage()` --calls--> `getChatId()`  [EXTRACTED]
  src/components/ChatPage.jsx → util/getChatId.js
- `Home()` --calls--> `getChatId()`  [EXTRACTED]
  src/components/Home.jsx → util/getChatId.js
- `InputSymptoms()` --calls--> `getChatId()`  [EXTRACTED]
  src/components/InputSymptoms.jsx → util/getChatId.js
- `App()` --calls--> `CallScreen()`  [EXTRACTED]
  src/App.jsx → src/components/CallScreen.jsx

## Import Cycles
- 2-file cycle: `src/App.jsx -> src/components/CallScreen.jsx -> src/App.jsx`
- 2-file cycle: `src/App.jsx -> src/components/ChatPage.jsx -> src/App.jsx`

## Communities (9 total, 2 thin omitted)

### Community 0 - "Build Config & DevDependencies"
Cohesion: 0.09
Nodes (30): @tailwindcss/vite@^4.1.11, devDependencies, eslint@^9.33.0, @eslint/js@^9.33.0, eslint-plugin-react-hooks@^5.2.0, eslint-plugin-react-refresh@^0.4.20, globals@^16.3.0, @types/react@^19.1.10 (+22 more)

### Community 1 - "App Shell, Auth, Routing & Core Contexts"
Cohesion: 0.19
Nodes (17): react-hot-toast, react-router-dom, App(), AddChild(), Contact(), ForgotPass(), Login(), NotFound() (+9 more)

### Community 2 - "Chat, Symptoms, Home & Utilities"
Cohesion: 0.10
Nodes (11): stream-chat@^9.16.0, stream-chat, ChatPage(), Home(), InputSymptoms(), symptomData, ChatContext, ChatProvider() (+3 more)

### Community 3 - "UI Components: Navbar, Payments, Homepage"
Cohesion: 0.26
Nodes (5): react, Navbar(), PaymentForm(), PaymentProcessing(), SubscriptionButton()

### Community 4 - "Production Dependencies"
Cohesion: 0.18
Nodes (11): dependencies, react@^19.1.1, react-dom@^19.1.1, react-hot-toast@^2.5.2, react-router-dom@^7.8.0, stream-chat-react@^13.5.1, @stream-io/video-react-sdk@^1.19.7, tailwindcss@^4.1.11 (+3 more)

### Community 5 - "Video Calling (Stream SDK)"
Cohesion: 0.22
Nodes (5): @stream-io/video-react-sdk, CallScreen(), styles, CallPanel(), IncomingCallScreen()

### Community 6 - "Audio Calling (Stream SDK)"
Cohesion: 0.70
Nodes (4): ActiveAudioCallUI(), AudioCallPanel(), IncomingAudioCallScreen(), ParticipantCard()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `UI Components: Navbar, Payments, Homepage` to `Build Config & DevDependencies`, `App Shell, Auth, Routing & Core Contexts`, `Chat, Symptoms, Home & Utilities`, `Production Dependencies`, `Video Calling (Stream SDK)`, `Audio Calling (Stream SDK)`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **Should `Build Config & DevDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08901515151515152 - nodes in this community are weakly interconnected._
- **Why does `react-router-dom` connect `App Shell, Auth, Routing & Core Contexts` to `Build Config & DevDependencies`, `Chat, Symptoms, Home & Utilities`, `UI Components: Navbar, Payments, Homepage`, `Production Dependencies`, `Video Calling (Stream SDK)`, `Audio Calling (Stream SDK)`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `Chat, Symptoms, Home & Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.1032258064516129 - nodes in this community are weakly interconnected._
- **Why does `react-hot-toast` connect `App Shell, Auth, Routing & Core Contexts` to `Build Config & DevDependencies`, `Chat, Symptoms, Home & Utilities`, `UI Components: Navbar, Payments, Homepage`, `Production Dependencies`, `Video Calling (Stream SDK)`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._