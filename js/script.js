// Función para obtener los jugadores del localStorage
const obtenerJugadoresLocalStorage = () => {
    const jugadoresString = localStorage.getItem('jugadores');
    return jugadoresString ? JSON.parse(jugadoresString) : [];
};

// Función para guardar los jugadores en el localStorage
const guardarJugadoresLocalStorage = (jugadores) => {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
};

// Función asíncrona para agregar un nuevo jugador al equipo usando un prompt de HTML
const agregarJugador = async () => {
    try {
        // Solicitar al usuario que ingrese los datos del jugador
        const nombre = prompt("Ingrese el nombre del jugador:");
        const edad = parseInt(prompt("Ingrese la edad del jugador:"));
        const posicion = prompt("Ingrese la posición del jugador:");

        // Obtener los jugadores del localStorage
        let jugadores = obtenerJugadoresLocalStorage();

        // Verificar si el jugador ya existe en el equipo
        const jugadorExistente = jugadores.find(jugador => jugador.nombre === nombre);
        if (jugadorExistente) {
            throw new Error('El jugador ya está en el equipo.');
        }
        if( nombre.length == 0 || edad.length == 0 || posicion.length == 0){
            throw new Error('Complete todos los campos para registrar un jugador nuevo.')
        }
        jugadores.push({ nombre, edad, posicion });
        console.log(jugadores)
        guardarJugadoresLocalStorage(jugadores);

        // Simular una demora de 1 segundo para la operación asíncrona
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Jugador agregado correctamente.');

    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Función asíncrona para listar todos los jugadores del equipo
const listarJugadores = async () => {
    let jugadores_html = ""
    let jugadores = obtenerJugadoresLocalStorage()
    jugadores.forEach((j) => {
            jugadores_html += `
            <div class="card m-2 text-center" style="width: 200px;">
                <p class="card-title" >${j.nombre}</p>
                <p class="card-subtitle text-muted">${j.posicion}</p>
                <p class="card-subtitle mb-2 text-muted">${j.edad}</p>
                <p class="btn btn-primary m-3" onclick="asignarPosicion('${j.nombre}')">Cambiar Posición</p>
                </div>`;
    });
    document.getElementById("div-jugadores").innerHTML = jugadores_html;
    // Implementación para listar todos los jugadores
};

// Función asíncrona para asignar una nueva posición a un jugador
const asignarPosicion = async (nombreJugador) => {
    const nuevaPos = prompt(`Ingrese la nueva posición de ${nombreJugador}:`);
    let jugadores = obtenerJugadoresLocalStorage()
    let jugadoresActualizado = jugadores.map( (j) => {
        if (j.nombre == nombreJugador) {
            return { ...j, posicion: nuevaPos };
        }
        return j;
    })
    guardarJugadoresLocalStorage(jugadoresActualizado);
    listarJugadores()
};

// Función asíncrona para realizar un cambio durante un partido
const realizarCambio = async (jugadorEntrante, jugadorSaliente) => {
    // Implementación para realizar un cambio durante un partido
};

// Función principal asíncrona que interactúa con el usuario
const main = async () => {
    try {
        // Lógica para interactuar con el usuario y llamar a las funciones adecuadas
    } catch (error) {
        console.error('Error:', error);
    }
};

// Llamar a la función principal para iniciar la aplicación
main();
