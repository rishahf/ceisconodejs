import mongoose from 'mongoose';

// old filters
// const filter_data = async (payload_data: any) => {
//     try {
//         let { category_id, subcategory_id, sub_subcategory_id, brand_id, min_price, max_price, discount_available, ratings } = payload_data

//         let subcategories = [], sub_subcategories = [], brands = [];
//         if (typeof subcategory_id == "object") {
//             for (let value of subcategory_id) {
//                 subcategories.push(mongoose.Types.ObjectId(value));
//             }
//         }
//         else if (typeof subcategory_id == "string") {
//             subcategories.push(mongoose.Types.ObjectId(subcategory_id));
//         }

//         if (typeof sub_subcategory_id == "object") {
//             for (let value of sub_subcategory_id) {
//                 sub_subcategories.push(mongoose.Types.ObjectId(value));
//             }
//         }
//         else if (typeof sub_subcategory_id == "string") {
//             sub_subcategories.push(mongoose.Types.ObjectId(sub_subcategory_id));
//         }

//         if (typeof brand_id == "object") {
//             for (let value of brand_id) {
//                 brands.push(mongoose.Types.ObjectId(value));
//             }
//         }
//         else if (typeof brand_id == "string") {
//             brands.push(mongoose.Types.ObjectId(brand_id));
//         }

//         return {
//             $redact: {
//                 $cond: {
//                     if: {
//                         $and: [
//                             {
//                                 $or: [
//                                     { $eq: [category_id, undefined] },
//                                     { $in: ["$category_id", category_id] }
//                                 ]
//                             },
//                             {
//                                 $or: [
//                                     { $eq: [subcategory_id, undefined] },
//                                     { $in: ["$subcategory_id", subcategories] }
//                                 ]
//                             },
//                             {
//                                 $or: [
//                                     { $eq: [sub_subcategory_id, undefined] },
//                                     { $in: ["$sub_subcategory_id", sub_subcategories] }
//                                 ]
//                             },
//                             {
//                                 $or: [
//                                     { $eq: [brand_id, undefined] },
//                                     { $in: ["$brand_id", brands] }
//                                 ]
//                             },
//                             {
//                                 $or: [
//                                     {
//                                         $and: [
//                                             { $eq: [min_price, undefined] },
//                                             { $eq: [max_price, undefined] }
//                                         ]
//                                     },
//                                     {
//                                         $and: [
//                                             { $gte: ["$discount_price", Number(min_price)] },
//                                             { $lt: ["$discount_price", Number(max_price)] }
//                                         ]
//                                     }
//                                 ]
//                             },
//                             {
//                                 $or: [
//                                     { $eq: [discount_available, undefined] },
//                                     { $gte: ["$discount_percantage", discount_available] }
//                                 ]
//                             },
//                             {
//                                 $or: [
//                                     { $eq: [ratings, undefined] },
//                                     { $gte: ["$average_rating", ratings] }
//                                 ]
//                             }
//                         ]
//                     },
//                     then: "$$KEEP",
//                     else: "$$PRUNE",
//                 },
//             },
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// };

const match_data = async () => {
    try {
        return {
            $match: {
                is_deleted: false,
                is_visible: true
            }
        }
    }
    catch (err) {
        throw err;
    }
}

