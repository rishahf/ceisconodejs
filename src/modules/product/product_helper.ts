import mongoose from "mongoose";
const Schema = mongoose.Schema;

const match_data = async (user_id: string) => {
    try {
        return {
            $match: {
                added_by: mongoose.Types.ObjectId(user_id),
            },
        };
    } catch (err) {
        throw err;
    }
};

const match_product_id = async (_id: string) => {
    try {
        return {
            $match: {
                _id: mongoose.Types.ObjectId(_id),
            },
        };
    } catch (err) {
        throw err;
    }
};

const match_variant_product_id = async (_id: string) => {
    try {
        return {
            $match: {
                product_id_1: mongoose.Types.ObjectId(_id),
            },
        };
    } catch (err) {
        throw err;
    }
};

const lookup_variants = async () => {
  try {
    return {
      $lookup: {
        from: "products",
        let: { product_id: "$product_id_2" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$_id", "$$product_id"],
                  },
                //   {
                //     $eq: ["$is_visible", true],
                //   }
                ],
              },
            },
          },
          {
            $project: {
              name: 1,
              images: 1,
              price: 1,
              discount: 1,
              discount_percantage: 1,
              discount_price: 1,
            },
          },
        ],
        as: "products",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_variants = async () => {
  // var path_check = "$"+match_id
  // console.log("path_check -> ", path_check)
  try {
    return {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

const redact_filter_data = async (req_query: any) => {
    try {
        // console.log('req_query.sub_subcategory_id', req_query.sub_subcategory_id)
        let new_ids_array = [];
        if (typeof req_query.subcategory_id == "object") {
            for (let value of req_query.subcategory_id) {
                new_ids_array.push(mongoose.Types.ObjectId(value));
            }
        }
        else if (typeof req_query.subcategory_id == "string") {
            new_ids_array.push(mongoose.Types.ObjectId(req_query.subcategory_id));
        }

        let _ids_array = [];

        if (typeof req_query.sub_subcategory_id == "object") {
            // console.log("Case 1")
            for (let value of req_query.sub_subcategory_id) {
                _ids_array.push(mongoose.Types.ObjectId(value));
            }
        }
        else if (typeof req_query.sub_subcategory_id == "string") {
            // console.log("Case 2")
            _ids_array.push(mongoose.Types.ObjectId(req_query.sub_subcategory_id));
        }

        let brand_ids_array = [];
        if (typeof req_query.brand_id == "object") {
            // console.log("Case 1")
            for (let value of req_query.brand_id) {
                brand_ids_array.push(mongoose.Types.ObjectId(value));
            }
        }
        else if (typeof req_query.brand_id == "string") {
            // console.log("Case 2")
            brand_ids_array.push(mongoose.Types.ObjectId(req_query.brand_id));
        }

        // console.log('_Ids----- ',_ids_array)
        // console.log("NEW ARRAY as ObjectId : -- > ", new_ids_array)
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [req_query.subcategory_id, undefined] },
                                    { $in: ["$subcategory_id", new_ids_array] },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [req_query.sub_subcategory_id, undefined] },
                                    { $in: ["$sub_subcategory_id", _ids_array] },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [req_query.brand_id, undefined] },
                                    { $in: ["$brand_id", brand_ids_array] },
                                ],
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };


    } catch (err) {
        throw err;
    }
};

const lookup_data = async (collection: any, match_id: any) => {
    var field_name = match_id.slice(1, match_id.length);
    // console.log("FIELD NAME--------",field_name)
    try {
        return {
            $lookup: {
                from: collection,
                let: { new_id: match_id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$new_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        },
                    },
                ],
                as: field_name,
            },
        };
    } catch (err) {
        throw err;
    }
};

const unwind_data = async (match_id: any) => {
    // var path_check = "$"+match_id
    // console.log("path_check -> ", path_check)
    try {
        return {
            $unwind: {
                path: match_id,
                preserveNullAndEmptyArrays: true,
            },
        };
    } catch (err) {
        throw err;
    }
};

const redact_data = async (search: string) => {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$subcategory_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$sub_subcategory_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    } catch (err) {
        throw err;
    }
};

