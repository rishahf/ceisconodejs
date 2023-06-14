const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);


class moment_days {

    static retrive_daily_data = async () => {
        try {
            let start_of_day = Moment.utc().startOf('day').format('x')
            let end_of_day = Moment.utc().endOf('day').format('x')
            let start_date = Moment(start_of_day, 'x')
            let end_date = Moment(end_of_day, 'x')

            let range = moment.range(start_date, end_date);
            let range_data = Array.from(range.by('hours', { excludeEnd: false }));
            let response: any = []
            for (let value of range_data) {
                response.push({
                    hour: Moment.utc(value).format('HH'),
                    day: Moment.utc(value).format('dddd'),
                    month: Moment.utc(value).format('MMMM'),
                    date: Moment.utc(value).format('DD'),
                    full_date: Moment.utc(value).format('DD-MM-YYYY'),
                    start_of_hour: Moment.utc(value).startOf('hour').format('x'),
                    end_of_hour: Moment.utc(value).endOf('hour').format('x')
                })
            }
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static retrive_weekly_data = async () => {
        try {
            let start_of_day = Moment.utc().startOf('day').subtract(6, 'days').format('x')
            let end_of_day = Moment.utc().format('x')
            let start_date = Moment(start_of_day, 'x')
            let end_date = Moment(end_of_day, 'x')

            let range = moment.range(start_date, end_date);
            let range_data = Array.from(range.by('day', { excludeEnd: false }));
            let response: any = []
            for (let value of range_data) {
                response.push({
                    hour: Moment.utc(value).format('HH'),
                    day: Moment.utc(value).format('dddd'),
                    month: Moment.utc(value).format('MMMM'),
                    date: Moment.utc(value).format('DD'),
                    full_date: Moment.utc(value).format('DD-MM-YYYY'),
                    start_of_day: Moment.utc(value).startOf('day').format('x'),
                    end_of_day: Moment.utc(value).endOf('day').format('x')
                })
            }
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static retrive_monthly_data = async () => {
        try {

            let start_of_month = Moment.utc().startOf('month').format('x')
            let end_of_month = Moment.utc().endOf('month').format('x')
            let start_date = Moment(start_of_month, 'x')
            let end_date = Moment(end_of_month, 'x')
            let range = moment.range(start_date, end_date);
            let range_data = Array.from(range.by('day', { excludeEnd: false }));

            let response: any = []
            for (let value of range_data) {
                response.push({
                    hour: Moment.utc(value).format('HH'),
                    day: Moment.utc(value).format('dddd'),
                    month: Moment.utc(value).format('MMMM'),
                    date: Moment.utc(value).format('DD'),
                    full_date: Moment.utc(value).format('DD-MM-YYYY'),
                    start_of_day: Moment.utc(value).startOf('day').format('x'),
                    end_of_day: Moment.utc(value).endOf('day').format('x')
                })
            }
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static retrive_yearly_data = async () => {
        try {
            let start_of_day = Moment.utc().startOf('day').subtract(1, 'year').format('x')
            let end_of_day = Moment.utc().format('x')
            let start_date = Moment(start_of_day, 'x')
            let end_date = Moment(end_of_day, 'x')

            let range = moment.range(start_date, end_date);
            let range_data = Array.from(range.by('month', { excludeEnd: false }));

            let response: any = []
            for (let value of range_data) {
                response.push({
                    hour: Moment.utc(value).format('HH'),
                    day: Moment.utc(value).format('dddd'),
                    month: Moment.utc(value).format('MMMM'),
                    date: Moment.utc(value).format('DD'),
                    full_date: Moment.utc(value).format('DD-MM-YYYY'),
                    start_of_month: Moment.utc(value).startOf('month').format('x'),
                    end_of_month: Moment.utc(value).endOf('month').format('x')
                })
            }
            return response
        }
        catch (err) {
            throw err;
        }
    }

}

export default moment_days

