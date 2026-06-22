cd C:\Users\steve\CodeBuddy\20260615110233\tyr-agent

# Supprimer node_modules et package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Réinstaller toutes les dépendances
npm install