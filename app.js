const SUPABASE_URL = "https://rlcbrlrkoxhxnncurjyc.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_xQBEOI6vDBRKsGh2w7fXAA_u5mY7KVk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

let usuarioActual = "";
let archivosFotos = [];

const loginScreen =
    document.getElementById("loginScreen");

const appScreen =
    document.getElementById("appScreen");

const dashboardScreen =
    document.getElementById("dashboardScreen");

const receptionScreen =
    document.getElementById("receptionScreen");

const presupuestosScreen =
    document.getElementById("presupuestosScreen");

const presupuestosButton =
    document.getElementById("presupuestosButton");

const volverDashboardPresupuestos =
    document.getElementById("volverDashboardPresupuestos");

const actualizarPresupuestos =
    document.getElementById("actualizarPresupuestos");

const listaPresupuestos =
    document.getElementById("listaPresupuestos");

const mensajePresupuestos =
    document.getElementById("mensajePresupuestos");

const detallePresupuesto =
    document.getElementById("detallePresupuesto");

const contenidoDetallePresupuesto =
    document.getElementById("contenidoDetallePresupuesto");

const cerrarDetallePresupuesto =
    document.getElementById("cerrarDetallePresupuesto");

const reparacionesScreen =
    document.getElementById("reparacionesScreen");

const reparacionesButton =
    document.getElementById("reparacionesButton");

const volverDashboardReparaciones =
    document.getElementById("volverDashboardReparaciones");

const actualizarReparaciones =
    document.getElementById("actualizarReparaciones");

const listaReparaciones =
    document.getElementById("listaReparaciones");

const mensajeReparaciones =
    document.getElementById("mensajeReparaciones");

const detalleReparacion =
    document.getElementById("detalleReparacion");

const contenidoDetalleReparacion =
    document.getElementById("contenidoDetalleReparacion");

const cerrarDetalleReparacion =
    document.getElementById("cerrarDetalleReparacion");

const usuarioInput =
    document.getElementById("usuario");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const mensaje =
    document.getElementById("mensaje");

const usuarioActivo =
    document.getElementById("usuarioActivo");

const logoutButton =
    document.getElementById("logoutButton");

const nuevaRecepcion =
    document.getElementById("nuevaRecepcion");

const volverDashboard =
    document.getElementById("volverDashboard");

const cancelarRecepcion =
    document.getElementById("cancelarRecepcion");

const receptionForm =
    document.getElementById("receptionForm");

const mensajeRecepcion =
    document.getElementById("mensajeRecepcion");

const numeroReparacion =
    document.getElementById("numeroReparacion");

const fechaRecepcion =
    document.getElementById("fechaRecepcion");

const fotosInput =
    document.getElementById("fotos");


function mostrarPantalla(pantalla) {

    dashboardScreen.style.display = "none";
    receptionScreen.style.display = "none";
    reparacionesScreen.style.display = "none";
    presupuestosScreen.style.display = "none";

    pantalla.style.display = "block";
}


function obtenerFechaActual() {

    const ahora = new Date();

    const año =
        ahora.getFullYear();

    const mes =
        String(ahora.getMonth() + 1)
            .padStart(2, "0");

    const dia =
        String(ahora.getDate())
            .padStart(2, "0");

    const horas =
        String(ahora.getHours())
            .padStart(2, "0");

    const minutos =
        String(ahora.getMinutes())
            .padStart(2, "0");

    return {
        año,
        mes,
        dia,
        horas,
        minutos,
        valor:
            `${año}-${mes}-${dia}T${horas}:${minutos}`
    };
}


function generarNumeroReparacion() {

    const fecha =
        obtenerFechaActual();

    return `RM-${fecha.año}-${fecha.mes}${fecha.dia}-${fecha.horas}${fecha.minutos}`;
}


function establecerDatosRecepcion() {

    const fecha =
        obtenerFechaActual();

    numeroReparacion.value =
        generarNumeroReparacion();

    fechaRecepcion.value =
        fecha.valor;
}


function mostrarAplicacion() {

    loginScreen.style.display = "none";
    appScreen.style.display = "block";

    usuarioActivo.textContent =
        usuarioActual;

    mostrarPantalla(
        dashboardScreen
    );
}


async function iniciarSesion() {

    const usuario =
        usuarioInput.value.trim();

    const password =
        passwordInput.value;

    mensaje.textContent = "";

    if (!usuario || !password) {

        mensaje.textContent =
            "Introduce usuario y contraseña.";

        return;
    }

    loginButton.disabled = true;
    loginButton.textContent =
        "INICIANDO...";

    try {

        const respuesta =
            await fetch(
                `${SUPABASE_URL}/functions/v1/iniciar-sesion`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY
                    },

                    body: JSON.stringify({
                        usuario,
                        password
                    })
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                resultado.message ||
                "Usuario o contraseña incorrectos."
            );
        }

        if (!resultado.session) {

            throw new Error(
                "No se recibió una sesión válida."
            );
        }

        const { error } =
            await supabaseClient.auth.setSession({
                access_token:
                    resultado.session.access_token,

                refresh_token:
                    resultado.session.refresh_token
            });

        if (error) {
            throw error;
        }

        usuarioActual =
            resultado.user?.user_metadata?.usuario ||
            usuario;

        localStorage.setItem(
            "usuarioHorusa",
            usuarioActual
        );

        mostrarAplicacion();

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            error.message ||
            "No se ha podido iniciar sesión.";

    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "INICIAR SESIÓN";
    }
}


