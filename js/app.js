var app = angular.module("app", ['ngResource', 'ngAnimate', 'ui.router']);

app
  .config(['$resourceProvider', function($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
  }]) 

  .config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise('/home');

	$stateProvider
	
		.state('home', {
			url: '/home',
			views: {
				nav: {
					templateUrl: 'partials/navbar.html'
				},
				content: {
					templateUrl: 'partials/en/home.html'
				},
				contenu: {
					templateUrl: 'partials/fr/accueil.html'
				}
			},
			data: { 
				requireLogin: false,
				isFrench: false
			},
			controller: function($scope, $rootScope) {
				$rootScope.isHome = true;
			}
		})
		
		.state('team', {
			url: '/team',
			views: {
				content: {
					templateUrl: 'partials/en/team.html'
				},
				contenu: {
					templateUrl: 'partials/fr/equipe.html'
				}
			},
			data: { requireLogin: false },
			controller: function($scope, $rootScope) {
				$rootScope.isHome = false;
			}
		})
		
		.state('services', {
			url: '/services',
			views: {
				content: {
					templateUrl: 'partials/en/services.html'
				},
				contenu: {
					templateUrl: 'partials/fr/services.html'
				}
			},
			data: { requireLogin: false },
		})
		
		.state('portfolio', {
			url: '/portfolio',
			views: {
				content: {
					templateUrl: 'partials/en/portfolio.html'
				},
				contenu: {
					templateUrl: 'partials/fr/portfolio.html'
				}
			},
			data: { requireLogin: false },
		})

		.state('partners', {
			url: '/partners',
			views: {
				content: {
					templateUrl: 'partials/en/partners.html'
				},
				contenu: {
					templateUrl: 'partials/fr/partners.html'
				}
			},
			data: { requireLogin: false },
		})
		
		.state('contact', {
			url: '/contact',
			views: {
				content: {
					templateUrl: 'partials/en/contact.html'
				},
				contenu: {
					templateUrl: 'partials/fr/contact.html'
				}
			},
			data: { requireLogin: false },
		})
  })
  .controller('mainController', function($scope, $rootScope) {
	$rootScope.isHome = true;
	$rootScope.isFrench = true;
	
	$scope.language = 'English';
	
	$scope.menu = {};
	
	var francais = { home: 'Accueil', team:'Equipe', services:'Services', portfolio:'Réalisations', partners:'Partenaires', contact:'Contact'};
	var english = { 'home': 'Home', 'team':'Team', 'services':'Services', 'portfolio':'Portfolio', 'partners':'Partners', 'contact':'Contact'};
	
	$scope.menu = francais;
	
	$scope.toggleLanguage = function() {
		$rootScope.isFrench = !$rootScope.isFrench;
		
		if ($rootScope.isFrench) {
			$scope.menu = francais;
			$scope.language = 'English';
		}
		else 
		{
			$scope.menu = english;
			$scope.language = 'Français';
		}
	}
  })
  .run( [    '$rootScope', '$state', '$stateParams',  
	function ($rootScope, 	$state,   $stateParams) { 
	
	$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
	  
	$rootScope.$on('$stateChangeStart', function (event, toState, fromState, toParams) {
		//var requireLogin = toState.data.requireLogin;
		console.log("$stateChangeStart from " + $state.$current + " to " + toState.name);
		
		if ( toState.name != 'home' )
		{
			//console.log("toState.name is not home");
			$rootScope.isHome = false;
		}
		else 
		{
			//console.log("toState.name is home");
			$rootScope.isHome = true;
		}
	
		// if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
		  // event.preventDefault();

		  // loginModal()
			// .then(function () {
			  // return $state.go(toState.name, toParams);
			// })
			// .catch(function () {
			  // return $state.go('home');
			// });
		  // }
	  
	});

  }])
  ;
