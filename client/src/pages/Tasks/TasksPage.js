import '../styles.css';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import KanbanContent from './KanbanContent';
import KanbanItem from './KanbanItem';
import { useState } from 'react';

const TasksPage = ({ tasks, setTasks, fetchTasks }) => {
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 100, tolerance: 5 } }));

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(task => task.id === Number(active.id)));
  };

  const handleDragEnd = async({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const taskId = Number(active.id);
    const newState = Number(over.id);

    let winner = "";
    let finishedDate = null;
    if (newState === 2) {
      winner = "Maddy";
      finishedDate = new Date();
    } else if (newState === 3) {  
      winner = "Mathis";
      finishedDate = new Date();
    }

    setTasks(currentTasks => currentTasks.map(task =>
      task.id === taskId ? { ...task, state: newState, winner: winner, finishedDate: finishedDate } : task
    ));

    try {
      const response = await fetch(`/taskstate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({taskId:taskId,state:newState,winner:winner,finishedDate:finishedDate}),
      });
      if (!response.ok) alert('Failed to change task state.');
    } catch (error) {
      console.error('Error updating task :', error);
      alert('Error updating task.');
    }
    fetchTasks();
  };

  return (
    <div className="article-column-container">
      <h2>Tâches</h2>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban">
          <div className="kanban-column">
            <div className="kanban-column-title">À faire</div>
            <KanbanContent color="#64a0d259" state={0} tasks={tasks} />
          </div>
          <div className="kanban-column">
            <div className="kanban-column-title">Prochaines tâches</div>
            <KanbanContent color="#d264c359" state={1} tasks={tasks} />
          </div>
          <div className="kanban-column">
            <div className="kanban-column-title">Fait par Maddy</div>
            <KanbanContent color="#6bd26459" state={2} tasks={tasks} double={true} />
            <div className="kanban-column-title">Fait par Mathis</div>
            <KanbanContent color="#6bd26459" state={3} tasks={tasks} double={true} />
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <KanbanItem task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TasksPage;