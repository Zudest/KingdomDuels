# ---------------------------------------------------------------------------
# Kingdom Duels - servidor local de desarrollo
#
#   .\preview.ps1              -> http://localhost:1313
#   .\preview.ps1 -Port 1314   -> otro puerto, para levantar dos a la vez
#
# Flags:
#   -D                  incluye borradores (draft = true)
#   --noHTTPCache       evita que el navegador sirva CSS/JS viejo al recargar
#   --renderToMemory    NO escribe en public/. Sin esto, el server deja ahi un
#                       build a medias que despues confunde al mirar la carpeta.
#   --disableFastRender fuerza el rebuild completo en cada cambio. Un poco mas
#                       lento, pero evita que un cambio de CSS o de config se
#                       vea a medias.
#
# Para el build de produccion (el que hace GitHub Actions), usar predeploy.ps1
# ---------------------------------------------------------------------------

param(
    [int] $Port = 1313
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "  Kingdom Duels - preview local" -ForegroundColor Cyan
Write-Host "  http://localhost:$Port" -ForegroundColor Cyan
Write-Host "  Ctrl+C para cortar"
Write-Host ""

hugo server `
    --port $Port `
    -D `
    --noHTTPCache `
    --renderToMemory `
    --disableFastRender `
    --navigateToChanged
