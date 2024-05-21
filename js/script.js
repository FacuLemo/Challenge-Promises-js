// Función para obtener los jugadores del localStorage
const obtenerJugadoresLocalStorage = () => {
    const jugadoresString = localStorage.getItem('jugadores');
    return jugadoresString ? JSON.parse(jugadoresString) : [];
};

// Función para guardar los jugadores en el localStorage
const guardarJugadoresLocalStorage = (jugadores) => {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
};

//funcion que se llama para mostrar los cambios restantes
const renderizarCambios = () => {
    let cambios = localStorage.getItem('cambios');
    if (cambios == null) {
        cambios = 2
        localStorage.setItem('cambios', cambios);
    }
    const cambioshtml = `<p>Te quedan ${cambios} cambios.</p>`
    document.getElementById("div-cambios").innerHTML = cambioshtml;
}

// Función que inicializa la página, llamada desde main()
const renderInicial = async () => {
    try {
        //muestra los cambios restantes
        renderizarCambios()
        const botoneshtml = `
            <button class="btn btn-primary" onclick="main('agregarJugador()')">Agregar jugador</button>
            <button class="btn btn-primary" onclick="main('listarJugadores()')">Listar jugadores</button>
            `
        document.getElementById("div-botones").innerHTML = botoneshtml;

    } catch (error) {
        console.error("error", error.message)
    }
}

// Función asíncrona para agregar un nuevo jugador al equipo usando un prompt de HTML
const agregarJugador = async () => {
    try {
        // Solicitar al usuario que ingrese los datos del jugador
        const nombre = prompt("Ingrese el nombre del jugador:");
        const edad = parseInt(prompt("Ingrese la edad del jugador:"));
        const posicion = prompt("Ingrese la posición del jugador:");
        const condicion = prompt("Escribe su condición (titular/suplente):")
        const cambiado = false

        // Obtener los jugadores del localStorage
        let jugadores = obtenerJugadoresLocalStorage();

        // Verificar si el jugador ya existe en el equipo
        const jugadorExistente = jugadores.find(jugador => jugador.nombre === nombre);
        if (jugadorExistente) {
            throw new Error('El jugador ya está en el equipo.');
        }
        if (nombre.length == 0 || edad.length == 0 || posicion.length == 0 || condicion.length == 0) {
            throw new Error('Complete todos los campos para registrar un jugador nuevo.')
        }
        jugadores.push({ nombre, edad, posicion, condicion, cambiado });
        console.log(jugadores)
        guardarJugadoresLocalStorage(jugadores);

        // Simular una demora de 1 segundo para la operación asíncrona
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Jugador agregado correctamente.');
        listarJugadores()
    } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Hubo un error ingresando el jugador.');
        console.error('Error:', error.message);
    }
};

// Función asíncrona para listar todos los jugadores del equipo
const listarJugadores = async () => {
    try {
        let jugadores_html = ""
        let jugadores = obtenerJugadoresLocalStorage()
        jugadores.forEach((j) => {
            jugadores_html += `
                <div class="card m-2 text-center" style="width: 250px;">
                    <p class="card-subtitle mt-2 text-muted">${j.condicion.toUpperCase()}</p>
                    <p class="card-title" >${j.nombre}</p>
                    <p class="card-subtitle text-muted">${j.posicion}</p>
                    <p class="card-subtitle mb-2 text-muted">${j.edad}</p>
                    <p class="btn btn-primary m-3 mb-1" onclick="main('asignarPosicion(${j.nombre})')">Cambiar Posición</p>
                    ${j.condicion.toLowerCase() === 'titular' && !j.cambiado ? `<p class="btn btn-success m-3 mt-1" onclick="main('realizarCambio(${j.nombre})')">Cambiar Jugador</p>` : ''}
                </div>`;
        });
        document.getElementById("div-jugadores").innerHTML = jugadores_html;
    } catch (error) {
        console.error("error", error.message)
    }
};

// Función asíncrona para asignar una nueva posición a un jugador
const asignarPosicion = async (nombreJugador) => {
    try {
        console.log("me llego a la fun: ", nombreJugador)
        console.log(typeof nombreJugador)
        const nuevaPos = prompt(`Ingrese la nueva posición de ${nombreJugador}:`);
        if (nuevaPos.length == 0) {
            throw new Error('No puede estar vacía la nueva posición. Cancelando.')
        }
        let jugadores = obtenerJugadoresLocalStorage()
        let jugadoresActualizado = jugadores.map((j) => {
            if (j.nombre == nombreJugador) {
                return { ...j, posicion: nuevaPos };
            }
            return j;
        })
        guardarJugadoresLocalStorage(jugadoresActualizado);
        await listarJugadores()
    } catch (error) {
        alert('Hubo un error cambiando la posición del jugador.');
        console.error('Error:', error.message);
    }
};

// Función asíncrona para realizar un cambio durante un partido
const realizarCambio = async (nombreJugadorSaliente) => {
    try {
        const nombreJugadorEntrante = prompt(`¿Quién entrará en lugar del  jugador ${nombreJugadorSaliente}?:`);

        let jugadores = obtenerJugadoresLocalStorage();
        const jugadorSaliente = jugadores.find(jugador => jugador.nombre === nombreJugadorSaliente);
        const jugadorEntrante = jugadores.find(jugador => jugador.nombre === nombreJugadorEntrante);

        if (jugadorEntrante == undefined) {
            throw new Error('No se encontró ese jugador.')
        }
        if (jugadorEntrante.cambiado) {
            throw new Error(`${jugadorEntrante.nombre} ya ha sido cambiado. No puede entrar a la cancha otra vez.`)
        }
        if (jugadorEntrante.condicion.toLowerCase() == 'titular') {
            throw new Error('¡No puedes cambiar por un jugador titular! Debe ser un suplente.')
        }

        jugadores = jugadores.map((j) => {
            if (j == jugadorSaliente) {
                return { ...j, condicion: 'suplente', cambiado: true };
            }
            if (j == jugadorEntrante)
                return { ...j, condicion: 'titular' }
            return j;
        })

        await new Promise(resolve => setTimeout(resolve, 1500));

        cambios = localStorage.getItem('cambios');
        if(cambios > 0){
            alert(`¡Sale ${jugadorSaliente.nombre} y entra ${jugadorEntrante.nombre}!`)
            guardarJugadoresLocalStorage(jugadores)
            localStorage.setItem('cambios', cambios - 1);
        }else{
            throw new Error("¡No te quedan más cambios! Cancelando operación.")
        }
        renderizarCambios()
        await listarJugadores()

    } catch (error) {
        alert(error.message)
        console.error("error", error.message)
    }
};

// Función principal asíncrona que interactúa con el usuario
const main = async (funcion) => {
    try {
        console.log(funcion)
        let split = funcion.split('(')
        console.log(split)
        switch (split[0]) {
            case 'renderInicial':
                await renderInicial()
                break
            case 'agregarJugador':
                await agregarJugador()
                break
            case 'listarJugadores':
                await listarJugadores()
                break
            case 'asignarPosicion':
                if (split[1]) {
                    await asignarPosicion(split[1].slice(0, -1))
                }
                break
            case 'realizarCambio':
                if (split[1]) {
                    await realizarCambio(split[1].slice(0, -1))
                }
                break
            default:
                alert("ha ocurrido un error en main().")
                break
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Llamar a la función principal para iniciar la aplicación
main("renderInicial()");
