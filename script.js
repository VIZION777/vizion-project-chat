(()=> {
  const $=s=>document.querySelector(s);
  const home=$('#home'),ritual=$('#ritual'),drawer=$('#drawer'),shade=$('#shade'),menu=$('#menuToggle');
  const count=$('#count'),range=$('#range'),stage=$('#fireStage'),canvas=$('#fireCanvas'),toast=$('#toast');
  const ctx=canvas.getContext('2d',{alpha:true});
  const fireImg=new Image();
  fireImg.src='./assets/fire-reference.jpg?v=8';

  let energy=+range.value/100;
  let ready=false;
  let last=performance.now();

  const punishments=[
    'Щоб Wi-Fi ловив тільки біля роутера',
    'Щоб кава завжди остигала за 30 секунд',
    'Щоб зарядка зникала саме коли треба',
    'Щоб будильник дзвонив у вихідний',
    'Щоб після прання губилась одна шкарпетка'
  ];

  function close(){drawer.classList.remove('open');shade.classList.remove('open')}
  function show(x){home.classList.remove('active');ritual.classList.remove('active');x.classList.add('active');close();scrollTo(0,0);setTimeout(resize,30)}
  function n(){return parseInt(count.textContent.replace(/\s/g,''),10)||4351}
  function setN(v){count.textContent=new Intl.NumberFormat('uk-UA').format(v)}
  function note(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove('show'),1800)}

  $('#goRitual').onclick=()=>show(ritual);
  $('#addEnergy').onclick=()=>{range.value=Math.min(100,+range.value+12);range.dispatchEvent(new Event('input'));setN(n()+1);note('Енергію підкинуто')};
  $('#random').onclick=()=>$('#punishment').value=punishments[Math.floor(Math.random()*punishments.length)];
  $('#ritualForm').onsubmit=e=>{e.preventDefault();setN(n()+1);note('Ритуал запущено')};
  menu.onclick=()=>{drawer.classList.toggle('open');shade.classList.toggle('open')};
  shade.onclick=close;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go==='home'?home:ritual));

  range.oninput=()=>{
    energy=+range.value/100;
    stage.style.setProperty('--energy',energy.toFixed(2));
  };

  function resize(){
    const r=canvas.getBoundingClientRect();
    const d=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(r.width*d));
    canvas.height=Math.max(1,Math.round(r.height*d));
    ctx.setTransform(d,0,0,d,0,0);
  }

  function crop(image,w,h){
    const ir=image.width/image.height, cr=w/h;
    let sx=0,sy=0,sw=image.width,sh=image.height;
    if(ir>cr){sw=image.height*cr;sx=(image.width-sw)/2}
    else{sh=image.width/cr;sy=(image.height-sh)/2}
    return {sx,sy,sw,sh};
  }

  function drawBase(w,h){
    if(!ready)return;
    const c=crop(fireImg,w,h);
    ctx.save();
    ctx.filter='brightness('+(0.18+energy*0.58)+') saturate('+(0.60+energy*0.55)+') contrast(1.18)';
    ctx.globalAlpha=.82;
    ctx.drawImage(fireImg,c.sx,c.sy,c.sw,c.sh,0,0,w,h);
    ctx.restore();
  }

  function drawLiveFire(w,h,t){
    if(!ready || energy<.02)return;
    const c=crop(fireImg,w,h);
    const slices=52;
    const dh=h/slices;

    ctx.save();
    ctx.globalCompositeOperation='screen';
    ctx.filter='brightness('+(0.62+energy*0.88)+') saturate('+(1.08+energy*0.62)+') contrast(1.16)';
    ctx.globalAlpha=.15+energy*.86;

    for(let i=0;i<slices;i++){
      const ny=i/(slices-1);
      const srcY=c.sy+c.sh*ny;
      const srcH=c.sh/slices+2;
      const y=i*dh;
      const upper=1-ny;
      const amp=(1.1+energy*7.2)*(0.30+upper*.70);
      const dx=
        Math.sin(t*(2.5+energy*1.9)+i*.46)*amp+
        Math.sin(t*(5.1+energy*1.1)+i*.17)*amp*.30;
      const lift=(Math.sin(t*(2.0+energy*1.6)+i*.21)*.5+.5)*(energy*2.6)*upper;
      const stretch=1+energy*.035*upper;
      ctx.drawImage(
        fireImg,
        c.sx,srcY,c.sw,srcH,
        dx-(w*(stretch-1))/2,
        y-lift,
        w*stretch,
        dh+2
      );
    }
    ctx.restore();

    /* fast dancing highlights */
    ctx.save();
    ctx.globalCompositeOperation='screen';
    ctx.filter='brightness('+(0.7+energy*1.0)+') saturate(1.7) blur(.35px)';
    ctx.globalAlpha=energy*.28;
    const bands=26;
    for(let i=0;i<bands;i++){
      const ny=i/(bands-1);
      const srcY=c.sy+c.sh*ny;
      const srcH=c.sh/bands+2;
      const y=i*(h/bands);
      const amp=energy*(2.0+(1-ny)*8.0);
      const dx=Math.sin(t*6.8+i*.91)*amp;
      const lift=(1-ny)*energy*4.5;
      ctx.drawImage(fireImg,c.sx,srcY,c.sw,srcH,dx,y-lift,w,h/bands+2);
    }
    ctx.restore();
  }

  function glow(w,h,t){
    const pulse=.82+.18*Math.sin(t*7.1);
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const g=ctx.createRadialGradient(w*.5,h*.53,w*.08,w*.5,h*.53,w*.47);
    g.addColorStop(0,'rgba(255,160,35,'+(energy*.055*pulse)+')');
    g.addColorStop(.45,'rgba(255,70,0,'+(energy*.07*pulse)+')');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.restore();
  }

  function render(now){
    const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;
    if(!w||!h){requestAnimationFrame(render);return}
    const t=now/1000;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);

    drawBase(w,h);
    drawLiveFire(w,h,t);
    glow(w,h,t);

    requestAnimationFrame(render);
  }

  fireImg.onload=()=>{ready=true;resize()};
  addEventListener('resize',resize,{passive:true});
  range.dispatchEvent(new Event('input'));
  resize();
  requestAnimationFrame(render);
})();