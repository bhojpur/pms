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

import ApartmentIcon from '@material-ui/icons/ApartmentOutlined';
import EmojiTransportationOutlinedIcon from '@material-ui/icons/EmojiTransportationOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import MarkunreadMailboxIcon from '@material-ui/icons/MarkunreadMailboxOutlined';
import { memo } from 'react';
import ParkingIcon from '@material-ui/icons/LocalParkingOutlined';
import StoreIcon from '@material-ui/icons/StorefrontOutlined';
import TerrainIcon from '@material-ui/icons/Terrain';

const PropertyIcon = ({ type, ...props }) => {
  let TypeIcon = TerrainIcon;
  switch (type) {
    case 'store':
      TypeIcon = StoreIcon;
      break;
    case 'building':
      TypeIcon = ApartmentIcon;
      break;
    case 'apartment':
      TypeIcon = HomeIcon;
      break;
    case 'room':
      TypeIcon = ApartmentIcon;
      break;
    case 'office':
      TypeIcon = ApartmentIcon;
      break;
    case 'garage':
      TypeIcon = EmojiTransportationOutlinedIcon;
      break;
    case 'parking':
      TypeIcon = ParkingIcon;
      break;
    case 'letterbox':
      TypeIcon = MarkunreadMailboxIcon;
      break;
  }

  return <TypeIcon {...props} />;
};

export default memo(PropertyIcon);