import '../styles.css';

const zones = [
  {id: "Salon", points: "15,15 702,15 702,469 15,469"},
  {id: "Cuisine", points: "15,484 273,484 273,778 15,778"},
  {id: "SDB", points: "15,793 273,793 273,1075 15,1075"},
  {id: "Couloir", points: "288,484 431,484 431,721 522,721 522,1075 431,1075 431,1150 288,1150"},
  {id: "WC", points: "446,484 597,484 597,706 446,706"}
];

const PlanPage = () => {
  return (
    <div>
      <div className="title-bar">
        <h2 className='title-bar-item'>Plan</h2>
        {/*<button className="title-bar-item big-button" onClick={()=>{}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-broom preview-icon"><path d="M13.5 10.5 22 2"/><path d="M14.734 13.841a2 2 0 00-.314-2.42L12.58 9.58a2 2 0 00-2.421-.314l-7.657 4.461A1 1 0 002.3 15.3l6.403 6.403a1 1 0 001.571-.204z"/><path d="m5 18 2-2"/><path d="m7.699 10.7 5.602 5.601"/></svg>
          Aspi / balai</button>
        <button className="title-bar-item big-button" onClick={()=>{}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-cleaning preview-icon"><path d="m16 22-1-4"/><path d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1"/><path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z"/><path d="m8 22 1-4"/></svg>
          Poussières</button>
        <button className="title-bar-item big-button" onClick={()=>{}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mop preview-icon"><path d="M10 22c2.761 0 5-1.79 5-4-4.42 0-4.08-5-8.5-5a1 1 0 100 9za3 3 0 01-3-3"/><path d="M12.5 11.5 22 2"/><path d="m6.98 13.02 2.665-2.664a1.21 1.21 0 011.71 0l2.29 2.288a1.21 1.21 0 010 1.712l-2.088 2.087"/></svg>
          Serpillère</button>*/}
      </div>
      <div style={{textAlign:"center",margin:"10px"}}>
        <svg viewBox="0 0 718 1180" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
          <image href="images/plan.png"/>
          {zones.map((zone) => (
            <polygon key={zone.id} points={zone.points} className="zone" onClick={() => console.log(zone.id)}/>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default PlanPage;