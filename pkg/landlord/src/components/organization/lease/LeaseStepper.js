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

import { useCallback, useContext, useState } from 'react';

import { Box } from '@material-ui/core';
import LeaseForm from './LeaseForm';
import { validate as LeaseFormValidate } from './LeaseForm';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { StoreContext } from '../../../store';
import TemplateForm from './TemplateForm';
import { useComponentMountedRef } from '../../../utils/hooks';
import useTranslation from 'next-translate/useTranslation';

export default function LeaseStepper({ onSubmit }) {
  const store = useContext(StoreContext);
  const { t } = useTranslation('common');
  const [activeStep, setActiveStep] = useState(0);
  const mountedRef = useComponentMountedRef();

  const handleSubmit = useCallback(
    async (leasePart = {}) => {
      try {
        let isFormsValid = false;
        try {
          await LeaseFormValidate(store.lease?.selected, store.lease?.items);
          isFormsValid = activeStep >= 1;
        } catch (error) {
          console.log(error);
          isFormsValid = false;
        }
        await onSubmit({ ...leasePart, stepperMode: !isFormsValid });
        if (mountedRef.current) {
          setActiveStep(activeStep + 1);
        }
      } catch (error) {
        // do nothing on error
      }
    },
    [
      onSubmit,
      mountedRef,
      store.lease?.selected,
      store.lease?.items,
      activeStep,
    ]
  );

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>{t('Contract information')}</StepLabel>
        <StepContent>
          <Box px={1}>
            <LeaseForm onSubmit={handleSubmit} />
          </Box>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{t('Template documents')}</StepLabel>
        <StepContent>
          <Box px={1}>
            <TemplateForm onSubmit={handleSubmit} />
          </Box>
        </StepContent>
      </Step>
    </Stepper>
  );
}