import * as DAO from '../DAO/index';
import * as Models from '../models';


const handle_success = (reply: any, response: any) => {
    reply.send({
        data: response
    });
}

const handle_return = (reply: any, response: any) => {
    reply.send(response);
}

// const handle_catch = async (reply: any, error: any) => {

//     console.log("-------------------error-->", await error)

//     let { type, status_code, error_message } = await error
//     if (type == undefined) { type = 'Bad Request' }
//     if (status_code == undefined) { status_code = 400 }
//     if (error_message == undefined) { error_message = error }

//     reply.status(status_code).send({
//         error: type,
//         error_description: error_message
//     });

// }

const handle_catch = async (reply: any, error: any) => {

    console.log("-------------------error-->",error)

    let { type, status_code, error_message } = error
    if (type == undefined) { type = 'Bad Request' }
    if (status_code == undefined) { status_code = 400 }
    if (error_message == undefined) { error_message = "Something went wrong" }

    reply.status(status_code).send({
        error: type,
        error_description: error_message
    });

}

const handle_custom_error = async (type: string, language: string) => {
    try {

        let query = { message_type: type }
        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.ResMessages, query, projection, options)

        if (fetch_data.length) {

            let { message_type, status_code, msg_in_english, msg_in_arabic } = fetch_data[0]

            let error_message = 'Something went wrong'
            if (language == 'ENGLISH') {
                error_message = msg_in_english
            }
            else if (language == 'ARABIC') {
                error_message = msg_in_arabic
            }
            else {
                message_type = "INVALID_LANGUAGE"
                error_message = "Sorry this is not a valid language"
            }

            return {
                type: message_type,
                status_code: status_code,
                error_message: error_message
            }

        } else {
            throw new Error("Invalid error type")
        }

    }
    catch (err) {
        throw err;
    }
}

const handle_joi_error = async (error: any) => {

    let error_message = error.details[0].message
    let custom_message = error_message.replace(/"/g, '');
    throw {
        status_code: 400,
        type: "Joi Error",
        error_message: custom_message
    }

}

// const handle_failure = async (res: express.Response, type: string, language: string) => {
//     try {

//         let query = { message_type: type }
//         let projection = { __v: 0 }
//         let options = { lean: true }
//         let fetch_data: any = await DAO.get_data(Models.ResMessages, query, projection, options)

//         if (fetch_data.length) {

//             let { message_type, status_code, msg_in_english, msg_in_arabic } = fetch_data[0]

//             let error_message = 'Something went wrong'
//             if (language == 'ENGLISH') {
//                 error_message = msg_in_english
//             }
//             else if (language == 'ARABIC') {
//                 error_message = msg_in_arabic
//             }
//             else {
//                 message_type = "INVALID_LANGUAGE"
//                 error_message = "Sorry this is not a valid language"
//             }

//             res.status(status_code).send({
//                 success: false,
//                 error: type,
//                 error_description: error_message
//             });
//             res.end();

//         } else {
//             // throw new Error("Invalid error type")
//             res.status(400).send({
//                 success: false,
//                 error: 'BAD_REQUEST',
//                 error_description: 'Something went wrong'
//             });
//             res.end();
//         }

//     }
//     catch (err) {
//         throw err;
//     }
// }

export {
    handle_catch,
    handle_success,
    handle_return,
    handle_custom_error,
    handle_joi_error,
    // handle_failure
}