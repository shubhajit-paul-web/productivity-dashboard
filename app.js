// Initializes and manages feature window interactions (open, close)
function openFeatures() {
	const featuresElem = document.querySelectorAll(".feature");
	const windowsElem = document.querySelectorAll(".window");
	const widowCloseBtns = document.querySelectorAll(".window-close-btn");

	// Open the corresponding window when a feature is clicked
	featuresElem.forEach(function (feature) {
		feature.addEventListener("click", function (e) {
			const windowId = e.target.dataset.windowid; // Get window ID from data attribute
			const windowElem = document.querySelector(`#${windowId}`); // Find window by ID

			if (windowElem) {
				windowElem.style.display = "block";
			}
		});
	});

	// Close window when the close button is clicked
	widowCloseBtns.forEach(function (btn, index) {
		btn.addEventListener("click", function () {
			windowsElem[index].style.display = "none";
		});
	});
}

openFeatures();

// Handle todo list functionality (add, display, delete, etc.)
function handleTodoList() {
	const STORAGE_KEY = "todo-list-data";

	// Format the date and time
	function formatDateTime(datetime) {
		const date = new Date(datetime);
		return date.toLocaleString("en-US", {
			day: "numeric",
			month: "short",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	}

	const todoForm = document.querySelector(".todo-list-form");
	const todoListItemsContainer = document.querySelector(".todo-list-items");

	// Handle changes to the todo checkbox (checked/unchecked)
	function handleTodoCheckbox() {
		let todoListData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
		let todoCheckboxes = document.querySelectorAll(".todo-check-box");

		if (todoCheckboxes.length) {
			todoCheckboxes.forEach(function (checkbox) {
				checkbox.addEventListener("change", function (e) {
					const todoID = e.target.id.slice(1);
					let todoIndex = todoListData.findIndex((item) => item.id == todoID);

					if (todoIndex !== -1) {
						todoListData[todoIndex].isTodoChecked = e.target.checked;

						localStorage.setItem(STORAGE_KEY, JSON.stringify(todoListData));
						displayData(); // Refresh the displayed data
					}
				});
			});
		}
	}
	handleTodoCheckbox();

	// Display todo data from localStorage
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
                            <button class="edit-btn" ${todoItem.isTodoChecked ? "disabled" : ""} title="${todoItem.isTodoChecked ? "Task completed – editing is disabled." : "Click to edit this task."}"><i class="ri-pencil-line"></i> Edit</button>
		                    <button class="delete-btn"><i class="ri-delete-bin-5-line"></i> Delete</button>
                        </div>
		            </div>
                    <div class="lower">
                        <p>Date and Time: ${formatDateTime(todoItem.datetime)}</p>
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

	// Handle adding a new todo item
	function addTodo() {
		todoForm.addEventListener("submit", function (e) {
			e.preventDefault();

			const {taskName, attachedLink, datetime, taskCategory, impTaskCheckbox} = e.target;

			// Check if all required fields are filled
			if (taskName.value.trim() && taskCategory.value && datetime.value) {
				let todoListData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

				todoListData.push({
					id: Date.now(),
					task: taskName.value.trim(),
					isTodoChecked: false,
					attachedLink: attachedLink.value.trim(),
					datetime: datetime.value,
					category: taskCategory.value,
					isImportant: impTaskCheckbox.checked,
				});

				localStorage.setItem(STORAGE_KEY, JSON.stringify(todoListData));
				displayData(); // Refresh the displayed data
				editTodo(); // Enable edit functionality for the new todo
				deleteTodo(); // Enable delete functionality for the new todo

				// Fireworks animation
				(function () {
					const duration = 3 * 1000,
						animationEnd = Date.now() + duration,
						defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999};

					function randomInRange(min, max) {
						return Math.random() * (max - min) + min;
					}

					const interval = setInterval(function () {
						const timeLeft = animationEnd - Date.now();

						if (timeLeft <= 0) {
							return clearInterval(interval);
						}

						const particleCount = 50 * (timeLeft / duration);

						// since particles fall down, start a bit higher than random
						confetti(
							Object.assign({}, defaults, {
								particleCount,
								origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2},
							})
						);
						confetti(
							Object.assign({}, defaults, {
								particleCount,
								origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2},
							})
						);
					}, 250);
				})();
			}

			// Reset form input fields after adding a todo
			taskName.value = "";
			attachedLink.value = "";
			datetime.value = "";
			taskCategory.value = "";
			impTaskCheckbox.checked = false;
		});
	}
	addTodo();

	// Handle deleting a todo item
	function deleteTodo() {
		todoListItemsContainer.addEventListener("click", function (e) {
			if (e.target.classList.contains("delete-btn")) {
				const todoId = e.target.closest("li").getAttribute("data-id");
				let todoListData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];

				todoListData = todoListData.filter((item) => item.id != todoId);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(todoListData));
				displayData(); // Refresh the displayed data
			}
		});
	}
	deleteTodo();

	// Handle editing a todo item
	function editTodo() {
		todoListItemsContainer.addEventListener("click", function (e) {
			if (e.target.classList.contains("edit-btn")) {
				const addTodoBtn = document.querySelector(".add-todo-btn");
				const doneBtn = document.querySelector(".edit-todo-btn");
				// Get todos data from localstorage and todoID
				let todoData = JSON.parse(localStorage.getItem(STORAGE_KEY));
				let todoID = e.target.closest("li").dataset.id;
				// input fields
				const form = document.querySelector(".todo-list-form");
				const {taskName, attachedLink, datetime, taskCategory, impTaskCheckbox} = form;

				const todoIndex = todoData.findIndex((item) => item.id == todoID);

				if (todoIndex !== -1) {
					let todoItem = todoData[todoIndex];
					taskName.value = todoItem.task;
					attachedLink.value = todoItem.attachedLink;
					datetime.value = todoItem.datetime;
					taskCategory.value = todoItem.category;
					impTaskCheckbox.checked = todoItem.isImportant;

					addTodoBtn.disabled = true;
					doneBtn.style.display = "inline-block";

					doneBtn.addEventListener("click", function () {
						if (taskName.value && taskCategory.value && datetime.value) {
							// set updated values
							todoItem.task = taskName.value;
							todoItem.attachedLink = attachedLink.value;
							todoItem.datetime = datetime.value;
							todoItem.category = taskCategory.value;
							todoItem.isImportant = impTaskCheckbox.checked;

							localStorage.setItem(STORAGE_KEY, JSON.stringify(todoData));
							addTodoBtn.disabled = false;
							doneBtn.style.display = "none";

							// reset todo input-fields values
							taskName.value = "";
							attachedLink.value = "";
							datetime.value = "";
							taskCategory.value = "";
							impTaskCheckbox.checked = "";

							displayData(); // Refresh the displayed data
						}
					});
				}
			}
		});
	}
	editTodo();
}

handleTodoList();

// Handling Daily Planner
function handleDailyPlanner() {
	const plannerContainer = document.querySelector(".daily-planner-container");

	Array.from({length: 18}).forEach(function(_, index) {
		plannerContainer.innerHTML += `
			<div class="daily-planner-time" data-id="#${index}">
				<div class="time">${6 + index}:00 - ${7 + index}:00</div>
				<input placeholder="...." class="planner-input"></input>
			</div>
		`;
	});
}

handleDailyPlanner();

// Handling Motivational Quotes
function handleQuote() {
	const quoteElem = document.querySelector(".quote");
	const authorElem = document.querySelector(".author");

	async function getQuote() {
		const response = await fetch("https://dummyjson.com/quotes/random");
		
		if (response.ok) {
			const quote = await response.json();
	
			quoteElem.textContent = `"${quote.quote}"`;
			authorElem.textContent = `- ${quote.author}`;
		}
	}

	getQuote();
}

handleQuote();
