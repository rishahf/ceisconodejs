import mongoose from "mongoose";
declare const match: (order_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
    };
}>;
declare const match_order_id: (order_id: string, _id: string) => Promise<{
    $match: {
        order_id: mongoose.Types.ObjectId;
        _id: {
            $ne: mongoose.Types.ObjectId;
        };
    };
}>;
declare const lookup_order: () => Promise<{
    $lookup: {
        from: string;
        let: {
            order_id: string;
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
                order_id: number;
                address_id: number;
                user_id: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_orders: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
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
                full_address: number;
                pin_code: number;
                state: number;
                country: number;
                country_code: number;
                phone_number: number;
                company: number;
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
declare const lookup_address: () => Promise<{
    $lookup: {
        from: string;
        let: {
            address_id: string;
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
declare const lookup_order_address: () => Promise<{
    $lookup: {
        from: string;
        let: {
            address_id: string;
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
declare const unwind_address: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_product_invoice: () => Promise<{
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
                brand_id: number;
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
                let?: undefined;
                pipeline?: undefined;
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
                localField?: undefined;
                foreignField?: undefined;
            };
            $match?: undefined;
            $project?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $group: {
                _id: string;
                name: {
                    $first: string;
                };
                prod_id: {
                    $first: string;
                };
                description: {
                    $first: string;
                };
                images: {
                    $first: string;
                };
                brand_id: {
                    $first: string;
                };
                subcategory: {
                    $first: string;
                };
                services: {
                    $first: string;
                };
                ratings: {
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
declare const lookup_order_invoice: (order_id: any) => Promise<{
    $lookup: {
        from: string;
        pipeline: {
            $match: {
                $expr: {
                    $eq: mongoose.Types.ObjectId[];
                };
            };
        }[];
        as: string;
    };
}>;
declare const unwind_invoice: () => Promise<{
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
                brand_id: number;
                discount_percantage: number;
                discount_price: number;
                price: number;
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
                let?: undefined;
                pipeline?: undefined;
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
                localField?: undefined;
                foreignField?: undefined;
            };
            $match?: undefined;
            $project?: undefined;
            $unwind?: undefined;
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
                discount_percantage: {
                    $first: string;
                };
                discount_price: {
                    $first: string;
                };
                price: {
                    $first: string;
                };
                brand_id: {
                    $first: string;
                };
                services: {
                    $first: string;
                };
                ratings: {
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
declare const lookup_product_order_item: () => Promise<{
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
                discount_percantage: number;
                discount_price: number;
                price: number;
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
                price: {
                    $first: string;
                };
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
                actual_price: {
                    $first: string;
                };
                discount_percantage: {
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
declare const unwind_products: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_reviews: () => Promise<{
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
            $set?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $lookup: {
                from: string;
                localField: string;
                foreignField: string;
                as: string;
            };
            $match?: undefined;
            $unwind?: undefined;
            $set?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $unwind: string;
            $match?: undefined;
            $lookup?: undefined;
            $set?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $set: {
                user_info: {
                    _id: string;
                    profile_pic: string;
                    name: string;
                };
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $group: {
                _id: string;
                user_id: {
                    $first: string;
                };
                product_id: {
                    $first: string;
                };
                seller_id: {
                    $first: string;
                };
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
                created_at: {
                    $first: string;
                };
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $set?: undefined;
            $sort?: undefined;
        } | {
            $sort: {
                _id: number;
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $set?: undefined;
            $group?: undefined;
        })[];
        as: string;
    };
}>;
declare const lookup_order_reviews: () => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
            user_id: string;
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
            $set?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $lookup: {
                from: string;
                localField: string;
                foreignField: string;
                as: string;
            };
            $match?: undefined;
            $unwind?: undefined;
            $set?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $unwind: string;
            $match?: undefined;
            $lookup?: undefined;
            $set?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $set: {
                user_info: {
                    _id: string;
                    profile_pic: string;
                    name: string;
                };
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
            $sort?: undefined;
        } | {
            $group: {
                _id: string;
                user_id: {
                    $first: string;
                };
                product_id: {
                    $first: string;
                };
                seller_id: {
                    $first: string;
                };
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
                created_at: {
                    $first: string;
                };
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $set?: undefined;
            $sort?: undefined;
        } | {
            $sort: {
                _id: number;
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $set?: undefined;
            $group?: undefined;
        })[];
        as: string;
    };
}>;
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        order_object_id: {
            $first: string;
        };
        order_id: {
            $first: string;
        };
        product_order_id: {
            $first: string;
        };
        product_id: {
            $first: string;
        };
        user_id: {
            $first: string;
        };
        address_id: {
            $first: string;
        };
        seller_id: {
            $first: string;
        };
        quantity: {
            $first: string;
        };
        price: {
            $first: string;
        };
        actual_product_price: {
            $first: string;
        };
        product_discount_percentage: {
            $first: string;
        };
        product_discount_price: {
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
        tax_percentage: {
            $first: string;
        };
        tax_amount: {
            $first: string;
        };
        admin_commision: {
            $first: string;
        };
        seller_earnings: {
            $first: string;
        };
        shippo_data: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        payment_status: {
            $first: string;
        };
        tracking_link: {
            $first: string;
        };
        delivery_date: {
            $first: string;
        };
        reviews: {
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
declare const group_order_items: () => Promise<{
    $group: {
        _id: string;
        order_object_id: {
            $first: string;
        };
        order_id: {
            $first: string;
        };
        product_order_id: {
            $first: string;
        };
        product_id: {
            $first: string;
        };
        user_id: {
            $first: string;
        };
        seller_id: {
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
        tax_percentage: {
            $first: string;
        };
        tax_amount: {
            $first: string;
        };
        admin_commision: {
            $first: string;
        };
        shippo_data: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        payment_status: {
            $first: string;
        };
        tracking_link: {
            $first: string;
        };
        delivery_date: {
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
declare const match_data: (_id: string, user_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
    };
}>;
declare const lookup_ordered_products: () => Promise<{
    $lookup: {
        from: string;
        let: {
            order_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
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
                } | {
                    $project: {
                        _id: number;
                        name: number;
                        description: number;
                        images: number;
                        prodct_id: number;
                    };
                    $match?: undefined;
                })[];
                as: string;
            };
            $match?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $unwind: {
                path: string;
                preserveNullAndEmptyArrays: boolean;
            };
            $match?: undefined;
            $lookup?: undefined;
            $group?: undefined;
        } | {
            $group: {
                _id: string;
                order_id: {
                    $first: string;
                };
                product_order_id: {
                    $first: string;
                };
                product_id: {
                    $first: string;
                };
                tax_no: {
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
                discount_price: {
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
                admin_commision: {
                    $first: string;
                };
                tax_percentage: {
                    $first: string;
                };
                tax_amount: {
                    $first: string;
                };
                order_status: {
                    $first: string;
                };
                previous_status: {
                    $first: string;
                };
                cancellation_reason: {
                    $first: string;
                };
                cancel_requested: {
                    $first: string;
                };
                cancel_request_accepted: {
                    $first: string;
                };
                payment_status: {
                    $first: string;
                };
                tracking_link: {
                    $first: string;
                };
                products: {
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
                cancelled_at: {
                    $first: string;
                };
                created_at: {
                    $first: string;
                };
                address_data: {
                    $first: string;
                };
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
        })[];
        as: string;
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
declare const group_invoice_data: () => Promise<{
    $group: {
        _id: string;
        invoice_id: {
            $first: string;
        };
        tax_no: {
            $first: string;
        };
        order_object_id: {
            $first: string;
        };
        order_id: {
            $first: string;
        };
        product_id: {
            $first: string;
        };
        user_id: {
            $first: string;
        };
        address_id: {
            $first: string;
        };
        seller_id: {
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
        your_earning: {
            $first: string;
        };
        admin_commision: {
            $first: string;
        };
        tax_percantage: {
            $first: string;
        };
        tax_amount: {
            $first: string;
        };
        shippo_data: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        delivery_date: {
            $first: string;
        };
        invoice_date: {
            $first: string;
        };
        reviews: {
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
declare const group_data1: () => Promise<{
    $group: {
        _id: string;
        payment_mode: {
            $first: string;
        };
        order_id: {
            $first: string;
        };
        order_products: {
            $first: string;
        };
        address_id: {
            $first: {
                $arrayElemAt: (string | number)[];
            };
        };
        created_at: {
            $first: string;
        };
    };
}>;
declare const lookup_ordered_invoice: (order_id: any) => Promise<{
    $lookup: {
        from: string;
        pipeline: ({
            $match: {
                $expr: {
                    $and: {
                        $eq: mongoose.Types.ObjectId[];
                    }[];
                };
            };
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $lookup: {
                from: string;
                let: {
                    product_id: string;
                    order_id?: undefined;
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
                        prodct_id: number;
                        name: number;
                        description: number;
                        images: number;
                        added_by: number;
                        category_id: number;
                        subcategory_id: number;
                        brand_id: number;
                    };
                    $match?: undefined;
                    $lookup?: undefined;
                    $unwind?: undefined;
                } | {
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
                                full_address: number;
                                pin_code: number;
                                state: number;
                                city: number;
                                country: number;
                                country_code: number;
                                phone_number: number;
                                company: number;
                            };
                            $match?: undefined;
                        })[];
                        as: string;
                        localField?: undefined;
                        foreignField?: undefined;
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
                } | {
                    $lookup: {
                        from: string;
                        localField: string;
                        foreignField: string;
                        as: string;
                        let?: undefined;
                        pipeline?: undefined;
                    };
                    $match?: undefined;
                    $project?: undefined;
                    $unwind?: undefined;
                } | {
                    $unwind: string;
                    $match?: undefined;
                    $project?: undefined;
                    $lookup?: undefined;
                })[];
                as: string;
            };
            $match?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $unwind: {
                path: string;
                preserveNullAndEmptyArrays: boolean;
            };
            $match?: undefined;
            $lookup?: undefined;
            $group?: undefined;
        } | {
            $lookup: {
                from: string;
                let: {
                    order_id: string;
                    product_id?: undefined;
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
                        invoice_id: number;
                        created_at: number;
                    };
                    $match?: undefined;
                })[];
                as: string;
            };
            $match?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $group: {
                _id: string;
                tax_no: {
                    $first: string;
                };
                invoice_id: {
                    $first: string;
                };
                product_id: {
                    $first: string;
                };
                product_name: {
                    $first: string;
                };
                description: {
                    $first: string;
                };
                category_name: {
                    $first: string;
                };
                subcategory_name: {
                    $first: string;
                };
                brand_name: {
                    $first: string;
                };
                seller_name: {
                    $first: string;
                };
                seller_country_code: {
                    $first: string;
                };
                seller_phn_no: {
                    $first: string;
                };
                seller_pincode: {
                    $first: string;
                };
                seller_company: {
                    $first: string;
                };
                seller_city: {
                    $first: string;
                };
                seller_state: {
                    $first: string;
                };
                seller_country: {
                    $first: string;
                };
                seller_full_address: {
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
                tax_percentage: {
                    $first: string;
                };
                tax_amount: {
                    $first: string;
                };
                invoice_date: {
                    $first: string;
                };
            };
            $match?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
        })[];
        as: string;
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
                    $eq: string[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                name: number;
                images: number;
                price: number;
                discount: number;
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
export { match, match_order_id, lookup_order, unwind_orders, lookup_sellers, unwind_sellers, lookup_users, unwind_users, lookup_address, lookup_order_address, unwind_address, lookup_products, lookup_product_order_item, unwind_products, lookup_reviews, lookup_product_invoice, lookup_order_invoice, unwind_invoice, group_invoice_data, group_data, group_order_items, sort_data, skip_data, limit_data, lookup_ordered_invoice, match_variant_product_id, lookup_variants, unwind_variants, group_variants_data, match_data, lookup_ordered_products, group_data1, lookup_order_reviews, };
