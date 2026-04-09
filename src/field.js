// Defining variables, field api key should be located in the .env file.
const FIELD_API_KEY = process.env.FIELD_API_KEY
const BASE_URL = "https://carchost.fieldcontrol.com.br"

//Defining Field's mandatory headers. The requests won't go through if we're not using these.
function getHeaders() {
    return {
        'X-Api-Key': FIELD_API_KEY,
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'field-bitrix'
    }
}

// This function will fetch the OS and task IDs.
export async function getOrderTask(osId, nomeCard) {
    try {
        // Looks for the OS id we got from Bitrix.
        const orderResponse = await fetch(`${BASE_URL}/orders?q=identifier:"${osId}"`, {
            headers: getHeaders()
        })
        const orderData = await orderResponse.json()

        //Results in a message warning the user that the OS with the aforementioned id could not be found.
        if (!orderData.items || orderData.items.length === 0) {
            console.warn(`⚠️ OS não encontrada para identificador ${osId}.`)
            return []
        }

        const internalId = orderData.items[0].id //Filtering the internal task id we need.
        console.log(`👀 ID interno localizado: ${internalId}`)

        // Fetchs using the task id to see if the OS was indeed marked as done.
        const taskResponse = await fetch(`${BASE_URL}/orders/${internalId}/tasks`, {
            headers: getHeaders()
        })

        const taskData = await taskResponse.json()

        //Items usually come in arrays when using the field API.
        const tasks = taskData.items || (Array.isArray(taskData) ? taskData: [])

        //Filtering the task ids marked as "done"
        const tasksDone = tasks.filter(t => t.status === "done")

        if (tasksDone.length > 0) {
            console.log(`✅ Sucesso. Encontrada(s) ${tasksDone.length} tarefa(s) concluídas para a OS ${osId}.`)
            return tasksDone
            
        } else {
            console.log(`⌛A OS ${osId} - ${nomeCard} não está concluída.`)
            return []
        }
    } catch (error) {
        console.error(`❌ Erro ao processar OS ${osId} - ${nomeCard}:`, error.message);
        return [];
    }
}