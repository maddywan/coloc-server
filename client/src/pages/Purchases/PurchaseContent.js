import { useDroppable } from "@dnd-kit/core";
import PurchaseItem from "./PurchaseItem";

const PurchasesContent = ({ color, list, purchases, openPurchaseModal, deletePurchase }) => {
  const { setNodeRef, isOver } = useDroppable({ id: String(list) });

  return (
    <div ref={setNodeRef} className={`kanban-column-content ${isOver ? "drag-over" : ""}`} style={{ backgroundColor: color }}>
      {purchases.filter(purchase => purchase.list === list).map(purchase => (
        <PurchaseItem key={purchase.id} purchase={purchase} openPurchaseModal={openPurchaseModal} deletePurchase={deletePurchase} />
      ))}
    </div>
  );
};

export default PurchasesContent;