import cron from 'node-cron'
import 'dotenv/config'
import { getDeals, updateDeals } from './bitrix.js'
import { getOrderTask } from './field.js'
const BITRIX_OS = process.env.BITRIX_OS

//Cron function responsible for running the code daily
async function daily() {
    console.log(`Executando sincronização: ${new Date().toLocaleString()}`)
    try {
        await main()
} catch (error) {
    console.error(`Falha na execução agendada.`, error.message)
}
}

cron.schedule('0 8 * * *', () => {
    daily()
}, {
    //Setting timezone to America/Sao_Paulo
    scheduled: true,
    timezone: "America/Sao_Paulo"
})

//Main code
async function main() {
    try {
        console.log("Iniciando integração...")

        const bitrixData = await getDeals()
        const deals = bitrixData.result || []

        if (deals.length === 0) {
            console.log('👌 Nenhum card encontrado para processamento no momento.')
            return
        }

        console.log(`📦 Encontrados ${deals.length} cards para analisar.\n`)

        // for (const deal of deals) {
        for (let i = 0; i < deals.length; i++) {
            const deal = deals[i]
            const dealId = deal.ID 
            const nomeCard = deal.TITLE 
            

            //Field which contains the OS id.

            const osId = deal[`${BITRIX_OS}`]

            console.log(`Analisando "${nomeCard}"`)

            //Skips the process to the next card if the card's SO field is empty. 
            if (!osId) {
                const isLast = i === deals.length - 1
                if (isLast) {
                    console.warn(`⚠️ Campo de OS vazio em ${nomeCard} e não há mais cards na etapa para análise. Encerrando.`)
                    return 
                } else {
                    console.warn(`⚠️ Campo de OS vazio. Pulando para o próximo card. `)
                continue
                }

            }

            console.log(`Buscando OS de ${nomeCard} (ID: ${osId}) no Field Control...`)

            //Calls the function which looks for the OS id AND the task ID. (Order e Tasks)
            const tasksDone = await getOrderTask(osId, nomeCard)

            if (tasksDone && tasksDone.length > 0) {
                console.log(`✅ OS Concluída! Movendo card no Bitrix...`)

                //Updates Bitrix.
                const sucessoUpdate = await updateDeals(dealId, nomeCard)

                if (sucessoUpdate) {
                    console.log (`👍Card ${dealId} atualizado com sucesso.`)
                }
            } else {
                //If the task status isn't marked as "done", informs the user the OS is still not concluded and moves on
                console.log(`⌛OS ${osId} do Card ${nomeCard} ainda não foi concluída no Field.`)
            }
            console.log('-----------------')
        } 

        console.log
        } catch (error) {
            console.error('Erro crítico no fluxo principal:', error.message)
    }
}

main()