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

const albaranesScreen = document.getElementById("albaranesScreen");
const albaranFormScreen = document.getElementById("albaranFormScreen");
const albaranesButton = document.getElementById("albaranesButton");
const volverDashboardAlbaranes = document.getElementById("volverDashboardAlbaranes");
const actualizarAlbaranes = document.getElementById("actualizarAlbaranes");
const listaAlbaranes = document.getElementById("listaAlbaranes");
const mensajeAlbaranes = document.getElementById("mensajeAlbaranes");
const detalleAlbaran = document.getElementById("detalleAlbaran");
const contenidoDetalleAlbaran = document.getElementById("contenidoDetalleAlbaran");
const cerrarDetalleAlbaran = document.getElementById("cerrarDetalleAlbaran");
const nuevoAlbaran = document.getElementById("nuevoAlbaran");
const volverAlbaranesDesdeForm = document.getElementById("volverAlbaranesDesdeForm");
const cancelarAlbaran = document.getElementById("cancelarAlbaran");
const albaranForm = document.getElementById("albaranForm");
const selectorReparacionAlbaran = document.getElementById("selectorReparacionAlbaran");
const materialSeleccionAlbaran = document.getElementById("materialSeleccionAlbaran");
const itemsAlbaran = document.getElementById("itemsAlbaran");
const mensajeItemsAlbaran = document.getElementById("mensajeItemsAlbaran");
const numeroAlbaran = document.getElementById("numeroAlbaran");
const fechaAlbaran = document.getElementById("fechaAlbaran");
const clienteAlbaran = document.getElementById("clienteAlbaran");
const telefonoAlbaran = document.getElementById("telefonoAlbaran");
const emailAlbaran = document.getElementById("emailAlbaran");
const ivaAlbaran = document.getElementById("ivaAlbaran");
const materialManualAlbaran = document.getElementById("materialManualAlbaran");
const cantidadManualAlbaran = document.getElementById("cantidadManualAlbaran");
const precioManualAlbaran = document.getElementById("precioManualAlbaran");
const agregarMaterialManualAlbaran = document.getElementById("agregarMaterialManualAlbaran");
const subtotalAlbaran = document.getElementById("subtotalAlbaran");
const importeIvaAlbaran = document.getElementById("importeIvaAlbaran");
const totalAlbaran = document.getElementById("totalAlbaran");
const observacionesAlbaran = document.getElementById("observacionesAlbaran");
const mensajeGuardarAlbaran = document.getElementById("mensajeGuardarAlbaran");

let reparacionesDisponiblesAlbaran = [];
let itemsActualesAlbaran = [];

let clientesScreen = null;
let buscarScreen = null;
let administracionScreen = null;

function crearPantallasExtra() {
    if (clientesScreen) return;
    const contenedor = document.createElement("div");
    contenedor.innerHTML = `
        <section class="reception-screen" id="clientesScreen" style="display:none;">
            <div class="page-header">
                <div><h2>Clientes</h2><p>Consultar clientes y sus reparaciones</p></div>
                <button type="button" id="volverDashboardClientes">VOLVER</button>
            </div>
            <div class="form-section">
                <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
                    <div><h3 style="margin-bottom:4px;">Clientes registrados</h3><p style="margin:0;">Los clientes se obtienen automáticamente de las recepciones.</p></div>
                    <button type="button" class="secondary-button" id="actualizarClientes">ACTUALIZAR</button>
                </div>
                <div id="listaClientes" style="margin-top:20px;"></div>
                <p id="mensajeClientes"></p>
            </div>
            <div class="form-section" id="detalleCliente" style="display:none;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                    <h3>Ficha del cliente</h3><button type="button" class="secondary-button" id="cerrarDetalleCliente">CERRAR</button>
                </div>
                <div id="contenidoDetalleCliente" style="margin-top:18px;"></div>
            </div>
        </section>
        <section class="reception-screen" id="buscarScreen" style="display:none;">
            <div class="page-header">
                <div><h2>Buscar</h2><p>Buscar reparaciones y materiales</p></div>
                <button type="button" id="volverDashboardBuscar">VOLVER</button>
            </div>
            <div class="form-section">
                <h3>Buscar reparación</h3>
                <div class="form-grid">
                    <div class="form-field"><label for="campoBuscar">Número, cliente, teléfono, material, marca o modelo</label><input type="text" id="campoBuscar" placeholder="Escribe para buscar..."></div>
                    <div class="form-field" style="align-self:end;"><button type="button" class="secondary-button" id="limpiarBusqueda">LIMPIAR</button></div>
                </div>
                <div id="resultadosBusqueda" style="margin-top:20px;"></div><p id="mensajeBusqueda"></p>
            </div>
        </section>
        <section class="reception-screen" id="administracionScreen" style="display:none;">
            <div class="page-header">
                <div><h2>Administración</h2><p>Usuarios y configuración de la aplicación</p></div>
                <button type="button" id="volverDashboardAdministracion">VOLVER</button>
            </div>
            <div class="form-section">
                <h3>Configuración</h3>
                <div class="form-grid">
                    <div class="form-field"><label>Empresa</label><input type="text" id="configEmpresa" value="SERVICIOS MUÑOZ"></div>
                    <div class="form-field"><label>IVA (%)</label><input type="number" id="configIva" value="21" min="0" step="0.01"></div>
                </div>
                <button type="button" class="primary-button" id="guardarConfiguracion" style="margin-top:20px;">GUARDAR CONFIGURACIÓN</button><p id="mensajeAdministracion"></p>
            </div>
            <div class="form-section">
                <h3>Usuarios</h3>
                <p>Desde aquí puedes añadir trabajadores y administradores.</p>
                <div class="form-grid">
                    <div class="form-field"><label for="nuevoUsuarioAdmin">Usuario</label><input type="text" id="nuevoUsuarioAdmin" autocomplete="off" placeholder="Ej. juan"></div>
                    <div class="form-field"><label for="nuevaPasswordAdmin">Contraseña</label><input type="password" id="nuevaPasswordAdmin" autocomplete="new-password" placeholder="Contraseña"></div>
                    <div class="form-field"><label for="nuevoRolAdmin">Tipo de usuario</label><select id="nuevoRolAdmin"><option value="trabajador">Trabajador</option><option value="administrador">Administrador</option></select></div>
                </div>
                <button type="button" class="primary-button" id="crearUsuarioAdmin" style="margin-top:20px;">AÑADIR USUARIO</button>
                <p id="mensajeUsuariosAdmin"></p>
                <div id="listaUsuariosAdmin" style="margin-top:20px;"></div>
            </div>
            <div class="form-section">
                <h3>Usuario actual</h3><p><strong>Usuario:</strong> <span id="adminUsuarioActual"></span></p>
            </div>
        </section>`;
    while (contenedor.firstElementChild) appScreen.appendChild(contenedor.firstElementChild);
    clientesScreen = document.getElementById("clientesScreen");
    buscarScreen = document.getElementById("buscarScreen");
    administracionScreen = document.getElementById("administracionScreen");
    document.getElementById("volverDashboardClientes").addEventListener("click", () => { document.getElementById("detalleCliente").style.display = "none"; mostrarPantalla(dashboardScreen); });
    document.getElementById("actualizarClientes").addEventListener("click", cargarClientes);
    document.getElementById("cerrarDetalleCliente").addEventListener("click", () => { document.getElementById("detalleCliente").style.display = "none"; });
    document.getElementById("volverDashboardBuscar").addEventListener("click", () => mostrarPantalla(dashboardScreen));
    document.getElementById("campoBuscar").addEventListener("input", ejecutarBusqueda);
    document.getElementById("limpiarBusqueda").addEventListener("click", () => { document.getElementById("campoBuscar").value = ""; ejecutarBusqueda(); });
    document.getElementById("volverDashboardAdministracion").addEventListener("click", () => mostrarPantalla(dashboardScreen));
    document.getElementById("guardarConfiguracion").addEventListener("click", guardarConfiguracion);
    document.getElementById("crearUsuarioAdmin").addEventListener("click", crearUsuarioAdmin);
}

