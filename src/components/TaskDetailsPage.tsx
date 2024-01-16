import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import ConfirmCancelModal from "./modals/ConfirmCancelModal";

interface SubTask {
    id: string;
    title: string;
    isCompleted?: boolean;
}

interface Task {
    id: string;
    title: string;
    subtasks?: SubTask[];
    isCompleted?: boolean;
}


const TaskDetailsPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [editedTask, setEditedTask] = useState<Partial<Task> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newSubtask, setNewSubtask] = useState<string>('');
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
    const [editedSubtaskText, setEditedSubtaskText] = useState<string>('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const navigate = useNavigate();


    // Загрузка задачи из localStorage при монтировании компонента
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks) as Task[];
            const selectedTask = parsedTasks.find((t) => t.id === taskId);
            setTask(selectedTask || null);
            setEditedTask(selectedTask ? { ...selectedTask } : null);
        }
    }, [taskId]);


    // Функция для отмены последнего изменения
    const handleUndoChanges = () => {

    };
    // Функция для повтора отмененного изменения

    const handleRedoChanges = () => {

    };

    // Функция для сохранения изменений
    const handleSaveChanges = () => {
        if (editedTask) {
            setTask((prevTask) => {
                if (prevTask) {
                    const updatedTask: Task = { ...prevTask, ...editedTask };
                    const storedTasks = localStorage.getItem('tasks');
                    if (storedTasks) {
                        const parsedTasks = JSON.parse(storedTasks) as Task[];
                        const updatedTasks = parsedTasks.map((t) => (t.id === taskId ? updatedTask : t));
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }
                    navigate('/');

                    return updatedTask;
                }
                return null;
            });
            setIsEditing(false);
        }
    };

    // Функция для отмены редактирования
    const handleCancelEdit = () => {
        setIsCancelModalOpen(true);
    };

    // Функция для подтверждения отмены редактирования
    const handleCancelConfirm = () => {
        setIsEditing(false);
        setEditedTask(task ? { ...task } : null);
        setEditingSubtaskId(null);
        setEditedSubtaskText('');
        setIsCancelModalOpen(false);
        navigate('/');
    };

    // Функция для добавления новой подзадачи
    const handleAddSubtask = () => {
        if (newSubtask.trim() !== '') {
            setEditedTask((prev) => {
                if (prev) {
                    const updatedSubtasks = [...(prev.subtasks || []), { id: Date.now().toString(), title: newSubtask }];
                    return { ...prev, subtasks: updatedSubtasks };
                }
                return null;
            });
            setNewSubtask('');
        }
    };

    // Функция для удаления подзадачи
    const handleDeleteSubtask = (subtaskId: string) => {
        setEditedTask((prev) => {
            if (prev) {
                const updatedSubtasks = (prev.subtasks || []).filter((subtask) => subtask.id !== subtaskId);
                return { ...prev, subtasks: updatedSubtasks };
            }
            return null;
        });
    };

    // Функция для начала редактирования подзадачи
    const handleStartEditSubtask = (subtaskId: string, subtaskText: string) => {
        setEditingSubtaskId(subtaskId);
        setEditedSubtaskText(subtaskText);
    };

    // Функция для сохранения результатов редактирования подзадачи
        const handleSaveEditSubtask = () => {
        setEditedTask((prev) => {
            if (prev && editingSubtaskId !== null) {
                const updatedSubtasks = (prev.subtasks || []).map((subtask) => {
                    if (subtask.id === editingSubtaskId) {
                        return { ...subtask, title: editedSubtaskText };
                    }
                    return subtask;
                });
                return { ...prev, subtasks: updatedSubtasks };
            }
            return null;
        });
        setEditingSubtaskId(null);
        setEditedSubtaskText('');
    };

    // Функция для отмены редактирования подзадачи
    const handleCancelEditSubtask = () => {
        setEditingSubtaskId(null);
        setEditedSubtaskText('');
    };

    // Функция для изменения состояния готовности подзадачи
    const handleToggleSubtaskCompletion = (subtaskId: string) => {
        setEditedTask((prev) => {
            if (prev) {
                const updatedSubtasks = (prev.subtasks || []).map((subtask) => {
                    if (subtask.id === subtaskId) {
                        return { ...subtask, isCompleted: !subtask.isCompleted };
                    }
                    return subtask;
                });
                return { ...prev, subtasks: updatedSubtasks };
            }
            return null;
        });
    };

    // Функция для удаления задачи
    const handleDeleteTask = () => {
        setIsDeleteModalOpen(true);
    };

    // Функция для подтверждения удаления задачи
    const handleConfirmDelete = () => {
        setTask((prevTask) => {
            if (prevTask) {
                const storedTasks = localStorage.getItem('tasks');
                if (storedTasks) {
                    const parsedTasks = JSON.parse(storedTasks) as Task[];
                    const updatedTasks = parsedTasks.filter((t) => t.id !== taskId);
                    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                }
                navigate('/');
                return null;
            }
            return null;
        });
        setIsDeleteModalOpen(false);
    };

    // Функция для отмены удаления задачи
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    // Сообщение о том, что задача не найдена
    if (!task) {
        return <div>Задача не найдена</div>;
    }

    return (
        <div>
            <h1>{isEditing ? 'Редактирование' : task.title}</h1>

            <label>
                Название задачи:
                <input
                    type="text"
                    value={editedTask?.title || ''}
                    onChange={(e) => setEditedTask((prev) => ({ ...prev, title: e.target.value }))}
                />
            </label>

            <div>
                <label>
                    Новая подзадача:
                    <input type="text" value={newSubtask} className="mt-2" onChange={(e) => setNewSubtask(e.target.value)} />
                </label>
                <button className="btn btn-success ms-2 " onClick={handleAddSubtask}>Добавить подзадачу</button>
            </div>

            {/* Отображение списка подзадач */}
            <ul>
                {editedTask?.subtasks?.map((subtask) => (
                    <li key={subtask.id}>
                        {editingSubtaskId === subtask.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedSubtaskText}
                                    onChange={(e) => setEditedSubtaskText(e.target.value)}
                                    className="mt-3"
                                />
                                <button className="btn btn-success  ms-2 me-2" onClick={handleSaveEditSubtask}>Сохранить</button>
                                <button className="btn btn-danger  ms-2" onClick={handleCancelEditSubtask}>Отменить</button>
                            </>
                        ) : (
                            <>
                                {/* Чекбокс состояния и вывод текста подзадачи */}
                                <input
                                    type="checkbox"
                                    checked={subtask.isCompleted || false}
                                    onChange={() => handleToggleSubtaskCompletion(subtask.id)}
                                />
                                {subtask.title}

                                {/* Кнопки для удаления и редактирования текста подзадачи */}
                                <button className="btn btn-danger me-2 ms-2 mt-2" onClick={() => handleDeleteSubtask(subtask.id)}>Удалить</button>
                                <button className="btn btn-primary mt-2" onClick={() => handleStartEditSubtask(subtask.id, subtask.title)}>Редактировать текст</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <button className="btn btn-success me-2" onClick={handleSaveChanges}>Сохранить изменения</button>
            <button className="btn btn-danger me-2" onClick={handleCancelEdit}>Отменить редактирование</button>
            <button className="btn btn-secondary me-2" onClick={handleUndoChanges}>Отменить внесенное изменение</button>
            <button className="btn btn-dark me-2" onClick={handleRedoChanges}>Повторить отмененное изменение</button>

            <div>
                <button onClick={handleDeleteTask} className="btn btn-danger mt-2">
                    Удалить
                </button>
            </div>

            {/* Модальное окно для подтверждения удаления задачи */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Подтверждение удаления"
                body="Вы уверены, что хотите удалить эту задачу?"
            />

            {/* Модальное окно для подтверждения отмены редактирования */}
            <ConfirmCancelModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirmCancel={handleCancelConfirm}
            />
        </div>
    );
};

export default TaskDetailsPage;
