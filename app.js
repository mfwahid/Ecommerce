const express = require('express');
const mysql = require('mysql');
const ssmps = require('./modules/secrets');
const app = express();

app.set('view engine', 'ejs');
app.set('views', '/home/ec2-user/mygit/ecommerce-demo/views');
app.use(express.static('/home/ec2-user/mygit/ecommerce-demo/public'));


//app.set('views', '/Users/bdwahee/Waheed/Works/POC/Github/Octank/Ecommerce/views');
//app.use(express.static('/Users/bdwahee/Waheed/Works/POC/Github/Octank/Ecommerce/public'));

var connectionString, user, password;
var connection;
(async () =>  {
    try {
         connectionString = await ssmps.getSecret('octankDBWriter','prod');
         database = await ssmps.getSecret('octankDataBase','prod');
         user = await ssmps.getSecret('octankDbUser','prod');
         password = await ssmps.getSecret('octankDbPassword','prod');
         console.log(connectionString,database,user,password);

		  connection = mysql.createConnection({
			host: connectionString,
			user: user,
			password: password,
			database: database,
		});

		connection.connect(function (error) {

			if (!!error) {
				console.log('Error');
			} else {
				console.log('Connected');
			}
		});
    }
    catch (ex) {
        console.error(ex.message);
    }
})();




app.get('/index.html', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
 })

// app.get('/insert_item', function (request, response) {
// 	result = {
// 	    item_name: request.query.item_name,
// 	    item_price: request.query.item_price,
// 	    item_quantity: request.query.item_quantity
// 	}
// 	queryString = `INSERT INTO items (item_name,item_price,item_quantity)
// 				   VALUES ( '${request.query.item_name}',
// 							'${request.query.item_price}',
// 							'${request.query.item_quantity}')`;
// 	connection.query(queryString, function(error, result) {
// 	    if (!!error) {
// 	        console.log('Error in the query');
// 	        response.send('Error in the query');
// 	    }
// 	});

// 	console.log(result);
// 	// response.end(JSON.stringify(result));
// 	// alert('hello')
// 	response.send('Successfuly added new item');
// 	response.redirect("http://127.0.0.1:3000/admin.html");
// });



app.get('/insert_items', function (request, response) {
	result = {
	    item_name: request.query.item_name,
	    item_price: request.query.item_price,
	    item_quantity: request.query.item_quantity
	}
	response.render('insert_items', { page_title: "Insert Item", data: result });

});




app.get('/insert_item', function (request, response) {
	result = {
	    item_name: request.query.item_name,
	    item_price: request.query.item_price,
	    item_quantity: request.query.item_quantity
	}
	queryString = `INSERT INTO items (item_name,item_price,item_quantity)
				   VALUES ( '${request.query.item_name}',
							'${request.query.item_price}',
							'${request.query.item_quantity}')`;
	connection.query(queryString, function(error, result) {
	    if (!!error) {
	        console.log('Error in the query');
	        response.send('Error in the query');
	    }
	});

	console.log(result);
	// response.end(JSON.stringify(result));
	response.type('.html');
	// response.end('Successfuly added new item' <script>
	response.end("<h1>Successfuly added new item<h1><script> setTimeout(function() { window.location.href = \"/admin.html\";}, 500); </script>");
	// response.redirect("http://127.0.0.1:3000/admin.html");
});


app.get('/delete_items', function (request, response) {
	connection.query("SELECT * FROM items", function (error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successful query');
			response.render('delete_items', { page_title: "Delete Item", data: rows });
		}
	});
});

app.get('/delete_item/(:id)', function (request, response) {
	queryString = "DELETE FROM items WHERE item_id =" +  request.params.id +  ";";
	connection.query(queryString, function (error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successful query');
			// response.flash('Successfully Deleted')
			response.redirect("/delete_items");
		}
	});

});




app.get('/edit_items', function (request, response) {
	connection.query("SELECT * FROM items", function (error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successful query');
			response.render('edit_items', { page_title: "Edit Item", data: rows });
		}
	});
});

app.get('/update_item/:id', function (request, response) {
	queryString = "SELECT * FROM items WHERE item_id = " + request.params.id  + ";";
	// response.send(queryString);
	connection.query(queryString, function (error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successful query');
			console.log(rows);
			response.render('update_items', { page_title: "Edit Item", data: rows });
		}
	});
});




app.get('/edit_item/(:id)', function (request, response) {



	queryString = "UPDATE items SET "
				  + "item_name = " + request.query.item_name + " , "
				  + "item_price = " + request.query.item_price + " , "
				  + "item_quantity = " + request.query.item_quantity + " "
				  + " WHERE item_id = " + request.query.id;

	connection.query(queryString, function (error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successful query');
			// response.flash('Successfully Deleted')
			response.redirect("/edit_items");
		}
	});

});



app.get('/buyer', function (request, response) {
	connection.query("SELECT * FROM items", function (error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successful query');
			response.render('buyer', { page_title: "Buyer", data: rows });
		}
	});
});



app.get('/buy_item/:id/:item_quantity', function (request, response) {
	queryString = "UPDATE items SET "
				//   + "item_name = " + request.params.item_name + " , "
				//   + "item_price = " + request.params.item_price + " , "
		+ "item_quantity = "
		+ (request.params.item_quantity - request.query.order_quantity) + " "
		+ " WHERE item_id = " + request.params.id;

	// response.send(queryString);
	connection.query(queryString, function (error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successful query');
			// response.flash('Successfully Deleted')
			response.end("<h1>Successfuly Purchased new item<h1><script> setTimeout(function() { window.location.href = \"/buyer\";}, 1000); </script>");

			// response.redirect("http://127.0.0.1:3000/buyer");
		}
	});

});




// app.delete('/delete_items/:id', function (request, response) {


//     //DELETE YOUR RECORD WITH YOUR PARAM.

//     return res.status(200);
// }





// app.get('/', function (request, response) {
// 	connection.query("SELECT * FROM items", function(error, rows, fields) {
// 		if (!!error) {
// 			console.log('Error in the query');
// 		} else {
// 			console.log('Successful query');
// 			response.send(rows[0].item_name);
// 		}
// 	});
// });

app.listen(3000);


