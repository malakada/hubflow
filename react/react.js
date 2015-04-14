var Issue = React.createClass({
  getInitialState: function() {
    return {
      title: '',
      body: '',
    };
  },
  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var lastIssue = result[0];
      if (this.isMounted()) {
        this.setState({
          title: lastIssue.title,
          body: lastIssue.body,
        });
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        {this.state.title} - {this.state.body}
      </div>
    );
  }
});

React.render(
  <Issue source="https://api.github.com/repos/andrewrk/groovebasin/issues" />,
  document.getElementById('content')
);
