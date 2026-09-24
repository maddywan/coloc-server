import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CleaningModal = ({ isOpen, onRequestClose, zones, tasks, checkTasks, getRewards }) => {
  const [username, setUsername] = useState("");
  const [type, setType] = useState("");

  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    setUsername("");
    setType("");
  },[isOpen]);
  
  useEffect(() => {
    setFilteredTasks(
      tasks.filter(task => {
        const taskSplit = task.title.split(" : ");
        return zones.some(zone => zone.selected && zone.id === taskSplit[0]) && type === taskSplit[1];}
      ).sort((a,b) => {return a.title.localeCompare(b.title);})
    );
  },[tasks,zones,type])

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Validate Cleaning Tasks"
      className="modal text-left"
      overlayClassName="modal-overlay"
    >
        <h2 className='text-center' style={{marginBlockStart:'0'}}>J'ai fait le ménage</h2>
        <br/>
        
        <div className='choice-button-container'>
          <button className={`choice-button left ${username==="Maddy"?'selected':''}`} onClick={()=>{setUsername("Maddy")}}>Maddy</button>
          <button className={`choice-button right ${username==="Mathis"?'selected':''}`} onClick={()=>{setUsername("Mathis")}}>Mathis</button>
        </div>
        <br/>

        {username?<>
          <div className='choice-button-container'>
            <button className={`choice-button left ${type==="Poussières"?'selected':''}`} onClick={()=>{setType("Poussières")}}>Poussières</button>
            <button className={`choice-button ${type==="Aspi/balai"?'selected':''}`} onClick={()=>{setType("Aspi/balai")}}>Aspi/balai</button>
            <button className={`choice-button right ${type==="Serpillère"?'selected':''}`} onClick={()=>{setType("Serpillère")}}>Serpillère</button>
          </div>
          <br/>
        </>:''}
        
        {username&&type?<>
          <div style={{textAlign:"center"}}>Tâches effectuées :</div>
          <table>
            {filteredTasks.map((task, index) => {
              const rewards = getRewards(task.id);

              return <tr key={index}>
                <td style={{width:"75%"}}>- {task.title}</td>
                <td>{task.reward}🪙</td>
                <td style={{color:'#bd0e0e'}}>{rewards&&rewards[2]>0?'+ '+(rewards[2]):''}</td>
              </tr>
            })}
          </table>
          <div style={{textAlign:"center"}}>Total de {filteredTasks.reduce((total, task) => {
            const rewards = getRewards(task.id);
            return total + rewards[1]},0)}🪙</div>
          <br/>
          <h3 onClick={()=>checkTasks(filteredTasks,username)} className='modal-button success'><Check/>Valider les tâches</h3>
          <br/>
        </>:''}

        <h3 onClick={onRequestClose} className='modal-button info'><ArrowLeft/>Retour</h3>
    </Modal>
  );
};

export default CleaningModal;
