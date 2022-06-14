
// mail.list

{
	init() {
		this.els = {
			el: window.find("list"),
		};
	},
	async dispatch(event) {
		let APP = mail,
			Self = APP.list,
			el;
		switch (event.type) {
			case "select-mail":
				event.el.find(".active").removeClass("active");
				el = $(event.target).addClass("active");
				break;
		}
	}
}
