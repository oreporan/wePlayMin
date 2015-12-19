angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
    .state('tabsController.home', {
      url: '/home',
      views: {
        'home': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
    })
    .state('tabsController.game', {
      url: '/game',
      views: {
        'game': {
          templateUrl: 'templates/game.html',
          controller: 'gameCtrl'
        }
      }
    })
    .state('tabsController.league', {
      url: '/league',
      views: {
        'league': {
          templateUrl: 'templates/league/league.html',
          controller: 'leagueCtrl'
        }
      }
    })
    .state('tabsController.createLeague', {
      url: '/createLeague',
      views: {
        'league': {
          templateUrl: 'templates/league/createLeague.html',
          controller: 'leagueCtrl'
        }
      }
    })
    .state('tabsController', {
      url: '/page3',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
