// =============================================
// BANLISTS POR FORMATO
// Solo se listan cartas restringidas
// Si una carta NO aparece = Unlimited
// El nombre usado es el campo "name" de la carta
// =============================================

const BANLISTS = {

  goat: {
    // Forbidden
    "Chaos Emperor Dragon - Envoy of the End": "Forbidden",
    "Fiber Jar": "Forbidden",
    "Magical Scientist": "Forbidden",
    "Makyura the Destructor": "Forbidden",
    "Witch of the Black Forest": "Forbidden",
    "Yata-Garasu": "Forbidden",
    "Butterfly Dagger - Elma": "Forbidden",
    "Change of Heart": "Forbidden",
    "Confiscation": "Forbidden",
    "Dark Hole": "Forbidden",
    "Harpie's Feather Duster": "Forbidden",
    "Mirage of Nightmare": "Forbidden",
    "Monster Reborn": "Forbidden",
    "Painful Choice": "Forbidden",
    "Raigeki": "Forbidden",
    "The Forceful Sentry": "Forbidden",
    "Imperial Order": "Forbidden",

    // Limited
    "Black Luster Soldier - Envoy of the Beginning": "Limited",
    "Breaker the Magical Warrior": "Limited",
    "Cyber Jar": "Limited",
    "Dark Magician of Chaos": "Limited",
    "D.D. Warrior Lady": "Limited",
    "Exodia the Forbidden One": "Limited",
    "Exiled Force": "Limited",
    "Injection Fairy Lily": "Limited",
    "Jinzo": "Limited",
    "Left Arm of the Forbidden One": "Limited",
    "Left Leg of the Forbidden One": "Limited",
    "Morphing Jar": "Limited",
    "Protector of the Sanctuary": "Limited",
    "Reflect Bounder": "Limited",
    "Right Arm of the Forbidden One": "Limited",
    "Right Leg of the Forbidden One": "Limited",
    "Sacred Phoenix of Nephthys": "Limited",
    "Sangan": "Limited",
    "Sinister Serpent": "Limited",
    "Tribe-Infecting Virus": "Limited",
    "Twin-Headed Behemoth": "Limited",
    "Card Destruction": "Limited",
    "Delinquent Duo": "Limited",
    "Graceful Charity": "Limited",
    "Heavy Storm": "Limited",
    "Lightning Vortex": "Limited",
    "Mage Power": "Limited",
    "Mystical Space Typhoon": "Limited",
    "Pot of Greed": "Limited",
    "Premature Burial": "Limited",
    "Snatch Steal": "Limited",
    "Swords of Revealing Light": "Limited",
    "United We Stand": "Limited",
    "Call of the Haunted": "Limited",
    "Ceasefire": "Limited",
    "Deck Devastation Virus": "Limited",
    "Magic Cylinder": "Limited",
    "Mirror Force": "Limited",
    "Reckless Greed": "Limited",
    "Ring of Destruction": "Limited",
    "Torrential Tribute": "Limited",

    // Semi-Limited
    "Abyss Soldier": "Semi-Limited",
    "Dark Scorpion - Chick the Yellow": "Semi-Limited",
    "Manticore of Darkness": "Semi-Limited",
    "Marauding Captain": "Semi-Limited",
    "Night Assailant": "Semi-Limited",
    "Vampire Lord": "Semi-Limited",
    "Creature Swap": "Semi-Limited",
    "Emergency Provisions": "Semi-Limited",
    "Level Limit - Area B": "Semi-Limited",
    "Nobleman of Crossout": "Semi-Limited",
    "Reinforcement of the Army": "Semi-Limited",
    "Upstart Goblin": "Semi-Limited",
    "Good Goblin Housekeeping": "Semi-Limited",
    "Gravity Bind": "Semi-Limited",
    "Last Turn": "Semi-Limited",
  },

  edison: {
    // Llena esta banlist con el formato Edison (2010)
    // Ejemplo:
    // "Dark Armed Dragon": "Limited",
    // "Honest": "Limited",
  },

  critter: {
    // Llena esta banlist con el formato Critter
    // Ejemplo:
    // "Sangan": "Forbidden",
  }

};

// Función para consultar el estado de una carta en un formato
function getBanlistStatus(cardName, formato) {
  const lista = BANLISTS[formato];
  if (!lista) return "Unlimited";
  return lista[cardName] || "Unlimited";
}

// Cuántas copias puede meter en el deck
function getMaxCopias(cardName, formato) {
  const status = getBanlistStatus(cardName, formato);
  switch (status) {
    case "Forbidden":     return 0;
    case "Limited":       return 1;
    case "Semi-Limited":  return 2;
    default:              return 3;
  }
}
