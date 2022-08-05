const urlSearch = document.location.search;
const urlSearchParams = new URLSearchParams(urlSearch);
const productId = urlSearchParams.get('id');
let selectedQuantity;
let selectedColor;

// Fonction d'erreur
const errorCallBack = (error) => {
    console.log(error);
};

// Première onction de succès
const responseCallBack = (response) => {
    return response.json();
};

//================Fonction pour implanter les infos du canapé==================
const implementProductInfo = (kanap) => {
    let kanapImg = document.querySelector(".item__img");
    let kanapTitle = document.getElementById('title');
    let kanapPrice = document.getElementById('price');
    let kanapDescription = document.getElementById('description');
    let kanapColor = document.getElementById('colors');

    kanapImg.innerHTML = `<img src="${kanap.imageUrl}" alt="${kanap.altTxt}">`;
    kanapTitle.innerHTML = `${kanap.name}`;
    kanapPrice.innerHTML = `${kanap.price}`;
    kanapDescription.innerHTML = `${kanap.description}`;

    for (i = 0; i < kanap.colors.length; i++) {
        kanapColor.innerHTML += `<option value="${kanap.colors[i]}">${kanap.colors[i]}</option>`;
    }

};


fetch(`http://localhost:3000/api/products/${productId}`)
    .then(responseCallBack)
    .then(implementProductInfo)
    .catch(errorCallBack);


// Evenements pour récupérer le couleur et la quantité choisis par l'utilisateurs
document.getElementById('colors').addEventListener('change', (e) => {
    selectedColor = e.target.value
});

document.getElementById('quantity').addEventListener('change', (e) => {
    if (e.target.value < 0) {
        alert('Veillez à renseigner une valeur positive')
        return;
    } else {
        selectedQuantity = e.target.value
    }
});

//========================Fonction d'ajout d'un produit au panier=======================
document.getElementById('addToCart').addEventListener('click', () => {
    // Dire qu'il faut avoir au moins une couleur et une quantité spécifier
    if (!selectedColor || !selectedQuantity) {
        alert('Attention à bien sélectionner une couleur et une quantité');
        return;
    }
    // Récuperer le panier dans le localStorage
    const storedData = localStorage.axelRibeiroP5;
    // Initialiser le panier comme un tableau vide
    let basket = [];
    // Restaurer le format du panier en objet dans le but de le manipuler
    if (storedData) {
        basket = JSON.parse(storedData)
    }
    // Récupérer le canapé ayant la couleur sélectionner et l'id de ce produit
    const kanapIndex = basket.findIndex((product) => {
        return product.id == productId && product.color == selectedColor
    });
    // Si panier vide => ajouter le canapé et ses info au panier mais si canapé déjà présent dans le panier => augmenter la quantité 
    if (kanapIndex > -1) {
        basket[kanapIndex].quantity += Number(selectedQuantity)
    } else {
        const newKanap = {
            id: productId,
            color: selectedColor,
            quantity: Number(selectedQuantity)
        }
        basket.push(newKanap);
    }
    alert('Votre produits a bien été ajouté au panier !')
    // Défini le panier dans le localstorage et le reconverti en chaine de caractère
    localStorage.axelRibeiroP5 = JSON.stringify(basket);
});