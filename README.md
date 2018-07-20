- crea app in fb
-  ngRok for test local application https://dashboard.ngrok.com/get-started#


- DEPLOY APP WITH heroku
-  install brew install heroku/brew/heroku 
-   heroku login
-  heroku create messenger-webhook-connect
-  git push heroku master
- create Procfile  // inside   web: node index.js

-  heroku ps:scale web=1


Try to re-add the remote url if have herror

// Check for the current url 
git remote -v

// remove remote url
git remote rm heroku

// re-add the remote url
git remote add heroku git@heroku.com:name.git


// setup   package.json
 "engines": {
    "node": "8.11.1"
  },
  "dependencies": {
    "ejs": "^2.5.6",
    "express": "^4.15.2"
  },


LOG heroku:
heroku logs --tail


npm install cool-ascii-faces //    propagate a local change to the application through to Heroku
