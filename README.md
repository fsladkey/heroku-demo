# Heroku deployment

## Summary
1. Install Heroku toolbelt
2. `heroku login`
3. `heroku keys:add`
  - `rm ~/.ssh/id_*` when on the office computers
4. `git remote add heroku heroku-git-url-here` OR `heroku git:remote -a heroku-app-name-here`
5. `gem 'rails_12factor'`
6. `heroku buildpacks:add --index 1 heroku/nodejs`
 `"engines": {
  "node": "4.1.1",
  "npm": "2.1.x"
},`
 `"scripts": {
  "postinstall": "./node_modules/.bin/webpack"
},`
9. `git push heroku master`
  - `heroku run bundle exec rake db:migrate`

## 1. Heroku toolbelt
First, if you haven't already, install the Heroku toolbelt onto your computer, which allows you to run Heroku commands from the terminal.
The easiest way is via [direct download file] [1]
[1]: https://toolbelt.heroku.com

## 2. Logging into Heroku
[Create an account][2] if you haven't already. Log in from the command line with `heroku login`.
[2]: https://heroku.com

## 3. SSH Keys
You need to make sure that the SSH keys on the computer you're using are in your account. If you're using a **public computer**, i.e. one of the computers in the office, you'll want to remove the existing keys because SSH keys may only be associated with one account, while an account can have multiple SSH keys. (SSH key `belongs_to :user`; User `has_many :ssh_keys`)

On the office computers, wipe out the current SSH keys with `rm ~/.ssh/id_*`. Then run `heroku keys:add`, which automatically generates a new key and uploads it to your account. You can see all of the SSH keys associated with your account on Heroku under [Account][3].
[3]: https://dashboard.heroku.com/account

If you're on your **personal computer**, you don't want to delete your keys because they're most likely connected to your Github, so all you'll need to do is `heroku keys:add` if you haven't already added your keys.

If you set this up on your personal machine you will only have to do it once (same as github).

## 4. Creating your Heroku app
On Heroku, click on the "+" in the top righthand corner to create a new app (alternatively, run 'heroku apps:create mycapstoneprojectapp'). After you've created the app, copy the Git URL (located under 'Settings') and paste it to the end of this command (in place of "your-heroku-git-url-here"):

```bash
git remote add heroku your-heroku-git-url-here
```

Look familier? You can name the remote whatever you want, but most people just use heroku.

This Heroku command also does the same thing with the name of your Heroku app:

```bash
heroku git:remote -a heroku-app-name-here
```

Don't worry too much about naming your app because you can always go back later and rename it in "Settings" on your app dashboard. However, if you do rename your app, you need to make sure to also change the url to the remote! (`git remote set-url heroku new-heroku-git-url-here`)

## 5. Serving assets
Remember to include the [rails_12factor gem][4] in your Gemfile under the production group!
[4]: https://github.com/heroku/rails_12factor

```ruby
group :production do
  gem 'rails_12factor'
end
```

By default, Rails will not may not serve your asset files because it assumes that you'll host them on a separate CDN (content delivery network, like [AWS][5]). Because we want Heroku to serve up our local javascript files and stylesheets, this gem will allow that to happen.

[5]: http://aws.amazon.com

`rails_12factor` also provides your production server logs with detailed errors you're used to getting in your development logs.

## 6. Configure Heroku to Use Both NPM and RubyGems (if Needed)

Heroku uses something called a [buildpack][heroku-buildpacks] to
compile your application once it gets pushed up to your Heroku remote.
Heroku can be used to host applications built on a variety of technologies;
it uses the presence of certain files in your directory to determine
which buildpack it needs to run. If it detects a Gemfile, it knows you
have a ruby app and will run `bundle install`. If you have a `package.json`
file, it knows you are running a node application and will run
`npm install` when compiling your application. The problem comes when
we have both -- it won't use more than one buildpack by default, meaning
either our gems won't be installed or our `node_modules` will be missing
and our files won't be bundled.

We can solve this problem by telling Heroku to use multiple buildpacks.
Heroku's instructions on this are [here][multi-bp-link]. Two main steps are
required:
  * Run `heroku buildpacks:set heroku/ruby`
  * Run `heroku buildpacks:add --index 1 heroku/nodejs`

