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
      repo: '',
    };
  },
  handleFilterClosedChange: function() {
    var newState = !this.state.displayClosed;
    this.setState({
      displayClosed: newState,
    });
    this.props.onUpdateDisplayClosed(newState);
  },
  handleTextRepoChange: function(ev) {
    var newRepo = ev.target.value;
    this.setState({
      repo: newRepo,
    });
    this.props.onUpdateRepo(newRepo);
  },
  render: function() {
    var handleChange = function() {}
    return (
      <form>
        <input type="text" value={this.state.repo} placeholder="Enter repo..." onChange={this.handleTextRepoChange} onBlur={this.handleTextRepoChange} />
        <p>
          <input type="checkbox" checked={this.state.displayClosed} onChange={this.handleFilterClosedChange.bind(this, 'displayClosed')} />
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
      displayClosed: false,
      issues: [],
      repo: '',
    };
  },
  componentDidMount: function() {
    this.updateIssues();
  },
  updateIssues: function() {
    $.get("https://api.github.com/repos/" + this.state.repo + "/issues?state=all", function(result) {
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
  onUpdateRepo: function(val) {
    this.setState({
      repo: val,
    });
    this.updateIssues();
  },
  render: function() {
    return (
      <div>
        <SearchBar onUpdateDisplayClosed={this.onUpdateDisplayClosed} onUpdateRepo={this.onUpdateRepo} />
        <IssueTable issues={this.state.issues} displayClosed={this.state.displayClosed} />
      </div>
    );
  },
});

React.render(
  <FilterableIssueTable />,
  document.getElementById('content')
);
