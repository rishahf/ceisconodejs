import mongoose from 'mongoose';
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
        } | {
            $project: {
                _id: number;
                name: number;
                description: number;
                images: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const lookup_other_product: () => Promise<{
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
            };
            $match?: undefined;
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
declare const lookup_reviews_data: (user_id: any) => Promise<{
    $lookup: {
        from: string;
        let: {
            product_id: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $and: {
                        $eq: mongoose.Types.ObjectId[];
                    }[];
                };
            };
        }[];
        as: string;
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
        address_id: {
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
        payment_status: {
            $first: string;
        };
        tracking_link: {
            $first: string;
        };
        stripe_data: {
            $first: string;
        };
        reviews: {
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
        delivery_date: {
            $first: string;
        };
        shipped_at: {
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
declare const group_other_items: () => Promise<{
    $group: {
        _id: string;
        orderId: {
            $first: string;
        };
        productOrderId: {
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
        order_status: {
            $first: string;
        };
        payment_status: {
            $first: string;
        };
        tracking_link: {
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
        delivery_date: {
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
declare const match_data: (_id: string, user_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
        user_id: mongoose.Types.ObjectId;
    };
}>;
declare const match_order_id: (order_id: string, user_id: string, _id: string) => Promise<{
    $match: {
        order_id: mongoose.Types.ObjectId;
        user_id: mongoose.Types.ObjectId;
        _id: {
            $ne: mongoose.Types.ObjectId;
        };
    };
}>;
declare let sort_data: () => Promise<{
    $sort: {
        _id: number;
    };
}>;
declare const lookup_ordered_invoice: (order_id: any, user_id: any) => Promise<{
    $lookup: {
        from: string;
        let: {
            order_id: string;
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
                            $eq: any[];
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
declare const match: (order_id: string, seller_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
        user_id: mongoose.Types.ObjectId;
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
            };
            $match?: undefined;
            $project?: undefined;
            $lookup?: undefined;
            $unwind?: undefined;
        })[];
        as: string;
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
export { match, match_order_id, lookup_order, unwind_orders, lookup_sellers, unwind_sellers, lookup_users, unwind_users, lookup_order_products, unwind_order_products, lookup_ordered_products, lookup_products, lookup_other_product, unwind_products, lookup_reviews_data, lookup_address, unwind_address, lookup_ordered_invoice, lookup_order_invoice, unwind_invoice, lookup_product_invoice, group_data, group_data1, group_other_items, group_invoice_data, match_data, sort_data };