const redact_product = async (search: string) => {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$subcategory_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
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

const redact_products_search = async (search: string, field_Search: any) => {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: field_Search,
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    } catch (err) {
        throw err;
    }
};

// const redact_brand = async (search: string) => {
//   try {
//     return {
//       $redact: {
//         $cond: {
//           if: {
//             $or: [
//               { $eq: [search, undefined] },
//               {
//                 $regexMatch: {
//                   input: "$brand_id.name",
//                   regex: search,
//                   options: "i",
//                 },
//               },
//               {
//                 $regexMatch: {
//                   input: "$name",
//                   regex: search,
//                   options: "i",
//                 },
//               },
//             ],
//           },
//           then: "$$KEEP",
//           else: "$$PRUNE",
//         },
//       },
//     };
//   } catch (err) {
//     throw err;
//   }
// };

const redact_product_type = async (search: string) => {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$product_type_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    } catch (err) {
        throw err;
    }
};

const redact_match_price = async (min_price: any, max_price: any) => {
    try {
        var min = min_price ? parseFloat(min_price) : undefined;
        var max = max_price ? parseFloat(max_price) : undefined;
        // console.log(typeof(max), "TypeOf Maximum - Minimum " , typeof(min) )
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    {
                                        $eq: [min, undefined],
                                    },
                                    {
                                        $gte: ["$price", min],
                                    },
                                ],
                            },
                            {
                                $or: [
                                    {
                                        $eq: [max, undefined],
                                    },
                                    {
                                        $lte: ["$price", max],
                                    },
                                ],
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    } catch (err) {
        throw err;
    }
};

const redact_match_data = async (min_value: any, field_to_search: any) => {
    try {
        var min = min_value ? parseFloat(min_value) : undefined;
        // var max = max_price ? parseFloat(max_price) : undefined;
        // console.log(typeof(max), "TypeOf Maximum - Minimum " , typeof(min) )
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    {
                                        $eq: [min, undefined],
                                    },
                                    {
                                        $gte: [field_to_search, min],
                                    },
                                ],
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    } catch (err) {
        throw err;
    }
};

// const redact_example_filter = async (search: any, field: string) => {
//   console.log("FIELD: ", field, "SEARCH: ", search);
//   console.log("TYPE OF : ", typeof search[0]);
//   let search_id = mongoose.Types.ObjectId(search);
//   try {
//     return {
//       $redact: {
//         $cond: {
//           if: {
//             $or: [{ $eq: [search, undefined] }, { $in: [field, search_id] }],
//           },
//           then: "$$KEEP",
//           else: "$$PRUNE",
//         },
//       },
//     };
//   } catch (err) {
//     throw err;
//   }
// };

let sort_data = async () => {
    try {
        return {
            $sort: { created_at: -1 },
        };
    } catch (err) {
        throw err;
    }
};

let sort_by_price = async () => {
    try {
        return {
            $sort: { price: 1 },
        };
    } catch (err) {
        throw err;
    }
};

const skip_data = async (pagination: any, limit: any) => {
    try {
        // console.log("-------------pagination------",pagination)
        // console.log("-------------limit------",limit)

        if (
            pagination != undefined ||
            (pagination != null && limit != undefined) ||
            limit != null
        ) {
            // console.log("----skip_data-case_1---")

            if (limit == undefined) {
                // console.log("----skip_data-case_1.1---")
                return { $skip: parseInt(pagination) * 10 };
            } else {
                // console.log("----skip_data-case_1.2---")
                return { $skip: parseInt(pagination) * parseInt(limit) };
            }
        } else {
            // console.log("----skip_data-case_3---")
            return { $skip: 0 };
        }
    } catch (err) {
        throw err;
    }
};

const limit_data = async (limit: any) => {
    try {
        if (limit != undefined || limit != null) {
            // console.log("----limit_data-case_1---")
            return { $limit: parseInt(limit) };
        } else {
            // console.log("----limit_data-case_2---")
            return { $limit: 10 };
        }
    } catch (err) {
        throw err;
    }
};

const lookup_reviews_data = async () => {
    try {
        return {
            $lookup: {
                from: "reviews",
                let: { product_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$product_id"],
                            },
                        },
                    },
                ],
                as: "ratings",
            },
        };
    } catch (err) {
        throw err;
    }
};

