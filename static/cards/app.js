//##############################################################################################################################
//#### DATA MAPPING ####
//##############################################################################################################################

const SET_MAPPING = {
    "T": "Terrains",
    "A": "Alternatives",
    "PROMO": "Promos",
    "SOE": "01 - Seal of Exodia",
    "KOD": "02 - King of Duelists",
    "LEN": "03 - Loose Ends",
    "MLY": "04 - Millennium Legacy",
    "TEG": "05 - The Egyptian Gods",
    "NPH": "06 - Nameless Pharaoh",
    "ROA": "07 - Rebirth of Avatar",
    "ORB": "08 - Orichalcos Barrier",
    "PYL": "09 - Pyramid of Light",
    "WOM": "10 - World of Memories",
};

// Los datos salen del script de Sheets ya como JSON, así que se cargan
// directamente. Agregar un set es sumar una línea acá y nada más: antes había
// que tocar también el <script src> del HTML y la lista de constantes, y
// olvidarse de esta última hacía que el set se descargara sin aparecer nunca.
// El orden define el orden por defecto del grid ("Sort: Set order"), así que
// respeta el que tenía CARDS_DATABASE: primero los capítulos, después los extras.
// Alternatives NO está: sus 19 entradas no eran cartas sino artes de 7 cartas,
// y ahora se modelan como tales (ver ARTWORKS_FILE).
const CARD_FILES = [
    '001_1.json', '001_2.json', '001_3.json', '001_4.json', '001_5.json',
    '000_T.json', '000_P.json',
];

// { "SOE-023": ["SOE-023A"], ... } — la carta y los ids de sus artes alternativos.
// Pesa ~400 bytes, así que se carga siempre.
const ARTWORKS_FILE = 'artworks.json';
const ALT_ART_SET = 'A'; // las imágenes alternativas viven en cards/A/

// cardid -> [url por defecto, ...urls alternativas]
const artworksByCard = new Map();
// cardid -> índice elegido. Una sola elección por carta: si tenés 3 copias,
// las 3 usan el mismo arte, que es lo que uno quiere para un mazo.
const selectedArtwork = new Map();

// Card and decks limits
const CARDS_PER_PAGE = 120;
const DECK_LIMITS = {
    A: 30,
    B: 20,
    C: 20
}

const CARD_SIZES = { s: '140px', l: '215px' };
const DEFAULT_CARD_SIZE = 'l';

//###################
//#### STATE ####
//###################

let cardsData = [];
let deck = [];
let searchResults = [];   // resultado crudo del buscador, antes de ordenar
let filteredCards = [];   // searchResults ya ordenado
let currentPage = 1;
let totalFilteredCards = 0;
let searcher = null;
let selectedMulti = { types: [], fpb: [] };
let currentSort = 'default';
let lastDeckTotal = 0;
let lastPopupPoint = null;

const cardImagePath = "https://zudest.github.io/KingdomDuelsDeckbuilder/";
const defaultCardBack = cardImagePath + "cards/Cardback.png";

function changePage(newPage) {
    currentPage = newPage;
    renderCards();
    const content = document.querySelector('.content');
    if (content.scrollTo) content.scrollTo({ top: 0, behavior: 'smooth' });
    else content.scrollTop = 0;
};

//###################
//#### BOOTSTRAP ####
//###################

function fetchCardFile(file) {
    return fetch('data/' + file).then(response => {
        if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
        return response.json();
    });
}

async function loadCardsData() {
    showGridMessage('Loading cards...');

    let artworks = {};
    try {
        // Los artes se piden en paralelo, pero el mapa se arma más abajo, cuando
        // las cartas ya tienen su `image` derivada.
        const [parts, fetchedArtworks] = await Promise.all([
            Promise.all(CARD_FILES.map(fetchCardFile)),
            // Si falla se pierde sólo la elección de arte, no el catálogo
            fetchCardFile(ARTWORKS_FILE).catch(error => {
                console.error('Error loading artworks:', error);
                return {};
            }),
        ]);
        cardsData = parts.flat();
        artworks = fetchedArtworks || {};
    } catch (error) {
        // Antes, si un <script> de datos no cargaba, la app moría en silencio
        console.error('Error loading the card database:', error);
        showGridMessage('Could not load the card database. Please reload the page.');
        return;
    }

    // Add new fields
    cardsData.forEach(card => {
        card.cardid = card.set + "-" + card.id;
        card.image = cardImagePath + `cards/${card.set}/${card.id}.jpg`;
        card.fullSet = SET_MAPPING[card.set] || card.set;
    });

    buildArtworks(artworks);

    searchResults = [...cardsData];
    filteredCards = [...cardsData];
    totalFilteredCards = filteredCards.length;

    initializeFilters();

    searcher = setupAdvancedSearch(cardsData);
    // el motor necesita saber cuáles tienen artes alternativos para `alt:`
    searcher.altArtCards = new Set(artworksByCard.keys());
    initFilterSections();
    initLiveFilters();
    initSidebarTabs();
    initDrawer();
    initCardSize();
    initSort();
    initSearchClear();
    initSyntaxToggle();
    initDecksModal();
    initArtworkNav();
    initGlobalKeys();

    refreshDeckUI();
    applyUrlState();
}

//#######################
//#### MAZOS GUARDADOS ####
//#######################

// decks/index.json es sólo una lista de nombres de archivo; el nombre, autor y
// portada viven dentro de cada mazo, en un único lugar. Como pesan ~500 bytes,
// se traen todos juntos al abrir el modal y así los conteos salen de los datos
// reales en vez de estar duplicados en el índice.
const DECKS_DIR = 'decks/';
const DECKS_INDEX = DECKS_DIR + 'index.json';

let savedDecks = null;      // [{ slug, name, author, cover, cards }]
let savedDecksPromise = null;

// El slug es el nombre de archivo: el filesystem ya garantiza que sea único
function deckSlug(file) {
    return String(file).replace(/\.json$/i, '');
}

function fetchJson(url) {
    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
        return response.json();
    });
}

function loadSavedDecks() {
    if (savedDecksPromise) return savedDecksPromise;

    savedDecksPromise = fetchJson(DECKS_INDEX)
        .then(files => Promise.all((files || []).map(file =>
            fetchJson(DECKS_DIR + file)
                .then(data => ({ slug: deckSlug(file), file, ...data }))
                .catch(error => {
                    console.error('Error loading deck:', error);
                    return null;
                })
        )))
        .then(decks => {
            savedDecks = decks.filter(Boolean);
            warnDuplicateDeckNames(savedDecks);
            return savedDecks;
        })
        .catch(error => {
            savedDecksPromise = null; // permitir reintento
            throw error;
        });

    return savedDecksPromise;
}

// Dos mazos con el mismo nombre son indistinguibles en la grilla. El slug sigue
// siendo único (es el archivo), así que ?deck= no se rompe, pero conviene saberlo.
function warnDuplicateDeckNames(decks) {
    const seen = new Map();
    decks.forEach(d => {
        const key = String(d.name || '').trim().toLowerCase();
        if (!key) {
            console.warn(`decks: "${d.file}" no tiene "name"`);
            return;
        }
        if (seen.has(key)) {
            console.warn(`decks: "${d.name}" está duplicado en ${seen.get(key)} y ${d.file}`);
        } else {
            seen.set(key, d.file);
        }
    });
}

function deckCoverImage(entry) {
    const codes = [entry.cover, ...(entry.cards || [])].filter(Boolean);
    for (const code of codes) {
        const [cardid, artRaw] = String(code).split('#');
        const card = cardsData.find(c => c.cardid === cardid);
        if (card) return cardImage({ ...card, art: parseInt(artRaw, 10) || 0 });
    }
    return null;
}

function deckCounts(entry) {
    const counts = { A: 0, B: 0, C: 0 };
    (entry.cards || []).forEach(code => {
        const card = cardsData.find(c => c.cardid === String(code).split('#')[0]);
        if (card) counts[card.deck]++;
    });
    return counts;
}

function setDecksStatus(text, isError) {
    const el = document.getElementById('decksStatus');
    el.textContent = text || '';
    el.hidden = !text;
    el.classList.toggle('is-error', !!isError);
}

