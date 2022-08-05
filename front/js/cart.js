let storageKanaps;
let apiKanaps;

const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');

// Fonction qui récupère un canapé
const getOneProduct = (productId) => {
  return new Promise((resolve) => {
    fetch('http://localhost:3000/api/products/' + productId).then(response => response.json())
      .then(result => {
        resolve(result);
      })
  });
}

// Fonction qui récupère tout les éléments du localstorage puis les ajoutes dans un tableaux
const getAllProductsFromApi = () => {
  const storedData = localStorage.getItem('axelRibeiroP5');
  if (!storedData) {
    return;
  }
  storageKanaps = JSON.parse(storedData);
  const promises = [];
  for (let i = 0; i < storageKanaps.length; i++) {
    const productId = storageKanaps[i].id;
    // Récupérer tout les canapés avec leurs id grâce à la fonction 'getOneProduct'
    promises.push(getOneProduct(productId));
  }

  Promise.all(promises).then((values) => {
    // Appeller la fonction qui affiche les canapés
    displayBasket(values);
  });
}

//====================Fonction pour afficher les canapés dans le panier======================
const displayBasket = (values) => {
  // Déclarer les variables vides auxquelles vont s'ajouter les canapés qui seront ajouté dans le panier
  let innerHTML = '';
  let totalPrice_ = 0;
  let totalQuantity_ = 0;

  // Retourner un tableau avec le canapés auquel on ajoute la couleur et la quantité
  apiKanaps = values.map((apiKanap, i) => {
    apiKanap.color = storageKanaps[i].color;
    apiKanap.quantity = Number(storageKanaps[i].quantity);
    // Ajouter la quantité totale du panier à la variable "totalQuantity"
    totalQuantity_ += apiKanap.quantity;
    // Ajouter la prix total à la variable "totalPrice" an multipliant la quantité et le prix des canapés
    const rawPrice = Number(apiKanap.quantity) * Number(apiKanap.price);
    totalPrice_ += rawPrice;
    // Ajouter la fonction displayBasketLine à la variable "innerHTML" pour afficher les canapés dans le panier
    innerHTML += displayBasketLine(apiKanap);

    return apiKanap
  })
  // Ajouter les éléments dans leur container respectif
  cartItems.innerHTML = innerHTML;
  totalQuantity.innerText = totalQuantity_;
  totalPrice.innerText = totalPrice_;

  //======================Suppression des produits=========================
  addDeleteProductsListener();
  //=====================Augmenter la quantité dans le panier=====================
  upQuantity();
  //=========================Valider les données des utilisateurs==========================
  formValidation();
};

