"use strict";
const keys = {
    // Select hotbar slots
    1: () => { hotbar.selectSlot(hotbar.slots[0]) },
    2: () => { hotbar.selectSlot(hotbar.slots[1]) },
    3: () => { hotbar.selectSlot(hotbar.slots[2]) },
    4: () => { hotbar.selectSlot(hotbar.slots[3]) },
    5: () => { hotbar.selectSlot(hotbar.slots[4]) },
    6: () => { hotbar.selectSlot(hotbar.slots[5]) },
    7: () => { hotbar.selectSlot(hotbar.slots[6]) },
    8: () => { hotbar.selectSlot(hotbar.slots[7]) },
    9: () => { hotbar.selectSlot(hotbar.slots[8]) },
    0: () => { hotbar.selectSlot(hotbar.slots[9]) },
    // Show/hide inventory
    e: () => {
        playerInvCont.classList.toggle("inv-hidden");
    },
};

document.addEventListener("keyup", ev => {
    keys[ev.key]?.();
});
