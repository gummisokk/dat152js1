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

    constructor() {
        super();
        /**
         * Fill inn rest of the code
         */
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		
		this.statuses = [];
		this.changestatusCallback = null;
		this.deletetaskCallback = null;
    }

    /**
     * @public
     * @param {Array} list with all possible task statuses
     */
    setStatuseslist(allstatuses) {
        /**
         * Fill inn the code
         */
		this.statuses = allstatuses;
    }

    /**
     * Add callback to run on change of status of a task, i.e. on change in the SELECT element
     * @public
     * @param {function} callback
     */
    addChangestatusCallback(callback) {
        /**
         * Fill inn the code
         */
		this.changestatusCallback = callback;
    }

    /**
     * Add callback to run on click on delete button of a task
     * @public
     * @param {function} callback
     */
    addDeletetaskCallback(callback) {
        /**
         * Fill inn the code
         */
		this.deletetaskCallback = callback;
    }

    /**
     * Add task at top in list of tasks in the view
     * @public
     * @param {Object} task - Object representing a task
     */
    showTask(task) {
        /**
         * Fill inn the code
         */
		const container = this.shadowRoot.querySelector('#tasklist');
		let table = container.querySelector('table');
		if (!table){
			container.appendChild(tasktable.content.cloneNode(true));
		}
		
		const tbody = this.shadowRoot.querySelector('tbody');
		const clone = taskrow.content.cloneNode(true);
		
		const row = clone.querySelector('tr');
		const cells = row.querySelectorAll('td');
		const select = row.querySelector('select');
		const removeBtn = row.querySelector('button');
		
		row.dataset.id = task.id;
		cells[0].textContent = task.title;
		cells[1].textContent = task.status;
		
		const defaultoption = select.querySelector('option');
		
		this.statuses.forEach(status =>{
			const option = defaultoption.cloneNode(true);
			option.value = status;
			option.textContent = status;
			select.appendChild(option);
		});
		
		select.addEventListener('change', (e) =>{
			const selectedStatus = e.target.value;
			if (selectedStatus !== "0") {
				const confirmed = window.confirm (`set "${task.title}" to "${selectedStatus}"`);
				if (confirmed && this.changestatusCallback){
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
        /**
         * Fill inn the code
         */
		const row = this.shadowRoot.querySelector(`tr[data-id="${task.id}"]`);
		if (row) {
			row.querySelectorAll("td")[1].textContent = task.status;
		}
    }

    /**
     * Remove a task from the view
     * @param {Integer} task - ID of task to remove
     */
    removeTask(id) {
        /**
         * Fill inn the code
         */
		const row = this.shadowRoot.querySelector(`tr[data-id="${id}"]`);
		if (row){
			row.remove();
		}
		if (this.getNumtasks() === 0){
			const container = this.shadowRoot.querySelector("#tasklist");
			container.replaceChildren();
		}
    }

    /**
     * @public
     * @return {Number} - Number of tasks on display in view
     */
    getNumtasks() {
        /**
         * Fill inn the code
         */
		return this.shadowRoot.querySelectorAll("tbody tr").length;
    }
}
customElements.define('group5-tasklist', TaskList);
