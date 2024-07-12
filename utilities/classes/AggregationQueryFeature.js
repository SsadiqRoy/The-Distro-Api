const { isDate } = require('../utitlities');

class AggregationQuery {
  #query;
  #filterQuery;
  #Schema;
  #meta;
  #stages;

  constructor(Schema, query, stages) {
    this.#Schema = Schema;
    this.#filterQuery = {};
    this.#query = query;
    this.#meta = { ...query };
    this.#stages = stages;
  }

  async execute() {
    this.#filter();

    // console.log(this.#filterQuery);

    const query = await this.#Schema.aggregate(this.#stages);
    const total = await this.#Schema.countDocuments(this.#filterQuery);

    this.#meta.total = total;
    this.#meta.length = query.length;

    return { data: query, meta: this.#meta };
  }

  #exclude() {
    const excludedList = ['page', 'limit', 'consumed', 'total', 'length', 'available', 'sort', 'search', 'fields', 'searchFields', 'populate'];
    this.#filterQuery = { ...this.#query };

    excludedList.forEach((item) => delete this.#filterQuery[item]);
  }

  #replaceOperators() {
    let newValue = JSON.stringify(this.#filterQuery);
    newValue = newValue.replace(/\b(gte|gt|lt|and|not|or|nor|lte|ne|in|nin|eq)\b/g, (match) => `$${match}`);
    this.#filterQuery = JSON.parse(newValue);
  }

  #formatQuery(obj) {
    const nobj = {};

    for (let key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        if (value.includes(',')) nobj[key] = value.split(',');
        else if (value === 'true') nobj[key] = true;
        else if (value === 'false') nobj[key] = false;
        else if (isDate(value)) nobj[key] = new Date(value);
        else nobj[key] = value;
      }

      if (typeof value === 'object') {
        nobj[key] = this.#formatQuery(value);
      }
    }

    return nobj;
  }

  #filter() {
    this.#exclude();
    this.#replaceOperators();
    this.#filterQuery = this.#formatQuery(this.#filterQuery);
    this.#stages = [{ $match: this.#filterQuery }, ...this.#stages];
  }
}

module.exports = AggregationQuery;
