// Game state
const gameState = {
    currentRoom: 'Foyer',
    inventory: [],
    unlockedRooms: ['Foyer'],
    selectedItem: 'none'
};

// Game data
const gameData = {
    rooms: {
        'Foyer': { description: "A grand entrance with a peculiar door lock", requires: null, contains: 'Red Orb', unlocks: 'Living Room' },
        'Living Room': { description: "Cozy room with an odd bookcase and a locked cabinet", requires: 'Red Orb', contains: 'Blue Cube', unlocks: 'Kitchen' },
        'Kitchen': { description: "Modern kitchen with a strange-looking appliance", requires: 'Blue Cube', contains: ['Green Pyramid', 'Yellow Cylinder'], unlocks: 'Bathroom' },
        'Library': { description: "Walls lined with books, one shelf seems out of place", requires: 'Mysterious Book', contains: null, unlocks: 'Attic' },
        'Bathroom': { description: "Small bathroom with a peculiar mirror", requires: 'Green Pyramid', contains: 'Purple Sphere', unlocks: 'Bedroom' },
        'Bedroom': { description: "Comfortable room with a safe (4-digit code)", requires: 'Yellow Cylinder', contains: 'Orange Hexagon', unlocks: 'Study' },
        'Study': { description: "Work area with an alarm system (4-digit code)", requires: 'Purple Sphere', contains: 'Silver Disc', unlocks: 'Basement' },
        'Attic': { description: "Dusty room with old trinkets and a scrap of paper", requires: null, contains: 'Safe Code', unlocks: null },
        'Basement': { description: "Dark room with strange machinery", requires: 'Silver Disc', contains: 'Gold Ring', unlocks: 'Secret Lab' },
        'Secret Lab': { description: "High-tech laboratory with a central pedestal", requires: 'Gold Ring', contains: 'Crystal Prism', unlocks: null }
    },
    specialActions: {
        'Library': { item: 'Orange Hexagon', result: 'Mysterious Book', message: "You found a Mysterious Book behind the odd bookshelf!" },
        'Bedroom': { item: 'Safe Code', result: 'Orange Hexagon', message: "You opened the safe and found an Orange Hexagon!" },
        'Secret Lab': { item: 'Crystal Prism', result: 'win', message: "Congratulations! You've completed Abstract Manor!" }
    }
};

// Initialize the game
function initGame() {
    updateMap();
    updateInventory();
    updateDescription();
    attachEventListeners();
}

// Update the map display
function updateMap() {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = '';
    for (const room in gameData.rooms) {
        const roomButton = document.createElement('button');
        roomButton.textContent = room;
        roomButton.classList.add('room');
        if (gameState.unlockedRooms.includes(room)) {
            roomButton.classList.add('unlocked');
        } else {
            roomButton.classList.add('locked');
        }
        roomButton.addEventListener('click', () => handleRoomClick(room));
        mapContainer.appendChild(roomButton);
    }
}

// Update the inventory display
function updateInventory() {
    const inventoryContainer = document.getElementById('inventory');
    inventoryContainer.innerHTML = '<button class="inventory-item selected" data-item="none">None</button>';
    for (const item of gameState.inventory) {
        const itemButton = document.createElement('button');
        itemButton.textContent = item;
        itemButton.classList.add('inventory-item');
        itemButton.dataset.item = item;
        inventoryContainer.appendChild(itemButton);
    }
    attachInventoryListeners();
}

// Update the room description
function updateDescription() {
    const descriptionElement = document.getElementById('room-description');
    descriptionElement.textContent = gameData.rooms[gameState.currentRoom].description;
}

// Handle room clicks
function handleRoomClick(room) {
    if (gameState.unlockedRooms.includes(room)) {
        gameState.currentRoom = room;
        updateDescription();
        checkForItems();
    } else if (gameData.rooms[room].requires === gameState.selectedItem) {
        unlockRoom(room);
    } else {
        showMessage("You can't access this room yet.");
    }
}

// Unlock a room
function unlockRoom(room) {
    gameState.unlockedRooms.push(room);
    gameState.inventory = gameState.inventory.filter(item => item !== gameState.selectedItem);
    gameState.selectedItem = 'none';
    gameState.currentRoom = room;
    updateMap();
    updateInventory();
    updateDescription();
    checkForItems();
    showMessage(`You unlocked the ${room}!`);
}

// Check for items in the current room
function checkForItems() {
    const room = gameData.rooms[gameState.currentRoom];
    if (room.contains && !gameState.inventory.includes(room.contains)) {
        if (Array.isArray(room.contains)) {
            for (const item of room.contains) {
                gameState.inventory.push(item);
                showMessage(`You found a ${item}!`);
            }
        } else {
            gameState.inventory.push(room.contains);
            showMessage(`You found a ${room.contains}!`);
        }
        updateInventory();
    }
    checkSpecialActions();
}

// Check for special actions in the current room
function checkSpecialActions() {
    const specialAction = gameData.specialActions[gameState.currentRoom];
    if (specialAction && gameState.selectedItem === specialAction.item) {
        if (specialAction.result === 'win') {
            showMessage(specialAction.message);
            // Add win condition handling here
        } else {
            gameState.inventory = gameState.inventory.filter(item => item !== specialAction.item);
            gameState.inventory.push(specialAction.result);
            gameState.selectedItem = 'none';
            updateInventory();
            showMessage(specialAction.message);
        }
    }
}

// Show a message to the player
function showMessage(message) {
    const messageElement = document.getElementById('game-message');
    messageElement.textContent = message;
}

// Attach event listeners
function attachEventListeners() {
    attachInventoryListeners();
}

// Attach inventory item listeners
function attachInventoryListeners() {
    const inventoryItems = document.querySelectorAll('.inventory-item');
    inventoryItems.forEach(item => {
        item.addEventListener('click', () => {
            gameState.selectedItem = item.dataset.item;
            inventoryItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
        });
    });
}

// Initialize the game when the page loads
window.onload = initGame;