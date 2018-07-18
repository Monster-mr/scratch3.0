import React from 'react';
import PopupComponent from '../components/popup/popup.jsx';


class Popup extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        const {
            ...props
        } = this.props;
        return (
            <PopupComponent
                showPopup={this.props.showPopup}
                togglePopup={this.props.togglePopup}
                {...props}
            />
        );
    }

}

Popup.propTypes = {
    // visible: React.PropTypes.bool,
    // kb: React.PropTypes.instanceOf(KittenBlock)
};

export default Popup;
