
// mail.spawn

{
	init() {
		
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.spawn,
			spawn,
			el;
		switch (event.type) {
			case "spawn.open":
				// console.log(event);
				break;
			case "spawn.close":
				window.focus();
				break;
			case "send-mail":
				spawn = event.el.parents("[data-spawn]");
				window.close(spawn);
				break;
			case "toggle-field":
				el = event.spawn.find(`input[name="mail-${event.arg}"]`).parent();
				el.toggleClass("hidden", el.hasClass("hidden"));
				break;
			case "add-attachment":
				console.log(event);
				break;
		}
	}
}
