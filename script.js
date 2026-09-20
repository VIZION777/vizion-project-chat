(()=> {
  const $=s=>document.querySelector(s);
  const home=$('#home'),ritual=$('#ritual'),casting=$('#casting'),certificate=$('#certificate');
  const drawer=$('#drawer'),shade=$('#shade'),menu=$('#menuToggle');
  const count=$('#count'),stage=$('#fireStage'),toast=$('#toast');

  const punishments=[
    'Щоб Wi-Fi ловив тільки біля роутера',
    'Щоб кава завжди остигала за 30 секунд',
    'Щоб зарядка зникала саме коли треба',
    'Щоб будильник дзвонив у вихідний',
    'Щоб після прання губилась одна шкарпетка'
  ];

  function close(){drawer.classList.remove('open');shade.classList.remove('open');drawer.setAttribute('aria-hidden','true');menu.setAttribute('aria-expanded','false')}
  function show(x){[home,ritual,casting,certificate].forEach(v=>v&&v.classList.remove('active'));x.classList.add('active');close();scrollTo(0,0)}
  function n(){return parseInt(count.textContent.replace(/\s/g,''),10)||4351}
  function setN(v){count.textContent=new Intl.NumberFormat('uk-UA').format(v);try{localStorage.setItem('curseCount',String(v))}catch(e){}}
  function note(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove('show'),1800)}

  try{
    const saved=parseInt(localStorage.getItem('curseCount')||'',10);
    if(saved>4351)setN(saved);
    const e=Number(localStorage.getItem('curseEnergy'));
    if(Number.isFinite(e)&&e>=0&&e<=100)stage.dataset.energy=String(e);
  }catch(e){}

  let energy=62;
  try{
    const saved=Number(localStorage.getItem('curseEnergy'));
    if(Number.isFinite(saved)&&saved>=0&&saved<=100)energy=saved;
  }catch(e){}
  function setEnergy(v){
    energy=Math.max(0,Math.min(100,v));
    stage.style.setProperty('--energy',(energy/100).toFixed(3));
    try{localStorage.setItem('curseEnergy',String(Math.round(energy)))}catch(e){}
  }

  $('#goRitual').onclick=()=>show(ritual);
  $('#addEnergy').onclick=()=>{
    setEnergy(Math.min(100,energy+12));
    setN(n()+1);
    stage.animate(
      [{transform:'scale(1)'},{transform:'scale(1.045)'},{transform:'scale(1)'}],
      {duration:520,easing:'cubic-bezier(.2,.8,.2,1)'}
    );
    note('Енергію підкинуто');
  };
  $('#random').onclick=()=>$('#punishment').value=punishments[Math.floor(Math.random()*punishments.length)];

  $('#ritualForm').onsubmit=e=>{
    e.preventDefault();
    const who=$('#who').value.trim(),why=$('#why').value.trim(),pun=$('#punishment').value.trim();
    if(!who||!why||!pun){note('Заповніть усі три поля');return}
    setN(n()+1);
    show(casting);
    $('#castingText').textContent=who+' — ритуал уже запущено…';
    const bar=document.querySelector('.castingBar i');
    if(bar){bar.style.animation='none';void bar.offsetWidth;bar.style.animation='castProgress 3.2s linear forwards'}
    setTimeout(()=>{
      const num='PX-'+Date.now().toString().slice(-8);
      $('#certWho').textContent=who;
      $('#certWhy').textContent=why;
      $('#certPunishment').textContent=pun;
      $('#certNumber').textContent=num;
      show(certificate);
    },3300);
  };

  menu.onclick=()=>{
    const open=!drawer.classList.contains('open');
    drawer.classList.toggle('open',open);
    shade.classList.toggle('open',open);
    drawer.setAttribute('aria-hidden',String(!open));
    menu.setAttribute('aria-expanded',String(open));
  };
  shade.onclick=close;

  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go==='home'?home:ritual));
  $('#again').onclick=()=>show(ritual);
  $('#undoCurse').onclick=()=>{show(home);note('Прокляття скасовано')};

  $('#shareCert').onclick=async()=>{
    const text='Прокляття Онлайн — сертифікат № '+$('#certNumber').textContent;
    try{
      if(navigator.share)await navigator.share({title:'Прокляття Онлайн',text,url:location.href});
      else{await navigator.clipboard.writeText(text+' '+location.href);note('Посилання скопійовано')}
    }catch(e){}
  };

  $('#saveCert').onclick=()=>{
    const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
    x.fillStyle='#060606';x.fillRect(0,0,c.width,c.height);
    x.strokeStyle='#6a2528';x.lineWidth=3;x.strokeRect(70,70,940,1210);
    x.textAlign='center';x.fillStyle='#ef3136';x.font='bold 110px Arial';x.fillText('✦',540,220);
    x.fillStyle='#aaa';x.font='24px Arial';x.fillText('ЦИФРОВИЙ СЕРТИФІКАТ',540,280);
    x.fillStyle='#fff';x.font='bold 58px Arial';x.fillText('ПРОКЛЯТТЯ НАКЛАДЕНО',540,370);
    const lines=[['КОГО',$('#certWho').textContent],['ПРИЧИНА',$('#certWhy').textContent],['КАРА',$('#certPunishment').textContent]];
    let y=470;
    for(const [k,v] of lines){x.textAlign='left';x.fillStyle='#8d8d91';x.font='20px Arial';x.fillText(k,120,y);x.fillStyle='#fff';x.font='bold 32px Arial';x.fillText(v.slice(0,48),120,y+44);y+=220}
    x.textAlign='center';x.fillStyle='#8d8d91';x.font='24px Arial';x.fillText('№ '+$('#certNumber').textContent,540,1190);
    c.toBlob(blob=>{if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='prokliattia-'+$('#certNumber').textContent+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)},'image/png')
  };

  const acceptCookies=$('#acceptCookies');
  if(acceptCookies)acceptCookies.onclick=()=>$('#cookieBar').classList.add('hidden');
  setEnergy(energy);
})();