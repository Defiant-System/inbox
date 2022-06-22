
// mail.newMail

{
	init() {
		
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.newMail,
			data = {},
			el;
		switch (event.type) {
			case "spawn.open":
				// console.log(event);
				break;
			case "spawn.close":
				window.focus();
				break;
			case "send-mail":
				["to", "cc", "bcc", "reply-to", "subject", "from", "message"].map(key => {
					let el = event.spawn.find(`[name="mail-${key}"]`),
						value = key === "message" ? el.html() : el.val();
					data[key] = value;
				});
				return console.log(data);
				window.close(event.spawn);
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
