# Walkable 
An open source & crowd sourced walking navigation for safe, fast & resourceful walks around your place.

Uses completely anonymous location & reporting data from people around the town & machine learning to suggest safe, fast and enjoyable trips around town.
Reports and visualizes insights from user data to public safety to improve security in towns

## Uses

### For Civillian
- Find safe routes to your destination.
- Find out details about routes you walk.
- A heatmap to avoid over crowded areas or find popular areas.
- Find events and activities near your walking routes, join if you are adventurous or avoid if you don't want to be bothered

### For Public Safety
- Analyze popular routes by users and ensure high security by focusing on those areas
- Identify and analyze security concerns in crowded areas
- Get rich insights from crowd sourced data over the cloud using our dashboard
- Give and receive general community feedback on paths that people take every day

## Open Sourcing the platform
We strongly believe that this tool needs to be open sourced in order to maintain transparency, credibility and allow government and city officials to maintain their own version of the database and data analytics to empower their communities and economic development. 

## Contributing
### How to contribute Third-party contributions is the spirit of open source development.
This app is licensed free for use and redistribution. We simply can't access the huge number of api and module configuration on our iOS app alone. We want to keep it as easy as possible to contribute changes that get things working in your environment. There are a few guidelines that we need contributors to follow so that we can have a chance of keeping on top of things. Let’s start with the features that we need as much help building such as; creating heat maps according to the location, optimizing routes and so on. 

### Getting Started
Make sure you have a GitHub account Fork the repository on GitHub Follow instructions below and submit a pull request Making Changes Create a topic branch from where you want to base your work. This is usually the master branch. (As currently there is only a master branch) Only target release branches if you are certain your fix must be on that branch. To quickly create a topic branch based on master; git checkout -b fix/master/my_contribution master. Please avoid working directly on the master branch. Make commits of logical units. Check for unnecessary whitespace with git diff --check before committing. Make sure your commit messages are in the proper format. Make the example in CONTRIBUTING imperative and concrete

Without this patch applied the example commit message in the CONTRIBUTING
document is not a concrete example.  This is a problem because the
contributor is left to imagine what the commit message should look like
based on a description rather than an example.  This patch fixes the
problem by making the example concrete and imperative.

The first line is a real life imperative statementThe body describes the behavior, 
why this is a problem, and how the patch fixes the problem when applied.
Make sure you have added the necessary tests for your changes. Run all the tests (if there are any) to assure nothing else was accidentally broken. Making Trivial Changes Documentation For changes of a trivial nature to comments and documentation, approvals will be faster In this case, it is appropriate to start the first line of a commit with '(doc)' (doc) Add documentation commit example to CONTRIBUTING

There is no example for contributing a documentation commit
to the Puppet repository. This is a problem because the contributor
is left to assume how a commit of this nature may appear.

The first line is a real life imperative statement with '(doc)'
non-documentation related commit. The body describes the nature of
the new documentation or comments added.
### Submitting Changes

Read Open Source Contributor Guidelines. http://wiki.civiccommons.org/Open_Source_Development_Guidelines/
Push your changes to a topic branch in your fork of the repository.
Submit a pull request to the repository in the puppetlabs organization.
Update your Jira ticket to mark that you have submitted code and are ready for it to be reviewed (Status: Ready for Merge).
Include a link to the pull request in the ticket.
The core team looks at Pull Requests on availability. Please understand the core creators of the app are for now college students and please pardon us if there is delay to updating and merging it.
After feedback has been given we expect responses within four weeks. After four weeks we may close the pull request if it isn't showing any activity.
### Revert Policy

By running tests in advance and by engaging with peer review for prospective changes, your contributions have a high probability of becoming long lived parts of the the project. After being merged, the code will run through team’s code review pipeline.
If the code change results in a test failure or build failiure, we will make our best effort to correct the error. If a fix cannot be determined and committed within 24 hours of its discovery, the commit(s) responsible may be reverted, at the discretion of the committer.

## Licensing and Using in Your Community
To be filled


How to run the backend
============

The backend is implemented in Python Flask and contains the rest endpoints for the front end to access. The backend is deployed on Heroku. 

Instructions
------------

First, you'll need to clone the repo.

    $ git clone https://github.com/metemorris/hackillinois2018.git

Second, let's download `pip`, `virtualenv`, `foreman`, and the [`heroku`
Ruby gem](http://devcenter.heroku.com/articles/using-the-cli).

    $ sudo easy_install pip
    $ sudo pip install virtualenv
    $ sudo gem install foreman heroku

Now, you can setup an isolated environment with `virtualenv`.

    $ virtualenv --no-site-packages env
    $ source env/bin/activate


Installing Packages
--------------------

### Gevent

To use `gevent`, we'll need to install `libevent` for the
`gevent` production server. If you're operating on a Linux OS, you can
`apt-get install libevent-dev`. If you're using Mac OS X, consider
installing the [homebrew](http://mxcl.github.com/homebrew/) package
manager, and run the following command:

    $ brew install libevent

If you're using Mac OS X, you can also install `libevent` through [a DMG
available on Rudix](http://rudix.org/packages-jkl.html#libevent).


### Without Gevent

If you'd rather use `gunicorn` without `gevent`, you just need to edit
the `Procfile` and `requirements.txt`.

First, edit the `Procfile` to look the following:

    web: gunicorn -w 4 -b "0.0.0.0:$PORT" app:app

Second, remove `gevent` from the `requirements.txt` file.

### pip

Then, let's get the requirements installed in your isolated test
environment.

    $ pip install -r requirements.txt


Running Your Application
------------------------

Now, you can run the application locally.

    $ foreman start

You can also specify what port you'd prefer to use.

    $ foreman start -p 5555


Deploying to Heroku
---------

    $ git push heroku master
    $ heroku scale web=1

Finally, we can make sure the application is up and running.

    $ heroku ps

Now, we can view the application in our web browser.

    $ heroku open

And, to deactivate `virtualenv` (once you've finished coding), you
simply run the following command:

    $ deactivate


Rest endpoints
----------

After you've got your application up and running, there a couple next
steps you should consider following

### /update/ 

POST request

It takes in: 
- latitude (required)
- longitude (required)
- user id (required)

This updates the user's location in the SQL database and also on firebase for real time updates. 

### /updateIncidents/ 

POST request

It takes in: 
- latitude (required)
- longitude (required)
- type (required)

This updates the incident's location, along with the type in the SQL database and also on firebase for real time updates. 

### /get/heatmap/ 

POST request

It takes in: 
- latitude (required)
- longitude (required)

This gives the heatmap near the location.


### /get/traffic/ 

POST request

It takes in: 
- latitude (required)
- longitude (required)

This gives the traffic around a certain location.

### /get/incident/ 

POST request

It takes in: 
- latitude (required)
- longitude (required)

This gives the incident around a certain location.


Testing | Simulating users
----------
To simulate users, you can run simulation.py. 

Simulation.py contains the range of latitude/longitude you want your 'users' to be simulated within. You can also specify how much distance the users should move, and also specify the duration in which they will trigger an incident. Along with the amount of users that can be simulated, even the randomness of an incident generation can be adjusted.

