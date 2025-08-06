
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
			case "toggle-field":
				el = Spawn.find(`input[name="mail-${event.arg}"]`).parents("label");
				el.toggleClass("hidden", el.hasClass("hidden"));
				event.el.toggleClass("isOn", event.el.hasClass("isOn"));
				break;
			case "add-attachment":
				// opens file dialog
				Spawn.dialog.open({ any: file => Self.dispatch({ type: "attache-file-to-mail", file }) });
				break;
			case "attache-file-to-mail":
				console.log(event);
				break;
			case "send-mail":
				// data.to = [{ name: "Hakan Bilgin", mail: "hbi@longscript.com" }];
				data.to = Spawn.find(`.mail-rcpt`).map(el => {
					let name = el.innerHTML,
						mail = el.getAttribute("data-mail");
					return { name, mail };
				});
				data.subject = Spawn.find(`input[name="mail-subject"]`).val();
				data.body = Spawn.find(`div.mail-message`).html();
				data.attachments = [];
				// pass mail envelope to karaqu
				karaqu.shell({ cmd: "mail -s", data });
				break;
		}
	}
}
