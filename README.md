# Polymer App Toolbox w/ PRPL

This is a demo repo that shows HTTP/2 Push directives being correctly created and served from upgraded Polymer CLI branches. See:

  - [Push Manifest generating polymer-build](https://github.com/slightlyoff/polymer-build/tree/push-manifest)
  - [Push Manifest generating polymer-cli](https://github.com/slightlyoff/polymer-cli/tree/push)

### Setup

##### Prerequisites

First, install [Polymer CLI](https://github.com/Polymer/polymer-cli) using
[npm](https://www.npmjs.com) (we assume you have pre-installed [node.js](https://nodejs.org)).

    npm install -g polymer-cli

### Build

This command performs HTML, CSS, and JS minification on the application
dependencies, and generates a service-worker.js file with code to pre-cache the
dependencies based on the entrypoint and fragments specified in `polymer.json`.
The minified files are output to the `build/unbundled` folder, and are suitable
for serving from a HTTP/2+Push compatible server.

In addition the command also creates a fallback `build/bundled` folder,
generated using fragment bundling, suitable for serving from non
H2/push-compatible servers or to clients that do not support H2/Push.

    polymer build

### Start the one-off Node server for Push

This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app:

    DEBUG=http2push npm start

NOTE: this will fail if your polymer-cli and polymer-build do not generate a push manifest file.