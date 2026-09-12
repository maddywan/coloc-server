import '../styles.css';

const TasksPage = ({ tasks }) => {
  /* DATABASE */

  /*const handleDeleteTask = async (user) => {
    try {
      const response = await fetch(`/deleteuser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId:user.id}),
      });
      if (!response.ok) alert('Impossible de supprimer l\'utilisateur.');
    } catch (error) {
      console.error('Error deleting user :', error);
      alert('Error deleting user.');
    }
    fetchUsers();
  }*/

  return (
    <div className='article-column-container'>
      <h2>Tâches</h2>
      <div className='kanban'>
        <div className='kanban-column'>
          <div className='kanban-column-title'>À faire</div>
          <div className='kanban-column-content todo'>
            {tasks.map((task) =>
              <div className='kanban-item'>
                <div className='kanban-item-title'>• {task.title}</div>
                <div className='kanban-item-description'>{task.description}</div>
              </div>
            )}
          </div>
        </div>
        <div className='kanban-column'>
          <div className='kanban-column-title'>Prochaines tâches</div>
          <div className='kanban-column-content next'>
            
          </div>
        </div>
        <div className='kanban-column'>
          <div className='kanban-column-title'>Terminées</div>
          <div className='kanban-column-content finished'>
            
          </div>
        </div>
      </div>
      {/*users.sort((a,b) => {return a.name.localeCompare(b.name);}).map((user) => {            
        return (
        <>
          <div className='user-list'>
            <div style={{cursor:'pointer',marginLeft:'10px',width:'100%'}}>
              {user.name}
            </div>
          </div>
          <div className={'user-list-infos opened'}>
            <button className='btn-danger'
              onClick={() => {
                if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) {
                  handleDeleteUser(user);
                }
              }}
            ><Trash2 size={20}/> Supprimer l'utilisateur</button>
          </div>
        </>
      )})*/}
    </div>
  );
};

export default TasksPage;
