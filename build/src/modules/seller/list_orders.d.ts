import mongoose from "mongoose";
declare const match: (seller_id: string) => Promise<{
    $match: {
        seller_id: mongoose.Types.ObjectId;
    };
}>;
declare const match_transactions: (seller_id: string) => Promise<{
    $match: {
        $and: ({
            seller_id: mongoose.Types.ObjectId;
            order_status?: undefined;
        } | {
            order_status: string;
            seller_id?: undefined;
        })[];
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
                prodct_id: number;
                name: number;
                description: number;
                images: number;
                category_id: number;
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
                prodct_id: {
                    $first: string;
                };
                name: {
                    $first: string;
                };
                quantity: {
                    $first: string;
                };
                description: {
                    $first: string;
                };
                images: {
                    $first: string;
                };
                categoryId: {
                    $first: string;
                };
                category_id: {
                    $first: string;
                };
                subcategoryId: {
                    $first: string;
                };
                reviews: {
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
declare const lookup_review_products: (seller_id: any) => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
            seller_id: any;
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
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $project: {
                _id: number;
                name: number;
                prodct_id: number;
                description: number;
                images: number;
                category_id: number;
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
                name: {
                    $first: string;
                };
                description: {
                    $first: string;
                };
                images: {
                    $first: string;
                };
                prodct_id: {
                    $first: string;
                };
                discount_price: {
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
declare const unwind_review_products: () => Promise<{
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
declare const lookup_order_product: () => Promise<{
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
declare const unwind_ordered_product: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_card: () => Promise<{
    $lookup: {
        from: string;
        let: {
            card_id: string;
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
declare const unwind_card: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_ordered_products: (seller_id: any) => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $and: {
                        $eq: any[];
                    }[];
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
                name: {
                    $first: string;
                };
                description: {
                    $first: string;
                };
                images: {
                    $first: string;
                };
                categoryId: {
                    $first: string;
                };
                category_id: {
                    $first: string;
                };
                subcategoryId: {
                    $first: string;
                };
                reviews: {
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
declare const unwind_ordered_products: () => Promise<{
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
                            $gte: any[];
                            $lte?: undefined;
                        } | {
                            $lte: any[];
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
                            $gte: (string | number)[];
                            $lt?: undefined;
                        } | {
                            $lt: (string | number)[];
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
                            $lte?: undefined;
                        } | {
                            $lte: any[];
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
declare const filter_review_order_data: (payload_data: any) => Promise<{
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
                            $lt?: undefined;
                        } | {
                            $lt: (string | number)[];
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
                            $lte?: undefined;
                        } | {
                            $lte: any[];
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
declare const filter_transaction_data: (payload_data: any) => Promise<{
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
                        $and: {
                            $eq: any[];
                        }[];
                    } | {
                        $and: ({
                            $gte: any[];
                            $lte?: undefined;
                        } | {
                            $lte: any[];
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
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        order_id: {
            $first: string;
        };
        prdt_id: {
            $first: string;
        };
        ord_id: {
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
        productId: {
            $first: string;
        };
        category_id: {
            $first: string;
        };
        product_quantity: {
            $first: string;
        };
        cate_name: {
            $first: string;
        };
        subcategory_id: {
            $first: string;
        };
        coupon_discount: {
            $first: string;
        };
        quantity: {
            $first: string;
        };
        total_price: {
            $first: string;
        };
        total_earnings: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        payment_status: {
            $first: string;
        };
        cancel_requested: {
            $first: string;
        };
        cancel_request_accepted: {
            $first: string;
        };
        cancellation_reason: {
            $first: string;
        };
        cancelled_at: {
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
declare const group_orders_review_data: () => Promise<{
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
        productId: {
            $first: string;
        };
        total_price: {
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
declare const group_transactions_data: () => Promise<{
    $group: {
        _id: string;
        pm_id: {
            $first: string;
        };
        order_id: {
            $first: string;
        };
        order: {
            $first: string;
        };
        payment_status: {
            $first: string;
        };
        ord_id: {
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
        productId: {
            $first: string;
        };
        category_id: {
            $first: string;
        };
        cate_name: {
            $first: string;
        };
        subcategory_id: {
            $first: string;
        };
        total_price: {
            $first: string;
        };
        admin_commision: {
            $first: string;
        };
        total_earnings: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        cancel_requested: {
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
        _id: number;
    };
}>;
declare let sort_order_data: () => Promise<{
    $sort: {
        updated_at: number;
    };
}>;
declare const skip_data: (payload_data: any) => Promise<{
    $skip: number;
}>;
declare const limit_data: (payload_data: any) => Promise<{
    $limit: number;
}>;
export { match, match_transactions, lookup_sellers, unwind_sellers, lookup_users, unwind_users, lookup_products, unwind_products, lookup_review_products, unwind_review_products, lookup_order, unwind_orders, lookup_order_product, unwind_ordered_product, lookup_ordered_products, unwind_ordered_products, lookup_card, unwind_card, filter_data, filter_review_order_data, filter_transaction_data, group_transactions_data, group_orders_review_data, group_data, sort_data, skip_data, limit_data, sort_order_data, };
