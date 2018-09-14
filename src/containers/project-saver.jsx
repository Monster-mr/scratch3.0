import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import storage from '../lib/storage';

/**
 * Project saver component passes a saveProject function to its child.
 * It expects this child to be a function with the signature
 *     function (saveProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <ProjectSaver>{(saveProject, props) => (
 *     <MyCoolComponent
 *         onClick={saveProject}
 *         {...props}
 *     />
 * )}</ProjectSaver>
 */
class ProjectSaver extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'saveProject',
            'doStoreProject',
            'createProject',
            'updateProject'
        ]);
    }
    saveProject () {
        const saveLink = document.createElement('a'); //创建
        document.body.appendChild(saveLink);//把‘a’放在body的子节点最后，让saveLink成为body的子节点

        this.props.saveProjectSb3().then(content => {
            // TODO user-friendly project name
            // File name: project-DATE-TIME
            //const date = new Date();
            //const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
            const filename = `${this.props.getInputValue}.sb3`;

            // Use special ms version if available to get it working on Edge.
            if (navigator.msSaveOrOpenBlob) {    //将数据生成文件，content就是Blob对象，filename为保存的文件名
                navigator.msSaveOrOpenBlob(content, filename);
                return;
            }

            const url = window.URL.createObjectURL(content); //创建一个url,本地预览图片
            saveLink.href = url;
            saveLink.download = filename;  //规定下载的名称
            saveLink.click();
            window.URL.revokeObjectURL(url);//释放上一步加载的url,让指针不指向它
            document.body.removeChild(saveLink); //删除saveLink这个变量(元素)
        });
    }
    doStoreProject (id) {
        return this.props.saveProjectSb3()
            .then(content => {
                const assetType = storage.AssetType.Project;
                const dataFormat = storage.DataFormat.sb3;
                const body = new FormData();
                body.append('sb3_file', content, 'sb3_file');
                return storage.store(
                    assetType,
                    dataFormat,
                    body,
                    id
                );
            });
    }
    createProject () {
        return this.doStoreProject();
    }
    updateProject () {
        return this.doStoreProject(this.props.projectId);
    }
    render () {
        const {
            children
        } = this.props;
        return children(
            this.saveProject, //保存
            this.updateProject,
            this.createProject
        );
    }
}

ProjectSaver.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func
    })
};

const mapStateToProps = state => ({
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    vm: state.scratchGui.vm
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectSaver);
