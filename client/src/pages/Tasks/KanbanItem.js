import { useDraggable } from "@dnd-kit/core";
import { Check, Clock } from "lucide-react";

const KanbanItem = ({ task, openTaskModal, blockDrag=false }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id: String(task.id) });
    const formattedLimitDate = new Date(task.limit_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});
    const formattedFinishedDate = new Date(task.finished_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});
    const dateColor = task.limit_date && new Date(task.limit_date) < new Date().setHours(0,0,0,0)?'red':'orange';
    
    const getPeriodText = () => {
        if (task.period === 1) return "Tous les jours";
        else if (task.period === 7) return "Hebdomadaire";
        else if (task.period === 14) return "Toutes les 2 semaines";
        else if (task.period === 21) return "Toutes les 3 semaines";
        else if (task.period === 28) return "Toutes les 4 semaines";
        else if (task.period === 30) return "Mensuel";
        else if (task.period === 60) return "Bimestriel";
        else if (task.period === 90) return "Trimestriel";
        else return "Tous les "+task.period+" jours";
    }
    const formattedPeriodText = getPeriodText();

    const handleEdit = () => {
        openTaskModal(task);
    }

    return (
        <div ref={setNodeRef}>
            <div className="kanban-item top" {...(blockDrag?{}:listeners)} {...attributes} style={{cursor:blockDrag?'not-allowed':'',touchAction:blockDrag?'':'none'}}>
                <span className="kanban-item-reward">{task.reward}🪙</span> <span className="kanban-item-title">{task.title}</span>
            </div>
            <div className="kanban-item bottom" onClick={blockDrag?()=>{}:handleEdit} style={{cursor:blockDrag?'not-allowed':''}}>
                {task.description?<div className="kanban-item-description">{task.description}</div>:''}
                {task.limit_date&&task.state<2?<div style={{display: 'flex', gap: '5px'}}>
                    <div className={`kanban-item-date `+dateColor}><Clock size={16} /> {formattedLimitDate}</div>
                    {task.period>0?<div className="kanban-item-period">{formattedPeriodText}</div>:''}
                </div>:''}
                {task.finished_date?<div className="kanban-item-date green"><Check size={16} /> {formattedFinishedDate}</div>:''}
            </div>
        </div>
    );
};

export default KanbanItem;