const CONFIG = window.DRIVECOOL_CONFIG || { sessionsCsvUrl: '', forms: {} };
const PHONE = '0488 813 813';
const EMAIL = 'info@drivecool.be';

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

document.querySelectorAll('.js-year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Bouton « Copier » (numéro de compte)
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (target) window.getSelection().selectAllChildren(target);
      return;
    }
    const label = btn.textContent;
    btn.dataset.copied = 'true';
    btn.textContent = 'Copié';
    setTimeout(() => {
      btn.textContent = label;
      delete btn.dataset.copied;
    }, 2000);
  });
});

// Formulaire de contact (accueil) : ouvre la messagerie de l'utilisateur
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const subject = `Demande d'information – bureau de ${data.get('office')}`;
    const body =
      `${data.get('message')}\n\n` +
      `Nom : ${data.get('name')}\n` +
      `Téléphone : ${data.get('phone') || '-'}`;
    window.location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// ---------- Formulaires d'inscription (Google Forms) ----------
document.querySelectorAll('.form-embed').forEach((box) => {
  const url = (CONFIG.forms || {})[box.dataset.form];
  if (!url) return; // on garde le bloc « inscription par téléphone / e-mail »
  const src = url.includes('embedded=true')
    ? url
    : url + (url.includes('?') ? '&' : '?') + 'embedded=true';
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = box.dataset.title || "Formulaire d'inscription";
  iframe.loading = 'lazy';
  box.replaceChildren(iframe);
});

// ---------- Sessions (théorie / perception des risques) ----------
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',' || c === ';') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim()));
}

const normalize = (s) => s.trim().toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '_');

function parseDate(value) {
  const s = (value || '').trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], m[2] - 1, +m[3]);
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (m) return new Date(m[3].length === 2 ? 2000 + +m[3] : +m[3], m[2] - 1, +m[1]);
  return null;
}

function formatRange(start, end) {
  const day = (d) => `${DAYS[d.getDay()]} ${d.getDate()}`;
  if (!end || end.getTime() === start.getTime()) {
    return `${day(start)} ${MONTHS[start.getMonth()]}`;
  }
  if (start.getMonth() === end.getMonth()) {
    return `Du ${day(start)} au ${day(end)} ${MONTHS[end.getMonth()]}`;
  }
  return `Du ${day(start)} ${MONTHS[start.getMonth()]} au ${day(end)} ${MONTHS[end.getMonth()]}`;
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

async function loadSessions() {
  const url = CONFIG.sessionsCsvUrl || 'data/sessions.csv';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(res.status);
  const [header, ...rows] = parseCSV(await res.text());
  const keys = header.map(normalize);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return rows
    .map((cells) => Object.fromEntries(keys.map((k, i) => [k, (cells[i] || '').trim()])))
    .map((r) => {
      const start = parseDate(r.debut);
      const end = parseDate(r.fin) || start;
      const statut = normalize(r.statut || '');
      return {
        type: normalize(r.type || ''),
        office: r.bureau,
        start, end,
        hours: r.horaire,
        note: r.remarque,
        full: statut.includes('complet'),
        few: statut.includes('derniere'),
      };
    })
    .filter((s) => s.start && s.end >= today)
    .sort((a, b) => a.start - b.start);
}

function sessionItem(s, showOffice) {
  const li = document.createElement('li');
  li.className = 'session' + (s.full ? ' session--full' : s.few ? ' session--few' : '');

  const date = document.createElement('span');
  date.className = 'session__date';
  date.textContent = capitalize(formatRange(s.start, s.end));

  const meta = document.createElement('span');
  meta.className = 'session__meta';
  meta.textContent = [s.hours && `de ${s.hours}`, s.note].filter(Boolean).join(' · ');
  if (showOffice && s.office) {
    const tag = document.createElement('span');
    tag.className = 'session__office-tag';
    tag.textContent = s.office + (meta.textContent ? ' · ' : '');
    meta.prepend(tag);
  }

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = s.full ? 'Complet' : s.few ? 'Dernières places' : 'Places libres';

  li.append(date, badge, meta);
  return li;
}

function emptyMessage(text) {
  const p = document.createElement('p');
  p.className = 'sessions__empty';
  p.textContent = text;
  return p;
}

function renderSessions(box, sessions) {
  const type = box.dataset.sessions;
  const limit = +box.dataset.limit || Infinity;
  const list = sessions.filter((s) => s.type === type);
  box.replaceChildren();

  if (!list.length) {
    box.append(emptyMessage(`Aucune date n'est programmée pour le moment. Appelez-nous au ${PHONE} pour connaître les prochaines sessions.`));
    return;
  }

  // Vue compacte : une seule liste, toutes implantations confondues
  if (box.dataset.layout === 'compact') {
    const ul = document.createElement('ul');
    ul.className = 'session-list';
    list.filter((s) => !s.full).slice(0, limit).forEach((s) => ul.append(sessionItem(s, true)));
    box.append(ul.children.length ? ul : emptyMessage(`Toutes les sessions sont complètes. Appelez-nous au ${PHONE}.`));
    return;
  }

  // Vue par bureau : une colonne par implantation
  const offices = [...new Set(['Andenne', 'Wanze', ...list.map((s) => s.office)])];
  offices.forEach((office) => {
    const items = list.filter((s) => s.office === office).slice(0, limit);
    if (!items.length && !['Andenne', 'Wanze'].includes(office)) return;
    const col = document.createElement('div');
    col.className = 'sessions__col';
    const h = document.createElement('h3');
    h.className = 'sessions__office';
    h.innerHTML = '<span class="diamond" aria-hidden="true"></span>';
    h.append(office);
    col.append(h);
    if (items.length) {
      const ul = document.createElement('ul');
      ul.className = 'session-list';
      items.forEach((s) => ul.append(sessionItem(s, false)));
      col.append(ul);
    } else {
      col.append(emptyMessage('Pas de date programmée pour le moment.'));
    }
    box.append(col);
  });
}

const sessionBoxes = document.querySelectorAll('[data-sessions]');
if (sessionBoxes.length) {
  loadSessions()
    .then((sessions) => sessionBoxes.forEach((box) => renderSessions(box, sessions)))
    .catch(() => sessionBoxes.forEach((box) => box.replaceChildren(
      emptyMessage(`Les dates n'ont pas pu être chargées. Appelez-nous au ${PHONE} pour connaître les prochaines sessions.`)
    )));
}
