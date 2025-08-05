const etapes = [
    {
        nom: "Entrée du campus",
        coords: { lat: -20.9026, lng: 55.4826 },
        question: "Quel est le nom de l'avenue principale devant le campus ?",
        reponse: "rené cassin"
    },
    {
        nom: "Bibliothèque Universitaire",
        coords: { lat: -20.9019, lng: 55.4850 },
        question: "Combien de lettres dans le mot 'informatique' ?",
        reponse: "12"
    },
    {
        nom: "Amphi A",
        coords: { lat: -20.9022, lng: 55.4841 },
        question: "Déchiffre ce code César (décalage -1) : Cpezsp",
        reponse: "beyoro"
    }
];

let currentStep = 0;
let map = L.map('map').setView([-20.9029, 55.4833], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

etapes.forEach(etape => {
    L.marker([etape.coords.lat, etape.coords.lng]).addTo(map)
      .bindPopup(etape.nom);
});

function checkProximity(userLat, userLng, cibleLat, cibleLng, tolerance = 0.0003) {
    return Math.abs(userLat - cibleLat) < tolerance && Math.abs(userLng - cibleLng) < tolerance;
}

function valider() {
    const userInput = document.getElementById("reponse").value.toLowerCase().trim();
    const attendu = etapes[currentStep].reponse;
    const feedback = document.getElementById("feedback");
    if (userInput === attendu) {
        feedback.textContent = "✅ Bonne réponse !";
        currentStep++;
        if (currentStep < etapes.length) {
            setTimeout(() => {
                afficherEnigme();
            }, 1000);
        } else {
            document.getElementById("enigme").style.display = "none";
            document.getElementById("message").textContent = "🎉 Bravo ! Tu as terminé le jeu de piste.";
        }
    } else {
        feedback.textContent = "❌ Mauvaise réponse, essaie encore.";
    }
}

function afficherEnigme() {
    const etape = etapes[currentStep];
    document.getElementById("message").textContent = `📍 Tu es proche de : ${etape.nom}`;
    document.getElementById("question").textContent = etape.question;
    document.getElementById("enigme").style.display = "block";
    document.getElementById("feedback").textContent = "";
    document.getElementById("reponse").value = "";
}

navigator.geolocation.watchPosition(position => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const userMarker = L.marker([userLat, userLng], {
        title: "Tu es ici",
        icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        })
    }).addTo(map).bindPopup("Toi").openPopup();


map.setView([userLat, userLng], 18);

    const etape = etapes[currentStep];
    if (checkProximity(userLat, userLng, etape.coords.lat, etape.coords.lng)) {
        afficherEnigme();
    } else {
        document.getElementById("message").textContent = "🚶 Approche-toi du bon endroit pour débloquer l'énigme.";
    }
}, err => {
    document.getElementById("message").textContent = "Erreur : géolocalisation refusée.";
});
