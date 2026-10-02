import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ShopModal = ({ isOpen, onRequestClose, article }) => {
  const [userId, setUserId] = useState(article?article.user_id:1);
  const [title, setTitle] = useState(article?article.title:"");
  const [price, setPrice] = useState(article?article.price:0);
  const [enableStock, setEnableStock] = useState(article?article.stock>-1:false)
  const [stock, setStock] = useState(article?article.stock:1);
  const [imgLink, setImgLink] = useState(article?article.img_link:"https://t4.ftcdn.net/jpg/07/91/22/59/360_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg");

  useEffect(() => {
    setUserId(article?article.user_id:1);
    setTitle(article?article.title:"");
    setPrice(article?article.price:0);
    setEnableStock(article?article.stock>-1:false);
    setStock(article?article.stock:1);
    setImgLink(article?article.img_link:"https://t4.ftcdn.net/jpg/07/91/22/59/360_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg");
  },[article]);

  useEffect(() => {
    if (stock < 0) setStock(0);
  },[enableStock,stock]);
  
  if (!isOpen) return null;

  const handleSaveArticle = async () => {
    if (title!=="") {
      try {
        const response = await fetch(`/shop`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ articleId:article?article.id:-1, userId, title, price, stock:enableStock?stock:-1, imgLink}),
        });
  
        if (response.ok) {
          onRequestClose();
        } else {
          alert(`Error with /shop endpoint.`);
        }
      } catch (error) {
        console.error('Error with /shop endpoint.', error);
        alert('Error with /shop endpoint.');
      }
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Shop Edit"
      className="modal text-left"
      overlayClassName="modal-overlay"
    >
        <h2 className='text-center' style={{marginBlockStart:'0'}}>{article.id===-1?"Ajouter un article":"Modifier l'article"}</h2>
        <br/>

        <div className='choice-button-container'>
          <button className={`choice-button left ${userId===1?'selected':''}`} onClick={()=>{setUserId(1)}}>Maddy</button>
          <button className={`choice-button right ${userId===2?'selected':''}`} onClick={()=>{setUserId(2)}}>Mathis</button>
        </div>
        <br/>

        <span>Nom</span>
        <input className='text-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <br/>

        <span>Prix 🪙</span>
        <input className='text-input' type="number" step="10" min="0" max="1000" value={price} onChange={(e) => setPrice(e.target.value?Math.min(e.target.value,1000):'')}/>
        <br/>

        <div style={{display:"flex"}}>
            <input type='checkbox' className='toggleswitch' checked={enableStock} onChange={(e) => setEnableStock(e.target.checked)} style={{margin:"0 0 0 20px"}}/><br/>
            <span style={{margin:"2px 0 0 5px"}}>Stock limité</span>
          </div>
        {enableStock?<>
          <input className='text-input' type="number" step="10" min="0" max="1000" value={stock} onChange={(e) => setStock(e.target.value?Math.min(e.target.value,1000):'')}/>
        </>:''}
        <br/>

        <span>Image</span>
        <input className='text-input' type="text" value={imgLink} onChange={(e) => setImgLink(e.target.value)}/>
        <br/>

        <h3 onClick={handleSaveArticle} className='modal-button success'><Save/>Sauvegarder</h3>
        <br/>
        <h3 onClick={onRequestClose} className='modal-button info'><ArrowLeft/>Retour</h3>
    </Modal>
  );
};

export default ShopModal;
