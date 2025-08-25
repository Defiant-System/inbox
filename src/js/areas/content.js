
// inbox.content

{
	init() {
		this.els = {
			el: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.content,
			data,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-temp-thread":
				// render mail content
				window.render({
					template: "content-entries",
					match: `//TempThread/mail[@id="mid-1"]`,
					target: Self.els.el,
				});
				break;
			case "fetch-thread":
				karaqu.shell(`mail -v ${event.id}`).then(async call => {
					let xDoc = await call.result,
						xNew = xDoc.selectSingleNode(`/data/mail[@id="${event.id}"]`),
						xOld = APP.xData.selectSingleNode(`//mail[@id="${event.id}"]`);
					// add mail node to app ledger
					xOld.parentNode.replaceChild(xNew, xOld);
					// render thread
					Self.dispatch({ type: "render-thread", id: event.id });
				});
				break;
			case "render-thread":
				// if folder list not loaded, fetch first
				let xThread = APP.xData.selectSingleNode(`//mail[@id="${event.id}"]`);
				if (!xThread.selectSingleNode(`./html`) && !xThread.selectSingleNode(`./thread`)) {
					return Self.dispatch({ ...event, type: "fetch-thread" });
				}
				let icsFiles = xThread.selectNodes(`./attachments/i[@kind="ics"]`);
				if (icsFiles.length) {
					// already parsed?
					if (icsFiles[0].hasChildNodes()) {
						// render mail
						return Self.dispatch({ type: "render-mail-contents", id: event.id });
					}
					// extract details from ics file
					icsFiles.map(xIcs => {
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
							// render mail
							Self.dispatch({ type: "render-mail-contents", id: event.id });
						});
					});
				} else {
					Self.dispatch({ type: "render-mail-contents", id: event.id });
				}
				break;
			case "clear-view":
				// clear view
				Self.els.el.html("");
				// update toolbar
				APP.toolbar.dispatch({ type: "mail-selected" });
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
				// el = Self.els.el.find("> .wrapper");
				// el.toggleClass("slim-messages", el.hasClass("slim-messages"));
				break;
			case "select-mail":
				el = $(event.target);
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
				data = {
					el,
					id: el.data("id"),
					ids: Self.els.el.find(".mail-entry").map(elem => elem.getAttribute("data-id")),
					messageId: el.data("messageId"),
					listEl: APP.list.els.el.find(".list-entry.active"),
				};
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
		}
	}
}
