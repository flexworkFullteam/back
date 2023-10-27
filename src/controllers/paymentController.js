const mercadopago = require("mercadopago");
require("dotenv").config();
const { Payment } = require("../DB_connection");
const { MP_ACCESS_TOKEN } = process.env;
const
    ROUTE_SUCCESS = "http://localhost:3001/solution/payment/success",
    ROUTE_PENDING = "http://localhost:3001/solution/payment/pending",
    ROUTE_FAILURE = "http://localhost:3001/solution/payment/failure";

const createOrder = async (req, res) => {
    const { id, category_id, title, description, unit_price, quantity, currency_id, from, to, project } = req.body;
    mercadopago.configure({
        access_token: MP_ACCESS_TOKEN,
    });
    const result = await mercadopago.preferences.create({
        items: [
            {
                id,
                category_id,
                description,
                title,
                unit_price,
                currency_id,
                quantity,
            }
        ],
        back_urls: {
            success: ROUTE_SUCCESS,
            pending: ROUTE_PENDING,
            failure: ROUTE_FAILURE
        },
        notification_url: `https://e80d-38-25-15-175.ngrok.io/solution/webhook/${from}/${to}/${project}`
    });
    //res.redirect(result.response.init_point);
    res.json({
        link: result.response.init_point,
    });
};

const successPayment = async (req, res) => {
    res.send("Success");
};
const pendingPayment = async (req, res) => {
    res.send("Pending");
};
const failurePayment = async (req, res) => {
    res.send("Failure");
};

const listenWebhook = async (req, res) => {
    const payment = req.query;
    console.log(payment);
    const { from, to, project } = req.params;
    try {
        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment["data.id"]);
            const response = {
                op_id: data.body.id,
                from,
                to,
                project,
                transaction_amount: data.body.transaction_amount,
                net_received_amount: data.body.transaction_details.net_received_amount,
                payment_date: data.body.date_created,
                approved_date: data.body.date_approved,
                status: data.body.status,
                description: data.body.description,
                //currency_id:data.body.currency_id,
            };
            console.log("STATUS DETAIL", data.body.status_detail);
            const query = await Payment.create(response);
            res.status(200).json(response);
        }
        return res.status(404).send("No hay pago");
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getPaymentsById = async (req, res) => {
    const { from } = req.params;
    if (from)
        try {
            const payments = await Payment.findAll(
                {
                    where: {
                        from,
                    }
                }
            );
            if (payments)
                return res.status(200).json(payments)
            return res.status(404).send("No se encontraron pagos para este id");
        } catch (error) {
            return res.status(500).send(error.message);
        }
    return res.status(500).send("No se encontro ningun id para buscar");
};


module.exports = {
    getPaymentsById,
    createOrder,
    pendingPayment,
    failurePayment,
    successPayment,
    listenWebhook
}