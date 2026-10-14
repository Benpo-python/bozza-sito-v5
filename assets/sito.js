/* La bottega del web, v5: progresso, barra, titolo parola per parola, giostra 3D, pulsanti magnetici, parole che si accendono. Nessuna dipendenza. */
(function(){
  var doc=document.documentElement,ridotto=matchMedia("(prefers-reduced-motion:reduce)").matches,fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
  doc.classList.add("js");
  /* barra e barra di progresso */
  var b=document.querySelector(".barra"),pr=document.querySelector(".progresso");
  function s(){if(b)b.classList.toggle("giu",scrollY>24);if(pr){var h=doc.scrollHeight-innerHeight;pr.style.setProperty("--p",h>0?Math.min(1,scrollY/h):0)}}
  s();addEventListener("scroll",s,{passive:true});
  /* titolo: ogni parola entra dal basso */
  function spezza(el,cls,conta){var i=0;function giro(n){Array.prototype.slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment(),p=c.nodeValue.split(/(\s+)/);p.forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return}var w=document.createElement("span");w.className=cls;if(conta)w.style.setProperty("--i",i++);var k=document.createElement("span");k.textContent=t;w.appendChild(k);f.appendChild(w)});n.replaceChild(f,c)}else if(c.nodeType===1&&c.tagName!=="SVG"&&!c.classList.contains(cls))giro(c)})}giro(el);return i}
  var h1=document.querySelector(".hero .h1");
  if(h1&&!ridotto){spezza(h1,"parola",true);var pr_=function(){doc.classList.add("pronto")};requestAnimationFrame(function(){requestAnimationFrame(pr_)});setTimeout(pr_,120)}else doc.classList.add("pronto");
  /* chi c'è dietro: parole che si accendono allo scorrimento */
  document.querySelectorAll(".accendi").forEach(function(p){Array.prototype.slice.call(p.childNodes).forEach(function(c){if(c.nodeType!==3)return;var f=document.createDocumentFragment();c.nodeValue.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return}var w=document.createElement("span");w.className="evid";w.textContent=t;f.appendChild(w)});p.replaceChild(f,c)})});
  /* giostra 3D: gira da sola, si trascina con mouse o dito, con inerzia al rilascio */
  var an=document.querySelector(".giostra-anello");
  if(an&&!ridotto){var g=0,vel=0,x0=null,xp=0,tp=0,mosso=false,tr=false,t_=null;
    function passo(t){if(t_===null)t_=t;var dt=Math.min(.05,(t-t_)/1000);t_=t;
      if(!tr){g+=8.2*dt+vel*dt;vel*=Math.pow(.02,dt)}
      an.style.setProperty("--g",g.toFixed(2)+"deg");requestAnimationFrame(passo)}
    requestAnimationFrame(passo);
    an.addEventListener("pointerdown",function(e){if(e.button)return;x0=xp=e.clientX;tp=e.timeStamp;mosso=false;tr=true;vel=0;an.classList.add("trascino");an.setPointerCapture(e.pointerId)});
    an.addEventListener("pointermove",function(e){if(x0===null)return;var d=e.clientX-xp,dt=(e.timeStamp-tp)/1000;if(Math.abs(e.clientX-x0)>4)mosso=true;g+=d*.35;if(dt>0)vel=(d*.35)/dt;xp=e.clientX;tp=e.timeStamp;an.style.setProperty("--g",g.toFixed(2)+"deg")});
    function fine_(){if(x0===null)return;x0=null;tr=false;vel=Math.max(-400,Math.min(400,vel));an.classList.remove("trascino")}
    an.addEventListener("pointerup",fine_);an.addEventListener("pointercancel",fine_);an.addEventListener("lostpointercapture",fine_);
    an.addEventListener("click",function(e){if(mosso){e.preventDefault();e.stopPropagation()}},true);
    an.addEventListener("dragstart",function(e){e.preventDefault()})}
  /* come funziona: le carte scorrono in orizzontale mentre la pagina scorre (da 1024 px); si possono anche trascinare */
  var oz=document.querySelector(".orizz"),pa=oz&&oz.querySelector(".passi"),fermo=oz&&oz.querySelector(".orizz-fermo"),prog=oz&&oz.querySelector(".orizz-prog");
  if(oz&&pa&&!ridotto){var mq=matchMedia("(min-width:1024px)"),maxO=0,corsa=1;
    function orizz(){if(!mq.matches){pa.style.setProperty("--tx","0px");return}var w=pa.parentElement,cs=getComputedStyle(w),vis=w.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);maxO=Math.max(0,pa.scrollWidth-vis);corsa=Math.max(1,oz.offsetHeight-innerHeight);var p=Math.min(1,Math.max(0,(scrollY-oz.offsetTop)/corsa));pa.style.setProperty("--tx",(-maxO*p).toFixed(1)+"px");if(prog)prog.style.setProperty("--p",p.toFixed(3))}
    orizz();addEventListener("scroll",orizz,{passive:true});addEventListener("resize",orizz);addEventListener("load",orizz);
    if(fermo){var ox=null,oy=0,om=false;
      fermo.addEventListener("pointerdown",function(e){if(e.button||!mq.matches||e.target.closest("a,button"))return;ox=e.clientX;oy=scrollY;om=false;fermo.classList.add("trascino");fermo.setPointerCapture(e.pointerId)});
      fermo.addEventListener("pointermove",function(e){if(ox===null)return;var d=e.clientX-ox;if(Math.abs(d)>3)om=true;if(maxO>0){document.documentElement.style.scrollBehavior="auto";scrollTo(0,oy-d*(corsa/maxO))}});
      function fineO(){if(ox===null)return;ox=null;fermo.classList.remove("trascino");document.documentElement.style.scrollBehavior=""}
      fermo.addEventListener("pointerup",fineO);fermo.addEventListener("pointercancel",fineO);fermo.addEventListener("lostpointercapture",fineO);
      fermo.addEventListener("click",function(e){if(om){e.preventDefault();e.stopPropagation()}},true)}}
  /* pulsanti magnetici */
  if(fine&&!ridotto){document.querySelectorAll(".btn").forEach(function(el){el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;el.style.translate=(x*10)+"px "+(y*8)+"px"});el.addEventListener("pointerleave",function(){el.style.translate=""})})}
})();
