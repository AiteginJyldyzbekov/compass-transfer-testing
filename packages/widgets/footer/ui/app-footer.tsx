'use client';

import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FooterLink {
  name: string;
  href: string;
}

interface AppFooterProps {
  socialLinks?: SocialLink[];
  footerLinks?: FooterLink[];
  companyName?: string;
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/compasstransfer',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/compasstransfer',
    icon: Instagram,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@compasstransfer',
    icon: Youtube,
  },
  {
    name: 'Telegram',
    href: 'https://t.me/compasstransfer',
    icon: MessageCircle,
  },
];

const defaultFooterLinks: FooterLink[] = [
  { name: 'О нас', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
  { name: 'Политика конфиденциальности', href: '/privacy' },
  { name: 'Условия использования', href: '/terms' },
  { name: 'Поддержка', href: '/support' },
];

export function AppFooter({
  socialLinks = defaultSocialLinks,
  footerLinks = defaultFooterLinks,
  className = '',
}: AppFooterProps) {

  return (
    <footer className={`${className}`}>
      <div className='container'>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0'>
          {/* Социальные сети слева */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6'>
            <div className='flex items-center space-x-3'>
              <span className='text-sm font-medium text-foreground'>Подпишись:</span>
              <div className='flex items-center space-x-3'>
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted'
                      aria-label={social.name}
                      title={social.name}
                    >
                      <Icon className='h-5 w-5' />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ссылки справа */}
          <div className='flex flex-wrap items-center justify-start lg:justify-end gap-x-6 gap-y-2'>
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline'
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}