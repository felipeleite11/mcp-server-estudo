"use strict";
// Vídeo aula: https://www.youtube.com/watch?v=NUOzYPSNaNk&t=468s
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var zod_1 = require("zod");
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var api = axios_1.default.create({
    baseURL: 'https://brasilapi.com.br/api'
});
var server = new mcp_js_1.McpServer({
    name: "brasil_api",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {}
    }
});
server.tool("cep", "Tool to get data from a zipcode.", {
    zipcode: zod_1.z.string()
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var data;
    var zipcode = _b.zipcode;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, api.get("/cep/v1/".concat(zipcode))];
            case 1:
                data = (_c.sent()).data;
                return [2 /*return*/, {
                        content: [{
                                type: 'text',
                                text: "".concat(data.city, " - ").concat(data.state, ", ").concat(data.neighborhood, ", ").concat(data.street)
                            }]
                    }];
        }
    });
}); });
server.tool("cnpj", "Tool to get data from company's CNPJ.", {
    cnpj: zod_1.z.string()
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var numbers, data;
    var _c;
    var cnpj = _b.cnpj;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                numbers = (_c = cnpj.match(/\d+/g)) === null || _c === void 0 ? void 0 : _c.join('');
                return [4 /*yield*/, api.get("/cnpj/v1/".concat(numbers))];
            case 1:
                data = (_d.sent()).data;
                return [2 /*return*/, {
                        content: [{
                                type: 'text',
                                text: "".concat(data.razao_social, " - Situa\u00E7\u00E3o: ").concat(data.descricao_situacao_cadastral)
                            }]
                    }];
        }
    });
}); });
server.tool("holidays", "Tool to get Brasil's holiday list by year.", {
    year: zod_1.z.number().min(1900).max(3000)
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var data;
    var year = _b.year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, api.get("/feriados/v1/".concat(year))];
            case 1:
                data = (_c.sent()).data;
                return [2 /*return*/, {
                        content: [{
                                type: 'text',
                                text: "".concat(data.date, " - ").concat(data.name)
                            }]
                    }];
        }
    });
}); });
server.tool("city", "Tool to get city list from the state initials.", {
    uf: zod_1.z.string().length(2)
}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var data;
    var uf = _b.uf;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, api.get("/ibge/municipios/v1/".concat(uf, "?providers=dados-abertos-br,gov,wikipedia"))];
            case 1:
                data = (_c.sent()).data;
                return [2 /*return*/, {
                        content: [{
                                type: 'text',
                                text: "".concat(data.nome)
                            }]
                    }];
        }
    });
}); });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error('Fatal error in main()');
    process.exit(1);
});
