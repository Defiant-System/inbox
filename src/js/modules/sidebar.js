
// mail.sidebar

{
	init() {
		this.els = {
			layout: window.find("layout"),
			el: window.find("sidebar"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.sidebar,
			el,
			pEl,
			isOn;
		switch (event.type) {
			case "toggle-sidebar":
				isOn = Self.els.layout.hasClass("show-sidebar");
				Self.els.layout.toggleClass("show-sidebar", isOn);
				return !isOn;
			case "select-folder":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
