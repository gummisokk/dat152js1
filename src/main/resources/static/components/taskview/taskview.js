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

    connectedCallback() {
        this.#serviceUrl = this.getAttribute("data-serviceurl");

        const allstatuses = ["WAITING", "ACTIVE", "DONE"];
        const tasks = [
            {
                id: 1,
                title: "Paint roof",
                status: "WAITING",
            },
            {
                id: 2,
                title: "Wash windows",
                status: "ACTIVE",
            },
            {
                id: 3,
                title: "Wash floor",
                status: "DONE",
            },
        ];

        this.#tasklist.setStatuseslist(allstatuses);

        this.#tasklist.addChangestatusCallback((id, newStatus) => {
            console.log(`Change task ${id} to ${newStatus}`);
            this.#tasklist.updateTask({
                id: id,
                status: newStatus,
            });
            this.#updateMessage();
        });

        this.#tasklist.addDeletetaskCallback((id) => {
            console.log(`Delete task ${id}`);
            this.#tasklist.removeTask(id);
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

    //TODO: loadStatuses
    //TODO: loadTasks
    //TODO: createTask
    //TODO: updateTaskStatus
    //TODO: deleteTask
}

customElements.define('group5-taskview', TaskView);