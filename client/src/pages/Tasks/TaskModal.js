import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TaskModal = ({ isOpen, onRequestClose, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState(0);
  const [limitDate, setLimitDate] = useState(null);
  const [period, setPeriod] = useState(0);
  const [enableDate, setEnableDate] = useState(false);
  const [periodText, setPeriodText] = useState("Unique");

  useEffect(() => {
    setTitle(task?task.title:"");
    setDescription(task?task.description:"");
    setReward(task?task.reward:"");
    setLimitDate(task?(task.limit_date?new Date(task.limit_date).toLocaleDateString("en-CA"):new Date().toLocaleDateString("en-CA")):"");
    handlePeriodChange(task?task.period:"");
    setEnableDate(task?task.limit_date!==null:"");
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
          reward:(reward?parseInt(reward):0),
          limitDate:(enableDate?limitDate:null),
          period:(enableDate?period:0)
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
        
        <span>Titre / Description</span>
        <input className='text-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <textarea className='text-input' type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
        <br/>

        <span>Récompense 🪙</span>
        <input className='text-input' type="number" step="10" min="0" max="1000" value={reward} onChange={(e) => setReward(e.target.value)}/>
        <br/>

        <span>Date limite</span><br/>
        <input type='checkbox' className='toggleswitch' checked={enableDate} onChange={(e) => setEnableDate(e.target.checked)} style={{margin:"10px 0 0 20px"}}/>
        <input className='text-input' type="date" value={limitDate} disabled={!enableDate} onChange={(e) => setLimitDate(e.target.value)}/>

        <span>Récurrence : {periodText}</span>
        <input className='text-input' type="number" step="1" min="0" max="365" value={period} disabled={!enableDate} onChange={(e) => handlePeriodChange(e.target.value)}/>
        <br/>

        <h3 onClick={handleSaveTask} className='modal-button btn-success'><Save/>Sauvegarder</h3>
        {task.id>-1?<h3 onClick={handleDeleteTask} className='modal-button btn-danger'><Trash2/>Supprimer</h3>:''}
        <h3 onClick={onRequestClose} className='modal-button btn-info'><ArrowLeft/>Retour</h3>
    </Modal>
  );
};

export default TaskModal;
