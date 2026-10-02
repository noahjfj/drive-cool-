# Drive Cool – site de l'auto-école

Site statique (HTML/CSS/JS, sans dépendance).

| Page | Fichier |
|---|---|
| Accueil (qui sommes-nous, parcours, bureaux, horaires, FAQ, contact) | `index.html` |
| Cours théoriques | `cours-theoriques.html` |
| Perception des risques | `perception-des-risques.html` |
| Cours pratiques | `cours-pratiques.html` |
| Examen pratique | `examen-pratique.html` |

- Réglages (liens des Google Forms, Google Sheet des sessions) : `js/config.js`
- Dates des sessions : `data/sessions.csv` ou une Google Sheet — voir [GERER-LES-SESSIONS.md](GERER-LES-SESSIONS.md)

Pour le voir en local : `python3 -m http.server` dans ce dossier, puis
http://localhost:8000 (ouvrir `index.html` directement ne charge pas les sessions).

Direction artistique reprise du logo : asphalte noir, marquage blanc pointillé,
vert `#74b525` et panneau losange de route prioritaire.
