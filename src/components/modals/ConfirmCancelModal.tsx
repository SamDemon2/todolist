import React from 'react';

//интерфейс модального окна
interface ConfirmCancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmCancel: () => void;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({ isOpen, onClose, onConfirmCancel }) => {
    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} tabIndex={-1} style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Подтверждение отмены редактирования</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Вы уверены, что хотите отменить редактирование?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onConfirmCancel}>
                            Да, отменить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCancelModal;
