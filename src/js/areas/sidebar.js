
// inbox.sidebar

{
	init() {
		// fast reeferences
		this.els = {
			layout: window.find("layout"),
			el: window.find("sidebar .wrapper"),
		};
		// is first render
		this.isFirst = true;
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.sidebar,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-render":
				// sync UI/toolbar sidebar button
				if (APP.settings.sidebar.show) {
					APP.toolbar.els.btnSidebar.addClass("tool-active_");
					Self.els.layout.addClass("show-sidebar");
				} else {
					APP.toolbar.els.btnSidebar.removeClass("tool-active_");
					Self.els.layout.removeClass("show-sidebar");
				}
				// get mail summary
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
						xItems.map(xMail => xFolder.appendChild(xMail)); // disable to dev-test new mail
					});
					// render tree view
					window.render({
						template: "sidebar-entries",
						match: `//Data/Mailbox`,
						target: Self.els.el
					});
					if (APP.settings.list.mail === "welcome") {
						let xInbox = APP.xData.selectSingleNode(`//Mailbox/folder[@id="2001"]`),
							xWelcome = APP.xData.selectSingleNode(`//Data/mail[@id="welcome"]`),
							now = new karaqu.Moment(APP.settings.firstUsed),
							xNode;
						// adapt mail to user
						xNode = xWelcome.selectSingleNode(`./to/i`);
						xNode.setAttribute("name", `${ME.name}`);
						xNode.setAttribute("address", `${ME.username}`);
						xNode = xWelcome.selectSingleNode(`./thread/mail/to/i`);
						xNode.setAttribute("name", `${ME.name}`);
						xNode.setAttribute("address", `${ME.username}@karaqu.com`);
						// set date
						xNode = xWelcome.selectSingleNode(`./date`);
						xNode.setAttribute("value", now.format("YYYY-MM-DD HH:mm"));
						xNode.setAttribute("date", now.format("YYYY-MM-DD"));
						xNode.setAttribute("time", now.format("HH:mm"));
						// date time stamp on mail node
						xWelcome.setAttribute("date", now.format("YYYY-MM-DD HH:mm"));
						// add welcome mail to inbox / 2001
						xInbox.appendChild(xWelcome);
					}
					if (APP.settings.sidebar.folder) {
						// click on last "active" folder (or inbox)
						APP.sidebar.els.el.find(`.folder-entry[data-fid="${APP.settings.sidebar.folder}"]`).trigger("click");
					}
					// click on last mail, default to "welcome"
					let mEl = APP.list.els.el.find(`.list-entry[data-id="${APP.settings.list.mail}"]`);
					if (mEl.length) mEl.trigger("click");
					// init toolbar
					APP.toolbar.dispatch({ type: "init-view" });
				});
				break;
			case "select-folder":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				// render list view
				APP.list.dispatch({
					type: APP.demoView ? "render-temp-list" : "render-folder",
					fId: el.data("fId"),
					fresh: Self.isFirst,
				});
				// once done
				delete Self.isFirst;
				break;
			case "refresh-active-unread":
				el = Self.els.el.find(`.folder-entry.active`);
				value = APP.xData.selectNodes(`//Mailbox/folder[@id="${el.data("fId")}"]/mail[@is_read="0"]`).length;
				if (value > 0) el.find(`span.unread`).html(value);
				else el.find(`span.unread`).remove();
				break;
		}
	}
}
