var React = require('react');

var PostsIndex = React.createClass({
  getInitialState: function() {
    return { posts: PostsStore.all() };
  },

  componentDidMount: function() {
    this.listener = PostsStore.addListener(this._onChange);
    PostsApiUtil.fetchPosts();
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  render: function() {
    return (
      <div>
        <PostForm />
        <h1 className="title">Posts</h1>
        <ul className="posts-index">
          {
            this.state.posts.map(function(post) {
              return <PostIndexItem key={post.id} post={post} />;
            })
          }
        </ul>
      </div>
    );
  },

  _onChange: function() {
    this.setState({ posts: PostsStore.all() });
  }
});

module.exports = PostsIndex;
