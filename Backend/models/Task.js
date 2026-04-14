const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

class Task {
  constructor({ _id, id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at }) {
    this._id = _id || id || uuidv4();
    this._isNew = !(_id || id);
    this.title = title;
    this.description = description;
    this.status = status || 'todo';
    this.priority = priority || 'medium';
    this.project_id = project_id;
    this.assignee_id = assignee_id;
    this.due_date = due_date;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async find(filter = {}) {
    const values = [];
    const conditions = [];
    if (filter.project_id) {
      values.push(filter.project_id);
      conditions.push(`project_id = $${values.length}`);
    }
    if (filter.status) {
      values.push(filter.status);
      conditions.push(`status = $${values.length}`);
    }
    if (filter.assignee_id) {
      values.push(filter.assignee_id);
      conditions.push(`assignee_id = $${values.length}`);
    }
    let query = 'SELECT id AS _id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at FROM tasks';
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    const result = await pool.query(query, values);
    return result.rows.map(row => new Task(row));
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id AS _id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at FROM tasks WHERE id = $1',
      [id]
    );
    if (!result.rows.length) return null;
    return new Task(result.rows[0]);
  }

  async save() {
    if (!this._isNew) {
      const result = await pool.query(
        `UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, project_id=$5, assignee_id=$6, due_date=$7, updated_at=NOW() WHERE id=$8 RETURNING id AS _id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at`,
        [this.title, this.description, this.status, this.priority, this.project_id, this.assignee_id, this.due_date, this._id]
      );
      const task = result.rows[0];
      if (!task) return null;
      this.title = task.title;
      this.description = task.description;
      this.status = task.status;
      this.priority = task.priority;
      this.project_id = task.project_id;
      this.assignee_id = task.assignee_id;
      this.due_date = task.due_date;
      this.created_at = task.created_at;
      this.updated_at = task.updated_at;
      return this;
    }

    const result = await pool.query(
      'INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id AS _id, title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at',
      [this._id, this.title, this.description, this.status, this.priority, this.project_id, this.assignee_id, this.due_date]
    );
    const task = result.rows[0];
    this.title = task.title;
    this.description = task.description;
    this.status = task.status;
    this.priority = task.priority;
    this.project_id = task.project_id;
    this.assignee_id = task.assignee_id;
    this.due_date = task.due_date;
    this.created_at = task.created_at;
    this.updated_at = task.updated_at;
    this._isNew = false;
    return this;
  }

  static async findByIdAndDelete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  static async deleteMany(filter = {}) {
    const values = [];
    const conditions = [];
    if (filter.project_id) {
      values.push(filter.project_id);
      conditions.push(`project_id = $${values.length}`);
    }
    const query = `DELETE FROM tasks ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}`;
    await pool.query(query, values);
  }

  toObject() {
    return {
      id: this._id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      project_id: this.project_id,
      assignee_id: this.assignee_id,
      due_date: this.due_date,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Task;