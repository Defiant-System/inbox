
// mail.list

{
	init() {
		this.els = {
			el: window.find("list .wrapper"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.list,
			xFolder,
			el;
		// console.log(event);
		switch (event.type) {
			case "fetch-mail-folder":
				karaqu.shell(`mail -l ${event.fId}`).then(async call => {
					let xDoc = await call.result,
						xItems = xDoc.selectNodes("/data/i");

					// remove old nodes to avoid duplicates
					let xOld = APP.xData.selectSingleNode(`//Maillist[@fId="${event.fId}"]`);
					if (xOld) xOld.parentNode.removeChild(xOld);
					// insert new data
					let xNode = $.nodeFromString(`<Maillist fId="${event.fId}"/>`),
						xList = APP.xData.appendChild(xNode);
					xItems.map(xMail => xList.appendChild(xMail));

					// folder received - render list now
					Self.dispatch({ type: "render-folder", fId: event.fId });
				});
				break;
			case "render-folder":
				// if folder list not loaded, fetch first
				xFolder = APP.xData.selectSingleNode(`//Data/Maillist[@fId="${event.fId}"]`);
				if (!xFolder) return Self.dispatch({ ...event, type: "fetch-mail-folder" });
				
				// render list view
				window.render({
					template: "list-entries",
					match: `//Data/Maillist[@fId="${event.fId}"]`,
					target: Self.els.el,
				});
				break;
			case "select-thread":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				// make sure thread is marked as "read"
				el.removeClass("unread");
				// render mail in content area
				APP.content.dispatch({ type: "render-thread", id: el.data("id") });
				break;
		}
	}
}
