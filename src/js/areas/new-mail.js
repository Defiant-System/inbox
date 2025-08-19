
// email.newMail

{
	init() {
		
	},
	dispatch(event) {
		let APP = email,
			Self = APP.newMail,
			Spawn = event.spawn,
			data = {},
			xMail,
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

				// play sound
				window.audio.play("swoosh");
				// pass mail envelope to karaqu
				karaqu.shell({ cmd: "mail -s", data });
				// close spawn window
				Spawn.close();
				break;

			// from parent window
			case "reply-mail":
				xMail = APP.xData.selectSingleNode(`//mail[@id="${event.activeMail.id}"]`);
				// add recipient(s)
				xMail.selectNodes("./to/i").map(xRcpt => {
					let rcpt = $(`<span class="recient" data-mail="${xRcpt.getAttribute("mail")}">${xRcpt.getAttribute("name")}</span>`);
					Spawn.find(`input[name="mail-to"]`).before(rcpt);
				});
				// fill in subject
				Spawn.find(`input[name="mail-subject"]`).val(`RE: ${xMail.selectSingleNode("./subject").textContent}`);
				// fill hidden messageId
				Spawn.find(`input[name="message-id"]`).val(xMail.selectSingleNode(`./tags/*[@id="messageId"]`).getAttribute("value"));
				// render mail content
				el = window.render({
						template: "reply-to-mail",
						match: `//mail[@id="${event.activeMail.id}"]`,
						vdom: true,
					});
				// clean up gmail inline styling
				el.find(`.mail-entry .body *[style]`).removeAttr("style");
				// insert previous mail
				Spawn.find(`div.mail-message`).html(el);

				setTimeout(() => Spawn.find(`div.mail-message`).focus(), 100);
				break;
		}
	}
}
