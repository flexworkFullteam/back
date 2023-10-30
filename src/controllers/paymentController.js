const mercadopago = require("mercadopago");
require("dotenv").config();
const { Payment, Project, } = require("../DB_connection");
const { MP_ACCESS_TOKEN } = process.env;
const
    ROUTE_SUCCESS = "http://localhost:3001/solution/payment/success",
    ROUTE_PENDING = "http://localhost:3001/solution/payment/pending",
    ROUTE_FAILURE = "http://localhost:3001/solution/payment/failure";

const createOrder = async (req, res) => {
    const { id, category_id, title, description, unit_price, quantity = 1, currency_id, from, to, project } = req.body;
    mercadopago.configure({
        access_token: MP_ACCESS_TOKEN,
    });
    const result = await mercadopago.preferences.create({
        items: [
            {
                id,
                category_id,
                description,
                title, /// pago de proyecto X
                unit_price, // 1000
                currency_id, // PEN
                quantity,  // 1
            }
        ],
        back_urls: {
            success: ROUTE_SUCCESS,
            pending: ROUTE_PENDING,
            failure: ROUTE_FAILURE
        },
        notification_url: `https://f56c-38-25-15-175.ngrok-free.app/solution/webhook/${from}/${to}/${project}`
    });
    //res.redirect(result.response.init_point);
    res.json({
        link: result.response.init_point,
    });
};

const successPayment = async (req, res) => {
    //res.send("Success");
    res.redirect("http://localhost:5173/success");
};
const pendingPayment = async (req, res) => {
    res.redirect("http://localhost:5173/pending");
};
const failurePayment = async (req, res) => {
    res.redirect("http://localhost:5173/failure");
};

const listenWebhook = async (req, res) => {
    const payment = req.query;

    const { from, to, project } = req.params;
    try {
        if (payment.type === "payment") {

            const data = await mercadopago.payment.findById(payment["data.id"]);

            const response = {
                op_id: data.body.id,
                from,
                to: "07294ca6-c024-4ceb-a075-5919697b9033",
                project,
                transaction_amount: data.body.transaction_amount,
                net_received_amount: data.body.transaction_details.net_received_amount,
                payment_date: data.body.date_created,
                approved_date: data.body.date_approved,
                status: data.body.status,
                description: data.body.description,
                //currency_id:data.body.currency_id,
            };
            const proyecto = await Project.findById(project);
            proyecto.pagado = true
            proyecto.mpTransferencia = data.body.id
            await proyecto.save();

            await Payment.create(response);
            res.status(200).json(response);
        }
        return res.status(404).send("No hay pago");
    } catch (error) {
        return console.log(error.message);
        //return res.status(500).json({ error: error.message });
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