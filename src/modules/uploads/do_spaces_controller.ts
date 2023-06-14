import AWS from 'aws-sdk';
import { config } from 'dotenv';
config();
import moment from 'moment';
import * as express from 'express';
import resize_img from 'resize-img';
import { handle_catch, handle_success, handle_custom_error, handle_joi_error } from '../../middlewares/handler';

// BUCKET_NAME=sharedecommerce
// DO_ACCESS_KEY=FPR3OQAVBJTMD4TZMJNJ
// DO_SECRET_ACCESS_KEY=GgjLr+5C7//4JVJD4/Qaffepp32iCCUeL2vsgY461Tk
// DO_ENDPOINT=nyc3.digitaloceanspaces.com
// Url=https://sharedecommerce.nyc3.digitaloceanspaces.com
// DO_REGION=nyc3

// const do_spaces_endpoint = process.env.DO_SPACES_ENDPOINT
// let do_spaces_key = process.env.DO_SPACES_KEY
// let do_spaces_secret = process.env.DO_SPACES_SECRET
// let do_spaces_bucket_name = process.env.DO_SPACES_NAME

const do_spaces_endpoint = "nyc3.digitaloceanspaces.com"
let do_spaces_key = "FPR3OQAVBJTMD4TZMJNJ"
let do_spaces_secret = "GgjLr+5C7//4JVJD4/Qaffepp32iCCUeL2vsgY461Tk"
let do_spaces_bucket_name = "sharedecommerce"

// console.log("--------------------do_spaces_endpoint-----", do_spaces_endpoint)
// console.log("--------------------do_spaces_key-----", do_spaces_key)
// console.log("--------------------do_spaces_secret-----", do_spaces_secret)
// console.log("--------------------do_spaces_bucket_name-----", do_spaces_bucket_name)

const spacesEndpoint = new AWS.Endpoint(do_spaces_endpoint);
const s3: any = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: do_spaces_key,
    secretAccessKey: do_spaces_secret
});

const upload_file = async (req: any, res: express.Response) => {
    try {

        let { file: { name, data, mimetype } } = req.files


        console.log("--------------req.files-->", req.files)

        // check file type
        let split_mime_type = mimetype.split('/')
        // console.log("--------------split_mime_type---", split_mime_type)

        if (split_mime_type[0] == 'image') {

            let response = await upload_images(name, data, mimetype)
            handle_success(res, response)

        }
        else if (split_mime_type[0] == 'audio') {

            let response = await upload_audio(name, data, mimetype)
            handle_success(res, response)

        }
        else if (split_mime_type[0] == 'video') {

            let response = await upload_video(name, data, mimetype)
            handle_success(res, response)

        }
        else if (split_mime_type[0] == 'pdf') {

            let response = await upload_doc(name, data, mimetype)
            handle_success(res, response)

        }
        else {

            let message = 'Sorry we currently do not support this format'
            handle_catch(res, message)

        }

    }
    catch (err) {
        handle_catch(res, err);
    }
}


const upload_images = async (name: string, data: any, mime_type: string) => {
    try {

        let split_mime_type = mime_type.split("/");
        // gen file name
        let file_name = await generate_file_name(name)

        await create_original_file(file_name, data, mime_type);
        console.log('split - mime type ', split_mime_type)
        if(split_mime_type[1] != 'webp'){
            await create_medium_file(file_name, data, mime_type);
            await create_small_file(file_name, data, mime_type);
        }
        

        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'IMAGE',
            folders: ['original', 'medium', 'small'],
            file_name: file_name
        }

        return response

    }
    catch (err) {
        throw err;
    }
}

const create_original_file = async (name: string, data: any, mime_type: string) => {
    try {

        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/original/${name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        }

        // create original file
        let response = await upload_file_to_spaces(params)
        return response

    }
    catch (err) {
        throw err;
    }
}

const create_medium_file = async (name: string, data: any, mime_type: string) => {
    try {

        console.log('---resize --- ')
        let options = { width: 250, height: 250 }
        let after_resize = await resize_img(data, options);

        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/medium/${name}`,
            ACL: 'public-read',
            Body: after_resize,
            ContentType: mime_type
        }

        // create original file
        let response = await upload_file_to_spaces(params)
        return response

    }
    catch (err) {
        throw err;
    }
}

const create_small_file = async (name: string, data: any, mime_type: string) => {
    try {

        let options = { width: 100, height: 100 }
        let after_resize = await resize_img(data, options);

        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/small/${name}`,
            ACL: 'public-read',
            Body: after_resize,
            ContentType: mime_type
        }

        // create original file
        let response = await upload_file_to_spaces(params)
        return response

    }
    catch (err) {
        throw err;
    }
}


const upload_audio = async (name: string, data: any, mime_type: string) => {
    try {

        // gen file name
        let file_name = await generate_file_name(name)

        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/audio/${file_name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        }

        // create original file
        await upload_file_to_spaces(params)

        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'AUDIO',
            folders: ['audio'],
            file_name: file_name
        }

        return response

    }
    catch (err) {
        throw err;
    }
}

const upload_video = async (name: string, data: any, mime_type: string) => {
    try {

        // gen file name
        let file_name = await generate_file_name(name)


        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/video/${file_name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        }

        // create original file
        await upload_file_to_spaces(params)

        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'VIDEO',
            folders: ['video'],
            file_name: file_name
        }

        return response

    }
    catch (err) {
        throw err;
    }
}

const upload_doc = async (name: string, data: any, mime_type: string) => {
    try {

        // gen file name
        let file_name = await generate_file_name(name)

        let params = {
            Bucket: do_spaces_bucket_name,
            Key: `sharedecommerce/documents/${file_name}`,
            ACL: 'public-read',
            Body: data,
            ContentType: mime_type
        }

        // create original file
        await upload_file_to_spaces(params)

        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com',
            type: 'DOCUMENT',
            folders: ['documents'],
            file_name: file_name
        }

        return response

    }
    catch (err) {
        throw err;
    }
}

const generate_file_name = async (file_name: string) => {
    try {

        // console.log("<--file_name-->", file_name)

        let current_millis = moment().format('x')
        let raw_file_name = file_name.split(/\s/).join('');
        let split_file = raw_file_name.split('.')

        // spiting by all special charcters
        let split_all = split_file[0].split(/[^a-zA-Z0-9]/g).join('_')

        let name = split_all.toLowerCase()
        let ext = split_file[1]

        // console.log("<--name-->", name)
        // console.log("<--ext-->", ext)

        let gen_file_name = `${name}_${current_millis}.${ext}`

        // console.log("<--gen_file_name-->", gen_file_name)

        return gen_file_name.toLowerCase()

    }
    catch (err) {
        throw err;
    }
}


const upload_file_to_spaces = (params: any) => {
    return new Promise((resolve, reject) => {
        try {

            s3.upload(params, (err: any, data: any) => {
                if (err) { console.error("uploading error", err) }
                else {
                    console.error("uploading sucessfull", data)
                    return resolve(data);
                }
            });

        } catch (err) {
            return reject(err);
        }
    });
}


const list_all_files = () => {
    return new Promise((resolve, reject) => {
        try {

            let params = { Bucket: do_spaces_bucket_name }
            s3.listObjects(params, (err: any, data: any) => {
                if (err) { console.error("error", err) }
                else {
                    return resolve(data);
                    // return resolve(data.Contents);
                }
            });

        } catch (err) {
            return reject(err);
        }
    });
}


export {
    upload_file,
    list_all_files
}