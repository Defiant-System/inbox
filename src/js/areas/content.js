
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
			xThread,
			el;
		// console.log(event);
		switch (event.type) {
			case "fetch-thread":
				karaqu.shell(`mail -o ${event.id}`).then(async call => {
					let eml = await call.result,
						parser = new PostalMime(),
						email = await parser.parse(eml),
						date = new karaqu.Moment(email.date),
						// a = console.log( email ),
						xStr = `<data><thread id="${event.id}">
									<mail>
										<from name="${email.from.name}" eemail="${email.from.address}"/>
										<to name="${ME.name}" email="${email.to[0].address}"/>
										<date value="${date.toISOString()}" date="${date.format("YYYY-MM-DD")}" time="${date.format("HH:mm")}"/>
										<subject><![CDATA[${email.subject}]]></subject>
										<html><![CDATA[${email.html}]]></html>
									</mail>
								</thread></data>`;
					// create xml node
					xThread = $.xmlFromString(xStr).selectSingleNode("//thread");
					APP.xData.appendChild(xThread);
					// render thread
					Self.dispatch({ type: "render-thread", id: event.id });
				});
				break;
			case "render-thread":
				// if folder list not loaded, fetch first
				xThread = APP.xData.selectSingleNode(`//thread[@id="${event.id}"]`);
				if (!xThread) return Self.dispatch({ ...event, type: "fetch-thread" });

				// render mail content
				window.render({
					template: "content-entries",
					match: `//thread[@id="${event.id}"]`,
					target: Self.els.el,
				});
				break;
			case "toggle-message-view":
				el = Self.els.el.find("> .wrapper");
				el.toggleClass("slim-messages", el.hasClass("slim-messages"));
				break;
			case "select-mail":
				el = $(event.target);
				if (!el.hasClass("entry")) el = el.parents(".entry");
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
