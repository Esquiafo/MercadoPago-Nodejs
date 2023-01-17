var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
const cors = require("cors");
const open = require('open')
const mercadopago = require("mercadopago");
mercadopago.configure({
	access_token: "APP_USR-8709825494258279-092911-227a84b3ec8d8b30fff364888abeb67a-1160706432",
});
var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
app.use(express.urlencoded({extended: true}))
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post("/create_preference", (req, res) => {
    let idNumber = Math.floor(1000 + Math.random() * 9000);
	let preference = {
		items: [
			{
                id: idNumber,
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(parseInt(req.body.unit)),
                description: "Smartphone"
			}
		],
        payer: {
            name: "Lola",
            surname: "Landa",
            email: "test_user_36961754@testuser.com",
            phone: {
                area_code: "11",
                number: 44444444
            },
            identification: {
                type: "DNI",
                number: "12345678"
            },
            address: {
                street_name: "calle falsa",
                street_number: 123,
                zip_code: "1414"
            }
        },
		back_urls: {
			"success": "http://localhost:8080/good",
			"failure": "http://localhost:8080/bad",
			"pending": "http://localhost:8080/pending"
		},
        
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "visa"
                }
            ],
            excluded_payment_types: [
                {
                    id: "ticket"
                }
            ],
            installments: 6
        },
		auto_return: "approved",
	};
    (async () => {

     
        // Opens the URL in the default browser.
       
     
    })();
    mercadopago.preferences
    .create(preference)
    .then(function (response) {
     console.log(response)
     res.redirect(response.body.init_point)
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.listen(port);