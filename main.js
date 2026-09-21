document.addEventListener("DOMContentLoaded", function() {

    // ================================================================= */
    // CONFIGURATION NETLIFY SERVERLESS (PLUS DE CLÉ API ICI 🔒)          */
    // ================================================================= */
    const PRODUCT_ID = "12345"; // 👈 Votre numéro de produit fictif pour le test
    const API_ENDPOINT = "/.netlify/functions/submit-order"; // ✅ Chemin local privé Netlify

    // === 1. LOGIQUE DU BOUTON D'AFFILIATION ET DES ANIMATIONS ===
    const ctaButton = document.getElementById("main-cta");

    if (ctaButton) {
        setInterval(() => {
            ctaButton.style.transform = "scale(1.03)";
            setTimeout(() => {
                ctaButton.style.transform = "scale(1)";
            }, 300);
        }, 4000);

        ctaButton.addEventListener("click", function(event) {
            console.log("L'utilisateur a cliqué pour commander (InitiateCheckout)");
            if (typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout');
            }
        });
    }

    // === 2. INTERCEPTION ET ENVOI DU FORMULAIRE VIA API COD ===
    const codForm = document.getElementById('codForm');

    if (codForm) {
        codForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Empêche le rechargement de la page

            const submitBtn = document.getElementById('submitBtn');
            const responseMessage = document.getElementById('responseMessage');

            submitBtn.innerText = "Traitement en cours...";
            submitBtn.disabled = true;

            // ✔️ CORRECTION : On envoie uniquement les données client, SANS appeler "API_TOKEN"
            const payload = {
                product_id: PRODUCT_ID,
                name: document.getElementById('fullName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                city: document.getElementById('city').value.trim(),
                size: document.getElementById('size').value
            };

            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                responseMessage.style.display = "block";

                if (data.success || data.status === "success" || data.id) {
                    if (typeof fbq === 'function') {
                        fbq('track', 'Purchase', {value: 349, currency: 'MAD'});
                    }

                    responseMessage.style.backgroundColor = "#ebf8f2";
                    responseMessage.style.color = "#00a86b";
                    responseMessage.innerHTML = "🎉 Commande validée avec succès ! Notre call center va vous appeler sur votre téléphone d'ici quelques minutes pour confirmer la livraison.";
                    codForm.reset(); // Vide le formulaire
                } else {
                    responseMessage.style.backgroundColor = "#fdf2f2";
                    responseMessage.style.color = "#e53e3e";
                    responseMessage.innerHTML = "⚠️ " + (data.message || "Erreur d'enregistrement. Veuillez vérifier vos données.");
                }
            })
            .catch(error => {
                console.error("Erreur API:", error);
                responseMessage.style.display = "block";
                responseMessage.style.backgroundColor = "#fdf2f2";
                responseMessage.style.color = "#e53e3e";
                responseMessage.innerHTML = "⚠️ Une erreur technique est survenue. Rassurez-vous, votre commande n'est pas perdue. Veuillez réessayer.";
            })
            .finally(() => {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Confirmer ma commande (349 DH)';
                submitBtn.disabled = false;
            });
        });
    }

    // === 3. LOGIQUE DE LA LIGHTBOX (ZOOM IMAGE) ===
    const lightbox = document.getElementById("custom-lightbox");
    const imgTrigger = document.getElementById("trigger-lightbox");
    const imgZoomed = document.getElementById("img-zoomed");
    const closeBtn = document.querySelector(".close-lightbox");

    if (imgTrigger && lightbox && imgZoomed && closeBtn) {
        imgTrigger.addEventListener("click", function() {
            lightbox.style.display = "flex";
            imgZoomed.src = this.src;
        });

        closeBtn.addEventListener("click", function() {
            lightbox.style.display = "none";
        });

        lightbox.addEventListener("click", function(event) {
            if (event.target === lightbox) {
                lightbox.style.display = "none";
            }
        });
    }

});
