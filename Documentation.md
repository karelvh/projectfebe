# Documentation

### to start the application locally run npm install in the the game directory. Then start a local instance of mongoDB (mongod in terminal)

## Backend 
uses express and passport for authentication, users are saved in a mongoDB database.

**todo: finish facebook integration (all buttons and logic is in place (and hopefully works), only api key is needed)**
## Frontend 
uses angular to render the pages after authentication and fetch scores from the database.

**Important: when coding the app keep in mind that the user might have a local account connected to a facebook account or only a local account or a facebook account. So make sure the user sees the right info. For example: when logged in with a local account and with a facebook account connected, the user should see his real name and not the username he/she chose for the local account. This can all be done with angular.**