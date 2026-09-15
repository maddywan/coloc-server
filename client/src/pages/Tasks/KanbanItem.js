import { useDraggable } from "@dnd-kit/core";
import { Check, Clock } from "lucide-react";

const KanbanItem = ({ task, openTaskModal, blockDrag=false }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id: String(task.id) });
    const formattedLimitDate = new Date(task.limit_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});
    const formattedFinishedDate = new Date(task.finished_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});

    const handleEdit = () => {
        openTaskModal(task);
    }

    return (
        <div ref={setNodeRef}>
            <div className="kanban-item top" {...(blockDrag?{}:listeners)} {...attributes} style={{cursor:blockDrag?'not-allowed':'',touchAction:blockDrag?'':'none'}}>
                <span className="kanban-item-reward">{task.reward}🪙</span> <span className="kanban-item-title">{task.title}</span>
            </div>
            <div className="kanban-item bottom" onClick={blockDrag?()=>{}:handleEdit} style={{cursor:blockDrag?'not-allowed':''}}>
                <div className="kanban-item-description">{task.description}</div>
                {task.limit_date&&task.state<2?<div className="kanban-item-date red"><Clock size={16} /> {formattedLimitDate}</div>:''}
                {task.finished_date?<div className="kanban-item-date green"><Check size={16} /> {formattedFinishedDate}</div>:''}
            </div>
        </div>
    );
};

export default KanbanItem;