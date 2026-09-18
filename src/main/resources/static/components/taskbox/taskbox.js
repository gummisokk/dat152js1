const template = document.createElement("template");
template.innerHTML = `
	<link rel="stylesheet" type="text/css"
		href="${new URL('taskbox.css',import.meta.url)}">
	<dialog>
		<!-- Modal content -->
		<span>&times;</span>
		<div>
			<div>Title:</div>
			<div>
				<input type="text" size="25" maxlength="80" placeholder="Task title" autofocus/>
			</div>
			<div>Status:</div><div><select></select></div>
		</div>
		<p><button type="submit">Add task</button></p>
	</dialog>
`;

class Taskbox extends HTMLElement {
	constructor() {
		super();
		
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.dialog = this.shadowRoot.querySelector('dialog');
        this.closeBtn =this.shadowRoot.querySelector('span');
        this.titleInput = this.shadowRoot.querySelector('input');
        this.statusSelect = this.shadowRoot.querySelector('select');
        this.submitBtn = this.shadowRoot.querySelector('button');

        this.newTaskCallback = null;
		
		this.closeBtn.addEventListener('click', () => this.close());
	
		this.submitBtn.addEventListener('click', () =>{
			let title = this.titleInput.value.trim();
			let status = this.statusSelect.value;
	
			console.log(title + " " + status);
			if (title && this.newTaskCallback) {
				this.newTaskCallback(title, status);
			}
			this.close();
		});
	}
	
	show() {
		this.dialog.showModal();
	}

	setStatuseslist(list) {
		this.statusSelect.replaceChildren();
		list.forEach(status => {
			const option = document.createElement('option');
			option.value = status;
			option.textContent = status;
			this.statusSelect.appendChild(option);
		});
	}

	addNewtaskCallback(callback){
		this.newTaskCallback = callback;
	}

	close() {
	    this.dialog.close();
	}
}
customElements.define('group5-taskbox', Taskbox);
