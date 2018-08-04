"use strict";

const path = require("path");


const roots = {
  sources: __aPath("resources/assets"),
  public: __aPath("public"),
  production: __aPath("public/build"),
  views: __aPath("resources/views")
};

const imageFormats = "jpg,jpeg,png,gif,svg";

// Module used for cross-platform paths
module.exports = {

  // ===========================
  // ==== Configuration ========
  // ===========================

  autoPrefixer: {
    browsers: ["last 3 versions", "> 3% in RU", "Firefox > 20", "ie > 10", "safari >= 7"],
  },

  imageExtensions: imageFormats,

  browserSync: {
    // Extension properties
    disableCache: true, // Disable browser cache for stable live reload (useful for mobile devices).

    proxy: {
      target: "http://kelog.loc", // For BrowserSync proxy
      ws: true, // Your app using WebSockets
    },

    // Original properties
    // Mirror actions to all devices
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },

    online: false, // Set it to true for tunnel
    tunnel: false, // Tunnel name for personal URL. Install before "npm install -g localtunnel".
    useStream: true, // Disable for fresh page scripts debug
    open: false,
    notify: false,
  },

  bundleImages: false,

  copyPaster: {
    "images": "resources/assets/images/**/*.{" + imageFormats + "}",
  },


  // ===========================
  // ==== Front-End folders ====
  // ===========================

  // All things which will be compiled to debug or production environment
  sources: {
    root: roots.sources,
    rootFileUrl: "file:///" + roots.sources.replace(/\\/g, '/'),

    scripts: path.join(roots.sources, "scripts"),
    styles: path.join(roots.sources, "styles"),
    images: path.join(roots.sources, "images"),
    // Path for watch only. Set false for disable
    templates: path.join(roots.views, "**/*.blade.php"),
  },
  caches: {
    fontello: path.join(roots.sources, "styles/*/vendor/fontello"),
  },
  // Rev independent compiled sources with source maps
  public: {
    root: roots.public,

    scripts: path.join(roots.public, "scripts"),
    styles: path.join(roots.public, "styles"),
    images: path.join(roots.public, "images"),
    fonts: path.join(roots.public, "fonts"),
  },
  // Rev bundled minified releases
  production: {
    root: roots.production,

    scripts: path.join(roots.production, "scripts"),
    styles: path.join(roots.production, "styles"),
    images: path.join(roots.production, "images"),
    fonts: path.join(roots.production, "fonts"),
  },
};
