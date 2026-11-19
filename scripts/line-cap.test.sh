#!/bin/sh
set -eu
here=$(cd "$(dirname "$0")/.." && pwd)
t=$(mktemp -d)
trap 'rm -rf "$t"' EXIT
mkdir -p "$t/scripts" "$t/ci/cap.d" "$t/src/a" "$t/tests"
cp "$here/scripts/line-cap.sh" "$t/scripts/"
printf '[fleet.swag]\nline_cap = 3\nwarn_within = 0\n' > "$t/ci/cap.toml"
printf 'fn a() {}\n\n#[cfg(test)]\nmod t {}\n' > "$t/src/lib.rs"
printf 'fn b() {}\n' > "$t/src/a/b.rs"
printf 'fn t() {}\n' > "$t/tests/t.rs"
out=$(sh "$t/scripts/line-cap.sh")
test "$out" = "non-test lines: 3 / cap 3" || { echo "at cap: got: $out" >&2; exit 1; }
printf 'fn c() {}\n' >> "$t/src/a/b.rs"
if sh "$t/scripts/line-cap.sh" > "$t/over.log"; then echo "over cap passed: $(cat "$t/over.log")" >&2; exit 1; fi
grep -qx 'non-test lines: 4 / cap 3' "$t/over.log" || { echo "over cap: got: $(cat "$t/over.log")" >&2; exit 1; }
printf 'line_cap = 4\n' > "$t/ci/cap.d/raise.toml"
sh "$t/scripts/line-cap.sh" > /dev/null || { echo "cap.d raise ignored" >&2; exit 1; }
echo "line-cap tests pass"
