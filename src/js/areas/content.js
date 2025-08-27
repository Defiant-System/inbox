
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
			xThread,
			data,
			el;
		// console.log(event);
		switch (event.type) {
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
			case "draw-graph":
				let debug = false;
				// helper functions
				let xHelpers = {
						recursive(xMail, branch=2) {
							let msgId = xMail.selectSingleNode(`./tags/i[@id="messageId"]`).getAttribute("value");
							let xReplied = xMail.selectNodes(`../mail/tags/i[@id="inReplyTo"][@value="${msgId}"]`);
							// loop leafs / branches
							for (let i=0, il=xReplied.length; i<il; i++) {
								let names = [`l${branch+i}`];
								for (let j=0, jl=branch-2; j<jl; j++) {
									names.unshift(`l${branch+j-1}`);
								}
								names = names.join(" ").trim();
								// tags branch of split
								this.addClass(xMail, names);
								// iterates childnodes
								let xParent = xReplied[i].parentNode.parentNode;
								this.addClass(xParent, names);
								this.recursive(xParent, branch+i);
							}
						},
						addClass(node, name) {
							let names = (node.getAttribute("class") || "").split(" ");
							// names.push(name);
							names = names.concat(name.split(" ")).sort((a,b) => a.localeCompare(b));
							names = [...new Set(names.filter(e => !!e))]; // clean up + remove duplicates
							node.setAttribute("class", names.join(" ").trim());
						}
					};
				// sort nodes on date
				let xList = APP.xData.selectNodes(`//TempThread/mail[@id="${event.id}"]/thread/mail`)
						.sort((a,b) => {
							let aDate = a.selectSingleNode("./date").getAttribute("value"),
								bDate = b.selectSingleNode("./date").getAttribute("value");
							return bDate.localeCompare(aDate);
						});
				// this actualy change node order index
				xList.map((x,i) => x.parentNode.insertBefore(x, x.parentNode.childNodes[i]));

				// pre-parse data
				let xRoot = APP.xData.selectSingleNode(`//TempThread/mail/thread/mail[@id="${event.id}"]`);
				// debug flag
				xRoot.parentNode.parentNode.setAttribute("debug", debug);
				console.log( xRoot.parentNode.parentNode );
				// recusively structure mail graph
				xHelpers.recursive(xRoot);

				// prepare lane tracks
				let tracks = {};
				xList.map(x => (x.getAttribute("class") || "").split(" ").map(l => tracks[l] = 0));
				
				// value used for UI indentation
				xRoot.parentNode.setAttribute("lanes", Object.keys(tracks).length+1);

				// iterate nodes and their lane names
				for (let i=0, il=xList.length; i<il; i++) {
					let cNode = xList[i],
						cLanes = (cNode.getAttribute("class") || "").split(" "),
						nNode = xList[i+1],
						nLanes = (nNode ? nNode.getAttribute("class") || "" :  "").split(" ");
					// translate lane names
					cLanes = cLanes.map((l,i) => {
						let ret = l;
						switch (true) {
							case (!!tracks[l] && !nLanes.includes(l)):
								ret = `${l}-up`;
								tracks[l] = 0;
								break;
							case (tracks[l] && nLanes.includes(l) && i<cLanes.length-1):
								ret = `${l}-track`;
								break;
							case (tracks[l] && nLanes.includes(l)):
								ret = `${l}-conn`;
								break;
							case (!tracks[l]):
								ret = `${l}-down`;
								tracks[l] = 1;
								break;
						}
						return ret;
					});
					// set lane names back on the node
					if (!debug) cNode.setAttribute("class", cLanes.join(" ").trim());
				}
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
				xThread = APP.xData.selectSingleNode(`//mail[@id="${event.id}"]`);
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
