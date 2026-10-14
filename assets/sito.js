/* La bottega del web, v5: progresso, barra, cursore, titolo parola per parola, giostra 3D, pulsanti magnetici, parole che si accendono. Nessuna dipendenza. */
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
  /* giostra 3D: si trascina con il mouse o il dito */
  var an=document.querySelector(".giostra-anello");
  if(an){var g=0,x0=null,g0=0,mosso=false;
    an.addEventListener("pointerdown",function(e){x0=e.clientX;g0=g;mosso=false;an.classList.add("trascino");an.setPointerCapture(e.pointerId)});
    an.addEventListener("pointermove",function(e){if(x0===null)return;var d=e.clientX-x0;if(Math.abs(d)>4){mosso=true;an.classList.add("fermo")}g=g0+d*.35;an.style.setProperty("--g",g+"deg")});
    function fine_(e){if(x0===null)return;x0=null;an.classList.remove("trascino");if(mosso)setTimeout(function(){an.classList.remove("fermo")},1800)}
    an.addEventListener("pointerup",fine_);an.addEventListener("pointercancel",fine_);
    an.addEventListener("click",function(e){if(mosso){e.preventDefault();e.stopPropagation()}},true);
    an.addEventListener("dragstart",function(e){e.preventDefault()})}
  /* pulsanti magnetici */
  if(fine&&!ridotto){document.querySelectorAll(".btn").forEach(function(el){el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;el.style.translate=(x*10)+"px "+(y*8)+"px"});el.addEventListener("pointerleave",function(){el.style.translate=""})})}
  /* cursore ad anello */
  var cu=document.querySelector(".cursore");
  if(cu&&fine&&!ridotto){var cx=-100,cy=-100,tx=-100,ty=-100,vis=false;
    addEventListener("pointermove",function(e){tx=e.clientX;ty=e.clientY;if(!vis){vis=true;cu.style.setProperty("--o",1)}var t=e.target.closest&&e.target.closest("a,button,summary,.giostra-anello");cu.style.setProperty("--s",t?1.9:1)},{passive:true});
    document.addEventListener("mouseleave",function(){cu.style.setProperty("--o",0)});
    (function anima(){cx+=(tx-cx)*.22;cy+=(ty-cy)*.22;cu.style.setProperty("--x",cx+"px");cu.style.setProperty("--y",cy+"px");requestAnimationFrame(anima)})()}
})();
