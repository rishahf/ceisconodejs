
import express from 'express';
import * as product_controller from './product_controller';
const router = express.Router();


router.get("/",product_controller.list_products)
router.get("/related",product_controller.list_related_products)
router.get("/details",product_controller.product_details)
router.get("/reviews", product_controller.list_reviews)
router.get("/products/variants",product_controller.list_product_variants)
router.get("/faqs", product_controller.list_faqs)
router.get("/product_faqs", product_controller.list_product_faqs)
router.get("/categories", product_controller.list_categories)
router.get("/subcategories", product_controller.list_sub_categories)
router.get("/sub_subcategories", product_controller.list_sub_subcategories)
router.get("/brands", product_controller.list_brands)
router.get("/banners", product_controller.list_banners)
router.get("/deals_of_the_day", product_controller.list_deals_of_the_day)
router.get("/deals_of_the_day/products",product_controller.listing_deals_of_the_day_products)
router.get("/hot_deals", product_controller.list_hot_deals)
router.get("/hot_deals/products", product_controller.listing_hot_deals_products)
router.get("/fashion_deals", product_controller.list_fashion_deals)
router.get("/fashion_deals/products", product_controller.listing_fashion_deals_products)

//check_delivery
router.get("/check/delivery", product_controller.searchDeliveryLocation);

// filters
router.get("/filters",product_controller.retrive_filter_products)

export default router;