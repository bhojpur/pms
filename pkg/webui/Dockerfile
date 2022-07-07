# Copyright (c) 2018 Bhojpur Consulting Private Limited, India. All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

FROM node:16-stretch

WORKDIR /usr/

COPY package.json .
COPY yarn.lock .
COPY .eslintrc.json .
COPY pkg/common pkg/common
COPY pkg/webui/public pkg/webui/public
COPY pkg/webui/locales pkg/webui/locales
COPY pkg/webui/src pkg/webui/src
COPY pkg/webui/.eslintrc.json pkg/webui
COPY pkg/webui/i18n.json pkg/webui
COPY pkg/webui/next.config.js pkg/webui
COPY pkg/webui/package.json pkg/webui
COPY pkg/webui/LICENSE pkg/webui

ARG BASE_PATH
ENV BASE_PATH $BASE_PATH

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn workspace landlord install && \
    yarn cache clean && \
    yarn workspace landlord run build

ENTRYPOINT yarn workspace landlord start -p $PORT