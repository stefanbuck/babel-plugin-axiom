'use strict';

var _findComponent = require('bw-axiom/lib/utils/findComponent');

var _findComponent2 = _interopRequireDefault(_findComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var foo = function foo(findComponent) {
  return findComponent();
};

foo(_findComponent2.default);
