var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/app_dispatcher');
var PostConstants = require('../constants/post_constants');


var _posts = [];

var _addPost = function (newPost) {
  _posts.unshift(newPost);
};

var PostsStore = new Store(AppDispatcher);

PostsStore.all = function () {
  return _posts.slice();
};

PostsStore.__onDispatch = function (payload) {
  switch (payload.actionType) {

    case PostConstants.RECEIVE_POSTS:
      _posts = payload.posts
      PostsStore.emit(CHANGE_EVENT);
      break;

    case PostConstants.RECEIVE_POST:
      _addPost(payload.post);
      PostsStore.emit(CHANGE_EVENT);
      break;
  }
};

PostStore.findPostById = function (id) {
  for (var i = 0; i < _posts.length; i++) {
    if (_posts[i].id === id) {
      return _posts[i];
    }
  }

  return;
};

module.exports = PostsStore;
