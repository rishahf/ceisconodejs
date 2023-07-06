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
exports.validate_login = void 0;
const joi_1 = __importDefault(require("joi"));
const index_1 = require("../../middlewares/index");
const validate_login = (request) => __awaiter(void 0, void 0, void 0, function* () {
    let schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
        language: joi_1.default.string().required().valid('ARABIC', 'ENGLISH')
    });
    let { error } = schema.validate(request.body);
    if (error) {
        yield (0, index_1.handle_joi_error)(error);
    }
});
exports.validate_login = validate_login;
