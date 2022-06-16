
// mail.list

{
	init() {
		this.els = {
			el: window.find("list .wrapper"),
		};
		// temp
		this.dispatch({ type: "init-render" });

		setTimeout(() => this.els.el.find(".entry:nth(0)").trigger("click"), 100);
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
					target: Self.els.el
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
					type: "render-mail-entries",
					position: el.index(),
				});
				break;
		}
	}
}
