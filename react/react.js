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

var IssueRow = React.createClass({
  render: function() {
    var converter = new Showdown.converter();
    var dangerousHtml = converter.makeHtml(this.props.body.toString());

    var state = this.props.state;
    var classString = 'issue ' + state;
    var tagList = '';
    var tags = [];

    // TODO: checkout map
    this.props.labels.forEach(function(tag) {
      tags.push(<IssueListTag
        color={tag.color}
        title={tag.name} />);
    });

    return (
      <div className={classString} style={{ display: state }}>
        <div className="issueRowAuthorStatus">
          <img src={this.props.avatarUrl} />
          <h3>{this.props.authorUserLogin}</h3>
          <div className={"state panelThing " + state}>
            <h6>state:</h6>
            <p>{state}</p>
          </div>
        </div>
        <div className="issueRowBody">
          <h2>{this.props.title}</h2>
          <div className="issueBody">
            <span dangerouslySetInnerHTML={{ __html: dangerousHtml }} />
          </div>
        </div>
        <div className="issueRowTags">
          <div className="opened panelThing">
            <h6>opened:</h6>
            <p>{new Date(this.props.createdAt).toString()}</p>
            <h6>last updated:</h6>
            <p>{new Date(this.props.updatedAt).toString()}</p>
          </div>
          <div className="tagged panelThing">
            <h6>tagged:</h6>
            <p>{tags}</p>
          </div>
        </div>
      </div>
    );
  },
});

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

var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      repo: 'andrewrk/groovebasin',
      state: 'open',
      sort: 'created',
    };
  },
  handleFilterClosedChange: function() {
    var newState = 'open';

    if (this.state.state === 'open') {
      newState = 'all';
    }

    this.setState({
      state: newState,
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
  toggleSortInactivity: function(ev) {
    var newSort = 'created';
    if (this.state.sort === 'created') {
      newSort = 'updated';
    }
    this.setState({
      sort: newSort,
    });
    this.props.onUpdateSort(newSort);
  },
  render: function() {
    var handleChange = function() {};
    var inactivityButtonClass = 'off';

    if (this.state.sort === 'updated') {
      inactivityButtonClass = 'on';
    }

    return (
      <div className="header-thing">
        <h1>Hubflow</h1>
          <div className="top">
            <input type="text" value={this.state.repo} onChange={this.handleTextRepoChange} onBlur={this.handleTextRepoChange} placeholder="melissanoelle/hubflow" />
            <p className="checkbox-label">
              <input type="checkbox" checked={this.state.state === 'all' ? true : false} onChange={this.handleFilterClosedChange.bind(this, 'state')} />
              {' '}
              Show issues marked as closed too.
            </p>
            <div className="clearfix"></div>
          </div>
          <div className="bottom">
            <p>Filter by:</p>
            <button className={inactivityButtonClass} onClick={this.toggleSortInactivity}>Inactivity</button>
          </div>
        <div className="clearfix"></div>
      </div>
    );
  },
});

/* HERE is the code to get a github auth token:

//call this once per page
OAuth.initialize('eVe8h6XL-bB0dAZ9eEZmHMbe-6Q');

//call this to auth the user
OAuth.popup('github').done(function(result) {
  console.log(result.access_token)
});

*/

var FilterableIssueList = React.createClass({
  getInitialState: function() {
    return {
      authToken: '',
      issues: [],
      repo: 'andrewrk/groovebasin',
      sort: 'created',
      state: 'open',
    };
  },
  componentDidMount: function() {
    OAuth.initialize('eVe8h6XL-bB0dAZ9eEZmHMbe-6Q');
    this.updateIssues();
  },
  updateIssues: function() {
    var headers = null;

    if (this.state.authToken !== null && this.state.authToken.length > 0) {
      headers = {
        "Authorization": "token " + this.state.authToken,
      };
    }

    $.ajax({
      url: 'https://api.github.com/repos/' + this.state.repo + '/issues',
      headers: headers,
      data: {
        state: this.state.state,
        sort: this.state.sort,
      },
      success: function(result) {
        if (this.isMounted()) {
          this.setState({
            issues: result,
          });
        }
      }.bind(this),
    });
  },
  onUpdateDisplayClosed: function(val) {
    this.setState({
      state: val,
    }, function() {
      this.updateIssues();
    });
  },
  onUpdateRepo: function(val) {
    this.setState({
      repo: val,
    }, function() {
      this.updateIssues();
    });
  },
  onUpdateSort: function(val) {
    this.setState({
      sort: val,
    }, function() {
      this.updateIssues();
    });
  },
  render: function() {
    return (
      <div>
        <SearchBar onUpdateDisplayClosed={this.onUpdateDisplayClosed} onUpdateRepo={this.onUpdateRepo} onUpdateSort={this.onUpdateSort} />
        <IssueList issues={this.state.issues} />
      </div>
    );
  },
});

React.render(
  <FilterableIssueList />,
  document.getElementById('content')
);