function buildDeckCard(entry) {
    const counts = deckCounts(entry);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'deck-tile';
    card.dataset.slug = entry.slug;

    const cover = deckCoverImage(entry);
    const art = document.createElement('div');
    art.className = 'deck-tile-art';
    if (cover) {
        const img = document.createElement('img');
        img.src = cover;
        img.alt = '';
        img.setAttribute('loading', 'lazy');
        art.appendChild(img);
    }
    card.appendChild(art);

    const body = document.createElement('div');
    body.className = 'deck-tile-body';

    const name = document.createElement('span');
    name.className = 'deck-tile-name';
    name.textContent = entry.name || entry.slug;

    const author = document.createElement('span');
    author.className = 'deck-tile-author';
    author.textContent = entry.author ? `by ${entry.author}` : '';

    const meta = document.createElement('span');
    meta.className = 'deck-tile-meta';
    meta.textContent = `${counts.A} main · ${counts.B} extra` + (counts.C ? ` · ${counts.C} others` : '');

    body.append(name, author, meta);
    card.appendChild(body);

    card.addEventListener('click', () => loadSavedDeck(entry.slug));
    return card;
}

function renderDecksGrid(decks) {
    const grid = document.getElementById('decksGrid');
    grid.textContent = '';

    if (!decks.length) {
        setDecksStatus('No sample decks yet.', false);
        return;
    }

    setDecksStatus('', false);
    decks.forEach(entry => grid.appendChild(buildDeckCard(entry)));
}

function openDecksModal() {
    const modal = document.getElementById('decksModal');
    modal.hidden = false;
    document.getElementById('decksGrid').textContent = '';

    if (savedDecks) {
        renderDecksGrid(savedDecks);
        return;
    }

    setDecksStatus('Loading decks...', false);
    loadSavedDecks()
        .then(renderDecksGrid)
        .catch(error => {
            console.error('Error loading sample decks:', error);
            setDecksStatus('Could not load the deck list.', true);
        });
}

function closeDecksModal() {
    document.getElementById('decksModal').hidden = true;
}

// Cargar reemplaza el mazo actual, así que se confirma si hay algo armado
function loadSavedDeck(slug, options) {
    const entry = (savedDecks || []).find(d => d.slug === slug);
    if (!entry) return false;

    const skipConfirm = options && options.confirm === false;
    if (deck.length && !skipConfirm &&
        !confirm(`Load "${entry.name || slug}"? This replaces your current deck.`)) {
        return false;
    }

    applyDeckData(entry);
    closeDecksModal();
    return true;
}

function initDecksModal() {
    document.getElementById('decksToggle').addEventListener('click', openDecksModal);
    document.getElementById('decksClose').addEventListener('click', closeDecksModal);
    document.getElementById('decksModal').addEventListener('click', event => {
        if (event.target.id === 'decksModal') closeDecksModal();
    });
}

//##################
//#### ARTWORKS ####
//##################

// Un arte alternativo NO es una carta: es otra ilustración de la misma. Cuando
// eran entradas propias, buscar "Spirit Message" devolvía 7 resultados, iban al
// deck equivocado y no respondían a ningún filtro porque no tenían datos.
function buildArtworks(artworks) {
    artworksByCard.clear();
    const known = new Set(cardsData.map(card => card.cardid));

    Object.keys(artworks).forEach(cardid => {
        const card = cardsData.find(c => c.cardid === cardid);
        if (!card) {
            console.warn(`artworks.json: la carta "${cardid}" no existe`);
            return;
        }
        const alternates = (artworks[cardid] || []).filter(altId => {
            if (known.has(altId)) {
                console.warn(`artworks.json: "${altId}" también existe como carta`);
                return false;
            }
            return true;
        });
        if (!alternates.length) return;

        artworksByCard.set(cardid, [
            card.image,
            ...alternates.map(altId => `${cardImagePath}cards/${ALT_ART_SET}/${altId}.jpg`),
        ]);
    });
}

function artworkCount(card) {
    const list = artworksByCard.get(card.cardid);
    return list ? list.length : 1;
}

// Índice que se está MIRANDO en el grid. Es estado de exploración: al agregar
// una carta al mazo el arte se congela en la entrada (ver addToDeck), así que
// cambiar de arte acá no toca lo que ya armaste.
function artworkIndex(card) {
    return selectedArtwork.get(card.cardid) || 0;
}

// Qué arte corresponde a ESTE objeto: una entrada de mazo trae el suyo
// congelado; una carta del catálogo usa el que se está mirando.
function currentArtIndex(card) {
    return card.art !== undefined ? card.art : artworkIndex(card);
}

function cardImage(card) {
    const list = artworksByCard.get(card.cardid);
    if (!list) return card.image;
    return list[currentArtIndex(card)] || list[0];
}

// La elección es por carta y global: las 3 copias de un mazo comparten arte
function cycleArtwork(card, step) {
    const list = artworksByCard.get(card.cardid);
    if (!list || list.length < 2) return;
    const next = (artworkIndex(card) + step + list.length) % list.length;
    selectedArtwork.set(card.cardid, next);
    refreshCardImages(card.cardid);
}

// Cambia las imágenes en el sitio en vez de re-renderizar todo
function refreshCardImages(cardid) {
    const card = cardsData.find(c => c.cardid === cardid);
    if (!card) return;
    const url = cardImage(card);

    document.querySelectorAll(`#cardGrid .card[data-cardid="${cardid}"] img`)
        .forEach(img => { img.src = url; });

    const popup = document.getElementById('cardPopup');
    if (popup.style.display !== 'none' && popup.dataset.cardid === cardid) {
        document.getElementById('popupImage').src = url;
        updateArtworkControls(card);
        // el detalle incluye "Artwork 2 of 6": hay que rehacerlo
        if (!popup.classList.contains('image-only')) renderPopupDetails(card);
    }
}

document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    importDeck(file);
});

//###################
//#### UI CHROME ####
//###################

function switchTab(name) {
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        const on = tab.dataset.tab === name;
        tab.setAttribute('aria-selected', String(on));
        tab.classList.toggle('active', on);
    });
    document.getElementById('panel-filters').hidden = name !== 'filters';
    document.getElementById('panel-deck').hidden = name !== 'deck';
    try { localStorage.setItem('kd-tab', name); } catch (e) { /* modo privado */ }
}

function initSidebarTabs() {
    const tabs = [...document.querySelectorAll('.sidebar-tab')];
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

    // Patrón ARIA: ←/→ mueve entre pestañas
    document.querySelector('.sidebar-tabs').addEventListener('keydown', e => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const i = tabs.indexOf(document.activeElement);
        if (i === -1) return;
        e.preventDefault();
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        switchTab(next.dataset.tab);
    });

    let saved = null;
    try { saved = localStorage.getItem('kd-tab'); } catch (e) { /* modo privado */ }
    switchTab(saved === 'deck' ? 'deck' : 'filters');
}

function toggleDrawer(force) {
    const open = force !== undefined ? force : !document.body.classList.contains('drawer-open');
    document.body.classList.toggle('drawer-open', open);
    document.getElementById('drawerToggle').setAttribute('aria-expanded', String(open));
    document.getElementById('drawerBackdrop').hidden = !open;
}

function initDrawer() {
    document.getElementById('drawerToggle').addEventListener('click', () => toggleDrawer());
    document.getElementById('drawerBackdrop').addEventListener('click', () => toggleDrawer(false));
}

function setCardSize(size) {
    // 'm' existió en una versión previa: los valores guardados caen al default
    if (!CARD_SIZES[size]) size = DEFAULT_CARD_SIZE;
    document.documentElement.style.setProperty('--card-min', CARD_SIZES[size]);
    document.querySelectorAll('.size-toggle button').forEach(b =>
        b.setAttribute('aria-pressed', String(b.dataset.size === size)));
    try { localStorage.setItem('kd-card-size', size); } catch (e) { /* modo privado */ }
}

function initCardSize() {
    document.querySelectorAll('.size-toggle button').forEach(b =>
        b.addEventListener('click', () => setCardSize(b.dataset.size)));
    let saved = null;
    try { saved = localStorage.getItem('kd-card-size'); } catch (e) { /* modo privado */ }
    setCardSize(saved || DEFAULT_CARD_SIZE);
}

function initSort() {
    const sel = document.getElementById('sortSelect');
    let saved = null;
    try { saved = localStorage.getItem('kd-sort'); } catch (e) { /* modo privado */ }
    if (saved && SORTERS.hasOwnProperty(saved)) {
        currentSort = saved;
        sel.value = saved;
    }
    sel.addEventListener('change', () => {
        currentSort = sel.value;
        try { localStorage.setItem('kd-sort', currentSort); } catch (e) { /* modo privado */ }
        applySort();
    });
}

function initSearchClear() {
    const input = document.getElementById('advancedSearch');
    const clear = document.getElementById('searchClear');
    const sync = () => { clear.hidden = !input.value; };
    input.addEventListener('input', sync);
    clear.addEventListener('click', () => {
        input.value = '';
        sync();
        runSearch();
        updateUrlSearch(buildFullQuery());
        input.focus();
    });
    sync();
}

function initSyntaxToggle() {
    const btn = document.getElementById('syntaxToggle');
    const panel = document.getElementById('syntaxContent');
    btn.addEventListener('click', () => {
        const open = panel.hidden;
        panel.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
    });
}

