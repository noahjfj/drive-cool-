// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});

nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Formulaire de contact : ouvre la messagerie de l'utilisateur
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = `Demande d'information – bureau de ${data.get('office')}`;
  const body =
    `${data.get('message')}\n\n` +
    `Nom : ${data.get('name')}\n` +
    `Téléphone : ${data.get('phone') || '-'}`;
  window.location.href =
    `mailto:info@drivecool.be?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.getElementById('year').textContent = new Date().getFullYear();
