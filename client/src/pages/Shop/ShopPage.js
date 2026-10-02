import { useState } from 'react';
import '../styles.css';
import ShopItem from './ShopItem';
import ShopModal from './ShopModal';

const ShopPage = ({ shop, fetchShop }) => {
  /* MODAL */
  
  const [shopModalIsOpen, setShopModalIsOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const openShopModal = (article) => {
    document.body.classList.add('no-scroll');
    setSelectedArticle(article);
    setShopModalIsOpen(true);
  };

  const closeShopModal = () => {
    document.body.classList.remove('no-scroll');
    setShopModalIsOpen(false);
    setSelectedArticle(null);
    fetchShop();
  };

  return (
    <div>
      <div className="title-bar">
        <h2 className='title-bar-item'>Boutique</h2>
      </div>

      <div className='shop-container'>
        <div className="shop-section">
          <h2 className='text-center'>Vitrine de Maddy</h2>
          <div className='shop-articles-list'>
            {shop.filter(a => a.user_id===1).map(article => <ShopItem article={article} openShopModal={openShopModal} />)}
          </div>
        </div>
        <hr className='shop-hr'/>
        <div className="shop-section">
          <h2 className='text-center'>Vitrine de Mathis</h2>
          <div className='shop-articles-list'>
            {shop.filter(a => a.user_id===2).map(article => <ShopItem article={article} openShopModal={openShopModal} />)}
          </div>
        </div>
      </div>

      <ShopModal
        isOpen={shopModalIsOpen}
        onRequestClose={closeShopModal}
        article={selectedArticle}
      />
    </div>
  );
};

export default ShopPage;