// updated filters
const filter_data = async (payload_data: any) => {
    try {
        let {
            category_id: cat_level_1,
            subcategory_id: cat_level_2,
            sub_subcategory_id: cat_level_3,
            brand_id,
            min_price,
            max_price,
            discount_available,
            ratings,
            availablity
        } = payload_data
        console.log(payload_data)
        let brands = [];
        console.log('type of brandid ', typeof brand_id);
        console.log(" brands ", brand_id);
        
        if (typeof brand_id == "object") {
            for (let value of brand_id) {
                brands.push(mongoose.Types.ObjectId(value));
            }
        }
        else if (typeof brand_id == "string") {
            for (let value of brand_id.split(',')) {
              brands.push(mongoose.Types.ObjectId(value));
            }
            // let brands_data:any = brand_id.split(',')
            // brands.push(mongoose.Types.ObjectId(brands_data));
        }
        console.log('brands inside filter query ',brands);
        

        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [cat_level_1, undefined] },
                                    { $eq: ["$category_id", mongoose.Types.ObjectId(cat_level_1)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_2, undefined] },
                                    { $eq: ["$subcategory_id", mongoose.Types.ObjectId(cat_level_2)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_3, undefined] },
                                    { $eq: ["$sub_subcategory_id", mongoose.Types.ObjectId(cat_level_3)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [brand_id, undefined] },
                                    { $in: ["$brand_id", brands] }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [min_price, undefined] },
                                            { $eq: [max_price, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$discount_price", Number(min_price)] },
                                            { $lt: ["$discount_price", Number(max_price)] }
                                        ]
                                    }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [discount_available, undefined] },
                                    { $gte: ["$discount_percantage", Number(discount_available)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [ratings, undefined] },
                                    { $gte: ["$average_rating", Number(ratings)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [availablity, undefined] },
                                    {
                                        $and: [
                                            { $eq: [availablity, "IN_STOCK"] },
                                            { $eq: ["$sold", false] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    }
    catch (err) {
        throw err;
    }
};

const lookup_brands = async () => {
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

const unwind_brands = async () => {
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


const lookup_categories = async () => {
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
                            name: 1,
                            design_type:1
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

const unwind_categories = async () => {
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


const lookup_subcategories = async () => {
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

const unwind_subcategories = async () => {
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

const lookup_sub_subcategories = async () => {
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

const unwind_sub_subcategories = async () => {
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

const lookup_seller = async () => {
    try {
        return {
            $lookup: {
                from: "sellers",
                let: { added_by: "$added_by" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$added_by"],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: "retrive_seller"
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const unwind_seller = async () => {
    try {
        return {
            $unwind: {
                path: "$retrive_seller",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const product_highlights = async () => {
    try {
        return {
            $lookup: {
                from: "product_highlights",
                let: { product_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$product_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            __v: 0
                        }
                    }
                ],
                as: "retrive_product_highlights"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const wishlists = async (user_id: string) => {
    try {
        return {
            $lookup: {
                from: "wishlists",
                let: {
                    product_id: "$_id",
                    user_id: user_id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product_id", "$$product_id"] },
                                    { $eq: ["$user_id", "$$user_id"], }
                                ]
                            },
                        },
                    }
                ],
                as: "wishlists"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const set_data = async () => {
    try {

        return {
            $set: {
                wishlist: {
                    $cond: {
                        if: { $gt: [{ $size: "$wishlists" }, 0] },
                        then: true,
                        else: false
                    }
                }
            }
        }


    }
    catch (err) {
        throw err;
    }
}

const group_data = async () => {
    try {
        return {
            $group: {
                _id: "$_id",
                name: { "$first": "$name" },
                description: { "$first": "$description" },
                product_type: { "$first": "$product_type" },
                added_by: { "$first": "$retrive_seller" },
                parcel_id: { "$first": "$parcel_id" },
                brand_id: { "$first": "$retrive_brands" },
                category_id: { "$first": "$retrive_categories" },
                subcategory_id: { "$first": "$retrive_subcategories" },
                sub_subcategory_id: { "$first": "$fetch_sub_subcategories" },
                images: { "$first": "$images" },
                quantity: { "$first": "$quantity" },
                price: { "$first": "$price" },
                discount_percantage: { "$first": "$discount_percantage" },
                discount: { "$first": "$discount" },
                discount_price: { "$first": "$discount_price" },
                total_reviews: { "$first": "$total_reviews" },
                total_ratings: { "$first": "$total_ratings" },
                average_rating: { "$first": "$average_rating" },
                one_star_ratings: { "$first": "$one_star_ratings" },
                two_star_ratings: { "$first": "$two_star_ratings" },
                three_star_ratings: { "$first": "$three_star_ratings" },
                four_star_ratings: { "$first": "$four_star_ratings" },
                five_star_ratings: { "$first": "$five_star_ratings" },
                sold: { "$first": "$sold" },
                product_highlights: { "$first": "$retrive_product_highlights" },
                wishlist : { "$first": "$wishlist" },
                is_blocked: { "$first": "$is_blocked" },
                is_deleted: { "$first": "$is_deleted" },
                updated_at: { "$first": "$updated_at" },
                created_at: { "$first": "$created_at" }
            }
        }
    }
    catch (err) {
        throw err;
    }
}


let sort_data = async (payload_data: any) => {
    try {

        let { sort_by } = payload_data
        if (sort_by == 'WHATS_NEW') {
            return {
                $sort: {
                    _id: -1
                }
            }
        }
        else if (sort_by == 'POPULAR') {
            return {
                $sort: {
                    _id: -1
                }
            }
        }
        else if (sort_by == 'PRICE_HIGH_TO_LOW') {
            return {
                $sort: {
                    discount_price: -1,
                    updated_at: -1
                }
            }
        }
        else if (sort_by == 'PRICE_LOW_TO_HIGH') {
            return {
                $sort: {
                    discount_price: 1,
                    updated_at: -1
                }
            }
        }
        else {
            return {
                $sort: {
                    _id: -1
                }
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const skip_data = async (payload_data: any) => {
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

const limit_data = async (payload_data: any) => {
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

let sort_highest_price = async () => {
    try {
        return {
            $sort: { discount_price: -1 }
        }
    }
    catch (err) {
        throw err;
    }
}


export {
    match_data,
    filter_data,
    lookup_brands,
    unwind_brands,
    lookup_categories,
    unwind_categories,
    lookup_subcategories,
    unwind_subcategories,
    lookup_sub_subcategories,
    unwind_sub_subcategories,
    lookup_seller,
    unwind_seller,
    product_highlights,
    wishlists,
    set_data,
    group_data,
    sort_data,
    skip_data,
    limit_data,
    sort_highest_price
}