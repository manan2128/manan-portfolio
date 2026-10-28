# Understanding the portfolio

## A short introduction

“My name is Manan Agarwal. I am in my second year of BTech Computer Science and Engineering at JECRC University. This portfolio presents my education, current learning areas, and coursework repositories. The portfolio was built with AI assistance.”

Read the explanations below and run the examples before presenting. Do not claim you independently wrote or understand code you have not reviewed.

## What each technology does

HTML defines the headings, sections, links, forms, and chat dialog. CSS controls layout, spacing, colors, themes, and mobile breakpoints. Browser JavaScript renders project cards and handles interactions. Node.js runs the server-side chatbot endpoint. Git records source changes. GitHub stores the repository. Vercel builds and serves the website and runs the API function.

## Search and filters

The five projects live in an array in public/projects.js. Each includes a title, description, category, technologies, source links, and factual context for the chatbot.

filterProjects converts the query to lowercase and splits it into words. Every search word must appear somewhere in the title, kind, description, or technologies. The category must also match unless All is selected.

The UI listens for the input event, so results change while typing. Python returns three cards, Quiz one, and Book one. A query with no matches shows a reset control.

## Dark mode

CSS variables define background, surface, text, border, and accent colors. Changing the document's data-theme attribute swaps those variables. localStorage remembers the chosen theme. If storage is unavailable, the toggle still works for the current page.

## API chatbot

1. A visitor types a question.
2. app.js posts the question and up to six previous messages to /api/chat.
3. The server checks the HTTP method, content type, origin, message length, and history roles.
4. The server adds a system message containing verified education and project information.
5. A server-only token authenticates the request to an AI provider.
6. The provider returns a response; the server sends only the answer to the browser.
7. The browser inserts the answer using textContent, so generated HTML is not executed.

The system message tells the model to avoid inventing qualifications and to acknowledge unknown facts. This improves grounding but cannot guarantee that every AI answer is correct. No API key belongs in frontend JavaScript.

A failed request displays a useful error. It does not pretend a prewritten greeting is an AI answer.

## The coursework entries

### Python Programs Collection

Factorial: a running product starts at 1 and multiplies successive integers. 5! = 1 × 2 × 3 × 4 × 5 = 120.

Fibonacci: each new number is the sum of the previous two. The first ten terms starting at zero are 0, 1, 1, 2, 3, 5, 8, 13, 21, 34.

Dictionary: Student is a dataclass containing name, roll, and marks. student_to_dict uses dataclasses.asdict to convert the structured record into a separate dictionary. Two tests check the converted fields and confirm that changing the resulting dictionary leaves the record unchanged. Sample grades are fictional.

### Messy Python Code Improvement

The linked script uses functions for total marks, average marks, and counting students above the class average. It processes three subject scores per student. Splitting repeated calculations into functions makes the flow easier to follow. The repository's existing output formatting is still compact.

### Bug Fixing with Python

The documented corrections are:
- Divide total marks by len(marks), not by an incorrect denominator.
- Use >= 40 so the passing boundary is included.
- Test the distinction threshold before lower grade thresholds.

The repository has nine unit tests. Recorded test outputs in a repository are historical evidence, not proof that a new run was performed. The current calculate_average function does not handle an empty list.

### Quiz

JavaScript stores five question objects. Each has question text, options, and the answer. Clicking an answer updates the score if correct and moves to the next question. The final screen shows the total score.

### Reading list

React state stores book objects. localStorage persists those objects in the same browser. Each has an ID, title, and reading status. The app supports adding, removing, filtering, and changing status. There is no account system or cross-device synchronization.

## Demonstration checklist

- Introduce yourself and show the personal/education sections.
- Search for Python, Quiz, and Book; try an unmatched query and reset.
- Switch theme, reload, and check that the choice is remembered.
- Open repository links and available live applications.
- Add a book, change its status, and reload to check persistence.
- Ask the AI about education, Python projects, bug fixes, and the reading-list implementation.
- Explain the browser -> server -> AI provider -> browser flow.
- Distinguish the new portfolio work from the existing shared coursework sources.

## What was deliberately avoided

No invented awards, years of professional experience, fabricated testimonials, fake test results, copied secret keys, or rewritten contributor history were added.



## Live weather section

The Weather section searches Open-Meteo's geocoding API for a city and shows matching locations with region/country labels. It requests current temperature, apparent temperature, humidity, weather code and wind speed from Open-Meteo's forecast API. Weather codes become readable conditions. Values use Celsius, percent and km/h; the timestamp is local to the selected city. These are model-based current conditions, refreshed on each search, not a continuously updating station feed.

Browser requests need no API key for this non-commercial portfolio. CSP allows only the two specific API origins in addition to the portfolio. Both services are credited in the section. Searches handle no results, timeouts, offline errors and provider failures; previous requests are cancelled so a slow response cannot replace a newer search.
