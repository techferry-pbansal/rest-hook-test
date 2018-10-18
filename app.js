const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');

const env = require('./env');

const app = express();

// Setting views folder
app.use(express.static(path.join(__dirname, 'views')));
// Setting view engine
app.set('view engine', 'pug');

// Using Cors Middleware
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));
// parse application/json
app.use(bodyParser.json());


// Routes URLs
// index
app.get('/', (req, res) => {
	res.render('index');
});


// Lead Trigger Event
app.post('/lead-trigger', (req, res) => {
	// Get FS lead.
	fs.readFile("./storage/lse.txt", function(err, leadData){
		if (err) {
			throw err;
		}
		let leadFD = JSON.parse(leadData);

		var post_options = {
			host: 'https://hooks.zapier.com',
			port: '80',
			path: uniquePath,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			}
		};

		request.post(
			leadFD.target_url,
			{ json: { first_name: 'lorem', last_name: 'person' } },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body)
				}
			}
		);

		res.redirect('/');
	});
});

// Contact Trigger Event
app.post('/contact-trigger', (req, res) => {
	// Get FS contact
	fs.readFile("./storage/cse.txt", function(err, contactData){
		if (err) {
			throw err;
		}
	});
	res.redirect('/');
});


// Lead Endpoint
app.post('/lead-subscription-endpoint', (req, res) => {
	fs.writeFile("./storage/lse.txt", JSON.stringify(req.body), function (err) {
		if (err) {
			return res.json({ok: false});
		}
		res.json({ok: true});
	});
});

// Contact Endpoint
app.post('/contact-subscription-endpoint', (req, res) => {
	fs.writeFile("./storage/cse.txt", JSON.stringify(req.body), function (err) {
		if (err) {
			return res.json({ok: false});
		}
		res.json({ok: true});
	});
});

// 404
app.get('*', (req, res) => {
	res.status(404);
	res.send('404');
});

// Listening to port
app.listen(env.port, () => {
	console.log('serving on server:' + env.port);
});