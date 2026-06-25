interface EmailTemplateData {
  [key: string]: string | number | boolean | undefined
}

const emailStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f8fafc;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
    padding: 24px 32px;
    text-align: center;
  }
  .header h1 {
    color: #ffffff;
    font-size: 20px;
    margin: 0;
    font-weight: 600;
  }
  .header .logo {
    font-size: 28px;
    font-weight: 700;
    color: #ff6b35;
    letter-spacing: 1px;
  }
  .content {
    padding: 32px;
  }
  .content h2 {
    color: #1e3a5f;
    font-size: 18px;
    margin: 0 0 16px 0;
    font-weight: 600;
  }
  .content p {
    color: #475569;
    font-size: 14px;
    line-height: 1.8;
    margin: 0 0 16px 0;
  }
  .content strong {
    color: #1e3a5f;
  }
  .info-box {
    background-color: #f1f5f9;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .info-box h3 {
    color: #1e3a5f;
    font-size: 14px;
    margin: 0 0 12px 0;
    font-weight: 600;
  }
  .info-box .info-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .info-box .info-item:last-child {
    border-bottom: none;
  }
  .info-box .info-label {
    color: #64748b;
    font-size: 13px;
  }
  .info-box .info-value {
    color: #1e3a5f;
    font-size: 13px;
    font-weight: 500;
  }
  .button {
    display: inline-block;
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: #ffffff;
    padding: 14px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
    transition: transform 0.2s;
  }
  .button:hover {
    transform: translateY(-2px);
  }
  .footer {
    background-color: #f8fafc;
    padding: 20px 32px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
  }
  .footer p {
    color: #94a3b8;
    font-size: 12px;
    margin: 0;
  }
  .footer a {
    color: #1e3a5f;
    text-decoration: none;
    font-weight: 500;
  }
  .highlight {
    color: #ff6b35;
    font-weight: 600;
  }
