

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-query/index.js", Function("exports, require, module",
"\nfunction one(selector, el) {\n  return el.querySelector(selector);\n}\n\nexports = module.exports = function(selector, el){\n  el = el || document;\n  return one(selector, el);\n};\n\nexports.all = function(selector, el){\n  el = el || document;\n  return el.querySelectorAll(selector);\n};\n\nexports.engine = function(obj){\n  if (!obj.one) throw new Error('.one callback required');\n  if (!obj.all) throw new Error('.all callback required');\n  one = obj.one;\n  exports.all = obj.all;\n};\n//@ sourceURL=component-query/index.js"
));
require.register("component-css/index.js", Function("exports, require, module",
"\n/**\n * Properties to ignore appending \"px\".\n */\n\nvar ignore = {\n  columnCount: true,\n  fillOpacity: true,\n  fontWeight: true,\n  lineHeight: true,\n  opacity: true,\n  orphans: true,\n  widows: true,\n  zIndex: true,\n  zoom: true\n};\n\n/**\n * Set `el` css values.\n *\n * @param {Element} el\n * @param {Object} obj\n * @return {Element}\n * @api public\n */\n\nmodule.exports = function(el, obj){\n  for (var key in obj) {\n    var val = obj[key];\n    if ('number' == typeof val && !ignore[key]) val += 'px';\n    el.style[key] = val;\n  }\n  return el;\n};\n//@ sourceURL=component-css/index.js"
));
require.register("window-size/index.js", Function("exports, require, module",
"exports = module.exports = function () {\n  var size = {width: 0, height: 0}\n  if( typeof( window.innerWidth ) == 'number' ) {\n    //Non-IE\n    size.width = window.innerWidth;\n    size.height = window.innerHeight;\n  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {\n    //IE 6+ in 'standards compliant mode'\n    size.width = document.documentElement.clientWidth;\n    size.height = document.documentElement.clientHeight;\n  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {\n    //IE 4 compatible\n    size.width = document.body.clientWidth;\n    size.height = document.body.clientHeight;\n  }\n  return size;\n};//@ sourceURL=window-size/index.js"
));
require.register("maximize/index.js", Function("exports, require, module",
"var query = require('query'),\n    css = require('css'),\n    windowSize = require('window-size');\n\nexports = module.exports = function (el, offset, min) {\n  var listen,\n      width,\n      height;\n\n  el = el || document;\n  if (typeof el === 'string')\n    el = query(el);\n\n  listen = function (method) {\n    return function () {\n        window.onresize = function () {\n          exports(el, offset, min)[method](el);\n        }\n      }\n  };\n  size = function (dir) {    \n    var o = offset || 0,\n        m = min || 0,\n        ws = windowSize()[dir],\n        i = dir === 'height';\n    if (o instanceof Array)\n      o = o[i] || 0;\n    if (m instanceof Array)\n      m = m[i] || 0;\n    return (ws - o < m ? m : ws - o);\n  };\n  return {\n    both: function () {\n      css(el, {\n        width: size('width'),\n        height: size('height'),\n        display: 'block'\n      });\n      return { listen: listen('both') };\n    },\n    height: function () {\n      css(el, {\n        height: size('height'),\n        display: 'block'\n      });\n      return { listen: listen('height') };\n    },\n    width: function () {\n      css(el, {\n        width: size('width'),\n        display: 'block'\n      });\n      return { listen: listen('width') };\n    }\n  };\n};//@ sourceURL=maximize/index.js"
));
require.alias("component-query/index.js", "maximize/deps/query/index.js");

require.alias("component-css/index.js", "maximize/deps/css/index.js");

require.alias("window-size/index.js", "maximize/deps/window-size/index.js");

