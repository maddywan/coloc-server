import { useDroppable } from "@dnd-kit/core";
import KanbanItem from "./KanbanItem";

const KanbanContent = ({ color, state, tasks, openTaskModal, double=false, getRewards }) => {
  const { setNodeRef, isOver } = useDroppable({ id: String(state) });

  return (
    <div ref={setNodeRef} className={`kanban-column-content ${isOver ? "drag-over" : ""}`} style={{ backgroundColor: color }}>
      {tasks.map(task => (
        <KanbanItem key={task.id} task={task} openTaskModal={openTaskModal} blockDrag={double} rewards={getRewards(task.id)} />
      ))}
    </div>
  );
};

export default KanbanContent;