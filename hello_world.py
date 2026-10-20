"""A tiny, dependency-free Hello World command-line application."""

import argparse
import json


def build_greeting(name: str = "World") -> str:
    """Return a greeting, using 'World' when the name is blank."""
    normalized_name = name.strip() if name and name.strip() else "World"
    return f"Hello, {normalized_name}!"


def main() -> int:
    """Parse command-line options and print the requested greeting."""
    parser = argparse.ArgumentParser(
        description="Print a friendly greeting.",
    )
    parser.add_argument(
        "--name",
        default="World",
        help="name to greet (default: World)",
    )
    parser.add_argument(
        "--format",
        choices=("text", "json"),
        default="text",
        help="output format (default: text)",
    )
    args = parser.parse_args()
    greeting = build_greeting(args.name)

    if args.format == "json":
        print(json.dumps({"greeting": greeting}, ensure_ascii=False))
    else:
        print(greeting)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
