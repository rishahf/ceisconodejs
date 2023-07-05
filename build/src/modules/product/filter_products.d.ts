declare const match_data: () => Promise<{
    $match: {
        is_deleted: boolean;
        is_visible: boolean;
    };
}>;
declare const filter_data: (payload_data: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $and: ({
                    $or: ({
                        $eq: any[];
                        $in?: undefined;
                    } | {
                        $in: (string | any[])[];
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
                            $lt?: undefined;
                        } | {
                            $lt: (string | number)[];
                            $gte?: undefined;
                        })[];
                    })[];
                } | {
                    $or: ({
                        $eq: any[];
                        $gte?: undefined;
                    } | {
                        $gte: (string | number)[];
                        $eq?: undefined;
                    })[];
                } | {
                    $or: ({
                        $eq: any[];
                        $and?: undefined;
                    } | {
                        $and: {
                            $eq: any[];
                        }[];
                        $eq?: undefined;
                    })[];
                })[];
            };
            then: string;
            else: string;
        };
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
                design_type: number;
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
declare const product_highlights: () => Promise<{
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
                __v: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const wishlists: (user_id: string) => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
            user_id: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $and: {
                        $eq: string[];
                    }[];
                };
            };
        }[];
        as: string;
    };
}>;
declare const set_data: () => Promise<{
    $set: {
        wishlist: {
            $cond: {
                if: {
                    $gt: (number | {
                        $size: string;
                    })[];
                };
                then: boolean;
                else: boolean;
            };
        };
    };
}>;
declare const group_data: () => Promise<{
    $group: {
        _id: string;
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
        product_highlights: {
            $first: string;
        };
        wishlist: {
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
declare let sort_data: (payload_data: any) => Promise<{
    $sort: {
        _id: number;
        discount_price?: undefined;
        updated_at?: undefined;
    };
} | {
    $sort: {
        discount_price: number;
        updated_at: number;
        _id?: undefined;
    };
}>;
declare const skip_data: (payload_data: any) => Promise<{
    $skip: number;
}>;
declare const limit_data: (payload_data: any) => Promise<{
    $limit: number;
}>;
declare let sort_highest_price: () => Promise<{
    $sort: {
        discount_price: number;
    };
}>;
export { match_data, filter_data, lookup_brands, unwind_brands, lookup_categories, unwind_categories, lookup_subcategories, unwind_subcategories, lookup_sub_subcategories, unwind_sub_subcategories, lookup_seller, unwind_seller, product_highlights, wishlists, set_data, group_data, sort_data, skip_data, limit_data, sort_highest_price };
