
// inbox.content

{
	init() {
		this.els = {
			layout: window.find("layout"),
			el: window.find("content"),
		};
		this.dispatch({ type: "init-view" });
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.content,
			xThread,
			file,
			data,
			isOn,
			done,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "before-menu:mail-actions":
				event.el.parents(".mail-entry").addClass("menu-active");
				break;
			case "after-menu:mail-actions":
				event.el.parents(".mail-entry").removeClass("menu-active");
				break;
			// custom events
			case "init-view":
				if (APP.settings.content.show === "blank-view") {
					setTimeout(() => Self.dispatch({ type: "render-blank-view" }));
				} else {
					// show sidebar + list column
					isOn = APP.settings.list.show;
					Self.els.layout.toggleClass("show-list", !isOn);
					isOn = APP.settings.sidebar.show;
					Self.els.layout.toggleClass("show-sidebar", !isOn);
				}
				break;
			case "render-temp-thread":
				xThread = APP.xData.selectSingleNode(`//TempThread/mail[@id="${event.id}"]`);
				if (!xThread.getAttribute("graph-processed")) {
					Self.dispatch({ ...event, type: "draw-graph" });
					xThread.setAttribute("graph-processed", 1);
				}
				// render mail content
				window.render({
					template: "content-entries",
					match: `//TempThread/mail[@id="${event.id}"]`,
					target: Self.els.el,
				});
				break;
			case "render-blank-view":
				APP.blankView.dispatch({ type: "render-blank-view" });
				break;
			case "draw-graph":
				// pre-parse data
				let xRoot = APP.xData.selectSingleNode(`//TempThread/mail/thread/mail[@id="${event.id}"]`);
				let graph = new Graph(xRoot);
				graph.plot();
				break;
			case "fetch-thread":
				karaqu.shell(`mail -v ${event.id}`).then(async call => {
					let xDoc = await call.result;
					// temp: START
					// let xTmp = xDoc.selectSingleNode(`//thread/mail[@id="1757188853202"]`);
					// xTmp.parentNode.removeChild(xTmp);
					// return console.log(xDoc.xml);
					// temp: END

					let xNew = xDoc.selectSingleNode(`/data/mail[@id="${event.id}"]`),
						xOld = APP.xData.selectSingleNode(`//mail[@id="${event.id}"]`);
					// add mail node to app ledger
					xOld.parentNode.replaceChild(xNew, xOld);

					// render thread
					Self.dispatch({ type: "render-thread", id: event.id });
				});
				break;
			case "render-thread":
				// if folder list not loaded, fetch first
				xThread = APP.xData.selectSingleNode(`//mail[@id="${event.id}"]`);
				if (!xThread.selectSingleNode(`./html`) && !xThread.selectSingleNode(`./thread`)) {
					return Self.dispatch({ ...event, type: "fetch-thread" });
				}
				file = xThread.selectNodes(`./attachments/i[@kind="ics"]`);
				if (file.length) {
					// already parsed?
					if (file[0].hasChildNodes()) {
						// render mail
						return Self.dispatch({ type: "render-mail-contents", id: event.id });
					}
					// parse attached ics files
					done = () => Self.dispatch({ type: "render-mail-contents", id: event.id });
					Self.dispatch({ ...event, type: "parse-ics-attachments", done });
				} else {
					Self.dispatch({ type: "render-mail-contents", id: event.id });
				}
				break;
			case "parse-ics-attachments":
				// parse ics files that has not yet been parsed
				file = APP.xData.selectNodes(`./attachments/i[@kind="ics"][not(@parsed)]`);
				// extract details from ics file
				file.map(xIcs => {
					karaqu.shell(`fs -o '${xIcs.getAttribute("path")}' null`).then(async cmd => {
						let fsHandle = await cmd.result.open({ responseType: "text" });
						let jcalData = ICAL.parse(fsHandle.data);
						let comp = new ICAL.Component(jcalData);
						let vevent = comp.getFirstSubcomponent("vevent");
						let calEvent = new ICAL.Event(vevent);
						let start = new karaqu.Moment(calEvent.startDate.toString());
						let end = new karaqu.Moment(calEvent.endDate.toString());
						// console.log(start);
						let xAttendees = [];
						calEvent.attendees.map(att => {
							let [a, mail] = att.jCal[3].split(":");
							xAttendees.push(`<i mail="${mail}"/>`);
						});
						// prepare details
						let xStr = `<data>
										<title><![CDATA[${calEvent.summary}]]></title>
										<date month="${start.format("MMM")}" date="${start.format("D")}" weekday="${start.format("ddd").toLowerCase()}">
											<![CDATA[${start.format("dddd")} ${start.format("YYYY-MM-DD HH:mm")} &mdash; ${end.format("HH:mm")}]]>
										</date>
										<location><![CDATA[${calEvent.location}]]></location>
										<attendees>${xAttendees.join("")}</attendees>
									</data>`,
							xDetails = $.xmlFromString(xStr).selectNodes("/data/*");
						// transfer details
						xDetails.map(xNode => xIcs.append(xNode));
						// flag this ics file as parsed
						xIcs.setAttribute("parsed", "true");
						// call callback function, if any
						if (event.done) event.done();
					});
				});
				break;
			case "clear-view":
				// clear view
				Self.els.el.html("");
				// update toolbar
				APP.toolbar.dispatch({ type: "mail-selected" });
				break;
			case "new-thread-mail":
				console.log(event);
				break;
			case "render-mail-contents":
				// render mail content
				window.render({
					template: "content-entries",
					match: `//mail[@id="${event.id}"]`,
					target: Self.els.el,
				});
				// clean up gmail inline styling
				Self.els.el.find(`.mail-entry .body .gmail_quote[style]`).removeAttr("style");
				// toggle toolbar buttons
				APP.toolbar.dispatch({ type: "mail-selected" });
				break;
			case "toggle-message-view":
				el = event.el;
				if (el.hasClass("icon-slim-messages")) {
					el.removeClass("icon-slim-messages").addClass("icon-thick-messages");
					// remember expanded
					Self.els.el.find(".mail-entry.expanded").data({ exp: 1 });
					Self.els.el.find(".mail-entry").addClass("expanded");
				} else {
					el.removeClass("icon-thick-messages").addClass("icon-slim-messages");
					Self.els.el.find(".mail-entry").removeClass("expanded");
					Self.els.el.find(`.mail-entry[data-exp]`).addClass("expanded").removeAttr("data-exp");
				}
				break;
			case "select-mail":
				el = $(event.target);
				if (el.parents("?.mail-entry").hasClass("deleted")) return;
				// deactivate current, if any
				Self.els.el.find(".mail-entry.active").removeClass("active");
				// toggles mail expand/collapse mode
				if (el.hasClass("mail-entry") && !el.hasClass("expanded")) el.addClass("expanded");
				if (el.parents(".head").length) el.parents(".mail-entry").removeClass("expanded");
				el.parents("?.mail-entry").addClass("active");
				// toggle toolbar buttons
				APP.toolbar.dispatch({ type: "mail-selected" });
				break;
			case "get-active-mail":
				el = Self.els.el.find(`.mail-entry.active`);
				if (el.id === "welcome") data = { el: [] };
				else {
					data = {
						el,
						id: el.data("id"),
						threadId: el.data("threadId"),
						messageId: el.data("messageId"),
						ids: Self.els.el.find(".mail-entry").map(elem => elem.getAttribute("data-id")),
						listEl: APP.list.els.el.find(".list-entry.active"),
					};
				}
				return data;
			case "add-to-calendar":
				// start calerndar in the background
				karaqu.shell(`win -o calendar`)
					.then(resp => {
						// add ICS filepath to calendar app
						let path = event.el.data("path");
						karaqu.shell(`calendar -a '${path}'`);
					});
				break;
			case "open-attached-folder":
				file = new karaqu.File({ path: event.el.data("path") });
				karaqu.shell(`fs -o ${file.dir}`);
				break;
		}
	}
}
