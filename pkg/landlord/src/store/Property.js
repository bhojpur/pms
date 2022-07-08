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

import { action, computed, flow, makeObservable, observable } from 'mobx';

import { apiFetcher } from '../utils/fetch';

export default class Property {
  selected = {};
  filters = { searchText: '', status: 'vacant' };
  items = [];

  constructor() {
    makeObservable(this, {
      selected: observable,
      filters: observable,
      items: observable,
      filteredItems: computed,
      setSelected: action,
      setFilters: action,
      fetch: flow,
      fetchOne: flow,
      create: flow,
      update: flow,
      delete: flow,
    });
  }

  get filteredItems() {
    let filteredItems =
      this.filters.status === ''
        ? this.items
        : this.items.filter(({ status }) => {
            if (status === this.filters.status) {
              return true;
            }

            return false;
          });

    if (this.filters.searchText) {
      const regExp = /\s|\.|-/gi;
      const cleanedSearchText = this.filters.searchText
        .toLowerCase()
        .replace(regExp, '');

      filteredItems = filteredItems.filter(
        ({ name }) =>
          name.replace(regExp, '').toLowerCase().indexOf(cleanedSearchText) !=
          -1
      );
    }
    return filteredItems;
  }

  setSelected = (property) => (this.selected = property);

  setFilters = ({ searchText = '', status = '' }) =>
    (this.filters = { searchText, status });

  *fetch() {
    try {
      const response = yield apiFetcher().get('/properties');

      this.items = response.data;
      if (this.selected._id) {
        this.setSelected(
          this.items.find((item) => item._id === this.selected._id) || {}
        );
      }
      return { status: 200, data: response.data };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *fetchOne(propertyId) {
    try {
      const response = yield apiFetcher().get(`/properties/${propertyId}`);

      return { status: 200, data: response.data };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *create(property) {
    try {
      const response = yield apiFetcher().post('/properties', property);
      const createdProperty = response.data;
      this.items.push(createdProperty);

      return { status: 200, data: createdProperty };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *update(property) {
    try {
      const response = yield apiFetcher().patch(
        `/properties/${property._id}`,
        property
      );
      const updatedProperty = response.data;
      const index = this.items.findIndex((item) => item._id === property._id);
      if (index > -1) {
        this.items.splice(index, 1, updatedProperty);
      }
      if (this.selected._id === updatedProperty._id) {
        this.setSelected(updatedProperty);
      }
      return { status: 200, data: updatedProperty };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *delete(ids) {
    try {
      yield apiFetcher().delete(`/properties/${ids.join(',')}`);
      return { status: 200 };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }
}