const moment = require('moment');
import mongoose from 'mongoose';

const match_data = async () => {
    try {
        return {
            $match: {
                is_deleted : false
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const filter_data = async (payload_data: any) => {
    try {

        let {
            search, product_id, seller_id, category_id, subcategory_id, sub_subcategory_id,
            brand_id, min_price, max_price, start_date, end_date, out_of_stock
        } = payload_data;
        console.log("payload", payload_data);
        

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
                                            input: "$name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$brand_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$category_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$subcategory_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$prodct_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [product_id, undefined] },
                                    { $eq: ["$_id", mongoose.Types.ObjectId(product_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [seller_id, undefined] },
                                    { $eq: ["$added_by._id", mongoose.Types.ObjectId(seller_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [category_id, undefined] },
                                    { $eq: ["$category_id", mongoose.Types.ObjectId(category_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [subcategory_id, undefined] },
                                    { $eq: ["$subcategory_id", mongoose.Types.ObjectId(subcategory_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [sub_subcategory_id, undefined] },
                                    { $eq: ["$sub_subcategory_id", mongoose.Types.ObjectId(sub_subcategory_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [brand_id, undefined] },
                                    { $eq: ["$brand_id", mongoose.Types.ObjectId(brand_id)] }
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
                                            { $gte: ["$price", Number(min_price)] },
                                            { $lt: ["$price", Number(max_price)] }
                                        ]
                                    }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [start_date, undefined] },
                                            { $eq: [end_date, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lt: ["$created_at", end_date] }
                                        ]
                                    }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [out_of_stock, undefined] },
                                    { $eq: ["$sold", out_of_stock] }
                                ]
                            },
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
                                $eq: ["$_id", "$$product_id"],
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
        };
    }
    catch (err) {
        throw err;
    }
}

const ratings = async () => {
    try {
        return {
            $lookup: {
                from: "reviews",
                let: { product_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$product_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            __v: 0
                        }
                    }
                ],
                as: "retrive_reviews"
            }
        };
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
                prodct_id:{ "$first": "$prodct_id" },
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
                ratings: { "$first": "$retrive_reviews" },
                product_highlights: { "$first": "$retrive_product_highlights" },
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

let sort_by_price = async (req_query:any) => {
    try {
        return {
            $sort: {
                price:-1
            }
        }
    }
    catch (err) {
        throw err;
    }
}


let sort_data = async (req_query:any) => {
    try {
        let { min_price, max_price, start_date, end_date } = req_query;
        if(min_price && max_price){
            console.log('inside --- price')
            return {
              $sort: {
                price:1
              },
            };
        }else if (start_date && end_date) {
          return {
            $sort: {
              created_at: 1,
            },
          };
        } else {
          console.log("not inside --- price");
          return {
            $sort: {
              _id: -1,
              // price:-1
            },
          };
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
  ratings,
  product_highlights,
  group_data,
  sort_data,
  skip_data,
  limit_data,
  sort_by_price,
};