# Documentation - Color Swatch Block

## 📋 Vue d'ensemble

Le bloc **Color Swatch** permet d'afficher des variantes de couleurs d'un produit sous forme de vignettes cliquables. Ce système fonctionne avec des produits différents (et non des variants du même produit), ce qui est idéal pour afficher des produits similaires avec des coloris différents.

---

## 🎯 Fonctionnalités

- Affichage du produit actuel en premier avec une bordure noire de 1px
- Affichage des produits liés via un metafield de type "product list"
- Utilisation intelligente des images :
  - Priorité aux images avec "miniature" dans l'attribut ALT
  - Fallback sur l'image principale du produit
- Label personnalisable
- Design responsive et cohérent avec le thème
- Effet hover élégant

---

## 🛠️ Installation & Configuration

### Étape 1 : Créer le metafield

1. Dans l'admin Shopify, allez dans **Settings** → **Custom Data** → **Products**
2. Cliquez sur **Add definition**
3. Configurez le metafield :
   - **Name** : `Related Color Products` (ou le nom de votre choix)
   - **Namespace and key** : Utilisez par exemple `custom.color_variants`
   - **Type** : Sélectionnez **Product** → **List of products**
   - **Description** : "Liste des produits avec des couleurs alternatives"
4. Cliquez sur **Save**

### Étape 2 : Remplir le metafield pour vos produits

1. Allez dans **Products** et sélectionnez un produit
2. Descendez jusqu'à la section **Metafields**
3. Trouvez le champ **Related Color Products** (ou le nom que vous avez choisi)
4. Ajoutez les produits liés en les recherchant
5. Sauvegardez le produit

**💡 Astuce** : Vous pouvez remplir ce metafield pour tous les produits d'une même "famille de couleurs" en ajoutant les autres produits dans chaque fiche.

### Étape 3 : Optimiser les images

Pour chaque produit, vous avez deux options :

#### Option A : Utiliser une image dédiée (recommandé)
1. Uploadez une petite image carrée du produit (idéalement 120x120px à 240x240px)
2. Dans le champ **ALT text** de l'image, ajoutez le mot **"miniature"**
3. Cette image sera utilisée en priorité pour le swatch

#### Option B : Utiliser l'image principale
Si aucune image avec "miniature" dans l'ALT n'est trouvée, le système utilisera automatiquement l'image principale du produit (featured image).

### Étape 4 : Ajouter le bloc dans le thème

1. Dans l'éditeur de thème, allez sur une page produit
2. Cliquez sur **Product information** dans la barre latérale
3. Cliquez sur **Add block**
4. Sélectionnez **Color swatch**
5. Configurez le bloc :
   - **Label** : Texte affiché au-dessus des swatches (ex: "Available colors", "Coloris disponibles", etc.)
   - **Metafield namespace** : Entrez `custom` (ou le namespace que vous avez utilisé lors de la création du metafield)
   - **Metafield key** : Entrez `color_variants` (ou la key que vous avez utilisée, par exemple si votre metafield est `custom.related_colors`, entrez `related_colors`)
6. Positionnez le bloc où vous le souhaitez (généralement après le titre ou avant les variants)
7. Sauvegardez

**💡 Important** : Le namespace et la key correspondent à ce que vous voyez dans la définition du metafield :
- Si votre metafield est `custom.color_variants`, alors namespace = `custom` et key = `color_variants`
- Si votre metafield est `custom.related_colors`, alors namespace = `custom` et key = `related_colors`

---

## 🎨 Personnalisation du style

Le style du bloc Color Swatch est défini dans `assets/section-main-product.css`. Vous pouvez personnaliser :

### Taille des swatches
```css
.product__color-swatch-item {
  width: 6rem;  /* Taille mobile */
  height: 6rem;
}

@media (min-width: 576px) {
  .product__color-swatch-item {
    width: 7rem;  /* Taille desktop */
    height: 7rem;
  }
}
```

### Espacement entre les swatches
```css
.product__color-swatch-list {
  gap: 1.2rem;  /* Espace mobile */
}

@media (min-width: 750px) {
  .product__color-swatch-list {
    gap: 1.6rem;  /* Espace desktop */
  }
}
```

### Bordure du swatch actif
```css
.product__color-swatch-item--active {
  border: 1px solid rgb(var(--color-foreground));
}
```

### Border radius
```css
.product__color-swatch-item {
  border-radius: 0.4rem;  /* Coins arrondis */
}
```

