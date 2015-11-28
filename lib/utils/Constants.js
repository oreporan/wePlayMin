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
module.exports.LEAGUE_POSITION_GK = {name : "GK", status : 0};
module.exports.LEAGUE_POSITION_CB = {name : "CB", status : 1};
module.exports.LEAGUE_POSITION_RB = {name : "RB", status : 2};
module.exports.LEAGUE_POSITION_LB = {name : "LB", status : 3};
module.exports.LEAGUE_POSITION_CM = {name : "CM", status : 4};
module.exports.LEAGUE_POSITION_LM = {name : "LM", status : 5};
module.exports.LEAGUE_POSITION_RM = {name : "RM", status : 6};
module.exports.LEAGUE_POSITION_CF = {name : "CF", status : 7};
module.exports.LEAGUE_POSITION_RF = {name : "RF", status : 8};
module.exports.LEAGUE_POSITION_LF = {name : "LF", status : 9};
module.exports.LEAGUE_ALL_POSITION_NAMES = ["GK", "CB", "RB", "LB", "CM", "LM", "RM", "CF", "RF", "LF"];

// Authentication Methods
module.exports.AUTHENTICATION_METHOD_FACEBOOK = 0;
module.exports.AUTHENTICATION_METHOD_CUSTOM = 1;

// Attending games
module.exports.GAME_ATTENDING_NO = {status: -1, name: "NO"};
module.exports.GAME_ATTENDING_YES = {status: 1, name: "YES"};
module.exports.GAME_ATTENDING_UNDECIDED = {status: 0, name: "UNDECIDED"};


// Facebook authentication
module.exports.FACEBOOK_APP_ID = '659580524163220';
module.exports.FACEBOOK_APP_SECRET = '3c2675e1e00c9944581a2059dfc9a093';
