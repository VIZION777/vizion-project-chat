(()=>{
const q=new URLSearchParams(location.search);
const slug=q.get("project")||"noir-space";
const project=VIZION_STAGING_PROJECTS.find(p=>p.slug===slug)||VIZION_STAGING_PROJECTS[0];
const scenes=VIZION_SCENES[slug]||VIZION_SCENES.default;
document.title=project.name+" — VIZION by NM Kasper";
document.querySelector('meta[name="description"]').content=project.desc;
const root=document.querySelector("#workRoot");
root.innerHTML=`<section class="work-entry"><a class="back" href="index.html#catalog">← VIZION / SELECTED WORK</a><span class="kicker">${project.category} / #${project.number}</span><h1>${project.name}</h1><div class="entry-line"><span>01 / ENTRY</span><strong>OPEN → REVIEW → EXPLORE</strong></div></section>`+
scenes.map((s,i)=>`<section class="case-scene"><div class="case-copy"><small>${s[0]}</small><h2>${s[1]}</h2><p>${s[2]}</p><div class="tags">${s[3]}</div></div><div class="laptop-stage"><div class="laptop"><div class="screen-frame"><iframe loading="lazy" title="${project.name} — scene ${i+1}" src="../screen.html?project=${slug}&scene=${i+1}"></iframe></div><div class="laptop-base"></div></div></div></section>`).join("")+
`<section class="work-end"><span class="kicker">VIZION / NEXT</span><h2>ГОТОВІ<br>ДО НАСТУПНОГО?</h2><a href="index.html#catalog">ПОВЕРНУТИСЬ У КАТАЛОГ ↗</a></section>`;
})();