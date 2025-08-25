
// inbox.sidebar

{
	init() {
		// fast reeferences
		this.els = {
			el: window.find("sidebar .wrapper"),
		};
		// is first render
		this.isFirst = true;
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.sidebar,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-render":
				karaqu.shell("mail -i").then(async call => {
					let xDoc = await call.result;
					xDoc.selectNodes(`/data/folder[@id]`).map(xNode => {
						let fId = xNode.getAttribute("id"),
							unread = +xNode.getAttribute("unr"),
							total = +xNode.getAttribute("tot"),
							xItems = xNode.selectNodes("./mail"),
							xPath = `//folder[@id="${fId}"]`,
							xFolder = APP.xData.selectSingleNode(xPath);
						// transfer values to app blueprint
						xFolder.setAttribute("unread", unread);
						xFolder.setAttribute("total", total);
						// transfer mails into blueprint
						xItems.map(xMail => xFolder.appendChild(xMail));
					});
					// render tree view
					window.render({
						template: "sidebar-entries",
						match: `//Data/Mailbox`,
						target: Self.els.el
					});
					// click on "inbox" (first entry)
					// Self.els.el.find(`.list-wrapper .folder-entry:nth(0)`).trigger("click");
				});
				break;
			case "select-folder":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				// render list view
				APP.list.dispatch({ type: "render-folder", fId: el.data("fId"), fresh: Self.isFirst });
				// once done
				delete Self.isFirst;
				break;
		}
	}
}
