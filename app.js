const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
    input.addEventListener("invalid",handleValidation);
    input.addEventListener("input",handleValidation);
})


// FUNC 1 CHAMP VALIDE
function handleValidation(e){
    if(e.type === "invalid"){
        e.target.setCustomValidity("Il faut remplir le champ (sinon ça marche pas)");
    }  // on va modifier le champ auto de l'anglais au français.
    else if(e.type === "valid"){
        e.type.setCustomValidity("");
    }
}

const cookieForm = document.querySelector("form");
cookieForm.addEventListener("submit",handleForm);    


// FUNC 2 GÈRE L'INPUT
function handleForm(event){
    event.preventDefault();

    const newCookie = {}; // objet vide

    inputs.forEach(input => {
        const nameAttribute = input.getAttribute("name"); // attribut dans le input html
        newCookie[nameAttribute] = input.value; 
        // on ajoute donc dans le tuple le nom et la valeur du cookie.
        // on aurait pu juste mettre newCookie["name"]=input.value
    })    
    // pour que le cookie expire au bout de 1 semaine on utilise new Date
    newCookie.expires = new Date(new Date().getTime() + 7*24*60*60*1000);
    // on store la meme date de création + 1 semaine pour ensuite comparer

    createCookie(newCookie);
}

// FUNC 3 STORE LES COOKIES
function createCookie(newCookie){

    if(doesCookieExist(newCookie.name)){
        createToast();
    }
    else {
        createToast();
    }

    // créer le cookie:
    document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};expires=${newCookie.expires.toUTCString()}`; 
    // c'est avec l'api document.cookie qu'on gère les cookies en js
    // ils seront stoqués dans storage sur chrome
    // la méthode encodeURIComp encode le texte avec des symboles comme %cookie
    // la méthode toUTCString convertit une date en str car en effet la date de new Date est
    // un objet et non une str.

    // ccl : on a crée un cookie avec son nom, sa valeur et sa date d'exp ss forme de str
}

// FUNC 4 CRÉER UN TOAST
function doesCookieExist(name){
    const cookies = document.cookie; // pour avoir les cookies ss forme de nom-valeur
    console.log(cookies);
}

function createToast(){

}