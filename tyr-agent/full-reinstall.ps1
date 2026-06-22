# Script de réinstallation des dépendances
$projectPath = "C:\Users\steve\CodeBuddy\20260615110233\tyr-agent"
$nodeModulesPath = Join-Path $projectPath "node_modules"
$packageLockPath = Join-Path $projectPath "package-lock.json"

Write-Host "=== Démarrage de la réinstallation ==="

# Vérifier si node_modules existe
if (Test-Path $nodeModulesPath) {
    Write-Host "Suppression de node_modules..."
    try {
        Remove-Item -Path $nodeModulesPath -Recurse -Force -ErrorAction Stop
        Write-Host "node_modules supprimé avec succès"
    } catch {
        Write-Host "Erreur lors de la suppression de node_modules: $_"
    }
} else {
    Write-Host "node_modules n'existe pas"
}

# Vérifier si package-lock.json existe
if (Test-Path $packageLockPath) {
    Write-Host "Suppression de package-lock.json..."
    Remove-Item -Path $packageLockPath -Force
    Write-Host "package-lock.json supprimé"
}

# Se déplacer dans le dossier du projet
Set-Location $projectPath

# Installer les dépendances
Write-Host "Installation des dépendances..."
npm install

if ($?) {
    Write-Host "=== Installation terminée avec succès ==="
} else {
    Write-Host "=== Erreur lors de l'installation ==="
}