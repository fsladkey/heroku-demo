Login to heroku
https://toolbelt.heroku.com
(sudo port install heroku)

SSH Keys
rm ~/.ssh/id_*
heroku keys:add

Create App
dashboard.heroku.com
eroku apps:create mycapstoneprojectapp

Specify an App
heroku logs -a app-name



Adding Git Remote
git remote add heroku heroku-git-url-here



gems
rails_12factor



heroku buildpacks:set heroku/ruby (default)
heroku buildpacks:add --index 1 heroku/nodejs




package.json

"engines": {
 "node": "4.1.1",
 "npm": "2.1.x"
},
"scripts": {
 "postinstall": "./node_modules/.bin/webpack"
}



Push to Heroku

git push heroku master
heroku run bundle exec rake db:migrate
