import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import VM from '../../scratch-vm';
import exampleTags from '../lib/libraries/example/example-tags';
import exampleLibraryContent from '../lib/libraries/example/index.jsx';

import analytics from '../lib/analytics';
import LibraryComponent from '../components/library/library.jsx';

import {connect} from 'react-redux';

import {
    closeExampleLibrary
} from '../reducers/modals';


const messages = defineMessages({
    exampleLibraryTitle: {
        defaultMessage: 'LiZi',
        description: 'Heading for the help/how-tos library',
        id: 'gui.tipsLibrary.howtos'
    }
});

class ExampleLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
    }
    handleItemSelect (item,load) {
        const id = item.id;
        if(!item.disabled && id){
            console.log(id);
            console.log(load);
        }else {
           return  null;
        }
        analytics.event({
            category: 'library',
            action: 'Select Example',
            label: item.id
        });
    }
    render () {
        const exampleLibraryThumbnailData = Object.keys(exampleLibraryContent).map(id => ({
            rawURL: exampleLibraryContent[id].img,
            id: id,
            name: exampleLibraryContent[id].name,
            tags:exampleLibraryContent[id].tags,
            featured: true
        }));

        if (!this.props.visible) return null;
        return (
            <LibraryComponent
                data={exampleLibraryThumbnailData}
                filterable={true}
                tags={exampleTags}
                title={this.props.intl.formatMessage(messages.exampleLibraryTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ExampleLibrary.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool
};

const mapStateToProps = state => ({
    visible: state.scratchGui.modals.exampleLibrary
});

const mapDispatchToProps = dispatch => ({
    onRequestClose: () => dispatch(closeExampleLibrary())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ExampleLibrary));
