class QueryFeatures {
  #query;
  #filterQuery;
  #model;
  #Schema;
  #meta;

  constructor(Schema, query) {
    this.#Schema = Schema;
    this.#model = Schema.find();
    this.#filterQuery = {};
    this.#query = query;
    this.#meta = { ...query };
  }

  async execute() {
    this.#filter(), this.#sort(), this.#paginate(), this.#select(), this.#populate();

    const query = await this.#model;
    const total = await this.#Schema.countDocuments(this.#filterQuery);

    this.#meta.total = total;
    this.#meta.previous = this.#meta.consumed;
    this.#meta.consumed = this.#meta.consumed + query.length;
    this.#meta.available = total - this.#meta.consumed;
    this.#meta.length = query.length;
    delete this.#meta.searchFields;

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

  #search() {
    if (!this.#query.search || !this.#query.searchFields) return;

    const search = this.#query.search.split(',').map((value) => new RegExp(`${value}`, 'i'));

    this.#query.searchFields.split(',').forEach((field) => (this.#filterQuery[field] = { $in: search }));
  }

  #formatQuery(obj) {
    const nobj = {};

    for (let key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        if (value.includes(',')) nobj[key] = value.split(',');
        else if (value === 'true') nobj[key] = true;
        else if (value === 'false') nobj[key] = false;
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
    this.#search();
    this.#model.find(this.#filterQuery);
  }

  #sort() {
    if (!this.#query.sort) return;
    const sortBy = this.#query.sort.split(',').join(' ');

    this.#model.sort(sortBy);
  }

  #paginate() {
    const page = +this.#query.page || 1;
    const limit = +this.#query.limit || 10;
    const skip = (page - 1) * limit;
    this.#model.skip(skip).limit(limit);

    this.#meta.page = page;
    this.#meta.limit = limit;
    this.#meta.consumed = skip;
  }

  #select() {
    if (!this.#query.fields) return;
    const fields = this.#query.fields.split(',').join(' ');
    this.#model.select(fields);
  }

  #populate() {
    if (!this.#query.populate) return;
    this.#model.populate(this.#query.populate);
  }
}

module.exports = QueryFeatures;
