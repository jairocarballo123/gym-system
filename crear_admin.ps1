# Write-Host "Creando usuario administrador..." -ForegroundColor Yellow

# $uri = "http://localhost:3000/api/Empleados"

# $body = @{
#     nombre         = "Admin"
#     telefono       = "778543466"
#     rol            = "admin"
#     especialidad   = ""
#     disponibilidad = ""
#     password       = "admin123"   # Puedes cambiar la contraseña aquí
# } | ConvertTo-Json

# try {
#     $response = Invoke-WebRequest -Uri $uri `
#                                   -Method Post `
#                                   -Body $body `
#                                   -ContentType "application/json"

#     # Si llega aquí, el código es 200 o 201 (éxito)
#     Write-Host "¡Usuario administrador creado con éxito!" -ForegroundColor Green
    
#     # Mostrar el empleado creado (incluyendo el ID generado por la BD)
#     $empleadoCreado = $response.Content | ConvertFrom-Json
#     Write-Host "Datos del administrador creado:" -ForegroundColor Cyan
#     $empleadoCreado | Format-List
    
#     # Mostrar solo el ID de forma destacada
#     Write-Host "ID generado: " $empleadoCreado.id -ForegroundColor Magenta

# } catch {
#     # Si hay error (400, 500, etc.)
#     Write-Host "Error al crear el administrador" -ForegroundColor Red
    
#     if ($_.Exception.Response) {
#         $statusCode = $.Exception.Response.StatusCode.value_
#         $statusDescription = $_.Exception.Response.StatusDescription
#         Write-Host "Código de error: $statusCode - $statusDescription" -ForegroundColor Red
        
#         # Intentar mostrar el mensaje de error del servidor
#         $stream = $_.Exception.Response.GetResponseStream()
#         $reader = New-Object System.IO.StreamReader($stream)
#         $errorBody = $reader.ReadToEnd()
#         Write-Host "Detalles del error:" -ForegroundColor Red
#         Write-Host $errorBody
#     } else {
#         Write-Host $_.Exception.Message
#     }
# }

# # Pausa para que el usuario vea el resultado
# Write-Host "`nPresiona cualquier tecla para cerrar..."
# $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")