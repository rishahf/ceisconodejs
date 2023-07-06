import mongoose from "mongoose";
declare const match: (user_id: string) => Promise<{
    $match: {
        user_id: mongoose.Types.ObjectId;
    };
}>;
declare const match_delete: () => Promise<{
    $match: {
        is_deleted: boolean;
    };
}>;
declare const set_type: () => Promise<{
    $set: {
        type: string;
    };
}>;
declare const set_seller_type: () => Promise<{
    $set: {
        type: string;
    };
}>;
declare const lookup_sellers: () => Promise<{
    $lookup: {
        from: string;
        let: {
            seller_id: string;
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
                image: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_sellers: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_users: () => Promise<{
    $lookup: {
        from: string;
        let: {
            user_id: string;
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
                profile_pic: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_users: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_products: () => Promise<{
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
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $project: {
                _id: number;
                name: number;
                description: number;
                images: number;
                category_id: number;
                prodct_id: number;
                quantity: number;
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $lookup: {
                from: string;
                localField: string;
                foreignField: string;
                as: string;
            };
            $match?: undefined;
            $project?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $unwind: string;
            $match?: undefined;
            $project?: undefined;
            $lookup?: undefined;
            $group?: undefined;
        } | {
            $group: {
                _id: string;
                prd_id: {
                    $first: string;
                };
                name: {
                    $first: string;
                };
                description: {
                    $first: string;
                };
                images: {
                    $first: string;
                };
                product_quantity: {
                    $first: string;
                };
                category_id: {
                    $first: string;
                };
                reviews: {
                    $first: string;
                };
                total_ratings: {
                    $first: {
                        $sum: string;
                    };
                };
                total_reviews: {
                    $first: {
                        $size: string;
                    };
                };
                total_avg_rating: {
                    $first: {
                        $avg: string;
                    };
                };
            };
            $match?: undefined;
            $project?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
        })[];
        as: string;
    };
}>;
declare const lookup_products_review: () => Promise<{
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
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $project: {
                _id: number;
                name: number;
                description: number;
                images: number;
                category_id: number;
                prodct_id: number;
                quantity: number;
                discount_price: number;
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $lookup: {
                from: string;
                localField: string;
                foreignField: string;
                as: string;
            };
            $match?: undefined;
            $project?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $unwind: string;
            $match?: undefined;
            $project?: undefined;
            $lookup?: undefined;
            $group?: undefined;
        } | {
            $group: {
                _id: string;
                prd_id: {
                    $first: string;
                };
                name: {
                    $first: string;
                };
                description: {
                    $first: string;
                };
                images: {
                    $first: string;
                };
                product_price: {
                    $first: string;
                };
                category_name: {
                    $first: string;
                };
            };
            $match?: undefined;
            $project?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_products: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_order: () => Promise<{
    $lookup: {
        from: string;
        let: {
            order_id: string;
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
declare const unwind_orders: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_order_products: () => Promise<{
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
            $lookup?: undefined;
        } | {
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
                    $lookup?: undefined;
                    $unwind?: undefined;
                    $group?: undefined;
                } | {
                    $project: {
                        _id: number;
                        name: number;
                        description: number;
                        images: number;
                        category_id: number;
                        prodct_id: number;
                        quantity: number;
                    };
                    $match?: undefined;
                    $lookup?: undefined;
                    $unwind?: undefined;
                    $group?: undefined;
                } | {
                    $lookup: {
                        from: string;
                        localField: string;
                        foreignField: string;
                        as: string;
                    };
                    $match?: undefined;
                    $project?: undefined;
                    $unwind?: undefined;
                    $group?: undefined;
                } | {
                    $unwind: string;
                    $match?: undefined;
                    $project?: undefined;
                    $lookup?: undefined;
                    $group?: undefined;
                } | {
                    $group: {
                        _id: string;
                        prd_id: {
                            $first: string;
                        };
                        name: {
                            $first: string;
                        };
                        description: {
                            $first: string;
                        };
                        images: {
                            $first: string;
                        };
                        product_quantity: {
                            $first: string;
                        };
                        category_id: {
                            $first: string;
                        };
                    };
                    $match?: undefined;
                    $project?: undefined;
                    $lookup?: undefined;
                    $unwind?: undefined;
                })[];
                as: string;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const lookup_order_product_review: () => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
            order_product_id: string;
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
declare const unwind_order_products: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_order_review: () => Promise<{
    $lookup: {
        from: string;
        let: {
            order_id: string;
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
declare const unwind_order_review: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_Rev_sellers: () => Promise<{
    $lookup: {
        from: string;
        let: {
            seller_id: string;
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
                image: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_Rev_sellers: () => Promise<{
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
                        $eq: any[];
                        $in?: undefined;
                    } | {
                        $in: (string | any[])[];
                        $eq?: undefined;
                    })[];
                } | {
                    $or: ({
                        $eq: any[];
                        $and?: undefined;
                    } | {
                        $and: ({
                            $gte: (string | number)[];
                            $lte?: undefined;
                        } | {
                            $lte: (string | number)[];
                            $gte?: undefined;
                        })[];
                        $eq?: undefined;
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
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const filter_reviews_data: (payload_data: any) => Promise<{
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
                            $gte: any[];
                            $lt?: undefined;
                        } | {
                            $lt: any[];
                            $gte?: undefined;
                        })[];
                    })[];
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const filter_search: (payload_data: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $and: {
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
                }[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const filter_sorting: (payload: any) => Promise<{
    $sort: {
        _id: number;
        created_at?: undefined;
    };
} | {
    $sort: {
        created_at: number;
        _id?: undefined;
    };
}>;
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        order_id: {
            $first: string;
        };
        orderedId: {
            $first: string;
        };
        user_id: {
            $first: string;
        };
        seller_id: {
            $first: string;
        };
        product_id: {
            $first: string;
        };
        sellerId: {
            $first: string;
        };
        categoryId: {
            $first: string;
        };
        product_quantity: {
            $first: string;
        };
        total_price: {
            $first: string;
        };
        total_earnings: {
            $first: string;
        };
        admin_commision: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        payment_status: {
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
declare const group_orderReview_data: () => Promise<{
    $group: {
        _id: string;
        title: {
            $first: string;
        };
        description: {
            $first: string;
        };
        ratings: {
            $first: string;
        };
        images: {
            $first: string;
        };
        user_id: {
            $first: string;
        };
        seller_id: {
            $first: string;
        };
        product_id: {
            $first: string;
        };
        product_order_id: {
            $first: string;
        };
        price: {
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
declare let sort_data: () => Promise<{
    $sort: {
        updated_at: number;
    };
}>;
declare let sorting_data: (data: any) => Promise<{
    $sort: {
        price: number;
        updated_at?: undefined;
    };
} | {
    $sort: {
        updated_at: number;
        price?: undefined;
    };
}>;
declare let sort_order_data: () => Promise<{
    $sort: {
        updated_at: number;
    };
}>;
declare let sortOrder_data: (data: any) => Promise<{
    $sort: {
        total_price: number;
        updated_at?: undefined;
    };
} | {
    $sort: {
        updated_at: number;
        total_price?: undefined;
    };
}>;
declare const skip_data: (payload_data: any) => Promise<{
    $skip: number;
}>;
declare const limit_data: (payload_data: any) => Promise<{
    $limit: number;
}>;
export { match, match_delete, lookup_sellers, unwind_sellers, lookup_users, unwind_users, lookup_products, lookup_products_review, unwind_products, lookup_order, unwind_orders, lookup_order_products, lookup_order_product_review, unwind_order_products, lookup_order_review, unwind_order_review, lookup_Rev_sellers, unwind_Rev_sellers, filter_data, filter_reviews_data, group_data, group_orderReview_data, sort_data, skip_data, limit_data, filter_sorting, set_type, set_seller_type, filter_search, sort_order_data, sorting_data, sortOrder_data, };
