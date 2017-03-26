# Polymer App Toolbox w/ PRPL

This is a demo repo that shows HTTP/2 Push directives being correctly created and served from upgraded Polymer CLI branches. See:

  - [Push Manifest generating polymer-build](https://github.com/slightlyoff/polymer-build/tree/push-manifest)
  - [Push Manifest generating polymer-cli](https://github.com/slightlyoff/polymer-cli/tree/push)

### Setup

##### Prerequisites

First, create a new directory:

    mkdir polymer-prpl
    cd polymer-prpl

Then check out theis repo:

    git clone https://github.com/slightlyoff/polymer-prpl-example-project.git

Then, check out the push manifest branch of Polymer Build:

    git clone https://github.com/slightlyoff/polymer-build.git
    cd polymer-build
    git checkout push-manifest
    npm install
    cd ..

Next, checkout the push manifest branch of Polymer CLI and switch to the push branch, linking in the polymer-build branch we just checked out:

    git clone https://github.com/slightlyoff/polymer-cli.git
    cd polymer-cli
    npm install
    git checkout push
    npm link ../polymer-build
    npm install
    npm test
    cd ..

### Build

Move into the example app directory, install the deps we need, and invoke the polymer-cli build we just installed:

    cd polymer-prpl-example-project
    npm install
    ./../polymer-cli/bin/polymer.js build

### Start the one-off Node server for Push

To avoid needing to modify polyserve, this example uses a one-off Node server. To serve the app using it, run:

    DEBUG=http2push npm start

NOTE: this will fail if your polymer-cli and polymer-build do not generate a push manifest file.

This will NOT h/2 push resources to the client. To verify correct operation, open the app in devtools and look at the networking tab. You should see something like this in the Headers tab for the top-level request:

    Accept-Ranges:bytes
Cache-Control:public, max-age=0
Connection:keep-alive
Content-Length:3144
Content-Type:text/html; charset=UTF-8
Date:Sun, 26 Mar 2017 03:38:51 GMT
ETag:W/"c48-15b0892fb30"
Last-Modified:Sun, 26 Mar 2017 03:05:02 GMT
Link:<bower_components/shadycss/apply-shim.min.js>; rel=preload; as=script, <bower_components/shadycss/custom-style-interface.min.js>; rel=preload; as=script, <src/my-app.html>; rel=preload; as=document, <bower_components/polymer/polymer-element.html>; rel=preload; as=document, <bower_components/polymer/lib/mixins/element-mixin.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/boot.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/mixin.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/case-map.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/style-gather.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/resolve-url.html>; rel=preload; as=document, <bower_components/polymer/lib/elements/dom-module.html>; rel=preload; as=document, <bower_components/polymer/lib/mixins/property-effects.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/path.html>; rel=preload; as=document, <bower_components/polymer/lib/mixins/property-accessors.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/async.html>; rel=preload; as=document, <bower_components/polymer/lib/mixins/template-stamp.html>; rel=preload; as=document, <bower_components/app-layout/app-drawer/app-drawer.html>; rel=preload; as=document, <bower_components/polymer/polymer.html>; rel=preload; as=document, <bower_components/polymer/lib/legacy/legacy-element-mixin.html>; rel=preload; as=document, <bower_components/shadycss/apply-shim.html>; rel=preload; as=document, <bower_components/polymer/lib/mixins/gesture-event-listeners.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/gestures.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/debounce.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/import-href.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/render-status.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/unresolved.html>; rel=preload; as=document, <bower_components/polymer/lib/legacy/polymer.dom.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/flattened-nodes-observer.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/array-splice.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/flush.html>; rel=preload; as=document, <bower_components/polymer/lib/legacy/polymer-fn.html>; rel=preload; as=document, <bower_components/polymer/lib/legacy/class.html>; rel=preload; as=document, <bower_components/polymer/lib/legacy/templatizer-behavior.html>; rel=preload; as=document, <bower_components/polymer/lib/utils/templatize.html>; rel=preload; as=document, <bower_components/polymer/lib/mixins/mutable-data.html>; rel=preload; as=document, <bower_components/polymer/lib/elements/dom-bind.html>; rel=preload; as=document, <bower_components/polymer/lib/elements/dom-repeat.html>; rel=preload; as=document, <bower_components/polymer/lib/elements/dom-if.html>; rel=preload; as=document, <bower_components/polymer/lib/elements/array-selector.html>; rel=preload; as=document, <bower_components/polymer/lib/elements/custom-style.html>; rel=preload; as=document, <bower_components/shadycss/custom-style-interface.html>; rel=preload; as=document, <bower_components/polymer/lib/legacy/mutable-data-behavior.html>; rel=preload; as=document, <bower_components/iron-flex-layout/iron-flex-layout.html>; rel=preload; as=document, <bower_components/app-layout/app-drawer-layout/app-drawer-layout.html>; rel=preload; as=document, <bower_components/iron-media-query/iron-media-query.html>; rel=preload; as=document, <bower_components/app-layout/app-layout-behavior/app-layout-behavior.html>; rel=preload; as=document, <bower_components/iron-resizable-behavior/iron-resizable-behavior.html>; rel=preload; as=document, <bower_components/app-layout/app-header/app-header.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/app-scroll-effects-behavior.html>; rel=preload; as=document, <bower_components/iron-scroll-target-behavior/iron-scroll-target-behavior.html>; rel=preload; as=document, <bower_components/app-layout/helpers/helpers.html>; rel=preload; as=document, <bower_components/app-layout/app-header-layout/app-header-layout.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/app-scroll-effects.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/effects/blend-background.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/effects/fade-background.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/effects/material.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/effects/waterfall.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/effects/resize-title.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/effects/parallax-background.html>; rel=preload; as=document, <bower_components/app-layout/app-scroll-effects/effects/resize-snapped-title.html>; rel=preload; as=document, <bower_components/app-layout/app-toolbar/app-toolbar.html>; rel=preload; as=document, <bower_components/app-route/app-location.html>; rel=preload; as=document, <bower_components/iron-location/iron-location.html>; rel=preload; as=document, <bower_components/iron-location/iron-query-params.html>; rel=preload; as=document, <bower_components/app-route/app-route-converter-behavior.html>; rel=preload; as=document, <bower_components/app-route/app-route.html>; rel=preload; as=document, <bower_components/iron-pages/iron-pages.html>; rel=preload; as=document, <bower_components/iron-selector/iron-selectable.html>; rel=preload; as=document, <bower_components/iron-selector/iron-selection.html>; rel=preload; as=document, <bower_components/iron-selector/iron-selector.html>; rel=preload; as=document, <bower_components/iron-selector/iron-multi-selectable.html>; rel=preload; as=document, <bower_components/paper-icon-button/paper-icon-button.html>; rel=preload; as=document, <bower_components/iron-icon/iron-icon.html>; rel=preload; as=document, <bower_components/iron-meta/iron-meta.html>; rel=preload; as=document, <bower_components/paper-behaviors/paper-inky-focus-behavior.html>; rel=preload; as=document, <bower_components/iron-behaviors/iron-button-state.html>; rel=preload; as=document, <bower_components/iron-a11y-keys-behavior/iron-a11y-keys-behavior.html>; rel=preload; as=document, <bower_components/iron-behaviors/iron-control-state.html>; rel=preload; as=document, <bower_components/paper-behaviors/paper-ripple-behavior.html>; rel=preload; as=document, <bower_components/paper-ripple/paper-ripple.html>; rel=preload; as=document, <bower_components/paper-styles/default-theme.html>; rel=preload; as=document, <bower_components/paper-styles/color.html>; rel=preload; as=document, <src/my-icons.html>; rel=preload; as=document, <bower_components/iron-iconset-svg/iron-iconset-svg.html>; rel=preload; as=document
X-Powered-By:Express