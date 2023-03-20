import { z } from 'zod';
import type { ApiService } from './api.service';
import { ApiTarget } from './api.service';

const group = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  groupName: z.string(),
  recipientCount: z.number(),
  status: z.boolean(),
  notes: z.string(),
  location: z.object({
    id: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    county: z.string(),
    country: z.string(),
  }),
  deviceId: z.string(),
});

const noSchema = z.object({});

const groups = z.object({ data: z.array(group), total: z.number() });

export type Group = z.infer<typeof group>;

interface Data {
  groupName: string;
  status: boolean;
  notes: string;
  location: {
    id: number;
  };
  deviceId: string;
}

export class GroupService {
  constructor(private apiService: ApiService) {
    this.apiService.setTarget(ApiTarget.SMARTSUITE);
    this.apiService.setUrl('groups');
  }

  setAuth() {
    this.apiService.setOptions({
      headers: {
        Authorization: `bearer ${localStorage.getItem('ss_token')}`,
      },
    });
  }

  getAll() {
    return this.apiService.get(groups);
  }

  update(id: number, data: Data) {
    return this.apiService.put(group, data, `/groups/${id}`);
  }

  fetch(data: Data) {
    return this.apiService.post(noSchema, data, `/groups/fetch`);
  }

  delete(id: number) {
    return this.apiService.delete(groups, `groups/${id}`);
  }

  createGroup(data: {}) {
    return this.apiService.post(group, data);
  }
}
