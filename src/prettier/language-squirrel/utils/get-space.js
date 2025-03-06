// Possible update (SQUIRREL)
// - Space inside brackets, except if followed by another bracket
// - Also applies to call expressions, which is not ideal
// - Disabled for the time being

// import { startSpace, endSpace } from "../utils/get-space.js";
// const bodyDoc = print("test");
// startSpace(bodyDoc, options)
// endSpace(bodyDoc, options)

function findStartBracket(doc) {
    switch (typeof doc) {
        case "string":
            switch (doc) {
                case "":
                    return;
                case "(":
                    return true;
                default:
                    return false;
            }
        case "object":
            if (Array.isArray(doc)) {
                for (let i = 0; i < doc.length; i++) {
                    let v = findStartBracket(doc[i]);
                    if (v !== undefined) return v;
                }
            } else {
                return findStartBracket(doc.contents);
            }
    }
}

function findEndBracket(doc) {
    switch (typeof doc) {
        case "string":
            switch (doc) {
                case "":
                    return;
                case ")":
                    return true;
                default:
                    return false;
            }
        case "object":
            if (Array.isArray(doc)) {
                for (let i = doc.length - 1; i >= 0; i--) {
                    let v = findEndBracket(doc[i]);
                    if (v !== undefined) {
                        if (i === doc.length - 1 && doc[0] === "(") {
                            // ignore call expression arg group
                            return false;
                        }
                        return v;
                    }
                }
            } else {
                return findEndBracket(doc.contents);
            }
    }
}

function startSpace(doc, options) {
    if (!options.spaceInParens) return "";
    if (!options.condenseParens) return " ";
    return findStartBracket(doc) ? "" : " ";
}

function endSpace(doc, options) {
    if (!options.spaceInParens) return "";
    if (!options.condenseParens) return " ";
    return findEndBracket(doc) ? "" : " ";
}

export { startSpace, endSpace };