async function gestionarUsuariosAdmin(accion, datos = {}) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) {
        throw new Error("La sesión ha caducado. Vuelve a iniciar sesión.");
    }
    const respuesta = await fetch(`${SUPABASE_URL}/functions/v1/gestionar-usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ accion, ...datos })
    });
    const resultado = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
        throw new Error(resultado.error || resultado.message || "No se ha podido completar la operación.");
    }
    return resultado;
}

async function cargarUsuariosAdmin() {
    const lista = document.getElementById("listaUsuariosAdmin");
    const mensaje = document.getElementById("mensajeUsuariosAdmin");
    if (!lista || !mensaje) return;
    lista.innerHTML = "";
    mensaje.textContent = "Cargando usuarios...";
    try {
        const resultado = await gestionarUsuariosAdmin("listar");
        mensaje.textContent = "";
        if (!resultado.usuarios?.length) {
            lista.innerHTML = "<p>No hay usuarios registrados.</p>";
            return;
        }
        resultado.usuarios.forEach(usuario => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "reparacion-card";
            tarjeta.style.marginBottom = "10px";
            const rolTexto = usuario.rol === "administrador" ? "Administrador" : "Trabajador";
            tarjeta.innerHTML = `
                <div>
                    <strong>${escaparHTML(usuario.usuario || "")}</strong>
                    <div style="margin-top:5px;">${rolTexto}</div>
                    <div style="margin-top:5px;">${usuario.activo ? "Activo" : "Desactivado"}</div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
                    <button type="button" class="secondary-button btn-cambiar-rol">CAMBIAR ROL</button>
                    <button type="button" class="secondary-button btn-eliminar-usuario">ELIMINAR</button>
                </div>`;
            tarjeta.querySelector(".btn-cambiar-rol").addEventListener("click", async () => {
                const nuevoRol = usuario.rol === "administrador" ? "trabajador" : "administrador";
                if (!confirm(`¿Cambiar ${usuario.usuario} a ${nuevoRol}?`)) return;
                try {
                    await gestionarUsuariosAdmin("cambiar_rol", { id: usuario.id, rol: nuevoRol });
                    await cargarUsuariosAdmin();
                } catch (error) {
                    mensaje.textContent = error.message;
                    mensaje.style.color = "#b91c1c";
                }
            });
            tarjeta.querySelector(".btn-eliminar-usuario").addEventListener("click", async () => {
                if (!confirm(`¿Eliminar al usuario ${usuario.usuario}?`)) return;
                try {
                    await gestionarUsuariosAdmin("eliminar", { id: usuario.id });
                    await cargarUsuariosAdmin();
                } catch (error) {
                    mensaje.textContent = error.message;
                    mensaje.style.color = "#b91c1c";
                }
            });
            lista.appendChild(tarjeta);
        });
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = "#b91c1c";
    }
}

async function crearUsuarioAdmin() {
    const usuarioInputAdmin = document.getElementById("nuevoUsuarioAdmin");
    const passwordInputAdmin = document.getElementById("nuevaPasswordAdmin");
    const rolInputAdmin = document.getElementById("nuevoRolAdmin");
    const mensaje = document.getElementById("mensajeUsuariosAdmin");
    const boton = document.getElementById("crearUsuarioAdmin");
    if (!usuarioInputAdmin || !passwordInputAdmin || !rolInputAdmin || !mensaje || !boton) return;
    const usuario = usuarioInputAdmin.value.trim();
    const password = passwordInputAdmin.value;
    const rol = rolInputAdmin.value;
    mensaje.style.color = "";
    mensaje.textContent = "";
    if (!usuario || !password) {
        mensaje.textContent = "Introduce usuario y contraseña.";
        return;
    }
    if (password.length < 6) {
        mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
        return;
    }
    boton.disabled = true;
    boton.textContent = "CREANDO...";
    try {
        await gestionarUsuariosAdmin("crear", { usuario, password, rol });
        usuarioInputAdmin.value = "";
        passwordInputAdmin.value = "";
        rolInputAdmin.value = "trabajador";
        mensaje.style.color = "#15803d";
        mensaje.textContent = "Usuario creado correctamente.";
        await cargarUsuariosAdmin();
    } catch (error) {
        mensaje.style.color = "#b91c1c";
        mensaje.textContent = error.message;
    } finally {
        boton.disabled = false;
        boton.textContent = "AÑADIR USUARIO";
    }
}

function crearTarjetaResultado(reparacion) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "reparacion-card";

    tarjeta.innerHTML = `
        <div class="reparacion-card-info">
            <strong>
                ${escaparHTML(reparacion.numero_reparacion || "Sin número")}
            </strong>
            <p>
                ${escaparHTML(reparacion.cliente || "Sin cliente")}
            </p>
            <p>
                ${escaparHTML(reparacion.tipo_material || "Sin material")}
                ${reparacion.marca ? " · " + escaparHTML(reparacion.marca) : ""}
            </p>
        </div>

        <div class="reparacion-card-actions">
            ${renderizarEstado(reparacion.estado_reparacion)}
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

    const boton = tarjeta.querySelector(".btn-ver-reparacion");
    const detalle = tarjeta.querySelector(".detalle-reparacion-inline");

    boton.addEventListener("click", async () => {
        const abierto = detalle.style.display === "block";

        if (abierto) {
            detalle.style.display = "none";
            boton.textContent = "VER DETALLE";
            return;
        }

        // En Clientes/Buscar mostramos un único detalle abierto a la vez
        // dentro de la lista actual.
        const padre = tarjeta.parentElement;

        padre
            ?.querySelectorAll(".detalle-reparacion-inline")
            .forEach(otro => {
                if (otro !== detalle) {
                    otro.style.display = "none";
                }
            });

        padre
            ?.querySelectorAll(".btn-ver-reparacion")
            .forEach(otroBoton => {
                if (otroBoton !== boton) {
                    otroBoton.textContent = "VER DETALLE";
                }
            });

        detalle.style.display = "block";
        boton.textContent = "CERRAR DETALLE";

        try {
            await mostrarDetalleReparacionInline(
                reparacion,
                detalle
            );
        } catch (error) {
            console.error(error);
            detalle.innerHTML = `
                <p style="color:#dc2626;font-weight:bold;">
                    No se ha podido cargar el detalle de la reparación.
                </p>
                <p>${escaparHTML(error.message || "Error desconocido.")}</p>
            `;
        }
    });

    return tarjeta;
}
async function obtenerTodasLasReparaciones() {
    const { data, error } = await supabaseClient.from("recepciones").select("*").order("created_at", { ascending: false });
    if (error) throw error; return data || [];
}
async function cargarClientes() {
    const lista=document.getElementById("listaClientes"), mensaje=document.getElementById("mensajeClientes"), detalle=document.getElementById("detalleCliente");
    lista.innerHTML=""; mensaje.textContent="Cargando clientes..."; detalle.style.display="none";
    try {
        const reparaciones=await obtenerTodasLasReparaciones(), mapa=new Map();
        reparaciones.forEach(r=>{const nombre=(r.cliente||"Sin cliente").trim()||"Sin cliente", clave=`${nombre.toLowerCase()}|${(r.telefono||"").trim()}`; if(!mapa.has(clave)) mapa.set(clave,{cliente:nombre,telefono:r.telefono||"",email:r.email||"",reparaciones:[]}); const x=mapa.get(clave); x.email=x.email||r.email||""; x.reparaciones.push(r);});
        const clientes=[...mapa.values()].sort((a,b)=>a.cliente.localeCompare(b.cliente,"es"));
        if(!clientes.length){lista.innerHTML="<p>No hay clientes registrados.</p>"; mensaje.textContent=""; return;}
        clientes.forEach(cliente=>{const tarjeta=document.createElement("div"); tarjeta.className="reparacion-card"; tarjeta.innerHTML=`<div><strong>${escaparHTML(cliente.cliente)}</strong><p>${escaparHTML(cliente.telefono||"Sin teléfono")}</p><p>${escaparHTML(cliente.email||"Sin email")}</p></div><div style="text-align:right;"><p><strong>${cliente.reparaciones.length}</strong> reparación${cliente.reparaciones.length===1?"":"es"}</p><div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;"><button type="button" class="secondary-button btn-ver-cliente">VER REPARACIONES</button><button type="button" class="secondary-button btn-editar-cliente">EDITAR CLIENTE</button></div></div>`; tarjeta.querySelector(".btn-ver-cliente").addEventListener("click",()=>mostrarDetalleCliente(cliente)); tarjeta.querySelector(".btn-editar-cliente").addEventListener("click",()=>editarCliente(cliente)); lista.appendChild(tarjeta);});
        mensaje.textContent=`${clientes.length} cliente${clientes.length===1?"":"s"} encontrado${clientes.length===1?"":"s"}.`;
    } catch(error){console.error(error);mensaje.textContent=error.message||"No se han podido cargar los clientes.";}
}
function mostrarDetalleCliente(cliente){const detalle=document.getElementById("detalleCliente"), contenido=document.getElementById("contenidoDetalleCliente"); contenido.innerHTML=`<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;"><button type="button" class="primary-button" id="editarClienteDesdeDetalle">EDITAR CLIENTE</button></div><p><strong>Cliente:</strong> ${escaparHTML(cliente.cliente)}</p><p><strong>Teléfono:</strong> ${escaparHTML(cliente.telefono||"-")}</p><p><strong>Email:</strong> ${escaparHTML(cliente.email||"-")}</p><hr><h4 style="margin-top:18px;">Reparaciones del cliente</h4>`; document.getElementById("editarClienteDesdeDetalle").addEventListener("click",()=>editarCliente(cliente)); cliente.reparaciones.forEach(r=>contenido.appendChild(crearTarjetaResultado(r))); detalle.style.display="block"; detalle.scrollIntoView({behavior:"smooth",block:"start"});}
function editarCliente(cliente){const detalle=document.getElementById("detalleCliente"), contenido=document.getElementById("contenidoDetalleCliente"); contenido.innerHTML=`<h4 style="margin-top:0;">Editar datos del cliente</h4><div class="form-grid"><div class="form-field"><label for="editarClienteNombre">Nombre</label><input type="text" id="editarClienteNombre" value="${escaparHTML(cliente.cliente||"")}"></div><div class="form-field"><label for="editarClienteTelefono">Teléfono</label><input type="tel" id="editarClienteTelefono" value="${escaparHTML(cliente.telefono||"")}"></div><div class="form-field"><label for="editarClienteEmail">Email</label><input type="email" id="editarClienteEmail" value="${escaparHTML(cliente.email||"")}"></div></div><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;"><button type="button" class="primary-button" id="guardarDatosCliente">GUARDAR CAMBIOS</button><button type="button" class="secondary-button" id="cancelarEdicionCliente">CANCELAR</button></div><p id="mensajeEdicionCliente" style="margin-top:15px;"></p>`; document.getElementById("guardarDatosCliente").addEventListener("click",()=>guardarDatosCliente(cliente)); document.getElementById("cancelarEdicionCliente").addEventListener("click",()=>mostrarDetalleCliente(cliente)); detalle.style.display="block"; detalle.scrollIntoView({behavior:"smooth",block:"start"});}
async function guardarDatosCliente(cliente){const nombre=document.getElementById("editarClienteNombre").value.trim(), telefono=document.getElementById("editarClienteTelefono").value.trim(), email=document.getElementById("editarClienteEmail").value.trim(), mensaje=document.getElementById("mensajeEdicionCliente"), boton=document.getElementById("guardarDatosCliente"); if(!nombre){mensaje.textContent="El nombre del cliente es obligatorio.";mensaje.style.color="#dc2626";return;} boton.disabled=true; boton.textContent="GUARDANDO..."; mensaje.textContent=""; try{for(const reparacion of cliente.reparaciones){const {error}=await supabaseClient.from("recepciones").update({cliente:nombre,telefono,email}).eq("id",reparacion.id);if(error)throw error;Object.assign(reparacion,{cliente:nombre,telefono,email});} cliente.cliente=nombre; cliente.telefono=telefono; cliente.email=email; mensaje.textContent="Datos del cliente actualizados correctamente."; mensaje.style.color="#15803d"; await cargarClientes(); document.getElementById("detalleCliente").style.display="none";}catch(error){console.error(error);mensaje.textContent=error.message||"No se han podido actualizar los datos del cliente.";mensaje.style.color="#dc2626";}finally{boton.disabled=false;boton.textContent="GUARDAR CAMBIOS";}}
async function prepararBusqueda(){const resultados=document.getElementById("resultadosBusqueda"),mensaje=document.getElementById("mensajeBusqueda"); resultados.innerHTML=""; mensaje.textContent="Cargando..."; try{window.__reparacionesBusqueda=await obtenerTodasLasReparaciones(); ejecutarBusqueda(); mensaje.textContent=`${window.__reparacionesBusqueda.length} reparación${window.__reparacionesBusqueda.length===1?"":"es"} disponible${window.__reparacionesBusqueda.length===1?"":"s"}.`;}catch(error){console.error(error);mensaje.textContent=error.message||"No se han podido cargar las reparaciones.";}}
function ejecutarBusqueda(){const resultados=document.getElementById("resultadosBusqueda"); if(!resultados)return; const texto=(document.getElementById("campoBuscar")?.value||"").trim().toLowerCase(), datos=window.__reparacionesBusqueda||[], filtrados=!texto?datos:datos.filter(r=>[r.numero_reparacion,r.cliente,r.telefono,r.email,r.tipo_material,r.marca,r.modelo,r.numero_serie,r.estado_reparacion].some(v=>String(v||"").toLowerCase().includes(texto))); resultados.innerHTML=""; if(!filtrados.length){resultados.innerHTML="<p>No se han encontrado resultados.</p>";return;} filtrados.forEach(r=>resultados.appendChild(crearTarjetaResultado(r)));}
function cargarConfiguracion(){document.getElementById("configEmpresa").value=localStorage.getItem("configEmpresa")||"SERVICIOS MUÑOZ"; document.getElementById("configIva").value=localStorage.getItem("configIva")||"21"; document.getElementById("adminUsuarioActual").textContent=usuarioActual||"-";}
function guardarConfiguracion(){localStorage.setItem("configEmpresa",document.getElementById("configEmpresa").value.trim()||"SERVICIOS MUÑOZ");localStorage.setItem("configIva",document.getElementById("configIva").value||"21");const m=document.getElementById("mensajeAdministracion");m.textContent="Configuración guardada correctamente.";m.style.color="#15803d";}

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
    albaranesScreen.style.display = "none";
    albaranFormScreen.style.display = "none";
    if (clientesScreen) clientesScreen.style.display = "none";
    if (buscarScreen) buscarScreen.style.display = "none";
    if (administracionScreen) administracionScreen.style.display = "none";
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
    crearPantallasExtra();
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

