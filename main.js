let itemId = 0;

const $ = e => document.querySelector(e),
      inv = $(".inv");

// Creates an inventory with item[id, count]
const createInventory = (...itemGroup) => {
    itemGroup.forEach(group => {
        const slot = document.createElement("div");

        // Add item
        if (group[1]) {
            const item = document.createElement("div"),
                  img = document.createElement("img"),
                  itemName = items[group[0]][0];

            item.id = "item-" + itemId++;
            item.setAttribute("data-id", group[0]);
            item.setAttribute("data-count", group[1]);
            item.setAttribute("draggable", "true");

            img.src = `img/items/${itemName}.png`;
            img.setAttribute("alt", itemName);
            
            item.appendChild(img);
            slot.appendChild(item);

            // Add drag listener
            item.addEventListener("dragstart", ev => {
                ev.dataTransfer.setData("text/plain", ev.target.id);
            });
        }

        // Add slot
        inv.appendChild(slot);

        // ----- Add event listeners -----
        slot.addEventListener("dragover", ev => {
            ev.preventDefault();
        });

        slot.addEventListener("dragenter", ev => {
            ev.target.classList.add("drag");
        });
    
        slot.addEventListener("dragleave", ev => {
            ev.target.classList.remove("drag");
        });
    
        slot.addEventListener("drop", ev => {
            ev.stopPropagation();
    
            const target = ev.target,
                  origin = $("#" + ev.dataTransfer.getData("text/plain"));
            
            target.classList.remove("drag");

            // Move item
            if (!target.innerHTML) {
                return target.appendChild(origin);
            }
            // Stack items
            if (target.dataset.id === origin.dataset.id) {
                const count = Number(target.dataset.count) + Number(origin.dataset.count),
                      maxStackSize = items[Number(target.dataset.id)][1];

                if (count > maxStackSize) {
                    origin.dataset.count = count - maxStackSize; 
                    return target.dataset.count = maxStackSize; 
                }
                
                target.dataset.count = count;
                return origin.remove();
            }

            // --- Swap items ---
            const parent = target.parentNode;

            origin.parentNode.appendChild(target);
            parent.appendChild(origin);
        });
    });
};

createInventory(
    [],[1,1],[],[0,3],[],[1,9],[],[1,4],[],[],
    [],[],[0,1],[1,3],[],[],[0,7],[],[],[],
    [0,2],[],[],[],[1,1],[],[],[0,5],[],[1,1],
);
