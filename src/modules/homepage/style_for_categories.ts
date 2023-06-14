import * as DAO from "../../DAO";
import mongoose, { Model } from "mongoose";
import { StyleForCategories, HomePageSections } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class admin_style_for_categories {

    static add = async (req: any) => {
        try {

            let { style_for_id, image, category_id, subcategory_id, sub_subcategory_id,
                brand_id, language } = req.body;

            let query = { style_for_id: style_for_id, is_deleted: false }
            let total_count = await DAO.count_data(StyleForCategories, query)
            if (total_count < 4) {
                let data_to_save: any = {
                    style_for_id: style_for_id,
                    image: image,
                    updated_at: +new Date(),
                    created_at: +new Date()
                }
                if (!!category_id) { data_to_save.category_id = category_id }
                if (!!subcategory_id) { data_to_save.subcategory_id = subcategory_id }
                if (!!sub_subcategory_id) { data_to_save.sub_subcategory_id = sub_subcategory_id }
                if (!!brand_id) { data_to_save.brand_id = brand_id }
                if (!!language) { data_to_save.language = language }


                let response = await DAO.save_data(StyleForCategories, data_to_save);
                return response
            }
            else {
                throw await handle_custom_error("STYLE_FOR_CATEGORIES_ERROR", language)
            }

        }
        catch (err) {
            throw err;
        }
    }

    static update = async (req: any) => {
        try {

            let { _id, style_for_id, image, category_id, subcategory_id,
                sub_subcategory_id, brand_id,language } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }

            if (!!style_for_id) { update.style_for_id = style_for_id }
            if (!!image) { update.image = image }
            if (!!category_id) { update.category_id = category_id }
            if (!!subcategory_id) { update.subcategory_id = subcategory_id }
            if (!!sub_subcategory_id) { update.sub_subcategory_id = sub_subcategory_id }
            if (!!brand_id) { update.brand_id = brand_id }
            if (!!language) { update.language = language; }


            let options = { new: true }
            let response = await DAO.find_and_update(StyleForCategories, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let { _id, style_for_id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false,language:language }
            if (!!_id) { query._id = _id }
            if (!!style_for_id) { query.style_for_id = style_for_id }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'style_for_id',
                    select: 'name'
                },
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
            let response: any = await DAO.populate_data(StyleForCategories, query, projection, options, populate)
            let total_count = await DAO.count_data(StyleForCategories, query)
            let res:any = _id != undefined || null ? response[0] : response
            return {
                total_count: total_count,
                data: res
            }

        }
        catch (err) {
            throw err;
        }
    }

    static delete = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let update = { is_deleted: true }
            let options = { new: true }
            let response: any = await DAO.find_and_update(StyleForCategories, query, update, options)
            if (response.is_deleted == true) {
                let message = `Style For Categories Deleted Successfully`;
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

    static en_dis_sfc = async (req: any) => {
        try {

            let { _id, is_enable } = req.body;
            let query = { style_for_id: _id }
            let update = { is_enable: is_enable };
            let options = { new: true }
            let get_data:any = await DAO.get_data(StyleForCategories, query,{__v:0}, {lean:true})
            if(get_data){
                let response: any = await DAO.update_many(StyleForCategories, query, update)
            }
            if (is_enable == false) {
                let message = `Style For Categories disabled Successfully`;
                return message
            }else if(is_enable == true){
                let message = `Style For Categories enabled Successfully`;
                return message;
            }
            else {
                throw await handle_custom_error("SOMETHING_WENT_WRONG", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

}

class user_style_for_categories {

    static list = async (req: any) => {
        try {

            let retrive_sections: any = await this.retrive_sections_data()
            if (retrive_sections.length) {
                let { style_for_categories } = retrive_sections[0]
                if (style_for_categories == true) {
                    let fetch_data = await this.retrive_data(req)
                    return fetch_data
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
            let response = await DAO.get_data(HomePageSections, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    // static retrive_data = async (req: any) => {
    //     try {

    //         let { _id, style_for_id, pagination, limit } = req.query;

    //         let query: any = { is_deleted: false }
    //         if (!!_id) { query._id = _id }
    //         if (!!style_for_id) { query.style_for_id = style_for_id }

    //         let projection = { __v: 0, is_deleted: 0 }
    //         let options = await helpers.set_options(pagination, limit)
    //         let populate = [
    //             {
    //                 path: 'style_for_id',
    //                 select: 'name'
    //             },
    //             {
    //                 path: 'category_id',
    //                 select: 'name'
    //             },
    //             {
    //                 path: 'subcategory_id',
    //                 select: 'name'
    //             },
    //             {
    //                 path: 'sub_subcategory_id',
    //                 select: 'name'
    //             },
    //             {
    //                 path: 'brand_id',
    //                 select: 'name'
    //             },
    //         ]
    //         let response: any = await DAO.populate_data(StyleForCategories, query, projection, options, populate)
    //         let total_count = await DAO.count_data(StyleForCategories, query)
    //         return {
    //             total_count: total_count,
    //             data: response
    //         }

    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    static retrive_data = async (req: any) => {
        try {

            let { _id, style_for_id ,language} = req.query;
            let query = [
                await aggregate_sfc.match_data(language),
                await aggregate_sfc.filter_data(_id, style_for_id),
                await aggregate_sfc.lookup_style_for(),
                await aggregate_sfc.unwind_style_for(),
                await aggregate_sfc.lookup_categories(),
                await aggregate_sfc.unwind_categories(),
                await aggregate_sfc.lookup_subcategories(),
                await aggregate_sfc.unwind_subcategories(),
                await aggregate_sfc.lookup_sub_subcategories(),
                await aggregate_sfc.unwind_sub_subcategories(),
                await aggregate_sfc.lookup_brands(),
                await aggregate_sfc.unwind_brands(),
                await aggregate_sfc.group_data(),
                await aggregate_sfc.sort_data(),
                await aggregate_sfc.skip_data(req.query),
                await aggregate_sfc.limit_data(req.query)
            ]
            let options = { lean: true }
            let response = await DAO.aggregate_data(StyleForCategories, query, options)

            let count_query = [
                await aggregate_sfc.match_data(language),
                await aggregate_sfc.filter_data(_id, style_for_id),
                await aggregate_sfc.lookup_style_for(),
                await aggregate_sfc.unwind_style_for(),
                await aggregate_sfc.lookup_categories(),
                await aggregate_sfc.unwind_categories(),
                await aggregate_sfc.lookup_subcategories(),
                await aggregate_sfc.unwind_subcategories(),
                await aggregate_sfc.lookup_sub_subcategories(),
                await aggregate_sfc.unwind_sub_subcategories(),
                await aggregate_sfc.lookup_brands(),
                await aggregate_sfc.unwind_brands(),
                await aggregate_sfc.group_data()
            ]
            let count_data: any = await DAO.aggregate_data(StyleForCategories, count_query, options)
            return {
                total_count: count_data.length,
                data: response
            }

        }
        catch (err) {
            throw err;
        }
    }


}


class aggregate_sfc {

    static match_data = async (language:string) => {
        return {
            $match: {
                is_deleted: false,
                is_enable:true,
                language:language
            }
        }
    }

    static filter_data = async (_id: string, style_for_id: string) => {
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [_id, undefined] },
                                    { $eq: ["$_id", mongoose.Types.ObjectId(_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [style_for_id, undefined] },
                                    { $eq: ["$style_for_id", mongoose.Types.ObjectId(style_for_id)] }
                                ]
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }
            }
        }
    }

    static lookup_style_for = async () => {
        try {
            return {
                $lookup: {
                    from: "style_fors",
                    let: { style_for_id: "$style_for_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$style_for_id"],
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1
                            }
                        }
                    ],
                    as: "retrive_style_for"
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static unwind_style_for = async () => {
        try {
            return {
                $unwind: {
                    path: "$retrive_style_for",
                    preserveNullAndEmptyArrays: true
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static lookup_categories = async () => {
        try {
            return {
                $lookup: {
                    from: "categories",
                    let: { category_id: "$category_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$category_id"],
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1
                            }
                        }
                    ],
                    as: "retrive_categories"
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static unwind_categories = async () => {
        try {
            return {
                $unwind: {
                    path: "$retrive_categories",
                    preserveNullAndEmptyArrays: true
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static lookup_subcategories = async () => {
        try {
            return {
                $lookup: {
                    from: "subcategories",
                    let: { subcategory_id: "$subcategory_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$subcategory_id"],
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1
                            }
                        }
                    ],
                    as: "retrive_subcategories"
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static unwind_subcategories = async () => {
        try {
            return {
                $unwind: {
                    path: "$retrive_subcategories",
                    preserveNullAndEmptyArrays: true
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static lookup_sub_subcategories = async () => {
        try {
            return {
                $lookup: {
                    from: "sub_subcategories",
                    let: { sub_subcategory_id: "$sub_subcategory_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$sub_subcategory_id"],
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1
                            }
                        }
                    ],
                    as: "fetch_sub_subcategories"
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static unwind_sub_subcategories = async () => {
        try {
            return {
                $unwind: {
                    path: "$fetch_sub_subcategories",
                    preserveNullAndEmptyArrays: true
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static lookup_brands = async () => {
        try {
            return {
                $lookup: {
                    from: "brands",
                    let: { brand_id: "$brand_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$brand_id"],
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1
                            }
                        }
                    ],
                    as: "retrive_brands"
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static unwind_brands = async () => {
        try {
            return {
                $unwind: {
                    path: "$retrive_brands",
                    preserveNullAndEmptyArrays: true
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    static group_data = async () => {
        try {
            return {
                $group: {
                    _id: "$style_for_id",
                    name: { "$first": "$retrive_style_for.name" },
                    inner_data: {
                        "$addToSet": {
                            _id: "$_id",
                            image: "$image",
                            style_for_id: "$retrive_style_for",
                            category_id: "$retrive_categories",
                            subcategory_id: "$retrive_subcategories",
                            sub_subcategory_id: "$fetch_sub_subcategories",
                            brand_id: "$retrive_brands",
                            updated_at: "$updated_at",
                            created_at: "$created_at"
                        }
                    }
                }
            }
        }
        catch (err) {
            throw err;
        }
    }


    static sort_data = async () => {
        try {
            return {
                $sort: {
                    _id: -1
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    static skip_data = async (payload_data: any) => {
        try {

            let { pagination, limit }: any = payload_data
            let set_pagination: number = 0, set_limit: number = 0;

            if (pagination != undefined) { set_pagination = parseInt(pagination) }
            if (limit != undefined) { set_limit = parseInt(limit) }
            return {
                $skip: set_pagination * set_limit
            }

        }
        catch (err) {
            throw err;
        }
    }

    static limit_data = async (payload_data: any) => {
        try {

            let { limit }: any = payload_data
            let set_limit: number = 10;

            if (limit != undefined) { set_limit = parseInt(limit) }
            return {
                $limit: set_limit
            }

        }
        catch (err) {
            throw err;
        }
    }


}


export {
    admin_style_for_categories,
    user_style_for_categories
}