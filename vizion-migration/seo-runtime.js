(()=>{
  const meta=window.VIZION_ROUTE_META?.[location.pathname];
  if(!meta) return;
  document.title=meta.title;
  let d=document.querySelector('meta[name="description"]');
  if(!d){d=document.createElement("meta");d.name="description";document.head.appendChild(d)}
  d.content=meta.description;

  let canonical=document.querySelector('link[rel="canonical"]');
  if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.appendChild(canonical)}
  canonical.href=location.origin+location.pathname;

  const set=(property,content)=>{
    let el=document.querySelector(`meta[property="${property}"]`);
    if(!el){el=document.createElement("meta");el.setAttribute("property",property);document.head.appendChild(el)}
    el.content=content;
  };
  set("og:title",meta.title);
  set("og:description",meta.description);
  set("og:url",location.origin+location.pathname);
})();