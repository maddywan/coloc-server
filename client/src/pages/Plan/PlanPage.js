import { useState } from 'react';
import '../styles.css';
import CleaningModal from './CleaningModal';

const PlanPage = ({tasks, fetchTasks, fetchUsers}) => {

  /* Zones */

  const [zones, setZones] = useState([
    {id: "Salon",   selected: false, points: "15,15 702,15 702,469 15,469"},
    {id: "Cuisine", selected: false, points: "15,484 273,484 273,778 15,778"},
    {id: "SDB",     selected: false, points: "15,793 273,793 273,1075 15,1075"},
    {id: "Couloir", selected: false, points: "288,484 431,484 431,721 522,721 522,1075 431,1075 431,1150 288,1150"},
    {id: "WC",      selected: false, points: "446,484 597,484 597,706 446,706"}
  ]);

  const handleZoneClick = (zone) => {
    console.log("CLIC-----------------K");

    setZones(zones => zones.map(z => {
      return z.id === zone.id ? { ...z, selected:!z.selected } : z;
    }));
  }

  /* MODAL */

  const [cleaningModalIsOpen, setCleaningModalIsOpen] = useState(false);
  
  const openCleaningModal = () => {
    document.body.classList.add('no-scroll');
    setCleaningModalIsOpen(true);
  };

  const closeCleaningModal = () => {
    document.body.classList.remove('no-scroll');
    setCleaningModalIsOpen(false);
  };

  const getRewards = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [0,0];
    if (!task.limit_date || !task.delay_bonus || (task.label && (task.label==='Maddy' || task.label==='Mathis'))) return [task.reward,task.reward];
    const days = Math.round((new Date().setHours(0,0,0,0)-new Date(task.limit_date).setHours(0,0,0,0))/86400000);
    return [task.reward,days>0?task.reward+Math.min(days*5,100):task.reward];
  }

  const checkTasks = async(filteredTasks,username) => {
    let newState = 0;
    if (username === "Maddy") newState = 2;
    if (username === "Mathis") newState = 3;
    const finishedDate = new Date().toLocaleDateString('sv-SE');

    console.log(filteredTasks);

    filteredTasks.map(async task => {
      const rewards = getRewards(task.id);

      try {
        const response = await fetch(`/taskstate`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({taskId:task.id, state:newState, winner:username, finishedDate, reward:rewards[0], totalReward:rewards[1]}),
        });
        if (!response.ok) alert('Failed to change task state.');
      } catch (error) {
        console.error('Error updating task :', error);
        alert('Error updating task.');
      }

      fetchTasks();
      fetchUsers();
    });

    closeCleaningModal();
  };

  return (
    <div>
      <div className="title-bar">
        <h2 className='title-bar-item'>Plan</h2>
        <button className="title-bar-item big-button success" onClick={()=>{openCleaningModal()}} disabled={!zones.some(zone => zone.selected)}>J'ai fait le ménage</button>
      </div>
      <div style={{textAlign:"center",margin:"10px"}}>
        <svg viewBox="0 0 718 1180" width="80%" height="auto" preserveAspectRatio="xMidYMid meet">
          <image href="images/plan.png"/>
          {zones.map((zone) => (
            <polygon key={zone.id} points={zone.points} className={`zone ${zone.selected?"selected":""}`} onClick={() => handleZoneClick(zone)}/>
          ))}
        </svg>
      </div>

      <CleaningModal
        isOpen={cleaningModalIsOpen}
        onRequestClose={closeCleaningModal}
        zones={zones}
        tasks={tasks}
        checkTasks={checkTasks}
        getRewards={getRewards}
      />
    </div>
  );
};

export default PlanPage;