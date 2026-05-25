// src/features/productos/hooks/useProductoUI.js
import { useState, useCallback } from 'react';

export const useProductoUI = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, 
    payload: null 
  });

  const openModal = useCallback((type, payload = null) => {
    setModalState({ isOpen: true, type, payload });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return { modalState, openModal, closeModal };
};