"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const server = new mcp_js_1.McpServer({
    name: "Dynamic Example",
    version: "1.0.0"
});
server.tool("echo", "Resends the received message.", { message: zod_1.z.string() }, async ({ message }) => {
    const result = `ECHO -> ${message}`;
    return {
        content: [{
                type: "text",
                text: result
            }]
    };
});
server.prompt("concat-address", {
    zipcode: zod_1.z.string(),
    city: zod_1.z.string(),
    district: zod_1.z.string(),
    street: zod_1.z.string(),
    number: zod_1.z.string(),
    complement: zod_1.z.string()
}, ({ zipcode, city, district, street, number, complement }) => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: `${city} - ${district}, ${street}, ${number} - ${complement} - ${zipcode}`
            }
        }]
}));
// server.resource(
// 	"config",
// 	"config://{appId}/app",
// 	async (uri, { appId }) => ({
// 		contents: [{
// 			uri: uri.href,
// 			text: `App configuration here: ${appId}`
// 		}]
// 	})
// )
server.resource("user-profile", new mcp_js_1.ResourceTemplate("users://{userId}/profile", { list: undefined }), async (uri, { userId }) => {
    return {
        contents: [{
                uri: uri.href,
                text: JSON.stringify({
                    id: userId,
                    name: "Alice",
                    email: "alice@example.com",
                    roles: ["admin", "editor"],
                    createdAt: "2024-01-01T00:00:00Z"
                })
            }]
    };
});
server.tool("show-user", "Show user data.", {
    user_id: zod_1.z.number()
}, async ({ user_id }) => {
    const data = {
        id: user_id,
        name: 'Felipe',
        items: [
            'Item 1',
            'Item 2',
            'Item 3'
        ]
    };
    return {
        content: [{
                type: 'text',
                text: JSON.stringify(data)
            }]
    };
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch(e => {
    console.log(e);
});
