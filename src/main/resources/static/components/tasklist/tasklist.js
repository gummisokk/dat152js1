const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${new URL('tasklist.css',import.meta.url)}">

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select>
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {
	#shadowRoot;

    constructor() {
        super();
		this.#shadowRoot = this.attachShadow({mode: 'closed'});
		this.#shadowRoot.appendChild(template.content.cloneNode(true));
		
		this.statuses = [];
		this.changestatusCallback = null;
		this.deletetaskCallback = null;
    }

    /**
     * @public
     * @param {Array} list with all possible task statuses
     */
    setStatuseslist(allstatuses) {
		this.statuses = allstatuses;
    }

    /**
     * Add callback to run on change of status of a task, i.e. on change in the SELECT element
     * @public
     * @param {function} callback
     */
    addChangestatusCallback(callback) {
		this.changestatusCallback = callback;
    }

    /**
     * Add callback to run on click on delete button of a task
     * @public
     * @param {function} callback
     */
    addDeletetaskCallback(callback) {
		this.deletetaskCallback = callback;
    }

    /**
     * Add task at top in list of tasks in the view
     * @public
     * @param {Object} task - Object representing a task
     */
    showTask(task) {
		const container = this.#shadowRoot.querySelector('#tasklist');
		let table = container.querySelector('table');
		if (table === null){
			container.appendChild(tasktable.content.cloneNode(true));
			table = container.querySelector('table');
		}
		
		const tbody = table.tBodies[0];
		const clone = taskrow.content.cloneNode(true);
		
		const row = clone.querySelector('tr');
		const cells = row.cells;
		const select = row.querySelector('select')
		const removeBtn = row.querySelector('button');
		
		row.dataset.id = task.id;
		cells[0].textContent = task.title;
		cells[1].textContent = task.status;
		
		const defaultoption = select.querySelector('option');
		
		this.statuses.forEach(status =>{
			const option = defaultoption.cloneNode(true);
			option.selected = false;
			option.value = status;
			option.textContent = status;
			select.appendChild(option);
		});
		
		select.addEventListener('change', (e) =>{
			const selectedStatus = e.target.value;
			if (selectedStatus !== "0") {
				const confirmed = window.confirm (`set "${task.title}" to "${selectedStatus}"`);
				if (confirmed === true && this.changestatusCallback !== null){
					this.changestatusCallback(task.id, selectedStatus);
				}
			}
			select.selectedIndex = 0;
		});
		
		removeBtn.addEventListener('click', () =>{
			const confirmed = window.confirm(`delete task "${task.title}"`);
			if (confirmed && this.deletetaskCallback){
				this.deletetaskCallback(task.id);
			}
		});
		tbody.prepend(clone);
    }

    /**
     * Update the status of a task in the view
     * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
     */
    updateTask(task) {
		const row = this.#shadowRoot.querySelector(`tr[data-id="${task.id}"]`);
		if (row !== null) {
			row.cells[1].textContent = task.status;
		}
    }

    /**
     * Remove a task from the view
     * @param {Integer} task - ID of task to remove
     */
    removeTask(id) {
		const row = this.#shadowRoot.querySelector(`tr[data-id="${id}"]`);
		if (row !== null){
			row.remove();
		}
		if (this.getNumTasks() === 0) {
			const container = this.#shadowRoot.querySelector("#tasklist");
			container.replaceChildren();
		}
    }

    /**
     * @public
     * @return {Number} - Number of tasks on display in view
     */
    getNumtasks(){
		const table = this.#shadowRoot.querySelector("#tasklist table")
		if (table !== null && table.tBodies.length > 0) {
			return table.tBodies[0].rows.length;
		}
	}
}
customElements.define('group5-tasklist', TaskList);
