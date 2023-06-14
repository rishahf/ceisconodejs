import mongoose from 'mongoose';


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

const lookup_ordered_products = async () => {
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
              {
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
                        name: 1,
                        description: 1,
                        images: 1,
                      },
                    },
                  ],
                  as: "products",
                },
              },
              {
                $unwind: {
                  path: "$products",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: "$_id",
                  order_id: { $first: "$order_id" },
                  product_order_id: { $first: "$product_order_id" },
                  product_id: { $first: "$product_id" },
                  tax_no: { $first: "$tax_no" },
                  quantity: { $first: "$quantity" },
                  price: { $first: "$price" },
                  discount_percantage: { $first: "$discount_percantage" },
                  discount_price: { $first: "$discount_price" },
                  delivery_price: { $first: "$delivery_price" },
                  coupon_discount: { $first: "$coupon_discount" },
                  total_price: { $first: "$total_price" },
                  total_earnings: { $first: "$total_earnings" },
                  admin_commision: { $first: "$admin_commision" },
                  tax_percentage: { $first: "$tax_percentage" },
                  tax_amount: { $first: "$tax_amount" },
                  order_status: { $first: "$order_status" },
                  previous_status: { $first: "$previous_status" },
                  cancellation_reason: { $first: "$cancellation_reason" },
                  cancel_requested: { $first: "$cancel_requested" },
                  cancel_request_accepted: { $first: "$cancel_request_accepted" },
                  payment_status: { $first: "$payment_status" },
                  tracking_link: { $first: "$tracking_link" },
                  products: { $first: "$products" },
                  updated_at: { $first: "$updated_at" },
                  shipped_at: { $first: "$shipped_at" },
                  delivery_date: { $first: "$delivery_date" },
                  cancelled_at: { $first: "$cancelled_at" },
                  created_at: { $first: "$created_at" },
                  address_data: { $first: "$address_data" },
                },
              },
            ],
            as: "order_products",
          },
        };
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

