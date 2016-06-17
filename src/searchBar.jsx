var React = require('react');

var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      repo: 'melissanoelle/hubflow',
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
  },
  handleTextRepoChangeAndSubmit: function(ev) {
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
        <div className="title">
          <a className="incognito" href="https://github.com/melissanoelle/hubflow"><h1>Hubflow</h1></a>
          <a href="https://github.com/melissanoelle/hubflow"><h6>this is on github</h6></a>
        </div>
        <div className="top">
          <input type="text" value={this.state.repo} onChange={this.handleTextRepoChange} onBlur={this.handleTextRepoChangeAndSubmit} placeholder="melissanoelle/hubflow" />
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

module.exports = SearchBar;
