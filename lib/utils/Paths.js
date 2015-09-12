// Paths

// Application Root
module.exports.ROOT = '/wePlay';

// Users endpoint
module.exports.BASE_USERS = '/users';
module.exports.PATH_USERS_GETUSER_WITH_ID = '/getUser';
module.exports.PATH_USERS_GETUSER_WITH_NAME = '/getUserByName';
module.exports.PATH_USERS_UPDATEUSER_WITH_ID = '/updateUser';
module.exports.PATH_USERS_GETUSERSLIST_BY_ID = '/getUsersListById';

// Authenticate endpoint
module.exports.BASE_AUTHENTICATE = '/authenticate';
module.exports.PATH_AUTHENTICATE_SIGNUP = '/signup';
module.exports.PATH_AUTHENTICATE_SIGNIN = '/signin';
module.exports.PATH_AUTHENTICATE_FORGOTPASSWORD_WITH_EMAIL = '/forgotpassword';

// League endpoint
module.exports.BASE_LEAGUES = '/leagues';
module.exports.PATH_LEAGUES_ADDLEAGUE = '/addLeague';
module.exports.PATH_LEAGUES_GETLEAGUEBYID = '/getLeagueById';
module.exports.PATH_LEAGUES_GETLEAGUEBYNAME = '/getLeagueByName';
module.exports.PATH_LEAGUES_ADDUSERTOLEAGUE = '/addUserToLeague';
module.exports.PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID = '/removeUserFromLeague';
module.exports.PATH_LEAGUES_GETALLUSERLEAGUES = '/getAllUserLeagues';
module.exports.PATH_LEAGUES_UPDATELEAGUE = '/updateLeague';

// Game endpoint
module.exports.BASE_GAME = '/game';
module.exports.PATH_GAME_ADDGAME = '/addGame';
module.exports.PATH_GAME_UPDATEGAME = '/updateGame';
module.exports.PATH_GAME_ADDUSERTOGAME_WITH_GAMEID = '/addUserToGame';
module.exports.PATH_GAME_REMOVEUSERFROMGAME_WITH_GAMEID = '/addUserToGame';
