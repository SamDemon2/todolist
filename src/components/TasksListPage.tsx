import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Task {
    id: string;
    title: string;
}

const TasksListPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    //Если в localStorage нет данных о задачах, то выводится тестовый массив
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (!storedTasks) {
            const testTasks: Task[] = [
                { id: '1', title: 'Посадить цветы' },
                { id: '2', title: 'Помыть машину' },
                { id: '3', title: 'Подготовить ужин' },
            ];

            localStorage.setItem('tasks', JSON.stringify(testTasks));
            setTasks(testTasks);
        } else {
            setTasks(JSON.parse(storedTasks) as Task[]);
        }
    }, []);

    // Удаление задачи
    const handleDeleteTask = (id: string) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    return (
        <div>
            <h1>Список задач</h1>
            <ul>
                {/*Вывод списка задач*/}
                {tasks.map((task) => (
                    <li key={task.id}>
                        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                        <button onClick={() => handleDeleteTask(task.id)}>Удалить</button>
                        <Link to={`/tasks/edit/${task.id}`} className="btn btn-primary mr-2">
                            Редактировать
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/tasks/new">Создать новую задачу</Link>
        </div>
    );
};

export default TasksListPage;
