export function getLanguageExtension(language:string) : string {
    switch (language.toLowerCase()) {
        case "json":
            return "json";
        case "go":
            return "go";
        case "typescript":
        case "javascript":
            return "js";    
        case "sql":
            return "sql";    
        case "plaintext":   
        default:
            return null;
    }
}