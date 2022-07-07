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

import { action, makeObservable, observable } from 'mobx';
import { setAccessToken, setOrganizationId } from '../utils/fetch';

import Accounting from './Accounting';
import Dashboard from './Dashboard';
import Document from './Document';
import Lease from './Lease';
import moment from 'moment';
import Organization from './Organization';
import Property from './Property';
import Rent from './Rent';
import Template from './Template';
import Tenant from './Tenant';
import User from './User';

export default class Store {
  toastMessages = [];
  user = new User();
  organization = new Organization();
  lease = new Lease();
  rent = new Rent();
  tenant = new Tenant();
  property = new Property();
  template = new Template();
  document = new Document();
  dashboard = new Dashboard();
  accounting = new Accounting();

  constructor() {
    makeObservable(this, {
      toastMessages: observable,
      pushToastMessage: action,
      shiftToastMessage: action,

      user: observable,
      organization: observable,
      lease: observable,
      rent: observable,
      tenant: observable,
      property: observable,
      template: observable,
      document: observable,
      dashboard: observable,
      accounting: observable,
    });
  }

  hydrate(initialData) {
    if (!initialData) {
      return;
    }

    console.log('hydrate store');
    const {
      user = {},
      organization = {
        items: [],
      },
      lease = {
        items: [],
      },
      rent = {
        items: [],
      },
      tenant = {
        items: [],
      },
      property = {
        items: [],
      },
      template = {
        items: [],
        fields: [],
      },
      document = {
        items: [],
      },
      dashboard = {
        data: {},
      },
      accounting = {
        data: {},
      },
    } = initialData;

    this.user.firstName = user.firstName;
    this.user.lastName = user.lastName;
    this.user.email = user.email;
    this.user.role = user.role;
    this.user.token = user.token;
    this.user.tokenExpiry = user.tokenExpiry;
    setAccessToken(user.token);

    this.organization.items = organization.items;
    this.organization.selected = organization.selected;
    setOrganizationId(organization.selected?._id);

    this.lease.items = lease.items;
    this.lease.selected = lease.selected;

    this.rent.items = rent.items;
    this.rent.selected = rent.selected;
    this.rent.filters = rent.filters;
    if (rent._period) {
      this.rent.setPeriod(moment(rent._period));
    }
    this.rent.countAll = rent.countAll;
    this.rent.countPaid = rent.countPaid;
    this.rent.countPartiallyPaid = rent.countPartiallyPaid;
    this.rent.countNotPaid = rent.countNotPaid;
    this.rent.totalToPay = rent.totalToPay;
    this.rent.totalPaid = rent.totalPaid;
    this.rent.totalNotPaid = rent.totalNotPaid;

    this.tenant.items = tenant.items;
    this.tenant.selected = tenant.selected;
    this.tenant.filters = tenant.filters;

    this.property.items = property.items;
    this.property.selected = property.selected;
    this.property.filters = property.filters;

    this.template.items = template.items;
    this.template.selected = template.selected;
    this.template.fields = template.fields;

    this.document.items = document.items;
    this.document.selected = document.selected;

    this.dashboard.data = dashboard.data;

    this.accounting.data = accounting.data;
  }

  pushToastMessage(error) {
    this.toastMessages.push(error);
  }

  shiftToastMessage() {
    return this.toastMessages.shift();
  }
}