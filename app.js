var request = require('request'),
	cheerio = require('cheerio'),
	async = require('async'),
	_ = require('underscore'),

	os = require('os'),
	path = require('path'),
	url = require('url'),

	alreadyCrawled = [];

function requestPage(url, callback) {
	request.get({
		url: url
	}, callback);
}

function isSameDomain(domain, path) {
	path = url.parse(path);
	domain = url.parse(domain);

	return path.hostname === null || (path.hostname === domain.hostname);
}

function _crawl(args, callback) {
	if(typeof args.level === 'undefined') {
		args.level = 1;
	}

	if(alreadyCrawled.indexOf(args.url) > -1) {
		return callback();
	}

	args.debug && console.log(args.url + ' (' + args.level + ')');

	setTimeout(function() {
		requestPage(args.url, function(err, res, body) {
			if(err) {
				throw err;
			}

			var $ = cheerio.load(body),
				results = args.extract($, args.url),
				links = [];

			if(results.length && args.onResult) {
				args.onResult(results);
			}

			alreadyCrawled.push(args.url);

			if(args.level >= args.maxlevel) {
				return callback();
			}

			$('a').each(function() {
				var href = $(this).attr('href'),
					link = url.resolve(args.url, href).replace(/#.*$/, '');

				if(args.sameDomain && !isSameDomain(args.url, href)) {
					return;
				}

				if(args.shouldFollow(link)) {
					links.indexOf(link) === -1 && links.push(link);
				}
			});

			async.eachSeries(links, function(link, cb) {
				var _args = _.extend({}, args);

				_crawl(_.extend(_args, {
					url: link,
					level: args.shouldResetLevel(link) ? 1 : _args.level + 1
				}), cb);
			}, callback);
		});
	}, args.delay);
}

function crawl(args, callback) {
	if(!args.url) {
		return callback(new Error('You must provide an url to start crawling'));
	}

	if(!args.extract) {
		return callback(new Error('You must provide an extract function to start crawling'));
	}

	args = _.extend({
		sameDomain: true,
		debug: false,
		maxlevel: 2,
		delay: 1000,
		onResult: function(results) {
			results.forEach(function(result) {
				process.stdout.write(result + os.EOL);
			});
		},
		shouldResetLevel: function() {
			return false;
		},
		shouldFollow: function() {
			return true;
		}
	}, args);

	if(args.debug) {
		console.log('Crawling with defaults:\n');
		console.log(JSON.stringify(args, null, 4));
	}

	_crawl(args, callback);
}

module.exports = crawl;