import buildings, { type Building } from './data'

export default defineEventHandler(async (event) => {
  const method = event.method

  try {
    // GET
    if (method === 'GET') {
      return buildings
    }

    // POST
    if (method === 'POST') {
      const body = await readBody<Building>(event)

      // Validate required fields
      if (!body.name || !body.address || !body.representative) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Missing required fields: name, address, representative'
        })
      }

      const newBuilding: Building = {
        ...body,
        id: Date.now()
      }

      buildings.push(newBuilding)
      return newBuilding
    }

    // PUT
    if (method === 'PUT') {
      const body = await readBody<Building>(event)

      if (!body.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID is required for update'
        })
      }

      const index = buildings.findIndex(b => {
        // Compare as both number and string
        return Number(b.id) === Number(body.id) || String(b.id) === String(body.id)
      })

      if (index === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: `Building with id ${body.id} not found`
        })
      }

      buildings[index] = { ...body, id: body.id }
      return buildings[index]
    }

    // DELETE
    if (method === 'DELETE') {
      const query = getQuery(event)
      const id = query.id

      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID is required for deletion'
        })
      }

      const index = buildings.findIndex(b => {
        // Compare as both number and string to handle either type
        return Number(b.id) === Number(id) || String(b.id) === String(id)
      })

      if (index === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: `Building with id ${id} not found`
        })
      }

      const deletedBuilding = buildings.splice(index, 1)
      return { 
        success: true, 
        deleted: deletedBuilding[0] 
      }
    }

    // Method not allowed
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  } catch (err) {
    console.error('[API Buildings Error]:', err)
    throw err
  }
})