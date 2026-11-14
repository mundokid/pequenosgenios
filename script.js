/* Eventos de intenção na landing page. Compras reais devem vir da Kiwify. */
const cfg = {
  pixelId: '967550679424125',
  productId: 'pequenos_genios_200',
  productName: 'Pequenos Gênios — 200 Atividades',
  currency: 'BRL',
  price: 19.90,
  checkoutUrl: 'https://pay.kiwify.com.br/qGfiEhh',
  appendUtmToCheckout: true,
  ...(window.PG_TRACKING_CONFIG || {})
};
const TRACK_KEY = 'pg_track_session';
const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const params = new URLSearchParams(location.search);
const tracking = {};
for (const key of utmKeys) if (params.get(key)) tracking[key] = params.get(key).slice(0,180);
// Persistência de atribuição na mesma aba (não armazena dados pessoais).
try { const previous = JSON.parse(sessionStorage.getItem(TRACK_KEY) || '{}'); Object.assign(tracking, {...previous,...tracking}); sessionStorage.setItem(TRACK_KEY, JSON.stringify(tracking)); } catch(e) {}
const base = {content_ids:[cfg.productId || 'pequenos_genios_200'],content_name:cfg.productName || 'Pequenos Gênios — 200 Atividades',content_type:'product',currency:'BRL',value:19.90};
function emit(name,data={},custom=false){
  if (typeof window.fbq === 'function') window.fbq(custom ? 'trackCustom':'track',name,{...data,...tracking});
  // dataLayer disponível para futuras integrações de analytics.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event:name,...data,...tracking});
}
function initPixel(){
  if (!/^\d{8,20}$/.test(String(cfg.pixelId || ''))) return;
  if(window.fbq) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',String(cfg.pixelId));fbq('track','PageView');fbq('track','ViewContent',base);
}
initPixel();
function checkoutLink(){
  if(!/^https:\/\/[^\s]+$/i.test(cfg.checkoutUrl || '')) return null;
  const url=new URL(cfg.checkoutUrl);
  if(cfg.appendUtmToCheckout) for(const [key,val] of Object.entries(tracking)) if(!url.searchParams.has(key)) url.searchParams.set(key,val);
  return url.toString();
}
const toast=document.getElementById('checkout-toast');
document.querySelectorAll('.buy-button').forEach((button)=>button.addEventListener('click',()=>{
  const url=checkoutLink();
  if(!url){toast.hidden=false;document.getElementById('close-toast').focus();return;}
  emit('InitiateCheckout',base);
  location.assign(url);
}));
document.getElementById('close-toast').addEventListener('click',()=>toast.hidden=true);
const modal=document.getElementById('preview-modal');
const modalImage=document.getElementById('modal-image');
const modalTitle=document.getElementById('modal-title');
document.querySelectorAll('.preview-open').forEach((button)=>button.addEventListener('click',()=>{
  modalImage.src=button.dataset.image;modalImage.alt='Atividade ampliada: '+button.dataset.title;modalTitle.textContent=button.dataset.title;
  emit('PreviewActivity',{activity_name:button.dataset.title},true);
  if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');
}));
document.getElementById('close-modal').addEventListener('click',()=>modal.close());
modal.addEventListener('click',(event)=>{if(event.target===modal)modal.close()});
document.querySelectorAll('a[href$="amostra-gratis-3-atividades.pdf"]').forEach(a=>a.addEventListener('click',()=>emit('ViewSample',{sample_count:3},true)));
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
 document.querySelectorAll('.topic-card,.age-card,.preview-card,.routine-card,.audience-card').forEach(e=>{e.classList.add('reveal');observer.observe(e)});
}

// Carrossel contínuo em loop, independente do tamanho da tela.
(function(){
 const viewport=document.querySelector('.voices-section .voice-carousel');
 const track=viewport?.querySelector('.voice-grid');
 if(!viewport||!track)return;
 const originals=Array.from(track.children);
 originals.forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute('aria-hidden','true');track.appendChild(clone)});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let offset=0,last=0,paused=false;
 function cycleWidth(){const first=originals[0],clone=track.children[originals.length];return clone.offsetLeft-first.offsetLeft}
 function draw(){const width=cycleWidth();if(width>0){offset=((offset%width)+width)%width;track.style.transform=`translate3d(${-offset}px,0,0)`}}
 function frame(now){if(last&&!paused&&!reduced.matches)offset+=Math.min(now-last,80)*0.032;last=now;draw();requestAnimationFrame(frame)}
 viewport.addEventListener('mouseenter',()=>paused=true);
 viewport.addEventListener('mouseleave',()=>paused=false);
 viewport.addEventListener('focusin',()=>paused=true);
 viewport.addEventListener('focusout',()=>paused=false);
 document.addEventListener('visibilitychange',()=>{last=0});
 const move=direction=>{const card=originals[0];offset+=direction*(card.getBoundingClientRect().width+15);draw()};
 document.querySelector('.voice-prev')?.addEventListener('click',()=>move(-1));
 document.querySelector('.voice-next')?.addEventListener('click',()=>move(1));
 requestAnimationFrame(frame);
})();
