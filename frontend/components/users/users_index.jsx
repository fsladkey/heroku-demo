var React = require('react');
var UsersStore = require('../../stores/users_store');
var UsersApiUtil = require('../../util/users_api_util');

var UsersIndex = React.createClass({
  getInitialState: function() {
    return { users: UsersStore.all() };
  },

  componentDidMount: function() {
    this.listener = UsersStore.addListener(this._onChange);
    UsersApiUtil.fetchUsers();
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  render: function() {
    var users = this.state.users.map(function (user) {
      return (
        <li key={ user.id }>
          <a href={ "#/users/" + user.id }>
            { user.email }
          </a>
        </li>
      );
    });

    return (
      <div>
        <h1 className="title">Users</h1>

        <ul className="users-index">{ users }</ul>
      </div>
    );
  },

  _onChange: function() {
    this.setState({ users: UsersStore.all() });
  }
});

module.exports = UsersIndex;
