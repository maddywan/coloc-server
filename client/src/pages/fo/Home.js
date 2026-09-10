import React, { useCallback, useEffect, useState } from 'react';
import '../styles.css';
import { Smile, Users, ReceiptText } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import UsersPage from './UsersPage';

const Home = () => {

  /* VARIABLES */

  const [users, setUsers] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const pages = [
    { name: "Humeur", icon: <Smile size={24} />, pageFile: <></> },
    { name: "Tâches", icon: <ReceiptText size={24} />, pageFile: <></> },
    { name: "Colocataires", icon: <Users size={24} />, pageFile: <UsersPage users={users}/> }
  ];
  const [activePage, setActivePage] = useState("Préparation");
  const navigate = useNavigate();
  useEffect(() => {window.scrollTo(0,0);}, [activePage]);

  /* DATABASE */

  const fetchUsers = useCallback(() => {
    fetch("/user")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const fetchAll = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* MODALES */

  /*const openModal = (cocktail) => {
    document.body.classList.add('no-scroll');
    setSelectedCocktail(cocktail);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    document.body.classList.remove('no-scroll');
    setModalIsOpen(false);
    setSelectedCocktail(null);
  };*/

  return (
    <div>
      <div>
        {pages.map((page) => (activePage === page.name && page.pageFile))}
      </div>

      <div className='toolbar-space'></div>
      <div className="bottom-toolbar">
        {pages.map((page) => (
          <button
            key={page.name}
            onClick={() => setActivePage(page.name)}
            className={`toolbar-button ${activePage === page.name ? "active" : ""}`}
          >
            {page.icon}
            <span style={{paddingTop:"5px"}}>{page.name}</span>
          </button>
        ))}
      </div>

      {/* Modals */}

      {/*<CocktailModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        cocktail={selectedCocktail}
      />*/}
    </div>
  );
};

export default Home;
