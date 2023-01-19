var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000

const mercadopago = require("mercadopago");
mercadopago.configure({
	access_token: "APP_USR-8709825494258279-092911-227a84b3ec8d8b30fff364888abeb67a-1160706432",
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
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
    let imgUrl = req.body.img.slice(1)
    let idNumber = Math.floor(1000 + Math.random() * 9000);

	let preference = {
        external_reference: "sorawarcraft@hotmail.com",
		items: [
			{
                id: idNumber,
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(parseInt(req.body.unit)),
                description: "Smartphone",
                picture_url: `https://mpjs.onrender.com${imgUrl}`
			}
		],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_36961754@testuser.com",
            phone: {
                area_code: "11",
                number: 44444444
            },
            identification: {
                type: "DNI",
                number: "40677577"
            },
            address: {
                street_name: "Calle Falsa",
                street_number: 123,
                zip_code: "1414"
            }
        },
		back_urls: {
			"success": "https://mpjs.onrender.com/feedback",
			"failure": "https://mpjs.onrender.com/feedback",
			"pending": "https://mpjs.onrender.com/feedback"
		},
        notification_url: "https://mpjs.onrender.com/feedback",
        auto_return: "approved",
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
        }
	};
    mercadopago.preferences
    .create(preference)
    .then(function (response) {

     res.redirect(response.body.init_point)
    })
    .catch(function (error) {
      console.log(error);
    });
    app.get('/feedback', function (req, res) {
        console.log(req.query)
        res.json({
            Payment: req.query.payment_id,
            Status: req.query.status,
            MerchantOrder: req.query.merchant_order_id
        });
    });
});

app.listen(port);