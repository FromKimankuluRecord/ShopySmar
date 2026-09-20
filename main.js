document.addEventListener("DOMContentLoaded", function() {

    
      // ================================================================= */
    // CONFIGURATION API (COD AFFILIATE MAROC)                            */
    // ================================================================= */
    const API_TOKEN = "COD_i674J30l6lagCPTLReixKEOoFR1lSioz";
    const PRODUCT_ID = "ID_DU_PRODUIT"; // 👈 Remplacez par l'ID de votre vêtement depuis le catalogue
    const API_ENDPOINT = "https://codaffiliate.ma/api/v1/leads"; // ✔️ CORRECTION : URL absolue et complète


    // === 1. LOGIQUE DU BOUTON D'AFFILIATION ET DES ANIMATIONS ===
    const ctaButton = document.getElementById("main-cta");

    if (ctaButton) {
        // Effet de pulsation discret sur le bouton toutes les 4 secondes
        setInterval(() => {
            ctaButton.style.transform = "scale(1.03)";
            setTimeout(() => {
                ctaButton.style.transform = "scale(1)";
            }, 300);
        }, 4000);

        // Tracking du clic de défilement vers le formulaire
        ctaButton.addEventListener("click", function(event) {
            console.log("L'utilisateur à cliqué pour commander (InitiateCheckout)");
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

            // Bloque le bouton pendant l'envoi pour éviter les doubles commandes au Maroc
            submitBtn.innerText = "Traitement en cours...";
            submitBtn.disabled = true;

            // Préparation des données décoltées sur votre formulaire HTML
            const payload = {
                api_token: API_TOKEN,
                product_id: PRODUCT_ID,
                name: document.getElementById('fullName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                city: document.getElementById('city').value.trim(),
                size: document.getElementById('size').value
            };

            // Envoi HTTP POST vers les serveurs de Cod Affiliate Maroc
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
                    // TRACKING : Déclenche l'événement d'achat Facebook/TikTok Pixel en cas de succès
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
                    responseMessage.innerHTML = "⚠️" + (data.message || "Erreur d'enregistrement. Veuillez vérifier vos données.");
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
                // Remet le bouton à son état normal après la réponse
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

    // Sécurité au cas où l'ID n'est pas encore mis dans le HTML
    if (imgTrigger && lightbox && imgZoomed && closeBtn) {

        // Ouvrir au clic sur l'image
        imgTrigger.addEventListener("click", function() {
            lightbox.style.display = "flex";
            imgZoomed.src = this.src;
        });

        // Fermer au clic sur la croix (X)
        closeBtn.addEventListener("click", function() {
            lightbox.style.display = "none";
        });

        // Fermer au clic en dehors de l'image
        lightbox.addEventListener("click", function(event) {
            if (event.target === lightbox) {
                lightbox.style.display = "none";
            }
        });
    }

});

