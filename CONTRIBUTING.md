# Contributing

Thanks for helping improve Hello World!

## Before you start

- Use Python 3.10 or newer.
- Check the [specification](docs/SPEC.md) and [roadmap](docs/ROADMAP.md).
- Keep changes focused and avoid adding dependencies without a clear reason.

## Development workflow

1. Fork the repository or create a branch.
2. Make a focused change.
3. Add or update tests for changed behavior.
4. Run the test suite:

   ```bash
   python -m unittest discover -s tests -v
   ```

5. Update documentation if commands, requirements, or behavior change.
6. Commit with a descriptive message and open a pull request.

## Commit message examples

- `Add JSON output tests`
- `Document command-line options`
- `Fix whitespace handling for names`

## Pull request checklist

- [ ] The change solves a clearly described problem.
- [ ] Tests pass locally.
- [ ] Documentation reflects the change.
- [ ] No secrets, tokens, or personal credentials are included.
- [ ] Any new dependency is justified.

## Reporting bugs

Use the Bug Report issue template and include the Python version, operating system, steps to reproduce, expected behavior, and actual behavior. Remove private information from logs before posting.
