/**
 * Utilitaire pour générer le lien WhatsApp avec le récapitulatif de la commande
 */
export const generateWhatsAppLink = (order, items, customerName) => {
  const whatsappNumber = process.env.WHATSAPP_NUMBER || '212600000000';

  // Construction du message ligne par ligne
  let lines = [
    'Bonjour, je souhaite commander :',
  ];

  for (const item of items) {
    const lineTotal = Number(item.unit_price) * item.quantity;
    lines.push(`- ${item.quantity} x ${item.product_name} : ${lineTotal.toFixed(2)} MAD`);
  }

  lines.push(`Total : ${Number(order.total).toFixed(2)} MAD`);
  lines.push(`Nom : ${customerName}`);
  lines.push(`Commande n° ${order.id}`);

  const fullMessage = lines.join('\n');
  const encodedMessage = encodeURIComponent(fullMessage);

  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
};

