/* ============================================================
   REDES — die ses meetkunde-redes (Hoofstuk 6: Meetkunde Stellings)
   ------------------------------------------------------------
   Presiese bewoording uit Megan se klasnotas (RUN-PLAN-2026-08-10.md).
   NIE herwoord nie — kort = op die knoppie, vol = die volledige rede.
   ============================================================ */
export const REDES = {
  regoorst:   { kort: "Regoorst. ∠e",         vol: "Regoorstaande hoeke is gelyk" },
  reguitlyn:  { kort: "∠e op 'n reguitlyn",   vol: "Hoeke op 'n reguit lyn tel op tot 180°" },
  ompunt:     { kort: "∠e om 'n punt",        vol: "Hoeke rondom 'n punt tel op tot 360°" },
  binne:      { kort: "Binne ∠e van Δ",       vol: "Binnehoeke van 'n driehoek tel op tot 180°" },
  gelykbenig: { kort: "∠e t.o. = sye",        vol: "Hoeke teenoor gelyke sye is gelyk" },
  buite:      { kort: "Buite ∠ van Δ",        vol: "Buitehoek van Δ = som van die 2 binne teenoorstaande hoeke" },
};

/* al die kodes, in klasnotas-volgorde (vir "kies almal ses" gemengde rondtes) */
export const REDE_CODES = Object.keys(REDES);
