function applyLangToLinks(lang){
  document.querySelectorAll('a[data-page]').forEach(function(a){
    var base = a.getAttribute('data-page');
    a.setAttribute('href', lang === 'en' ? (base + '?lang=en') : base);
  });
}

function updateNewsletterRequired(lang){
  document.querySelectorAll('.newsletter-form input[type="email"], .waitlist-form input[type="email"]').forEach(function(input){
    var isActive = input.classList.contains('lang-' + lang);
    if(isActive){ input.setAttribute('required', ''); }
    else{ input.removeAttribute('required'); }
  });
}

function setLang(lang, updateUrl){
  document.body.classList.remove('lang-it','lang-en');
  document.body.classList.add('lang-' + lang);
  document.documentElement.setAttribute('lang', lang);
  var btnIt = document.getElementById('btnIt');
  var btnEn = document.getElementById('btnEn');
  if(btnIt) btnIt.classList.toggle('active', lang === 'it');
  if(btnEn) btnEn.classList.toggle('active', lang === 'en');
  applyLangToLinks(lang);
  updateNewsletterRequired(lang);
  if(updateUrl !== false){
    var url = new URL(window.location.href);
    if(lang === 'en'){ url.searchParams.set('lang','en'); } else { url.searchParams.delete('lang'); }
    history.replaceState(null, '', url.toString());
  }
}

function handleNewsletter(e){
  e.preventDefault();
  var isEn = document.body.classList.contains('lang-en');
  var form = e.target;
  var emailInput = form.querySelector('input[type="email"].lang-' + (isEn ? 'en' : 'it')) || form.querySelector('input[type="email"]');
  var email = emailInput ? emailInput.value : '';

  var subject = encodeURIComponent('Iscrizione newsletter Pilar');
  var body = encodeURIComponent(
    (isEn ? 'New newsletter signup from the Pilar website.\n\nEmail: ' : 'Nuova iscrizione alla newsletter dal sito Pilar.\n\nEmail: ') + email
  );
  window.location.href = 'mailto:giorgia.ficoroni@icloud.com?subject=' + subject + '&body=' + body;

  alert(isEn
    ? "Thank you! We're opening your email app so you can confirm your subscription."
    : "Grazie! Si aprirà la tua app email per completare l'iscrizione.");
  form.reset();
  return false;
}

function handleWaitlist(e){
  e.preventDefault();
  var isEn = document.body.classList.contains('lang-en');
  var form = e.target;
  var emailInput = form.querySelector('input[type="email"].lang-' + (isEn ? 'en' : 'it')) || form.querySelector('input[type="email"]');
  var email = emailInput ? emailInput.value : '';
  var messageInput = form.querySelector('textarea.lang-' + (isEn ? 'en' : 'it')) || form.querySelector('textarea');
  var message = messageInput ? messageInput.value.trim() : '';

  var subject = encodeURIComponent(isEn ? 'Pilar waitlist' : "Lista d'attesa Pilar");
  var lines = [
    isEn ? 'New waitlist signup from the Pilar website.' : "Nuova iscrizione alla lista d'attesa dal sito Pilar.",
    '',
    'Email: ' + email
  ];
  if(message){
    lines.push('');
    lines.push(isEn ? 'Message:' : 'Messaggio:');
    lines.push(message);
  }
  var body = encodeURIComponent(lines.join('\n'));
  window.location.href = 'mailto:giorgia.ficoroni@icloud.com?subject=' + subject + '&body=' + body;

  alert(isEn
    ? "Thank you! We're opening your email app so you can confirm your request."
    : "Grazie! Si aprirà la tua app email per completare la richiesta.");
  form.reset();
  return false;
}

function handleContactForm(e){
  e.preventDefault();
  var isEn = document.body.classList.contains('lang-en');
  var form = e.target;
  var name = form.querySelector('input[name="name"]').value;
  var email = form.querySelector('input[name="email"]').value;
  var message = form.querySelector('textarea[name="message"]').value;

  var subject = encodeURIComponent(isEn ? 'New message from the Pilar website' : 'Nuovo messaggio dal sito Pilar');
  var body = encodeURIComponent(
    (isEn ? 'Name: ' : 'Nome: ') + name + '\n' +
    'Email: ' + email + '\n\n' +
    (isEn ? 'Message:\n' : 'Messaggio:\n') + message
  );
  window.location.href = 'mailto:giorgia.ficoroni@icloud.com?subject=' + subject + '&body=' + body;

  alert(isEn
    ? "Thank you! We're opening your email app so you can send your message."
    : "Grazie! Si aprirà la tua app email per inviare il messaggio.");
  form.reset();
  return false;
}

function initScrollReveal(){
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  items.forEach(function(el){ observer.observe(el); });
}

function initCookieBanner(){
  var banner = document.getElementById('cookieBanner');
  if(!banner) return;
  var accepted = false;
  try{ accepted = localStorage.getItem('pilarCookieConsent') === '1'; }catch(err){}
  if(!accepted){ banner.classList.add('visible'); }
  banner.querySelectorAll('.cookie-accept-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      try{ localStorage.setItem('pilarCookieConsent','1'); }catch(err){}
      banner.classList.remove('visible');
    });
  });
}

document.addEventListener('DOMContentLoaded', function(){
  var params = new URLSearchParams(window.location.search);
  var initialLang = params.get('lang') === 'en' ? 'en' : 'it';
  setLang(initialLang, false);

  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  if(menuToggle && navLinks){
    menuToggle.addEventListener('click', function(){
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
    });
  }

  initCookieBanner();
  initScrollReveal();
});
