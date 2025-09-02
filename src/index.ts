import { getPokemon } from '$utils/pokemon';
import type { PokemonData } from './types/pokemon';

function typeText(el: HTMLElement, text: string, speed: number = 50): Promise<void> {
  return new Promise(resolve => {
    let i = 0;
    el.textContent = "";
    const timer = setInterval(() => {
      el.textContent = text.slice(0, i++);
      if (i > text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function speak(text: string, rate: number = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject("Speech synthesis not supported");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

async function runIntro() {
  const introEl = document.querySelector('.pokedex-introduction-text') as HTMLElement;
  const introText = `Hello, Trainer! I’m your Pokédex, your ultimate guide to the world of Pokémon.
I hold information on every Pokémon you can imagine! To begin, just say: ‘Hey Pokédex’ followed
by a Pokémon’s name, and I’ll fetch the details for you. Ready to explore the Pokémon universe? Let’s get started!`;

  if (!introEl) return;

  await Promise.all([
    typeText(introEl, introText, 40),
    speak(introText, 1)
  ]);

  console.log("✅ Intro finished, starting recognition...");
  startRecognition();
}

function startRecognition() {
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
      const pokemonName = transcript.replace("hey pokedex", "").trim();
      if (!pokemonName) return;

      const intro = document.querySelector('.pokedex-introduction') as HTMLElement;
      const contentData = document.querySelector('.pokedex-content-data') as HTMLElement;
      const contentList = document.querySelector('.pokedex-content-list') as HTMLElement;

      if (intro) intro.style.display = "none";
      if (contentData) contentData.style.display = "flex";
      if (contentList) contentList.style.display = "grid";

      try {
        const pokemonData: PokemonData = await getPokemon(pokemonName);

        const imgEl = document.querySelector('[data-element="pokemon-image"]') as HTMLImageElement;
        const nameEl = document.querySelector('[data-element="pokemon-data"]') as HTMLElement;
        const hpEl = document.querySelector('[data-element="hp"]') as HTMLElement;
        const attackEl = document.querySelector('[data-element="attack"]') as HTMLElement;
        const defenseEl = document.querySelector('[data-element="defence"]') as HTMLElement;
        const spAttackEl = document.querySelector('[data-element="special-attack"]') as HTMLElement;
        const spDefenseEl = document.querySelector('[data-element="special-defence"]') as HTMLElement;
        const speedEl = document.querySelector('[data-element="speed"]') as HTMLElement;

        if (imgEl) {
          imgEl.src = pokemonData?.sprites?.front_default ?? "";
          imgEl.alt = pokemonData.species.name;
        }

        if (nameEl) {
          const name = pokemonData.species.name;
          const types = pokemonData.types?.map(t => t.type.name).join(" and ") ?? "unknown";
          const abilities = pokemonData.abilities?.map(a => a.ability?.name).filter(Boolean).join(", ") ?? "none";
          const heldItems = (pokemonData as any).held_items?.map((h: any) => h.item.name).join(", ") ?? null;

          let description = `This is a ${types} type Pokémon named ${name}.`;
          if (abilities && abilities !== "none") description += ` Its special abilities include ${abilities}.`;
          if (heldItems) description += ` If it holds ${heldItems}, it boosts its power.`;

          nameEl.textContent = description;

          // Speak Pokémon description
          await speak(description);
        }
        console.log(pokemonData);
        // Make sure stats array exists
        const stats = pokemonData.stats ?? [];

        // Helper to get stat by name
        function getStatValue(name: string): string {
          const stat = stats.find(s => s.stat.name === name);
          return stat ? stat.base_stat.toString() : "N/A";
        }

        // Now assign
        if (hpEl) hpEl.textContent = getStatValue("hp");
        if (attackEl) attackEl.textContent = getStatValue("attack");
        if (defenseEl) defenseEl.textContent = getStatValue("defense");
        if (spAttackEl) spAttackEl.textContent = getStatValue("special-attack");
        if (spDefenseEl) spDefenseEl.textContent = getStatValue("special-defense");
        if (speedEl) speedEl.textContent = getStatValue("speed");


      } catch (err) {
        console.error(err);
      }
    }
  };

  recognition.start();
}

window.Webflow ||= [];
window.Webflow.push(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runIntro();
  });
});
