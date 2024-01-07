const pokemonName = document.getElementById("pokemon");
const nameText = document.getElementById("name"); //
const sprite = document.getElementById("sprite"); //
const pokedexNumber = document.getElementById("number"); 
const IDN = document.getElementById("IDN"); //
const typed = document.getElementById("desc"); // 
const description = document.getElementById("description"); //
const title = document.getElementById("title"); //
const invalidInput = document.getElementById("invalid");
const back = document.getElementById("back");
const next = document.getElementById("next");
const article = document.querySelector("article");
const hidden = document.getElementById("hidden");
const version = document.getElementById("drop");

let pokemon = ""
let typeIndex = 0;
let abilityIndex = 0;

async function aquireSauce(pokemonName) {
    try{
        const result = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonName);
        const JSONresult = await result.json();
        return JSONresult;
    } catch {
        invalidInput.style.display = "flex";
        document.querySelector("body").style.overflow = "hidden";
        setTimeout(() => {invalidInput.style.display = "none"}, 3000);
    }
}

async function getAbility() {
    if (pokemon.abilities.length > 1 || pokemon.types.length > 1) {
        back.style.display = "block";
        next.style.display = "block";
        article.style.paddingBottom = "0px";
    } else {
        back.style.display = "none";
        next.style.display = "none";
        article.style.paddingBottom = "60px";
    }
    const ability = pokemon.abilities[abilityIndex];
    const abilityName = ability.ability.name;
    const result = await fetch(ability.ability.url)
                         .then(async result => {
                            return await result.json()
                         });
    
    for (const desc of result.effect_entries) {
        if(desc.language.name === "en") {
            description.innerHTML = desc.effect;
        }
    }
    title.innerHTML = abilityName.toUpperCase();
    ability.is_hidden ? hidden.style.display = "block" : hidden.style.display = "none";
}

async function getType() {
    const type = pokemon.types[typeIndex];
    const typeName = type.type.name;
    typed.innerHTML = "TYPE: <span>" + typeName.toUpperCase() + "</span>";
}

async function nextBack(event) {
    if (event.srcElement.id === "back") {
        if (abilityIndex === 0) {
            abilityIndex = pokemon.abilities.length - 1;
        } else {
            abilityIndex--;
        }
        if (typeIndex === 0) {
            typeIndex = pokemon.types.length - 1;
        } else {
            typeIndex--;
        }
    } else {
        if (abilityIndex === pokemon.abilities.length - 1) {
            abilityIndex = 0;
        } else {
            abilityIndex++;
        }
        if (typeIndex === pokemon.types.length - 1) {
            typeIndex = 0;
        } else {
            typeIndex++;
        }
    }
    getAbility();
    getType();
}

async function apply(input) {
    abilityIndex = 0;
    typeIndex = 0
    try{
        document.title = "Pokemon " + version.value.charAt(0).toUpperCase() + version.value.slice(1) + " Pokedex";
        pokemon = await aquireSauce(input);
        pokedexNumber.innerHTML = "No";
        for(const gen of pokemon.game_indices) {
            if (gen.version.name === version.value) {
                pokedexNumber.innerHTML = "No <span>" + gen.game_index + "<span>";
            }
        }
        if (pokedexNumber.innerHTML === "No") {
            throw new Error("not in ruby");
        }

        sprite.src = pokemon.sprites.front_default;
        nameText.innerHTML = pokemon.name.toUpperCase() + "<br>/" + pokemon.species.name.toUpperCase();
        IDN.innerHTML = "IDNo<span>" + pokemon.id + "</span>";
        await getType()
        await getAbility()
    } catch(error) {
        console.log(error)
        invalidInput.style.display = "flex";
        document.querySelector("body").style.height = "100%";
        setTimeout(async () => {
            invalidInput.style.display = "none";
            document.querySelector("body").style.height = "";
            document.querySelector("body").style.overflow = "auto";
            await apply("bulbasaur");
        }, 3000);
    }
    pokemonName.value = ""
};


document.getElementById("button").addEventListener("click", async event => {
    event.preventDefault();
    await apply(pokemonName.value.toLowerCase())
});
addEventListener("DOMContentLoaded", apply("bulbasaur"));
back.addEventListener("click", nextBack);
next.addEventListener("click", nextBack);