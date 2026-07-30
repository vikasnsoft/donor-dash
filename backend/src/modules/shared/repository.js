/**
 * Base Repository — thin wrapper around Mongoose model.
 * All modules should extend this for consistent data access.
 * 
 * Services call repositories. Controllers never call repositories directly.
 * Repositories handle: find, create, update, delete, pagination.
 * Services handle: business logic, validation, transactions, events.
 */
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, options = {}) {
    let query = this.model.findById(id);
    if (options.select) query = query.select(options.select);
    if (options.populate) {
      for (const pop of [].concat(options.populate)) {
        if (typeof pop === 'string') {
          query = query.populate(pop);
        } else {
          query = query.populate(pop.path, pop.select);
        }
      }
    }
    return await query;
  }

  async findOne(filter, options = {}) {
    let query = this.model.findOne(filter);
    if (options.select) query = query.select(options.select);
    return await query;
  }

  async find(filter, options = {}) {
    let query = this.model.find(filter);
    if (options.select) query = query.select(options.select);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) {
      for (const pop of [].concat(options.populate)) {
        if (typeof pop === 'string') {
          query = query.populate(pop);
        } else {
          query = query.populate(pop.path, pop.select);
        }
      }
    }
    return await query;
  }

  async create(data, options = {}) {
    if (options.session) {
      const [doc] = await this.model.create([data], { session: options.session });
      return doc;
    }
    return await this.model.create(data);
  }

  async updateById(id, data, options = {}) {
    let query = this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      ...options,
    });
    if (options.select) query = query.select(options.select);
    return await query;
  }

  async updateOne(filter, data, options = {}) {
    return await this.model.updateOne(filter, data, options);
  }

  async deleteOne(filter, options = {}) {
    return await this.model.deleteOne(filter, options);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async exists(filter) {
    return await this.model.exists(filter);
  }

  /**
   * Paginated query — returns { data, total, page, limit, totalPages }
   */
  async paginate(filter, options = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
    const sort = options.sort || '-createdAt';

    const [data, total] = await Promise.all([
      this.find(filter, {
        ...options,
        sort,
        skip: (page - 1) * limit,
        limit,
      }),
      this.count(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