async function cerrarSesion() {

    await supabaseClient.auth.signOut();

    usuarioActual = "";

    localStorage.removeItem(
        "usuarioHorusa"
    );

    appScreen.style.display = "none";

    loginScreen.style.display =
        "flex";

    usuarioInput.value = "";
    passwordInput.value = "";
    mensaje.textContent = "";
}


function volverAlDashboard() {

    receptionForm.reset();

    archivosFotos = [];

    mensajeRecepcion.textContent = "";

    mostrarPantalla(
        dashboardScreen
    );
}


function prepararSelectorFotos() {

    if (!fotosInput) {
        return;
    }

    archivosFotos = [];

    fotosInput.value = "";

    const contenedor =
        fotosInput.parentElement;

    fotosInput.style.display = "none";

    contenedor
        .querySelector(".photo-controls")
        ?.remove();

    contenedor
        .querySelector(".photo-summary")
        ?.remove();

    contenedor
        .querySelector(".photo-preview-grid")
        ?.remove();

    const controles =
        document.createElement("div");

    controles.className =
        "photo-controls";

    Object.assign(
        controles.style,
        {
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "8px"
        }
    );

    const botonCamara =
        document.createElement("button");

    botonCamara.type = "button";

    botonCamara.textContent =
        "📷 HACER FOTO";

    botonCamara.className =
        "secondary-button";

    const botonGaleria =
        document.createElement("button");

    botonGaleria.type = "button";

    botonGaleria.textContent =
        "🖼️ ELEGIR FOTOS";

    botonGaleria.className =
        "secondary-button";

    const camaraInput =
        document.createElement("input");

    camaraInput.type = "file";

    camaraInput.accept =
        "image/*";

    camaraInput.capture =
        "environment";

    camaraInput.style.display =
        "none";

    const galeriaInput =
        document.createElement("input");

    galeriaInput.type = "file";

    galeriaInput.accept =
        "image/*";

    galeriaInput.multiple = true;

    galeriaInput.style.display =
        "none";

    const resumen =
        document.createElement("p");

    resumen.className =
        "photo-summary";

    resumen.textContent =
        "No hay fotografías seleccionadas.";

    Object.assign(
        resumen.style,
        {
            margin: "12px 0 0",
            fontWeight: "600"
        }
    );

    const galeria =
        document.createElement("div");

    galeria.className =
        "photo-preview-grid";

    Object.assign(
        galeria.style,
        {
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "16px"
        }
    );

    botonCamara.addEventListener(
        "click",
        () => {
            camaraInput.click();
        }
    );

    botonGaleria.addEventListener(
        "click",
        () => {
            galeriaInput.click();
        }
    );

    camaraInput.addEventListener(
        "change",
        () => {

            const archivos =
                Array.from(
                    camaraInput.files || []
                );

            if (!archivos.length) {
                return;
            }

            archivosFotos.push(
                ...archivos
            );

            actualizarFotos();

            camaraInput.value = "";
        }
    );

    galeriaInput.addEventListener(
        "change",
        () => {

            const archivos =
                Array.from(
                    galeriaInput.files || []
                );

            if (!archivos.length) {
                return;
            }

            archivosFotos.push(
                ...archivos
            );

            actualizarFotos();

            galeriaInput.value = "";
        }
    );

    function actualizarFotos() {

        galeria.innerHTML = "";

        const transferencia =
            new DataTransfer();

        archivosFotos.forEach(
            archivo => {
                transferencia.items.add(
                    archivo
                );
            }
        );

        fotosInput.files =
            transferencia.files;

        const cantidad =
            archivosFotos.length;

        resumen.textContent =
            cantidad === 0
                ? "No hay fotografías seleccionadas."
                : `${cantidad} fotografía${cantidad === 1 ? "" : "s"} seleccionada${cantidad === 1 ? "" : "s"}.`;

        archivosFotos.forEach(
            (archivo, indice) => {

                const tarjeta =
                    document.createElement("div");

                Object.assign(
                    tarjeta.style,
                    {
                        position: "relative",
                        width: "120px",
                        height: "120px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        background: "#f5f5f5"
                    }
                );

                const imagen =
                    document.createElement("img");

                imagen.src =
                    URL.createObjectURL(
                        archivo
                    );

                imagen.alt =
                    archivo.name;

                Object.assign(
                    imagen.style,
                    {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }
                );

                const eliminar =
                    document.createElement("button");

                eliminar.type = "button";

                eliminar.textContent = "×";

                Object.assign(
                    eliminar.style,
                    {
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "none",
                        background:
                            "rgba(0,0,0,.7)",
                        color: "#fff",
                        fontSize: "20px",
                        cursor: "pointer"
                    }
                );

                eliminar.addEventListener(
                    "click",
                    () => {

                        archivosFotos.splice(
                            indice,
                            1
                        );

                        actualizarFotos();
                    }
                );

                tarjeta.appendChild(
                    imagen
                );

                tarjeta.appendChild(
                    eliminar
                );

                galeria.appendChild(
                    tarjeta
                );
            }
        );
    }

    controles.appendChild(
        botonCamara
    );

    controles.appendChild(
        botonGaleria
    );

    contenedor.appendChild(
        controles
    );

    contenedor.appendChild(
        resumen
    );

    contenedor.appendChild(
        galeria
    );
}


