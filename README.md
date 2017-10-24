# Travis Deploy Example

Example of using Travis CI to automatically publish your packages to npm, Github Releases, and AWS S3 using:

* Travis CI's deployment options
  * [npm deploy](https://docs.travis-ci.com/user/deployment/npm/) functionality.
  * [Github Releases deploy](https://docs.travis-ci.com/user/deployment/releases/) functionality
  * [AWS S3 deploy](https://docs.travis-ci.com/user/deployment/s3/)
* The [standard-version](https://github.com/conventional-changelog/standard-version) package,
  for automating [semver](http://semver.org/) bumps and CHANGELOG generation.

## Travis CI environment variables
### `NPM_AUTH_TOKEN` environment variable

To be able to install private packages and to publish on your behalf, Travis CI
needs your npm deploy token. After logging into npm, [this token can be found
in your `~/.npmrc` file](https://npme.npmjs.com/docs/workflow/travis.html#option-1-fetch-your-npm-enterprise-secret-token).

Once you fetch your token, set this as an environment variable in Travis CI called `NPM_AUTH_TOKEN`:

### `GITHUB_AUTH_TOKEN` environment variable

To be able to publish to Github Releases, Travis CI needs a Github token that
has the [`public_repo` scope](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-scopes-for-oauth-apps/). To obtain a Github token, log into Github, navigate to the
[Personal access tokens](https://github.com/settings/tokens) page, and
[Generate a new token](https://github.com/settings/tokens/new). Make sure the
`public_repo` scope is checked.

Once you fetch your token, set this as an environment variable in Travis CI called
`GITHUB_AUTH_TOKEN`.

### AWS environment variables

To be able to publish to AWS S3, Travis CI needs two keys associated with an AWS
IAM user to authenticate to AWS: The Access key ID, and the Secret Key ID. These
can be assigned by the owner of the AWS account and you want to make sure that
when creating your IAM user, that you allow the IAM user to be used for
[programmatic access](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).

Once you have obtained these two keys, set them as environment variables called
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## Configuration Travis CI for Deployment

The `.travis.yml` included in this repository automatically publishes to npm, Github Releases, and AWS S3 if tests pass for any [git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) that you push to GitHub. Here are the pertinent lines in the `.travis.yml` to support this:

```yaml
deploy:
  - provider: npm
    email: waltshirey@gmail.com
    api_key: $NPM_AUTH_TOKEN
    skip_cleanup: true
    on:
  - provider: s3
    access_key_id: $AWS_ACCESS_KEY_ID
    secret_access_key: $AWS_SECRET_ACCESS_KEY
    bucket: "js-library-travis-ci"
    upload_dir: lib/$TRAVIS_TAG
    local_dir: lib
    skip_cleanup: true
    on:
      tags: true
  - provider: releases
    api-key: $GITHUB_AUTH_TOKEN
    file: lib/index.js
    skip_cleanup: true
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
