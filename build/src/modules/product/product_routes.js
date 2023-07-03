"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller = __importStar(require("./product_controller"));
const router = express_1.default.Router();
router.get("/", product_controller.list_products);
router.get("/related", product_controller.list_related_products);
router.get("/details", product_controller.product_details);
router.get("/reviews", product_controller.list_reviews);
router.get("/products/variants", product_controller.list_product_variants);
router.get("/faqs", product_controller.list_faqs);
router.get("/product_faqs", product_controller.list_product_faqs);
router.get("/categories", product_controller.list_categories);
router.get("/subcategories", product_controller.list_sub_categories);
router.get("/sub_subcategories", product_controller.list_sub_subcategories);
router.get("/brands", product_controller.list_brands);
router.get("/banners", product_controller.list_banners);
router.get("/deals_of_the_day", product_controller.list_deals_of_the_day);
router.get("/deals_of_the_day/products", product_controller.listing_deals_of_the_day_products);
router.get("/hot_deals", product_controller.list_hot_deals);
router.get("/hot_deals/products", product_controller.listing_hot_deals_products);
router.get("/fashion_deals", product_controller.list_fashion_deals);
router.get("/fashion_deals/products", product_controller.listing_fashion_deals_products);
//check_delivery
router.get("/check/delivery", product_controller.searchDeliveryLocation);
// filters
router.get("/filters", product_controller.retrive_filter_products);
exports.default = router;
