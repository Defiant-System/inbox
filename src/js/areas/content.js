
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
			el;
		// console.log(event);
		switch (event.type) {
			case "fetch-thread":
				karaqu.shell(`mail -v ${event.id}`).then(async call => {
					let xDoc = await call.result,
						xNew = xDoc.selectSingleNode(`/data/i[@id="${event.id}"]`),
						xOld = APP.xData.selectSingleNode(`//i[@id="${event.id}"]`);
					// add mail node to app ledger
					xOld.parentNode.replaceChild(xNew, xOld);
					// render thread
					Self.dispatch({ type: "render-thread", id: event.id });
				});
				break;
			case "render-thread":
				// if folder list not loaded, fetch first
				let xThread = APP.xData.selectSingleNode(`//i[@id="${event.id}"]`);
				if (!xThread.selectSingleNode(`./html`) && !xThread.selectSingleNode(`./thread`)) {
					return Self.dispatch({ ...event, type: "fetch-thread" });
				}
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
				if (el.hasClass("row") || el.hasClass("head")) {
					let entry = el.parents(".mail-entry");
					entry.toggleClass("expanded", entry.hasClass("expanded"));
				}
				if (!el.hasClass("mail-entry")) el = el.parents(".mail-entry");
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
