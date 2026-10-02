/* ==========================================================
   Réglages du site Drive Cool — le seul fichier à modifier.
   ========================================================== */
window.DRIVECOOL_CONFIG = {
  /* Dates des sessions (théorie et perception des risques).
     - Laisser vide : le site lit le fichier data/sessions.csv.
     - Ou coller ici le lien CSV d'une Google Sheet publiée sur le web
       (voir GERER-LES-SESSIONS.md). Le site se met alors à jour dès
       que la feuille est modifiée. */
  sessionsCsvUrl: "",

  /* Liens des Google Forms d'inscription (lien « Envoyer » > icône <>,
     ou simplement le lien du formulaire). Laisser vide pour afficher
     à la place une inscription par téléphone / e-mail. */
  forms: {
    theorie: "",
    perception: "",
    pratique: "",
    examenLibre: "",
    examenAutoEcole: ""
  }
};
