var asmjscalls = require('./testcall.js');
var test = asmjscalls.cwrap('test', 'number');
var floattest = asmjscalls.cwrap('floattest', 'number');

console.log(asmjscalls._test());
