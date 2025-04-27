"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const api = axios_1.default.create({
    baseURL: 'https://brasilapi.com.br/api'
});
const server = new mcp_js_1.McpServer({
    name: "brasil_api",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {}
    }
});
server.tool("cep", "Tool to get data from a zipcode.", {
    zipcode: zod_1.z.string()
}, async ({ zipcode }) => {
    const { data } = await api.get(`/cep/v1/${zipcode}`);
    return {
        content: [{
                type: 'text',
                text: `${data.city} - ${data.state}, ${data.neighborhood}, ${data.street}`
            }]
    };
});
server.tool("cnpj", "Tool to get data from company's CNPJ.", {
    cnpj: zod_1.z.string()
}, async ({ cnpj }) => {
    const numbers = cnpj.match(/\d+/g)?.join('');
    const { data } = await api.get(`/cnpj/v1/${numbers}`);
    return {
        content: [{
                type: 'text',
                text: `${data.razao_social} - Situação: ${data.descricao_situacao_cadastral}`
            }]
    };
});
server.tool("holidays", "Tool to get Brasil's holiday list by year.", {
    year: zod_1.z.number().min(1900).max(3000)
}, async ({ year }) => {
    const { data } = await api.get(`/feriados/v1/${year}`);
    return {
        content: [{
                type: 'text',
                text: `${data.date} - ${data.name}`
            }]
    };
});
server.tool("city", "Tool to get city list from the state initials.", {
    uf: zod_1.z.string().length(2)
}, async ({ uf }) => {
    const { data } = await api.get(`/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
    return {
        content: [{
                type: 'text',
                text: `${data.nome}`
            }]
    };
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch(e => {
    console.error('Fatal error in main()');
    process.exit(1);
});
