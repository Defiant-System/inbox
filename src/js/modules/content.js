
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
			case "toggle-message-view":
				value = event.el.hasClass("icon-slim-messages")
						? "icon-thick-messages"
						: "icon-slim-messages";
				event.el.prop({ className: value });
				break;
		}
	}
}
