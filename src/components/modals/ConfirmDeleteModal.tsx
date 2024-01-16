import React from 'react';

interface ModalProps {
    title: string;
    body: string;
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    onConfirm?: () => void;
}

const ConfirmDeleteModal: React.FC<ModalProps> = ({ title, body, isOpen, onClose, onConfirm, onSave }) => {
    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} tabIndex={-1} style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{body}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Нет
                        </button>
                        {onSave && (
                            <button type="button" className="btn btn-primary" onClick={onSave}>
                               Сохранить изменения
                            </button>
                        )}
                        {onConfirm && (
                            <button type="button" className="btn btn-primary" onClick={onConfirm}>
                                Да
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
