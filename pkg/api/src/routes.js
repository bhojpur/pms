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

const express = require('express');
const config = require('./config');
const realmManager = require('./managers/realmmanager');
const dashboardManager = require('./managers/dashboardmanager');
const leaseManager = require('./managers/leasemanager');
const rentManager = require('./managers/rentmanager');
const occupantManager = require('./managers/occupantmanager');
const propertyManager = require('./managers/propertymanager');
const ownerManager = require('./managers/ownermanager');
const accountingManager = require('./managers/accountingmanager');
const emailManager = require('./managers/emailmanager');
const {
  needAccessToken,
  checkOrganization,
} = require('@bhojpur/common/utils/middlewares');
const router = express.Router();

// protect the api access by checking the access token
router.use(needAccessToken(config.ACCESS_TOKEN_SECRET));

// update req with the user organizations
router.use(checkOrganization());

const realmsRouter = express.Router();
realmsRouter.get('/', realmManager.all);
realmsRouter.get('/:id', realmManager.one);
realmsRouter.post('/', realmManager.add);
realmsRouter.patch('/:id', realmManager.update);
router.use('/realms', realmsRouter);

const dashboardRouter = express.Router();
dashboardRouter.get('/', dashboardManager.all);
router.use('/dashboard', dashboardRouter);

const leasesRouter = express.Router();
leasesRouter.get('/', leaseManager.all);
leasesRouter.get('/:id', leaseManager.one);
leasesRouter.post('/', leaseManager.add);
leasesRouter.patch('/:id', leaseManager.update);
leasesRouter.delete('/:ids', leaseManager.remove);
router.use('/leases', leasesRouter);

const occupantsRouter = express.Router();
occupantsRouter.get('/', occupantManager.all);
occupantsRouter.get('/:id', occupantManager.one);
occupantsRouter.post('/', occupantManager.add);
occupantsRouter.patch('/:id', occupantManager.update);
occupantsRouter.delete('/:ids', occupantManager.remove);
router.use('/tenants', occupantsRouter);

const rentsRouter = express.Router();
rentsRouter.patch('/payment/:id/:term', rentManager.updateByTerm);
rentsRouter.get('/tenant/:id', rentManager.rentsOfOccupant);
rentsRouter.get('/tenant/:id/:term', rentManager.rentOfOccupantByTerm);
rentsRouter.get('/:year/:month', rentManager.all);
router.use('/rents', rentsRouter);

const propertiesRouter = express.Router();
propertiesRouter.get('/', propertyManager.all);
propertiesRouter.get('/:id', propertyManager.one);
propertiesRouter.post('/', propertyManager.add);
propertiesRouter.patch('/:id', propertyManager.update);
propertiesRouter.delete('/:ids', propertyManager.remove);
router.use('/properties', propertiesRouter);

router.get('/accounting/:year', accountingManager.all);
router.get(
  '/csv/tenants/incoming/:year',
  accountingManager.csv.incomingTenants
);
router.get(
  '/csv/tenants/outgoing/:year',
  accountingManager.csv.outgoingTenants
);
router.get('/csv/settlements/:year', accountingManager.csv.settlements);

const ownerRouter = express.Router();
ownerRouter.get('/', ownerManager.all);
ownerRouter.patch('/:id', ownerManager.update);
router.use('/owner', ownerRouter);

const emailRouter = express.Router();
emailRouter.post('/', emailManager.send);
router.use('/emails', emailRouter);

const apiRouter = express.Router();
apiRouter.use('/api/v2', router);

module.exports = apiRouter;