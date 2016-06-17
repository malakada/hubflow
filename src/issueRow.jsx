var React = require('react');
var Showdown = require('showdown');

var IssueListTag = require('./issueListTag');

var IssueRow = React.createClass({
  render: function() {
    var converter = new Showdown.Converter();
    var dangerousHtml = converter.makeHtml(this.props.body.toString());

    var state = this.props.state;
    var classString = 'issue ' + state;
    var tagList = '';
    var tags = [];

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
            <p>{moment(this.props.createdAt).calendar()}</p>
            <h6>last updated:</h6>
            <p>{moment(this.props.updatedAt).calendar()}</p>
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

module.exports = IssueRow;
