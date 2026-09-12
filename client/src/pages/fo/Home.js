import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import { Smile, Users, ReceiptText, Speaker, ScrollText, Settings } from 'lucide-react';
//import { useNavigate } from "react-router-dom";
import UsersPage from './UsersPage';
import VoiceButton from "./VoiceButton";
import TasksPage from './TasksPage';
import SettingsPage from './SettingsPage';

const Home = () => {

  /* NAVIGATION */

  

  /* DATABASE */

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchTasks = useCallback(() => {
    fetch("/task")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const fetchUsers = useCallback(() => {
    fetch("/user")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const fetchAll = useCallback(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks,fetchUsers]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const pages = [
    { line: 1, name: "Humeur", icon: <Smile size={30} />, pageFile: <></> },
    { line: 1, name: "Tâches", icon: <ReceiptText size={30} />, pageFile: <TasksPage tasks={tasks}/> },
    { line: 1, name: "Colocation", icon: <Users size={30} />, pageFile: <UsersPage users={users}/> },
    { line: 2, name: "Soundboard", icon: <Speaker size={30} />, pageFile: <></> },
    { line: 2, name: "Courses", icon: <ScrollText size={30} />, pageFile: <></> },
    { line: 2, name: "Paramètres", icon: <Settings size={30} />, pageFile: <SettingsPage/> }
  ];
  const [activePage, setActivePage] = useState("Humeur");
  //const navigate = useNavigate();
  useEffect(() => {window.scrollTo(0,0);}, [activePage]);

  return (
    <div>
      <div>
        {pages.find((page) => (activePage === page.name)).pageFile}
      </div>
      <VoiceButton onFinished={fetchAll} />
      <div className='toolbar-space'></div>
       <div className="bottom-toolbar up">
        {pages.map((page) => (page.line === 1 &&
          <button
            key={page.name}
            onClick={() => setActivePage(page.name)}
            className={`toolbar-button ${activePage === page.name ? "active" : ""}`}
          >
            <div>
              {page.icon}
              <span style={{paddingTop:"5px"}}>{page.name}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="bottom-toolbar">
        {pages.map((page) => (page.line === 2 &&
          <button
            key={page.name}
            onClick={() => setActivePage(page.name)}
            className={`toolbar-button ${activePage === page.name ? "active" : ""}`}
          >
            <div>
              {page.icon}
              <span style={{paddingTop:"5px"}}>{page.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
