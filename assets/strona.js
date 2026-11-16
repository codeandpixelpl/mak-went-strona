/* Mak-Went · zachowanie komponentów. Każdy blok startuje tylko, gdy komponent jest na stronie. */
(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var dotyk=function(){return matchMedia('(max-width:1000px)').matches};

  // naglowek: zwija się po przewinięciu
  var naw=$('#naw');
  function przewin(){naw.classList.toggle('zwin',scrollY>40)}
  addEventListener('scroll',przewin,{passive:true});przewin();

  // naglowek: menu mobilne
  var menu=$('#menu'),mp=$('.menu-p');
  function menuUstaw(o){menu.hidden=!o;mp.setAttribute('aria-expanded',o);document.body.classList.toggle('menu-otw',o);
    $('use',mp).setAttribute('href',o?'#i-x':'#i-menu');mp.setAttribute('aria-label',o?'Zamknij menu':'Menu');if(o)$('a',menu).focus()}
  mp.addEventListener('click',function(){menuUstaw(menu.hidden)});
  menu.addEventListener('click',function(e){if(e.target.closest('a'))menuUstaw(false)});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){menuUstaw(false);mp.focus()}});

  // oferta: zakładki (desktop) i akordeon (dotyk) na jednym kodzie
  var usl=$$('.usl');
  function otworz(i,przelacz){usl.forEach(function(u,j){var on=j===i?(przelacz&&dotyk()?!u.classList.contains('akt'):true):false;
    u.classList.toggle('akt',on);$('.usl-n',u).setAttribute('aria-expanded',on)})}
  usl.forEach(function(u,i){var b=$('.usl-n',u);
    b.addEventListener('click',function(){otworz(i,true);if(dotyk()&&u.classList.contains('akt'))setTimeout(function(){b.scrollIntoView({block:'start',behavior:'smooth'})},60)});
    b.addEventListener('keydown',function(e){if(dotyk())return;var k={ArrowDown:1,ArrowUp:-1}[e.key];if(!k)return;e.preventDefault();
      var n=(i+k+usl.length)%usl.length;otworz(n);$('.usl-n',usl[n]).focus()})});

  // wycena: zaznaczenie usługi lub obiektu z przycisków, z adresu (?usluga=) i ze strony usługi
  var form=$('#formularz'),sz=$('#szybka');
  function zaznacz(usluga,obiekt){
    if(usluga&&form){var c=$('input[name=usluga][value="'+usluga+'"]',form);if(c){c.checked=true;var k=$('.krok[data-wym]',form);k.classList.remove('zle');$('.blad',k).hidden=true}}
    if(usluga&&sz){var o=$('select[name=usluga] option[value="'+usluga+'"]',sz);if(o)o.selected=true}
    if(obiekt&&form){var r=$('input[name=obiekt][value="'+obiekt+'"]',form);if(r)r.checked=true}
  }
  $$('[data-usluga],[data-obiekt]').forEach(function(a){if(a.tagName==='BODY')return;a.addEventListener('click',function(){
    zaznacz(a.dataset.usluga,a.dataset.obiekt);
    if(form&&a.getAttribute('href')==='#wycena')setTimeout(function(){var p=$('input[name=imie]',form);if(p&&!p.value)p.focus({preventScroll:true})},700);
  })});
  zaznacz(document.body.dataset.usluga||new URLSearchParams(location.search).get('usluga'));

  // wycena: walidacja
  function pokaz(pole,zle){var l=pole.closest('label');pole.setAttribute('aria-invalid',zle);var b=l&&$('.blad',l);if(b)b.hidden=!zle;return !zle}
  function zlePole(p){var w=p.value.trim();return p.type==='tel'?w.replace(/\D/g,'').length<9:!w}
  function sprawdzPola(f){var ok=true,pierwszy=null;
    $$('input[required]:not([type=checkbox])',f).forEach(function(p){if(!pokaz(p,zlePole(p))){ok=false;pierwszy=pierwszy||p}});
    return {ok:ok,pierwszy:pierwszy}}
  $$('input[required]').forEach(function(p){p.addEventListener('input',function(){if(p.getAttribute('aria-invalid')==='true')pokaz(p,zlePole(p))})});

  if(sz)sz.addEventListener('submit',function(e){e.preventDefault();var w=sprawdzPola(sz);if(!w.ok){w.pierwszy.focus();return}
    sz.classList.add('wyslana');$('.sukces',sz).hidden=false});

  if(form){
    form.addEventListener('submit',function(e){e.preventDefault();
      var krok=$('.krok[data-wym]',form),wyb=$$('input[name=usluga]:checked',form).length>0;
      krok.classList.toggle('zle',!wyb);$('.blad',krok).hidden=wyb;
      var w=sprawdzPola(form),zg=$('input[name=zgoda]',form),zgOk=zg.checked;$('.blad-zgoda',form).hidden=zgOk;
      if(!wyb){$('input[name=usluga]',form).focus();return}
      if(!w.ok){w.pierwszy.focus();return}
      if(!zgOk){zg.focus();return}
      $('.wyslij',form).disabled=true;
      setTimeout(function(){form.classList.add('wyslana');var s=$('.sukces-duzy',form);s.hidden=false;s.focus()},500)});
    $$('input[name=usluga]',form).forEach(function(c){c.addEventListener('change',function(){if($$('input[name=usluga]:checked',form).length){$('.krok[data-wym]',form).classList.remove('zle');$('.krok[data-wym] .blad',form).hidden=true}})});
    $('input[name=zgoda]',form).addEventListener('change',function(e){if(e.target.checked)$('.blad-zgoda',form).hidden=true});
  }

  // galeria: filtr, „pokaż więcej”, powiększenie
  $$('[data-galeria]').forEach(function(g){
    var fig=$$('figure',g),limit=+g.dataset.limit||fig.length,krok=limit,filtr='*',sekcja=g.closest('section');
    var wiecej=$('[data-wiecej]',sekcja),licznik=$('[data-licznik]',sekcja);
    var mozaika=g.classList.contains('galeria--mozaika');
    function pasuje(f){return filtr==='*'||f.dataset.k===filtr}
    function odswiez(){var n=0,wszystkie=fig.filter(pasuje).length;
      fig.forEach(function(f){var on=pasuje(f)&&n<limit;if(pasuje(f))n++;f.hidden=!on});
      if(mozaika){var v=0;fig.forEach(function(f){if(f.hidden)return;f.classList.toggle('duza',v%5===0);f.classList.toggle('prawa',v%10===5);v++})}
      var widac=Math.min(limit,wszystkie);
      if(wiecej)wiecej.hidden=widac>=wszystkie;
      if(licznik)licznik.textContent=widac+' z '+wszystkie}
    $$('.filtry button',sekcja).forEach(function(b,_,all){b.addEventListener('click',function(){
      all.forEach(function(x){x.setAttribute('aria-pressed',x===b)});filtr=b.dataset.f;limit=krok;odswiez()})});
    if(wiecej)wiecej.addEventListener('click',function(){limit+=krok;odswiez()});
    var start=new URLSearchParams(location.search).get('filtr'),bs=start&&$('.filtry button[data-f="'+start+'"]',sekcja);
    if(bs)bs.click();else odswiez();
  });

  var lb=$('#lb');
  if(lb){
    var lbImg=$('img',lb),lbPod=$('figcaption',lb),biez=0,lista=[],zrodlo=null;
    function pokazZdj(i){biez=(i+lista.length)%lista.length;var f=lista[biez],im=$('img',f);
      lbImg.src=im.dataset.duze||im.src;lbImg.alt=im.alt;lbPod.textContent=$('figcaption',f).textContent+' · '+(biez+1)+' / '+lista.length}
    $$('[data-galeria] figure button').forEach(function(b){b.addEventListener('click',function(){
      var f=b.closest('figure');lista=$$('figure',f.parentNode).filter(function(x){return !x.hidden});zrodlo=b;pokazZdj(lista.indexOf(f));lb.showModal()})});
    $('.lb-x',lb).addEventListener('click',function(){lb.close()});
    $('.lb-p',lb).addEventListener('click',function(){pokazZdj(biez-1)});
    $('.lb-n',lb).addEventListener('click',function(){pokazZdj(biez+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
    lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')pokazZdj(biez-1);if(e.key==='ArrowRight')pokazZdj(biez+1)});
    lb.addEventListener('close',function(){if(zrodlo)zrodlo.focus()});
    var x0=null;lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)pokazZdj(biez+(d<0?1:-1));x0=null});
  }

  // podmenu: zaznacza sekcję, którą właśnie czytasz
  var pm=$$('.podmenu a');
  if(pm.length&&'IntersectionObserver' in window){
    var cele=pm.map(function(a){return $(a.getAttribute('href'))}).filter(Boolean);
    var io2=new IntersectionObserver(function(w){w.forEach(function(x){if(x.isIntersecting){pm.forEach(function(a){
      var on=a.getAttribute('href')==='#'+x.target.id;a.setAttribute('aria-current',on);
      if(on&&dotyk())a.parentNode.scrollTo({left:a.offsetLeft-16,behavior:'smooth'})})}})},{rootMargin:'-45% 0px -50% 0px'});
    cele.forEach(function(c){io2.observe(c)});
  }

  // akcje: pasek na telefonie po hero, chowa się przy formularzu
  var ak=$('#akcje'),hero=$('.hero'),wyc=$('#wycena'),poHero=false,wForm=false;
  function akcje(){var on=poHero&&!wForm;ak.classList.toggle('widoczny',on);ak.setAttribute('aria-hidden',!on);$$('a',ak).forEach(function(a){a.tabIndex=on?0:-1})}
  if('IntersectionObserver' in window){
    if(hero)new IntersectionObserver(function(w){poHero=!w[0].isIntersecting;akcje()}).observe(hero);
    if(wyc)new IntersectionObserver(function(w){wForm=w[0].isIntersecting;akcje()},{threshold:.15}).observe(wyc);
    var io=new IntersectionObserver(function(w){w.forEach(function(x){if(x.isIntersecting){x.target.classList.add('wid');io.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    $$('[data-pojaw]').forEach(function(el){io.observe(el)});
  }else{$$('[data-pojaw]').forEach(function(el){el.classList.add('wid')})}

  var wg=$('.wgore');if(wg)wg.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:'smooth'})});
})();
