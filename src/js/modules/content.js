
// mail.content

{
	init() {
		this.els = {
			el: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.content,
			value,
			el;
		switch (event.type) {
			case "render-mail-entries":
				// render tree view
				window.render({
					template: "content-entries",
					match: `//Data/Maillist/thread[position() = ${event.position+1}]`,
					target: Self.els.el
				});
				// auto-select "first" (latest) mail
				Self.els.el.find(".entry:nth(0)").trigger("click");
				break;
			case "toggle-message-view":
				el = Self.els.el;
				if (el.hasClass("slim-messages")) el.removeClass("slim-messages");
				else el.addClass("slim-messages");
				break;
			case "select-mail":
				el = $(event.target);
				if (!el.hasClass("entry")) el = el.parents(".entry");
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
			case "load-mail":
				window
					.fetch(event.eml)
					.then(async eml => {
						let parser = new PostalMime(),
							email = await parser.parse(eml),
							to = email.to.find(r => r.address === email.deliveredTo),
							fromMail = email.from.address,
							fromName = email.from.name,
							mailDate = new Date(email.date),
							isoDate = mailDate.toISOString(),
							span = document.createElement("span"),
							b = (span.innerHTML = email.html),
							str = `<thread>
										<mail>
											<from name="${fromName || fromMail}" email="${fromMail}"/>
											<to name="${to.name || to.address}" email="${to.address}"/>
											<date value="${isoDate.slice(0,10)}" time="${isoDate.slice(11,19)}"/>
											<subject><![CDATA[${email.subject}]]></subject>
											<message><![CDATA[${span.innerHTML}]]></message>
										</mail>
									</thread>`,
							data = $.xmlFromString(str);

						// console.log(email);

						window.render({
							data,
							template: "content-entries",
							match: `//thread`,
							target: Self.els.el
						});
					});
				break;
		}
	}
}
