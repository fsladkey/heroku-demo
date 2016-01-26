var React =require('react');
var ReactDOM =require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var App = require('./components/app');
var UsersIndex = require('./components/users/users_index');
var UserShow = require('./components/users/user_show');
var PostsIndex = require('./components/posts/posts_index');

var router = (
  <Router>
    <Route path="/" component={ App }>
      <IndexRoute component={ UsersIndex } />
      <Route path="users" component={ UsersIndex } />
      <Route path="users/:id" component={ UserShow } />
      <Route path="posts" component={ PostsIndex } />
    </Route>

    <UsersIndex />
  </Router>
);

window.init = function () {
  ReactDOM.render(router, document.getElementById('content'));
};
