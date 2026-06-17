function checkReveal(){
  document.querySelectorAll('.reveal').forEach(function(el){
    if(el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('in');
  });
}
window.addEventListener('scroll',checkReveal);
window.addEventListener('load',checkReveal);
setTimeout(checkReveal,200);
