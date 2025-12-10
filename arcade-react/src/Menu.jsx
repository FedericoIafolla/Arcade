import React from 'react';
import styles from './Menu.module.css';

const Menu = ({ onGameSelect }) => {
    console.log('Menu component rendering');
    return (
        <div className={styles.container}>
            <div id="home-screen" className={`${styles.screen} ${styles.active}`}>
                <h1 className={styles.mainTitle}>Sala Giochi</h1>
                <div className={styles.gameMenu}>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('snake')}>Snake</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('tris')}>Tris</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('rps')}>Sasso Carta Forbici</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('chess')}>Scacchi</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('connect4')}>Forza 4</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('affari_tuoi')}>Affari Tuoi</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('hangman')}>L'impiccato</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('milionario')}>Chi vuol essere Milionario?</button>
                    <button className={styles.menuBtn} onClick={() => onGameSelect('avanti_un_altro')}>Avanti un Altro</button>
                    {/* More buttons will go here */}
                </div>
            </div>
        </div>
    );
};

export default Menu;