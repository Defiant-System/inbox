
// mail.list

{
	init() {
		this.els = {
			el: window.find("list .wrapper"),
			swap: window.find(".ux-swap"),
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
				if (!el.length || el[0] === event.el[0] || !el.data("id")) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				// make sure thread is marked as "read"
				el.removeClass("unread");
				// render mail in content area
				APP.content.dispatch({ type: "render-thread", id: el.data("id") });
				break;

			case "drop-mail-in-folder":
				let data = [];
				data.push({ id: event.el.data("id"), fId: event.target.data("fId") });
				karaqu.shell({ cmd: "mail -u", data })
					.then(res => {
						Self.dragOrigin.cssSequence("list-entry-disappear", "transitionend", el => el.remove());
						// reset drag / drop
						Self.dispatch({ type: "reset-drag-drop" });
					});
				break;

			case "drop-mail-outside":
				/* falls through */
			case "reset-drag-drop":
				// clean up
				Self.els.swap.html("");
				// reset zones
				window.find(`[data-drop-zone-before], [data-drop-zone-after], [data-drop-zone], [drop-outside]`)
					.removeAttr("data-drop-zone-before data-drop-zone-after data-drop-zone data-drop-outside");
				// click element if no drag'n drop
				if (!event.hasMoved && Self.dragOrigin) Self.dragOrigin.trigger("click");
				// reset reference to dragged element
				Self.dragOrigin.removeClass("dragged-mail");
				delete Self.dragOrigin;
				break;

			case "check-mail-drag":
				// tag dragged item
				Self.dragOrigin = event.el.addClass("dragged-mail");
				// tag "drop zones"
				APP.sidebar.els.el.find(".folder-entry")
					.data({
						"drop-zone": "drop-mail-in-folder",
						// "drop-outside": "drop-mail-outside",
					});

				let clone = Self.dragOrigin.clone(true),
					offset = event.el.offset("layout"),
					top = offset.top,
					left = offset.left,
					width = event.el.width(),
					height = event.el.height();

				clone.css({ top, left, height, width });

				return Self.els.swap.append(clone);
		}
	}
}
