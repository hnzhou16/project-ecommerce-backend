import {Request, Response} from "express";
import paypal = require('paypal-rest-sdk')

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
})

export class PaymentController {
    static async createPayment(req: Request, res: Response) {
        const {amount} = req.body
        const paymentTotal = amount.total

        if (!paymentTotal || paymentTotal <= 0) {
            return res.status(400).send("Missing payment information in request body.")
        }

        const paymentDetails = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://return.url",
                "cancel_url": "http://cancel.url"
            },
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": paymentTotal
                },
                "description": "This is the payment description."
            }]
        }

        paypal.payment.create(paymentDetails, (err, payment) => {
            if (err) {
                console.log(err)
                return res.status(400).send(err)
            } else {
                console.log("pay", payment)
                return res.status(200).send('Payment')
            }
        })
    }
}