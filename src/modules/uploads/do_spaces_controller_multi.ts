import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { config } from 'dotenv';
config();
import moment from 'moment';
import * as express from 'express';
import { handle_catch, handle_success, handle_custom_error, handle_joi_error } from '../../middlewares/handler';

let do_spaces_key = process.env.DO_SPACES_KEY
let do_spaces_secret = process.env.DO_SPACES_SECRET
let do_spaces_bucket_name = process.env.DO_SPACES_NAME
let do_region = process.env.DO_REGION
let do_spaces_endpoint = process.env.DO_SPACES_ENDPOINT
let base_url = process.env.Url

const upload_file = async (req: any, res: express.Response) => {
    try {

        let { file: { name, data, mimetype } } = req.files


        // console.log("--------------req.files-->", req.files)

        // check file type
        let split_mime_type = mimetype.split('/')
        // console.log("--------------split_mime_type---", split_mime_type)

        if (split_mime_type[0] == 'image') {

            let response = await upload_images(name, data, mimetype)
            handle_success(res, response)

        } else if (split_mime_type[0] == 'audio') {

            let response = await upload_audio(name, data, mimetype)
            handle_success(res, response)

        }
        else if (split_mime_type[0] == 'video') {

            let response = await upload_video(name, data, mimetype)
            handle_success(res, response)

        }
        else if (split_mime_type[1] == 'pdf') {

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

const upload_images = async (name: string, data: any, mime_type: string) => {
    try {

        // gen file name
        let file_name = await generate_file_name(name)

        await create_original_file(file_name, data, mime_type)
    

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

const upload_file_to_spaces = async (target: any) => {
    return new Promise(async(resolve, reject) => {
       try {
           const parallelUploads3 = new Upload({
               client: new S3Client({ endpoint: do_spaces_endpoint,
                                    region:do_region, credentials: { accessKeyId: do_spaces_key, 
                                    secretAccessKey: do_spaces_secret } 
                }),
               leavePartsOnError: false,
               params: target,
            });
            parallelUploads3.on("httpUploadProgress", (progress) => {
                // console.log(progress);
            });
            let data =await parallelUploads3.done();
            // console.log("Successfully uploaded object: " + base_url + "/" + target.Key );
            return resolve(data)
        } catch (e) {
            // console.log(e);
            return reject(e)
            
        }
    })
}

export {
    upload_file
}