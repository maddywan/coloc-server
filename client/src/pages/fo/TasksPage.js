import '../styles.css';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import KanbanColumn from './KanbanColumn';
import KanbanItem from './KanbanItem';
import { useState } from 'react';

const TasksPage = ({ tasks, setTasks, fetchTasks }) => {
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(task => task.id === Number(active.id)));
  };

  const handleDragEnd = async({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const taskId = Number(active.id);
    const newState = Number(over.id);

    setTasks(currentTasks => currentTasks.map(task =>
      task.id === taskId ? { ...task, state: newState } : task
    ));

    try {
      const response = await fetch(`/taskstate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({taskId:taskId,state:newState}),
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
          <KanbanColumn color="#64a0d259" state={0} title="À faire" tasks={tasks} />
          <KanbanColumn color="#d264c359" state={1} title="Prochaines tâches" tasks={tasks} />
          <KanbanColumn color="#6bd26459" state={2} title="Terminées" tasks={tasks} />
        </div>

        <DragOverlay>
          {activeTask ? <KanbanItem task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TasksPage;