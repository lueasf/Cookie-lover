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

    cookieForm.reset(); // pour reset les inputs
    createCookie(newCookie);
}

// FUNC 3 STORE LES COOKIES
function createCookie(newCookie){

    if(doesCookieExist(newCookie.name)){
        createToast({name: newCookie.name, state: "modifié", color:"orangered"});
    }
    else {
        createToast({name: newCookie.name, state: "crée", color:"green"});
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

// FUNC 4 TEST D'EXISTENCE
function doesCookieExist(name){
    const cookies = document.cookie.replace(/\s/g,"").split(";"); // pour avoir les cookies ss forme de nom-valeur
    const onlyCookiesName = cookies.map(cookie => cookie.split("=")[0]); // on recup les noms
    console.log(cookies, onlyCookiesName); 
    return onlyCookiesName.includes(name); // on regarde si le cookie existe
    // plus long : 
    // const cookiePresence = onlyCookiesName.find(cookie => cookie === encodeURIComponent(name));
    // return cookiePresence; truthy ou falsy

}

const toastContainer = document.querySelector(".toasts-container");

// FUNC 5 CREER TOAST
function createToast({name, state, color}){
    const toastInfo = document.createElement("p"); //on crée un ele p
    toastInfo.className = "toast";
    toastInfo.textContent = `Le cookie "${name}" a été ${state}.`;
    toastInfo.style.backgroundColor = color;
    toastContainer.appendChild(toastInfo); // on ajoute le p dans le container

    setTimeout(() => {toastInfo.remove()}, 2500) // (fonction callback, temps en ms)
}