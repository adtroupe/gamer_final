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

	$(document).ready(function() {
    	$('[data-toggle="popover"]').popover();
	});
});

myApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('','/');
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
		// ,controller: 'GameEntityController'
	})
	.state('game.platform', {
		url: '/platform',
		templateUrl: 'templates/game-platform.html'
		//,controller: 'FranchiseEntityController'
	})	
	.state('game.franchise', {
		url: '/franchise',
		templateUrl: 'templates/game-franchise.html'
		//,controller: 'FranchiseEntityController'
	})
	.state('game.distribution', {
		url: '/distribution',
		templateUrl: 'templates/game-distribution.html'
		//, controller: 'DistributionPackageEntityController'
	})
	.state('game.release', {
		url: '/release',
		templateUrl: 'templates/game-release.html'
		//, controller: 'LocalReleaseEntityController'
	})
	.state('game.series', {
		url: '/series',
		templateUrl: 'templates/game-series.html'
		//, controller: 'SeriesEntityController'
	})
	.state('game.content', {
		url: '/content',
		templateUrl: 'templates/game-content.html'
		//, controller: 'CollectionEntityController'
	})
	.state('game.agent', {
		url: '/agent',
		templateUrl: 'templates/game-agent.html'
		//, controller: 'AgentEntityController'
	})
})

.controller('ProfileController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {

})

