// Paths

// Application Root - all requests are prefixed with this path
// http://wwww.HOST.com/wePlay/v1/*
module.exports.ROOT = '/wePlay/v1';

//---------------Authenticate endpoint----------------//

/*
 * Authenticate endpoint
 * Authenticates users, signup, signin
 * This is the only endpoint that doesn't pass through the validation filter
 * http://wwww.HOST.com/wePlay/v1/authenticate/*
 */
module.exports.BASE_AUTHENTICATE = '/auth';

/*
 * info: signs up a user
 * method: POST
 * accepts: JSON - object compliant with the User model - {name: <name>, email: <email> , password: <password>}
 * returns: JSON - a user object holding a new clientId
 * example: http://wwww.HOST.com/wePlay/v1/authenticate/signup/
 */
module.exports.PATH_AUTHENTICATE_SIGNUP = '/signup';

/*
 * info: signs in an existing user
 * method: POST
 * accepts: JSON - {email: <email>, password: <password}
 * returns: JSON - a user object
 * example: http://wwww.HOST.com/wePlay/v1/authenticate/signin/
 */
module.exports.PATH_AUTHENTICATE_SIGNIN = '/signin';

/*
 * info: facebook authentication
 * method: POST
 * accepts: JSON - {email: <email>, password: <password}
 * returns: JSON - a user object
 * example: http://wwww.HOST.com/wePlay/v1/authenticate/signin/
 */
module.exports.PATH_AUTHENTICATE_FACEBOOK = '/facebook';

module.exports.PATH_AUTHENTICATE_GOOGLE = '/google';
/*
 * info: returns a user object holding the password, this is currently
 * under construction because we will in reality send an email not return the object
 * method: GET
 * accepts: String - email
 * returns: JSON - a user object with the email
 * example: http://wwww.HOST.com/wePlay/v1/authenticate/forgotpassword/oreporan@gmail.com
 */
module.exports.PATH_AUTHENTICATE_FORGOTPASSWORD_WITH_EMAIL = '/forgotpassword';

//---------------User endpoint----------------//

/*
 * Users endpoint
 * All user related requests
 * http://wwww.HOST.com/wePlay/v1/users/*
 */
module.exports.BASE_USERS = '/users';

/*
 * info: gets a user by id
 * method: GET
 * accepts: String - clientId
 * returns: JSON - a user object
 * example: http://wwww.HOST.com/wePlay/v1/users/getUser/43524261
 */
module.exports.PATH_USERS_GETUSER_WITH_ID = '/getUser';

/*
 * info: gets a user by his user name (not email!)
 * method: GET
 * accepts: String - userName
 * returns: JSON - a user object
 * example: http://wwww.HOST.com/wePlay/v1/users/getUser/Moshiko
 */
module.exports.PATH_USERS_GETUSER_WITH_NAME = '/getUserByName';

/*
 * info: updates a user's parameters
 * method: PUT
 * accepts: JSON - an object that holds parameters from the user object with updated values
 * returns: JSON - a user object with the new values
 * example: http://wwww.HOST.com/wePlay/v1/users/updateUser/
 */
module.exports.PATH_USERS_UPDATEUSER_WITH_ID = '/updateUser';


/*
 * info: gets all the user objects that contain this word, for example
 * calling this method with the keyword : 'over' will find the user 'over' , 'overflow' and the user 'stack overflow'
 * method: GET
 * accepts: String - user name keyword
 * returns: JSON - an array of user objects {users : [{},{}]}
 * example: http://wwww.HOST.com/wePlay/v1/users/getUsersByKeyword/orep
 */
module.exports.PATH_USERS_GETUSERSBYKEYWORD = '/getUsersByKeyword';

/*
 * info: gets a list of user objects
 * method: POST
 * accepts: JSON - an array of clientIds {users: ["1234", "5436"...]}
 * returns: array - an array of JSONs - user objects
 * example: http://wwww.HOST.com/wePlay/v1/users/getUsersListById/
 */
module.exports.PATH_USERS_GETUSERSLIST_BY_ID = '/getUsersListById';

//---------------League endpoint----------------//

/*
 * League endpoint
 * All leagues related requests
 * http://wwww.HOST.com/wePlay/v1/leagues/*
 */
