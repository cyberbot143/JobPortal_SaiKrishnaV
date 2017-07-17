var app = angular.module('myApp', ['ngRoute', 'ngCookies','appDirective']);

app.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/login.html',
        controller: 'loginCntrl'
    }).when('/register', {
        templateUrl: 'views/register.html',
        controller: 'regCntrl'
    }).when('/homepage', {
        templateUrl: 'views/homepage.html',
        controller: 'homeCntrl',
        resolve: {
            loggedIn: onlyLoggedIn
        }

    }).when('/searchJobs', {
        templateUrl: 'views/searchjobs.html',
        controller: 'homeCntrl',
        resolve: {
            loggedIn: onlyLoggedIn,
            isAuthorized:onlyJobSeeker
        }
    }).when('/postajob', {
        templateUrl: 'views/postajob.html',     
        controller: 'homeCntrl',
        resolve: {
            loggedIn: onlyLoggedIn,
            isAuthorized:onlyEmployer
        }
    }).otherwise({                     //any invalid access in browser throws you back to '/' of route configuration
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
});


app.factory('myservice', function ($cookies) {
    var mydata = [];

    function set(data) {
        $cookies.putObject("myData", data);
    }

    function setNav(navData) {
        $cookies.putObject("navData", navData);
    }

    function get() {
        return $cookies.getObject("myData");
    }

    function getNav() {
        return $cookies.getObject("navData");
    }
    return {
        set: set,
        setNav: setNav,
        get: get,
        getNav: getNav
    }
});
var onlyLoggedIn = function ($location, $q, myservice) {
    var deferred = $q.defer();
    if (myservice.get() == "loggedOut") {
        deferred.reject();
        $location.url('/login');
    } else {
        deferred.resolve();
    }
    return deferred.promise;
};
var onlyJobSeeker = function($location, $q, myservice){

   var deferred = $q.defer();
    if (myservice.getNav() == "JobSeeker") {
        deferred.resolve();
    } else {     
        deferred.reject();
        $location.path('/postajob');
    }
    return deferred.promise;

}
var onlyEmployer = function($location, $q, myservice){

   var deferred = $q.defer();
    if (myservice.getNav() == "Employer") {
        deferred.resolve();
    } else {     
        deferred.reject();
        $location.path('/searchJobs');
    }
    return deferred.promise;

}
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
                myservice.setNav(data.data.userData.userType);
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
    sessionStorage.userType = myservice.getNav();
    $scope.PostJob = function (job) {

        $http.post('/postJob', job).then(function (res) {
            alert('Succesfully posted a job');
        }, function (err) {
            alert('error in posting a job');
        });

        document.getElementById('jobform').reset();
    }
     $scope.updateAccount = function(user){
      $http.post("/updateProfile", {"user":user,"username":$scope.username})
   .then(
       function(response){
         alert(" Succesfully Updated ")
       }, 
       function(response){
         alert(" un-sucessfully updated ");
       }
    );
};
    $scope.search = function () {
        $http.post('/searchkey', {
            key: $scope.key
        }).then(function (data) {
            $scope.jobs = data.data.jobs;
        }, function (err) {
            console.log('No jobs found');
        })
    }

  
}]);
