import mongoose from "mongoose";

const match_data = async (user_id: string) => {
  try {
    return {
      $match: {
        user_id: mongoose.Types.ObjectId(user_id),
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_order_products = async () => {
  try {
    return {
      $lookup: {
        from: "order_products",
        let: { order_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$order_id", "$$order_id"],
              },
            },
          },
        ],
        as: "order_products",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_order_products = async () => {
  try {
    return {
      $unwind: {
        path: "$order_products",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

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
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              images: 1,
            },
          },
          {
            $lookup: {
              from: "reviews",
              let: { product_id: "$_id",  },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$product_id", "$$product_id"],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    let: { user_id: "$user_id" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$_id", "$$user_id"],
                          },
                        },
                      },
                      {
                        $project: {
                          name: 1,
                          profile_pic: 1,
                        },
                      },
                    ],
                    as: "user_detail",
                  },
                },
                {
                  $unwind: "$user_detail",
                },
              ],
              as: "reviews",
            },
          },
        ],
        as: "products",
      },
    };
  } catch (err) {
    throw err;
  }
}; 

const lookup_reviewd_products = async (user_id: any) => {
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
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              images: 1,
            },
          },
          {
            $lookup: {
              from: "reviews",
              let: { product_id: "$_id", user_id: user_id },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      // $eq: ["$product_id", "$$product_id"],
                      $and: [
                        {
                          $eq: ["$product_id", "$$product_id"],
                        },
                        {
                          $eq: ["$user_id", "$$user_id"],
                        },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    let: { user_id: "$user_id" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$_id", "$$user_id"],
                          },
                        },
                      },
                      {
                        $project: {
                          name: 1,
                          profile_pic: 1,
                        },
                      },
                    ],
                    as: "user_detail",
                  },
                },
                {
                  $unwind: "$user_detail",
                },
              ],
              as: "reviews",
            },
          },
          {
            $unwind: {
              path: "$reviews",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: "products",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_products = async () => {
  try {
    return {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

const group_data = async () => {
  try {
    return {
      $group: {
        _id: "$order_products._id",
        orderId: { $first: "$order_id" },
        productOrderId: { $first: "$order_products.product_order_id" },
        order_id: { $first: "$order_products.order_id" },
        user_id: { $first: "$user_id" },
        seller_id: { $first: "$order_products.seller_id" },
        product_id: { $first: "$products" },
        quantity: { $first: "$order_products.quantity" },
        price: { $first: "$order_products.price" },
        delivery_price: { $first: "$order_products.delivery_price" },
        coupon_discount: { $first: "$order_products.coupon_discount" },
        total_price: { $first: "$order_products.total_price" },
        total_earnings: { $first: "$order_products.total_earnings" },
        shippo_data: { $first: "$order_products.shippo_data" },
        order_status: { $first: "$order_products.order_status" },
        tracking_link: { $first: "$order_products.tracking_link" },
        stripe_data: { $first: "$stripe_data" },
        updated_at: { $first: "$order_products.updated_at" },
        shipped_at: { $first: "$order_products.shipped_at" },
        delivery_date: { $first: "$order_products.delivery_date" },
        created_at: { $first: "$order_products.created_at" },
      },
    };
  } catch (err) {
    throw err;
  }
};

const filter_data = async (payload_data: any) => {
  console.log('payload-order-list ', payload_data)
  try {
    let { order_status } = payload_data;
    if (order_status == "ALL") {
      order_status = undefined;
    } else if (order_status == "CONFIRMED") {
      order_status = ["PLACED", "SHIPPED"];
    } else if (order_status == "DELIVERED") {
      order_status = ["DELIVERED"];
    }else if (order_status == "CANCELLED"){
      order_status = ["CANCELLED", "PENDING_CANCELLATION"];
    }
      return {
        $redact: {
          $cond: {
            if: {
              $and: [
                {
                  $or: [
                    { $eq: [order_status, undefined] },
                    { $in: ["$order_status", order_status] },
                  ],
                },
                // {
                //   $or: [
                //     { $eq: [order_status, undefined] },
                //     { $ne: ["$order_status", null] },
                //   ],
                // },
              ],
            },
            then: "$$KEEP",
            else: "$$PRUNE",
          },
        },
      };
  } catch (err) {
    throw err;
  }
};

let sort_data = async () => {
  try {
    return {
      $sort: {
        _id: -1,
      },
    };
  } catch (err) {
    throw err;
  }
};

const skip_data = async (payload_data: any) => {
  try {
    let { pagination, limit }: any = payload_data;
    let set_pagination: number = 0,
      set_limit: number = 0;

    if (pagination != undefined) {
      set_pagination = parseInt(pagination);
    }
    if (limit != undefined) {
      set_limit = parseInt(limit);
    }
    return {
      $skip: set_pagination * set_limit,
    };
  } catch (err) {
    throw err;
  }
};

const limit_data = async (payload_data: any) => {
  try {
    let { limit }: any = payload_data;
    let set_limit: number = 10;

    if (limit != undefined) {
      set_limit = parseInt(limit);
    }
    return {
      $limit: set_limit,
    };
  } catch (err) {
    throw err;
  }
};

export {
  match_data,
  lookup_order_products,
  unwind_order_products,
  lookup_products,
  lookup_reviewd_products,
  unwind_products,
  group_data,
  filter_data,
  sort_data,
  skip_data,
  limit_data,
};
