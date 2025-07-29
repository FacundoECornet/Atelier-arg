import React from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navigation = [
  { name: "Inicio", to: "/" },
  { name: "Propiedades", to: "#propiedades" },
  { name: "Noticias", to: "#noticias" },
  { name: "Saber más", to: "#saber-mas" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para manejar clicks en navegación
  const handleClick = (to) => (e) => {
    // Si es "Inicio", navegamos a "/"
    if (to === "/") {
      if (location.pathname !== "/") {
        e.preventDefault();
        navigate("/");
      }
      // Si ya estamos en "/", no hacemos nada (es un Link normal)
      return;
    }

    // Para anclas con #
    if (to.startsWith("#")) {
      // Si estamos en la página principal, scroll manual a la sección
      if (location.pathname === "/") {
        e.preventDefault();
        const id = to.substring(1); // quitar #
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Si no estamos en la página principal, navegamos a "/" y luego hacemos scroll
        e.preventDefault();
        navigate("/");

        // Como el navigate es async, podemos hacer el scroll con un pequeño delay
        // o mejor con un efecto en la página principal que escuche la url (más avanzado)
        // Para simplificar:
        setTimeout(() => {
          const el = document.getElementById(to.substring(1));
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  // Función para determinar si el link está activo
  const isActive = (to) => {
    if (to === "/") {
      return location.pathname === "/";
    }
    if (to.startsWith("#")) {
      return location.pathname === "/" && location.hash === to;
    }
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
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center justify-start">
                <img
                  src="https://static.wixstatic.com/media/00602b_71e63b15dcb64d87af750db73320d966~mv2.png/v1/fill/w_288,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20atelier%20horizontal-02.png"
                  alt="Logo"
                  className="h-20 w-auto"
                />
              </div>

              {/* Navegación desktop */}
              <div className="hidden sm:block">
                <div className="flex space-x-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.to}
                      onClick={handleClick(item.to)}
                      className={classNames(
                        isActive(item.to)
                          ? "bg-black text-white"
                          : "text-black hover:bg-black hover:text-white",
                        "px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Botón contacto desktop */}
              <div className="hidden sm:block">
                <a
                  href="#contacto"
                  className="bg-black text-white px-4 py-2 rounded-md border border-black hover:bg-white hover:text-black transition"
                >
                  Contacto
                </a>
              </div>

              {/* Menú móvil */}
              <div className="sm:hidden">
                <Disclosure.Button className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          <Disclosure.Panel className="sm:hidden bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.to}
                  onClick={handleClick(item.to)}
                  className="block text-gray-700 hover:bg-black hover:text-white px-3 py-2 rounded-md text-base font-medium transition cursor-pointer"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                as="a"
                href="#contacto"
                className="block text-white bg-black px-3 py-2 rounded-md text-base font-medium"
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
