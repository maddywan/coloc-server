import { useDraggable } from "@dnd-kit/core";
import { Grip, Trash2 } from "lucide-react";

const PurchaseItem = ({ purchase, openPurchaseModal, deletePurchase }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({ id: String(purchase.id) });

    const handleEdit = () => {
        openPurchaseModal(purchase);
    }

    const handleDelete = async() => {
        deletePurchase(purchase.id);
    }

    return (
        <div ref={setNodeRef}>
            <div className="kanban-item horizontal">
                <div className="kanban-item left">
                    <Grip className="grip" {...listeners} {...attributes}/>
                    <Trash2 className="delete" onClick={handleDelete}/>
                </div>
                <div className="kanban-item right" onClick={handleEdit}>
                    {purchase.title}
                </div>
            </div>
        </div>
    );
};

export default PurchaseItem;