.controller('NewGameController', function($scope) {
	$scope.gameData = {};
	// $(document).ready(function() {
 //    	$('[data-toggle="popover"]').popover();
	// });
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

	$scope.addGame = function() {
		$scope.entries[$scope.userId] = {
			title: $scope.gameData.gameTitle,
			genre: $scope.gameData.gameplayGenre,
			platform: $scope.gameData.gamePlatform,
			numberOfPlayers: $scope.gameData.numPlayers,
			regionCode: $scope.gameData.regionCode,
			format: $scope.gameData.gameFormat,
			releaseDate: $scope.gameData.retailRelease,
			corporateBody: $scope.gameData.corporateBody,
			genre: $scope.gameData.narrativeGenre,
			summary: $scope.gameData.gameSummary,
			theme: $scope.gameData.theme,
			world: $scope.gameData.gameWorld,
			place: $scope.gameData.gamePlace,
			time: $scope.gameData.gameTime,
			mood: $scope.gameData.gameMood,
			battleSystem: $scope.gameData.battleSystems,
			inGameClock: $scope.gameData.inGameClock,
			inGameClockYN: $scope.gameData.inGameClockYN,
			progression: $scope.gameData.progression,
			tropes: $scope.gameData.gameTropes,
			packshot: $scope.gameData.packshot,
			notes: $scope.gameData.gameNote,
			editionInfo: $scope.gameData.editionInfo,
			systemRequirements: $scope.gameData.systemReq,
			specialHardware: $scope.gameData.hardware,
			networkedFeatures: $scope.gameData.networkedFeat,
			connectivityMethod: $scope.gameData.connectMethod,
			networkType: $scope.gameData.networkType,
			bandwidth: $scope.gameData.bandwidth,
			ending: $scope.gameData.endingYN,
			multipleEndings: $scope.gameData.multEndings,
			postGameContent: $scope.gameData.postGameContent,
			estimatedTimeOfCompletion: $scope.gameData.estimatedTime,
			visualStyle: $scope.gameData.visualStyle,
			dimension: $scope.gameData.dimension,
			pointOfView: $scope.gameData.pov,
			trailers: $scope.gameData.trailers,
			editionNotes: $scope.gameData.editionNote,
			franchise: $scope.gameData.franchise,
			franchiseNotes: $scope.gameData.franchiseNote,
			distributionType: $scope.gameData.distType,
			fileType: $scope.gameData.fileType,
			fileSize: $scope.gameData.fileSize,
			representativeArt: $scope.gameData.repArt,
			packaging: $scope.gameData.packaging,
			drm: $scope.gameData.gameDRM,
			priceMSRP: $scope.gameData.priceMSRP,
			distributionEntityNotes: $scope.gameData.distEntityNote,
			languages: $scope.gameData.languages,
			editionNotes: $scope.gameData.editionNote,
			difficultyLevels: $scope.gameData.difficultyLevels,
			customizableCharacters: $scope.gameData.custChar,
			rating: $scope.gameData.gameRating,
			screenshots: $scope.gameData.screenshots,
			videos: $scope.gameData.gameplayVids,
			version: $scope.gameData.versionInfo,
			themeNotes: $scope.gameData.gameThemeNote,
			seriesTitle: $scope.gameData.seriesTitle,
			contentName: $scope.gameData.contentName,
			contentType: $scope.gameData.contentType,
			versionRequirements: $scope.gameData.versionReq,
			contentNotes: $scope.gameData.contentNote,
			agentNotes: $scope.gameData.agentNote
		};
		$scope.entries.save();
	};
});

	// .controller('GameEntityController', function($scope){
	// 	$scope.title = "Game";
	// 	$(document).ready(function() {
 //    		$('[data-toggle="popover"]').popover();
	// 	});
	// })
	// .controller('FranchiseEntityController', function($scope){
	// 	$scope.title = "Franchise";
	// 	$(document).ready(function() {
 //    		$('[data-toggle="popover"]').popover();
	// 	});
	// })
	// .controller('DistributionPackageEntityController', function($scope){
	// 	$scope.title = "Distribution Package";
	// 	$(document).ready(function() {
 //    		$('[data-toggle="popover"]').popover();
	// 	});
	// })
	// .controller('LocalReleaseEntityController', function($scope){
	// 	$scope.title = "Local Release";
	// 	$(document).ready(function() {
 //    		$('[data-toggle="popover"]').popover();
	// 	});
	// })
	// .controller('SeriesEntityController', function($scope){
	// 	$scope.title = "Series";
	// 	$(document).ready(function() {
 //    		$('[data-toggle="popover"]').popover();
	// 	});
	// })
	// .controller('CollectionEntityController', function($scope){
	// 	$scope.title = "Collection";
	// 	$(document).ready(function() {
 //    		$('[data-toggle="popover"]').popover();
	// 	});
	// })
	// .controller('AgentEntityController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject){
	// 	$scope.title = "Agent";
	// 	$(document).ready(function() {
 //    		$('[data-toggle="popover"]').popover();
	// 	});

	// 	$scope.addGame = function() {
	// 		$scope.entries[$scope.userId] = {
	// 			title: $scope.gameTitle,
	// 			genre: $scope.gameplayGenre,
	// 			platform: $scope.gamePlatform,
	// 			numberOfPlayers: $scope.numPlayers,
	// 			regionCode: $scope.regionCode,
	// 			format: $scope.gameFormat,
	// 			releaseDate: $scope.retailRelease,
	// 			corporateBody: $scope.corporateBody,
	// 			genre: $scope.narrativeGenre,
	// 			summary: $scope.gameSummary,
	// 			theme: $scope.theme,
	// 			world: $scope.gameWorld,
	// 			place: $scope.gamePlace,
	// 			time: $scope.gameTime,
	// 			mood: $scope.gameMood,
	// 			battleSystem: $scope.battleSystems,
	// 			inGameClock: $scope.inGameClock,
	// 			inGameClockYN: $scope.inGameClockYN,
	// 			progression: $scope.progression,
	// 			tropes: $scope.gameTropes,
	// 			packshot: $scope.packshot,
	// 			notes: $scope.gameNote,
	// 			franchise: $scope.franchise,
	// 			franchiseNotes: $scope.franchiseNote,
	// 			distributionType: $scope.distType,
	// 			fileType: $scope.fileType,
	// 			fileSize: $scope.fileSize,
	// 			representativeArt: $scope.repArt,
	// 			packaging: $scope.packaging,
	// 			drm: $scope.gameDRM,
	// 			priceMSRP: $scope.priceMSRP,
	// 			distributionEntityNotes: $scope.distEntityNote,
	// 			languages: $scope.languages,
	// 			editionNotes: $scope.editionNote,
	// 			difficultyLevels: $scope.difficultyLevels,
	// 			customizableCharacters: $scope.custChar,
	// 			rating: $scope.gameRating,
	// 			screenshots: $scope.screenshots,
	// 			videos: $scope.gameplayVids,
	// 			version: $scope.versionInfo,
	// 			themeNotes: $scope.gameThemeNote,
	// 			seriesTitle: $scope.seriesTitle,
	// 			contentName: $scope.contentName,
	// 			contentType: $scope.contentType,
	// 			versionRequirements: $scope.versionReq,
	// 			contentNotes: $scope.contentNote,
	// 			agentNotes: $scope.agentNote
	// 		};
	// 		$scope.entries.save();
	// 	};
	// });

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
