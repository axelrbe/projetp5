// Fonction erreur
const errorCallBack = (error) => {
    console.log(error)
};

// Première fonction de succès
const responseCallBack = (response) => {
    return response.json()
};


// Fonction qui implante les produits sur la page
const successCallBack = (kanaps) => {
    const kanapSection = document.getElementsByTagName("section")[0];
    let innerHTML = '';
    for (let i = 0; i < kanaps.length; i++) {
        const kanap = kanaps[i];
        innerHTML += `<a href="./product.html?id=${kanap._id}">
        <article>
            <img src=${kanap.imageUrl} alt=${kanap.altTxt}>
               <h3 class="productName">${kanap.name}</h3>
               <p class="productDescription">${kanap.description}</p>
        </article>
    </a>`
    }
    kanapSection.innerHTML = innerHTML;
};

// Utilisation de fetch pour récupérer les ressources
fetch("http://localhost:3000/api/products")
    .then(responseCallBack)
    .then(successCallBack)
    .catch(errorCallBack);