function obtenerTexto(valor) {

    return valor === null ||
        valor === undefined
        ? ""
        : String(valor);
}


function escaparHTML(valor) {

    return obtenerTexto(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatearFecha(valor) {

    if (!valor) {
        return "";
    }

    const fecha =
        new Date(valor);

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return obtenerTexto(valor);
    }

    return fecha.toLocaleString(
        "es-ES",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


async function subirFotosRecepcion(
    numero
) {

    const fotosSubidas = [];

    const archivos =
        Array.from(
            fotosInput.files || []
        );

    if (!archivos.length) {
        return fotosSubidas;
    }

    for (
        const archivo of archivos
    ) {

        const nombreLimpio =
            archivo.name
                .replace(
                    /[^\w.\-]/g,
                    "_"
                )
                .replace(
                    /_+/g,
                    "_"
                );

        const nombreArchivo =
            `${Date.now()}_${nombreLimpio}`;

        const ruta =
            `private/reparaciones/${numero}/${nombreArchivo}`;

        const { error } =
            await supabaseClient.storage
                .from("fotos-recepciones")
                .upload(
                    ruta,
                    archivo,
                    {
                        cacheControl: "3600",
                        upsert: false
                    }
                );

        if (error) {
            throw error;
        }

        fotosSubidas.push(
            ruta
        );
    }

    return fotosSubidas;
}


async function guardarRecepcion() {

    mensajeRecepcion.textContent = "";

    const formData =
        new FormData(
            receptionForm
        );

    const datos =
        Object.fromEntries(
            formData.entries()
        );

    let numero =
        numeroReparacion.value.trim();

    if (!numero) {

        mensajeRecepcion.textContent =
            "Falta el número de reparación.";

        return;
    }

    let numeroFinal = numero;

    let contador = 1;

    while (true) {

        const {
            data: existente,
            error: errorBusqueda
        } =
            await supabaseClient
                .from("recepciones")
                .select("id")
                .eq(
                    "numero_reparacion",
                    numeroFinal
                )
                .limit(1);

        if (errorBusqueda) {

            console.error(
                errorBusqueda
            );

            break;
        }

        if (
            !existente ||
            existente.length === 0
        ) {
            break;
        }

        numeroFinal =
            `${numero}-${String(
                contador
            ).padStart(2, "0")}`;

        contador++;
    }

    numeroReparacion.value =
        numeroFinal;

    const registro = {

        numero_reparacion:
            numeroFinal,

        fecha_recepcion:
            datos.fechaRecepcion ||
            null,

        cliente:
            datos.cliente || "",

        telefono:
            datos.telefono || "",

        email:
            datos.email || "",

        tipo_material:
            datos.tipoMaterial || "",

        marca:
            datos.marca || "",

        modelo:
            datos.modelo || "",

        numero_serie:
            datos.numeroSerie || "",

        accesorios:
            datos.accesorios || "",

        descripcion_averia:
            datos.descripcionAveria ||
            "",

        observaciones_cliente:
            datos.observacionesCliente ||
            "",

        usuario_recepcion:
            usuarioActual || "",

        estado_reparacion:
            "Pendiente"
    };

    const botonGuardar =
        receptionForm.querySelector(
            'button[type="submit"]'
        );

    const textoOriginal =
        botonGuardar
            ? botonGuardar.textContent
            : "";

    if (botonGuardar) {

        botonGuardar.disabled =
            true;

        botonGuardar.textContent =
            "GUARDANDO...";
    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("recepciones")
                .insert(registro)
                .select()
                .single();

        if (error) {
            throw error;
        }

        const fotosSubidas =
            await subirFotosRecepcion(
                numeroFinal
            );

        if (
            fotosSubidas.length &&
            data?.id
        ) {

            const {
                error: errorFotos
            } =
                await supabaseClient
                    .from("recepciones")
                    .update({
                        fotos:
                            fotosSubidas
                    })
                    .eq(
                        "id",
                        data.id
                    );

            if (errorFotos) {
                throw errorFotos;
            }
        }

        mensajeRecepcion.textContent =
            `Recepción guardada correctamente: ${numeroFinal}`;

        mensajeRecepcion.style.color =
            "#15803d";

        receptionForm.reset();

        archivosFotos = [];

        prepararSelectorFotos();

        setTimeout(
            () => {

                mensajeRecepcion.textContent =
                    "";

                mostrarPantalla(
                    dashboardScreen
                );

            },
            500
        );

    } catch (error) {

        console.error(error);

        mensajeRecepcion.textContent =
            error.message ||
            "No se ha podido guardar la recepción.";

        mensajeRecepcion.style.color =
            "#dc2626";

    } finally {

        if (botonGuardar) {

            botonGuardar.disabled =
                false;

            botonGuardar.textContent =
                textoOriginal;
        }
    }
}


async function mostrarMensajeRecepcionExito(
    data
) {

    mensajeRecepcion.textContent =
        `Recepción guardada correctamente: ${data.numero_reparacion}`;

    mensajeRecepcion.style.color =
        "#15803d";
}


function renderizarEstado(
    estado
) {

    const valor =
        estado || "Pendiente";

    const clase =
        valor
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            );

    return `
        <span class="estado ${clase}">
            ${escaparHTML(valor)}
        </span>
    `;
}


async function cargarFotosRecepcion(
    rutas
) {

    if (!rutas) {
        return [];
    }

    let lista = [];

    try {

        if (
            Array.isArray(rutas)
        ) {

            lista = rutas;

        } else if (
            typeof rutas ===
            "string"
        ) {

            lista =
                JSON.parse(rutas);
        }

    } catch (error) {

        console.error(
            "No se pudieron interpretar las fotos:",
            error
        );

        return [];
    }

    const fotos = [];

    for (
        const ruta of lista
    ) {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from("fotos-recepciones")
                .createSignedUrl(
                    ruta,
                    60 * 60
                );

        if (error) {

            console.error(error);

            continue;
        }

        if (
            data?.signedUrl
        ) {

            fotos.push(
                data.signedUrl
            );
        }
    }

    return fotos;
}


async function abrirFotosReparacion(
    reparacion
) {

    const rutas =
        reparacion.fotos;

    if (!rutas) {

        alert(
            "Esta reparación no tiene fotografías."
        );

        return;
    }

    const fotos =
        await cargarFotosRecepcion(
            rutas
        );

    if (!fotos.length) {

        alert(
            "No se han podido cargar las fotografías."
        );

        return;
    }

    let modal =
        document.getElementById(
            "modalFotosReparacion"
        );

    if (modal) {
        modal.remove();
    }

    modal =
        document.createElement("div");

    modal.id =
        "modalFotosReparacion";

    Object.assign(
        modal.style,
        {
            position: "fixed",
            inset: "0",
            zIndex: "99999",
            background:
                "rgba(0,0,0,.88)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box"
        }
    );

    const cerrar =
        document.createElement("button");

    cerrar.type =
        "button";

    cerrar.textContent =
        "✕ CERRAR";

    cerrar.className =
        "secondary-button";

    Object.assign(
        cerrar.style,
        {
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: "2"
        }
    );

    const titulo =
        document.createElement("h2");

    titulo.textContent =
        `Fotografías — ${reparacion.numero_reparacion}`;

    Object.assign(
        titulo.style,
        {
            color: "#fff",
            margin: "0 0 20px",
            textAlign: "center"
        }
    );

    const imagenGrande =
        document.createElement("img");

    Object.assign(
        imagenGrande.style,
        {
            maxWidth: "90vw",
            maxHeight: "65vh",
            objectFit: "contain",
            borderRadius: "12px",
            background: "#222",
            display: "block"
        }
    );

    const miniaturas =
        document.createElement("div");

    Object.assign(
        miniaturas.style,
        {
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "20px",
            maxWidth: "90vw",
            overflowY: "auto"
        }
    );

    fotos.forEach(
        (url, indice) => {

            const miniatura =
                document.createElement("img");

            miniatura.src =
                url;

            miniatura.alt =
                `Fotografía ${indice + 1}`;

            Object.assign(
                miniatura.style,
                {
                    width: "90px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border:
                        "2px solid transparent"
                }
            );

            miniatura.addEventListener(
                "click",
                () => {

                    imagenGrande.src =
                        url;

                    Array.from(
                        miniaturas.children
                    ).forEach(
                        elemento => {
                            elemento.style
                                .borderColor =
                                "transparent";
                        }
                    );

                    miniatura.style
                        .borderColor =
                        "#fff";
                }
            );

            miniaturas.appendChild(
                miniatura
            );
        }
    );

    imagenGrande.src =
        fotos[0];

    if (
        miniaturas.firstElementChild
    ) {

        miniaturas
            .firstElementChild
            .style
            .borderColor =
            "#fff";
    }

    cerrar.addEventListener(
        "click",
        () => modal.remove()
    );

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.remove();
            }
        }
    );

    modal.appendChild(
        cerrar
    );

    modal.appendChild(
        titulo
    );

    modal.appendChild(
        imagenGrande
    );

    modal.appendChild(
        miniaturas
    );

    document.body.appendChild(
        modal
    );
}


