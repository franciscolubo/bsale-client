const URL = 'http://localhost:3001/' // - URL de heroku. ¡PARA CORRER EN LOCAL CAMBIAR POR! 'http://localhost:3001/'

// Funciones en las cuales realizo las peticiones a mi API
let typeProducts = ''
let idCategory
let objOrdered = {}
let search = ''
const getProductsPaginate = (page) => {
    typeProducts = 'getAll'
    let paginate = page || 1
    fetch(URL + `products/paginate/${paginate}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

const getCategories = () => {
    fetch(URL + 'categories', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(category => { // Agrego de forma dinamica las opciones de categorias al select
                categoriesHtml += `
                <option value='${category.id}'>${category.name}</option>
                `
            })
            categories = data
            getProductsPaginate(1)  // Aqui llamo por primera vez a los productos una vez obtenidas las categorias
            $filters.innerHTML = categoriesHtml
        })
        .catch(err => console.log(err))
}

const getProductsForCategory = (category, page) => {
    typeProducts = 'getForCategory'
    idCategory = category
    let pagination = page || 1
    fetch(URL + `products/category/${category}?page=${pagination}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

const getProductsOrdered = (value, page) => {
    typeProducts = 'getOrdered'
    let pagination = page || 1

    objOrdered = {
        order: value[0],
        type: value[1]
    }

    fetch(URL + `products/ordered?order=${objOrdered.order}&type=${objOrdered.type}&page=${pagination}`, { // Envio la informacion del orden por body
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

const getProductsSearch = (value, page) => {
    typeProducts = 'getBySearch'
    search = value
    let pagination = page || 1
    fetch(URL + `products/search/${value}?page=${pagination}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => deployData(data))
        .catch(err => console.log(err))
}

