
// mail.sidebar

{
	init() {
		this.els = {
			el: window.find("sidebar .wrapper"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.sidebar,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-render":
				window.fetch("/mail/").then(mail => {
					mail.selectNodes("//*[@id]").map(xFolder => {
						let xPath = `//Mailbox/i[@fId="${xFolder.getAttribute("id")}"]`,
							xBoxFolder = window.bluePrint.selectSingleNode(xPath),
							unr = +xFolder.getAttribute("unr");
						if (unr) xBoxFolder.setAttribute("unread", unr);
					});
					// render tree view
					window.render({
						template: "sidebar-entries",
						match: `//Data/Mailbox`,
						target: Self.els.el
					});
					// click on "inbox" (first entry)
					Self.els.el.find(`.list-wrapper .entry:nth(0)`).trigger("click");
				});
				break;
			case "select-folder":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				// render list view
				APP.list.dispatch({ type: "render-folder", fId: el.data("fId") });
				break;
		}
	}
}
