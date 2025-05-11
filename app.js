function openFeatures() {
	const featuresElem = document.querySelectorAll(".feature");
	const windowsElem = document.querySelectorAll(".window");
	const widowCloseBtns = document.querySelectorAll(".window-close-btn");

	featuresElem.forEach(function (feature) {
		feature.addEventListener("click", function (e) {
			windowsElem[e.target.id].style.display = "block";
		});
	});

	widowCloseBtns.forEach(function (btn, index) {
		btn.addEventListener("click", function () {
			windowsElem[index].style.display = "none";
		});
	});
}

openFeatures();

// ! Handle todo list
function handleTodoList() {
	const STORAGE_KEY = "todo-list-data";

	// Format the date and time
	function formatDateTime(datetime) {
		const date = new Date(datetime);

		const formatted = date.toLocaleString("en-US", {
			day: "numeric",
			month: "short",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});

		return formatted;
	}

	const todoForm = document.querySelector(".todo-list-form");
	const todoListItemsContainer = document.querySelector(".todo-list-items");

	// Handle todo checked
	function handleTodoCheckbox() {
		let todoListData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
		let todoCheckboxes = document.querySelectorAll(".todo-check-box");

		todoCheckboxes.forEach(function (checkbox) {
			checkbox.addEventListener("change", function (e) {
				const todoID = e.target.id.slice(1);
				let todoIndex = todoListData.findIndex((item) => item.id == todoID);

				todoListData[todoIndex].isTodoChecked = e.target.checked;

				localStorage.setItem(STORAGE_KEY, JSON.stringify(todoListData));
				displayData();
			});
		});
	}
	handleTodoCheckbox();

	// Load todo data
	function displayData() {
		let todoData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

		if (todoData.length) {
			todoListItemsContainer.innerHTML = "";

			todoData.reverse().forEach(function (todoItem) {
				const li = document.createElement("li");
				li.setAttribute("data-id", todoItem.id);
				if (todoItem.isTodoChecked) li.classList.add("todo-checked");

				li.innerHTML += `
			        <div class="upper">
                        <div class="todo-details">
                            <input type="checkbox" name="todoCheckbox" class="todo-check-box" id="#${todoItem.id}" 
							${todoItem.isTodoChecked ? "checked" : ""} />
                            <label for="#${todoItem.id}">
                                <span>${todoItem.task}</span>
                                ${todoItem.isImportant ? '<sup class="imp-text">imp</sup>' : ""}
                            </label>
                        </div>
				        <div class="todo-btns">
							${todoItem.attachedLink ? `<a href="${todoItem.attachedLink}" target="_blank" title="Attached link"><i class="ri-links-fill"></i></a>` : ""}
                            <button class="edit-btn" ${todoItem.isTodoChecked ? "disabled" : ""} title="${todoItem.isTodoChecked ? 'Task completed – editing is disabled.' : 'Click to edit this task.'}"><i class="ri-pencil-line"></i> Edit</button>
		                    <button class="delete-btn"><i class="ri-delete-bin-5-line"></i> Delete</button>
                        </div>
		            </div>
                    <div class="lower">
                        <p>Date and Time: ${todoItem.datetime}</p>
                        <p>Category: ${todoItem.category}</p>
                    </div>	
                `;
				todoListItemsContainer.appendChild(li);
			});
		} else {
			todoListItemsContainer.innerHTML = `<div class="todo-empty-msg">You have no tasks at the moment. Add a new task to get started.</div>`;
		}
		handleTodoCheckbox();
	}

	displayData();

	// TODO: Add todo
	function addTodo() {
		todoForm.addEventListener("submit", function (e) {
			e.preventDefault();

			// All todo list data
			let todoListData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

			let taskNameInput = e.target.taskName;
			let attachedLinkInput = e.target.attachedLink;
			let datetimeInput = e.target.datetime;
			let taskCategoryInput = e.target.taskCategory;
			let impTaskCheckbox = e.target.impTaskCheckbox;

			if (taskNameInput.value.trim() && taskCategoryInput.value && datetimeInput.value) {
				todoListData.push({
					id: Date.now(),
					task: taskNameInput.value.trim(),
					isTodoChecked: false,
					attachedLink: attachedLinkInput.value.trim(),
					datetime: formatDateTime(datetimeInput.value),
					category: taskCategoryInput.value,
					isImportant: impTaskCheckbox.checked,
				});

				localStorage.setItem(STORAGE_KEY, JSON.stringify(todoListData));
				displayData();
				deleteTodo();
			}

			// Reset all input fields values
			taskNameInput.value = "";
			attachedLinkInput.value = "";
			datetimeInput.value = "";
			taskCategoryInput.value = "";
			impTaskCheckbox.checked = false;
		});
	}
	addTodo();

	// Delete todo
	function deleteTodo() {
		// All todo list data
		let todoListData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

		if (todoListData.length) {
			todoListItemsContainer.addEventListener("click", function (e) {
				if (e.target.classList.contains("delete-btn")) {
					const todoId = e.target.closest("li").getAttribute("data-id");

					let todoListData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

					todoListData = todoListData.filter((item) => item.id != todoId);

					localStorage.setItem(STORAGE_KEY, JSON.stringify(todoListData));
					displayData();
				}
			});
		}
	}
	deleteTodo();
}

handleTodoList();
