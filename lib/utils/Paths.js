// Paths

// Application Root
module.exports.ROOT = '/wePlay';

// Users endpoint
module.exports.BASE_USERS = '/users';
module.exports.PATH_USERS_GETUSER_WITH_ID = '/getUsers/';
module.exports.PATH_USERS_GETUSER_WITH_NAME = '/getUsersByName/';
module.exports.PATH_USERS_UPDATEUSER_WITH_ID = '/updateUser/';

// Authenticate endpoint
module.exports.BASE_AUTHENTICATE = '/authenticate';
module.exports.PATH_AUTHENTICATE_SIGNUP = '/signup';
module.exports.PATH_AUTHENTICATE_SIGNIN = '/signin';
module.exports.PATH_AUTHENTICATE_FORGOTPASSWORD_WITH_EMAIL = '/forgotpassword/';

// League endpoint
module.exports.BASE_LEAGUES = '/leagues';
module.exports.PATH_LEAGUES_ADDLEAGUE = '/addLeague';
module.exports.PATH_LEAGUES_REMOVELEAGUE_WITH_ID = '/removeLeague';
