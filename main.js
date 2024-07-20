//Importar funciones y configuración de Firebase
import { checkAuthState } from './persistenciasesion';

//Carga del DOM
document.addEventListener("DOMContentLoaded", function () {
    //Verificación del estado de autenticación al cargar la página
    checkAuthState();
});
