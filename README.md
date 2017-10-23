# Travis Deploy Example

Example of using Travis CI to automatically publish your packages to npm, using:

* Travis CI's [npm deploy](https://docs.travis-ci.com/user/deployment/npm/) functionality.
* The [standard-version](https://github.com/conventional-changelog/standard-version) package,
  for automating [semver](http://semver.org/) bumps and CHANGELOG generation.

## Setting `NPM_AUTH_TOKEN` environment variable

To be able to install private packages and to publish on your behalf, Travis CI
needs your npm deploy token. After logging into npm, [this token can be found
in your `~/.npmrc` file](https://npme.npmjs.com/docs/workflow/travis.html#option-1-fetch-your-npm-enterprise-secret-token).

Once you fetch your token, set this as an environment variable in Travis CI called `NPM_AUTH_TOKEN`:

## Configuration Travis CI for Deployment

The `.travis.yml` included in this repository automatically publishes to npm, if
tests pass for any [git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) that you push to GitHub. Here
are the pertinent lines in the `.travis.yml` to support this:

```yaml
deploy:
  provider: npm
  email: ben@npmjs.com
  api_key: $NPM_TOKEN
  on:
    tags: true
```

That's all there is to it!

## Commit Format

Deciding on what version to bump your package is a hassle; _did I add a feature since I
last released, was it just patches?_ This demo uses [standard-version](https://github.com/conventional-changelog/standard-version) to solve this problem.

When making commits, simply follow these commit standards:

_patches:_

```sh
git commit -a -m "fix: fixed a bug in our parser"
```

_features:_

```sh
git commit -a -m "feat: we now have a parser \o/"
```

_breaking changes:_

```sh
git commit -a -m "feat: introduces a new parsing library
BREAKING CHANGE: new library does not support foo-construct"
```

_other changes:_

You decide, e.g., docs, chore, etc.

## Publishing Your Package From Travis CI

When you're ready to have Travis CI publish a new version of your package to npm:

* `npm run release`, this will look at your commit history, and use [standard-version](https://github.com/conventional-changelog/standard-version)
  to: bump the version #, create a tag, and update your CHANGELOG.
* `git push --follow-tags origin master`, this will push the tag up to GitHub
  and kick off a build on Travis CI which will publish your module once it succeeds.

That's all there is to it, it's _literally_ magic.
