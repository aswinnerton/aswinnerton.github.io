
'use strict';
//access JSON file at https://raw.githubusercontent.com/ewomackQA/JSONDataRepo/master/example.json
//display retrieved objects in an organised fashion.

let url = 'https://raw.githubusercontent.com/ewomackQA/JSONDataRepo/master/example.json';

function print(item, subItem) {
    let createP = document.createElement("P");
    let node = document.createTextNode(item + ": " + subItem);
    createP.appendChild(node);
    document.body.appendChild(createP);
}

function getData() {

    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
        let requestData = request.response;
        let myH1 = document.createElement('h1');
        myH1.textContent = requestData['squadName'];
        document.getElementsByTagName('head')[0].appendChild(myH1);
        console.log(requestData);

        for (let item in requestData) {

            if (Array.isArray(requestData[item])) {
                let memberList = requestData[item];
                for (let member in memberList) {
                    let memberChar = memberList[member];
                    for (let key in memberChar) {
                        print(key,memberChar[key]);
                    }
                }


            }
            else {
                print(item, requestData[item])
            }
        }
    }
}
