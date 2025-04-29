import * as ContactsModule from "./contacts.js";

// Selectores
const nameInput = document.querySelector("#input-text");
	const btn = document.querySelector("#item-button");
    const comment = document.querySelector('.comment');
    const form = document.querySelector("#form");

    const taskList = document.getElementById('task-list');
    const task = document.getElementById('#task');
    const taskcompleted = document.getElementById('#task-completed');
    const taskremaining = document.getElementById('#task-remaining');
	

// Regex
const NAME_REGEX = /^[A-Z\u00d1][a-z\u00f1]{3,}$/;

// Validaciones 
let isInputTaskValid = false;

// Funciones 
const renderInputValidationStatus = (input, isInputValid) => {
    const helperText = input.nextElementSibling;
    if (input.value === "") {
        // Quitar lo colores y no mostrar el texto de ayuda
        input.classList.remove("input-invalid");
        input.classList.remove("input-valid");
        helperText?.classList.add("show-helper-text");
    } else if (isInputValid) {
        // Ponerse verde y ocultar el texto de ayuda
        input.classList.add("input-valid");
        input.classList.remove("input-invalid");
        helperText?.classList.remove("show-helper-text");
    } else {
        // Ponerse rojo y mostrar el texto de ayuda
        input.classList.add("input-invalid");
        input.classList.remove("input-valid");
        helperText?.classList.remove("show-helper-text");
    }
};

const renderBtnValidationStatus = () => {
	if (isInputTaskValid) {
		btn.disabled = false;
	} else {
		btn.disabled = true;
	}
};





// Eventos
nameInput.addEventListener("input", (e) => {
	isInputTaskValid = NAME_REGEX.test(nameInput.value);
	renderInputValidationStatus(nameInput, isInputTaskValid);
	renderBtnValidationStatus();
});

form.addEventListener("submit", (e) => {
	//1. Prevenir el evento predefinido
	e.preventDefault();
	// 2. Crear la estructura del contacto
	const newContact  = {
		id: crypto.randomUUID(),
		name: nameInput.value
	};
	// 3. Guardar el contacto en el array
	ContactsModule.addContact(newContact);
	// 4. Guardar el contacto en el navegador
	ContactsModule.saveContactsInBrowser();
	// 5. Mostrar contactos en el html
	ContactsModule.renderContacts(taskList);
    
});

taskList.addEventListener("click", (e) => {
	const deleteBtn = e.target.closest(".delete-btn");
	const checkBtn = e.target.closest(".check-btn")

	if (deleteBtn) {
		// 1. Obtener el id
		const li = deleteBtn.parentElement.parentElement;
		// 2. Eliminar el contacto del array
		ContactsModule.removeContact(li.id);
		// 3. Guardar los contactos en el navegador
		ContactsModule.saveContactsInBrowser();
		// 4. Renderizar los contactos
		ContactsModule.renderContacts(taskList);
	}

	//tengo que hacer que marque lista la tarea 
	if (checkBtn) {
		const li = checkBtn.parentElement.parentElement; // Obtener el elemento li correspondiente
		const taskText = li.querySelector('.contacts-list-item-name-input'); // Asegúrate de que el texto de la tarea tenga esta clase

		if (taskText) {
			taskText.classList.toggle('completed'); // Alternar la clase 'completed'
		}
	}
	
	if (editBtn) {
		// 1. Obtener el id
		const li = editBtn.parentElement.parentElement;
		// 2. Obtener ambos inputs
		const contactInputName = li.children[0].children[0];
		const status = li.getAttribute("status");
		isInputTaskValid = true;

		if (status === "disabled-inputs") {
			// 1. Cambiar el status a enabled-inputs
			li.setAttribute("status", "enabled-inputs");
			// 2. Cambiar el icono del btn
			editBtn.innerHTML = ContactsModule.editingIcon;
			// 3. Habilitar los inputs
			contactInputName.removeAttribute("readonly");
			// 4. Agregar clase para el borde
			contactInputName.classList.add("editable-input");
		}

		if (status === "enabled-inputs") {
			isInputTaskValid = NAME_REGEX.test(contactInputName.value);
			renderInputValidationStatus(contactInputName, isInputTaskValid);

			if (!isInputTaskValid ) {
        return;
			}

			// 1. Cambiar el status a disabled-inputs
			//li.setAttribute("status", "disabled-inputs");
			// 2. Cambiar el icono del btn
			//editBtn.innerHTML = ContactsModule.editIcon;
			// 3. Deshabilitar los inputs
			//contactInputName.setAttribute("readonly", true);
			// 4. Actualizar el contacto
			const updatedContact = {
				id: li.id,
				name: contactInputName.value,
			};
			ContactsModule.updateContact(updatedContact);
			// 5. Guardar en el navegador
			ContactsModule.saveContactsInBrowser();
			// 6. Mostrar en el html
			ContactsModule.renderContacts(taskList);
		}
	}
});

window.onload = () => {
	// 1. Obtener la lista de localStorage
	ContactsModule.getContactsFromBrowser();
	// 2. Renderizar los contactos
	ContactsModule.renderContacts(taskList);
};