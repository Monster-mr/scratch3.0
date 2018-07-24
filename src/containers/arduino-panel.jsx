import bindAll from 'lodash.bindall';
import React from 'react';
import ArduinoPanelComponent from '../components/arduino-panel/arduino-panel.jsx';


class ArduinoPanel extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        const {
            ...props
        } = this.props;
        return (
            <ArduinoPanelComponent
                visible={this.props.visible}
                code={this.props.code}
                {...props}
            />
        );
    }

}

ArduinoPanel.propTypes = {
    // visible: React.PropTypes.bool,
    // kb: React.PropTypes.instanceOf(KittenBlock)
};

export default ArduinoPanel;



