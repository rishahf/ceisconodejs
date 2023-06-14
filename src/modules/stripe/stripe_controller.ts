import { Request, Response } from 'express';
import card_module from './card_module';

class controller {

    static async gen_token(req: Request, res: Response) {
        try {
            let response = await card_module.generate_token(req)
            let message = "Success";
            res.send({
                success: true,
                message: message,
                data: response
            });
        }
        catch (err) {
            if (err.raw != undefined) {
                res.status(err.raw.statusCode).send({
                    success: false,
                    error: err.raw.type,
                    error_description: err.raw.message
                });
            }
            else {
                res.status(err.status_code).send({
                    success: false,
                    error: err.type,
                    error_description: err.error_message
                });
            }
            res.end();
        }
    }

    static async create_a_card(req: Request, res: Response) {
        try {
            let response = await card_module.create_card(req)
            let message = "Success";
            res.send({
                success: true,
                message: message,
                data: response
            });
        }
        catch (err) {
            if (err.raw != undefined) {
                res.status(err.raw.statusCode).send({
                    success: false,
                    error: err.raw.type,
                    error_description: err.raw.message
                });
            }
            else {
                res.status(err.status_code).send({
                    success: false,
                    error: err.type,
                    error_description: err.error_message
                });
            }
            res.end();
        }
    }

    static async list_cards(req: Request, res: Response) {
        try {
            let response = await card_module.retrive_cards(req)
            let message = "Success";
            res.send({
                success: true,
                message: message,
                data: response
            });
        }
        catch (err) {
            if (err.raw != undefined) {
                res.status(err.raw.statusCode).send({
                    success: false,
                    error: err.raw.type,
                    error_description: err.raw.message
                });
            }
            else {
                res.status(err.status_code).send({
                    success: false,
                    error: err.type,
                    error_description: err.error_message
                });
            }
            res.end();
        }
    }

    static async delete_card(req: Request, res: Response) {
        try {
            let response = await card_module.deleteCard(req)
            let message = "Success";
            res.send({
                success: true,
                message: message,
                data: response
            });
        }
        catch (err) {
            if (err.raw != undefined) {
                res.status(err.raw.statusCode).send({
                    success: false,
                    error: err.raw.type,
                    error_description: err.raw.message
                });
            }
            else {
                res.status(err.status_code).send({
                    success: false,
                    error: err.type,
                    error_description: err.error_message
                });
            }
            res.end();
        }
    }

    // static async create_a_plan(req: Request, res: Response) {
    //     try {
    //         let response = await product_and_price.create_product(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async list_plans(req: Request, res: Response) {
    //     try {
    //         let response = await listing.retrive_plans(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         handle_catch(res, err);
    //     }
    // }

    // static async plan_details(req: Request, res: Response) {
    //     try {
    //         let response = await listing.plan_details(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         handle_catch(res, err);
    //     }
    // }

    // static async create_a_price(req: Request, res: Response) {
    //     try {
    //         let response = await product_and_price.create_a_price(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async create_a_subscription(req: Request, res: Response) {
    //     try {
    //         let response = await subscription.create_a_subscription(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async update_a_subscription(req: Request, res: Response) {
    //     try {
    //         let response = await update_subscription.upgrade_downgrade(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }


    // static async purchased_plans(req: Request, res: Response) {
    //     try {
    //         let response = await listing.purchased_plans(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         handle_catch(res, err);
    //     }
    // }

    // static async retrive_a_invoice(req: Request, res: Response) {
    //     try {
    //         let response = await listing.retrive_a_invoice(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async retrive_upcoming_invoice(req: Request, res: Response) {
    //     try {
    //         let response = await listing.retrive_upcoming_invoice(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async downgrade_plan(req: Request, res: Response) {
    //     try {
    //         let response = await update_subscription.downgrade_plan(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async retrive_downgraded_plan(req: Request, res: Response) {
    //     try {
    //         let response = await update_subscription.retrive_downgraded_plan(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async cancel_downgrade(req: Request, res: Response) {
    //     try {
    //         let response = await update_subscription.cancel_downgrade(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         if (err.raw != undefined) {
    //             res.status(err.raw.statusCode).send({
    //                 success: false,
    //                 error: err.raw.type,
    //                 error_description: err.raw.message
    //             });
    //         }
    //         else {
    //             res.status(err.status_code).send({
    //                 success: false,
    //                 error: err.type,
    //                 error_description: err.error_message
    //             });
    //         }
    //         res.end();
    //     }
    // }

    // static async mobile_otp(req: Request, res: Response) {
    //     try {
    //         let response = await twilio_module.send_otp(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         console.log("err...", err)
    //         res.status(err.status).send({
    //             success: false,
    //             error: "Bad Request",
    //             error_description: `This number can send messages only to verified numbers
    //             You have attempted to send a message to an unverified phone number while using a trial account`
    //         });
    //         res.end();
    //     }
    // }

    // static async mobile_verification(req: Request, res: Response) {
    //     try {
    //         let response = await twilio_module.mob_no_verification(req)
    //         let message = "Success";
    //         res.send({
    //             success: true,
    //             message: message,
    //             data: response
    //         });
    //     }
    //     catch (err) {
    //         console.log("err...", err)
    //         res.status(err.status).send({
    //             success: false,
    //             error: "Bad Request",
    //             error_description: err
    //         });
    //         res.end();
    //     }
    // }


}

export default controller