async function cargarReparaciones() {

    mensajeReparaciones.textContent =
        "";

    listaReparaciones.innerHTML =
        "";

    const {
        data,
        error
    } =
        await supabaseClient
            .from("recepciones")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        mensajeReparaciones.textContent =
            error.message ||
            "No se han podido cargar las reparaciones.";

        return;
    }

    if (
        !data ||
        !data.length
    ) {

        listaReparaciones.innerHTML =
            "<p>No hay reparaciones registradas.</p>";

        return;
    }

    data.forEach(
        reparacion => {

            const tarjeta =
                document.createElement("div");

            tarjeta.className =
                "reparacion-card";

            tarjeta.innerHTML = `
                <div class="reparacion-card-info">

                    <strong>
                        ${escaparHTML(
                            reparacion.numero_reparacion
                        )}
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.cliente ||
                            "Sin cliente"
                        )}
                    </p>

                    <p>
                        ${escaparHTML(
                            reparacion.tipo_material ||
                            "Sin material"
                        )}
                    </p>

                </div>

                <div class="reparacion-card-actions">

                    ${renderizarEstado(
                        reparacion.estado_reparacion
                    )}

                    <button
                        type="button"
                        class="secondary-button btn-ver-reparacion"
                    >
                        VER DETALLE
                    </button>

                </div>

                <div
                    class="detalle-reparacion-inline"
                    style="
                        display:none;
                        width:100%;
                        box-sizing:border-box;
                    "
                ></div>
            `;

            const boton =
                tarjeta.querySelector(
                    ".btn-ver-reparacion"
                );

            const detalle =
                tarjeta.querySelector(
                    ".detalle-reparacion-inline"
                );

            boton.addEventListener(
                "click",
                async () => {

                    const abierto =
                        detalle.style.display ===
                        "block";

                    if (abierto) {

                        detalle.style.display =
                            "none";

                        boton.textContent =
                            "VER DETALLE";

                        return;
                    }

                    document
                        .querySelectorAll(
                            ".detalle-reparacion-inline"
                        )
                        .forEach(
                            otro => {
                                otro.style.display =
                                    "none";
                            }
                        );

                    document
                        .querySelectorAll(
                            ".btn-ver-reparacion"
                        )
                        .forEach(
                            otroBoton => {
                                otroBoton.textContent =
                                    "VER DETALLE";
                            }
                        );

                    detalle.style.display =
                        "block";

                    boton.textContent =
                        "CERRAR DETALLE";

                    await mostrarDetalleReparacionInline(
                        reparacion,
                        detalle
                    );
                }
            );

            listaReparaciones.appendChild(
                tarjeta
            );
        }
    );
}


