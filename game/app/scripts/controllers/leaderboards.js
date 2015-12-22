(function() {
    angular.module('leaderboards', [])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/leaderboards', {
                    templateUrl: '/views/leaderboards.html',
                    controller: 'LeaderboardsController',
                    controllerAs: 'leaderboards',
                    caseInsensitiveMatch: true
                });

            $locationProvider.html5Mode(true);
        }])
        .controller('LeaderboardsController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
            $http.get('/api/userData')
                .success(function(data) {
                    $scope.user = data; //Expose the user data to your angular scope
                });
            $http.get('/api/leaderboards')
                .success(function(data) {
                    $scope.leaderboards = data; //Expose the user data to your angular scope
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }]);
})();
