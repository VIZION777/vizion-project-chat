(()=> {
  const $=s=>document.querySelector(s);
  const home=$('#home'),ritual=$('#ritual'),drawer=$('#drawer'),shade=$('#shade'),menu=$('#menuToggle');
  const count=$('#count'),range=$('#range'),stage=$('#fireStage'),video=$('#fireVideo'),canvas=$('#fireCanvas'),toast=$('#toast');
  const ctx=canvas.getContext('2d',{alpha:true});

  const tex=document.createElement('canvas');
  const coreMask=document.createElement('canvas');
  const haloMask=document.createElement('canvas');
  const outer=document.createElement('canvas');
  const tctx=tex.getContext('2d',{alpha:true});
  const cctx=coreMask.getContext('2d',{alpha:true});
  const hctx=haloMask.getContext('2d',{alpha:true});
  const octx=outer.getContext('2d',{alpha:true});

  let energy=+range.value/100;
  let burn=0;
  let dpr=1;
  let sparks=[];
  let last=performance.now();

  const punishments=[
    'Щоб Wi-Fi ловив тільки біля роутера',
    'Щоб кава завжди остигала за 30 секунд',
    'Щоб зарядка зникала саме коли треба',
    'Щоб будильник дзвонив у вихідний',
    'Щоб після прання губилась одна шкарпетка'
  ];

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
    burn=Math.pow(Math.max(0,(energy-.08)/.92),1.08);
    stage.style.setProperty('--burn',burn.toFixed(3));
    stage.style.setProperty('--energy',energy.toFixed(3));
    range.style.setProperty('--energy',energy.toFixed(3));
    if(video){
      video.playbackRate=.70+burn*.55;
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
    for(const c of [canvas,tex,coreMask,haloMask,outer]){c.width=W;c.height=H}
    for(const x of [ctx,tctx,cctx,hctx,octx])x.setTransform(dpr,0,0,dpr,0,0);
  }

  function geom(w,h){
    const cx=w*.5,cy=h*.54,R=Math.min(w,h)*.255;
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
    c.arc(g.cx,g.cy,g.R*1.08,0,Math.PI*2);
    c.moveTo(g.P[0][0],g.P[0][1]);
    for(const e of E)c.lineTo(g.P[e[1]][0],g.P[e[1]][1]);
  }

  function drawVideoCover(c,w,h,ox=0,oy=0,scale=1){
    if(!video || video.readyState<2)return false;
    const vw=video.videoWidth||1,vh=video.videoHeight||1;
    const ir=vw/vh,cr=w/h;
    let sx=0,sy=0,sw=vw,sh=vh;
    if(ir>cr){sw=vh*cr;sx=(vw-sw)/2}else{sh=vw/cr;sy=(vh-sh)/2}
    const dw=w*scale,dh=h*scale;
    c.drawImage(video,sx,sy,sw,sh,(w-dw)/2+ox,(h-dh)/2+oy,dw,dh);
    return true;
  }

  function buildMask(c,w,h,g,width,alpha,mode){
    c.clearRect(0,0,w,h);
    c.save();
    c.lineJoin='round';c.lineCap='round';
    trace(g,c);
    c.strokeStyle='rgba(255,255,255,'+alpha+')';
    c.lineWidth=width;
    c.stroke();

    // progressive ignition: first upper ring, then full ring, then star
    if(mode==='progress'){
      c.globalCompositeOperation='destination-in';
      const grad=c.createLinearGradient(0,h*.86,0,h*.18);
      const p=burn;
      const edge=Math.max(.02,1-p);
      grad.addColorStop(0,'rgba(255,255,255,'+Math.max(0,(p-.50)*2)+')');
      grad.addColorStop(Math.min(.92,edge+.12),'rgba(255,255,255,'+Math.min(1,p*1.15)+')');
      grad.addColorStop(1,'rgba(255,255,255,'+Math.min(1,.12+p*1.5)+')');
      c.fillStyle=grad;c.fillRect(0,0,w,h);
    }
    c.restore();
  }

  function fireLayer(w,h,g){
    if(burn<=.005 || video.readyState<2)return;

    // moving texture
    tctx.clearRect(0,0,w,h);
    tctx.save();
    tctx.filter='saturate('+(1.15+burn*.85)+') contrast('+(1.14+burn*.16)+') brightness('+(0.74+burn*.76)+')';
    drawVideoCover(tctx,w,h,0,-burn*5,1.02+burn*.025);
    tctx.restore();

    // core: fire lives ON the ring/star strokes
    buildMask(cctx,w,h,g,5+burn*12,.18+burn*.82,'progress');
    tctx.save();
    tctx.globalCompositeOperation='destination-in';
    tctx.drawImage(coreMask,0,0,w,h);
    tctx.restore();

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=.16+burn*.82;
    ctx.shadowBlur=3+burn*10;
    ctx.shadowColor='rgba(255,75,0,.82)';
    ctx.drawImage(tex,0,0,w,h);
    ctx.restore();

    // outer tongues: wider mask, shifted upward, so flame protrudes off metal
    octx.clearRect(0,0,w,h);
    octx.save();
    octx.filter='saturate('+(1.25+burn*1.05)+') contrast(1.17) brightness('+(0.85+burn*.85)+') blur(.25px)';
    drawVideoCover(octx,w,h,0,-(4+burn*14),1.035+burn*.045);
    octx.restore();

    buildMask(hctx,w,h,g,14+burn*20,.12+burn*.48,'progress');
    octx.save();
    octx.globalCompositeOperation='destination-in';
    octx.drawImage(haloMask,0,0,w,h);
    octx.restore();

    ctx.save();
    ctx.globalCompositeOperation='screen';
    ctx.globalAlpha=Math.max(0,(burn-.08)/.92)*.48;
    ctx.filter='blur('+(burn*.55)+'px)';
    ctx.drawImage(outer,0,0,w,h);
    ctx.restore();
  }

  function spawn(g){
    if(burn<.34)return;
    const E=[[0,2],[2,4],[4,1],[1,3],[3,0]];
    let x,y;
    if(Math.random()<.56){
      const a=Math.random()*Math.PI*2;
      x=g.cx+Math.cos(a)*g.R*1.08;
      y=g.cy+Math.sin(a)*g.R*1.08;
    }else{
      const e=E[Math.floor(Math.random()*E.length)],u=Math.random();
      x=g.P[e[0]][0]+(g.P[e[1]][0]-g.P[e[0]][0])*u;
      y=g.P[e[0]][1]+(g.P[e[1]][1]-g.P[e[0]][1])*u;
    }
    sparks.push({x,y,vx:(Math.random()-.5)*15,vy:-30-Math.random()*55,l:0,m:.38+Math.random()*.55,s:.55+Math.random()*1.15});
  }

  function drawSparks(g,dt){
    if(Math.random()<burn*.18)spawn(g);
    sparks=sparks.filter(p=>{
      p.l+=dt;if(p.l>p.m)return false;
      p.x+=p.vx*dt;p.y+=p.vy*dt;
      ctx.globalAlpha=(1-p.l/p.m)*burn*.55;
      ctx.fillStyle=Math.random()>.55?'#ffd77a':'#ff8a1e';
      ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();
      return true;
    });
    ctx.globalAlpha=1;
  }

  function render(now){
    const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;
    if(!w||!h){requestAnimationFrame(render);return}
    const dt=Math.min(.034,(now-last)/1000||.016);last=now;
    const g=geom(w,h);

    ctx.clearRect(0,0,w,h);
    fireLayer(w,h,g);
    drawSparks(g,dt);

    requestAnimationFrame(render);
  }

  video.addEventListener('canplay',()=>{if(burn>.01)video.play().catch(()=>{})});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&burn>.01)video.play().catch(()=>{})});
  addEventListener('resize',resize,{passive:true});
  setEnergy();resize();requestAnimationFrame(render);
})();