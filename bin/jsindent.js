#!/usr/bin/env node
"use strict";

var rw = require("rw");
var fs = require("fs");
var path = require("path");
var pjs = require("pretty-js");
var _ = require("underscore");
var rcfile = ".jsindent.json";
var rcpath = [
    process.env.HOME, 
    "."
  ];

var options = loadConfig(rcpath, rcfile);
var src = rw.readFileSync("/dev/stdin", "utf8");
var dst = pjs(src, options);

rw.writeFileSync("/dev/stdout", dst, "utf8");

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
