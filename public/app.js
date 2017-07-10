var app = angular.module('myApp',['ngRoute']);
app.config(function ($routeProvider) {
  
    $routeProvider.when('/', {
        templateUrl: 'views/login.html',
        controller:'regCntrl'
        }).when('/register', {
        templateUrl: 'views/register.html',
        controller:'regCntrl'
        }).when('/homepage', {
            templateUrl:'views/homepage.html'
        }).when('/searchjobs', {
            templateUrl:'views/searchjobs.html'   
        }).when('/postajob', {
            templateUrl:'views/postajob.html'
        }).otherwise({
        redirectTo: '/'
    });
});
app.controller('regCntrl', ['$scope','$location','$http', function ($scope, $location,$http) {

    $scope.CreateAccount = function (user) {
        user.userType = $scope.userType;
        
        $http.post('http://localhost:3000/register',user);

    }
}]);