// Controller for leagues

/**
* Gets all the leagues in the DB for a specific clientId
*/
module.exports.getAllLeagues = function( clientId , callback ) {
    League.find(function(err, Leagues) {
         if (err) {
              callback(null, err);
          } else {
              callback(Leagues);
          }
    });
}
