import Joi from 'joi';
import { handle_joi_error } from '../../middlewares/index'

const validate_login = async (request: any) => {

    let schema: any = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        language: Joi.string().required().valid('ARABIC', 'ENGLISH')
    });

    let { error } = schema.validate(request.body);
    if (error) {
        await handle_joi_error(error)
    }

}


export {
    validate_login
}