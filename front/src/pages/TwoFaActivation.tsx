import { useState } from 'react';
import { UseQueryResult } from 'react-query';

import background from '@/assets/layeredWavesBg.svg';
import { Navbar } from '@/components/Navbar';
import { TwoFACode } from '@/components/TwoFaActivationInput';
import { TwoFADeactivation } from '@/components/TwoFaDeactivationInput';
import { QRcodeDto } from '@/dto/QRcodeDto';
import { useApi } from '@/hooks/useApi';

function TwoFaActivation() {
  const [showInvalidate, setShowInvalidate] = useState(false);
  const { data, isLoading, isError } = useApi().get('get 2fa qrcode', '/auth/2fa/qrcode', {
    options: { refetchOnMount: 'always' },
  }) as UseQueryResult<QRcodeDto>;

  if (isLoading) {
    return <div></div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  return (
    <>
      <Navbar />
      <div
        className="left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-40"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border-t-4 border-t-accent bg-white-1 p-8 shadow-md">
          {data?.QrCodeUrl && (
            <>
              <h1 className="text-2xl font-bold">2FA activation</h1>
              <p>Scan the QR code with an authenticator app.</p>
              <img src={data?.QrCodeUrl} alt="QRcodeFor2FA" />
              <TwoFACode setShowInvalidate={setShowInvalidate} />
            </>
          )}
          {data?.QrCodeActivated == true && (
            <>
              <h1 className="text-2xl font-bold">2FA is activated</h1>
              <TwoFADeactivation setShowInvalidate={setShowInvalidate} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TwoFaActivation;