const lookup_other_product = async () => {
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
              name: 1,
              description: 1,
              images: 1,
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
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_reviews_data = async (user_id:any) => {
  try {
    return {
      $lookup: {
        from: "reviews",
        let: { product_id: "$order_products.product_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$user_id", mongoose.Types.ObjectId(user_id)],
                  },
                  {
                    $eq: ["$product_id", "$$product_id"],
                  },
                ],
              },
            },
          },
        ],
        as: "ratings",
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
            address_id: { $first: "$order_products.address_data" },
            quantity: { $first: "$order_products.quantity" },
            price: { $first: "$order_products.price" },
            delivery_price: { $first: "$order_products.delivery_price" },
            coupon_discount: { $first: "$order_products.coupon_discount" },
            total_price: { $first: "$order_products.total_price" },
            total_earnings: { $first: "$order_products.total_earnings" },
            shippo_data: { $first: "$order_products.shippo_data" },
            order_status: { $first: "$order_products.order_status" },
            payment_status: { $first: "$order_products.payment_status" },
            tracking_link: { $first: "$order_products.tracking_link" },
            stripe_data: { $first: "$stripe_data" },
            reviews: { $first: "$ratings" },
            cancel_requested: { $first: "$order_products.cancel_requested" },
            cancel_request_accepted: {
              $first: "$order_products.cancel_request_accepted",
            },
            cancellation_reason: {
              $first: "$order_products.cancellation_reason",
            },
            delivery_date: { $first: "$order_products.delivery_date" },
            shipped_at: { $first: "$order_products.shipped_at" },
            cancelled_at: { $first: "$order_products.cancelled_at" },
            updated_at: { $first: "$order_products.updated_at" },
            created_at: { $first: "$order_products.created_at" },
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const group_data1 = async () => {
    try {
        return {
          $group: {
            _id: "$_id",
            payment_mode: { $first: "$payment_mode" },
            // productOrderId: { $first: "$order_products.product_order_id" },
            order_id: { $first: "$order_id" },
            order_products: { $first: "$order_products" },
            // user_id: { $first: "$user_id" },
            // seller_id: { $first: "$order_products.seller_id" },
            // product_id: { $first: "$products" },
            address_id: { $first: {"$arrayElemAt":["$order_products.address_data",0]} },
            // quantity: { $first: "$order_products.quantity" },
            // price: { $first: "$order_products.price" },
            // delivery_price: { $first: "$order_products.delivery_price" },
            // coupon_discount: { $first: "$order_products.coupon_discount" },
            // total_price: { $first: "$order_products.total_price" },
            // total_earnings: { $first: "$order_products.total_earnings" },
            // shippo_data: { $first: "$order_products.shippo_data" },
            // order_status: { $first: "$order_products.order_status" },
            // payment_status: { $first: "$order_products.payment_status" },
            // tracking_link: { $first: "$order_products.tracking_link" },
            // stripe_data: { $first: "$stripe_data" },
            // reviews: { $first: "$ratings" },
            // cancel_requested: { $first: "$order_products.cancel_requested" },
            // cancel_request_accepted: {
            //   $first: "$order_products.cancel_request_accepted",
            // },
            // cancellation_reason: {
            //   $first: "$order_products.cancellation_reason",
            // },
            // delivery_date: { $first: "$order_products.delivery_date" },
            // shipped_at: { $first: "$order_products.shipped_at" },
            // cancelled_at: { $first: "$order_products.cancelled_at" },
            // updated_at: { $first: "$order_products.updated_at" },
            created_at: { $first: "$created_at" },
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const group_other_items = async () => {
    try {
        return {
          $group: {
            _id: "$_id",
            orderId: { $first: "$order_id" },
            productOrderId: { $first: "$product_order_id" },
            // order_id: { $first: "$order_products.order_id" },
            user_id: { $first: "$user_id" },
            seller_id: { $first: "$seller_id" },
            product_id: { $first: "$products" },
            // address_id: { $first: "$address" },
            quantity: { $first: "$quantity" },
            price: { $first: "$price" },
            delivery_price: { $first: "$delivery_price" },
            coupon_discount: { $first: "$coupon_discount" },
            total_price: { $first: "$total_price" },
            // total_earnings: { $first: "$order_products.total_earnings" },
            // shippo_data: { $first: "$order_products.shippo_data" },
            order_status: { $first: "$order_status" },
            payment_status: { $first: "$payment_status" },
            tracking_link: { $first: "$tracking_link" },
            // stripe_data: { $first: "$stripe_data" },
            // reviews: { $first: "$ratings" },
            cancel_requested: { $first: "$cancel_requested" },
            cancel_request_accepted: {
              $first: "$cancel_request_accepted",
            },
            cancellation_reason: {
              $first: "$cancellation_reason",
            },
            delivery_date: { $first: "$order_products.delivery_date" },
            cancelled_at: { $first: "$cancelled_at" },
            updated_at: { $first: "$updated_at" },
            created_at: { $first: "$created_at" },
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const match_data = async (_id: string, user_id: string) => {
    try {
        return {
            $match: {
                _id: mongoose.Types.ObjectId(_id),
                user_id: mongoose.Types.ObjectId(user_id)
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const match_order_id= async (order_id: string, user_id: string, _id:string) => {
    try {
        return {
          $match: {
            order_id: mongoose.Types.ObjectId(order_id),
            user_id: mongoose.Types.ObjectId(user_id),
            _id: { $ne: mongoose.Types.ObjectId(_id) },
          },
        };
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

const lookup_ordered_invoice1 = async (order_id:any,user_id: any) => {
  try {
    return {
      $lookup: {
        from: "order_products",
        // let: { order_id: order_id, user_id: user_id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$order_id", mongoose.Types.ObjectId(order_id)],
                  },
                  // {
                  //   $eq: ["$user_id", user_id],
                  // },
                ],
              },
            },
          },
          {
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
                    added_by: 1,
                    category_id: 1,
                    subcategory_id: 1,
                    brand_id: 1,
                  },
                },
                {
                  $lookup: {
                    from: "sellers",
                    let: { seller_id: "$added_by" },
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
                          city: 1,
                          country: 1,
                          country_code: 1,
                          phone_number: 1,
                          company: 1,
                        },
                      },
                    ],
                    as: "seller",
                  },
                },
                {
                  $unwind: {
                    path: "$seller",
                    preserveNullAndEmptyArrays: true,
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
                    localField: "subcategory_id",
                    foreignField: "_id",
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
                //       {
                //         $lookup: {
                //           from: "product_services",
                //           localField: "_id",
                //           foreignField: "product_id",
                //           as: "product_services",
                //         },
                //       },
              ],
              as: "products",
            },
          },
          {
            $unwind: {
              path: "$products",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "order_invoices",
              let: { order_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$order_product_id", "$$order_id"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    invoice_id: 1,
                    created_at: 1,
                  },
                },
              ],
              as: "invoice",
            },
          },
          {
            $unwind: {
              path: "$invoice",
              preserveNullAndEmptyArrays: true,
            },
          },
          // {
          //   $lookup: {
          //     from: "addresses",
          //     let: { address_id: "$address_id" },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $eq: ["$_id", "$$address_id"],
          //           },
          //         },
          //       },
          //       {
          //         $project: {
          //           shippo_user_address_id: 0,
          //           is_default: 0,
          //           is_deleted: 0,
          //           created_at: 0,
          //           __v: 0,
          //         },
          //       },
          //     ],
          //     as: "address",
          //   },
          // },
          // {
          //   $unwind: {
          //     path: "$address",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },
          {
            $group: {
              _id: "$_id",
              tax_no: { $first: "$tax_no" },
              invoice_id: { $first: "$invoice.invoice_id" },
              product_id: { $first: "$products.prodct_id" },
              product_name: { $first: "$products.name" },
              description: { $first: "$products.description" },
              category_name: { $first: "$products.categories.name" },
              subcategory_name: { $first: "$products.subcategories.name" },
              brand_name: { $first: "$products.brands.name" },
              seller_name: { $first: "$products.seller.name" },
              seller_country_code: { $first: "$products.seller.country_code" },
              seller_phn_no: { $first: "$products.seller.phone_number" },
              seller_pincode: { $first: "$products.seller.pin_code" },
              seller_company: { $first: "$products.seller.company" },
              seller_city: { $first: "$products.seller.city" },
              seller_state: { $first: "$products.seller.state" },
              seller_country: { $first: "$products.seller.country" },
              seller_full_address: { $first: "$products.seller.full_address" },
              quantity: { $first: "$quantity" },
              price: { $first: "$price" },
              delivery_price: { $first: "$delivery_price" },
              coupon_discount: { $first: "$coupon_discount" },
              total_price: { $first: "$total_price" },
              tax_percentage: { $first: "$tax_percentage" },
              tax_amount: { $first: "$tax_amount" },
              invoice_date: { $first: "$invoice.created_at" },
              // user_address: { $first: "$order_products.address" },
              // quantity: { $first: "$quantity" },
              // quantity: { $first: "$quantity" },
              // quantity: { $first: "$quantity" },
            },
          },
          //   {
          //     $group: {
          //       _id: "$_id",
          //         name: { $first: "$products.name" },
          //         description: { $first: "$products.description" },
          //         images: { $first: "$products.images" },
          //         seller: { $first: "$products.seller" },
          //     },
          //   },
        ],
        as: "order_products",
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_ordered_invoice = async (order_id: any, user_id: any) => {
  try {
    return {
      $lookup: {
        from: "orders",
        let: { order_id: "$order_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$_id","$$order_id"],
                  },
                  // {
                  //   $eq: ["$user_id", user_id],
                  // },
                ],
              },
            },
          },
          {
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
                    added_by: 1,
                    category_id: 1,
                    subcategory_id: 1,
                    brand_id: 1,
                  },
                },
                {
                  $lookup: {
                    from: "sellers",
                    let: { seller_id: "$added_by" },
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
                          city: 1,
                          country: 1,
                          country_code: 1,
                          phone_number: 1,
                          company: 1,
                        },
                      },
                    ],
                    as: "seller",
                  },
                },
                {
                  $unwind: {
                    path: "$seller",
                    preserveNullAndEmptyArrays: true,
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
                    localField: "subcategory_id",
                    foreignField: "_id",
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
                //       {
                //         $lookup: {
                //           from: "product_services",
                //           localField: "_id",
                //           foreignField: "product_id",
                //           as: "product_services",
                //         },
                //       },
              ],
              as: "products",
            },
          },
          {
            $unwind: {
              path: "$products",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "order_invoices",
              let: { order_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$order_product_id", order_id],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    invoice_id: 1,
                    created_at: 1,
                  },
                },
              ],
              as: "invoice",
            },
          },
          {
            $unwind: {
              path: "$invoice",
              preserveNullAndEmptyArrays: true,
            },
          },
          // {
          //   $lookup: {
          //     from: "addresses",
          //     let: { address_id: "$address_id" },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $eq: ["$_id", "$$address_id"],
          //           },
          //         },
          //       },
          //       {
          //         $project: {
          //           shippo_user_address_id: 0,
          //           is_default: 0,
          //           is_deleted: 0,
          //           created_at: 0,
          //           __v: 0,
          //         },
          //       },
          //     ],
          //     as: "address",
          //   },
          // },
          // {
          //   $unwind: {
          //     path: "$address",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },
          {
            $group: {
              _id: "$_id",
              tax_no: { $first: "$tax_no" },
              invoice_id: { $first: "$invoice.invoice_id" },
              product_id: { $first: "$products.prodct_id" },
              product_name: { $first: "$products.name" },
              description: { $first: "$products.description" },
              category_name: { $first: "$products.categories.name" },
              subcategory_name: { $first: "$products.subcategories.name" },
              brand_name: { $first: "$products.brands.name" },
              seller_name: { $first: "$products.seller.name" },
              seller_country_code: { $first: "$products.seller.country_code" },
              seller_phn_no: { $first: "$products.seller.phone_number" },
              seller_pincode: { $first: "$products.seller.pin_code" },
              seller_company: { $first: "$products.seller.company" },
              seller_city: { $first: "$products.seller.city" },
              seller_state: { $first: "$products.seller.state" },
              seller_country: { $first: "$products.seller.country" },
              seller_full_address: { $first: "$products.seller.full_address" },
              quantity: { $first: "$quantity" },
              price: { $first: "$price" },
              delivery_price: { $first: "$delivery_price" },
              coupon_discount: { $first: "$coupon_discount" },
              total_price: { $first: "$total_price" },
              tax_percentage: { $first: "$tax_percentage" },
              tax_amount: { $first: "$tax_amount" },
              invoice_date: { $first: "$invoice.created_at" },
              // user_address: { $first: "$order_products.address" },
              // quantity: { $first: "$quantity" },
              // quantity: { $first: "$quantity" },
              // quantity: { $first: "$quantity" },
            },
          },
          //   {
          //     $group: {
          //       _id: "$_id",
          //         name: { $first: "$products.name" },
          //         description: { $first: "$products.description" },
          //         images: { $first: "$products.images" },
          //         seller: { $first: "$products.seller" },
          //     },
          //   },
        ],
        as: "order_products",
      },
    };
  } catch (err) {
    throw err;
  }
};



const match = async (order_id: string, seller_id: string) => {
  try {
    return {
      $match: {
        _id: mongoose.Types.ObjectId(order_id),
        user_id: mongoose.Types.ObjectId(seller_id),
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
              cancel_request_accepted: 1,
              cancel_requested: 1,
              cancellation_reason: 1,
              description: 1,
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
              company: 1,
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
        let: { address_id: "$address_id" },
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

const lookup_order_invoice = async (order_id: any) => {
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
          },
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
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

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
              category_id: 1,
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
              // ratings: { $first: "$reviews" },
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

export {
    match,
    match_order_id,
    lookup_order,
    unwind_orders,
    lookup_sellers,
    unwind_sellers,
    lookup_users,
    unwind_users,
    lookup_order_products,
    unwind_order_products,
    lookup_ordered_products,
    lookup_products,
    lookup_other_product,
    unwind_products,
    lookup_reviews_data,
    lookup_address,
    unwind_address,
    lookup_ordered_invoice,
    lookup_order_invoice,
    unwind_invoice,
    lookup_product_invoice,
    group_data,
    group_data1,
    group_other_items,
    group_invoice_data,
    match_data,
    sort_data
}