function popupCard() {
    const cardid = document.getElementById('cardPopup').dataset.cardid;
    return cardid ? cardsData.find(c => c.cardid === cardid) : null;
}

function initArtworkNav() {
    const step = n => () => {
        const card = popupCard();
        if (card) cycleArtwork(card, n);
    };
    document.getElementById('artworkPrev').addEventListener('click', step(-1));
    document.getElementById('artworkNext').addEventListener('click', step(1));
}

function initGlobalKeys() {
    document.addEventListener('keydown', e => {
        // ←/→ recorren los artes mientras el popup está abierto
        const popup = document.getElementById('cardPopup');
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
            popup.classList.contains('interactive') && popup.style.display !== 'none') {
            const card = popupCard();
            if (card && artworkCount(card) > 1) {
                e.preventDefault();
                cycleArtwork(card, e.key === 'ArrowRight' ? 1 : -1);
                return;
            }
        }

        if (e.key !== 'Escape') return;
        document.getElementById('cardPopup').style.display = 'none';
        document.getElementById('previewContainer').style.display = 'none';
        closeDecksModal();
        const syntax = document.getElementById('syntaxContent');
        if (!syntax.hidden) {
            syntax.hidden = true;
            document.getElementById('syntaxToggle').setAttribute('aria-expanded', 'false');
        }
        if (document.body.classList.contains('drawer-open')) toggleDrawer(false);
    });
}

//#################
//#### SORTING ####
//#################

// parseFloat sobre valores que pueden ser "X000", "//" o texto: null si no es numérico
function numOrNull(v) {
    if (v === undefined || v === null || v === '') return null;
    const n = parseFloat(v);
    return Number.isNaN(n) ? null : n;
}

const SORTERS = {
    'default': null,
    'name-asc': (a, b) => a.name.localeCompare(b.name),
    'name-desc': (a, b) => b.name.localeCompare(a.name),
};

function applySort() {
    const sorter = SORTERS[currentSort];
    filteredCards = sorter ? [...searchResults].sort(sorter) : [...searchResults];
    totalFilteredCards = filteredCards.length;
    currentPage = 1;
    renderCards();
}

//#########################
//#### IMPORT / EXPORT ####
//#########################

function showImportMessage(text, isError) {
    const el = document.getElementById('importError');
    el.textContent = text;
    el.classList.toggle('is-warning', !isError);
    el.style.display = text ? 'block' : 'none';
}

// Convierte una lista ["SOE-002", "NPH-010#3"] en entradas de mazo, recortando
// lo que no entre. La usan tanto el import por archivo como los mazos guardados,
// para que la validación viva en un solo lugar.
function buildDeckFromCodes(codes) {
    const entries = [];
    const counts = { A: 0, B: 0, C: 0 };
    const unknown = [];
    const overflow = [];

    codes.forEach(cardCode => {
        const [cardid, artRaw] = String(cardCode).split('#');
        const card = cardsData.find(c => c.cardid === cardid);
        if (!card) {
            unknown.push(cardCode);
            return;
        }
        const key = card.deck;
        if (counts[key] >= DECK_LIMITS[key]) {
            overflow.push(card.name);
            return;
        }
        counts[key]++;
        // Un arte que ya no exista cae al por defecto en vez de romper
        const art = Math.min(parseInt(artRaw, 10) || 0, artworkCount(card) - 1);
        entries.push({ ...card, art: Math.max(0, art) });
    });

    return { entries, unknown, overflow };
}

// Reemplaza el mazo actual. Un JSON con 80 cartas de Main Deck entraba entero
// antes de esto y dejaba un estado que addToDeck jamás habría permitido.
function applyDeckData(data) {
    if (!data || !Array.isArray(data.cards)) {
        throw new Error('Invalid file format');
    }

    const { entries, unknown, overflow } = buildDeckFromCodes(data.cards);
    deck = entries;

    refreshDeckUI();
    switchTab('deck');

    const notes = [];
    if (overflow.length) notes.push(`${overflow.length} card(s) skipped: deck limit reached`);
    if (unknown.length) notes.push(`${unknown.length} card(s) not found in the database`);
    showImportMessage(notes.join(' · '), false);
}

async function importDeck(file) {
    showImportMessage('', true);

    if (!file) return;

    try {
        applyDeckData(JSON.parse(await file.text()));
    } catch (error) {
        console.error('Error importing the deck:', error);
        showImportMessage('Error importing the deck', true);
    }
}

// Generate simulator data for KDSim compatibility
function generateSimulatorData(deck) {
    const simulatorData = {
        mainDeck: [],
        extraDeck: [],
        otherCards: []
    };

    deck.forEach(card => {
        const simCard = {
            cardId: card.cardid,
            name: card.name,
            type: card.frame,
            description: "",
            image: cardImage(card)
        };

        if (card.deck === 'A') {
            simulatorData.mainDeck.push(simCard);
        } else if (card.deck === 'B') {
            simulatorData.extraDeck.push(simCard);
        } else if (card.deck === 'C') {
            simulatorData.otherCards.push(simCard);
        }
    });

    return simulatorData;
}

function exportDeckJSON() {
    const deckData = {
        // "NPH-010" para el arte por defecto y "NPH-010#3" para un alternativo:
        // los mazos exportados antes de esto siguen importándose igual.
        cards: deck.map(card => card.art ? `${card.cardid}#${card.art}` : card.cardid),
        simulator: generateSimulatorData(deck)
    };

    const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kingdomduels_deck.json';
    a.click();
    window.URL.revokeObjectURL(url);
}

//#################
//#### FILTERS ####
//#################

// El combo multi es la fuente de verdad de QUÉ valores están elegidos;
// selectedMulti agrega el signo +/− de cada uno y sobrevive a los cambios.
function syncMulti(key, values) {
    const previous = new Map(selectedMulti[key].map(t => [t.value, t.negative]));
    selectedMulti[key] = values.map(value => ({
        value,
        negative: previous.get(value) || false,
    }));
    renderMultiTags(key);
}

function addMultiTag(key, value, isNegative = false) {
    if (!value || selectedMulti[key].some(t => t.value === value)) return;
    const next = combos[key].getValue().concat(value);
    combos[key].setValue(next);
    syncMulti(key, next);
    if (isNegative) toggleMultiNegative(key, selectedMulti[key].length - 1);
    else onMultiChanged(key);
}

function removeMultiTag(key, index) {
    const entry = selectedMulti[key][index];
    if (!entry) return;
    combos[key].setValue(combos[key].getValue().filter(v => v !== entry.value));
    selectedMulti[key].splice(index, 1);
    onMultiChanged(key);
}

function toggleMultiNegative(key, index) {
    selectedMulti[key][index].negative = !selectedMulti[key][index].negative;
    onMultiChanged(key);
}

function onMultiChanged(key) {
    renderMultiTags(key);
    runSearch();
    updateUrlSearch(buildFullQuery());
}

// createElement + textContent en vez de innerHTML: los valores llegaban antes
// desde un input libre y `<img src=x onerror=...>` se ejecutaba.
function renderMultiTags(key) {
    const def = MULTI_DEFS.find(d => d.key === key);
    const container = document.getElementById(def.tagsId);
    container.textContent = '';

    selectedMulti[key].forEach((entry, index) => {
        const shown = displayToken(entry.value);

        const tag = document.createElement('div');
        tag.className = 'type-tag ' + (entry.negative ? 'negative' : 'positive');

        const prefix = document.createElement('button');
        prefix.type = 'button';
        prefix.className = 'type-prefix';
        prefix.textContent = entry.negative ? '−' : '+';
        prefix.title = 'Click to toggle include/exclude';
        prefix.setAttribute('aria-label', `Toggle ${shown} include or exclude`);
        prefix.addEventListener('click', () => toggleMultiNegative(key, index));

        const value = document.createElement('span');
        value.className = 'type-value';
        value.textContent = shown;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'type-remove';
        remove.textContent = '×';
        remove.title = 'Remove';
        remove.setAttribute('aria-label', `Remove ${shown}`);
        remove.addEventListener('click', () => removeMultiTag(key, index));

        tag.append(prefix, value, remove);
        container.appendChild(tag);
    });
}

// Cuenta valores distintos de un campo simple
function countBy(field) {
    const counts = new Map();
    cardsData.forEach(card => {
        const value = card[field];
        if (value === undefined || value === null || value === '') return;
        counts.set(value, (counts.get(value) || 0) + 1);
    });
    return counts;
}