In additon to setting the buildpacks, we need to specify node and npm versions
in our `package.json`. This is done under an `engines` key. The following
versions are known to work:

```js
"engines": {
  "node": "4.1.1",
  "npm": "2.1.x"
},
```

Heroku will now run `npm install` in addition to `bundle install` when we push
our application to the remote. Again, this is important because (assuming we are
following our [npm and git guidelines][npm-git-reading]) we won't have pushed up
our `node_modules` folder or `bundle.js` file to the remote.

Last, we still need to run `webpack` once on our production server in order to
generate our `bundle.js` file. We can do this by setting up a `postinstall` npm
script. In your `package.json`, change your `scripts` property to the
following:

```js
"scripts": {
  "postinstall": "./node_modules/.bin/webpack"
},
```

This will run automatically after `npm install` finishes.

**NB:** In order for this to work, you need to ensure you have both webpack and
all babel-related packages installed as regular dependencies, not dev
dependencies.

**NB 2:** Make sure you resolve any npm peer dependency issues before you push
to Heroku, or Heroku will complain and your build may fail.

[heroku-buildpacks]: https://devcenter.heroku.com/articles/buildpacks
[multi-bp-link]: https://devcenter.heroku.com/articles/using-multiple-buildpacks-for-an-app
[npm-git-reading]: https://github.com/appacademy/react-flux-curriculum/blob/master/w7d1/git_and_npm.md

The [Heroku docs][6] have many other helpful tips!
[6]: https://devcenter.heroku.com/


## 7. Pushing to Heroku
```bash
git push heroku master
```

Just like pushing to Github!

During the push, Heroku is creating the database (if it hasn't already been created) and bundle installing. Therefore, you never have to run those commands manually for Heroku.

If you have any new migrations (especially on your first time pushing to Heroku), you need to make sure you migrate: `heroku run rake db:migrate`. Every time you make a new migration locally, do not forget to migrate on the production side as well!

If you want to use your seed file in production, `heroku run rake db:seed`.

Other useful commands:
- `heroku run rails c`: Rails console in the production environment. Be careful making any changes here because they will apply to your live website!
- `heroku logs` / `heroku logs -t`: Your Heroku server logs, so you can see the activity on your site. If you have "rails_12factor" installed, you will also get error displays, which is super useful in figuring out what might be causing parts of your site to be down. `heroku logs` will just display the most recent activity, while `heroku logs -t` will show you live coverage, exactly as the rails server does on localhost.
- `heroku restart`: Restarts your Heroku server. If everything looks absolutely fine and you definitely migrated and everything, sometimes your server just needs a restart.
- `heroku pg:reset name_of_your_db`: Remove all data from your database. rake db:reset or rake db:drop won't work on Heroku because you don't have permission to drop and create databases. To find the name of your database, go to your app's page on your Heroku account, click on Heroku Postgres under Add-ons, and use the name after the :: following your app's name.

## 8. Get a Domain Name

**NOTE**: You don't have to do this right away, but you should take
care of it eventually so your app looks more legit.

We recommend [namecheap.com][namecheap] for registering domains. Go
Daddy is often a little cheaper, but historically has not worked out as
well for students.

[namecheap]: http://www.namecheap.com/


**Setting up a CNAME**

Canonical names make your hostname point to another. You want
www.mycoolurl.com to point to www.myuncoolurl.herokuapp.com.


*On namecheap.com:*

0. Log in.
0. Hover over "My account" and click "manage domains".
0. Click on your domain.
0. Click "All Host records" in the blue menu on the left.
0. In the "www" row
    * Enter the URL you want to point to under the "IP Address/URL"
      column.
      * This should be in the format `www.google.com.`; no `http://` or
        trailing slash. Namecheap will add the `.` at the end if you
        don't.
    * Select CNAME (Alias) under "Record Type".
0. Click "Save Changes".


*In your terminal*

0. Navigate to the directory that holds your project's repo.
0. Run "heroku domains:add www.mycoolurl.com".

More detailed instructions:
[namecheap setup][namecheap-tutorial]
[heroku setup][heroku-tutorial]

[heroku-tutorial]: https://devcenter.heroku.com/articles/custom-domains
[namecheap-tutorial]: http://www.namecheap.com/support/knowledgebase/article.aspx/1031/2/