`

export function createProjectConfirmationEmail(data: {
  clientName: string
  projectTitle: string
  projectId: string
  totalCost: number
  sellingPrice: number
  margin: number
  currency: string
  status: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Confirmation de projet - TYR Agent</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TYR Agent</div>
          <h1>Confirmation de votre projet</h1>
        </div>
        <div class="content">
          <p>Cher <strong>${data.clientName}</strong>,</p>
          <p>Nous vous confirmons la création de votre projet <strong>${data.projectTitle}</strong>.</p>
          
          <div class="info-box">
            <h3>Détails du projet</h3>
            <div class="info-item">
              <span class="info-label">ID Projet</span>
              <span class="info-value">#${data.projectId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Statut</span>
              <span class="info-value">${data.status}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Coût total</span>
              <span class="info-value">${data.totalCost.toLocaleString('fr-FR')} ${data.currency}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Prix de vente</span>
              <span class="info-value">${data.sellingPrice.toLocaleString('fr-FR')} ${data.currency}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Marge estimée</span>
              <span class="info-value" style="color: #22c55e;">+${data.margin.toLocaleString('fr-FR')} ${data.currency}</span>
            </div>
          </div>
          
          <p>Nous vous tiendrons informé(e) de l'évolution de votre projet à chaque étape.</p>
          <p>Pour suivre votre projet en temps réel, connectez-vous à votre compte.</p>
          
          <a href="https://tyr-agent.vercel.app/projects/${data.projectId}" class="button">Voir mon projet</a>
        </div>
        <div class="footer">
          <p>TYR Agent - Votre partenaire d'importation depuis la Chine</p>
          <p><a href="https://tyr-agent.vercel.app">www.tyragent.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function createProjectUpdateEmail(data: {
  clientName: string
  projectTitle: string
  projectId: string
  oldStatus: string
  newStatus: string
  description: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Mise à jour de projet - TYR Agent</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TYR Agent</div>
          <h1>Mise à jour de votre projet</h1>
        </div>
        <div class="content">
          <p>Cher <strong>${data.clientName}</strong>,</p>
          <p>Votre projet <strong>${data.projectTitle}</strong> a été mis à jour.</p>
          
          <div class="info-box">
            <h3>Évolution du statut</h3>
            <div class="info-item">
              <span class="info-label">Ancien statut</span>
              <span class="info-value">${data.oldStatus}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Nouveau statut</span>
              <span class="info-value" style="color: #22c55e;">${data.newStatus}</span>
            </div>
          </div>
          
          <p>${data.description}</p>
          
          <a href="https://tyr-agent.vercel.app/projects/${data.projectId}" class="button">Voir les détails</a>
        </div>
        <div class="footer">
          <p>TYR Agent - Votre partenaire d'importation depuis la Chine</p>
          <p><a href="https://tyr-agent.vercel.app">www.tyragent.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function createOrderRequestEmail(data: {
  agentName: string
  clientName: string
  clientContact: string
  productDescription: string
  budget: number | null
  currency: string
  notes: string | null
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Nouvelle demande de commande - TYR Agent</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TYR Agent</div>
          <h1>Nouvelle demande de commande</h1>
        </div>
        <div class="content">
          <p>Cher <strong>${data.agentName}</strong>,</p>
          <p>Un nouveau client a soumis une demande de commande.</p>
          
          <div class="info-box">
            <h3>Informations du client</h3>
            <div class="info-item">
              <span class="info-label">Nom</span>
              <span class="info-value">${data.clientName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Contact</span>
              <span class="info-value">${data.clientContact}</span>
            </div>
          </div>
          
          <div class="info-box">
            <h3>Détails de la demande</h3>
            <div class="info-item">
              <span class="info-label">Produit</span>
              <span class="info-value">${data.productDescription}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Budget</span>
              <span class="info-value">${data.budget ? data.budget.toLocaleString('fr-FR') + ' ' + data.currency : 'Non spécifié'}</span>
            </div>
            ${data.notes ? `
            <div class="info-item">
              <span class="info-label">Notes</span>
              <span class="info-value">${data.notes}</span>
            </div>
            ` : ''}
          </div>
          
          <p>Veuillez traiter cette demande dans les plus brefs délais.</p>
          
          <a href="https://tyr-agent.vercel.app/dashboard" class="button">Accéder au tableau de bord</a>
        </div>
        <div class="footer">
          <p>TYR Agent - Votre partenaire d'importation depuis la Chine</p>
          <p><a href="https://tyr-agent.vercel.app">www.tyragent.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function createPaymentReminderEmail(data: {
  clientName: string
  projectTitle: string
  projectId: string
  amountDue: number
  currency: string
  dueDate: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rappel de paiement - TYR Agent</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TYR Agent</div>
          <h1>Rappel de paiement</h1>
        </div>
        <div class="content">
          <p>Cher <strong>${data.clientName}</strong>,</p>
          <p>Nous vous rappelons qu'un paiement est dû pour votre projet <strong>${data.projectTitle}</strong>.</p>
          
          <div class="info-box">
            <h3>Détails du paiement</h3>
            <div class="info-item">
              <span class="info-label">ID Projet</span>
              <span class="info-value">#${data.projectId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Montant dû</span>
              <span class="info-value" style="color: #ef4444; font-weight: 600;">${data.amountDue.toLocaleString('fr-FR')} ${data.currency}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date limite</span>
              <span class="info-value">${data.dueDate}</span>
            </div>
          </div>
          
          <p>Pour éviter tout retard dans la livraison de votre commande, veuillez effectuer le paiement avant la date limite.</p>
          
          <a href="https://tyr-agent.vercel.app/projects/${data.projectId}" class="button">Voir les détails de paiement</a>
        </div>
        <div class="footer">
          <p>TYR Agent - Votre partenaire d'importation depuis la Chine</p>
          <p><a href="https://tyr-agent.vercel.app">www.tyragent.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function createShippingNotificationEmail(data: {
  clientName: string
  projectTitle: string
  projectId: string
  trackingNumber: string
  carrier: string
  estimatedDelivery: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Votre commande a été expédiée - TYR Agent</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TYR Agent</div>
          <h1>Votre commande a été expédiée !</h1>
        </div>
        <div class="content">
          <p>Cher <strong>${data.clientName}</strong>,</p>
          <p>Nous vous informons que votre projet <strong>${data.projectTitle}</strong> a été expédié.</p>
          
          <div class="info-box">
            <h3>Informations de suivi</h3>
            <div class="info-item">
              <span class="info-label">ID Projet</span>
              <span class="info-value">#${data.projectId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Transporteur</span>
              <span class="info-value">${data.carrier}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Numéro de suivi</span>
              <span class="info-value" style="font-family: monospace;">${data.trackingNumber}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Livraison estimée</span>
              <span class="info-value">${data.estimatedDelivery}</span>
            </div>
          </div>
          
          <p>Vous pouvez suivre en temps réel l'état de votre colis depuis votre compte.</p>
          
          <a href="https://tyr-agent.vercel.app/projects/${data.projectId}" class="button">Suivre ma commande</a>
        </div>
        <div class="footer">
          <p>TYR Agent - Votre partenaire d'importation depuis la Chine</p>
          <p><a href="https://tyr-agent.vercel.app">www.tyragent.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}
