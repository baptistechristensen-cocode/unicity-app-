import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Liens legaux */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Informations legales</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#1A5276] text-sm">
                  Conditions generales d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#1A5276] text-sm">
                  Politique de confidentialite (RGPD)
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#1A5276] text-sm">
                  Declaration d'accessibilite
                </a>
              </li>
            </ul>
          </div>

          {/* Coordonnees */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Mairie de Novaville</h3>
            <address className="text-gray-600 text-sm not-italic space-y-1">
              <p>1 Place de la Republique</p>
              <p>75000 Novaville</p>
              <p className="mt-2">
                Tel: <a href="tel:0123456789" className="hover:text-[#1A5276]">01 23 45 67 89</a>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:contact@novaville.fr" className="hover:text-[#1A5276]">
                  contact@novaville.fr
                </a>
              </p>
            </address>
          </div>

          {/* Reseaux sociaux */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Suivez-nous</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A5276] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A5276] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A5276] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1A5276] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mairie de Novaville - Tous droits reserves</p>
        </div>
      </div>
    </footer>
  );
}
