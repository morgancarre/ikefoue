const articles = [
  { nom: "Vélo de route", etat: "NY",       prix: 450, stock: 3 },
  { nom: "Casque",        etat: "UT",    prix: 35,  stock: 10 },
  { nom: "Sacoche",       etat: "CA",       prix: 12,  stock: 5 },
  { nom: "Pompe à air",   etat: "NV",        prix: 25,  stock: 7 },
];

const remises = {
  100: 0.05,
  1000: 0.1,
  5000: 0.15,
  10000: 0.2,
  15000: 1.25,
};

const taxes = {
  ny: 0.055,
  ut: 0.051,
  ca: 0.083,
  tx: 0.066,
  nv: 0.0251,
};

const commande = [];

// --- NOUVEAU : SYSTÈME D'AUTHENTIFICATION ---
let isAdmin = false;
const MOT_DE_PASSE = "admin123";

document.getElementById("btn-login").addEventListener("click", () => {
  const pwd = document.getElementById("admin-password").value;
  if (pwd === MOT_DE_PASSE) {
    isAdmin = true;
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-section").style.display = "block";
    document.getElementById("admin-col").style.display = "table-cell"; // Affiche l'entête "Admin"
    renderCatalogue();
    alert("Connecté en tant qu'administrateur.");
  } else {
    alert("Mot de passe incorrect.");
  }
});

// --- NOUVEAU : AJOUTER UN PRODUIT ---
document.getElementById("btn-add-product").addEventListener("click", () => {
  if (!isAdmin) return; // Sécurité

  const nom = document.getElementById("new-nom").value;
  const etat = document.getElementById("new-etat").value;
  const prix = parseFloat(document.getElementById("new-prix").value);
  const stock = parseInt(document.getElementById("new-stock").value);

  if (!nom || !etat || isNaN(prix) || isNaN(stock)) {
    return alert("Veuillez remplir tous les champs du produit.");
  }

  articles.push({ nom, etat, prix, stock });
  renderCatalogue();
  
  // Vider les champs après ajout
  document.getElementById("new-nom").value = "";
  document.getElementById("new-prix").value = "";
  document.getElementById("new-stock").value = "";
});

// --- NOUVEAU : SUPPRIMER UN PRODUIT ---
function supprimerProduit(index) {
  if (!isAdmin) return; // Sécurité pour empêcher le déclenchement via la console
  if(confirm("Êtes-vous sûr de vouloir supprimer cet article du catalogue ?")) {
    articles.splice(index, 1);
    renderCatalogue();
  }
}

// --- RENDU CATALOGUE MODIFIÉ ---
function renderCatalogue() {
  const tbody = document.querySelector("#catalogue tbody");
  tbody.innerHTML = "";
  articles.forEach((a, i) => {
    const tr = document.createElement("tr");
    
    // Si l'utilisateur est admin, on génère le bouton de suppression
    const btnSupprimer = isAdmin 
      ? `<td><button onclick="supprimerProduit(${i})" style="color: red;">Supprimer</button></td>` 
      : ``;

    tr.innerHTML = `
      <td>${a.nom}</td>
      <td>${a.prix} €</td>
      <td>${a.stock}</td>
      <td><input type="number" min="1" max="${a.stock}" value="1" id="qty-${i}" style="width:60px"></td>
      <td><button onclick="ajouterCommande(${i})">Ajouter</button></td>
      ${btnSupprimer}
    `;
    tbody.appendChild(tr);
  });
}

function ajouterCommande(i) {
  const qty = parseInt(document.getElementById(`qty-${i}`).value);
  const a = articles[i];
  if (!qty || qty < 1 || qty > a.stock) return alert("Quantité invalide");

  const existant = commande.find(l => l.nom === a.nom && l.etat === a.etat);
  if (existant) {
    existant.qte += qty;
  } else {
    commande.push({ nom: a.nom, etat: a.etat, prix: a.prix, qte: qty });
  }
  renderCommande();
}

function supprimerLigne(index) {
  commande.splice(index, 1);
  renderCommande();
}

function renderCommande() {
  const tbody = document.querySelector("#commande tbody");
  tbody.innerHTML = "";
  
  const stateVal = document.getElementById("state-select").value.toLowerCase();
  const currentTax = taxes[stateVal] || 0;

  commande.forEach((l, i) => {
    let ttc = l.prix * l.qte * (1 + currentTax); // Corrigé : 'let' + gestion taxe vide
    
    if (remises[l.qte]) {
      ttc *= (1 - remises[l.qte]);
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.nom}</td>
      <td>${l.etat}</td>
      <td>${l.qte}</td>
      <td>${l.prix} €</td>
      <td>${(l.prix * l.qte).toFixed(2)} €</td>
      <td>${ttc.toFixed(2)} €</td>
      <td><button onclick="supprimerLigne(${i})">Retirer</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("total-section").style.display = commande.length ? "block" : "none";
}

document.getElementById("btn-valider").addEventListener("click", () => {
  if (!commande.length) return;
  alert("Commande validée !\n" + commande.map(l => `${l.nom} x${l.qte}`).join("\n"));
});

// Le select déclenche le recalcule si on change l'état en plein milieu
document.getElementById("state-select").addEventListener("change", renderCommande);

function sortByPrice() {
  articles.sort((a, b) => a.prix - b.prix);
  renderCatalogue();
}

function sortByName() {
  articles.sort((a, b) => a.nom.localeCompare(b.nom));
  renderCatalogue();
}

function sortByQuantity() {
    articles.sort((a, b) => a.stock - b.stock);
    renderCatalogue();
}

renderCatalogue();

document.getElementById("sort-price").addEventListener("click", sortByPrice);
document.getElementById("sort-name").addEventListener("click", sortByName);
document.getElementById("sort-quantity").addEventListener("click", sortByQuantity);