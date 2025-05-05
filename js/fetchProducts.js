 export async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products')
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching products:', error);
        return error
    }
}