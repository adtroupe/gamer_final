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
	
	// $scope.signIn = function() {
	// 	$scope.logIn().then(function(error, authData) {
	// 		if (error) {
	// 			$scope.logInFailureMessage = 'Your attempt to log in has failed :( Please make sure you have entered your email and password correctly.';
	// 		} else {
	// 			$scope.userId = authData.uid;
	// 		}			
	// 	})
	// }

	// $scope.logIn = function() {
	// 	return $scope.authObj.$authWithPassword({
	// 		email: $scope.email,
	// 		password: $scope.password
	// 	})
	// }

	$scope.signIn = function() {
		ref.authWithPassword({
			email: $scope.email,
			password: $scope.password
		}, function(error, authData) {
			if (error) {
				$scope.logInFailureMessage = 'Your attempt to log in has failed :( Please make sure you have entered your email and password correctly.';
			} else {
				$scope.userId = authData.uid;
				$scope.email = '';
				$scope.password = '';
			}				
		});
	};

	$scope.openAccountModal = function() {
		$scope.changing = 'profile';
		var userBase = $scope.users[$scope.userId];
		if (userBase !== undefined) {
			$scope.firstname = userBase.firstname;
			$scope.lastname = userBase.lastname;
			$scope.institution = userBase.institution;
		}
	};

	$scope.updateProfile = function() {
		$scope.users[$scope.userId] = {
			firstname:$scope.firstname,
			lastname:$scope.lastname,
			institution:$scope.institution,
			dateupdated: new Date().toString().split(' ').splice(1,3).join(' '),
		}
		$scope.users.$save()
		.then($scope.closeAccountModal)
	};

	$scope.changeUserEmail = function() {
		ref.changeEmail({
			oldEmail: $scope.currentEmail,
			newEmail: $scope.newEmail1,
			password: $scope.changeEmailPW,
		}, function(error) {
			if (error === null) {
				$scope.closeAccountModal();			
			} else {
				$scope.changeInfoWarning = 'Your last attempt to change your information was unsuccessful. Please make sure you have entered your current email and password correctly.';
			}
		})
	};

	$scope.changeUserPassword = function() {
		ref.changePassword({
			email: $scope.emailPW,
			oldPassword: $scope.currentPassword,
			newPassword: $scope.newPassword1,
		}, function(error) {
			if (error === null) {
				$scope.closeAccountModal();			
			} else {
				$scope.changeInfoWarning = 'Your last attempt to change your information was unsuccessful. Please make sure you have entered your current email and password correctly.';
			}
		})
	};

	$scope.closeAccountModal = function() {
		$scope.clearFormInputs();
		$('#changeAccountSettings').modal('hide');
	};

	$scope.clearFormInputs = function() {
		$scope.currentEmail = '';
		$scope.newEmail1 = '';
		$scope.newEmail2 = '';
		$scope.changeEmailPW = '';

		$scope.emailPW = '';
		$scope.currentPassword = '';
		$scope.newPassword1 = '';
		$scope.newPassword2 = '';
		$scope.changeInfoWarning = undefined;		
	};

	$scope.logOut = function() {
		$scope.authObj.$unauth();
		$scope.userId = false;
		$scope.currentUserInfo = false;
		$scope.logInFailureMessage = '';
	};
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

})

.controller('NewGameController', function($scope) {
	$(document).ready(function() {
    	$('[data-toggle="popover"]').popover();   
	});
})