// duelist y types son multivalor separados por espacios, igual que los indexa
// search.js: el vocabulario real son tokens sueltos, no la cadena completa.
function countByToken(field) {
    const counts = new Map();
    cardsData.forEach(card => {
        (card[field] || '').split(' ').forEach(raw => {
            const token = raw.trim();
            if (!token) return;
            counts.set(token, (counts.get(token) || 0) + 1);
        });
    });
    return counts;
}

// Orden de los frames en el combo. Editá esta lista para cambiarlo: lo que no
// esté acá queda al final, alfabéticamente. Se compara sin guiones bajos, así
// que sirve con "Alter Monster" y con "Alter_Monster".
const FRAME_ORDER = [
    'Rule',
    'Monster',
    'Alter Monster',
    'Fusion Monster',
    'Ritual Monster',
    'Integration Monster',
    'Token Monster',
    'Spell',
    'Trap',
    'Combination',
    'Terrain',
];

// Los valores que no empiezan con letra ("(Hierarchy 1)", "-") van después de
// los alfabéticos en vez de encabezar la lista.
function defaultOptionSort(a, b) {
    const aAlpha = /^\p{L}/u.test(a.label);
    const bAlpha = /^\p{L}/u.test(b.label);
    if (aAlpha !== bAlpha) return aAlpha ? -1 : 1;
    return a.label.localeCompare(b.label);
}

function frameOptionSort(a, b) {
    const rank = value => {
        const i = FRAME_ORDER.indexOf(displayToken(value));
        return i === -1 ? FRAME_ORDER.length : i;
    };
    const ra = rank(a.value), rb = rank(b.value);
    if (ra !== rb) return ra - rb;
    return defaultOptionSort(a, b);
}

function toOptions(counts, { label = v => v, sort } = {}) {
    const list = [...counts.entries()].map(([value, count]) => ({ value, label: label(value), count }));
    list.sort(sort || defaultOptionSort);
    return list;
}

// Los términos multipalabra viajan como un token con guion bajo ("Alter_Monster")
// para que el índice no los parta; al usuario se le muestran con espacio.
function displayToken(value) {
    return String(value).replace(/_/g, ' ');
}

// Un grade es numérico si TODOS sus gradeval lo son. Se calcula de los datos,
// así que RNK/MGN y los grades de Terrain funcionan solos cuando se agreguen.
function analyzeGrades() {
    const byGrade = new Map();

    cardsData.forEach(card => {
        if (!card.grade) return;
        if (!byGrade.has(card.grade)) byGrade.set(card.grade, new Map());
        const value = card.gradeval;
        if (value === undefined || value === null || value === '') return;
        const values = byGrade.get(card.grade);
        values.set(value, (values.get(value) || 0) + 1);
    });

    const info = {};
    byGrade.forEach((values, grade) => {
        const keys = [...values.keys()];
        const override = GRADE_VALUE_KIND[String(grade).toLowerCase()];
        const numeric = override
            ? override === 'numeric'
            : keys.length > 0 && keys.every(v => {
                const n = parseFloat(v);
                return !Number.isNaN(n) && isFinite(v);
            });
        info[grade] = {
            numeric,
            values: toOptions(values, {
                label: displayToken,
                sort: numeric
                    ? (a, b) => parseFloat(a.value) - parseFloat(b.value)
                    : undefined,
            }),
        };
    });
    return info;
}

function gradeLabel(grade) {
    return GRADE_LABELS[String(grade).toLowerCase()] || String(grade).toUpperCase();
}

// El control de valor cambia de forma según el grade elegido
function updateGradevalControl() {
    const grade = combos.grade ? combos.grade.getValue() : '';
    const numeric = document.getElementById('gradevalNumeric');
    const comboMount = document.getElementById('gradevalCombo');
    const hint = document.getElementById('gradevalHint');
    const label = document.getElementById('gradevalLabel');
    const info = GRADE_INFO[grade];

    if (!grade || !info) {
        numeric.hidden = true;
        comboMount.hidden = true;
        hint.hidden = false;
        label.textContent = 'Grade value';
        document.getElementById('gradevalFilter').value = '';
        combos.gradeval.clear();
        return;
    }

    hint.hidden = true;
    label.textContent = gradeLabel(grade) + ' value';

    if (info.numeric) {
        numeric.hidden = false;
        comboMount.hidden = true;
        combos.gradeval.clear();

        const range = GRADE_RANGES[String(grade).toLowerCase()];
        const input = document.getElementById('gradevalFilter');
        if (range) {
            input.min = range[0];
            input.max = range[1];
            input.placeholder = `${range[0]}–${range[1]}`;
        } else {
            input.removeAttribute('min');
            input.removeAttribute('max');
            input.placeholder = '—';
        }
    } else {
        numeric.hidden = true;
        comboMount.hidden = false;
        document.getElementById('gradevalFilter').value = '';
        combos.gradeval.setOptions(info.values);
        combos.gradeval.clear();
    }
}

function buildFilterOptions() {
    return {
        // Los sets se ordenan alfabéticamente a secas, sin mandar los no
        // alfabéticos al final: sus etiquetas empiezan con dígitos ("01 - ...")
        // y ese es justamente el orden que queremos arriba.
        set: toOptions(countBy('set'), {
            label: v => SET_MAPPING[v] || v,
            sort: (a, b) => a.label.localeCompare(b.label),
        }),
        frame: toOptions(countBy('frame'), { label: displayToken, sort: frameOptionSort }),
        types: toOptions(countByToken('types'), { label: displayToken }),
        fpb: toOptions(countByToken('fpb'), { label: displayToken }),
        duelist: toOptions(countByToken('duelist'), { label: displayToken }),
        attribute: toOptions(countBy('attribute'), { label: v => v.toUpperCase() }),
        grade: toOptions(countBy('grade'), { label: gradeLabel }),
        // Las opciones reales se cargan al elegir un grade (updateGradevalControl)
        gradeval: [],
    };
}

function initializeFilters() {
    GRADE_INFO = analyzeGrades();
    const options = buildFilterOptions();

    COMBO_DEFS.forEach(def => {
        const mount = document.querySelector(`.combo-mount[data-combo="${def.key}"]`);
        combos[def.key] = createCombo(mount, {
            id: def.key + 'Filter',
            icon: def.icon,
            placeholder: def.placeholder,
            multi: !!def.multi,
            options: options[def.key],
            onChange: value => {
                if (def.multi) syncMulti(def.key, value);
                if (def.key === 'grade') updateGradevalControl();
                runSearch();
                updateUrlSearch(buildFullQuery());
            },
        });
    });

    updateGradevalControl();
}

function initFilterSections() {
    document.querySelectorAll('.filter-section').forEach(section => {
        const toggle = section.querySelector('.section-toggle');
        const body = section.querySelector('.section-body');
        const key = 'kd-section-' + section.dataset.section;
        const persist = section.dataset.persist !== 'no';

        if (persist) {
            let saved = null;
            try { saved = localStorage.getItem(key); } catch (e) { /* modo privado */ }
            if (saved !== null) {
                const open = saved === 'open';
                body.hidden = !open;
                toggle.setAttribute('aria-expanded', String(open));
            }
        }

        toggle.addEventListener('click', () => {
            const open = body.hidden;
            body.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
            if (persist) {
                try { localStorage.setItem(key, open ? 'open' : 'closed'); } catch (e) { /* modo privado */ }
            }
            // El campo de texto vive en Advanced: abrirla es buena señal de que
            // puede llegar a usarse
            if (open && section.dataset.section === 'advanced') prefetchEffects();
        });
    });
}

// El orden de estas listas define el de los chips de filtros activos.
const COMBO_DEFS = [
    { key: 'set', label: 'Set', field: 'set', icon: 'set', placeholder: 'Every Set' },
    { key: 'frame', label: 'Frame', field: 'frame', icon: 'frame', placeholder: 'Every Frame' },
    { key: 'types', label: 'Type', field: 'types', icon: 'types', placeholder: 'Any Type', multi: true },
    { key: 'fpb', label: 'Field Power', field: 'fpb', icon: 'fpb', placeholder: 'Any Bonus', multi: true },
    { key: 'duelist', label: 'Duelist', field: 'duelist', icon: 'duelist', placeholder: 'Every Duelist' },
    { key: 'attribute', label: 'Attribute', field: 'attribute', icon: 'attribute', placeholder: 'Every Attribute' },
    { key: 'grade', label: 'Grade', field: 'grade', icon: 'grade', placeholder: 'Every Grade' },
    { key: 'gradeval', label: 'Grade value', field: 'gradeval', icon: 'grade', placeholder: 'Any value' },
];

// gradeval NO está acá: no es un campo numérico suelto sino el valor de un
// grade, y si es numérico o no depende del grade elegido. Ver GRADE_INFO.
const NUM_DEFS = [
    { key: 'atk', label: 'ATK', field: 'atk' },
    { key: 'def', label: 'DEF', field: 'def' },
    { key: 'bonusatk', label: 'Bonus ATK', field: 'bonusatk' },
    { key: 'bonusdef', label: 'Bonus DEF', field: 'bonusdef' },
];

