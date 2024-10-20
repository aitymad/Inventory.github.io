document.getElementById('addSection').addEventListener('click', addSection);

function addSection() {
    const section = document.createElement('div');
    section.className = 'section';
    const sectionId = `section-${Date.now()}`; // Generar un ID único para cada sección
    section.innerHTML = `
        <h2 class="section-title">
            <input type="text" placeholder="Nombre de la sección" id="${sectionId}" onblur="saveSectionTitle('${sectionId}')" />
            <span class="edit-icon" onclick="editSectionTitle(this, '${sectionId}')">✏️</span>
            <span class="delete-icon" onclick="deleteSection(this)">🗑️</span>
        </h2>
        <button class="addBox">Agregar Casilla</button>
        <div class="boxes"></div>
    `;
    document.getElementById('sections').appendChild(section);
    
    // Añadir el evento para el botón de agregar casilla
    section.querySelector('.addBox').addEventListener('click', () => addBox(section.querySelector('.boxes')));

    // Guardar el título de la nueva sección automáticamente
    const titleInput = section.querySelector('input');
    titleInput.addEventListener('blur', () => saveSectionTitle(sectionId));
}

function saveSectionTitle(sectionId) {
    const titleInput = document.getElementById(sectionId);
    const titleValue = titleInput.value;
    localStorage.setItem(sectionId, titleValue); // Guardar título en localStorage
}

function addBox(boxContainer) {
    const box = document.createElement('div');
    box.className = 'box';
    
    const uniqueId = 'box-' + Date.now(); // Generar un ID único para cada casilla
    box.innerHTML = `
        <div class="add-image" onclick="uploadImage(this, '${uniqueId}')">
            <span>+</span>
        </div>
        <div class="edit-text">
            <input type="text" placeholder="Texto..." id="${uniqueId}-text" disabled>
            <span class="edit-icon" onclick="editText(this, '${uniqueId}-text')">✏️</span>
            <span class="delete-icon" onclick="deleteBox(this)">🗑️</span>
        </div>
    `;
    boxContainer.appendChild(box);
    saveInventory(); // Guardar el inventario al añadir una nueva casilla
}

function uploadImage(element, uniqueId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.onclick = () => changeImage(input);
                element.innerHTML = '';
                element.appendChild(img);
                
                // Guardar la imagen en localStorage solo si hay suficiente espacio
                try {
                    localStorage.setItem(uniqueId + '-image', event.target.result);
                    saveInventory(); // Guardar el inventario después de cargar la imagen
                } catch (e) {
                    console.error('Error al guardar la imagen en localStorage: ', e);
                    alert('No hay suficiente espacio en localStorage para guardar esta imagen.');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function changeImage(input) {
    input.value = '';
    uploadImage(input.parentElement, input.parentElement.parentElement.querySelector('input').id);
}

function editText(icon, uniqueId) {
    const input = document.getElementById(uniqueId);
    input.disabled = !input.disabled; // Alternar el estado habilitado/deshabilitado
    if (!input.disabled) {
        input.focus(); // Hacer foco en el input para editar
    } else {
        // Guardar el texto en local storage usando un ID único
        const textValue = input.value;
        localStorage.setItem(uniqueId, textValue); // Guardar texto en localStorage usando el ID único
        saveInventory(); // Guardar el inventario después de editar
    }
}

function deleteBox(icon) {
    const box = icon.closest('.box');
    box.remove();
    saveInventory(); // Guardar el inventario al eliminar una casilla
}

function deleteSection(icon) {
    const section = icon.closest('.section');
    section.remove();
    saveInventory(); // Guardar el inventario al eliminar una sección
}

function editSectionTitle(icon, sectionId) {
    const titleInput = document.getElementById(sectionId);
    titleInput.disabled = !titleInput.disabled; // Alternar el estado habilitado/deshabilitado
    if (!titleInput.disabled) {
        titleInput.focus(); // Hacer foco en el input para editar
    } else {
        saveSectionTitle(sectionId); // Guardar el título en localStorage
    }
}

function saveInventory() {
    const sections = document.getElementById('sections').innerHTML;
    localStorage.setItem('inventory', sections);
}

function loadInventory() {
    const savedSections = localStorage.getItem('inventory');
    if (savedSections) {
        document.getElementById('sections').innerHTML = savedSections;
        const addBoxButtons = document.querySelectorAll('.addBox');
        addBoxButtons.forEach(button => {
            button.addEventListener('click', () => addBox(button.nextElementSibling));
        });

        // Habilitar el evento de edición de texto para cada icono de lápiz
        const editIcons = document.querySelectorAll('.edit-icon');
        editIcons.forEach(icon => {
            const uniqueId = icon.previousElementSibling.id; // Obtener el ID único
            icon.onclick = function() {
                editText(this, uniqueId);
            };
        });

        // Cargar texto guardado en cada casilla
        const inputs = document.querySelectorAll('.edit-text input');
        inputs.forEach(input => {
            const savedText = localStorage.getItem(input.id); // Obtener texto usando el ID único
            if (savedText) {
                input.value = savedText; // Restaurar el texto guardado
                input.disabled = true; // Asegurarse de que el input esté deshabilitado al cargar
            }
        });

        // Cargar imágenes guardadas
        // Cargar imágenes guardadas
    const boxes = document.querySelectorAll('.box');
boxes.forEach(box => {
    const uniqueId = box.querySelector('input').id.split('-')[0]; // Obtener el ID único
    const savedImage = localStorage.getItem(uniqueId + '-image');
    if (savedImage) {
        const img = document.createElement('img');
        img.src = savedImage;
        box.querySelector('.add-image').innerHTML = ''; // Limpiar el contenido anterior
        box.querySelector('.add-image').appendChild(img); // Agregar la imagen guardada
    }
});

        // Cargar títulos guardados en cada sección
        const titles = document.querySelectorAll('.section-title input');
        titles.forEach(titleInput => {
            const titleId = titleInput.id;
            const savedTitle = localStorage.getItem(titleId); // Obtener título usando el ID
            if (savedTitle) {
                titleInput.value = savedTitle; // Restaurar el título guardado
            }
        });
    }
}

// Guardar el texto cuando se modifica
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT' && e.target.placeholder === "Texto...") {
        const inputId = e.target.id; // Usar el ID único del input
        localStorage.setItem(inputId, e.target.value); // Guardar texto en localStorage usando el ID único
    } else if (e.target.tagName === 'INPUT' && e.target.placeholder === "Nombre de la sección") {
        const sectionId = e.target.id; // Usar el ID de la sección
        localStorage.setItem(sectionId, e.target.value); // Guardar título de sección
    }
});

loadInventory();

document.getElementById('addSection').addEventListener('click', addSection);
document.getElementById('clearInventory').addEventListener('click', showConfirmationModal);
document.getElementById('confirmYes').addEventListener('click', clearInventory);
document.getElementById('confirmNo').addEventListener('click', closeConfirmationModal);

function showConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'flex'; // Mostrar el modal
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none'; // Ocultar el modal
}

function clearInventory() {
    localStorage.clear(); // Limpiar todo el localStorage
    document.getElementById('sections').innerHTML = ''; // Limpiar las secciones en la página
    closeConfirmationModal(); // Cerrar el modal después de borrar el inventario
}

// El resto del código permanece igual...
