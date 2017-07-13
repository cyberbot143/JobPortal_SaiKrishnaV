var app = angular.module('myApp', ['ngRoute', 'ngCookies']);


app.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/login.html',
        controller: 'loginCntrl'
    }).when('/register', {
        templateUrl: 'views/register.html',
        controller: 'regCntrl'
    }).when('/homepage', {
        templateUrl: 'views/homepage.html',
        controller: 'homeCntrl'
    }).when('/searchJobs', {
        templateUrl: 'views/searchjobs.html',
        controller: 'homeCntrl'
    }).when('/postajob', {
        templateUrl: 'views/postajob.html',
        controller: 'homeCntrl'
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});
app.factory('myservice', function ($cookies) {
    var mydata = [];

    function set(data) {
        $cookies.putObject("myData", data);
    }

    function get() {
        return $cookies.getObject("myData");
    }

    return {
        set: set,
        get: get
    }
});
app.controller('regCntrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {

    $scope.CreateAccount = function (user) {
        user.userType = $scope.userType;
        $http.post('/reg', user).then(function (data) {
            $location.path('/');
        }, function (err) {
            alert('Username already exists');
        });
    }
}]);
app.controller('loginCntrl', ['$scope', '$location', '$http', '$cookies', 'myservice', function ($scope, $location, $http, $cookies, myservice) {


    $scope.login = function (user) {
        $http.post('/log', user).then(function (data) {
                myservice.set(data.data.userData.username);
                $location.path('/homepage');
            },
            function (err) {
                alert('User credentials are wrong');
                document.getElementById("loginForm").reset();
                console.log("err");
            });

    }
}]);
app.controller('homeCntrl', ['$scope', '$location', '$http', '$cookies', 'myservice', function ($scope, $location, $http, $cookies, myservice) {


    $scope.username = myservice.get();
    $scope.PostJob = function (job) {

        $http.post('/postJob', job).then(function (res) {
            alert('Succesfully posted a job');
        }, function (err) {
            alert('error in posting a job');
        });

        document.getElementById('jobform').reset();
    }
$scope.search = function(){
   $http.post('/searchkey',{key:$scope.key}).then(function(data){ 
   $scope.jobs = data.data.jobs;  
   },function(err){
    console.log('No jobs found');
   })

}
    $scope.logout = function () {
        $location.path('/');
    }


}]);