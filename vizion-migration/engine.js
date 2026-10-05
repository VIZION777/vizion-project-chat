(()=>{
const p=new URLSearchParams(location.search);
const key=p.get("project")||"noir-space";
const scene=Math.min(7,Math.max(1,Number(p.get("scene")||1)));
const d=window.VIZION_PROJECTS[key]||window.VIZION_PROJECTS["noir-space"];
document.documentElement.style.setProperty("--bg",d.bg);
document.documentElement.style.setProperty("--fg",d.fg);
document.documentElement.style.setProperty("--accent",d.accent);
const app=document.querySelector("#screen");

const nav=()=>`<div class="screen-nav"><b>${d.name}</b><span>${String(scene).padStart(2,"0")} / 07</span></div>`;
const heroText=(label)=>`<div class="copy"><small>${label}</small><h1>${d.headline}</h1><p>${d.sub}</p></div>`;
const media=()=>d.video?`<video autoplay muted loop playsinline preload="metadata"><source src="${d.video}" type="video/mp4"></video>`:`<img src="${d.image}" alt="">`;
const cards=()=>`<div class="cards">${d.cards.map((x,i)=>`<article><span>0${i+1}</span><b>${x}</b><small>${d.detail[i]}</small></article>`).join("")}</div>`;

const scenes={
1:()=>`<section class="scene hero-film">${media()}<div class="shade"></div>${nav()}${heroText("OPENING / LIVE ART")}<div class="index">01 — ENTRY</div></section>`,
2:()=>`<section class="scene structure">${nav()}<div class="grid-lines"></div>${heroText("STRUCTURE / UX")}<div class="wire"><i></i><i></i><i></i><i></i></div>${cards()}</section>`,
3:()=>`<section class="scene motion">${media()}<div class="film-mask"></div>${nav()}<div class="frame-counter">FRAME <b>0${Math.floor(Math.random()*8)+1}</b></div><div class="motion-title">MOTION<br>BEHAVIOUR</div><div class="playline"><i></i></div></section>`,
4:()=>`<section class="scene system">${nav()}${heroText("SYSTEM / DETAIL")}<div class="type-spec"><b>Aa</b><span>Display / 88<br>Body / 14<br>Mono / 09</span></div><div class="swatches"><i></i><i></i><i></i></div><div class="spacing">08 — 16 — 24 — 48 — 96</div></section>`,
5:()=>`<section class="scene build">${nav()}<div class="terminal"><small>BUILD / FRONTEND</small><p>&gt; component map <b>PASS</b><br>&gt; responsive states <b>PASS</b><br>&gt; media pipeline <b>PASS</b><br>&gt; interaction timing <b>PASS</b><br>&gt; browser qa <b>RUNNING</b></p></div><div class="build-meter"><i></i><span>94%</span></div></section>`,
6:()=>`<section class="scene responsive">${nav()}<div class="devices"><div class="desk"><span>${d.name}</span></div><div class="tab"><span>TABLET</span></div><div class="phone"><span>MOBILE</span></div></div><div class="qa"><b>DESKTOP</b><b>TABLET</b><b>MOBILE</b><small>TYPE / CROP / NAV / CTA</small></div></section>`,
7:()=>`<section class="scene final">${media()}<div class="shade"></div>${nav()}<div class="final-mark">LIVE<br>SITE</div><div class="final-copy"><small>FINAL / PRESENTATION</small><h2>READY TO EXPLORE.</h2><p>Desktop, tablet and mobile — final QA passed.</p><button type="button">OPEN FULL EXPERIENCE ↗</button></div></section>`
};
app.innerHTML=scenes[scene]();
})();