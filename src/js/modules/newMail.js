
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
				// DEV-ONLY-START
				try { test.spawn = event.spawn; } catch(e) {};
				// DEV-ONLY-END
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

				data.to_mail = [];
				data.to_mail.push({ name: "Hakan Bilgin", address: data.to });

				return console.log(data);
				
				// send message via Karaqu
				karaqu.message({ type: "mail-send", data })
					.then(res => {
						console.log(res);
						// event.spawn.close();
					})
					.catch(e => {
						console.log(e);
					});
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
