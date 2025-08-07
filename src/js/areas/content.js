
// mail.content

{
	init() {
		this.els = {
			el: window.find("content .wrapper"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.content,
			xThread,
			el;
		// console.log(event);
		switch (event.type) {
			case "fetch-thread":
				karaqu.shell(`mail -o ${event.id}`).then(async call => {
					let eml = await call.result,
						parser = new PostalMime(),
						email = await parser.parse(eml),
						xStr = `<data><thread id="${event.id}">
									<mail>
										<from name="Sto Akron" email="sto.akron@hotmail.com"/>
										<to name="Ben Greene" email="ben.green@gmail.com"/>
										<date value="2022-12-01T12:00:00" date="2022-12-01" time="12:00:00"/>
										<subject><![CDATA[RE: test send]]></subject>
										<html><![CDATA[${lorem1}]]></html>
									</mail>
									<mail>
										<from name="Ben Greene" email="ben.green@gmail.com"/>
										<to name="Sto Akron" email="sto.akron@hotmail.com"/>
										<date value="2022-12-01T12:00:00" date="2022-12-01" time="12:00:00"/>
										<html><![CDATA[${lorem2}]]></html>
									</mail>
								</thread></data>`;
					// create xml node
					xThread = $.xmlFromString(xStr).selectSingleNode("//thread");
					APP.xData.appendChild(xThread);
					// render thread
					Self.dispatch({ type: "render-thread", id: event.id });
				});
				break;
			case "render-thread":
				// if folder list not loaded, fetch first
				xThread = APP.xData.selectSingleNode(`//thread[@id="${event.id}"]`);
				if (!xThread) return Self.dispatch({ ...event, type: "fetch-thread" });

				// render mail content
				window.render({
					template: "content-entries",
					match: `//thread[@id="${event.id}"]`,
					target: Self.els.el,
				});
				break;
			case "toggle-message-view":
				el = Self.els.el;
				if (el.hasClass("slim-messages")) el.removeClass("slim-messages");
				else el.addClass("slim-messages");
				break;
			case "select-mail":
				el = $(event.target);
				if (!el.hasClass("entry")) el = el.parents(".entry");
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
