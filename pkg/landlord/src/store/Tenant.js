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

export default class Tenant {
  selected = {};
  filters = { searchText: '', status: 'inprogress' };
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
        ({ isCompany, name, manager, contacts, properties }) => {
          // Search match name
          let found =
            name.replace(regExp, '').toLowerCase().indexOf(cleanedSearchText) !=
            -1;

          // Search match manager
          if (!found && isCompany) {
            found =
              manager
                .replace(regExp, '')
                .toLowerCase()
                .indexOf(cleanedSearchText) != -1;
          }

          // Search match contact
          if (!found) {
            found = !!contacts
              ?.map(({ contact = '', email = '', phone = '' }) => ({
                contact: contact.replace(regExp, '').toLowerCase(),
                email: email.toLowerCase(),
                phone: phone.replace(regExp, ''),
              }))
              .filter(
                ({ contact, email, phone }) =>
                  contact.indexOf(cleanedSearchText) != -1 ||
                  email.indexOf(cleanedSearchText) != -1 ||
                  phone.indexOf(cleanedSearchText) != -1
              ).length;
          }

          // Search match property name
          if (!found) {
            found = !!properties?.filter(
              ({ property: { name } }) =>
                name
                  .replace(regExp, '')
                  .toLowerCase()
                  .indexOf(cleanedSearchText) != -1
            ).length;
          }
          return found;
        }
      );
    }
    return filteredItems;
  }

  setSelected = (tenant) => (this.selected = tenant);

  setFilters = ({ searchText = '', status = '' }) =>
    (this.filters = { searchText, status });

  *fetch() {
    try {
      const response = yield apiFetcher().get('/tenants');

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

  *fetchOne(tenantId) {
    try {
      const response = yield apiFetcher().get(`/tenants/${tenantId}`);

      return { status: 200, data: response.data };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *create(tenant) {
    try {
      const response = yield apiFetcher().post('/tenants', tenant);
      const createdTenant = response.data;
      this.items.push(createdTenant);

      return { status: 200, data: createdTenant };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *update(tenant) {
    try {
      const response = yield apiFetcher().patch(
        `/tenants/${tenant._id}`,
        tenant
      );
      const updatedTenant = response.data;
      const index = this.items.findIndex((item) => item._id === tenant._id);
      if (index > -1) {
        this.items.splice(index, 1, updatedTenant);
      }
      if (this.selected._id === updatedTenant._id) {
        this.setSelected(updatedTenant);
      }
      return { status: 200, data: updatedTenant };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }

  *delete(ids) {
    try {
      yield apiFetcher().delete(`/tenants/${ids.join(',')}`);
      return { status: 200 };
    } catch (error) {
      return { status: error?.response?.status };
    }
  }
}