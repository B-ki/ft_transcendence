import React, { useState } from 'react';
import { UseQueryResult } from 'react-query';

import banner from '@/assets/cool-profile-picture.jpg';
import myImage from '@/assets/d9569bbed4393e2ceb1af7ba64fdf86a.jpg';
import { Button } from '@/components/Button';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import PicUploader from '@/components/PicUploader';
import { userDto } from '@/dto/userDto';
import { useApi } from '@/hooks/useApi';
import googleAuthenticatorLogo from '@/assets/GoogleAuthenticatorLogo.png'
import { QRCodeSVG } from 'qrcode.react';
import { QRcodeDto } from '@/dto/QRcodeDto';

const inputs = [
  { id: '0', labelTxt: 'Username', inputTxt: 'Enter your username...', mandatory: true },
  { id: '1', labelTxt: 'Description', inputTxt: '30 character maximum', mandatory: false },
];

function TwoFa() {
  const [show, setShow] = useState(false);
  const [is2FAactivated, setIs2FAactivated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  let user: userDto | undefined = undefined;

  const { data, isLoading, isError } = useApi().get(
    'get 2 fa2',
    '/auth/2fa/qrcode',
    {params: {refetchOnWindowFocus: true},},
  ) as UseQueryResult<QRcodeDto>;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  if (data) 
  console.log(data);
  return (
    <>
      <Modal onClose={() => setShow(false)} title="Edit your profile" show={show}>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-center">
            <PicUploader picture={myImage} name="Profile picture" />
          </div>
          <div className="flex flex-col items-center">
            <PicUploader picture={banner} name="Banner" />
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          {inputs.map((item) => (
            <Input
              key={item.id}
              labelText={item.labelTxt}
              inputText={item.inputTxt}
              mandatory={item.mandatory}
            ></Input>
          ))}
        </div>
      </Modal>
      <Navbar />
        
          <div>
            <p>2FA is activated. Scan the QR code with an authenticator app.</p>
            <img src={data!.QrCodeUrl}/>
          </div>
    </>
  );
}

export default TwoFa;
