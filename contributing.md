# Contributing
How to contribute Third-party contributions is the spirit of open source development.
This app is licensed free for use and redistribution. We simply can't access the huge number of api and module configuration on our iOS app alone. We want to keep it as easy as possible to contribute changes that get things working in your environment. There are a few guidelines that we need contributors to follow so that we can have a chance of keeping on top of things. Let’s start with the features that we need as much help building such as; creating heat maps according to the location, optimizing routes and so on.

## Getting Started
Make sure you have a GitHub account Fork the repository on GitHub Follow instructions below and submit a pull request Making Changes Create a topic branch from where you want to base your work. This is usually the master branch. (As currently there is only a master branch) Only target release branches if you are certain your fix must be on that branch. To quickly create a topic branch based on master; git checkout -b fix/master/my_contribution master. Please avoid working directly on the master branch. Make commits of logical units. Check for unnecessary whitespace with git diff --check before committing. Make sure your commit messages are in the proper format. Make the example in CONTRIBUTING imperative and concrete

Without this patch applied the example commit message in the CONTRIBUTING document is not a concrete example. This is a problem because the contributor is left to imagine what the commit message should look like based on a description rather than an example. This patch fixes the problem by making the example concrete and imperative.

The first line is a real life imperative statementThe body describes the behavior, why this is a problem, and how the patch fixes the problem when applied. Make sure you have added the necessary tests for your changes. Run all the tests (if there are any) to assure nothing else was accidentally broken. Making Trivial Changes Documentation For changes of a trivial nature to comments and documentation, approvals will be faster In this case, it is appropriate to start the first line of a commit with '(doc)' (doc) Add documentation commit example to CONTRIBUTING

There is no example for contributing a documentation commit to the Puppet repository. This is a problem because the contributor is left to assume how a commit of this nature may appear.

The first line is a real life imperative statement with '(doc)' non-documentation related commit. The body describes the nature of the new documentation or comments added.

## Submitting Changes
Read Open Source Contributor Guidelines. http://wiki.civiccommons.org/Open_Source_Development_Guidelines/ Push your changes to a topic branch in your fork of the repository. Submit a pull request to the repository in the puppetlabs organization. Update your Jira ticket to mark that you have submitted code and are ready for it to be reviewed (Status: Ready for Merge). Include a link to the pull request in the ticket. The core team looks at Pull Requests on availability. Please understand the core creators of the app are for now college students and please pardon us if there is delay to updating and merging it. After feedback has been given we expect responses within four weeks. After four weeks we may close the pull request if it isn't showing any activity.

## Revert Policy
By running tests in advance and by engaging with peer review for prospective changes, your contributions have a high probability of becoming long lived parts of the the project. After being merged, the code will run through team’s code review pipeline. If the code change results in a test failure or build failiure, we will make our best effort to correct the error. If a fix cannot be determined and committed within 24 hours of its discovery, the commit(s) responsible may be reverted, at the discretion of the committer.
