const cfg={
'noir-motors':['NOIR MOTORWORKS','AUTOMOTIVE','Precision in motion.','Performance, sculpture and digital interaction built around the machine.','tpl-auto'],
'atlas-residence':['ATLAS RESIDENCE','REAL ESTATE','A place worth arriving to.','Architecture and atmosphere with a private residence selector.','tpl-arch'],
'elan-clinic':['ÉLAN CLINIC','BEAUTY / CLINIC','Care, made visible.','A calm digital experience built around expertise, trust and effortless booking.','tpl-clinic'],
'sable-jewels':['SABLE','FINE JEWELRY','Objects of desire.','A refined digital atelier for precious objects, materials and private orders.','tpl-jewel'],
'pulse-ai':['PULSE AI','SAAS / AI','Complex product. Clear signal.','A product experience that turns live data into one decisive story.','tpl-saas'],
'nocturne':['NOCTURNE','HOSPITALITY','Stay after dark.','An immersive dining experience built around mood, ritual and reservation.','tpl-night'],
'meridian-capital':['MERIDIAN CAPITAL','PRIVATE CAPITAL','Clarity compounds.','Private capital strategy expressed through restraint, data and confidence.','tpl-finance'],
'black-shield':['BLACK / SHIELD','CYBERSECURITY','Trust nothing. Verify everything.','A live command-center experience for modern cyber defense.','tpl-cyber'],
'helix-bio':['HELIX / BIO','BIOTECH','Research in motion.','A biotech pipeline turned into a clear, living research narrative.','tpl-bio'],
'nord-isles':['NORD ISLES','LUXURY TRAVEL','Go beyond the map.','Private journeys, remote islands and itineraries built around you.','tpl-travel'],
'field-office':['FIELD OFFICE','CREATIVE STUDIO','Make noise with structure.','Independent creative direction for brands that refuse to look familiar.','tpl-creative'],
'still-wellness':['STILL','WELLNESS','Less noise. More signal.','A tactile recovery ritual translated into a quiet digital rhythm.','tpl-wellness']
};
const extra={
'atelier-mono':['ATELIER MONO','FASHION','Wear the silence.','Editorial fashion commerce with a sharp monochrome rhythm.','tpl-jewel'],
'orbit-cloud':['ORBIT CLOUD','SAAS','Infrastructure, visible.','Cloud operations made legible through a live control surface.','tpl-saas'],
'forge-club':['FORGE CLUB','SPORT','Built under pressure.','Training schedules, membership and performance culture.','tpl-auto'],
'nova-academy':['NOVA ACADEMY','EDUCATION','Learn forward.','A modern course catalogue for future-facing skills.','tpl-creative'],
'veritas':['VERITAS','LEGAL','Precision before persuasion.','A legal practice built around clarity, authority and trust.','tpl-finance'],
'solis-hotel':['SOLIS HOTEL','HOTEL','Stay inside the light.','Boutique hospitality with room selection and private booking.','tpl-travel'],
'echo-artist':['ECHO / ARTIST','MUSIC','Turn sound into space.','A release experience for music, dates and visual identity.','tpl-night'],
'mimo-kids':['MIMO KIDS','KIDS','Play by design.','A joyful kids brand where color becomes navigation.','tpl-creative'],
'common-ground':['COMMON GROUND','CAFE','Coffee, without the noise.','Menu, roasting story and neighborhood rhythm.','tpl-wellness'],
'ratio':['RATIO','ARCHITECTURE','Form follows intent.','A spatial portfolio with project filtering and editorial depth.','tpl-arch'],
'nera-beauty':['NERA BEAUTY','COMMERCE','Ritual, not routine.','Beauty commerce shaped around texture, routine and confidence.','tpl-clinic'],
'white-room':['WHITE ROOM','DENTAL','Confidence, clearly.','A treatment selector with a calm clinical visual system.','tpl-clinic'],
'wild-routes':['WILD ROUTES','TRAVEL','Take the longer way.','Adventure travel with flexible trip building.','tpl-travel'],
'brick-form':['BRICK / FORM','CONSTRUCTION','Built to remain.','Construction services expressed with structural confidence.','tpl-finance'],
'bark-care':['BARK & CO.','VET','Care with character.','Pet care booking designed to feel warm, clear and easy.','tpl-wellness'],
'frame-studio':['FRAME / 01','PHOTO','Hold the moment.','A photography portfolio designed as a moving contact sheet.','tpl-night'],
'cuts':['CUTS.','BARBER','Sharp by default.','Service booking with a hard-edged editorial identity.','tpl-auto'],
'northline':['NORTHLINE','LOGISTICS','Move with certainty.','A freight experience with route quote logic and clear status.','tpl-saas'],
'void-arena':['VOID / ARENA','GAMING','Enter the signal.','Competitive gaming as a live broadcast interface.','tpl-cyber'],
'bloom':['BLOOM','EVENTS','Make the day feel yours.','Wedding planning with packages, mood and guest logic.','tpl-jewel'],
'greenhouse':['GREENHOUSE','PLANTS','Grow the room.','Plant commerce with light, care and quantity selection.','tpl-wellness'],
'object-17':['OBJECT / 17','DESIGN','One object. Infinite context.','A collectible design object presented like a museum edition.','tpl-jewel'],
'obelisk':['OBELISK','REAL ESTATE','Private by nature.','A residence collection with quiet luxury and architectural depth.','tpl-arch'],
'mono-bank':['MONO CAPITAL','FINTECH','Money, without theatre.','A fintech experience built around transparent control.','tpl-finance'],
'aura-home':['AURA HOME','INTERIOR','Live with less noise.','Interior objects, space and material in a warm editorial system.','tpl-wellness'],
'kinetic':['KINETIC','AGENCY','Move first.','A motion-first creative studio with energetic transitions.','tpl-creative'],
'terra':['TERRA','FOOD','From ground to table.','A food brand rooted in provenance, season and texture.','tpl-travel'],
'velvet':['VELVET','BEAUTY','Soft power.','A beauty house mixing tactile editorial and modern commerce.','tpl-jewel'],
'arc-lab':['ARC LAB','ARCHITECTURE','Research the room.','Experimental architecture in a system of models and studies.','tpl-arch'],
'north-coast':['NORTH COAST','TRAVEL','Leave the obvious.','Cold-water travel, remote stays and long-form journeys.','tpl-travel']
};
Object.assign(cfg,extra);
const q=new URLSearchParams(location.search),slug=q.get('site')||'noir-motors',embed=q.get('embed')==='1';const c=cfg[slug]||cfg['noir-motors'];document.title=c[0]+' — VIZION';document.body.className=embed?'embed':'';
const images={auto:['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85'],arch:['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85'],soft:['https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1400&q=85','https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85']};
let set=c[4].includes('arch')?images.arch:c[4].includes('clinic')||c[4].includes('wellness')?images.soft:images.auto;
const app=document.getElementById('app');app.innerHTML=`<div class="demo ${c[4]}"><header class="top"><b>${c[0]}</b><span>WORK &nbsp; SERVICES &nbsp; CONTACT</span></header><section class="hero"><div class="hero-copy"><small>${c[1]} / DIGITAL EXPERIENCE</small><h1>${c[2]}</h1><p>${c[3]}</p><a class="cta" href="#work">EXPLORE ↗</a></div></section><div class="ticker"><div>&nbsp; ${c[0]} — DESIGN / MOTION / INTERACTION — ${c[0]} — DESIGN / MOTION / INTERACTION — ${c[0]} — DESIGN / MOTION / INTERACTION —</div></div><section class="section" id="work"><span class="section-label">01 / SELECTED EXPERIENCE</span><h2>Built as a system,<br/>felt as a story.</h2><div class="gallery"><img src="${set[0]}" alt=""><img src="${set[1]}" alt=""></div></section><section class="section"><span class="section-label">02 / CAPABILITIES</span><h2>Direction.<br/>Design. Delivery.</h2><div class="cards"><div class="card"><small>01</small><strong>Art direction</strong></div><div class="card"><small>02</small><strong>Interaction</strong></div><div class="card"><small>03</small><strong>Production</strong></div></div></section><section class="section interactive"><div><span class="section-label">03 / LIVE CONTROL</span><h2>Make it yours.</h2><p>Change the experience live. Every project is designed as a flexible system, not a frozen layout.</p></div><div class="panel"><div><button data-v="A">MODE A</button><button data-v="B">MODE B</button><button data-v="C">MODE C</button></div><div class="panel-output">MODE <b>A</b></div></div></section><section class="section"><span class="section-label">04 / SIGNAL</span><div class="metric">100%</div><h2>Different by design.</h2></section><footer class="footer"><span>${c[0]}</span><span>VIZION / NM KASPER</span></footer></div>`;
document.querySelectorAll('.panel button').forEach(b=>b.onclick=()=>{document.querySelector('.panel-output b').textContent=b.dataset.v;document.querySelector('.panel').style.transform='rotate('+({A:0,B:-2,C:2}[b.dataset.v])+'deg)'})