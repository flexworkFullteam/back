const mercadopago = require("mercadopago");
require("dotenv").config();
const { Payment, Project, Company } = require("../DB_connection");
const { MP_ACCESS_TOKEN, ROUTE_SUCCESS, ROUTE_PENDING, ROUTE_FAILURE, TO, NOTIFICATION_URL, FRONTDOMAIN } = process.env;

const createOrder = async (req, res) => {
    const { id, category_id, title, description, unit_price, quantity = 1, currency_id, from, to = TO, project } = req.body;
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
        notification_url: `${NOTIFICATION_URL}/solution/webhook/${from}/${to}/${project}`
    });
    //res.redirect(result.response.init_point);
    res.json({
        link: result.response.init_point,
    });
};

const successPayment = async (req, res) => {
    //res.send("Success");
    res.redirect(`${FRONTDOMAIN}/success`);
};
const pendingPayment = async (req, res) => {
    res.redirect(`${FRONTDOMAIN}/pending`);
};
const failurePayment = async (req, res) => {
    res.redirect(`${FRONTDOMAIN}/failure`);
};

const listenWebhook = async (req, res) => {
    const payment = req.query;
    const { from, project } = req.params;
    console.log(payment);
    try {
        if (payment.type === "payment") {

            const data = await mercadopago.payment.findById(payment["data.id"]);

            const response = {
                op_id: data.body.id,
                from,
                to: TO,
                project,
                transaction_amount: data.body.transaction_amount,
                net_received_amount: data.body.transaction_details.net_received_amount,
                payment_date: data.body.date_created,
                approved_date: data.body.date_approved,
                status: data.body.status,
                description: data.body.description,
            };
            const proyecto = await Project.findByPk(project);
            //console.log("proyecto: ",proyecto);
            if (proyecto) {
                const updated = await Project.update(
                    {
                        pagado: true,
                        mpTransferencia: data.body.id
                    },
                    {
                        where: { id: project }
                    }
                );
                
                if (updated) {
                    await Payment.create(response);
                    return res.status(200).json({ paymentdata: response, projectupdated: proyecto });
                }
                return res.status(400).send("no se pudo actualizar la informacion del pago realizado");
            }
            res.status(402).send("no se encontro proyecto");
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

const getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        const company = await Company.findAll();
        const project = await Project.findAll();
        const response = payments.map(payment => {
            const tCompany = company.find(comp => {
                return comp.userId === payment.from
            });
            const tProject = project.find(proyecto => proyecto.id === payment.project);
            return {
                id: payment.id,
                op_id: payment.op_id,
                from: {
                    id: payment.from,
                    name: tCompany.dataValues.business_name,
                },
                to: TO,
                project: {
                    id: payment.project,
                    name: tProject.dataValues.title,
                },
                transaction_amount: payment.transaction_amount,
                net_received_amount: payment.net_received_amount,
                payment_date: payment.date_created,
                approved_date: payment.date_approved,
                status: payment.status,
                description: tProject.dataValues.description,
            }
        })
        if (payments)
            return res.status(200).json(response);
        return res.status(404).send("No se encontraron pagos");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};

module.exports = {
    getPaymentsById,
    createOrder,
    pendingPayment,
    failurePayment,
    successPayment,
    listenWebhook,
    getPayments
}