//一个点击新建项目的弹出框

const React = require('react');

import NodemailerCom from '../components/nodemailer/nodemailer.jsx';

class NodemailerCon extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        const {
            ...props
        } = this.props;
        return (
            <NodemailerCom
                nodeMailer={this.props.nodeMailer}
                showNodemail={this.props.showNodemail}
                {...props}
            />
        );
    }

}

NodemailerCon.propTypes = {
    // visible: React.PropTypes.bool,
    // kb: React.PropTypes.instanceOf(KittenBlock)
};

export default NodemailerCon;
