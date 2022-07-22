import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ColourProvider from '../../utils/colourProvider/ColourProvider.js';
import Icon from '../icons/Icon';
import './generalModal.css';

const modalRatio = 0.7;

export default function GeneralModal(props) {
    const { colourProvider, isVisible, close, children: modalBody } = props;
    const { innerWidth: width, innerHeight: height } = window;
    const modalWidth = width * modalRatio;
    const modalHeight = height * modalRatio;

    const backgroundColor = colourProvider.getBackgroundColour();
    const color = colourProvider.getColor();
    const bodyStyle = {
        backgroundColor,
        height: modalHeight,
        color,
    };

    const { t } = useTranslation();

    // To optimize customizability remove everything but the body
    const modalRender = (node) => {
        const { children } = node.props;
        const [, , body] = children;
        return { ...node, props: { ...node.props, children: [body] } };
    };

    return (
        <Modal
            visible={isVisible}
            modalRender={modalRender}
            onCancel={close}
            bodyStyle={bodyStyle}
            width={modalWidth}
            destroyOnClose
        >
            <Icon
                className="modal-closer"
                icon="cross"
                colourProvider={colourProvider}
                alt={t('Close')}
                onClick={close}
            />
            {modalBody}
        </Modal>
    );
}

GeneralModal.propTypes = {
    colourProvider: PropTypes.instanceOf(ColourProvider).isRequired,
    isVisible: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
};

GeneralModal.defaultProps = {
    children: undefined,
};
