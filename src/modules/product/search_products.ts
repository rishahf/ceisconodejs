import mongoose from "mongoose";
const Schema = mongoose.Schema;

const match = async (product_id: string, subcategory_id: string) => {
    try {
        return {
            $match: {
                _id: { $ne: mongoose.Types.ObjectId(product_id) },
                subcategory_id: mongoose.Types.ObjectId(subcategory_id),
                is_deleted : false,
                is_visible:true
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const remove_deleted = async () => {
    try {
        return {
            $match: {
                is_deleted : false,
                is_visible:true,
            }
        }
    }
    catch (err) {
        throw err;
    }
}


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

const lookup_size = async () => {
    try {
        return {
            $lookup: {
                from: "sizes",
                let: { size_id: "$size_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$size_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            category_id:1,
                            size: 1
                        }
                    }
                ],
                as: "size_id"
            }
        };
    }
    catch (err) {
        throw err;
    }
  }
  
  const unwind_size = async () => {
    try {
        return {
            $unwind: {
                path: "$size_id",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
  }
  

const filter_data = async (payload_data: any) => {
    try {
        let { search, min_price, max_price } = payload_data
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [search, undefined] },
                                    {
                                        $regexMatch: {
                                            input: "$retrive_subcategories.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    }
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$name",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // },
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$retrive_brands.name",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // },
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$fetch_sub_subcategories.name",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // }
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
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
};


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
                colour: { $first: "$colour" },
                size_id: { $first: "$size_id" },
                parent_id: { $first: "$parent_id" },
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


let sort_data = async () => {
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

export {
    match,
    remove_deleted,
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
    lookup_size,
    unwind_size,
    filter_data,
    group_data,
    sort_data,
    skip_data,
    limit_data
}