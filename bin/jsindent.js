#!/usr/bin/env node
"use strict";

var rw = require("rw");
var fs = require("fs");
var path = require("path");
var pjs = require("pretty-js");
var _ = require("underscore");
var rcfile = ".jsindent.json";
var rcpath = [
    ".",
    process.env.HOME
  ];

var options = loadConfig(rcpath, rcfile);
var src = rw.readFileSync("/dev/stdin", "utf8");
var dst = pjs(src, options);

if (options.noNewlineAfterVar) {
  dst = fixup(dst);
}

rw.writeFileSync("/dev/stdout", dst, "utf8");

// Hack: remove blanks between var decls. The intention is to implement this
// properly in pretty-js.
function fixup(src) {
  var ln = src.split("\n"), out = [];
  var reBlank = /^\s*$/;
  var reVAR = /^\s*var\s+/;
  var nBlank = 0, inVAR = false, wasInVAR = false;

  for (var i = 0; i < ln.length; i++) {
    if (reBlank.test(ln[i])) {
      nBlank++;
      continue;
    }

    wasInVAR = inVAR;
    inVAR = reVAR.test(ln[i]);

    if (!wasInVAR || !inVAR) {
      for (var b = 0; b < nBlank; b++) {
        out.push("");
      }
    }

    nBlank = 0;
    out.push(ln[i]);
  }

  return out.join("\n");
}

function loadConfig(rcpath, rcfile) {
  var opt = {};

  rcpath.forEach(function(p) {
    var rc = path.join(p, rcfile);

    if (fs.existsSync(rc)) {
      _.extend(opt, JSON.parse(fs.readFileSync(rc)));
    }
  });

  return opt;
}

// vim:ts=2:sw=2:sts=2:et:ft=javascript
