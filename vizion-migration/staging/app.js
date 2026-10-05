(()=>{
const imgs={
"noir-space":"https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=86",
"syntra-ai":"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=86",
"morrow-atelier":"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90",
"casa-forma":"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=90",
"northline-estates":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=86",
"sora-dining":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=86",
"velar-motors":"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=86",
"eira-ritual":"https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=86",
"parallel-studio":"https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1400&q=86",
"nexa-services":"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=88",
"nova-market":"https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=88",
"vizion-27":"https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=86"
};
const grid=document.querySelector("#catalogGrid");
if(!grid)return;
grid.innerHTML=VIZION_STAGING_PROJECTS.map(p=>`<a class="card" href="work.html?project=${p.slug}"><div class="preview" style="--image:url('${imgs[p.slug]}')"></div><div class="card-top"><span>${p.category} #${p.number}</span><span>CONCEPT</span></div><h3>${p.name}</h3><p>${p.desc}</p><div class="price"><small>АДАПТАЦІЯ ВІД</small><strong>${p.price}</strong></div></a>`).join("");
})();