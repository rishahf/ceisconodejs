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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const moment_days_1 = __importDefault(require("./moment_days"));
class user_graph extends moment_days_1.default {
    static retrive_graph(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { type: graph_type } = req.query, response = [];
                if (graph_type == 'DAILY') {
                    response = yield this.daily_graph();
                }
                if (graph_type == 'WEEKLY') {
                    response = yield this.weekly_graph();
                }
                if (graph_type == 'MONTHLY') {
                    response = yield this.monthly_graph();
                }
                if (graph_type == 'YEARLY') {
                    response = yield this.yearly_graph();
                }
                return {
                    total_count: response.length,
                    data: response
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
_a = user_graph;
user_graph.daily_graph = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let graph_data = [];
        let days = yield _a.retrive_daily_data();
        if (days.length) {
            for (let value of days) {
                let { hour, start_of_hour, end_of_hour } = value;
                let query = {
                    created_at: {
                        $gte: start_of_hour,
                        $lte: end_of_hour
                    }
                };
                let users = yield DAO.count_data(Models.Users, query);
                if (users > 0) {
                    graph_data.push({
                        hour: hour,
                        total_users: users
                    });
                }
            }
        }
        return graph_data;
    }
    catch (err) {
        throw err;
    }
});
user_graph.weekly_graph = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let graph_data = [];
        let days = yield _a.retrive_weekly_data();
        if (days.length) {
            for (let value of days) {
                let { day, start_of_day, end_of_day } = value;
                let query = {
                    created_at: {
                        $gte: start_of_day,
                        $lte: end_of_day
                    }
                };
                let users = yield DAO.count_data(Models.Users, query);
                if (users > 0) {
                    graph_data.push({
                        day: day,
                        total_users: users
                    });
                }
            }
        }
        return graph_data;
    }
    catch (err) {
        throw err;
    }
});
user_graph.monthly_graph = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let graph_data = [];
        let days = yield _a.retrive_monthly_data();
        if (days.length) {
            for (let value of days) {
                let { date, start_of_day, end_of_day } = value;
                let query = {
                    created_at: {
                        $gte: start_of_day,
                        $lte: end_of_day
                    }
                };
                let users = yield DAO.count_data(Models.Users, query);
                if (users > 0) {
                    graph_data.push({
                        date: date,
                        total_users: users
                    });
                }
            }
        }
        return graph_data;
    }
    catch (err) {
        throw err;
    }
});
user_graph.yearly_graph = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let graph_data = [];
        let days = yield _a.retrive_yearly_data();
        if (days.length) {
            for (let value of days) {
                let { month, start_of_month, end_of_month } = value;
                let query = {
                    created_at: {
                        $gte: start_of_month,
                        $lte: end_of_month
                    }
                };
                let users = yield DAO.count_data(Models.Users, query);
                if (users > 0) {
                    graph_data.push({
                        month: month,
                        total_users: users,
                    });
                }
            }
        }
        return graph_data;
    }
    catch (err) {
        throw err;
    }
});
exports.default = user_graph;
