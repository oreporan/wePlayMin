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
    .state('tabsController.games', {
      url: '/games',
      views: {
        'games': {
          templateUrl: 'templates/games.html',
          controller: 'gameCtrl'
        }
      }
    })
    .state('tabsController.leagues', {
      url: '/leagues',
      views: {
        'leagues': {
          templateUrl: 'templates/leagues/leagues.html',
          controller: 'leagueCtrl'
        }
      }
    })
    .state('tabsController.singleLeague', {
        url: '/singleLeague',
        views: {
          'leagues': {
            templateUrl: 'templates/leagues/singleLeague.html',
            controller: 'leagueCtrl'
          }
        }
      })
    .state('tabsController.createLeague', {
      url: '/createLeague',
      views: {
        'leagues': {
          templateUrl: 'templates/leagues/createLeague.html',
          controller: 'leagueCtrl'
        }
      }
    })
    .state('tabsController.findLeague', {
      url: '/findLeague',
      views: {
        'leagues': {
          templateUrl: 'templates/leagues/findLeague.html',
          controller: 'leagueCtrl'
        }
      }
    })
    .state('tabsController.notifications', {
      url: '/notifications',
      views: {
        'notifications': {
          templateUrl: 'templates/notifications/notifications.html',
          controller: 'notificationsCtrl'
        }
      }
    })
    .state('tabsController.profile', {
      url: '/profile',
      views: {
        'profile': {
          templateUrl: 'templates/profile/profile.html',
          controller: 'profileCtrl'
        }
      }
    })
    .state('tabsController', {
      url: '',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
