#!/bin/sh
# Does the commit about to be pushed carry two SHIP reviews from scripts/review.sh?
#
#   scripts/check-reviews.sh <sha>
#
# Prints one line and exits 0 when both passes say SHIP for exactly that commit;
# otherwise prints what is missing and exits 1. The pre-push hook only WARNS on
# exit 1 - pushing unreviewed work to a branch is allowed and sometimes right (a
# draft, an urgent fix); merging it is the decision this check informs.
set -u

sha=${1:?Usage: check-reviews.sh <sha>}
common_dir=$(git rev-parse --path-format=absolute --git-common-dir)
manifest="$common_dir/review-evidence/$sha/manifest.json"

if [ ! -f "$manifest" ]; then
  echo "NOT REVIEWED: no review evidence for $sha. Run scripts/review.sh (or /cross-review)."
  exit 1
fi
command -v jq >/dev/null 2>&1 || { echo "NOT CHECKED: jq is missing, cannot read $manifest."; exit 1; }

logic=$(jq -r '.logic_verdict' "$manifest" | tr -d '\r')
security=$(jq -r '.security_verdict' "$manifest" | tr -d '\r')
independence=$(jq -r '.independence' "$manifest" | tr -d '\r')
if [ "$logic" = SHIP ] && [ "$security" = SHIP ]; then
  echo "reviewed: logic SHIP, security SHIP ($independence) for $sha"
  exit 0
fi
echo "NOT SHIPPABLE: logic $logic, security $security for $sha. Evidence: $(dirname "$manifest")"
exit 1
