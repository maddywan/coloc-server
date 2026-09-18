import '../styles.css';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import KanbanContent from './KanbanContent';
import KanbanItem from './KanbanItem';
import { useState } from 'react';
import TaskModal from './TaskModal';

const TasksPage = ({ tasks, setTasks, fetchTasks, users, fetchUsers }) => {
  /* MODAL */

  const [taskModalIsOpen, setTaskModalIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const openTaskModal = (task) => {
    document.body.classList.add('no-scroll');
    setSelectedTask(task);
    setTaskModalIsOpen(true);
  };

  const closeTaskModal = () => {
    document.body.classList.remove('no-scroll');
    setTaskModalIsOpen(false);
    setSelectedTask(null);
    fetchTasks();
  };

  /* DRAGGING */

  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, {}));

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(task => task.id === Number(active.id)));
  };

  const getRewards = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [0,0];
    if (task.label && (task.label==='Maddy' || task.label==='Mathis')) return [0,0];
    if (!task.limit_date) return [task.reward,0];
    const days = Math.round((new Date().setHours(0,0,0,0)-new Date(task.limit_date).setHours(0,0,0,0))/86400000);
    return [task.reward,days>0?task.reward+Math.min(days*5,100):task.reward];
  }

  const handleDragEnd = async({ active, over }) => {
    if (!over || activeTask.state===Number(over.id)) return;
    setActiveTask(null);

    const taskId = Number(active.id);
    const newState = Number(over.id);

    let winner = "";
    let finishedDate = null;
    if (newState === 2) {
      winner = "Maddy";
      finishedDate = new Date().toLocaleDateString('sv-SE');
      console.log(finishedDate);
    } else if (newState === 3) {  
      winner = "Mathis";
      finishedDate = new Date().toLocaleDateString('sv-SE');
    }

    /* DATABASE */

    setTasks(currentTasks => currentTasks.map(task =>
      task.id === taskId ? { ...task, state:newState, winner, finishedDate } : task
    ));

    const rewards = getRewards(taskId);

    try {
      const response = await fetch(`/taskstate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({taskId:taskId, state:newState, winner, finishedDate, reward:rewards[0], totalReward:rewards[1]}),
      });
      if (!response.ok) alert('Failed to change task state.');
    } catch (error) {
      console.error('Error updating task :', error);
      alert('Error updating task.');
    }
    fetchTasks();
    fetchUsers();
  };

  /* PAGE */

  return (
    <div className="article-column-container">
      <h2>Tâches</h2>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban">
          <div className="kanban-column">
            <div className="kanban-column-title">À faire</div>
            <KanbanContent color="#64a0d259" state={0} tasks={tasks} openTaskModal={openTaskModal} />
          </div>
          <div className="kanban-column">
              <div className="kanban-column-title">Prochaines tâches</div>
              <KanbanContent color="#d264c359" state={1} tasks={tasks} openTaskModal={openTaskModal} />
          </div>
          <div className="kanban-column-double">
            <div className="kanban-column">
              <div className="kanban-column-title">Fait par Maddy ({users&&users[0]?users[0].points:'0'}🪙)</div>
              <KanbanContent color="#6bd26459" state={2} tasks={tasks} openTaskModal={openTaskModal} double={true} />
            </div>
            <div className="kanban-column">
              <div className="kanban-column-title">Fait par Mathis ({users&&users[1]?users[1].points:'0'}🪙)</div>
              <KanbanContent color="#6bd26459" state={3} tasks={tasks} openTaskModal={openTaskModal} double={true} />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <KanbanItem task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={taskModalIsOpen}
        onRequestClose={closeTaskModal}
        task={selectedTask}
      />

      <button className="overlay-button" onClick={()=>{openTaskModal({id:-1,title:"",description:"",reward:10,limit_date:null,period:0})}}>+ Ajouter une tâche</button>
    </div>
  );
};

export default TasksPage;