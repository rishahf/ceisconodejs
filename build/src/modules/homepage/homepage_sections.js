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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.section_module = void 0;
const DAO = __importStar(require("../../DAO"));
const models_1 = require("../../models");
class section_module {
}
exports.section_module = section_module;
_a = section_module;
section_module.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { top_banners, middle_banners: mid_banners, bottom_banners: btm_banners, deal_of_the_day: dod, top_deals: td, fashion_deals: fd, style_for_categories: sfc, featured_categories: fc, shop_with_us: swu, best_on_ecom: boe, language } = req.body;
        let query = {};
        let projection = { __v: 0 };
        let options = { lean: true, sort: { _id: -1 } };
        let retrive_sections = yield DAO.get_data(models_1.HomePageSections, query, projection, options);
        if (retrive_sections.length) {
            let { _id } = retrive_sections[0];
            let query = { _id: _id };
            let update = { updated_at: +new Date() };
            if (typeof top_banners !== undefined && top_banners !== null && top_banners !== undefined) {
                update.top_banners = top_banners;
            }
            if (typeof mid_banners !== undefined && mid_banners !== null && mid_banners !== undefined) {
                update.middle_banners = mid_banners;
            }
            if (typeof btm_banners !== undefined && btm_banners !== null && btm_banners !== undefined) {
                update.bottom_banners = btm_banners;
            }
            if (typeof dod !== undefined && dod !== null && dod !== undefined) {
                update.deal_of_the_day = dod;
            }
            if (typeof td !== undefined && td !== null && td !== undefined) {
                update.top_deals = td;
            }
            if (typeof fd !== undefined && fd !== null && fd !== undefined) {
                update.fashion_deals = fd;
            }
            if (typeof sfc !== undefined && sfc !== null && sfc !== undefined) {
                update.style_for_categories = sfc;
            }
            if (typeof fc !== undefined && fc !== null && fc !== undefined) {
                update.featured_categories = fc;
            }
            if (typeof swu !== undefined && swu !== null && swu !== undefined) {
                update.shop_with_us = swu;
            }
            if (typeof boe !== undefined && boe !== null && boe !== undefined) {
                update.best_on_ecom = boe;
            }
            if (language) {
                update.language = language;
            }
            let options = { new: true };
            let response = yield DAO.find_and_update(models_1.HomePageSections, query, update, options);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
