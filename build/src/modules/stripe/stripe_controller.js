"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_module_1 = __importDefault(require("./card_module"));
class controller {
    static gen_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield card_module_1.default.generate_token(req);
                let message = "Success";
                res.send({
                    success: true,
                    message: message,
                    data: response
                });
            }
            catch (err) {
                if (err.raw != undefined) {
                    res.status(err.raw.statusCode).send({
                        success: false,
                        error: err.raw.type,
                        error_description: err.raw.message
                    });
                }
                else {
                    res.status(err.status_code).send({
                        success: false,
                        error: err.type,
                        error_description: err.error_message
                    });
                }
                res.end();
            }
        });
    }
    static create_a_card(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield card_module_1.default.create_card(req);
                let message = "Success";
                res.send({
                    success: true,
                    message: message,
                    data: response
                });
            }
            catch (err) {
                if (err.raw != undefined) {
                    res.status(err.raw.statusCode).send({
                        success: false,
                        error: err.raw.type,
                        error_description: err.raw.message
                    });
                }
                else {
                    res.status(err.status_code).send({
                        success: false,
                        error: err.type,
                        error_description: err.error_message
                    });
                }
                res.end();
            }
        });
    }
    static list_cards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield card_module_1.default.retrive_cards(req);
                let message = "Success";
                res.send({
                    success: true,
                    message: message,
                    data: response
                });
            }
            catch (err) {
                if (err.raw != undefined) {
                    res.status(err.raw.statusCode).send({
                        success: false,
                        error: err.raw.type,
                        error_description: err.raw.message
                    });
                }
                else {
                    res.status(err.status_code).send({
                        success: false,
                        error: err.type,
                        error_description: err.error_message
                    });
                }
                res.end();
            }
        });
    }
    static delete_card(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield card_module_1.default.deleteCard(req);
                let message = "Success";
                res.send({
                    success: true,
                    message: message,
                    data: response
                });
            }
            catch (err) {
                if (err.raw != undefined) {
                    res.status(err.raw.statusCode).send({
                        success: false,
                        error: err.raw.type,
                        error_description: err.raw.message
                    });
                }
                else {
                    res.status(err.status_code).send({
                        success: false,
                        error: err.type,
                        error_description: err.error_message
                    });
                }
                res.end();
            }
        });
    }
}
exports.default = controller;
