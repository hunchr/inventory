"use strict";
let slotId = 0;

const $ = e => document.querySelector(e),
      body = document.body,

setSlotAttributes = (slot, item = "", count = 1, draggable = false) => {
    slot.dataset.item = item;
    slot.dataset.count = count;
    slot.draggable = draggable;
},

setSlotFilter = (...filters) => {
    filters.forEach(filter => {
        filter[0].dataset.allowed = filter[1];
    });
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
                    const stackSize = items[slot.dataset.item][1];
                    
                    if (total > stackSize) {
                        origin.dataset.count = total - stackSize; 
                        return slot.dataset.count = stackSize; 
                    }
                    
                    slot.dataset.count = total;
                    return setSlotAttributes(origin);
                }

                // --- Swap items ---
                if (!slot.dataset.allowed || slot.dataset.allowed === items[origin.dataset.item][0]) {
                    const attributes = [[], []];

                    [origin, slot].forEach((e, i) => {
                        attributes[i].push(e.dataset.item, e.dataset.count, e.draggable);
                    });

                    setSlotAttributes(slot, ...attributes[0]);
                    setSlotAttributes(origin, ...attributes[1]);
                }
            });

            // --- Stack items by double clicking ---
            slot.addEventListener("dblclick", () => {
                if (slot.draggable) {
                    let total = Number(slot.dataset.count);
                    const stackSize = items[slot.dataset.item][1];
                
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

    addItem(...items) {
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

// --- Set rules ---
setSlotFilter(
    [playerArmor.slots[0], "helmet"],
    [playerArmor.slots[1], "chestplate"],
    [playerArmor.slots[2], "leggings"],
    [playerArmor.slots[3], "boots"],
    [playerCraftOut.slots[0], "-"]
);

//* --- Testing (delete later) ---
hotbar.addItem(
    [0, "stone", 32],
    [1, "stick"],
    [6, "stone"],
    [7, "stick", 17],
);

playerInv.addItem(
    [0, "woodHelmet"],
    [1, "ironChestplate"],
    [2, "goldLeggings"],
    [3, "amethystBoots"],
    [4, "diamondSword"],
    [5, "sapphirePickaxe"],
    [6, "emeraldAxe"],
    [7, "rubyShovel"],
    [8, "spinelHoe"],
    [9, "ironBlock", 48],
    [10, "goldBlock", 48],
    [11, "amethystBlock", 48],
    [12, "diamondBlock", 48],
    [13, "sapphireBlock", 48],
    [14, "emeraldBlock", 48],
    [15, "rubyBlock", 48],
    [16, "spinelBlock", 48],
);
