
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
			el;
		switch (event.type) {
			case "init-render":
				// render tree view
				window.render({
					template: "list-entries",
					match: `//Data/Maillist`,
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

				APP.content.dispatch({
					type: "render-mail-thread",
					eml: el.data("eml"),
				});
				break;
			case "prepend-mail":
				let xParent = window.bluePrint.selectSingleNode(`//Maillist`),
					xNode = $.nodeFromString(`<thread unread="1">
								<mail>
									<from name="Sonny Fazio" email="sony.fazio@gmail.com"/>
									<to name="Sto Akron" email="sto.akron@hotmail.com"/>
									<date value="2022-05-21"/>
									<subject><![CDATA[Upcoming Newsletter Feature Image]]></subject>
									<message><![CDATA[Lorem Ipsum...]]></message>
								</mail>
							</thread>`);
				// prepend node
				xParent.insertBefore(xNode, xParent.firstChild);
				// render new list mail
				el = window.render({
					template: "list-entry",
					match: `//Data/Maillist/*[1]`,
					prepend: Self.els.el,
				}).addClass("hidden");
				
				// prepend with animation
				setTimeout(() =>
					el.cssSequence("prepend-anim", "transitionend", entry =>
						entry.removeClass("prepend-anim hidden")), 1);
				break;
		}
	}
}
