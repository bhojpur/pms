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

export default class Organization {
  selected;
  items = [];

  constructor() {
    makeObservable(this, {
      selected: observable,
      items: observable,
      setSelected: action,
      setItems: action,
      fetch: flow,
      create: flow,
      update: flow,
    });
  }

  setSelected = (org, user) => {
    this.selected = org;
    user.setRole(
      this.selected.members.find(({ email }) => email === user.email).role
    );
  };

  setItems = (organizations = []) => {
    this.items = organizations;
  };

  *fetch() {
    try {
      const response = yield apiFetcher().get('/realms');
      this.setItems(response.data);
      return 200;
    } catch (error) {
      console.error(error);
      return error.response.status;
    }
  }

  *create(organization) {
    try {
      const response = yield apiFetcher().post('/realms', organization);
      return { status: 200, data: response.data };
    } catch (error) {
      console.error(error);
      return { status: error?.response?.status };
    }
  }

  *update(organization) {
    try {
      const response = yield apiFetcher().patch(
        `/realms/${organization._id}`,
        organization
      );
      return { status: 200, data: response.data };
    } catch (error) {
      console.error(error);
      return { status: error?.response?.status };
    }
  }
}