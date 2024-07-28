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
function handleForm(e){
    e.preventDefault();

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
        createToast({name: newCookie.name, state: "créé", color:"green"});
    }

    // créer le cookie:
    document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};expires=${newCookie.expires.toUTCString()}`; 
    // c'est avec l'api document.cookie qu'on gère les cookies en js
    // ils seront stoqués dans storage sur chrome
    // la méthode encodeURIComp encode le texte avec des symboles comme %cookie
    // la méthode toUTCString convertit une date en str car en effet la date de new Date est
    // un objet et non une str.

    // ccl : on a crée un cookie avec son nom, sa valeur et sa date d'exp ss forme de str

    if(cookiesList.children.length) displayCookies(); // on affiche en continu les cookies
}


// FUNC 4 TEST D'EXISTENCE
function doesCookieExist(name){
    const cookies = document.cookie.replace(/\s/g,"").split(";"); // pour avoir les cookies ss forme de nom-valeur
    const onlyCookiesName = cookies.map(cookie => cookie.split("=")[0]); // on recup les noms
    // console.log(cookies, onlyCookiesName); 
    
    const cookiePresence = onlyCookiesName.find(cookie => cookie === encodeURIComponent(name));
    return cookiePresence; 

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

const cookiesList = document.querySelector(".cookies-list");
const displayCookieBtn = document.querySelector(".display-cookie-btn");
const infoTxt = document.querySelector(".info-txt");

displayCookieBtn.addEventListener("click",displayCookies);



let lock = false; // empeche les pb d'affichage
// FUNC 6 AFFICHER LES COOKIES
function displayCookies(){

    if(cookiesList.children.length) cookiesList.textContent = ""; 
    // on reset la liste pour pas afficher pls fois le mm cookie.


    const cookies = document.cookie.replace(/\s/g,"").split(";").reverse();

    if(!cookies[0]){
        if(lock) return;
    
        lock = true;
        infoTxt.textContent = "pas de cookies";
    
        setTimeout(() => {infoTxt.textContent = ""; lock = false;}, 1500); // on reset le txt
        return;
    }

    createElements(cookies);
}


// FUNC 7 CRÉER DES TABS
function createElements(cookies){
    // createElements et createElement sont différentes
    
    // créer la liste
    cookies.forEach(cookie => {
        const formatCookie = cookie.split("=");
        const listItem = document.createElement("li"); // on crée un li (un élément de liste)
        const name = decodeURIComponent(formatCookie[0]);

        listItem.innerHTML= `
        <p>
           <span>Nom</span>: ${name}
        </p>
        <p>
            <span>Valeur</span>: ${decodeURIComponent(formatCookie[1])}
        </p>
        <button>X</button>
        `; // on ajoute du contenu au Li avec innerHTML pour chaque cookie
    
        // créer un addEventListener pour la X:
        listItem.querySelector("button").addEventListener("click", e => {
            createToast({name: name, state: "supprimé", color: "crimson"})

            // et on détruit le cookie avec :
            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`
            // on met le nom du cookie =... et ça expire car new Date(0) = 1er janvier 1970.

            // on supprime le li
            e.target.parentElement.remove()

        })
        cookiesList.appendChild(listItem); // on l'add
    })
}