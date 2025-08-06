
let Test = {
	init(APP) {
		
		// setTimeout(() => {
		// 	window.find(`list .wrapper .entry`).nth(0).trigger("click");
		// }, 500);


		let Spawn = this.spawn || window.open("new-mail");
		setTimeout(() => {
			// Spawn.find(`input[name="mail-to"]`).val("hbi99@hotmail.com");
			Spawn.find(`input[name="mail-subject"]`).val("Writing the subject of the e-mail");
			Spawn.find(`div.mail-message`).html(`Testing this mail <br/><b>with rich</b> text....`);
			Spawn.find(`.toolbar-tool_[data-click="send-mail"]`).trigger("click");
		}, 200);
		
	}
};
