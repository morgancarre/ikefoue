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

const commande = [];

function renderCatalogue() {
  const tbody = document.querySelector("#catalogue tbody");
  tbody.innerHTML = "";
  articles.forEach((a, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.nom}</td>
      <td>${a.prix} €</td>
      <td>${a.stock}</td>
      <td><input type="number" min="1" max="${a.stock}" value="1" id="qty-${i}" style="width:60px"></td>
      <td><button onclick="ajouterCommande(${i})">Ajouter</button></td>
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
  commande.forEach((l, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.nom}</td>
      <td>${l.etat}</td>
      <td>${l.qte}</td>
      <td>${l.prix} €</td>
      <td>${(l.prix * l.qte).toFixed(2)} €</td>
      <td><button onclick="supprimerLigne(${i})">Retirer</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("total-section").style.display = commande.length ? "block" : "none";
}

document.getElementById("btn-valider").addEventListener("click", () => {
  if (!commande.length) return;
  alert("Commande validé !\n" + commande.map(l => `${l.nom} x${l.qte}`).join("\n"));
});

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
