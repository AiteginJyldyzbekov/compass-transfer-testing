import Image from 'next/image';
import { LoginForm } from '@features/auth';

export default function LoginPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2'>
          <a href='/' className='flex items-center'>
            <Image
              src='/logo/LogoBigBlack.png'
              alt='Compass Transfer'
              width={238}
              height={64}
              className='h-8 w-auto object-contain dark:hidden'
              style={{ width: 'auto', height: '64px' }}
            />
            <Image
              src='/logo/LogoBigWhite.png'
              alt='Compass Transfer'
              width={238}
              height={64}
              className='h-8 w-auto object-contain hidden dark:block'
              style={{ width: 'auto', height: '64px' }}
            />
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block overflow-hidden'>
        <Image
          src='/auto/hongqi.jpg'
          alt='Hongqi автомобиль'
          fill
          className='object-cover'
          style={{
            pointerEvents: 'none',
          }}
          priority
        />
        <div className='absolute inset-0 bg-black/30 pointer-events-none' />
      </div>
    </div>
  );
}
