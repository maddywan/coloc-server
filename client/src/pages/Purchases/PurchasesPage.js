import '../styles.css';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import PurchaseContent from './PurchaseContent';
import PurchaseItem from './PurchaseItem';
import { useState } from 'react';
import PurchaseModal from './PurchaseModal';

const PurchasesPage = ({ purchases, setPurchases, fetchPurchases }) => {
  /* MODAL */

  const [purchaseModalIsOpen, setPurchaseModalIsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  
  const openPurchaseModal = (task) => {
    document.body.classList.add('no-scroll');
    setSelectedPurchase(task);
    setPurchaseModalIsOpen(true);
  };

  const closePurchaseModal = () => {
    document.body.classList.remove('no-scroll');
    setPurchaseModalIsOpen(false);
    setSelectedPurchase(null);
    fetchPurchases();
  };

  /* DRAGGING */

  const [activePurchase, setActivePurchase] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, {}));

  const handleDragStart = ({ active }) => {
    setActivePurchase(purchases.find(purchase => purchase.id === Number(active.id)));
  };

  const handleDragEnd = async({ active, over }) => {
    if (!over || activePurchase.list===Number(over.id)) return;
    setActivePurchase(null);

    const purchaseId = Number(active.id);
    const newList = Number(over.id);

    /* DATABASE */

    setPurchases(currentPurchases => currentPurchases.map(purchase =>
      purchase.id === purchaseId ? { ...purchase, list:newList } : purchase
    ));

    try {
      const response = await fetch(`/purchaselist`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({purchaseId:purchaseId, list:newList}),
      });
      if (!response.ok) alert('Failed to change purchase list.');
    } catch (error) {
      console.error('Error updating purchase :', error);
      alert('Error updating purchase.');
    }
    fetchPurchases();
  };
  
  const deletePurchase = async(purchaseId) => {
    try {
      const response = await fetch(`/deletepurchase`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({purchaseId:purchaseId}),
      });
      if (!response.ok) alert('Failed to delete purchase.');
      } catch (error) {
      console.error('Error deleting purchase :', error);
      alert('Error deleting purchase.');
    }
    fetchPurchases();
  }

  /* PAGE */

  return (
    <div className="article-column-container">
      <h2>Listes de courses</h2>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban">
          <div className="kanban-column">
            <div className="kanban-column-title">Commun</div>
            <PurchaseContent color="#aaaaaa59" list={0} purchases={purchases} openPurchaseModal={openPurchaseModal} deletePurchase={deletePurchase} />
          </div>
          <div className="kanban-column">
              <div className="kanban-column-title">Maddy</div>
              <PurchaseContent color="#d2646459" list={1} purchases={purchases} openPurchaseModal={openPurchaseModal} deletePurchase={deletePurchase} />
          </div>
          <div className="kanban-column-double">
            <div className="kanban-column">
              <div className="kanban-column-title">Mathis</div>
              <PurchaseContent color="#647ed259" list={2} purchases={purchases} openPurchaseModal={openPurchaseModal} deletePurchase={deletePurchase} />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activePurchase ? <PurchaseItem purchase={activePurchase} /> : null}
        </DragOverlay>
      </DndContext>

      <PurchaseModal
        isOpen={purchaseModalIsOpen}
        onRequestClose={closePurchaseModal}
        purchase={selectedPurchase}
      />

      <button className="overlay-button" onClick={()=>{openPurchaseModal({id:-1,title:""})}}>+ Ajouter un produit</button>
    </div>
  );
};

export default PurchasesPage;