const express = require("express");
const EventEmitter = require("events");
const {sql,poolPromise}= require("./database");

const app = express();
app.use(express.json());

const eventEmitter = new EventEmitter();

app.post("/order", async (req, res) => {
    const { orderId, food_item, customerName } = req.body;

    if (!orderId || !food_item || !customerName) {
        console.log("Error: Missing order details", req.body); 
        return res.status(400).json({
            message: "Missing order details",
        });
    }

    try {
        const pool= await poolPromise;
        await  pool.request()
            .input('orderId', sql.Int, orderId)
            .input('food_item', sql.VarChar, food_item)
            .input('customerName', sql.VarChar, customerName)
            .input('status', sql.VarChar, 'Processing')
            .query('INSERT INTO tbl_Orders__1 (orderId, food_item, customerName, status) VALUES (@orderId, @food_item, @customerName, @status)');

        res.status(200).json({
            message: "Order Received",
            data: { orderId, food_item, customerName, status: 'Processing' },
        });

        processOrder(orderId);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Database error" });
    }
});

async function processOrder(orderId) {
    await new Promise((resolve) => {
        setTimeout(() => resolve("..."), 5000);
    });

    try {
        const pool= await poolPromise;
        pool.request()
            .input('orderId', sql.Int, orderId)
            .input('status', sql.VarChar, 'ready')
            .query('UPDATE tbl_Orders__1 SET status = @status WHERE orderId = @orderId');

        eventEmitter.emit("orderReady", orderId);
    } catch (err) {
        console.error(err.message);
    }
}

app.get("/order/:id", async (req, res) => {
    const orderId = req.params.id;

    try {
        const pool= await poolPromise;
        const result = await pool.request()
            .input('orderId', sql.Int, orderId)
            .query('SELECT * FROM tbl_Orders__1 WHERE orderId = @orderId');

        if (result.recordset.length ) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = result.recordset;

        res.status(200).json({ orderId: order.orderId, status: order.status });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Database error" });
    }
});

eventEmitter.on("orderReady", (orderId) => {
    console.log(`Order ${orderId} is ready for pickup`);
});


app.listen(3000, () => {
    console.log(`Server running on port http://localhost:3000`);
});
