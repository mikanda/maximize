function init () {
  var maximize = require('maximize'),
      query = require('component-query');

  var el = query('.testdiv');
  maximize(el, 40, 200)
    .height()
    .listen();
}