---

## 📝 Exemple d'utilisation

### Cas pratique : T-shirt disponible en 3 couleurs

Vous avez 3 produits :
- T-shirt Bleu (SKU: TSHIRT-BLUE)
- T-shirt Rouge (SKU: TSHIRT-RED)
- T-shirt Vert (SKU: TSHIRT-GREEN)

#### Configuration :

1. **Pour le T-shirt Bleu** :
   - Dans le metafield "Related Color Products", ajoutez : T-shirt Rouge et T-shirt Vert
   - Uploadez une image avec ALT "miniature" (photo du t-shirt bleu)

2. **Pour le T-shirt Rouge** :
   - Dans le metafield "Related Color Products", ajoutez : T-shirt Bleu et T-shirt Vert
   - Uploadez une image avec ALT "miniature" (photo du t-shirt rouge)

3. **Pour le T-shirt Vert** :
   - Dans le metafield "Related Color Products", ajoutez : T-shirt Bleu et T-shirt Rouge
   - Uploadez une image avec ALT "miniature" (photo du t-shirt vert)

#### Résultat :
Sur chaque page produit, le visiteur verra 3 vignettes :
- La vignette du produit actuel avec une bordure noire
- Les 2 autres couleurs sans bordure
- Au clic, redirection vers le produit correspondant

---

## 🔧 Dépannage

### Les swatches ne s'affichent pas
- Vérifiez que le metafield est bien rempli pour le produit
- Vérifiez que le namespace et la key sont corrects dans les settings du bloc
- Vérifiez qu'au moins un produit a une image (avec "miniature" dans l'ALT ou une featured image)
- **Debug** : Ajoutez temporairement ce code dans votre bloc pour voir si le metafield est accessible :
  ```liquid
  {{ product.metafields.custom.color_variants | json }}
  ```
  Remplacez `custom.color_variants` par votre namespace.key
  
### Seul le produit actuel s'affiche (pas les produits liés)
- Vérifiez que vous avez bien rempli le metafield dans la fiche produit
- Vérifiez que le namespace et la key correspondent exactement à votre définition de metafield
- Vérifiez que le type du metafield est bien "List of products"

### Les images sont de mauvaise qualité
- Uploadez des images de meilleure résolution (recommandé : 240x240px minimum)
- Ajoutez "miniature" dans l'ALT text pour utiliser des images spécifiques

### Le produit actuel n'a pas de bordure
- Vérifiez que la classe `.product__color-swatch-item--active` est bien appliquée
- Vérifiez le CSS dans `assets/section-main-product.css`

### Les swatches sont trop grands ou trop petits
- Ajustez les valeurs dans le CSS (voir section Personnalisation du style)

---

## 📱 Responsive

Le bloc est entièrement responsive :
- **Mobile** : Swatches de 6rem × 6rem avec un gap de 1.2rem
- **Tablet** : Swatches de 7rem × 7rem
- **Desktop** : Swatches de 7rem × 7rem avec un gap de 1.6rem

---

## 🌍 Traductions

Le label par défaut est "Available colors". Pour traduire dans d'autres langues :

1. Allez dans **Settings** → **Languages** dans l'admin Shopify
2. Modifiez les traductions pour `sections.main-product.blocks.color_swatch.settings.swatch_label.default`
3. Ou modifiez directement le label dans les settings du bloc pour chaque langue

---

## 💡 Conseils & Bonnes pratiques

1. **Cohérence des images** : Utilisez le même angle et le même fond pour toutes les images miniatures
2. **Taille optimale** : 240×240px pour les images miniatures (format carré)
3. **Performance** : Les images sont lazy-loaded automatiquement
4. **SEO** : Remplissez les ALT text des images de manière descriptive
5. **Accessibilité** : Le `title` attribute sur chaque swatch affiche le nom du produit au survol

---

## 🎯 Limitations connues

- Le système fonctionne avec des produits différents, pas des variants d'un même produit
- Il faut remplir manuellement le metafield pour chaque produit
- Maximum recommandé : 8-10 produits dans le metafield pour éviter une surcharge visuelle

---

## 📞 Support

Pour toute question ou problème, contactez votre développeur ou consultez la documentation Shopify sur les metafields.

---

**Version** : 1.0  
**Dernière mise à jour** : Novembre 2024  
**Compatibilité** : Shopify 2.0 themes

