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
  /* Feature 3 (2026-08-10, st3 strikvrae): 'n PSEUDO-kode — nie een
     van die ses regte redes nie, so opsetlik NIE in REDE_CODES nie
     (dit moenie in gemengde-rondtes se "kies uit al ses" verskyn nie).
     Word altyd as 'n ekstra chip aangebied langs REDES op st3, en is
     self die korrekte antwoord op die 3 strikvrae per rondte. */
  geen_regoorst: { kort: "✋ Nie regoorstaande hoeke nie", vol: "Die twee gemerkte hoeke lê langsaan mekaar, nie oorkant die snypunt nie" },
};

/* al die kodes, in klasnotas-volgorde (vir "kies almal ses" gemengde rondtes) —
   'n EKSPLISIETE lys (nie Object.keys(REDES) nie) sodat pseudo-kodes soos
   geen_regoorst hierbo bygevoeg kan word sonder om hulle hier te laat opduik. */
export const REDE_CODES = ["regoorst", "reguitlyn", "ompunt", "binne", "gelykbenig", "buite"];
