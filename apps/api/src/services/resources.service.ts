import { v4 as uuidv4 } from 'uuid';
import db from '../db/client';

export interface CampusResource {
  id: string;
  name: string;
  type: string; // 'on-campus' | 'clinic' | 'pharmacy' | 'counseling' | 'hotline'
  category: string; // 'testing' | 'contraception' | 'counseling' | 'emergency' | 'general'
  address: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  services: string[];
  costInfo?: string;
  studentFriendly: boolean;
  freeServices?: string[];
  latitude?: number;
  longitude?: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ResourcesService {
  getAllResources(params?: {
    type?: string;
    category?: string;
    city?: string;
    studentFriendly?: boolean;
    search?: string;
    limit?: number;
  }): CampusResource[] {
    let query = 'SELECT * FROM campus_resources WHERE 1=1';
    const queryParams: any[] = [];

    if (params?.type) {
      query += ' AND type = ?';
      queryParams.push(params.type);
    }

    if (params?.category) {
      query += ' AND category = ?';
      queryParams.push(params.category);
    }

    if (params?.city) {
      query += ' AND city = ?';
      queryParams.push(params.city);
    }

    if (params?.studentFriendly !== undefined) {
      query += ' AND student_friendly = ?';
      queryParams.push(params.studentFriendly ? 1 : 0);
    }

    if (params?.search) {
      query += ' AND (name LIKE ? OR services LIKE ? OR address LIKE ?)';
      const searchTerm = `%${params.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY student_friendly DESC, verified DESC, name ASC';

    if (params?.limit) {
      query += ' LIMIT ?';
      queryParams.push(params.limit);
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...queryParams) as any[];

    return rows.map(row => this.rowToResource(row));
  }

  getResourceById(id: string): CampusResource | null {
    const stmt = db.prepare('SELECT * FROM campus_resources WHERE id = ?');
    const row = stmt.get(id) as any;

    return row ? this.rowToResource(row) : null;
  }

  getResourcesByType(type: string, limit = 20): CampusResource[] {
    const stmt = db.prepare(`
      SELECT * FROM campus_resources 
      WHERE type = ? 
      ORDER BY student_friendly DESC, name ASC 
      LIMIT ?
    `);
    const rows = stmt.all(type, limit) as any[];

    return rows.map(row => this.rowToResource(row));
  }

  getResourcesByCategory(category: string, limit = 20): CampusResource[] {
    const stmt = db.prepare(`
      SELECT * FROM campus_resources 
      WHERE category = ? 
      ORDER BY student_friendly DESC, name ASC 
      LIMIT ?
    `);
    const rows = stmt.all(category, limit) as any[];

    return rows.map(row => this.rowToResource(row));
  }

  createResource(resource: Omit<CampusResource, 'id' | 'createdAt' | 'updatedAt'>): CampusResource {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO campus_resources (
        id, name, type, category, address, city, phone, email, website, 
        hours, services, cost_info, student_friendly, free_services, 
        latitude, longitude, verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      resource.name,
      resource.type,
      resource.category,
      resource.address,
      resource.city,
      resource.phone || null,
      resource.email || null,
      resource.website || null,
      resource.hours || null,
      JSON.stringify(resource.services),
      resource.costInfo || null,
      resource.studentFriendly ? 1 : 0,
      resource.freeServices ? JSON.stringify(resource.freeServices) : null,
      resource.latitude || null,
      resource.longitude || null,
      resource.verified ? 1 : 0,
      now,
      now
    );

    return this.getResourceById(id)!;
  }

  private rowToResource(row: any): CampusResource {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      address: row.address,
      city: row.city,
      phone: row.phone,
      email: row.email,
      website: row.website,
      hours: row.hours,
      services: JSON.parse(row.services || '[]'),
      costInfo: row.cost_info,
      studentFriendly: row.student_friendly === 1,
      freeServices: row.free_services ? JSON.parse(row.free_services) : undefined,
      latitude: row.latitude,
      longitude: row.longitude,
      verified: row.verified === 1,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

export default new ResourcesService();