function normalizarRutasFotos(rutas) {
    if (!rutas) return [];

    if (Array.isArray(rutas)) {
        return rutas.filter(Boolean);
    }

    if (typeof rutas === "string") {
        try {
            const parsed = JSON.parse(rutas);
            return Array.isArray(parsed)
                ? parsed.filter(Boolean)
                : [];
        } catch {
            return [];
        }
    }

    return [];
}

function pintarMiniaturasEdicion(
    contenedor,
    urls,
    mensajeVacio
) {
    contenedor.innerHTML = "";

    if (!urls || !urls.length) {
        contenedor.innerHTML = `
            <p style="margin:0;color:#666;">
                ${escaparHTML(mensajeVacio || "No hay fotografías.")}
            </p>
        `;
        return;
    }

    urls.forEach((url, indice) => {
        const tarjeta = document.createElement("div");
        Object.assign(tarjeta.style, {
            position: "relative",
            width: "120px",
            height: "120px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #ddd",
            background: "#f5f5f5"
        });

        const imagen = document.createElement("img");
        imagen.src = url;
        imagen.alt = `Fotografía guardada ${indice + 1}`;
        Object.assign(imagen.style, {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            cursor: "pointer"
        });

        imagen.addEventListener("click", () => {
            const modal = document.createElement("div");
            Object.assign(modal.style, {
                position: "fixed",
                inset: "0",
                zIndex: "99999",
                background: "rgba(0,0,0,.88)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                boxSizing: "border-box",
                cursor: "pointer"
            });

            const grande = document.createElement("img");
            grande.src = url;
            grande.alt = imagen.alt;
            Object.assign(grande.style, {
                maxWidth: "92vw",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "12px",
                background: "#222",
                cursor: "default"
            });

            modal.addEventListener("click", () => modal.remove());
            modal.appendChild(grande);
            document.body.appendChild(modal);
        });

        const etiqueta = document.createElement("span");
        etiqueta.textContent = String(indice + 1);
        Object.assign(etiqueta.style, {
            position: "absolute",
            left: "6px",
            top: "6px",
            minWidth: "24px",
            height: "24px",
            padding: "0 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "999px",
            background: "rgba(0,0,0,.65)",
            color: "#fff",
            fontSize: "12px",
            fontWeight: "bold",
            boxSizing: "border-box"
        });

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(etiqueta);
        contenedor.appendChild(tarjeta);
    });
}

