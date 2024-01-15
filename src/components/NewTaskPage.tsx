import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Task {
    id: string;
    title: string;
}

const NewTaskPage: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const navigate = useNavigate();

    const handleSaveTask = () => {
        // Проверка, чтобы title был не пустым
        if (!title.trim()) {
            alert('Пожалуйста, введите название задачи.');
            return;
        }

        // Генерация уникального id для новой задачи
        const newTask: Task = {
            id: Date.now().toString(),
            title: title.trim(),
        };

        // Получение текущего списка задач из localStorage
        const storedTasks = localStorage.getItem('tasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];

        // Добавление новой задачи в список
        const updatedTasks = [...tasks, newTask];

        // Сохранение обновленного списка в localStorage
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        // Перенаправление пользователя на страницу со списком задач
        navigate('/');
    };

    return (
        <div>
            <h1>Создание новой задачи</h1>
            <label>
                Название задачи:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <button onClick={handleSaveTask}>Сохранить</button>
            <Link to="/tasks">Отмена</Link>
        </div>
    );
};

export default NewTaskPage;
