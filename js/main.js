"use strict";
let slotId = 0;

const $ = e => document.querySelector(e),
      body = document.body,

setSlotAttributes = (slot, item = "", count = 1, draggable = false) => {
    slot.dataset.item = item;
    slot.dataset.count = count;
    slot.draggable = draggable;
};

class Inventory {
    constructor(parent, cols, rows) {
        this.inv = document.createElement("div");
        this.slots = [];
        rows *= cols;

        this.inv.classList.add("inv", "inv-cols-" + cols);
        parent.appendChild(this.inv);

        // Create slots
        for (let i=0; i<rows; i++) {
            const slot = document.createElement("div");

            slot.id = "slot-" + slotId++;
            setSlotAttributes(slot);
            this.slots.push(slot);
            this.inv.appendChild(slot);

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

                // Stack items
                if (origin.dataset.item === slot.dataset.item) {
                    let total = Number(slot.dataset.count) + Number(origin.dataset.count);
                    const stackSize = items[slot.dataset.item].stackSize;
                    
                    if (total > stackSize) {
                        origin.dataset.count = total - stackSize; 
                        return slot.dataset.count = stackSize; 
                    }
                    
                    slot.dataset.count = total;
                    return setSlotAttributes(origin);
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
                
                    for (const item of this.inv.querySelectorAll(`[data-item="${slot.dataset.item}"]:not(#${slot.id})`)) {
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
        };
    };

    addItems(items) {
        items.forEach(item => {
            setSlotAttributes(this.slots[item[0]], item[1], item[2], true);
        });
    };
};

// ----- Create player inventory -----
const playerInvCont = $("#inv"),
      playerInvTop = $("#inv-top"),
      playerSkin = $("#inv-skin"),

hotbar = new Inventory(playerInvCont, 10, 1),
playerInv = new Inventory(playerInvCont, 10, 3),
playerArmor = new Inventory(playerInvTop, 2, 2),
playerCraft = new Inventory(playerInvTop, 2, 2),
playerCraftOut = new Inventory(playerInvTop, 1, 1);

playerInvCont.appendChild(playerInv.inv);
playerInvCont.appendChild(hotbar.inv);
playerInvTop.insertBefore(playerArmor.inv, playerSkin);
playerInvTop.insertBefore(playerCraft.inv, $("#inv .inv-cols-1"));
playerInvTop.appendChild(playerCraftOut.inv);

// --- Hotbar: select slot ---
hotbar.slots.forEach(slot => {
    slot.addEventListener("click", ev => {
        hotbar.selectSlot(ev.target);
    });
});

hotbar.selectSlot = slot => {
    hotbar.selectedSlot.classList.remove("selected");
    hotbar.selectedSlot = slot;
    slot.classList.add("selected");
};

hotbar.selectedSlot = hotbar.slots[0];
hotbar.selectSlot(hotbar.selectedSlot);

// For testing
hotbar.addItems([
    [0, "stone", 6],
    [1, "wood", 1],
    [3, "stone", 3],
    [5, "wood", 10],
    [6, "stone", 7],
    [8, "wood", 4]
]);
