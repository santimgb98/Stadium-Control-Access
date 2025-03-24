
const ticket_generator = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z', 
    '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

function barajar(array) {
    let current_position = array.length;
  
    while (0 !== current_position) {
      const random_position = Math.floor(Math.random() * current_position);
      current_position--;
      // Intercambiar los valores sin necesidad de una variable auxiliar
      [array[current_position], array[random_position]] = [array[random_position], array[current_position]];
    }

    const random_array = [];
        random_array.push(array[1]);
        random_array.push(array[2]);
        random_array.push(array[3]);
        random_array.push(array[4]);
        random_array.push(array[5]);
    const ticket_array = (random_array.toString()).replace(/,/g,"");

    return ticket_array;


}

this.ticket = barajar(ticket_generator);
console.log(this.ticket)