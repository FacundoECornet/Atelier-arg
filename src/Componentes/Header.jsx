import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  return (
    <Disclosure as="nav" className="absolute w-full top-0 left-0 z-50 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo a la izquierda */}
          <div className="flex items-left justify-start">
            <img
              src="https://static.wixstatic.com/media/00602b_71e63b15dcb64d87af750db73320d966~mv2.png/v1/fill/w_288,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20atelier%20horizontal-02.png"
              alt="Logo"
              className="h-20 w-auto"
            />
          </div>

          {/* Secciones en el centro */}
          <div className="hidden sm:block">
            <div className="flex space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current ? "bg-black text-white" : "text-white hover:bg-black hover:text-white",
                    "px-4 py-2 rounded-md text-sm font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Botón de Contacto fijo a la derecha */}
          <div className="hidden sm:block">
            <a href="#" className="bg-white text-black px-4 py-2 rounded-md border border-black hover:bg-black hover:text-white transition">
              Contacto
            </a>
          </div>

          {/* Menú Móvil */}
          <div className="sm:hidden">
            <DisclosureButton className="text-gray-400 hover:text-white">
              <Bars3Icon className="h-6 w-6" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <DisclosurePanel className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className="block text-gray-300 hover:bg-black-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              {item.name}
            </DisclosureButton>
          ))}
          {/* Botón de contacto en menú móvil */}
          <DisclosureButton as="a" href="#" className="block text-white bg-black px-3 py-2 rounded-md text-base font-medium">
            Contacto
          </DisclosureButton>
        </div>


        
      </DisclosurePanel>
    </Disclosure>



  );
}
