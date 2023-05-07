import React, { FC } from 'react';
import cl from './styles/MyModal.module.css';

type Props = {
  visible?: boolean;
  modalText?: string;
  setModalVisibility: () => void;
  children?: React.ReactNode;
  messageType?: string;
};

const MyModal: FC<Props> = ({
  setModalVisibility,
  visible,
  children,
  modalText,
  messageType = 'neutral',
}) => {
  return (
    <div
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
            <h1 className={cl[messageType]}>{modalText}</h1>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyModal;
