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

import { Marker, Map as PigeonMap } from 'pigeon-maps';
import { memo, useEffect, useState } from 'react';

import axios from 'axios';
import Loading from './Loading';
import { LocationIllustration } from './Illustrations';
import { useComponentMountedRef } from '../utils/hooks';
import { useTheme } from '@material-ui/core';

const nominatimBaseURL = 'https://nominatim.openstreetmap.org';

const Map = memo(function Map({ address, height = 200, zoom = 16 }) {
  const [center, setCenter] = useState();
  const [loading, setLoading] = useState(true);
  const mountedRef = useComponentMountedRef();
  const theme = useTheme();

  useEffect(() => {
    const getLatLong = async () => {
      if (mountedRef.current) {
        setLoading(true);
      }

      if (address) {
        let queryAddress;
        if (typeof address === 'object') {
          queryAddress = `q=${encodeURIComponent(
            [
              address.street1,
              address.street2,
              address.zipCode,
              address.city,
              //`state=${encodeURIComponent(address.state)}`, // state often not recognized
              address.country,
            ].join(' ')
          )}`;
        } else {
          queryAddress = `q=${encodeURIComponent(address)}`;
        }

        try {
          const response = await axios.get(
            `${nominatimBaseURL}/search?${queryAddress}&format=json&addressdetails=1`
          );
          if (mountedRef.current) {
            if (response.data?.[0]?.lat && response.data?.[0]?.lon) {
              setCenter([
                Number(response.data[0].lat),
                Number(response.data[0].lon),
              ]);
            } else {
              setCenter();
            }
          }
        } catch (error) {
          console.error(error);
        }
      }

      if (mountedRef.current) {
        setLoading(false);
      }
    };

    getLatLong();
  }, [mountedRef, address]);

  return (
    <>
      {!loading ? (
        center ? (
          <PigeonMap height={height} center={center} zoom={zoom}>
            <Marker
              height={35}
              width={35}
              color={theme.palette.info.main}
              anchor={center}
            />
          </PigeonMap>
        ) : (
          <LocationIllustration height={height} />
        )
      ) : (
        <Loading height={height} />
      )}
    </>
  );
});

export default Map;