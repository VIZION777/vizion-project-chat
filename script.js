(()=>{const $=s=>document.querySelector(s),home=$('#home'),ritual=$('#ritual'),drawer=$('#drawer'),shade=$('#shade'),menu=$('#menuToggle'),count=$('#count'),range=$('#range'),stage=$('#fireStage'),video=$('#fireVideo'),canvas=$('#fireCanvas'),ctx=canvas.getContext('2d'),toast=$('#toast');let energy=+range.value/100,burn=0,sparks=[];const punishments=['Щоб Wi-Fi ловив тільки біля роутера','Щоб кава завжди остигала за 30 секунд','Щоб зарядка зникала саме коли треба','Щоб будильник дзвонив у вихідний','Щоб після прання губилась одна шкарпетка'];function close(){drawer.classList.remove('open');shade.classList.remove('open')}function show(x){home.classList.remove('active');ritual.classList.remove('active');x.classList.add('active');close();scrollTo(0,0);setTimeout(resize,30)}function n(){return parseInt(count.textContent.replace(/\s/g,''),10)||4351}function setN(v){count.textContent=new Intl.NumberFormat('uk-UA').format(v)}function note(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window.t);window.t=setTimeout(()=>toast.classList.remove('show'),1800)}$('#goRitual').onclick=()=>show(ritual);$('#addEnergy').onclick=()=>{range.value=Math.min(100,+range.value+12);range.dispatchEvent(new Event('input'));setN(n()+1);note('Енергію підкинуто')};$('#random').onclick=()=>$('#punishment').value=punishments[Math.floor(Math.random()*punishments.length)];$('#ritualForm').onsubmit=e=>{e.preventDefault();setN(n()+1);note('Ритуал запущено')};menu.onclick=()=>{drawer.classList.toggle('open');shade.classList.toggle('open')};shade.onclick=close;document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go==='home'?home:ritual));

function setEnergy(){
  energy=+range.value/100;
  const normalized=Math.max(0,(energy-.10)/.90);
  burn=Math.pow(normalized,1.20);
  const igniteRadius=(burn*78);
  const metalHeat=Math.pow(Math.max(0,(energy-.03)/.97),1.6);
  stage.style.setProperty('--energy',energy.toFixed(3));
  stage.style.setProperty('--burn',burn.toFixed(3));
  stage.style.setProperty('--igniteRadius',igniteRadius.toFixed(2)+'%');
  stage.style.setProperty('--metalHeat',metalHeat.toFixed(3));
  if(video){
    video.playbackRate=.55+burn*.95;
    if(burn<.01){video.pause();video.currentTime=0;}
    else video.play().catch(()=>{});
  }
}
range.oninput=setEnergy;

function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0)}

function frame(){
  const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;
  ctx.clearRect(0,0,w,h);

  if(burn>.22&&Math.random()<burn*.28){
    const a=Math.random()*Math.PI*2,rad=w*(.18+Math.random()*.24);
    sparks.push({x:w*.5+Math.cos(a)*rad,y:h*.55+Math.sin(a)*rad*.72,vx:(Math.random()-.5)*16,vy:-35-Math.random()*62,l:0,m:.32+Math.random()*.48,s:.6+Math.random()*1.3});
  }
  sparks=sparks.filter(p=>{
    p.l+=.016;if(p.l>p.m)return false;
    p.x+=p.vx*.016;p.y+=p.vy*.016;
    ctx.globalAlpha=(1-p.l/p.m)*burn*.8;
    ctx.fillStyle=Math.random()>.5?'#ffd56b':'#ff7d16';
    ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();
    return true
  });
  ctx.globalAlpha=1;

  // at zero the object stays visible but completely unlit; heat only appears as ignition starts
  if(energy>.03&&energy<.22){
    const pulse=.35+.65*Math.sin(performance.now()/210)*.5+.325;
    ctx.globalCompositeOperation='screen';
    const g=ctx.createRadialGradient(w*.5,h*.55,0,w*.5,h*.55,w*.31);
    const a=Math.max(0,(energy-.03)/.19);
    g.addColorStop(0,'rgba(135,28,7,'+(a*.05*pulse)+')');
    g.addColorStop(.72,'rgba(80,10,0,'+(a*.025*pulse)+')');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation='source-over';
  }
  requestAnimationFrame(frame)
}

video&&video.addEventListener('canplay',()=>{if(burn>.015)video.play().catch(()=>{})});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&video&&burn>.015)video.play().catch(()=>{})});
addEventListener('resize',resize,{passive:true});
setEnergy();resize();requestAnimationFrame(frame)})();