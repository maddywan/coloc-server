import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import { Users, ReceiptText, Speaker, ScrollText, Settings, Map } from 'lucide-react';
//import { useNavigate } from "react-router-dom";
import UsersPage from './UsersPage';
import VoiceButton from "./VoiceButton";
import TasksPage from './Tasks/TasksPage';
import SettingsPage from './SettingsPage';
import PurchasesPage from './Purchases/PurchasesPage';
import PlanPage from './Plan/PlanPage';

const Home = () => {
  /* GLOBAL FUNCTIONS */

  const getRewards = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [0,0,0];
    if (!task.limit_date || task.finished_date || !task.delay_bonus || (task.label && (task.label==='Maddy' || task.label==='Mathis'))) return [task.reward,task.reward,0];
    const days = Math.round((new Date().setHours(0,0,0,0)-new Date(task.limit_date).setHours(0,0,0,0))/86400000);
    return [task.reward,days>0?task.reward+Math.min(days*5,100):task.reward,days>0?Math.min(days*5,100):0];
    // [0] = base reward only // [1] = base reward + bonus // [2] = bonus only
  }

  /* DATABASE */

  const [globalData, setGlobalData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchGlobalData = useCallback(() => {
    fetch("/globaldata")
      .then((res) => res.json())
      .then((data) => {
        setGlobalData(data);
      })
      .catch((error) => console.error("Error fetching global data:", error));
  }, []);

  const fetchTasks = useCallback(() => {
    fetch("/task")
      .then((res) => res.json())
      .then((data) => {
        setTasks([...data].sort((a, b) => {
          const aFinished = a.finished_date !== null;
          const bFinished = b.finished_date !== null;
          const aHasDate = a.limit_date !== null;
          const bHasDate = b.limit_date !== null;

          if (aFinished !== bFinished) return aFinished ? 1 : -1;
          else if (aFinished && bFinished) {
            const dateDiff = new Date(b.finished_date).getTime() - new Date(a.finished_date).getTime();
            if (dateDiff !== 0) return dateDiff;
            return Number(b.reward) - Number(a.reward);
          }
          
          if (aHasDate !== bHasDate) return aHasDate ? 1 : -1;
          else if (aHasDate && bHasDate) {
            const dateDiff = new Date(a.limit_date).getTime() - new Date(b.limit_date).getTime();
            if (dateDiff !== 0) return dateDiff;
          }
          
          return Number(a.reward) - Number(b.reward);
        }));
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const fetchPurchases = useCallback(() => {
    fetch("/purchase")
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data.sort((a, b) => a.title.localeCompare(b.title)));
      })
      .catch((error) => console.error("Error fetching purchases:", error));
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
    fetchGlobalData();
    fetchTasks();
    fetchPurchases();
    fetchUsers();
  }, [fetchGlobalData,fetchTasks,fetchPurchases,fetchUsers]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* REFRESH */

  const refreshTask = async () => {
    const refreshTaskKey = globalData.find(data => data.key === "refreshtask");
    if (refreshTaskKey && new Date(refreshTaskKey.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)-86400000) {
      try {
        const response = await fetch(`/refreshtask`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json',}
        });
        if (!response.ok) alert(`Error with /refreshtask endpoint.`);
      } catch (error) {
        console.error('Error with /refreshtask endpoint.', error);
        alert('Error with /refreshtask endpoint.');
      }
      console.log("REFRESH FAIT");
      fetchGlobalData();
    }
  }
  refreshTask();

  /* NAVIGATION */

  const pages = [
    { line: 1, name: "Plan", icon: <Map size={30} />, pageFile: <PlanPage tasks={tasks.filter(t => t.label==="Plan" && t.state<2)} fetchTasks={fetchTasks} fetchUsers={fetchUsers} getRewards={getRewards} /> },
    { line: 1, name: "Tâches", icon: <ReceiptText size={30} />, pageFile: <TasksPage tasks={tasks} setTasks={setTasks} fetchTasks={fetchTasks} users={users} fetchUsers={fetchUsers} getRewards={getRewards} /> },
    { line: 1, name: "Colocation", icon: <Users size={30} />, pageFile: <UsersPage users={users}/> },
    { line: 2, name: "Soundboard", icon: <Speaker size={30} />, pageFile: <></> },
    { line: 2, name: "Courses", icon: <ScrollText size={30} />, pageFile: <PurchasesPage purchases={purchases} setPurchases={setPurchases} fetchPurchases={fetchPurchases} /> },
    { line: 2, name: "Paramètres", icon: <Settings size={30} />, pageFile: <SettingsPage/> }
  ];
  const [activePage, setActivePage] = useState("Tâches");
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
