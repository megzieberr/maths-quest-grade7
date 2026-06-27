/* ============================================================
   QUEST-REGISTER — koppel quest-id → definisie ({ skills: [...] }).
   ============================================================ */
import { CH1 } from "./ch1-uitdrukkings.js";
import { CH2 } from "./ch2-vergelykings.js";
import { CH3 } from "./ch3-meetkunde.js";
import { CH4 } from "./ch4-vorms.js";
import { CH5 } from "./ch5-transformasies.js";

const REGISTRY = { ...CH1, ...CH2, ...CH3, ...CH4, ...CH5 };

export function questDef(id) { return REGISTRY[id] || null; }