// Nombres legibles de los grades. Lo que no esté acá se muestra en mayúsculas,
// así un grade nuevo en los datos aparece solo, sin tocar código.
const GRADE_LABELS = {
    lvl: 'Level',
    rnk: 'Rank',
    mgn: 'Magnitude',
    chp: 'Chapter',
    frq: 'Frequency',
    alv: 'Antilevel',
    mrk: 'Marker',
    charge: 'Charge',
    glyph: 'Glyph',
};

// Si un grade es numérico se deduce de los datos, salvo estas excepciones.
// Marker es el caso que la deducción no puede acertar: sus valores ("46") parecen
// números pero son códigos, así que comparar con >= no significaría nada.
const GRADE_VALUE_KIND = {
    mrk: 'text',
    glyph: 'text',
};

// Rangos declarados por el juego. Sólo acotan el input; si un grade no está acá
// el input queda sin límites.
const GRADE_RANGES = {
    lvl: [1, 12],
    rnk: [0, 13],
    mgn: [2, 11],
    chp: [0, 9],
    frq: [1, 12],
    alv: [1, 12],
    charge: [1, 7],
};

// grade -> { numeric, values: [{value,label,count}] }, derivado de los datos.
let GRADE_INFO = {};

const TEXT_DEFS = [
    { id: 'oracleFilter', label: 'Card text', field: 'oracle' },
    { id: 'codeFilter', label: 'Card ID', field: 'id' },
];

// Checkboxes: activados emiten su término, desactivados no filtran nada
const BOOL_DEFS = [
    { id: 'altArtFilter', label: 'Artwork', chip: 'Alternative only', term: 'alt:yes' },
];

// Los textos de efecto pesan ~300 chars por carta: triplicarían la descarga
// que hace TODO visitante, cuando la mayoría nunca busca por texto. Van en
// archivos aparte que se traen sólo al usar el campo "Card text".
const EFFECT_FILES = [
    '000_A.effects.json', '000_T.effects.json', '000_P.effects.json',
    '001_1.effects.json', '001_2.effects.json', '001_3.effects.json',
    '001_4.effects.json', '001_5.effects.json',
];

let effectsPromise = null;

// Filtros multivalor: combo multi + tags con signo +/− para incluir o excluir
const MULTI_DEFS = [
    { key: 'types', field: 'types', label: 'Type', tagsId: 'typeTags' },
    { key: 'fpb', field: 'fpb', label: 'Field Power', tagsId: 'fpbTags' },
];

const combos = {};

//###########################
//#### MOTOR DE BUSQUEDA ####
//###########################

// La query final es el estado del sidebar AND el texto libre de la barra.
// Ninguno de los dos pisa al otro: hay una sola fuente de verdad por lado.
function buildFullQuery() {
    const free = document.getElementById('advancedSearch').value.trim();
    return [buildQueryFromFilters(), free].filter(Boolean).join(' ');
}

//############################
//#### TEXTO DE EFECTO ####
//############################

function setOracleHint(text, isError) {
    const hint = document.getElementById('oracleHint');
    hint.textContent = text || '';
    hint.hidden = !text;
    hint.classList.toggle('is-error', !!isError);
}

// Un set sin ningún efecto simplemente no tiene archivo: un 404 es un caso
// legítimo, no un fallo. Cualquier otro código sí lo es.
function fetchEffectFile(file) {
    return fetch('data/' + file).then(response => {
        if (response.status === 404) return {};
        if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
        return response.json();
    });
}

function loadEffects() {
    if (effectsPromise) return effectsPromise;

    effectsPromise = Promise.all(EFFECT_FILES.map(fetchEffectFile))
        .then(parts => {
            const merged = Object.assign({}, ...parts);
            searcher.setEffects(merged);
            return merged;
        })
        .catch(error => {
            effectsPromise = null; // permitir reintento
            throw error;
        });

    return effectsPromise;
}

// Se dispara al enfocar el campo o abrir Advanced: para cuando el usuario
// termina de escribir, normalmente ya están cargados y la espera es cero.
function prefetchEffects() {
    if (!searcher || searcher.effectsLoaded || effectsPromise) return;
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
    idle(() => loadEffects().catch(() => { /* se reporta al buscar de verdad */ }));
}

function showGridMessage(text) {
    const grid = document.getElementById('cardGrid');
    grid.textContent = '';
    const message = document.createElement('p');
    message.className = 'grid-message';
    message.textContent = text;
    grid.appendChild(message);
}

//###########################
//#### MOTOR DE BUSQUEDA ####
//###########################

function runSearch({ resetPage = true } = {}) {
    const query = buildFullQuery();

    // Si la consulta toca el texto de efecto y todavía no lo tenemos, se trae
    // primero y se vuelve a ejecutar. El resto de las búsquedas no paga nada.
    if (query && searcher.needsEffects(query) && !searcher.effectsLoaded) {
        renderActiveChips();
        showGridMessage('Loading card text...');
        setOracleHint('Loading card text...', false);
        loadEffects()
            .then(merged => {
                // Sin este aviso, un dataset todavía no exportado daría cero
                // resultados sin ninguna explicación.
                setOracleHint(
                    Object.keys(merged).length ? '' : 'Card text data is not available yet.',
                    true
                );
                runSearch({ resetPage });
            })
            .catch(error => {
                console.error('Error loading card text:', error);
                setOracleHint('Could not load card text. Try again.', true);
                showGridMessage('Could not load card text.');
            });
        return;
    }

    searchResults = query ? searcher.search(query) : [...cardsData];
    renderActiveChips();

    if (resetPage) currentPage = 1;
    applySort();
}

function debounce(fn, ms) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// La búsqueda responde rápido; la URL se actualiza más espaciada porque
// Safari limita la frecuencia de history.replaceState.
const scheduleSearch = debounce(() => runSearch(), 180);
const scheduleUrlUpdate = debounce(() => updateUrlSearch(buildFullQuery()), 500);

function scheduleSearchAndUrl() {
    scheduleSearch();
    scheduleUrlUpdate();
}

function initLiveFilters() {
    NUM_DEFS.forEach(({ key }) => {
        document.getElementById(key + 'Filter').addEventListener('input', scheduleSearchAndUrl);
        document.getElementById(key + 'Op').addEventListener('change', scheduleSearchAndUrl);
    });
    TEXT_DEFS.forEach(({ id }) => {
        document.getElementById(id).addEventListener('input', scheduleSearchAndUrl);
    });
    // Al enfocar el campo de texto empezamos a traer los efectos en segundo
    // plano, para que al terminar de escribir ya estén.
    document.getElementById('oracleFilter').addEventListener('focus', prefetchEffects);
    BOOL_DEFS.forEach(({ id }) => {
        document.getElementById(id).addEventListener('change', scheduleSearchAndUrl);
    });
    // gradeval no está en NUM_DEFS (su forma depende del grade) pero su variante
    // numérica se cablea igual
    document.getElementById('gradevalFilter').addEventListener('input', scheduleSearchAndUrl);
    document.getElementById('gradevalOp').addEventListener('change', scheduleSearchAndUrl);
    document.getElementById('advancedSearch').addEventListener('input', scheduleSearchAndUrl);
}

function clearFilters() {
    Object.values(combos).forEach(combo => combo.clear());
    NUM_DEFS.forEach(({ key }) => {
        document.getElementById(key + 'Filter').value = '';
        document.getElementById(key + 'Op').value = '=';
    });
    TEXT_DEFS.forEach(({ id }) => { document.getElementById(id).value = ''; });
    BOOL_DEFS.forEach(({ id }) => { document.getElementById(id).checked = false; });
    setOracleHint('', false);
    document.getElementById('gradevalFilter').value = '';
    document.getElementById('gradevalOp').value = '=';
    updateGradevalControl();
    document.getElementById('advancedSearch').value = '';

    MULTI_DEFS.forEach(({ key }) => {
        selectedMulti[key] = [];
        renderMultiTags(key);
    });
    document.getElementById('searchClear').hidden = true;

    updateUrlSearch('');
    runSearch();
}

const quoteIfNeeded = v => String(v).includes(' ') ? `"${v}"` : v;

const OP_SYMBOLS = { '=': '', '>=': '≥ ', '>': '> ', '<=': '≤ ', '<': '< ', '!=': '≠ ' };

// El '=' no se emite: atk:3000, no atk:=3000
function numTerm(key, field) {
    const value = document.getElementById(key + 'Filter').value.trim();
    if (!value) return null;
    const op = document.getElementById(key + 'Op').value;
    return `${field}:${op === '=' ? '' : op}${value}`;
}

