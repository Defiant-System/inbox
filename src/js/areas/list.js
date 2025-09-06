
// inbox.list

{
	init() {
		this.els = {
			el: window.find("list .wrapper"),
			swap: window.find(".ux-swap"),
		};
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.list,
			activeMail,
			xFolder,
			data,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-temp-list":
				// render mail content
				window.render({
					template: "list-entries",
					match: `//TempFolder[@fId="${event.fId}"]`,
					target: Self.els.el,
				});
				break;
				
			case "fetch-mail-folder":
				karaqu.shell(`mail -l ${event.fId}`)
					.then(async call => {
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
				if (APP.demoView && event.fId === "2001") {
					return Self.dispatch({ type: "render-temp-list" });
				}
				// if folder list not loaded, fetch first
				if (!event.fresh) return Self.dispatch({ ...event, type: "fetch-mail-folder" });
				// tag "folder ID" as attribute
				Self.els.el.parent().data({ fId: event.fId });
				// render list view
				window.render({
					template: "list-entries",
					match: `//folder[@id="${event.fId}"]`,
					target: Self.els.el,
				});
				// is there any mails in the list
				Self.els.el.parent().toggleClass("has-mails", !Self.els.el.find(".list-entry").length);

				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				if (activeMail.id) {
					let listEntry = Self.els.el.find(`.list-entry[data-id="${activeMail.id}"]`).addClass("active");
					if (!listEntry.length) {
						let found = false;
						activeMail.ids.map(id => {
							if (found) return;
							found = !!Self.els.el.find(`.list-entry[data-id="${id}"]`).addClass("active").length;
						});
					}
				}
				break;
			case "select-thread":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0] || !el.data("id")) {
					Self.els.el.find(".active").removeClass("active");
					return APP.content.dispatch({ type: "clear-view" });
				}
				event.el.find(".active").removeClass("active");
				el.addClass("active");

				// make sure thread is marked as "read"
				el.removeClass("unread");
				// render mail in content area
				if (APP.demoView) {
					APP.content.dispatch({ type: "render-temp-thread", id: el.data("id") });
					// UI list entry active
					let xMail = APP.xData.selectSingleNode(`//TempFolder/mail[@active]`);
					if (xMail) xMail.removeAttribute("active");
					xMail = APP.xData.selectSingleNode(`//TempFolder/mail[@id="${el.data("id")}"]`);
					xMail.setAttribute("active", "1");
				} else {
					APP.content.dispatch({ type: "render-thread", id: el.data("id") });
					// UI list entry active
					let xMail = APP.xData.selectSingleNode(`//Mailbox//mail[@active]`);
					if (xMail) xMail.removeAttribute("active");
					xMail = APP.xData.selectSingleNode(`//Mailbox//mail[@id="${el.data("id")}"]`);
					if (xMail) xMail.setAttribute("active", "1");
				}
				break;
			case "check-for-new-mail":
				// identify "latest" mail ID
				let latestMail = 0;
				APP.xData.selectNodes("//mail[@id]").map(xMail => {
					let id = +xMail.getAttribute("id");
					if (id > latestMail) latestMail = id;
				});
				// request for newer mail
				karaqu.shell(`mail -n ${latestMail}`)
					.then(async call => {
						let xDoc = await call.result,
							data = {};
						
						// loop mail nodes
						xDoc.selectNodes("/data/mail").map(xMail => {
							data.id = xMail.getAttribute("id");
							data.fId = xMail.getAttribute("fId");
							data.xMail = xMail;
							// insert new mail node into app ledger
							xFolder = APP.xData.selectSingleNode(`//folder[@id="${data.fId}"]`);
							xFolder.appendChild(xMail);
						});
						if (data.fId === Self.els.el.parent().data("fId")) {
							// render list view
							let mailEl = window.render({
									template: "list-entry",
									match: `//mail[@id="${data.id}"]`,
									vdom: true,
								}).find(".list-entry").addClass("list-zero");
							// insert enty into list
							mailEl = Self.els.el.prepend(mailEl);
							// play sound
							window.audio.play("new-mail");
							// appear animation
							setTimeout(() =>
								mailEl.cssSequence("list-appear", "transitionend", el =>
									el.removeClass("list-zero list-appear")));
						}
					});
				break;
			case "put-mail-in-folder":
				data = [];
				data.push({ id: event.id, fId: event.fId });
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
						event.el.cssSequence("list-entry-disappear", "transitionend", el => el.remove());
						// reset drag / drop
						Self.dispatch({ type: "reset-drag-drop" });
					});
				break;

			case "permanently-empty-trashcan":
				karaqu.shell("mail -d")
					.then(res => {
						// clear app ledger
						APP.xData.selectNodes(`//folder[@id="2005"]/mail`).map(xMail => xMail.parentNode.removeChild(xMail));
						// reset list view
						Self.els.el.find(".list-entry").remove();
						Self.els.el.parent().removeClass("has-mails");
					});
				break;

			case "drop-mail-in-folder":
				// forward event
				Self.dispatch({
					type: "put-mail-in-folder",
					id: event.el.data("id"),
					fId: event.target.data("fId"),
					el: Self.dragOrigin,
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
				if (Self.dragOrigin) Self.dragOrigin.removeClass("dragged-mail");
				delete Self.dragOrigin;
				break;

			case "check-mail-drag":
				// tag dragged item
				Self.dragOrigin = event.el;
				// tag "drop zones"
				APP.sidebar.els.el.find(".folder-entry")
					.data({
						"drop-zone": "drop-mail-in-folder",
						"drop-outside": "drop-mail-outside",
					});

				let clone = Self.dragOrigin.clone(true).addClass("dragged-mail drag-clone"),
					offset = event.el.offset("layout"),
					top = offset.top,
					left = offset.left,
					width = event.el.width(),
					height = event.el.height();
				// prepare ghost/clone
				clone.removeClass("active").css({ top, left, height, width });
				// return ghost
				return Self.els.swap.append(clone);
		}
	}
}
