import fs from 'fs';
import path from 'path';

// Images Unsplash de haute qualité vérifiées pour les technologies
const IMAGES = {
  iphone_pro: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1695048065050-8b172088f11b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1695048133156-55d82f7e7a83?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1695048133120-e2b272ea8c5e?w=800&auto=format&fit=crop&q=80'
  ],
  iphone_standard: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
  ],
  samsung_ultra: [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
  ],
  samsung_fold_flip: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80'
  ],
  pixel: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
  ],
  xiaomi_oneplus: [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80'
  ],
  macbook: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80'
  ],
  laptop_pro: [
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80'
  ],
  laptop_gaming: [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80'
  ],
  tablets: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=80'
  ]
};

const escapeSql = (str) => str.replace(/'/g, "''");

const categories = [
  { idVar: 'cat_0', name: 'Apple iPhone' },
  { idVar: 'cat_1', name: 'Samsung Galaxy' },
  { idVar: 'cat_2', name: 'Google Pixel' },
  { idVar: 'cat_3', name: 'Xiaomi & OnePlus' },
  { idVar: 'cat_4', name: 'Apple MacBook' },
  { idVar: 'cat_5', name: 'Laptops Professionnels (Dell, Lenovo, HP)' },
  { idVar: 'cat_6', name: 'Laptops Gaming (Asus ROG, MSI, Razer)' },
  { idVar: 'cat_7', name: 'Tablettes & iPads' }
];

const productsList = [];

function add(catVar, name, desc, price, stock, img) {
  productsList.push({
    catVar,
    name,
    description: desc,
    price,
    stock,
    image_url: img
  });
}

// ==========================================
// 1. APPLE IPHONE (35 Produits)
// ==========================================
const iphoneProColors = ['Titane Naturel', 'Titane Noir', 'Titane Blanc', 'Titane Bleu', 'Titane Désert'];
const iphoneBaseColors = ['Noir', 'Bleu', 'Vert Pastel', 'Jaune', 'Rose Poudré', 'Lumière Stellaire', 'Minuit'];

// iPhone 16 Pro Max (5 variantes)
iphoneProColors.forEach((color, i) => {
  const cap = i % 2 === 0 ? '256 Go' : (i === 1 ? '512 Go' : '1 To');
  const price = cap === '256 Go' ? 16490 : (cap === '512 Go' ? 18990 : 21490);
  add('cat_0', `Apple iPhone 16 Pro Max (${cap}) - ${color}`,
    `Écran 6.9" Super Retina XDR OLED ProMotion 120Hz. Puce Apple A18 Pro gravée en 3nm de 2e génération, nouveau bouton Commande de l'appareil photo, capteur Fusion 48 Mpx avec téléobjectif tétraprisme 5x optique, autonomie jusqu'à 33h de lecture vidéo.`,
    price, 15 + i * 2, IMAGES.iphone_pro[i % IMAGES.iphone_pro.length]);
});

// iPhone 16 Pro (5 variantes)
iphoneProColors.forEach((color, i) => {
  const cap = i === 0 ? '128 Go' : (i % 2 === 0 ? '256 Go' : '512 Go');
  const price = cap === '128 Go' ? 13990 : (cap === '256 Go' ? 15490 : 17990);
  add('cat_0', `Apple iPhone 16 Pro (${cap}) - ${color}`,
    `Écran 6.3" ProMotion 120Hz Always-On, puce A18 Pro avec Neural Engine 16 cœurs optimisé Apple Intelligence, triple caméra 48+48+12 Mpx, châssis titane Grade 5 ultra-résistant et léger.`,
    price, 12 + i * 3, IMAGES.iphone_pro[(i + 1) % IMAGES.iphone_pro.length]);
});

// iPhone 16 Plus (4 variantes)
['Outremer', 'Bleu Sarcelle', 'Rose', 'Noir'].forEach((color, i) => {
  const cap = i % 2 === 0 ? '128 Go' : '256 Go';
  const price = cap === '128 Go' ? 11490 : 12990;
  add('cat_0', `Apple iPhone 16 Plus (${cap}) - ${color}`,
    `Grand écran OLED 6.7" Super Retina XDR, puce Apple A18 avec bouton Action et Commande de l'appareil photo, double module Fusion 48 Mpx avec zoom 2x optique de qualité optique, autonomie marathon.`,
    price, 18 + i, IMAGES.iphone_standard[i % IMAGES.iphone_standard.length]);
});

// iPhone 16 (5 variantes)
['Noir', 'Blanc', 'Rose', 'Bleu Sarcelle', 'Outremer'].forEach((color, i) => {
  const cap = i === 0 ? '128 Go' : (i % 2 === 0 ? '256 Go' : '512 Go');
  const price = cap === '128 Go' ? 9990 : (cap === '256 Go' ? 11490 : 13990);
  add('cat_0', `Apple iPhone 16 (${cap}) - ${color}`,
    `Écran 6.1" OLED haute luminosité 2000 nits en extérieur, puce Apple A18, capteur principal 48 Mpx avec macro ultra grand-angle, audio spatial immersif, port USB-C.`,
    price, 20 + i, IMAGES.iphone_standard[(i + 2) % IMAGES.iphone_standard.length]);
});

// iPhone 15 Pro Max (4 variantes)
['Titane Naturel', 'Titane Bleu', 'Titane Noir', 'Titane Blanc'].forEach((color, i) => {
  const cap = i === 0 ? '256 Go' : (i === 1 ? '512 Go' : '1 To');
  const price = cap === '256 Go' ? 14490 : (cap === '512 Go' ? 16790 : 18990);
  add('cat_0', `Apple iPhone 15 Pro Max (${cap}) - ${color}`,
    `Écran 6.7" Super Retina XDR 120Hz ProMotion, puce A17 Pro compatible jeux AAA console, téléobjectif 5x optique périscopique, port USB-C 3.0 ultra rapide (10 Gb/s).`,
    price, 10 + i * 2, IMAGES.iphone_pro[i % IMAGES.iphone_pro.length]);
});

// iPhone 15 Pro (4 variantes)
['Titane Naturel', 'Titane Noir', 'Titane Blanc', 'Titane Bleu'].forEach((color, i) => {
  const cap = i % 2 === 0 ? '128 Go' : '256 Go';
  const price = cap === '128 Go' ? 12290 : 13790;
  add('cat_0', `Apple iPhone 15 Pro (${cap}) - ${color}`,
    `Format compact 6.1" ProMotion 120Hz, puce A17 Pro 3nm, bouton Action personnalisable, capteur photo 48 Mpx haute résolution, châssis titane brossé de luxe.`,
    price, 14 + i, IMAGES.iphone_pro[(i + 1) % IMAGES.iphone_pro.length]);
});

// iPhone 15 & 15 Plus (4 variantes)
add('cat_0', 'Apple iPhone 15 (128 Go) - Bleu Ciel', 'Écran 6.1" OLED avec Dynamic Island, capteur photo 48 Mpx avec zoom 2x de qualité optique, puce A16 Bionic.', 8990, 25, IMAGES.iphone_standard[0]);
add('cat_0', 'Apple iPhone 15 (256 Go) - Noir Sidéral', 'Écran 6.1" OLED, Dynamic Island, puce A16 Bionic 5 cœurs GPU, 256 Go stockage, USB-C universel.', 10290, 18, IMAGES.iphone_standard[1]);
add('cat_0', 'Apple iPhone 15 Plus (128 Go) - Vert Menthe', 'Grand écran 6.7" OLED Super Retina, autonomie géante 26h de vidéo, Dynamic Island intégrée.', 10490, 15, IMAGES.iphone_standard[2]);
add('cat_0', 'Apple iPhone 15 Plus (256 Go) - Rose', 'Écran 6.7", 256 Go, dos en verre teinté dans la masse finition mate satinée, USB-C, étanchéité IP68.', 11890, 12, IMAGES.iphone_standard[3]);

// iPhone 14 & 13 & SE (5 variantes)
add('cat_0', 'Apple iPhone 14 Pro Max (256 Go) - Violet Intense', 'Écran 6.7" 120Hz ProMotion, Dynamic Island, capteur 48 Mpx, puce A16 Bionic, finition acier chirurgical.', 11990, 8, IMAGES.iphone_pro[0]);
add('cat_0', 'Apple iPhone 14 (128 Go) - Minuit', 'Écran 6.1" OLED Super Retina XDR, puce A15 Bionic avec 5 cœurs GPU, Photonic Engine, autonomie journée.', 7490, 22, IMAGES.iphone_standard[1]);
add('cat_0', 'Apple iPhone 13 (128 Go) - Lumière Stellaire', 'Écran 6.1" OLED, puce A15 Bionic, stabilisation optique de capteur, autonomie solide, compatibilité 5G.', 6290, 30, IMAGES.iphone_standard[2]);
add('cat_0', 'Apple iPhone 13 (256 Go) - Bleu Nuit', 'Écran 6.1", 256 Go stockage, double module photo cinématique 1080p, Face ID sécurisé.', 7290, 16, IMAGES.iphone_standard[0]);
add('cat_0', 'Apple iPhone SE 5G (128 Go) - Minuit', 'Format classique avec bouton Home Touch ID, puce A15 Bionic ultra véloce, 5G rapide, boîtier compact 4.7".', 4890, 24, IMAGES.iphone_standard[3]);


// ==========================================
// 2. SAMSUNG GALAXY (35 Produits)
// ==========================================
// Galaxy S24 Ultra (6 variantes)
const s24uColors = ['Gris Titane', 'Noir Titane', 'Violet Titane', 'Jaune Titane', 'Bleu Titane', 'Vert Titane'];
s24uColors.forEach((color, i) => {
  const cap = i === 0 ? '256 Go' : (i < 4 ? '512 Go' : '1 To');
  const price = cap === '256 Go' ? 12990 : (cap === '512 Go' ? 14990 : 17490);
  add('cat_1', `Samsung Galaxy S24 Ultra 5G (${cap}) - ${color}`,
    `Écran Dynamic AMOLED 2X 6.8" QHD+ 120Hz adaptatif avec verre Gorilla Armor antireflet. Processeur Snapdragon 8 Gen 3 for Galaxy, capteur principal 200 Mpx, téléobjectif 50 Mpx 5x optique, S-Pen intégré, Galaxy AI complète.`,
    price, 10 + i * 2, IMAGES.samsung_ultra[i % IMAGES.samsung_ultra.length]);
});

// Galaxy S24+ (4 variantes)
['Noir Onyx', 'Gris Marbre', 'Violet Cobalt', 'Jaune Ambre'].forEach((color, i) => {
  const cap = i % 2 === 0 ? '256 Go' : '512 Go';
  const price = cap === '256 Go' ? 9990 : 11290;
  add('cat_1', `Samsung Galaxy S24+ 5G (${cap}) - ${color}`,
    `Écran 6.7" QHD+ Dynamic AMOLED 2X 120Hz, 12 Go RAM, batterie 4900 mAh charge rapide 45W, triple module 50+12+10 Mpx, Galaxy AI intégrée.`,
    price, 14 + i, IMAGES.samsung_ultra[(i + 1) % IMAGES.samsung_ultra.length]);
});

// Galaxy S24 (4 variantes)
['Noir Onyx', 'Gris Marbre', 'Violet Cobalt', 'Jaune Ambre'].forEach((color, i) => {
  const cap = i % 2 === 0 ? '128 Go' : '256 Go';
  const price = cap === '128 Go' ? 7990 : 8790;
  add('cat_1', `Samsung Galaxy S24 5G (${cap}) - ${color}`,
    `Format compact 6.2" FHD+ Dynamic AMOLED 2X 120Hz, capteur principal 50 Mpx avec Space Zoom 30x, châssis Armor Aluminum 2.0, fonctions Circle to Search et traduction en direct.`,
    price, 20 + i, IMAGES.samsung_ultra[(i + 2) % IMAGES.samsung_ultra.length]);
});

// Galaxy Z Fold 6 (4 variantes)
['Gris Ombré', 'Bleu Nuit', 'Rose Poudré', 'Noir Crafted'].forEach((color, i) => {
  const cap = i === 0 ? '256 Go' : (i < 3 ? '512 Go' : '1 To');
  const price = cap === '256 Go' ? 18990 : (cap === '512 Go' ? 20990 : 23490);
  add('cat_1', `Samsung Galaxy Z Fold 6 5G (${cap}) - ${color}`,
    `Smartphone pliable hybride : écran externe 6.3" 120Hz et écran pliable interne 7.6" AMOLED 2X 2600 nits. Snapdragon 8 Gen 3, charnière ultra plate résistante FlexHinge, compatibilité S-Pen.`,
    price, 7 + i, IMAGES.samsung_fold_flip[0]);
});

// Galaxy Z Flip 6 (4 variantes)
['Bleu Indigo', 'Menthe', 'Jaune', 'Gris Ombré'].forEach((color, i) => {
  const cap = i % 2 === 0 ? '256 Go' : '512 Go';
  const price = cap === '256 Go' ? 10990 : 12490;
  add('cat_1', `Samsung Galaxy Z Flip 6 5G (${cap}) - ${color}`,
    `Smartphone pliable à clapet : écran externe FlexWindow 3.4" Super AMOLED et écran interne pliable 6.7" 120Hz. Capteur 50 Mpx haute clarté, 12 Go RAM, chambre à vapeur de refroidissement.`,
    price, 12 + i, IMAGES.samsung_fold_flip[1]);
});

// Galaxy Z Fold 5 & Z Flip 5 (4 variantes)
add('cat_1', 'Samsung Galaxy Z Fold 5 5G (512 Go) - Noir Fantôme', 'Écran pliable 7.6" Dynamic AMOLED 2X 120Hz, Snapdragon 8 Gen 2, multitâche 3 fenêtres, certification étanchéité IPX8.', 15490, 6, IMAGES.samsung_fold_flip[0]);
add('cat_1', 'Samsung Galaxy Z Fold 5 5G (256 Go) - Crème Polaire', 'Écran 7.6" pliable, charnière sans espace, 12 Go RAM, zoom optique 3x, design pliable luxueux.', 13990, 8, IMAGES.samsung_fold_flip[0]);
add('cat_1', 'Samsung Galaxy Z Flip 5 5G (256 Go) - Lavande', 'Écran externe FlexWindow 3.4" personnalisable, écran interne 6.7" AMOLED 120Hz, mode FlexCam mains libres.', 8290, 11, IMAGES.samsung_fold_flip[1]);
add('cat_1', 'Samsung Galaxy Z Flip 5 5G (512 Go) - Graphite', 'Format pliable compact poche, Snapdragon 8 Gen 2, 512 Go, enregistrement 4K 60fps stable.', 9490, 9, IMAGES.samsung_fold_flip[1]);

// Galaxy S23 Ultra & S23 FE & Gamme A (9 variantes)
add('cat_1', 'Samsung Galaxy S23 Ultra 5G (256 Go) - Vert Forêt', 'Écran 6.8" AMOLED 120Hz, capteur 200 Mpx, zoom optique 10x et Space Zoom 100x légendaire, stylet S-Pen.', 9890, 15, IMAGES.samsung_ultra[0]);
add('cat_1', 'Samsung Galaxy S23 Ultra 5G (512 Go) - Noir Fantôme', 'Version 512 Go / 12 Go RAM, Snapdragon 8 Gen 2, autonomie remarquable 5000 mAh.', 11290, 10, IMAGES.samsung_ultra[1]);
add('cat_1', 'Samsung Galaxy S23 FE 5G (128 Go) - Crème', 'Écran 6.4" Dynamic AMOLED 2X 120Hz, capteur 50 Mpx avec Nightography avancée, puce puissante 8 cœurs.', 5790, 22, IMAGES.samsung_ultra[2]);
add('cat_1', 'Samsung Galaxy S23 FE 5G (256 Go) - Graphite', 'Écran 6.4", 256 Go, protection Gorilla Glass 5 et aluminium renforcé, étanche IP68.', 6490, 18, IMAGES.samsung_ultra[0]);
add('cat_1', 'Samsung Galaxy A55 5G (256 Go / 8 Go) - Bleu Glace', 'Écran Super AMOLED 6.6" 120Hz FHD+, cadre en métal haut de gamme, triple capteur 50 Mpx OIS, batterie 5000 mAh.', 4190, 35, IMAGES.samsung_ultra[2]);
add('cat_1', 'Samsung Galaxy A55 5G (128 Go / 8 Go) - Marine Sombre', 'Super AMOLED 6.6" 120Hz, processeur Exynos 1480 avec GPU AMD Xclipse 530, sécurité Knox Vault.', 3690, 40, IMAGES.samsung_ultra[1]);
add('cat_1', 'Samsung Galaxy A35 5G (256 Go / 8 Go) - Lilas Pastel', 'Écran 6.6" Super AMOLED 120Hz, caméra 50 Mpx avec stabilisation OIS, 2 jours d autonomie.', 3290, 30, IMAGES.samsung_ultra[0]);
add('cat_1', 'Samsung Galaxy A35 5G (128 Go / 6 Go) - Bleu Nuit', 'Écran FHD+ 120Hz fluide, triple caméra, autonomie 5000 mAh, certification IP67 eau et poussière.', 2790, 32, IMAGES.samsung_ultra[2]);
add('cat_1', 'Samsung Galaxy A25 5G (128 Go / 6 Go) - Noir Profond', 'Écran Super AMOLED 6.5" 120Hz éclatant 1000 nits, capteur 50 Mpx OIS, haut-parleurs stéréo Dolby Atmos.', 2290, 28, IMAGES.samsung_ultra[1]);


// ==========================================
// 3. GOOGLE PIXEL (25 Produits)
// ==========================================
// Pixel 9 Pro XL & Fold (7 variantes)
['Porcelaine', 'Obsidienne', 'Noisette', 'Quartz Rose'].forEach((color, i) => {
  const cap = i === 0 ? '128 Go' : (i < 3 ? '256 Go' : '512 Go');
  const price = cap === '128 Go' ? 11990 : (cap === '256 Go' ? 13290 : 14990);
  add('cat_2', `Google Pixel 9 Pro XL (${cap}) - ${color}`,
    `Écran 6.8" Super Actua OLED 1-120Hz LTPO 3000 nits. Puce Google Tensor G4 gravée en 4nm avec 16 Go de RAM pour Gemini Nano et IA multimodale, triple capteur 50+48+48 Mpx téléobjectif 5x optique.`,
    price, 12 + i, IMAGES.pixel[i % IMAGES.pixel.length]);
});
add('cat_2', 'Google Pixel 9 Pro Fold (256 Go) - Porcelaine', 'Écran externe 6.3" et écran intérieur pliable Super Actua Flex 8.0" 120Hz. Puce Tensor G4, 16 Go RAM, charnière en acier ultra fine.', 19990, 6, IMAGES.pixel[0]);
add('cat_2', 'Google Pixel 9 Pro Fold (512 Go) - Obsidienne', 'Smartphone pliable grand écran 8.0", stockage 512 Go, suite Gemini Pro intégrée, triple capteur photo ultra haute définition.', 22490, 5, IMAGES.pixel[1]);
add('cat_2', 'Google Pixel 9 Pro (256 Go) - Porcelaine', 'Format compact haut de gamme 6.3" LTPO 120Hz 3000 nits, 16 Go RAM, téléobjectif 5x optique 48 Mpx, vidéo Boost 8K.', 12290, 11, IMAGES.pixel[2]);

// Pixel 9 & 8 Pro & 8a & 7a (14 variantes)
['Obsidienne', 'Porcelaine', 'Vert Sauge', 'Rose Pivoine'].forEach((color, i) => {
  const cap = i % 2 === 0 ? '128 Go' : '256 Go';
  const price = cap === '128 Go' ? 8890 : 9990;
  add('cat_2', `Google Pixel 9 (${cap}) - ${color}`,
    `Écran Actua 6.3" OLED 120Hz ultra lumineux, puce Tensor G4, 12 Go RAM, capteur principal 50 Mpx + ultra grand-angle 48 Mpx avec macro, 7 ans de mises à jour Android garanties.`,
    price, 16 + i, IMAGES.pixel[i % IMAGES.pixel.length]);
});
add('cat_2', 'Google Pixel 8 Pro (128 Go) - Bleu Baie', 'Écran Super Actua 6.7" OLED 120Hz, capteur de température corporelle, puce Tensor G3, téléobjectif 5x, fonctionnalités Magic Editor et Best Take.', 9290, 14, IMAGES.pixel[1]);
add('cat_2', 'Google Pixel 8 Pro (256 Go) - Noir Volcanique', 'Écran 6.7", 256 Go, puce Tensor G3 avec 12 Go RAM, zoom optique 5x et zoom haute résolution 30x, traitement photo computationnel inégalé.', 10490, 12, IMAGES.pixel[2]);
add('cat_2', 'Google Pixel 8 Pro (512 Go) - Porcelaine', 'Stockage généreux 512 Go, finition verre mat soyeux résistant aux traces, enregistrement vidéo Night Sight époustouflant.', 11990, 8, IMAGES.pixel[0]);
add('cat_2', 'Google Pixel 8 (128 Go) - Vert Sauge', 'Écran Actua compact 6.2" OLED 120Hz, Tensor G3, double capteur 50+12 Mpx, gomme magique audio pour vidéos limpides.', 6890, 18, IMAGES.pixel[1]);
add('cat_2', 'Google Pixel 8 (256 Go) - Obsidienne', 'Écran 6.2", 256 Go, 8 Go RAM, recharge rapide sans fil, certification IP68 étanchéité totale.', 7790, 15, IMAGES.pixel[2]);
add('cat_2', 'Google Pixel 8a (128 Go) - Bleu Azur', 'Écran 6.1" Actua OLED 120Hz éclatant, puce flagship Tensor G3, 8 Go RAM, meilleur rapport qualité/prix photo du marché.', 4990, 25, IMAGES.pixel[0]);
add('cat_2', 'Google Pixel 8a (256 Go) - Noir Charbon', 'Stockage 256 Go, sécurité Titan M2, 7 ans de mises à jour logicielles complètes, autonomie 24h+.', 5690, 20, IMAGES.pixel[1]);
add('cat_2', 'Google Pixel 8a (128 Go) - Aloe Pastel', 'Écran 6.1" 120Hz, couleur menthe exclusive, capteur 64 Mpx + 13 Mpx ultra grand-angle, IA Google avancée.', 4990, 22, IMAGES.pixel[2]);
add('cat_2', 'Google Pixel 7 Pro (128 Go) - Noir Carbone', 'Écran LTPO QHD+ 6.7" 120Hz incurvé, téléobjectif 5x 48 Mpx, puce Tensor G2, design iconique avec barre caméra en aluminium.', 6590, 10, IMAGES.pixel[0]);
add('cat_2', 'Google Pixel 7a (128 Go) - Corail Exclusif', 'Écran 6.1" 90Hz FHD+, puce Tensor G2, recharge sans fil Qi, capteur principal 64 Mpx ultra détaillé.', 3890, 18, IMAGES.pixel[1]);


// ==========================================
// 4. XIAOMI, ONEPLUS & AUTRES (35 Produits)
// ==========================================
// Xiaomi 14 Ultra & 14 (8 variantes)
['Noir Cuir Végan', 'Blanc Titane'].forEach((color, i) => {
  add('cat_3', `Xiaomi 14 Ultra 5G (512 Go / 16 Go) - ${color}`,
    `Photophone ultime : optique Leica Summilux quadri-caméra 50 Mpx avec capteur 1" Sony LYT-900 à ouverture variable f/1.63-f/4.0. Écran AMOLED C8 6.73" WQHD+ 120Hz 3000 nits, Snapdragon 8 Gen 3, charge 90W filaire et 80W sans fil.`,
    13990, 8 + i, IMAGES.xiaomi_oneplus[0]);
});
['Noir Sombre', 'Vert Jade', 'Blanc Nacré'].forEach((color, i) => {
  add('cat_3', `Xiaomi 14 5G (512 Go / 12 Go) - ${color}`,
    `Format compact premium 6.36" AMOLED 120Hz LTPO bordures ultra-fines de 1.61 mm. Snapdragon 8 Gen 3, triple optique Leica 50 Mpx avec téléobjectif flottant 75mm, charge HyperCharge 90W.`,
    8990, 15 + i, IMAGES.xiaomi_oneplus[1]);
});
add('cat_3', 'Xiaomi 13T Pro 5G (1 To / 16 Go) - Bleu Alpin', 'Écran CrystalRes AMOLED 6.67" 144Hz, Dimensity 9200+, capteur Leica 50 Mpx, charge 120W HyperCharge (100% en 19 min).', 7890, 14, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'Xiaomi 13T Pro 5G (512 Go / 12 Go) - Noir Miroir', 'Écran 144Hz AMOLED, appareil photo professionnel Leica Summicron, certification étanchéité IP68.', 6990, 18, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'Xiaomi 13T 5G (256 Go / 8 Go) - Vert Prairie', 'Écran 144Hz AMOLED, triple capteur Leica 50 Mpx, processeur Dimensity 8200-Ultra, batterie 5000 mAh 67W.', 4890, 20, IMAGES.xiaomi_oneplus[1]);

// OnePlus (10 variantes)
add('cat_3', 'OnePlus 12 5G (512 Go / 16 Go) - Vert Émeraude', 'Écran 2K 120Hz ProXDR 4500 nits, Snapdragon 8 Gen 3, appareil photo Hasselblad 4e génération avec téléobjectif périscope 64 Mpx 3x, batterie 5400 mAh SUPERVOOC 100W.', 9490, 12, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'OnePlus 12 5G (256 Go / 12 Go) - Noir Silice', 'Écran AMOLED 2K LTPO 4.0, Snapdragon 8 Gen 3, charge 100W et AIRVOOC sans fil 50W, moteur haptique Bionic X-axis.', 8490, 15, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'OnePlus Open 5G (512 Go / 16 Go) - Noir Cuir', 'Smartphone pliable d exception : écran externe 6.31" et écran interne 7.82" 2K 120Hz 2800 nits, pli quasiment invisible, optiques Hasselblad avec capteur Sony LYTIA.', 16990, 5, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'OnePlus 12R 5G (256 Go / 16 Go) - Bleu Givré', 'Écran AMOLED 1.5K 120Hz LTPO 4.0, Snapdragon 8 Gen 2, batterie record 5500 mAh avec charge 100W SUPERVOOC.', 5890, 22, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'OnePlus 12R 5G (128 Go / 8 Go) - Gris Tempête', 'Performances flagship abordables : Snapdragon 8 Gen 2, dissipation thermique Cryo-velocity, 100% de batterie en 26 min.', 4990, 25, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'OnePlus Nord 4 5G (256 Go / 12 Go) - Argent Mercure', 'Design monocoque tout en aluminium ultra moderne, Snapdragon 7+ Gen 3, 4 ans de mises à jour Android et 6 ans de patchs de sécurité.', 4490, 28, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'OnePlus Nord 4 5G (512 Go / 16 Go) - Noir Obsidienne', 'Configuration maximale 16 Go RAM / 512 Go stockage, écran AMOLED 120Hz 2150 nits, charge 100W.', 4990, 20, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'OnePlus Nord CE4 Lite 5G (256 Go / 8 Go) - Bleu Supernova', 'Écran AMOLED 120Hz lumineux 2100 nits, capteur Sony LYT-600 50 Mpx OIS, batterie colossale 5500 mAh 80W.', 2690, 35, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'OnePlus Nord 3 5G (256 Go / 16 Go) - Vert Brillant', 'Écran 6.74" AMOLED 120Hz 1.5K, Dimensity 9000, 16 Go RAM, capteur Sony IMX890 50 Mpx OIS.', 3890, 18, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'OnePlus 11 5G (256 Go / 16 Go) - Vert Éternel', 'Écran 6.7" QHD+ AMOLED 120Hz, Snapdragon 8 Gen 2, triple optique Hasselblad, son Dolby Atmos spatialisé.', 6890, 10, IMAGES.xiaomi_oneplus[2]);

// Redmi Note 13 & POCO (12 variantes)
add('cat_3', 'Xiaomi Redmi Note 13 Pro+ 5G (512 Go / 12 Go) - Violet Aurore', 'Écran incurvé AMOLED 1.5K 120Hz, capteur 200 Mpx avec OIS stabilisé, Dimensity 7200-Ultra, HyperCharge 120W, certification IP68.', 4490, 30, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'Xiaomi Redmi Note 13 Pro+ 5G (256 Go / 8 Go) - Noir Nuit', 'Écran incurvé AMOLED 1.5K 120Hz, appareil 200 Mpx ultra net, chargeur 120W inclus dans la boîte.', 3990, 32, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'Xiaomi Redmi Note 13 Pro 5G (256 Go / 8 Go) - Bleu Océan', 'Écran AMOLED 1.5K 120Hz, capteur 200 Mpx OIS, Snapdragon 7s Gen 2, batterie 5100 mAh charge 67W.', 3290, 40, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'Xiaomi Redmi Note 13 Pro 4G (256 Go / 8 Go) - Vert Forêt', 'Écran AMOLED 120Hz FHD+, 200 Mpx avec zoom 4x sans perte, MediaTek Helio G99-Ultra, charge 67W.', 2690, 45, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'Xiaomi Redmi Note 13 (256 Go / 8 Go) - Noir Minuit', 'Écran AMOLED 120Hz avec bordures fines, triple module photo 108 Mpx, processeur Snapdragon 685 fluide.', 1990, 50, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'Xiaomi POCO F6 Pro 5G (512 Go / 12 Go) - Blanc Lunaire', 'Écran WQHD+ 120Hz Flow AMOLED 4000 nits, Snapdragon 8 Gen 2, capteur Light Fusion 800 50 Mpx OIS, 120W HyperCharge.', 5690, 22, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'Xiaomi POCO F6 Pro 5G (1 To / 16 Go) - Noir Sidéral', 'Configuration monstre 1 To stockage / 16 Go RAM, refroidissement LiquidCool 4.0 avec Loop LiquidCool.', 6490, 16, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'Xiaomi POCO F6 5G (512 Go / 12 Go) - Titane', 'Processeur Snapdragon 8s Gen 3 nouvelle génération, écran 1.5K 120Hz AMOLED, charge rapide 90W TurboCharge.', 4390, 26, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'Xiaomi POCO X6 Pro 5G (512 Go / 12 Go) - Jaune Iconique', 'Dimensity 8300-Ultra puissant comme un flagship, écran CrystalRes 1.5K 120Hz, 64 Mpx triple caméra OIS.', 3790, 35, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'Xiaomi POCO X6 5G (256 Go / 8 Go) - Blanc Perle', 'Écran AMOLED 1.5K 120Hz, Snapdragon 7s Gen 2, 64 Mpx avec OIS, batterie 5100 mAh charge 67W.', 2890, 38, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'Xiaomi POCO M6 Pro (256 Go / 8 Go) - Bleu Cobalt', 'Écran Flow AMOLED 120Hz, capteur 64 Mpx OIS, 67W Turbo Charge, Helio G99-Ultra.', 2190, 42, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'Honor Magic 6 Pro 5G (512 Go / 12 Go) - Vert Émeraude', 'Écran LTPO 120Hz 5000 nits, appareil photo Falcon avec téléobjectif périscope 180 Mpx 2.5x, Snapdragon 8 Gen 3.', 11990, 10, IMAGES.xiaomi_oneplus[2]);

// Nothing Phone (5 variantes)
add('cat_3', 'Nothing Phone (2) (256 Go / 12 Go) - Gris Sombre', 'Interface Glyph lumineuse LED interactive personnalisable, écran OLED LTPO 120Hz 6.7", Snapdragon 8+ Gen 1, double 50 Mpx.', 6790, 18, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'Nothing Phone (2) (512 Go / 12 Go) - Blanc Pur', 'Design transparent emblématique, Glyph Matrix dynamique, Snapdragon 8+ Gen 1, autonomie 4700 mAh.', 7690, 14, IMAGES.xiaomi_oneplus[1]);
add('cat_3', 'Nothing Phone (2a) Plus (256 Go / 12 Go) - Gris Métallique', 'Processeur MediaTek Dimensity 7350 Pro 5G exclusif, double capteur 50 Mpx + capteur selfie 50 Mpx, design transparent futuriste.', 4490, 24, IMAGES.xiaomi_oneplus[2]);
add('cat_3', 'Nothing Phone (2a) (256 Go / 12 Go) - Lait Blanc', 'Écran AMOLED 120Hz 1300 nits, Dimensity 7200 Pro, interface Glyph signature, Nothing OS 2.6 fluide.', 3690, 30, IMAGES.xiaomi_oneplus[0]);
add('cat_3', 'Nothing Phone (2a) (128 Go / 8 Go) - Noir Fumé', 'Format 6.7" AMOLED flexible 120Hz, double caméra 50 Mpx OIS, Glyph lumineux dos, charge 45W.', 3190, 35, IMAGES.xiaomi_oneplus[1]);


// ==========================================
// 5. APPLE MACBOOK (30 Produits)
// ==========================================
// MacBook Pro 16 pouces M3 Pro & M3 Max (6 variantes)
const mbp16Configs = [
  { name: 'Apple MacBook Pro 16" M3 Pro (18 Go / 512 Go SSD) - Noir Sidéral', price: 28990, desc: 'Puce M3 Pro CPU 12 cœurs, GPU 18 cœurs, 18 Go mémoire unifiée, 512 Go SSD. Écran Liquid Retina XDR Mini-LED 16.2" ProMotion 120Hz, autonomie record 22h, ports HDMI, MagSafe 3, SDXC.' },
  { name: 'Apple MacBook Pro 16" M3 Pro (36 Go / 512 Go SSD) - Argent', price: 33490, desc: 'Puce M3 Pro CPU 12 cœurs, GPU 18 cœurs, 36 Go mémoire unifiée pour virtualisation et montage pro, écran Liquid Retina XDR 1600 nits de pointe.' },
  { name: 'Apple MacBook Pro 16" M3 Max (36 Go / 1 To SSD) - Noir Sidéral', price: 41990, desc: 'Puce M3 Max surpuissante CPU 14 cœurs, GPU 30 cœurs avec Ray Tracing matériel, 36 Go mémoire unifiée, 1 To SSD ultra-rapide 7.4 Go/s.' },
  { name: 'Apple MacBook Pro 16" M3 Max (48 Go / 1 To SSD) - Argent', price: 46990, desc: 'Puce M3 Max version maximale CPU 16 cœurs, GPU 40 cœurs, 48 Go mémoire unifiée, idéal pour rendu 3D lourd et calcul scientifique.' },
  { name: 'Apple MacBook Pro 16" M3 Max (64 Go / 2 To SSD) - Noir Sidéral', price: 54990, desc: 'Station de travail mobile ultime : M3 Max 16 cœurs CPU, 40 cœurs GPU, 64 Go RAM unifiée, 2 To SSD NVMe, 3 ports Thunderbolt 4.' },
  { name: 'Apple MacBook Pro 16" M3 Max (128 Go / 4 To SSD) - Noir Sidéral', price: 79990, desc: 'Configuration monstre sur mesure : 128 Go de mémoire unifiée pour faire tourner des LLM et IA en local, 4 To de stockage ultra-rapide.' }
];
mbp16Configs.forEach((c, i) => add('cat_4', c.name, c.desc, c.price, 4 + i, IMAGES.macbook[i % IMAGES.macbook.length]));

// MacBook Pro 14 pouces M3, M3 Pro, M3 Max (10 variantes)
const mbp14Configs = [
  { name: 'Apple MacBook Pro 14" M3 (8 Go / 512 Go SSD) - Gris Sidéral', price: 19490, desc: 'Puce Apple M3 CPU 8 cœurs, GPU 10 cœurs, écran Liquid Retina XDR 14.2" ProMotion 120Hz, système audio 6 haut-parleurs, autonomie 22h.' },
  { name: 'Apple MacBook Pro 14" M3 (16 Go / 1 To SSD) - Argent', price: 23990, desc: 'Puce Apple M3, 16 Go mémoire unifiée, 1 To SSD, luminosité SDR accrue à 600 nits, connecteur MagSafe 3 et 2 ports Thunderbolt.' },
  { name: 'Apple MacBook Pro 14" M3 Pro (18 Go / 512 Go SSD) - Noir Sidéral', price: 24490, desc: 'Puce M3 Pro CPU 11 cœurs, GPU 14 cœurs, 18 Go RAM unifiée, 512 Go SSD, nouveau coloris Noir Sidéral anti-traces de doigts.' },
  { name: 'Apple MacBook Pro 14" M3 Pro (18 Go / 1 To SSD) - Noir Sidéral', price: 27990, desc: 'Puce M3 Pro CPU 12 cœurs, GPU 18 cœurs, 18 Go mémoire unifiée, 1 To SSD, 3 ports Thunderbolt 4, lecteur carte SDXC.' },
  { name: 'Apple MacBook Pro 14" M3 Pro (36 Go / 1 To SSD) - Argent', price: 32490, desc: 'Puce M3 Pro CPU 12 cœurs, 36 Go mémoire unifiée, 1 To SSD, performances soutenues avec refroidissement actif silencieux.' },
  { name: 'Apple MacBook Pro 14" M3 Max (36 Go / 1 To SSD) - Noir Sidéral', price: 38990, desc: 'Puce M3 Max CPU 14 cœurs, GPU 30 cœurs, 36 Go RAM unifiée, support jusqu à 4 écrans externes haute résolution.' },
  { name: 'Apple MacBook Pro 14" M3 Max (48 Go / 1 To SSD) - Noir Sidéral', price: 44490, desc: 'Puce M3 Max 16 cœurs CPU, 40 cœurs GPU, 48 Go RAM, puissance brute dans un châssis compact et portable de 1.62 kg.' },
  { name: 'Apple MacBook Pro 14" M2 Pro (16 Go / 512 Go SSD) - Gris Sidéral', price: 18990, desc: 'Puce M2 Pro CPU 10 cœurs, GPU 16 cœurs, écran Liquid Retina XDR 14.2", HDMI 2.1, 16 Go RAM.' },
  { name: 'Apple MacBook Pro 14" M2 Max (32 Go / 1 To SSD) - Argent', price: 27990, desc: 'Puce M2 Max CPU 12 cœurs, GPU 30 cœurs, 32 Go RAM, 1 To SSD, moteur multimédia ProRes double vitesse.' },
  { name: 'Apple MacBook Pro 13" M2 (8 Go / 256 Go SSD) - Gris Sidéral', price: 13490, desc: 'Puce Apple M2 avec Touch Bar tactile intégrée, écran Retina 13.3", autonomie marathon de 20 heures.' }
];
mbp14Configs.forEach((c, i) => add('cat_4', c.name, c.desc, c.price, 6 + i, IMAGES.macbook[(i + 1) % IMAGES.macbook.length]));

// MacBook Air 15 pouces M3 & M2 (7 variantes)
const mba15Configs = [
  { name: 'Apple MacBook Air 15" M3 (8 Go / 256 Go SSD) - Minuit', price: 14990, desc: 'Écran Liquid Retina 15.3" 500 nits, puce Apple M3 CPU 8 cœurs GPU 10 cœurs, châssis ultra-fin 11.5 mm, sans ventilateur 100% silencieux.' },
  { name: 'Apple MacBook Air 15" M3 (16 Go / 512 Go SSD) - Lumière Stellaire', price: 18490, desc: 'Puce M3, 16 Go mémoire unifiée, 512 Go SSD, prise en charge de deux écrans externes capot fermé, Wi-Fi 6E.' },
  { name: 'Apple MacBook Air 15" M3 (16 Go / 1 To SSD) - Gris Sidéral', price: 20990, desc: 'Puce M3, 16 Go mémoire unifiée, 1 To SSD, système audio à 6 haut-parleurs avec woofers à annulation de force.' },
  { name: 'Apple MacBook Air 15" M3 (24 Go / 1 To SSD) - Noir Minuit', price: 23990, desc: 'Configuration maximale avec 24 Go de RAM unifiée et 1 To SSD, finition anodisée réduisant les traces de doigts.' },
  { name: 'Apple MacBook Air 15" M2 (8 Go / 256 Go SSD) - Argent', price: 13490, desc: 'Grand écran 15.3" Liquid Retina, puce M2 réactive, autonomie 18h, caméra FaceTime HD 1080p, recharge MagSafe 3.' },
  { name: 'Apple MacBook Air 15" M2 (16 Go / 512 Go SSD) - Minuit', price: 16490, desc: 'Puce M2, 16 Go RAM unifiée, 512 Go SSD, châssis aluminium monobloc rigide de seulement 1.51 kg.' },
  { name: 'Apple MacBook Air 15" M2 (16 Go / 1 To SSD) - Lumière Stellaire', price: 18990, desc: 'Puce M2, 16 Go RAM, 1 To SSD, clavier Magic Keyboard rétroéclairé avec capteur Touch ID biométrique.' }
];
mba15Configs.forEach((c, i) => add('cat_4', c.name, c.desc, c.price, 8 + i, IMAGES.macbook[(i + 2) % IMAGES.macbook.length]));

// MacBook Air 13 pouces M3 & M2 & M1 (7 variantes)
const mba13Configs = [
  { name: 'Apple MacBook Air 13" M3 (8 Go / 256 Go SSD) - Minuit', price: 12990, desc: 'Écran Liquid Retina 13.6", puce M3 3nm économe et puissante, autonomie 18h, Wi-Fi 6E, deux ports Thunderbolt / USB 4.' },
  { name: 'Apple MacBook Air 13" M3 (16 Go / 512 Go SSD) - Lumière Stellaire', price: 16490, desc: 'Puce M3, 16 Go mémoire unifiée, 512 Go SSD, compatible 2 écrans externes, design biseauté ultra compact 1.24 kg.' },
  { name: 'Apple MacBook Air 13" M3 (24 Go / 512 Go SSD) - Gris Sidéral', price: 19490, desc: 'Puce M3, 24 Go RAM unifiée idéale pour développeurs et créatifs nomades, 512 Go SSD NVMe.' },
  { name: 'Apple MacBook Air 13" M2 (8 Go / 256 Go SSD) - Minuit', price: 11290, desc: 'Design moderne à bords plats, puce M2, écran Retina 13.6" 500 nits, connecteur MagSafe 3, prise casque 3.5mm haute impédance.' },
  { name: 'Apple MacBook Air 13" M2 (16 Go / 512 Go SSD) - Argent', price: 14490, desc: 'Puce M2, 16 Go RAM, 512 Go SSD, parfait pour bureautique avancée, code et traitement d images.' },
  { name: 'Apple MacBook Air 13" M1 (8 Go / 256 Go SSD) - Gris Sidéral', price: 8990, desc: 'La légende du rapport qualité/prix : puce Apple M1 révolutionnaire, autonomie jusqu à 18h, silence absolu sans ventilateur.' },
  { name: 'Apple MacBook Air 13" M1 (16 Go / 512 Go SSD) - Or Rose', price: 11990, desc: 'Puce M1 avec 16 Go de mémoire unifiée et 512 Go SSD, clavier ciseau confortable Magic Keyboard.' }
];
mba13Configs.forEach((c, i) => add('cat_4', c.name, c.desc, c.price, 10 + i, IMAGES.macbook[i % IMAGES.macbook.length]));


// ==========================================
// 6. LAPTOPS PRO & ULTRABOOKS (35 Produits)
// ==========================================
// Dell XPS (10 variantes)
const dellXps = [
  { name: 'Dell XPS 16 9640 (Intel Core Ultra 7 155H / RTX 4060 / 32 Go / 1 To SSD) - Argent Platine', price: 29990, desc: 'Écran OLED 16.3" 4K+ 3840x2400 tactile 120Hz. Intel Core Ultra 7 (NPU IA dédié), Nvidia GeForce RTX 4060 8 Go, 32 Go LPDDR5x, 1 To SSD NVMe, pavé tactile haptique invisible en verre.' },
  { name: 'Dell XPS 16 9640 (Intel Core Ultra 9 185H / RTX 4070 / 64 Go / 2 To SSD) - Graphite', price: 38990, desc: 'Puissance extrême ultrabook : Core Ultra 9, RTX 4070 8 Go, 64 Go RAM, écran 16.3" 4K OLED, châssis usiné CNC.' },
  { name: 'Dell XPS 14 9440 (Intel Core Ultra 7 155H / RTX 4050 / 32 Go / 1 To SSD) - Argent Platine', price: 25490, desc: 'Écran 14.5" 3.2K 120Hz OLED InfinityEdge tactile, Core Ultra 7, RTX 4050 6 Go, autonomie longue durée, poids plume 1.68 kg.' },
  { name: 'Dell XPS 14 9440 (Intel Core Ultra 7 155H / Intel Arc / 16 Go / 512 Go SSD) - Graphite', price: 20990, desc: 'Ultrabook 14.5" FHD+ 120Hz 500 nits, Intel Core Ultra 7 avec NPU, 16 Go LPDDR5x, clavier bord à bord rétroéclairé.' },
  { name: 'Dell XPS 13 9340 (Intel Core Ultra 7 155H / 16 Go / 512 Go SSD) - Argent', price: 16990, desc: 'Le roi de la compacité : écran 13.4" QHD+ 120Hz, Core Ultra 7, 16 Go RAM, poids 1.19 kg, autonomie jusqu à 18h.' },
  { name: 'Dell XPS 13 Plus 9320 (Intel Core i7-1360P / 32 Go / 1 To SSD) - Graphite', price: 18990, desc: 'Design futuriste avec barre de touches capacitives tactiles, pavé haptique sans démarcation, écran 3.5K OLED tactile.' },
  { name: 'Dell XPS 15 9530 (Intel Core i9-13900H / RTX 4070 / 32 Go / 1 To SSD) - Argent', price: 27990, desc: 'Écran 15.6" OLED 3.5K tactile 100% DCI-P3, Core i9 14 cœurs, GPU RTX 4070, châssis fibre de carbone et aluminium.' },
  { name: 'Dell XPS 15 9530 (Intel Core i7-13700H / RTX 4060 / 16 Go / 512 Go SSD) - Argent', price: 21990, desc: 'Écran 15.6" FHD+ 500 nits antireflet, Core i7 13e gén, RTX 4060 8 Go, parfait pour montage vidéo et développement.' },
  { name: 'Dell Latitude 7440 (Intel Core i7-1365U / 16 Go / 512 Go SSD) - Gris Titane', price: 15490, desc: 'PC portable professionnel ultra robuste : écran 14" FHD+ IPS, Intel vPro, Wi-Fi 6E, sécurité biométrique TPM 2.0.' },
  { name: 'Dell Latitude 5540 (Intel Core i5-1345U / 16 Go / 512 Go SSD) - Noir Pro', price: 11990, desc: 'Portabilité et durabilité entreprise : écran 15.6" antireflet, pavé numérique complet, ports RJ45, HDMI 2.0, Thunderbolt 4.' }
];
dellXps.forEach((c, i) => add('cat_5', c.name, c.desc, c.price, 5 + i, IMAGES.laptop_pro[i % IMAGES.laptop_pro.length]));

// Lenovo ThinkPad & Yoga (12 variantes)
const lenovoLaptops = [
  { name: 'Lenovo ThinkPad X1 Carbon Gen 12 (Intel Core Ultra 7 155H / 32 Go / 1 To SSD) - Noir Fibre de Carbone', price: 26990, desc: 'Le standard des dirigeants : écran 14" 2.8K 120Hz OLED, châssis carbone et magnésium ultraléger 1.09 kg, clavier ThinkPad légendaire, sécurité ThinkShield.' },
  { name: 'Lenovo ThinkPad X1 Carbon Gen 12 (Intel Core Ultra 5 125H / 16 Go / 512 Go SSD) - Noir', price: 21490, desc: 'Écran 14" WUXGA 400 nits basse consommation, Core Ultra 5 avec NPU Intel AI Boost, autonomie 16h, webcam 4K avec volet ThinkShutter.' },
  { name: 'Lenovo ThinkPad X1 Yoga Gen 8 (Intel Core i7-1365U / 32 Go / 1 To SSD) - Gris Tempête', price: 23990, desc: 'Convertible 2-en-1 360° en aluminium CNC : écran 14" 4K OLED tactile avec stylet ThinkPad Pen Pro rechargeable intégré au châssis.' },
  { name: 'Lenovo ThinkPad T14s Gen 5 (Snapdragon X Elite / 32 Go / 1 To SSD) - Noir', price: 20990, desc: 'Révolution ARM Copilot+ PC : puce Snapdragon X Elite 12 cœurs avec 45 TOPS NPU, autonomie époustouflante jusqu à 29 heures, silence total.' },
  { name: 'Lenovo ThinkPad T14 Gen 4 (AMD Ryzen 7 PRO 7840U / 32 Go / 512 Go SSD) - Noir', price: 15990, desc: 'Robustesse militaire MIL-STD-810H, processeur Ryzen 7 PRO 8 cœurs / 16 threads avec Radeon 780M, évolutivité mémoire et SSD.' },
  { name: 'Lenovo ThinkPad P1 Gen 6 (Intel Core i9-13900H / RTX 4080 / 64 Go / 2 To SSD) - Noir Carbone', price: 42990, desc: 'Station de travail mobile certifiée ISV : écran 16" 4K OLED 165Hz, GPU RTX 4080 12 Go, 64 Go RAM DDR5, calibrage couleur X-Rite.' },
  { name: 'Lenovo Yoga 9i Dual Screen Gen 9 (Intel Core Ultra 7 155H / 32 Go / 1 To SSD) - Bleu Cosmique', price: 24990, desc: 'Pionnier du double écran : deux dalles 13.3" 2.8K OLED tactiles reliées par une barre de son Bowers & Wilkins rotative à 360°.' },
  { name: 'Lenovo Yoga Pro 9i 16 (Intel Core Ultra 9 185H / RTX 4070 / 32 Go / 1 To SSD) - Gris Marée', price: 27990, desc: 'Écran 16" 3.2K Mini-LED 165Hz 1200 nits, Core Ultra 9, RTX 4070 8 Go Studio, 6 haut-parleurs avec caisson de basses.' },
  { name: 'Lenovo Yoga Slim 7x Copilot+ (Snapdragon X Elite / 16 Go / 1 To SSD) - Bleu Cosmique', price: 16490, desc: 'Écran 14.5" 3K 90Hz OLED 1000 nits, Snapdragon X Elite, 1.28 kg, épaisseur 12.9 mm, autonomie record.' },
  { name: 'Lenovo ThinkBook 16p Gen 4 (Intel Core i7-13700H / RTX 4060 / 32 Go / 1 To SSD) - Gris Tempête', price: 17990, desc: 'Ultrabook créatif : écran 16" 3.2K 165Hz 100% DCI-P3, connecteur Magic Bay pour accessoires magnétiques (webcam 4K, flash).' },
  { name: 'Lenovo IdeaPad Pro 5 (AMD Ryzen 7 8845HS / RTX 4050 / 16 Go / 1 To SSD) - Gris Arctique', price: 13990, desc: 'Écran 16" 2.5K 120Hz IPS, Ryzen 7 avec AMD Ryzen AI, RTX 4050 6 Go, rapport performance/prix imbattable.' },
  { name: 'Lenovo ThinkPad E16 Gen 1 (Intel Core i7-1355U / 16 Go / 512 Go SSD) - Noir Graphite', price: 9990, desc: 'PC d entreprise fiable et abordable : écran 16" FHD+ IPS, pavé numérique, sécurité d empreintes digitales intégrée au bouton power.' }
];
lenovoLaptops.forEach((c, i) => add('cat_5', c.name, c.desc, c.price, 7 + i, IMAGES.laptop_pro[(i + 1) % IMAGES.laptop_pro.length]));

// HP Spectre, Envy & EliteBook & Asus Zenbook (13 variantes)
const hpAndAsus = [
  { name: 'HP Spectre x360 16 (Intel Core Ultra 7 155H / RTX 4050 / 32 Go / 1 To SSD) - Noir Nuit et Cuivre', price: 24990, desc: 'Convertible 2-en-1 16" 2.8K OLED tactile 120Hz. Core Ultra 7 avec NPU, RTX 4050 6 Go, stylet HP Tilt Pen rechargeable, webcam 9 Mpx avec cadrage IA.' },
  { name: 'HP Spectre x360 14 (Intel Core Ultra 7 155H / 32 Go / 1 To SSD) - Bleu Ardoise', price: 20990, desc: 'Écran 14" 2.8K OLED tactile 120Hz ratio 16:10, design bijou aux angles taillés, 4 haut-parleurs Poly Studio, autonomie jusqu à 17h.' },
  { name: 'HP Envy x360 15 (AMD Ryzen 7 7730U / 16 Go / 512 Go SSD) - Argent Naturel', price: 11490, desc: 'Écran tactile 15.6" FHD IPS convertible, son Bang & Olufsen, clavier chiclet rétroéclairé, châssis aluminium durable.' },
  { name: 'HP EliteBook 840 G10 (Intel Core i7-1365U / 16 Go / 512 Go SSD) - Argent Métal', price: 14990, desc: 'Référence professionnelle : écran 14" FHD IPS antireflet 400 nits, HP Sure Start auto-réparateur, lecteur Smart Card et empreinte.' },
  { name: 'HP Elite Dragonfly G4 (Intel Core i7-1355U / 32 Go / 1 To SSD) - Bleu Profond', price: 23490, desc: 'Ultrabook de luxe ultra-léger moins de 1 kg en alliage de magnésium recyclé, écran 13.5" ratio 3:2, autonomie record.' },
  { name: 'HP ProBook 450 G10 (Intel Core i5-1335U / 16 Go / 512 Go SSD) - Argent', price: 8990, desc: 'Polyvalent entreprise : écran 15.6" FHD antireflet, clavier résistant aux éclaboussures, Wi-Fi 6E, ports USB-C et HDMI.' },
  { name: 'Asus Zenbook 14 OLED UX3405 (Intel Core Ultra 7 155H / 32 Go / 1 To SSD) - Bleu Ponder', price: 15990, desc: 'Écran 14" 3K OLED 120Hz 100% DCI-P3 0.2ms de temps de réponse. Intel Core Ultra 7 avec NPU IA, batterie 75 Wh géante, 1.2 kg seulement.' },
  { name: 'Asus Zenbook Duo UX8406 (Intel Core Ultra 9 185H / 32 Go / 2 To SSD) - Noir Encre', price: 25990, desc: 'Double écran 14" 3K OLED 120Hz tactiles avec clavier Bluetooth détachable ultra-fin et béquille métallique intégrée.' },
  { name: 'Asus Zenbook S 16 OLED (AMD Ryzen AI 9 365 / 24 Go / 1 To SSD) - Gris Ceraluminum', price: 20490, desc: 'Châssis exclusif en Ceraluminum (céramique high-tech), écran 16" 3K OLED 120Hz, processeur Ryzen AI 9 avec NPU 50 TOPS.' },
  { name: 'Asus Zenbook S 13 OLED (Intel Core i7-1355U / 16 Go / 1 To SSD) - Bleu Basalte', price: 14490, desc: 'L ordinateur portable OLED le plus fin au monde : 1 cm d épaisseur et 1 kg, écran 13.3" 2.8K OLED lumineux et contrasté.' },
  { name: 'Asus Vivobook Pro 15 OLED (Intel Core Ultra 7 / RTX 4060 / 16 Go / 1 To SSD) - Argent', price: 16990, desc: 'Création de contenu assistée : molette rotative Asus DialPad intégrée au pavé tactile, écran 15.6" 3K 120Hz OLED, GPU RTX 4060.' },
  { name: 'Microsoft Surface Laptop 7 Copilot+ (Snapdragon X Elite / 16 Go / 512 Go SSD) - Platine', price: 16990, desc: 'Écran tactile PixelSense Flow 13.8" 120Hz, puce Snapdragon X Elite avec NPU 45 TOPS, autonomie 20h, finition aluminium satiné.' },
  { name: 'Microsoft Surface Pro 11 Copilot+ (Snapdragon X Plus / 16 Go / 512 Go SSD) - Noir', price: 15490, desc: 'Tablette PC détachable hybride : écran 13" OLED 120Hz tactile, processeur ARM haute performance, béquille multi-positions.' }
];
hpAndAsus.forEach((c, i) => add('cat_5', c.name, c.desc, c.price, 8 + i, IMAGES.laptop_pro[(i + 2) % IMAGES.laptop_pro.length]));


// ==========================================
// 7. LAPTOPS GAMING (30 Produits)
// ==========================================
// Asus ROG (10 variantes)
const rogLaptops = [
  { name: 'Asus ROG Strix SCAR 18 (Intel Core i9-14900HX / RTX 4090 / 64 Go / 2 To SSD) - Noir Cyberpunk', price: 49990, desc: 'Le monstre du jeu vidéo : écran 18" ROG Nebula HDR Mini-LED 2.5K 240Hz 1100 nits. Intel Core i9 24 cœurs, GPU Nvidia RTX 4090 16 Go 175W TGP avec métal liquide Conductonaut Extreme.' },
  { name: 'Asus ROG Strix SCAR 16 (Intel Core i9-14900HX / RTX 4080 / 32 Go / 1 To SSD) - Noir', price: 38990, desc: 'Écran 16" Mini-LED 240Hz 2.5K, Core i9 14e gén, RTX 4080 12 Go 175W, barre lumineuse RGB Surround personnalisable Aura Sync.' },
  { name: 'Asus ROG Zephyrus G16 (Intel Core Ultra 9 185H / RTX 4090 / 32 Go / 2 To SSD) - Gris Éclipse', price: 44990, desc: 'L ultrabook gaming ultime : écran 16" ROG Nebula OLED 2.5K 240Hz 0.2ms G-Sync. RTX 4090 dans seulement 1.49 cm d épaisseur et 1.85 kg, châssis alu CNC avec Slash Lighting LED.' },
  { name: 'Asus ROG Zephyrus G16 (Intel Core Ultra 7 155H / RTX 4070 / 32 Go / 1 To SSD) - Blanc Platine', price: 27990, desc: 'Écran 16" OLED 240Hz, RTX 4070 8 Go, 32 Go LPDDR5X, audio à 6 haut-parleurs Dolby Atmos avec woofers à double force.' },
  { name: 'Asus ROG Zephyrus G14 (AMD Ryzen 9 8945HS / RTX 4070 / 32 Go / 1 To SSD) - Gris Éclipse', price: 26490, desc: 'Format ultra-portable 14" ROG Nebula OLED 3K 120Hz, Ryzen 9 avec AMD Ryzen AI, RTX 4070, châssis usiné de 1.5 kg.' },
  { name: 'Asus ROG Zephyrus G14 (AMD Ryzen 7 8845HS / RTX 4060 / 16 Go / 512 Go SSD) - Blanc Platine', price: 19990, desc: 'Écran 14" OLED 3K 120Hz, RTX 4060 8 Go, 16 Go RAM, autonomie exceptionnelle pour un PC gaming (batterie 73 Wh).' },
  { name: 'Asus ROG Strix G16 (Intel Core i7-14650HX / RTX 4060 / 16 Go / 1 To SSD) - Gris Volt', price: 17490, desc: 'Écran 16" FHD+ 165Hz, Core i7 16 cœurs, RTX 4060 140W max TGP, système thermique Tri-Fan avec chambre à vapeur.' },
  { name: 'Asus TUF Gaming A15 (AMD Ryzen 7 7735HS / RTX 4060 / 16 Go / 512 Go SSD) - Gris Mecha', price: 12990, desc: 'Robustesse militaire certifiée : écran 15.6" FHD 144Hz 100% sRGB, RTX 4060 140W, batterie 90 Wh longue durée.' },
  { name: 'Asus TUF Gaming F15 (Intel Core i7-13620H / RTX 4050 / 16 Go / 512 Go SSD) - Noir Jaeger', price: 10990, desc: 'Rapport performances/prix imbattable : écran 15.6" 144Hz, Core i7, RTX 4050 6 Go avec MUX Switch et Nvidia Advanced Optimus.' },
  { name: 'Asus ROG Ally X (AMD Ryzen Z1 Extreme / 24 Go LPDDR5X / 1 To SSD) - Noir Mat', price: 9490, desc: 'Console PC portable haut de gamme : écran tactile 7" FHD 120Hz VRR, Ryzen Z1 Extreme, 24 Go RAM ultra rapide, batterie colossale 80 Wh, Windows 11.' }
];
rogLaptops.forEach((c, i) => add('cat_6', c.name, c.desc, c.price, 4 + i, IMAGES.laptop_gaming[i % IMAGES.laptop_gaming.length]));

// MSI (10 variantes)
const msiLaptops = [
  { name: 'MSI Titan 18 HX A14V (Intel Core i9-14900HX / RTX 4090 / 128 Go / 4 To SSD) - Noir Dragon', price: 64990, desc: 'Le sommet absolu de l ingénierie PC : écran 18" 4K Mini-LED 120Hz 1000 nits. Core i9 24 cœurs, RTX 4090 175W, 128 Go DDR5, 4 To PCIe Gen 5 SSD, clavier mécanique Cherry MX Ultra Low Profile.' },
  { name: 'MSI Raider GE78 HX (Intel Core i9-14900HX / RTX 4080 / 32 Go / 2 To SSD) - Noir Sombre', price: 37990, desc: 'Écran 17" QHD+ 240Hz, Core i9 14e gén, RTX 4080 175W, barre lumineuse Matrix RGB Mystic Light spectaculaire, audio Dynaudio 6 haut-parleurs.' },
  { name: 'MSI Stealth 16 AI Studio (Intel Core Ultra 9 185H / RTX 4070 / 32 Go / 1 To SSD) - Bleu Stellaire', price: 28990, desc: 'Châssis ultra-fin magnésium-aluminium 1.99 kg : écran 16" QHD+ 240Hz OLED, Core Ultra 9 avec NPU IA, RTX 4070 Studio, batterie 99.9 Wh max avion.' },
  { name: 'MSI Stealth 14 AI Studio (Intel Core Ultra 7 155H / RTX 4060 / 16 Go / 1 To SSD) - Blanc Étoilé', price: 20990, desc: 'Format compact 14" 2.8K 120Hz OLED, Core Ultra 7, RTX 4060, chambre à vapeur de refroidissement Vapor Chamber, poids 1.7 kg.' },
  { name: 'MSI Vector 16 HX (Intel Core i9-14900HX / RTX 4080 / 32 Go / 1 To SSD) - Gris Cosmique', price: 29990, desc: 'Puissance pure orientée e-sport : écran 16" QHD+ 240Hz, RTX 4080 175W avec technologie MSI OverBoost Ultra 240W combinée.' },
  { name: 'MSI Katana 17 B13V (Intel Core i7-13620H / RTX 4070 / 16 Go / 1 To SSD) - Noir', price: 16990, desc: 'Grand écran gaming 17.3" FHD 144Hz, Core i7, RTX 4070 8 Go, clavier rétroéclairé RGB 4 zones avec touches ZQSD mises en évidence.' },
  { name: 'MSI Katana 15 B13V (Intel Core i7-13620H / RTX 4060 / 16 Go / 512 Go SSD) - Noir', price: 13990, desc: 'Écran 15.6" FHD 144Hz IPS, Core i7 13e gén, RTX 4060 8 Go GDDR6, refroidissement Cooler Boost 5 à doubles ventilateurs et 6 caloducs.' },
  { name: 'MSI Cyborg 15 A13V (Intel Core i7-13620H / RTX 4060 / 16 Go / 512 Go SSD) - Translucent Black', price: 11990, desc: 'Design cyberpunk semi-transparent futuriste, écran 15.6" FHD 144Hz, RTX 4060, poids réduit à 1.98 kg.' },
  { name: 'MSI Thin 15 (Intel Core i5-12450H / RTX 4050 / 16 Go / 512 Go SSD) - Noir Brossé', price: 8990, desc: 'Entrée dans le gaming moderne : écran 15.6" 144Hz, RTX 4050 6 Go, 16 Go RAM DDR4, profil fin et léger de 1.86 kg.' },
  { name: 'MSI Claw A1M (Intel Core Ultra 7 155H / 16 Go LPDDR5 / 1 To SSD) - Noir', price: 8490, desc: 'Console gaming portable sous Windows 11 avec processeur Intel Core Ultra 7, gâchettes et sticks à effet Hall anti-drift, écran 7" FHD 120Hz.' }
];
msiLaptops.forEach((c, i) => add('cat_6', c.name, c.desc, c.price, 5 + i, IMAGES.laptop_gaming[(i + 1) % IMAGES.laptop_gaming.length]));

// Razer & Lenovo Legion (10 variantes)
const razerAndLegion = [
  { name: 'Razer Blade 16 (Intel Core i9-14900HX / RTX 4090 / 32 Go / 2 To SSD) - Noir Anodisé', price: 52990, desc: 'Le premier écran Dual-Mode Mini-LED au monde : basculez entre 4K 120Hz pour la création et FHD+ 240Hz pour l e-sport. RTX 4090 175W, châssis usiné CNC monobloc T6.' },
  { name: 'Razer Blade 16 (Intel Core i9-14900HX / RTX 4080 / 32 Go / 1 To SSD) - Noir Anodisé', price: 42990, desc: 'Écran 16" QHD+ 240Hz OLED 0.2ms certifié VESA ClearMR 11000, Core i9 24 cœurs, RTX 4080, chambre à vapeur brevetée sous vide.' },
  { name: 'Razer Blade 14 (AMD Ryzen 9 8945HS / RTX 4070 / 32 Go / 1 To SSD) - Noir Mat', price: 29990, desc: 'Le summum de la compacité : écran 14" QHD+ 240Hz 16:10, Ryzen 9 avec NPU IA, RTX 4070 140W, épaisseur 17.99 mm.' },
  { name: 'Razer Blade 14 (AMD Ryzen 9 8945HS / RTX 4060 / 16 Go / 1 To SSD) - Argent Mercure', price: 24990, desc: 'Finition blanche Mercury White élégante, écran 14" 240Hz, RTX 4060, autonomie jusqu à 10 heures en bureautique.' },
  { name: 'Razer Blade 18 (Intel Core i9-14900HX / RTX 4090 / 64 Go / 4 To SSD) - Noir Anodisé', price: 58990, desc: 'Remplacement de PC fixe ultime : écran 18" 4K 200Hz ultra net, premier PC avec Thunderbolt 5 (120 Gb/s), RTX 4090 175W.' },
  { name: 'Lenovo Legion Pro 7i Gen 9 (Intel Core i9-14900HX / RTX 4090 / 32 Go / 2 To SSD) - Gris Éclipse', price: 41990, desc: 'Écran 16" WQXGA 240Hz 500 nits HDR400, Core i9 24 cœurs, RTX 4090 175W optimisée par puce IA Lenovo LA-2Q, refroidissement Legion ColdFront Vapor.' },
  { name: 'Lenovo Legion Pro 7i Gen 9 (Intel Core i9-14900HX / RTX 4080 / 32 Go / 1 To SSD) - Gris Éclipse', price: 33990, desc: 'Écran 16" 240Hz IPS 100% DCI-P3, RTX 4080 12 Go 175W, clavier TrueStrike avec rétroéclairage RGB touche par touche.' },
  { name: 'Lenovo Legion Pro 5i Gen 9 (Intel Core i7-14700HX / RTX 4070 / 32 Go / 1 To SSD) - Gris Onyx', price: 21990, desc: 'Écran 16" 2.5K 240Hz, Core i7 20 cœurs, RTX 4070 140W, 32 Go DDR5 5600MHz, suite logicielle Lenovo Vantage.' },
  { name: 'Lenovo Legion 5i Gen 9 (Intel Core i7-14650HX / RTX 4060 / 16 Go / 1 To SSD) - Gris Lune', price: 16490, desc: 'Écran 16" 165Hz 100% sRGB, Core i7 16 cœurs, RTX 4060 140W, châssis aluminium sobre et discret pour travail et jeu.' },
  { name: 'Lenovo LOQ 15IRX9 (Intel Core i7-13650HX / RTX 4060 / 16 Go / 512 Go SSD) - Gris Lunaire', price: 12490, desc: 'Le meilleur rapport qualité/prix de Lenovo : écran 15.6" FHD 144Hz 100% sRGB avec G-Sync, Core i7 HX, RTX 4060 115W.' }
];
razerAndLegion.forEach((c, i) => add('cat_6', c.name, c.desc, c.price, 4 + i, IMAGES.laptop_gaming[(i + 2) % IMAGES.laptop_gaming.length]));


// ==========================================
// 8. TABLETTES & IPADS (25 Produits)
// ==========================================
// iPad Pro M4 (6 variantes)
const ipadProM4 = [
  { name: 'Apple iPad Pro 13" M4 (256 Go / Wi-Fi) - Noir Sidéral', price: 16990, desc: 'Le produit Apple le plus fin jamais créé (5.1 mm). Écran Ultra Retina XDR Tandem OLED révolutionnaire 1000 nits plein écran et 1600 nits HDR, puce Apple M4 surpuissante avec Neural Engine 38 TOPS, compatible Apple Pencil Pro.' },
  { name: 'Apple iPad Pro 13" M4 (512 Go / Wi-Fi + Cellular 5G) - Argent', price: 21490, desc: 'Tandem OLED 13", puce M4, connectivité 5G mondiale ultra-rapide, 512 Go de stockage NVMe, caméra 12 Mpx LiDAR et flash True Tone adaptatif.' },
  { name: 'Apple iPad Pro 13" M4 (1 To / Verre Nano-texturé / Wi-Fi) - Noir Sidéral', price: 26990, desc: 'Verre nano-texturé anti-reflets pour créatifs exigeants, puce M4 version 10 cœurs CPU / 10 cœurs GPU avec 16 Go de RAM unifiée, 1 To stockage.' },
  { name: 'Apple iPad Pro 11" M4 (256 Go / Wi-Fi) - Noir Sidéral', price: 12990, desc: 'Format nomade parfait : 5.3 mm d épaisseur, écran Ultra Retina XDR Tandem OLED 11" ProMotion 120Hz, puce Apple M4 3nm.' },
  { name: 'Apple iPad Pro 11" M4 (512 Go / Wi-Fi) - Argent', price: 15490, desc: 'Écran Tandem OLED 11", puce M4, 512 Go, 4 haut-parleurs de qualité studio, 4 micros de qualité professionnelle, port Thunderbolt / USB 4.' },
  { name: 'Apple iPad Pro 11" M4 (1 To / Wi-Fi + Cellular 5G) - Noir Sidéral', price: 22990, desc: '1 To de stockage, 16 Go RAM unifiée, connexion 5G Gigabit, compatible Magic Keyboard flottant en aluminium.' }
];
ipadProM4.forEach((c, i) => add('cat_7', c.name, c.desc, c.price, 8 + i, IMAGES.tablets[0]));

// iPad Air M2 & iPad 10 & mini (8 variantes)
const ipadAirAndOthers = [
  { name: 'Apple iPad Air 13" M2 (128 Go / Wi-Fi) - Bleu Pastel', price: 10490, desc: 'Premier iPad Air en grand format 13" Liquid Retina, puce Apple M2 véloce, caméra avant paysage 12 Mpx avec Cadre centré, son stéréo spatialisé.' },
  { name: 'Apple iPad Air 13" M2 (256 Go / Wi-Fi) - Lumière Stellaire', price: 11990, desc: 'Écran 13", 256 Go, puce M2 avec GPU 10 cœurs, compatible avec le nouveau stylet Apple Pencil Pro (détection de rotation et retour haptique).' },
  { name: 'Apple iPad Air 11" M2 (128 Go / Wi-Fi) - Gris Sidéral', price: 7990, desc: 'Écran 11" Liquid Retina avec revêtement antireflet et True Tone, puce Apple M2, Touch ID intégré au bouton supérieur.' },
  { name: 'Apple iPad Air 11" M2 (256 Go / Wi-Fi) - Mauve', price: 9490, desc: 'Puce M2, 256 Go stockage, Wi-Fi 6E ultra rapide, autonomie journée complète pour les études et la création.' },
  { name: 'Apple iPad 10e Génération (64 Go / Wi-Fi) - Bleu Éclatant', price: 4790, desc: 'Design tout écran moderne 10.9" Liquid Retina, puce A14 Bionic, port USB-C universel, caméra avant paysage 12 Mpx Ultra Grand-angle.' },
  { name: 'Apple iPad 10e Génération (256 Go / Wi-Fi) - Jaune Soleil', price: 6490, desc: 'Écran 10.9", 256 Go, compatibilité Apple Pencil (USB-C) et Magic Keyboard Folio avec trackpad intégré.' },
  { name: 'Apple iPad 9e Génération (64 Go / Wi-Fi) - Gris Sidéral', price: 3490, desc: 'La tablette la plus accessible d Apple : écran 10.2" Retina, puce A13 Bionic, bouton Touch ID, prise casque jack 3.5mm.' },
  { name: 'Apple iPad mini 6 (64 Go / Wi-Fi) - Mauve', price: 6290, desc: 'Puissance de poche : écran Liquid Retina 8.3", puce A15 Bionic, compatibilité Apple Pencil 2 avec fixation et charge magnétique.' }
];
ipadAirAndOthers.forEach((c, i) => add('cat_7', c.name, c.desc, c.price, 12 + i, IMAGES.tablets[1]));

// Samsung Galaxy Tab S9 & Tab S9 FE & Autres (11 variantes)
const androidTablets = [
  { name: 'Samsung Galaxy Tab S9 Ultra (512 Go / 12 Go / Wi-Fi) - Anthracite', price: 14490, desc: 'Tablette géante ultime : écran Dynamic AMOLED 2X 14.6" 120Hz immersif, Snapdragon 8 Gen 2 for Galaxy, stylet S-Pen étanche inclus dans la boîte, certification IP68.' },
  { name: 'Samsung Galaxy Tab S9 Ultra (256 Go / 12 Go / 5G) - Beige', price: 14990, desc: 'Écran 14.6" AMOLED 120Hz, connectivité 5G nomade, multitâche Samsung DeX sans fil comme un PC de bureau, 4 haut-parleurs AKG.' },
  { name: 'Samsung Galaxy Tab S9+ (256 Go / 12 Go / Wi-Fi) - Anthracite', price: 11290, desc: 'Écran 12.4" Dynamic AMOLED 2X 120Hz, Snapdragon 8 Gen 2, batterie 10090 mAh charge 45W, double capteur arrière 13+8 Mpx.' },
  { name: 'Samsung Galaxy Tab S9 (128 Go / 8 Go / Wi-Fi) - Beige', price: 8990, desc: 'Écran 11" Dynamic AMOLED 2X 120Hz éclatant, S-Pen ultra précis à latence réduite 2.8ms, étanchéité IP68 eau et poussière.' },
  { name: 'Samsung Galaxy Tab S9 FE+ (128 Go / 8 Go / Wi-Fi) - Gris Argent', price: 6890, desc: 'Grand écran 12.4" 90Hz lumineux 600 nits Vision Booster, S-Pen fourni, batterie endurante 10090 mAh, résistance IP68.' },
  { name: 'Samsung Galaxy Tab S9 FE (128 Go / 6 Go / Wi-Fi) - Vert Menthe', price: 4990, desc: 'Écran 10.9" 90Hz, stylet S-Pen inclus, autonomie jusqu à 18h de vidéo, son stéréo signé AKG.' },
  { name: 'Samsung Galaxy Tab A9+ (128 Go / 8 Go / 5G) - Bleu Marine', price: 2990, desc: 'Écran 11" 90Hz fluide, processeur Snapdragon 695 5G, 4 haut-parleurs Dolby Atmos, mode multi-fenêtres 3 applications.' },
  { name: 'Samsung Galaxy Tab A9 (64 Go / 4 Go / Wi-Fi) - Argent', price: 1690, desc: 'Tablette compacte et familiale 8.7", processeur MediaTek Helio G99 réactif, stockage extensible jusqu à 1 To par microSD.' },
  { name: 'Samsung Galaxy Tab S9 FE+ (256 Go / 12 Go / 5G) - Argent Polaire', price: 8490, desc: 'Tablette 12.4" 90Hz, 12 Go RAM et connectivité 5G, stylet S-Pen étanche inclus, autonomie 10090 mAh.' },
  { name: 'Apple iPad Air 11" M2 (512 Go / Wi-Fi + 5G) - Gris Sidéral', price: 12490, desc: 'Puce M2 avec connectivité cellulaire 5G, 512 Go de stockage NVMe, écran Liquid Retina 11" antireflet, compatible Apple Pencil Pro.' },
  { name: 'Xiaomi Pad 6 (128 Go / 6 Go) - Gris Gravité', price: 3290, desc: 'Écran 11" WQHD+ 144Hz 7 vitesses, processeur Snapdragon 870, 4 haut-parleurs Dolby Atmos stéréo.' },
  { name: 'Xiaomi Pad 6 (256 Go / 8 Go) - Bleu Brume', price: 3890, desc: 'Écran 11" WQHD+ 144Hz 7 vitesses adaptatif, Snapdragon 870 puissant, 4 haut-parleurs Dolby Atmos, corps monobloc en métal fin 6.51 mm.' },
  { name: 'Xiaomi Pad 6S Pro 12.4 (512 Go / 12 Go) - Noir Graphite', price: 6990, desc: 'Écran 12.4" 3K 144Hz 900 nits ratio 3:2, Snapdragon 8 Gen 2, HyperCharge 120W fulgurante (100% en 35 min), Xiaomi HyperOS.' },
  { name: 'OnePlus Pad 2 (256 Go / 12 Go) - Gris Tempête', price: 5490, desc: 'Écran 12.1" 3K 144Hz ratio de lecture 7:5, processeur Snapdragon 8 Gen 3 flagship, 6 haut-parleurs avec technologie Omnibearing Sound, charge 67W.' }
];
androidTablets.forEach((c, i) => add('cat_7', c.name, c.desc, c.price, 10 + i, IMAGES.tablets[2]));

console.log(`Nombre total de produits préparés : ${productsList.length}`);

const seedsDir = path.resolve('c:/Users/hp/Desktop/Projet-Cursor/Projet-Ecommerce-Fillali/database/seeds');
if (!fs.existsSync(seedsDir)) {
  fs.mkdirSync(seedsDir, { recursive: true });
}

// 1. Fichier 00_reset_and_categories.sql
const sqlResetAndCategories = `-- ==============================================================================
-- 00_reset_and_categories.sql : Initialisation des Catégories
-- ==============================================================================

-- Optionnel : vider les anciennes données si vous souhaitez repartir à zéro
-- delete from order_items;
-- delete from orders;
-- delete from products;
-- delete from categories;

INSERT INTO categories (name) VALUES
  ('Apple iPhone'),
  ('Samsung Galaxy'),
  ('Google Pixel'),
  ('Xiaomi & OnePlus'),
  ('Apple MacBook'),
  ('Laptops Professionnels (Dell, Lenovo, HP)'),
  ('Laptops Gaming (Asus ROG, MSI, Razer)'),
  ('Tablettes & iPads')
ON CONFLICT (name) DO NOTHING;
`;
fs.writeFileSync(path.join(seedsDir, '00_reset_and_categories.sql'), sqlResetAndCategories, 'utf-8');

// 2. Fichier 01_security_rls.sql
const sqlSecurityRLS = `-- ==============================================================================
-- 01_security_rls.sql : Configuration de la sécurité et politiques RLS
-- ==============================================================================

-- Autoriser la lecture publique des catalogues (produits et catégories)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique categories" ON categories;
CREATE POLICY "Lecture publique categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lecture publique products" ON products;
CREATE POLICY "Lecture publique products" ON products FOR SELECT USING (true);

-- Désactiver RLS sur les tables de commande et d'utilisateurs pour les requêtes backend
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
`;
fs.writeFileSync(path.join(seedsDir, '01_security_rls.sql'), sqlSecurityRLS, 'utf-8');

// 3. Fichiers par catégorie
const categoryFiles = [
  { catVar: 'cat_0', name: 'Apple iPhone', filename: '02_seed_apple_iphone.sql', comment: '35 Apple iPhone (16, 15, 14, 13, SE)' },
  { catVar: 'cat_1', name: 'Samsung Galaxy', filename: '03_seed_samsung_galaxy.sql', comment: '35 Samsung Galaxy (S24 Ultra, Z Fold 6, Z Flip 6, S23, Série A)' },
  { catVar: 'cat_2', name: 'Google Pixel', filename: '04_seed_google_pixel.sql', comment: '25 Google Pixel (9 Pro XL, 9 Fold, 8 Pro, 8a, 7a)' },
  { catVar: 'cat_3', name: 'Xiaomi & OnePlus', filename: '05_seed_xiaomi_oneplus_android.sql', comment: '35 Xiaomi, OnePlus, POCO, Nothing, Honor' },
  { catVar: 'cat_4', name: 'Apple MacBook', filename: '06_seed_apple_macbook.sql', comment: '30 Apple MacBook Pro & MacBook Air (M3 Max, M3 Pro, M3, M2, M1)' },
  { catVar: 'cat_5', name: 'Laptops Professionnels (Dell, Lenovo, HP)', filename: '07_seed_laptops_professionnels.sql', comment: '35 Laptops Professionnels (Dell XPS, ThinkPad X1, HP Spectre, Zenbook, Surface)' },
  { catVar: 'cat_6', name: 'Laptops Gaming (Asus ROG, MSI, Razer)', filename: '08_seed_laptops_gaming.sql', comment: '30 Laptops Gaming Extrêmes (ROG Strix SCAR, MSI Titan, Razer Blade, Legion, ROG Ally)' },
  { catVar: 'cat_7', name: 'Tablettes & iPads', filename: '09_seed_tablettes_ipads.sql', comment: '25 Tablettes & iPads (iPad Pro M4, iPad Air M2, Galaxy Tab S9 Ultra, Xiaomi Pad 6S Pro)' }
];

categoryFiles.forEach(cf => {
  const prods = productsList.filter(p => p.catVar === cf.catVar);
  const rows = prods.map(p => `    ('${escapeSql(p.name)}', '${escapeSql(p.description)}', ${p.price.toFixed(2)}, ${p.stock}, '${p.image_url}', target_cat_id)`);

  const fileSql = `-- ==============================================================================
-- ${cf.filename} : ${cf.comment} (${prods.length} Produits)
-- ==============================================================================

DO $$
DECLARE
  target_cat_id uuid;
BEGIN
  -- Garantir l'existence de la catégorie
  INSERT INTO categories (name) VALUES ('${escapeSql(cf.name)}') ON CONFLICT (name) DO NOTHING;
  SELECT id INTO target_cat_id FROM categories WHERE name = '${escapeSql(cf.name)}';

  -- Insertion des ${prods.length} produits de la catégorie
  INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
${rows.join(',\n')};
END $$;
`;

  fs.writeFileSync(path.join(seedsDir, cf.filename), fileSql, 'utf-8');
});

// 4. Générer aussi le fichier consolidé seed.sql (250 produits en un seul fichier)
let sql = `-- ==============================================================================
-- Script d'initialisation global (Seed) TechNova Store - Catalogue Premium de 250 Produits
-- Smartphones (iPhone, Samsung, Pixel, Xiaomi, OnePlus), Laptops (MacBook, Dell, Lenovo, HP, Asus ROG, MSI, Razer) et Tablettes
-- Prix en Dirhams Marocains (MAD)
-- ==============================================================================

-- 1. Nettoyage propre des tables existantes
delete from order_items;
delete from orders;
delete from products;
delete from categories;

-- 2. Insertion des 8 Catégories
insert into categories (name) values
  ('Apple iPhone'),
  ('Samsung Galaxy'),
  ('Google Pixel'),
  ('Xiaomi & OnePlus'),
  ('Apple MacBook'),
  ('Laptops Professionnels (Dell, Lenovo, HP)'),
  ('Laptops Gaming (Asus ROG, MSI, Razer)'),
  ('Tablettes & iPads');

-- 3. Insertion des 250 Produits
do $$
declare
  cat_0 uuid;
  cat_1 uuid;
  cat_2 uuid;
  cat_3 uuid;
  cat_4 uuid;
  cat_5 uuid;
  cat_6 uuid;
  cat_7 uuid;
begin
  select id into cat_0 from categories where name = 'Apple iPhone';
  select id into cat_1 from categories where name = 'Samsung Galaxy';
  select id into cat_2 from categories where name = 'Google Pixel';
  select id into cat_3 from categories where name = 'Xiaomi & OnePlus';
  select id into cat_4 from categories where name = 'Apple MacBook';
  select id into cat_5 from categories where name = 'Laptops Professionnels (Dell, Lenovo, HP)';
  select id into cat_6 from categories where name = 'Laptops Gaming (Asus ROG, MSI, Razer)';
  select id into cat_7 from categories where name = 'Tablettes & iPads';

  insert into products (name, description, price, stock, image_url, category_id) values
`;

const rows = productsList.map(p => {
  return `  ('${escapeSql(p.name)}', '${escapeSql(p.description)}', ${p.price.toFixed(2)}, ${p.stock}, '${p.image_url}', ${p.catVar})`;
});

sql += rows.join(',\n') + ';\nend $$;\n';

const outPath = path.resolve('c:/Users/hp/Desktop/Projet-Cursor/Projet-Ecommerce-Fillali/database/seed.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log(`Tous les scripts SQL modulaires et le script global ont été créés avec succès !`);
