import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en", // default language
    preload: ["en", "fr", "de"], // preload supported languages
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}/translation.json"),
    },
    detection: {
      order: ["querystring", "header"], // detect from ?lng=fr or Accept-Language header
      caches: false,
    },
  });

export default middleware.handle(i18next);
