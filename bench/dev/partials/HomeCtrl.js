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
                var x = context.empty([1,size]);
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
    $scope.SIZE = 2;
    var TEST_NUMS = [1,10,100,500, 1000, 2000];
    $scope.TEST_NUMS = TEST_NUMS;
    var run2 = function(context, num, backEnd, j) {
        var TEST_NUMS = $scope.TEST_NUMS;
        var ndx = $scope.series.indexOf(backEnd);
        var SIZE = $scope.SIZE;
        var onComp = function(event) {
            var time = (this.stats.mean * 1000).toFixed(5)
            var message = this.name + ": " + time + " ms";
            $scope.res2[ndx][TEST_NUMS.indexOf(num)] += parseFloat(time);
            console.log(message);
            $scope.$apply();
        }
        Benchmark(("Create " + j + "/" +num + "empty array of size 1*" + SIZE), {
            "defer" : true,

            "fn":function(deferred) {
                var x = context.empty([1,SIZE]);
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
                for (var j = num; j > 0; j--) {
                    run2(context, num, backEnd, j);
                }
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
    var run3 = function run3(context, backEnd) {
        var arrs = $scope.arrGen(20, 100, 100);
        var onComp = function onComp() {
            var time = (this.stats.mean * 1000).toFixed(5)
            var message = this.name + ": " + time + " ms";
            $scope.res3.push(time);
            console.log(message);
            $scope.$apply();
        }
        Benchmark(("20 size[100, 100] f64 matrix addition using " + backEnd), {
            "defer" : true,
            "fn": function(deferred) {
                var x = (context.array(arrs[0])).retain();
                for (var i = 1; i < 20; i++) {
                    var x = x.add(context.array(arrs[i]));
                }
                context.barrier(function() {
                    deferred.resolve();
                    $scope.$apply();
                })
            },
            "onComplete" : onComp
        }).run()
    }
    var testHelper3 = function testHelper3(backEnd) {
        furious.init(backEnd, function(context) {
            console.log("testing: " + backEnd);
            run3(context, backEnd);
        })
    }
    $scope.runTest3 = function runTest3() {
        for (var i = 0, limit = $scope.backEndOptions.length; i < limit; i++) {
            var backEnd = $scope.backEndOptions[i];
            try{
                testHelper3(backEnd);
            }catch(e){
                console.log(e);
            }
        }
    }

}]);