const template = document.createElement("template");
template.innerHTML = `
    <div>
        <h1>Tasks</h1>
        <div>Waiting for server data</div>
        <button disabled>New Task</button>
    </div>`

class TaskView extends HTMLElement {
    #tasklist;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#tasklist = this.shadowRoot.querySelector("group5-tasklist");
    }
}

customElements.define('group5-taskview', TaskView);