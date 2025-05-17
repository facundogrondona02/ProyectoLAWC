export async function fetchProductsCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories')
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText)
        }
        const cats = await response.json()
        console.log(cats)
        return cats
    } catch (error) {
        console.error('Error fetching products:', error);
        return error
    }
}