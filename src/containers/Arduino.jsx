import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';
// import {STAGE_SIZE_MODES} from '../lib/layout-constants';
// import {setStageSize} from '../reducers/stage-size';
// import {setFullScreen} from '../reducers/mode';

import {connect} from 'react-redux';

import StageHeaderComponent from '../components/stage-header/stage-header.jsx';


class Arduino extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [

        ]);
    }

    render () {
        const {
            ...props
        } = this.props;
        return (
            <ArduinoPanel
                {...props}
            />
        );
    }
}

Arduino.propTypes = {
    // isFullScreen: PropTypes.bool,
    // isPlayerOnly: PropTypes.bool,
    // onSetStageUnFull: PropTypes.func.isRequired,
    // stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired
};



export default Arduino;
