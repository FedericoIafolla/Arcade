import React, { useState, useEffect, useCallback } from 'react';
import styles from './AffariTuoiGame.module.css';

const REGIONS = [
    "Valle d'Aosta", "Piemonte", "Liguria", "Lombardia", "Trentino-Alto Adige",
    "Veneto", "Friuli-Venezia Giulia", "Emilia-Romagna", "Toscana", "Umbria",
    "Marche", "Lazio", "Abruzzo", "Molise", "Campania",
    "Puglia", "Basilicata", "Calabria", "Sicilia", "Sardegna"
];

const PRIZES = [
    0, 5, 10, 20, 50, 75, 100, 200, 500,
    1000, 5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000, 200000, 300000
];

const formatCurrency = (amount) => {
    return amount.toLocaleString('it-IT'); // Uses Italian locale for thousands separator
};

const calculateNextPacksToOpen = (currentUnopenedNonPlayerPacksCount) => {
    if (currentUnopenedNonPlayerPacksCount <= 1) {
        return 0; // No more packs to open before final offer
    }
    const maxPacksToOpen = currentUnopenedNonPlayerPacksCount - 1; // Ensure at least 1 pack remains
    const randomPacks = Math.floor(Math.random() * 3) + 2; // Random 2, 3, or 4
    return Math.min(randomPacks, maxPacksToOpen);
};

