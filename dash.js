(function sincronizarHora(){
  var n=new Date();
  var p='ano='+n.getFullYear()
       +'&mes='+(n.getMonth()+1)
       +'&dia='+n.getDate()
       +'&hora='+n.getHours()
       +'&min='+n.getMinutes()
       +'&seg='+n.getSeconds();
  fetch('/set_hora?'+p).catch(function(){});
})();

setInterval(function(){
  document.getElementById('clock').innerText=new Date().toLocaleTimeString();
},1000);

function desenharGauge(v){
  var c=document.getElementById('umidade-canvas');if(!c)return;
  var x=c.getContext('2d'),w=c.width,h=c.height;
  x.clearRect(0,0,w,h);
  var cx=w/2,cy=h-8,r=w/2-12;
  x.beginPath();x.arc(cx,cy,r,Math.PI,2*Math.PI);
  x.lineWidth=13;x.lineCap='round';x.strokeStyle='#d9eec5';x.stroke();
  var pct=Math.max(0,Math.min(100,v));
  var cor=pct<30?'#e67e22':pct<60?'#6db33f':'#2196f3';
  x.beginPath();x.arc(cx,cy,r,Math.PI,Math.PI+(pct/100)*Math.PI);
  x.lineWidth=13;x.lineCap='round';x.strokeStyle=cor;x.stroke();
  x.fillStyle='#2e5a17';x.font='bold 18px monospace';
  x.textAlign='center';x.textBaseline='bottom';x.fillText(pct+'%',cx,cy-4);
}

function uvCat(i){
  if(i<=2) return{t:'Baixo',b:'#e8f5e9',c:'#2e7d32'};
  if(i<=5) return{t:'Moderado',b:'#fffde7',c:'#f57f17'};
  if(i<=7) return{t:'Alto',b:'#fff3e0',c:'#e65100'};
  if(i<=10)return{t:'Muito Alto',b:'#fce4ec',c:'#c62828'};
  return{t:'Extremo',b:'#f3e8fd',c:'#6a1b9a'};
}

async function atualizar(){
  try{
    var r=await fetch('/dados');
    var d=await r.json();

    var u=parseInt(d.umidade)||0;
    desenharGauge(u);
    document.getElementById('umidade-status').innerText=
      u<30?'Solo seco — irrigar':u<60?'Umidade adequada':'Solo encharcado';

    var ch=d.chuva==='Sim';
    var cc=document.getElementById('chuva-circle');
    cc.className='chuva-circle '+(ch?'sim':'nao');
    cc.innerHTML=ch?'<i class="fa-solid fa-cloud-rain"></i>':'<i class="fa-solid fa-sun"></i>';
    document.getElementById('chuva-val').innerText=ch?'Chovendo':'Sem chuva';
    document.getElementById('chuva-sub').innerText=ch?'Precipitação detectada':'Tempo seco';

    var uv=parseFloat(d.uv);
    if(!isNaN(uv)){
      uv=Math.max(0,Math.min(11,uv));
      document.getElementById('uv-val').innerText=uv.toFixed(1);
      document.getElementById('uv-pointer').style.left=((uv/11)*100).toFixed(1)+'%';
      var cat=uvCat(uv);
      var ce=document.getElementById('uv-cat');
      ce.innerText=cat.t;ce.style.background=cat.b;ce.style.color=cat.c;
    }

    var ag=parseFloat(d.agua);
    if(!isNaN(ag)&&ag>=0&&ag<=100){
      document.getElementById('agua-fill').style.height=ag.toFixed(1)+'%';
      document.getElementById('agua-pct').innerText=Math.round(ag)+'%';
      document.getElementById('agua-sub').innerHTML=
        ag<20?'<i class="fa-solid fa-triangle-exclamation"></i> Crítico!'
        :ag<50?'<i class="fa-solid fa-droplet"></i> Nível baixo'
        :'<i class="fa-solid fa-circle-check"></i> Nível normal';
    }

    var lig=String(d.bomba).toLowerCase()==='ligada';
    var b=document.getElementById('bomba-badge');
    b.className='bomba-status '+(lig?'ligada':'desligada');
    document.getElementById('bomba-txt').innerText=lig?'Ligada':'Desligada';

    document.getElementById('regas-val').innerText=d.regas;

  }catch(e){console.log(e);}
}

desenharGauge(0);
atualizar();
setInterval(atualizar,3000);
