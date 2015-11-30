var myApp = angular.module('myApp', ['firebase', 'ui.router']);

myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {

	// var ref = new Firebase('');

	// var usersRef = ref.child('users');

	// $scope.users = $firebaseObject(usersRef);

	// $scope.authObj = $firebaseObject(ref);
	// var authData = $scope.authObj.$getAuth();
	// if (authData) {
	// 	$scope.userId = authData.uid;
	// }

	// $scope.signIn = function() {
	// 	$scope.logIn().then(function(authData) {
	// 		$scope.userId = authData.uid;
	// 	})
	// }

	// $scope.logIn = function() {
	// 	return $scope.authObj.$authWithPassword({
	// 		username: $scope.username,
	// 		password: $scope.password
	// 	})
	// }

	
});

myApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('','/')
	$stateProvider.state('profile', {
		url: '/profile',
		templateUrl: 'templates/profile.html',
		controller: 'ProfileController',
	})
	.state('form', {
		url: '/new-game',
		templateUrl: 'templates/new-game.html',
		controller: 'NewGameController'
	})
})

.controller('ProfileController', function($scope) {

})

.controller('NewGameController', function($scope) {
	
})