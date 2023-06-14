import mongoose from 'mongoose';

const match_data = async (order_id : string) => {
    try {
        return {
            $match: {
                order_id: mongoose.Types.ObjectId(order_id)
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const lookup_orders = async () => {
    try {
        return {
            $lookup: {
                from: "orders",
                let: { order_id: "$order_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$order_id"],
                            }
                        }
                    }
                ],
                as: "orders"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_orders = async () => {
    try {
        return {
            $unwind: {
                path: "$orders",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_order_products = async () => {
    try {
        return {
            $lookup: {
                from: "order_products",
                let: { order_id: "$order_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$order_id", "$$order_id"],
                            }
                        }
                    }
                ],
                as: "order_products"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_order_products = async () => {
    try {
        return {
            $unwind: {
                path: "$order_products",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_products = async () => {
    try {
        return {
            $lookup: {
                from: "products",
                let: { product_id: "$order_products.product_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$product_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            images: 1
                        }
                    }
                ],
                as: "products"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_products = async () => {
    try {
        return {
            $unwind: {
                path: "$products",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_address = async () => {
    try {
        return {
            $lookup: {
                from: "addresses",
                let: { address_id: "$orders.address_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$address_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            shippo_user_address_id: 0,
                            is_default: 0,
                            is_deleted: 0,
                            created_at: 0,
                            __v: 0
                        }
                    }
                ],
                as: "address"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_address = async () => {
    try {
        return {
            $unwind: {
                path: "$address",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const group_data = async () => {
    try {
        return {
            $group: {
                _id: "$order_products._id",
                order_id: { "$first": "$order_products.order_id" },
                user_id: { "$first": "$order_products.user_id" },
                seller_id: { "$first": "$order_products.seller_id" },
                product_id: { "$first": "$products" },
                address_id: { "$first": "$address" },
                quantity: { "$first": "$order_products.quantity" },
                price: { "$first": "$order_products.price" },
                delivery_price: { "$first": "$order_products.delivery_price" },
                coupon_discount: { "$first": "$order_products.coupon_discount" },
                total_price: { "$first": "$order_products.total_price" },
                total_earnings : { "$first": "$order_products.total_earnings" },
                shippo_data: { "$first": "$order_products.shippo_data" },
                order_status: { "$first": "$order_products.order_status" },
                // delivery_status: { "$first": "$order_products.delivery_status" },
                stripe_data : { "$first": "$orders.stripe_data" },
                updated_at: { "$first": "$order_products.updated_at" },
                created_at: { "$first": "$order_products.created_at" }
            }
        }
    }
    catch (err) {
        throw err;
    }
}



let sort_data = async () => {
    try {

        return {
            $sort: {
                _id: -1
            }
        }
    }
    catch (err) {
        throw err;
    }
}




export {
    match_data,
    lookup_orders,
    unwind_orders,
    lookup_order_products,
    unwind_order_products,
    lookup_products,
    unwind_products,
    lookup_address,
    unwind_address,
    group_data,
    sort_data
}

