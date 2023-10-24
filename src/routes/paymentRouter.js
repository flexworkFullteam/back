const { Router } = require("express");
const { getPaymentsById,createOrder, successPayment,pendingPayment,failurePayment, listenWebhook } = require("../controllers/paymentController");

const router = Router();

router.get('/payments/:from',getPaymentsById)
router.post('/solution/payment', createOrder);
router.get('/solution/payment/success',successPayment);
router.get('/solution/payment/pending',pendingPayment);
router.get('/solution/payment/failure',failurePayment);
router.post('/solution/webhook/:from/:to/:project', listenWebhook);

module.exports = router;