// Max capacity: 50.000

// Formato boleto: BOLETO-[ID-ÚNICO]

// Sistema verifica si la persona lleva boleto válido y si no supera el aforo.
// Al ingresar el codigo el sistema confirmará si la person aestá autorizada a
// ingresar al estadio y si su entrada es válida(si ingresó previamente o entrada es válida)


// Cada persona que entre, el sistema registra hora de entrada, asiento y código de boleto

// Una persona puede salir del estadio, lo que libera el asiento. El sistema debe permitir esta
// opción para ajustar el aforo

/* INTERFAZ DE LA CONSOLA 
Menú interactivo donde el usuario pueda:
- comprar boletos (ingresar los datos de la persona)
- verificar acceso (ingresar el codigo del  boleto)
- registrar ingreso (confirmar el acceso y liberar el asiento cuandos se salga)
- ver el estado del aforo (ver cuantas personas están dentro del estadio en tiempo real)*/

// REQUISITOS
/* Estructura de datos JSON*/

const prompt = require("prompt-sync")();

const fs = require("fs");
const rute = "./data.json";

const datas = JSON.parse(fs.readFileSync(rute, "utf8"));

const max_capacity = datas[0];
const current_capacity = datas[1];
const user = datas[2];
const tickets_array = datas[3];
const seats_array = datas[4];

// Para generar un ticket de 3 dígitos de código, que con 37 opciones esta aproximación tiene poco más de 50k opciones
const ticket_generator = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z', '0' ,'1', '2', '3', '4', '5', '6', '7', '8', '9', '#'
];


class stadium_capacity{
    constructor(name,ticket,seat,hour){
        this.name = name;
        this.ticket = ticket;
        this.seat = seat;
        this.hour = hour;
    }

    // COMPRAR TICKETS
    BuyTickets(){

        console.clear();
        this.name = prompt("Enter name: ");

        // Selección de zona del estadio
        console.log("SELECTION STADIUM ZONE: ");
            console.log("1. VIP zone");
            console.log("2. North zone");
            console.log("3. South zone");
            console.log("4. West zone");
            console.log("5. East zone");
        let zone_selection = prompt("Select area you want: ");

        while(isNaN(zone_selection)=== true || zone_selection < 1 || zone_selection > 5){
            zone_selection = prompt("Select a valid area please: ");
        }
        switch(zone_selection){
            case "1":{this.seat = Math.floor(Math.random()*100);}break;
            case "2":{this.seat = Math.floor(Math.random()*(20000-100 + 1) + 100);}break;
            case "3":{this.seat = Math.floor(Math.random()*(30000-20000 + 1) + 20000);}break;
            case "4":{this.seat = Math.floor(Math.random()*(40000-30000 + 1) + 30000);}break;
            case "5":{this.seat = Math.floor(Math.random()*(50000-40000 + 1) + 40000);}break;
        }

        console.clear();

        // Función para barajar el array de todos los dígitos posibles para el código del billete
        function shuffle(array) {
            let current_position = array.length;

            // Repite el bucle mientras la longitud del array sea diferente a 0
            while (0 !== current_position) {
              const random_position = Math.floor(Math.random() * current_position);
              current_position--;
              // Hace que la posicón aleatoria predomine ante la actual, lo que evita que devuelva siempre lo mismo
              [array[current_position], array[random_position]] = [array[random_position], array[current_position]];
            }
        
            const random_array = [];
                random_array.push(array[1]); // 3 dígitos aleatorios del nuevo array barajado
                random_array.push(array[2]);
                random_array.push(array[3]);

            // Elimina las "," del array donde mete los 3 dígitos aleatorios,
            // creando así el nuevo ticket
            const newCod = (random_array.toString()).replace(/,/g,"");
        
            return newCod;
        }
        
        this.ticket = shuffle(ticket_generator);
        while(tickets_array.includes(this.ticket)){
            this.ticket = shuffle(ticket_generator);
        }

        let newUser = {
            name : this.name,
            ticket : this.ticket,
            seat : this.seat
        };
    
        seats_array.push(this.seat)
        tickets_array.push(this.ticket);
        user.push(newUser);

        const pushToJSON = [max_capacity, current_capacity, user, tickets_array, seats_array]
        
        // Pushea los datos nuevos del array "tickets_array" al archivo JSON y así queda actualizado
        const dataParse = JSON.stringify(pushToJSON, null, 2);
        fs.writeFileSync(rute, dataParse, 'utf8');

        console.log("Your purchase has been made",(this.name).toUpperCase());
        console.log("Your ticket code is: ",this.ticket);
        console.log("Your seat name is: ",this.seat);
    }

