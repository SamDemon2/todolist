import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

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
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null); // Новое состояние для отслеживания редактируемой подзадачи
    const [editedSubtaskText, setEditedSubtaskText] = useState<string>(''); // Новое состояние для редактирования текста подзадачи
    const navigate = useNavigate();

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks) as Task[];
            const selectedTask = parsedTasks.find((t) => t.id === taskId);
            setTask(selectedTask || null);
            setEditedTask(selectedTask ? { ...selectedTask } : null);
        }
    }, [taskId]);

    // Логика удаления задачи
        const handleDeleteTask = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            setTask((prevTask) => {
                if (prevTask) {
                    // Удаление задачи из localStorage
                    const storedTasks = localStorage.getItem('tasks');
                    if (storedTasks) {
                        const parsedTasks = JSON.parse(storedTasks) as Task[];
                        const updatedTasks = parsedTasks.filter((t) => t.id !== taskId);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }

                    // Переход на главную страницу
                    navigate('/');
                    return null;
                }
                return null;
            });
        }
    };

    const handleSaveChanges = () => {
        // Логика сохранения изменений

        if (editedTask) {
            setTask((prevTask) => {
                if (prevTask) {
                    const updatedTask: Task = { ...prevTask, ...editedTask };
                    // Обновление данных в localStorage
                    const storedTasks = localStorage.getItem('tasks');
                    if (storedTasks) {
                        const parsedTasks = JSON.parse(storedTasks) as Task[];
                        const updatedTasks = parsedTasks.map((t) => (t.id === taskId ? updatedTask : t));
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }
                    // Переход на главную страницу
                    navigate('/');
                    return updatedTask;
                }
                return null;
            });
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // При отмене редактирования восстанавливается исходное состояние задачи
        setEditedTask(task ? { ...task } : null);
        setEditingSubtaskId(null); // Очищаем редактируемую подзадачу при отмене редактирования
        setEditedSubtaskText(''); // Очищаем текст редактируемой подзадачи при отмене редактирования
        // Переход на главную страницу
        navigate('/');
    };

    const handleUndoChanges = () => {
        // Логика отмены внесенного изменения
    };

    const handleRedoChanges = () => {
        // Логика повтора отмененного изменения
    };

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

    const handleDeleteSubtask = (subtaskId: string) => {
        setEditedTask((prev) => {
            if (prev) {
                const updatedSubtasks = (prev.subtasks || []).filter((subtask) => subtask.id !== subtaskId);
                return { ...prev, subtasks: updatedSubtasks };
            }
            return null;
        });
    };

    const handleStartEditSubtask = (subtaskId: string, subtaskText: string) => {
        setEditingSubtaskId(subtaskId);
        setEditedSubtaskText(subtaskText);
    };

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

    const handleCancelEditSubtask = () => {
        setEditingSubtaskId(null);
        setEditedSubtaskText('');
    };

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

    if (!task) {
        return <div>Задача не найдена</div>;
    }

    return (
        <div>
            <h1>{isEditing ? 'Редактирование' : task.title}</h1>

            {/*Форма редактирования задачи*/}
            <label>
                Название задачи:
                <input
                    type="text"
                    value={editedTask?.title || ''}
                    onChange={(e) => setEditedTask((prev) => ({ ...prev, title: e.target.value }))}
                />
            </label>

            {/* Добавление подзадачи */}
            <div>
                <label>
                    Новая подзадача:
                    <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} />
                </label>
                <button className="btn btn-success" onClick={handleAddSubtask}>Добавить подзадачу</button>
            </div>

            {/* Список подзадач */}
            <ul>
                {editedTask?.subtasks?.map((subtask) => (
                    <li key={subtask.id}>
                        {editingSubtaskId === subtask.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedSubtaskText}
                                    onChange={(e) => setEditedSubtaskText(e.target.value)}
                                />
                                <button className="btn btn-success" onClick={handleSaveEditSubtask}>Сохранить</button>
                                <button className="btn btn-danger" onClick={handleCancelEditSubtask}>Отменить</button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="checkbox"
                                    checked={subtask.isCompleted || false}
                                    onChange={() => handleToggleSubtaskCompletion(subtask.id)}
                                />
                                {subtask.title}
                                <button className="btn btn-danger me-2 ms-2" onClick={() => handleDeleteSubtask(subtask.id)}>Удалить</button>
                                <button className="btn btn-primary" onClick={() => handleStartEditSubtask(subtask.id, subtask.title)}>Редактировать текст</button>
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
                {/* Просмотр задачи */}
                <Link to={`/tasks/edit/${task.id}`} className="btn btn-primary mr-2">
                    Редактировать
                </Link>
                <button onClick={handleDeleteTask} className="btn btn-danger ms-2">
                    Удалить
                </button>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
