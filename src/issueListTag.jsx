var React = require('react');

var IssueListTag = React.createClass({
  render: function() {
    var color = '#' + this.props.color;
    return (
      <span className="issueListTag" style={{ backgroundColor: color }}>
        {this.props.title}
      </span>
    )
  },
});

module.exports = IssueListTag;
