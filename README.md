This README provides the API to all the requests

ROOT = '/wePlay/v1';

//---------------Authenticate endpoint----------------//


 * Authenticate endpoint
 * Authenticates users, signup, signin
 * This is the only endpoint that doesn't pass through the validation filter
 * http://wwww.HOST.com/wePlay/v1/authenticate/*
 * path = '/authenticate';


 * info: signs up a user
 * method: POST
 * accepts: JSON - object compliant with the User model - {name: <name>, email: <email> , password: <password>}
 * returns: JSON - a user object holding a new clientId
 * example: http://wwww.HOST.com/wePlay/v1/authenticate/signup/
 * path = '/signup'


 * info: signs in an existing user
 * method: POST
 * accepts: JSON - {email: <email>, password: <password}
 * returns: JSON - a user object
 * example: http://wwww.HOST.com/wePlay/v1/authenticate/signin/
 * path = '/signin'

 * info: returns a user object holding the password, this is currently
 * under construction because we will in reality send an email not return the object
 * method: GET
 * accepts: String - email
 * returns: JSON - a user object with the email
 * example: http://wwww.HOST.com/wePlay/v1/authenticate/forgotpassword/oreporan@gmail.com
 * path = '/forgotpassword'

//---------------User endpoint----------------//

 * Users endpoint
 * All user related requests
 * http://wwww.HOST.com/wePlay/v1/users/*
 * path = '/users'


 * info: gets a user by id
 * method: GET
 * accepts: String - clientId
 * returns: JSON - a user object
 * example: http://wwww.HOST.com/wePlay/v1/users/getUser/43524261
 * path = '/getUser'


 * info: gets a user by his user name (not email!)
 * method: GET
 * accepts: String - userName
 * returns: JSON - a user object
 * example: http://wwww.HOST.com/wePlay/v1/users/getUser/Moshiko
 * path = '/getUserByName'


 * info: updates a user's parameters
 * method: PUT
 * accepts: JSON - an object that holds parameters from the user object with updated values
 * returns: JSON - a user object with the new values
 * example: http://wwww.HOST.com/wePlay/v1/users/updateUser/
 * path = '/updateUser'

 * info: gets a list of user objects
 * method: POST
 * accepts: JSON - an array of clientIds {users: ["1234", "5436"...]}
 * returns: array - an array of JSONs - user objects
 * example: http://wwww.HOST.com/wePlay/v1/users/getUsersListById/
 * path = '/getUsersListById'

//---------------League endpoint----------------//

 * League endpoint
 * All league related requests
 * http://wwww.HOST.com/wePlay/v1/leagues/*
 * base = '/leagues'

 * info: creates a new league and makes this user the admin
 * method: POST
 * accepts: JSON - object compliant with the League model - { name: <String - league name>, admin: <String - this client id>, frequency: <Int - for now, type -1>}
 * returns: array - an array of JSONs - user objects
 * example: http://wwww.HOST.com/wePlay/v1/leagues/addLeague/
 * path = '/addLeague'


 * info: gets the league object by league Id
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a league object
 * example: http://wwww.HOST.com/wePlay/v1/leagues/getLeague/4524262
 * path = '/getLeague'

 * info: gets the league object by league Id
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a league object
 * example: http://wwww.HOST.com/wePlay/v1/leagues/getLeague/4524262
 * path = '/getLeagueByName'

 * info: pushes this user to a league, the client is taken from the header
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a league object
 * example: http://wwww.HOST.com/wePlay/v1/leagues/addUserToLeague/4524262
 * path = '/addUserToLeague'

 * info: removes this user from a league, the client is taken from the header
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a league object without the user in it
 * example: http://wwww.HOST.com/wePlay/v1/leagues/removeUserFromLeague/4524262
 * path = '/removeUserFromLeague'

 * info: gets a list of league objects
 * method: POST
 * accepts: JSON - an array of leagueIds  {leagues: ["1234", "5436"...]}
 * returns: array - an array of JSONs - league objects
 * example: http://wwww.HOST.com/wePlay/v1/leagues/getLeaguesListById/
 * path = '/getLeaguesListById'

 * info: updates league parameters such as name or frequency
 * method: PUT
 * accepts: JSON - an array of leagueIds  { name: <new name>, frequency : <new frequency>}
 * returns: JSON - league object with new parameters
 * example: http://wwww.HOST.com/wePlay/v1/leagues/updateLeague/
 * path = '/updateLeague'

// Game endpoint
module.exports.BASE_GAME = '/games';
module.exports.PATH_GAME_ADDGAME = '/addGame';
module.exports.PATH_GAME_UPDATEGAME = '/updateGame';
module.exports.PATH_GAME_ADDUSERTOGAME_WITH_GAMEID = '/addUserToGame';
module.exports.PATH_GAME_REMOVEUSERFROMGAME_WITH_GAMEID = '/addUserToGame';
