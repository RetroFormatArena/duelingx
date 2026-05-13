// =============================================
// UNIFICADOR DE CARTAS
// Junta los 13 archivos en un solo objeto
// La KEY es el nombre del archivo de imagen
// El campo "name" es el nombre real de la carta
// =============================================

function buildCardPool(...fuentes) {
  const pool = {};
  for (const fuente of fuentes) {
    for (const [key, data] of Object.entries(fuente)) {
      pool[key] = { ...data, key };
    }
  }
  return pool;
}

// Se ejecuta después de que todos los archivos de cartas cargaron
function initCardPool() {
  window.CARD_POOL = buildCardPool(
    typeof monstereffectDetailed   !== "undefined" ? monstereffectDetailed   : {},
    typeof monsterfusionDetailed   !== "undefined" ? monsterfusionDetailed   : {},
    typeof monsternormalDetailed   !== "undefined" ? monsternormalDetailed   : {},
    typeof monsterritualDetailed   !== "undefined" ? monsterritualDetailed   : {},
    typeof spellcontinuousDetailed !== "undefined" ? spellcontinuousDetailed : {},
    typeof spellequipDetailed      !== "undefined" ? spellequipDetailed      : {},
    typeof spellfieldDetailed      !== "undefined" ? spellfieldDetailed      : {},
    typeof spellnormalDetailed     !== "undefined" ? spellnormalDetailed     : {},
    typeof spellquickDetailed      !== "undefined" ? spellquickDetailed      : {},
    typeof spellritualDetailed     !== "undefined" ? spellritualDetailed     : {},
    typeof trapcontinuousDetailed  !== "undefined" ? trapcontinuousDetailed  : {},
    typeof trapcounterDetailed     !== "undefined" ? trapcounterDetailed     : {},
    typeof trapnormalDetailed      !== "undefined" ? trapnormalDetailed      : {}
  );
  console.log(`Card pool listo: ${Object.keys(window.CARD_POOL).length} cartas cargadas.`);
}
