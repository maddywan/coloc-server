import { useState } from 'react';
import '../styles.css';
import CleaningModal from './CleaningModal';

const PlanPage = ({tasks, fetchTasks, fetchUsers, getRewards}) => {

  /* Zones */

  const [zones, setZones] = useState([
    {id: "Salon",   textX: 358, textY: 132, selected: false, points: "15,15 702,15 702,399 15,399"},
    {id: "Cuisine", textX: 144, textY: 521, selected: false, points: "15,414 273,414 273,708 15,708"},
    {id: "SDB",     textX: 144, textY: 824, selected: false, points: "15,723 273,723 273,1005 15,1005"},
    {id: "Couloir", textX: 360, textY: 690, selected: false, points: "288,414 431,414 431,651 494,651 494,1020 288,1020"},
    {id: "WC",      textX: 520, textY: 485, selected: false, points: "446,414 597,414 597,636 446,636"}
  ]);

  const handleZoneClick = (zone) => {
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
        <svg viewBox="0 0 717 1020" height="70vh" preserveAspectRatio="xMidYMid meet">
          <image href="images/plan.png"/>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={20} y={20} viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-cleaning preview-icon"><path d="m16 22-1-4"/><path d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1"/><path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z"/><path d="m8 22 1-4"/></svg>
          <text key={"l1"} x={50} y={40} fontSize="18" textAnchor="left">Poussières</text>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={20} y={50} viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-broom preview-icon"><path d="M13.5 10.5 22 2"/><path d="M14.734 13.841a2 2 0 00-.314-2.42L12.58 9.58a2 2 0 00-2.421-.314l-7.657 4.461A1 1 0 002.3 15.3l6.403 6.403a1 1 0 001.571-.204z"/><path d="m5 18 2-2"/><path d="m7.699 10.7 5.602 5.601"/></svg>
          <text key={"l2"} x={50} y={70} fontSize="18" textAnchor="left">Aspi/balai</text>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={20} y={80} viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mop preview-icon"><path d="M10 22c2.761 0 5-1.79 5-4-4.42 0-4.08-5-8.5-5a1 1 0 100 9za3 3 0 01-3-3"/><path d="M12.5 11.5 22 2"/><path d="m6.98 13.02 2.665-2.664a1.21 1.21 0 011.71 0l2.29 2.288a1.21 1.21 0 010 1.712l-2.088 2.087"/></svg>
          <text key={"l3"} x={50} y={100} fontSize="18" textAnchor="left">Serpillère</text>

          {zones.map((zone) => {
            const zoneTasks = tasks.filter(task => {
                const taskSplit = task.title.split(" : ");
                return (zone.id === taskSplit[0])}
              ).sort((a,b) => {return a.title.localeCompare(b.title);})
            return <>
              <text key={zone.id+"t"} x={zone.textX} y={zone.textY} fontSize="24" textAnchor="middle" dominantBaseline="middle">{zone.id}</text>

              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={zone.textX-27} y={zone.textY+20} viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-cleaning preview-icon"><path d="m16 22-1-4"/><path d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1"/><path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z"/><path d="m8 22 1-4"/></svg>
              {zoneTasks[1].limit_date && new Date(zoneTasks[1].limit_date) > new Date().setHours(0,0,0,0)?
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={zone.textX+3} y={zone.textY+20} viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check preview-icon"><path d="M20 6 9 17l-5-5"/></svg>:
                <text key={zone.id+"ld1"} x={zone.textX+5} y={zone.textY+34} stroke="red" dominantBaseline="middle">{new Date(zoneTasks[1].limit_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit"})}</text>}
              
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={zone.textX-27} y={zone.textY+50} viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-broom preview-icon"><path d="M13.5 10.5 22 2"/><path d="M14.734 13.841a2 2 0 00-.314-2.42L12.58 9.58a2 2 0 00-2.421-.314l-7.657 4.461A1 1 0 002.3 15.3l6.403 6.403a1 1 0 001.571-.204z"/><path d="m5 18 2-2"/><path d="m7.699 10.7 5.602 5.601"/></svg>
              {zoneTasks[0].limit_date && new Date(zoneTasks[0].limit_date) > new Date().setHours(0,0,0,0)?
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={zone.textX+3} y={zone.textY+50} viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check preview-icon"><path d="M20 6 9 17l-5-5"/></svg>:
                <text key={zone.id+"ld0"} x={zone.textX+5} y={zone.textY+64} stroke="red" dominantBaseline="middle">{new Date(zoneTasks[0].limit_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit"})}</text>}
              
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={zone.textX-27} y={zone.textY+80} viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mop preview-icon"><path d="M10 22c2.761 0 5-1.79 5-4-4.42 0-4.08-5-8.5-5a1 1 0 100 9za3 3 0 01-3-3"/><path d="M12.5 11.5 22 2"/><path d="m6.98 13.02 2.665-2.664a1.21 1.21 0 011.71 0l2.29 2.288a1.21 1.21 0 010 1.712l-2.088 2.087"/></svg>
              {zoneTasks[2].limit_date && new Date(zoneTasks[2].limit_date) > new Date().setHours(0,0,0,0)?
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" x={zone.textX+3} y={zone.textY+80} viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check preview-icon"><path d="M20 6 9 17l-5-5"/></svg>:
                <text key={zone.id+"ld2"} x={zone.textX+5} y={zone.textY+94} stroke="red" dominantBaseline="middle">{new Date(zoneTasks[2].limit_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit"})}</text>}
            
              <polygon key={zone.id} points={zone.points} className={`zone ${zone.selected?"selected":""}`} onClick={() => handleZoneClick(zone)}/>
            </>
          })}
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