var myApp = angular.module('myApp', ['firebase', 'ui.router']);

myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {

	var ref = new Firebase('https://uw-gamer.firebaseio.com/');
	$scope.ref = ref;

	var usersRef = ref.child('users');
	var entriesRef = ref.child('entries');

	$scope.users = $firebaseObject(usersRef);
	$scope.entries = $firebaseObject(entriesRef);
	
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
	$stateProvider.state('profile', {
		url: '/',
		templateUrl: 'templates/profile.html',
		controller: 'ProfileController'
	})
	.state('new-game', {
		url: '/new-game',
		templateUrl: 'templates/new-game.html',
		controller: 'NewGameController'
	})
	.state('game-entity', {
		url: '/game-entity',
		templateUrl: 'templates/game-entity.html',
		controller: 'GameEntityController'
	})
	.state('franchise-entity', {
		url: '/franchise-entity',
		templateUrl: 'templates/franchise-entity.html',
		controller: 'FranchiseEntityController'
	})
	.state('distribution-package-entity', {
		url: '/distribution-package-entity',
		templateUrl: 'templates/distribution-package-entity.html',
		controller: 'DistributionPackageEntityController'
	})
	.state('local-release-entity', {
		url: '/local-release-entity',
		templateUrl: 'templates/local-release-entity.html',
		controller: 'LocalReleaseEntityController'
	})
	.state('series-entity', {
		url: '/series-entity',
		templateUrl: 'templates/series-entity.html',
		controller: 'SeriesEntityController'
	})
	.state('collection-entity', {
		url: '/collection-entity',
		templateUrl: 'templates/collection-entity.html',
		controller: 'CollectionEntityController'
	})
	.state('agent-entity', {
		url: '/agent-entity',
		templateUrl: 'templates/agent-entity.html',
		controller: 'AgentEntityController'
	})
})

.controller('ProfileController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {

})

.controller('NewGameController', function($scope) {
	$scope.title = "Required";
	$(document).ready(function() {
    	$('[data-toggle="popover"]').popover();
	});
	//$('form').parsley();
	//$(function () {
  	//	var $sections = $('.form-section');
    //
  	//	function navigateTo(index) {
    	//	$sections
     // 			.removeClass('current')
     // 			.eq(index)
     //   		.addClass('current');
    	//	$('.form-navigation .previous').toggle(index > 0);
    	//	var atTheEnd = index >= $sections.length - 1;
    	//	$('.form-navigation .next').toggle(!atTheEnd);
    	//	$('.form-navigation [type=submit]').toggle(atTheEnd);
  	//	}
    //
  	//	function curIndex() {
    	//	return $sections.index($sections.filter('.current'));
  	//	}
    //
  	//	$('.form-navigation .previous').click(function() {
    	//	navigateTo(curIndex() - 1);
 	//	});
    //
  	//	$('.form-navigation .next').click(function() {
    	//	if ($('.demo-form').parsley().validate('block-' + curIndex()))
     // 			navigateTo(curIndex() + 1);
  	//	});
    //
  	//	$sections.each(function(index, section) {
    	//	$(section).find(':input').attr('data-parsley-group', 'block-' + index);
  	//	});
  	//	navigateTo(0);
	//})

})

	.controller('GameEntityController', function($scope){
		$scope.title = "Game";
		$(document).ready(function() {
    		$('[data-toggle="popover"]').popover();
		});
	})
	.controller('FranchiseEntityController', function($scope){
		$scope.title = "Franchise";
		$(document).ready(function() {
    		$('[data-toggle="popover"]').popover();
		});
	})
	.controller('DistributionPackageEntityController', function($scope){
		$scope.title = "Distribution Package";
		$(document).ready(function() {
    		$('[data-toggle="popover"]').popover();
		});
	})
	.controller('LocalReleaseEntityController', function($scope){
		$scope.title = "Local Release";
		$(document).ready(function() {
    		$('[data-toggle="popover"]').popover();
		});
	})
	.controller('SeriesEntityController', function($scope){
		$scope.title = "Series";
		$(document).ready(function() {
    		$('[data-toggle="popover"]').popover();
		});
	})
	.controller('CollectionEntityController', function($scope){
		$scope.title = "Collection";
		$(document).ready(function() {
    		$('[data-toggle="popover"]').popover();
		});
	})
	.controller('AgentEntityController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject){
		$scope.title = "Agent";
		$(document).ready(function() {
    		$('[data-toggle="popover"]').popover();
		});

		$scope.addGame = function() {
			$scope.entries[$scope.userId] = {
				title: $scope.gameTitle,
				genre: $scope.gameplayGenre,
				platform: $scope.gamePlatform,
				numberOfPlayers: $scope.numPlayers,
				regionCode: $scope.regionCode,
				format: $scope.gameFormat,
				releaseDate: $scope.retailRelease,
				corporateBody: $scope.corporateBody,
				genre: $scope.narrativeGenre,
				summary: $scope.gameSummary,
				theme: $scope.theme,
				world: $scope.gameWorld,
				place: $scope.gamePlace,
				time: $scope.gameTime,
				mood: $scope.gameMood,
				battleSystem: $scope.battleSystems,
				inGameClock: $scope.inGameClock,
				inGameClockYN: $scope.inGameClockYN,
				progression: $scope.progression,
				tropes: $scope.gameTropes,
				packshot: $scope.packshot,
				notes: $scope.gameNote,
				franchise: $scope.franchise,
				franchiseNotes: $scope.franchiseNote,
				distributionType: $scope.distType,
				fileType: $scope.fileType,
				fileSize: $scope.fileSize,
				representativeArt: $scope.repArt,
				packaging: $scope.packaging,
				drm: $scope.gameDRM,
				priceMSRP: $scope.priceMSRP,
				distributionEntityNotes: $scope.distEntityNote,
				languages: $scope.languages,
				editionNotes: $scope.editionNote,
				difficultyLevels: $scope.difficultyLevels,
				customizableCharacters: $scope.custChar,
				rating: $scope.gameRating,
				screenshots: $scope.screenshots,
				videos: $scope.gameplayVids,
				version: $scope.versionInfo,
				themeNotes: $scope.gameThemeNote,
				seriesTitle: $scope.seriesTitle,
				contentName: $scope.contentName,
				contentType: $scope.contentType,
				versionRequirements: $scope.versionReq,
				contentNotes: $scope.contentNote,
				agentNotes: $scope.agentNote
			};
			$scope.entries.save();
		};
	});

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
