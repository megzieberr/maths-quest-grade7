/* ============================================================
   KONSEPKAARTE — die "Ek is verlore" herverduidelikings (Afrikaans)
   ------------------------------------------------------------
   Kort, vriendelik, met 'n voorbeeld. getConcept(id) -> {title, body}
   ============================================================ */
const C = {
  /* ---- Hoofstuk 1: Uitdrukkings ---- */
  dele: { title: "Dele van 'n uitdrukking", body: `
    <p>Algebra is wiskunde met letters. 'n Letter wat 'n onbekende getal voorstel, word 'n <b>veranderlike</b> genoem.</p>
    <ul>
      <li>Die <b>koëffisiënt</b> is die getal vóór die veranderlike — by <code>3x</code> is dit 3.</li>
      <li>'n <b>Konstante</b> is 'n getal op sy eie — by <code>2x + 5</code> is 5 die konstante.</li>
      <li>Die <b>eksponent</b> (mag) is die klein getalletjie regs-bo — by <code>4a³</code> is dit 3. Dit sê hoeveel keer <code>a</code> met homself maal word.</li>
      <li>'n <b>Term</b> is 'n stuk wat deur <code>+</code> of <code>−</code> geskei word. <code>3x² + 5x − 7</code> het 3 terme.</li>
    </ul>` },
  gelyksoortig: { title: "Gelyksoortige terme", body: `
    <p><b>Gelyksoortige terme</b> het presies dieselfde veranderlike(s) — net die koëffisiënt mag verskil.</p>
    <ul>
      <li><code>3a²</code> en <code>5a²</code> is gelyksoortig.</li>
      <li><code>3ab</code> en <code>2ba</code> is gelyksoortig (volgorde maak nie saak nie).</li>
      <li><code>4a</code> en <code>4a²</code> is <b>nie</b> gelyksoortig nie (een het 'n kwadraat).</li>
    </ul>` },
  kombineer: { title: "Tel terme op en trek af", body: `
    <p>Jy kan <b>net gelyksoortige terme</b> bymekaartel of aftrek. Tel die getalle (koëffisiënte) — die veranderlike bly presies dieselfde.</p>
    <ul>
      <li><code>3x + 5x = 8x</code> (3 + 5 = 8)</li>
      <li><code>7a − 2a = 5a</code> (7 − 2 = 5)</li>
    </ul>
    <p>Pasop: die veranderlike verdwyn nie, en jy <b>maal</b> nie die getalle nie — <code>3x + 5x</code> is <code>8x</code>, nié <code>15x</code> nie.</p>` },
  vervang: { title: "Vervang en bereken", body: `
    <p>Om te <b>vervang</b>: skryf die getal in die plek van die letter, dan werk jy uit.</p>
    <p>As <code>y = 7</code>, dan is <code>3y + 6 = 3(7) + 6 = 27</code>.</p>
    <p>Onthou: maal voor optel. By <code>4b²</code> kwadreer jy eers <code>b</code> en maal dan met 4.</p>` },
  insetuitset: { title: "Inset en uitset", body: `
    <p>'n Reël vat 'n <b>inset</b>, werk dit uit, en gee 'n <b>uitset</b>.</p>
    <p>Reël <code>3n + 5</code>: inset 5 → <code>3(5) + 5 = 20</code>.</p>
    <p>Andersom: as die uitset 20 is, los <code>3n + 5 = 20</code> op om die inset te kry.</p>` },
  skryf: { title: "Skryf 'n uitdrukking uit woorde", body: `
    <p>"Som" = optel · "verskil" = aftrek · "produk" = maal · "kwosiënt" = deel.</p>
    <ul>
      <li>Moenie <code>×</code> skryf nie — skryf maal as <code>3y</code>.</li>
      <li>Skryf deel as 'n breuk.</li>
    </ul>
    <p>"3 maal 'n getal, van 7 afgetrek" = <code>7 − 3x</code>.</p>` },
  patrone: { title: "Getalpatrone", body: `
    <p>Die reël van 'n ry skryf ons as <code>Tn = dn + c</code>, waar <code>d</code> die verskil tussen terme is.</p>
    <p>Ry <code>5; 7; 9; 11</code>: die verskil is 2, so begin met <code>2n</code>. Toets: <code>2(1)=2</code>, maar ons wil 5 hê, so <code>+3</code>… nee — werk uit: <code>c = 5 − 2 = 3</code>. Reël = <code>2n + 3</code>.</p>
    <p>Term 12 = <code>2(12) + 3 = 27</code>.</p>` },

  /* ---- Hoofstuk 2: Vergelykings ---- */
  eenstap: { title: "Een-stap vergelykings", body: `
    <p>"Los op vir <code>x</code>" beteken kry <code>x</code> alleen. Doen die <b>teenoorgestelde</b> bewerking.</p>
    <ul>
      <li><code>+</code> word <code>−</code>: <code>x + 5 = 8</code> → <code>x = 8 − 5 = 3</code></li>
      <li><code>×</code> word <code>÷</code>: <code>6x = 12</code> → <code>x = 12 ÷ 6 = 2</code></li>
    </ul>
    <p>Wat jy aan een kant doen, doen jy aan die ander kant ook — hou die skaal in balans.</p>` },
  tweestap: { title: "Twee-stap vergelykings", body: `
    <p>Haal <b>eers</b> die los konstante (die <code>+</code> of <code>−</code> getal) weg, breek <b>dan</b> die koëffisiënt op.</p>
    <p><code>5x − 2 = 18</code><br>→ <code>5x = 20</code> (tel 2 by)<br>→ <code>x = 4</code> (deel deur 5)</p>` },
  spesiaal: { title: "Lastige vergelykings", body: `
    <p><b>Negatiewe koëffisiënt:</b> <code>−3x = 12</code> → <code>x = 12 ÷ −3 = −4</code>.</p>
    <p><b>Veranderlike albei kante:</b> skuif die <code>x</code>'e na een kant en die getalle na die ander. <code>9y − 2 = 10y + 4</code> → <code>−2 − 4 = 10y − 9y</code> → <code>y = −6</code>.</p>` },
  toets: { title: "Toets 'n vergelyking", body: `
    <p>Vervang jou antwoord terug. Werk die <b>linkerkant (LK)</b> en <b>regterkant (RK)</b> apart uit.</p>
    <p>As <code>LK = RK</code>, is dit reg. By <code>x + 5 = 8</code> met <code>x = 3</code>: LK = <code>3 + 5 = 8</code>, RK = 8. Gelyk → waar.</p>` },

  /* ---- Hoofstuk 3: Meetkunde ---- */
  gradeboog: { title: "Lees die gradeboog", body: `
    <p>Sit die <b>middelpunt</b> van die gradeboog op die hoekpunt (O) en een arm op die <b>0-lyn</b>.</p>
    <p>Volg die ander arm (B) tot by die skaal en lees die getal af.</p>
    <ul>
      <li>Minder as 90° = <b>skerphoek</b></li>
      <li>Presies 90° = <b>regtehoek</b></li>
      <li>Tussen 90° en 180° = <b>stomphoek</b></li>
    </ul>
    <p>Skat eers watter tipe dit is — dit help jou die regte getal kies.</p>` },
  hoektipes: { title: "Soorte hoeke", body: `
    <ul>
      <li><b>Skerphoek</b>: tussen 0° en 90°</li>
      <li><b>Regtehoek</b>: presies 90°</li>
      <li><b>Stomphoek</b>: tussen 90° en 180°</li>
      <li><b>Gestrekte hoek</b>: presies 180°</li>
      <li><b>Inspringende (refleks) hoek</b>: tussen 180° en 360°</li>
      <li><b>Omwenteling</b>: presies 360°</li>
    </ul>` },
  lyne: { title: "Lyne & notasie", body: `
    <ul>
      <li><b>Ewewydig (parallel):</b> loop langs mekaar, sny nooit. Pyltjies op die lyne. <code>AB // CD</code>.</li>
      <li><b>Loodreg:</b> sny teen 90°. 'n Vierkantjie by die snypunt. <code>AB ⟂ CD</code>.</li>
      <li><b>Strepies</b> op lyne beteken hulle is ewe lank.</li>
    </ul>` },
  hoekverwant: { title: "Hoekverwantskappe", body: `
    <ul>
      <li><b>Komplementêr:</b> twee hoeke maak saam 90°.</li>
      <li><b>Supplementêr:</b> twee hoeke maak saam 180°.</li>
      <li><b>Hoeke op 'n reguitlyn</b> tel saam tot 180°.</li>
      <li><b>Regoorstaande hoeke</b> (waar twee lyne sny) is gelyk.</li>
      <li><b>Hoeke rondom 'n punt</b> tel saam tot 360°.</li>
    </ul>` },
  reflekshoek: { title: "Inspringende (refleks) hoeke", body: `
    <p>'n <b>Inspringende (refleks) hoek</b> lê tussen 180° en 360° — dit is die GROOT hoek aan die buitekant.</p>
    <p>Die kleiner hoek en die refleks-hoek maak saam 'n volle draai: <code>360°</code>.</p>
    <p>So: <b>refleks-hoek = 360° − die kleiner hoek</b>. Bv. kleiner hoek 110° → refleks = <code>360 − 110 = 250°</code>.</p>` },
  sirkeldele: { title: "Dele van 'n sirkel", body: `
    <ul>
      <li><b>Radius (straal):</b> van die middelpunt na die omtrek.</li>
      <li><b>Middellyn (deursnee):</b> oor die sirkel deur die middel. <code>Middellyn = 2 × radius</code>.</li>
      <li><b>Koord:</b> verbind twee punte op die omtrek, nie deur die middel nie.</li>
      <li><b>Sektor:</b> 'n stuk tussen twee radiusse.</li>
    </ul>` },

  /* ---- Hoofstuk 4: 2D Vorms ---- */
  driehoeke: { title: "Soorte driehoeke", body: `
    <p><b>Volgens sye:</b> gelyksydig (3 gelyk), gelykbenig (2 gelyk), ongelyksydig (geen gelyk).</p>
    <p><b>Volgens hoeke:</b> skerphoekig (almal &lt; 90°), reghoekig (een = 90°), stomphoekig (een &gt; 90°).</p>` },
  hoeksom: { title: "Driehoek-hoeksom", body: `
    <p>Die drie binnehoeke van enige driehoek maak altyd saam <b>180°</b>.</p>
    <p>Twee hoeke 50° en 60°? Derde = <code>180 − 50 − 60 = 70°</code>.</p>
    <p>Gelyksydig: al drie hoeke is 60°.</p>` },
  poligone: { title: "Poligone", body: `
    <p>'n <b>Poligoon</b> is 'n geslote vorm met reguit sye en 3+ hoeke. Geboë sye? Dan is dit nie 'n poligoon nie.</p>
    <ul>
      <li>3 = driehoek · 4 = vierhoek · 5 = pentagoon</li>
      <li>6 = heksagoon · 7 = heptagoon · 8 = oktagoon</li>
      <li>9 = nonagoon · 10 = dekagoon</li>
    </ul>` },
  vierhoeke: { title: "Vierhoeke", body: `
    <ul>
      <li><b>Vierkant:</b> 4 gelyke sye, alle hoeke 90°.</li>
      <li><b>Reghoek:</b> alle hoeke 90°, teenoorstaande sye gelyk.</li>
      <li><b>Parallelogram:</b> teenoorstaande sye parallel en gelyk.</li>
      <li><b>Ruit:</b> 4 gelyke sye, hoeklyne sny loodreg.</li>
      <li><b>Trapesium:</b> net 1 paar parallelle sye.</li>
    </ul>` },
  kongruent: { title: "Kongruent of gelykvormig?", body: `
    <p><b>Kongruent</b> (<code>≡</code>): presies dieselfde — sye én hoeke gelyk. Net die posisie verskil.</p>
    <p><b>Gelykvormig</b> (<code>|||</code>): dieselfde vorm, ander grootte. Hoeke gelyk, sye in verhouding.</p>
    <p>Voorwaardes om driehoeke kongruent te bewys: <b>SSS</b>, <b>SHS</b>, <b>HHS</b>, <b>RSS</b>.</p>` },

  /* ---- Hoofstuk 5: Transformasies ---- */
  transformasie: { title: "Soorte transformasies", body: `
    <ul>
      <li><b>Translasie:</b> die vorm skuif — op, af, links of regs. Geen draai of flip.</li>
      <li><b>Refleksie:</b> die vorm word geflip om 'n as (spieëlbeeld).</li>
      <li><b>Rotasie:</b> die vorm draai om 'n vaste punt.</li>
    </ul>
    <p>By al drie bly die grootte en vorm presies dieselfde.</p>` },
  translasie: { title: "Translasie & koördinate", body: `
    <p>By 'n translasie skuif elke punt ewe ver in dieselfde rigting.</p>
    <ul>
      <li><b>Regs</b> = <code>x</code> word groter · <b>links</b> = <code>x</code> kleiner.</li>
      <li><b>Op</b> = <code>y</code> word groter · <b>af</b> = <code>y</code> kleiner.</li>
    </ul>
    <p>Punt <code>(2; 3)</code>, skuif 5 regs en 4 af → <code>(2+5; 3−4) = (7; −1)</code>.</p>` },
  rotasie: { title: "Rotasie & refleksie", body: `
    <ul>
      <li><b>90° kloksgewys</b> = die vorm val vorentoe.</li>
      <li><b>90° anti-kloksgewys</b> = die vorm val agtertoe.</li>
      <li><b>180°</b> = die vorm draai onderste-bo.</li>
    </ul>
    <p>By refleksie lê 'n punt en sy beeld (A en A′) ewe ver van die as af.</p>` },
  simmetrie: { title: "Simmetrie", body: `
    <p>'n <b>Simmetrie-as</b> verdeel 'n vorm in twee presies eenderse helftes.</p>
    <p><b>Orde van rotasiesimmetrie:</b> hoeveel keer 'n vorm op homself pas in een volle draai.</p>
    <p>'n Reëlmatige veelhoek het eweveel simmetrielyne as sye: vierkant 4, gelyksydige driehoek 3, seshoek 6.</p>` },
  vergroting: { title: "Vergroting & skaalfaktor", body: `
    <p>By vergroting/verkleining bly die vorm dieselfde, net die grootte verander.</p>
    <p>Die <b>skaalfaktor</b> sê met hoeveel keer die sye verander.</p>
    <ul>
      <li>Faktor 3: elke sy word 3× langer.</li>
      <li>Skaalfaktor = <code>nuwe lengte ÷ ou lengte</code>. Van 4 na 12? Faktor = <code>12 ÷ 4 = 3</code>.</li>
    </ul>` },
};

export const CONCEPTS = C;                 // gebruik deur die admin-dashboard
export function getConcept(id) { return C[id] || null; }
