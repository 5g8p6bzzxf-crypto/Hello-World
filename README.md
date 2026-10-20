# Hello World — Python Starter Project

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![Tests](https://img.shields.io/badge/tests-unittest-success)
![License](https://img.shields.io/badge/license-MIT-blue)

A small, well-structured Python project that grows the original **Hello World** example into a practical starter repository. It includes a command-line interface, automated tests, project specifications, contribution guidance, and a roadmap.

## What it does

- Prints a friendly greeting.
- Supports a custom name from the command line.
- Can return the greeting as plain text or JSON.
- Includes automated tests using Python's standard library.
- Documents scope, requirements, architecture, and planned improvements.

## Quick start

**Requirements:** Python 3.10 or newer. No third-party packages are required.

```bash
git clone https://github.com/5g8p6bzzxf-crypto/Hello-World.git
cd Hello-World
python hello_world.py
```

Expected output:

```text
Hello, World!
```

Personalized greeting:

```bash
python hello_world.py --name Pablo
```

JSON output:

```bash
python hello_world.py --name Pablo --format json
```

## Run the tests

```bash
python -m unittest discover -s tests -v
```

## Project structure

```text
Hello-World/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
├── docs/
│   ├── ROADMAP.md
│   └── SPEC.md
├── tests/
│   └── test_hello_world.py
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── pyproject.toml
└── hello_world.py
```

## Documentation

- [Functional and technical specification](docs/SPEC.md)
- [Project roadmap](docs/ROADMAP.md)
- [Contribution guidelines](CONTRIBUTING.md)

## Design principles

1. **Simple by default:** the basic command works without arguments.
2. **Standard library first:** no runtime dependencies.
3. **Testable:** greeting logic is separate from command-line parsing.
4. **Predictable output:** text is the default; JSON is explicit.
5. **Open development:** changes are documented and tracked in Git.

## Current status

The starter implementation and repository documentation are in place. See the roadmap for possible next steps. Features not implemented yet are listed as planned rather than presented as complete.

## License

Distributed under the MIT License. See [LICENSE](LICENSE).


## Web interface

The repository also includes a responsive dark-themed website built with plain HTML, CSS, and JavaScript.

- `index.html` — landing page and interactive greeting form.
- `style.css` — responsive styling and accessibility-friendly states.
- `script.js` — personalized greetings, copy button, mobile menu, and dynamic year.
- `favicon.svg` — browser tab icon.

### Run the website locally

Open `index.html` in a modern browser, or start a local server from the project root:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

### Publish with GitHub Pages

Follow the full guide in [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md). In short, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. The public URL becomes available after Pages is enabled and deployment completes.

See [the web interface specification](docs/WEB_SPEC.md) for behavior and acceptance criteria.


## Additional web features

- Light and dark theme toggle with a saved local preference.
- Four greeting styles, random greeting suggestions, and a reset button.
- Character counter and greeting history stored locally in your browser.
- Restore previous greetings, clear history, or export it as JSON.
- The history is local to the browser; it is not uploaded to the repository or a server.
