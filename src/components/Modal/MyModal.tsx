import React, { FC } from 'react';
import cl from '../styles/MyModal.module.css';

type Props = {
  visible?: boolean;
  modalText?: string;
  setModalVisibility: () => void;
  children?: React.ReactNode;
  messageType?: string;
  style?: React.CSSProperties;
};

const MyModal: FC<Props> = ({
  setModalVisibility,
  visible,
  children,
  modalText,
  messageType = 'neutral',
  style,
}) => {
  return (
    <div
      style={style}
      onClick={() => {
        setModalVisibility();
      }}
    >
      {visible && (
        <div className={cl.background}>
          <div
            className={cl.container}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={cl.close} onClick={() => {
              setModalVisibility();
            }}>&#10006;</div>
            <h1 className={cl[messageType]}>{modalText}</h1>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyModal;
