import * as DAO from "../../DAO";
import * as Models from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class admin_banner_module {

    static add_a_banner = async (req: any) => {
        try {

            let { title, sub_title, image, category_id, subcategory_id,
                sub_subcategory_id, brand_id, position, language
            } = req.body;

            // check total banners added
            let query = { is_deleted: false, position: position };
            let total_count:any = await DAO.count_data(Models.Banners, query)
            if (total_count < 6) {
                let data_to_save: any = {
                    // title: title,
                    // sub_title: sub_title,
                    image: image,
                    position: position,
                    is_enable:true,
                    updated_at: +new Date(),
                    created_at: +new Date()
                }
                if (!!category_id) { data_to_save.category_id = category_id }
                if (!!subcategory_id) { data_to_save.subcategory_id = subcategory_id }
                if (!!sub_subcategory_id) { data_to_save.sub_subcategory_id = sub_subcategory_id }
                if (!!brand_id) { data_to_save.brand_id = brand_id }
                if (!!language) { data_to_save.language = language }
                let response = await DAO.save_data(Models.Banners, data_to_save);
                return response
            }
            else {
                throw await handle_custom_error("BANNER_ADD_ERROR", language)
            }
        }
        catch (err) {
            throw err;
        }
    }

    static update_a_banner = async (req: any) => {
        try {

            let { _id, title, sub_title, image, category_id, subcategory_id,
                sub_subcategory_id, brand_id, position,language
            } = req.body;
            console.log('banner req.body ----- ', req.body)
            let query = { _id: _id }
            // let update:any = { updated_at: +new Date() }
            // if (!!title) { update.title = title }
            // if (!!sub_title) { update.sub_title = sub_title }
            // if (!!image) { update.image = image }
            // if (!!position) { update.position = position }
            // if (!!category_id) { update.category_id = category_id }
            // if (!!subcategory_id) { update.subcategory_id = subcategory_id }
            // if (!!sub_subcategory_id) { update.sub_subcategory_id = sub_subcategory_id }
            // if (!!brand_id) { update.brand_id = brand_id }
            // if (!!language) { update.language = language }
            let update:any = {
                ...(title && {title: title}),
                ...(sub_title && {sub_title: sub_title}),
                ...(image && {image: image}),
                ...(position && {position: position}),
                ...(category_id && {category_id: category_id}),
                ...(subcategory_id && {subcategory_id: subcategory_id}),
                ...(sub_subcategory_id || sub_subcategory_id == "" && {sub_subcategory_id: sub_subcategory_id == "" ? null : sub_subcategory_id}),
                ...(brand_id && {brand_id: brand_id}),
                ...(language && {language: language}),
                updated_at: +new Date() 
            }
            console.log('banner update ----- ', update)
            let options = { new: true }
            let response = await DAO.find_and_update(Models.Banners, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list_banners = async (req: any) => {
        try {

            let { _id, position, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false,language:language }
            if (!!_id) { query._id = _id }
            if (!!position) { query.position = position }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                },
                {
                    path: 'subcategory_id',
                    select: 'name'
                },
                {
                    path: 'sub_subcategory_id',
                    select: 'name'
                },
                {
                    path: 'brand_id',
                    select: 'name'
                },
            ]
            let banners: any = await DAO.populate_data(Models.Banners, query, projection, options, populate)
            let total_count = await DAO.count_data(Models.Banners, query)
            return {
                total_count: total_count,
                data: banners
            }

        }
        catch (err) {
            throw err;
        }
    }

    static banner_details = async(req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let projection = { __v: 0, is_deleted: 0 }
            let options = { lean : true }
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                },
                {
                    path: 'subcategory_id',
                    select: 'name'
                },
                {
                    path: 'sub_subcategory_id',
                    select: 'name'
                },
                {
                    path: 'brand_id',
                    select: 'name'
                }
            ]
            let banners: any = await DAO.populate_data(Models.Banners, query, projection, options, populate)
            if(banners.length) {
                return banners[0] 
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID","ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

    static delete_a_banner = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let update = { is_deleted: true }
            let options = { new: true }
            let response: any = await DAO.find_and_update(Models.Banners, query, update, options)
            if (response.is_deleted == true) {
                let message = `Banner Deleted Successfully`;
                return message
            }
            else {
                throw await handle_custom_error("SOMETHING_WENT_WRONG", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

    static enable_disable_a_banner = async (req: any) => {
        try {

            let { _id, is_enable } = req.body;
            console.log('req.params --- ', req.body)
            console.log('type --- ', typeof is_enable)
            let query = { _id: _id }
            let update = { is_enable: is_enable };
            let options = { new: true }
            let response: any = await DAO.find_and_update(Models.Banners, query, update, options)
            if (response.is_enable == true) {
                let message = `Banner Enabled Successfully`;
                return message
            }else if(response.is_enable == false){
                let message = `Banner Disabled Successfully`;
                return message;
            }else {
                throw await handle_custom_error("SOMETHING_WENT_WRONG", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

    static enable_disable_banners = async (req:any) => {
        try {
            let { is_enable, position } = req.body
            let query = { is_deleted: false, position:position };
            let option = { lean: true };
            let get_banners:any = await DAO.get_data(Models.Banners,query, {__v:0 }, option)
            let response: any; 

            if(get_banners.length){
                get_banners.forEach(async(banner:any) => {
                    let options = { new: true };
                    let update = { is_enable: is_enable, };
                    let queery = { _id: banner._id }
                    response = await DAO.find_and_update(Models.Banners, queery, update, options)
                });
            }else{
                throw 'No banner found'
            }
          
            let options = { new: true }
            // let response: any = await DAO.find_and_update(Models.Banners, query, update, options)
            if (is_enable == true) {
                let message = `Banners Enabled Successfully`;
                return message
            }else if(is_enable == false){
                let message = `Banners Disabled Successfully`;
                return message;
            }else {
                throw await handle_custom_error("SOMETHING_WENT_WRONG", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

}

class user_banner_module {

    static user_list_banners = async (req: any) => {
        try {

            let { position } = req.query;

            let retrive_sections: any = await this.retrive_sections_data()
            if (retrive_sections.length) {
                let { top_banners, middle_banners, bottom_banners } = retrive_sections[0]

                if(position == "TOP") {
                    if (top_banners == true) {
                        let fetch_banners = await this.retrive_banners(req)
                        return fetch_banners
                    }
                    else {
                        return {
                            total_count: 0,
                            data: []
                        }
                    }
                }
                else if(position == "MIDDLE") {
                    if (middle_banners == true) {
                        let fetch_banners = await this.retrive_banners(req)
                        return fetch_banners
                    }
                    else {
                        return {
                            total_count: 0,
                            data: []
                        }
                    }
                }
                else if(position == "BOTTOM") {
                    if (bottom_banners == true) {
                        let fetch_banners = await this.retrive_banners(req)
                        return fetch_banners
                    }
                    else {
                        return {
                            total_count: 0,
                            data: []
                        }
                    }
                }
                else {
                    return {
                        total_count: 0,
                        data: []
                    }
                }
            }

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_sections_data = async () => {
        try {

            let query = {}
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Models.HomePageSections, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_banners = async (req: any) => {
        try {

            let { _id, position, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false, is_enable:true,language:language}
            if (!!_id) { query._id = _id }
            if (!!position) { query.position = position }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                },
                {
                    path: 'subcategory_id',
                    select: 'name'
                },
                {
                    path: 'sub_subcategory_id',
                    select: 'name'
                },
                {
                    path: 'brand_id',
                    select: 'name'
                }
            ]
            let banners: any = await DAO.populate_data(Models.Banners, query, projection, options, populate)
            let total_count = await DAO.count_data(Models.Banners, query)
            return {
                total_count: total_count,
                data: banners
            }

        }
        catch (err) {
            throw err;
        }
    }

}




export {
    admin_banner_module,
    user_banner_module
}