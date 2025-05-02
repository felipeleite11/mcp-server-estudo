### Passos para execução do projeto:

- Executar ```yarn build``` para criar o arquivo **build/index.js**.


##### Executando no Claude Desktop:

- Configurar o arquivo **claude_desktop_config.json** da seguinte forma:

```json
{
	"mcpServers": {
		"brasil_api": {
			"command": "node",
			"args": [
				// Caminho até o arquivo resultado do build:
				"C:\\Users\\felip\\OneDrive\\Documentos\\PROJETOS\\NodeReact\\mcp-estudo\\build\\index.js"
			]
		}
	}
}
```

- Fazer perguntas relacionadas ao serviço disponibilizado.