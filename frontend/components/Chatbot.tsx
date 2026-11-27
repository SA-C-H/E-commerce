'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  X,
  Send,
  Bot,
  Shield,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  link?: { label: string; url: string };
  isAi?: boolean;
}

// ==============================================================================
// BASE DE CONNAISSANCES CLIENT (BOUTIQUE PUBLIQUE)
// ==============================================================================
const CLIENT_FAQ = [
  {
    triggers: ['livraison', 'delai', 'frais', 'expedition', 'livrer', 'reception', 'combien de temps'],
    reponse: `🚚 **Livraison & Délais TechNova :**\n\n• **Grandes villes (Casablanca, Rabat, Marrakech, Tanger) :** Livraison express en **24h à 48h**.\n• **Autres villes du Maroc :** 48h à 72h ouvrables.\n• **Frais :** Livraison standard à 35 DH, et **GRATUITE** pour toute commande supérieure à 500 DH.\n• Chaque colis est scellé et assuré jusqu'à sa remise en main propre.`,
    link: { label: 'Voir le panier', url: '/cart' },
  },
  {
    triggers: ['paiement', 'payer', 'espece', 'livraison espece', 'carte', 'cb', 'virement', 'cod'],
    reponse: `💳 **Moyens de paiement acceptés :**\n\n1. **Paiement à la livraison (Cash on Delivery) :** Payez en espèces directement au livreur après vérification du colis.\n2. **Carte bancaire sécurisée :** Cartes marocaines et internationales (Visa, Mastercard).\n3. **Virement bancaire :** Pour les professionnels et commandes importantes (RIB fourni à la validation).`,
  },
  {
    triggers: ['suivi', 'suivre', 'commande', 'ou est ma commande', 'etat commande', 'statut'],
    reponse: `📦 **Suivre l'état de votre commande :**\n\n• Connectez-vous à votre compte et cliquez sur **« Mes Commandes »** dans la barre de navigation.\n• Vous pourrez voir l'état en direct : *En attente*, *Confirmée*, *Expédiée* ou *Livrée*.\n• Vous recevez également un email et un SMS à chaque étape de l'acheminement.`,
    link: { label: 'Accéder à mes commandes', url: '/orders' },
  },
  {
    triggers: ['garantie', 'authentique', 'original', 'neuf', 'blister', 'sav'],
    reponse: `🛡️ **Garantie & Authenticité 100% Certifiée :**\n\n• Tous nos smartphones et ordinateurs portables sont **100% neufs, originaux et scellés d'usine**.\n• **Garantie constructeur officielle de 12 à 24 mois** incluse.\n• Facture avec TVA délivrée pour chaque achat servant de certificat de garantie SAV officiel.`,
  },
  {
    triggers: ['retour', 'remboursement', 'retractation', 'echanger', 'echange', 'defaut'],
    reponse: `🔄 **Politique de retours et remboursements :**\n\n• Vous disposez de **7 jours ouvrables** après réception pour demander un retour ou un échange.\n• Le produit doit être retourné dans son emballage d'origine, complet et non endommagé.\n• En cas de panne au déballage, un échange à neuf immédiat est pris en charge sans frais.`,
  },
  {
    triggers: ['contact', 'telephone', 'whatsapp', 'email', 'joindre', 'service client', 'support', 'aide'],
    reponse: `📞 **Contacter le service client TechNova :**\n\n• **Email :** support@technova.ma\n• **Téléphone / WhatsApp :** +212 5 22 00 00 00\n• **Horaires d'assistance :** Du Lundi au Samedi de 09h00 à 19h00.\n• Nos conseillers vous répondent généralement en moins de 15 minutes !`,
  },
  {
    triggers: ['produit', 'smartphone', 'laptop', 'ordinateur', 'iphone', 'samsung', 'macbook', 'catalogue', 'marque'],
    reponse: `📱 **Notre Catalogue TechNova :**\n\n• **Smartphones :** Derniers iPhone (15, 16 Pro), Samsung Galaxy (S24, Z Fold/Flip), Xiaomi, etc.\n• **Laptops & PC :** MacBook Pro/Air (M3), Dell XPS, Lenovo ThinkPad, Asus ROG pour gamers.\n• **Accessoires :** Écouteurs sans fil, chargeurs rapides officiels, coques de protection.`,
    link: { label: 'Explorer le catalogue', url: '/products' },
  },
  {
    triggers: ['promo', 'reduction', 'code', 'remise', 'solde', 'offre'],
    reponse: `🎉 **Offres spéciales du moment :**\n\n• Utilisez le code promo **TECHNOVA10** pour bénéficier de **-10%** sur votre première commande !\n• Bénéficiez également de la **livraison gratuite** dès 500 DH d'achat.`,
  },
];

