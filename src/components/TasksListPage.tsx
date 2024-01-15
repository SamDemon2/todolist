import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface SubTask {
    id: string;
    title: string;
}

interface Task {
    id: string;
    title: string;
    subtasks: SubTask[];
}


const TasksListPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    //Если в localStorage нет данных о задачах, то выводится тестовый массив
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (!storedTasks) {
            const testTasks: Task[] = [
                {
                    id: '1',
                    title: 'Посадить цветы',
                    subtasks: [
                        { id: '1.1', title: 'Выбрать цветы' },
                        { id: '1.2', title: 'Купить почву' },
                        { id: '1.3', title: 'Полить цветы' },
                        { id: '1.4', title: 'Разместить в горшках' },
                        { id: '1.5', title: 'Ухаживать за растениями' },
                    ],
                },
                {
                    id: '2',
                    title: 'Помыть машину',
                    subtasks: [
                        { id: '2.1', title: 'Подготовить ведра с водой' },
                        { id: '2.2', title: 'Намылить машину' },
                        { id: '2.3', title: 'Промыть водой' },
                        { id: '2.4', title: 'Протереть сухой тряпкой' },
                        { id: '2.5', title: 'Проверить результат' },
                    ],
                },
                {
                    id: '3',
                    title: 'Подготовить ужин',
                    subtasks: [
                        { id: '3.1', title: 'Выбрать рецепт' },
                        { id: '3.2', title: 'Купить продукты' },
                        { id: '3.3', title: 'Приготовить блюдо' },
                        { id: '3.4', title: 'Подать на стол' },
                        { id: '3.5', title: 'Убрать посуду' },
                    ],
                },
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
                        <button className="btn btn-danger ms-2" onClick={() => handleDeleteTask(task.id)}>Удалить</button>
                        <Link to={`/tasks/edit/${task.id}`} className="btn btn-primary ms-2">
                            Редактировать
                        </Link>
                        <ul>
                            {/* Проверка на наличие subtasks перед использованием slice */}
                            {task.subtasks && task.subtasks.slice(0, 3).map((subtask) => (
                                <li key={subtask.id}>{subtask.title}</li>
                            ))}
                        </ul>
                    </li>
                ))}

            </ul>
            <Link to="/tasks/new" className="btn btn-primary">Создать новую задачу</Link>
        </div>
    );
};

export default TasksListPage;
