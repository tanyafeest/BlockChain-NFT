import { validFormats } from '../uploadCompressedMedia/useZipValidator'

export type Entry = {
  file: string
  name?: string
  description?: string
  price?: number
  valid: boolean
  currency?: string
}

const isValidLine = (line: string, numOfValues = 4) => {
  const values = line.split(',')
  if (values.length !== numOfValues) {
    // Invalid line
    return false
  }
  if (!values[0].match(new RegExp(`\\.(${validFormats.join('|')})$`, 'i'))) {
    // Invalid file extension
    return false
  }
  if (typeof values[1] !== 'string' || typeof values[2] !== 'string') {
    // Invalid title or description
    return false
  }
  const parsedPrice = parseFloat(values[3])
  if (isNaN(parsedPrice)) {
    // Invalid price
    return false
  }

  return true
}

const removeQuotes = (str: string) => {
  return str.replace(/^['"](.*)['"]$/g, '$1')
}

const parsePrice = (str: string) => {
  const priceRegex =
    /^(?<price>\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?)(?:\s*(?<currency>.+))?$/
  const priceMatch = priceRegex.exec(str)
  if (priceMatch) {
    const price = parseFloat(priceMatch.groups?.price.replace(',', '') || '')
    const currency = priceMatch.groups?.currency?.trim()
    return { price, currency }
  }
  return null
}

/**
 * Parses a single line of text and extracts the field name and its value.
 *
 * The function takes a line of text as input and matches it against a regular
 * expression to identify the field name (file, name, description, or price)
 * and the value associated with it.
 *
 * The regular expression used in this function includes:
 *  - A named capture group "fieldName" to extract the field name
 *  - The colon delimiter between the field name and value, with optional surrounding whitespace
 *
 * Example:
 *  Input: "name: Beautiful Landscape"
 *  Output: { fieldName: "name", fieldValue: "Beautiful Landscape" }
 *
 */
function parseField(
  line: string
): { fieldName: string; fieldValue: string } | null {
  const colon = '\\s*:\\s*'
  const fieldNameRegex = new RegExp(
    `^(?<fieldName>file|name|description|price)${colon}`,
    'i'
  )
  const fieldNameMatch = fieldNameRegex.exec(line)

  if (fieldNameMatch) {
    const fieldName = fieldNameMatch.groups?.fieldName.toLowerCase() as string
    const fieldValue = line.substring(fieldNameMatch[0].length).trim()
    return { fieldName, fieldValue }
  }

  return null
}

/**
 * Parses the price and currency from a string.
 *
 * The function takes a string as input and matches it against a regular
 * expression to extract the price and currency.
 *
 * The regular expression used in this function includes:
 *  - A named capture group "price" to extract the price value
 *  - A named capture group "currency" to extract the currency value
 *
 */

function parsePriceAndCurrency(fieldValue: string): {
  price: number | undefined
  currency: string | undefined
} {
  const priceRegex =
    /^(?<price>\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?)(?:\s*(?<currency>.+))?$/
  const priceMatch = priceRegex.exec(fieldValue)

  if (priceMatch) {
    const price = parseFloat(priceMatch.groups?.price.replace(',', '') || '')
    const currency = priceMatch.groups?.currency?.trim()

    return { price, currency }
  }

  return { price: undefined, currency: undefined }
}

export function parseTxt(
  fileContent: string
): Record<string, Entry> | undefined {
  const fileData = fileContent.trim()
  const blocks = fileData.split(/(?:\r?\n\s*){2,}/)

  const entries: Record<string, Entry> = {}

  for (const block of blocks) {
    const lines = block.split(/\r?\n/)
    const entry: Partial<Entry> = {}

    for (const line of lines) {
      const parsedField = parseField(line)

      if (parsedField) {
        const { fieldName, fieldValue } = parsedField
        if (fieldName === 'price') {
          const { price, currency } = parsePriceAndCurrency(fieldValue)
          entry.price = price
          entry.currency = currency
        } else {
          entry[fieldName] = fieldValue
        }
      }
    }

    if (entry.file) {
      entries[entry.file] = {
        file: entry.file,
        name: entry.name || undefined,
        description: entry.description || undefined,
        price: entry.price || undefined,
        currency: entry.currency || undefined,
        valid: true,
      }
    } else {
      console.error('Unable to extract file name from invalid block')
    }
  }

  if (Object.keys(entries).length === 0) {
    console.error('Invalid TXT file structure')
    return undefined
  }

  return entries
}

export function parseCsv(csvData: string): Record<string, Entry> {
  const entries: Record<string, Entry> = {}
  const lines = csvData.trim().split('\n')
  const firstLine = lines[0]
  const extensionRegex = new RegExp(`\\.${validFormats.join('|')}$`, 'i')
  const expectedHeaders = ['file', 'name', 'description', 'price']

  const hasHeader = firstLine.match(extensionRegex) === null
  const startIndex = hasHeader ? 1 : 0

  if (hasHeader) {
    const csvHeaders = lines[0]
      .split(',')
      .map((header) => header.trim().toLowerCase())

    //Check that header contains expected fields
    if (!csvHeaders.every((header) => expectedHeaders.includes(header))) {
      console.error('CSV file has incorrect header fields.', csvHeaders)
    }
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()

      const values = line.split(',').map((value) => removeQuotes(value.trim()))
      const valid = isValidLine(line)

      const entry: Entry = {
        file: '',
        name: '',
        description: '',
        price: NaN,
        valid,
      }

      for (const [j, header] of csvHeaders.entries()) {
        try {
          const value = values[j]?.trim()
          console.log('value', value)
          switch (header) {
            case 'file':
              entry.file = value
              break
            case 'name':
              entry.name = value
              break
            case 'description':
              entry.description = value
              break
            case 'price':
              entry.price = parseFloat(value)
              break
          }
        } catch (e) {
          console.error(e)
        }
      }

      entries[entry.file] = entry
    }
    return entries
  }

  // no header
  // assuming the following order: file, name, description, price

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    console.log('line', line)
    const valid = isValidLine(line)

    const values = line.split(',').map((value) => removeQuotes(value.trim()))
    const [fileName, title, description, price] = values.map((v) => v.trim())

    entries[fileName || ''] = {
      file: fileName,
      name: title,
      description,
      price: parseFloat(price),
      valid,
    }
  }

  return entries
}

