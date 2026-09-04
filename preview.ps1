# Levanta el sitio con el theme Solitude (rama redesign) en modo preview.
#
#   .\preview.ps1
#
# Aplica hugo.redesign.yaml ENCIMA de hugo.toml, sin modificarlo.
# --renderToMemory evita que el preview sobreescriba public/.
#
# Para ver el sitio ACTUAL (Stack) sin overlay:  hugo server
#
# Nota: las comillas en --config son necesarias; sin ellas PowerShell parte la
# lista por la coma y Hugo termina ignorando el overlay silenciosamente.

hugo server `
    --config "hugo.toml,hugo.redesign.yaml" `
    --renderToMemory `
    --disableFastRender `
    --navigateToChanged
