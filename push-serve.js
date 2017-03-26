"use strict";

const fs = require("fs");
const path = require("path");
const debug = require("debug")("http2push-gae");
const log = debug;
const err = (...args) => { debug("Error:", ...args); };
const express = require("express");
const app = express();
const http2push = require("./http2push.js");

///////////////////////////////////////////////////////////////////////////////
//
//  Server Setup
//
///////////////////////////////////////////////////////////////////////////////

const STATIC_DIR = "./build/default";

// Use the built-in express middleware for serving static files from './static'
// Configure the push system to send headers for those paths
let pushConfig = http2push({
  push_manifest: STATIC_DIR + "/push_manifest.json",
  root: STATIC_DIR
});

app.use(express.static(STATIC_DIR, {
  setHeaders: pushConfig.setHeaders
}));

///////////////////////////////////////////////////////////////////////////////
//
//  Server Startup
//
///////////////////////////////////////////////////////////////////////////////
log(`NODE_ENV: ${process.env.NODE_ENV}`);

const port = ((startingPort) => {
  return () => { return startingPort++; };
})(parseInt(process.env.PORT || 8080, 10));

let server = app.listen(port(), () => {
  log(`Listening on port ${server.address().port}`);
  log(`Press Ctrl+C to quit.`);
});
