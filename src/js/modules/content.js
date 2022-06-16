
// mail.content

{
	init() {
		this.els = {
			el: window.find("content"),
		};
		// temp
		setTimeout(() => this.els.el.find(".entry").get(0).trigger("click"), 100);
		// setTimeout(() => this.els.el.find(".wrapper .icon-thick-messages").trigger("click"), 200);
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.content,
			value,
			pEl,
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
				value = event.el.hasClass("icon-slim-messages")
						? "thick-messages"
						: "slim-messages";
				event.el.prop({ className: "icon-"+ value });

				pEl = Self.els.el.find("> .wrapper");
				if (value === "slim-messages") pEl.addClass("slim-messages");
				else pEl.removeClass("slim-messages");
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
