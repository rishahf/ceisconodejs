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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
class moment_days {
}
_a = moment_days;
moment_days.retrive_daily_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let start_of_day = Moment.utc().startOf('day').format('x');
        let end_of_day = Moment.utc().endOf('day').format('x');
        let start_date = Moment(start_of_day, 'x');
        let end_date = Moment(end_of_day, 'x');
        let range = moment.range(start_date, end_date);
        let range_data = Array.from(range.by('hours', { excludeEnd: false }));
        let response = [];
        for (let value of range_data) {
            response.push({
                hour: Moment.utc(value).format('HH'),
                day: Moment.utc(value).format('dddd'),
                month: Moment.utc(value).format('MMMM'),
                date: Moment.utc(value).format('DD'),
                full_date: Moment.utc(value).format('DD-MM-YYYY'),
                start_of_hour: Moment.utc(value).startOf('hour').format('x'),
                end_of_hour: Moment.utc(value).endOf('hour').format('x')
            });
        }
        return response;
    }
    catch (err) {
        throw err;
    }
});
moment_days.retrive_weekly_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let start_of_day = Moment.utc().startOf('day').subtract(6, 'days').format('x');
        let end_of_day = Moment.utc().format('x');
        let start_date = Moment(start_of_day, 'x');
        let end_date = Moment(end_of_day, 'x');
        let range = moment.range(start_date, end_date);
        let range_data = Array.from(range.by('day', { excludeEnd: false }));
        let response = [];
        for (let value of range_data) {
            response.push({
                hour: Moment.utc(value).format('HH'),
                day: Moment.utc(value).format('dddd'),
                month: Moment.utc(value).format('MMMM'),
                date: Moment.utc(value).format('DD'),
                full_date: Moment.utc(value).format('DD-MM-YYYY'),
                start_of_day: Moment.utc(value).startOf('day').format('x'),
                end_of_day: Moment.utc(value).endOf('day').format('x')
            });
        }
        return response;
    }
    catch (err) {
        throw err;
    }
});
moment_days.retrive_monthly_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let start_of_month = Moment.utc().startOf('month').format('x');
        let end_of_month = Moment.utc().endOf('month').format('x');
        let start_date = Moment(start_of_month, 'x');
        let end_date = Moment(end_of_month, 'x');
        let range = moment.range(start_date, end_date);
        let range_data = Array.from(range.by('day', { excludeEnd: false }));
        let response = [];
        for (let value of range_data) {
            response.push({
                hour: Moment.utc(value).format('HH'),
                day: Moment.utc(value).format('dddd'),
                month: Moment.utc(value).format('MMMM'),
                date: Moment.utc(value).format('DD'),
                full_date: Moment.utc(value).format('DD-MM-YYYY'),
                start_of_day: Moment.utc(value).startOf('day').format('x'),
                end_of_day: Moment.utc(value).endOf('day').format('x')
            });
        }
        return response;
    }
    catch (err) {
        throw err;
    }
});
moment_days.retrive_yearly_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let start_of_day = Moment.utc().startOf('day').subtract(1, 'year').format('x');
        let end_of_day = Moment.utc().format('x');
        let start_date = Moment(start_of_day, 'x');
        let end_date = Moment(end_of_day, 'x');
        let range = moment.range(start_date, end_date);
        let range_data = Array.from(range.by('month', { excludeEnd: false }));
        let response = [];
        for (let value of range_data) {
            response.push({
                hour: Moment.utc(value).format('HH'),
                day: Moment.utc(value).format('dddd'),
                month: Moment.utc(value).format('MMMM'),
                date: Moment.utc(value).format('DD'),
                full_date: Moment.utc(value).format('DD-MM-YYYY'),
                start_of_month: Moment.utc(value).startOf('month').format('x'),
                end_of_month: Moment.utc(value).endOf('month').format('x')
            });
        }
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.default = moment_days;
