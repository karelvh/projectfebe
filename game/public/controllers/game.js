(function() {
    angular.module('game', [])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/game', {
                    templateUrl: '/views/game.html',
                    controller: 'GameController',
                    controllerAs: 'game'
                });

            $locationProvider.html5Mode(true);
        }])
        .controller('GameController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
            //Custom Game functionality
            $http.get('/api/userData')
                .success(function(data) {
                    $scope.user = data; //Expose the user data to your angular scope
                });
        }])
        .controller('SecondarySignupController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
            //Custom Link Page functionality
            $http.get('/api/userData')
                .success(function(data) {
                    $scope.user = data; //Expose the user data to your angular scope
                });
        }]);
})();
