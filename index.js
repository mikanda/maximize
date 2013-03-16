var query = require('query'),
    css = require('css'),
    windowSize = require('window-size');

exports = module.exports = function (el, offset, min) {
  var listen,
      width,
      height;

  el = el || document;
  if (typeof el === 'string')
    el = query(el);

  listen = function (method) {
    return function () {
        window.onresize = function () {
          exports(el, offset, min)[method](el);
        }
      }
  };
  size = function (dir) {    
    var o = offset || 0,
        m = min || 0,
        ws = windowSize()[dir],
        i = dir === 'height';
    if (o instanceof Array)
      o = o[i] || 0;
    if (m instanceof Array)
      m = m[i] || 0;
    return (ws - o < m ? m : ws - o);
  };
  return {
    both: function () {
      css(el, {
        width: size('width'),
        height: size('height'),
        display: 'block'
      });
      return { listen: listen('both') };
    },
    height: function () {
      css(el, {
        height: size('height'),
        display: 'block'
      });
      return { listen: listen('height') };
    },
    width: function () {
      css(el, {
        width: size('width'),
        display: 'block'
      });
      return { listen: listen('width') };
    }
  };
};