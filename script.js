(()=> {
  const $=s=>document.querySelector(s);
  const home=$('#home'),ritual=$('#ritual'),drawer=$('#drawer'),shade=$('#shade'),menu=$('#menuToggle');
  const count=$('#count'),range=$('#range'),stage=$('#fireStage'),video=$('#fireVideo'),canvas=$('#fireCanvas'),toast=$('#toast');
  const ctx=canvas.getContext('2d',{alpha:true});
  const tex=document.createElement('canvas'),mask=document.createElement('canvas'),outer=document.createElement('canvas'),outerMask=document.createElement('canvas');
  const tctx=tex.getContext('2d',{alpha:true}),mctx=mask.getContext('2d',{alpha:true}),octx=outer.getContext('2d',{alpha:true}),omctx=outerMask.getContext('2d',{alpha:true});
  let energy=+range.value/100,burn=0,dpr=1,sparks=[],last=performance.now();

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
  menu.onclick=()=>{drawer.classList.toggle('open');shade.classList.toggle('open')};shade.onclick=close;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go==='home'?home:ritual));

  function setEnergy(){
    energy=+range.value/100;
    burn=Math.pow(energy,1.12);
    stage.style.setProperty('--burn',burn.toFixed(3));
    stage.style.setProperty('--energy',energy.toFixed(3));
    range.style.setProperty('--energy',energy.toFixed(3));
    if(video){
      video.playbackRate=.60+burn*1.05;
      if(burn<.015){video.pause();try{video.currentTime=0}catch(e){}}
      else video.play().catch(()=>{});
    }
  }
  range.oninput=setEnergy;

  function resize(){
    const r=canvas.getBoundingClientRect();
    dpr=Math.min(devicePixelRatio||1,2);
    const W=Math.max(1,Math.round(r.width*dpr)),H=Math.max(1,Math.round(r.height*dpr));
    for(const c of [canvas,tex,mask,outer,outerMask]){c.width=W;c.height=H}
    for(const x of [ctx,tctx,mctx,octx,omctx])x.setTransform(dpr,0,0,dpr,0,0);
  }

  function geom(w,h){
    const cx=w*.5,cy=h*.54,R=Math.min(w,h)*.30,P=[];
    for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;P.push([cx+Math.cos(a)*R,cy+Math.sin(a)*R])}
    return {cx,cy,R,P};
  }
  function trace(g,c){
    const E=[[0,2],[2,4],[4,1],[1,3],[3,0]];
    c.beginPath();
    c.arc(g.cx,g.cy,g.R*1.10,0,Math.PI*2);
    c.moveTo(g.P[0][0],g.P[0][1]);
    for(const e of E)c.lineTo(g.P[e[1]][0],g.P[e[1]][1]);
  }
  function drawVideo(c,w,h,shiftY=0,scale=1){
    if(!video||video.readyState<2)return false;
    const vw=video.videoWidth||1,vh=video.videoHeight||1,ir=vw/vh,cr=w/h;
    let sx=0,sy=0,sw=vw,sh=vh;
    if(ir>cr){sw=vh*cr;sx=(vw-sw)/2}else{sh=vw/cr;sy=(vh-sh)/2}
    const dw=w*scale,dh=h*scale;
    c.drawImage(video,sx,sy,sw,sh,(w-dw)/2,(h-dh)/2+shiftY,dw,dh);
    return true;
  }
  function buildMask(c,w,h,g,width,alpha){
    c.clearRect(0,0,w,h);
    c.save();c.lineJoin='round';c.lineCap='round';trace(g,c);
    c.strokeStyle='rgba(255,255,255,'+alpha+')';c.lineWidth=width;c.stroke();c.restore();
  }
  function drawFire(w,h,g){
    if(burn<.02||video.readyState<2)return;

    tctx.clearRect(0,0,w,h);
    tctx.save();
    tctx.filter='saturate('+(1.15+burn*1.05)+') contrast('+(1.14+burn*.24)+') brightness('+(0.92+burn*.95)+')';
    drawVideo(tctx,w,h,-burn*4,1.03);
    tctx.restore();
    buildMask(mctx,w,h,g,8+burn*16,.35+burn*.65);
    tctx.save();tctx.globalCompositeOperation='destination-in';tctx.drawImage(mask,0,0,w,h);tctx.restore();

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=.22+burn*.78;
    ctx.shadowBlur=5+burn*14;ctx.shadowColor='rgba(255,72,0,.95)';
    ctx.drawImage(tex,0,0,w,h);
    ctx.restore();

    octx.clearRect(0,0,w,h);
    octx.save();
    octx.filter='saturate('+(1.25+burn*1.25)+') contrast(1.2) brightness('+(1.0+burn*1.0)+')';
    drawVideo(octx,w,h,-(8+burn*18),1.06+burn*.05);
    octx.restore();
    buildMask(omctx,w,h,g,18+burn*28,.22+burn*.48);
    octx.save();octx.globalCompositeOperation='destination-in';octx.drawImage(outerMask,0,0,w,h);octx.restore();

    ctx.save();
    ctx.globalCompositeOperation='screen';
    ctx.globalAlpha=Math.max(0,(burn-.12)/.88)*.72;
    ctx.filter='blur('+(burn*.45)+'px)';
    ctx.drawImage(outer,0,0,w,h);
    ctx.restore();
  }
  function spawn(g){
    if(burn<.25)return;
    const E=[[0,2],[2,4],[4,1],[1,3],[3,0]];let x,y;
    if(Math.random()<.55){const a=Math.random()*Math.PI*2;x=g.cx+Math.cos(a)*g.R*1.1;y=g.cy+Math.sin(a)*g.R*1.1}
    else{const e=E[Math.floor(Math.random()*E.length)],u=Math.random();x=g.P[e[0]][0]+(g.P[e[1]][0]-g.P[e[0]][0])*u;y=g.P[e[0]][1]+(g.P[e[1]][1]-g.P[e[0]][1])*u}
    sparks.push({x,y,vx:(Math.random()-.5)*18,vy:-34-Math.random()*70,l:0,m:.35+Math.random()*.65,s:.7+Math.random()*1.3});
  }
  function drawSparks(g,dt){
    if(Math.random()<burn*.28)spawn(g);
    sparks=sparks.filter(p=>{p.l+=dt;if(p.l>p.m)return false;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=(1-p.l/p.m)*burn*.75;ctx.fillStyle=Math.random()>.5?'#ffe08a':'#ff7a18';ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();return true});
    ctx.globalAlpha=1;
  }
  function render(now){
    const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;if(!w||!h){requestAnimationFrame(render);return}
    const dt=Math.min(.034,(now-last)/1000||.016);last=now;const g=geom(w,h);
    ctx.clearRect(0,0,w,h);drawFire(w,h,g);drawSparks(g,dt);requestAnimationFrame(render);
  }
  video.addEventListener('canplay',()=>{if(burn>.015)video.play().catch(()=>{})});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&burn>.015)video.play().catch(()=>{})});
  addEventListener('resize',resize,{passive:true});
  setEnergy();resize();requestAnimationFrame(render);
})();