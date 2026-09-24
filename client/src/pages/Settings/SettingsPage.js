import '../styles.css';

const goFullscreen = () => {
    document.documentElement.requestFullscreen();
};

const SettingsPage = ({ settings }) => {
  return (
    <div>
      <div className="title-bar">
        <h2 className='title-bar-item'>Paramètres</h2>
      </div>
      <button className='modal-button info' onClick={goFullscreen}>
        Plein écran
      </button>
    </div>
  );
};

export default SettingsPage;
