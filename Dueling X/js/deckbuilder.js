// =============================================
// DECKBUILDER - LÓGICA PRINCIPAL
// =============================================

// Estado del deck actual
const deck = {
  formato: "goat",
  main: [],   // [{key, name, cantidad}]
  extra: [],
  side: []
};

// Límites
const LIMITE_MAIN  = { min: 40, max: 60 };
const LIMITE_EXTRA = { max: 15 };
const LIMITE_SIDE  = { max: 15 };

// Tipos que van al Extra Deck
const EXTRA_TYPES = ["fusion-monster"];

// ─── AGREGAR CARTA ───────────────────────────────────────────
function agregarCarta(key) {
  const carta = window.CARD_POOL[key];
  if (!carta) return { ok: false, msg: "Carta no encontrada." };

  const destino = EXTRA_TYPES.includes(carta["card-type"]) ? "extra" : "main";
  const zona = deck[destino];
  const maxCopias = getMaxCopias(carta.name, deck.formato);

  // Verificar banlist
  if (maxCopias === 0) {
    return { ok: false, msg: `${carta.name} está Forbidden en ${deck.formato}.` };
  }

  // Contar copias actuales en main + side + extra
  const copiasTotal = contarCopiasTotales(carta.name);
  if (copiasTotal >= maxCopias) {
    return { ok: false, msg: `Máximo ${maxCopias} copia(s) de ${carta.name} en este formato.` };
  }

  // Verificar límite de la zona
  const totalZona = zona.reduce((acc, c) => acc + c.cantidad, 0);
  const limiteZona = destino === "main" ? LIMITE_MAIN.max : LIMITE_EXTRA.max;
  if (totalZona >= limiteZona) {
    return { ok: false, msg: `El ${destino} deck está lleno (${limiteZona} cartas).` };
  }

  // Agregar o aumentar cantidad
  const existente = zona.find(c => c.key === key);
  if (existente) {
    existente.cantidad++;
  } else {
    zona.push({ key, name: carta.name, cantidad: 1 });
  }

  return { ok: true };
}

// ─── AGREGAR AL SIDE ─────────────────────────────────────────
function agregarAlSide(key) {
  const carta = window.CARD_POOL[key];
  if (!carta) return { ok: false, msg: "Carta no encontrada." };

  const totalSide = deck.side.reduce((acc, c) => acc + c.cantidad, 0);
  if (totalSide >= LIMITE_SIDE.max) {
    return { ok: false, msg: "El side deck está lleno (15 cartas)." };
  }

  const maxCopias = getMaxCopias(carta.name, deck.formato);
  if (maxCopias === 0) {
    return { ok: false, msg: `${carta.name} está Forbidden en ${deck.formato}.` };
  }

  const copiasTotal = contarCopiasTotales(carta.name);
  if (copiasTotal >= maxCopias) {
    return { ok: false, msg: `Máximo ${maxCopias} copia(s) de ${carta.name}.` };
  }

  const existente = deck.side.find(c => c.key === key);
  if (existente) {
    existente.cantidad++;
  } else {
    deck.side.push({ key, name: carta.name, cantidad: 1 });
  }

  return { ok: true };
}

// ─── QUITAR CARTA ────────────────────────────────────────────
function quitarCarta(key, zona = "main") {
  const arr = deck[zona];
  const idx = arr.findIndex(c => c.key === key);
  if (idx === -1) return;

  if (arr[idx].cantidad > 1) {
    arr[idx].cantidad--;
  } else {
    arr.splice(idx, 1);
  }
}

// ─── CONTAR COPIAS TOTALES (main + extra + side) ─────────────
function contarCopiasTotales(cardName) {
  let total = 0;
  for (const zona of [deck.main, deck.extra, deck.side]) {
    for (const c of zona) {
      if (c.name === cardName) total += c.cantidad;
    }
  }
  return total;
}

// ─── VALIDAR DECK ────────────────────────────────────────────
function validarDeck() {
  const errores = [];
  const totalMain = deck.main.reduce((acc, c) => acc + c.cantidad, 0);

  if (totalMain < LIMITE_MAIN.min) {
    errores.push(`El main deck necesita al menos ${LIMITE_MAIN.min} cartas (tienes ${totalMain}).`);
  }
  if (totalMain > LIMITE_MAIN.max) {
    errores.push(`El main deck no puede tener más de ${LIMITE_MAIN.max} cartas.`);
  }

  return errores;
}

// ─── CAMBIAR FORMATO ─────────────────────────────────────────
function cambiarFormato(nuevoFormato) {
  deck.formato = nuevoFormato;
  // Revisar si alguna carta viola la nueva banlist
  const violaciones = [];
  for (const zona of ["main", "extra", "side"]) {
    for (const carta of deck[zona]) {
      const max = getMaxCopias(carta.name, nuevoFormato);
      if (carta.cantidad > max) {
        violaciones.push(`${carta.name}: tienes ${carta.cantidad}, máximo ${max} en ${nuevoFormato}.`);
        carta.cantidad = max;
      }
      if (max === 0) {
        violaciones.push(`${carta.name} está Forbidden en ${nuevoFormato} y fue removida.`);
      }
    }
    // Limpiar cartas con cantidad 0
    deck[zona] = deck[zona].filter(c => c.cantidad > 0);
  }
  return violaciones;
}

