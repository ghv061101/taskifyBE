const pool = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor({ _id, id, name, email, password, created_at }) {
    this._id = _id || id || uuidv4();
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
  }

  async save() {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    const result = await pool.query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id AS _id, name, email, created_at',
      [this._id, this.name, this.email, hashedPassword]
    );
    const user = result.rows[0];
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.created_at = user.created_at;
    return this;
  }

  async comparePassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }

  static async findOne(filter = {}) {
    const keys = Object.keys(filter);
    if (!keys.length) return null;

    const values = [];
    const conditions = keys.map((key, index) => {
      const param = `$${index + 1}`;
      values.push(filter[key]);
      return key === '_id' ? `id = ${param}` : `${key} = ${param}`;
    });

    const query = `SELECT id AS _id, name, email, password, created_at FROM users WHERE ${conditions.join(' AND ')}`;
    const result = await pool.query(query, values);
    if (!result.rows.length) return null;
    return new User(result.rows[0]);
  }
}

module.exports = User;