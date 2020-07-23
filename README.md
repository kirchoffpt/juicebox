# Juicebox Audio Player
Multi-user music player made with ASP.NET Core and React. Also uses PostgreSQL database (previously used MySQL). [Hosted on Heroku](http://jboxaudio.herokuapp.com) using Docker. Made as an example full stack project. This started as a group project but very quickly became a solo one.
### :)

Join/Create a room and upload/listen to mp3s.
Click on users to see who is listening to what in real time.

![Dark mode only!](https://i.imgur.com/1Zo2pE3.png)

## TODO
- Sync to other user option
- User Login
- Additional music sources (although spotify/youtube/etc isnt exactly legal)
- Other stuff

### Current Issues/Limitations
 - When heroku dyno does its daily reset it doesn't gracefully close all signalR connections leaving users in database that aren't actually connected. This will be fixed.
 - For the purposes of the demo and to keep this project free of cost, uploaded files are not currently uploaded to a database but rather the heroku server's file path. They get wiped when the dyno resets. 

### Build
Build should be pretty straight forward with vscode or visual studio but the DATABASE_URL environment variable will need to be set (most easily done in generated launch.json) with a postgresql URI. 


