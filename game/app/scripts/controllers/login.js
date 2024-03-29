(function() {
    angular.module('login', [])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/signup', {
                    templateUrl: '/views/signup.html',
                    controller: 'SignupController',
                    controllerAs: 'signup',
                    caseInsensitiveMatch: true
                })
                .when('/login', {
                    templateUrl: '/views/login.html',
                    controller: 'LoginController',
                    controllerAs: 'login',
                    caseInsensitiveMatch: true
                })
                .otherwise({
                    templateUrl: '/views/main.html',
                    controller: 'IndexController',
                    controllerAs: 'index'
                });

            $locationProvider.html5Mode(true); //Use html5Mode so your angular routes don't have #/route
        }])
        .controller('LoginController', ['$http', '$scope', function($http, $scope) {
            // Custom Login functionality
        }])
        .controller('IndexController', ['$http', '$scope', function($http, $scope) {
            // Custom Index functionality
        }])
        .controller('SignupController', ['$http', '$scope', function($http, $scope) {
            // Custom Signup functionality
        }])
        .controller('LoginForm', ['$http', '$scope', function($http, $scope) {
            $scope.login = function() {
                $http
                    .post('/login', {
                        username: this.username,
                        password: this.password
                    })
                    .success(function(data) {
                        //console.log(data);
                    });
            }
        }])
        .controller('SignupForm', ['$http', '$scope', function($http, $scope) {
            $scope.signup = function() {
                $http
                    .post('/signup', {
                        username: this.username,
                        password: this.password
                    })
                    .success(function(data) {
                        //console.log(data);
                    });
            }
        }])
})();
