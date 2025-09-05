
// inbox.blankView

{
	init() {
		this.els = {
			layout: window.find("layout"),
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.blankView,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-blank-view":
				// render blank view
				window.render({
					template: "blank-view",
					match: `//TempThread`,
					target: Self.els.content
				});
				break;
			case "new-mail":
				console.log(event);
				break;
		}
	}
}
