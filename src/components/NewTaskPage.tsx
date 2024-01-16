import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Интерфейс для подзадач
interface SubTask {
    id: string;
    title: string;
}

// Интерфейс для задачи
interface Task {
    id: string;
    title: string;
    subtasks: SubTask[];
}

const NewTaskPage: React.FC = () => {
    // Стейты для отслеживания введенного названия задачи, списка подзадач и ошибок
    const [title, setTitle] = useState<string>('');
    const [subtasks, setSubtasks] = useState<string[]>(['']);
    const [showTitleError, setShowTitleError] = useState<boolean>(false);
    const [showSubtaskError, setShowSubtaskError] = useState<boolean>(false);

    // Хук для навигации
    const navigate = useNavigate();

    // Функция для добавления новой подзадачи
    const handleAddSubtask = () => {
        // Проверка наличия пустых подзадач перед добавлением
        if (subtasks.some(subtask => subtask.trim() === '')) {
            setShowSubtaskError(true);
            return;
        }

        // Очистка ошибок и добавление новой подзадачи
        setShowSubtaskError(false);
        setSubtasks([...subtasks, '']);
    };

    // Функция для удаления подзадачи по индексу
    const handleDeleteSubtask = (index: number) => {
        setSubtasks((prevSubtasks) => {
            const updatedSubtasks = [...prevSubtasks];
            updatedSubtasks.splice(index, 1);
            return updatedSubtasks;
        });
    };

    // Функция для сохранения задачи
    const handleSaveTask = () => {
        // Проверка наличия введенного названия задачи перед сохранением
        if (title.trim() === '') {
            setShowTitleError(true);
            return;
        }

        // Проверка наличия пустых подзадач перед сохранением
        if (subtasks.some(subtask => subtask.trim() === '')) {
            setShowSubtaskError(true);
            return;
        }

        // Очистка ошибок
        setShowTitleError(false);
        setShowSubtaskError(false);

        // Создание новой задачи с уникальным идентификатором и подзадачами
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

        // Получение списка задач из localStorage и добавление новой задачи
        const storedTasks = localStorage.getItem('tasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];
        const updatedTasks = [...tasks, newTask];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        // Переход на главную страницу
        navigate('/');
    };

    return (
        <div>
            <h1>Создание новой задачи</h1>
            <label>
                Название задачи:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>

            {/* Сообщение об ошибке, если название задачи не введено */}
            {showTitleError && <div className="text-danger">Введите название задачи</div>}

            <div>
                <h2>Подзадачи:</h2>
                {/* Маппинг и рендеринг подзадач */}
                {subtasks.map((subtask, index) => (
                    <div key={index}>
                        {/* Ввод имени подзадачи */}
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

                        {/* Кнопка для удаления подзадачи */}
                        <button className="btn btn-danger ms-2" onClick={() => handleDeleteSubtask(index)}>
                            Удалить
                        </button>
                    </div>
                ))}

                {/* Сообщение об ошибке, если имя подзадачи не введено */}
                {showSubtaskError && <div className="text-danger">Введите имя подзадачи</div>}

                {/* Кнопка для добавления новой подзадачи */}
                <button className="btn btn-success my-2 me-2" onClick={handleAddSubtask}>Добавить подзадачу</button>
            </div>

            {/* Кнопка для сохранения задачи */}
            <button className="btn btn-success my-2 me-2" onClick={handleSaveTask}>
                Сохранить
            </button>

            {/* Кнопка для отмены создания новой задачи и возврата на главную страницу */}
            <Link className="btn btn-danger" to="/">
                Отмена
            </Link>
        </div>
    );
};

export default NewTaskPage;