const AffariTuoiGame = ({ onGameOver, onBackToMenu }) => {
    const [packs, setPacks] = useState([]);
    const [playerPackIndex, setPlayerPackIndex] = useState(null);
    const [revealedPrizes, setRevealedPrizes] = useState(new Set());
    const [packsToOpenBeforeOffer, setPacksToOpenBeforeOffer] = useState(0); // How many packs to open before the next offer
    const [packsOpenedThisRound, setPacksOpenedThisRound] = useState(0);
    const [bankerOffer, setBankerOffer] = useState(null);
    const [gamePhase, setGamePhase] = useState('initial_selection'); // initial_selection, opening_packs, offer, game_over
    const [message, setMessage] = useState("Scegli il tuo pacco!");
    const [finalResultSummary, setFinalResultSummary] = useState(null); // To store the final comparison message

    const initializeGame = useCallback(() => {
        const shuffledPrizes = [...PRIZES].sort(() => Math.random() - 0.5);
        const initialPacks = REGIONS.map((region, index) => ({
            id: index,
            region: region,
            prize: shuffledPrizes[index],
            isOpen: false,
            isPlayerPack: false,
            isEliminated: false,
        }));
        setPacks(initialPacks);
        setPlayerPackIndex(null);
        setRevealedPrizes(new Set());
        setPacksOpenedThisRound(0);
        setBankerOffer(null);
        setGamePhase('initial_selection');
        setMessage("Scegli il tuo pacco!");
        setFinalResultSummary(null); // Reset final result summary
        // Set initial packs to open for the first round (random 2, 3, or 4)
        const initialUnopenedNonPlayerPacksCount = REGIONS.length - 1; // 19 packs initially
        setPacksToOpenBeforeOffer(calculateNextPacksToOpen(initialUnopenedNonPlayerPacksCount));
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const handlePackSelection = (index) => {
        if (gamePhase === 'initial_selection') {
            setPlayerPackIndex(index);
            setPacks(prevPacks => prevPacks.map((pack, i) =>
                i === index ? { ...pack, isPlayerPack: true } : pack
            ));
            setGamePhase('opening_packs');
            setMessage(`Hai scelto il pacco della ${REGIONS[index]}.`);
        } else if (gamePhase === 'opening_packs' && index !== playerPackIndex && !packs[index].isOpen && !packs[index].isEliminated) {
            openPack(index);
        } else if (gamePhase === 'awaiting_swap_selection' && index !== playerPackIndex && !packs[index].isOpen && !packs[index].isEliminated) {
            // Perform the swap
            const currentPlayerPack = packs.find(p => p.isPlayerPack);
            const selectedPackToSwapWith = packs[index];

            setPacks(prevPacks => prevPacks.map(pack => {
                if (pack.id === currentPlayerPack.id) {
                    // This was the player's pack, now it's a regular pack
                    return { ...pack, isPlayerPack: false };
                }
                if (pack.id === selectedPackToSwapWith.id) {
                    // This is the new player's pack
                    return { ...pack, isPlayerPack: true };
                }
                return pack;
            }));
            setPlayerPackIndex(selectedPackToSwapWith.id);
            setMessage(`Hai scambiato il tuo pacco con il pacco della ${selectedPackToSwapWith.region}. Continua a giocare!`);
            setBankerOffer(null);
            setPacksOpenedThisRound(0);
            const currentUnopenedNonPlayerPacksCount = packs.filter(p => !p.isOpen && !p.isPlayerPack).length;
            setPacksToOpenBeforeOffer(calculateNextPacksToOpen(currentUnopenedNonPlayerPacksCount));
            setGamePhase('opening_packs');
        } else if (gamePhase === 'final_offer') {
            // Do nothing, pack selection is disabled during final offer
            return;
        }
    };

    const openPack = (index) => {
        setPacks(prevPacks => prevPacks.map((pack, i) =>
            i === index ? { ...pack, isOpen: true } : pack
        ));
        setRevealedPrizes(prev => new Set(prev).add(packs[index].prize));
        setPacksOpenedThisRound(prev => prev + 1);
    };

    useEffect(() => {
        if (gamePhase === 'opening_packs' && packsOpenedThisRound === packsToOpenBeforeOffer) {
            const unopenedNonPlayerPacks = packs.filter(p => !p.isOpen && !p.isPlayerPack);

            if (unopenedNonPlayerPacks.length === 1) { // When only 1 other pack remains
                setGamePhase('final_offer'); // New phase for final offer
                const remainingPrizes = PRIZES.filter(p => !revealedPrizes.has(p));
                const offer = calculateBankerOffer(remainingPrizes); // Banker makes a final offer
                setBankerOffer(offer);
                setMessage("Il Dottore ha un'offerta finale per te!");
            } else {
                // Time for banker's offer
                setGamePhase('offer');
                const remainingPrizes = PRIZES.filter(p => !revealedPrizes.has(p));
                const offer = calculateBankerOffer(remainingPrizes);
                setBankerOffer(offer); // offer is now an object { type: 'cash', value: X } or { type: 'swap' }
                setMessage("Il Dottore ha un'offerta per te!"); // Set generic message
            }
        }
    }, [packsOpenedThisRound, packsToOpenBeforeOffer, gamePhase, revealedPrizes, packs]); // Added packs to dependency array

    const calculateBankerOffer = (remainingPrizes) => {
        if (remainingPrizes.length === 0) return { type: 'cash', value: 0 };

        // Decide between cash offer (65%) or swap offer (35%)
        const offerTypeRoll = Math.random();
        if (offerTypeRoll < 0.35 && remainingPrizes.length > 1) { // 35% chance for swap, only if more than one pack left
            return { type: 'swap' };
        }
        // Otherwise, it's a cash offer (65% chance, or if swap not possible)

        const sum = remainingPrizes.reduce((acc, val) => acc + val, 0);
        const average = sum / remainingPrizes.length;
        let cashOffer = Math.floor(average * (0.6 + Math.random() * 0.2)); // Between 60-80% of average

        // Apply rounding logic
        if (cashOffer >= 10000) {
            cashOffer = Math.round(cashOffer / 5000) * 5000;
        } else if (cashOffer >= 1000) {
            cashOffer = Math.round(cashOffer / 1000) * 1000;
        } else if (cashOffer >= 100) {
            cashOffer = Math.round(cashOffer / 100) * 100;
        } else {
            cashOffer = Math.round(cashOffer / 10) * 10;
        }

        // Ensure offer is not negative and not higher than the highest remaining prize (unless it's 0)
        const maxRemainingPrize = Math.max(...remainingPrizes);
        if (cashOffer > maxRemainingPrize && maxRemainingPrize !== 0) {
            cashOffer = maxRemainingPrize; // Cap offer at max remaining prize
        }
        if (cashOffer < 0) cashOffer = 0; // Ensure no negative offers

        return { type: 'cash', value: cashOffer };
    };

    const handleOfferDecision = (decision) => {
        if (bankerOffer.type === 'cash') {
            if (decision === 'accept') {
                const playerPackPrize = packs.find(p => p.isPlayerPack).prize;
                const acceptedOffer = bankerOffer.value;
                const comparisonMessage = `Hai accettato l'offerta di ${formatCurrency(acceptedOffer)}€! Il tuo pacco conteneva ${formatCurrency(playerPackPrize)}€.\n`;
                if (acceptedOffer > playerPackPrize) {
                    setFinalResultSummary(comparisonMessage + "Hai fatto un ottimo affare!");
                } else if (acceptedOffer < playerPackPrize) {
                    setFinalResultSummary(comparisonMessage + "Avresti potuto vincere di più!");
                } else {
                    setFinalResultSummary(comparisonMessage + "Hai pareggiato!");
                }
                setMessage(""); // Clear the temporary message
                setGamePhase('game_over');
                onGameOver(`Hai vinto ${formatCurrency(acceptedOffer)}€! Nel tuo pacco invece avevi: ${formatCurrency(playerPackPrize)}€.`);
            } else if (decision === 'reject') {
                if (gamePhase === 'final_offer') {
                    handleFinalPackOpen(); // Player rejects final cash offer, opens their pack
                } else {
                setPacksOpenedThisRound(0);
                const currentUnopenedNonPlayerPacksCount = packs.filter(p => !p.isOpen && !p.isPlayerPack).length;
                setPacksToOpenBeforeOffer(calculateNextPacksToOpen(currentUnopenedNonPlayerPacksCount));
                setGamePhase('opening_packs');
                }
            }
        } else if (bankerOffer.type === 'swap') {
            if (decision === 'accept') {
                setMessage("Hai accettato il cambio pacco! Scegli un pacco con cui scambiare.");
                setGamePhase('awaiting_swap_selection');
            } else if (decision === 'reject') {
                if (gamePhase === 'final_offer') {
                    handleFinalPackOpen(); // Player rejects final swap offer, opens their pack
                } else {
                setPacksOpenedThisRound(0);
                const currentUnopenedNonPlayerPacksCount = packs.filter(p => !p.isOpen && !p.isPlayerPack).length;
                setPacksToOpenBeforeOffer(calculateNextPacksToOpen(currentUnopenedNonPlayerPacksCount));
                setGamePhase('opening_packs');
                }
            }
        }
    };




    const handleFinalPackOpen = () => {
        const playerPackPrize = packs[playerPackIndex].prize;
        setMessage(`Hai aperto il tuo pacco! Conteneva ${formatCurrency(playerPackPrize)}€!`);
        setFinalResultSummary(`Hai aperto il tuo pacco! Conteneva ${formatCurrency(playerPackPrize)}€!`);
        setGamePhase('game_over');
        onGameOver(`Hai vinto ${formatCurrency(playerPackPrize)}€!`);
    };

    const renderPacks = () => {
        const otherPacks = packs.filter(p => !p.isPlayerPack);

        return (
            <div className={styles.otherPacksContainer}> {/* Container for all other packs */}
                {otherPacks.map(pack => (
                    <div
                        key={pack.id}
                        className={`${styles.pack} ${pack.isOpen ? styles.open : ''} ${pack.isEliminated ? styles.eliminated : ''}`}
                        onClick={() => handlePackSelection(pack.id)}
                    >
                                                    {pack.isOpen ? (
                                                        <span className={styles.prizeValue}>{formatCurrency(pack.prize)}€</span>
                                                    ) : (                            <span className={styles.packNumber}>{pack.id + 1}</span>
                        )}
                        <span className={styles.packRegion}>{pack.region}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderPrizeList = () => {
        return (
            <div className={styles.prizeList}>
                <h3>Premi Rimanenti</h3>
                <ul>
                    {[...PRIZES].sort((a, b) => a - b).map((prize, index) => (
                        <li key={index} className={revealedPrizes.has(prize) ? styles.eliminatedPrize : ''}>
                            {formatCurrency(prize)}€
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className={styles.affariTuoiGame}>
            <div className={styles.gameHeader}>
                <h2>Affari Tuoi</h2>
                <button className={styles.backBtn} onClick={onBackToMenu}>Torna al Menu</button>
            </div>

            <div className={styles.gameArea}>
                <div className={styles.leftColumn}>
                    {gamePhase !== 'initial_selection' && packs.find(p => p.isPlayerPack) && (
                        <div className={styles.playerPackArea}>
                            <div className={`${styles.pack} ${packs.find(p => p.isPlayerPack).isOpen ? styles.open : ''} ${styles.playerPack}`}>
                                {packs.find(p => p.isPlayerPack).isOpen ? (
                                    <span className={styles.prizeValue}>{formatCurrency(packs.find(p => p.isPlayerPack).prize)}€</span>
                                ) : (
                                    <span className={styles.packNumber}>{packs.find(p => p.isPlayerPack).id + 1}</span>
                                )}
                                <span className={styles.packRegion}>{packs.find(p => p.isPlayerPack).region}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.centerColumn}>
                    <p className={styles.message}>{message}</p>
                    <div className={styles.mainContentArea}>
                        {gamePhase === 'initial_selection' && (
                            <div className={styles.initialPackSelection}>
                                {packs.map(pack => (
                                    <div
                                        key={pack.id}
                                        className={styles.pack}
                                        onClick={() => handlePackSelection(pack.id)}
                                    >
                                        <span className={styles.packNumber}>{pack.id + 1}</span>
                                        <span className={styles.packRegion}>{pack.region}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(gamePhase === 'opening_packs' || gamePhase === 'awaiting_swap_selection') && renderPacks()}

                        {(gamePhase === 'offer' || gamePhase === 'final_offer') && bankerOffer && (
                            <div className={styles.offerContainer}>
                                <p className={styles.offerMessage}>
                                    Offerta del Dottore:
                                    {bankerOffer.type === 'cash' ? ` ${formatCurrency(bankerOffer.value)}€` : ' Cambio Pacco'}
                                </p>
                                <div className={styles.offerButtons}>
                                    <button className={styles.offerBtn} onClick={() => handleOfferDecision('accept')}>Accetta</button>
                                    <button className={styles.offerBtn} onClick={() => handleOfferDecision('reject')}>
                                        {gamePhase === 'final_offer' ? 'Rifiuta e Apri Pacco' : 'Rifiuta'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {gamePhase === 'game_over' && (
                        <div className={styles.gameOverContainer}>
                            {finalResultSummary && <p className={styles.finalResultSummary}>{finalResultSummary}</p>}
                            <button className={styles.resetBtn} onClick={initializeGame}>Gioca Ancora</button>
                        </div>
                    )}
                </div>
                <div className={styles.rightColumn}>
                    {renderPrizeList()}
                </div>
            </div>
        </div>
    );
};

export default AffariTuoiGame;
