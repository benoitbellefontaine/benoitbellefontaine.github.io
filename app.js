
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
		.state('login', {
			url: '/login',
			onEnter: ['$state', function($state) { console.log('entering login'); }],
			onExit:  ['$state', function($state) { console.log('leaving login'); }],
			views: {
				"viewLogin": {
					templateUrl: 'partials/login.html',
					controller: function($scope, $rootScope, $state, $timeout, $q) { //, AuthService) {
						$scope.page = "state: login";
						$scope.loginData = {};
						$scope.loginData.email = "test@example.com";
						$scope.loginData.username = "test";
						$scope.loginData.password = "eueueueu";
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
						
						var apiKey = 'AIzaSyCS6E__FsG206GJUh6wWgP6oz0QVCWBpCU';
						var clientId = '898129103079-df2a6vsnvtfvsv3l41vdjkipvvd60aoo.apps.googleusercontent.com';
						var scopes = 'profile';
						
						$scope.apiKey = apiKey;
						$scope.clientId = clientId;
						
						gapi.load('client:auth2', initAuth);
						
						function initAuth() {
							console.log('initAuth');
					        gapi.client.setApiKey(apiKey);
					        gapi.auth2.init({
					            client_id: clientId,
					            scope: scopes
					        });
					        //var signinButton = document.getElementById('google-button');
					        //signinButton.addEventListener("click", auth);
						}
						
						function auth() {
							gapi.auth2.getAuthInstance().signIn().then(function() {
								makeApiCall();
							});
						}
						this.google = function () {
							var instance = gapi.auth2.getAuthInstance();
							instance.signIn().then(function() {
								makeApiCall();
							});
						}
					},
				},
			},
			data: { requireLogin: false }
		})	
		/*
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

  // AUTHENTICATION
  .constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
  })

  .factory('AuthService', function ($http) { //, Session) {
	var authService = {};
	authService.isAuthenticated = function () {
		//return !!Session.userId;
		return true; // assume authentication is always true !
	};
	return authService;
  })
  
  .controller('ApplicationController', function ($scope, $rootScope, $state, registerModal, loginModal, AUTH_EVENTS) {
	  
	$scope.currentUser = null;
	$scope.isAuthenticated = AUTH_EVENTS.notAuthenticated;
	
	$scope.logout = function() {
		console.log('MainController.logout: ',$scope.currentUser);
		$scope.currentUser = undefined;
		$rootScope.currentUser = undefined;
		$state.go('home');
	}
	
	$scope.login = function() {
		console.log('user before login: ',$scope.currentUser);
		loginModal()
			.then(function (user) {
				$scope.currentUser = user;
				return $state.go('dashboard');
			})
			.catch(function () {
				return $state.go('home');
		});
		console.log('user after login: ',$scope.currentUser);
	}
	
	$scope.register = function() {
		registerModal()
			.then(function (user) {
				$scope.currentUser = user;
				return $state.go('dashboard');
			})
			.catch(function () {
				return $state.go('home');
		});
	}
	
	$scope.setCurrentUser = function (user) {
		$scope.currentUser = user;
	};
	
  })
  
  .service('session', ['$log', 'localStorage', function ($log, localStorage) {

	// Instantiate data when service
	// is loaded
	this._user = JSON.parse(localStorage.getItem('session.user'));
	this._accessToken = JSON.parse(localStorage.getItem('session.accessToken'));

	this.getUser = function(){
	  return this._user;
	};

	this.setUser = function(user){
	  this._user = user;
	  localStorage.setItem('session.user', JSON.stringify(user));
	  return this;
	};

	this.getAccessToken = function(){
	  return this._accessToken;
	};

	this.setAccessToken = function(token){
	  this._accessToken = token;
	  localStorage.setItem('session.accessToken', token);
	  return this;
	};

	/**
	 * Destroy session
	 */
	this.destroy = function destroy(){
	  this.setUser(null);
	  this.setAccessToken(null);
	};
	  
  }])
  
  .service('auth', ['$http', 'session', function AuthService($http, session) {

    /**
    * Check whether the user is logged in
    * @returns boolean
    */
    this.isLoggedIn = function isLoggedIn(){
      return session.getUser() !== null;
    };

    /**
    * Log in
    *
    * @param credentials
    * @returns {*|Promise}
    */
    this.login = function(credentials){
      return $http
        .post('/api/login', credentials)
        .then(function(response){
          var data = response.data;
          session.setUser(data.user);
          session.setAccessToken(data.accessToken);
        });
    };

    /**
    * Log out
    *
    * @returns {*|Promise}
    */
    this.logout = function(){
      return $http
        .get('/api/logout')
        .then(function(response){

          // Destroy session in the browser
          session.destroy();      
        });
    };

  }])
  
/*
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
*/
  
  .factory('localStorage', ['$window', function localStorageServiceFactory($window){
    if($window.localStorage){
      return $window.localStorage;
    }
    throw new Error('Local storage support is needed');
  }])

  // login service
  .service('loginModal', function ($uibModal, $rootScope) {
	function assignCurrentUser (user) {
		$rootScope.currentUser = user;
		return user;
	}
	$uibModal.size = 'lg';
	return function() {
		var instance = $uibModal.open({
			templateUrl: 'partials/loginModal.html',
			controller: 'LoginModalController',
			controllerAs: '$ctrl'
		})
		return instance.result.then(assignCurrentUser);
	};
  })
  
  // login controller
  .controller('LoginModalController', function ($scope) {
	  
	$scope.page = "login form";
	$scope.email = "test@example.com";
	$scope.password = "ueueueu";

	console.log('Loading GOOGLE API AUTHORIZED ACCESS from LoginModalController');
	
	var apiKey = 'AIzaSyCS6E__FsG206GJUh6wWgP6oz0QVCWBpCU';
	var clientId = '898129103079-df2a6vsnvtfvsv3l41vdjkipvvd60aoo.apps.googleusercontent.com';
	var scopes = 'profile';
	
	$scope.apiKey = apiKey;
	$scope.clientId = clientId;
	
	gapi.load('client:auth2', initAuth);
	
	function initAuth() {
		console.log('initAuth');
        gapi.client.setApiKey(apiKey);
        gapi.auth2.init({
            client_id: clientId,
            scope: scopes
        });
        //var signinButton = document.getElementById('google-button');
        //signinButton.addEventListener("click", auth);
	}
	
	function auth() {
		gapi.auth2.getAuthInstance().signIn().then(function() {
			makeApiCall();
		});
	}
	
	this.google = function () {
		var instance = gapi.auth2.getAuthInstance();
		instance.signIn().then(function() {
			makeApiCall();
		});
	}
	
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
		$rootScope.loggedIn = 1;
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
  
  .run(function ($rootScope, $state, loginModal, auth, session) { //$uibModal) {
	  
	$rootScope.$on('$stateChangeStart', function (event, next, toParams) {
		
		$rootScope.auth = auth;
		$rootScope.session = session;

		var requireLogin = next.data.requireLogin;
		
		if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
		//if ( requireLogin && ( $scope.isAuthenticated === AUTH_EVENTS.notAuthenticated ) ) {
			event.preventDefault();

			loginModal()
				.then(function () {
					console.log('toState.name',next.name);
					return $state.go(next.name, toParams);
				})
				.catch(function () {
					return $state.go('home');
			});
			
		}
		
	});
	
  });