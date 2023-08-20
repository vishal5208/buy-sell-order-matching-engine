class Order {
	constructor(orderId, side, price, quantity) {
		this.orderId = orderId;
		this.side = side; // 'buy' or 'sell'
		this.price = price;
		this.quantity = quantity;
	}
}

class OrderBook {
	constructor() {
		this.buyOrders = [];
		this.sellOrders = [];
	}

	addOrder(order) {
		if (!order || typeof order !== "object") {
			console.log("Invalid order format. Skipping...");
			return;
		}

		if (order.side !== "buy" && order.side !== "sell") {
			console.log("Invalid order side. Skipping...");
			return;
		}

		if (
			isNaN(order.price) ||
			isNaN(order.quantity) ||
			order.price <= 0 ||
			order.quantity <= 0
		) {
			console.log("Invalid order price or quantity. Skipping...");
			return;
		}

		if (order.side === "buy") {
			this.insertIntoBuyOrders(order);
		} else if (order.side === "sell") {
			this.insertIntoSellOrders(order);
		}
		this.matchOrders();
	}

	insertIntoBuyOrders(order) {
		for (let i = 0; i < this.buyOrders.length; i++) {
			if (order.price > this.buyOrders[i].price) {
				this.buyOrders.splice(i, 0, order);
				return;
			}
		}
		this.buyOrders.push(order);
	}

	insertIntoSellOrders(order) {
		for (let i = 0; i < this.sellOrders.length; i++) {
			if (order.price < this.sellOrders[i].price) {
				this.sellOrders.splice(i, 0, order);
				return;
			}
		}
		this.sellOrders.push(order);
	}

	matchOrders() {
		while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
			const highestBuyOrder = this.buyOrders[0];
			const lowestSellOrder = this.sellOrders[0];

			if (highestBuyOrder.price >= lowestSellOrder.price) {
				const matchedQuantity = Math.min(
					highestBuyOrder.quantity,
					lowestSellOrder.quantity
				);

				console.log(
					`Matched: Buy Order ${highestBuyOrder.orderId} and Sell Order ${lowestSellOrder.orderId}`
				);

				highestBuyOrder.quantity -= matchedQuantity;
				lowestSellOrder.quantity -= matchedQuantity;

				if (highestBuyOrder.quantity === 0) {
					this.buyOrders.shift();
				}
				if (lowestSellOrder.quantity === 0) {
					this.sellOrders.shift();
				}
			} else {
				break;
			}
		}
	}
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const orderBook = new OrderBook();

for (let i = 1; i <= 100; i++) {
	const side = Math.random() < 0.5 ? "buy" : "sell";
	const price = getRandomInt(1, 1000); // Adjusted to avoid division by zero
	const quantity = getRandomInt(1, 1000);
	const order = new Order(i, side, price, quantity);
	orderBook.addOrder(order);
}

// Handle cases where buyOrders or sellOrders are not fully matched
while (orderBook.buyOrders.length > 0 || orderBook.sellOrders.length > 0) {
	orderBook.matchOrders();
}
