import mongoose from 'mongoose';

const match_data = async (user_id: string) => {
    try {

        return {
            $match: {
                added_by: mongoose.Types.ObjectId(user_id)
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const lookup_data = async (collection: any, match_id: any) => {
    var field_name = match_id.slice(1, match_id.length);
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
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$product_type_id.name",
                                    regex: search,
                                    options: 'i'
                                }
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
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: 'i'
                                }
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
}

const redact_brand = async (search: string) => {
    try {

        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
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
}

const group_data = async () => {
    try {

        return {
            $group: {
                _id: "$_id",
                created_at: { "$first": "$created_at" },
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
            $sort: { created_at: -1 }
        }

    }
    catch (err) {
        throw err;
    }
}

//redact_product_type
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
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
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
}

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

export {
    match_data,

    lookup_data,
    unwind_data,

    redact_data,
    redact_product,
    redact_brand,
    redact_product_type,

    group_data,
    sort_data,

    lookup_reviews_data,
    set_review_data

}