    // VERIFICAR TICKETS
    VerifyTickets(){

        function binarySearch() {

            // Se ordena el array del JSON que contiene los tickets existentes
            function bubbleSort(items) {
                let length = items.length;
                for (let i = 0; i < length; i++) {
                    for (let j = 0; j < (length - i - 1); j++) {
                        if (items[j] > items[j + 1]) {
                            let tmp = items[j];
                            items[j] = items[j + 1];
                            items[j + 1] = tmp;
                        }
                    }
                }          
            }
            
            bubbleSort(tickets_array);
        
            console.clear();
            console.log("****************************");
            let TicketIncome = prompt("Enter your ticket: ");
            console.clear();
        
            // Búsqueda binaria dentro del array
        
            let first = 0;    // Límite izquierdo
            let last = tickets_array.length - 1;   // Límite derecho
            let position = 0;
            let found = false;
        
            while (found === false && first <= last) {
        
                let middle = Math.floor((first + last)/2);
                if (tickets_array[middle] == TicketIncome) {
                    found = true;
                    position = middle;
                    console.clear();
                    console.log("****************************");
                    console.log("Ticket:",TicketIncome,"exists");
                    
        
                } else if (tickets_array[middle] > TicketIncome) {  //if in lower half
                    last = middle - 1;
                } else {  //in in upper half
                    first = middle + 1;
                }
            }
        
            if (position === 0 && !tickets_array.includes(TicketIncome)){
                console.log("Ticket not found");
            }
        
            return position;
        }
        binarySearch();

    }

    // REGISTRAR INGRESO
    RegisterIncome(){

        console.clear();

        this.name = prompt("Enter your name: ");

        // Calcular hora de entrada
        let date = new Date()
        let minutes = date.getMinutes();
        let hour = date.getHours();

        this.hour = hour+":"+minutes

        // Calcula la posición del ticket en su array del JSON, y a partir del mismo,
        // utililiza su posición para en el siguiente paso poner su hora de entrada al estadio

                        function binarySearch() {

                            // Se ordena el array del JSON que contiene los tickets existentes
                            function bubbleSort(items) {
                                let length = items.length;
                                for (let i = 0; i < length; i++) {
                                    for (let j = 0; j < (length - i - 1); j++) {
                                        if (items[j] > items[j + 1]) {
                                            let tmp = items[j];
                                            items[j] = items[j + 1];
                                            items[j + 1] = tmp;
                                        }
                                    }
                                }          
                            }
                            
                            bubbleSort(tickets_array);
                        
 
                            let TicketIncome = prompt("Enter your ticket: ");

                        
                            // Búsqueda binaria dentro del array
                        
                            let first = 0;    // Límite izquierdo
                            let last = tickets_array.length - 1;   // Límite derecho
                            let position = 0;
                            let found = false;
                        
                            while (found === false && first <= last) {
                        
                                let middle = Math.floor((first + last)/2);
                                if (tickets_array[middle] == TicketIncome) {
                                    found = true;
                                    position = middle;
                                    console.clear();
                                    
                                } else if (tickets_array[middle] > TicketIncome) {  //if in lower half
                                    last = middle - 1;
                                } else {  //in in upper half
                                    first = middle + 1;
                                }
                            }
                        
                            if (position === 0 && !tickets_array.includes(TicketIncome)){
                                console.log("Ticket not found");
                            }
                        
                            return position;
                        }
                        let position = binarySearch(tickets_array);

        // Sustituye la hora de entrada en blanco del JSON por la adquirida al pasar la barrera
        user[position].enter_hour = this.hour

        const pushToJSON = [max_capacity, current_capacity, user, tickets_array, seats_array]
        const dataParse = JSON.stringify(pushToJSON, null, 2);
        fs.writeFileSync(rute, dataParse, 'utf8');
        
        console.log((this.name).toUpperCase(),"can you enter to stadium");
        console.log("Your enter hour is", this.hour);
    }

    ExitToStadium(){
        
    }
    
    CurrentCapacity(){
        console.clear();
        console.log("The current capacity is:",current_capacity);
    }

    Exit(){
        console.clear();
        process.exit();
    }


}

let x = new stadium_capacity("Tom","asdfas","32000","14:15");
let z = "y";
while(z ==="y"){
    
    console.log("*********************");
    console.log("STADIUM MENU");
    console.log("*********************");
    console.log("1. Buy tickets");
    console.log("2. Verify tickets");
    console.log("3. Register income");
    console.log("4. Current capacity");
    console.log("5. Exit");
    console.log("*********************");
    let selection = prompt("Select option: ");

    while(isNaN(selection)=== true || selection < 1 || selection > 5){
        selection = prompt("Select a valid option please: ");
    }

    switch(selection){
        case "1":{x.BuyTickets();}break
        case "2":{x.VerifyTickets();}break
        case "3":{x.RegisterIncome();}break
        case "4":{x.CurrentCapacity();}break
        case "5":{x.Exit();}break
    }
}