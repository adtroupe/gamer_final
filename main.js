var myApp = angular.module('myApp', ['firebase', 'ui.router']);

myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {

	var addGameClicked = true;
	var ref = new Firebase('https://uw-gamer.firebaseio.com/');
	$scope.ref = ref;

	var usersRef = ref.child('users');
	var entriesRef = ref.child('entries');

	$scope.users = $firebaseObject(usersRef);
	$scope.entries = $firebaseObject(entriesRef);
	$scope.entriesArray = $firebaseArray(entriesRef);
	
	$scope.authObj = $firebaseAuth(ref);
	
	var authData = $scope.authObj.$getAuth();
	$scope.authData = authData;
	if (authData) {
		$scope.userId = authData.uid;
	}

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
			dateupdated: new Date().toString().split(' ').splice(1,3).join(' ')
		};
		$scope.users.$save()
		.then($scope.closeAccountModal)
	};

	$scope.changeUserEmail = function() {
		ref.changeEmail({
			oldEmail: $scope.currentEmail,
			newEmail: $scope.newEmail1,
			password: $scope.changeEmailPW
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
			newPassword: $scope.newPassword1
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
	$urlRouterProvider.when('','/');
	$urlRouterProvider.when('/game','/game/required');
	$stateProvider.state('profile', {
		url: '/',
		templateUrl: 'templates/profile.html',
		controller: 'ProfileController'
	})
	.state('game', {
		url: '/game',
		templateUrl: 'templates/game.html',
		controller: 'NewGameController'
	})
	.state('game.required', {
		url: '/required',
		templateUrl: 'templates/game-required.html'
	})	
	.state('game.entity', {
		url: '/entity',
		templateUrl: 'templates/game-entity.html'
	})
	.state('game.platform', {
		url: '/platform',
		templateUrl: 'templates/game-platform.html'
	})	
	.state('game.franchise', {
		url: '/franchise',
		templateUrl: 'templates/game-franchise.html'
	})
	.state('game.distribution', {
		url: '/distribution',
		templateUrl: 'templates/game-distribution.html'
	})
	.state('game.release', {
		url: '/release',
		templateUrl: 'templates/game-release.html'
	})
	.state('game.series', {
		url: '/series',
		templateUrl: 'templates/game-series.html'
	})
	.state('game.content', {
		url: '/content',
		templateUrl: 'templates/game-content.html'
	})
	.state('game.agent', {
		url: '/agent',
		templateUrl: 'templates/game-agent.html'
	})
})

.controller('ProfileController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {

})

