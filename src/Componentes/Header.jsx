import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';

const LOGO_URL =
  'https://static.wixstatic.com/media/00602b_71e63b15dcb64d87af750db73320d966~mv2.png/v1/fill/w_288,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20atelier%20horizontal-02.png';

const navigation = [
  { name: 'Propiedades', to: '/propiedades', type: 'navigate' },
  { name: 'Noticias', to: '#noticias', type: 'scroll' },
  { name: 'Saber más', to: '#pasos', type: 'scroll' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClick = (item) => (e) => {
    e.preventDefault();

    if (item.type === 'navigate') {
      navigate(item.to);
      return;
    }

    if (item.to === '/') {
      if (location.pathname !== '/') navigate('/');
      return;
    }

    if (item.to.startsWith('#')) {
      if (location.pathname === '/') {
        const el = document.getElementById(item.to.substring(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(item.to.substring(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const isActive = (item) => {
    if (item.type === 'navigate') return location.pathname === item.to;
    if (item.to === '/') return location.pathname === '/';
    if (item.to.startsWith('#')) return location.pathname === '/';
    return false;
  };

  return (
    <Disclosure
      as="nav"
      className="fixed w-full top-0 left-0 z-50 bg-white shadow-md transition-all duration-300"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="inicio">
            {/* Desktop */}
            <div className="hidden sm:flex h-20 items-center justify-between">
              <div className="flex-shrink-0">
                <a href="/" onClick={handleLogoClick} className="cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={LOGO_URL} alt="Logo Atelier" className="h-16 w-auto" decoding="async" />
                </a>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="flex space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.to}
                      onClick={handleClick(item)}
                      className={classNames(
                        isActive(item)
                          ? 'bg-black text-white'
                          : 'text-black hover:bg-black hover:text-white',
                        'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0">
                <a
                  href="/"
                  onClick={handleClick({ to: '#contacto', type: 'scroll' })}
                  className="bg-black text-white px-6 py-2 rounded-md border border-black hover:bg-white hover:text-black transition-all duration-200 font-medium"
                >
                  Contacto
                </a>
              </div>
            </div>

            {/* Mobile */}
            <div className="sm:hidden flex h-16 items-center justify-between">
              <div className="flex items-center justify-start">
                <a href="/" onClick={handleLogoClick} className="cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={LOGO_URL} alt="Logo Atelier" className="h-12 w-auto" decoding="async" />
                </a>
              </div>

              <div className="sm:hidden">
                <Disclosure.Button className="text-gray-600 hover:text-black hover:bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black transition-colors">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.to}
                  onClick={handleClick(item)}
                  className={classNames(
                    isActive(item)
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-black hover:text-white',
                    'block px-4 py-3 rounded-md text-base font-medium transition-all duration-200 cursor-pointer',
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                as="a"
                href="/"
                onClick={handleClick({ to: '#contacto', type: 'scroll' })}
                className="block text-white bg-black hover:bg-gray-800 px-4 py-3 rounded-md text-base font-medium transition-all duration-200 mt-4"
              >
                Contacto
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
