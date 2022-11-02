"use strict";
let slotId = 0;

const $ = e => document.querySelector(e),
      body = document.body,
      inventoryContainer = document.createElement("div"),

setSlotAttributes = (slot, item = "", count = "", draggable = false) => {
    slot.dataset.item = item;
    slot.dataset.count = count;
    slot.draggable = draggable;
};

class Inventory {
    constructor(parent, columnCount, slots) {
        this.slots = [];
        const inv = document.createElement("div");

        inv.classList.add("inv", "inv-cols-" + columnCount);
        parent.appendChild(inv);

        slots.forEach(data => {
            const slot = document.createElement("div");

            slot.id = "slot-" + slotId++;
            this.slots.push(slot);
            inv.appendChild(slot);

            // Add item
            if (data) {
                setSlotAttributes(slot, data[0], data[1], true);
            }
            else {
                setSlotAttributes(slot);
            }

            // ----- Move items by dragging -----
            slot.addEventListener("dragenter", ev => {
                ev.target.classList.add("drag");
            });

            slot.addEventListener("dragleave", ev => {
                ev.target.classList.remove("drag");
            });

            slot.addEventListener("dragover", ev => {
                ev.preventDefault();
            });

            slot.addEventListener("dragstart", ev => {
                ev.dataTransfer.setData("text/plain", slot.id);
            });

            slot.addEventListener("drop", ev => {
                ev.stopPropagation();

                const origin = $("#" + ev.dataTransfer.getData("text/plain"));

                slot.classList.remove("drag");

                // Do nothing if item hasn't moved
                if (origin === slot) {
                    return;
                }

                if (origin.dataset.item === slot.dataset.item) {
                    // // Stack items
                    // if (target.dataset.id === origin.dataset.id) {
                    //     const count = Number(target.dataset.count) + Number(origin.dataset.count),
                    //           stackSize = items[Number(target.dataset.id)][1];

                    //     if (count > stackSize) {
                    //         origin.dataset.count = count - stackSize; 
                    //         return target.dataset.count = stackSize; 
                    //     }
                        
                    //     target.dataset.count = count;
                    //     return origin.remove();
                    // }
                    
                    return console.log("TODO: stack origin", origin, "onto slot", slot);
                }

                // --- Swap items ---
                const attributes = [[], []];

                [origin, slot].forEach((e, i) => {
                    attributes[i].push(e.dataset.item, e.dataset.count, e.draggable);
                });

                setSlotAttributes(slot, ...attributes[0]);
                setSlotAttributes(origin, ...attributes[1]);
            });

            // --- Stack items by double clicking ---
            slot.addEventListener("dblclick", () => {
                if (slot.draggable) {
                    let total = Number(slot.dataset.count);
                    const stackSize = items[slot.dataset.item].stackSize;
                
                    for (const item of inv.querySelectorAll(`[data-item="${slot.dataset.item}"]:not(#${slot.id})`)) {
                        const count = Number(item.dataset.count);
                
                        total += count;
                
                        if (total < stackSize) {
                            slot.dataset.count = total;
                            setSlotAttributes(item);
                        }
                        else {
                            slot.dataset.count = stackSize;
                            return item.dataset.count = total - stackSize;
                        }
                    }
                }
            });
        });
    };
};

inventoryContainer.id = "inv";

const inventory = new Inventory(body, 10, [
    ["stone", 6],
    ["wood", 1],
    null,
    ["stone", 3],
    null,
    ["wood", 10],
    ["stone", 7],
    null,
    null,
    ["wood", 4]
]);
