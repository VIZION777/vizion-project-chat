(()=> {
  const $=s=>document.querySelector(s);
  const home=$('#home'),ritual=$('#ritual'),drawer=$('#drawer'),shade=$('#shade'),menu=$('#menuToggle');
  const count=$('#count'),range=$('#range'),stage=$('#fireStage'),video=$('#fireVideo'),canvas=$('#fireCanvas'),toast=$('#toast');
  const ctx=canvas.getContext('2d',{alpha:true});
  const fx=document.createElement('canvas'),mx=document.createElement('canvas');
  const fctx=fx.getContext('2d',{alpha:true}),mctx=mx.getContext('2d',{alpha:true});

  let energy=+range.value/100;
  let burn=0;
  let dpr=1;
  let embers=[];

  const punishments=['Щоб Wi-Fi ловив тільки біля роутера','Щоб кава завжди остигала за 30 секунд','Щоб зарядка зникала саме коли треба','Щоб будильник дзвонив у вихідний','Щоб після прання губилась одна шкарпетка'];

  function close(){drawer.classList.remove('open');shade.classList.remove('open')}
  function show(x){home.classList.remove('active');ritual.classList.remove('active');x.classList.add('active');close();scrollTo(0,0);setTimeout(resize,40)}
  function n(){return parseInt(count.textContent.replace(/\s/g,''),10)||4351}
  function setN(v){count.textContent=new Intl.NumberFormat('uk-UA').format(v)}
  function note(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove('show'),1800)}

  $('#goRitual').onclick=()=>show(ritual);
  $('#addEnergy').onclick=()=>{range.value=Math.min(100,+range.value+12);setEnergy();setN(n()+1);note('Енергію підкинуто')};
  $('#random').onclick=()=>$('#punishment').value=punishments[Math.floor(Math.random()*punishments.length)];
  $('#ritualForm').onsubmit=e=>{e.preventDefault();setN(n()+1);note('Ритуал запущено')};
  menu.onclick=()=>{drawer.classList.toggle('open');shade.classList.toggle('open')};
  shade.onclick=close;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go==='home'?home:ritual));

  function setEnergy(){
    energy=+range.value/100;
    burn=Math.pow(Math.max(0,(energy-.05)/.95),1.12);
    stage.style.setProperty('--burn',burn.toFixed(3));
    if(video){
      video.playbackRate=.55+burn*.85;
      if(burn<.01){video.pause();video.currentTime=0}
      else video.play().catch(()=>{});
    }
  }
  range.oninput=setEnergy;

  function resize(){
    const r=canvas.getBoundingClientRect();
    dpr=Math.min(devicePixelRatio||1,2);
    const W=Math.max(1,Math.round(r.width*dpr));
    const H=Math.max(1,Math.round(r.height*dpr));
    for(const c of [canvas,fx,mx]){c.width=W;c.height=H}
    ctx.setTransform(dpr,0,0,dpr,0,0);
    fctx.setTransform(dpr,0,0,dpr,0,0);
    mctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function geom(w,h){
    const cx=w*.5,cy=h*.55,R=Math.min(w,h)*.34;
    const P=[];
    for(let i=0;i<5;i++){
      const a=-Math.PI/2+i*Math.PI*2/5;
      P.push([cx+Math.cos(a)*R,cy+Math.sin(a)*R]);
    }
    return {cx,cy,R,P};
  }

  function trace(g,c){
    const E=[[0,2],[2,4],[4,1],[1,3],[3,0]];
    c.beginPath();
    c.arc(g.cx,g.cy,g.R*1.04,0,Math.PI*2);
    c.moveTo(g.P[E[0][0]][0],g.P[E[0][0]][1]);
    for(const e of E){
      c.lineTo(g.P[e[1]][0],g.P[e[1]][1]);
    }
  }

  function drawMetal(w,h,g,t){
    const heat=Math.pow(energy,1.8);
    ctx.save();
    ctx.lineJoin='round';ctx.lineCap='round';
    trace(g,ctx);
    ctx.strokeStyle='rgba('+
      Math.round(24+heat*58)+','+
      Math.round(19+heat*16)+','+
      Math.round(18+heat*6)+','+
      (0.78+heat*.12)+')';
    ctx.lineWidth=18+heat*2;
    ctx.shadowBlur=2+heat*7;
    ctx.shadowColor='rgba(120,25,5,'+(heat*.38)+')';
    ctx.stroke();
    ctx.restore();
  }

  function drawVideoCover(c,w,h){
    if(!video || video.readyState<2)return false;
    const vw=video.videoWidth||1,vh=video.videoHeight||1;
    const ir=vw/vh,cr=w/h;
    let sx=0,sy=0,sw=vw,sh=vh;
    if(ir>cr){sw=vh*cr;sx=(vw-sw)/2}else{sh=vw/cr;sy=(vh-sh)/2}
    c.drawImage(video,sx,sy,sw,sh,0,0,w,h);
    return true;
  }

  function maskedFire(w,h,g,t){
    if(burn<=.001 || video.readyState<2)return;

    fctx.clearRect(0,0,w,h);
    fctx.save();
    fctx.filter='saturate('+(1.2+burn*1.5)+') contrast('+(1.2+burn*.25)+') brightness('+(0.78+burn*1.05)+')';
    if(!drawVideoCover(fctx,w,h)){fctx.restore();return}
    fctx.restore();

    mctx.clearRect(0,0,w,h);
    mctx.save();
    mctx.lineJoin='round';mctx.lineCap='round';
    trace(g,mctx);

    // The burning band grows out from the physical sphere itself.
    const hotWidth=10+burn*24;
    mctx.strokeStyle='rgba(255,255,255,'+(0.20+burn*.80)+')';
    mctx.lineWidth=hotWidth;
    mctx.shadowBlur=burn*10;
    mctx.shadowColor='#fff';
    mctx.stroke();
    mctx.restore();

    fctx.save();
    fctx.globalCompositeOperation='destination-in';
    fctx.drawImage(mx,0,0,w,h);
    fctx.restore();

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=.10+burn*.90;
    ctx.shadowBlur=4+burn*16;
    ctx.shadowColor='rgba(255,68,0,.92)';
    ctx.drawImage(fx,0,0,w,h);
    ctx.restore();

    // a second, slightly wider halo made from the same moving fire
    if(burn>.12){
      ctx.save();
      ctx.globalCompositeOperation='screen';
      ctx.globalAlpha=burn*.20;
      ctx.filter='blur('+(1+burn*2.2)+'px) brightness(1.25)';
      ctx.drawImage(fx,-2,-2,w+4,h+4);
      ctx.restore();
    }
  }

  function spawnEmber(g){
    if(burn<.28)return;
    const seg=Math.floor(Math.random()*6);
    let x,y;
    if(seg===5){
      const a=Math.random()*Math.PI*2;
      x=g.cx+Math.cos(a)*g.R*1.04;
      y=g.cy+Math.sin(a)*g.R*1.04;
    }else{
      const E=[[0,2],[2,4],[4,1],[1,3],[3,0]][seg],u=Math.random();
      x=g.P[E[0]][0]+(g.P[E[1]][0]-g.P[E[0]][0])*u;
      y=g.P[E[0]][1]+(g.P[E[1]][1]-g.P[E[0]][1])*u;
    }
    embers.push({x,y,vx:(Math.random()-.5)*14,vy:-28-Math.random()*48,l:0,m:.35+Math.random()*.55,s:.6+Math.random()*1.2});
  }

  function drawEmbers(){
    if(Math.random()<burn*.24)spawnEmber(currentG);
    embers=embers.filter(p=>{
      p.l+=.016;if(p.l>p.m)return false;
      p.x+=p.vx*.016;p.y+=p.vy*.016;
      ctx.globalAlpha=(1-p.l/p.m)*burn*.72;
      ctx.fillStyle=Math.random()>.55?'#ffd26a':'#ff7b16';
      ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();
      return true;
    });
    ctx.globalAlpha=1;
  }

  let currentG=null;
  function render(now){
    const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;
    if(!w||!h){requestAnimationFrame(render);return}
    currentG=geom(w,h);
    ctx.clearRect(0,0,w,h);

    // black stage, then a physical dark sphere
    ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
    drawMetal(w,h,currentG,now/1000);
    maskedFire(w,h,currentG,now/1000);
    drawEmbers();

    requestAnimationFrame(render);
  }

  video.addEventListener('canplay',()=>{if(burn>.01)video.play().catch(()=>{})});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&burn>.01)video.play().catch(()=>{})});
  addEventListener('resize',resize,{passive:true});
  setEnergy();resize();requestAnimationFrame(render);
})();