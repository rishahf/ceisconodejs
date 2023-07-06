import mongoose from "mongoose";
declare const match_data: (seller_id: string) => Promise<{
    $match: {
        added_by: mongoose.Types.ObjectId;
        is_deleted: boolean;
    };
}>;
declare const match_product_id: (_id: string) => Promise<{
    $match: {
        product_id: mongoose.Types.ObjectId;
    };
}>;
declare const match_product_id_1_2: (_id: string) => Promise<{
    $match: {
        product_id_1: mongoose.Types.ObjectId;
    };
}>;
declare const lookup_brands: () => Promise<{
    $lookup: {
        from: string;
        let: {
            brand_id: string;
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
                name: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_brands: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_variant_: () => Promise<{
    $lookup: {
        from: string;
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                name: number;
                images: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const lookup_categories: () => Promise<{
    $lookup: {
        from: string;
        let: {
            category_id: string;
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
                name: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_categories: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_subcategories: () => Promise<{
    $lookup: {
        from: string;
        let: {
            subcategory_id: string;
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
                name: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_subcategories: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_sub_subcategories: () => Promise<{
    $lookup: {
        from: string;
        let: {
            sub_subcategory_id: string;
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
                name: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_sub_subcategories: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_seller: () => Promise<{
    $lookup: {
        from: string;
        let: {
            added_by: string;
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
                name: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_seller: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const filter_data: (payload_data: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $and: ({
                    $or: ({
                        $eq: any[];
                        $regexMatch?: undefined;
                    } | {
                        $regexMatch: {
                            input: string;
                            regex: any;
                            options: string;
                        };
                        $eq?: undefined;
                    })[];
                } | {
                    $or: ({
                        $and: {
                            $eq: any[];
                        }[];
                    } | {
                        $and: ({
                            $gte: (string | number)[];
                            $lte?: undefined;
                        } | {
                            $lte: (string | number)[];
                            $gte?: undefined;
                        })[];
                    })[];
                } | {
                    $or: ({
                        $and: {
                            $eq: any[];
                        }[];
                    } | {
                        $and: ({
                            $gte: any[];
                            $lt?: undefined;
                        } | {
                            $lt: any[];
                            $gte?: undefined;
                        })[];
                    })[];
                } | {
                    $or: ({
                        $eq: any[];
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
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        prodct_id: {
            $first: string;
        };
        name: {
            $first: string;
        };
        description: {
            $first: string;
        };
        product_type: {
            $first: string;
        };
        added_by: {
            $first: string;
        };
        parcel_id: {
            $first: string;
        };
        brand_id: {
            $first: string;
        };
        category_id: {
            $first: string;
        };
        subcategory_id: {
            $first: string;
        };
        sub_subcategory_id: {
            $first: string;
        };
        images: {
            $first: string;
        };
        quantity: {
            $first: string;
        };
        price: {
            $first: string;
        };
        tax_percantage: {
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
        total_reviews: {
            $first: string;
        };
        total_ratings: {
            $first: string;
        };
        average_rating: {
            $first: string;
        };
        one_star_ratings: {
            $first: string;
        };
        two_star_ratings: {
            $first: string;
        };
        three_star_ratings: {
            $first: string;
        };
        four_star_ratings: {
            $first: string;
        };
        five_star_ratings: {
            $first: string;
        };
        sold: {
            $first: string;
        };
        is_blocked: {
            $first: string;
        };
        is_deleted: {
            $first: string;
        };
        updated_at: {
            $first: string;
        };
        created_at: {
            $first: string;
        };
    };
}>;
declare let sort_data1: (req_data: any) => Promise<{
    $sort: {
        price: number;
        _id?: undefined;
    };
} | {
    $sort: {
        _id: number;
        price?: undefined;
    };
}>;
declare let sort_data: () => Promise<{
    $sort: {
        _id: number;
    };
}>;
declare const skip_data: (payload_data: any) => Promise<{
    $skip: number;
}>;
declare const limit_data: (payload_data: any) => Promise<{
    $limit: number;
}>;
declare const lookup_variant_head: () => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
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
                name: number;
                images: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_variant_head: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
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
                    $eq: string[];
                };
            };
            $project?: undefined;
            $group?: undefined;
        } | {
            $project: {
                name: number;
                images: number;
            };
            $match?: undefined;
            $group?: undefined;
        } | {
            $group: {
                _id: string;
                product_name: {
                    $first: string;
                };
                product_images: {
                    $first: string;
                };
            };
            $match?: undefined;
            $project?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_variant: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const group_variants_data: () => Promise<{
    $group: {
        _id: string;
        product_id: {
            $first: string;
        };
        product_name: {
            $first: string;
        };
        product_images: {
            $first: string;
        };
        created_at: {
            $first: string;
        };
    };
}>;
export { match_data, match_product_id, match_product_id_1_2, lookup_brands, unwind_brands, lookup_categories, unwind_categories, lookup_subcategories, unwind_subcategories, lookup_sub_subcategories, unwind_sub_subcategories, lookup_seller, unwind_seller, lookup_variant_, lookup_variant_head, unwind_variant_head, lookup_variants, unwind_variant, filter_data, group_data, group_variants_data, sort_data, sort_data1, skip_data, limit_data, };
