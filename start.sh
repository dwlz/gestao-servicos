#!/bin/bash
echo "🚀 Iniciando Deploy Unificado..."
set -e


# 1. Build Frontend
echo "📦 Buildando Frontend..."
cd frontend
# Força a instalação das devDependencies (necessário para o Vite funcionar se NODE_ENV=production)
npm install --production=false
npm run build
cd ..

# 2. Start Backend (que serve o Frontend)
echo "🐍 Iniciando Backend..."
cd backend
echo "📂 Diretório atual: $(pwd)"
ls -la
if [ -f "requirements.txt" ]; then
    echo "✅ requirements.txt encontrado. Instalando dependências..."
    pip install -r requirements.txt
else
    echo "❌ FALHA CRÍTICA: requirements.txt não encontrado no diretório backend!"
    echo "Listando diretório pai..."
    ls -la ..
fi
python run.py