const set_review_data = async () => {
    return {
        $set: {
            fetch_1_rating: {
                $filter: {
                    input: "$ratings",
                    as: "rating_data",
                    cond: { $eq: ["$$rating_data.product_id", "$_id"] },
                },
            },
        },
    };
};

const set_ratings = async () => {
    return {
        $set: {
            one_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 1] },
                            ],
                        },
                    },
                },
            },
            two_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 2] },
                            ],
                        },
                    },
                },
            },
            three_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 3] },
                            ],
                        },
                    },
                },
            },
            four_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 4] },
                            ],
                        },
                    },
                },
            },
            five_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 5] },
                            ],
                        },
                    },
                },
            },
        },
    };
};

const multiply_counts = async () => {
    return {
        $set: {
            one_multi: {
                $multiply: ['$one_rate_count', 1]
            },
            two_multi: {
                $multiply: ['$two_rate_count', 2]
            },
            three_multi: {
                $multiply: ['$three_rate_count', 3]
            },
            four_multi: {
                $multiply: ['$four_rate_count', 4]
            },
            five_multi: {
                $multiply: ['$five_rate_count', 5]
            }
        }
    }
}

const calculate_rating_sums = async () => {
    return {
        $set: {
            total_user_ratings: {
                $sum: ['$one_rate_count', '$two_rate_count', '$three_rate_count', '$four_rate_count', '$five_rate_count']
            },
            total_rating_count: {
                $sum: ['$one_multi', '$two_multi', '$three_multi', '$four_multi', '$five_multi']
            },
            // avg_ratings: { $avg: { $divide: [ "$total_ratings_count", "$total_user_ratings" ] } },

        }
    }
}

const calculate_avg = async () => {
    return {
        $set: {
            avg_ratings: {
                $cond: [
                    { $eq: ["$total_user_ratings", 0] }, 0,
                    { $avg: { $divide: ["$total_rating_count", "$total_user_ratings"] } }
                ]
            }
        }
    }
}

const group_ratings = async (fetch_1_rating: any) => {
    try {
        return {
            $group: {
                _id: "$_id",
                rate: { $first: fetch_1_rating },
                star_ratings: {
                    $first: { $size: fetch_1_rating },
                },
                // ,
                // "4_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 4] }, 1, 0],
                //   },
                // },
                // "3_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 3] }, 1, 0],
                //   },
                // },
                // "2_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 2] }, 1, 0],
                //   },
                // },
                // "1_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 1] }, 1, 0],
                //   },
                // },
            },
        };
    } catch (err) {
        throw err;
    }
};

const lookup_common_collection = async (collection_name: any) => {
    try {
        return {
            $lookup: {
                from: collection_name,
                let: { product_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$product_id"],
                            },
                        },
                    },
                    // {
                    //   $project: {
                    //     _id:1,
                    //     key: 1,
                    //     value: 1,
                    //   },
                    // },
                ],
                as: collection_name,
            },
        };
    } catch (err) {
        throw err;
    }
};

const group_variants_data = async () => {
  try {
    return {
      $group: {
        _id: "$_id",
        // variants: { $first: "$products" },
        product_id: { $first: "$products._id" },
        name: { $first: "$products.name" },
        images: { $first: "$products.images" },
        price: { $first: "$products.price" },
        discount_percantage: { $first: "$products.discount_percantage" },
        discount: { $first: "$products.discount" },
        discount_price: { $first: "$products.discount_price" },
      },
    };
  } catch (err) {
    throw err;
  }
};

export {
    redact_filter_data,
    match_data,
    match_product_id,
    lookup_variants,
    unwind_variants,
    group_variants_data,
    match_variant_product_id,
    lookup_data,
    unwind_data,
    redact_products_search,
    redact_data,
    redact_product,
    // redact_brand,
    redact_product_type,
    redact_match_price,
    redact_match_data,
    sort_data,
    sort_by_price,
    skip_data,
    limit_data,
    group_ratings,
    lookup_reviews_data,
    set_review_data,
    set_ratings,
    lookup_common_collection,
};
