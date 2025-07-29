import '@shared/styles/globals.css';
import '@shared/styles/welcomePage.css';
import 'sonner/dist/styles.css';
import { Toaster } from 'sonner';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body>
        {children}
        {/* Toaster от sonner */}
        <Toaster
          position='top-right'
          expand
          richColors
          closeButton
          duration={5000}
          style={{
            zIndex: 99999,
          }}
        />
      </body>
    </html>
  );
}
