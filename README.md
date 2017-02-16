# Skeleton - Demo site workflow skeleton

Basic workflow setup for an HTML demo site.  Could be converted to a WP setup or whatever
(it was extracted from a WP theme).

### Features:

- Sass CSS preprocessing with:
    - autoprefixing (just write modern CSS, no need for compass mixins, etc)
    - sourcemapping
    - minification
- JS compilation using browserify with:
    - access to NPM libraries (via browserify)
    - ability to separate modules into separate files
    - code in ES6 or CommonJS style
    - sourcemapping
    - minification
    - separate "vendor" bundle setup
- BrowserSync setup for serving the site and hot reloading whenever source files change
- Tasks using gulp
