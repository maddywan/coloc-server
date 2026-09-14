import { useDroppable } from "@dnd-kit/core";
import KanbanItem from "./KanbanItem";

const KanbanContent = ({ color, state, tasks, double=false }) => {
  const { setNodeRef, isOver } = useDroppable({ id: String(state) });

  return (
    <div ref={setNodeRef} className={`kanban-column-content ${isOver ? "drag-over" : ""}`} style={{ backgroundColor: color, height: double?'47%':'', marginBottom: double?'18px':'' }}>
      {tasks.filter(task => task.state === state).map(task => (
        <KanbanItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default KanbanContent;