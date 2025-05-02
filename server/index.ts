import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const server = new McpServer({
	name: "Dynamic Example",
	version: "1.0.0"
})

server.prompt(
	"concat-address",
	{
		zipcode: z.string(),
		city: z.string(),
		district: z.string(),
		street: z.string(),
		number: z.string(),
		complement: z.string()
	},
	({
		zipcode,
		city,
		district,
		street,
		number,
		complement
	}) => ({
		messages: [{
			role: "user",
			content: {
				type: "text",
				text: `${city} - ${district}, ${street}, ${number} - ${complement} - ${zipcode}`
			}
		}]
	})
)

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

server.resource(
	"user-profile",
	new ResourceTemplate("users://{userId}/profile", { list: undefined }),
	async (uri, { userId }) => {
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
		}
	}
)

server.tool(
	"echo",
	"Resends the received message.",
	{ message: z.string() },
	async ({ message }) => {
		const result = `ECHO -> ${message}`

		return {
			content: [{
				type: "text",
				text: result
			}]
		}
	}
)

server.tool(
	"show-user",
	"Show user data.",
	{
		user_id: z.number()
	},
	async ({ user_id }) => {
		const data = {
			id: user_id,
			name: 'Felipe Leite',
			items: [
				'Item 1',
				'Item 2',
				'Item 3'
			]
		}

		return {
			content: [{
				type: 'text',
				text: JSON.stringify(data)
			}]
		}
	}
)

async function main() {
	const transport = new StdioServerTransport()

	await server.connect(transport)
}

main().catch(e => {
	console.log(e)
})