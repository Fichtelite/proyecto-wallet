// Saldo inicial simulado
let saldo = 0;

// Lista simulada de transacciones
let transacciones = [];

// Contactos simulados
let contactos = ["Carlos", "Ana", "Pedro", "Sandra"];

/* ---------------- LOGIN ---------------- */
function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    // Usuario fijo para prueba
    if (email === "usuario@demo.com" && pass === "1234") {
        window.location.href = "menu.html";
    } else {
        $("#errorLogin").fadeIn().delay(2000).fadeOut();
    }
}

/* ---------------- DEPÓSITO ---------------- */
function realizarDeposito(event) {
    event.preventDefault();

    let monto = Number(document.getElementById("montoDeposito").value);

    if (monto > 0) {
        saldo += monto;

        transacciones.push({
            tipo: "Depósito",
            monto,
            fecha: new Date().toLocaleString()
        });

        alert("Depósito realizado. Saldo actual: $" + saldo);
        window.location.href = "menu.html";
    }
}

/* ---------------- ENVÍO DE DINERO ---------------- */
function enviarDinero(event) {
    event.preventDefault();

    const contacto = document.getElementById("contacto").value;
    const monto = Number(document.getElementById("montoEnviar").value);

    if (!contactos.includes(contacto)) {
        alert("El contacto no existe.");
        return;
    }

    if (monto <= 0 || monto > saldo) {
        alert("Monto inválido o saldo insuficiente.");
        return;
    }

    saldo -= monto;

    transacciones.push({
        tipo: "Envío",
        contacto,
        monto,
        fecha: new Date().toLocaleString()
    });

    alert("Transferencia realizada.");
    window.location.href = "menu.html";
}

/* ---------------- HISTORIAL ---------------- */
function cargarTransacciones() {
    const tabla = document.getElementById("tablaTransacciones");

    tabla.innerHTML = "";

    transacciones.forEach(t => {
        let row = `
            <tr>
                <td>${t.tipo}</td>
                <td>${t.contacto ?? "-"}</td>
                <td>$${t.monto}</td>
                <td>${t.fecha}</td>
            </tr>
        `;
        tabla.innerHTML += row;
    });
}
