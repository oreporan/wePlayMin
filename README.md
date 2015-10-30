

# WePlay API
### root path :  `/wePlay/v1`

# --Authenticate endpoint--
Authenticates users, signup, signin
This is the only endpoint that doesn't pass through the validation filter.

path : `<HOST URL>/wePlay/v1/auth/*`

##### path: '/signup'
*info*: signs up a user  
*method*: `POST`  
*accepts*: `JSON` - object compliant with the User model - `{name: <name>, email: <email> , password: <password>}`   
*returns*: `JSON` - a user object holding a new clientId  
*example*: <HOST URL>/wePlay/v1/auth/signup/

##### path: '/facebook'
*info*: signs up a user  
*method*: `POST`  
*accepts*: `JSON` -  `{access_token: <token>}`   
*returns*: `JSON` - a user object holding a new clientId  
*example*: <HOST URL>/wePlay/v1/auth/facebook/   

##### path : '/signin'
*info*: signs in an existing user   
*method* : `POST`   
*accepts*: `JSON` - `{email: <email>, password: <password}`   
*returns*: `JSON` - a user object   
*example*: <HOST URL>/wePlay/v1/auth/signin/

##### path : '/forgotpassword'
*info*: returns a user object holding the password, this is currently
under construction because we will in reality send an email not return the object   
*method* : `GET`   
*accepts*: `String` - email   
*returns*: `JSON` - a user object with the email   
*example*:<HOST URL>/wePlay/v1/auth/forgotpassword/ore@gmail.com

# --User endpoint--
All user related requests

path: `<HOST URL>/wePlay/v1/users/*`

##### path: '/getUser'
*info*: gets a user by id   
*method*: `GET`   
*accepts*: `String` - clientId   
*returns*: `JSON` - a user object   
*example*: <HOST URL>/wePlay/v1/users/getUser/43524261

##### path : '/getUserByName'
*info*: gets a user by his user name (not email!)   
*method*: `GET`   
*accepts*: `String` - userName   
*returns*: `JSON` - a user object   
*example*: <HOST URL>/wePlay/v1/users/getUserByName/Moshiko

##### path : '/updateUser'
*info*: updates a user's parameters   
*method*: `PUT`   
*accepts*: `JSON` - an object that holds parameters from the user object with updated values   
*returns*: `JSON` - a user object with the new values   
*example*: <HOST URL>/wePlay/v1/users/updateUser/

##### path : '/getUsersListById'
*info*: gets a list of user objects   
*method*: `POST`   
*accepts*: `JSON` - an array of clientIds `{users: ["1234", "5436"...]}`   
*returns*: `JSON` - an array of JSONs - user objects   
*example*: <HOST URL>/wePlay/v1/users/getUsersListById/

# -- League Endpoint --
All league related requests, a league is always created by a user, and
this user becomes the admin, a user can have multiple leagues, and these
leagues produce games

path: <HOST URL>/wePlay/v1/leagues/*

##### path : '/addLeague'
*info*: creates a new league and makes this user the admin   
*method*: `POST`   
*accepts*: `JSON` - object compliant with the League model - `{ name: <String - league name>, numOfPlayersPerTeam: <Number> , admin: <String - this client id>, frequency: <Int - for now, -1>, makeTeamsAtNum: <Int - number to make teams at>}`   
*returns*: `JSON` - an array of JSONs - user objects   
*example*: <HOST URL>/wePlay/v1/leagues/addLeague/

##### path : '/getLeague'
*info*: gets the league object by league Id   
*method*: `GET`   
*accepts*: `String` - leagueId   
*returns*: `JSON` - a league object   
*example*: <HOST URL>/wePlay/v1/leagues/getLeague/4524262

##### path : '/getLeagueByName'
*info*: gets the league object by league Id   
*method*: `GET`   
*accepts*: `String` - leagueId   
*returns*: `JSON` - a league object   
*example*: <HOST URL>/wePlay/v1/leagues/getLeagueByName/4524262

##### path : '/addUserToLeague'
*info*: pushes this user to a league, the client is taken from the header , the position parameter can be found in the Constants.js file   
*method*: `PUT`   
*accepts*: Query parameter - `String` - leagueId , Body parameter - `JSON` - `{isInvite : <boolean>, position:<String>}`    
*returns*: `JSON` - a league object   
*example*: <HOST URL>/wePlay/v1/leagues/addUserToLeague/4524262

##### path : '/removeUserFromLeague'
*info*: removes this user from a league, the client is taken from the header   
*method*: `GET`   
*accepts*: `String` - leagueId   
*returns*: `JSON` - a league object without the user in it   
*example*: <HOST URL>/wePlay/v1/leagues/removeUserFromLeague/4524262

##### path : '/getLeaguesListById'
*info*: gets a list of league objects   
*method*: `POST`   
*accepts*: `JSON` - an array of leagueIds  `{leagues: ["1234", "5436"...]}`  
*returns*: `JSON` - an array of JSONs - league objects   
*example*: <HOST URL>/wePlay/v1/leagues/getLeaguesListById/

##### path : '/updateLeague'
*info*: updates league parameters i.e name or frequency   
*method*: `PUT`   
*accepts*: `JSON` - an object with League model parameters i.e  `{ name: <new name>, frequency : <new frequency>}`   , the query parameter holds the relevant leagueId   
*returns*: `JSON` - league object with new parameters   
*example*: <HOST URL>/wePlay/v1/leagues/updateLeague/1312315

##### path : '/addAdmin'
*info*: Makes this client an admin in a league, can only be done by an admin   
*method*: `PUT`   
*accepts*: `JSON` - `{admin : <clientId>}`  , the query parameter holds the relevant leagueId   
*returns*: `JSON` - league object updated  
*example*: <HOST URL>/wePlay/v1/leagues/addAdmin/123554

# -- Game Endpoint - TODO --
All game related requests, a game is always part of a league, that is why a league must always have a league-id header appended
to every request.
*path* : <HOST URL>/wePlay/v1/games/



module.exports.PATH_GAME_ADDGAME = '/addGame';
module.exports.PATH_GAME_UPDATEGAME = '/updateGame';
module.exports.PATH_GAME_JOINGAME_WITH_GAMEID = '/joinGame';
module.exports.PATH_GAME_LEAVEGAME_WITH_GAMEID = '/leaveGame';
