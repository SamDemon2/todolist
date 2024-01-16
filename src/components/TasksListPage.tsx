import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    // Если в localStorage нет данных о задачах, то выводится тестовый массив
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (!storedTasks) {
            const testTasks: Task[] = [
                // ваш тестовый массив
            ];
            localStorage.setItem('tasks', JSON.stringify(testTasks));
            setTasks(testTasks);
        } else {
            setTasks(JSON.parse(storedTasks) as Task[]);
        }
    }, []);

    // Удаление задачи - открыть модальное окно подтверждения
    const handleDeleteTask = (id: string) => {
        setDeletingTaskId(id);
        setIsDeleteModalOpen(true);
    };

    // Подтверждение удаления
    const handleConfirmDelete = () => {
        if (deletingTaskId) {
            const updatedTasks = tasks.filter((task) => task.id !== deletingTaskId);
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setDeletingTaskId(null);
            setIsDeleteModalOpen(false);
        }
    };

    // Отмена удаления
    const handleCancelDelete = () => {
        setDeletingTaskId(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <div>
            <h1>Список задач</h1>
            <ul>
                {/* Вывод списка задач */}
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

            {/* Модальное окно подтверждения удаления */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Подтверждение удаления"
                body="Вы уверены, что хотите удалить эту задачу?"
            />
        </div>
    );
};

export default TasksListPage;
