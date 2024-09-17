/* -------------------------------------------------------------------------
 * So we need to prefix all CTS css selectors with .cgdpl to support the
 * www redesign using ncids. Since our app manages its css with each
 * component, we can't just create a new entry point. Well, I guess we could
 * and just build the app twice and then do something, but that seems icky.
 * ------------------------------------------------------------------------- */

const path = require('path');
const fs = require('fs');
const appPaths = require('../config/paths');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');

const inputFileName = path.join(appPaths.appBuild, '/static/css/main.css');
const addlCSS = path.join(appPaths.appBuild, 'R4R.css');

const outputFileName = path.join(
	appPaths.appBuild,
	'/static/css/main-legacy.css'
);

try {
	const inputCss = fs.readFileSync(inputFileName, 'utf8') + '\n' + fs.readFileSync(addlCSS, 'utf8');

	const outputCss = postcss()
		.use(
			prefixer({
				prefix: '.cgdpl',
			})
		)
		.process(inputCss).css;

	fs.writeFileSync(outputFileName, outputCss);
} catch (err) {
	console.error(err);
}