// ─── FILTRAR CARTAS ──────────────────────────────────────────
function filtrarCartas({ nombre = "", tipo = "", atributo = "", raza = "", nivel = "", banlist = "", atk = "", defVal = "", categoria = "" } = {}) {
  return Object.entries(window.CARD_POOL).filter(([key, carta]) => {
    if (nombre && !carta.name.toLowerCase().includes(nombre.toLowerCase())) return false;
    if (tipo && carta["card-type"] !== tipo) return false;
    if (atributo && carta.attribute !== atributo) return false;
    if (raza && carta.type !== raza) return false;
    if (nivel && String(carta.level) !== String(nivel)) return false;
    if (atk !== "" && carta.atk !== null && String(carta.atk) !== String(atk)) return false;
    if (defVal !== "" && carta.def !== null && String(carta.def) !== String(defVal)) return false;
    if (categoria && !(carta.category || []).some(c => c.toLowerCase().includes(categoria.toLowerCase()))) return false;
    if (banlist !== "") {
      const max = getMaxCopias(carta.name, deck.formato);
      if (String(max) !== String(banlist)) return false;
    }
    return true;
  });
}


// ─── ORDENAR DECK ─────────────────────────────────────────────
const ORDEN_TIPO_MAIN = [
  "normal-monster",
  "effect-monster",
  "ritual-monster",
];

const ORDEN_TIPO_SPELL = [
  "normal-spell",
  "quick-spell",
  "equip-spell",
  "continuous-spell",
  "ritual-spell",
  "field-spell",
];

const ORDEN_TIPO_TRAP = [
  "normal-trap",
  "continuous-trap",
  "counter-trap",
];

function esMonstruo(cardType) {
  return ORDEN_TIPO_MAIN.includes(cardType);
}

function esMagia(cardType) {
  return ORDEN_TIPO_SPELL.includes(cardType);
}

function esTrampa(cardType) {
  return ORDEN_TIPO_TRAP.includes(cardType);
}

function grupoGeneral(cardType) {
  if (esMonstruo(cardType)) return 0;
  if (esMagia(cardType))    return 1;
  if (esTrampa(cardType))   return 2;
  return 3;
}

function ordenarEntradas(entradas) {
  return [...entradas].sort((a, b) => {
    const cartaA = window.CARD_POOL[a.key];
    const cartaB = window.CARD_POOL[b.key];
    if (!cartaA || !cartaB) return 0;

    const tipoA = cartaA["card-type"];
    const tipoB = cartaB["card-type"];

    // 1. Grupo general: Monstruo < Magia < Trampa
    const grupoA = grupoGeneral(tipoA);
    const grupoB = grupoGeneral(tipoB);
    if (grupoA !== grupoB) return grupoA - grupoB;

    // 2. Sub-orden por tipo específico
    if (esMonstruo(tipoA)) {
      const subA = ORDEN_TIPO_MAIN.indexOf(tipoA);
      const subB = ORDEN_TIPO_MAIN.indexOf(tipoB);
      if (subA !== subB) return subA - subB;

      // Nivel mayor primero
      const nivelA = cartaA.level || 0;
      const nivelB = cartaB.level || 0;
      if (nivelA !== nivelB) return nivelB - nivelA;

      // ATK mayor primero
      const atkA = cartaA.atk ?? -1;
      const atkB = cartaB.atk ?? -1;
      if (atkA !== atkB) return atkB - atkA;

      // DEF mayor primero
      const defA = cartaA.def ?? -1;
      const defB = cartaB.def ?? -1;
      if (defA !== defB) return defB - defA;
    }

    if (esMagia(tipoA)) {
      const subA = ORDEN_TIPO_SPELL.indexOf(tipoA);
      const subB = ORDEN_TIPO_SPELL.indexOf(tipoB);
      if (subA !== subB) return subA - subB;
    }

    if (esTrampa(tipoA)) {
      const subA = ORDEN_TIPO_TRAP.indexOf(tipoA);
      const subB = ORDEN_TIPO_TRAP.indexOf(tipoB);
      if (subA !== subB) return subA - subB;
    }

    // Alfabético como último criterio
    return a.name.localeCompare(b.name);
  });
}

function ordenarDeck() {
  deck.main  = ordenarEntradas(deck.main);
  deck.extra = ordenarEntradas(deck.extra);
  deck.side  = ordenarEntradas(deck.side);
}

// ─── SERIALIZAR DECK PARA FIRESTORE ──────────────────────────
function serializarDeck(nombre) {
  return {
    nombre,
    formato: deck.formato,
    main:  deck.main.map(c => ({ key: c.key, name: c.name, cantidad: c.cantidad })),
    extra: deck.extra.map(c => ({ key: c.key, name: c.name, cantidad: c.cantidad })),
    side:  deck.side.map(c => ({ key: c.key, name: c.name, cantidad: c.cantidad }))
  };
}

// ─── CARGAR DECK DESDE FIRESTORE ─────────────────────────────
function cargarDeckDesdeFirestore(data) {
  deck.formato = data.formato || "goat";
  deck.main  = data.main  || [];
  deck.extra = data.extra || [];
  deck.side  = data.side  || [];
}
