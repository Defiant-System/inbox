
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
				Spawn.dialog.open({
					any: item => console.log(item),
				});
				break;
			case "send-mail":
				data.to = [{ name: "Hakan Bilgin", mail: "hbi@longscript.com" }];
				data.subject = "Testing";
				data.body = "This is mail body";
				// pass mail object to system
				karaqu.shell({ cmd: "mail -s", data });
				break;
		}
	}
}
