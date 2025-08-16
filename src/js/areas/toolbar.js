
// mail.toolbar

{
	init() {
		this.els = {
			el: window.find("toolbar .wrapper"),
			layout: window.find("layout"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.toolbar,
			isOn,
			el;
		switch (event.type) {
			case "toggle-sidebar":
				isOn = Self.els.layout.hasClass("show-sidebar");
				Self.els.layout.toggleClass("show-sidebar", isOn);
				return !isOn;
			case "send-receive":
				APP.list.dispatch({ type: "check-for-new-mail" });
				break;
			case "new-mail":
				window.open("new-mail");
				break;
		}
	}
}
