
// mail.list

{
	init() {
		this.els = {
			el: window.find("list"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.list,
			el;
		switch (event.type) {
			case "select-mail":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
