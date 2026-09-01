// ===================================================================
// DONNÉES SIMULÉES (Tableau de bord)
// ===================================================================
const donneesRequetesParJour = [
  { jour: "15 Mai", valeur: 150 },
  { jour: "16 Mai", valeur: 210 },
  { jour: "17 Mai", valeur: 140 },
  { jour: "18 Mai", valeur: 220 },
  { jour: "19 Mai", valeur: 260 },
  { jour: "20 Mai", valeur: 290 },
  { jour: "21 Mai", valeur: 320 }
];

const donneesRepartitionServices = [
  { label: "Chat", valeur: 38, couleur: "#4f46e5" },
  { label: "Résumé de texte", valeur: 22, couleur: "#16a34a" },
  { label: "Classification", valeur: 18, couleur: "#9333ea" },
  { label: "Traduction", valeur: 12, couleur: "#f59e0b" },
  { label: "Autres", valeur: 10, couleur: "#3b82f6" }
];

const activiteRecente = [
  { activite: "Résumé du document_projet.pdf", service: "Résumé de texte", utilisateur: "Admin User", date: "21/05/2024 14:32" },
  { activite: "Classification de sentiments", service: "Classification", utilisateur: "Admin User", date: "21/05/2024 14:21" },
  { activite: "Traduction FR → EN", service: "Traduction", utilisateur: "Admin User", date: "21/05/2024 14:15" },
  { activite: "Discussion sur l'IA générative", service: "Chat", utilisateur: "Admin User", date: "21/05/2024 14:05" },
  { activite: "Génération d'idées de projet", service: "Idées", utilisateur: "Admin User", date: "21/05/2024 13:50" }
];

const modelesPopulaires = [
  { modele: "mistral-7b-instruct", utilisations: 532 },
  { modele: "gpt-4-turbo", utilisations: 389 },
  { modele: "llama-3-8b", utilisations: 256 },
  { modele: "bert-base-uncased", utilisations: 179 },
  { modele: "google-translate-v1", utilisations: 142 }
];

// ===================================================================
// NAVIGATION ENTRE LES MODULES
// ===================================================================
function initNavigation() {
  const liens = document.querySelectorAll(".nav-link");

  liens.forEach(lien => {
    lien.addEventListener("click", () => {
      const cible = lien.getAttribute("data-target");

      // Désactive tous les liens et vues
      liens.forEach(l => l.classList.remove("active"));
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));

      // Active le lien et la vue cliqués
      lien.classList.add("active");
      document.getElementById(cible).classList.add("active");
    });
  });
}



// ===================================================================
// REMPLISSAGE DES TABLEAUX
// ===================================================================
function remplirTableauActivite() {
  const corps = document.getElementById("activite-recente-body");
  corps.innerHTML = activiteRecente.map(a => `
    <tr>
      <td>${a.activite}</td>
      <td>${a.service}</td>
      <td>${a.utilisateur}</td>
      <td>${a.date}</td>
    </tr>
  `).join("");
}