function buildQueryFromFilters() {
    const queryParts = [];

    COMBO_DEFS.forEach(({ key, field, multi }) => {
        // types se emite abajo con su signo +/−; grade y gradeval van juntos
        if (multi || key === 'grade' || key === 'gradeval') return;
        const value = combos[key] ? combos[key].getValue() : '';
        if (value) queryParts.push(`${field}:${quoteIfNeeded(value)}`);
    });

    // Par dependiente: el valor sólo tiene sentido junto a su grade
    const grade = combos.grade ? combos.grade.getValue() : '';
    if (grade) {
        queryParts.push(`grade:${quoteIfNeeded(grade)}`);
        const info = GRADE_INFO[grade];
        if (info && info.numeric) {
            const term = numTerm('gradeval', 'gradeval');
            if (term) queryParts.push(term);
        } else {
            const value = combos.gradeval.getValue();
            if (value) queryParts.push(`gradeval:${quoteIfNeeded(value)}`);
        }
    }

    MULTI_DEFS.forEach(({ key, field }) => {
        selectedMulti[key].forEach(entry => {
            queryParts.push(`${entry.negative ? '-' : ''}${field}:${quoteIfNeeded(entry.value)}`);
        });
    });

    NUM_DEFS.forEach(({ key, field }) => {
        const term = numTerm(key, field);
        if (term) queryParts.push(term);
    });

    TEXT_DEFS.forEach(({ id, field }) => {
        const value = document.getElementById(id).value.trim();
        if (value) queryParts.push(`${field}:${quoteIfNeeded(value)}`);
    });

    BOOL_DEFS.forEach(({ id, term }) => {
        if (document.getElementById(id).checked) queryParts.push(term);
    });

    return queryParts.join(' ');
}

//###############
//#### CHIPS ####
//###############

function makeChip(label, value, onRemove) {
    const chip = document.createElement('span');
    chip.className = 'chip';

    const text = document.createElement('span');
    text.textContent = `${label}: ${value}`;
    chip.appendChild(text);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip-remove';
    btn.textContent = '×';
    btn.title = `Remove ${label} filter`;
    btn.setAttribute('aria-label', `Remove ${label} filter`);
    btn.addEventListener('click', onRemove);
    chip.appendChild(btn);

    return chip;
}

// Los chips reemplazan el feedback que daba el botón "Apply Filters":
// son la única señal de qué está filtrado cuando el sidebar está en la pestaña Deck.
function renderActiveChips() {
    const container = document.getElementById('activeChips');
    container.textContent = '';

    const afterRemove = () => {
        runSearch();
        updateUrlSearch(buildFullQuery());
    };

    COMBO_DEFS.forEach(({ key, label, multi }) => {
        if (multi || key === 'gradeval' || !combos[key]) return;
        const value = combos[key].getValue();
        if (!value) return;
        // El chip muestra la etiqueta legible, no el código interno
        const opt = (combos[key].optionsRef || []).find(o => o.value === value);
        container.appendChild(makeChip(label, opt ? opt.label : displayToken(value), () => {
            combos[key].clear();
            if (key === 'grade') updateGradevalControl();
            afterRemove();
        }));
    });

    // El valor del grade se muestra como chip propio, con el nombre del grade
    const gradeSelected = combos.grade ? combos.grade.getValue() : '';
    if (gradeSelected) {
        const info = GRADE_INFO[gradeSelected];
        const clearValue = () => {
            document.getElementById('gradevalFilter').value = '';
            document.getElementById('gradevalOp').value = '=';
            combos.gradeval.clear();
            afterRemove();
        };

        if (info && info.numeric) {
            const value = document.getElementById('gradevalFilter').value.trim();
            if (value) {
                const op = document.getElementById('gradevalOp').value;
                const symbol = OP_SYMBOLS[op];
                container.appendChild(makeChip(gradeLabel(gradeSelected), symbol + value, clearValue));
            }
        } else {
            const value = combos.gradeval.getValue();
            if (value) {
                container.appendChild(makeChip(gradeLabel(gradeSelected), displayToken(value), clearValue));
            }
        }
    }

    MULTI_DEFS.forEach(({ key, label }) => {
        selectedMulti[key].forEach(entry => {
            container.appendChild(makeChip(
                entry.negative ? 'Not ' + label.toLowerCase() : label,
                displayToken(entry.value),
                () => { removeMultiTag(key, selectedMulti[key].indexOf(entry)); }
            ));
        });
    });

    NUM_DEFS.forEach(({ key, label }) => {
        const value = document.getElementById(key + 'Filter').value.trim();
        if (!value) return;
        const op = document.getElementById(key + 'Op').value;
        container.appendChild(makeChip(label, OP_SYMBOLS[op] + value, () => {
            document.getElementById(key + 'Filter').value = '';
            document.getElementById(key + 'Op').value = '=';
            afterRemove();
        }));
    });

    TEXT_DEFS.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        const value = el.value.trim();
        if (!value) return;
        container.appendChild(makeChip(label, value, () => {
            el.value = '';
            afterRemove();
        }));
    });

    BOOL_DEFS.forEach(({ id, label, chip }) => {
        const el = document.getElementById(id);
        if (!el.checked) return;
        container.appendChild(makeChip(label, chip, () => {
            el.checked = false;
            afterRemove();
        }));
    });
}

//#############
//#### URL ####
//#############

// Una URL editada a mano puede traer un '%' suelto: decodeURIComponent lanza
// URIError y sin este guard se cae todo el arranque.
function safeDecode(value) {
    try {
        return decodeURIComponent(value);
    } catch (e) {
        return value;
    }
}

function updateUrlSearch(query) {
    const url = new URL(window.location);
    if (query && query.trim()) {
        // searchParams ya escapa: encodear a mano acá producía doble-encode.
        // Los links viejos con %253A siguen funcionando porque safeDecode
        // deshace la capa extra al leer.
        url.searchParams.set('search', query);
    } else {
        url.searchParams.delete('search');
    }

    window.history.replaceState({}, '', url);
}

// Único punto de entrada por URL: reemplaza a checkUrlSearch + checkUrlFilter,
// que antes podían dispararse los dos y hacer dos búsquedas.
function applyUrlState(loc = window.location) {
    const params = new URLSearchParams(loc.search);

    // ?deck=slug carga un mazo guardado. Es independiente de la búsqueda, así
    // que puede venir junto con ?search= y se aplican los dos.
    const deckSlugParam = params.get('deck');
    if (deckSlugParam) {
        loadSavedDecks()
            .then(() => {
                if (!loadSavedDeck(deckSlugParam, { confirm: false })) {
                    console.warn(`?deck=${deckSlugParam}: no existe ese mazo`);
                }
            })
            .catch(error => console.error('Error loading sample decks:', error));
    }

    const param = params.get('search');
    if (param) {
        document.getElementById('advancedSearch').value = safeDecode(param);
        document.getElementById('searchClear').hidden = false;
        runSearch();
        return;
    }

    const hash = loc.hash.replace('#', '');
    if (hash) {
        // Sólo códigos de set reales (#SOE). Los #8, #9... de los posts viejos
        // eran de otra numeración de otra edición del juego: mapearlos llevaba
        // al set equivocado, así que ahora simplemente no filtran.
        const upper = hash.toUpperCase();
        const code = SET_MAPPING[upper] ? upper : null;
        if (code) {
            // El combo guarda el código directo, así que ya no hace falta el
            // reverse-lookup por nombre completo que había antes.
            combos.set.setValue(code);
            runSearch();
            return;
        }
    }

    runSearch();
}

//################
//#### RENDER ####
//################

function getDeckCountMap() {
    const counts = {};
    deck.forEach(card => { counts[card.cardid] = (counts[card.cardid] || 0) + 1; });
    return counts;
}

function buildCardElement(card, count) {
    const el = document.createElement('div');
    el.className = 'card' + (count ? ' in-deck' : '');
    el.dataset.cardid = card.cardid;

    // Los badges se anclan a la imagen, no a la carta entera: si no, el de
    // abajo caería debajo del nombre y el código.
    const media = document.createElement('div');
    media.className = 'card-media';

    const img = document.createElement('img');
    img.src = cardImage(card);
    img.alt = card.name;
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    media.appendChild(img);

    const badge = document.createElement('span');
    badge.className = 'card-count';
    badge.textContent = '×' + count;
    badge.hidden = !count;
    media.appendChild(badge);

    // Sólo 7 de 1740 cartas tienen variantes: el badge las hace descubribles
    // sin ensuciar el resto del grid
    const arts = artworkCount(card);
    if (arts > 1) {
        const artBadge = document.createElement('span');
        artBadge.className = 'card-artworks';
        artBadge.textContent = '◆' + arts;
        artBadge.title = `${arts} artworks — right click to browse`;
        media.appendChild(artBadge);
    }

    el.appendChild(media);

    const info = document.createElement('div');
    info.className = 'card-info';

    const title = document.createElement('span');
    title.className = 'card-title';
    title.textContent = card.name;
    title.title = card.name;

    const cid = document.createElement('span');
    cid.className = 'card-details';
    cid.textContent = card.cardid;

    info.append(title, cid);
    el.appendChild(info);

    el.addEventListener('click', () => addToDeck(card));
    el.addEventListener('contextmenu', e => showCardPopup(e, card, { details: false }));
    return el;
}

