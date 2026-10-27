# Manan Agarwal — Personal Portfolio

A responsive personal portfolio for Manan Agarwal, a second-year BTech Computer Science and Engineering student at JECRC University.

## Links

- GitHub: https://github.com/manan2128/manan-portfolio
- Contact: agarwal21manan@gmail.com
- Portfolio: https://manan-portfolio-psi-two.vercel.app
- Quiz: https://manan-quiz.vercel.app
- Reading list: https://manan-reading-list.vercel.app

## Features

- Original cream, blue, and ink design with an MA monogram image.
- Home, About, Skills, Projects, Contact, and API chatbot sections.
- Five required coursework entries, including links to all three Python fundamentals repositories.
- Search by project name or technology, category filters, result counts, and a resettable empty state.
- Light/dark mode with remembered preference and system-theme detection on first visit.
- Responsive layouts, keyboard focus indicators, a skip link, accessible form labels, and a native modal chat dialog.
- Working email link and clipboard copy with an accessible fallback.
- Server-side chatbot grounded in the same project data used by the website.
- Input validation, bounded conversation history, request timeout, and useful API failure messages.
- No browser API keys, external fonts, tracking scripts, or runtime frontend dependencies.

## Technology

HTML, CSS, browser JavaScript modules, Node.js, Git, GitHub, and Vercel Functions. The AI endpoint uses standard fetch and the Chat Completions API; no AI SDK is required.

## Run locally

Install Node.js 22 or newer. The only direct runtime dependency is Vercel's official OIDC authentication helper, used on the server.

```sh
git clone https://github.com/manan2128/manan-portfolio.git
cd manan-portfolio
npm install
npm run dev
```

Open http://127.0.0.1:4173. Alternatively run `node scripts/dev.mjs`.

```sh
npm test
npm run build
```

The build copies only `public/` into `dist/`; the Vercel Function is in `api/chat.js`.

## AI setup

On Vercel, the endpoint uses `getVercelOidcToken()` from `@vercel/oidc` to read the deployment's current token from its request context or environment and authenticate to Vercel AI Gateway. Gateway account verification/credits must be available. OIDC is authentication, not a guarantee of free or enabled AI access.

For local AI calls, put a key in an ignored `.env.local` file. Copy the variable names from `.env.example`; do not copy old keys from another project. Choose one option:

1. `AI_GATEWAY_API_KEY`, optionally `AI_GATEWAY_MODEL`.
2. A new `GROQ_API_KEY` owned by the deployer, optionally `GROQ_MODEL`.

With neither configured locally, the website works and chat returns an explicit setup error. It never substitutes a canned response and claims it came from AI.

The browser sends `{ message, history }` to `POST /api/chat`. The server validates the input, adds trusted portfolio context, calls the model, and returns `{ answer }`. Secret values stay on the server. Provider errors and timeouts return useful messages without exposing response bodies or credentials.

## Deploy on Vercel

Import this GitHub repository. Use framework **Other**, build command `npm run build`, output directory `dist`, and Node.js 22 or 24. The committed `vercel.json` supplies the build configuration and security headers.

Production should be publicly accessible. Preview URLs can remain protected. Test the production chatbot separately: a successful page deployment does not prove AI access is configured.

## Project provenance

This portfolio was built with AI assistance. The linked coursework repositories predate this portfolio and contain shared starting material. They are linked as coursework examples; this portfolio does not claim sole authorship of those repositories. Original contributor history and README credits remain in those repositories.

The dictionary repository currently constructs a Python dictionary directly. It is not a general structure-to-dictionary converter. The Python bug-fixing exercise documents three fixes and nine tests; its empty-list case is not implemented. These limitations should be understood when demonstrating the coursework.

## Main files

- `public/index.html`: semantic page sections and chat dialog.
- `public/styles.css`: responsive layout, themes, and project illustrations.
- `public/projects.js`: verified profile information, project links, descriptions, and search function.
- `public/app.js`: project rendering/filtering, theme controls, copy email, and chat UI.
- `public/theme.js`: early theme application.
- `api/chat.js`: server-side model integration and request validation.
- `scripts/dev.mjs`: local HTTP server.
- `scripts/build.mjs`: copies public assets to the deployment output.
- `tests/portfolio.test.js`: search/filter and API validation checks.
- `docs/EXPLAINING-THE-PROJECT.md`: a practical explanation for the demonstration.

## Privacy and limits

Chat history exists in the current page's memory and clears when reloaded or cleared. Submitted messages are sent to the configured AI provider to generate a response. The application does not store them in a database or intentionally log them. This is a small coursework deployment, not a production chat service with durable rate limiting; use provider spending limits and Vercel traffic protection if sharing widely.

