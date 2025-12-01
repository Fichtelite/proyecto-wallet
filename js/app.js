const VALID_USER = "usuario@demo.com";
const VALID_PASS = "1234";

let saldo = Number(localStorage.getItem("saldo")) || 0;
let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
let contactos = JSON.parse(localStorage.getItem("contactos")) || [
  { nombre: "Carlos", email: "carlos@demo.com", telefono: "900000001" },
  { nombre: "Ana", email: "ana@demo.com", telefono: "900000002" },
  { nombre: "Pedro", email: "pedro@demo.com", telefono: "900000003" }
];

function showPopup(message, type = "info", duration = 1500) {
  const p = document.getElementById("popup");
  if (!p) { alert(message); return; }
  p.textContent = message;
  p.className = "popup " + (type === "success" ? "success" : type === "error" ? "error" : "info");
  p.style.display = "block";
  setTimeout(() => { p.style.display = "none"; }, duration);
}

function showPopupForm(html) {
  const pa = document.getElementById("popupAgregar");
  if (!pa) return;
  paInner.innerHTML = html;
  pa.style.display = "block";
}

function closePopupForm() {
  const pa = document.getElementById("popupAgregar");
  if (!pa) return;
  pa.style.display = "none";
}

function actualizarSaldoUI() {
  const el = document.getElementById("saldoActual");
  if (el) el.textContent = "$" + saldo;
}

function guardarEstado() {
  localStorage.setItem("saldo", saldo);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));
  localStorage.setItem("contactos", JSON.stringify(contactos));
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarSaldoUI();
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (document.getElementById("email").value || "").trim();
      const pass = (document.getElementById("password").value || "").trim();
      if (email === VALID_USER && pass === VALID_PASS) {
        localStorage.setItem("usuarioLogueado", email);
        showPopup("Inicio de sesión exitoso", "success", 1000);
        setTimeout(() => window.location.href = "menu.html", 900);
      } else {
        showPopup("Usuario o contraseña incorrectos", "error", 1600);
      }
    });
  }

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogueado");
      showPopup("Has cerrado sesión", "success", 900);
      setTimeout(() => window.location.href = "login.html", 700);
    });
  }

  const depositForm = document.getElementById("deposit-form");
  if (depositForm) {
    depositForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = Number(document.getElementById("montoDeposito").value) || 0;
      if (v > 0) {
        saldo += v;
        transacciones.push({ tipo: "Depósito", monto: v, fecha: new Date().toLocaleString() });
        guardarEstado();
        actualizarSaldoUI();
        showPopup("Depósito realizado: $" + v, "success", 1200);
        setTimeout(() => window.location.href = "menu.html", 900);
      } else {
        showPopup("Monto inválido", "error", 1400);
      }
    });
  }

  const sendForm = document.getElementById("send-form");
  if (sendForm) {
    sendForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const contacto = document.getElementById("contacto").value;
      const monto = Number(document.getElementById("montoEnviar").value) || 0;
      if (!contacto) { showPopup("Selecciona un contacto", "error"); return; }
      if (monto <= 0 || monto > saldo) { showPopup("Monto inválido o saldo insuficiente", "error"); return; }
      saldo -= monto;
      transacciones.push({ tipo: "Envío", contacto, monto, fecha: new Date().toLocaleString() });
      guardarEstado();
      actualizarSaldoUI();
      showPopup("Transferencia: $" + monto, "success", 1200);
      setTimeout(() => window.location.href = "menu.html", 900);
    });
  }

  const btnOpenAgregar = document.getElementById("btnOpenAgregar");
  if (btnOpenAgregar) {
    btnOpenAgregar.addEventListener("click", () => {
      document.getElementById("popupAgregar").style.display = "block";
    });
  }

  const btnCerrarPopupAgregar = document.getElementById("btnCerrarPopupAgregar");
  if (btnCerrarPopupAgregar) {
    btnCerrarPopupAgregar.addEventListener("click", () => {
      closePopupForm();
    });
  }

  const btnGuardarContacto = document.getElementById("btnGuardarContacto");
  if (btnGuardarContacto) {
    btnGuardarContacto.addEventListener("click", () => {
      const nombre = (document.getElementById("nuevoNombre").value || "").trim();
      const email = (document.getElementById("nuevoEmail").value || "").trim();
      const telefono = (document.getElementById("nuevoTelefono").value || "").trim();
      if (!nombre || !email || !telefono) { showPopup("Completa todos los campos", "error"); return; }
      contactos.push({ nombre, email, telefono });
      guardarEstado();
      showPopup("Contacto agregado", "success", 1000);
      document.getElementById("nuevoNombre").value = "";
      document.getElementById("nuevoEmail").value = "";
      document.getElementById("nuevoTelefono").value = "";
      closePopupForm();
      cargarContactos();
    });
  }

  cargarContactos();
  cargarTransacciones();
});

function cargarTransacciones() {
  const tabla = document.getElementById("tablaTransacciones");
  if (!tabla) return;
  transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  tabla.innerHTML = "";
  transacciones.forEach(t => {
    const clase = t.tipo === "Depósito" ? "text-success" : t.tipo === "Envío" ? "text-danger" : "";
    const row = `<tr class="${clase}"><td>${t.tipo}</td><td>${t.contacto ?? "-"}</td><td>$${t.monto}</td><td>${t.fecha}</td></tr>`;
    tabla.innerHTML += row;
  });
}

function cargarContactos() {
  contactos = JSON.parse(localStorage.getItem("contactos")) || contactos;
  const select = document.getElementById("contacto");
  const list = document.getElementById("listaContactos");
  if (select) {
    select.innerHTML = '<option value="">Selecciona...</option>';
    contactos.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.nombre;
      opt.textContent = `${c.nombre} (${c.email})`;
      select.appendChild(opt);
    });
  }
  if (list) {
    list.innerHTML = "";
    contactos.forEach((c, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `<div><strong>${c.nombre}</strong><div class="contacts-meta">${c.email} • ${c.telefono}</div></div>
        <div><button class="btn btn-sm btn-outline-danger" onclick="eliminarContacto(${idx})">Eliminar</button></div>`;
      list.appendChild(li);
    });
  }
}

function eliminarContacto(index) {
  contactos.splice(index, 1);
  guardarEstado();
  cargarContactos();
}
