import * as DAO from "../../DAO";
import { Products, Orders, Coupons, Used_Coupons, Cards } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);


export default class shipment_module {

    static create = async (req: any) => {
        try {

            let { products, address_id, card_id, coupon_code, payment_mode, delivery_price, shipment_id, transaction_id } = req.body;

        }
        catch (err) {
            throw err;
        }
    }

   
}
