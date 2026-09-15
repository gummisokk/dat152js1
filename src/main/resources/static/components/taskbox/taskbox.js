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
	this.closeBtn =this.shadowRoot.querySelector('.close-btn');
	this.form = this.shadowRoot.querySelector('form');
	this.titleInput = this.shadowRoot.querySelector('title');
	this.statusSelect = this.shadowRoot.querySelector('select');
	
	this.newTaskCallback = null;
	
	this.closeBtn.addEventListener('click', () => this.close());
	
	this.form.addEventListener('submit', (e) =>{
		const title = this.titleInput.value.trim();
		const status = this.statusSelect.value;
		
		if (title && this.newTaskCallback) {
			this.newtaskCallback({title, status});
		}
		this.titleInput = "";
	})
	}
	show() {
		this.dialog.showModal();
	}
	setStatuseslist(list) {
		this.statusSelect.replaceChildren();
		list.forEach(status => {
			const option = document.createElement('option');
			option.value = status;
			option.textContent = value;
			this.statusSelect.appendChild(option);
		});
	}
	addNewtaskCallback(callback){
		this.newTaskCallback = callback;
	}
	close(){
		
	}
}
customElements.define('groupx-taskbox', Taskbox);
