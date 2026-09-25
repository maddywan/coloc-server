import '../styles.css';

const ColocPage = ({ users, globalData, monthlyPoints }) => {
  const globalPoints = globalData.find(data => data.key === "globalpoints");
  
  return (
    <div>
      <div className="title-bar">
        <h2 className='title-bar-item'>Colocation</h2>
      </div>
      <br/>
      <div style={{fontSize:"25px", textAlign:"center"}}>Points totaux de la coloc</div>
      <div style={{fontSize:"100px", textAlign:"center"}}>{globalPoints?globalPoints.value:0}🪙</div>
      <hr/>
      <br/>
      <div style={{fontSize:"25px", textAlign:"center"}}>Détail par mois</div>
      <table>
        {monthlyPoints.map(mp => (
          <tr>
            <td>{["Jan.","Fév.","Mars","Avr.","Mai","Juin","Juil.","Août","Sept.","Oct.","Nov.","Déc"][mp.month-1]} {mp.year}</td>
            <td>{mp.points}🪙</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default ColocPage;
