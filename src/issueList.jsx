var React = require('react');

var IssueRow = require('./issueRow');

var IssueList = React.createClass({
  render: function() {
    var rows = [];

    this.props.issues.forEach(function(issue) {
      rows.push(<IssueRow
        key={issue.id}
        authorUrl={issue.user.html_url}
        authorUserLogin={issue.user.login}
        avatarUrl={issue.user.avatar_url}
        body={issue.body}
        createdAt={issue.created_at}
        updatedAt={issue.updated_at}
        url={issue.html_url}
        labels={issue.labels}
        milestone={issue.milestone}
        number={issue.number}
        state={issue.state}
        title={issue.title} />);
    });

    return (
      <div className="issues">
        {rows}
      </div>
    );
  },
});

module.exports = IssueList;
