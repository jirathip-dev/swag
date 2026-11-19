drover := env("DROVER", "drover")
test_allow := "-A clippy::unwrap_used -A clippy::expect_used -A clippy::panic -A clippy::indexing_slicing -A clippy::as_conversions -A clippy::print_stdout -A clippy::print_stderr -A clippy::let_underscore_must_use"

check: fmt clippy fixtures test deny arch cap actionlint

fmt:
    cargo fmt --check

clippy:
    cargo clippy --all-features --lib --locked -- -D warnings
    cargo clippy --all-features --tests --locked -- -D warnings {{test_allow}}

fixtures:
    scripts/lint-fixtures.sh

test:
    cargo test --all-features --locked

deny:
    cargo deny --locked check

arch:
    {{drover}} arch-check ${BASE:+--base "$BASE"} ${PR_BODY:+--pr-body "$PR_BODY"}

cap:
    sh scripts/line-cap.sh
    sh scripts/line-cap.test.sh
    test "$(wc -l < .drover/rules.md)" -le 30 || { echo ".drover/rules.md is over 30 lines"; exit 1; }

actionlint:
    actionlint -color