function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.textContent = '';

    const totalPages = Math.max(1, Math.ceil(totalFilteredCards / CARDS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const cardsToShow = filteredCards.slice(startIndex, startIndex + CARDS_PER_PAGE);
    const counts = getDeckCountMap();

    const frag = document.createDocumentFragment();
    cardsToShow.forEach(card => frag.appendChild(buildCardElement(card, counts[card.cardid] || 0)));
    cardGrid.appendChild(frag);

    updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
    const start = totalFilteredCards === 0 ? 0 : (currentPage - 1) * CARDS_PER_PAGE + 1;
    const end = Math.min(currentPage * CARDS_PER_PAGE, totalFilteredCards);

    document.getElementById('limitMessage').textContent = totalFilteredCards === 0
        ? 'No cards match your filters'
        : `Showing ${start}-${end} of ${totalFilteredCards} cards`;

    // Solo números interpolados: seguro para innerHTML
    const html = totalPages > 1 ? `
        <button onclick="changePage(1)" ${currentPage === 1 ? 'disabled' : ''} title="First page">«</button>
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} title="Previous page">‹</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} title="Next page">›</button>
        <button onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''} title="Last page">»</button>
    ` : '';

    document.getElementById('paginationTop').innerHTML = html;
    document.getElementById('paginationBottom').innerHTML = html;
}

//##############
//#### DECK ####
//##############

function getDeckCounts() {
    return {
        A: deck.filter(card => card.deck === 'A').length,
        B: deck.filter(card => card.deck === 'B').length,
        C: deck.filter(card => card.deck === 'C').length
    };
}

// Refresca las tres vistas que dependen del mazo
function refreshDeckUI() {
    renderDeck();
    updateDeckStatus();
    updateAllCardBadges();
}

function updateDeckStatus() {
    const counts = getDeckCounts();

    ['A', 'B', 'C'].forEach(key => {
        const n = counts[key];
        const max = DECK_LIMITS[key];
        document.getElementById('count' + key).textContent = `${n}/${max}`;
        const bar = document.getElementById('bar' + key);
        bar.style.width = Math.min(100, (n / max) * 100) + '%';
        bar.classList.toggle('full', n >= max);
    });

    const total = deck.length;
    const badge = document.getElementById('tabBadge');
    badge.textContent = total;

    // Pulso solo cuando el total cambia, no en la carga inicial
    if (total !== lastDeckTotal) {
        badge.classList.remove('pulse');
        void badge.offsetWidth; // fuerza reflow para reiniciar la animación
        badge.classList.add('pulse');
        lastDeckTotal = total;
    }
}

function updateAllCardBadges() {
    const counts = getDeckCountMap();
    document.querySelectorAll('#cardGrid .card').forEach(el => {
        const n = counts[el.dataset.cardid] || 0;
        el.classList.toggle('in-deck', n > 0);
        const badge = el.querySelector('.card-count');
        badge.textContent = '×' + n;
        badge.hidden = !n;
    });
}

function addToDeck(card) {
    const counts = getDeckCounts();
    const labels = { A: 'Main Deck', B: 'Extra Deck', C: 'Additional Cards' };

    if (counts[card.deck] >= DECK_LIMITS[card.deck]) {
        alert(`The ${labels[card.deck]} has reached its limit of ${DECK_LIMITS[card.deck]} cards`);
        return;
    }

    // Copia con el arte congelado: un mazo puede llevar la misma carta con
    // artes distintos a la vez, y cambiar de arte después no lo altera.
    // Si viene de una fila del mazo ([+]), conserva el arte de esa fila.
    deck.push({ ...card, art: card.art !== undefined ? card.art : artworkIndex(card) });
    refreshDeckUI();
}

// Clave de agrupado en el mazo: misma carta con distinto arte = filas distintas
function deckEntryKey(entry) {
    return entry.cardid + '#' + (entry.art || 0);
}

// Color del borde por familia de frame. Los subtipos de monstruo comparten color.
// Frame -> token de color. Coincidencia exacta y no por subcadena: buscar
// "monster" primero hacía que Alter, Fusion, Ritual, Integration y Token
// compartieran el color del Monster base.
// Los colores están en style.css (--frame-*); acá sólo se elige cuál va.
const FRAME_COLORS = {
    'Rule': 'rule',
    'Monster': 'monster',
    'Alter Monster': 'alter',
    'Fusion Monster': 'fusion',
    'Ritual Monster': 'ritual',
    'Integration Monster': 'integration',
    'Token Monster': 'token',
    'Spell': 'spell',
    'Trap': 'trap',
    'Combination': 'combination',
    'Terrain': 'terrain',
};

function frameColor(frame) {
    // displayToken normaliza el guion bajo: "Alter_Monster" -> "Alter Monster"
    const token = FRAME_COLORS[displayToken(frame || '')];
    return token ? `var(--frame-${token})` : 'var(--border-strong)';
}

// Orden de las cartas DENTRO de cada mazo. Es distinto del orden del combo de
// filtros (FRAME_ORDER), donde Rule va primero: acá va al final del Extra Deck.
const DECK_FRAME_ORDER = [
    // Main Deck
    'Monster', 'Spell', 'Trap', 'Combination',
    // Extra Deck: primero los monstruos, las Rule al final
    'Alter Monster', 'Fusion Monster', 'Ritual Monster', 'Integration Monster', 'Token Monster', 'Rule',
    // Others
    'Terrain',
];

function deckFrameRank(card) {
    const i = DECK_FRAME_ORDER.indexOf(displayToken(card.frame || ''));
    return i === -1 ? DECK_FRAME_ORDER.length : i;
}

// Antes ordenaba por la cadena `types` alfabéticamente, así que un Monster con
// types "Zombie" caía después de un Spell con types "Continuous" y el mazo se
// veía mezclado. Ahora agrupa por frame y desempata por nombre.
function deckSortComparator(a, b) {
    if (a.deck !== b.deck) return a.deck.localeCompare(b.deck);
    const rankA = deckFrameRank(a), rankB = deckFrameRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return a.name.localeCompare(b.name);
}

function renderDeck() {
    const lists = {
        A: document.getElementById('deckListA'),
        B: document.getElementById('deckListB'),
        C: document.getElementById('deckListC')
    };
    Object.values(lists).forEach(el => { el.textContent = ''; });

    const byId = new Map();
    deck.forEach(card => {
        const key = deckEntryKey(card);
        const entry = byId.get(key);
        if (entry) entry.count++;
        else byId.set(key, { card, count: 1 });
    });

    [...byId.values()]
        .sort((a, b) => deckSortComparator(a.card, b.card) || (a.card.art || 0) - (b.card.art || 0))
        .forEach(({ card, count }) => {
            const row = document.createElement('div');
            row.className = 'deck-card';
            // Borde izquierdo coloreado por frame: escaneo visual del mazo
            row.style.setProperty('--row-frame', frameColor(card.frame));

            const qty = document.createElement('span');
            qty.className = 'deck-card-count';
            qty.textContent = count;

            const label = document.createElement('span');
            label.className = 'deck-card-name';
            label.textContent = card.name;
            label.title = card.name;

            // Distingue las filas de la misma carta con distinto arte
            if (card.art) {
                const art = document.createElement('span');
                art.className = 'deck-card-art';
                art.textContent = '◆' + (card.art + 1);
                art.title = `Artwork ${card.art + 1} of ${artworkCount(card)}`;
                label.appendChild(art);
            }

            const actions = document.createElement('span');
            actions.className = 'deck-card-actions';

            // [−] baja una copia sin borrar la entrada; antes había que eliminarla
            // entera y volver a buscar la carta en el grid para bajar de 3 a 2.
            const dec = document.createElement('button');
            dec.type = 'button';
            dec.className = 'deck-btn';
            dec.textContent = '−';
            dec.title = 'Remove one copy';
            dec.setAttribute('aria-label', `Remove one copy of ${card.name}`);
            dec.addEventListener('click', () => removeFromDeck(card.cardid, card.art));

            const inc = document.createElement('button');
            inc.type = 'button';
            inc.className = 'deck-btn';
            inc.textContent = '+';
            inc.title = 'Add one copy';
            inc.setAttribute('aria-label', `Add one copy of ${card.name}`);
            inc.addEventListener('click', () => addToDeck(card));

            actions.append(dec, inc);
            row.append(qty, label, actions);

            // Sin miniatura por fila: el hover muestra la carta grande, que se lee
            // mucho mejor y no cuesta 30 requests ni 33px de alto por fila.
            row.addEventListener('mouseenter', e => showCardPopup(e, card));
            row.addEventListener('mouseleave', hideCardPopup);

            (lists[card.deck] || lists.C).appendChild(row);
        });
}

// `art` undefined quita cualquier arte; con valor, sólo esa fila
function removeFromDeck(cardid, art) {
    const index = deck.findIndex(card =>
        card.cardid === cardid && (art === undefined || (card.art || 0) === (art || 0)));
    if (index !== -1) {
        deck.splice(index, 1);
        refreshDeckUI();
    }
}

function clearDeck() {
    if (confirm('Are you sure you want to clear your deck?')) {
        deck = [];
        refreshDeckUI();
    }
}

//#################
//#### BUTTONS ####
//#################

function transformToTTS() {
    const deckGroups = deck.reduce((acc, card) => {
        const deckKey = card.deck || 'Default';
        if (!acc[deckKey]) acc[deckKey] = [];
        acc[deckKey].push(card);
        return acc;
    }, {});

    const sortedDeckGroups = Object.keys(deckGroups)
        .sort()
        .reduce((acc, key) => {
            acc[key] = deckGroups[key];
            return acc;
        }, {});

    const objectStates = Object.entries(sortedDeckGroups).map(([deckName, cards], deckIndex) => {
        const customDeckMapping = {};

        const containedObjects = cards.map((card, index) => {
            const cardId = (index + 1) * 100;

            customDeckMapping[1 + index] = {
                FaceURL: cardImage(card),
                BackURL: defaultCardBack,
                NumHeight: 1,
                NumWidth: 1,
                BackIsHidden: true,
                UniqueBack: false,
                Type: 1
            };

            return {
                CardID: cardId,
                Name: "Card",
                Nickname: card.name,
                Transform: {
                    posX: 0, posY: 0, posZ: 0,
                    rotX: 0, rotY: 180, rotZ: 180,
                    scaleX: 1, scaleY: 1, scaleZ: 1
                }
            };
        });

        return {
            Name: "DeckCustom",
            ContainedObjects: containedObjects,
            DeckIDs: containedObjects.map(obj => obj.CardID),
            CustomDeck: customDeckMapping,
            Transform: {
                posX: deckIndex * 2.2, // Offset each deck horizontally
                posY: deckIndex * 1,
                posZ: 0,
                rotX: 0, rotY: 180, rotZ: 0,
                scaleX: 1, scaleY: 1, scaleZ: 1
            }
        };
    });

    return { ObjectStates: objectStates };
}

function saveDeck() {
    const outputJson = transformToTTS();

    const jsonString = JSON.stringify(outputJson, null, 4);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tabletop_simulator_export.json';
    link.click();
}

function showDeckPreview() {
    const previewContainer = document.getElementById('previewContainer');
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.textContent = '';

    [...deck].sort(deckSortComparator).forEach(card => {
        const previewCard = document.createElement('div');
        previewCard.className = 'preview-card';
        const img = document.createElement('img');
        img.src = cardImage(card);
        img.alt = card.name;
        img.setAttribute('loading', 'lazy');
        previewCard.appendChild(img);
        previewGrid.appendChild(previewCard);
    });

    previewContainer.style.display = 'flex';
}

function closePreview() {
    document.getElementById('previewContainer').style.display = 'none';
}

//###############
//#### POPUP ####
//###############

// Posiciona el popup junto al cursor sin salirse del viewport
function positionPopup() {
    if (!lastPopupPoint) return;
    const popup = document.getElementById('cardPopup');
    const rect = popup.getBoundingClientRect();
    const pad = 8;
    const gap = 16;

    let x = lastPopupPoint.x + gap;
    if (x + rect.width + pad > window.innerWidth) x = lastPopupPoint.x - rect.width - gap;
    x = Math.max(pad, Math.min(x, window.innerWidth - rect.width - pad));

    let y = lastPopupPoint.y + gap;
    y = Math.max(pad, Math.min(y, window.innerHeight - rect.height - pad));

    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
}

const DECK_LABELS = { A: 'Main Deck', B: 'Extra Deck', C: 'Additional Cards' };

// Muestra tokens multivalor como lista legible: "Beast_Rider Insect" -> "Beast Rider · Insect"
function tokenListText(value) {
    return (value || '')
        .split(' ')
        .filter(Boolean)
        .map(displayToken)
        .join(' · ');
}

// Todos estos datos ya viven en cardsData pero no se mostraban en ningún lado:
// el popup era sólo el JPG.
function buildCardDetails(card) {
    const rows = [];
    const add = (label, value) => {
        if (value !== undefined && value !== null && value !== '' && value !== '-') {
            rows.push([label, String(value)]);
        }
    };

    add('Card ID', card.cardid);
    add('Set', card.fullSet);
    add('Frame', displayToken(card.frame));
    add('Types', tokenListText(card.types));
    add('Attribute', card.attribute ? card.attribute.toUpperCase() : '');

    // El grade se muestra con su nombre real: "Rank 4", no "rnk 4"
    if (card.grade) add(gradeLabel(card.grade), displayToken(card.gradeval));

    add('ATK', card.atk);
    add('DEF', card.def);
    add('Bonus ATK', card.bonusatk);
    add('Bonus DEF', card.bonusdef);
    add('Field Power', tokenListText(card.fpb));
    add('Duelists', tokenListText(card.duelist));
    add('Deck', DECK_LABELS[card.deck]);

    const arts = artworkCount(card);
    if (arts > 1) add('Artwork', `${currentArtIndex(card) + 1} of ${arts}`);

    return rows;
}

// details:false muestra sólo la imagen en grande. En el grid la carta ya se ve
// entera, así que ampliarla es lo útil; en la lista del mazo no hay imagen,
// por eso ahí sí acompañan los datos.
function updateArtworkControls(card, interactive) {
    const nav = document.getElementById('artworkNav');
    const total = artworkCount(card);
    // `interactive` undefined = mantener el estado actual (venimos de cycleArtwork)
    const clickable = interactive === undefined
        ? document.getElementById('cardPopup').classList.contains('interactive')
        : interactive;

    nav.hidden = total < 2 || !clickable;
    if (!nav.hidden) {
        document.getElementById('artworkCount').textContent = `${currentArtIndex(card) + 1} / ${total}`;
    }
}

function renderPopupDetails(card) {
    const data = document.getElementById('popupData');
    document.getElementById('popupTitle').textContent = card.name;
    data.textContent = '';
    buildCardDetails(card).forEach(([label, value]) => {
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        data.append(dt, dd);
    });
}

function showCardPopup(event, card, options) {
    if (event.type === 'contextmenu') event.preventDefault();

    const withDetails = !options || options.details !== false;
    const popup = document.getElementById('cardPopup');
    const popupImage = document.getElementById('popupImage');
    const title = document.getElementById('popupTitle');
    const data = document.getElementById('popupData');

    lastPopupPoint = { x: event.clientX, y: event.clientY };

    popupImage.src = cardImage(card);
    popupImage.alt = card.name;
    popup.dataset.cardid = card.cardid;
    popup.classList.toggle('image-only', !withDetails);

    // Las flechas sólo son clickeables cuando el popup persiste (click derecho).
    // En el hover del mazo el puntero debe atravesarlo, o el mouseleave se
    // dispararía apenas el popup tapa el cursor.
    const interactive = event.type === 'contextmenu';
    popup.classList.toggle('interactive', interactive);
    updateArtworkControls(card, interactive);

    if (withDetails) {
        renderPopupDetails(card);
    } else {
        title.textContent = '';
        data.textContent = '';
    }

    popup.style.display = 'flex';

    positionPopup();
    // La imagen puede no estar cargada al medir: reposicionar cuando lo esté
    popupImage.onload = positionPopup;
}

function hideCardPopup() {
    document.getElementById('cardPopup').style.display = 'none';
}

document.addEventListener('click', function (event) {
    const popup = document.getElementById('cardPopup');
    if (event.target !== popup && !popup.contains(event.target)) {
        popup.style.display = 'none';
    }
});

window.addEventListener('resize', () => {
    const popup = document.getElementById('cardPopup');
    if (popup.style.display === 'flex') positionPopup();
});

//###################
//#### CORE LOOP ####
//###################

document.addEventListener('DOMContentLoaded', loadCardsData);
