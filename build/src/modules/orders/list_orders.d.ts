import mongoose from "mongoose";
declare const match_data: (user_id: string) => Promise<{
    $match: {
        user_id: mongoose.Types.ObjectId;
    };
}>;
declare const lookup_order_products: () => Promise<{
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
declare const unwind_order_products: () => Promise<{
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
        } | {
            $project: {
                _id: number;
                name: number;
                description: number;
                images: number;
            };
            $match?: undefined;
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
                    $lookup?: undefined;
                    $unwind?: undefined;
                } | {
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
                    $match?: undefined;
                    $unwind?: undefined;
                } | {
                    $unwind: string;
                    $match?: undefined;
                    $lookup?: undefined;
                })[];
                as: string;
            };
            $match?: undefined;
            $project?: undefined;
        })[];
        as: string;
    };
}>;
declare const lookup_reviewd_products: (user_id: any) => Promise<{
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
        } | {
            $project: {
                _id: number;
                name: number;
                description: number;
                images: number;
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
        } | {
            $lookup: {
                from: string;
                let: {
                    product_id: string;
                    user_id: any;
                };
                pipeline: ({
                    $match: {
                        $expr: {
                            $and: {
                                $eq: string[];
                            }[];
                        };
                    };
                    $lookup?: undefined;
                    $unwind?: undefined;
                } | {
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
                    $match?: undefined;
                    $unwind?: undefined;
                } | {
                    $unwind: string;
                    $match?: undefined;
                    $lookup?: undefined;
                })[];
                as: string;
            };
            $match?: undefined;
            $project?: undefined;
            $unwind?: undefined;
        } | {
            $unwind: {
                path: string;
                preserveNullAndEmptyArrays: boolean;
            };
            $match?: undefined;
            $project?: undefined;
            $lookup?: undefined;
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
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        orderId: {
            $first: string;
        };
        productOrderId: {
            $first: string;
        };
        order_id: {
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
        quantity: {
            $first: string;
        };
        price: {
            $first: string;
        };
        delivery_price: {
            $first: string;
        };
        coupon_discount: {
            $first: string;
        };
        total_price: {
            $first: string;
        };
        total_earnings: {
            $first: string;
        };
        shippo_data: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        tracking_link: {
            $first: string;
        };
        stripe_data: {
            $first: string;
        };
        updated_at: {
            $first: string;
        };
        shipped_at: {
            $first: string;
        };
        delivery_date: {
            $first: string;
        };
        created_at: {
            $first: string;
        };
    };
}>;
declare const filter_data: (payload_data: any) => Promise<{
    $redact: {
        $cond: {
            if: {
                $and: {
                    $or: ({
                        $eq: any[];
                        $in?: undefined;
                    } | {
                        $in: any[];
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
        _id: number;
    };
}>;
declare const skip_data: (payload_data: any) => Promise<{
    $skip: number;
}>;
declare const limit_data: (payload_data: any) => Promise<{
    $limit: number;
}>;
export { match_data, lookup_order_products, unwind_order_products, lookup_products, lookup_reviewd_products, unwind_products, group_data, filter_data, sort_data, skip_data, limit_data, };