async function mostrarDetalleReparacionInline(
    reparacion,
    contenedor
) {

    contenedor.innerHTML = `
        <div
            style="
                margin-top:20px;
                padding:25px 0 5px;
                border-top:1px solid #e5e7eb;
            "
        >

            <h3 style="margin-top:0;">
                Detalle de la reparación
            </h3>

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(220px,1fr)
                        );
                    gap:15px;
                    margin-top:20px;
                "
            >

                <div>
                    <strong>
                        Número de reparación
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.numero_reparacion
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Fecha
                    </strong>

                    <p>
                        ${escaparHTML(
                            formatearFecha(
                                reparacion.fecha_recepcion
                            )
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Cliente
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.cliente ||
                            "Sin cliente"
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Teléfono
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.telefono ||
                            "Sin teléfono"
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Email
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.email ||
                            "Sin email"
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Material
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.tipo_material ||
                            "Sin material"
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Marca
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.marca ||
                            "Sin marca"
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Modelo
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.modelo ||
                            "Sin modelo"
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Número de serie
                    </strong>

                    <p>
                        ${escaparHTML(
                            reparacion.numero_serie ||
                            "Sin número de serie"
                        )}
                    </p>
                </div>

                <div>
                    <strong>
                        Estado
                    </strong>

                    <p>
                        ${renderizarEstado(
                            reparacion.estado_reparacion
                        )}
                    </p>
                </div>

            </div>

            <hr>

            <h3>
                Información de la reparación
            </h3>

            <p>
                <strong>Avería:</strong>

                ${escaparHTML(
                    reparacion.descripcion_averia ||
                    "Sin información"
                )}
            </p>

            <p>
                <strong>Accesorios:</strong>

                ${escaparHTML(
                    reparacion.accesorios ||
                    "Sin información"
                )}
            </p>

            <p>
                <strong>
                    Observaciones del cliente:
                </strong>

                ${escaparHTML(
                    reparacion.observaciones_cliente ||
                    "Sin información"
                )}
            </p>

            <hr>

            <h3>
                Diagnóstico
            </h3>

            <p>
                <strong>Diagnóstico:</strong>

                ${escaparHTML(
                    reparacion.diagnostico ||
                    "Sin diagnóstico"
                )}
            </p>

            <p>
                <strong>
                    Pruebas realizadas:
                </strong>

                ${escaparHTML(
                    reparacion.pruebas_realizadas ||
                    "Sin pruebas registradas"
                )}
            </p>

            <p>
                <strong>
                    Observaciones del taller:
                </strong>

                ${escaparHTML(
                    reparacion.observaciones_taller ||
                    "Sin observaciones"
                )}
            </p>

            <hr>

            <h3>
                Reparación
            </h3>

            <p>
                <strong>Piezas:</strong>

                ${escaparHTML(
                    reparacion.piezas ||
                    "Sin piezas registradas"
                )}
            </p>

            <p>
                <strong>
                    Mano de obra:
                </strong>

                ${escaparHTML(
                    reparacion.mano_obra ||
                    "Sin mano de obra registrada"
                )}
            </p>

            <hr>

            <h3>
                Presupuesto
            </h3>

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(180px,1fr)
                        );
                    gap:15px;
                "
            >

                <div>
                    <strong>
                        Coste de piezas
                    </strong>

                    <p>
                        ${Number(
                            reparacion.coste_piezas ||
                            0
                        ).toFixed(2)} €
                    </p>
                </div>

                <div>
                    <strong>
                        Mano de obra
                    </strong>

                    <p>
                        ${Number(
                            reparacion.coste_mano_obra ||
                            0
                        ).toFixed(2)} €
                    </p>
                </div>

                <div>
                    <strong>
                        Otros costes
                    </strong>

                    <p>
                        ${Number(
                            reparacion.otros_costes ||
                            0
                        ).toFixed(2)} €
                    </p>
                </div>

                <div>
                    <strong>
                        Total
                    </strong>

                    <p
                        style="
                            font-size:20px;
                            font-weight:bold;
                        "
                    >
                        ${Number(
                            reparacion.total_presupuesto ||
                            0
                        ).toFixed(2)} €
                    </p>
                </div>

            </div>

            <p>
                <strong>
                    Estado del presupuesto:
                </strong>

                ${escaparHTML(
                    reparacion.estado_presupuesto ||
                    "Pendiente"
                )}
            </p>

            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                    margin-top:25px;
                "
            >

                <button
                    type="button"
                    class="primary-button"
                    data-accion="editar"
                >
                    EDITAR REPARACIÓN
                </button>

                <button
                    type="button"
                    class="secondary-button"
                    data-accion="fotos"
                >
                    VER FOTOS
                </button>

                <button
                    type="button"
                    class="secondary-button"
                    data-accion="cerrar"
                >
                    CERRAR DETALLE
                </button>

            </div>

            <p
                data-mensaje-edicion
                style="
                    margin-top:15px;
                    font-weight:bold;
                "
            ></p>

        </div>
    `;

    contenedor
        .querySelector(
            '[data-accion="editar"]'
        )
        .addEventListener(
            "click",
            () => {

                crearFormularioEdicionInline(
                    reparacion,
                    contenedor
                );
            }
        );

    contenedor
        .querySelector(
            '[data-accion="fotos"]'
        )
        .addEventListener(
            "click",
            () => {

                abrirFotosReparacion(
                    reparacion
                );
            }
        );

    contenedor
        .querySelector(
            '[data-accion="cerrar"]'
        )
        .addEventListener(
            "click",
            () => {

                contenedor.style.display =
                    "none";

                const boton =
                    contenedor.parentElement
                        .querySelector(
                            ".btn-ver-reparacion"
                        );

                if (boton) {

                    boton.textContent =
                        "VER DETALLE";
                }
            }
        );
}


