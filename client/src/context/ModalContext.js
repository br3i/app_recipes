import React, { createContext, useState, useContext } from 'react';
import Modal from 'react-modal';
import '../utils/ModalContext.css'; // Importa el archivo CSS

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (content, timeout = null) => {
    setModalContent(content);
    setIsModalOpen(true);

    if (timeout) {
      setTimeout(() => {
        setModalContent(null);
        setIsModalOpen(false);
      }, timeout);
    }
  };

  const hideModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, modalContent, showModal, hideModal }}>
      {children}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={hideModal}
        contentLabel="Global Modal"
        ariaHideApp={false}
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <button className="close-button" onClick={hideModal}>&times;</button>
        <div className="modal-content">
          {modalContent}
        </div>
      </Modal>
    </ModalContext.Provider>
  );
};