# Wiskunde Avontuur · Graad 7

'n Gegamifiseerde wiskunde-oefenspel vir Graad 7 (Kwartaal 3). Engelse spel-omhulsel, **alle inhoud en vrae in Afrikaans**.

Afdelings: **Algebraïese Uitdrukkings · Algebraïese Vergelykings · Reguitlyn Meetkunde · 2D Vorms · Transformasies.**

## Speel
- Live: https://megzieberr.github.io/maths-quest-grade7/
- Admin (onderwyser): https://megzieberr.github.io/maths-quest-grade7/admin.html

## Hoe dit werk
- **Self-registrasie** — leerders skep hul eie rekening (gebruikersnaam + wagwoord). Wagwoorde word op die bediener **bcrypt-gehash**; die onderwyser sien dit nooit.
- **Reaktiewe hulp** — 💡 Wenk → uitgewerkte oplossing → 🆘 "Ek is verlore" konsepkaart → meester-lus met vars syfers.
- **Diagramme** — akkurate gradeboog (dubbele skaal), sirkeldele en transformasie-roosters, alles op skaal bereken.
- **Vordering** stoor na Supabase (XP, gemeesterde quests, sukkel-vlae per konsep).

## Tegnies
Statiese ES-modules (geen bou-stap). Backend = Supabase (RLS + SECURITY DEFINER RPC's; net die publiek-veilige publishable key in die kliënt). SQL in `supabase/schema.sql`.

Plaaslike toets sonder backend: voeg `?local=1` by die URL.
