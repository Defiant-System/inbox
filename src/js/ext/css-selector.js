
let CssSelector = (() => {

	let Sel = {
		constrain(base, str) {
			// Match selectors followed by a block
			let regex = /([^{]+)(\{[^}]*\})/g;
		    let parsed = [];
		    let match;
		    // Loop through all matches in the string
		    while ((match = regex.exec(str)) !== null) {
		        // Split by commas to handle multiple selectors
		        let selectors = match[1].split(",").map(s => `${base} ${s.trim()}`);
		        let rules = match[2];
		        parsed.push(`${selectors.join(",")} ${rules}`);
		    }
			return parsed.join("\n");
		}
	};

	return Sel;

})();

export { CssSelector as default };
