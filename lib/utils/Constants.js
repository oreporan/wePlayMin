// Constants

// Headers on request
module.exports.CLIENT_ID_HEADER_KEY = "client-id";
module.exports.LEAGUE_ID_HEADER_KEY = 'league-id';

// Player Ratings
module.exports.RATING_A = "A";
module.exports.RATING_B = "B";
module.exports.RATING_C = "C";
module.exports.RATING_D = "D";


// Game Frequency {-1 = one time game, 0 = weekly, 1 = monthly}
module.exports.GAME_FREQUENCY_NEVER = -1;
module.exports.GAME_FREQUENCY_WEEKLY = 0;
module.exports.GAME_FREQUENCY_MONTHLY = 1;

// requests

module.exports.POST = "POST";
module.exports.GET = "GET";
module.exports.PUT = "PUT";


// User football positions
module.exports.GK = "GK";
module.exports.CB = "CB";
module.exports.RB = "RB";
module.exports.LB = "LB";
module.exports.CM = "CM";
module.exports.LM = "LM";
module.exports.RM = "RM";
module.exports.CF = "CF";
module.exports.RF = "RF";
module.exports.LF = "LF";

// Authentication Methods
module.exports.AUTHENTICATION_METHOD_FACEBOOK = "facebook";
module.exports.AUTHENTICATION_METHOD_CUSTOM = "custom";

// Attending games
module.exports.GAME_ATTENDING_NO = {status: -1, name: "NO"};
module.exports.GAME_ATTENDING_YES = {status: 1, name: "YES"};
module.exports.GAME_ATTENDING_UNDECIDED = {status: 0, name: "UNDECIDED"};
module.exports.GAME_ATTENDING_INVITE = {status: 2, name: "INVITE"};


// Facebook authentication
module.exports.FACEBOOK_APP_ID = '659580524163220';
module.exports.FACEBOOK_APP_SECRET = '3c2675e1e00c9944581a2059dfc9a093';
