#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
cap=$(cat ci/cap.toml ci/cap.d/*.toml 2>/dev/null | sed -n 's/^line_cap *= *\([0-9]*\).*/\1/p' | sort -n | tail -n 1)
test -n "$cap" || { echo "line_cap missing from ci/cap.toml" >&2; exit 2; }
warn=$(sed -n 's/^warn_within *= *\([0-9]*\).*/\1/p' ci/cap.toml)
n=$(find src -name '*.rs' -exec awk '/^[[:space:]]*#\[cfg\(test\)\]/ { exit } { n++ } END { print n + 0 }' {} \; | awk '{ s += $1 } END { print s + 0 }')
echo "non-test lines: $n / cap $cap"
left=$((cap - n))
test "$left" -ge "${warn:-50}" || test "$left" -lt 0 || echo "WARN: $left lines of headroom (< ${warn:-50})"
test "$left" -ge 0
