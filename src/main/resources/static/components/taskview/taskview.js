import "../tasklist/tasklist.js"
import "../taskbox/taskbox.js";

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${new URL('taskview.css', import.meta.url)}">
    
    <h1>Tasks</h1>
    
    <div>
        <div id="message"><p>Waiting for server data.</p></div>
        
        <div id="newtask">
            <button disabled>New Task</button>
        </div>
        
        <group5-tasklist></group5-tasklist>
        <group5-taskbox></group5-taskbox>
    </div>
`;

class TaskView extends HTMLElement {
    #tasklist;
    #taskbox;
    #message;
    #newTaskButton;
    #serviceUrl;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#tasklist = this.shadowRoot.querySelector("group5-tasklist");
        this.#taskbox = this.shadowRoot.querySelector("group5-taskbox");
        this.#message = this.shadowRoot.querySelector("#message p");
        this.#newTaskButton = this.shadowRoot.querySelector("#newtask button");
        this.#serviceUrl = null;
    }

    async getAllStatuses(){
        const response = await (await fetch("api/allstatuses")).json();
        if (response.responseStatus !== true) {
            throw new Error(`Response status: ${response.responseStatus}`);
        }
        return response.allstatuses;
    }

    async getAllTasks(){
        const response = await (await fetch("api/tasklist")).json();
        if (response.responseStatus !== true) {
            throw new Error(`Response status: ${response.responseStatus}`);
        }
        return response.tasks;
    }

    async connectedCallback() {
        this.#serviceUrl = this.getAttribute("data-serviceurl");

        let allstatuses = await this.getAllStatuses();
        let tasks = await this.getAllTasks();
        
        this.#tasklist.setStatuseslist(allstatuses);
        this.#taskbox.setStatuseslist(allstatuses);

        this.#tasklist.addChangestatusCallback(async (id, newStatus) => {
            const response = await (await fetch(`api/task/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: `{"status": "${newStatus}"}`
            })).json();

            if (response.responseStatus === true) {
                this.#tasklist.updateTask({id: response.id, status: response.status});
            }

            this.#updateMessage();
        });


        this.#tasklist.addDeletetaskCallback(async (id) => {
            const response = await (await fetch(`api/task/${id}`, {
                method: "DELETE"
            })).json();

            if (response.responseStatus === true) {
                this.#tasklist.removeTask(response.id);
            }
            this.#updateMessage();
        });

        this.#taskbox.addNewtaskCallback(async (title, status) => {
            const response = await (await fetch(`api/task`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: `{"title": "${title}", "status": "${status}"}`
            })).json();
            if (response.responseStatus === true){
                this.#tasklist.showTask(response.task);
            }
            this.#updateMessage();
        });

        tasks.forEach((task) => {
            this.#tasklist.showTask(task);
        });

        this.#newTaskButton.disabled = false;
        this.#newTaskButton.addEventListener("click", () => {
            this.#taskbox.show();
        });

        this.#updateMessage();
    }

    #setMessage(text) {
        this.#message.textContent = text;
    }

    #updateMessage() {
        const numTasks = this.#tasklist.getNumtasks();

        if (numTasks === 0) {
            this.#setMessage("No tasks in list.");
            return;
        }

        if (numTasks === 1) {
            this.#setMessage("1 task in list.");
            return;
        }

        this.#setMessage(`${numTasks} tasks in list.`);
    }
}

customElements.define('group5-taskview', TaskView);