// Fonction qui contient le texte à implanter avec les données mise à jour
const displayBasketLine = (kanap) => {
  return `<article class="cart__item" data-id="${kanap._id}" data-color="${kanap.color}">
    <div class="cart__item__img">
      <img src=${kanap.imageUrl} alt=${kanap.altTxt}>
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${kanap.name}</h2>
        <p>${kanap.color}</p>
        <p>${kanap.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${kanap.quantity}</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanap.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
};

//=====================Fonction pour supprimer des produits du panier===========================
const addDeleteProductsListener = () => {
  const deleteBtn = document.querySelectorAll('.deleteItem');

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener('click', (e) => {
      // Eviter le comportement par defauts des boutons lorsque l'on clique dessus
      e.preventDefault();
      // Récupérer l'article en entier
      const articleParent = e.target.parentNode.parentNode.parentNode.parentNode;
      // Récuperer l'id et la couleur du produit qui va être supprimer
      let idDeleteKanap = articleParent.dataset.id;
      let colorDeleteKanap = articleParent.dataset.color;
      // Je récupère les produits qui ne seront pas supprimer avec ".filter" en comparant l'id et couleur
      storageKanaps = storageKanaps.filter(el => el.id !== idDeleteKanap || el.color !== colorDeleteKanap);
      // Ajouter les produits qui ne sont pas supprimer au localstorage
      localStorage.setItem("axelRibeiroP5", JSON.stringify(storageKanaps));
      // Supprimer le canapé de la page html
      alert("Ce produit a été supprimer du panier");
      articleParent.remove();
    })
  }
}

//====================Fonction pour augmenter la quantité dans le panier=======================
const upQuantity = () => {
  const quantityUp = document.querySelectorAll('.itemQuantity');

  for (let i = 0; i < storageKanaps.length; i++) {
    quantityUp[i].addEventListener('change', (e) => {
      // Récupérer l'article en entier puis récupérer la couleur et l'id 
      const articleParent = e.target.parentNode.parentNode.parentNode.parentNode;
      let idKanap = articleParent.dataset.id;
      let colorKanap = articleParent.dataset.color;
      //Récupérer l'index du produit dont la couleur et l'id correspondent à ceux dans le localstorage
      const index = storageKanaps.findIndex((storageKanap) => {
        return storageKanap.id == idKanap && storageKanap.color == colorKanap;
      })
      // On incrémente la quantité du produit
      storageKanaps[index].quantity = e.target.value;
      // On remet le localstorage dans son format d'origine
      localStorage.setItem('axelRibeiroP5', JSON.stringify(storageKanaps))
      setTotalQuantityAndPrice();
    }
    );
  }
}

//=======================Fonction de validation des données des utilisateurs=======================
const formValidation = () => {
  const orderBtn = document.getElementById('order');

  // On récupère tout les éléments html (input et container du msg d'erreur)
  const firstNameValidation = document.getElementById("firstName");
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  const lastNameValidation = document.getElementById("lastName");
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  const addressValidation = document.getElementById("address");
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  const cityValidation = document.getElementById("city");
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  const emailValidation = document.getElementById("email");
  const emailErrorMsg = document.getElementById("emailErrorMsg");

  // Regex pour controler les données inscrites par les utilisateurs
  const regexName = /^[a-z ,.'-ç]+$/i;
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexAddress = /^[a - zA - Z0 - 9\s,'-âéè]*$/;

  orderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let errors = 0;
    // On verifie chaque catégorie, si il n'y a rien d'inscrit dans la case on affiche un msg d'erreur 
    // et si l'élément inscrit ne respecte pas les caractères du regex on indique que le format est invalide
    // On incrémente "errors" à chaque erreur 
    if (firstNameValidation.validity.valueMissing) {
      firstNameErrorMsg.textContent = 'Prenom manquant';
      errors++;
    } else if (regexName.test(firstNameValidation.value) == false) {
      firstNameErrorMsg.textContent = 'Format incorrect';
      errors++;
    } else {
      firstNameErrorMsg.textContent = '';
    }

    if (lastNameValidation.validity.valueMissing) {
      lastNameErrorMsg.textContent = 'Nom manquant';
      errors++;
    } else if (regexName.test(lastNameValidation.value) == false) {
      lastNameErrorMsg.textContent = 'Format incorrect';
      errors++;
    } else {
      lastNameErrorMsg.textContent = '';
    }

    if (addressValidation.validity.valueMissing) {
      addressErrorMsg.textContent = 'Adresse manquante';
      errors++;
    } else if (regexAddress.test(addressValidation.value) == false) {
      addressErrorMsg.textContent = 'Format incorrect';
      errors++;
    } else {
      addressErrorMsg.textContent = '';
    }

    if (cityValidation.validity.valueMissing) {
      cityErrorMsg.textContent = 'Ville manquante';
      errors++;
    } else if (regexName.test(cityValidation.value) == false) {
      cityErrorMsg.textContent = 'Format incorrect';
      errors++;
    } else {
      cityErrorMsg.textContent = '';
    }

    if (emailValidation.validity.valueMissing) {
      emailErrorMsg.textContent = 'Email manquant';
      errors++;
    } else if (regexEmail.test(emailValidation.value) == false) {
      emailErrorMsg.textContent = 'Format incorrect';
      errors++;
    } else {
      emailErrorMsg.textContent = '';
    }
    // Si il y au moins une erreur on stop la progression
    if (errors > 0) {
      return;
    }
    // On récupere les infos qui seront envoyés
    const dataToSend = {
      contact: {
        firstName: firstNameValidation.value,
        lastName: lastNameValidation.value,
        address: addressValidation.value,
        city: cityValidation.value,
        email: emailValidation.value
      },
      products: storageKanaps.map((product) => product.id)
    }
    // fetch pour envoyer les info avec la methode post 
    // Créer un nouvel objet header
    const headers = new Headers()
    // Lui ajoute du contenu de type JSON
    headers.append('Content-Type', 'application/json')
    // Précise la méthode 'post' pour envoyer 'dataToSend' en format JSON
    fetch(`http://localhost:3000/api/products/order`, {
      headers: headers, method: 'post', body: JSON.stringify(dataToSend)
    })
      .then(response => response.json())
      .then((result) => {
        document.location.href = './confirmation.html?orderid=' + result.orderId;
      })
      .catch(error => { console.log(error) });
  });
}

//=================Fonction qui met à jour la quantité totale et le prix total==================
const setTotalQuantityAndPrice = () => {
  let quantity = 0;
  let price = 0;

  for (let i = 0; i < storageKanaps.length; i++) {
    const apiKanap = apiKanaps.find(item => item._id == storageKanaps[i].id);
    quantity += Number(storageKanaps[i].quantity);
    price += Number(apiKanap.price) * Number(storageKanaps[i].quantity);
  }
  totalPrice.innerText = price;
  totalQuantity.innerText = quantity;
}

getAllProductsFromApi();