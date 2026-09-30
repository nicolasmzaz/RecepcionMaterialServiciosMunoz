const SUPABASE_URL = "https://rlcbrlrkoxhxnncurjyc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xQBEOI6vDBRKsGh2w7fXAA_u5mY7KVk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

let usuarioActual = "";
let archivosFotos = [];

const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("appScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const receptionScreen = document.getElementById("receptionScreen");

const usuarioInput = document.getElementById("usuario");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const mensaje = document.getElementById("mensaje");

const usuarioActivo = document.getElementById("usuarioActivo");
const logoutButton = document.getElementById("logoutButton");

const nuevaRecepcion = document.getElementById("nuevaRecepcion");
const volverDashboard = document.getElementById("volverDashboard");
const cancelarRecepcion = document.getElementById("cancelarRecepcion");
const receptionForm = document.getElementById("receptionForm");
const mensajeRecepcion = document.getElementById("mensajeRecepcion");

const numeroReparacion = document.getElementById("numeroReparacion");
const fechaRecepcion = document.getElementById("fechaRecepcion");
const fotosInput = document.getElementById("fotos");

function mostrarPantalla(pantalla) {
    dashboardScreen.style.display = "none";
    receptionScreen.style.display = "none";
    pantalla.style.display = "block";
}

function obtenerFechaActual() {
    const ahora = new Date();

    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");

    return {
        año,
        mes,
        dia,
        horas,
        minutos,
        valor: `${año}-${mes}-${dia}T${horas}:${minutos}`
    };
}

function generarNumeroReparacion() {
    const fecha = obtenerFechaActual();

    return `RM-${fecha.año}-${fecha.mes}${fecha.dia}-${fecha.horas}${fecha.minutos}`;
}

function establecerDatosRecepcion() {
    const fecha = obtenerFechaActual();

    numeroReparacion.value = generarNumeroReparacion();
    fechaRecepcion.value = fecha.valor;
}

function mostrarAplicacion() {
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
    usuarioActivo.textContent = usuarioActual;
    mostrarPantalla(dashboardScreen);
}

async function iniciarSesion() {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value;

    mensaje.textContent = "";

    if (!usuario || !password) {
        mensaje.textContent = "Introduce usuario y contraseña.";
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "INICIANDO...";

    try {
        const respuesta = await fetch(
            `${SUPABASE_URL}/functions/v1/iniciar-sesion`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_PUBLISHABLE_KEY
                },
                body: JSON.stringify({
                    usuario,
                    password
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.error ||
                resultado.message ||
                "Usuario o contraseña incorrectos."
            );
        }

        if (!resultado.session) {
            throw new Error("No se recibió una sesión válida.");
        }

        const { error } = await supabaseClient.auth.setSession({
            access_token: resultado.session.access_token,
            refresh_token: resultado.session.refresh_token
        });

        if (error) {
            throw error;
        }

        usuarioActual = resultado.user?.user_metadata?.usuario || usuario;

        mostrarAplicacion();
    } catch (error) {
        console.error(error);
        mensaje.textContent = error.message || "No se ha podido iniciar sesión.";
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "INICIAR SESIÓN";
    }
}

async function cerrarSesion() {
    await supabaseClient.auth.signOut();

    usuarioActual = "";
    appScreen.style.display = "none";
    loginScreen.style.display = "flex";
    usuarioInput.value = "";
    passwordInput.value = "";
    mensaje.textContent = "";
}

function volverAlDashboard() {
    receptionForm.reset();
    archivosFotos = [];
    mensajeRecepcion.textContent = "";
    mostrarPantalla(dashboardScreen);
}

function prepararSelectorFotos() {
    if (!fotosInput) {
        return;
    }

    archivosFotos = [];
    fotosInput.value = "";

    const contenedor = fotosInput.parentElement;

    fotosInput.style.display = "none";

    contenedor.querySelector(".photo-controls")?.remove();
    contenedor.querySelector(".photo-summary")?.remove();
    contenedor.querySelector(".photo-preview-grid")?.remove();

    const controles = document.createElement("div");
    controles.className = "photo-controls";

    Object.assign(controles.style, {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "8px"
    });

    const botonCamara = document.createElement("button");
    botonCamara.type = "button";
    botonCamara.textContent = "📷 HACER FOTO";
    botonCamara.className = "secondary-button";

    const botonGaleria = document.createElement("button");
    botonGaleria.type = "button";
    botonGaleria.textContent = "🖼️ ELEGIR FOTOS";
    botonGaleria.className = "secondary-button";

    const camaraInput = document.createElement("input");
    camaraInput.type = "file";
    camaraInput.accept = "image/*";
    camaraInput.capture = "environment";
    camaraInput.style.display = "none";

    const galeriaInput = document.createElement("input");
    galeriaInput.type = "file";
    galeriaInput.accept = "image/*";
    galeriaInput.multiple = true;
    galeriaInput.style.display = "none";

    const resumen = document.createElement("p");
    resumen.className = "photo-summary";
    resumen.textContent = "No hay fotografías seleccionadas.";

    Object.assign(resumen.style, {
        margin: "12px 0 0",
        fontWeight: "600"
    });

    const galeria = document.createElement("div");
    galeria.className = "photo-preview-grid";

    Object.assign(galeria.style, {
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "16px"
    });

    botonCamara.addEventListener("click", () => {
        camaraInput.click();
    });

    botonGaleria.addEventListener("click", () => {
        galeriaInput.click();
    });

    camaraInput.addEventListener("change", () => {
        const archivos = Array.from(camaraInput.files || []);

        if (!archivos.length) {
            return;
        }

        archivosFotos.push(...archivos);
        actualizarFotos();
        camaraInput.value = "";
    });

    galeriaInput.addEventListener("change", () => {
        const archivos = Array.from(galeriaInput.files || []);

        if (!archivos.length) {
            return;
        }

        archivosFotos.push(...archivos);
        actualizarFotos();
        galeriaInput.value = "";
    });

    function actualizarFotos() {
        galeria.innerHTML = "";

        const transferencia = new DataTransfer();

        archivosFotos.forEach(archivo => {
            transferencia.items.add(archivo);
        });

        fotosInput.files = transferencia.files;

        const cantidad = archivosFotos.length;

        resumen.textContent =
            cantidad === 0
                ? "No hay fotografías seleccionadas."
                : `${cantidad} fotografía${cantidad === 1 ? "" : "s"} seleccionada${cantidad === 1 ? "" : "s"}.`;

        archivosFotos.forEach((archivo, indice) => {
            const contenedorFoto = document.createElement("div");

            Object.assign(contenedorFoto.style, {
                position: "relative",
                width: "120px",
                height: "120px",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #ddd",
                background: "#f5f5f5"
            });

            const imagen = document.createElement("img");
            imagen.src = URL.createObjectURL(archivo);
            imagen.alt = `Fotografía ${indice + 1}`;

            Object.assign(imagen.style, {
                width: "100%",
                height: "100%",
                objectFit: "cover"
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.textContent = "×";
            botonEliminar.setAttribute(
                "aria-label",
                "Eliminar fotografía"
            );

            Object.assign(botonEliminar.style, {
                position: "absolute",
                top: "5px",
                right: "5px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                fontSize: "20px",
                lineHeight: "20px",
                cursor: "pointer"
            });

            botonEliminar.addEventListener("click", () => {
                URL.revokeObjectURL(imagen.src);
                archivosFotos.splice(indice, 1);
                actualizarFotos();
            });

            contenedorFoto.appendChild(imagen);
            contenedorFoto.appendChild(botonEliminar);
            galeria.appendChild(contenedorFoto);
        });
    }

    controles.appendChild(botonCamara);
    controles.appendChild(botonGaleria);

    contenedor.appendChild(controles);
    contenedor.appendChild(resumen);
    contenedor.appendChild(galeria);
}

async function subirFotografias() {
    const archivos = Array.from(fotosInput.files || []);

    if (!archivos.length) {
        return [];
    }

    const rutas = [];

    for (const archivo of archivos) {
        const extension = archivo.name.includes(".")
            ? archivo.name.split(".").pop().toLowerCase()
            : "jpg";

        const nombreSeguro = archivo.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .slice(0, 80);

        const nombreArchivo =
            `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${nombreSeguro}.${extension}`;

        const ruta =
            `reparaciones/${numeroReparacion.value}/${nombreArchivo}`;

        const { error } = await supabaseClient
            .storage
            .from("fotos-recepciones")
            .upload(ruta, archivo, {
                cacheControl: "3600",
                upsert: false,
                contentType: archivo.type
            });

        if (error) {
            throw error;
        }

        rutas.push(ruta);
    }

    return rutas;
}

loginButton.addEventListener("click", iniciarSesion);

passwordInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        iniciarSesion();
    }
});

logoutButton.addEventListener("click", cerrarSesion);

nuevaRecepcion.addEventListener("click", () => {
    receptionForm.reset();
    establecerDatosRecepcion();
    mensajeRecepcion.textContent = "";
    prepararSelectorFotos();
    mostrarPantalla(receptionScreen);
});

volverDashboard.addEventListener("click", volverAlDashboard);

cancelarRecepcion.addEventListener("click", volverAlDashboard);

receptionForm.addEventListener("submit", async event => {
    event.preventDefault();

    mensajeRecepcion.textContent = "Guardando recepción...";

    const cliente = document.getElementById("cliente").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const numeroSerie = document.getElementById("numeroSerie").value.trim();
    const tipoMaterial = document.getElementById("tipoMaterial").value.trim();
    const accesorios = document.getElementById("accesorios").value.trim();
    const estadoRecepcion = document.getElementById("estadoRecepcion").value.trim();
    const averia = document.getElementById("averia").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();

    try {
        mensajeRecepcion.textContent = "Subiendo fotografías...";

        const rutasFotos = await subirFotografias();

        mensajeRecepcion.textContent = "Guardando recepción...";

        const { error } = await supabaseClient
            .from("recepciones")
            .insert({
                numero_reparacion: numeroReparacion.value,
                cliente,
                telefono,
                marca,
                modelo,
                numero_serie: numeroSerie,
                tipo_material: tipoMaterial,
                accesorios,
                estado_recepcion: estadoRecepcion,
                averia,
                observaciones,
                recibido_por: usuarioActual,
                fotos: rutasFotos
            });

        if (error) {
            throw error;
        }

        mensajeRecepcion.textContent = "Recepción guardada correctamente.";

        setTimeout(() => {
            receptionForm.reset();
            archivosFotos = [];
            mensajeRecepcion.textContent = "";
            mostrarPantalla(dashboardScreen);
        }, 1000);
    } catch (error) {
        console.error(error);
        mensajeRecepcion.textContent =
            `Error al guardar la recepción: ${error.message}`;
    }
});