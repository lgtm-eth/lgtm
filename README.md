## LGTM
This repository contains code for LGTM.
- `eth/` contains smart contracts.
- `web/` contains the website UI frontend.
- `server/` contains the backend node app.

# CI
Pull requests trigger test builds and previews.
Merges to `main` trigger staging builds to the [dev environment](https://lgtm-info-dev.web.app/)
Creating a release triggers production builds to the [prod environment](https://lgtm.info)

# Style
There is a pre-commit hook to run [prettier](https://prettier.io/) across the codebase on all staged files.

# Branch Flow
The `main` branch contains the latest code and it should always be ready to release.
Developers create branches for their work (conventionally named `<name>-<feature>` e.g. `daniel-new-logo`)
and issue a pull request when it is ready to merge.

To avoid conflicts, work-in-progress branches should sync any changes to avoid conflicts.

With the `sync` and `shove` helper scripts, the typical workflow for this looks like this:

```
$ git checkout -b daniel-new-logo
$ ... modify a bunch of files to add the new logo ...
$ git add .
$ git commit -m "added the new logo, used it on the homepage"
$ git shove
$ ... create PR to preview changes and get feedback ...
$ ... come back the next day ...
$ git sync
$ ... modify some more files based on feedback ...
$ git add .
$ git commit -m "move the logo to the left a little"
$ git shove
$ ... merge the PR ...
$ git checkout main
$ git sync
$ ... repeat from the beginning ...
```

## Dev Setup
### Preconditions
This assumes you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [node](https://nodejs.org/) setup locally.

### Setup Repository
First clone the repository:
```
$ git clone https://github.com/dmccartney/lgtm
```

Then install the root dependencies
```
$ cd lgtm
$ npm install
```

### `web/`
```
$ cd web
$ npm install
$ npm test
$ npm start
```

### `/server`
```
$ cd server
$ npm install
$ npm test
$ cd ..
$ firebase emulators:start
```