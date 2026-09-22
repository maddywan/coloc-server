import { useDraggable } from "@dnd-kit/core";
import { Check, Clock } from "lucide-react";

const KanbanItem = ({ task, openTaskModal, blockDrag=false }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id: String(task.id) });
    const formattedLimitDate = new Date(task.limit_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});
    const formattedFinishedDate = new Date(task.finished_date).toLocaleDateString("fr-FR", {day: "2-digit", month: "2-digit", year: "numeric"});
    const dateColor = task.limit_date && new Date(task.limit_date) < new Date().setHours(0,0,0,0)?'red':'orange';
    
    const getPeriodText = () => {
        if (task.period === 1) return "Quotidien";
        else if (task.period === 7) return "Hebdo";
        else if (task.period === 14) return "/ 2 semaines";
        else if (task.period === 21) return "/ 3 semaines";
        else if (task.period === 28) return "/ 4 semaines";
        else if (task.period === 30) return "Mensuel";
        else if (task.period === 60) return "Bimestriel";
        else if (task.period === 90) return "Trimestriel";
        else return "/ "+task.period+" jours";
    }
    const formattedPeriodText = getPeriodText();

    const getBonusReward = () => {
        if (!task.delay_bonus || !task.limit_date || task.finished_date) return 0;
        const days = Math.round((new Date().setHours(0,0,0,0)-new Date(task.limit_date).setHours(0,0,0,0))/86400000);
        return days>0?Math.min(days*5,100):0;
    }
    const bonusReward = getBonusReward();

    const handleEdit = () => {
        openTaskModal(task);
    }

    return (
        <div ref={setNodeRef}>
            <div className="kanban-item top" {...(blockDrag?{}:listeners)} {...attributes} style={{cursor:blockDrag?'not-allowed':'',touchAction:blockDrag?'':'none'}}>
                <div style={{display: "flex", gap: "5px"}}>
                    <div className="kanban-item-title">{task.title}</div>
                    {task.reward>0?<span className="kanban-item-reward">{task.reward}
                    {bonusReward?<span style={{color: '#bd0e0e'}}>+{bonusReward}</span>:''}
                    🪙</span>:''}
                </div>
                {task.label?<div className="kanban-item-label">#{task.label}</div>:''}
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