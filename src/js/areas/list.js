
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
			xNode,
			xPath,
			data,
			fId,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "before-menu:list-entry-actions":
				el = (event.el || event.origin.el).parents("?.list-entry");
				el.addClass("menu-active");
				// "move-to" folders
				xFolder = event.xMenu.selectSingleNode(`./Menu[@id="folders"]`);
				// clear old submenu, if any
				xFolder.selectNodes(`./Menu`).map(x => x.parentNode.removeChild(x));
				// populate submenu
				fId = el.parents(`list`).data("fId");
				APP.xData.selectNodes(`//Mailbox/folder[@id!='2005'][@id!='${fId}']`).map(xF => {
					let id = xF.getAttribute("id"),
						name = xF.getAttribute("name"),
						isDisabled = [2004].includes(+id) ? `disabled="1"` : "",
						xMenu = $.nodeFromString(`<Menu name="${name}" click="menu-delete-list-entry" arg="${id}" ${isDisabled}/>`);
					xFolder.appendChild(xMenu);
				});
				// show thread
				xNode = event.xMenu.selectSingleNode(`./Menu[@click="menu-show-thread"]`);
				if (!el.hasClass("active")) xNode.removeAttribute("disabled");
				else xNode.setAttribute("disabled", "1");
				// has attachments
				xNode = event.xMenu.selectSingleNode(`./Menu[@click="menu-show-attachments"]`);
				if (el.find(".icon-attachment").length) xNode.removeAttribute("disabled");
				else xNode.setAttribute("disabled", "1");
				// if already deleted
				xFolder = event.xMenu.selectSingleNode(`./Menu[@click="menu-delete-list-entry"]`);
				if (+fId === 2004) xFolder.setAttribute("disabled", "1"); // sent folder
				if (+fId === 2005) xFolder.setAttribute("disabled", "1"); // deleted folder
				else xFolder.removeAttribute("disabled");
				break;
			case "after-menu:list-entry-actions":
				el = (event.el || event.origin.el).parents("?.list-entry");
				el.removeClass("menu-active");
				break;
			// custom events
			case "menu-delete-list-entry":
				el = (event.el || event.origin.el).parents("?.list-entry");
				xPath = `//mail[@id="${el.data("id")}"]/tags/i[@id="threadId"]`;
				xNode = APP.xData.selectSingleNode(xPath);
				Self.dispatch({
					type: "put-thread-in-folder",
					threadId: xNode.getAttribute("value"),
					fId: +(event.arg || 2005),
					el,
				});
				break;
			case "menu-show-thread":
				el = (event.el || event.origin.el).parents("?.list-entry");
				el.trigger("click");
				break;
			case "menu-show-attachments":
				// TODO
				break;

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
					// clear reference to "active" mail
					delete APP.settings.list.mail;
					// notify content area
					return APP.content.dispatch({ type: "clear-view" });
				}
				if (el.hasClass("active")) return;
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
					// make sure app remembers active mail, for next session
					APP.settings.list.mail = el.data("id");
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
							// temp: START
							// xMail.selectSingleNode(`.//tags`).appendChild($.nodeFromString(`<i id="inReplyTo" value="welcome"/>`));
							// xMail.selectSingleNode(`.//tags`).appendChild($.nodeFromString(`<i id="threadId" value="welcome"/>`));
							// console.log(xMail);
							// temp: END

							data.id = xMail.getAttribute("id");
							data.fId = xMail.getAttribute("fId");
							data.threadId = xMail.selectSingleNode(`.//tags/i[@id="threadId"]`).getAttribute("value");
							data.xMail = xMail;

							// insert new mail node into app ledger
							xFolder = APP.xData.selectSingleNode(`//folder[@id="${data.fId}"]`);
							xFolder.appendChild(xMail);
							// sidebar UI update
							let fEl = APP.sidebar.els.el.find(`.folder-entry[data-fId="${data.fId}"]`);
							if (fEl.length) {
								let unreadEl = fEl.find(".unread");
								if (!unreadEl.length) unreadEl = fEl.append(`<span class="unread">0</span>`);
								let val = +unreadEl.text();
								unreadEl.html(val+1);
							}
						});
						// console.log(data.fId , Self.els.el.parent().data("fId"));
						if (data.fId === Self.els.el.parent().data("fId")) {
							let threadEl = Self.els.el.find(`.list-entry[data-id="${data.threadId}"]`);
							if (threadEl.length) {
								let repliesEl = threadEl.find(".replies");
								if (!repliesEl.length) repliesEl = threadEl.find(".row .subject").after(`<span class="replies">0</span>`);
								let val = +repliesEl.text();
								repliesEl.html(val+1);
							} else {
								// render list view
								let mailEl = window.render({
										template: "list-entry",
										match: `//mail[@id="${data.id}"]`,
										vdom: true,
									}).find(".list-entry").addClass("list-zero");
								// insert enty into list
								mailEl = Self.els.el.prepend(mailEl);
								// appear animation
								setTimeout(() =>
									mailEl.cssSequence("list-appear", "transitionend", el =>
										el.removeClass("list-zero list-appear")));
							}
							// play sound
							window.audio.play("new-mail");
						}
						let activeMail = APP.content.dispatch({ type: "get-active-mail" });
						if (data.threadId === activeMail.threadId) {
							APP.content.dispatch({ type: "new-thread-mail", data });
						}
					});
				break;
			case "put-thread-in-folder":
				data = [];
				data.push({ threadId: event.threadId, fId: event.fId });
				karaqu.shell({ cmd: "mail -u", data })
					.then(async res => {
						let result = await res.result;
						// move xml node
						data.map(mail => {
							let xMail = APP.xData.selectSingleNode(`//mail[@id="${event.el.data("id")}"]`),
								xFolder = APP.xData.selectSingleNode(`//folder[@id="${event.fId}"]`);
							// move mail to folder
							xFolder.appendChild(xMail);
						});
						// DOM animation
						event.el.cssSequence("list-entry-disappear", "transitionend", el => el.remove());
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
			/*
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
				// falls through
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
			*/
		}
	}
}
