// Copyright (c) 2018 Bhojpur Consulting Private Limited, India. All rights reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { action, flow, makeObservable, observable } from 'mobx';

import { apiFetcher } from '../utils/fetch';

export default class Lease {
  selected = {};
  items = [];

  constructor() {
    makeObservable(this, {
      selected: observable,
      setSelected: action,
      items: observable,
      fetch: flow,
      fetchOne: flow,
      create: flow,
      update: flow,
      delete: flow,
    });
  }

  setSelected = (lease) => (this.selected = lease);

  *fetch() {
    try {
      const response = yield apiFetcher().get('/leases');

      this.items = response.data;
      if (this.selected) {
        this.selected = this.items.find(({ _id }) => this.selected._id === _id);
      }
      return { status: 200, data: response.data };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *fetchOne(leaseId) {
    try {
      const response = yield apiFetcher().get(`/leases/${leaseId}`);
      const updatedLease = response.data;
      const index = this.items.findIndex((item) => item._id === leaseId);
      if (index > -1) {
        this.items.splice(index, 1, updatedLease);
      }
      if (this.selected?._id === updatedLease._id) {
        this.selected = updatedLease;
      }
      return { status: 200, data: updatedLease };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *create(lease) {
    try {
      const response = yield apiFetcher().post('/leases', lease);
      const createdLease = response.data;
      this.items.push(createdLease);

      return { status: 200, data: createdLease };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *update(lease) {
    try {
      const response = yield apiFetcher().patch(`/leases/${lease._id}`, lease);
      const updatedLease = response.data;
      const index = this.items.findIndex((item) => item._id === lease._id);
      if (index > -1) {
        this.items.splice(index, 1, updatedLease);
      }
      if (this.selected?._id === updatedLease._id) {
        this.selected = updatedLease;
      }
      return { status: 200, data: updatedLease };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *delete(ids) {
    try {
      yield apiFetcher().delete(`/leases/${ids.join(',')}`);
      this.items = this.items.filter((lease) => !ids.includes(lease._id));
      if (ids.includes(this.selected?._id)) {
        this.selected = null;
      }
      return { status: 200 };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }
}