// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const fs = require("fs");
const path = require("path");
const debug = require("debug")("http2push");

const log = debug;
const err = (...args) => { debug("Error:", ...args); };

// This file provides Express middleware for generic HTTP/2 Push using a
// pre-cacluclated push_manifest.json.

// TODOs:
//  - Handle multiple roots with multiple configs
//  - Cap string caches
//  - Add tests!
//  - Test (and limit) "as" type values
//  - Restrict header setting to navigations
//  - Investigate bloom filter impl in middleware variant

const getLinkHeaderValue = (path, pushDataMap) => {
  let items = [];
  let files = pushDataMap.get(path);
  for (let f of Object.keys(files)) {
    if (files[f].hasOwnProperty("type")) {
      items.push(`<${f}>; rel=preload; as=${files[f].type}`);
    } else {
      items.push(`<${f}>; rel=preload`);
    }
  }
  return items.join(", ");
};

const getXACHeaderValue = (path, pushDataMap) => {
  let items = [];
  let files = pushDataMap.get(path);
  for (let f of Object.keys(files)) {
    if (files[f].hasOwnProperty("weight")) {
      items.push(`"${f}":${files[f].weight}`);
    } else {
      items.push(`"${f}"`);
    }
  }
  return items.join(", ");
};

const endsWithOneOf = (path, exts) => {
  // TODO(slightlyoff): memoize
  for (let ext of exts) {
    if (path.endsWith(ext)) {
      // log(path, "ends with", ext);
      return true;
    }
  }
};

module.exports = function(options) {
  let opts = Object.create(options || null);
  let root = opts.root || "./";
  let extensions = opts.extensions || ["/", ".html", ".htm"];
  let isSingleFileManifest = false;

  // On startup we are either passed or default to a relative location for the
  // data.
  const PUSH_MANIFEST_PATH = path.resolve(
      process.env.PUSH_MANIFEST ||
      (opts ? opts.push_manifest : "") ||
      "./push_manifest.json"
  );

  log("PUSH_MANIFEST_PATH:", PUSH_MANIFEST_PATH);

  // Get the push data
  // TODO(slightlyoff): handle failure
  const pushData = JSON.parse(fs.readFileSync(PUSH_MANIFEST_PATH, "utf8"));
  const rootedPushData = new Map();   // Used in explicit mapping
  const unrootedPushData = new Map(); // Used by middleware
  let fileList = Object.keys(pushData).map((file) => {
    // Ensure all paths are relative to the root
    unrootedPushData.set(file, pushData[file]);
    let rooted = path.resolve(root,
                              ((file.indexOf("/") == 0) ? ("."+file) : file));
    rootedPushData.set(rooted, pushData[file]);
    return rooted;
  });

  // We assume the multi-file manifest format; otherwise use the single-file
  // manifest as the default for all pushes
  for(let [file, item] of rootedPushData) {
    if (!item || (
        item.hasOwnProperty("type") && item.hasOwnProperty("weight")
      )
    ) {
      err("http2push middleware expects multi-file manifests, got a single-file manifest instead");
      err("pushing identical resources for all requests");
      log("file:", file);
      log("item:", item);
      isSingleFileManifest = true;
    }
    break;
  }

  if(isSingleFileManifest) {
    unrootedPushData.set("*", pushData);
    rootedPushData.set("*", pushData);
  }


  // TODO(slightlyoff): determine if we're in GAE or behind GFE and only serve
  //                    XAC values there.
  let linkValueCache = new Map();
  let xacValueCache = new Map();
  let setPreloadValueFromData = function(res, path, data) {
    if (linkValueCache.has(path)) {
      res.set("Link", linkValueCache.get(path));
      res.set("X-Associated-Content", xacValueCache.get(path));
      return;
    }
    const linkValue = getLinkHeaderValue(path, data);
    const xacValue = getXACHeaderValue(path, data);
    log("path:", path);
    log("Link header value:", linkValue);
    log("X-Associated-Content value:", linkValue);

    // TODO(slightlyoff): cap total size
    linkValueCache.set(path, linkValue);
    xacValueCache.set(path, xacValue);
    res.set("Link", linkValue);
    res.set("X-Associated-Content", xacValue);
  };

  // TODO(slightlyoff): only cache a single string if we have a single-file
  //                    manifest (note that this isn't a crisis because V8
  //                    treats identical string values as a single pointer)
  let setPreloadValue = function(res, path) {
    // Simple matching. Will need to improve.
    if (!(isSingleFileManifest || fileList.includes(path))) {
      log("not setting preload value");
      return; // TODO(slightlyoff): log for debugging?
    }
    if (isSingleFileManifest) { path = "*"; }
    setPreloadValueFromData(res, path, rootedPushData);
  };

  let middleware = function(req, res, next) {
    // Only handle GET requests for HTML files for now
    if (req.method === "GET") {
      // TODO(slightlyoff): ensure we're only handling top-level requests
      let path = req.path;
      // log("req.path:", req.path);
      if (!endsWithOneOf(path, extensions)) {
        next(); return;
      }

      // Strip leading slash
      if (path.indexOf("/") == 0) { path = path.substr(1); }
      if (isSingleFileManifest) { path = "*"; }
      setPreloadValueFromData(res, path, unrootedPushData);
    }
    next();
  };

  middleware.setHeaders = function(res, path) {
    if (endsWithOneOf(path, extensions)) {
      middleware.setHeadersFor(res, path);
    }
  };

  middleware.setHeadersFor = function(res, path) {
    setPreloadValue(res, path);
  };

  return middleware;
};
