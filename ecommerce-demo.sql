CREATE TABLE `items` (
	`item_id` INT unsigned NOT NULL AUTO_INCREMENT,
	`item_name` VARCHAR(255) NOT NULL,
	`item_price` DECIMAL NOT NULL,
	`item_quantity` INT NOT NULL,
	PRIMARY KEY (`item_id`)
);


INSERT INTO items (item_name,item_price,item_quantity) VALUES('Mouse','100','400');
INSERT INTO items (item_name,item_price,item_quantity) VALUES('Monitor','5000','150');
-- demo