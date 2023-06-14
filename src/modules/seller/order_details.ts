import mongoose from "mongoose";
const Schema = mongoose.Schema;

const match = async (order_id: string, seller_id: string) => {
  try {
    return {
      $match: {
        _id: mongoose.Types.ObjectId(order_id),
        seller_id: mongoose.Types.ObjectId(seller_id),
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_order = async () => {
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
              },
            },
          },
          {
            $project: {
              _id: 1,
              order_id: 1,
              address_id: 1,
              cancel_request_accepted:1,
              cancel_requested:1,
              cancellation_reason:1,
              description:1,
              created_at: 1,
            },
          },
        ],
        as: "orders",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_orders = async () => {
  try {
    return {
      $unwind: {
        path: "$orders",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_sellers = async () => {
  try {
    return {
      $lookup: {
        from: "sellers",
        let: { seller_id: "$seller_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$seller_id"],
              },
            },
          },
          {
            $project: {
              name: 1,
              image: 1,
              full_address: 1,
              pin_code: 1,
              state: 1,
              country: 1,
              country_code: 1,
              phone_number: 1,
              company:1,
            },
          },
        ],
        as: "sellers",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_sellers = async () => {
  try {
    return {
      $unwind: {
        path: "$sellers",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_users = async () => {
  try {
    return {
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
              email: 1,
              country_code: 1,
              phone_no: 1,
            },
          },
        ],
        as: "users",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_users = async () => {
  try {
    return {
      $unwind: {
        path: "$users",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

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
              },
            },
          },
          {
            $project: {
              __v: 0,
            },
          },
        ],
        as: "address",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_address = async () => {
  try {
    return {
      $unwind: {
        path: "$address",
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
        let: { product_id: "$product_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$product_id"],
              },
            },
          },
          {
            $sort:{
              updated_at:-1
            }
          },
          {
            $project: {
              _id: 1,
              prodct_id: 1,
              name: 1,
              description: 1,
              images: 1,
              price: 1,
              discount_percantage: 1,
              discount_price: 1,
              brand_id: 1,
            },
          },
          {
            $lookup: {
              from: "brands",
              localField: "brand_id",
              foreignField: "_id",
              as: "brands",
            },
          },
          {
            $unwind: "$brands",
          },
          {
            $lookup: {
              from: "product_services",
              localField: "_id",
              foreignField: "product_id",
              as: "product_services",
            },
          },
          {
            $lookup: {
              from: "reviews",
              let: { product_id: "$_id" },
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
                    as: "user_id",
                  },
                },
                {
                  $unwind: "$user_id",
                },
              ],
              as: "reviews",
            },
          },
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              prod_id: { $first: "$prodct_id" },
              description: { $first: "$description" },
              images: { $first: "$images" },
              actual_product_price: { $first: "$price" },
              discount_percantage: { $first: "$discount_percantage" },
              discount_price: { $first: "$discount_price" },
              brand_id: { $first: "$brands" },
              services: { $first: "$product_services" },
              ratings: { $first: "$reviews" },
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

const lookup_reviews = async () => {
  try {
    return {
      $lookup: {
        from: "reviews",
        let: { product_id: "$product_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$product_id"],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "users",
            },
          },
          {
            $unwind: "$users",
          },
          {
            $set: {
              user_info: {
                _id: "$users._id",
                profile_pic: "$users.profile_pic",
                name: "$users.name",
              },
            },
          },
          {
            $group: {
              _id: "$_id",
              user_id: { $first: "$user_info" },
              product_id: { $first: "$product_id" },
              seller_id: { $first: "$seller_id" },
              title: { $first: "$title" },
              description: { $first: "$description" },
              ratings: { $first: "$ratings" },
              images: { $first: "$images" },
              created_at: { $first: "$created_at" },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ],
        as: "reviews",
      },
    };
  } catch (err) {
    throw err;
  }
};


const lookup_order_invoice = async (order_id:any) => {
  try {
    return {
      $lookup: {
        from: "order_invoices",
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$order_product_id", mongoose.Types.ObjectId(order_id)],
              },
            },
          }
        ],
        as: "invoice",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_invoice = async () => {
    try {
        return {
            $unwind: {
                path: "$invoice",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_product_invoice = async () => {
  try {
    return {
      $lookup: {
        from: "products",
        let: { product_id: "$product_id" },
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
              prodct_id: 1,
              name: 1,
              description: 1,
              images: 1,
              brand_id: 1,
              category_id:1
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "categories",
            },
          },
          {
            $unwind: "$categories",
          },
          {
            $lookup: {
              from: "subcategories",
              localField: "category_id",
              foreignField: "category_id",
              as: "subcategories",
            },
          },
          {
            $unwind: "$subcategories",
          },
          {
            $lookup: {
              from: "brands",
              localField: "brand_id",
              foreignField: "_id",
              as: "brands",
            },
          },
          {
            $unwind: "$brands",
          },
          {
            $lookup: {
              from: "product_services",
              localField: "_id",
              foreignField: "product_id",
              as: "product_services",
            },
          },
          {
            $lookup: {
              from: "reviews",
              let: { product_id: "$_id" },
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
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              prod_id: { $first: "$prodct_id" },
              description: { $first: "$description" },
              images: { $first: "$images" },
              brand_id: { $first: "$brands" },
              subcategory: { $first: "$subcategories" },
              services: { $first: "$product_services" },
              ratings: { $first: "$reviews" },
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


// const lookup_brands = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "brands",
//                 let: { brand_id: "$products.brand_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$brand_id"],
//                             }
//                         }
//                     },
//                     {
//                         $project: {
//                             name: 1
//                         }
//                     }
//                 ],
//                 as: "brands"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }

// const unwind_brands = async () => {
//     try {
//         return {
//             $unwind: {
//                 path: "$brands",
//                 preserveNullAndEmptyArrays: true
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }

const group_data = async () => {
  try {
    return {
      $group: {
        _id: "$_id",
        invoice_id: { $first: "$invoice._id" },
        order_object_id: { $first: "$orders._id" },
        order_id: { $first: "$orders.order_id" },
        product_id: { $first: "$products" },
        user_id: { $first: "$users" },
        address_id: { $first: "$address_data" },
        seller_id: { $first: "$sellers" },
        quantity: { $first: "$quantity" },
        actual_product_price: { $first: "$price" },
        discount_percantage: { $first: "$discount_percantage" },
        discount_price: { $first: "$discount_price" },
        price: { $first: "$price" },
        delivery_price: { $first: "$delivery_price" },
        coupon_discount: { $first: "$coupon_discount" },
        total_price: { $first: "$total_price" },
        total_earnings: { $first: "$total_earnings" },
        admin_commision: { $first: "$admin_commision" },
        tax_percentage: { $first: "$tax_percentage" },
        shippo_data: { $first: "$shippo_data" },
        order_status: { $first: "$order_status" },
        tracking_link: { $first: "$tracking_link" },
        delivery_date: { $first: "$delivery_date" },
        cancel_request_accepted: { $first: "$cancel_request_accepted" },
        cancel_requested: { $first: "$cancel_requested" },
        cancel_description: { $first: "$description" },
        cancel_reason: { $first: "$cancellation_reason" },
        // reviews: { "$first": "$reviews" },
        updated_at: { $first: "$updated_at" },
        created_at: { $first: "$created_at" },
      },
    };
  } catch (err) {
    throw err;
  }
};

const group_invoice_data = async () => {
  try {
    return {
      $group: {
        _id: "$_id",
        invoice_id: { $first: "$invoice.invoice_id" },
        tax_no: { $first: "$tax_no" },
        order_object_id: { $first: "$orders._id" },
        order_id: { $first: "$orders.order_id" },
        product_id: { $first: "$products" },
        user_id: { $first: "$users" },
        address_id: { $first: "$address_data" },
        seller_id: { $first: "$sellers" },
        quantity: { $first: "$quantity" },
        price: { $first: "$price" },
        delivery_price: { $first: "$delivery_price" },
        coupon_discount: { $first: "$coupon_discount" },
        total_price: { $first: "$total_price" },
        your_earning: { $first: "$total_earnings" },
        admin_commision: { $first: "$admin_commision" },
        tax_percantage: { $first: "$tax_percentage" },
        tax_amount: { $first: "$tax_amount" },
        shippo_data: { $first: "$shippo_data" },
        order_status: { $first: "$order_status" },
        // delivery_status: { $first: "$delivery_status" },
        delivery_date: { $first: "$delivery_date" },
        invoice_date: { $first: "$invoice.created_at" },
        reviews: { $first: "$reviews" },
        updated_at: { $first: "$updated_at" },
        created_at: { $first: "$created_at" },
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
  match,
  lookup_order,
  unwind_orders,
  lookup_sellers,
  unwind_sellers,
  lookup_users,
  unwind_users,
  lookup_address,
  unwind_address,
  lookup_products,
  lookup_product_invoice,
  unwind_products,
  lookup_reviews,
  // unwind_reviews,
  group_data,
  lookup_order_invoice,
  unwind_invoice,
  group_invoice_data,
  sort_data,
  skip_data,
  limit_data,
};
