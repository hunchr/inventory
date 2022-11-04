"use strict";
let itemStyle = "";

const items = {
    // Blocks
    stone: ["block", 64],
    // Items
    stick: ["item", 1],
    // Weapons
    stoneSword: ["weapon", 1],
    stonePickaxe: ["weapon", 1],
    stoneAxe: ["weapon", 1],
    stoneShovel: ["weapon", 1],
    stoneHoe: ["weapon", 1],
    // Armor
    stoneHelmet: ["helmet", 1],
    stoneChestplate: ["chestplate", 1],
    stoneLeggings: ["leggings", 1],
    stoneBoots: ["boots", 1],
};

Object.getOwnPropertyNames(items).forEach(name => {
    itemStyle += `[data-item='${name}']{background-image:url(img/items/${name}.png)}`;
});

document.querySelector("style").innerHTML = itemStyle;
