var myApp = angular.module('myApp', ['firebase', 'ui.router']);

myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {

	var ref = new Firebase('https://uw-gamer.firebaseio.com/');
	$scope.ref = ref;

	var usersRef = ref.child('users');
	var entriesRef = ref.child('entries');

	$scope.users = $firebaseObject(usersRef);
	$scope.entries = $firebaseObject(entriesRef)
	
	$scope.authObj = $firebaseAuth(ref);
	
	var authData = $scope.authObj.$getAuth();
	$scope.authData = authData;
	if (authData) {
		$scope.userId = authData.uid;
	}
	
	$scope.signIn = function() {
		$scope.logIn().then(function(authData) {
			$scope.userId = authData.uid;
		})
	}

	$scope.logIn = function() {
		return $scope.authObj.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		})
	}

	$scope.changeUserEmail = function() {
		ref.changeEmail({
			oldEmail: $scope.currentEmail,
			newEmail: $scope.newEmail1,
			password: $scope.changeEmailPW
		}, function(error) {
			if (error === null) {
				$scope.authData.password.email = $scope.newEmail1;
				$scope.currentEmail = '';
				$scope.newEmail1 = '';
				$scope.newEmail2 = '';
				$scope.changeEmailPW = '';
			} 
		})
		$scope.closeAccountModal;
	};

	$scope.closeAccountModal = function() {
		$('#changeAccountSettings').modal('hide');
	};

	$scope.logOut = function() {
		$scope.authObj.$unauth()
		$scope.userId = false
		$scope.currentUserInfo = false
	}	
});

myApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('','/')
	$stateProvider.state('profile', {
		url: '/',
		templateUrl: 'templates/profile.html',
		controller: 'ProfileController',
	})
	.state('form', {
		url: '/new-game',
		templateUrl: 'templates/new-game.html',
		controller: 'NewGameController'
	})
})

.controller('ProfileController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {
	$scope.updateProfile = function() {
		$scope.users[$scope.userId] = {
			firstname:$scope.firstname,
			lastname:$scope.lastname,
			institution:$scope.institution,
			dateupdated: new Date().toString().split(' ').splice(1,3).join(' '),
		}
		$scope.users.$save()
		.then($scope.closeModal)
	};

	$scope.openModalButton = function() {
		var userBase = $scope.users[$scope.userId];
		if (userBase !== undefined) {
			$scope.firstname = userBase.firstname;
			$scope.lastname = userBase.lastname;
			$scope.institution = userBase.institution;
		}	
	}

	$scope.closeModal = function() {
		$('#changeUserInfo').modal('hide');
	};
})

.controller('NewGameController', function($scope) {
	
})