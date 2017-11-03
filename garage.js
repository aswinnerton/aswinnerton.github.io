

'use strict';

//global arrays for an internal vehicle list with vehicles that always persist, and a garage with vehicles that can be entered and removed
let vehicles = [];
let garage = [];
function createCar() {
    //overwrite paragraph to empty in case an error is already showing
    document.getElementById("newVehiclePara").innerHTML = "";

    //get user input as registration number of vehicle to be created, force to upper case for storage purposes, do same for brand
    let reg = document.getElementById("carRegIn").value;
    reg = reg.toUpperCase();
    let brand = document.getElementById("carBrand").value;
    brand = brand.toUpperCase();

    //initialise faults as a number for object element storage, set exist variable currently to false
    let faults = 0;
    let exists = false;

    //loop through cars currently in vehicle array to find matching reg plates, if a match is found, vehicle already exists and won't be entered
    for (let car in vehicles) {
        if (reg == vehicles[car].carReg) {
            exists = true;
        }
    }
    if (exists) {
        document.getElementById("newVehiclePara").innerHTML = "Car already exists.";
    }

    //assign details to newCar object based on user input, then push to the vehicle array
    else {
        let newCar = { carReg: reg, carBrand: brand, carFaults: faults, carBill: ("£" + (faults * 30)) };

        vehicles.push(newCar);

        //add the reg number to the check in drop down selector box
        let select = document.getElementById("regSelectIn");
        select.options[select.options.length] = new Option(newCar.carReg, newCar.carReg);
    }
}

//simple function to return what vehicles are currently in the garage
function garageList() {
    document.getElementById("garagePara").innerHTML = "";
    //loop through vehicles to get keys and attributes of the vehicles to be output to garage paragraph
    for (let car in garage) {
        for (let key in garage[car]) {
            document.getElementById("garagePara").innerHTML += key + ": " + garage[car][key] + "<br>";
        }
        document.getElementById("garagePara").innerHTML += "<br>";
    }
}

//check in function to enter cars from the vehicle list to the garage
function checkIn() {

    //initialise index for which vehicle is being entered from the check in drop down list, as well as the dropdown box itself
    let index = document.getElementById("regSelectIn").selectedIndex;
    let selectIn = document.getElementById("regSelectIn");

    //default for empty boxes is -1, which breaks everything, so this if loop avoids it
    //reg takes currently selected dropdown option, faults takes use fault number for input into vehicle fault element 
    if (index != -1) {
        let reg = selectIn.options[index].value;
        let faults = parseInt(document.getElementById("carFaultIn").value);

        //for loop loops through every car in vehicle array, if a matching reg is hit, set the new fault values, determine bill from this
        //then push to garage array and add to the check out drop down list
        for (let car in vehicles) {
            if (vehicles[car].carReg == reg) {
                vehicles[car].carFaults = faults;
                vehicles[car].carBill = ("£" + (faults * 30));
                garage.push(vehicles[car]);
                let selectOut = document.getElementById("regSelectOut");
                selectOut.options[selectOut.options.length] = new Option(vehicles[car].carReg, vehicles[car].carReg);
            }
        }
        //remove checked in vehicle from the check in list so that it cannot be checked in more than once
        selectIn.options[index].remove(index);
    }
}

//check out function to remove vehicles from garage
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
        if (tempString[1].includes("-")) {
            tempString[1].replace("-", " ");
        }
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
        if (tempString[1].includes("-")) {
            tempString[1].replace("-", " ");
        }
        let adminFaults = 0;
        let carInGarage = false;
        let selectIn = document.getElementById("regSelectIn");
        adminReg = tempString[1];
        adminFaults = parseInt(tempString[2]);
        //for reg input, since most regs have a space in the middle and im a doof, will have to use a "-" for manual input then after the split, replace - with space

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

