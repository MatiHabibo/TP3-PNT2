new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.saludJugador = 100;
            this.saludMonstruo= 100;
            this.hayUnaPartidaEnJuego = true;
            this.turnos = [];
        },
        atacar: function () {
            var danios = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= danios;

            // this.turnos.unshift({
            //     esJugador: true,
            //     text: 'El jugador golpea al monstruo por ' + danios
            // });
            this.registrarEvento(true, 'El jugador golpea al monstruo por ', danios)

            if(this.verificarGanador()){
                return;
            }

            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            console.log('ataque especial');
            var danios = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= danios;

            // this.turnos.unshift({
            //     esJugador: true,
            //     text: 'Golpeaste duro al monstruo por ' + danios
            // });
            this.registrarEvento(true, 'Golpeaste duro al monstruo por ', danios)
            if(this.verificarGanador()){
                return this.verificarGanador();
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            var cura;
            if(this.saludJugador <= 90){
                this.saludJugador += 10;
                cura = 10;
            } else{
                cura = (100 - this.saludJugador);
                this.saludJugador = 100;
            }
            // this.turnos.unshift({
            //     esJugador: true,
            //     text: 'me cure por ' + cura
            // });
            this.registrarEvento(true, 'me cure por ', cura)
            this.ataqueDelMonstruo();
        },

        registrarEvento(esJugador, texto, cantidad) {
            this.turnos.unshift({
                esJugador: esJugador,
                text: texto + cantidad
            });
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            var danios = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= danios;

            // this.turnos.unshift({
            //     esJugador: false,
            //     text: 'El monstruo lastima al jugador en ' + danios
            // });
            this.registrarEvento(false, 'El monstruo lastima al jugador en  ', danios)

            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            min = rango[0];
            max = rango[1];
            return Math.max(Math.floor(Math.random() * max) + 1, min);

        },
        verificarGanador: function () {
            if(this.saludMonstruo <= 0){
                if(confirm('Ganaste! Jugar de nuevo?')){
                    this.empezarPartida();
                }else{
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }else if(this.saludJugador <= 0){
                if(confirm('Perdiste! Jugar de nuevo?')){
                    this.empezarPartida()
                }else{
                    this.hayUnaPartidaEnJuego = false;                    
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});