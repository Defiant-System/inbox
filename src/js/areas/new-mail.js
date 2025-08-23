
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
			val,
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
			case "expand-container":
				// expand container
				event.el.cssSequence("expand-block", "transitionend", el => {
					// reset block
					el.removeClass("expand-block block-collapsed").removeAttr("data-click");
				});
				break;
			case "send-mail":
				// mail recipients
				data.to = Spawn.find(`.recient`).map(el => {
					let name = el.innerHTML,
						address = el.getAttribute("data-mail");
					return { name, address };
				});
				// if input field contains an address
				val = Spawn.find(`input[name="mail-to"]`).val();
				if (!!val) data.to.push({ address: val });
				// email subject
				data.subject = Spawn.find(`input[name="mail-subject"]`).val();
				// email body + clean up
				data.body = Spawn.find(`div.mail-message`).html();
				data.body.replace(/quote_container block-collapsed/g, "quote_container");
				data.body.replace(/data-click=".+?"/g, "");
				// email attachments
				data.attachments = [];
				data.headers = {};
				// if reply to "message-id"
				val = Spawn.find(`input[name="inReplyTo"]`).val();
				if (!!val) {
					data.headers["inReplyTo"] = val;
				}
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
				// console.log(xMail);
				// add recipient(s)
				let xRecipients = xMail.selectNodes(`./from/i`);
				if (!xRecipients.length) {
					xRecipients = xMail.selectNodes(`./thread/mail[@id="${event.activeMail.id}"]/from/i`);
				}
				xRecipients.map(xRcpt => {
					let rcpt = $(`<span class="recient" data-mail="${xRcpt.getAttribute("address")}">${xRcpt.getAttribute("name")}</span>`);
					Spawn.find(`input[name="mail-to"]`).before(rcpt);
				});
				// fill in subject
				Spawn.find(`input[name="mail-subject"]`).val(`RE: ${xMail.selectSingleNode("./subject").textContent}`);
				// fill hidden messageId
				let xMessageId = xMail.selectSingleNode(`./tags/*[@id="messageId"]`);
				if (!xMessageId) xMessageId = xMail.selectSingleNode(`./thread/mail[@id="${event.activeMail.id}"]/tags/*[@id="messageId"]`);
				Spawn.find(`input[name="inReplyTo"]`).val(xMessageId.getAttribute("value"));
				// render mail content
				el = window.render({
						template: "reply-to-mail",
						match: `//mail[@id="${event.activeMail.id}"]`,
						vdom: true,
					});
				// clean up gmail inline styling
				el.find(`.mail-entry .body *[style]`).removeAttr("style");
				// insert previous mail
				Spawn.find(`div.mail-message`).html(el.html());

				setTimeout(() => Spawn.find(`div.mail-message`).focus(), 100);
				break;
		}
	}
}
