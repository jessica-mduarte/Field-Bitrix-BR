// Dedfining variables, webhook should be located in the .env file.
const BITRIX_WEBHOOK = process.env.BITRIX_WEBHOOK
const BITRIX_OS = process.env.BITRIX_OS // This is the Bitrix OS field.
const STAGE_TARGET = process.env.STAGE_TARGET //This is the stage id which our cards will be moved to.
const CURRENT_STAGE = process.env.CURRENT_STAGE //Stage where our cards who need to be checked are currently at.


// This function will fetch us the Bitrix' deals data.
export async function getDeals() {
    
    //Waits for Bitrix' response before moving on, fetch requests the data.
    const response = await fetch(`${BITRIX_WEBHOOK}/crm.deal.list?filter[CATEGORY_ID]=15&filter[STAGE_ID]=C15:UC_5KSLZ2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'field_bitrix'
        },
        // JSON.stringify converts object.js to JSON.
        body: JSON.stringify({
            filter: {

                "STAGE_ID": `${CURRENT_STAGE}`
            },
            "select": ["ID", `${BITRIX_OS}`, "TITLE"]
        })
    })
    return response.json()
}

// Function responsible for updating deals.
export async function updateDeals(dealId, nomeCard) { //adding params (defined in index.js)

    // We change the URL to /crm.deal.update
    const response = await fetch(`${BITRIX_WEBHOOK}/crm.deal.update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: dealId,
            fields: {
                "STAGE_ID": STAGE_TARGET //Moves the deal to our target stage.
            }
        })
    })

    const data = await response.json()

    if (data.result) {
        console.log(`✅ Negócio ${dealId} movido com sucesso para a etapa "Análise de Conclusão". `)
    } else {
        console.error(`❌ Erro: Não foi possível mover o negócio ${dealId} - ${nomeCard} `, data.error_description)
        process.exit(1) //Ends the process.
    }

    return data
}