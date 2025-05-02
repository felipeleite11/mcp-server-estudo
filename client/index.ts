import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

const transport = new StdioClientTransport({
	command: "node",
	args: ["C:\\Users\\felip\\OneDrive\\Documentos\\PROJETOS\\NodeReact\\mcp-estudo\\server\\build\\index.js"]
})

const client = new Client(
	{
		name: "example-client",
		version: "1.0.0"
	}
)

async function main() {
	await client.connect(transport)

	// PROMPT ==============================

	// const prompts = await client.listPrompts()

	const prompt = await client.getPrompt({
		name: "concat-address",
		arguments: {
			zipcode: '66633040',
			city: 'Belém',
			district: 'Parque Verde',
			street: 'Augusto Montenegro',
			number: '111',
			complement: 'altos'
		}
	})
	
	// console.log('prompt', prompt.messages[0])

	// RESOURCES ==============================

	// const resources = await client.listResources()

	// Stateless resource
	// const result = await client.readResource({
	// 	uri: 'config://app'
	// })

	// Stateful resource
	// const result = await client.readResource({
	// 	uri: 'users://123/profile'
	// })

	// console.log('resource result', JSON.parse(result.contents[0].text as string))

	// File resource
	// const resource = await client.readResource({
	// 	uri: "file:///example.txt"
	// })

	// TOOLS ==============================

	const toolResult = await client.callTool({
		name: "show-user",
		arguments: {
			user_id: 199
		}
	})

	console.log('toolResult', JSON.parse(toolResult.content[0].text))
}

main().catch(console.log)