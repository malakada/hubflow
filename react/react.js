var IssueTable = React.createClass({
  render: function() {
    var rows = [];
    this.props.issues.forEach(function(issue) {
      rows.push(<IssueRow title={issue.title} body={issue.body} />);
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  },
});

var IssueRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td>{this.props.body}</td>
      </tr>
    );
  },
});

var SearchBar = React.createClass({
  render: function() {
    return (
      <form>
        <input type="text" placeholder="Search..." />
        <p>
          <input type="checkbox" />
          {' '}
          Show issues marked as closed too.
        </p>
      </form>
    );
  },
});

var FilterableIssueTable = React.createClass({
  getInitialState: function() {
    return {
      issues: [],
    };
  },
  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      if (this.isMounted()) {
        this.setState({
          issues: result,
        });
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <SearchBar />
        <IssueTable issues={this.state.issues} />
      </div>
    );
  },
});

React.render(
  <FilterableIssueTable source="https://api.github.com/repos/andrewrk/groovebasin/issues" />,
  document.getElementById('content')
);