// ==============================================================================
// BASE DE CONNAISSANCES ADMIN (BACK-OFFICE)
// ==============================================================================
const ADMIN_FAQ = [
  {
    triggers: ['statut', 'valider commande', 'expedier', 'livrer', 'annuler', 'modifier statut'],
    reponse: `📋 **Gestion des statuts de commande :**\n\n1. Dans l'onglet **« Commandes »** du Back-Office, cliquez sur la commande concernée.\n2. Vous pouvez changer son statut en un clic :\n   • **En attente** ➔ Commande reçue, en attente de traitement.\n   • **Payée** ➔ Paiement validé.\n   • **Expédiée** ➔ Colis confié au transporteur.\n   • **Livrée** ➔ Remise au client confirmée.\n   • **Annulée** ➔ Commande abandonnée.\n3. Un email de notification automatique est envoyé au client lors du passage en *Expédiée*.`,
    link: { label: 'Gérer les commandes', url: '/admin#orders' },
  },
  {
    triggers: ['stock', 'quantite', 'mise a jour stock', 'rupture', 'inventaire'],
    reponse: `📦 **Gestion des stocks produits :**\n\n• Dans l'onglet **« Produits »**, repérez le produit et cliquez sur l'icône de modification (crayon) ou sur le champ de stock rapide.\n• Si le stock tombe en dessous de **5 unités**, un badge d'alerte orange apparaît automatiquement.\n• À **0 unité**, le produit est automatiquement affiché comme *« Rupture de stock »* côté boutique sans bloquer la navigation.`,
    link: { label: 'Tableau des stocks', url: '/admin#products' },
  },
  {
    triggers: ['ajouter produit', 'nouveau produit', 'creer produit', 'fiche produit', 'prix'],
    reponse: `➕ **Comment ajouter un nouveau produit :**\n\n1. Allez dans l'onglet **« Produits »** et cliquez sur **« + Ajouter un produit »**.\n2. Renseignez les champs obligatoires :\n   • Nom et marque (ex: Apple iPhone 16 Pro)\n   • Catégorie (Smartphones, Laptops, etc.)\n   • Prix unitaire (DH) et Stock initial\n   • URL de l'image (haute résolution recommandée)\n   • Description technique complète\n3. Cliquez sur **« Enregistrer »** : le produit est immédiatement visible sur le site public !`,
    link: { label: 'Ajouter un produit', url: '/admin#products' },
  },
  {
    triggers: ['role', 'roles', 'utilisateur', 'admin', 'super admin', 'client', 'permission', 'droit'],
    reponse: `👥 **Gestion des utilisateurs et rôles :**\n\n• **Client :** Accès au site public, panier, passage de commandes et suivi.\n• **Admin :** Accès au Back-Office pour gérer les produits, les stocks et les commandes.\n• **Super Admin :** Tous les droits Admin + gestion des comptes utilisateurs, modification des rôles et suppression de données sensibles.\n• Pour changer un rôle : allez dans l'onglet **« Utilisateurs »**, sélectionnez le compte et modifiez son rôle dans le menu déroulant.`,
    link: { label: 'Gérer les utilisateurs', url: '/admin#users' },
  },
  {
    triggers: ['kpi', 'chiffre d\'affaires', 'statistiques', 'ventes', 'tableau de bord', 'dashboard'],
    reponse: `📊 **Comprendre les KPI du tableau de bord :**\n\n• **Chiffre d'Affaires total :** Somme des montants de toutes les commandes confirmées et livrées.\n• **Commandes du jour / mois :** Volume total de commandes passées.\n• **Panier moyen :** Montant moyen dépensé par client par commande.\n• **Dernières commandes :** Flux en temps réel des transactions avec accès direct au détail.`,
    link: { label: 'Consulter les KPI', url: '/admin' },
  },
  {
    triggers: ['securite', 'jwt', 'deconnexion', 'token', 'expiration', 'protection'],
    reponse: `🔒 **Sécurité du Back-Office :**\n\n• Les accès sont protégés par des **jetons JWT chiffrés** avec expiration automatique.\n• Les routes d'administration « /admin » vérifient systématiquement les privilèges d'administrateur côté backend.\n• Toute tentative d'accès non autorisée renvoie un code HTTP **401 Unauthorized** ou **403 Forbidden**.`,
  },
];

