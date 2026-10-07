# Kim Angelo Lopena — Engineering Portfolio

Founder and full-stack engineer at **Nexude LLC**. I design, build, ship and
operate products end to end: product decisions, application code, databases,
mobile shells, infrastructure, deployment, moderation tooling and incident
response.

I also bring **eight years in a hospital imaging department** (PACS, DICOM,
HIPAA), where I am the first call when imaging software fails. That is where I
learned to be careful with data and to explain technical problems to people who
just need them fixed. → [Healthcare imaging](projects/healthcare-imaging.md)

This repository is a **curated showcase**. The products themselves live in
private repositories because they serve real people, including sensitive and
anonymous communities, and their source, infrastructure and operational
history are not something I publish. What is here is written for reviewers:
case studies of the engineering problems I solved, and a small set of
self-contained code samples extracted from that work.

> **Viewing only.** Nothing here is licensed for reuse. See [LICENSE](LICENSE).

---

## Projects

| Project | What it is | Stack |
|---|---|---|
| [**HuniWhisp**](projects/huniwhisp.md) | Anonymous journaling and community platform. Live on web and Android, about 4,200 members | Next.js 16 · React 19 · TypeScript · MySQL (AWS RDS) · Capacitor · Docker · GitHub Actions |
| [**Nexudeit**](projects/nexudeit.md) | Peer-to-peer marketplace with escrow-style trade protection on card holds | Next.js 16 · React 19 · TypeScript · Prisma · MySQL · Stripe · AWS |
| [**Healthcare imaging**](projects/healthcare-imaging.md) | Eight years in hospital PACS operations, and DICOM Cleaner Pro, a tool that strips patient information from images | PACS · DICOM · HIPAA · Electron · Java (PixelMed) |
| [**Trovio**](projects/trovio.md) | Collection and inventory platform — catalogue, share and value what you collect | Next.js 16 · React 19 · TypeScript · MySQL 8 · Capacitor 7 · PWA |
| [**KinStation**](projects/kinstation.md) | Pet information platform — encyclopedia, medical history, first aid, directories | Next.js 16 · React 19 · TypeScript · Prisma |
| [**Stellar Forge**](projects/stellar-forge.md) | Idle / battler game, rebuilt natively for Steam and Android | Godot 4 · GDScript |
| [**Gaia's Cradle**](projects/gaias-cradle.md) | Creature-breeding and genetics survival simulation | Unity · C# · Blender |

## Code samples

Each sample is self-contained, runs on its own, and was chosen because it
shows *how* I work rather than *what* a private system does. None of them
contain credentials, endpoints, schemas, or security controls.

| Sample | What it demonstrates |
|---|---|
| [`samples/privacy-predicate`](samples/privacy-predicate) | Turning a privacy rule that two parts of a system disagreed about into one pure, fail-closed decision — and proving it with an exhaustive behavioural test instead of a source grep |
| [`samples/delivery-simulation`](samples/delivery-simulation) | Finding a bug that lived *between* functions by simulating the decision the way production runs it, then asserting an invariant across every device combination |
| [`samples/llm-completion-guard`](samples/llm-completion-guard) | Treating an AI model's reply as unfinished until it proves otherwise: the check that fixed support replies cut off mid-sentence, with a test that isolates each rule |
| [`samples/motion-system`](samples/motion-system) | A platform-wide animation vocabulary with accessibility and server-rendering built in, and the layout rule that shaped it |

## Open-source projects

Unlike the products above, these are public and MIT-licensed: small, complete
projects across the languages I use, each with tests, CI and a README that
explains the design decisions.

| Project | What it shows | Stack |
|---|---|---|
| [nextjs-job-tracker](https://github.com/Nexude-ZainaV/nextjs-job-tracker) | Server Components, Server Actions, Route Handlers, one Zod schema for forms and API | Next.js 16 · TypeScript · Tailwind · SQLite |
| [react-kanban-board](https://github.com/Nexude-ZainaV/react-kanban-board) ([demo](https://nexude-zainav.github.io/react-kanban-board/)) | Typed reducer, native drag and drop with full keyboard support | React 19 · TypeScript · Vite · Vitest |
| [node-auth-api](https://github.com/Nexude-ZainaV/node-auth-api) | Rotating refresh tokens with reuse detection, scrypt, timing-safe login | Node.js · Express 5 · SQLite |
| [responsive-weather-dashboard](https://github.com/Nexude-ZainaV/responsive-weather-dashboard) ([demo](https://nexude-zainav.github.io/responsive-weather-dashboard/?city=Manila)) | Mobile-first layout, accessible autocomplete, request cancellation | HTML · CSS · JavaScript |
| [php-notes-app](https://github.com/Nexude-ZainaV/php-notes-app) | Front controller, PDO, CSRF, CSP and an AJAX API with no framework | PHP 8.2 · PHPUnit |
| [dotnet-expense-api](https://github.com/Nexude-ZainaV/dotnet-expense-api) | Minimal APIs, EF Core, money in integer cents, integration tests | C# · .NET 10 · xUnit |
| [python-task-api](https://github.com/Nexude-ZainaV/python-task-api) | Layered FastAPI service, injection-safe sorting and search | Python · FastAPI · pytest |
| [sql-ecommerce-analytics](https://github.com/Nexude-ZainaV/sql-ecommerce-analytics) | Ten business reports: window functions, cohorts, top-N per group | SQL |
| [cpp-library-system](https://github.com/Nexude-ZainaV/cpp-library-system) | OOP with polymorphism, STL algorithms, C++20 dates | C++20 · CMake |
| [c-inventory-cli](https://github.com/Nexude-ZainaV/c-inventory-cli) | Manual memory management, CSV persistence, sanitizer builds | C11 · CMake |

## How I use AI

I use Claude Code and Codex every day. They do the research (how a library behaves
in the current version, and where that's documented) and the repetitive code. I make
the design decisions, and I read and test every change before it ships. The failure I
watch for is not code that doesn't run. It's code that runs, passes, and quietly does
the wrong thing for the business. The case studies here include several of those, found
and fixed.

## How I work

- **Measure on the live system, not in my head.** A green build is not
  evidence. I verify behaviour where users actually meet it, and I report
  what I found — including when my own earlier fix was incomplete.
- **Fail closed at privacy and safety boundaries.** When a decision can't be
  established, the answer is the one that cannot harm anyone.
- **Every fix ships with the test that would have caught it.** And the test
  has to call the code, not read it.
- **Write down why.** Comments, commit messages and handover notes explain
  the decision and the incident behind it, so the next person doesn't repeat
  the mistake.

## Contact

[LinkedIn](https://www.linkedin.com/in/kim-angelo-lopena-b276a2419) · based in
Hackensack, NJ (New York metro) · open to remote and hybrid roles.
