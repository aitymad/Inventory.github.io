// Selecciona todos los botones de añadir secciones
document.querySelectorAll('.add_section').forEach(button => {
    button.addEventListener('click', openModal);
});

// Funciones de modal y agregar sección
document.querySelector('.close').addEventListener('click', closeModal);
document.querySelector('.submit_section').addEventListener('click', addSection);

const sectionsContainers = document.querySelectorAll('.sections');
const modal = document.querySelector('.modal');
const editSection = document.querySelector('.edit_section');

let selectedSection = null; // Para almacenar la sección seleccionada
let currentContainer = null; // Para almacenar el contenedor actual

function openModal() {
    currentContainer = this.closest('.sections'); // Guardar el contenedor actual
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

function addSection() {
    const imageInput = document.querySelector('.image_input');
    const textInput = document.querySelector('.text_input');
    const section = document.createElement('section');
    section.className = 'section';

    const file = imageInput.files[0];
    const text = textInput.value;

    const reader = new FileReader();
    reader.onload = function(e) {
        section.innerHTML = 
        `<button class="carpet">
            <img src="${e.target.result}" alt="Button Image">
            <div class="text">${text}</div>
        </button>`;

        // Insert the new section into the correct container
        if (currentContainer) {
            currentContainer.insertBefore(section, currentContainer.querySelector('.add_section'));
        }

        closeModal();

        // Clear the modal input fields
        imageInput.value = '';
        textInput.value = '';
        
        // Set up listeners for the new section
        setupSectionListeners(section);
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        alert("Por favor, selecciona una imagen.");
    }
}

// Función para añadir los event listeners a los elementos necesarios
function setupSectionListeners(section) {
    section.addEventListener('click', function(event) {
        if (event.target.closest('button')) {
            if (selectedSection) {
                selectedSection.classList.remove('selected');
            }
            selectedSection = event.target.closest('section');
            selectedSection.classList.add('selected');
        }
    });
}

// Selección y eliminación de secciones
sectionsContainers.forEach(container => {
    setupSectionListeners(container); // Configurar listeners para secciones existentes
});

// Eliminar sección seleccionada
document.querySelector('.eliminate').addEventListener('click', function() {
    if (selectedSection) {
        selectedSection.remove();
        selectedSection = null;
    } else {
        alert("Por favor, selecciona una sección para eliminar.");
    }
});




// Funcionalidad de edición de título
const titleEdits = document.querySelectorAll('.title_edit');
titleEdits.forEach(titleEdit => {
    addTitleEditingFunctionality(titleEdit);
});

function addTitleEditingFunctionality(titleEdit) {
    titleEdit.addEventListener('click', function() {
        titleEdit.contentEditable = true;
        titleEdit.focus();
    });

    titleEdit.addEventListener('blur', function() {
        titleEdit.contentEditable = false;
    });
}

// Crear un nuevo artículo
document.querySelector('.plus').addEventListener('click', createNewArticle);

function createNewArticle() {
    // Clonar el artículo existente
    const newArticle = document.createElement('article');
    newArticle.innerHTML = `
        <div class="title">
            <div class="title_edit">COMIDAS</div>
            <button class="delete">
                <img src="trash.svg" class="icon" alt="Cuadrado Rojo" width="24" height="24">
            </button>
        </div>
        <div class="sections">
            <button class="add_section">
                <img src="plus.svg" class="icon" alt="Cuadrado Rojo" width="24" height="24">
            </button>
        </div>
    `;
    
    // Añadir el nuevo artículo al final del body
    document.body.appendChild(newArticle);
    
    // Asignar event listener al botón "add_section" en el nuevo artículo
    newArticle.querySelector('.add_section').addEventListener('click', openModal);
    
    // Asignar event listener al botón de eliminar en el nuevo artículo
    newArticle.querySelector('.delete').addEventListener('click', function() {
        newArticle.remove(); // Elimina el artículo completo
    });

    // Llama a la función de configuración de listeners para el nuevo artículo
    setupSectionListeners(newArticle.querySelector('.sections'));
}

// Seleccionar todos los artículos existentes y añadir el event listener a los botones de eliminar
document.querySelectorAll('article').forEach(article => {
    article.querySelector('.delete').addEventListener('click', function() {
        article.remove(); // Elimina el artículo completo
    });
});
