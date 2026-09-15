import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TaskModal = ({ isOpen, onRequestClose, task }) => {
  const [title, setTitle] = useState(task?task.title:"");
  const [description, setDescription] = useState(task?task.description:"");
  const [reward, setReward] = useState(task?task.reward:"");

  useEffect(() => {
    setTitle(task?task.title:"");
    setDescription(task?task.description:"");
    setReward(task?task.reward:"");
  },[task]);
  
  if (!isOpen) return null;

  const handleSaveTask = async (username) => {
    try {
      const response = await fetch(`/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId:task?task.id:-1, title, description, reward:(reward?reward:0) }),
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
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Task Edit"
      className="modal text-left"
      overlayClassName="modal-overlay"
    >
        <h2 className='text-center' style={{marginBlockStart:'0'}}>Modifier la tâche</h2>
        <br/>
        
        <span>Titre / Description</span>
        <input className='text-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <textarea className='text-input' type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
        <br/>

        <span>Récompense 🪙</span>
        <input className='text-input' type="integer" value={reward} onChange={(e) => setReward(isNaN(reward)?0:parseInt(e.target.value))}/>
        <br/>

        <h3 onClick={handleSaveTask} className='modal-button btn-success'><Save/>Sauvegarder</h3>
        <h3 onClick={onRequestClose} className='modal-button btn-info'><ArrowLeft/>Retour</h3>
    </Modal>
  );
};

export default TaskModal;
