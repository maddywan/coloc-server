import { useDroppable } from "@dnd-kit/core";
import KanbanItem from "./KanbanItem";

const KanbanColumn = ({ color, state, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id: String(state) });

  return (
    <div className="kanban-column">
      <div className="kanban-column-title">{title}</div>
      <div ref={setNodeRef} className={`kanban-column-content ${isOver ? "drag-over" : ""}`} style={{ backgroundColor: color }}>
        {tasks.filter(task => task.state === state).map(task => (
          <KanbanItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;