module.exports.BASE_LEAGUES = '/leagues';

/*
 * info: creates a new leagues and makes this user the admin
 * method: POST
 * accepts: JSON - object compliant with the League model - { name: <String - leagues name>, admin: <String - this client id>, frequency: <Int - for now, type -1>}
 * returns: array - an array of JSONs - user objects
 * example: http://wwww.HOST.com/wePlay/v1/users/addLeague/
 */
module.exports.PATH_LEAGUES_ADDLEAGUE = '/addLeague';

/*
 * info: gets the leagues object by leagues Id
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a leagues object
 * example: http://wwww.HOST.com/wePlay/v1/users/getLeague/4524262
 */
module.exports.PATH_LEAGUES_GETLEAGUEBYID = '/getLeague';

/*
 * info: gets the leagues object by leagues Id
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a leagues object
 * example: http://wwww.HOST.com/wePlay/v1/users/getLeague/4524262
 */
module.exports.PATH_LEAGUES_GETLEAGUEBYNAME = '/getLeagueByName';


/*
 * info: gets all the leagues objects that contain this word, for example
 * calling this method with the keyword : 'over' will find the leagues 'over' , 'overflow' but not the leagues 'stack overflow'
 * method: GET
 * accepts: String - leagues name keyword
 * returns: JSON - an array of leagues objects {leagues : [{},{}]}
 * example: http://wwww.HOST.com/wePlay/v1/users/getLeague/4524262
 */
module.exports.PATH_LEAGUES_GETLEAGUESBYKEYWORD = '/getLeagueByKeyword';


/*
 * info: pushes this user to a leagues, the client is taken from the header
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a leagues object
 * example: http://wwww.HOST.com/wePlay/v1/users/addUserToLeague/4524262
 */
module.exports.PATH_LEAGUES_ADDUSERTOLEAGUE = '/addUserToLeague';

/*
 * info: removes this user from a leagues, the client is taken from the header
 * method: GET
 * accepts: String - leagueId
 * returns: JSON - a leagues object without the user in it
 * example: http://wwww.HOST.com/wePlay/v1/users/removeUserFromLeague/4524262
 */
module.exports.PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID = '/removeUserFromLeague';

/*
 * info: gets a list of leagues objects
 * method: POST
 * accepts: JSON - an array of leagueIds  {leagues: ["1234", "5436"...]}
 * returns: array - an array of JSONs - leagues objects
 * example: http://wwww.HOST.com/wePlay/v1/users/getLeaguesListById/
 */
module.exports.PATH_LEAGUES_GETLEAGUESLIST_BY_ID = '/getLeaguesListById';

/*
 * info: updates leagues parameters such as name or frequency
 * method: PUT
 * accepts: JSON - {admin : <clientId>}
 * returns: JSON - leagues object updated
 * example: http://wwww.HOST.com/wePlay/v1/users/updateLeague/
 */
module.exports.PATH_LEAGUES_UPDATELEAGUE = '/updateLeague';

/*
 * info: updates leagues parameters such as name or frequency
 * method: PUT
 * accepts: JSON - an array of leagueIds  { name: <new name>, frequency : <new frequency>}
 * returns: JSON - leagues object with new parameters
 * example: http://wwww.HOST.com/wePlay/v1/users/updateLeague/
 */
module.exports.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID = '/addAdmin';

// Game endpoint
module.exports.BASE_GAME = '/games';
module.exports.PATH_GAME_ADDGAME = '/addGame';
module.exports.PATH_GAME_UPDATEGAME = '/updateGame';
module.exports.PATH_GAME_CHANGEGAMESTATUS_WITH_ID = '/gameStatus';
module.exports.PATH_GAME_GETGAME_WITH_ID = '/getGame';
module.exports.PATH_GAME_GETGAMELIST = '/getGamesListById';
module.exports.PATH_GAME_BUILD_TEAMS_WITH_ID = '/buildTeams';
module.exports.PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID = '/attending';


// Notification endpoint
module.exports.BASE_NOTIFICATIONS = '/notifications';
module.exports.PATH_NOTIFICATIONS_GET_NOTIFICATIONS = '/getNotifications';
module.exports.PATH_NOTIFICATIONS_MARK_AS_READ = '/markAsRead';
