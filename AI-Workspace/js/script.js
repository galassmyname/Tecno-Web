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

      liens.forEach(l => l.classList.remove("active"));
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));

      lien.classList.add("active");
      document.getElementById(cible).classList.add("active");

      // Rafraîchit l'historique à chaque fois qu'on ouvre cet onglet
      if (cible === "historique") {
        afficherHistorique();
      }
    });
  });
}
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
// PARTIE 3 : RÉSUMÉ DE TEXTE (vrai modèle)
// ===================================================================
function initResume() {
  const bouton = document.getElementById("resume-btn");
  const input = document.getElementById("resume-input");
  const output = document.getElementById("resume-output");

  bouton.addEventListener("click", async () => {
    const texte = input.value.trim();

    if (texte === "") {
      output.textContent = "Veuillez saisir un texte à résumer.";
      return;
    }

    output.textContent = "Génération du résumé...";

    try {
      const resume = await appellerModeleHF([
        { role: "system", content: "Tu es un assistant qui résume des textes en français, en 2 à 3 phrases maximum, sans commentaire ni introduction." },
        { role: "user", content: texte }
      ]);
      output.textContent = resume;
      ajouterHistorique("Résumé de texte", texte, resume);
    } catch (erreur) {
      console.error(erreur);
      output.textContent = "Erreur lors de la génération du résumé. Vérifie ta clé API.";
    }
  });
}
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
      ajouterHistorique("Résumé de texte", texte, resume);
    }, 1000);
  });

// ===================================================================
// PARTIE 4 : TRADUCTION (simulée)
// ===================================================================


const nomsLangues = {
  en: "Anglais",
  es: "Espagnol",
  ar: "Arabe",
  wo: "Wolof"
};

