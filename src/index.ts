import { greetUser } from '$utils/greet';
import { getPokemon, getPokemons } from '$utils/pokemon';
import type { PokemonData } from './types/pokemon';
import type { Pokemon, Pokemons } from './types/pokemons';

// window.Webflow ||= [];
// window.Webflow.push(() => {
//   const name = 'John Doe';
//   greetUser(name);
//   getPokemon(10, 0);
// });


document.addEventListener('DOMContentLoaded',async () => {
// 1. Read intro text aloud
  const introEl = document.querySelector('.pokedex-introduction-text') as HTMLElement;
  if (introEl) {
    const text = introEl.innerText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  }

  // 2. Setup Speech Recognition
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = async (event: any) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log("User said:", transcript);

    if (transcript.startsWith("hey pokedex")) {
      // Extract pokemon name after "hey pokedex"
      const pokemonName = transcript.replace("hey pokedex", "").trim();

      if (pokemonName) {
        // 3. Hide intro, show data sections
        const intro = document.querySelector('.pokedex-introduction') as HTMLElement;
        const contentData = document.querySelector('.pokedex-content-data') as HTMLElement;
        const contentList = document.querySelector('.pokedex-content-list') as HTMLElement;

        if (intro) intro.style.display = "none";
        if (contentData) contentData.style.display = "block";
        if (contentList) contentList.style.display = "block";

        // 4. Fetch pokemon data
        try {
          const pokemonData: PokemonData = await getPokemon(pokemonName);
          console.log("Fetched Pokemon Data:", pokemonData);

          // Find elements by data-element attribute
          const imgEl = document.querySelector('[data-element="pokemon-image"]') as HTMLImageElement;
          const nameEl = document.querySelector('[data-element="pokemon-data"]') as HTMLElement;
          const hpEl = document.querySelector('[data-element="hp"]') as HTMLElement;
          const attackEl = document.querySelector('[data-element="attack"]') as HTMLElement;
          const defenseEl = document.querySelector('[data-element="defence"]') as HTMLElement;
          const spAttackEl = document.querySelector('[data-element="special-attack"]') as HTMLElement;
          const spDefenseEl = document.querySelector('[data-element="special-defence"]') as HTMLElement;
          const speedEl = document.querySelector('[data-element="speed"]') as HTMLElement;

          // Safely update elements if they exist
          if (imgEl) {
            imgEl.src = pokemonData.gold?.front_default ?? "";
            imgEl.alt = pokemonData.species.name;
          }

          if (nameEl) {
            const name = pokemonData.species.name;
            const types = pokemonData.types?.map(t => t.type.name).join(" and ") ?? "unknown";
            const abilities = pokemonData.abilities
              ?.map(a => a.ability?.name)
              .filter(Boolean)
              .join(", ") ?? "none";
            
            // NOTE: The held_items field is available in API, but not in your schema.
            // If you want to include it, extend PokemonData with:
            // held_items?: { item: Species }[];
            const heldItems = (pokemonData as any).held_items
              ?.map((h: any) => h.item.name)
              .join(", ") ?? null;

            let description = `This is a ${types} type Pokémon named ${name}.`;

            if (abilities && abilities !== "none") {
              description += ` Its special abilities include ${abilities}.`;
            }

            if (heldItems) {
              description += ` If it holds ${heldItems}, it boosts its power.`;
            }

            nameEl.textContent = description;
          }


          // Pokémon stats usually come in an array of objects like: { base_stat, stat: { name: "hp" } }
          const statsMap = new Map(pokemonData.stats?.map(stat => [stat.stat.name, stat.base_stat]));

          if (hpEl) hpEl.textContent = statsMap.get("hp")?.toString() ?? "N/A";
          if (attackEl) attackEl.textContent = statsMap.get("attack")?.toString() ?? "N/A";
          if (defenseEl) defenseEl.textContent = statsMap.get("defense")?.toString() ?? "N/A";
          if (spAttackEl) spAttackEl.textContent = statsMap.get("special-attack")?.toString() ?? "N/A";
          if (spDefenseEl) spDefenseEl.textContent = statsMap.get("special-defense")?.toString() ?? "N/A";
          if (speedEl) speedEl.textContent = statsMap.get("speed")?.toString() ?? "N/A";

          // 🎤 Read the informative description aloud
          if (nameEl && nameEl.textContent) {
            const speech = new SpeechSynthesisUtterance(nameEl.textContent);
            speech.lang = "en-US";
            speech.rate = 1;   // adjust speed (0.5 = slower, 2 = faster)
            speech.pitch = 1;  // adjust pitch (0 = low, 2 = high)
            window.speechSynthesis.cancel(); // stop any previous speech
            window.speechSynthesis.speak(speech);
          }
        } catch (err) {
          console.error(err);
        }

      }
    }
  };

  recognition.start();
});