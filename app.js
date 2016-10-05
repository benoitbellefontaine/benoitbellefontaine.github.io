
var app = angular.module("app", ['ngResource', 'ui.router', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app

  .config(function ($httpProvider) {

	$httpProvider.interceptors.push(function ($timeout, $q, $injector) {
	var loginModal, $http, $state;

	// this trick must be done so that we don't receive
	// `Uncaught Error: [$injector:cdep] Circular dependency found`
	$timeout(function () {
	  loginModal = $injector.get('loginModal');
	  $http = $injector.get('$http');
	  $state = $injector.get('$state');
	});

	return {
	  responseError: function (rejection) {
		if (rejection.status !== 401) {
		  return rejection;
		}

		var deferred = $q.defer();

		loginModal()
		  .then(function () {
			deferred.resolve( $http(rejection.config) );
		  })
		  .catch(function () {
			$state.go('welcome');
			deferred.reject(rejection);
		  });

		return deferred.promise;
	  }
	};
	});
  })

  .config(function ($stateProvider, $urlRouterProvider) {
	  
	$urlRouterProvider.otherwise("/home");
	
	$stateProvider
		.state('home', {
			url: '/home',
			onEnter: ['$state', function($state) { console.log('entering home'); }],
			onExit:  ['$state', function($state) { console.log('leaving home'); }],
			views: {
				"viewHome": {
					templateUrl: 'partials/home.html',
					controller: function($scope, $rootScope, $state) {
						$scope.register = function() {
							console.log('home:register');
						}
					},
				}
			},
			data: {
				requireLogin: false,
				//authorizedRoles: [USER_ROLES.superuser, USER_ROLES.admin, USER_ROLES.player],
				//isAuthenticated: true
			}
		})
		.state('dashboard', {
			url: '/dashboard',
			onEnter: ['$state', function($state) { console.log('entering dashboard'); }],
			onExit:  ['$state', function($state) { console.log('leaving dashboard'); }],
			views: {
				"viewDash": {
						templateUrl: 'partials/dash.html',
						controller: function($scope, $rootScope, $state, $timeout, $q) { //, AuthService) {
							$scope.page = "DASHBOARD PAGE";
							$scope.username = $rootScope.currentUser;
							$scope.submit2 = function() {
								console.log('dashboard: logging out');
								$rootScope.currentUser = undefined;
								$state.go('home');
							};
							$scope.play2 = function() {
								$state.go('game');
							};
						},
						controllerAs: '$dash'
				}
			},
			data: { requireLogin: true }
		})
		.state('game', {
			url: '/game',
			onEnter: ['$state', function($state) { console.log('entering game'); }],
			onExit:  ['$state', function($state) { console.log('leaving game'); }],
			views: {
				"viewGame": {
					templateUrl: 'partials/game.html',
					controller: function($scope) {
						$scope.page = "GAME PAGE";
					},
				}
			},
			data: { requireLogin: true }
		})
		/*
		.state('login', {
			url: '/login',
			onEnter: ['$state', function($state) { console.log('entering login'); }],
			onExit:  ['$state', function($state) { console.log('leaving login'); }],
			views: {
				"viewLogin": {
					templateUrl: 'partials/login.html',
					controller: function($scope, $rootScope, $state, $timeout, $q) { //, AuthService) {
						$scope.page = "LOGIN FORM";
						$scope.loginData = {};
						$scope.loginData.username = "ben";
						$scope.loginData.password = "ny8gpa40";
						$scope.login = function(regData) {
							console.log('calling authService');
							var defer = $q.defer();
							$timeout(function() {
								defer.resolve('data received!');
							}, 5000);
							console.log('client ' + $scope.loginData.username  + ' logged in');
							$rootScope.currentUser = $scope.loginData.username;
							$state.go('dashboard');
						};
					},
				},
			},
			data: { requireLogin: false }
		})	
		.state('register', {
			url: '/register',
			onEnter: ['$state', function($state) { console.log('entering register'); }],
			onExit:  ['$state', function($state) { console.log('leaving register'); }],
			views: {
				"viewRegister": {
					templateUrl: 'partials/register.html',
					controller: function($scope, $rootScope, $state, $timeout, $q) { //, AuthService) {
						$scope.page = "SIGN UP PAGE";
						$scope.regData = {};
						$scope.regData.fullname = "benoit bellefontaine";
						$scope.regData.username = "ben";
						$scope.regData.emailaddress = "ben@gmail.com";
						$scope.regData.password = "ny8gpa40";
						$scope.login = function(regData) {
							console.log('calling authService');
							//var defer = $q.defer();
							$timeout(function() {
								//defer.resolve('data received!');
								
								if(Math.round(Math.random())) {
									defer.resolve('data received!')
								} else {
									defer.reject('oh no an error! try again')
								}
								
							}, 2000);
							console.log('client ' + $scope.regData.username  + ' logged in');
							$state.go('app.dashboard');
							
							var promise = AuthService.login(regData);
							promise.then(function(user) {
								//alert('Success: ' + user.data.role);
								$rootScope.currentUser = user.data.emailAddress;
								$rootScope.role = user.data.role;
								$state.go(user.data.role);
							}, function(reason) {
								alert('Failed: ' + reason);
							});
							
						};
					},
				}
			},
			// templateUrl: 'loginApp/register.html',
			// controller: 'RegisterController',
		  data: {
			requireLogin: false 
		  }
		})
		*/
		/*
		.state('/threejs', {
			url: '/threejs',
			onEnter: ['$state', function($state) { console.log('entering register'); }],
			onExit:  ['$state', function($state) { console.log('leaving register'); }],
			views: {
				"viewRegister": {
					  templateUrl: 'threejsApp/threejs.html',
					  controller: 'ThreejsCtrl',
					  //data: { requireLogin: false }
				}
			},
			// templateUrl: 'loginApp/register.html',
			// controller: 'RegisterController',
		  data: {
			requireLogin: false 
		  }
        })
		.state('skybox', {
			url: '/skybox',
			views: {
				"viewSkybox": {
					  templateUrl: 'threejsApp/skybox.html',
					  controller: 'SkyboxCtrl',
					  //data: { requireLogin: false }
				}
			},
			// templateUrl: 'loginApp/register.html',
			// controller: 'RegisterController',
		  data: {
			requireLogin: false 
		  }
        })
		.state('particle', {
			url: '/particle',
			views: {
				"viewParticle": {
					  templateUrl: 'index.html',
					  controller: 'ParticleCtrl',
					  //data: { requireLogin: false }
				}
			},
			// templateUrl: 'loginApp/register.html',
			// controller: 'RegisterController',
		  data: {
			requireLogin: false 
		  }
        })*/
  })

  .controller('MainController', function ($scope, $rootScope, $state, registerModal) {
	$scope.register = function() {
		console.log('home:register');
		registerModal()
			.then(function (name) {
				console.log('name',name);
				return $state.go('dashboard');
			})
			.catch(function () {
				return $state.go('home');
		});
	}
  })
  
  .controller('RegisterController', function ($scope, $rootScope) { //, AUTH_EVENTS, USER_ROLES, UserFactory) {
	  $scope.roles = USER_ROLES; //['superuser','admin','teacher','parent'];
	  $scope.credentials = {
		name: 'Oscar Peterson',
		username: 'oscar',
		password: '',
		emailAddress: 'o.p@jazz.com',
		role: 'admin'
	  };
	  $scope.register = function (credentials) {
		UserFactory.register(credentials).then(function (user) {
		  $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		  $scope.setCurrentUser(user);
		}, function () {
		  $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	  };
  })

  // login service
  .service('loginModal', function ($uibModal, $rootScope) {
	function assignCurrentUser (user) {
		$rootScope.currentUser = user;
		return user;
	}
	return function() {
		var instance = $uibModal.open({
			templateUrl: 'partials/loginModal.html',
			controller: 'LoginModalCtrl',
			controllerAs: '$ctrl'
		})
		return instance.result.then(assignCurrentUser);
	};
  })
  
  // login controller
  .controller('LoginModalCtrl', function ($scope) {
	var $ctrl = this;
	$scope.page = "LOGIN FORM";
	$scope.loginData = {};
	$scope.email = "ben@gmail.com";
	$scope.password = "ny8gpa40";
	
	this.cancel = $scope.$dismiss;
	
	this.submit = function (email, password) {
		$scope.$close(email);
		// to do RESTful API
		//UsersApi.login(email, password).then(function (user) {
		//	$scope.$close(user);
		//});
		console.log('client ' + email  + ' logged in');
	}
  })
  
  // register service
  .service('registerModal', function ($uibModal, $rootScope) {
	function assignCurrentUser (user) {
		$rootScope.currentUser = user;
		return user;
	}
	return function() {
		var instance = $uibModal.open({
			templateUrl: 'partials/registerModal.html',
			controller: 'RegisterModalCtrl',
			controllerAs: '$ctrl'
		})
		return instance.result.then(assignCurrentUser);
	};
  })
  
  // register controller
  .controller('RegisterModalCtrl', function ($scope) {
	var $ctrl = this;
	$scope.page = "REGISTER FORM";
	$scope.name = "ben";
	$scope.email = "ben@gmail.com";
	$scope.password = "ny8gpa40";
	
	this.cancel = $scope.$dismiss;
	
	this.submit = function (name, email, password) {
		$scope.$close(name);
		// to do RESTful API
		//UsersApi.login(email, password).then(function (user) {
		//	$scope.$close(user);
		//});
		console.log('client ' + name  + ' created');
	};
	
  })
  
  .run(function ($rootScope, $state, loginModal) { //$uibModal) {
	  
  	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		
		var requireLogin = toState.data.requireLogin;
		
		// user dont exist
		if (toState.name === 'register') {
			console.log('toState.name ===',toState.name);
		//var requireRegister = toState.data.requireRegister;
		}

		if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
			event.preventDefault();

			loginModal()
				.then(function () {
					console.log('toState.name',toState.name);
					return $state.go(toState.name, toParams);
				})
				.catch(function () {
					return $state.go('home');
			});
		}
		
	});
  });