function crearFormularioEdicionInline(
    reparacion,
    contenedor
) {

    contenedor.innerHTML = `
        <div
            style="
                margin-top:20px;
                padding:25px 0 5px;
                border-top:1px solid #e5e7eb;
            "
        >

            <h3>
                Editar reparación
            </h3>

            <div class="form-field">

                <label>
                    Estado de la reparación
                </label>

                <select
                    id="editarEstadoInline"
                >

                    <option value="Pendiente">
                        Pendiente
                    </option>

                    <option value="En diagnóstico">
                        En diagnóstico
                    </option>

                    <option value="Esperando piezas">
                        Esperando piezas
                    </option>

                    <option value="En reparación">
                        En reparación
                    </option>

                    <option value="Reparada">
                        Reparada
                    </option>

                    <option value="No reparable">
                        No reparable
                    </option>

                    <option value="Entregada">
                        Entregada
                    </option>

                </select>

            </div>

            <div class="form-field">

                <label>
                    Diagnóstico
                </label>

                <textarea
                    id="editarDiagnosticoInline"
                ></textarea>

            </div>

            <div class="form-field">

                <label>
                    Pruebas realizadas
                </label>

                <textarea
                    id="editarPruebasInline"
                ></textarea>

            </div>

            <div class="form-field">

                <label>
                    Observaciones del taller
                </label>

                <textarea
                    id="editarObservacionesInline"
                ></textarea>

            </div>

            <div class="form-field">

                <label>
                    Piezas
                </label>

                <textarea
                    id="editarPiezasInline"
                ></textarea>

            </div>

            <div class="form-field">

                <label>
                    Mano de obra
                </label>

                <textarea
                    id="editarManoObraInline"
                ></textarea>

            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(180px,1fr)
                        );
                    gap:15px;
                "
            >

                <div class="form-field">

                    <label>
                        Coste de piezas (€)
                    </label>

                    <input
                        type="number"
                        id="editarPiezasCosteInline"
                        min="0"
                        step="0.01"
                    >

                </div>

                <div class="form-field">

                    <label>
                        Coste mano de obra (€)
                    </label>

                    <input
                        type="number"
                        id="editarManoObraCosteInline"
                        min="0"
                        step="0.01"
                    >

                </div>

                <div class="form-field">

                    <label>
                        Otros costes (€)
                    </label>

                    <input
                        type="number"
                        id="editarOtrosCostesInline"
                        min="0"
                        step="0.01"
                    >

                </div>

            </div>

            <div class="form-field">

                <label>
                    Estado del presupuesto
                </label>

                <select
                    id="editarEstadoPresupuestoInline"
                >

                    <option value="Pendiente">
                        Pendiente
                    </option>

                    <option value="Enviado">
                        Enviado
                    </option>

                    <option value="Aceptado">
                        Aceptado
                    </option>

                    <option value="Rechazado">
                        Rechazado
                    </option>

                </select>

            </div>

            <div class="form-field">

                <label>
                    Total presupuesto (€)
                </label>

                <input
                    type="number"
                    id="editarTotalInline"
                    readonly
                >

            </div>

            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                    margin-top:20px;
                "
            >

                <button
                    type="button"
                    class="primary-button"
                    id="guardarEdicionInline"
                >
                    GUARDAR CAMBIOS
                </button>

                <button
                    type="button"
                    class="secondary-button"
                    id="cancelarEdicionInline"
                >
                    CANCELAR
                </button>

            </div>

            <p
                id="mensajeEdicionInline"
                style="
                    margin-top:15px;
                    font-weight:bold;
                "
            ></p>

        </div>
    `;

    const estado =
        document.getElementById(
            "editarEstadoInline"
        );

    const diagnostico =
        document.getElementById(
            "editarDiagnosticoInline"
        );

    const pruebas =
        document.getElementById(
            "editarPruebasInline"
        );

    const observaciones =
        document.getElementById(
            "editarObservacionesInline"
        );

    const piezas =
        document.getElementById(
            "editarPiezasInline"
        );

    const manoObra =
        document.getElementById(
            "editarManoObraInline"
        );

    const costePiezas =
        document.getElementById(
            "editarPiezasCosteInline"
        );

    const costeManoObra =
        document.getElementById(
            "editarManoObraCosteInline"
        );

    const otrosCostes =
        document.getElementById(
            "editarOtrosCostesInline"
        );

    const estadoPresupuesto =
        document.getElementById(
            "editarEstadoPresupuestoInline"
        );

    const total =
        document.getElementById(
            "editarTotalInline"
        );

    const mensaje =
        document.getElementById(
            "mensajeEdicionInline"
        );

    estado.value =
        reparacion.estado_reparacion ||
        "Pendiente";

    diagnostico.value =
        reparacion.diagnostico ||
        "";

    pruebas.value =
        reparacion.pruebas_realizadas ||
        "";

    observaciones.value =
        reparacion.observaciones_taller ||
        "";

    piezas.value =
        reparacion.piezas ||
        "";

    manoObra.value =
        reparacion.mano_obra ||
        "";

    costePiezas.value =
        reparacion.coste_piezas ||
        0;

    costeManoObra.value =
        reparacion.coste_mano_obra ||
        0;

    otrosCostes.value =
        reparacion.otros_costes ||
        0;

    estadoPresupuesto.value =
        reparacion.estado_presupuesto ||
        "Pendiente";

    function calcularTotal() {

        total.value =
            (
                Number(
                    costePiezas.value
                ) || 0
            ) +
            (
                Number(
                    costeManoObra.value
                ) || 0
            ) +
            (
                Number(
                    otrosCostes.value
                ) || 0
            );

        total.value =
            Number(
                total.value
            ).toFixed(2);
    }

    [
        costePiezas,
        costeManoObra,
        otrosCostes
    ].forEach(
        campo => {

            campo.addEventListener(
                "input",
                calcularTotal
            );
        }
    );

    calcularTotal();

    document
        .getElementById(
            "guardarEdicionInline"
        )
        .addEventListener(
            "click",
            async () => {

                mensaje.textContent =
                    "Guardando cambios...";

                mensaje.style.color =
                    "#222";

                const datos = {

                    estado_reparacion:
                        estado.value,

                    diagnostico:
                        diagnostico.value.trim(),

                    pruebas_realizadas:
                        pruebas.value.trim(),

                    observaciones_taller:
                        observaciones.value.trim(),

                    piezas:
                        piezas.value.trim(),

                    mano_obra:
                        manoObra.value.trim(),

                    coste_piezas:
                        Number(
                            costePiezas.value
                        ) || 0,

                    coste_mano_obra:
                        Number(
                            costeManoObra.value
                        ) || 0,

                    otros_costes:
                        Number(
                            otrosCostes.value
                        ) || 0,

                    total_presupuesto:
                        Number(
                            total.value
                        ) || 0,

                    estado_presupuesto:
                        estadoPresupuesto.value
                };

                try {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from(
                                "recepciones"
                            )
                            .update(
                                datos
                            )
                            .eq(
                                "id",
                                reparacion.id
                            );

                    if (error) {
                        throw error;
                    }

                    Object.assign(
                        reparacion,
                        datos
                    );

                    mensaje.textContent =
                        "Cambios guardados correctamente.";

                    mensaje.style.color =
                        "#15803d";

                    setTimeout(
                        () => {

                            mostrarDetalleReparacionInline(
                                reparacion,
                                contenedor
                            );

                        },
                        500
                    );

                } catch (error) {

                    console.error(
                        error
                    );

                    mensaje.textContent =
                        "Error al guardar: " +
                        error.message;

                    mensaje.style.color =
                        "#dc2626";
                }
            }
        );

    document
        .getElementById(
            "cancelarEdicionInline"
        )
        .addEventListener(
            "click",
            () => {

                mostrarDetalleReparacionInline(
                    reparacion,
                    contenedor
                );
            }
        );
}
async function cargarPresupuestos() {

    mensajePresupuestos.textContent = "";

    listaPresupuestos.innerHTML = "";

    detallePresupuesto.style.display = "none";



    const { data, error } = await supabaseClient

        .from("recepciones")

        .select("*")

        .order("created_at", { ascending: false });



    if (error) {

        console.error(error);

        mensajePresupuestos.textContent =
            error.message || "No se han podido cargar los presupuestos.";

        return;

    }



    const presupuestos = (data || []).filter(reparacion =>

        Number(reparacion.total_presupuesto || 0) > 0 ||

        (reparacion.estado_presupuesto || "Pendiente") !== "Pendiente"

    );



    if (!presupuestos.length) {

        listaPresupuestos.innerHTML =
            "<p>No hay presupuestos registrados.</p>";

        return;

    }



    presupuestos.forEach(reparacion => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "reparacion-card";

        tarjeta.innerHTML = `

            <div>

                <strong>
                    ${escaparHTML(reparacion.numero_reparacion)}
                </strong>

                <p>
                    ${escaparHTML(reparacion.cliente || "Sin cliente")}
                </p>

                <p>
                    ${escaparHTML(
                        reparacion.tipo_material || "Sin material"
                    )}
                </p>

            </div>

            <div>

                <span>
                    ${escaparHTML(
                        reparacion.estado_presupuesto || "Pendiente"
                    )}
                </span>

                <p>
                    <strong>
                        ${escaparHTML(
                            reparacion.total_presupuesto || 0
                        )} €
                    </strong>
                </p>

                <button
                    type="button"
                    class="secondary-button"
                >
                    VER DETALLE
                </button>

            </div>

        `;



        const boton = tarjeta.querySelector("button");



        boton.addEventListener("click", () => {

            mostrarDetallePresupuesto(reparacion);

        });



        listaPresupuestos.appendChild(tarjeta);

    });

}



