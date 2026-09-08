# ---------------------------------------------------------------------------
# Kingdom Duels - build de produccion local (control previo al push)
#
#   .\predeploy.ps1
#
# QUE HACE
# --------
# Reproduce exactamente lo que corre GitHub Actions al pushear a main:
#   HUGO_ENVIRONMENT=production  hugo --gc --minify
# Borra public/ antes, para que el resultado sea desde cero y no queden
# sobras de builds anteriores.
#
# PARA QUE SIRVE
# --------------
# NO hace falta para desplegar: Actions construye el sitio desde el fuente en
# un runner limpio, y public/ ni siquiera se sube al repo (esta en .gitignore).
#
# Sirve como CONTROL: 'hugo server' corre en modo development y NO ejercita el
# minificado, el fingerprint de los assets ni los hashes de integridad SRI.
# Un problema en esa parte solo aparece en produccion. Este script lo detecta
# en tu maquina en vez de en un deploy roto.
#
# Conviene correrlo antes de pushear a main.
# ---------------------------------------------------------------------------

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "  Build de produccion (igual que GitHub Actions)" -ForegroundColor Cyan
Write-Host ""

# 1. Limpiar la salida anterior
if (Test-Path "public") {
    Write-Host "  Borrando public/ ..." -ForegroundColor DarkGray
    Remove-Item -Recurse -Force "public"
}

# 2. Mismas variables de entorno que el workflow
$env:HUGO_ENVIRONMENT = "production"
$env:TZ = "America/Los_Angeles"

# 3. Mismo comando que el workflow.
#    Hugo manda el resumen por stdout y los avisos por stderr. En Windows
#    PowerShell 5.1 cualquier redireccion de stderr de un .exe (tanto '2>&1'
#    como '2> archivo') envuelve cada linea en un ErrorRecord y, con
#    ErrorActionPreference en Stop, aborta el script aunque el build este bien.
#    Por eso la redireccion la hace cmd, fuera de PowerShell: asi solo llega
#    texto plano y $LASTEXITCODE sigue siendo el de hugo.
$salida = @(& cmd /c "hugo --gc --minify 2>&1")
$codigo = $LASTEXITCODE

# 4. Resumen
$errores = $salida | Select-String -Pattern "^ERROR"
$avisos  = $salida | Select-String -Pattern "^WARN"

Write-Host ""
foreach ($linea in ($salida | Select-String -Pattern "Pages|Static files|Total in")) {
    Write-Host "  $($linea.ToString().Trim())"
}

if ($avisos) {
    Write-Host ""
    Write-Host "  Avisos ($($avisos.Count)):" -ForegroundColor Yellow
    foreach ($a in $avisos) { Write-Host "    $($a.ToString().Trim())" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "    Nota: el aviso de 'module.mounts.excludeFiles' es esperado y" -ForegroundColor DarkGray
    Write-Host "    esta explicado en hugo.yaml. No rompe nada." -ForegroundColor DarkGray
}

Write-Host ""
if ($errores) {
    Write-Host "  FALLO: el build tiene errores. NO pushees." -ForegroundColor Red
    foreach ($e in $errores) { Write-Host "    $($e.ToString().Trim())" -ForegroundColor Red }
    Write-Host ""
    exit 1
}

if ($codigo -ne 0) {
    Write-Host "  FALLO: hugo termino con codigo $codigo." -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "  OK - el build de produccion pasa. Listo para pushear." -ForegroundColor Green
Write-Host "  (public/ quedo regenerada localmente; no se sube al repo)" -ForegroundColor DarkGray
Write-Host ""
