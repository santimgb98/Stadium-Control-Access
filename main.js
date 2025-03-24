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
const ruta = "./data.json";

const datas = JSON.parse(fs.readFileSync(ruta, "utf8"));

const max_capacity = datas[0];
const current_capacity = datas[1];
const tickets_array = datas[2];
console.log(max_capacity);
console.log(current_capacity);

// Para generar un ticket de 3 dígitos de código, que con 37 opciones esta aproximación tiene poco más de 50k opciones
const ticket_generator = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z', '0' ,'1', '2', '3', '4', '5', '6', '7', '8', '9', '#'
];


class stadium_capacity{
    constructor(name,ticket,seat){
        this.name = name;
        this.ticket = ticket;
        this.seat = seat;
    }

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
            case "1":{this.seat = Math.floor(Math.random()*100) + ", on VIP zone";}break;
            case "2":{this.seat = Math.floor(Math.random()*(20000-100 + 1) + 100) + ", on North zone";}break;
            case "3":{this.seat = Math.floor(Math.random()*(30000-20000 + 1) + 20000) + ", on South zone";}break;
            case "4":{this.seat = Math.floor(Math.random()*(40000-30000 + 1) + 30000) + ", on West zone";}break;
            case "5":{this.seat = Math.floor(Math.random()*(50000-40000 + 1) + 40000) + ", on East zone";}break;
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
        tickets_array.push(this.ticket);
        const pushToJSON = [max_capacity, current_capacity, tickets_array]
        
        // Pushea los datos nuevos del array "tickets_array" al archivo JSON y así queda actualizado
        const dataParse = JSON.stringify(pushToJSON, null, 2);
        fs.writeFileSync(ruta, dataParse, 'utf8');


        console.log("Your purchase has been made",(this.name).toUpperCase());
        console.log("Your ticket code is: ",this.ticket);
        console.log("Your seat name is: ",this.seat);
    }

    VerifyTickets(){

        console.clear();
        this.ticket= prompt("Enter your ticket: ");
        console.clear();

        if(tickets_array.includes(this.ticket)){
            console.log("Your ticket", this.ticket,"is available");
        }else{
            console.log("Your ticket", this.ticket,"isn't available");
        }

    }

    RegisterIncome(){

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

let x = new stadium_capacity("Tom","asdfas","32000");
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