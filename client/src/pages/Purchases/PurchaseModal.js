import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PurchaseModal = ({ isOpen, onRequestClose, purchase }) => {
  const [title, setTitle] = useState(purchase?purchase.title:"");
  const [list, setList] = useState(0);

  useEffect(() => {
    setTitle(purchase?purchase.title:"");
    setList(purchase?purchase.list:0);
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
          body: JSON.stringify({ purchaseId:purchase?purchase.id:-1, title, list}),
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
        
        <span>Nom</span>
        <input className='text-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <br/>

        <div className='choice-button-container'>
          <button className={`choice-button left ${list===0?'selected':''}`} onClick={()=>{setList(0)}}>Commun</button>
          <button className={`choice-button ${list===1?'selected':''}`} onClick={()=>{setList(1)}}>Maddy</button>
          <button className={`choice-button right ${list===2?'selected':''}`} onClick={()=>{setList(2)}}>Mathis</button>
        </div>
        <br/>

        <h3 onClick={handleSavePurchase} className='modal-button success'><Save/>Sauvegarder</h3>
        <br/>
        <h3 onClick={onRequestClose} className='modal-button info'><ArrowLeft/>Retour</h3>
    </Modal>
  );
};

export default PurchaseModal;
