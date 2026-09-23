# Kim Angelo Lopena — Engineering Portfolio

Founder and full-stack engineer at **Nexude LLC**. I design, build, ship and
operate products end to end: product decisions, application code, databases,
mobile shells, infrastructure, deployment, moderation tooling and incident
response.

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
| [**HuniWhisp**](projects/huniwhisp.md) | Anonymous journaling and community platform, live on web, Android and iOS | Next.js 16 · React 19 · TypeScript · MySQL (AWS RDS) · Capacitor · Docker · GitHub Actions |
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
| [`samples/motion-system`](samples/motion-system) | A platform-wide animation vocabulary with accessibility and server-rendering built in, and the layout rule that shaped it |

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

Available on request.
