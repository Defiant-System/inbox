
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
		console.log(event);
		switch (event.type) {
			case "render-folder":
				// render list view
				window.render({
					template: "list-entries",
					match: `//Data/Maillist[@fId="${event.fId}"]`,
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
				// render mail in content area
				APP.content.dispatch({ type: "show-mail", id: el.data("id") });
				break;
		}
	}
}
