// Vídeo aula: https://www.youtube.com/watch?v=NUOzYPSNaNk&t=468s

import axios from 'axios'
import { z } from 'zod'
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"

interface CEPResultProps {
	city: '',
	state: '',
	neighborhood: '',
	street: ''
}

interface CNPJProps {
	descricao_situacao_cadastral: string
	razao_social: string
}

interface HolidayProps {
	date: string
	name: string
}

interface CityProps {
	nome: string
}

const api = axios.create({
	baseURL: 'https://brasilapi.com.br/api'
})

const server = new McpServer({
	name: "brasil_api",
	version: "1.0.0",
	capabilities: {
		resources: {},
		tools: {}
	}
})

server.tool(
	"cep",
	"Tool to get data from a zipcode.",
	{
		zipcode: z.string()
	},
	async ({ zipcode }) => {
		const { data } = await api.get<CEPResultProps>(`/cep/v1/${zipcode}`)

		return {
			content: [{
				type: 'text',
				text: `${data.city} - ${data.state}, ${data.neighborhood}, ${data.street}`
			}]
		}
	}
)

server.tool(
	"cnpj",
	"Tool to get data from company's CNPJ.",
	{
		cnpj: z.string()
	},
	async ({ cnpj }) => {
		const numbers = cnpj.match(/\d+/g)?.join('')

		const { data } = await api.get<CNPJProps>(`/cnpj/v1/${numbers}`)

		return {
			content: [{
				type: 'text',
				text: `${data.razao_social} - Situação: ${data.descricao_situacao_cadastral}`
			}]
		}
	}
)

server.tool(
	"holidays",
	"Tool to get Brasil's holiday list by year.",
	{
		year: z.number().min(1900).max(3000)
	},
	async ({ year }) => {
		const { data } = await api.get<HolidayProps[]>(`/feriados/v1/${year}`)

		const output = data.map(item => `${item.date} - ${item.name}`).join('\n')

		return {
			content: [{
				type: 'text',
				text: output
			}]
		}
	}
)

server.tool(
	"city",
	"Tool to get city list from the state initials.",
	{
		uf: z.string().length(2)
	},
	async ({ uf }) => {
		const { data } = await api.get<CityProps>(`/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`)

		return {
			content: [{
				type: 'text',
				text: `${data.nome}`
			}]
		}
	}
)

async function main() {
	const transport = new StdioServerTransport()

	await server.connect(transport)
}

main().catch(e => {
	console.error('Fatal error in main()')
	process.exit(1)
})