function mostrarDetallePresupuesto(reparacion) {

    detallePresupuesto.style.display = "block";



    contenidoDetallePresupuesto.innerHTML = `

        <p>
            <strong>Número de reparación:</strong>
            ${escaparHTML(reparacion.numero_reparacion)}
        </p>

        <p>
            <strong>Cliente:</strong>
            ${escaparHTML(reparacion.cliente)}
        </p>

        <p>
            <strong>Teléfono:</strong>
            ${escaparHTML(reparacion.telefono)}
        </p>

        <p>
            <strong>Material:</strong>
            ${escaparHTML(reparacion.tipo_material)}
        </p>

        <p>
            <strong>Marca:</strong>
            ${escaparHTML(reparacion.marca)}
        </p>

        <p>
            <strong>Modelo:</strong>
            ${escaparHTML(reparacion.modelo)}
        </p>

        <p>
            <strong>Estado del presupuesto:</strong>
            ${escaparHTML(
                reparacion.estado_presupuesto || "Pendiente"
            )}
        </p>



        <hr>



        <p>
            <strong>Coste de piezas:</strong>
            ${escaparHTML(reparacion.coste_piezas || 0)} €
        </p>

        <p>
            <strong>Coste de mano de obra:</strong>
            ${escaparHTML(reparacion.coste_mano_obra || 0)} €
        </p>

        <p>
            <strong>Otros costes:</strong>
            ${escaparHTML(reparacion.otros_costes || 0)} €
        </p>

        <p>
            <strong>Total presupuesto:</strong>
            ${escaparHTML(reparacion.total_presupuesto || 0)} €
        </p>



        <hr>



        <p>
            <strong>Diagnóstico:</strong>
        </p>

        <p>
            ${escaparHTML(
                reparacion.diagnostico || "Sin diagnóstico"
            )}
        </p>



        <p>
            <strong>Piezas:</strong>
        </p>

        <p>
            ${escaparHTML(
                reparacion.piezas || "Sin piezas registradas"
            )}
        </p>



        <p>
            <strong>Mano de obra:</strong>
        </p>

        <p>
            ${escaparHTML(
                reparacion.mano_obra ||
                "Sin mano de obra registrada"
            )}
        </p>

    `;

}



