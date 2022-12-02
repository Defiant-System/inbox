
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
			value,
			el;
		switch (event.type) {
			case "render-mail-entries":
				// render tree view
				window.render({
					template: "content-entries",
					match: `//Data/Maillist/thread[position() = ${event.position+1}]`,
					target: Self.els.el
				});
				// auto-select "first" (latest) mail
				Self.els.el.find(".entry:nth(0)").trigger("click");
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
			case "load-mail":
				window
					.fetch("~/sample/voi.eml")
					.then(mail => console.log(mail));
				break;
		}
	}
}
