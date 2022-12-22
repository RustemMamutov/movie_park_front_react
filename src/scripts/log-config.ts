import {Category, CategoryProvider} from "typescript-logging-category-style";
import {LOGGING_LEVEL} from "./constants";

const provider = CategoryProvider.createProvider("Provider", {
    level: LOGGING_LEVEL,
});

export function getLogger(name: string): Category {
    return provider.getCategory(name);
}