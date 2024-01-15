import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import TasksListPage from './components/TasksListPage';
import TaskDetailsPage from './components/TaskDetailsPage';
import NewTaskPage from "./components/NewTaskPage";

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/tasks/new" element={<NewTaskPage />} />
                    <Route path="/tasks/edit/:taskId" element={<TaskDetailsPage />} />
                    <Route path="" element={<TasksListPage />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
