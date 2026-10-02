# Mettre à jour les dates de sessions

Les dates des **cours théoriques** et de la **perception des risques** ne sont pas
écrites dans les pages : le site les lit dans un tableau. Les sessions passées
disparaissent toutes seules.

## Le tableau

| type       | bureau  | debut      | fin        | horaire     | statut   | remarque         |
|------------|---------|------------|------------|-------------|----------|------------------|
| theorie    | Andenne | 12/10/2026 | 15/10/2026 | 17h à 20h   |          |                  |
| theorie    | Wanze   | 20/10/2026 | 23/10/2026 | 17h à 20h   | complet  | Congés scolaires |
| perception | Wanze   | 04/10/2026 |            | 10h à 13h   |          |                  |

- **type** : `theorie` ou `perception`
- **bureau** : `Andenne` ou `Wanze`
- **debut / fin** : au format `JJ/MM/AAAA` (laisser `fin` vide pour une seule journée)
- **statut** : vide = « Places libres », `complet`, ou `dernieres places`
- **remarque** : texte libre affiché à côté (facultatif)

## Option 1 (recommandée) : une Google Sheet

Vous modifiez la feuille depuis votre téléphone ou votre ordinateur, et le site
se met à jour tout seul.

1. Créez une Google Sheet et collez-y le contenu de `data/sessions.csv`
   (Fichier > Importer > Importer > choisir le fichier).
2. Fichier > Partager > **Publier sur le web** > choisissez la feuille,
   format **Valeurs séparées par des virgules (.csv)** > Publier.
3. Copiez le lien obtenu et collez-le dans `js/config.js`, entre les guillemets de
   `sessionsCsvUrl`.

C'est fait une fois pour toutes : ensuite, il suffit de modifier la feuille
(ajouter une ligne, écrire `complet`…). Comptez quelques minutes pour que Google
mette à jour la version publiée.

## Option 2 : le fichier `data/sessions.csv`

Modifiez directement le fichier `data/sessions.csv` (sur GitHub : ouvrir le fichier,
icône crayon, puis « Commit changes »).

# Formulaires d'inscription

Les pages affichent vos Google Forms si leurs liens sont renseignés dans
`js/config.js` (`theorie`, `perception`, `pratique`, `examenLibre`,
`examenAutoEcole`). Tant qu'un lien est vide, la page affiche à la place une
inscription par téléphone / e-mail avec la liste des informations à fournir.
