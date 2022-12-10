
// mail.newMail

{
	init() {
		
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.newMail,
			Spawn = event.spawn,
			data = {},
			el;
		// console.log(event);
		switch (event.type) {
			case "spawn.open":
				break;
			case "spawn.close":
				window.focus();
				break;
			case "send-mail":
				["to", "cc", "bcc", "reply-to", "subject", "message"].map(key => {
					let el = event.spawn.find(`[name="mail-${key}"]`),
						value = key === "message" ? el.html() : el.val();
					data[key] = value;
				});
				// console.log(data);

				// send message via Karaqu
				karaqu.message({ type: "mail-send", data })
					.then(res => {
						console.log(res);
					})
					.catch(e => {
						console.log(e);
					});

				// event.spawn.close();
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
