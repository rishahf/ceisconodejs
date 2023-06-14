import { rejects } from "assert";
import { resolve } from "path/posix";


const save_data = (model: any, data: any) => {
    return new Promise((resolve, reject) => {
        try {

            let save_info = model.create(data);
            return resolve(save_info);

        } catch (err) {
            return reject(err);
        }
    });
}

const get_data = (model: any, query: any, projection: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let fetch_data = model.find(query, projection, options);
            return resolve(fetch_data);

        } catch (err) {
            return reject(err);
        }
    });
}


const get_single_data = (model: any, query: any, projection: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let fetch_data = model.findOne(query, projection, options);
            return resolve(fetch_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const get_unique_data = (model: any, key_name: string, query: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let fetch_data = model.distinct(key_name, query, options);
            return resolve(fetch_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const find_and_update = (model: any, query: any, update: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let update_data = model.findOneAndUpdate(query, update, options);
            return resolve(update_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const update_many = (model: any, query: any, update: any) => {
    return new Promise((resolve, reject) => {
        try {

            let update_data = model.updateMany(query, update);
            return resolve(update_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const remove_data = (model: any, query: any) => {
    return new Promise((resolve, reject) => {
        try {

            let delete_data = model.deleteOne(query);
            return resolve(delete_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const remove_many = (model: any, query: any) => {
    return new Promise((resolve, reject) => {
        try {

            let delete_data = model.deleteMany(query);
            return resolve(delete_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const populate_data = (model: any, query: any, projection: any, options: any, collection_options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let fetch_data = model.find(query, projection, options).populate(collection_options).exec();
            return resolve(fetch_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const deep_populate_data = async (model: any, query: any, projection: any, options: any, coll_options: any, pop_options: any) => {
    try {

        let fetch_data = await model.find(query, projection, options).populate(coll_options).exec();
        let populate_data = await model.populate(fetch_data, pop_options);
        return (populate_data);

    } catch (err) {
        return (err);
    }

}

const count_data = (model: any, query: any) => {
    return new Promise((resolve, reject) => {
        try {

            let fetch_data = model.countDocuments(query);
            return resolve(fetch_data);

        } catch (err) {
            return reject(err);
        }
    });
}

const aggregate_data = (model: any, group: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let fetch_data: any;
            if (options !== undefined) {
                fetch_data = model.aggregate(group).option(options);
            } else {
                fetch_data = model.aggregate(group);
            }

            return resolve(fetch_data);

        }
        catch (err) {
            return reject(err);
        }
    });
}

const aggregate_with_populate_data = async (model: any, group: any, options: any, populate_options: any) => {
    try {

        let fetch_data: any;
        if (options !== undefined) {
            fetch_data = await model.aggregate(group).option(options);
        } else {
            fetch_data = await model.aggregate(group);
        }

        let populate_data = await model.populate(fetch_data, populate_options);
        return (populate_data);
    }
    catch (err) {
        return (err);
    }
}

const insert_data = (model: any, data: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let save_data = model.collection.insert(data, options);
            return resolve(save_data);

        }
        catch (err) {
            return reject(err);
        }
    });
}

const insert_many = (model: any, data: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let save_data = model.collection.insertMany(data, options);
            return resolve(save_data);

        }
        catch (err) {
            return reject(err);
        }
    });
}

const bulk_find_and_update_one = (bulk: any, query: any, update: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let update_data = bulk.find(query).upsert().update(update, options);
            return resolve(update_data);

        }
        catch (err) {
            return reject(err);
        }
    });
}

const bulk_find_and_update = (bulk: any, query: any, update: any, options: any) => {
    return new Promise((resolve, reject) => {
        try {

            let update_data = bulk.find(query).upsert().updateOne(update, options);
            return resolve(update_data);

        }
        catch (err) {
            return reject(err);
        }
    });
}


export {
    save_data,
    get_data,
    get_single_data,
    get_unique_data,
    find_and_update,
    update_many,
    remove_data,
    remove_many,
    populate_data,
    deep_populate_data,
    count_data,
    aggregate_data,
    aggregate_with_populate_data,
    insert_data,
    insert_many,
    bulk_find_and_update_one,
    bulk_find_and_update

}





