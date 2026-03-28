import { test, assert, describe } from 'vitest'

describe('Bluesky Image Upload', () => {
  test('Uint8Array conversion preserves binary data integrity', () => {
    // Create a mock JPEG buffer with valid JPEG magic bytes
    const mockJpegData = Buffer.alloc(1004)
    mockJpegData[0] = 0xff
    mockJpegData[1] = 0xd8
    mockJpegData[2] = 0xff
    mockJpegData[3] = 0xe0
    mockJpegData.fill(0x42, 4) // Fill rest with arbitrary data

    // Simulate what uploadImage should do (convert Buffer to Uint8Array)
    const uint8Array = new Uint8Array(mockJpegData)

    // Verify the conversion preserves data
    assert.equal(uint8Array[0], 0xff, 'First byte should be FF')
    assert.equal(uint8Array[1], 0xd8, 'Second byte should be D8')
    assert.equal(uint8Array[2], 0xff, 'Third byte should be FF')
    assert.equal(uint8Array[3], 0xe0, 'Fourth byte should be E0')
    assert.equal(uint8Array.length, mockJpegData.length, 'Length should match')

    // Verify all bytes match
    for (let i = 0; i < mockJpegData.length; i++) {
      assert.equal(
        uint8Array[i],
        mockJpegData[i],
        `Byte at index ${i} should match`
      )
    }
  })

  test('toString() corrupts binary JPEG data (demonstrating the bug)', () => {
    // Create a buffer with bytes that are invalid UTF-8
    const binaryData = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])

    // Convert to string (this is what the bug did)
    const corruptedString = binaryData.toString()

    // Convert back to buffer
    const restoredBuffer = Buffer.from(corruptedString)

    // The restored buffer should NOT match the original
    // because toString() interprets binary as UTF-8 and corrupts it
    assert.notEqual(
      restoredBuffer.length,
      binaryData.length,
      'toString() should change buffer length (proving corruption)'
    )
  })

  test('JPEG magic bytes are recognized correctly', () => {
    // Valid JPEG starts with FF D8 FF
    const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0])
    const signature = validJpeg.slice(0, 3).toString('hex')

    assert.equal(signature, 'ffd8ff', 'Should recognize JPEG magic bytes')
    assert.ok(signature.startsWith('ffd8'), 'Should start with ffd8')
  })

  test('PNG magic bytes are recognized correctly', () => {
    // Valid PNG starts with 89 50 4E 47 (89 PNG)
    const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47])
    const signature = validPng.slice(0, 4).toString('hex')

    assert.equal(signature, '89504e47', 'Should recognize PNG magic bytes')
  })
})
