const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

class Project {
  constructor({ _id, id, name, description, owner_id, created_at }) {
    this._id = _id || id || uuidv4();
    this._isNew = !(_id || id);
    this.name = name;
    this.description = description;
    this.owner_id = owner_id;
    this.created_at = created_at;
  }

  static async find(filter = {}) {
    const values = [];
    const conditions = [];
    if (filter.owner_id) {
      values.push(filter.owner_id);
      conditions.push(`owner_id = $${values.length}`);
    }
    if (filter._id) {
      values.push(filter._id);
      conditions.push(`id = $${values.length}`);
    }
    let query = 'SELECT id AS _id, name, description, owner_id, created_at FROM projects';
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await pool.query(query, values);
    return result.rows.map(row => new Project(row));
  }

  static async findOne(filter = {}) {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async save() {
    if (!this._isNew) {
      const result = await pool.query(
        'UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING id AS _id, name, description, owner_id, created_at',
        [this.name, this.description, this._id]
      );
      const project = result.rows[0];
      if (!project) return null;
      this.name = project.name;
      this.description = project.description;
      this.owner_id = project.owner_id;
      this.created_at = project.created_at;
      return this;
    }

    const result = await pool.query(
      'INSERT INTO projects (id, name, description, owner_id) VALUES ($1, $2, $3, $4) RETURNING id AS _id, name, description, owner_id, created_at',
      [this._id, this.name, this.description, this.owner_id]
    );
    const project = result.rows[0];
    this._id = project._id;
    this.name = project.name;
    this.description = project.description;
    this.owner_id = project.owner_id;
    this.created_at = project.created_at;
    this._isNew = false;
    return this;
  }

  static async findOneAndUpdate(filter = {}, update = {}) {
    const values = [];
    const setParts = [];
    if (update.name !== undefined) {
      values.push(update.name);
      setParts.push(`name = $${values.length}`);
    }
    if (update.description !== undefined) {
      values.push(update.description);
      setParts.push(`description = $${values.length}`);
    }
    if (!setParts.length) {
      return this.findOne(filter);
    }

    const conditions = [];
    if (filter._id) {
      values.push(filter._id);
      conditions.push(`id = $${values.length}`);
    }
    if (filter.owner_id) {
      values.push(filter.owner_id);
      conditions.push(`owner_id = $${values.length}`);
    }

    const query = `UPDATE projects SET ${setParts.join(', ')} WHERE ${conditions.join(' AND ')} RETURNING id AS _id, name, description, owner_id, created_at`;
    const result = await pool.query(query, values);
    if (!result.rows.length) return null;
    return new Project(result.rows[0]);
  }

  static async findOneAndDelete(filter = {}) {
    const values = [];
    const conditions = [];
    if (filter._id) {
      values.push(filter._id);
      conditions.push(`id = $${values.length}`);
    }
    if (filter.owner_id) {
      values.push(filter.owner_id);
      conditions.push(`owner_id = $${values.length}`);
    }
    const query = `DELETE FROM projects WHERE ${conditions.join(' AND ')} RETURNING id AS _id, name, description, owner_id, created_at`;
    const result = await pool.query(query, values);
    if (!result.rows.length) return null;
    return new Project(result.rows[0]);
  }

  toObject() {
    return {
      id: this._id,
      name: this.name,
      description: this.description,
      owner_id: this.owner_id,
      created_at: this.created_at
    };
  }
}

module.exports = Project;