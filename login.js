(function(){
  var n=new Date();
  var p='ano='+n.getFullYear()+'&mes='+(n.getMonth()+1)+'&dia='+n.getDate()
       +'&hora='+n.getHours()+'&min='+n.getMinutes()+'&seg='+n.getSeconds();
  fetch('/set_hora?'+p).catch(function(){});
})();
function login(){
  var n=document.getElementById('nome').value.toLowerCase();
  var s=document.getElementById('senha').value;
  if((n==='pedro'&&s==='130724')||(n==='vinicius'&&s==='vnz00')){
    window.location.href='/dashboard';
  }else{
    document.getElementById('erro').innerText='Nome ou senha incorretos!';
  }
}
document.addEventListener('keydown',function(e){if(e.key==='Enter')login();});
