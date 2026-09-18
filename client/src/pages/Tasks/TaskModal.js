import { ArrowLeft, Save, Split, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TaskModal = ({ isOpen, onRequestClose, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState(0);
  const [enableDate, setEnableDate] = useState(false);
  const [limitDate, setLimitDate] = useState(null);
  const [period, setPeriod] = useState(0);
  const [periodText, setPeriodText] = useState("Unique");
  const [label, setLabel] = useState("");

  useEffect(() => {
    setTitle(task?task.title:"");
    setDescription(task?task.description:"");
    setReward(task?task.reward:"");
    setEnableDate(task?task.limit_date!==null:"");
    setLimitDate(task?(task.limit_date?new Date(task.limit_date).toLocaleDateString("en-CA"):new Date().toLocaleDateString("en-CA")):"");
    handlePeriodChange(task?task.period:"");
    setLabel(task?task.label:"");
  },[task]);

  const handlePeriodChange = (periodValue) => {
    setPeriod(periodValue);
    const days = parseInt(periodValue);
    if (days === 0) setPeriodText("Unique");
    else if (days === 1) setPeriodText("Tous les jours");
    else if (days === 7) setPeriodText("Hebdomadaire");
    else if (days === 14) setPeriodText("Toutes les 2 semaines");
    else if (days === 21) setPeriodText("Toutes les 3 semaines");
    else if (days === 28) setPeriodText("Toutes les 4 semaines");
    else if (days === 30) setPeriodText("Mensuel");
    else if (days === 60) setPeriodText("Bimestriel");
    else if (days === 90) setPeriodText("Trimestriel");
    else setPeriodText("Tous les "+periodValue+" jours");
  }
  
  if (!isOpen) return null;

  const handleSaveTask = async () => {
    try {
      const response = await fetch(`/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId:task?task.id:-1,
          title,
          description,
          reward:(reward&&label!=="Mathis"&&label!=="Maddy"?parseInt(reward):0),
          limitDate:(enableDate?limitDate:null),
          period:(enableDate?period:0),
          label
        }),
      });

      if (response.ok) {
        onRequestClose();
      } else {
        alert(`Error with /task endpoint.`);
      }
    } catch (error) {
      console.error('Error with /task endpoint.', error);
      alert('Error with /task endpoint.');
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`/deletetask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({taskId:task.id}),
      });

      if (response.ok) {
        onRequestClose();
      } else {
        alert(`Error with /deletetask endpoint.`);
      }
    } catch (error) {
      console.error('Error with /deletetask endpoint.', error);
      alert('Error with /deletetask endpoint.');
    }
  }

  const handleSplitTask = async () => {
    try {
      const response = await fetch(`/splittask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({taskId:task.id,reward:task.reward}),
      });

      if (response.ok) {
        onRequestClose();
      } else {
        alert(`Error with /splittask endpoint.`);
      }
    } catch (error) {
      console.error('Error with /splittask endpoint.', error);
      alert('Error with /splittask endpoint.');
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Task Edit"
      className="modal text-left"
      overlayClassName="modal-overlay"
    >
        <h2 className='text-center' style={{marginBlockStart:'0'}}>{task.id===-1?"Ajouter une tâche":"Modifier la tâche"}</h2>
        <br/>
        
        <span>Titre - Catégorie - Description</span>
        <input className='text-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <select className='text-input' type="text" value={label} onChange={(e) => setLabel(e.target.value)}>
          <option value="">Sans catégorie</option>
          <option value="Maddy">#Maddy</option>
          <option value="Mathis">#Mathis</option>
          <option value="Ménage">#Ménage</option>
          <option value="Rangement">#Rangement</option>
          <option value="Organisation">#Organisation</option>
          <option value="Bricolage">#Bricolage</option>
        </select>
        <textarea className='text-input' type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
        <br/>

        <span>Récompense 🪙</span>
        <input className='text-input' type="number" step="10" min="0" max="1000" value={reward} onChange={(e) => setReward(e.target.value?Math.min(e.target.value,1000):'')}/>
        <br/>

        <span>Date limite</span><br/>
        <input type='checkbox' className='toggleswitch' checked={enableDate} onChange={(e) => setEnableDate(e.target.checked)} style={{margin:"10px 0 0 20px"}}/><br/>
        {enableDate?<>
          <input className='text-input' type="date" value={limitDate} disabled={!enableDate} onChange={(e) => setLimitDate(e.target.value)}/>

          <span>Récurrence : {periodText}</span>
          <input className='text-input' type="number" step="1" min="0" max="365" value={period} disabled={!enableDate} onChange={(e) => handlePeriodChange(e.target.value)}/>
        </>:''}
        <br/>

        <h3 onClick={handleSaveTask} className='modal-button btn-success'><Save/>Sauvegarder</h3>
        {task.id>-1?<>
          <h3 onClick={handleSplitTask} className='modal-button btn-blue'><Split/>Partager la tâche </h3>
          <h3 onClick={handleDeleteTask} className='modal-button btn-danger'><Trash2/>Supprimer</h3>
        </>:''}
        <br/>
        <h3 onClick={onRequestClose} className='modal-button btn-info'><ArrowLeft/>Retour</h3>
    </Modal>
  );
};

export default TaskModal;
