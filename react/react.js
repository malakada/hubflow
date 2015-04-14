var IssueTable = React.createClass({
  render: function() {
    var rows = [];
    var displayClosed = this.props.displayClosed;
    this.props.issues.forEach(function(issue) {
      rows.push(<IssueRow title={issue.title} body={issue.body} state={issue.state} displayClosed={displayClosed} />);
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
    var state = this.props.state;
    var displayClosed = this.props.displayClosed;
    console.log('displayClosed: ' + displayClosed);
    var display = state === "open" || displayClosed ? 'initial' : 'none';
    var classString = "issue " + state;
    return (
      <tr className={classString} style={{display: display }}>
        <td>{this.props.title}</td>
        <td>{this.props.body}</td>
      </tr>
    );
  },
});

var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      displayClosed: false,
    };
  },
  handleChange: function() {
    console.log(this.state);
    var newState = !this.state.displayClosed;
    this.setState({
      displayClosed: newState,
    });
    this.props.onUpdateDisplayClosed(newState);
  },
  render: function() {
    var handleChange = function() {}
    return (
      <form>
        <input type="text" placeholder="Search..." />
        <p>
          <input type="checkbox" checked={this.state.displayClosed} onChange={this.handleChange.bind(this, 'displayClosed')} />
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
      displayClosed: false,
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
  onUpdateDisplayClosed: function(val) {
    this.setState({
      displayClosed: val,
    });
  },
  render: function() {
    return (
      <div>
        <SearchBar onUpdateDisplayClosed={this.onUpdateDisplayClosed} />
        <IssueTable issues={this.state.issues} displayClosed={this.state.displayClosed} />
      </div>
    );
  },
});

React.render(
  <FilterableIssueTable source="https://api.github.com/repos/andrewrk/groovebasin/issues?state=all" />,
  document.getElementById('content')
);
