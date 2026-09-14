import { useDraggable } from "@dnd-kit/core";
import { Check, Clock } from "lucide-react";

const KanbanItem = ({ task }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id: String(task.id) });
    const formattedLimitDate = new Date(task.limit_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});
    const formattedFinishedDate = new Date(task.finished_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="kanban-item">
            <div >
                <span className="kanban-item-reward">{task.reward}🪙</span> <span className="kanban-item-title">{task.title}</span>
            </div>
            <div className="kanban-item-description">{task.description}</div>
            {task.limit_date&&task.state<2?<div className="kanban-item-date red"><Clock size={16} /> {formattedLimitDate}</div>:''}
            {task.finished_date?<div className="kanban-item-date green"><Check size={16} /> {formattedFinishedDate}</div>:''}
        </div>
    );
};

export default KanbanItem;