
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
		// console.log(event);
		switch (event.type) {
			case "render-folder":
				// render list view
				window.render({
					template: "list-entries",
					match: `//Data/Maillist[@fId="${event.fId}"]`,
					target: Self.els.el,
				});
				break;
		}
	}
}
