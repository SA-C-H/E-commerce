/**
 * Contrôleur pour le Chatbot Assistant IA de TechNova Store
 * Gère le cadrage contextuel strict (Mode Client vs Mode Back-Office)
 * Utilise l'API gratuite Google Gemini (ou fallback propre si pas de clé)
 */

export const handleChat = async (req, res, next) => {
  try {
    const { message, context = 'client', history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le message est requis.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Si aucune clé n'est configurée, on informe le frontend pour qu'il bascule
    // instantanément et de façon transparente sur la base de connaissances FAQ locale.
    if (!apiKey || apiKey === 'votre_cle_gemini_ici' || apiKey.length < 10) {
      return res.json({
        success: true,
        ai: false,
        message: null,
        note: 'Clé GEMINI_API_KEY non configurée. Bascule sur la base de connaissances locale.',
      });
    }

    // =========================================================================
    // PROMPT SYSTÈME DE CADRAGE STRICT (CONTEXT FRAMING)
    // =========================================================================
    const isAdmin = context === 'admin';

    const systemInstruction = `Tu es l'assistant virtuel intelligent officiel de "TechNova Store", une boutique e-commerce de référence au Maroc spécialisée dans les smartphones et laptops haut de gamme neufs.

${
  isAdmin
    ? `CONTEXTE ACTUEL : BACK-OFFICE ADMINISTRATEUR (/admin).
Tu agis en tant que "TechNova Copilot Admin". Ton rôle est d'épauler l'administrateur dans la gestion quotidienne :
• Gestion des commandes : changement de statut (En attente, Payée, Expédiée, Livrée, Annulée) et notifications clients.
• Gestion des stocks : seuils d'alerte (< 5 unités = stock critique, 0 = rupture automatique sans casser l'affichage).
• Création de produits : nom, marque, prix en Dirhams (DH), catégorie, photo HD, description technique.
• Gestion des utilisateurs : permissions et rôles (client, admin, super_admin).
• Indicateurs clés (KPI) : chiffre d'affaires, panier moyen, volume des commandes.
• Sécurité : authentification JWT chiffrée, protection des routes sensibles.`
    : `CONTEXTE ACTUEL : BOUTIQUE CLIENT PUBLIQUE.
Tu agis en tant que "TechNova Assistant Client". Ton rôle est d'aider les visiteurs et acheteurs :
• Produits : Smartphones (iPhone 15/16, Samsung Galaxy S24, Xiaomi) et Laptops (MacBook Pro/Air M3, Dell XPS, Lenovo ThinkPad, Asus ROG). Tous 100% neufs, scellés d'usine avec garantie constructeur 12 à 24 mois.
• Prix : Tous affichés en Dirhams marocains (DH).
• Livraison : Partout au Maroc. Express en 24h-48h (Casablanca, Rabat, Marrakech, etc.), 48h-72h ailleurs. Gratuite dès 500 DH d'achat (sinon 35 DH).
• Paiements : Paiement à la livraison en espèces (Cash on Delivery), carte bancaire marocaine/internationale sécurisée, virement.
• Suivi de commande : Accessible depuis l'espace client "Mes Commandes".
• Retours & SAV : 7 jours ouvrables pour échange ou retour, facture avec TVA servant de garantie.`
}

RÈGLES IMPÉRATIVES DE CADRAGE :
1. PÉRIMÈTRE STRICT : Tu réponds UNIQUEMENT aux questions relatives à TechNova Store, ses produits, ses services ou son fonctionnement.
2. RECADRAGE POLI : Si l'utilisateur pose une question totalement hors sujet (recette de cuisine, politique, devoirs scolaires, blague sans rapport, sport général, autres marques sans lien), refuse avec courtoisie : "Je suis l'assistant dédié à TechNova Store. Je ne peux vous renseigner que sur notre boutique, nos produits et nos services."
3. FORMAT DES RÉPONSES : Concis (3 à 5 phrases maximum), chaleureux, direct, avec des listes à puces et des émojis pertinents.
4. PRIX & MONNAIE : Exprime toujours les prix en Dirhams marocains (DH). Ne promets jamais de prix qui n'existent pas.`;

    // Formatage des messages précédents (historique court pour le contexte)
    const contents = [];

    // Ajout des derniers échanges de la conversation (max 4 pour rester économique et rapide)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-4);
      for (const item of recentHistory) {
        contents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    }

    // Ajout du message courant
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.3, // Température basse pour rester factuel et précis
        maxOutputTokens: 600,
      },
    };

    // Liste des modèles Gemini ordonnés par vitesse et disponibilité confirmées
    // gemini-3.5-flash-lite : 711ms ✅ PRIORITAIRE
    // gemini-3-flash-preview : 1258ms ✅
    // gemini-3.5-flash       : 2541ms ✅
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-3.5-flash'];
    let replyText = null;

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) break; // Succès !
        } else {
          const errBody = await response.text();
          console.warn(`[Chat IA] Modèle ${model} non dispo (${response.status}), essai suivant...`);
        }
      } catch (err) {
        console.warn(`[Chat IA] Erreur appel ${model}:`, err.message);
      }
    }

    if (!replyText) {
      return res.json({
        success: true,
        ai: false,
        message: null,
      });
    }

    return res.json({
      success: true,
      ai: true,
      message: replyText.trim(),
    });
  } catch (error) {
    console.error('[Chat IA] Erreur interne chat controller:', error);
    // En cas d'erreur réseau, renvoyer ai: false pour que le frontend bascule sans accroc
    return res.json({
      success: true,
      ai: false,
      message: null,
      error: error.message,
    });
  }
};
