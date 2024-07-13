// Importar funciones y configuración de Firebase
import { checkAuthState } from './persistenciasesion';

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Verificar el estado de autenticación al cargar la página
    checkAuthState();

    // Puedes agregar aquí funciones adicionales que necesites en todas las páginas
});
