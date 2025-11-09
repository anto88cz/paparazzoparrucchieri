# 🚀 Quick Deploy Guide

## Deploy su VPS in 5 minuti

### 1️⃣ Push su GitHub
```bash
cd C:\Users\Utente\Desktop\bot\paparazzo
git add .
git commit -m "Ready for production deploy"
git push origin main
```

### 2️⃣ Connetti al VPS
```bash
ssh root@YOUR_VPS_IP
```

### 3️⃣ Clona e Deploy
```bash
cd /var/www
git clone https://github.com/anto88cz/styleai-salone.git paparazzo-salon
cd paparazzo-salon
chmod +x deploy-vps.sh
sudo bash deploy-vps.sh
```

### 4️⃣ Configura Environment
```bash
nano .env.local
# Copia le tue variabili da locale
```

### 5️⃣ Verifica
```bash
pm2 status
pm2 logs paparazzo-app
```

Visita: **https://paparazzoparrucchieri.it** 🎉

---

📖 **Guida completa:** [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

🔧 **Script automatico:** [deploy-vps.sh](./deploy-vps.sh)
