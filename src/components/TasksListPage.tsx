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
        <div className="container mt-5">
            <h1 className="text-center">Список задач</h1>
            <div className="row justify-content-center">
                {tasks.map((task) => (
                    <div key={task.id} className="col-12 mb-3 justify-content-center w-75">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">
                                   {task.title}
                                </h4>
                                <p className="card-text">
                                    {task.subtasks && task.subtasks.slice(0, 3).map((subtask) => (
                                        <span key={subtask.id} className="badge bg-secondary me-2">{subtask.title}</span>
                                    ))}
                                </p>
                                <div className="btn-group">
                                    <button className="btn btn-danger" onClick={() => handleDeleteTask(task.id)}>Удалить</button>
                                    <Link to={`/tasks/edit/${task.id}`} className="btn btn-primary">
                                        Редактировать
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/tasks/new" className="btn btn-primary mt-3">Создать новую задачу</Link>

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