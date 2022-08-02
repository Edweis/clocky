import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const DESKTOP_MENU =
  'border-transparent text-gray-700 hover:border-blue-300 hover:text-black inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium';
const DESKTOP_MENU_SELECTED = 'border-blue-500 text-blue-700';
const MOBILE_MENU =
  'border-transparent text-black hover:bg-black hover:border-white hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium';
const MOBILE_MENU_SELECTED = 'border-blue-500 text-blue-700';

type NavbarItem = { label: string; to: string };
export default function Navbar() {
  const location = useLocation();
  const auth = useAuth();
  const MENU = [
    { label: 'Start', to: '/' },
    { label: 'Statistics', to: '/stats' },
    auth.user != null && {
      label: `Account - ${auth.user.username}`,
      to: '/account',
    },
    auth.user == null && { label: 'Login', to: '/login' },
  ].filter((item): item is NavbarItem => item !== false);
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  className={cn(
                    'inline-flex items-center justify-center p-2 rounded-md text-black ',
                    'hover:text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
                  )}
                >
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link className="w-auto text-5xl" to="/">
                    clocky
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {MENU.map((m) => (
                    <Link
                      key={m.label}
                      to={m.to}
                      className={cn(DESKTOP_MENU, {
                        [DESKTOP_MENU_SELECTED]: m.to === location.pathname,
                      })}
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-4 space-y-1">
              {MENU.map((m) => (
                <Disclosure.Button
                  key={m.to}
                  as={Link}
                  to={m.to}
                  className={cn(MOBILE_MENU, {
                    [MOBILE_MENU_SELECTED]: m.to === location.pathname,
                  })}
                >
                  {m.label}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