export default function Chatbot() {
  const pathname = usePathname();
  const isAdminArea = pathname?.startsWith('/admin');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions par défaut selon le contexte
  const suggestionsClient = [
    '🚚 Délais de livraison',
    '💳 Moyens de paiement',
    '📦 Suivi de commande',
    '🛡️ Garantie & SAV',
    '🔄 Retours & Échanges',
  ];

  const suggestionsAdmin = [
    '📋 Statuts des commandes',
    '📦 Mettre à jour un stock',
    '➕ Ajouter un produit',
    '👥 Rôles et permissions',
    '📊 Explication des KPI',
  ];

  // Message d'accueil initial contextuel
  useEffect(() => {
    const welcomeText = isAdminArea
      ? `🛡️ **Bonjour Administrateur !**\nJe suis votre **Assistant Back-Office TechNova**.\n\nJe peux vous aider à gérer les commandes, actualiser les stocks, créer des fiches produits ou configurer les rôles.`
      : `👋 **Bonjour et bienvenue sur TechNova !**\nJe suis votre assistant virtuel.\n\nUne question sur un smartphone, un ordinateur, les délais de livraison ou les paiements ? Je suis là pour vous répondre !`;

    const initialSuggestions = isAdminArea ? suggestionsAdmin : suggestionsClient;

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: initialSuggestions,
      },
    ]);
  }, [isAdminArea]);

  // Défilement automatique vers le bas
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
    }
  }, [messages, isOpen, isTyping]);

  // Recherche de réponse dans la base de connaissances
  const trouverReponse = (question: string): { reponse: string; link?: { label: string; url: string } } => {
    const qNorm = question.toLowerCase().trim();
    const faq = isAdminArea ? ADMIN_FAQ : CLIENT_FAQ;

    // 1. Recherche par mot-clé correspondant
    for (const item of faq) {
      if (item.triggers.some((trigger) => qNorm.includes(trigger))) {
        return { reponse: item.reponse, link: item.link };
      }
    }

    // 2. Recherche croisée (si une question client est posée dans l'admin ou inversement)
    const faqAlternative = isAdminArea ? CLIENT_FAQ : ADMIN_FAQ;
    for (const item of faqAlternative) {
      if (item.triggers.some((trigger) => qNorm.includes(trigger))) {
        return { reponse: item.reponse, link: item.link };
      }
    }

    // 3. Réponse par défaut bienveillante
    if (isAdminArea) {
      return {
        reponse: `🤖 Je ne suis pas certain d'avoir compris votre demande back-office.\n\nVous pouvez me questionner sur :\n• **Les commandes** (*comment valider une commande, expédition*)\n• **Les produits & stocks** (*ajouter un produit, alerte rupture*)\n• **Les utilisateurs** (*rôles client, admin, super-admin*)\n• **Les KPI** (*calcul du chiffre d'affaires, panier moyen*)`,
      };
    }

    return {
      reponse: `🤖 Je n'ai pas la réponse exacte à cette question précise, mais voici ce que je peux faire pour vous :\n\n• Vous renseigner sur **nos livraisons** et nos **moyens de paiement**.\n• Vous aider à **suivre votre commande**.\n• Ou vous mettre en relation avec notre support humain à **support@technova.ma** ou via WhatsApp au **+212 5 22 00 00 00** (9h-19h).`,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    let reponseObtenue: { reponse: string; link?: { label: string; url: string }; isAi?: boolean } | null = null;

    // 1. Tentative d'appel à l'API IA via le backend TechNova (/api/chat)
    try {
      const baseUrl = getApiBaseUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s max (gemini-3.5-flash-lite répond en ~700ms)

      const res = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          context: isAdminArea ? 'admin' : 'client',
          history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.ai && data.message) {
          reponseObtenue = {
            reponse: data.message,
            isAi: true,
          };
        }
      }
    } catch {
      // Si le backend est éteint ou timeout, bascule silencieuse sur la FAQ locale
    }

    // 2. Fallback automatique sur la FAQ locale si pas d'IA ou clé manquante
    if (!reponseObtenue) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const match = trouverReponse(messageText);
      reponseObtenue = {
        reponse: match.reponse,
        link: match.link,
        isAi: false,
      };
    }

    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: reponseObtenue.reponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      link: reponseObtenue.link,
      isAi: reponseObtenue.isAi,
      suggestions: isAdminArea ? suggestionsAdmin.slice(0, 3) : suggestionsClient.slice(0, 3),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);
    if (!isOpen) setHasUnread(true);
  };

  const handleReset = () => {
    const initialSuggestions = isAdminArea ? suggestionsAdmin : suggestionsClient;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: isAdminArea
          ? `🛡️ Conversation réinitialisée. Comment puis-je vous aider dans l'administration ?`
          : `👋 Conversation réinitialisée. Que souhaitez-vous savoir sur TechNova ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: initialSuggestions,
      },
    ]);
  };

  return (
    <>
      {/* ==================================================================== */}
      {/* BOUTON FLOTTANT PREMIUM — DESIGN IA MODERNE */}
      {/* ==================================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 group/launcher">

        {/* Étiquette contextuelle (apparaît au survol) */}
        {!isOpen && (
          <div
            className={`opacity-0 group-hover/launcher:opacity-100 translate-y-2 group-hover/launcher:translate-y-0 pointer-events-none transition-all duration-200 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap ${
              isAdminArea
                ? 'bg-gradient-to-r from-indigo-700 to-violet-700'
                : 'bg-gradient-to-r from-slate-800 to-slate-900'
            }`}
          >
            {isAdminArea ? '🛡️ Copilot Admin' : '✨ Assistant TechNova'}
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
          }}
          aria-label="Ouvrir le chat d'assistance"
          className={`relative w-[62px] h-[62px] rounded-[20px] shadow-2xl transition-all duration-300 ease-out flex items-center justify-center ${
            isAdminArea
              ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-indigo-500/50 hover:shadow-indigo-500/70 hover:shadow-2xl'
              : 'bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 shadow-orange-500/50 hover:shadow-orange-500/70 hover:shadow-2xl'
          } ${isOpen ? 'scale-90 rotate-3' : 'hover:scale-110 hover:-rotate-2'}`}
        >
          {/* Reflet brillant (effet verre) */}
          <div className="absolute top-0 left-0 right-0 h-[48%] bg-white/20 rounded-t-[20px] pointer-events-none" />

          {isOpen ? (
            /* ---- Fermeture ---- */
            <X className="w-6 h-6 text-white drop-shadow" />
          ) : isAdminArea ? (
            /* ---- Mode Admin : bouclier + éclair ---- */
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 2.5L4.5 7.5V14.5C4.5 20.75 9.1 26.6 15 28C20.9 26.6 25.5 20.75 25.5 14.5V7.5L15 2.5Z"
                fill="white"
                fillOpacity="0.92"
              />
              <path
                d="M16.5 10H13.2L10.5 16H13.5L11 21.5L19.5 13.5H16L18.5 10H16.5Z"
                fill="#6366f1"
              />
            </svg>
          ) : (
            /* ---- Mode Client : bulle de chat + 3 points ---- */
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 7C5 5.34 6.34 4 8 4H22C23.66 4 25 5.34 25 7V18C25 19.66 23.66 21 22 21H9.8L5 26V7Z"
                fill="white"
                fillOpacity="0.95"
              />
              <circle cx="10.5" cy="12.5" r="1.9" fill="#ea580c" />
              <circle cx="15" cy="12.5" r="1.9" fill="#ea580c" />
              <circle cx="19.5" cy="12.5" r="1.9" fill="#ea580c" />
            </svg>
          )}

          {/* Point vert "En ligne" */}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white/80"></span>
          </span>

          {/* Badge non-lu */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[9px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-bounce border-2 border-white">
              1
            </span>
          )}
        </button>
      </div>

      {/* ==================================================================== */}
      {/* FENÊTRE DE DISCUSSION MODERNE */}
      {/* ==================================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Fenêtre de chat"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[560px] max-h-[82vh] bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* EN-TÊTE DU CHATBOT */}
          <div
            className={`p-4 text-white flex items-center justify-between shadow-sm ${
              isAdminArea
                ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-800/40'
                : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-inner ${
                  isAdminArea ? 'bg-indigo-600/60 border border-indigo-400/40' : 'bg-amber-500 text-slate-950'
                }`}
              >
                {isAdminArea ? <Shield className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide">
                    {isAdminArea ? 'TechNova Copilot Admin' : 'TechNova Assistant'}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isAdminArea
                        ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    }`}
                  >
                    {isAdminArea ? 'Back-Office' : 'En ligne'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {isAdminArea ? 'Assistance opérationnelle et gestion' : 'Réponses instantanées 24/7'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Réinitialiser la discussion"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Fermer"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BANDEAU CONTEXTUEL INFORMATIF */}
          <div
            className={`px-3.5 py-1.5 text-[11px] font-medium flex items-center justify-between bg-[var(--bg-page)] border-b border-[var(--border)] ${
              isAdminArea ? 'text-indigo-500' : 'text-amber-500'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {isAdminArea
                ? 'Mode Administration actif (Commandes, Stocks, Rôles)'
                : 'Mode Boutique client actif (Livraison, SAV, Produits)'}
            </span>
          </div>

          {/* CORPS DE DISCUSSION (MESSAGES) */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm" style={{ backgroundColor: '#0F172A' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm text-[13px] ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs'
                      : 'rounded-bl-xs'
                  }`}
                  style={msg.sender !== 'user' ? {
                    backgroundColor: '#1E293B',
                    color: '#F1F5F9',
                    border: '1px solid #334155',
                  } : {}}
                >
                  <div className="whitespace-pre-line" dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }} />

                  {/* Lien contextuel direct si applicable */}
                  {msg.link && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--border)]">
                      <a
                        href={msg.link.url}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-500 hover:text-amber-400 transition"
                      >
                        <span>{msg.link.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-1 mt-1">
                  <span className="text-[10px] text-[var(--text-muted)]">{msg.timestamp}</span>
                  {msg.isAi && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-500 bg-amber-500/15 border border-amber-500/30 rounded-full px-1.5 py-0.2">
                      ✦ IA Cadrée
                    </span>
                  )}
                </div>

                {/* Suggestions de questions rapides en 1 clic */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] font-medium bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-body)] hover:text-[var(--text-dark)] border border-[var(--border)] rounded-full px-3 py-1 shadow-xs transition text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs py-1">
                <div className="w-7 h-7 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] px-3 py-1.5 rounded-full shadow-xs">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* PIED DE FENÊTRE (SAISIE DE MESSAGE) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[var(--bg-card)] border-t border-[var(--border)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isAdminArea ? "Poser une question sur le Back-Office..." : "Poser une question sur le site..."}
              className="flex-1 bg-[var(--bg-page)] border border-[var(--border)] text-[var(--text-dark)] placeholder-[var(--text-muted)] text-xs sm:text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Envoyer"
              className={`p-2.5 rounded-full transition shadow-xs ${
                inputValue.trim()
                  ? 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:scale-95'
                  : 'bg-[var(--bg-page)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
