# Kim Angelo Lopena: engineering portfolio

I'm the founder and only engineer at Nexude LLC. I build products end to end
and then I run them: the product decisions, the application code, the
database, the mobile shells, deployment, moderation tools, and whatever breaks
at 2am.

Before any of that I spent eight years (and counting) in a hospital imaging
department, working with PACS, DICOM and HIPAA. I'm the person people call
when the imaging software stops working. That job taught me to be careful
with data, and to explain a technical problem to someone who just needs it
fixed. More on that in [Healthcare imaging](projects/healthcare-imaging.md).

The products live in private repositories. They serve real people, some of
them in sensitive and anonymous communities, so I don't publish their source,
infrastructure or operational history. This repo is the reviewer's version:
write-ups of problems I solved, and a few small code samples pulled out of
that work and made to run on their own.

> Viewing only. Nothing here is licensed for reuse. See [LICENSE](LICENSE).

---

## Projects

| Project | What it is | Stack |
|---|---|---|
| [HuniWhisp](projects/huniwhisp.md) | Anonymous journaling and community platform. Live on web and Android, about 4,200 members | Next.js 16 · React 19 · TypeScript · MySQL (AWS RDS) · Capacitor · Docker · GitHub Actions |
| [Nexudeit](projects/nexudeit.md) | Peer-to-peer marketplace with escrow-style trade protection on card holds | Next.js 16 · React 19 · TypeScript · Prisma · MySQL · Stripe · AWS |
| [Healthcare imaging](projects/healthcare-imaging.md) | Eight years in hospital PACS operations, plus DICOM Cleaner Pro, a tool that strips patient information from images | PACS · DICOM · HIPAA · Electron · Java (PixelMed) |
| [Stellar Forge](projects/stellar-forge.md) | Physics auto battler where you forge stars and planets. Steam Early Access planned for October 29, 2026 | Godot 4 · GDScript · TypeScript (match server) |
| [Trovio](projects/trovio.md) | Collection and inventory platform: catalogue, share and value what you collect | Next.js 16 · React 19 · TypeScript · MySQL 8 · Capacitor 7 · PWA |
| [KinStation](projects/kinstation.md) | Pet information platform: encyclopedia, medical history, first aid, directories | Next.js 16 · React 19 · TypeScript · Prisma |
| [Gaia's Cradle](projects/gaias-cradle.md) | Creature breeding and genetics survival simulation | Unity · C# · Blender |

## Code samples

Each one runs by itself, and I picked them because they show how I work more
than what a private system does. None of them contain credentials, endpoints,
schemas or security controls.

| Sample | What to look at |
|---|---|
| [`samples/privacy-predicate`](samples/privacy-predicate) | Two parts of a system disagreed about when to hide someone's name. I replaced both rules with one pure function that fails closed, and tested it against every input combination instead of grepping the source |
| [`samples/delivery-simulation`](samples/delivery-simulation) | A bug that lived between two correct functions. I found it by simulating the decision the way production runs it, then checked an invariant across every device combination |
| [`samples/llm-completion-guard`](samples/llm-completion-guard) | Support replies from a language model were getting cut off mid-sentence. This is the check that decides whether a reply is finished enough to send, with a test for each rule |
| [`samples/motion-system`](samples/motion-system) | The shared animation components for a whole platform, with reduced motion and server rendering handled from the start, and the layout rule that shaped them |

## Open-source projects

These ones are public and MIT-licensed. They're small but complete, one per
language I use, each with tests, CI and a README explaining the decisions.

| Project | What it shows | Stack |
|---|---|---|
| [nextjs-job-tracker](https://github.com/Nexude-ZainaV/nextjs-job-tracker) | Server Components, Server Actions, Route Handlers, one Zod schema shared by forms and the API | Next.js 16 · TypeScript · Tailwind · SQLite |
| [react-kanban-board](https://github.com/Nexude-ZainaV/react-kanban-board) ([demo](https://nexude-zainav.github.io/react-kanban-board/)) | Typed reducer, native drag and drop that also works from the keyboard | React 19 · TypeScript · Vite · Vitest |
| [node-auth-api](https://github.com/Nexude-ZainaV/node-auth-api) | Rotating refresh tokens with reuse detection, scrypt, timing-safe login | Node.js · Express 5 · SQLite |
| [responsive-weather-dashboard](https://github.com/Nexude-ZainaV/responsive-weather-dashboard) ([demo](https://nexude-zainav.github.io/responsive-weather-dashboard/?city=Manila)) | Mobile-first layout, accessible autocomplete, request cancellation | HTML · CSS · JavaScript |
| [php-notes-app](https://github.com/Nexude-ZainaV/php-notes-app) | Front controller, PDO, CSRF, CSP and an AJAX API, no framework | PHP 8.2 · PHPUnit |
| [dotnet-expense-api](https://github.com/Nexude-ZainaV/dotnet-expense-api) | Minimal APIs, EF Core, money kept in integer cents, integration tests | C# · .NET 10 · xUnit |
| [python-task-api](https://github.com/Nexude-ZainaV/python-task-api) | Layered FastAPI service, sorting and search that can't be injected into | Python · FastAPI · pytest |
| [sql-ecommerce-analytics](https://github.com/Nexude-ZainaV/sql-ecommerce-analytics) | Ten business reports: window functions, cohorts, top-N per group | SQL |
| [cpp-library-system](https://github.com/Nexude-ZainaV/cpp-library-system) | Polymorphism, STL algorithms, C++20 dates | C++20 · CMake |
| [c-inventory-cli](https://github.com/Nexude-ZainaV/c-inventory-cli) | Manual memory management, CSV persistence, sanitizer builds | C11 · CMake |

## How I check my work

I make the design calls, and I read and test every change before it ships.
Code that doesn't run is easy to catch. What I watch for is code that runs,
passes its tests and still does the wrong thing for the business or for the
person using it. Several of the write-ups here are exactly that kind of bug,
found and fixed.

## How I work

- I measure on the live system. A green build isn't evidence that a feature
  works, so I check behaviour where users actually meet it, and I say so when
  an earlier fix of mine turned out to be incomplete.
- At privacy and safety boundaries I fail closed. If a decision can't be
  established, the answer is the one that can't hurt anyone.
- Every fix ships with the test that would have caught it, and that test has
  to call the code. A test that only reads the source proves very little.
- I write down why. Comments, commit messages and handover notes explain the
  decision and the incident behind it, so the next person doesn't repeat it.

## Contact

[LinkedIn](https://www.linkedin.com/in/kim-angelo-lopena-b276a2419). Based in
Hackensack, NJ (New York metro), open to remote and hybrid roles.
