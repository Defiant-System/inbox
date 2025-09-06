
let lorem1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
let lorem2 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

let Test = {
	init(APP) {

		return;

		return setTimeout(() => APP.list.dispatch({ type: "check-for-new-mail" }), 500);

		// setTimeout(() => APP.dispatch({ type: "show-view", arg: "start" }), 500);
		// return setTimeout(() => APP.dispatch({ type: "show-view", arg: "default" }), 2000);

		// return this.runTestData(APP);

		// setTimeout(() => window.find(`sidebar .folder-entry:nth(4)`).trigger("click"), 300);

		
		return setTimeout(() => {
			window.find(`list .wrapper .list-entry`).nth(3).trigger("click");
			// setTimeout(() => APP.toolbar.els.btnReply.trigger("click"), 200);
			// setTimeout(() => APP.content.els.el.find(`.mail-entry:nth(1) .head`).trigger("click"), 200);
		}, 200);
		
		// return setTimeout(() => window.find(`sidebar .folder-entry:nth(4)`).trigger("click"), 300);

		// return setTimeout(() => window.find(`list .list-entry:nth(0)`).trigger("click"), 300);

		// setTimeout(() => {
		// 	let data = [
		// 			{ id: "1754845936080", fId: "2001" },
		// 			{ id: "1754845936079", fId: "2001" },
		// 			{ id: "1754817794379", fId: "2001" },
		// 		];
		// 	// let data = [{ id: "1754845936079", fId: "2001" }];
		// 	karaqu.shell({ cmd: `mail -u`, data })
		// }, 500);

		// setTimeout(() => {
		// 	window.find(`sidebar .folder-entry[data-fid="2005"]`).trigger("click");
		// 	karaqu.shell(`mail -d`);
		// }, 500);

		let Spawn = this.spawn || window.open("new-mail");
		// return;
		setTimeout(() => {
			// Spawn.find(`input[name="mail-to"]`).val("hbi99@hotmail.com");
			Spawn.find(`input[name="mail-to"]`).val("hbi@longscript.com");
			// let rcpt = $(`<div class="mail-rcpt" data-mail="hbi@longscript.com">Hakan Bilgin</div>`);
			// Spawn.find(`input[name="mail-to"]`).before(rcpt);
			Spawn.find(`input[name="mail-subject"]`).val("This is a thread start");
			Spawn.find(`div.mail-message`).html(`This is the thread root.<br/><br/>-H`);
			// Spawn.find(`div.mail-message`).html(`Testing this mail <br/><b>with rich</b> text....<br/><br/>${lorem1}`);
			// Spawn.find(`.toolbar-tool_[data-click="send-mail"]`).trigger("click");
		}, 200);
	},
	runTestData(APP) {
		// if not already parsed
		if (!window.bluePrint.selectNodes(`//TempThread//mail/excerpt`).length) {
			// put lorem ipsum text into test mail body
			window.bluePrint.selectNodes(`//TempThread//mail/html`).map(xHtml => {
				let html = xHtml.textContent;
				let xExcerpt = $.nodeFromString(`<excerpt><![CDATA[${html}]]></excerpt>`);
				xExcerpt = xHtml.parentNode.appendChild(xExcerpt);
				// add random mail content
				let oddEven = Math.random() * 2 | 0 > 0;
				xHtml.textContent = `${html}<br><br/>${oddEven ? lorem1 : lorem2}`;
			});
		}
		APP.list.dispatch({ type: "render-temp-list", fId: 2001 });
		APP.list.els.el.find(`.list-entry`).get(0).trigger("click");

		setTimeout(() => APP.sidebar.els.el.find(`.folder-entry`).get(0).addClass("active"), 300);
	}
};
