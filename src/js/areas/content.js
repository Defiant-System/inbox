
// mail.content

{
	init() {
		this.els = {
			el: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.content,
			el;
		// console.log(event);
		switch (event.type) {
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
				// extract details from ics file
				xThread.selectNodes(`./attachments/i[@kind="ics"]`).map(xIcs => {
					let xStr = `<data>
									<title><![CDATA[Digitalt möte med Per, Erik och Tobias från Kumpan / Hakan]]></title>
									<date month="dec" date="19" weekday="tors"><![CDATA[tors 2024-12-19 15:00 – 15:45 (CET)]]></date>
									<location><![CDATA[Microsoft Teams Meeting]]></location>
									<attendees>
										<i name="Tobias" mail="tobias@kumpan.se"/>
										<i name="Erik" mail="erik@kumpan.se"/>
										<i name="Per" mail="per@kumpan.se"/>
									</attendees>
								</data>`,
						xDetails = $.xmlFromString(xStr).selectNodes("/data/*");
					// transfer details
					xDetails.map(xNode => xIcs.append(xNode));
				});
				// render mail content
				window.render({
					template: "content-entries",
					match: `//mail[@id="${event.id}"]`,
					target: Self.els.el,
				});
				break;
			case "toggle-message-view":
				el = Self.els.el.find("> .wrapper");
				el.toggleClass("slim-messages", el.hasClass("slim-messages"));
				break;
			case "select-mail":
				el = $(event.target);
				if (el.hasClass("row") || el.hasClass("head")) {
					let entry = el.parents(".mail-entry");
					entry.toggleClass("expanded", entry.hasClass("expanded"));
				}
				if (!el.hasClass("mail-entry")) el = el.parents(".mail-entry");
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
