import { useDraggable } from "@dnd-kit/core";

const KanbanItem = ({ task }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id: String(task.id) });
    const formattedDate = new Date(task.limit_date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="kanban-item">
            <div >
                <span className="kanban-item-reward">{task.reward}🪙</span> <span className="kanban-item-title">{task.title}</span>
            </div>
            <div className="kanban-item-description">{task.description}</div>
            {task.limit_date?<div className="kanban-item-limit-date">{formattedDate}</div>:''}
        </div>
    );
};

export default KanbanItem;