loginButton.addEventListener("click", iniciarSesion);



passwordInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        iniciarSesion();

    }

});



logoutButton.addEventListener("click", cerrarSesion);



nuevaRecepcion.addEventListener("click", () => {

    establecerDatosRecepcion();

    prepararSelectorFotos();

    mostrarPantalla(receptionScreen);

});



volverDashboard.addEventListener(
    "click",
    volverAlDashboard
);



cancelarRecepcion.addEventListener(
    "click",
    volverAlDashboard
);



receptionForm.addEventListener("submit", event => {

    event.preventDefault();

    guardarRecepcion();

});



reparacionesButton.addEventListener(
    "click",
    async () => {

        mostrarPantalla(reparacionesScreen);

        await cargarReparaciones();

    }
);



volverDashboardReparaciones.addEventListener(
    "click",
    () => {

        detalleReparacion.style.display = "none";

        mostrarPantalla(dashboardScreen);

    }
);



actualizarReparaciones.addEventListener(
    "click",
    cargarReparaciones
);



cerrarDetalleReparacion.addEventListener(
    "click",
    () => {

        detalleReparacion.style.display = "none";

    }
);



presupuestosButton.addEventListener(
    "click",
    async () => {

        mostrarPantalla(presupuestosScreen);

        await cargarPresupuestos();

    }
);



volverDashboardPresupuestos.addEventListener(
    "click",
    () => {

        detallePresupuesto.style.display = "none";

        mostrarPantalla(dashboardScreen);

    }
);



actualizarPresupuestos.addEventListener(
    "click",
    cargarPresupuestos
);



cerrarDetallePresupuesto.addEventListener(
    "click",
    () => {

        detallePresupuesto.style.display = "none";

    }
);



supabaseClient.auth.getSession().then(({ data }) => {

    if (data?.session) {

       usuarioActual =
    localStorage.getItem("usuarioHorusa") ||
    data.session.user?.user_metadata?.usuario ||
    "";

        mostrarAplicacion();

    }

});



window.addEventListener("load", () => {

    prepararSelectorFotos();

});