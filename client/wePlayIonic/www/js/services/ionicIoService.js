angular.module('app.services')
  .service('ionicIoService', function($q, logger, constants, userService) {

    var wpLogger = logger.logger("ionicIoService");

    var io = Ionic.io();
    var ionicUser;

    var push = new Ionic.Push({
      "debug": false,
      "onNotification": function(notification) {
        alert('Received push notification!');
      },
      "pluginConfig": {
        "android": {
          "iconColor": "#0000FF"
        }
      }
    });


    var registerIonicUser = function(clientId) {

      var user;
      userService.getUserById(clientId, function(user, err) {
        if (err) {
          wpLogger.audit("registerIonicUser", "failed to get user");
        } else {
          var ionicUser = Ionic.User.current();

          if (!ionicUser.id) {
            ionicUser.id = Ionic.User.anonymousId();
          }

          // Just add some dummy data..
          ionicUser.set('name', user.name);
          ionicUser.set('wp_id', user._id);
          ionicUser.set('email', user.email);
          ionicUser.set('image', user.profilePicURL);
          ionicUser.set('wpUser', user);
          ionicUser.save();

          var callback = function(token) {
            wpLogger.audit("registerIonicUser", "save ionic user with token: " + token.token);
            push.addTokenToUser(ionicUser);
            ionicUser.save();
          };
          push.register(callback);
        }
      });

    }

    var unregisterIonicUser = function() {
      var failure = function(error) {
        wpLogger.audit("unregisterIonicUser", "failed with error: " + error);
      };
      push.unregister().then(wpLogger.audit("unregisterIonicUser", "succeeded"), failure);
    }

    return {
      registerIonicUser: registerIonicUser,
      unregisterIonicUser: unregisterIonicUser
    };
  });
