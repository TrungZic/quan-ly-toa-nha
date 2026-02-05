import buildings, { type Building } from './data'
import {format} from 'date-fns'
export default defineEventHandler(async (event) => {
  const method = event.method

  try {
    /* =====================
       GET – DATATABLES SERVER-SIDE
    ===================== */
if (method === 'GET') {
  const query = getQuery(event)
  // console.log('QUERY FROM CLIENT:', getQuery(event))
  const draw = Number(query.draw || 1)
  const start = Number(query.start || 0)
  const length = Number(query.length || 10)
  const search = (query['search[value]'] || '').toString().toLowerCase()

  let filtered = buildings

  if (search) {
    filtered = buildings.filter(b =>
      b.name?.toLowerCase().includes(search) ||
      b.address?.toLowerCase().includes(search) ||
      b.representative?.toLowerCase().includes(search) ||
      b.phone?.includes(search) ||
      b.cccd?.includes(search)
    )
  }

  const pageData = filtered.slice(start, start + length)

  return {
    draw,
    recordsTotal: buildings.length,
    recordsFiltered: filtered.length,
    data: pageData
  }
}

    /* =====================
       POST
    ===================== */
    if (method === 'POST') {
      const body = await readBody<any>(event)

      /* =====================
        POST – DATATABLES LIST
      ===================== */
      if (body.page && body.pageSize) {
        const page = Number(body.page)
        const pageSize = Number(body.pageSize)
        const search = (body.search || '').toLowerCase()

        let filtered = buildings

        if (search) {
          filtered = buildings.filter(b =>
            b.name?.toLowerCase().includes(search) ||
            b.address?.toLowerCase().includes(search) ||
            b.representative?.toLowerCase().includes(search) ||
            b.phone?.includes(search) ||
            b.cccd?.includes(search)
          )
        }

        const start = (page - 1) * pageSize
        const pageData = filtered.slice(start, start + pageSize)

        return {
          recordsTotal: buildings.length,
          recordsFiltered: filtered.length,
          data: pageData
        }
      }

      /* =====================
        POST – CREATE
      ===================== */
      if (!body.name || !body.address || !body.representative) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Missing required fields: name, address, representative'
        })
      }

      const newBuilding: Building = {
        ...body,
        id: Date.now(),
        cccdDate: body.cccdDate
          ? format(new Date(body.cccdDate), 'dd-MM-yyyy')
          : ''
      }

      buildings.push(newBuilding)
      return newBuilding
    }
    /* =====================
       PUT
    ===================== */
    if (method === 'PUT') {
      const body = await readBody<Building>(event)

      if (!body.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID is required for update'
        })
      }

      const index = buildings.findIndex(b =>
        Number(b.id) === Number(body.id)
      )

      if (index === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: `Building with id ${body.id} not found`
        })
      }

      buildings[index] = {
        ...body,
        cccdDate: body.cccdDate || ''
      }
      return buildings[index]
    }

    /* =====================
       DELETE
    ===================== */
    if (method === 'DELETE') {
      const query = getQuery(event)
      const id = query.id

      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID is required for deletion'
        })
      }

      const index = buildings.findIndex(b =>
        Number(b.id) === Number(id)
      )

      if (index === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: `Building with id ${id} not found`
        })
      }

      const deleted = buildings.splice(index, 1)

      return {
        success: true,
        deleted: deleted[0]
      }
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  } catch (err) {
    console.error('[API Buildings Error]:', err)
    throw err
  }
})
