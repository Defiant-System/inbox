
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
						xItems = xDoc.selectNodes("/data/mail"),
						xFolder = APP.xData.selectSingleNode(`//folder[@id="${event.fId}"]`);

					// remove old nodes to avoid duplicates
					xFolder.selectNodes("./mail").map(xMail => xMail.parentNode.removeChild(xMail));
					// insert new data
					xItems.map(xMail => xFolder.appendChild(xMail));

					// folder received - render list now
					Self.dispatch({ type: "render-folder", fId: event.fId, fresh: true });
				});
				break;
			case "render-folder":
				// if folder list not loaded, fetch first
				if (!event.fresh) return Self.dispatch({ ...event, type: "fetch-mail-folder" });
				// tag "folder ID" as attribute
				Self.els.el.parent().data({ fId: event.fId })
				// render list view
				window.render({
					template: "list-entries",
					match: `//folder[@id="${event.fId}"]`,
					target: Self.els.el,
				});
				// is there any mails in the list
				Self.els.el.parent().toggleClass("has-mails", !Self.els.el.find(".mail-entry").length);
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
			case "check-for-new-mail":
				// temp fake new mail
				let xDoc = $.xmlFromString(`<data>
						<mail id="1754903553431" mStamp="1754863210000" size="307507">
							<from><i name="David Beckham" mail="david@beckham.com"/></from>
							<to><i name="hbi@karaqu.com" mail="hbi@karaqu.com"/></to>
							<tags></tags>
							<attachments></attachments>
							<subject><![CDATA[ This is a fake email ]]></subject>
						</mail>
					</data>`);

				xDoc.selectNodes("/data/i").map(xMail => {
					console.log(xMail);
				});

				break;
			case "permanently-empty-trashcan":
				karaqu.shell("mail -d");
				break;

			case "drop-mail-in-folder":
				let data = [];
				data.push({ id: event.el.data("id"), fId: event.target.data("fId") });
				karaqu.shell({ cmd: "mail -u", data })
					.then(res => {
						// move xml node
						data.map(mail => {
							let xMail = APP.xData.selectSingleNode(`//mail[@id="${mail.id}"]`),
								xFolder = APP.xData.selectSingleNode(`//folder[@id="${mail.fId}"]`);
							// move mail to folder
							xFolder.appendChild(xMail);
						});
						// DOM animation
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
						"drop-outside": "drop-mail-outside",
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
