var IssueTable = React.createClass({
  render: function() {
    var rows = [];
    var displayClosed = this.props.displayClosed;
    this.props.issues.forEach(function(issue) {
      rows.push(<IssueRow
        key={issue.id}
        authorUrl={issue.user.html_url}
        authorUserLogin={issue.user.login}
        avatarUrl={issue.user.avatar_url}
        body={issue.body}
        createdAt={issue.created_at}
        displayClosed={displayClosed}
        url={issue.html_url}
        labels={issue.labels}
        milestone={issue.milestone}
        number={issue.number}
        state={issue.state}
        title={issue.title} />);
    });
    return (
      <table>
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
    var classString = "issue " + state;
    var displayClosed = this.props.displayClosed;
    var display = state === "open" || displayClosed ? 'table-row' : 'none';
    var tagList = "";

    for (var i = 0; i < this.props.labels; i++) {
      var label = this.props.labels[i];
      tagList += "<span className='tag' style={{backgroundColor: #" + label.color + "}}>" + label.name + "</span>";
    }

    console.log(tagList);
    console.log(this.props.labels);

    return (
      <tr className={classString} style={{display: display }}>
        <td className="userInfo">
          <img src={this.props.avatarUrl} />
          <p>{this.props.authorUserLogin}</p>
          <div className="state panelThing">
            <h6>state:</h6>
            <p>{state}</p>
          </div>
        </td>
        <td>
          <h2>{this.props.title}</h2>
          <p className="issueBody">{this.props.body}</p>
        </td>
        <td>
          <div className="opened panelThing">
            <h6>opened:</h6>
            <p>{this.props.createdAt}</p>
          </div>
          <div className="tagged panelThing">
            <h6>tagged:</h6>
            <p>{tagList}</p>
          </div>
        </td>
      </tr>
    );
  },
});

var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      displayClosed: false,
      repo: 'andrewrk/groovebasin',
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
        <input type="text" value={this.state.repo} onChange={this.handleTextRepoChange} onBlur={this.handleTextRepoChange} />
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
      repo: 'andrewrk/groovebasin',
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
