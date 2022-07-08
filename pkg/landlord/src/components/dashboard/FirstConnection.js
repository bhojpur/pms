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

import React, { useMemo } from 'react';

import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import useTranslation from 'next-translate/useTranslation';

export default function FirstConnection({
  hasContract,
  hasProperty,
  hasTenant,
  handleCreateContract,
  handleAddProperty,
  handleAddTenant,
}) {
  const { t } = useTranslation('common');
  const [activeStep] = React.useState(
    hasContract ? (hasProperty ? (hasTenant ? 3 : 2) : 1) : 0
  );
  const steps = useMemo(() => {
    return [
      {
        key: 0,
        stepLabel: t('Create my first contract'),
        buttonLabel: t('Create'),
        content: '',
        onClick: handleCreateContract,
        dataCy: 'shortcutCreateContract',
      },
      {
        key: 1,
        stepLabel: t('Add my first property'),
        buttonLabel: t('Add'),
        content: '',
        onClick: handleAddProperty,
        dataCy: 'shortcutAddProperty',
      },
      {
        key: 2,
        stepLabel: t('Add my first tenant'),
        buttonLabel: t('Add'),
        content: '',
        onClick: handleAddTenant,
        dataCy: 'shortcutAddTenant',
      },
    ];
  }, [t, handleCreateContract, handleAddProperty, handleAddTenant]);

  return (
    <>
      <Box mt={1} p={1}>
        <Typography variant="h6">
          {t('Follow these steps to start managing your properties')}
        </Typography>
      </Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(
          ({ key, stepLabel, buttonLabel, content, onClick, dataCy }) => (
            <Step key={key}>
              <StepLabel>{stepLabel}</StepLabel>
              <StepContent>
                <Typography>{content}</Typography>
                <Box mt={2} mb={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onClick}
                    data-cy={dataCy}
                  >
                    {buttonLabel}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          )
        )}
      </Stepper>
    </>
  );
}