# 膳 MealPlanner

MealPlanner est une application web que j'ai développée dans le cadre du module de Génie Logiciel en L3 Informatique. Elle permet de planifier ses repas pour la semaine, de gérer ses recettes et de générer automatiquement une liste de courses.

## A quoi sert cette application ?

L'idée est simple : on choisit ce qu'on veut manger pour chaque jour de la semaine (petit-déjeuner, déjeuner, dîner), et l'application nous génère la liste de courses avec tous les ingrédients nécessaires, en regroupant les doublons. Plus besoin de se demander quoi acheter au supermarché.

On peut aussi chercher des recettes en ligne grâce à l'API Spoonacular, ou créer les siennes manuellement avec les ingrédients, les instructions et les infos nutritionnelles.

## Comment lancer le projet

Il faut cloner le projet et lancer docker compose :

```bash
git clone https://github.com/YoussefGUE/meal-planner.git
cd meal-planner
docker compose up --build
```

Une fois que c'est lancé, ouvrir http://localhost:5173 dans le navigateur.

## Comment utiliser l'application

La première chose à faire c'est de créer un compte sur la page d'inscription. Un nom d'utilisateur, un email et un mot de passe suffisent.

Une fois connecté, on arrive sur l'onglet Recettes. On peut soit créer une recette manuellement en cliquant sur "+ Nouvelle recette" (il faut remplir le nom, les instructions, le temps de préparation, les ingrédients avec les quantités, et on peut ajouter des tags comme vegetarian ou gluten-free), soit aller dans l'onglet Explorer pour chercher des recettes sur internet. On tape par exemple "pasta" ou "chicken soup", les résultats s'affichent avec les images et les calories, et on clique sur Importer pour les ajouter à notre collection.

Dans la page Recettes on peut aussi filtrer par régime alimentaire : Végétarien, Sans gluten ou Low carb. On peut modifier ou supprimer n'importe quelle recette.

Ensuite on va dans le Planificateur. On clique sur "Créer le plan de cette semaine" et une grille apparaît avec les 7 jours et les 3 repas. On clique sur une case vide, on choisit une recette, et c'est planifié. On peut naviguer entre les semaines et retirer un repas avec le bouton rouge.

Enfin l'onglet Courses génère automatiquement la liste de courses à partir du plan de la semaine. Si deux recettes demandent des oeufs, les quantités sont additionnées. On peut cocher les articles au fur et à mesure des achats.

## Technologies

Le frontend est fait avec React et Vite. Le backend avec Node.js, Express et Sequelize pour la base de données SQLite. L'authentification utilise des tokens JWT. Les recettes en ligne viennent de l'API Spoonacular. Le tout est conteneurisé avec Docker.

## Auteur

Youssef GUEJDAD