.controller('NewGameController', function($scope) {
	$scope.requiredPercentage = 10;
	$scope.otherPercentage = 40;
	$scope.remainingPercentage=50;
	$scope.gameData = {};

	$scope.addGame = function() {
		if ($scope.gameData.gameTitle != undefined) {
			$scope.entries[$scope.gameData.gameTitle] = {
				contributor: $scope.userId,
				dateUpdated: new Date().toString().split(' ').splice(1,3).join(' '),
				title: $scope.gameData.gameTitle,
				genre: $scope.gameData.gameplayGenre,
				platform: $scope.gameData.gamePlatform,
				numberOfPlayers: $scope.gameData.numPlayers,
				regionCode: $scope.gameData.regionCode,
				format: $scope.gameData.gameFormat,
				releaseDate: $scope.gameData.retailRelease,
				corporateBody: $scope.gameData.corporateBody,

				narrativeGenre: $scope.isNull($scope.gameData.narrativeGenre),			
				summary: $scope.isNull($scope.gameData.gameSummary),
				theme: $scope.isNull($scope.gameData.theme),
				world: $scope.isNull($scope.gameData.gameWorld),
				place: $scope.isNull($scope.gameData.gamePlace),
				time: $scope.isNull($scope.gameData.gameTime),
				mood: $scope.isNull($scope.gameData.gameMood),
				battleSystem: $scope.isNull($scope.gameData.battleSystems),
				inGameClock: $scope.isNull($scope.gameData.inGameClock),
				inGameClockYN: $scope.isNull($scope.gameData.inGameClockYN),
				progression: $scope.isNull($scope.gameData.progression),
				tropes: $scope.isNull($scope.gameData.gameTropes),
				packshot: $scope.isNull($scope.gameData.packshot),
				notes: $scope.isNull($scope.gameData.gameNote),
				editionInfo: $scope.isNull($scope.gameData.editionInfo),
				systemRequirements: $scope.isNull($scope.gameData.systemReq),
				specialHardware: $scope.isNull($scope.gameData.hardware),
				networkedFeatures: $scope.isNull($scope.gameData.networkedFeat),
				connectivityMethod: $scope.isNull($scope.gameData.connectMethod),
				networkType: $scope.isNull($scope.gameData.networkType),
				bandwidth: $scope.isNull($scope.gameData.bandwidth),
				ending: $scope.isNull($scope.gameData.endingYN),
				multipleEndings: $scope.isNull($scope.gameData.multEndings),
				postGameContent: $scope.isNull($scope.gameData.postGameContent),
				estimatedTimeOfCompletion: $scope.isNull($scope.gameData.estimatedTime),
				visualStyle: $scope.isNull($scope.gameData.visualStyle),
				dimension: $scope.isNull($scope.gameData.dimension),
				pointOfView: $scope.isNull($scope.gameData.pov),
				trailers: $scope.isNull($scope.gameData.trailers),
				editionNotes: $scope.isNull($scope.gameData.editionNote),
				franchise: $scope.isNull($scope.gameData.franchise),
				franchiseNotes: $scope.isNull($scope.gameData.franchiseNote),
				distributionType: $scope.isNull($scope.gameData.distType),
				fileType: $scope.isNull($scope.gameData.fileType),
				fileSize: $scope.isNull($scope.gameData.fileSize),
				representativeArt: $scope.isNull($scope.gameData.repArt),
				packaging: $scope.isNull($scope.gameData.packaging),
				drm: $scope.isNull($scope.gameData.gameDRM),
				priceMSRP: $scope.isNull($scope.gameData.priceMSRP),
				distributionEntityNotes: $scope.isNull($scope.gameData.distEntityNote),
				languages: $scope.isNull($scope.gameData.languages),
				editionNotes: $scope.isNull($scope.gameData.editionNote),
				difficultyLevels: $scope.isNull($scope.gameData.difficultyLevels),
				customizableCharacters: $scope.isNull($scope.gameData.custChar),
				rating: $scope.isNull($scope.gameData.gameRating),
				screenshots: $scope.isNull($scope.gameData.screenshots),
				videos: $scope.isNull($scope.gameData.gameplayVids),
				version: $scope.isNull($scope.gameData.versionInfo),
				themeNotes: $scope.isNull($scope.gameData.gameThemeNote),
				seriesTitle: $scope.isNull($scope.gameData.seriesTitle),
				contentName: $scope.isNull($scope.gameData.contentName),
				contentType: $scope.isNull($scope.gameData.contentType),
				versionRequirements: $scope.isNull($scope.gameData.versionReq),
				contentNotes: $scope.isNull($scope.gameData.contentNote),
				agentNotes: $scope.isNull($scope.gameData.agentNote)
				};
			$scope.entries.$save()
			.then($scope.clearGame());
		}
	};

	$scope.isNull = function(value) {
		if (value == null) {
			return '';
		} else {
			return value;
		}
	};

	$scope.clearGame = function() {
		$scope.gameData.gameTitle = undefined;
		$scope.gameData.gameplayGenre = undefined;
		$scope.gameData.gamePlatform = undefined;
		$scope.gameData.numPlayers = undefined;
		$scope.gameData.regionCode = undefined;
		$scope.gameData.gameFormat = undefined;
		$scope.gameData.retailRelease = undefined;
		$scope.gameData.corporateBody = undefined;

		$scope.gameData.narrativeGenre = undefined;
		$scope.gameData.gameSummary = undefined;
		$scope.gameData.theme = undefined;
		$scope.gameData.gameWorld = undefined;
		$scope.gameData.gamePlace = undefined;
		$scope.gameData.gameTime = undefined;
		$scope.gameData.gameMood = undefined;
		$scope.gameData.battleSystems = undefined;
		$scope.gameData.inGameClock = undefined;
		$scope.gameData.inGameClockYN = undefined;
		$scope.gameData.progression = undefined;
		$scope.gameData.gameTropes = undefined;
		$scope.gameData.packshot = undefined;
		$scope.gameData.gameNote = undefined;
		$scope.gameData.editionInfo = undefined;
		$scope.gameData.systemReq = undefined;
		$scope.gameData.hardware = undefined;
		$scope.gameData.networkedFeat = undefined;
		$scope.gameData.connectMethod = undefined;
		$scope.gameData.networkType = undefined;
		$scope.gameData.bandwidth = undefined;
		$scope.gameData.endingYN = undefined;
		$scope.gameData.multEndings = undefined;
		$scope.gameData.postGameContent = undefined;
		$scope.gameData.estimatedTime = undefined;
		$scope.gameData.visualStyle = undefined;
		$scope.gameData.dimension = undefined;
		$scope.gameData.pov = undefined;
		$scope.gameData.trailers = undefined;
		$scope.gameData.editionNote = undefined;
		$scope.gameData.franchise = undefined;
		$scope.gameData.franchiseNote = undefined;
		$scope.gameData.distType = undefined;
		$scope.gameData.fileType = undefined;
		$scope.gameData.fileSize = undefined;
		$scope.gameData.repArt = undefined;
		$scope.gameData.packaging = undefined;
		$scope.gameData.gameDRM = undefined;
		$scope.gameData.priceMSRP = undefined;
		$scope.gameData.distEntityNote = undefined;
		$scope.gameData.languages = undefined;
		$scope.gameData.editionNote = undefined;
		$scope.gameData.difficultyLevels = undefined;
		$scope.gameData.custChar = undefined;
		$scope.gameData.gameRating = undefined;
		$scope.gameData.screenshots = undefined;
		$scope.gameData.gameplayVids = undefined;
		$scope.gameData.versionInfo = undefined;
		$scope.gameData.gameThemeNote = undefined;
		$scope.gameData.seriesTitle = undefined;
		$scope.gameData.contentName = undefined;
		$scope.gameData.contentType = undefined;
		$scope.gameData.versionReq = undefined;
		$scope.gameData.contentNote = undefined;
		$scope.gameData.agentNote = undefined;
	}
});

// 	$(document).ready(function() {
//    	$('[data-toggle="popover"]').popover();
// 	});

	
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();

	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		},
		duration: 800,
		complete: function(){
			current_fs.hide();
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});
