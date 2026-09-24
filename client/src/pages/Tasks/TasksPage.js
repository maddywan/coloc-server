import '../styles.css';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import KanbanContent from './KanbanContent';
import KanbanItem from './KanbanItem';
import { useState } from 'react';
import TaskModal from './TaskModal';
import { labels } from '../data/data';
import { X } from 'lucide-react';

const TasksPage = ({ tasks, setTasks, fetchTasks, users, fetchUsers, getRewards }) => {
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

  /* FILTERS AND DISPLAY */

  const [filters, setFilters] = useState(labels);
  const [displayToDo, setDisplayToDo] = useState(false);

  /* PAGE */

  return (
    <div className="article-column-container">
      <div className="title-bar">
        <div className="title-bar-item">
          <p style={{margin:"auto"}}>À faire</p>
          <input style={{margin:"auto"}} type='checkbox' className='toggleswitch' checked={displayToDo} onChange={(e) => setDisplayToDo(e.target.checked)}/><br/>
        </div>
        <div className='title-bar-item filter-container'>
          {filters.map((filter,index) => (
            <div className={`filter-element ${filter.active ? 'active' : ''}`}
              onClick={() => setFilters(filters.map((filter,i) =>
                i === index ? { ...filter, active: !filter.active } : filter
              ))}
            >{filter.title}</div>
          ))}
          <div className='filter-cross'
            onClick={() => setFilters(filters.map((filter) => ({...filter, active: false})))}
          ><X/></div>
        </div>
        <button className="title-bar-item big-button success" onClick={()=>{openTaskModal({id:-1,title:"",description:"",reward:0,limit_date:null,period:0,label:""})}}> + Tâche</button>
      </div>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban">
          {displayToDo?<div className="kanban-column">
            <div className="kanban-column-title">À faire</div>
            <KanbanContent color="#64a0d259" state={0} tasks={tasks.filter(task => task.state === 0 && (!task.label || filters.find(a => a.title === task.label)?.active))} openTaskModal={openTaskModal} getRewards={getRewards}/>
          </div>:''}
          <div className="kanban-column">
              <div className="kanban-column-title">Prochaines tâches</div>
              <KanbanContent color="#d264c359" state={1} tasks={tasks.filter(task => task.state === 1 && (!task.label || filters.find(a => a.title === task.label)?.active))} openTaskModal={openTaskModal} getRewards={getRewards}/>
          </div>
          <div className="kanban-column-double">
            <div className="kanban-column">
              <div className="kanban-column-title">🏆 Maddy - {users&&users[0]?users[0].points:'0'}🪙</div>
              <KanbanContent color="#6bd26459" state={2} tasks={tasks.filter(task => task.state === 2)} openTaskModal={openTaskModal} double={true} getRewards={getRewards}/>
            </div>
            <div className="kanban-column">
              <div className="kanban-column-title">🏆 Mathis - {users&&users[1]?users[1].points:'0'}🪙</div>
              <KanbanContent color="#6bd26459" state={3} tasks={tasks.filter(task => task.state === 3)} openTaskModal={openTaskModal} double={true} getRewards={getRewards}/>
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
    </div>
  );
};

export default TasksPage;