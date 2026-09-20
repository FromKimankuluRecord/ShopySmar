import { Response } from "@netlify/functions";

export const handler = async (event, context) => {
    // Autoriser uniquement les requêtes HTTP POST
    if (event.httpMethod !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        // Récupération des données du formulaire HTML envoyées par main.js
        const customerData = JSON.parse(event.body);

        // Récupération sécurisée du Token masqué dans le tableau de bord Netlify
        const API_TOKEN = process.env.COD_API_TOKEN; 
        const API_ENDPOINT = "https://codaffiliate.ma";

        // Injection invisible de la clé d'affiliation
        const payload = {
            api_token: API_TOKEN,
            product_id: customerData.product_id,
            name: customerData.name,
            phone: customerData.phone,
            city: customerData.city,
            size: customerData.size
        };

        // Envoi sécurisé de serveur à serveur vers Cod Affiliate Maroc
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Retourne la réponse de l'API à votre page web
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        return new Response(JSON.stringify({ success: false, message: "Erreur interne" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
