#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bad=0
t="${DROVER_SCRATCH_TARGET:-${RUNNER_TEMP:-${TMPDIR:-/tmp}}}/lint-fixtures"
mkdir -p "$t/src"
cp rust-toolchain.toml clippy.toml "$t/"
{
  printf '[package]\nname = "lint-fixture"\nversion = "0.0.0"\nedition = "2021"\n\n[workspace]\n\n'
  sed -n '/^\[lints\./,$p' Cargo.toml
} >"$t/Cargo.toml"
for f in ci/lint-fixtures/rust/*.rs; do
  name=$(basename "$f" .rs)
  cp "$f" "$t/src/lib.rs"
  code=0
  out=$(cd "$t" && cargo clippy -q --all-targets 2>&1) || code=$?
  if [ "$name" = clean ]; then
    [ "$code" -eq 0 ] && echo "ok: clean passes" || { echo "::error::clean fixture failed: $out"; bad=1; }
  elif [ "$code" -eq 0 ] || ! grep -q -e "${name//_/[_-]}" <<<"$out"; then
    echo "::error::fixture $name did not fail on $name: $out"
    bad=1
  else
    echo "ok: $name is refused"
  fi
done
exit "$bad"
