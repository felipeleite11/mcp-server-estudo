import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const transport = new StdioClientTransport({
    command: "node",
    args: ["C:\\Users\\felip\\OneDrive\\Documentos\\PROJETOS\\NodeReact\\mcp-estudo\\server\\build\\index.js"]
});
const client = new Client({
    name: "example-client",
    version: "1.0.0"
});
async function main() {
    await client.connect(transport);
    // const prompts = await client.listPrompts()
    // console.log('prompts', prompts)
    // // Get a prompt
    // const prompt = await client.getPrompt({
    // 	name: "example-prompt",
    // 	arguments: {
    // 		arg1: "value"
    // 	}
    // })
    // // List resources
    // const resources = await client.listResources()
    // // Read a resource
    // const resource = await client.readResource({
    // 	uri: "file:///example.txt"
    // })
    // // Call a tool
    // const result = await client.callTool({
    // 	name: "example-tool",
    // 	arguments: {
    // 		arg1: "value"
    // 	}
    // })
}
main().catch(console.log);
