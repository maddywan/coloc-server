import { useDraggable } from "@dnd-kit/core";

const KanbanItem = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: String(task.id) });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="kanban-item">
      <div className="kanban-item-title">• {task.title}</div>
      <div className="kanban-item-description">{task.description}</div>
    </div>
  );
};

export default KanbanItem;