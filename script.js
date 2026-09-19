(()=> {
  const home=document.querySelector('#home');
  const ritual=document.querySelector('#ritual');
  const drawer=document.querySelector('#drawer');
  const shade=document.querySelector('#shade');
  const menu=document.querySelector('#menuToggle');
  const count=document.querySelector('#count');
  const range=document.querySelector('#range');
  const fireStage=document.querySelector('#fireStage');
  const canvas=document.querySelector('#fireCanvas');
  const toast=document.querySelector('#toast');

  const punishments=[
    'Щоб Wi-Fi ловив тільки біля роутера',
    'Щоб кава завжди остигала за 30 секунд',
    'Щоб зарядка зникала саме коли треба',
    'Щоб будильник дзвонив у вихідний',
    'Щоб після прання губилась одна шкарпетка'
  ];

  function show(x){
    home.classList.remove('active');
    ritual.classList.remove('active');
    x.classList.add('active');
    closeMenu();
    scrollTo(0,0);
    setTimeout(resizeGL,30);
  }
  function closeMenu(){drawer.classList.remove('open');shade.classList.remove('open')}
  function n(){return parseInt(count.textContent.replace(/\s/g,''),10)||4351}
  function setN(v){count.textContent=new Intl.NumberFormat('uk-UA').format(v)}
  function note(t){
    toast.textContent=t;
    toast.classList.add('show');
    clearTimeout(window.__toast);
    window.__toast=setTimeout(()=>toast.classList.remove('show'),2200);
  }

  document.querySelector('#goRitual').onclick=()=>show(ritual);
  document.querySelector('#addEnergy').onclick=()=>{
    range.value=Math.min(100,+range.value+12);
    range.dispatchEvent(new Event('input'));
    setN(n()+1);
    note('Енергію підкинуто');
  };
  document.querySelector('#random').onclick=()=>{
    document.querySelector('#punishment').value=punishments[Math.floor(Math.random()*punishments.length)];
  };
  document.querySelector('#ritualForm').onsubmit=e=>{
    e.preventDefault();
    setN(n()+1);
    note('Ритуал запущено');
  };
  menu.onclick=()=>{drawer.classList.toggle('open');shade.classList.toggle('open')};
  shade.onclick=closeMenu;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go==='home'?home:ritual));

  let energy=+range.value/100;
  range.oninput=()=>{
    energy=+range.value/100;
    fireStage.style.setProperty('--energy',energy.toFixed(2));
  };
  range.dispatchEvent(new Event('input'));

  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:false});
  if(!gl){
    canvas.style.display='none';
    note('WebGL недоступний у цьому браузері');
    return;
  }

  const vs=`
    attribute vec2 a_position;
    void main(){gl_Position=vec4(a_position,0.0,1.0);}
  `;

  const fs=`
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_energy;

    float hash(vec2 p){
      p=fract(p*vec2(123.34,456.21));
      p+=dot(p,p+45.32);
      return fract(p.x*p.y);
    }

    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),
                 mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
    }

    float fbm(vec2 p){
      float v=0.0;
      float a=.55;
      for(int i=0;i<5;i++){
        v+=a*noise(p);
        p=p*2.03+vec2(13.7,9.2);
        a*=.48;
      }
      return v;
    }

    float sdSegment(vec2 p,vec2 a,vec2 b){
      vec2 pa=p-a, ba=b-a;
      float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
      return length(pa-ba*h);
    }

    vec2 pt(float ang,float r){return vec2(cos(ang),sin(ang))*r;}

    float starDist(vec2 p){
      float PI=3.14159265359;
      vec2 p0=pt(-PI*.5,0.70);
      vec2 p1=pt(-PI*.5+PI*2.0/5.0,0.70);
      vec2 p2=pt(-PI*.5+PI*4.0/5.0,0.70);
      vec2 p3=pt(-PI*.5+PI*6.0/5.0,0.70);
      vec2 p4=pt(-PI*.5+PI*8.0/5.0,0.70);
      float d=10.0;
      d=min(d,sdSegment(p,p0,p2));
      d=min(d,sdSegment(p,p2,p4));
      d=min(d,sdSegment(p,p4,p1));
      d=min(d,sdSegment(p,p1,p3));
      d=min(d,sdSegment(p,p3,p0));
      return d;
    }

    float shapeDist(vec2 p){
      float ring=abs(length(p)-0.74);
      float star=starDist(p);
      return min(ring,star);
    }

    vec3 palette(float x){
      vec3 c0=vec3(0.08,0.0,0.0);
      vec3 c1=vec3(0.95,0.05,0.0);
      vec3 c2=vec3(1.0,0.34,0.0);
      vec3 c3=vec3(1.0,0.86,0.28);
      vec3 c4=vec3(1.0,0.98,0.78);
      if(x<.28)return mix(c0,c1,x/.28);
      if(x<.55)return mix(c1,c2,(x-.28)/.27);
      if(x<.80)return mix(c2,c3,(x-.55)/.25);
      return mix(c3,c4,(x-.80)/.20);
    }

    void main(){
      vec2 uv=gl_FragCoord.xy/u_resolution.xy;
      vec2 p=uv*2.0-1.0;
      p.x*=u_resolution.x/u_resolution.y;
      p.y=-p.y;

      float e=clamp(u_energy,0.0,1.0);
      float t=u_time*(0.75+e*1.25);

      float baseD=shapeDist(p);
      float core=1.0-smoothstep(0.015,0.050,baseD);

      float flame=0.0;
      for(int i=0;i<9;i++){
        float fi=float(i)/8.0;
        float rise=fi*(0.06+0.27*e);
        float sway=(fbm(vec2(p.y*3.2+t*0.42,fi*7.0+t*.17))-.5)*(0.025+0.10*e)*(0.3+fi);
        vec2 q=p-vec2(sway,rise);
        q.x+=(fbm(vec2(q.y*4.0-t*.33,q.x*2.0+t*.28))-.5)*(0.018+0.055*e);
        float d=shapeDist(q);
        float band=exp(-d*(34.0-10.0*e));
        float lick=pow(max(0.0,1.0-fi),0.7);
        float n=fbm(q*vec2(4.2,6.8)+vec2(t*.75,-t*1.55)+fi*11.7);
        flame+=band*lick*smoothstep(.22,.82,n+.18*e);
      }
      flame/=4.1;
      flame*=smoothstep(.02,.10,e);

      float tongues=fbm(vec2(p.x*3.6,p.y*5.4-t*1.85));
      flame*=0.68+0.72*tongues;

      float hot=clamp(core*(.22+.90*e)+flame*1.35,0.0,1.0);
      float alpha=clamp(core*(.12+.88*e)+flame*1.18,0.0,1.0);

      vec3 col=palette(hot);
      col+=vec3(1.0,.18,.02)*pow(flame,1.7)*.48;
      col*=.55+1.35*e;

      float sparkNoise=hash(floor((p+vec2(0.0,t*.34))*vec2(75.0,95.0)));
      float sparks=step(.992-.006*e,sparkNoise);
      float sparkMask=smoothstep(.10,.85,e)*smoothstep(-.85,.15,p.y);
      col+=vec3(1.0,.55,.12)*sparks*sparkMask*1.8;
      alpha=max(alpha,sparks*sparkMask*.65);

      gl_FragColor=vec4(col,alpha);
    }
  `;

  function shader(type,src){
    const s=gl.createShader(type);
    gl.shaderSource(s,src);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);

  const pos=gl.getAttribLocation(program,'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);

  const uRes=gl.getUniformLocation(program,'u_resolution');
  const uTime=gl.getUniformLocation(program,'u_time');
  const uEnergy=gl.getUniformLocation(program,'u_energy');

  function resizeGL(){
    const r=canvas.getBoundingClientRect();
    const d=Math.min(devicePixelRatio||1,2);
    const w=Math.max(1,Math.round(r.width*d));
    const h=Math.max(1,Math.round(r.height*d));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    gl.viewport(0,0,w,h);
  }

  let start=performance.now();
  function render(now){
    resizeGL();
    gl.useProgram(program);
    gl.uniform2f(uRes,canvas.width,canvas.height);
    gl.uniform1f(uTime,(now-start)/1000);
    gl.uniform1f(uEnergy,energy);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,6);
    requestAnimationFrame(render);
  }

  addEventListener('resize',resizeGL,{passive:true});
  requestAnimationFrame(render);
})();