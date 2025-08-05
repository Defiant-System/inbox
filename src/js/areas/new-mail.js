
// mail.newMail

{
	init() {
		
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.newMail,
			el;
		// console.log(event);
		switch (event.type) {
			case "spawn.open":
				break;
			case "spawn.close":
				window.focus();
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
