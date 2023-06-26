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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulk_find_and_update = exports.bulk_find_and_update_one = exports.insert_many = exports.insert_data = exports.aggregate_with_populate_data = exports.aggregate_data = exports.count_data = exports.deep_populate_data = exports.populate_data = exports.remove_many = exports.remove_data = exports.update_many = exports.find_and_update = exports.get_unique_data = exports.get_single_data = exports.get_data = exports.save_data = void 0;
const save_data = (model, data) => {
    return new Promise((resolve, reject) => {
        try {
            let save_info = model.create(data);
            return resolve(save_info);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.save_data = save_data;
const get_data = (model, query, projection, options) => {
    return new Promise((resolve, reject) => {
        try {
            let fetch_data = model.find(query, projection, options);
            return resolve(fetch_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.get_data = get_data;
const get_single_data = (model, query, projection, options) => {
    return new Promise((resolve, reject) => {
        try {
            let fetch_data = model.findOne(query, projection, options);
            return resolve(fetch_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.get_single_data = get_single_data;
const get_unique_data = (model, key_name, query, options) => {
    return new Promise((resolve, reject) => {
        try {
            let fetch_data = model.distinct(key_name, query, options);
            return resolve(fetch_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.get_unique_data = get_unique_data;
const find_and_update = (model, query, update, options) => {
    return new Promise((resolve, reject) => {
        try {
            let update_data = model.findOneAndUpdate(query, update, options);
            return resolve(update_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.find_and_update = find_and_update;
const update_many = (model, query, update) => {
    return new Promise((resolve, reject) => {
        try {
            let update_data = model.updateMany(query, update);
            return resolve(update_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.update_many = update_many;
const remove_data = (model, query) => {
    return new Promise((resolve, reject) => {
        try {
            let delete_data = model.deleteOne(query);
            return resolve(delete_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.remove_data = remove_data;
const remove_many = (model, query) => {
    return new Promise((resolve, reject) => {
        try {
            let delete_data = model.deleteMany(query);
            return resolve(delete_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.remove_many = remove_many;
const populate_data = (model, query, projection, options, collection_options) => {
    return new Promise((resolve, reject) => {
        try {
            let fetch_data = model.find(query, projection, options).populate(collection_options).exec();
            return resolve(fetch_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.populate_data = populate_data;
const deep_populate_data = (model, query, projection, options, coll_options, pop_options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fetch_data = yield model.find(query, projection, options).populate(coll_options).exec();
        let populate_data = yield model.populate(fetch_data, pop_options);
        return (populate_data);
    }
    catch (err) {
        return (err);
    }
});
exports.deep_populate_data = deep_populate_data;
const count_data = (model, query) => {
    return new Promise((resolve, reject) => {
        try {
            let fetch_data = model.countDocuments(query);
            return resolve(fetch_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.count_data = count_data;
const aggregate_data = (model, group, options) => {
    return new Promise((resolve, reject) => {
        try {
            let fetch_data;
            if (options !== undefined) {
                fetch_data = model.aggregate(group).option(options);
            }
            else {
                fetch_data = model.aggregate(group);
            }
            return resolve(fetch_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.aggregate_data = aggregate_data;
const aggregate_with_populate_data = (model, group, options, populate_options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fetch_data;
        if (options !== undefined) {
            fetch_data = yield model.aggregate(group).option(options);
        }
        else {
            fetch_data = yield model.aggregate(group);
        }
        let populate_data = yield model.populate(fetch_data, populate_options);
        return (populate_data);
    }
    catch (err) {
        return (err);
    }
});
exports.aggregate_with_populate_data = aggregate_with_populate_data;
const insert_data = (model, data, options) => {
    return new Promise((resolve, reject) => {
        try {
            let save_data = model.collection.insert(data, options);
            return resolve(save_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.insert_data = insert_data;
const insert_many = (model, data, options) => {
    return new Promise((resolve, reject) => {
        try {
            let save_data = model.collection.insertMany(data, options);
            return resolve(save_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.insert_many = insert_many;
const bulk_find_and_update_one = (bulk, query, update, options) => {
    return new Promise((resolve, reject) => {
        try {
            let update_data = bulk.find(query).upsert().update(update, options);
            return resolve(update_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.bulk_find_and_update_one = bulk_find_and_update_one;
const bulk_find_and_update = (bulk, query, update, options) => {
    return new Promise((resolve, reject) => {
        try {
            let update_data = bulk.find(query).upsert().updateOne(update, options);
            return resolve(update_data);
        }
        catch (err) {
            return reject(err);
        }
    });
};
exports.bulk_find_and_update = bulk_find_and_update;
