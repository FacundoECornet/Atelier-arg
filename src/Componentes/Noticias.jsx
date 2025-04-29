import React from "react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";


const getNoticias = () =>{
    const [noticias, setNoticias] = useState([]);
   

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Noticias"));
                const noticiasData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Noticias cargadas:", noticiasData);
                setNoticias(noticiasData);
            } catch (error) {
                console.error("Error cargando noticias:", error);
            }
        };

        fetchNoticias();
    }, []);


   
    return (
        <div className="px-4 py-8" id="noticias">
        <h1 className="text-3xl font-bold mb-6 text-center">Noticias</h1>
      
        <ul className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-300">
          {noticias.map((noticia) => (
            <li key={noticia.id} className="md:w-1/3 px-4 py-6 text-center">
              <h2 className="text-xl font-semibold mb-2">{noticia.titulo}</h2>
              <p className="mb-4">{noticia.descripcion}</p>
              <img
  src={noticia.img}
  alt={noticia.titulo}
  className="w-full h-[200px] object-cover rounded mb-4 mx-auto"
/>
      
              {/* Botón que redirige a la URL de la noticia */}
              <button
                onClick={() => window.open(noticia.url, "_blank")}
                className="group relative w-[50px] h-[50px] rounded-full bg-neutral-900 border-none font-semibold flex items-center justify-center shadow-[0px_0px_0px_4px_rgba(180,160,255,0.25)] cursor-pointer transition-all duration-300 overflow-hidden hover:w-[140px] hover:rounded-[50px] hover:bg-300 mx-auto"
              >
                <svg
                  className="w-[12px] transition-transform duration-300 group-hover:-translate-y-[200%]"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="white"
                    d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                  ></path>
                </svg>
                <span className="absolute bottom-[-20px] text-white text-[0px] group-hover:bottom-auto group-hover:text-[13px] transition-all duration-300">
                  Ver más
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      

    )};
export default getNoticias;