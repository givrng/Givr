import { useCallback, useState, type ReactNode } from "react";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const useGenericModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [customOnClose, setCustomOnClose] = useState<(() => void) | null>(null);
  
  const ModalWrapper: React.FC<GenericModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full flex sm:max-w-5xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {children}
      </div>
    </div>
  );
};
  /**
   * Opens the modal with provided children and an optional custom close callback.
   * @param children - The React components to display inside the modal.
   * @param onCloseCallback - Optional logic to run when the modal is closed.
   */
  const openModal = useCallback((children: ReactNode, onCloseCallback?: () => void) => {
    setContent(children);
    setCustomOnClose(() => onCloseCallback || null);
    
    setIsOpen(true);
  }, []);

  /**
   * Closes the modal and triggers any custom logic provided during openModal.
   */
  const closeModal = useCallback(() => {
    
    setIsOpen(false);
    if (customOnClose) {
      customOnClose();
    }
    // Clean up content after closing animation if desired
    setTimeout(() => setContent(null), 300);
  }, [customOnClose]);

  const ModalComponent = () => (
    <ModalWrapper isOpen={isOpen} onClose={closeModal}>
      {content}
    </ModalWrapper>
  );

  return { openModal, ModalComponent };
};