function remplirTableauModeles() {
  const corps = document.getElementById("modeles-populaires-body");
  corps.innerHTML = modelesPopulaires.map(m => `
    <tr>
      <td>${m.modele}</td>
      <td>${m.utilisations}</td>
    </tr>
  `).join("");
}
// ===================================================================
// PARTIE 3 : RÉSUMÉ DE TEXTE (simulé)
// ===================================================================
function genererResumeSimule(texte) {
  // Simulation simple : on garde la 1ère phrase + une phrase du milieu,
  // pour donner l'impression d'un résumé sans vrai modèle IA.
  const phrases = texte
    .split(/(?<=[.!?])\s+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (phrases.length === 0) {
    return "Aucun texte à résumer.";
  }
  if (phrases.length === 1) {
    return phrases[0];
  }

  const premierePhrase = phrases[0];
  const phraseMilieu = phrases[Math.floor(phrases.length / 2)];

  return `${premierePhrase} ${phraseMilieu}`;
}

function initResume() {
  const bouton = document.getElementById("resume-btn");
  const input = document.getElementById("resume-input");
  const output = document.getElementById("resume-output");

  bouton.addEventListener("click", () => {
    const texte = input.value.trim();

    if (texte === "") {
      output.textContent = "Veuillez saisir un texte à résumer.";
      return;
    }

    output.textContent = "Génération du résumé...";

    // Petit délai simulé pour imiter un traitement IA
    setTimeout(() => {
      const resume = genererResumeSimule(texte);
      output.textContent = resume;
    }, 1000);
  });
}
// ===================================================================
// PARTIE 4 : TRADUCTION (simulée)
// ===================================================================
const traductionsSimulees = {
  en: { prefixe: "[EN] ", suffixe: "" },
  es: { prefixe: "[ES] ", suffixe: "" },
  ar: { prefixe: "[AR] ", suffixe: "" },
  wo: { prefixe: "[WO] ", suffixe: "" }
};

const nomsLangues = {
  en: "Anglais",
  es: "Espagnol",
  ar: "Arabe",
  wo: "Wolof"
};

function genererTraductionSimulee(texte, langue) {
  const config = traductionsSimulees[langue];
  // Simulation : on inverse le sens des mots avec un préfixe de langue,
  // pour donner l'impression d'un résultat traduit sans vrai modèle IA.
  const motsInverses = texte.trim().split(/\s+/).reverse().join(" ");
  return `${config.prefixe}${motsInverses}`;
}

function initTraduction() {
  const bouton = document.getElementById("traduction-btn");
  const input = document.getElementById("traduction-input");
  const select = document.getElementById("traduction-langue");
  const output = document.getElementById("traduction-output");

  bouton.addEventListener("click", () => {
    const texte = input.value.trim();
    const langue = select.value;

    if (texte === "") {
      output.textContent = "Veuillez saisir un texte à traduire.";
      return;
    }

    output.textContent = `Traduction vers ${nomsLangues[langue]} en cours...`;

    setTimeout(() => {
      const traduction = genererTraductionSimulee(texte, langue);
      output.textContent = traduction;
    }, 1000);
  });
}
// ===================================================================
// PARTIE 5 : CHAT IA (vrai modèle via Hugging Face Inference API)
// ===================================================================
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct"; // change ici si besoin

let historiqueConversation = [];

function chargerCleHF() {
  const statut = document.getElementById("hf-token-status");
  const cleSauvegardee = localStorage.getItem("hf_token");

  if (cleSauvegardee) {
    document.getElementById("hf-token").value = cleSauvegardee;
    statut.textContent = "Clé API chargée.";
  }

  document.getElementById("hf-token-save").addEventListener("click", () => {
    const cle = document.getElementById("hf-token").value.trim();
    if (cle === "") {
      statut.textContent = "Veuillez saisir une clé.";
      statut.style.color = "#dc2626";
      return;
    }
    localStorage.setItem("hf_token", cle);
    statut.textContent = "Clé API enregistrée sur cet appareil.";
    statut.style.color = "#16a34a";
  });
}

function ajouterMessageChat(texte, role) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;
  div.textContent = texte;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function envoyerMessageChat(message) {
  const cle = localStorage.getItem("hf_token");

  if (!cle) {
    ajouterMessageChat("Merci de renseigner ta clé API Hugging Face ci-dessus avant de discuter.", "ai");
    return;
  }

  historiqueConversation.push({ role: "user", content: message });

  try {
    const reponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cle}`
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: historiqueConversation,
        max_tokens: 300
      })
    });

    if (!reponse.ok) {
      const erreur = await reponse.text();
      throw new Error(`Erreur API (${reponse.status}) : ${erreur}`);
    }

    const donnees = await reponse.json();
    const texteReponse = donnees.choices[0].message.content;

    historiqueConversation.push({ role: "assistant", content: texteReponse });
    ajouterMessageChat(texteReponse, "ai");

  } catch (erreur) {
    console.error(erreur);
    ajouterMessageChat("Une erreur est survenue lors de l'appel au modèle. Vérifie ta clé API et ta connexion.", "ai");
  }
}

function initChat() {
  chargerCleHF();

  const bouton = document.getElementById("chat-send");
  const input = document.getElementById("chat-input");

  const envoyer = () => {
    const message = input.value.trim();
    if (message === "") return;

    ajouterMessageChat(message, "user");
    input.value = "";
    envoyerMessageChat(message);
  };

  bouton.addEventListener("click", envoyer);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") envoyer();
  });
}
// ===================================================================
// INITIALISATION DU TABLEAU DE BORD
// ===================================================================
function initDashboard() {
  remplirTableauActivite();
  remplirTableauModeles();
  initResume();
  initTraduction();
  initChat();
}

// ===================================================================
// DÉMARRAGE
// ===================================================================
  initNavigation();
  initDashboard();