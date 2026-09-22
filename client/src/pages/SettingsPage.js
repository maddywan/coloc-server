import './styles.css';

const goFullscreen = () => {
    document.documentElement.requestFullscreen();
};

const SettingsPage = ({ settings }) => {
  return (
    <div className='article-column-container'>
      <h2>Paramètres</h2>
      <button className='modal-button info' onClick={goFullscreen}>
        Plein écran
      </button>
    </div>
  );
};

export default SettingsPage;
