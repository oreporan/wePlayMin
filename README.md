[![Stories in Ready](https://badge.waffle.io/oreporan/wePlayMin.png?label=ready&title=Ready)](https://waffle.io/oreporan/wePlayMin)


# WePlay API
### root path :  `/wePlay/v1`
* * *
# --Authenticate endpoint--
Authenticates users, signup, signin
This is the only endpoint that doesn't pass through the validation filter.

path : `<HOST URL>/wePlay/v1/auth/*`
* * *
##### path: '/signup'
*info*: signs up a user  
*method*: `POST`  
*accepts*: `JSON` - object compliant with the User model - `{name: <name>, email: <email> , password: <password>}`   
*returns*: `JSON` - a user object holding a new clientId  
*example*: <HOST URL>/wePlay/v1/auth/signup/
* * *
##### path: '/facebook'
*info*: signs up a user using a facebook oauth token
*method*: `POST`  
*accepts*: `JSON` -  `{access_token: <token>}`   
*returns*: `JSON` - `{'client_id' : clientId}`  
*example*: <HOST URL>/wePlay/v1/auth/facebook/   
* * *
##### path: '/google'
*info*: signs up a user using a google oauth token  
*method*: `POST`  
*accepts*: `JSON` -  `{access_token: <token>}`   
*returns*: `JSON` - `{'client_id' : clientId}`  
*example*: <HOST URL>/wePlay/v1/auth/google/   
* * *
##### path : '/signin'
*info*: signs in an existing user   
*method* : `POST`   
*accepts*: `JSON` - `{email: <email>, password: <password}`   
*returns*: `JSON` - a user object   
*example*: <HOST URL>/wePlay/v1/auth/signin/
* * *
##### path : '/forgotpassword'
*info*: returns a user object holding the password, this is currently
under construction because we will in reality send an email not return the object   
*method* : `GET`   
*accepts*: `String` - email   
*returns*: `JSON` - a user object with the email   
*example*:<HOST URL>/wePlay/v1/auth/forgotpassword/ore@gmail.com
* * *
# --User endpoint--
All user related requests

path: `<HOST URL>/wePlay/v1/users/*`
* * *
##### path: '/getUser/{clientId}'
*info*: gets a user by id   
*method*: `GET`   
*accepts*: `String` - clientId   
*returns*: `JSON` - a user object   
*example*: <HOST URL>/wePlay/v1/users/getUser/43524261
* * *
##### path : '/getUserByName/{name}'
*info*: gets a user by his user name (not email!)   
*method*: `GET`   
*accepts*: `String` - userName   
*returns*: `JSON` - a user object   
*example*: <HOST URL>/wePlay/v1/users/getUserByName/Moshiko
* * *
##### path : '/updateUser'
*info*: updates a user's parameters   
*method*: `PUT`   
*accepts*: `JSON` - an object that holds parameters from the user object with updated values   
*returns*: `JSON` - a user object with the new values   
*example*: <HOST URL>/wePlay/v1/users/updateUser/
* * *
##### path : '/getUsersListById'
*info*: gets a list of user objects   
*method*: `POST`   
*accepts*: `JSON` - an array of clientIds `{users: ["1234", "5436"...]}`   
*returns*: `JSON` - an array of JSONs - user objects   
*example*: <HOST URL>/wePlay/v1/users/getUsersListById/
* * *
##### path : '/getUsersByKeyword/{keyword}'
*info*: gets all the user objects that contain this word, including E-mail and user name, for example calling this method with the keyword : 'over' will find the user 'over' , 'overflow' and the user 'stack overflow'    
*method*: `GET`   
*accepts*: `String` - user name keyword, email or username   
*returns*: `JSON` - `{users : <an array of userObject JSONs>}`      
*example*: <HOST URL>/wePlay/v1/users/getUsersByKeyword/myUs



* * *
# -- League Endpoint --
All league related requests, a league is always created by a user, and
this user becomes the admin, a user can have multiple leagues, and these
leagues produce games

path: <HOST URL>/wePlay/v1/leagues/*
* * *
##### path : '/addLeague'
*info*: creates a new league and makes this user the admin   
*method*: `POST`   
*accepts*: `JSON` - object compliant with the League model - `{ name: <String - league name>, numOfPlayersPerTeam: <Number> , admin: <String - this client id>, weekDay: <Int, 0-6>, gameTime: <String in the form of HH:MM>, makeTeamsAtNum: <Int - number to make teams at>}`   
*returns*: `JSON` - an array of JSONs - user objects   
*example*: <HOST URL>/wePlay/v1/leagues/addLeague/
* * *
##### path : '/getLeague/{leagueId}'
*info*: gets the league object by league Id   
*method*: `GET`   
*accepts*: `String` - leagueId   
*returns*: `JSON` - a league object   
*example*: <HOST URL>/wePlay/v1/leagues/getLeague/4524262
* * *
##### path : '/getLeagueByName/{leagueId}'
*info*: gets the league object by league Id   
*method*: `GET`   
*accepts*: `String` - leagueId   
*returns*: `JSON` - a league object   
*example*: <HOST URL>/wePlay/v1/leagues/getLeagueByName/4524262
* * *
##### path : '/getLeagueByKeyword/{keyword}'
*info*: gets all the leagues objects that contain this word, for example calling this method with the keyword : 'over' will find the league 'over' , 'overflow' and the league 'stack overflow'    
*method*: `GET`   
*accepts*: `String` - league name keyword   
*returns*: `JSON` - `{leagues : <an array of leagueObject JSONs>}`      
*example*: <HOST URL>/wePlay/v1/leagues/getLeagueByKeyword/mylea

* * *
##### path : '/addUserToLeague/{leagueId}'
*info*: pushes this user to a league, the client is taken from the header    
*method*: `PUT`   
*accepts*: Query parameter - `String` - leagueId , Body parameter - `JSON` - `{isInvite : <boolean>}`    
*returns*: `JSON` - a league object   
*example*: <HOST URL>/wePlay/v1/leagues/addUserToLeague/4524262
* * *
##### path : '/removeUserFromLeague/{leagueId}'
*info*: removes this user from a league, the client is taken from the header   
*method*: `GET`   
*accepts*: `String` - leagueId   
*returns*: `JSON` - a league object without the user in it   
*example*: <HOST URL>/wePlay/v1/leagues/removeUserFromLeague/4524262
* * *
##### path : '/getLeaguesListById'
*info*: gets a list of league objects   
*method*: `POST`   
*accepts*: `JSON` - an array of leagueIds  `{leagues: ["1234", "5436"...]}`  
*returns*: `JSON` - an array of JSONs - league objects   
*example*: <HOST URL>/wePlay/v1/leagues/getLeaguesListById/
* * *
##### path : '/updateLeague/{leagueId}'
*info*: updates league parameters i.e name or frequency   
*method*: `PUT`   
*accepts*: `JSON` - an object with League model parameters i.e  `{ name: <new name>, frequency : <new frequency>}`   , the query parameter holds the relevant leagueId   
*returns*: `JSON` - league object with new parameters   
*example*: <HOST URL>/wePlay/v1/leagues/updateLeague/1312315
* * *
##### path : '/addAdmin/{leagueId}'
*info*: Makes this client an admin in a league, can only be done by an admin   
*method*: `PUT`   
*accepts*: `JSON` - `{admin : <clientId>}`  , the query parameter holds the relevant leagueId   
*returns*: `JSON` - league object updated  
*example*: <HOST URL>/wePlay/v1/leagues/addAdmin/123554
* * *
# -- Game Endpoint --
All game related requests, a game is always part of a league, that is why a league must always have a league-id header appended
to every request. The only time you don't need a leagueID is calling the '/getGame/{gameId}' method    
*path* : <HOST URL>/wePlay/v1/games/*  
*required header* : `client-id`    

* * *
##### path : '/addGame'
*info*: creates a new game   
*method*: `POST`   
*accepts*: `JSON` - `{matchDay : <date object>}`  , a date object in Date() format   
*returns*: `JSON` - game object   
*example*: <HOST URL>/wePlay/v1/leagues/addGame    
* * *
##### path : '/toggleAttending/{gameId}/{attending}'
*info*: changes the attending status for this user between -1 (not attending), 0 (undecided) and 1 (attending)       
*method*: `GET`   
*accepts*: `String/String` - GameId to toggle attending for, followed by '/', followed by attending status (-1,0,1)      
*returns*: `JSON` - The updated [GameUserObject](#gameuserobject) **(see below)**     
*example*: <HOST URL>/wePlay/v1/leagues/toggleAttending/1234/1      
* * *
##### path : '/getGame/{gameId}'
*info*: gets the game object           
*method*: `GET`   
*accepts*: `String` - gameId      
*returns*: `JSON` - The game object       
*example*: <HOST URL>/wePlay/v1/leagues/getGame/1234         
* * *
##### path : '/getGamesListById/'
*info*: returns a list of game objects       
*method*: `POST`   
*accepts*: `JSON` - a JSON with an array value in the format `{games : <array of gameIds>}`      
*returns*: `JSON` - A JSON with an array value in the format `{games : <array of game objects>}`       
*example*: <HOST URL>/wePlay/v1/leagues/getGamesListById/     

* * *

# -- Notifications Endpoint --
Endpoint for reading and marking notifications, each user has a notifications array in his user object, this array is
an array of notification id's which can be gotten via this endpoint
*path* : <HOST URL>/wePlay/v1/notifications/*  
*required header* : `client-id`   
* * *

##### path : '/getNotifications/'
*info*: returns a list of notification objects, a notification object schema:
`sender : {type : String},
receiver : {type : String},
message : {type : String},
read: {type : Boolean, default : false},
dateCreated: { type: Date}`   

*method*: `POST`   
*accepts*: `JSON` - a JSON with an array value in the format `{notifications : <array of notification IDs>}`      
*returns*: `JSON` - A JSON with an array value in the format `{notifications : <array of game objects>}`       
*example*: <HOST URL>/wePlay/v1/notifications/getNotifications/  
* * *

##### path : '/markAsRead/{notificationId}'
*info*: Marks this notification as "read" in the server, so that the next time this user logs in, all his old notifications
are ordered. It is recommended to mark every notification as read.           
*method*: `GET`   
*accepts*: `String` - notificationId      
*returns*: `Boolean` - The success field is the only interesting field in this return value       
*example*: <HOST URL>/wePlay/v1/notifications/markAsRead/1234

* * *
# GameUserObject
*info*: A GameUserObject is a JSON object that has details about a user, that are relevant only to a game, since we are not interested in the user's activeGames, leagues etc. In addition, more fields are added.     
-`team` field (0,1,2...), the current team the player is in    
-`form` field ([-1,0,0,0,1,1,-1]), the attending form in the last X games     
-`attending` field (true/false), the current attending status    
-`isInvite` field (true/false) if the player is a bench player or not   
```{_id : <id>, form : [], isInvite : <bool>,  date: <Date()>, team : <int>, attending : <int>}```    
