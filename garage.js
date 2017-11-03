

'use strict';

//global arrays for an internal vehicle list with vehicles that always persist, and a garage with vehicles that can be entered and removed
let vehicles = [];
let garage = [];
function createCar() {

    document.getElementById("newVehiclePara").innerHTML = "";
    let reg = document.getElementById("carRegIn").value;
    reg = reg.toUpperCase();
    let brand = document.getElementById("carBrand").value;
    brand = brand.toUpperCase();
    let faults = 0;
    let exists = false;
    for (let car in vehicles) {
        if (reg == vehicles[car].carReg) {
            exists = true;
        }
    }
    if (exists) {
        document.getElementById("newVehiclePara").innerHTML = "Car already exists.";
    }
    else {
        let newCar = { carReg: reg, carBrand: brand, carFaults: faults, carBill: ("£" + (faults * 30)) };

        vehicles.push(newCar);

        let select = document.getElementById("regSelectIn");
        select.options[select.options.length] = new Option(newCar.carReg, newCar.carReg);
    }
}

function garageList() {
    document.getElementById("garagePara").innerHTML = "";
    for (let car in garage) {
        for (let key in garage[car]) {
            document.getElementById("garagePara").innerHTML += key + ": " + garage[car][key] + "<br>";
        }
        document.getElementById("garagePara").innerHTML += "<br>";
    }
}

function checkIn() {
    let index = document.getElementById("regSelectIn").selectedIndex;
    let selectIn = document.getElementById("regSelectIn");

    if (index != -1) {
        let reg = selectIn.options[index].value;
        let faults = parseInt(document.getElementById("carFaultIn").value);

        for (let car in vehicles) {
            if (vehicles[car].carReg == reg) {
                vehicles[car].carFaults = faults;
                vehicles[car].carBill = ("£" + (faults * 30));
                garage.push(vehicles[car]);
                let selectOut = document.getElementById("regSelectOut");
                selectOut.options[selectOut.options.length] = new Option(vehicles[car].carReg, vehicles[car].carReg);
            }
        }
        selectIn.options[index].remove(index);
    }
}

function checkOut() {

    let index = document.getElementById("regSelectOut").selectedIndex;
    let selectOut = document.getElementById("regSelectOut");

    if (index != -1) {
        let reg = selectOut.options[index].value;

        for (let car in garage) {
            if (garage[car].carReg == reg) {
                let selectIn = document.getElementById("regSelectIn");
                selectIn.options[selectIn.options.length] = new Option(garage[car].carReg, garage[car].carReg);
                garage[car].carFaults = 0;
                garage.splice(car, 1);
            }
        }
        selectOut.options[index].remove(index);
    }
}

function adminConsole() {
    //get input from admin console, make uppercase for ease of use, split based on spacing into a temporary array
    let adminIn = document.getElementById("adminInput").value;
    let tempString = adminIn.toUpperCase();
    tempString = tempString.split(" ");

    //largest command consists of 3 "words", therefore anything larger is invalid
    if (tempString.length > 3) {
        document.getElementById("adminOutput").innerHTML = "Invalid Command.";
    }

    //CREATE (reg) (brand)
    //first array element must be command, so check first element for appropriate command
    else if (tempString[0].includes("CREATE") && tempString.length === 3) {
        let reg = "";
        let brand = "";
        let faults = 0;
        let exists = false;
        reg = tempString[1];
        brand = tempString[2];
        //loop through every car to check if reg is already in database, stop command if it exists already
        for (let car in vehicles) {
            if (reg == vehicles[car].carReg) {
                exists = true;
            }
        }
        if (exists) {
            document.getElementById("adminOutput").innerHTML = "Car already exists.";
        }

        //if doesn't exists, create new car object to be pushed to vehicle array
        else {
            let newCar = { carReg: reg, carBrand: brand, carFaults: faults, carBill: ("£" + (faults * 30)) };
            vehicles.push(newCar);
            //add to check in drop down box on web page
            let select = document.getElementById("regSelectIn");
            select.options[select.options.length] = new Option(newCar.carReg, newCar.carReg);
        }
    }

    //OUTPUT GARAGE
    //calls garageList function if appropriate command in array elements 1 and 2 
    else if (tempString[0].includes("OUTPUT") && tempString.length === 2) {
        if (tempString[1].includes("GARAGE")) {
            garageList();
        }
        else {
            document.getElementById("adminOutput").innerHTML = "Invalid command.";
        }
    }

    //CHECKIN (REG)
    else if (tempString[0].includes("CHECKIN") && tempString.length === 3) {

        let adminReg = "";
        let adminFaults = 0;
        let carInGarage = false;
        let selectIn = document.getElementById("regSelectIn");
        adminReg = tempString[1];
        adminFaults = parseInt(tempString[2]);

        for (let car in garage) {
            if (garage[car].carReg == adminReg) {
                carInGarage = true;
                document.getElementById("adminOutput").innerHTML = "Vehicle already in garage.";
            }
        }
        for (let car in vehicles) {
            if (vehicles[car].carReg == adminReg && carInGarage == false) {
                vehicles[car].carFaults = adminFaults;
                vehicles[car].carBill = ("£" + (adminFaults * 30));
                garage.push(vehicles[car]);
                let selectOut = document.getElementById("regSelectOut");
                selectOut.options[selectOut.options.length] = new Option(vehicles[car].carReg, vehicles[car].carReg);
            }
        }

        for (let i = 0; i < selectIn.length; i++) {
            if (selectIn.options[i].value == adminReg && carInGarage == false) {
                selectIn.options[i].remove(i);
            }
        }
    }

    //CHECKOUT (REG)
    else if (tempString[0].includes("CHECKOUT") && tempString.length === 2) {
        let adminReg = "";
        let selectOut = document.getElementById("regSelectOut");
        let carInGarage = false;
        let adminFaults = 0;
        adminReg = tempString[1];

        for (let car in garage) {
            if (adminReg == garage[car].carReg) {
                carInGarage = true;
            }
        }
        if (carInGarage == false) {
            document.getElementById("adminOutput").innerHTML = "Car is already not in garage.";
        }
        else {
            for (let car in garage) {
                if (garage[car].carReg == adminReg) {
                    let selectIn = document.getElementById("regSelectIn");
                    selectIn.options[selectIn.options.length] = new Option(garage[car].carReg, garage[car].carReg);
                    garage[car].carFaults = adminFaults;
                    garage[car].carBill = ("£" + (adminFaults * 30));
                    garage.splice(car, 1);
                }
            }
            for (let i = 0; i < selectOut.length; i++) {
                if (selectOut.options[i].value == adminReg) {
                    selectOut.options[i].remove(i);
                }
            }
        }

    }
    else {
        document.getElementById("adminOutput".innerHTML) = "Invalid Command";
    }
}

