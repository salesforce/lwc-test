# Contributing

Before contributing to this repository make sure to discuss first the intended changes either by creating a new issue or commenting an existing one.

## Useful commands

Once the repository has been cloned you can run the following commands from the root directory.

```sh
$ yarn install       # install project dependencies
$ yarn lint          # run linting against project code
$ yarn test          # run test
```

## Submitting code

Any code change should be submitted as a pull request. The description should explain what the code does and give steps to execute it. The pull request should also contain tests.

## Review process

The bigger the pull request, the longer it will take to review and merge. Try to break down large pull requests in smaller chunks that are easier to review and merge. Also make sure to reference the related issues in the pull request message, if any.

## Publishing a new release

Checkout the latest `master` branch of the repo. Run `yarn release <version> <npm-tag>` command by providing the appropriate arguments to publish a new release of the package. A release commit should have been automatically created on your local branch. Push the release commit and the git tag to the remote repo.