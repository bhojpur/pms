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

import { Box, Typography } from '@material-ui/core';

import getConfig from 'next/config';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

const {
  publicRuntimeConfig: { BASE_PATH },
} = getConfig();

const Illustration = ({
  imgName,
  label,
  alt,
  width = '100%',
  height = 200,
}) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    height="100%"
    width={width}
  >
    <Box height={height} width={width} position="relative">
      <Image src={`${BASE_PATH}/${imgName}.svg`} layout="fill" alt={alt} />
    </Box>
    {!!label && (
      <Box pt={1} color="text.disabled">
        <Typography align="center" variant="caption" component="p">
          {label}
        </Typography>
      </Box>
    )}
  </Box>
);

export const EmptyIllustration = ({ label }) => {
  const { t } = useTranslation();
  return (
    <Illustration
      imgName="undraw_Empty_re_opql"
      label={label || t('No data found')}
      alt="no data found"
    />
  );
};

export const LocationIllustration = ({ width, height }) => (
  <Illustration
    imgName="undraw_Location_tracking"
    alt="no location found"
    width={width}
    height={height}
  />
);

export const BlankDocumentIllustration = () => (
  <Illustration imgName="undraw_add_document_re_mbjx" alt="blank document" />
);

export const TermsDocumentIllustration = () => (
  //TODO: fill the alt attribute
  <Illustration imgName="undraw_Terms_re_6ak4" alt="" />
);

export const AlertIllustration = () => (
  //TODO: fill the alt attribute
  <Illustration imgName="undraw_notify_re_65on" alt="" />
);

export const PendingIllustration = () => (
  //TODO: fill the alt attribute
  <Illustration imgName="caution" alt="" />
);

export const Pending2Illustration = () => (
  //TODO: fill the alt attribute
  <Illustration imgName="caution" alt="" />
);

export const ReceiptIllustration = () => (
  <Illustration imgName="bill" alt="Invoice" />
);

export const WelcomeIllustration = ({ height = '100%' }) => (
  <Illustration
    imgName="undraw_apartment_rent_o0ut"
    height={height}
    alt="welcome"
  />
);

export const CelebrationIllustration = ({ label, height = '100%' }) => (
  <Illustration
    imgName="undraw_Celebration_re_kc9k"
    height={height}
    label={label}
    alt="celebration"
  />
);