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

import * as jose from 'jose';
import { action, computed, flow, makeObservable, observable } from 'mobx';
import { apiFetcher, authApiFetcher, setAccessToken } from '../utils/fetch';

import { isServer } from '../utils';

export const ADMIN_ROLE = 'administrator';
export const RENTER_ROLE = 'renter';
export const ROLES = [ADMIN_ROLE, RENTER_ROLE];
export default class User {
  token;
  tokenExpiry;
  firstName;
  lastName;
  email;
  role;

  constructor() {
    makeObservable(this, {
      token: observable,
      tokenExpiry: observable,
      firstName: observable,
      lastName: observable,
      email: observable,
      role: observable,
      signedIn: computed,
      isAdministrator: computed,
      setRole: action,
      setUserFromToken: action,
      signUp: flow,
      signIn: flow,
      signOut: flow,
      refreshTokens: flow,
      forgotPassword: flow,
      resetPassword: flow,
    });
  }

  get signedIn() {
    return !!this.token;
  }

  get isAdministrator() {
    return this.role === 'administrator';
  }

  setRole(role) {
    this.role = role;
  }

  setUserFromToken(accessToken) {
    const {
      account: { firstname, lastname, email },
      exp,
    } = jose.decodeJwt(accessToken);
    this.firstName = firstname;
    this.lastName = lastname;
    this.email = email;
    this.token = accessToken;
    this.tokenExpiry = exp;
    setAccessToken(accessToken);
  }

  *signUp(firstname, lastname, email, password) {
    try {
      yield apiFetcher().post('/authenticator/signup', {
        firstname,
        lastname,
        email,
        password,
      });
      return 200;
    } catch (error) {
      return error.response.status;
    }
  }

  *signIn(email, password) {
    try {
      const response = yield apiFetcher().post('/authenticator/signin', {
        email,
        password,
      });
      const { accessToken } = response.data;
      this.setUserFromToken(accessToken);
      return 200;
    } catch (error) {
      console.error(error);
      return error.response.status;
    }
  }

  *signOut() {
    try {
      yield apiFetcher().delete('/authenticator/signout');
    } finally {
      this.firstName = null;
      this.lastName = null;
      this.email = null;
      this.token = null;
      this.tokenExpiry = undefined;
      setAccessToken(null);
    }
  }

  *refreshTokens(context) {
    try {
      let response;
      // request to get the new tokens
      if (isServer()) {
        const authFetchApi = authApiFetcher(context.req.headers.cookie);
        response = yield authFetchApi.post('/authenticator/refreshtoken');

        const cookies = response.headers['set-cookie'];
        if (cookies) {
          context.res.setHeader('Set-Cookie', cookies);
        }
      } else {
        response = yield apiFetcher().post('/authenticator/refreshtoken');
      }

      // set access token in store
      if (response?.data?.accessToken) {
        const { accessToken } = response.data;
        this.setUserFromToken(accessToken);
        return { status: 200 };
      } else {
        this.firstName = undefined;
        this.lastName = undefined;
        this.email = undefined;
        this.token = undefined;
        this.tokenExpiry = undefined;
        setAccessToken(null);
      }
    } catch (error) {
      this.firstName = undefined;
      this.lastName = undefined;
      this.email = undefined;
      this.token = undefined;
      this.tokenExpiry = undefined;
      setAccessToken(null);
      console.error(error);
      return { status: error?.response?.status, error };
    }
  }

  *forgotPassword(email) {
    try {
      yield apiFetcher().post('/authenticator/forgotpassword', {
        email,
      });
      return 200;
    } catch (error) {
      console.error(error);
      return error.response.status;
    }
  }

  *resetPassword(resetToken, password) {
    try {
      yield apiFetcher().patch('/authenticator/resetpassword', {
        resetToken,
        password,
      });
      return 200;
    } catch (error) {
      console.error(error);
      return error.response.status;
    }
  }
}