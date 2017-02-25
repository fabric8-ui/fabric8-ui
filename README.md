# ngx-widgets
A collection of Angular components and other useful things to be shared.

You can see how it is used in our application [here](https://github.com/fabric8io/fabric8-ui).

The system we build is composed of several components existing in separate repos but
sharing common components, directives, and pipes. These widgets were extracted to 
provide a shared set of services. 

## Getting started:

This library does not run on it's own. It must be imported. 

`npm install ngx-widgets`

There are several services and a couple of models used by them available.

    container-toggle
    dialog
    dropdown
    editable
    icon
    infinitescroll
 

## Building it 
 
#### Install the dependencies:
 
 `npm install`
 
#### If you need to update the dependencies you can reinstall:
 
 `npm run reinstall`
 
#### Run the tests:
 
 `npm test`
 
#### Build the library:
 
 `npm run build`
 
#### Try it out locally. 
 
 We found that `npm link` doesn't fully work. You have to reference the library via `file:`. But you still need to create the link.
 
 - Start by running:
 
   `npm link dist/`
 
 - Change this:
 
   `"ngx-widgets": "X.X.X"`
   
 - to this:
 
   `"ngx-widgets": "file:///[LOCATION-TO-NODE-MODULES]/.nvm/versions/node/v6.9.1/lib/node_modules/ngx-widgets"`
 
 - then in the app that will use the lib:
 
   `npm install ngx-widgets`

## Continuous Delivery & Semantic Relases

In ngx-widgets we use the [semantic-release plugin](https://github.com/semantic-release/semantic-release). That means 
that all you have to do is use the AngularJS Commit Message Conventions (documented below). Once the PR is merged, a new release will be automatically published to npmjs.com and a release tag
created on github. The version will be updated following semantic versionning rules.

### Commit Message Format

A commit message consists of a **header**, **body** and **footer**.  The header has a **type**, **scope** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

### Scope

The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

Based on https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit

[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#


### Examples

Appears under "Features" header, pencil subheader:

```
feat(pencil): add 'graphiteWidth' option
```

Appears under "Bug Fixes" header, graphite subheader, with a link to issue #28:

```
fix(graphite): stop graphite breaking when width < 0.1

Closes #28
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for performance reason.
```

The following commit and commit `667ecc1` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

### Commitizen - craft valid commit messages

Commitizen helps you craft correct commit messages. Install it using `npm install commitizen -g`. Then run `git cz` rather than `git commit`.

### Validate-commit-msg - validate commit messages

The validate-commit-msg githook checks for invalid commit messages.
