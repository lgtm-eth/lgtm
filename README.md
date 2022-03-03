## LGTM
This repository contains code for LGTM.
- `eth/` contains smart contracts.
- `web/` contains the website UI.

# CI
Pull requests trigger test builds and previews.
Merges to `main` trigger staging builds to the dev environment.
Creating a release triggers production builds.

# Style
There is a pre-commit hook to run `prettier` across the codebase on all staged files.