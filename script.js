const desktopContainer = document.getElementById("desktop-container");
const iconsData = [
    { name: "icon1.png", label: "Mac Os", x: 0, y: 0, "container-typeClass": "carpeta" },
    { name: "icon2.png", label: "Windows", x: 0, y: 100, "container-typeClass": "carpeta" },
    // Agrega más datos de iconos aquí
];

const openedFolders = []; // Almacenará las posiciones de las carpetas abiertas
let gridWidth = 100; // Ancho de la celda de la rejilla
let gridHeight = 100; // Alto de la celda de la rejilla

const iconWidth = 100; // Ancho de cada icono
const iconHeight = 100; // Alto de cada icono
const gridGap = 10; // Espacio entre celdas de la cuadrícula
const occupiedCells = new Set(); // Conjunto de celdas ocupadas

// Calcular el número de columnas y filas en función del tamaño del escritorio y de los iconos
const columns = Math.floor(window.innerWidth / (iconWidth + gridGap));
const rows = Math.floor(window.innerHeight / (iconHeight + gridGap));

// Calcular la posición de celda de un icono en la cuadrícula
function calculateGridPosition(x, y) {
    const col = Math.floor(x / (iconWidth + gridGap));
    const row = Math.floor(y / (iconHeight + gridGap));
    return { col, row };
}

// Calcular la posición absoluta en píxeles de una celda en la cuadrícula
function calculatePixelPosition(col, row) {
    const x = col * (iconWidth + gridGap);
    const y = row * (iconHeight + gridGap);
    return { x, y };
}

iconsData.forEach(iconData => {
    iconData.element = createIconElement(iconData);
    iconData.lastX = parseInt(iconData.x); // Inicializa con la posición X actual
    iconData.lastY = parseInt(iconData.y); // Inicializa con la posición Y actual
    desktopContainer.appendChild(iconData.element);
});

desktopContainer.addEventListener("dblclick", handleIconDoubleClick);

let selectedIcon = null;
let offsetX = 0;
let offsetY = 0;

function createIconElement(iconData) {
    const iconElement = document.createElement("div");
    iconElement.classList.add("icon");
    iconElement.classList.add(iconData["container-typeClass"]);

    const imgElement = document.createElement("img");
    imgElement.src = `${iconData.name}`;
    imgElement.alt = iconData.label; // Usamos el label como texto alternativo
    iconElement.appendChild(imgElement);

    const labelElement = document.createElement("div");
    labelElement.classList.add("icon-label");
    labelElement.textContent = iconData.label;
    iconElement.appendChild(labelElement);

    iconElement.style.left = `${iconData.x}px`;
    iconElement.style.top = `${iconData.y}px`;

    iconElement.addEventListener("mousedown", handleMouseDown);
    iconElement.addEventListener("touchstart", handleTouchStart);

    return iconElement;
}

function handleIconDoubleClick(event) {
    const icon = event.target.closest(".icon");
    if (icon && icon.classList.contains("carpeta")) {
        const containerTypeClass = "carpeta";
        const iconLabel = icon.querySelector(".icon-label").textContent;

        const newContainer = document.createElement("div");
        newContainer.classList.add("icon-container");
        newContainer.classList.add(containerTypeClass);
        newContainer.style.width = "400px";
        newContainer.style.height = "250px";
        newContainer.style.backgroundColor = "lightyellow";
        newContainer.style.borderRadius = "10px";
        newContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        newContainer.style.position = "fixed";
        newContainer.style.left = getUniquePosition(openedFolders, "left") + "px";
        newContainer.style.top = getUniquePosition(openedFolders, "top") + "px";

        const closeButton = document.createElement("button");
        closeButton.textContent = "×"; // Símbolo de cierre
        closeButton.classList.add("close-button");
        closeButton.addEventListener("click", () => {
            newContainer.remove();
            openedFolders.splice(openedFolders.indexOf({ left: parseInt(newContainer.style.left), top: parseInt(newContainer.style.top) }), 1);
        });

        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.left = "10px";

        newContainer.appendChild(closeButton);

        const labelElement = document.createElement("div");
        labelElement.textContent = `Div {${containerTypeClass}} de ${iconLabel}`;
        newContainer.appendChild(labelElement);

        desktopContainer.appendChild(newContainer);
        openedFolders.push({ left: parseInt(newContainer.style.left), top: parseInt(newContainer.style.top) });
    }
}

