
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
			case "fetch-thread-":
				karaqu.shell(`mail -v ${event.id}`).then(async call => {
					let xDoc = await call.result,
						xMail = xDoc.selectSingleNode(`/data/i`);
					// add mail node to app ledger
					APP.xData.appendChild(xMail);
					// render thread
					Self.dispatch({ type: "render-thread", id: event.id });
				});
				break;
			case "render-thread-":
				// if folder list not loaded, fetch first
				xThread = APP.xData.selectSingleNode(`//i[@id="${event.id}"]`);
				if (!xThread) return Self.dispatch({ ...event, type: "fetch-thread" });

				// render mail content
				window.render({
					template: "content-entries",
					match: `//i[@id="${event.id}"]`,
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
