var app = angular.module('appDirective', []);

app.directive('myNav', function () {
    return {
        restrict: 'E',
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: function ($scope,$location,myservice) {

            $scope.userType = sessionStorage.userType;
            $scope.logout = function () {
                $location.path('/');
                myservice.set("loggedOut");
                sessionStorage.userType = "";
            }

        },
        templateUrl: 'views/navbar.html'
    };
});