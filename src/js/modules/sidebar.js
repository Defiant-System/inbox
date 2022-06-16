
// mail.sidebar

{
	init() {
		this.els = {
			layout: window.find("layout"),
			el: window.find("sidebar .wrapper"),
		};
		// temp
		this.dispatch({ type: "init-render" });
		
		setTimeout(() => this.els.el.find(".list-wrapper:nth(1) .entry:nth(0)").trigger("click"), 100);
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.sidebar,
			el,
			pEl,
			isOn;
		switch (event.type) {
			case "init-render":
				// render tree view
				window.render({
					template: "sidebar-entries",
					match: `//Data/Mailbox`,
					target: Self.els.el
				});
				break;
			case "toggle-sidebar":
				isOn = Self.els.layout.hasClass("show-sidebar");
				Self.els.layout.toggleClass("show-sidebar", isOn);
				return !isOn;
			case "select-account":
				console.log(event);
				break;
			case "select-folder":
				el = $(event.target);
				if (!el.length || el[0] === event.el[0]) return;
				event.el.find(".active").removeClass("active");
				el.addClass("active");
				break;
		}
	}
}
