import mongoose from "mongoose";
declare const match: (order_id: string, seller_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
        seller_id: mongoose.Types.ObjectId;
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
                cancel_request_accepted: number;
                cancel_requested: number;
                cancellation_reason: number;
                description: number;
                created_at: number;
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
                email: number;
                country_code: number;
                phone_no: number;
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
declare const unwind_address: () => Promise<{
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
            $sort?: undefined;
            $project?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $sort: {
                updated_at: number;
            };
            $match?: undefined;
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
                price: number;
                discount_percantage: number;
                discount_price: number;
                brand_id: number;
            };
            $match?: undefined;
            $sort?: undefined;
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
            $sort?: undefined;
            $project?: undefined;
            $unwind?: undefined;
            $group?: undefined;
        } | {
            $unwind: string;
            $match?: undefined;
            $sort?: undefined;
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
            $sort?: undefined;
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
                actual_product_price: {
                    $first: string;
                };
                discount_percantage: {
                    $first: string;
                };
                discount_price: {
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
            $sort?: undefined;
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
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        invoice_id: {
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
        actual_product_price: {
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
        shippo_data: {
            $first: string;
        };
        order_status: {
            $first: string;
        };
        tracking_link: {
            $first: string;
        };
        delivery_date: {
            $first: string;
        };
        cancel_request_accepted: {
            $first: string;
        };
        cancel_requested: {
            $first: string;
        };
        cancel_description: {
            $first: string;
        };
        cancel_reason: {
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
export { match, lookup_order, unwind_orders, lookup_sellers, unwind_sellers, lookup_users, unwind_users, lookup_address, unwind_address, lookup_products, lookup_product_invoice, unwind_products, lookup_reviews, group_data, lookup_order_invoice, unwind_invoice, group_invoice_data, sort_data, skip_data, limit_data, };
