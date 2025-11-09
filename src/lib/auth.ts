// Semplice autenticazione per l'admin
// In produzione dovresti usare JWT o session più sicure
export function checkAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = 'paparazzo2025!'; // Stesso password del frontend
  
  if (!authHeader) {
    return false;
  }
  
  // Controlla se il token è valido (formato: Bearer password)
  const token = authHeader.replace('Bearer ', '');
  return token === adminPassword;
}