function getUniquePosition(positionsArray, axis) {
    const initialPosition = axis === "left" ? 100 : 100; // Posición inicial en el eje X o Y
    const step = axis === "left" ? 50 : 50; // Tamaño del paso en el eje X o Y
    let currentPosition = initialPosition;
    let foundUniquePosition = false;

    while (!foundUniquePosition) {
        const overlappingFolder = positionsArray.find(folder => Math.abs(folder[axis] - currentPosition) < 10); // Verifica si hay superposición
        if (!overlappingFolder) {
            foundUniquePosition = true;
        } else {
            currentPosition += step;
        }
    }

    return currentPosition;
}

function getUniquePosition(positionsArray, axis) {
    const initialPosition = axis === "left" ? 100 : 100; // Posición inicial en el eje X o Y
    const step = axis === "left" ? 50 : 50; // Tamaño del paso en el eje X o Y
    let currentPosition = initialPosition;
    let foundUniquePosition = false;

    while (!foundUniquePosition) {
        const overlappingFolder = positionsArray.find(folder => Math.abs(folder[axis] - currentPosition) < 10); // Verifica si hay superposición
        if (!overlappingFolder) {
            foundUniquePosition = true;
        } else {
            currentPosition += step;
        }
    }

    return currentPosition;
}

function handleMouseDown(event) {
    event.preventDefault(); // Evita la selección no deseada del texto
    selectedIcon = event.currentTarget;
    const iconBoundingRect = selectedIcon.getBoundingClientRect();
    offsetX = event.clientX - iconBoundingRect.left;
    offsetY = event.clientY - iconBoundingRect.top;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
}

function handleMouseMove(event) {
    selectedIcon.style.left = `${event.clientX - offsetX}px`;
    selectedIcon.style.top = `${event.clientY - offsetY}px`;
}

function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
}

function handleTouchStart(event) {
    selectedIcon = event.currentTarget;
    const iconBoundingRect = selectedIcon.getBoundingClientRect();
    offsetX = event.touches[0].clientX - iconBoundingRect.left;
    offsetY = event.touches[0].clientY - iconBoundingRect.top;

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
}

function handleTouchMove(event) {
    selectedIcon.style.left = `${event.touches[0].clientX - offsetX}px`;
    selectedIcon.style.top = `${event.touches[0].clientY - offsetY}px`;
}

function handleTouchEnd() {
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
}

function handleIconDragEnd(event) {
    if (selectedIcon) {
        const rect = desktopContainer.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const nearestX = Math.round(offsetX / gridWidth) * gridWidth;
        const nearestY = Math.round(offsetY / gridHeight) * gridHeight;

        selectedIcon.style.left = `${nearestX}px`;
        selectedIcon.style.top = `${nearestY}px`;

        selectedIcon = null;
    }
}

function handleMouseUp(event) {
    if (selectedIcon) {
        const { col, row } = calculateGridPosition(event.clientX, event.clientY);

        // Verificar si la celda está ocupada
        const isCellOccupied = iconsData.some(iconData => {
            const { col: iconCol, row: iconRow } = calculateGridPosition(iconData.lastX, iconData.lastY);
            return col === iconCol && row === iconRow && selectedIcon !== iconData.element;
        });

        if (isCellOccupied) {
            alert("La celda está ocupada. No puedes superponer los iconos en la misma celda.");
            selectedIcon.style.left = `${selectedIcon.lastX}px`; // Restaura la posición X anterior
            selectedIcon.style.top = `${selectedIcon.lastY}px`; // Restaura la posición Y anterior
        } else {
            const { x, y } = calculatePixelPosition(col, row);
            selectedIcon.style.left = `${x}px`;
            selectedIcon.style.top = `${y}px`;

            // Actualiza la última posición del icono
            selectedIcon.lastX = x;
            selectedIcon.lastY = y;
        }

        selectedIcon = null;
    }
}