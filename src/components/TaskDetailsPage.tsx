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

    const handleDeleteTask = () => {
        // Логика удаления задачи
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
        // Переход на главную страницу
        navigate('/');
    };

    const handleUndoChanges = () => {
        // Логика отмены внесенного изменения
    };

    const handleRedoChanges = () => {
        // Логика повтора отмененного изменения
    };

    //Добавление подзадачи
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

    //Удаление подзадачи
    const handleDeleteSubtask = (subtaskId: string) => {
        setEditedTask((prev) => {
            if (prev) {
                const updatedSubtasks = (prev.subtasks || []).filter((subtask) => subtask.id !== subtaskId);
                return { ...prev, subtasks: updatedSubtasks };
            }
            return null;
        });
    };

    //Отметка о завершении
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
                        <input
                            type="checkbox"
                            checked={subtask.isCompleted || false}
                            onChange={() => handleToggleSubtaskCompletion(subtask.id)}
                        />
                        {subtask.title}
                        <button className="btn btn-danger" onClick={() => handleDeleteSubtask(subtask.id)}>Удалить</button>
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
