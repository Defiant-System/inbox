
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
			el;
		switch (event.type) {
			case "show-mail":
				// render mail content
				window.render({
					template: "content-entries",
					match: `//thread[@id="${event.id}"]`,
					target: Self.els.el
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
