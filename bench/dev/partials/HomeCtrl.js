var angular = require('angular');
angular.module('furiousBM.controllers')
 .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#4747FF'],
      responsive: true
    });
  }])
.controller('HomeCtrl', ['$window','$scope', function($window, $scope){
    var furious = $window.furious;
    var TEST_SIZES = [10,100, 500, 1000, 5000, 10000, 50000, 100000];
    var f32Type = new furious.DataType("f32")
    //labels
    $scope.labels = TEST_SIZES;
    $scope.series = [];
    $scope.backEndOptions = furious.getSupportedBackends();
    $scope.backEndOptions.splice($scope.backEndOptions.indexOf("websocket"),1);
    var Benchmark = require('benchmark');
    $scope.res1 = [];

    var run1 = function(context, size, backEnd) {
        var TEST_SIZES = $scope.labels;
        var ndx = $scope.series.indexOf(backEnd);
        var onComp = function(event) {
            var time = (this.stats.mean * 1000).toFixed(5)
            var message = this.name + ": " + time + " ms";
            $scope.res1[ndx][TEST_SIZES.indexOf(size)] = time;
            console.log(message);
            $scope.$apply();
        }
        Benchmark("Create empty array of size 1*" + size, {
            "defer" : true,

            "fn":function(deferred) {
                var x = context.empty([1,size], f32Type);
                context.barrier(function() {
                    deferred.resolve();
                })
            },

            "onComplete" : onComp
        }).run();
    }
    var testHelper1 = function testHelper1(backEnd) {
        furious.init(backEnd, function(context) {
            for (var i = 0, limit = TEST_SIZES.length; i < limit; i++) {
                console.log("testing: " + backEnd);
                run1(context, TEST_SIZES[i], backEnd);
            };
        })
    }
    $scope.runTest1 = function runTest1() {
        for (var i = 0, limit = $scope.backEndOptions.length; i < limit; i++) {
            var backEnd= $scope.backEndOptions[i];
            $scope.res1[i] = TEST_SIZES.map(function(){return 0});
            $scope.series[i] = backEnd;
            try{
                testHelper1(backEnd);
            }catch(e){
                console.log(e);
            }
        }
    }

    $scope.res2 = [];
    $scope.SIZE = 10;
    var TEST_NUMS = [1,10,100,500, 1000, 2000];
    $scope.TEST_NUMS = TEST_NUMS;
    var run2 = function(context, num, backEnd) {
        var TEST_NUMS = $scope.TEST_NUMS;
        var ndx = $scope.series.indexOf(backEnd);
        var SIZE = $scope.SIZE;
        var onComp = function(event) {
            var time = (this.stats.mean * 1000).toFixed(5)
            var message = this.name + ": " + time + " ms";
            $scope.res2[ndx][TEST_NUMS.indexOf(num)] = time;
            console.log(message);
            $scope.$apply();
        }
        Benchmark(("Create " +num + " empty array of size 1*" + SIZE), {
            "defer" : true,

            "fn":function(deferred) {
                for (var i = 0; i < num; i++) {
                    var x = context.empty([1,SIZE], f32Type);
                }
                context.barrier(function() {
                    deferred.resolve();
                    $scope.$apply();
                })
            },

            "onComplete" : onComp
        }).run();
    }
    var testHelper2 = function testHelper2(backEnd) {
        furious.init(backEnd, function(context) {
            for (var i = 0, limit = TEST_NUMS.length; i < limit; i++) {
                console.log("testing: " + backEnd);
                var num = TEST_NUMS[i]
                run2(context, num, backEnd)
            }
        })
    }
    $scope.runTest2 = function runTest2() {
        for (var i = 0, limit = $scope.backEndOptions.length; i < limit; i++) {
            var backEnd = $scope.backEndOptions[i];
            $scope.res2[i] = TEST_NUMS.map(function(){return 0});
            $scope.series[i] = backEnd;
            try{
                testHelper2(backEnd);
            }catch(e){
                console.log(e);
            }
        }
    }

    $scope.res3 = [];
    $scope.TIMES = [10, 50, 100, 200, 500]
    $scope.arrGen = function arrGen(size, m, n) {
        var res = [];
        for(var k = 0; k<size; k++) {
            var arr = [];
            for (var i = 0; i < m; i++) {
                for (var j = 0; j<n;j++) {
                    arr[i] = arr[i] || [];
                    arr[i][j] = Math.random();
                }
            }
            res.push(arr);
        }
        return res;
    }
    var run3 = function run3(times, context, backEnd) {
        var arrs = $scope.arrGen(1, 100, 100);
        var x = (context.array(arrs[0], f32Type)).retain();
        // var y = (context.array([1,2,3,4,5,6,7,8,9,10],new furious.DataType("f32"))).retain();
        // var test = y.sum();
        // context.barrier(function() {
        //     context.get(test, function(test) {
        //         console.log(test);
        //     })
        // })
        var onComp = function onComp() {
            var time = (this.stats.mean * 1000).toFixed(5)
            var message = this.name + ": " + time + " ms";
            $scope.res3[$scope.backEndOptions.indexOf(backEnd)][$scope.TIMES.indexOf(times)] = time;
            console.log(message);
            $scope.$apply();
        }
        var benchFunc = function benchFunc(deferred) {
            for (var i = 1; i < times; i++) {
                x = x.add(x);
            }
            context.barrier(function() {
                deferred.resolve();
                $scope.$apply();
            })
        }
        Benchmark((times + " size[100, 100] f32 matrix addition using " + backEnd), {
            "defer" : true,
            "fn": benchFunc,
            "onComplete" : onComp
        }).run()
    }
    var testHelper3 = function testHelper3(backEnd) {
        furious.init(backEnd, function(context) {
            console.log("testing: " + backEnd);
            for(var i =0, limit = $scope.TIMES.length; i < limit; i++) {
                run3($scope.TIMES[i], context, backEnd);
            }
        })
    }
    $scope.runTest3 = function runTest3() {
        for (var i = 0, limit = $scope.backEndOptions.length; i < limit; i++) {
            var backEnd = $scope.backEndOptions[i];
            $scope.res3[i] = $scope.TIMES.map(function(){return 0});
            $scope.series[i] = backEnd;
            try{
                testHelper3(backEnd);
            }catch(e){
                console.log(e);
            }
        }
    }

    $scope.addF32 = [];
    var testAddF32Helper = function testAddF32Helper(backEnd) {
        furious.init(backEnd, function(context) {
            var y = (context.array([[1, 4, 6], [9, -17, 5]] ,f32Type)).retain();
            var x = y.add(42);
            context.barrier(function() {
                context.fetch(x, function(jsx) {
                    console.log(jsx);
                    $scope.addF32.push(jsx);
                    $scope.$apply();
                })
            })
        })
    }
    $scope.testAddF32 = function tesetAddF32() {
        for (var i = 0, limit = $scope.backEndOptions.length; i < limit; i++) {
            var backEnd = $scope.backEndOptions[i];
            $scope.series[i] = backEnd;
            try{
                testAddF32Helper(backEnd);
            }catch(e){
                console.log(e);
            }
        }
    }
    $scope.subF32 = [];
    var testSubF32Helper = function testSubF32Helper(backEnd) {
        furious.init(backEnd, function(context) {
            var y = (context.array([1,2,3], f32Type)).retain();
            var x = y.sub(y);
            context.barrier(function() {
                context.fetch(x, function(jsx) {
                    console.log(jsx);
                    $scope.subF32.push(jsx);
                    $scope.$apply();
                })
            })
        })
    }
    $scope.testSubF32 = function tesetSubF32() {
        for (var i = 0, limit = $scope.backEndOptions.length; i < limit; i++) {
            var backEnd = $scope.backEndOptions[i];
            $scope.series[i] = backEnd;
            try{
                testSubF32Helper(backEnd);
            }catch(e){
                console.log(e);
            }
        }
    }

    $scope.expF32 = [];
    var testExpF32Helper = function testExpF32Helper(backEnd) {
        furious.init(backEnd, function(context) {
            var y = (context.array([10, 11, 12, 13, 14, 15, 16, 17], f32Type)).retain();
            var x = context.exp(y);
            context.barrier(function() {
                context.fetch(x, function(jsx) {
                    console.log(jsx);
                    $scope.expF32.push(jsx);
                    $scope.$apply();
                })
            })
        })
    }
    $scope.testExpF32 = function testExpF32() {
        for (var i = 0, limit = $scope.backEndOptions.length; i < limit; i++) {
            var backEnd = $scope.backEndOptions[i];
            $scope.series[i] = backEnd;
            try{
                testExpF32Helper(backEnd);
            }catch(e){
                console.log(e);
            }
        }
    }

}]);