async function subirFotosEdicionReparacion(
    reparacion,
    archivos
) {
    const fotosSubidas = [];
    const lista = Array.from(archivos || []).filter(
        archivo =>
            archivo &&
            String(archivo.type || "").startsWith("image/")
    );

    if (!lista.length) return fotosSubidas;

    const numero = reparacion?.numero_reparacion || "reparacion";

    for (let indice = 0; indice < lista.length; indice++) {
        const archivo = lista[indice];
        const nombreLimpio = String(archivo.name || "foto.jpg")
            .replace(/[^\w.\-]/g, "_")
            .replace(/_+/g, "_");

        const nombreArchivo =
            `${Date.now()}_${indice + 1}_${nombreLimpio}`;

        const ruta =
            `private/reparaciones/${numero}/${nombreArchivo}`;

        const { error } = await supabaseClient.storage
            .from("fotos-recepciones")
            .upload(ruta, archivo, {
                cacheControl: "3600",
                upsert: false
            });

        if (error) throw error;
        fotosSubidas.push(ruta);
    }

    return fotosSubidas;
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
                    /[^\w.**\-**]/g,
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
<button
    type="button"
    class="secondary-button btn-eliminar-reparacion"
    style="
        background:#dc2626;
        color:white;
        border-color:#dc2626;
        padding:10px 16px;
        font-size:13px;
    "
>
    BORRAR
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
                const botonEliminar =
    tarjeta.querySelector(
        ".btn-eliminar-reparacion"
    );
botonEliminar.addEventListener(
    "click",
    async () => {
        await eliminarReparacion(reparacion);
    }
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
async function eliminarReparacion(reparacion) {
    const numero =
        reparacion?.numero_reparacion ||
        "esta reparación";
    const confirmar = confirm(
        `¿Seguro que quieres borrar la reparación ${numero}?\n\n` +
        `También se eliminarán sus fotografías.\n\n` +
        `Esta acción no se puede deshacer.`
    );
    if (!confirmar) {
        return;
    }
    mensajeReparaciones.textContent =
        "Eliminando reparación...";
    try {
        let rutasFotos = [];
        if (Array.isArray(reparacion?.fotos)) {
            rutasFotos = reparacion.fotos;
        } else if (typeof reparacion?.fotos === "string") {
            try {
                rutasFotos = JSON.parse(reparacion.fotos);
            } catch {
                rutasFotos = [];
            }
        }
        if (!Array.isArray(rutasFotos)) {
            rutasFotos = [];
        }
        rutasFotos = rutasFotos.filter(Boolean);
        if (rutasFotos.length) {
            const { error: errorFotos } =
                await supabaseClient.storage
                    .from("fotos-recepciones")
                    .remove(rutasFotos);
            if (errorFotos) {
                throw errorFotos;
            }
        }
        const { error } =
            await supabaseClient
                .from("recepciones")
                .delete()
                .eq("id", reparacion.id);
        if (error) {
            throw error;
        }
        detalleReparacion.style.display = "none";
        await cargarReparaciones();
        mensajeReparaciones.textContent =
            `La reparación ${numero} se ha eliminado correctamente.`;
        mensajeReparaciones.style.color = "#15803d";
    } catch (error) {
        console.error(error);
        mensajeReparaciones.textContent =
            `No se ha podido eliminar la reparación: ${error.message}`;
        mensajeReparaciones.style.color = "#dc2626";
    }
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
            async () => {
                await crearFormularioEdicionInline(
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
async function crearFormularioEdicionInline(
    reparacion,
    contenedor
) {
    const rutasFotosExistentes =
        normalizarRutasFotos(
            reparacion.fotos
        );

    const sufijo =
        String(
            reparacion.id ||
            reparacion.numero_reparacion ||
            Date.now()
        )
            .replace(
                /[^\w\-]/g,
                "_"
            );

    const idEstado =
        `editarEstadoInline_${sufijo}`;

    const idDiagnostico =
        `editarDiagnosticoInline_${sufijo}`;

    const idPruebas =
        `editarPruebasInline_${sufijo}`;

    const idObservaciones =
        `editarObservacionesInline_${sufijo}`;

    const idPiezas =
        `editarPiezasInline_${sufijo}`;

    const idManoObra =
        `editarManoObraInline_${sufijo}`;

    const idCostePiezas =
        `editarPiezasCosteInline_${sufijo}`;

    const idCosteManoObra =
        `editarManoObraCosteInline_${sufijo}`;

    const idOtrosCostes =
        `editarOtrosCostesInline_${sufijo}`;

    const idEstadoPresupuesto =
        `editarEstadoPresupuestoInline_${sufijo}`;

    const idTotal =
        `editarTotalInline_${sufijo}`;

    const idIva =
        `editarIvaInline_${sufijo}`;

    const idTotalConIva =
        `editarTotalConIvaInline_${sufijo}`;

    const idCamara =
        `editarFotosCamara_${sufijo}`;

    const idGaleria =
        `editarFotosGaleria_${sufijo}`;

    const idGaleriaNuevas =
        `editarFotosNuevas_${sufijo}`;

    const idResumenFotos =
        `editarResumenFotos_${sufijo}`;

    const idResumenNuevas =
        `editarResumenNuevasFotos_${sufijo}`;

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

                <select id="${idEstado}">
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
                    id="${idDiagnostico}"
                ></textarea>
            </div>

            <div class="form-field">
                <label>
                    Pruebas realizadas
                </label>

                <textarea
                    id="${idPruebas}"
                ></textarea>
            </div>

            <div class="form-field">
                <label>
                    Observaciones del taller
                </label>

                <textarea
                    id="${idObservaciones}"
                ></textarea>
            </div>

            <div class="form-field">
                <label>
                    Piezas
                </label>

                <textarea
                    id="${idPiezas}"
                ></textarea>
            </div>

            <div class="form-field">
                <label>
                    Mano de obra
                </label>

                <textarea
                    id="${idManoObra}"
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
                        id="${idCostePiezas}"
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
                        id="${idCosteManoObra}"
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
                        id="${idOtrosCostes}"
                        min="0"
                        step="0.01"
                    >
                </div>
            </div>

            <div class="form-field">
                <label>
                    Estado del presupuesto
                </label>

                <select id="${idEstadoPresupuesto}">
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
                    Subtotal sin IVA (€)
                </label>

                <input
                    type="number"
                    id="${idTotal}"
                    readonly
                >
            </div>

            <div class="form-field">
                <label>
                    IVA (21 %) (€)
                </label>

                <input
                    type="number"
                    id="${idIva}"
                    readonly
                >
            </div>

            <div class="form-field">
                <label>
                    Total con IVA (€)
                </label>

                <input
                    type="number"
                    id="${idTotalConIva}"
                    readonly
                >
            </div>

            <div
                class="form-field"
                style="margin-top:25px;"
            >
                <label>
                    Fotografías de la reparación
                </label>

                <div
                    style="
                        background:#f8fafc;
                        border:1px solid #e5e7eb;
                        border-radius:12px;
                        padding:18px;
                    "
                >
                    <strong
                        style="
                            display:block;
                            margin-bottom:10px;
                        "
                    >
                        Fotografías actuales
                    </strong>

                    <p
                        id="${idResumenFotos}"
                        style="
                            margin:0 0 12px;
                            color:#666;
                        "
                    >
                        ${
                            rutasFotosExistentes.length
                                ? `Cargando ${rutasFotosExistentes.length} fotografía${rutasFotosExistentes.length === 1 ? "" : "s"}...`
                                : "Esta reparación todavía no tiene fotografías."
                        }
                    </p>

                    <div
                        id="${idGaleria}"
                        style="
                            display:flex;
                            gap:12px;
                            flex-wrap:wrap;
                            margin-bottom:18px;
                        "
                    ></div>

                    <strong
                        style="
                            display:block;
                            margin-bottom:10px;
                        "
                    >
                        Añadir nuevas fotografías
                    </strong>

                    <div
                        style="
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                            margin-bottom:10px;
                        "
                    >
                        <button
                            type="button"
                            class="secondary-button"
                            data-accion="editar-foto-camara"
                        >
                            HACER FOTO
                        </button>

                        <button
                            type="button"
                            class="secondary-button"
                            data-accion="editar-foto-galeria"
                        >
                            ELEGIR DE GALERÍA
                        </button>
                    </div>

                    <input
                        type="file"
                        id="${idCamara}"
                        accept="image/*"
                        capture="environment"
                        multiple
                        style="display:none;"
                    >

                    <input
                        type="file"
                        id="${idGaleriaNuevas}"
                        accept="image/*"
                        multiple
                        style="display:none;"
                    >

                    <p
                        id="${idResumenNuevas}"
                        style="
                            margin:8px 0 12px;
                            color:#666;
                        "
                    >
                        No has añadido fotografías nuevas.
                    </p>

                    <div
                        data-galeria-nuevas
                        style="
                            display:flex;
                            gap:12px;
                            flex-wrap:wrap;
                        "
                    ></div>
                </div>
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
                    data-accion="guardar-edicion"
                >
                    GUARDAR CAMBIOS
                </button>

                <button
                    type="button"
                    class="secondary-button"
                    data-accion="cancelar-edicion"
                >
                    CANCELAR
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

    const estado =
        contenedor.querySelector(
            `#${idEstado}`
        );

    const diagnostico =
        contenedor.querySelector(
            `#${idDiagnostico}`
        );

    const pruebas =
        contenedor.querySelector(
            `#${idPruebas}`
        );

    const observaciones =
        contenedor.querySelector(
            `#${idObservaciones}`
        );

    const piezas =
        contenedor.querySelector(
            `#${idPiezas}`
        );

    const manoObra =
        contenedor.querySelector(
            `#${idManoObra}`
        );

    const costePiezas =
        contenedor.querySelector(
            `#${idCostePiezas}`
        );

    const costeManoObra =
        contenedor.querySelector(
            `#${idCosteManoObra}`
        );

    const otrosCostes =
        contenedor.querySelector(
            `#${idOtrosCostes}`
        );

    const estadoPresupuesto =
        contenedor.querySelector(
            `#${idEstadoPresupuesto}`
        );

    const total =
        contenedor.querySelector(
            `#${idTotal}`
        );

    const iva =
        contenedor.querySelector(
            `#${idIva}`
        );

    const totalConIva =
        contenedor.querySelector(
            `#${idTotalConIva}`
        );

    const resumenFotos =
        contenedor.querySelector(
            `#${idResumenFotos}`
        );

    const galeriaFotos =
        contenedor.querySelector(
            `#${idGaleria}`
        );

    const resumenNuevas =
        contenedor.querySelector(
            `#${idResumenNuevas}`
        );

    const galeriaNuevas =
        contenedor.querySelector(
            "[data-galeria-nuevas]"
        );

    const inputCamara =
        contenedor.querySelector(
            `#${idCamara}`
        );

    const inputGaleria =
        contenedor.querySelector(
            `#${idGaleriaNuevas}`
        );

    const mensaje =
        contenedor.querySelector(
            "[data-mensaje-edicion]"
        );

    const botonGuardar =
        contenedor.querySelector(
            '[data-accion="guardar-edicion"]'
        );

    let archivosFotosNuevas = [];

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
        const subtotal =
            (Number(costePiezas.value) || 0) +
            (Number(costeManoObra.value) || 0) +
            (Number(otrosCostes.value) || 0);

        const importeIva =
            subtotal * 0.21;

        const totalFinal =
            subtotal + importeIva;

        total.value =
            subtotal.toFixed(2);

        iva.value =
            importeIva.toFixed(2);

        totalConIva.value =
            totalFinal.toFixed(2);
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

    function renderizarNuevasFotos() {
        galeriaNuevas.innerHTML = "";

        const cantidad =
            archivosFotosNuevas.length;

        resumenNuevas.textContent =
            cantidad === 0
                ? "No has añadido fotografías nuevas."
                : `${cantidad} fotografía${cantidad === 1 ? "" : "s"} nueva${cantidad === 1 ? "" : "s"} pendiente${cantidad === 1 ? "" : "s"} de guardar.`;

        archivosFotosNuevas.forEach(
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

                const objectUrl =
                    URL.createObjectURL(
                        archivo
                    );

                imagen.src =
                    objectUrl;

                imagen.alt =
                    `Nueva fotografía ${indice + 1}`;

                Object.assign(
                    imagen.style,
                    {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                    }
                );

                imagen.addEventListener(
                    "load",
                    () => {
                        URL.revokeObjectURL(
                            objectUrl
                        );
                    },
                    {
                        once: true
                    }
                );

                const eliminar =
                    document.createElement("button");

                eliminar.type =
                    "button";

                eliminar.textContent =
                    "×";

                eliminar.title =
                    "Quitar fotografía";

                Object.assign(
                    eliminar.style,
                    {
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        width: "30px",
                        height: "30px",
                        padding: "0",
                        border: "none",
                        borderRadius: "50%",
                        background: "#dc2626",
                        color: "#fff",
                        fontSize: "20px",
                        lineHeight: "30px"
                    }
                );

                eliminar.addEventListener(
                    "click",
                    () => {
                        archivosFotosNuevas.splice(
                            indice,
                            1
                        );

                        renderizarNuevasFotos();
                    }
                );

                tarjeta.appendChild(
                    imagen
                );

                tarjeta.appendChild(
                    eliminar
                );

                galeriaNuevas.appendChild(
                    tarjeta
                );
            }
        );
    }

    function añadirArchivosFotosNuevas(
        lista
    ) {
        const imagenes =
            Array.from(
                lista || []
            ).filter(
                archivo =>
                    archivo &&
                    String(
                        archivo.type || ""
                    ).startsWith("image/")
            );

        if (!imagenes.length) {
            return;
        }

        archivosFotosNuevas.push(
            ...imagenes
        );

        renderizarNuevasFotos();
    }

    inputCamara.addEventListener(
        "change",
        () => {
            añadirArchivosFotosNuevas(
                inputCamara.files
            );

            inputCamara.value =
                "";
        }
    );

    inputGaleria.addEventListener(
        "change",
        () => {
            añadirArchivosFotosNuevas(
                inputGaleria.files
            );

            inputGaleria.value =
                "";
        }
    );

    contenedor
        .querySelector(
            '[data-accion="editar-foto-camara"]'
        )
        .addEventListener(
            "click",
            () => {
                inputCamara.click();
            }
        );

    contenedor
        .querySelector(
            '[data-accion="editar-foto-galeria"]'
        )
        .addEventListener(
            "click",
            () => {
                inputGaleria.click();
            }
        );

    calcularTotal();
    renderizarNuevasFotos();

    if (rutasFotosExistentes.length) {
        try {
            const urlsExistentes =
                await cargarFotosRecepcion(
                    rutasFotosExistentes
                );

            pintarMiniaturasEdicion(
                galeriaFotos,
                urlsExistentes,
                "No se han podido cargar las fotografías existentes."
            );

            resumenFotos.textContent =
                `${urlsExistentes.length} fotografía${urlsExistentes.length === 1 ? "" : "s"} guardada${urlsExistentes.length === 1 ? "" : "s"}.`;
        } catch (error) {
            console.error(error);

            pintarMiniaturasEdicion(
                galeriaFotos,
                [],
                "No se han podido cargar las fotografías existentes."
            );

            resumenFotos.textContent =
                "No se han podido cargar las fotografías existentes.";
        }
    } else {
        pintarMiniaturasEdicion(
            galeriaFotos,
            [],
            "Esta reparación todavía no tiene fotografías."
        );
    }

    botonGuardar.addEventListener(
        "click",
        async () => {
            mensaje.textContent =
                "Guardando cambios...";

            mensaje.style.color =
                "#222";

            botonGuardar.disabled =
                true;

            botonGuardar.textContent =
                "GUARDANDO...";

            let rutasFotosNuevasSubidas =
                [];

            try {
                const rutasExistentes =
                    normalizarRutasFotos(
                        reparacion.fotos
                    );

                rutasFotosNuevasSubidas =
                    await subirFotosEdicionReparacion(
                        reparacion,
                        archivosFotosNuevas
                    );

                const rutasFotosFinales = [
                    ...rutasExistentes,
                    ...rutasFotosNuevasSubidas
                ];

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
                        estadoPresupuesto.value,

                    fotos:
                        rutasFotosFinales
                };

                const {
                    error
                } =
                    await supabaseClient
                        .from("recepciones")
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
                    rutasFotosNuevasSubidas.length
                        ? `Cambios guardados correctamente. Se añadieron ${rutasFotosNuevasSubidas.length} fotografía${rutasFotosNuevasSubidas.length === 1 ? "" : "s"}.`
                        : "Cambios guardados correctamente.";

                mensaje.style.color =
                    "#15803d";

                setTimeout(
                    async () => {
                        await mostrarDetalleReparacionInline(
                            reparacion,
                            contenedor
                        );
                    },
                    650
                );
            } catch (error) {
                console.error(error);

                if (
                    rutasFotosNuevasSubidas.length
                ) {
                    const {
                        error:
                            errorLimpiezaFotos
                    } =
                        await supabaseClient.storage
                            .from(
                                "fotos-recepciones"
                            )
                            .remove(
                                rutasFotosNuevasSubidas
                            );

                    if (
                        errorLimpiezaFotos
                    ) {
                        console.error(
                            "No se pudieron limpiar las fotos subidas tras el error:",
                            errorLimpiezaFotos
                        );
                    }
                }

                mensaje.textContent =
                    "Error al guardar: " +
                    (
                        error.message ||
                        "Error desconocido."
                    );

                mensaje.style.color =
                    "#dc2626";
            } finally {
                botonGuardar.disabled =
                    false;

                botonGuardar.textContent =
                    "GUARDAR CAMBIOS";
            }
        }
    );

    contenedor
        .querySelector(
            '[data-accion="cancelar-edicion"]'
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
                        ${(
                            Number(
                                reparacion.total_presupuesto || 0
                            ) * 1.21
                        ).toFixed(2)} €
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

function formatearFechaHoraAlbaran(valor) {
    if (!valor) return "";
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return String(valor);
    return fecha.toLocaleString("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function generarNumeroAlbaranLocal(ultimoNumero) {
    const año = new Date().getFullYear();
    const coincidencia = String(ultimoNumero || "").match(
        new RegExp(`^ALB-${año}-(\\d{4})$`)
    );
    const siguiente = coincidencia ? Number(coincidencia[1]) + 1 : 1;
    return `ALB-${año}-${String(siguiente).padStart(4, "0")}`;
}

async function obtenerSiguienteNumeroAlbaran() {
    const año = new Date().getFullYear();
    const { data, error } = await supabaseClient
        .from("albaranes")
        .select("numero_albaran")
        .like("numero_albaran", `ALB-${año}-%`)
        .order("numero_albaran", { ascending: false })
        .limit(1);

    if (error) throw error;
    return generarNumeroAlbaranLocal(data?.[0]?.numero_albaran || "");
}

function limpiarFormularioAlbaran() {
    albaranForm.reset();
    itemsActualesAlbaran = [];
    reparacionesDisponiblesAlbaran = [];
    materialSeleccionAlbaran.innerHTML = "";
    itemsAlbaran.innerHTML = "";
    mensajeItemsAlbaran.textContent = "";
    mensajeGuardarAlbaran.textContent = "";
    numeroAlbaran.value = "";
    fechaAlbaran.value = "";
    ivaAlbaran.value = localStorage.getItem("configIva") || "21";
    cantidadManualAlbaran.value = "1";
    precioManualAlbaran.value = "0";
    calcularTotalesAlbaran();
}

async function prepararNuevoAlbaran() {
    limpiarFormularioAlbaran();
    const fecha = obtenerFechaActual();
    fechaAlbaran.value = fecha.valor;
    numeroAlbaran.value = await obtenerSiguienteNumeroAlbaran();

    const { data, error } = await supabaseClient
        .from("recepciones")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    reparacionesDisponiblesAlbaran = data || [];
    selectorReparacionAlbaran.innerHTML =
        '<option value="">Selecciona una reparación...</option>';

    reparacionesDisponiblesAlbaran.forEach(reparacion => {
        const option = document.createElement("option");
        option.value = reparacion.id;
        option.textContent =
            `${reparacion.numero_reparacion || "Sin número"} · ${reparacion.cliente || "Sin cliente"} · ${reparacion.tipo_material || "Sin material"}`;
        selectorReparacionAlbaran.appendChild(option);
    });

    mostrarPantalla(albaranFormScreen);
}

function buscarReparacionAlbaranPorId(id) {
    return reparacionesDisponiblesAlbaran.find(
        reparacion => String(reparacion.id) === String(id)
    );
}

function mostrarMaterialDeReparacionAlbaran(reparacion) {
    materialSeleccionAlbaran.innerHTML = "";
    if (!reparacion) return;

    clienteAlbaran.value = reparacion.cliente || "";
    telefonoAlbaran.value = reparacion.telefono || "";
    emailAlbaran.value = reparacion.email || "";

    const contenedor = document.createElement("div");
    contenedor.className = "albaran-reparacion-box";

    const opciones = [];
    const materialPrincipal = [
        reparacion.tipo_material,
        reparacion.marca,
        reparacion.modelo,
        reparacion.numero_serie
            ? `N.º serie: ${reparacion.numero_serie}`
            : ""
    ].filter(Boolean).join(" · ");

    if (materialPrincipal) {
        opciones.push({
            tipo: "reparacion",
            descripcion: materialPrincipal,
            cantidad: 1,
            precio: 0,
            reparacion_id: reparacion.id,
            numero_reparacion: reparacion.numero_reparacion || ""
        });
    }

    if (String(reparacion.accesorios || "").trim()) {
        opciones.push({
            tipo: "accesorio",
            descripcion: reparacion.accesorios.trim(),
            cantidad: 1,
            precio: 0,
            reparacion_id: reparacion.id,
            numero_reparacion: reparacion.numero_reparacion || ""
        });
    }

    const titulo = document.createElement("h4");
    titulo.textContent = "Selecciona exactamente lo que se entrega:";
    contenedor.appendChild(titulo);

    if (!opciones.length) {
        contenedor.insertAdjacentHTML(
            "beforeend",
            "<p>Esta reparación no tiene material o accesorios registrados.</p>"
        );
        materialSeleccionAlbaran.appendChild(contenedor);
        return;
    }

    opciones.forEach(opcion => {
        const fila = document.createElement("label");
        fila.className = "albaran-opcion-material";
        fila.innerHTML = `
            <input type="checkbox" class="check-material-albaran">
            <span>${escaparHTML(opcion.descripcion)}</span>
        `;
        const checkbox = fila.querySelector("input");
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                agregarItemAlbaran(opcion);
            } else {
                itemsActualesAlbaran = itemsActualesAlbaran.filter(
                    item => !(
                        item.reparacion_id === opcion.reparacion_id &&
                        item.tipo === opcion.tipo &&
                        item.descripcion === opcion.descripcion
                    )
                );
                renderizarItemsAlbaran();
            }
        });
        contenedor.appendChild(fila);
    });

    materialSeleccionAlbaran.appendChild(contenedor);
}

function agregarItemAlbaran(item) {
    const existe = itemsActualesAlbaran.some(actual =>
        actual.reparacion_id === item.reparacion_id &&
        actual.tipo === item.tipo &&
        actual.descripcion === item.descripcion
    );
    if (existe) return;

    itemsActualesAlbaran.push({
        ...item,
        cantidad: Number(item.cantidad) || 1,
        precio: Number(item.precio) || 0
    });
    renderizarItemsAlbaran();
}

function agregarMaterialManualAlbaranFuncion() {
    const descripcion = materialManualAlbaran.value.trim();
    const cantidad = Number(cantidadManualAlbaran.value) || 0;
    const precio = Number(precioManualAlbaran.value) || 0;

    if (!descripcion) {
        mensajeItemsAlbaran.textContent = "Escribe una descripción del material.";
        mensajeItemsAlbaran.style.color = "#b91c1c";
        return;
    }
    if (cantidad <= 0) {
        mensajeItemsAlbaran.textContent = "La cantidad debe ser mayor que 0.";
        mensajeItemsAlbaran.style.color = "#b91c1c";
        return;
    }

    itemsActualesAlbaran.push({
        tipo: "manual",
        descripcion,
        cantidad,
        precio,
        reparacion_id: null,
        numero_reparacion: ""
    });

    materialManualAlbaran.value = "";
    cantidadManualAlbaran.value = "1";
    precioManualAlbaran.value = "0";
    mensajeItemsAlbaran.textContent = "";
    renderizarItemsAlbaran();
}

function renderizarItemsAlbaran() {
    itemsAlbaran.innerHTML = "";

    if (!itemsActualesAlbaran.length) {
        itemsAlbaran.innerHTML =
            '<p class="albaran-sin-items">Todavía no has añadido material.</p>';
        calcularTotalesAlbaran();
        return;
    }

    itemsActualesAlbaran.forEach((item, indice) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "albaran-item-card";
        const importe =
            Number(item.cantidad || 0) * Number(item.precio || 0);

        tarjeta.innerHTML = `
            <div class="albaran-item-info">
                <strong>${escaparHTML(item.descripcion)}</strong>
                <small>${item.tipo === "manual"
                    ? "Material añadido manualmente"
                    : "Desde reparación " + escaparHTML(item.numero_reparacion || "")}</small>
            </div>
            <div class="albaran-item-numeros">
                <label>Cantidad
                    <input type="number" class="albaran-item-cantidad" min="1" step="1" value="${Number(item.cantidad || 1)}">
                </label>
                <label>Precio unitario
                    <input type="number" class="albaran-item-precio" min="0" step="0.01" value="${Number(item.precio || 0).toFixed(2)}">
                </label>
                <strong>${importe.toFixed(2)} €</strong>
                <button type="button" class="secondary-button albaran-item-eliminar">ELIMINAR</button>
            </div>
        `;

        const cantidadInput = tarjeta.querySelector(".albaran-item-cantidad");
        const precioInput = tarjeta.querySelector(".albaran-item-precio");

        cantidadInput.addEventListener("change", () => {
            itemsActualesAlbaran[indice].cantidad =
                Math.max(1, Number(cantidadInput.value) || 1);
            renderizarItemsAlbaran();
        });
        precioInput.addEventListener("change", () => {
            itemsActualesAlbaran[indice].precio =
                Math.max(0, Number(precioInput.value) || 0);
            renderizarItemsAlbaran();
        });
        tarjeta.querySelector(".albaran-item-eliminar").addEventListener(
            "click",
            () => {
                const eliminado = itemsActualesAlbaran[indice];
                itemsActualesAlbaran.splice(indice, 1);

                if (eliminado.tipo !== "manual") {
                    materialSeleccionAlbaran
                        .querySelectorAll(".check-material-albaran")
                        .forEach(checkbox => {
                            if (
                                checkbox.nextElementSibling?.textContent ===
                                eliminado.descripcion
                            ) {
                                checkbox.checked = false;
                            }
                        });
                }
                renderizarItemsAlbaran();
            }
        );

        itemsAlbaran.appendChild(tarjeta);
    });

    calcularTotalesAlbaran();
}

function calcularTotalesAlbaran() {
    const subtotal = itemsActualesAlbaran.reduce(
        (total, item) =>
            total +
            (Number(item.cantidad) || 0) *
            (Number(item.precio) || 0),
        0
    );
    const ivaPorcentaje = Math.max(0, Number(ivaAlbaran.value) || 0);
    const iva = subtotal * ivaPorcentaje / 100;
    const total = subtotal + iva;

    subtotalAlbaran.textContent = `${subtotal.toFixed(2)} €`;
    importeIvaAlbaran.textContent = `${iva.toFixed(2)} €`;
    totalAlbaran.textContent = `${total.toFixed(2)} €`;

    return {
        subtotal,
        ivaPorcentaje,
        iva,
        total
    };
}

async function cargarAlbaranes() {
    listaAlbaranes.innerHTML = "";
    detalleAlbaran.style.display = "none";
    mensajeAlbaranes.textContent = "Cargando albaranes...";
    mensajeAlbaranes.style.color = "";

    const { data, error } = await supabaseClient
        .from("albaranes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        mensajeAlbaranes.textContent =
            error.message || "No se han podido cargar los albaranes.";
        mensajeAlbaranes.style.color = "#b91c1c";
        return;
    }

    if (!data?.length) {
        listaAlbaranes.innerHTML = "<p>No hay albaranes registrados.</p>";
        mensajeAlbaranes.textContent = "";
        return;
    }

    mensajeAlbaranes.textContent =
        `${data.length} albarán${data.length === 1 ? "" : "es"} registrado${data.length === 1 ? "" : "s"}.`;

    data.forEach(albaran => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "reparacion-card";
        tarjeta.innerHTML = `
            <div>
                <strong>${escaparHTML(albaran.numero_albaran || "Sin número")}</strong>
                <p>${escaparHTML(albaran.cliente || "Sin cliente")}</p>
                <p>${escaparHTML(formatearFechaHoraAlbaran(albaran.fecha_albaran || albaran.created_at))}</p>
            </div>
            <div>
                <p><strong>${Number(albaran.total || 0).toFixed(2)} €</strong></p>
                <button type="button" class="secondary-button btn-ver-albaran">VER DETALLE</button>
            </div>
        `;
        tarjeta.querySelector(".btn-ver-albaran").addEventListener(
            "click",
            () => mostrarDetalleAlbaran(albaran)
        );
        listaAlbaranes.appendChild(tarjeta);
    });
}

function mostrarDetalleAlbaran(albaran) {
    detalleAlbaran.style.display = "block";
    const items = Array.isArray(albaran.items) ? albaran.items : [];

    contenidoDetalleAlbaran.innerHTML = `
        <div class="albaran-detalle-cabecera">
            <div>
                <p><strong>Número:</strong> ${escaparHTML(albaran.numero_albaran || "")}</p>
                <p><strong>Fecha:</strong> ${escaparHTML(formatearFechaHoraAlbaran(albaran.fecha_albaran || albaran.created_at))}</p>
            </div>
            <div>
                <p><strong>Cliente:</strong> ${escaparHTML(albaran.cliente || "")}</p>
                <p><strong>Teléfono:</strong> ${escaparHTML(albaran.telefono || "")}</p>
                <p><strong>Email:</strong> ${escaparHTML(albaran.email || "")}</p>
            </div>
        </div>
        <hr>
        <h4>Material entregado</h4>
        <div class="albaran-detalle-items">
            ${items.length ? items.map(item => `
                <div class="albaran-detalle-item">
                    <span>${escaparHTML(item.descripcion || "")}</span>
                    <span>${Number(item.cantidad || 0)} × ${Number(item.precio || 0).toFixed(2)} € = <strong>${(Number(item.cantidad || 0) * Number(item.precio || 0)).toFixed(2)} €</strong></span>
                </div>
            `).join("") : "<p>Sin material registrado.</p>"}
        </div>
        <div class="albaran-detalle-totales">
            <p><strong>Subtotal:</strong> ${Number(albaran.subtotal || 0).toFixed(2)} €</p>
            <p><strong>IVA (${Number(albaran.iva_porcentaje || 0).toFixed(2)} %):</strong> ${Number(albaran.iva_importe || 0).toFixed(2)} €</p>
            <p class="albaran-detalle-total"><strong>TOTAL:</strong> ${Number(albaran.total || 0).toFixed(2)} €</p>
        </div>
        ${albaran.observaciones ? `<hr><p><strong>Observaciones:</strong><br>${escaparHTML(albaran.observaciones)}</p>` : ""}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:25px;">
            <button type="button" class="primary-button" id="imprimirAlbaranDetalle">🖨️ IMPRIMIR</button>
        </div>
    `;

    document.getElementById("imprimirAlbaranDetalle")?.addEventListener(
        "click",
        () => imprimirAlbaran(albaran)
    );

    detalleAlbaran.scrollIntoView({ behavior: "smooth", block: "start" });
}

function imprimirAlbaran(albaran) {
    const items = Array.isArray(albaran.items) ? albaran.items : [];
    const ventana = window.open("", "_blank", "width=900,height=1000");

    if (!ventana) {
        alert("El navegador ha bloqueado la ventana de impresión. Permite las ventanas emergentes.");
        return;
    }

    const filas = items.map(item => `
        <tr>
            <td>${escaparHTML(item.descripcion || "")}</td>
            <td>${Number(item.cantidad || 0)}</td>
            <td>${Number(item.precio || 0).toFixed(2)} €</td>
            <td>${(Number(item.cantidad || 0) * Number(item.precio || 0)).toFixed(2)} €</td>
        </tr>
    `).join("");

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Albarán ${escaparHTML(albaran.numero_albaran || "")}</title>
            <style>
                @page { size:A4; margin:18mm; }
                * { box-sizing:border-box; }
                body { margin:0; font-family:Arial,Helvetica,sans-serif; color:#1f2937; }
                .documento { max-width:800px; margin:0 auto; }
                .cabecera { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #111827; padding-bottom:18px; margin-bottom:25px; }
                .marca { display:flex; align-items:center; gap:15px; }
                .logo { width:85px; height:85px; object-fit:contain; }
                h1 { margin:0; font-size:22px; }
                .empresa { margin-top:5px; font-size:13px; color:#6b7280; }
                .titulo { text-align:right; }
                .titulo h2 { margin:0; font-size:25px; }
                .numero { margin-top:6px; font-size:14px; font-weight:bold; }
                .bloques { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:25px; }
                .bloque { border:1px solid #d1d5db; border-radius:8px; padding:14px; }
                .bloque h3 { margin:0 0 10px; font-size:14px; text-transform:uppercase; }
                .dato { margin:5px 0; font-size:13px; }
                table { width:100%; border-collapse:collapse; margin-top:15px; }
                th,td { border-bottom:1px solid #e5e7eb; padding:10px 8px; font-size:13px; text-align:left; }
                th:nth-child(n+2),td:nth-child(n+2) { text-align:right; }
                .totales { width:320px; margin-left:auto; margin-top:20px; }
                .fila { display:flex; justify-content:space-between; padding:7px 0; }
                .total { border-top:2px solid #111827; margin-top:5px; padding-top:12px; font-size:19px; font-weight:bold; }
                .pie { margin-top:45px; padding-top:15px; border-top:1px solid #d1d5db; text-align:center; font-size:11px; color:#6b7280; }
            </style>
        </head>
        <body>
            <div class="documento">
                <header class="cabecera">
                    <div class="marca">
                        <img src="logo.jpg" class="logo" alt="Servicios Muñoz">
                        <div>
                            <h1>RECEPCIÓN DE MATERIAL</h1>
                            <div class="empresa">SERVICIOS MUÑOZ</div>
                        </div>
                    </div>
                    <div class="titulo">
                        <h2>ALBARÁN</h2>
                        <div class="numero">${escaparHTML(albaran.numero_albaran || "")}</div>
                        <div class="empresa">${escaparHTML(formatearFechaHoraAlbaran(albaran.fecha_albaran || albaran.created_at))}</div>
                    </div>
                </header>
                <section class="bloques">
                    <div class="bloque">
                        <h3>Cliente</h3>
                        <div class="dato"><strong>Nombre:</strong> ${escaparHTML(albaran.cliente || "")}</div>
                        <div class="dato"><strong>Teléfono:</strong> ${escaparHTML(albaran.telefono || "")}</div>
                        <div class="dato"><strong>Email:</strong> ${escaparHTML(albaran.email || "")}</div>
                    </div>
                    <div class="bloque">
                        <h3>Entrega</h3>
                        <div class="dato">Material entregado según este albarán.</div>
                    </div>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Material / descripción</th>
                            <th>Cantidad</th>
                            <th>Precio unitario</th>
                            <th>Importe</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
                <div class="totales">
                    <div class="fila"><span>Subtotal</span><strong>${Number(albaran.subtotal || 0).toFixed(2)} €</strong></div>
                    <div class="fila"><span>IVA (${Number(albaran.iva_porcentaje || 0).toFixed(2)} %)</span><strong>${Number(albaran.iva_importe || 0).toFixed(2)} €</strong></div>
                    <div class="fila total"><span>TOTAL</span><strong>${Number(albaran.total || 0).toFixed(2)} €</strong></div>
                </div>
                ${albaran.observaciones ? `<div style="margin-top:35px;"><strong>Observaciones</strong><p>${escaparHTML(albaran.observaciones)}</p></div>` : ""}
                <div class="pie">Albarán ${escaparHTML(albaran.numero_albaran || "")} · SERVICIOS MUÑOZ</div>
            </div>
        </body>
        </html>
    `);

    ventana.document.close();
    setTimeout(() => {
        ventana.focus();
        ventana.print();
    }, 700);
}

async function guardarAlbaran() {
    mensajeGuardarAlbaran.textContent = "";
    mensajeGuardarAlbaran.style.color = "";

    const cliente = clienteAlbaran.value.trim();
    if (!cliente) {
        mensajeGuardarAlbaran.textContent = "El cliente es obligatorio.";
        mensajeGuardarAlbaran.style.color = "#b91c1c";
        return;
    }
    if (!itemsActualesAlbaran.length) {
        mensajeGuardarAlbaran.textContent =
            "Añade al menos un material al albarán.";
        mensajeGuardarAlbaran.style.color = "#b91c1c";
        return;
    }

    const totales = calcularTotalesAlbaran();
    const boton = document.getElementById("guardarAlbaran");
    boton.disabled = true;
    boton.textContent = "GUARDANDO...";

    try {
        const registro = {
            numero_albaran: numeroAlbaran.value.trim(),
            fecha_albaran: fechaAlbaran.value
                ? new Date(fechaAlbaran.value).toISOString()
                : new Date().toISOString(),
            cliente,
            telefono: telefonoAlbaran.value.trim(),
            email: emailAlbaran.value.trim(),
            items: itemsActualesAlbaran,
            subtotal: Number(totales.subtotal.toFixed(2)),
            iva_porcentaje: Number(totales.ivaPorcentaje.toFixed(2)),
            iva_importe: Number(totales.iva.toFixed(2)),
            total: Number(totales.total.toFixed(2)),
            observaciones: observacionesAlbaran.value.trim(),
            usuario: usuarioActual || ""
        };

        const { error } = await supabaseClient
            .from("albaranes")
            .insert(registro);

        if (error) throw error;

        mensajeGuardarAlbaran.textContent =
            `Albarán ${registro.numero_albaran} guardado correctamente.`;
        mensajeGuardarAlbaran.style.color = "#15803d";

        setTimeout(() => {
            mostrarPantalla(albaranesScreen);
            cargarAlbaranes();
        }, 500);
    } catch (error) {
        console.error(error);
        mensajeGuardarAlbaran.textContent =
            error.message || "No se ha podido guardar el albarán.";
        mensajeGuardarAlbaran.style.color = "#b91c1c";
    } finally {
        boton.disabled = false;
        boton.textContent = "GUARDAR ALBARÁN";
    }
}

async function obtenerLogoPDF() {
    try {
        const respuesta = await fetch(
            new URL("logo.jpg", window.location.href).href
        );

        if (!respuesta.ok) {
            return null;
        }

        return new Uint8Array(
            await respuesta.arrayBuffer()
        );
    } catch {
        return null;
    }
}

function escaparPDFTexto(texto) {
    return String(texto ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
}

function textoPDFWinAnsi(texto) {
    const mapa = {
        "€": 0x80,
        "‚": 0x82,
        "ƒ": 0x83,
        "„": 0x84,
        "…": 0x85,
        "†": 0x86,
        "‡": 0x87,
        "ˆ": 0x88,
        "‰": 0x89,
        "Š": 0x8a,
        "‹": 0x8b,
        "Œ": 0x8c,
        "Ž": 0x8e,
        "‘": 0x91,
        "’": 0x92,
        "“": 0x93,
        "”": 0x94,
        "•": 0x95,
        "–": 0x96,
        "—": 0x97,
        "˜": 0x98,
        "™": 0x99,
        "š": 0x9a,
        "›": 0x9b,
        "œ": 0x9c,
        "ž": 0x9e,
        "Ÿ": 0x9f,
        "á": 0xe1,
        "é": 0xe9,
        "í": 0xed,
        "ó": 0xf3,
        "ú": 0xfa,
        "Á": 0xc1,
        "É": 0xc9,
        "Í": 0xcd,
        "Ó": 0xd3,
        "Ú": 0xda,
        "ñ": 0xf1,
        "Ñ": 0xd1,
        "ü": 0xfc,
        "Ü": 0xdc,
        "¿": 0xbf,
        "¡": 0xa1,
        "º": 0xba,
        "ª": 0xaa
    };

    const salida = [];

    for (const caracter of String(texto ?? "")) {
        const codigo = mapa[caracter];

        if (codigo !== undefined) {
            salida.push(codigo);
        } else {
            const cp = caracter.codePointAt(0);

            if (cp === 9 || cp === 10 || cp === 12 || cp === 13 || cp === 32) {
                salida.push(cp);
            } else if (cp >= 33 && cp <= 126) {
                salida.push(cp);
            } else {
                salida.push(63);
            }
        }
    }

    return new Uint8Array(salida);
}

function bytesTextoPDF(texto) {
    return textoPDFWinAnsi(texto);
}

function concatenarBytesPDF(partes) {
    let longitud = 0;

    for (const parte of partes) {
        longitud += parte.length;
    }

    const resultado = new Uint8Array(longitud);
    let posicion = 0;

    for (const parte of partes) {
        resultado.set(parte, posicion);
        posicion += parte.length;
    }

    return resultado;
}

function extraerTamanoJPEG(bytes) {
    for (let i = 2; i < bytes.length - 9; i++) {
        if (bytes[i] !== 0xff) {
            continue;
        }

        const marcador = bytes[i + 1];

        if (
            marcador >= 0xc0 &&
            marcador <= 0xc3
        ) {
            const alto =
                (bytes[i + 5] << 8) |
                bytes[i + 6];
            const ancho =
                (bytes[i + 7] << 8) |
                bytes[i + 8];

            return { ancho, alto };
        }
    }

    return {
        ancho: 1,
        alto: 1
    };
}

function imprimirPresupuesto(reparacion) {
    const subtotal =
        Number(reparacion.total_presupuesto || 0);
    const iva =
        subtotal * 0.21;
    const total =
        subtotal + iva;
    const fecha =
        formatearFecha(
            reparacion.fecha_recepcion ||
            reparacion.created_at
        );
    const ventana =
        window.open(
            "",
            "_blank",
            "width=900,height=1000"
        );
    if (!ventana) {
        alert(
            "El navegador ha bloqueado la ventana del PDF. Permite las ventanas emergentes para esta página."
        );
        return;
    }
    ventana.document.write(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Presupuesto ${escaparHTML(reparacion.numero_reparacion)}</title>
<style>
@page {
    size: A4;
    margin: 18mm;
}
* {
    box-sizing: border-box;
}
body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
    background: #fff;
}
.documento {
    max-width: 800px;
    margin: 0 auto;
}
.cabecera {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #111827;
    padding-bottom: 18px;
    margin-bottom: 25px;
}
.marca {
    display: flex;
    align-items: center;
    gap: 15px;
}
.logo {
    width: 85px;
    height: 85px;
    object-fit: contain;
}
h1 {
    margin: 0;
    font-size: 22px;
}
.empresa {
    margin-top: 5px;
    font-size: 13px;
    color: #6b7280;
}
.titulo {
    text-align: right;
}
.titulo h2 {
    margin: 0;
    font-size: 25px;
}
.numero {
    margin-top: 6px;
    font-size: 14px;
    font-weight: bold;
}
.bloques {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 25px;
}
.bloque {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 14px;
}
.bloque h3 {
    margin: 0 0 10px;
    font-size: 14px;
    text-transform: uppercase;
}
.dato {
    margin: 5px 0;
    font-size: 13px;
}
.tabla {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}
.tabla th,
.tabla td {
    border-bottom: 1px solid #e5e7eb;
    padding: 11px 8px;
    text-align: left;
    font-size: 13px;
}
.tabla th:last-child,
.tabla td:last-child {
    text-align: right;
}
.totales {
    width: 320px;
    margin-left: auto;
    margin-top: 20px;
}
.fila-total {
    display: flex;
    justify-content: space-between;
    padding: 7px 0;
    font-size: 14px;
}
.total-final {
    border-top: 2px solid #111827;
    margin-top: 5px;
    padding-top: 12px;
    font-size: 19px;
    font-weight: bold;
}
.pie {
    margin-top: 45px;
    padding-top: 15px;
    border-top: 1px solid #d1d5db;
    text-align: center;
    font-size: 11px;
    color: #6b7280;
}
</style>
</head>
<body>
<div class="documento">
<header class="cabecera">
    <div class="marca">
        <img
            src="logo.jpg"
            class="logo"
            alt="Servicios Muñoz"
        >
        <div>
            <h1>RECEPCIÓN DE MATERIAL</h1>
            <div class="empresa">SERVICIOS MUÑOZ</div>
        </div>
    </div>
    <div class="titulo">
        <h2>PRESUPUESTO</h2>
        <div class="numero">
            ${escaparHTML(reparacion.numero_reparacion)}
        </div>
        <div class="empresa">${escaparHTML(fecha)}</div>
    </div>
</header>
<section class="bloques">
    <div class="bloque">
        <h3>Cliente</h3>
        <div class="dato"><strong>Nombre:</strong> ${escaparHTML(reparacion.cliente || "")}</div>
        <div class="dato"><strong>Teléfono:</strong> ${escaparHTML(reparacion.telefono || "")}</div>
        <div class="dato"><strong>Email:</strong> ${escaparHTML(reparacion.email || "")}</div>
    </div>
    <div class="bloque">
        <h3>Material</h3>
        <div class="dato"><strong>Tipo:</strong> ${escaparHTML(reparacion.tipo_material || "")}</div>
        <div class="dato"><strong>Marca:</strong> ${escaparHTML(reparacion.marca || "")}</div>
        <div class="dato"><strong>Modelo:</strong> ${escaparHTML(reparacion.modelo || "")}</div>
        <div class="dato"><strong>N.º serie:</strong> ${escaparHTML(reparacion.numero_serie || "")}</div>
    </div>
</section>
<table class="tabla">
    <thead>
        <tr>
            <th>Concepto</th>
            <th>Importe</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Piezas</td>
            <td>${Number(reparacion.coste_piezas || 0).toFixed(2)} €</td>
        </tr>
        <tr>
            <td>Mano de obra</td>
            <td>${Number(reparacion.coste_mano_obra || 0).toFixed(2)} €</td>
        </tr>
        <tr>
            <td>Otros costes</td>
            <td>${Number(reparacion.otros_costes || 0).toFixed(2)} €</td>
        </tr>
    </tbody>
</table>
<div class="totales">
    <div class="fila-total">
        <span>Subtotal sin IVA</span>
        <strong>${subtotal.toFixed(2)} €</strong>
    </div>
    <div class="fila-total">
        <span>IVA (21 %)</span>
        <strong>${iva.toFixed(2)} €</strong>
    </div>
    <div class="fila-total total-final">
        <span>TOTAL</span>
        <strong>${total.toFixed(2)} €</strong>
    </div>
</div>
<div class="pie">
    Presupuesto correspondiente a la reparación ${escaparHTML(reparacion.numero_reparacion)}.
</div>
</div>
</body>
</html>
    `);
    ventana.document.close();
    setTimeout(
        () => {
            ventana.focus();
            ventana.print();
        },
        700
    );
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
        <hr>
        <p>
            <strong>Subtotal sin IVA:</strong>
            ${Number(reparacion.total_presupuesto || 0).toFixed(2)} €
        </p>
        <p>
            <strong>IVA (21 %):</strong>
            ${(Number(reparacion.total_presupuesto || 0) * 0.21).toFixed(2)} €
        </p>
        <p>
            <strong>Total con IVA:</strong>
            ${(Number(reparacion.total_presupuesto || 0) * 1.21).toFixed(2)} €
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
                id="imprimirPresupuesto"
            >
                🖨️ IMPRIMIR
            </button>
        </div>
    `;
    const botonImprimir =
        document.getElementById(
            "imprimirPresupuesto"
        );
    botonImprimir?.addEventListener(
        "click",
        () => {
            imprimirPresupuesto(
                reparacion
            );
        }
    );

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

albaranesButton.addEventListener(
    "click",
    async () => {
        mostrarPantalla(albaranesScreen);
        await cargarAlbaranes();
    }
);
nuevoAlbaran.addEventListener(
    "click",
    async () => {
        try {
            await prepararNuevoAlbaran();
        } catch (error) {
            console.error(error);
            alert("No se ha podido preparar el albarán. " + (error.message || ""));
        }
    }
);
volverDashboardAlbaranes.addEventListener(
    "click",
    () => {
        detalleAlbaran.style.display = "none";
        mostrarPantalla(dashboardScreen);
    }
);
actualizarAlbaranes.addEventListener("click", cargarAlbaranes);
cerrarDetalleAlbaran.addEventListener(
    "click",
    () => {
        detalleAlbaran.style.display = "none";
    }
);
volverAlbaranesDesdeForm.addEventListener(
    "click",
    () => mostrarPantalla(albaranesScreen)
);
cancelarAlbaran.addEventListener(
    "click",
    () => {
        limpiarFormularioAlbaran();
        mostrarPantalla(albaranesScreen);
    }
);
selectorReparacionAlbaran.addEventListener(
    "change",
    () => {
        const reparacion = buscarReparacionAlbaranPorId(
            selectorReparacionAlbaran.value
        );
        mostrarMaterialDeReparacionAlbaran(reparacion);
    }
);
agregarMaterialManualAlbaran.addEventListener(
    "click",
    agregarMaterialManualAlbaranFuncion
);
ivaAlbaran.addEventListener("input", calcularTotalesAlbaran);
albaranForm.addEventListener(
    "submit",
    event => {
        event.preventDefault();
        guardarAlbaran();
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
const tarjetasDashboard = Array.from(document.querySelectorAll("#dashboardScreen .dashboard-card"));
const tarjetaClientes = tarjetasDashboard.find(t => t.querySelector("strong")?.textContent.trim() === "CLIENTES");
const tarjetaBuscar = tarjetasDashboard.find(t => t.querySelector("strong")?.textContent.trim() === "BUSCAR");
const tarjetaAdministracion = tarjetasDashboard.find(t => t.querySelector("strong")?.textContent.trim() === "ADMINISTRACIÓN");
tarjetaClientes?.addEventListener("click", async () => { crearPantallasExtra(); mostrarPantalla(clientesScreen); await cargarClientes(); });
tarjetaBuscar?.addEventListener("click", async () => { crearPantallasExtra(); mostrarPantalla(buscarScreen); await prepararBusqueda(); document.getElementById("campoBuscar")?.focus(); });
tarjetaAdministracion?.addEventListener("click", async () => { crearPantallasExtra(); mostrarPantalla(administracionScreen); cargarConfiguracion(); await cargarUsuariosAdmin(); });
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
