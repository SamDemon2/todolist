import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SubTask {
    id: string;
    title: string;
}

interface Task {
    id: string;
    title: string;
    subtasks: SubTask[];
}

const NewTaskPage: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [subtasks, setSubtasks] = useState<string[]>(['']);
    const navigate = useNavigate();

    const handleAddSubtask = () => {
        const lastSubtask = subtasks[subtasks.length - 1];

        setSubtasks([...subtasks, '']);
    };

    const handleDeleteSubtask = (index: number) => {
        setSubtasks((prevSubtasks) => {
            const updatedSubtasks = [...prevSubtasks];
            updatedSubtasks.splice(index, 1);
            return updatedSubtasks;
        });
    };

    const handleSaveTask = () => {
        if (!title.trim()) {
            alert('Пожалуйста, введите название задачи.');
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: title.trim(),
            subtasks: subtasks
                .filter(subtask => subtask.trim())
                .map((subtask, index) => ({
                    id: `${Date.now()}-${index + 1}`,
                    title: subtask.trim(),
                })),
        };

        const storedTasks = localStorage.getItem('tasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];

        const updatedTasks = [...tasks, newTask];

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        navigate('/');
    };

    return (
        <div>
            <h1>Создание новой задачи</h1>
            <label>
                Название задачи:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <div>
                <h2>Подзадачи:</h2>
                {subtasks.map((subtask, index) => (
                    <div key={index}>
                        <label>
                            Подзадача {index + 1}:
                            <input
                                type="text"
                                value={subtask}
                                onChange={(e) => {
                                    const newSubtasks = [...subtasks];
                                    newSubtasks[index] = e.target.value;
                                    setSubtasks(newSubtasks);
                                }}
                                className="mt-2"
                            />
                        </label>
                        <button className="btn btn-danger ms-2" onClick={() => handleDeleteSubtask(index)}>
                            Удалить
                        </button>
                    </div>
                ))}
                <button className="btn btn-success my-2 me-2" onClick={handleAddSubtask}>Добавить подзадачу</button>
            </div>
            <button className="btn btn-success my-2 me-2" onClick={handleSaveTask}>
                Сохранить
            </button>
            <Link className="btn btn-danger" to="/">
                Отмена
            </Link>
        </div>
    );
};

export default NewTaskPage;
