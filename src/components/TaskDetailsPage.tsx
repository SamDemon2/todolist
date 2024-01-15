import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Task {
    id: string;
    title: string;
    description?: string;
}

const TaskDetailsPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [editedTask, setEditedTask] = useState<Partial<Task> | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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
                    // Обновление данные в localStorage
                    const storedTasks = localStorage.getItem('tasks');
                    if (storedTasks) {
                        const parsedTasks = JSON.parse(storedTasks) as Task[];
                        const updatedTasks = parsedTasks.map((t) => (t.id === taskId ? updatedTask : t));
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }
                    return updatedTask;
                }
                return null;
            });
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleUndoChanges = () => {
        // Логика отмены внесенного изменения
    };

    const handleRedoChanges = () => {
        // Логика повтора отмененного изменения
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


            <button onClick={handleSaveChanges}>Сохранить изменения</button>
            <button onClick={handleCancelEdit}>Отменить редактирование</button>
            <button onClick={handleUndoChanges}>Отменить внесенное изменение</button>
            <button onClick={handleRedoChanges}>Повторить отмененное изменение</button>

            <div>
                {/* Просмотр задачи */}
                <p>{task.description}</p>
                {/* Вывод других свойств задачи, если они есть */}
                <Link to={`/tasks/edit/${task.id}`} className="btn btn-primary mr-2">
                    Редактировать
                </Link>
                <button onClick={handleDeleteTask} className="btn btn-danger">
                    Удалить
                </button>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
