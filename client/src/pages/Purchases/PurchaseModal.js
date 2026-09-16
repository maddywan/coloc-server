import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PurchaseModal = ({ isOpen, onRequestClose, purchase }) => {
  const [title, setTitle] = useState(purchase?purchase.title:"");

  useEffect(() => {
    setTitle(purchase?purchase.title:"");
  },[purchase]);
  
  if (!isOpen) return null;

  const handleSavePurchase = async () => {
    if (title!=="") {
      try {
        const response = await fetch(`/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purchaseId:purchase?purchase.id:-1, title }),
        });
  
        if (response.ok) {
          onRequestClose();
        } else {
          alert(`Error with /purchase endpoint.`);
        }
      } catch (error) {
        console.error('Error with /purchase endpoint.', error);
        alert('Error with /purchase endpoint.');
      }
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Purchase Edit"
      className="modal text-left"
      overlayClassName="modal-overlay"
    >
        <h2 className='text-center' style={{marginBlockStart:'0'}}>{purchase.id===-1?"Ajouter un produit":"Modifier le produit"}</h2>
        <br/>
        
        <span>Titre</span>
        <input className='text-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <br/>

        <h3 onClick={handleSavePurchase} className='modal-button btn-success'><Save/>Sauvegarder</h3>
        <h3 onClick={onRequestClose} className='modal-button btn-info'><ArrowLeft/>Retour</h3>
    </Modal>
  );
};

export default PurchaseModal;
