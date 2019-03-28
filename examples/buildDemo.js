/* eslint-disable import/unambiguous */
const { getUserAgentRegExps } = require('../lib');

function renderStyles() {
	return `<style>
body {
	font-family:
		/* Safari for OS X and iOS (San Francisco) */
		-apple-system,
		/* Chrome < 56 for OS X (San Francisco) */
		BlinkMacSystemFont,
		/* Windows */
		'Segoe UI',
		/* Android */
		Roboto,
		/* Basic web fallback */
		'Helvetica Neue',
		Arial,
		sans-serif,
		/* Emoji fonts */
		'Apple Color Emoji',
		'Segoe UI Emoji',
		'Segoe UI Symbol';
}

pre {
	font-family:
		SFMono-Regular,
		Menlo,
		Monaco,
		Consolas,
		'Liberation Mono',
		'Courier New',
		monospace;
}

h2 > pre {
	display: inline;
}

h2 > input {
	vertical-align: middle;
}

table {
	width: 100%;
}

th, td {
	text-align: left;
}

</style>`;
}

function renderScript() {
	return `<script>
	function forEach(elements, handler) {

		for (var i = 0, len = elements.length; i < len; i++) {
			handler(elements[i]);
		}
	}

	function findByAttribute(attribute, value) {

		var hasValue = typeof value !== 'undefined';

		if (typeof document.querySelectorAll === 'function') {
			return document.querySelectorAll(
				hasValue
					? '[' + attribute + '=' + value + ']'
					: '[' + attribute + ']'
			);
		}

		var result = [];

		forEach(document.all, function(element) {

			if (!hasValue && element.hasAttribute(attribute)
				|| hasValue && element.getAttribute(attribute) === value
			) {
				result.push(element);
			}
		});

		return result;
	}

	document.getElementById('useragent').innerText = navigator.userAgent;

	forEach(findByAttribute('data-query'), function(input) {

		var queryDiv = input.parentElement;
		var queriesDiv = queryDiv.parentElement;
		var query = input.getAttribute('data-query');
		var some = false;

		forEach(findByAttribute('data-for-query', query), function(input) {

			var li = input.parentElement;
			var ul = li.parentElement;
			var checked = new RegExp(input.getAttribute('data-regexp')).test(navigator.userAgent);

			input.checked = checked;
			some = some || checked;

			if (checked) {
				ul.insertBefore(li, ul.children[0]);
			}
		});

		input.checked = some;

		if (some) {
			queriesDiv.insertBefore(queryDiv, queriesDiv.children[0]);
		}
	});

</script>`;
}

function renderHtml(body) {
	return `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, minimal-ui">
		<meta name="format-detection" content="telephone=no">
		<title>DEMO</title>
		${renderStyles()}
	</head>
	<body>
		${body}
		${renderScript()}
	</body>
</html>`;
}

function renderUserAgentRegExp({
	family,
	sourceRegExpString,
	regExpString,
	resultVersion,
	requestVersionsStrings
}, query) {
	return `<li>
	<input type="checkbox" onclick="return false" readonly data-for-query="${query}" data-regexp="${regExpString.replace(/([^\\])"/g, '$1\\"')}">
	<table>
		<tr>
			<th>Family:</th><td>${family}</td>
		</tr>
		<tr>
			<th>Versions:</th><td>${requestVersionsStrings.join(' ')}</td>
		</tr>
		<tr>
			<th>Source RegExp:</th><td><pre>${sourceRegExpString}</pre></td>
		</tr>
		${!resultVersion ? '' : `
			<tr>
				<th>Source RegExp version:</th><td>${resultVersion.join('.')}</td>
			</tr>
		`}
		${resultVersion ? '' : `
			<tr>
				<th>Versioned RegExp:</th><td><pre>${regExpString}</pre></td>
			</tr>
		`}
	</table>
</li>`;
}

function renderQuery(query) {

	const result = getUserAgentRegExps({
		browsers:            query,
		allowHigherVersions: true,
		allowZeroSubverions: true
	});

	return `<div>
	<h2>
		<input type="checkbox" onclick="return false" readonly data-query="${query}">
		<pre>${query}</pre>
	</h2>
	<ul>
		${result.map(_ => renderUserAgentRegExp(_, query)).join('\n')}
	</ul>
</div>`;
}

function render(queries) {
	return renderHtml(`<h1>browserslist-useragent-regexp demo</h1>
<table>
	<tr>
		<th>UserAgent:</th>
		<td id="useragent"></td>
	<tr>
		<th>Options:</th>
		<td>
			<pre>{
	allowHigherVersions: true,
	allowZeroSubverions: true
}</pre>
		</td>
	</tr>
</table>
<div>
	${queries.map(_ => renderQuery(_)).join('\n')}
</div>`);
}

console.log(render([
	'defaults',
	'dead'
]));