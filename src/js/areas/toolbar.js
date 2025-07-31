
// mail.toolbar

{
	init() {
		this.els = {
			el: window.find("toolbar .wrapper"),
		};
	},
	dispatch(event) {
		let APP = mail,
			Self = APP.toolbar,
			el;
		switch (event.type) {
			case "some-event":
				break;
		}
	}
}
