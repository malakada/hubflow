var React = require('react');

var SearchBar = require('./searchBar');
var IssueList = require('./issueList');

var FilterableIssueList = React.createClass({
  getInitialState: function() {
    return {
      authToken: '',
      direction: 'desc',
      issues: [],
      repo: 'melissanoelle/hubflow',
      sort: 'created',
      state: 'open',
    };
  },
  componentDidMount: function() {
    OAuth.initialize('eVe8h6XL-bB0dAZ9eEZmHMbe-6Q');
    var self = this;
    OAuth.popup('github', {cache: true}).done(function(result) {
      self.setState({
        authToken: result.access_token,
      }, function() {
        self.updateIssues();
      });
    }).fail(function(data) {
      console.error('Failed github thing.', data);
      self.updateIssues();
    });
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
        direction: this.state.direction,
        sort: this.state.sort,
        state: this.state.state,
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
    var direction = 'desc';

    if (val === 'updated') {
      direction = 'asc';
    }

    this.setState({
      direction: direction,
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

module.exports = FilterableIssueList;
