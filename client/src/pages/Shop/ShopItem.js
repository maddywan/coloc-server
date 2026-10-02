const ShopItem = ({ article, openShopModal }) => {
    const handleEdit = () => {
        openShopModal(article);
    }

    return (
        <div className="shop-item">
            <div className="shop-item-top" onClick={handleEdit} style={{ backgroundImage: `url("${article.img_link}")` }}>
                {article.stock>-1?<div className="shop-item-stock">{article.stock} restant{article.stock>1?'s':''}</div>:''}
            </div>
            <div className="shop-item-bottom">
                <div className="shop-item-title">{article.title}</div>
                <button className="shop-item-button">Acheter pour {article.price}🪙</button>
            </div>
        </div>
    );
};

export default ShopItem;