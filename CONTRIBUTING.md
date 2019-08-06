# Contributing

We greatly appreciate your contribution to the development of this
project and are very grateful to any of your help that you can offer, be
it assistance in developing a codebase, auditing existing code, creating
bugs and issues in the issue list, or commenting on already created
issues.

But before you spend your time developing code, please make sure that
you take into account the points described below:

1. If the problem you are trying to solve is related to security, we
   will be very grateful if before creating issue or Pull Request you
   follow the steps described here - [SECURITY.md](SECURITY.md).
2. See a list of known issues. Perhaps the problem you are trying to
   solve has already been discussed and, as an option, work is already
   underway to fix it.
3. If there is no issue in the list, we will be grateful if you create
   an appropriate Issue, which we can discuss and come to the option
   together, how best to solve it. In addition, our team is constantly
   working on improving the project, and therefore there is a high
   probability that the task you are planning to solve is already
   planned by our team and has a plan for solving it. In any case,
   having Issue, we always have the opportunity to help you.

If you already have code that you would like to merge into the main
development branch, you will come in handy a few recommendations, which
we described below.

## Pull Request Process

1. Make sure your branch is based on the `develop` branch and includes
   the latest state. We are developing in the `develop` branch, so your
   request should be directed to it. If your fix is a critical bugfix,
   then you can create a request to the `master`. Such requests will be
   reviewed more closely, so please provide as much information as
   possible about what you are correcting and why your request should be
   sent to the `master`.
2. Make sure your code does not violate the lint rules.
3. Make sure the CI processes are successful
4. If your request is associated with a bug or issue from the issues
   list, add the line `Fixes #$ISSUE_NUMBER` or `Resolves 
   #$ISSUE_NUMBER`. Ex. For closing issue `418`, include the line `Fixes
   #418`. If it doesn't close the issue but addresses it partially, just
   include a reference to the issue number, like `#418`.
5. You can merge the request after you have at least one approval of
   core contributor, or, if you do not have permission to do so, you may
   request the second reviewer to merge it for you.

Thank you for helping to make this project better!