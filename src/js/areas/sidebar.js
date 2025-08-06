
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
				karaqu.shell("mail -i").then(async call => {
					let xData = window.bluePrint.selectSingleNode("//Data"),
						xDoc = await call.result;
					xDoc.selectNodes(`/data/i[@id]`).map(xNode => {
						let fId = xNode.getAttribute("id"),
							unread = +xNode.getAttribute("unr"),
							total = +xNode.getAttribute("tot"),
							xItems = xNode.selectNodes("./i"),
							xPath = `//Mailbox/i[@fId="${fId}"]`,
							xFolder = window.bluePrint.selectSingleNode(xPath);
						// transfer values to app blueprint
						xFolder.setAttribute("unread", unread);
						xFolder.setAttribute("total", total);
						// transfer mails into blueprint
						if (xItems.length) {
							// remove old nodes to avoid duplicates
							let xOld = xData.selectSingleNode(`//Maillist[@fId="${fId}"]`);
							if (xOld) xOld.parentNode.removeChild(xOld);
							// insert new data
							let xNode = $.nodeFromString(`<Maillist fId="${fId}"/>`),
								xList = xData.appendChild(xNode);
							xItems.map(xMail => xList.appendChild(xMail));
						}
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
