import mongoose from 'mongoose';
declare const match_data: (order_id: string) => Promise<{
    $match: {
        order_id: mongoose.Types.ObjectId;
    };
}>;
declare const lookup_orders: () => Promise<{
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
                shippo_user_address_id: number;
                is_default: number;
                is_deleted: number;
                created_at: number;
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
declare const group_data: () => Promise<{
    $group: {
        _id: string;
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
        stripe_data: {
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
export { match_data, lookup_orders, unwind_orders, lookup_order_products, unwind_order_products, lookup_products, unwind_products, lookup_address, unwind_address, group_data, sort_data };
