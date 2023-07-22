import mongoose from "mongoose";
declare const match_data: (user_id: string) => Promise<{
    $match: {
        added_by: mongoose.Types.ObjectId;
    };
}>;
declare const match_product_id: (_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
    };
}>;
declare const match_variant_product_id: (_id: string) => Promise<{
    $match: {
        product_id_1: mongoose.Types.ObjectId;
    };
}>;
declare const lookup_variants: () => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $and: {
                        $eq: string[];
                    }[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                name: number;
                images: number;
                price: number;
                discount: number;
                colour: number;
                size: number;
                discount_percantage: number;
                discount_price: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_variants: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const redact_filter_data: (req_query: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $and: {
                    $or: ({
                        $eq: any[];
                        $in?: undefined;
                    } | {
                        $in: (string | any[])[];
                        $eq?: undefined;
                    })[];
                }[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const lookup_data: (collection: any, match_id: any) => Promise<{
    $lookup: {
        from: any;
        let: {
            new_id: any;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                _id: number;
                name: number;
            };
            $match?: undefined;
        })[];
        as: any;
    };
}>;
declare const unwind_data: (match_id: any) => Promise<{
    $unwind: {
        path: any;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const redact_data: (search: string) => Promise<{
    $redact: {
        $cond: {
            if: {
                $or: ({
                    $eq: string[];
                    $regexMatch?: undefined;
                } | {
                    $regexMatch: {
                        input: string;
                        regex: string;
                        options: string;
                    };
                    $eq?: undefined;
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const redact_product: (search: string) => Promise<{
    $redact: {
        $cond: {
            if: {
                $or: ({
                    $eq: string[];
                    $regexMatch?: undefined;
                } | {
                    $regexMatch: {
                        input: string;
                        regex: string;
                        options: string;
                    };
                    $eq?: undefined;
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const redact_products_search: (search: string, field_Search: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $or: ({
                    $eq: string[];
                    $regexMatch?: undefined;
                } | {
                    $regexMatch: {
                        input: any;
                        regex: string;
                        options: string;
                    };
                    $eq?: undefined;
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const redact_product_type: (search: string) => Promise<{
    $redact: {
        $cond: {
            if: {
                $or: ({
                    $eq: string[];
                    $regexMatch?: undefined;
                } | {
                    $regexMatch: {
                        input: string;
                        regex: string;
                        options: string;
                    };
                    $eq?: undefined;
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const redact_match_price: (min_price: any, max_price: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $and: ({
                    $or: ({
                        $eq: number[];
                        $gte?: undefined;
                    } | {
                        $gte: (string | number)[];
                        $eq?: undefined;
                    })[];
                } | {
                    $or: ({
                        $eq: number[];
                        $lte?: undefined;
                    } | {
                        $lte: (string | number)[];
                        $eq?: undefined;
                    })[];
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const redact_match_data: (min_value: any, field_to_search: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $and: {
                    $or: ({
                        $eq: number[];
                        $gte?: undefined;
                    } | {
                        $gte: any[];
                        $eq?: undefined;
                    })[];
                }[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare let sort_data: () => Promise<{
    $sort: {
        created_at: number;
    };
}>;
declare let sort_by_price: () => Promise<{
    $sort: {
        price: number;
    };
}>;
declare const skip_data: (pagination: any, limit: any) => Promise<{
    $skip: number;
}>;
declare const limit_data: (limit: any) => Promise<{
    $limit: number;
}>;
declare const lookup_reviews_data: () => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
        }[];
        as: string;
    };
}>;
declare const set_review_data: () => Promise<{
    $set: {
        fetch_1_rating: {
            $filter: {
                input: string;
                as: string;
                cond: {
                    $eq: string[];
                };
            };
        };
    };
}>;
declare const set_ratings: () => Promise<{
    $set: {
        one_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        two_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        three_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        four_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        five_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
    };
}>;
declare const group_ratings: (fetch_1_rating: any) => Promise<{
    $group: {
        _id: string;
        rate: {
            $first: any;
        };
        star_ratings: {
            $first: {
                $size: any;
            };
        };
    };
}>;
declare const lookup_common_collection: (collection_name: any) => Promise<{
    $lookup: {
        from: any;
        let: {
            product_id: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
        }[];
        as: any;
    };
}>;
declare const group_variants_data: () => Promise<{
    $group: {
        _id: string;
        product_id: {
            $first: string;
        };
        name: {
            $first: string;
        };
        images: {
            $first: string;
        };
        size: {
            $first: string;
        };
        colour: {
            $first: string;
        };
        price: {
            $first: string;
        };
        discount_percantage: {
            $first: string;
        };
        discount: {
            $first: string;
        };
        discount_price: {
            $first: string;
        };
    };
}>;
export { redact_filter_data, match_data, match_product_id, lookup_variants, unwind_variants, group_variants_data, match_variant_product_id, lookup_data, unwind_data, redact_products_search, redact_data, redact_product, redact_product_type, redact_match_price, redact_match_data, sort_data, sort_by_price, skip_data, limit_data, group_ratings, lookup_reviews_data, set_review_data, set_ratings, lookup_common_collection, };
