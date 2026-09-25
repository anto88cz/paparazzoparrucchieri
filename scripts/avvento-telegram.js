/**
 * Bot Telegram del Calendario dell'Avvento.
 *
 *   node scripts/avvento-telegram.js setup https://paparazzoparrucchieri.it
 *       → collega il bot al sito (webhook) e registra i comandi. Da eseguire una volta sul server.
 *
 *   node scripts/avvento-telegram.js poll [http://localhost:3000]
 *       → solo per prove in locale: legge i messaggi del bot e li inoltra al sito locale.
 */
require('dotenv').config({ path: '.env.local', quiet: true });

const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!token || !secret) {
  console.error('Servono TELEGRAM_BOT_TOKEN e TELEGRAM_WEBHOOK_SECRET in .env.local');
  process.exit(1);
}
const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  }).then((r) => r.json());

const COMMANDS = [
  { command: 'test', description: 'Invia un ordine di prova' },
  { command: 'stato', description: 'Pezzi ancora disponibili online' },
  { command: 'iscritti', description: "Chi vuole essere avvisato all'apertura" },
];

async function setup(base) {
  const url = `${base.replace(/\/$/, '')}/api/avvento/telegram/webhook`;
  const w = await api('setWebhook', { url, secret_token: secret, allowed_updates: ['message'] });
  const c = await api('setMyCommands', { commands: COMMANDS });
  console.log('Webhook:', w.ok ? `OK → ${url}` : w.description);
  console.log('Comandi:', c.ok ? 'OK' : c.description);
}

async function poll(base) {
  const target = `${base.replace(/\/$/, '')}/api/avvento/telegram/webhook`;
  await api('deleteWebhook');
  await api('setMyCommands', { commands: COMMANDS });
  console.log(`In ascolto… i messaggi al bot vengono inoltrati a ${target} (Ctrl+C per uscire)`);
  let offset = 0;
  for (;;) {
    try {
      const res = await api('getUpdates', { offset, timeout: 30, allowed_updates: ['message'] });
      for (const u of res.result || []) {
        offset = u.update_id + 1;
        await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': secret },
          body: JSON.stringify(u),
        });
        console.log('→', u.message?.text);
      }
    } catch (err) {
      console.error('Errore:', err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

const [mode, base] = process.argv.slice(2);
if (mode === 'setup' && base) setup(base);
else if (mode === 'poll') poll(base || 'http://localhost:3000');
else console.log('Uso: node scripts/avvento-telegram.js setup <url-sito> | poll [url-locale]');
