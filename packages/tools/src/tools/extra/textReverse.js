export async function toolTextReverse({ params }) {
  const text = String(params?.text ?? '')
  return { ok: true, output: Array.from(text).reverse().join('') }
}