// ===================================================================
// PARTIE 4 : TRADUCTION (vrai modèle)
// ===================================================================
function initTraduction() {
  const bouton = document.getElementById("traduction-btn");
  const input = document.getElementById("traduction-input");
  const select = document.getElementById("traduction-langue");
  const output = document.getElementById("traduction-output");

  bouton.addEventListener("click", async () => {
    const texte = input.value.trim();
    const langue = select.value;
    const nomLangue = nomsLangues[langue];

    if (texte === "") {
      output.textContent = "Veuillez saisir un texte à traduire.";
      return;
    }

    output.textContent = `Traduction vers ${nomLangue} en cours...`;

    try {
      const traduction = await appellerModeleHF([
        { role: "system", content: `Tu es un traducteur professionnel. Traduis le texte suivant en ${nomLangue}. Réponds uniquement avec la traduction, sans aucun commentaire.` },
        { role: "user", content: texte }
      ]);
      output.textContent = traduction;
      ajouterHistorique("Traduction", texte, traduction);
    } catch (erreur) {
      console.error(erreur);
      output.textContent = "Erreur lors de la traduction. Vérifie ta clé API.";
    }
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
// ===================================================================
// FONCTION COMMUNE : appel au modèle Hugging Face
// ===================================================================
async function appellerModeleHF(messages) {
  const cle = localStorage.getItem("hf_token");

  if (!cle) {
    throw new Error("Clé API Hugging Face manquante. Renseigne-la dans l'onglet Chat.");
  }

  const reponse = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cle}`
    },
    body: JSON.stringify({
      model: HF_MODEL,
      messages,
      max_tokens: 300
    })
  });

  if (!reponse.ok) {
    const erreur = await reponse.text();
    throw new Error(`Erreur API (${reponse.status}) : ${erreur}`);
  }

  const donnees = await reponse.json();
  return donnees.choices[0].message.content;
}

async function envoyerMessageChat(message) {
  historiqueConversation.push({ role: "user", content: message });

  try {
    const texteReponse = await appellerModeleHF(historiqueConversation);
    historiqueConversation.push({ role: "assistant", content: texteReponse });
    ajouterMessageChat(texteReponse, "ai");
    ajouterHistorique("Chat", message, texteReponse);
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
// PARTIE 6 : PRÉDICTION (fictive)
// ===================================================================
// ===================================================================
// PARTIE 6 : PRÉDICTION (générée par le modèle, à but illustratif/fictif)
// ===================================================================
function initPrediction() {
  const bouton = document.getElementById("pred-btn");
  const inputAge = document.getElementById("pred-age");
  const inputRevenu = document.getElementById("pred-revenu");
  const inputVille = document.getElementById("pred-ville");
  const output = document.getElementById("pred-output");

  bouton.addEventListener("click", async () => {
    const age = parseInt(inputAge.value, 10);
    const revenu = parseInt(inputRevenu.value, 10);
    const ville = inputVille.value.trim();

    if (isNaN(age) || isNaN(revenu) || ville === "") {
      output.textContent = "Veuillez remplir l'âge, le revenu et la ville.";
      return;
    }

    output.textContent = "Calcul de la prédiction...";

    const requete = `Âge: ${age}, Revenu: ${revenu} FCFA, Ville: ${ville}`;

    try {
      const resultat = await appellerModeleHF([
        { role: "system", content: "Tu génères un profil-client fictif et son score de confiance (en %) à partir de l'âge, du revenu et de la ville fournis. C'est un exercice illustratif, pas une vraie prédiction statistique. Réponds en 1 à 2 phrases, en français." },
        { role: "user", content: requete }
      ]);
      output.textContent = resultat;
      ajouterHistorique("Prédiction", requete, resultat);
    } catch (erreur) {
      console.error(erreur);
      output.textContent = "Erreur lors de la génération de la prédiction. Vérifie ta clé API.";
    }
  });
}
// ===================================================================
// PARTIE 7 : HISTORIQUE (localStorage)
// ===================================================================
const CLE_HISTORIQUE = "ai_workspace_historique";

function chargerHistorique() {
  const donnees = localStorage.getItem(CLE_HISTORIQUE);
  return donnees ? JSON.parse(donnees) : [];
}

function sauvegarderHistorique(historique) {
  localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(historique));
}

function ajouterHistorique(service, requete, resultat) {
  const historique = chargerHistorique();
  historique.unshift({
    id: Date.now(),
    service,
    requete,
    resultat,
    date: new Date().toLocaleString("fr-FR")
  });
  sauvegarderHistorique(historique);

  // Rafraîchit l'affichage si on est déjà sur l'onglet Historique
  if (document.getElementById("historique").classList.contains("active")) {
    afficherHistorique(document.getElementById("historique-search").value);
  }
}

function afficherHistorique(filtre = "") {
  const liste = document.getElementById("historique-list");
  const historique = chargerHistorique();
  const filtreMin = filtre.trim().toLowerCase();

  const resultatsFiltres = filtreMin === ""
    ? historique
    : historique.filter(h =>
        h.service.toLowerCase().includes(filtreMin) ||
        h.requete.toLowerCase().includes(filtreMin) ||
        h.resultat.toLowerCase().includes(filtreMin)
      );

  if (resultatsFiltres.length === 0) {
    liste.innerHTML = `<li>Aucun élément dans l'historique.</li>`;
    return;
  }

  liste.innerHTML = resultatsFiltres.map(h => `
    <li>
      <div>
        <strong>${h.service}</strong> — ${h.date}<br>
        <span>${h.requete.substring(0, 60)}${h.requete.length > 60 ? "..." : ""}</span>
      </div>
      <button class="delete-item" data-id="${h.id}">Supprimer</button>
    </li>
  `).join("");

  liste.querySelectorAll(".delete-item").forEach(bouton => {
    bouton.addEventListener("click", () => {
      supprimerEntreeHistorique(parseInt(bouton.dataset.id, 10));
    });
  });
}

function supprimerEntreeHistorique(id) {
  const historique = chargerHistorique().filter(h => h.id !== id);
  sauvegarderHistorique(historique);
  afficherHistorique(document.getElementById("historique-search").value);
}

function initHistorique() {
  const champRecherche = document.getElementById("historique-search");
  const boutonVider = document.getElementById("historique-clear");

  afficherHistorique();

  champRecherche.addEventListener("input", () => {
    afficherHistorique(champRecherche.value);
  });

  boutonVider.addEventListener("click", () => {
    if (confirm("Vider tout l'historique ?")) {
      sauvegarderHistorique([]);
      afficherHistorique();
    }
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
  initPrediction();
}

// ===================================================================
// DÉMARRAGE
// ===================================================================
  initNavigation();
  initDashboard();
  initHistorique();