export function parseJson(jsonData: string): Record<string, Entry> {
  try {
    const data = JSON.parse(jsonData)

    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON file structure. Data should be an array.')
    }

    const entries: Record<string, Entry> = {}

    data.forEach((item) => {
      const { file, name, description, price } = item
      const entry: Entry = {
        file: '',
        name: '',
        description: '',
        price: NaN,
        valid: false,
      }

      if (!file) {
        console.error(`Invalid item in JSON file: ${JSON.stringify(item)}`)
        entries[file] = {
          ...entry,
          file: '',
          valid: false,
        }
        return
      }
      if (!name || !description || !price) {
        console.error(
          `Missing required fields in JSON file: ${JSON.stringify(item)}`
        )
        entries[file] = {
          ...entry,
          file: file,
          valid: false,
        }
        return
      }

      const parsedPrice = parseFloat(price)

      if (Number.isNaN(parsedPrice)) {
        console.error(
          `Invalid price value in JSON file: ${JSON.stringify(item)}`
        )
        entries[file] = {
          ...entry,
          file: file,
          name: name,
          description,
          valid: false,
        }
        return
      }

      entries[file] = {
        file: file,
        name: name,
        description,
        price: parsedPrice,
        valid: true,
      }
    })

    return entries
  } catch (error) {
    console.error(`Error parsing JSON file: ${error}`)
    return {}
  }
}
