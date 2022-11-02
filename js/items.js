"use strict";
let itemStyle = "";

const items = {
    stone: {
        id: 0,
        type: "block",
        stackSize: 10,
    },
    wood: {
        id: 1,
        type: "block",
        stackSize: 10,
    },
};

Object.getOwnPropertyNames(items).forEach(name => {
    itemStyle += `[data-item='${name}']{background-image:url(img/items/${name}.png)}`;
});

document.querySelector("style").innerHTML = itemStyle;
