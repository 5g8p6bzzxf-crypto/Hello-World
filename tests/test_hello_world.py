import json
import subprocess
import sys
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SCRIPT = PROJECT_ROOT / "hello_world.py"

# Import from the repository root without requiring package installation.
sys.path.insert(0, str(PROJECT_ROOT))
from hello_world import build_greeting  # noqa: E402


class GreetingTests(unittest.TestCase):
    def test_default_name(self):
        self.assertEqual(build_greeting(), "Hello, World!")

    def test_custom_name(self):
        self.assertEqual(build_greeting("Pablo"), "Hello, Pablo!")

    def test_whitespace_name_uses_default(self):
        self.assertEqual(build_greeting("   "), "Hello, World!")

    def test_name_is_trimmed(self):
        self.assertEqual(build_greeting("  Pablo  "), "Hello, Pablo!")


class CommandLineTests(unittest.TestCase):
    def run_script(self, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), *args],
            check=False,
            capture_output=True,
            text=True,
            cwd=PROJECT_ROOT,
        )

    def test_default_cli_output(self):
        result = self.run_script()
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout.strip(), "Hello, World!")

    def test_custom_name_cli_output(self):
        result = self.run_script("--name", "Pablo")
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout.strip(), "Hello, Pablo!")

    def test_json_output_is_valid(self):
        result = self.run_script("--name", "Pablo", "--format", "json")
        self.assertEqual(result.returncode, 0)
        payload = json.loads(result.stdout)
        self.assertEqual(payload["greeting"], "Hello, Pablo!")


if __name__ == "__main__":
    unittest.main()
