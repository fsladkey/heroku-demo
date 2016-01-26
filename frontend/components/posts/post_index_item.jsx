var React = require('react');

var PostIndexItem = React.createClass({
  render: function() {
    return (
      <li>
        {this.props.post.title}
        <img className="post-image" src={this.props.post.image_url} />
      </li>
    );
  }
});

module.exports = PostIndexItem;
