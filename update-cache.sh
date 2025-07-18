#!/bin/bash

# Script para actualizar automáticamente las versiones de caché
# Uso: ./update-cache.sh

echo "🔄 Actualizando versiones de caché..."

# Generar timestamp único
TIMESTAMP=$(date +%Y%m%d%H%M)
echo "📅 Usando timestamp: $TIMESTAMP"

# Actualizar referencias en index.html
echo "📝 Actualizando index.html..."
sed -i.bak "s/main\.css?v=[^\"]*\"/main.css?v=$TIMESTAMP\"/g" index.html
sed -i.bak "s/main\.js?v=[^\"]*\"/main.js?v=$TIMESTAMP\"/g" index.html

# Actualizar Service Worker
echo "🔧 Actualizando Service Worker..."
sed -i.bak "s/CACHE_NAME = 'dc-chile-v[^']*'/CACHE_NAME = 'dc-chile-v2.0-$TIMESTAMP'/g" sw.js
sed -i.bak "s/main\.css?v=[^']*'/main.css?v=$TIMESTAMP'/g" sw.js
sed -i.bak "s/main\.js?v=[^']*'/main.js?v=$TIMESTAMP'/g" sw.js

# Limpiar archivos de respaldo
rm -f index.html.bak sw.js.bak

echo "✅ Cache actualizado con versión: $TIMESTAMP"
echo "💡 No olvides hacer commit y push de los cambios!"

# Opcional: hacer commit automáticamente
read -p "¿Hacer commit automáticamente? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add index.html sw.js
    git commit -m "chore: Update cache version to $TIMESTAMP"
    echo "📦 Commit realizado!"
    
    read -p "¿Hacer push a GitHub? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main
        echo "🚀 Push realizado! Tu sitio se actualizará en unos minutos."
    fi
fi
